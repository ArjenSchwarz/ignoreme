---
title:        "ig.nore.me For 5 Minutes: AWS CodeBuild"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2018-01-28T18:18:54+11:00
categories:   ["AWS", "CI-CD"]
keywords:
  - docker
  - serverless
  - cicd
  - codebuild
  - codepipeline
  - aws
projects: ["ig.nore.me For 5 Minutes"]
slug:         "ig-nore-me-for-5-minutes-aws-codebuild"
Description:  "A 5 minute introduction about AWS CodeBuild. What is it, how does it work, and what are some of the good and less good things about it."
---

A 5 minute introduction about AWS Codebuild. What is it, how does it work, and what are some of the good and less good things about it.

# Video

{{% youtube Qws-ssa9-gA %}}

# Transcript

Hello people, and welcome to todays video. I'll be covering AWS CodeBuild which is part of the AWS CodePipeline CI/CD chain.

What exactly is CodeBuild? In short, CodeBuild allows you to build your code from a variety of locations and then push the resulting artifacts up to an S3 bucket.

CodeBuild does this using Docker containers, and in fact it is very reminiscent of the way that Fargate works. When a build is run, CodeBuild will start an ENI within your VPC and connect a docker container to it. It then logs into this Docker container where it pulls in your source code, and then reads the commands you defined for it in what is called the buildspec. All the logs created by running the buildspec are pushed to CloudWatch and once the run is complete it will upload the artifacts to an S3 bucket. The last thing it then does is delete the container and ENI.

In theory this sounds good, so let's have a look at how it works in practice. I will use one of my projects as a demo. This is written in Go and all we'll try to achieve at this point is to have it correctly build a binary and upload it to S3.

I'll select GitHub as the source, which I've already previously connected, and then use the project from my account. The clone depth we'll keep at one. This is a new feature that speeds things up by not pulling in the complete history of your project. I'll also set a webhook for automatic triggers.
Next is selecting the container to build in. I'll select the standard ones, but unfortunately it seems that this doesn't support a modern version of Go, so instead let's pick the standard Docker Hub version of Go 1.9.
There are no special requirements for the containers, so you can use any Linux container you want.

Next is defining the buildspec, but this will be in the codebase so I'll use the default settings.

As I want an artifact to be created, I'll tell it to push to an S3 bucket. Keep in mind here that your build subnet needs access to it, and that while all buckets are shown in the drop down, you have to use one from the same region.

A service role is required to spin everything up, but I'll let AWS use its default for that. Next is the VPC. I created a new VPC for this using the VPC wizard with public and private subnets, because there is a hard requirement that you build in a private subnet that has NAT enabled.

I'll now tell it to zip up my artifacts but I'll leave the other advanced settings to their defaults.

Then we have a quick review, create the project and then start the build.
When starting the build I can make changes to some of the settings, but I'll leave them as they are.
In the build you can see that it shows the same information we just provided, and once it has spun up things this will include both the actual used subnet and ENI ID.

Unfortunately, it seems that I didn't add my buildspec file yet so let's go do that first.
Looking at the file you can see that it's separated into different sections.
At the top are the phases, there are a total of 4 you can add here that are executed in order. Each phase has a list of commands that are in turn executed in order as well. The second part is the artifacts section, this allows you to define what files should be considered part of the artifact and are eventually uploaded to S3.
One section that I didn't use is the env section, or environment section, which allows you to set variables or even parameter-store objects. And the last optional section is cache that you use to define information about caching data between runs.

Now, let me quickly push this up to GitHub and as we turned on the webhook this should have triggered a build automatically. And indeed it has, as you can see this time everything went fine, and even the commit in GitHub has been updated to show this. And if I now create a pull request, you can see a similar check has taken place there.

The last thing I want to check is that it pushed the artifact up to S3. And here you can see a new folder with the build ID, and in there we find the expected zip file.

So, after running a successful build, let's have a quick review.

First, unlike other build platforms you don't have a good overview of the status of your various projects as you can only see their names.
Secondly, while you can set up monitoring for failed builds, this doesn't allow you to differentiate between projects.

And then there is the buildspec. When you compare what you can do here to other build systems it's very limited. You can only run basic commands, and there is no way to see the details of things like unit tests unless you dig through the CloudWatch logs which aren't really designed for that.

On the plus side, some of these issues are mitigated by using it as part of Code Pipeline. Additionally, it is easy to set up. You can hook it into other CI/CD systems, and the actual builds are cheap and pretty fast. And of course, it's integrated with all the other AWS systems like IAM for security.

I hope this was useful to you, and thank you for watching.
