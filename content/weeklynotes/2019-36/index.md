---
title:        "Week 36, 2019 - Amazon Forecast; Session Manager Documents"
slug:         week-36-2019
blog:         ig.nore.me
author:       Arjen Schwarz
Date:          2019-09-02T20:55:56+10:00
categories:
  - "Weekly Notes"
keywords:
  - sessionmanager
  - forecast
Description:  "Amazon Forecast is released, and a couple of new features show how Session Manager works and suddenly make it look like a completely different service."
---

Amazon Forecast is released, and a couple of new features show how Session Manager works and suddenly make it look like a completely different service.

# Amazon Forecast

Continuing the recent trend of re:Invent announcements becoming available, [Amazon Forecast](https://aws.amazon.com/blogs/aws/amazon-forecast-now-generally-available/) is now GA. Looking at the name, Forecast's purpose is pretty clear: predicting values based on past results.

At the basic level[^1] the idea is simple; you feed forecast a set of historical data (for example, how much of a product you sold last year), add some extra information (such as public holidays), and it will tell you how much you're likely to sell this month.

Like Amazon Personalize, Forecast is one of the high-level AI services that aim to make it easy to get useful data out of an API. This means you don't need to do a lot of work building the actual model, but that might make it more important that your data is cleaned up properly.

# Session Manager Documents

Everyone's favourite named service gained a couple of interesting features: port forwarding and interactive commands. In a way though, the really interesting part here is how interacting with the Session Manager has changed. First a quick look at the new features.

[Port forwarding](https://aws.amazon.com/blogs/aws/new-port-forwarding-using-aws-system-manager-sessions-manager/) allows you to forward ports from the connected instance to your local machine. If you're familiar with the concept, you may have your own ideas about where this might be useful. If you're not as familiar, what this allows you to do is to map a port on the instance to your local machine. As an example, you could forward the port Nginx listens on so you can quickly verify if an issue is caused by the ELB in front of the instance without needing to open up the instance to your IP.

[Interactive commands](https://aws.amazon.com/about-aws/whats-new/2019/08/now-use-session-manager-to-interactively-run-individual-commands-on-instances/) on the other hand allows you to limit the exact interaction between a user and an instance to specific commands. It does so by providing an SSM Document, with the AWS provided example being the ability to change a password[^2]. How useful this is depends on your situation, but more importantly is how this highlights a complete change to how Session Manager works.

Looking back, Session Manager started out very basic as a mostly Console tool that gave you access to the CLI of an instance. But after these releases we suddenly have a far more powerful way of working as it's now become obvious[^3] that it uses SSM Documents under the hood. These are similar to the Documents you may have already used for the SSM Run Command.

The biggest difference with these new Documents (of type `Session`) is that, unlike SSM Run Commands, they create interactive sessions. The original way of connecting to an instance is using the document `SSM-SessionManagerRunShell` (or `AWS-StartSSHSession` as it seems to use the two interchangeably for Linux instances). Similarly, for port forwarding it uses `AWS-StartPortForwardingSession` and the password reset example has `AWS-PasswordReset`.

As far as I can tell right now, all of this is currently only available from the CLI but as that is the logical way to interact for this that's not an issue. These new features do require you to have the [Session Manager plugin for the AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html) installed. Again, not really a problem, except for the little fact that they couldn't bother hosting it somewhere that can be validated. S3 buckets don't show who owns them and as this binary is between my keyboard and the instance I want to interact with that doesn't give me warm fuzzy feelings.

The fact that it uses Documents for all of this also explains why it falls under Systems Manager and why [Instance Connect was added recently](/weekly-notes/week-29-2019/).

# Ambassador Corner

Last week was the first Global APN Ambassador Summit. This took place in Seattle and was very interesting and fun. Unfortunately I can't talk about any details, but one of my fellow ambassadors has a good high level write up spread out over [3](https://cloudbanshee.com/blog/aws-apn-ambassador-global-summit-explained) [different](https://cloudbanshee.com/blog/aws-apn-ambassador-global-summit-day-1) [posts](https://cloudbanshee.com/blog/aws-apn-ambassador-global-summit-day-2).
The one thing I do want to point out is that I was awarded the title of top ambassador for the APAC region[^4]. Which I have to say is pretty cool.

![](/weekly-notes/week-36-2019/47182D77-FEF3-44AE-88C5-7EAED6385F92.jpeg)

In the meantime, people wrote about other things as well:

* [Using Serverless Framework and AWS to map Near-Realtime Positions of Trains ](https://nivleshc.wordpress.com/2019/08/26/using-serverless-framework-and-aws-to-map-near-realtime-positions-of-trains/)
* [Why the Launch of AWS Infrastructure in Israel is a Game Changer for Enterprise Digital Transformation](https://www.allcloud.io/blog/why-the-launch-of-aws-infrastructure-in-israel-is-a-game-changer-for-enterprise-digital-transformation/)
* [RedShift Unload to S3 With Partitions - Stored Procedure Way](https://thedataguy.in/redshift-unload-to-s3-with-partitions-stored-procedure-way/)

[^1]:	Obviously it's a bit more involved than just this.

[^2]:	Which will need KMS encryption to be set up for your sessions before it will work. Yet another feature that was introduced not that long ago.

[^3]:	At least to me, maybe you noticed this a long time ago.

[^4]:	The misspelling of my name in this slide seems to happen everywhere in the ambassador program, but I see it as a way to confuse LinkedIn recruiter emails.