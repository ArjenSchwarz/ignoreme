---
Title: "Why the AWS Melbourne Region is a good thing for APRA-regulated businesses"
Slug: why-the-aws-melbourne-region-is-a-good-thing-for-apra-regulated-businesses
date: 2022-07-20T15:59:24+10:00
Categories:
  - AWS
keywords:
  - aws
Author: Arjen Schwarz
summary: "We’re now in the second half of 2022, which means that the new Melbourne Region for AWS can open up any day now, so it’s a good time to have a look at the implications for an APRA-regulated business. This post builds upon the excellent posts written by my colleagues about the new AWS Melbourne Region and moving to AWS as an APRA regulated business."
---

*This was originally posted on the CMD Solutions blog, as all of Mantel Group's brands (of which CMD was one) combined, some older blog posts got lost in the shuffle or links changed, so I'm replacing my linkblogs with the original content to ensure they stick around.*

We're now in the second half of this year, which means that the new Melbourne Region for AWS can open up any day now, and that makes this is a good time to have a look at what this can mean for an APRA regulated business. This post builds upon the excellent posts written by my colleagues about the new AWS Melbourne Region and moving to AWS as an APRA regulated business[^linkremoved].

[^linkremoved]: These particular blogposts are no longer online, so I removed their links.

## Why is the Melbourne region important?

