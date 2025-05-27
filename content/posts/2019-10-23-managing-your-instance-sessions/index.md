---
Title: Managing Your Instance Sessions
Slug: managing-your-instance-sessions
date: 2019-10-23T09:50:37+11:00
Categories:
  - AWS
keywords:
  - ec2
  - security
  - aws
Author: Arjen Schwarz
summary: "This is the second entry in a series of three posts about accessing your EC2 instances. The first entry concerned EC2 Instance Connect, and in this post I'll discuss the awkwardly named AWS Systems Manager Session Manager."
---

# Managing Your Instance Sessions

This is the second entry in a series of three posts about accessing your EC2 instances. The [first entry concerned EC2 Instance Connect](/2019/10/connecting-with-ec2-instance-connect), and in this post I'll discuss the awkwardly named AWS Systems Manager Session Manager.

If you're familiar with the Systems Manager group of services, you will know that these services are focused on managing your servers. Both EC2 instances inside AWS, but also virtual or hardware machines located outside of AWS. Session Manager is no exception to this, with the big difference that it aims to give you easy and controlled *interactive* access to your instances.

## How does it work?

While Session Manager has recently had some significant improvements that allow it to do more, the basic functionality remains the ability to create a session on an instance. As with Instance Connect, there are three major ways to connect to an instance using Session Manager: through the Console, through a CLI tool, and using your preferred SSH client.

The big difference with regular SSH connections or even Instance Connect is that the connections will go through the Systems Manager agent. This means you don't need to open a port for your SSH connections. Or for the remote Powershell sessions that Session Manager supports for Windows.

For connecting using SSH, you will need to configure your SSH config (usually found in `$HOME/.ssh/config`) to use SSM as a proxy. This only requires a couple of lines, and you're set:

```Ini
host i-* mi-*
    ProxyCommand sh -c "aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters 'portNumber=%p'"
```

Now if you connect to an instance using its instance-id

```bash
ssh ec2-user@i-0053b2993dc775883
```

what happens in the background is that you run the `ssm start-session` command. In addition to connecting to acting as a proxy, SSM will check your IAM permissions to verify you are allowed access. After this, it will behave like a regular SSH connection and will use that as a verification. In other words, you will need to have an `authorized_keys` set up to access the instance. In case you're wondering, yes, you can provide that key using the `aws ec2-instance-connect send-ssh-public-key` command.

![](/2019/10/managing-your-instance-sessions/sessionmanager-ssh.png)

While the proxy uses the `ssm start-session` command, you can invoke that directly as well. In fact, we can leave a couple of parameters off the call and stick to the default values.

```bash
aws ssm start-session --target i-0053b2993dc775883
```

There is a difference here, however, in that you can't set the user you want to connect as. With the SSH option, you can connect to any user you wish, but with start-session you are limited to one of 3 options. First, if you don't have the `Run As support for Linux instances` (I'm sorry to say that this part of AWS is not known for its snazzy naming) option enabled, you will connect as `ssm-user`. When you enable `Run As`, you can set a default username for people to connect with, which is the second option.

![The Enable Run As option in Session Manager preferences.](/2019/10/managing-your-instance-sessions/run-as-preferences.png)

This username can be overridden at an IAM user or role level by use of a tag. If your user (or the role you assume) is tagged with the key `SSMSessionRunAs`, it will try to connect with the username defined as its value.

![](/2019/10/managing-your-instance-sessions/sessionmanager-cli.png)

The behaviour for connecting through the Console is the same; the only difference is that you click buttons instead of typing.

![](/2019/10/managing-your-instance-sessions/DraggedImage.png)

# How do we set up Session Manager?

The main requirement is the SSM agent. This agent is installed by default on base (so, excluding special AMIs such as ECS-Optimized) Amazon Linux, Ubuntu, and Windows images, but will usually require an update before you can use the latest functionalities. The recommended way to do this update is through the SSM Run Command, using the `AWS-UpdateSSMAgent` document. If you use an AMI that doesn't include the agent, you can [install it manually](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-manual-agent-install.html) as well. And if you want to make sure your agent stays up to date, you can [set up automated updates](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-automatic-updates.html).

The second requirement is the [instance profile you need to attach](https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-instance-profile.html) to your EC2 instance. The minimum requirement for this is the contents of the managed policy `AmazonSSMManagedInstanceCore`. This is a change from a previous policy that grants more access than Systems Manager requires, so it might be a good idea to review your existing instances and update that.

Once the policy is applied, you can use the Console interface for connecting to your instance. If you want to do this from the command line, however, you will need to have the AWS CLI installed. For anything beyond the bare minimum; however, you will also need to [install the Session Manager Plugin for the AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html).

Forgive my slight digression here, but this plugin is the one thing about Session Manager that I really dislike. Practically every other CLI tool provided by AWS is open source so we can see what it's doing. Not only is this plugin only provided as a binary (meaning we don't know what it does), you need to download it from an S3 bucket. S3 buckets don't show who the owner is, so we need to trust on blind faith that AWS controls the bucket for this plugin. I'm confident it is, but if a proper domain can be provided for the Instance Connect CLI, that should be possible here as well.

That leaves us with the preferences we can configure.

![All of the current Session Manager preferences](/2019/10/managing-your-instance-sessions/session-manager-preferences.png)

