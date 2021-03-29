---
Title: AWS - Session Manager and ECS Exec
slug: 3
date: 2021-03-29T13:34:55+11:00
author: Arjen Schwarz
Categories:
  - AWS
  - Opinion
Tags:
  - aws
  - session-manager
  - ecs
summary: "ECS Exec is a new feature for ECS that I think sounds really interesting, so I want to talk about it for a bit. And as it's basically Session Manager for ECS, I'll also give a quick intro to Session Manager."
FrameEmbed: "https://share.transistor.fm/e/9eae2732"
ogimage: https://ig.nore.me/img/arjen-without-sleep.jpg
---

ECS Exec is a new feature for ECS that I think sounds really interesting, so I want to talk about it for a bit. And as it's basically Session Manager for ECS, I'll also give a quick intro to Session Manager. Please be aware that several times I misspoke and called Session Manager Systems Manager.

## Links

* [NEW – Using Amazon ECS Exec to access your containers on AWS Fargate and Amazon EC2 | Containers](https://aws.amazon.com/blogs/containers/new-using-amazon-ecs-exec-access-your-containers-fargate-ec2/)
* [AWS Systems Manager Session Manager - AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
* [AWS Systems Manager Run Command - AWS Systems Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html)
* [Managing your instance sessions - CMD Solutions | Simplify Complexity](https://www.cmdsolutions.com.au/managing-your-instance-sessions/)
* [Serverless Bastions on Demand | ig.nore.me](https://ig.nore.me/2018/07/serverless-bastions-on-demand/) (using Fargate as a bastion, before Session Manager or ECS Exec existed)
* [Using a Fargate Bastion for EKS Access | ig.nore.me](https://ig.nore.me/2019/03/using-a-fargate-bastion-for-eks-access/) (using a Fargate bastion for making calls to other services, before ECS Exec existed)

## Transcript

Hello and welcome to Arjen Without Sleep, a podcast where I, Arjen, try to make a little girl fall asleep by talking about the cloud. Today we'll take a subject related to a new feature that was announced just a couple days before I'm recording this. Which is ECS Exec.

To understand that though, let's have a look at a different service first. Which is the wonderfully named AWS Systems Manager Session Manager. Which is definitely one time manager too often in the name. As a well-raised little girl, you obviously know that you should design your environment in such a way that you never need to log in to your instances. Either by building it all in Serverless, or by making sure there is no need to actually log into your instances.

However, unfortunately reality often means that you don't have a say about this. You may be dealing with a legacy architecture, you can be dealing with things that just require you to log in once in a while. Whether because of an application, or just commands that need to be run, or something.

Now, the other thing that you know, but our listeners might not, while commonly the old way to do this was to use something like SSH to SSH into your instance and than you'd have access and all of that. However, within AWS there is a cleaner way to do this and that is using Session Manager.

So, with Session Manager, and I'm not going to call it's by it's full name again, because it's a silly name. With Session Manager you install the SSM agent. SSM basically is the old name for Systems Manager and that is still in use in API calls as well as in the name of an agent like this. You install the agent, and make sure that you add the correct Instance Profile to your instance, and once you've done that you can use a number of Systems Manager functions.

This includes the Run Command, which allows you to remotely execute commands and get a response back, but also Session Manager. Which allows you to log into systems. Now with Systems Manager *(misspoken as it should be Session Manager)* when it first came out, it was a bit limited but already super useful. And since then it's been improved.

So, nowadays, you can set it up so that when somebody logs in Session Manager that they will automatically get assigned the right user, they get a custom prompt, custom shell, and all those things. And everything they do, and everything that shows up on the screen will get, can get, logged to an S3 bucket. So you have full auditability over what happens on there. And let's be honest, that's pretty cool.

Unlike with SSH, where everybody most likely will be using the same custom key. Because when you create a new EC2 Instance you get the option to assign a public key to *(baby sounds)*. Don't get upset by that. I know, I know. You know that you shouldn't assign a key when you spin up an Instance because you can use Session Manager instead. I'm just trying to explain all the options.

Now, when spin up an Instance, you can assign a public key. The way that this happens is that you then have the one key that gives you access to - if you use Amazon Linux - the ec2-user but different distros can give you different users. But it's always a single user and as it's SSH you don't actually know who is making the call.

So with Session Manager you can do that. Because authentication goes through IAM you have full control over who gets to log in and as I mentioned earlier you can see who did it. *(baby sounds and short intermission)*

So yeah, you have full control over all of that. Now of course, what about Windows? Because all I mentioned was Linux. Now, if you have to use Windows for some reason, then first, Session Manager works perfectly well to give you access to a Powershell shell. So as long as you don't need to use the GUI, you are completely golden.

That said, one of those things I mentioned where it got better over time is that it added port forwarding. Which means that you can actually do port forwarding over Session Manager and then RDP to your local on the port you forwarded it to and you're in without the need for Direct Connect, VPN, or bastion hosts, or anything like that.

Because obviously that is the other thing with SSH: you will need some connection to the instance. Either through a VPN to your private subnet, or through a bastion host that you have running in your public subnet and that you can then SSH into. And from there you can SSH into all the other servers. Which is a valid approach if you don't have any other options. If you do have other options, it is not exactly the best thing you can do.

However, that then brings us to this new release I mentioned: ECS Exec. Which through some pretty cool - I'd almost call it dark magic - what happens there is it allows you to do the same thing, but for your containers. So, if you're using containers, you're probably familiar with Docker Exec which allows you to use your Docker agent to execute into a container. If you need to use more than a single command issue `docker exec -ti /bin/sh` or `/bin/bash` if you happen to have bash in your container. And a similar thing you can do with your Kubernetes using `kubectl exec`. So in a way that was missing from ECS.

Now, technically speaking it might have been possible to use Systems Manager *(misspoken)* to log into the Instances that your containers run on and then do a `docker exec` from there. Which is a bit annoying thing and again misses the auditability of who did that and what happened. And of course, that excludes one of my favourite services: Fargate. *(baby sounds)* Yes, yay for Fargate. Because that doesn't have an Instance that you can connect to. So if you run EKS you could run `kubectl exec` to do a similar thing, but you couldn't do that for ECS until just recently.

And in many ways, this works the same as the regular Systems Manager *(yes, misspoken again)*. So, permissions are managed through IAM, you don't need an SSH connection and you can just use the AWS CLI and its APIs to run this. Well, you don't have to use the AWS CLI, you can also use Copilot, which is the ECS specific CLI tool.

But I referred to black magic earlier, and that is basically a bit of how they implemented this. Because what actually happens when you do an `exec` is that at that time the ECS or Fargate agent - which is the controlling mechanism of your cluster - it will actually bind mount the SSM agent into your container. So what this means is that it will make it appear from outside of your container. And suddenly it is running in your container and you can access it.

Now, I haven't played around with it much myself yet. As I said, I'm recording this the day after it's been announced. So, as far as I know, it doesn't support things like port forwarding yet. In fact, from what I read the only thing it really does is similar to `docker exec -ti` so you will get a bash but can't use it yet for Run Command type things. So you have to run into the system and run things manually there.

Now, a lot of this stuff is obviously good fun and you can use it to bug fix if you really need to. Generally speaking though of course, you would try to avoid making that necessary. On the other hand, what this does offer you and that is something I like, is say you do need a temporary bastion in your systems. Because you want to test out some commands within your network. What you can now do is spin up a Fargate instance and ECS exec into that, run things from there, and then kill it when you're done.

You don't need to worry about spinning up a whole instance, you don't need to have anything special running on your container. You don't need to have it open, you don't need to have SSH open for it. You could go for a simple Alpine container for example, maybe install cURL and some other debug tools or whatever you need. Have that image lying around and when you need to, spin it up, ECS Exec into it and you're done. No need to worry about it. And that is a use case I think is interesting.

However, I feel like you are less interested in that. Now, sleeping? Or just pretending to sleep? So, I will just put you back in bed and I wish everybody else a good night.
