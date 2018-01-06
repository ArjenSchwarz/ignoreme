---
title:        "ig.nore.me For 5 Minutes: AWS Fargate"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2018-01-06T16:02:50+11:00
categories:   ["AWS"]
slug:         "ig-nore-me-for-5-minutes-aws-fargate"
Description:  "A 5 minute introduction about AWS Fargate. What is it, how does it work, and what are some of the good and less good things about it."
---

A 5 minute introduction about AWS Fargate. What is it, how does it work, and what are some of the good and less good things about it.

# Video

{{% youtube C_WZQWNb03I %}}

# Transcript

Hello people,

Today I'll be talking about Fargate, the new "serverless" container solution from AWS.

Fargate was announced at reinvent 2017, and builds on top of ECS by introducing a new deployment method.

With what is now officially known as EC2 ECS, you start with an EC2 instance that you install Docker and the ECS Agent on. And obviously you're not limited to a single instance either. Once you have this you can then use ECS tasks to deploy your containers on here. What Fargate does is that it makes this part of it disappear so that you're only left with the containers themselves. As you still need to be able to reach your containers, an elastic network interface is added.

Let's see how this works in practice by going through the new quick start. As you can see, this will set up a new Fargate container for us where I will just use the sample app and I'm not changing any of the defaults for this. Next we can select whether we want to put an ALB in front of this, which I don't want right now. Now we can give our cluster a name, which I'll leave at default and you can see that it will create a VPC and subnets to deploy our containers in. This is managed by a CloudFormation template and will be 2 public subnets. A quick review and timejump later and our cluster is created. Now let's go have a look at our new application. To find the address it's reachable by I have to view the service, go to the task and click on the ENI which then finally shows the IP we need. And there we are. One sample app.

So, this was all pretty easy and quick which is obviously meant to highlight the advantages of Fargate. Not only was it easy to set up, but we didn't have to worry about any infrastructure which means that we don't need to manage the instances or  Docker and the ECS agents running on them. In addition, the fact that it uses ECS can be an advantage if you're already used to that.

It's not all wonderful however, as having no infrastructure also means that there are things you can't do. You also have less control over the containers, ECS has its own downsides, and as always a managed service is more expensive than running your own instance. However, with that last point, please keep in mind that you will have less ops work that you need to do.

But let's go through the process of creating a new Fargate service by hand to see where these limitations show up.

For this we start with creating a new task definition, naturally choosing the Fargate option. I'll give it a name and a default role, and you can see that the only option for the network mode is aws VPC. Moving on, there is a limited set of options for CPU and RAM, where not every combination is valid. At a minimum, you need to have twice as much RAM as CPU and each CPU size has its own maximum as well.

The container definition is pretty straightforward, but you can see with the port mapping's that you can't assign a host port. Similarly, there is no option for mounting a volume from the host. Let's move on, and create this definition.

Next, I'll create a new service in the cluster, and you can see that choosing Fargate makes the task placement option disappear. I'll pick the task definition that was just created. On the next page it automatically fills in the VPC that was just created so I'll just pick the subnets and move on to the security group. This is just the regular new or existing security group picker you're probably familiar with. You can also see that a public IP is assigned by default. Unfortunately it's impossible to assign an elastic IP.

We can also assign it to a loadbalancer, but this will need to be created first. As I didn't do that, let's not use one. Now let's create this and we can see that it's running.

Once again I'll go through the process of finding the public IP, which really should just be shown in the task, and we'll see that Jenkins needs a password from the log files. When we created the task, it actually set up Cloudwatch logs group that it pushes everything to so we can just look inside the task itself now to find what we need.

Having looked at some of the advantages and limitations, what is Fargate good for? Right now I would say, mostly for short lived tasks that you would like to run independently from any cluster you might already have. This can be CI/CD runs or even something you call from Lambda functions.

Also keep in mind that right now Fargate is still very new and it's only available in the North Virginia region, so I expect that it's usefulness will grow in the future. The team has already promised Kubernetes integration once EKS arrives in AWS, and I'm looking forward to see where Fargate will go in the future.

Thank you for watching, and I hope this was useful to you.