I briefly mentioned these earlier regarding the `Run As` functionality, but there are other preferences as well. These settings are security-focused and give you a lot of additional benefits. The first is KMS encryption, which lets you add an extra layer of encryption over the connection between your local computer and the instance you're connecting to. Unlike with other services like EBS and S3, Session Manager does not create a default key for you, so you have to create your own in KMS before enabling this feature.

The other two preferences allow you to send the session output to S3 and/or CloudWatch Logs. The session output that gets sent is everything shown on the terminal, so not just the commands you run but the output of those commands as well. As all of this is tied to the user's identity, this is very good for auditing purposes.

For all three of these preferences, you will need to ensure that the instance profile has access to the services, as otherwise you can't open a session. In the case of the KMS encryption, the user initiating the connection will also need to have access to the KMS key, specifically the `kms:GenerateDataKey` permission.

# What else can we do for security?

As with other services, the ability for users to start a session is controlled through IAM. The primary permission is `ssm:StartSession`, but several other Systems Manager permissions are needed as well (as well as the KMS permission mentioned above when using encryption). Under the hood, Session Manager uses SSM Documents and in particular access to `SSM-SessionManagerRunShell` and `AWS-StartSSHSession` are required for SSH sessions to work.

The `ssm:StartSession` permission can be granted to specific instances, or you can use tags in a condition to filter instances that way. Below is an example of doing so for instances with the `Environment` tag set to `Development`.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:StartSession"
            ],
            "Resource": [
                "arn:aws:ec2:*:*:instance/*"
            ],
            "Condition": {
                "StringLike": {
                    "ssm:resourceTag/Environment": [
                        "Development"
                    ]
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ssm:DescribeSessions",
                "ssm:GetConnectionStatus",
                "ssm:DescribeInstanceProperties",
                "ec2:DescribeInstances"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ssm:GetDocument"
            ],
            "Resource": [
                "arn:aws:ssm:*:*:document/SSM-SessionManagerRunShell"
            ],
            "Condition": {
                "BoolIfExists": {
                    "ssm:SessionDocumentAccessCheck": "true"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": [
                "ssm:TerminateSession"
            ],
            "Resource": [
                "arn:aws:ssm:*:*:session/${aws:username}-*"
            ]
        }
    ]
}
```

You may notice an extra `Condition` in the above policy concerning the `ssm:SessionDocumentAccessCheck`. This check is to ensure the user has access when starting a session without explicitly defining a document. In other words, when they access from the Console or omit that argument in a CLI call.

# What are some downsides?

I already had a digression concerning the Session Manager Plugin for the AWS CLI, so I won't go into that again in this section. Luckily (well, not really) some other things can be improved.

The way you can set a default user is somewhat limiting if you have an environment with different types of instances. As mentioned above, if a defined user doesn't exist on the system, you won't be able to connect. As you can't leave the default user blank when enabling `Run as`, you either have to omit a default user or ensure it exists on every instance.

Speaking of the user, you can assume, being able to only ever assume a single user (although potentially a different one per IAM user or role) is a limitation as well. This is clearly aimed at the principle of having your instances do a single thing, but there will be environments where this may not be what you want.

Another limitation is with federated users, and specifically with AWS' own SSO service. Specific to SSO is that you can't assign tags to the roles it creates, which therefore also means you can't set a user for those roles. Another issue is that the above IAM policy doesn't work with federated users. In particular, the part where we limit the TerminateSession to the user who creates it. Session Manager always uses the username as the start of the session name, but you can't access only the username for federated users in an IAM policy. [As the documentation shows](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_variables.html#policy-vars-infotouse), you can only access the full username, including the role name, and there is no way to strip off the role name. If someone has a way to do so, please let me know. In the meantime, the workaround is to allow your users to terminate any session or have a process that terminates sessions after a set amount of time (such as the maximum length of the assumed role).

One other potential issue I've heard brought up is that, due to how it works, Session Manager bypasses any network level security that may have been set up. For example, the requirement to access over a secure VPN connection that requires additional certificates to be installed on the computer making the connection. I suspect in most cases the benefits (especially the auditing) will outweigh this, but it is something to keep in mind.

My other issues are all interface related. Aside from SSM not having a great interface in the Console, for a feature as powerful as this it's a shame that it's so hidden away. I would much rather see it be a part of the Connect button in the EC2 Console.

# What else can Session Manager do?

Session Manager has a couple more tricks up its sleeve that may be relevant for you. As mentioned, Session Manager uses SSM Documents to achieve its work, and this means you can write your own documents for this as well. This way, you can still have an [interactive session](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html#sessions-start-interactive-commands), but one that limits what someone can do. Potential use cases for this might be to limit a developer to the logs of their application. An example implementation of this is provided in the `AWS-PasswordReset` document that only allows for a password to be reset.

The other built-in document, however, is for [port forwarding](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html#sessions-start-port-forwarding). Since its introduction, port forwarding has become my favourite tool for working with Windows instances. In particular, it allows me to forward the RDP port, so I no longer have to open up security groups to be able to log into a Windows instance. You can enable that particular port forwarding with the following command:

```bash
aws ssm start-session --target i-123456789abc \
                       --document-name AWS-StartPortForwardingSession \
                       --parameters '{"portNumber":["3389"],"localPortNumber":["9999"]}'
```

# What's next?

In this post, I took you through the Session Manager and some of its features. I showed on a high level how it works and how this provides a secure way of connecting to an instance. Next week, in the [last post of this series](/2019/10/letting-go-of-your-instances), I will briefly compare Instance Connect and the Session Manager, before diving into some ideas on how to avoid the need to log into your instances in the first place.