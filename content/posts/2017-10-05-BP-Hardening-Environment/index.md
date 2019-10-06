---
Categories:
- Security
- AWS
keywords:
 - security
 - aws
Slug: hardening-your-aws-environment-at-bulletproof
Title: Hardening Your AWS Environment @ Bulletproof
Author: Arjen Schwarz
date: 2017-10-05T12:05:06+11:00
lastmod: 2019-10-06T13:47:21+11:00
summary: "This is a shorter version of my Hardening Your AWS Environment presentation, originally posted on the Bulletproof blog."
---

In this overview of the [Hardening Your AWS Environment](/presentations/2017/09/hardening-your-aws-environment/) talk we gave at the AWS User Group in Melbourne we're focusing on the monitoring and infrastructure access aspects discussed there.

<div class='ignoreme-update'>
<strong>Update October 6, 2019:</strong> The original version of this post was on the Bulletproof blog. Unfortunately as that company was acquired by AC3 a number of blog posts are no longer available there, including this one. So I've reposted it here in full.
</div>

# Monitoring and alerting

Monitoring is a very important aspect of your security and AWS offers many tools and ways monitor your environment. Two of these stand out and we'll offer some suggestions on how to get the most out of them.

## CloudTrail

Every action in AWS is an API call and you can use [CloudTrail](https://aws.amazon.com/cloudtrail) to monitor these calls. That means you can use it to see the actions taken by a user or application that impact your environment. We can improve on the default settings by pushing the logs to an S3 bucket, and specifically an S3 bucket in a different account. This means that even if an attacker gains access to your account they can't change or delete these logs.

Additionally, we can push the data to [CloudWatch Logs](http://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) which allows us to create alarms when specific actions occur. This can include alarms when CloudTrail is modified or extra IAM users are created.

## AWS Config

Where CloudTrail monitors API calls, [Config](https://aws.amazon.com/config) monitors your resources and changes to them. Like CloudTrail, this can be logged to an S3 bucket in a different account, but we can also set up Config Rules. These rules allow you to verify your config against a desired state and if the rules are broken this will trigger alerts on the Config Dashboard.

![](/2017/10/hardening-your-aws-environment-at-bulletproof/IMG_0008.png)

Next we set up Config to send everything to SNS. Unfortunately, we can't limit this to only alerts from broken rules so this will need to be filtered by for example a Lambda function. This Lambda function in turn can then trigger CloudWatch Alarms to notify your team, or even integrate this with CloudFormation [rollback triggers](http://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_RollbackConfiguration.html) to ensure updates that break rules are automatically rolled back.

![](/2017/10/hardening-your-aws-environment-at-bulletproof/Config%20Rules%20Rollback.png)

# Infrastructure access

## VPC access

The main tools for managing VPC access are security groups. These shared firewalls allow you to define the ports that are opened up for a certain source. That means you can dictate that you have SSH-access from your office IP, but not from anywhere else. One recent improvement to this is that AWS added the ability to [add a description to a rule](https://aws.amazon.com/blogs/aws/new-descriptions-for-security-group-rules/). This allows you to see why a rule is there without the need for additional documentation.

Because security groups are so powerful and useful, people often forget or don’t bother with [Network ACLs](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_ACLs.html). These are similar to security groups, except at the subnet level. And it’s true, if your security groups are configured perfectly you don’t necessarily need to use NACLs. But NACLs can provide that little bit of extra confidence in your environment. If you restrict access at the NACL level it doesn’t matter if someone accidentally opens up a security group more than you want it. The traffic is already stopped at the NACL level so it doesn't go there.

## Instance access

When creating EC2 instances, you need to consider how you keep the SSH keys or passwords secure and how to handle rotation. One way to do this is by using [Parameter Stores](https://aws.amazon.com/ec2/systems-manager/parameter-store/). If you store the keys in a parameter store, and only grant access to that parameter store to the people who need it, you have a central place to keep them and when you rotate the keys a single place for people to get the new version.

However, this still has some issues as your team will still download the keys to their local machine, with all the risks inherent to that. Instead of trying to manage the keys, we can instead aim not to use any keys for the instance at all. Generally instance access is required for logs, patching, and running jobs so lets see how we can do that without instance access.

Above, we already mentioned CloudWatch Logs. This accepts any types of logs, so we can push both application and system logs there. Once there, the logs can be made accessible for those who need them.

Patching would best be solved by having an immutable infrastructure, which means you manage patches either in an AMI or through user data, and spinning up a new machine. In cases where this is not possible however, we can use the [EC2 Systems Manager Run Command](http://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html) to run commands on instances. These commands can be either for patching or running jobs. With the Run Command, access is restricted to IAM users with the correct permissions, and there will be an audit trail of everything that was done.

# Conclusion

These are only some of the many ways you can improve your security in AWS. A more extensive writeup of this presentation, with more tips, can be found [here](https://ig.nore.me/presentations/2017/09/hardening-your-aws-environment/).
