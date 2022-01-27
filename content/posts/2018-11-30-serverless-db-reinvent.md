---
title:        Serverless Databases after re:Invent
slug:       serverless-databases-after-re-invent
blog:         ig.nore.me
author:       Chris Coombs
Date:         2018-11-30T11:04:17-08:00
categories:
  - AWS
keywords:
  - aws
  - guest
  - dynamodb
  - aurora
Description:  "That’s a wrap for re:Invent 2018! Whilst Arjen will no doubt be providing us with the low down on all things containers in due course, I’ve hijacked his excellent blog to bring you a short guest post on serverless database news. "
---

That’s a wrap for re:Invent 2018! Whilst Arjen will no doubt be providing us with the low down on all things containers[^1] in due course, I’ve hijacked his excellent blog to bring you a short guest post on serverless database news.

Until re:Invent this week, AWS had only one serverless database offering - Aurora Serverless (MySQL compatible). It’s true that there was some disagreement as to whether it was truly serverless,

{{< tweet user="ben11kehoe" id="1019231305962319875" >}}

but in the flurry of announcements leading up to re:Invent, [the Aurora Serverless Data API](https://aws.amazon.com/about-aws/whats-new/2018/11/aurora-serverless-data-api-beta/) was released in beta (allowing Lambda to call Aurora Serverless directly over HTTP); making Aurora Serverless irrefutably 100% approved serverless! “Chris, but what about DynamoDB?”; well sure. it’s fantastic. It’s one of my favourite AWS services, but sadly it wasn’t serverless… until now!

Whilst there aren’t any serverless police, there are 4 generally agreed upon rules for something to be considered serverless, namely:

- no servers to provision,
- scale with usage,
- availability and fault tolerance built in and
- never pay for idle

Whilst Aurora Serverless always satisfied all of these requirements, with DynamoDB you paid for read/write capacity regardless of whether or not you used it, violating the ’never pay for idle’ rule. With [DynamoDB On-Demand](https://aws.amazon.com/blogs/aws/amazon-dynamodb-on-demand-no-capacity-planning-and-pay-per-request-pricing/) you don’t need to specify read/write capacity or bother with auto-scaling rules, rather you pay per million write/read requests consumed (about $1.42 USD and $0.28 USD respectively in ap-southeast-2). Yes, you read that right, it’s available in Sydney at launch! Sadly, there isn’t CloudFormation support yet - but you can’t have everything. For an in depth look at DynamoDB On-Demand in action, please check out the AWS announcement post*.

I hope you’re all as excited about DynamoDB becoming truly serverless as I am. No more over/under provisioning, it will just work, like all serverless things should. Thanks for reading, Arjen back over to you!

[^1]:	and YAML... and Python