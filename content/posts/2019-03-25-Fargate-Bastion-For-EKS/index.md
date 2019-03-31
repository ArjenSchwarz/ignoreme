---
title:        Using a Fargate Bastion for EKS Access
slug:         using-a-fargate-bastion-for-eks-access
blog:         ig.nore.me
author:       Arjen Schwarz
Date:         2019-03-26T08:12:58+11:00
categories:
  - AWS
keywords:
  - kubernetes
  - fargate
  - docker
  - ecs
  - lambda
Description:  "Last week AWS made it so you can set your EKS API endpoint to private. This post describes how you can use a Fargate bastion to access a private EKS API endpoint."
ogimage: https://ig.nore.me/2019/03/using-a-fargate-bastion-for-eks-access/EKS-Bastion-Flow.png
---

Last week AWS made it so you can set your [EKS API endpoint to private](https://aws.amazon.com/about-aws/whats-new/2019/03/amazon-eks-introduces-kubernetes-api-server-endpoint-access-cont/). This means your nodes will no longer need to go over the public internet to access it and is in general a good security improvement. However, once you disable public access that also means any `kubectl` commands you want to use can only be run internally.

This isn’t a big issue if you have some sort of connection to the VPC it runs in, whether that is Direct Connect or some sort of VPN. But if you don’t have that, and still want to make use of this security improvement, you may need a different way of doing so. So let’s see what [AWS recommends for that](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html#private-access).

![](/2019/03/using-a-fargate-bastion-for-eks-access/DraggedImage.png)

Really? A bastion host? After all this work to get rid of those things, they propose to once again manage and maintain a dedicated machine for logging into your environment? I could rant about this for longer, but you probably got my point. Now, if only there was an idea floating around out there that will let you spin up [Fargate bastions on demand](/2018/07/serverless-bastions-on-demand/)…

## Let’s see the better way

So, what does this look like when we use a Fargate bastion?

![](/2019/03/using-a-fargate-bastion-for-eks-access/EKS-Bastion-Flow.png)

The diagram is slightly abstracted[^1], but shows what happens. We make a `curl` call to the Lambda function, which creates a security group that can be accessed from our IP and the ControlPlane security group is opened up to that security group. The Lambda function then spins up the Fargate task and when we access that through SSH we can access our cluster.

But let’s use a demo to see what it’s actually like[^2]. I’ll start with quickly creating an EKS cluster. From my laptop I’ll use [eksctl](https://eksctl.io)[^3] to run up a basic cluster using the below config file

```yaml
apiVersion: eksctl.io/v1alpha4
kind: ClusterConfig

metadata:
  name: playground
  region: us-east-1

nodeGroups:
  - name: ng-1
    instanceType: t3.medium
    desiredCapacity: 3
    minSize: 1
    maxSize: 5
    iam:
      withAddonPolicies:
        autoScaler: true
```

and a single command.

```bash
➜ eksctl create cluster -f playground.yml
```

We then wait a while for this to finish creating and deploying its CloudFormation templates. One of the nice little things with `eksctl` is that it will immediately set up your kubeconfig to authenticate against the cluster so we can see that it’s all working:

```bash
➜ kubectl get nodes
NAME                             STATUS   ROLES    AGE   VERSION
ip-192-168-13-206.ec2.internal   Ready    <none>   5m    v1.11.5
ip-192-168-62-128.ec2.internal   Ready    <none>   5m    v1.11.5
ip-192-168-68-94.ec2.internal    Ready    <none>   5m    v1.11.5
```

As I run this from my laptop, this obviously shows that the EKS cluster still has access over the public API endpoint. That is not what we want, but as `eksctl` uses CloudFormation under the hood it’s also unavoidable. And let's be serious, you didn’t really think this would be available in CloudFormation already, did you? Anyway, switching it over is a simple API command:

```bash
➜ aws eks update-cluster-config --name playground --resources-vpc-config endpointPublicAccess=false,endpointPrivateAccess=true
```

Running the same command then shows the endpoint is closed off for us.

```bash
➜ kubectl get nodes
Unable to connect to the server: dial tcp 54.87.67.40:443: i/o timeout
```

So it’s time to start using the bastion. For this example I had `eksctl` create a new VPC, so we’ll first want to deploy the bastion there[^4]:

```bash
➜ aws cloudformation deploy --template-file packaged-bastion.yml --stack-name bastion-functions --capabilities CAPABILITY_IAM --parameter-overrides BastionVpc=vpc-0f84a6077982ac08e BastionSubnets=subnet-09f7b5e0537bd1026 BastionCluster=fargatetests CleanupSchedule="cron(0 14 * * ? *)"
```

and then of course we’ll invoke it:

```bash
➜ curl -X POST https://qcxt14hqzb.execute-api.us-east-1.amazonaws.com/Prod\?user\=arjen\&cluster\=playground
54.174.27.114
```

If you’ve used the original bastion, you’ll notice that the only difference here is that I’ve added a cluster parameter to indicate the cluster. Also, I previously built the container, the details for that are in the next section..

Now what we need to do is log into the bastion:

```bash
➜ ssh root@54.174.27.114
Your region has been set to us-east-1
Please load your AWS credentials (e.g. using 'export AWS_ACCESS_KEY_ID=youraccess; export AWS_SECRET_ACCESS_KEY=yoursecret')
Then run 'aws eks update-kubeconfig --name cluster_name' to configure your kube config
-bash-4.2#
```

The text is just to make life easier, but you will notice that it requires you to provide your credentials for the cluster. Considering that you’ll need to set up some kind of RBAC access, I decided against building anything into the container[^5].

So, the final test, do we have access from here?

```bash
-bash-4.2# export AWS_ACCESS_KEY_ID=myaccess; export AWS_SECRET_ACCESS_KEY=mysecret
-bash-4.2# aws eks update-kubeconfig --name playground
Added new context arn:aws:eks:us-east-1:myaccount:cluster/playground to /root/.kube/config
-bash-4.2# kubectl get nodes
NAME                             STATUS    ROLES     AGE  VERSION
ip-192-168-13-206.ec2.internal   Ready     <none>    1h   v1.11.5
ip-192-168-62-128.ec2.internal   Ready     <none>    1h   v1.11.5
ip-192-168-68-94.ec2.internal    Ready     <none>    1h   v1.11.5
```

Yes we do! Great, it works. Let’s delete it again and have a look under the hood.

```bash
➜ curl -X DELETE https://qcxt14hqzb.execute-api.us-east-1.amazonaws.com/Prod\?user\=arjen
```

## The container

When I built the original bastion container it didn’t need much as it really only served as an entry point from where you access the EC2 instances themselves. Of course, the introduction of the[^6] Systems Manager Session Manager obviated the need for that functionality, but to make it work with EKS we definitely need a more capable container.

As I didn't feel like spending hours dealing with dependency management, I went for the easy route and changed the base image over to Amazon Linux 2. For fairly obvious reasons this contains a number of things I need, and the rest is easy to install. One warning, don't try to install the `AWS CLI` with `yum` as that will give you an older version.

```Dockerfile
FROM amazonlinux:2
EXPOSE 22
ARG EKS_K8S_VERSION=1.11.5
RUN yum install -y python3 python3-pip tar openssh-server vim-minimal bash-completion jq && yum clean all && pip3 install awscli
RUN ssh-keygen -A && \
    curl -o /usr/local/bin/kubectl https://amazon-eks.s3-us-west-2.amazonaws.com/$EKS_K8S_VERSION/2018-12-06/bin/linux/amd64/kubectl && \
    chmod +x /usr/local/bin/kubectl && \
    curl -o /usr/local/bin/aws-iam-authenticator https://amazon-eks.s3-us-west-2.amazonaws.com/$EKS_K8S_VERSION/2018-12-06/bin/linux/amd64/aws-iam-authenticator && \
    chmod +x /usr/local/bin/aws-iam-authenticator && \
    curl --silent --location "https://github.com/weaveworks/eksctl/releases/download/latest_release/eksctl_linux_amd64.tar.gz" | tar xz -C /usr/local/bin/ && \
    mkdir /root/.ssh
COPY ./.bash_profile /root/.bash_profile
COPY ./publickey /root/.ssh/authorized_keys
RUN chmod 0600 /root/.ssh/authorized_keys
CMD /usr/sbin/sshd -D -e
```

The above should be fairly understandable. I’ve separated the package installers and other commands into two separate `RUN` commands, mostly for my own benefit. Most of the installed tools shouldn’t be a surprise, with the possible exception of bash-completion, which is mostly a convenience thing.

The tools installed are the `AWS CLI`, `kubectl`, `eksctl`, and the `aws-iam-authenticator` which is required for accessing EKS using IAM credentials. In addition I’ve included a `.bash_profile` file to ensure the autocompletion for the `AWS CLI`, `kubectl`, and `eksctl` is enabled. Finally, it shows you the echo statements for the connection and authenticatio information we saw in the demo.

```bash
# Enable bash completion
source /usr/share/bash-completion/bash_completion

# Enable kubectl autocompletion
source <(kubectl completion bash)

# Enable eksctl autocompletion
source <(eksctl completion bash)

# Enable AWS CLI autocompletion
complete -C '/usr/local/bin/aws_completer' aws

region=$(curl --silent 169.254.170.2/v2/metadata | jq -r .TaskARN | cut -d: -f4)
export AWS_DEFAULT_REGION=${region}
export AWS_REGION=${region}

echo "Your region has been set to ${region}"

echo "Please load your AWS credentials (e.g. using 'export AWS_ACCESS_KEY_ID=youraccess; export AWS_SECRET_ACCESS_KEY=yoursecret')"
echo "Then run 'aws eks update-kubeconfig --name cluster_name' to configure your kube config"
```

All of this provides the things needed to manage an EKS cluster. No, I didn’t include Helm or a number of other tools, feel free to expand on this yourself.

## Lambda changes

The biggest changes were in the container, but as mentioned I also needed to set up (and delete) an ingress route from the bastion container to the ControlPlane security group. I’ll only point out the changes to the Lambda functions, if you want more details please have a look at the source code[^7].

```python
# Grant ControlPlaneSecurityGroup access from new securitygroup
if  cluster != "":
    groups = ec2.describe_security_groups(
        Filters=[
            {'Name': 'vpc-id', 'Values': [vpc]},
            {'Name': 'tag:aws:cloudformation:logical-id', 'Values': ['ControlPlaneSecurityGroup']},
            {'Name': 'tag:eksctl.cluster.k8s.io/v1alpha1/cluster-name', 'Values': [cluster]}
        ]
    )

    controlplanesg = groups['SecurityGroups'][0]['GroupId']
    ec2.authorize_security_group_ingress(
        IpPermissions=[
            {'IpProtocol': 'tcp',
            'FromPort': 443,
            'ToPort': 443,
            'UserIdGroupPairs': [{ 'GroupId': sg }] }],
        GroupId=controlplanesg,
    )
```

After having retrieved the cluster name from the request parameters, I use the knowledge that `eksctl` always uses the same logical-id in the CloudFormation template to find out the control plane security group[^8]. The `cluster-name` tag is added by EKS, so that is always present and allows us to differentiate from other clusters.

Cleanup in the delete functions is similar:

```python
refgroups = ec2.describe_security_groups(
            Filters=[
                {'Name': 'vpc-id', 'Values': [vpc]},
                {'Name': 'ip-permission.group-id', 'Values': [group['GroupId']]}
            ]
        )
        for refgroup in refgroups['SecurityGroups']:
            ec2.revoke_security_group_ingress(
                IpPermissions=[
                    {'IpProtocol': 'tcp',
                    'FromPort': 443,
                    'ToPort': 443,
                    'UserIdGroupPairs': [{ 'GroupId': group['GroupId'] }] }],
                GroupId=refgroup['GroupId'],
            )
```

The delete functions also require the IAM permission `ec2:RevokeSecurityGroupIngress` to ensure they can actually delete that ingress rule.

## In conclusion

In truth, I mostly wrote this because I was disappointed by AWS that they mentioned an EC2 bastion as the solution for accessing your cluster. I’m not sure if anyone will find it useful, but it taught me a couple of things so I figure it was time well-spent. Right now the code is present in the `eks-bastion` branch of my original [fargate-bastion repo](https://github.com/ArjenSchwarz/fargate-bastion/tree/eks-bastion). I’ll probably clean it up a bit more and might move it into its own repo afterwards[^9].

That said, I’d love some feedback on this. Do you think this is a usable solution? What do you think can be better, and what tools that you use should I have included?

[^1]:	See the [original post](/2018/07/serverless-bastions-on-demand/) for how everything ties together

[^2]:	I’d say, feel free to follow along but there will be a point where you’ll need the bastion code.

[^3]:	Which is a really nice wrapper around common EKS commands that makes life with EKS a lot more pleasant.

[^4]:	Usually I'd suggest having a dedicated subnet or even a VPC connected through peering or Transit Gateway, but for a demo this works fine.

[^5]:	I also couldn’t think of anything that will keep your credentials completely safe.

[^6]:	ridiculously named

[^7]:	I notice that I promised a closer look at the code in the original article about the bastion. As shortly after that the session manager was released, I honestly forgot about that.

[^8]:	If you don’t use `eksctl`, just update this to reflect your own.

[^9]:	And maybe finally provide those promised follow up posts.