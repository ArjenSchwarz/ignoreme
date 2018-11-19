---
title:        "Week 47, 2018 - CloudFormation Drift Detection; Multiple Instance Types in ASGs; Amazon Corretto"
slug:         week-47-2018
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:          2018-11-19T21:20:08+11:00
categories:   
  - "Weekly Notes"
keywords:
  - aws
  - cloudformation
  - autoscaling
  - java
Description:  "Clearly we're in the lead up to re:Invent as AWS has started releasing the big features that didn't make the cut. Today I'll focus on CloudFormation Drift Detection, Multiple Instance Types in AutoScaling Groups, and Amazon Corretto."
---

Clearly we're in the lead up to re:Invent as AWS has started releasing the big features that didn't make the cut. Today I'll focus on CloudFormation Drift Detection, Multiple Instance Types in AutoScaling Groups, and Amazon Corretto.

# CloudFormation Drift Detection

A long awaited feature for CloudFormation has arrived. [Drift Detection](https://aws.amazon.com/blogs/aws/new-cloudformation-drift-detection/) was originally announced at re:Invent 2017, and it spent a lot of time in beta. But now it is available for all of us to use.

But what is it, you might ask[^1]. The concept is straightforward, drift detection allows you to see if changes have been made to your infrastructure outside of CloudFormation. For example, if you deployed a security group through CloudFormation but then manually added a rule to it, drift detection can show you this. It's also pretty easy to use. You select your stack, kick off a drift detection task and once it's finished you can see if it's done.

The fact that it's a manual two-step job is slightly annoying, but it can still be automated. Whether you build a Lambda function for it, or make it part of your CI/CD pipeline, it's all possible. There are however some signs that it's a bit early still as not everything is as great as we'd like it to be. Take the below detected "drift" for example.

![](/weekly-notes/week-47-2018/61EC431C-54AD-495D-A82F-52362B0A823B.jpeg)

This IPv6 address is assigned and managed by AWS. I have no control over it at all, but because CloudFormation stores the information slightly different than the VPC itself does, it's shown as having drifted. There are a number of these false positives, and while I'm sure these bugs will be worked out soon enough it does mean it's hard to set up automation for this at the moment.

# Multiple Instance Types in ASGs

Up until last week, you could only define a single type of instance in an AutoScaling Group. For example, you could say that you wanted to deploy it using on-demand M5 instances or perhaps R4 spot instances. If you wanted multiple types, a mix of on-demand and spot for example, you had to create multiple groups and make them all work together. This could be a lot of work, and increased the chances of errors.

Now, you can [mix and match all of these](https://aws.amazon.com/blogs/aws/new-ec2-auto-scaling-groups-with-multiple-instance-types-purchase-options/) in a single ASG, which will make life a lot easier. As you can still define a preference, this means you can be more sure that you'll have instances available when you need them. One example, specific to the Sydney region, is that this allows you to define M5 instances as your primary type, with a fallback for M4s for the availability zone that doesn't have (many) of these.

# Amazon Corretto

In case you missed it, there has been some [bad blood](https://www.theregister.co.uk/2018/11/12/stay_classy_jassy_gets_sassy_with_larry/) between AWS and Oracle. With Larry Ellison making statements during his Oracle cloud keynote[^2], and a bit of a back and forth afterwards. I don't know if that had any impact on the sudden release of [Amazon Corretto](https://aws.amazon.com/about-aws/whats-new/2018/11/introducing-amazon-corretto/), which is a replacement for Oracle's Java, but it's certainly convenient timing[^3].

For me there isn't much to say about Corretto. I don't like Java as a programming language, and prefer if it doesn't need to be installed. That said, an alternative free version is better than the ever more license encumbered "official" version provided by Oracle. Also, Corretto sounds like a [drink I want to try](https://en.m.wikipedia.org/wiki/Caff%C3%A8_corretto).

[^1]:	Unless you actually read the announcement.

[^2]:	I personally didn't think anything in the event was worth mentioning here.

[^3]:	And the [documentation page](https://docs.aws.amazon.com/corretto/#lang/en_us) is a lot more bare bones than usual for an AWS product.
