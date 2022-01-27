---
title:        Publishing to the Serverless Application Repository
slug:       publishing-to-the-serverless-application-repository
blog:         ig.nore.me
author:       Arjen Schwarz
Date:         2018-03-11T13:44:42+11:00
lastmod:  2018-03-11T20:10:16+11:00
categories:
  - AWS
keywords:
 - serverless
 - aws
Description:  "When it became publicly available, I said I'd give the Serverless Application Repository a try. Yesterday I released my first public application on there, so that makes it an excellent time to write about it."
---

When it became publicly available, I said I'd give the [Serverless Application Repository](https://aws.amazon.com/serverless/serverlessrepo/) a try. Yesterday I released my first public application on there, so that makes it an excellent time to write about it.

<div class='ignoreme-update'>
<strong>Update March 11, 2018:</strong> In a tweet, Salman Paracha, service owner of the SAR responded that the <code>AllowedValues</code> bug I mention in this article is actively being worked on, and also said that improvements to the upgrade process are coming. I have to admit, being able to enable up automatic upgrades will be great when you run this out across organisational accounts.
{{< tweet user="salman_paracha" id="972738484875100160" >}}
</div>

# Packer Cleaner

The application I released is a straightforward one. Packer Cleaner does what it says; it will regularly check if you have any Packer builder instances running for a very long time and then notify an SNS Topic about this. If you manually add some extra IAM permissions, it can even stop or terminate these instances.

The application isn't the primary goal of this article, but if you want to check it out, you can find it on the [Serverless Application Repository](https://serverlessrepo.aws.amazon.com/#/applications/arn:aws:serverlessrepo:us-east-1:613864977396:applications~Packer-Cleaner) and [GitHub](https://github.com/ArjenSchwarz/packer_cleaner). But for now, let's look at the functionalities of SAR.

# Using the template

To deploy an application to the SAR you need two main items: your source code and a SAM template. The source code is entirely up to the developer[^1], but the SAM template needs to follow the rules set by AWS. It didn't take long to see some warnings crop up about this functionality either.

{{< tweet user="8_b1t_chr15" id="967399407040647168" >}}

As Chris mentions, while SAR supports some CloudFormation functionality, it's only a subset of what SAM supports, and that is already less than pure CloudFormation. Let's have a look at what is missing compared to CloudFormation[^2], and why these are things that would be useful.

## Conditionals

As I just [wrote about these](/2018/02/conditionals-in-cloudformation/) a couple of weeks ago, this was something I immediately noticed. To be clear, this is a limitation of SAM and based on [conversations on GitHub](https://github.com/awslabs/serverless-application-model/issues/142) it is actively being worked on.

One place where my application can use this is with the SNS Topic. The application will automatically create a topic, but it would have been nice to give users the option to provide one instead.

## Non-shortlisted resources

There is a [short list of resources](https://docs.aws.amazon.com/serverlessrepo/latest/devguide/using-aws-sam.html#supported-resources-for-serverlessrepo) that can be created by SAR. This list contains a lot of the standard functionalities, but it's a far cry from the full experience. Some of the missing ones can still be created automatically through others, such as the CloudWatch Schedule trigger I use which is part of the `AWS::Serverless::Function` resource.

Not having access to anything but what AWS has defined as worthy of inclusions will hobble some applications and likely prevent other applications from ever being released.

## Custom IAM Permissions

SAR applications can only use [specific predefined IAM policies](https://docs.aws.amazon.com/serverlessrepo/latest/devguide/using-aws-sam.html#serverlessrepo-policy-templates). The way it works is quite nice, but it means that Packer Cleaner can't come with the permissions it needs to be truly useful. Based on the various permissions that are allowed, and what they can do, this seems to be for security reasons.

It's not possible to conduct destructive actions on the environment, and all permissions are limited to within the account it is deployed. Which all makes sense from a security perspective for public applications, but it would have been nice if internally shared ones do allow this.

## Allowed Values

This one came as a total surprise to me and makes no sense at all. When I tested my SAM template, it had `AllowedValues` set for how to deal with instances it found. As Packer Cleaner only supports three options, it makes sense to limit it to that. However, SAR broke over this and threw some internal exception when I tried to deploy the application. Let's be clear, it had successfully accepted the SAM template and made the application available, but it failed when trying to install it. Which indicates to me that the failure is a bug.

![](/2018/03/publishing-to-the-serverless-application-repository/Lambda_Management_Console.png)

# Publishing the application

The interface works quite well. As this was the first time I worked on this, I did everything manually through the Console, except for running the `aws cloudformation package` command. Finding the interface wasn't easy though. It doesn't seem to be accessible from the AWS Console, so I used the link found in [the documentation](https://docs.aws.amazon.com/serverlessrepo/latest/devguide/serverless-app-publishing-applications.html#publishing-application-through-aws-console).

Adding an application is pretty straightforward, and you are guided through the interface well enough. Some things don't quite match the documentation, but they're improvements such as the ability to use Markdown for the README. AWS isn't exactly best known for its user interfaces, but they did a decent job here.

The name you give the application can't contain spaces though, which is a silly constraint caused by their requirement of it being part of the ARN. It makes application names less readable in a manner that can easily be solved by using a slug.

Of course, my initial comments regarding issues with the search[^3] in the actual repository still stand. But once you deploy an application, it does what you'd expect it to. Or at least, Packer Cleaner does as I can’t speak for any other application in there.

Lastly, while it's quite easy to make an application public using a toggle slider, sharing it with specific accounts can only be done using the CLI's `aws serverlessrepo put-application-policy` command.

# How about upgrades?

As I released updates while building this, I got to try out the "upgrade" process as well. Which isn't much of a process. There are no notifications that a new version is available, and upgrading consists of going into the repository to do a fresh install through the Create Function -\> Serverless Application Repository workflow[^4]. This works perfectly fine, but it doesn't show that you've already got the function installed until you run the install at which point it will show you the same information about the resources as when you do an actual install.

 ![](/2018/03/publishing-to-the-serverless-application-repository/Lambda_Management_Console-1.png)

Running an update on an up-to-date stack, without changing parameters, gives an unclear message about failing.

![](/2018/03/publishing-to-the-serverless-application-repository/Lambda_Management_Console-2.png)

After checking the actual changeset it tries to execute, you can see that it just complains about there being no updates to perform. You'd think AWS can parse that error and display a more useful message.

In addition, there is no version history of any kind as a consumer of the application. You can't see which version you have installed and you can only see the latest available version in the repository, never mind having an overview of what has changed.

# So, verdict?

While it looks like I mostly have complaints, I still think there is a lot of potential here. In many ways though, it feels like an unfinished product. There are a lot of small annoyances and quirks that should have been discovered and fixed before it became generally available.

So far, some of the strange choices seem to be limiting both how many people are using it, as well as what you can deploy. If some of these things are improved, I can see it becoming a useful tool at the very least to manage some functions within an organisation. I just hope that AWS keeps working on this to make the experience better, as otherwise it will be something people play with for a bit and then never touch again.

[^1]:	As long as it works on Lambda.

[^2]:	Or at least the parts I ran into

[^3]:	Although searching for packer now does give at least one relevant result.

[^4]:	Which is logically up there with Start -\> Shut Down.