The most important part here is to figure out why, as an APRA regulated business, you would care about the existence of the Melbourne region. After all, we already have the Sydney Region and that runs everything perfectly fine. The answer to that question comes from the [Information paper - outsourcing involving cloud computing services](https://www.apra.gov.au/sites/default/files/information_paper_-_outsourcing_involving_cloud_computing_services.pdf) provided by APRA itself. There are two quotes in there that are relevant here:

> As with any outsourcing arrangement, it is prudent for an APRA-regulated entity to only enter into cloud computing arrangements where the risks are adequately understood and managed. This includes demonstration of:
>
> -  ability to continue operations and meet obligations following a loss of service and a range of other disruption scenarios;

There are more items in that list, but the above is the most relevant with regards to the Melbourne Region. While a well-designed application will be able to deal with Availability Zone outages, there is still always the risk of a Region failing completely (not very likely), or a single service you rely on in a Region failing (a more common event). In both of these cases you want to be able to rely on a secondary Region for either Active-Active or Active-Passive failover.
AWS has a lot of Regions, including ones that are relatively close to Australia, but again from that same information paper:

> An APRA-regulated entity should consider the benefits of the following factors as ways of reducing inherent risk as part of the solution selection process:
> - Australian-hosted options, if available, in the absence of any compelling business rationale to do otherwise. Australian hosting eliminates a number of additional risks which can: impede a regulated entity’s ability to meet its obligations; or impede APRA from fulfilling responsibilities considered necessary in its role as prudential regulator;

While it is not strictly necessary to be able to fall back on another Australian Region, it will make things a lot easier as you don't need to consider and manage the risks of storing data or using compute overseas. And speaking of risks, from a compliance standpoint AWS services are the same in every Region they run in.

## Should we use the new Region?

Based on the above, the answer would be yes. The end goal of a multi-Region setup would be something like the Active-Active or Active-Passive setups that my colleague Samer described in the aforementioned post. A setup like that will take some time to do well though, so you'll likely have to make sure that your applications are ready for this.

In addition, due to the sheer number of services that AWS offers not everything will be available on day 1. Over the years AWS has improved their launch offerings and does its best to fill any gaps as quickly as it can, but there is always a chance that a service or feature you require isn't there yet. When that happens there are two main things you can do.

First, if you have a Technical Account Manager or other AWS representative for your company, you can leverage them to influence the order in which services are added so make sure to raise your requirements with them. And secondly, there may well be workarounds for your workflow. For example other services that let you achieve the same result, perhaps even in a better way that is more suited to a multi-region setup. Of course (obligatory plug), CMD would be more than happy to help you explore those options.

## How can we use the Melbourne Region?

So, how should we go about using the new Region? As I mentioned, there is no need to wait until there is full feature-parity for everything you use. Especially as full feature-parity is unlikely to happen anytime soon (which, living in Melbourne, is not something that makes me happy to write and I would love to be proven wrong).

Multi-region setups are not uncommon. While they are not used as much in Australia as they are in for example the United States (which has had multiple Regions for a long time), there is a lot of documentation about the various benefits and pitfalls. AWS also has given lots of talk about multi-region best practices and these can be found on YouTube.

So, we know what we want to achieve and have looked a bit deeper into how this will work. The next step would then be to pick a workload to truly make multi-region. While it would be great to have your system of record be safely and securely multi-region as soon as possible, I'm pretty sure I don't need to explain why it would not be a good idea to use that as your test system. Instead pick a workload that is not critical and preferably doesn't get a lot of traffic to verify that your research is correct. After that you can then continue with more critical workloads.

Another way to test the new Region is to run new workloads there. Especially if you have services where it would be beneficial if they run closer to Melbourne this may be useful.

Finally, even before running your applications there, you can start using the Melbourne Region to ensure your critical data is safe and secure in multiple geographic locations. If disaster strikes and you need to rebuild your infrastructure, infrastructure as code practices will help with that. However, if you lose your data (and possibly even your backups) that is a far bigger problem.

The main tool of choice for this is [AWS Backup](https://aws.amazon.com/backup/). AWS Backup is a managed service that you can configure to make backups of many of your data sources and configure it to store those both in the Region they're created as well as [in a different Region](https://docs.aws.amazon.com/aws-backup/latest/devguide/cross-region-backup.html). Using this you'll have a backup of your databases and filesystems in a separate Region.

If you don't use Backup yet, there are alternatives for most services to copy backups and snapshots cross-region. For example RDS allows you to copy snapshots to a different Region. One way to set this up is by having [EventBridge](https://aws.amazon.com/eventbridge/) monitor for the creation of new snapshots and in turn have that trigger a Lambda function that copies the snapshot to the Melbourne Region. And this isn't limited to RDS either as you can do similar things for other services that store your data. But as always, keep in mind that an untested backup is not a real backup, so make sure you frequently verify your backups (both the process and the actual backup itself) work.

Before the opening of the Melbourne Region it may have flown under the radar, but it is possible these days to use the [same KMS key in multiple Regions](https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html). Which means that you can safely encrypt your data in Sydney, and send it to Melbourne without having to decrypt it in between but you'll still be able to access it.

Similar is the ability for Secrets Manager to [replicate your secrets to another Region](https://aws.amazon.com/blogs/security/how-to-replicate-secrets-aws-secrets-manager-multiple-regions/). Setting this up means that you only need to manage your secrets in one place but will be able to use the same values in multiple Regions. One use case for this would be for storing the secrets of your database users or the API keys for accessing third-party services. That way if you need to fail over, or just want a backup of your secrets, you will have those available in a secure manner.

## What's the plan?

So, at this stage we know that in theory the Melbourne Region can help our APRA regulated business be more robust and able to handle disasters of various kinds while remaining compliant.

At this stage, before the actual launch, it makes sense to start building a plan around how you want to use the new Region short-term and longer term. Then once the launch has happened, you can execute this plan and reap the benefits as soon as possible.

Some questions you can ask around this plan are: Which applications and data sources do I want to make multi-region? What does this mean for your security posture and training? What services and features need to be available before your applications can run fully active-active or active-passive multi-region? If you initially want to use this for backups, how are you going to set this up and verify these backups?

And remember, you may not get everything perfect the first time around, but that is why you don't start with your most important applications or data. And of course, try to influence the roadmap for AWS. The more requests they get for a service to be available in Melbourne, the more likely it is that it will show up soon.

If you would like to discuss this more with an AWS Partner who has worked with the Financial Services Industry since its inception, and happens to be AWS Services Partner of the Year, please reach out to us.