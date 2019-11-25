---
title:  re:Invent 2018 - One Year Later
slug:       re-invent-2018-one-year-later
blog:         ig.nore.me
author:       Arjen Schwarz
Date: 2019-11-25T19:48:18+11:00
categories:
  - AWS
  - Opinion
keywords:
  - reinvent
  - aws
Description:  "With re:Invent less than a week out, I figured it was a good time to see how last year's re:Invent held up. After all, every year we get wowed with all the new services and features that are announced, but how long does it take until we can use those? In fact, it's a year later now, but can we actually use everything that was promised?"
ogimage:      "https://ig.nore.me/2019/11/re-invent-2018-one-year-later/current-status.png"
---

With [re:Invent](https://reinvent.awsevents.com) less than a week out, I figured it was a good time to see how last year's re:Invent held up. After all, every year we get wowed with all the new services and features that are announced, but how long does it take until we can use those? In fact, it's a year later now, but can we actually use everything that was promised?

## Methodology

The questions I asked were as follows:

* How many announcements were GA (Generally Available), in preview, or pre-announcements of upcoming services?
* How many of the non-GA announcements are available right now?
* How long did it take for those to become available?

And I repeated those questions specifically for the Sydney region as well, seeing as that is the region I deal with the most on a day-to-day basis.

In order to find answers to these questions, I went through the announcements and grouped these by type (GA, preview, pre-announcement). I then looked at when they became GA and/or became available in Sydney.

In total I compared 82 announcements. I didn't include program announcements in this list, mostly because they aren't as interesting to most people and because it's harder to find out their status. For example, this means that while I included the [Well-Architected Tool](https://aws.amazon.com/about-aws/whats-new/2018/11/introducing-aws-well-architected-tool/), I excluded the announcement of the [Well-Architected Partner Program](https://aws.amazon.com/about-aws/whats-new/2018/11/aws-well-architected-partners/).

## What kind of announcements were there?

First, let's have a look at the announcements. Of the 82 announcements, 54 were announced as being immediately available, 24 had a preview, and only 4 were pre-announcements. This means that you would not be able to immediately use a full third of the announcements. There is an asterisk about that though, as several of the previews were public previews, which as the name implies means that everyone could use them. They were just not recommended for production use.

{{< figure src="/2019/11/re-invent-2018-one-year-later/announcement-type.png" title="How was it announced?" width="350px" >}}

But then the follow up question, how did Sydney fare in this regard? Unfortunately, of the 54 GA announcements, 12 (over 20%) were not immediately available in Sydney. Which means that for us in Australia, 40 announcements were not available from the start.

While we're looking at the type of announcements, we can differentiate this in another way as well. After all, some announcements improve existing services, while others are completely new. The breakdown for this came down to 31 new services, 45 features, and 6 open source projects.

{{< figure src="/2019/11/re-invent-2018-one-year-later/service-or-feature.png" title="What was announced?" width="350px" >}}

## How many are now Generally Available?

Of the 82 announcements, 4 services are not yet available to most of us. These 4 are:

* AWS Outposts
* IoT SiteWise
* AWS Inferentia
* Amazon Timestream

Another 14 services are available, but not in the Sydney region. This includes services that are unlikely to ever go beyond a single region, such as DeepRacer, and features that went GA for services that are not available in Sydney. But it still means that, one year later, over 20% of the announcements aren't available in Australia. I wish I could say I was surprised at that, but let's just say there is a reason we have a section titled *"Finally in Sydney"* at the local [User Group meetup](https://melb.awsug.org.au).

{{< figure src="/2019/11/re-invent-2018-one-year-later/current-status.png" title="The current status of the announcements" width="350px" >}}

Leaving my usual Australia focus aside however, we can have a more positive way of looking at it. After all, of the 28 announcements that were not immediately available, 24 are now indeed available to everyone. Even if that might not be the case in your region of choice. In fact, 95% of all announcements are now available.

## How long does it take to become GA?

Unsurprisingly, the answer to this question is "it depends". On average, it took services almost 177 days to become available. Considering that is almost exactly half a year, it's pretty clear that these releases were spread out throughout the year.

In fact, the quickest GA announcement happened a mere 11 days after re:Invent when the [EC2 p3dn.24xlarge instance type](https://aws.amazon.com/blogs/aws/new-ec2-p3dn-gpu-instances-with-100-gbps-networking-local-nvme-storage-for-faster-machine-learning-p3-price-reduction/) became available. The longest wait[^1] was for [Amazon RDS on VMWare](https://aws.amazon.com/blogs/aws/now-available-amazon-relational-database-service-rds-on-vmware/), which took 322 days to became reality.

If we then look at Sydney we can see very similar numbers. On average it took 182 days for services to become available. This number hides the truth a bit though, as it makes it seem that Sydney was on average only 5 days behind North Virginia. Here you need to remember that Sydney had more services that weren't released yet, as on average Sydney was actually about 150 days behind North Virginia for services that weren't available there from day one.

For Sydney the first and last service to become available are different as well. The first one was [AWS Transit Gateway](https://aws.amazon.com/about-aws/whats-new/2018/12/aws-transit-gateway-is-now-available-in-8-additional-aws-regions/), which followed its announcement at re:Invent after only 17 days[^2], while the most recent service to become available happened just last week when we got [Amazon Quantum Ledger Database (QLDB)](https://aws.amazon.com/about-aws/whats-new/2019/11/amazon-qldb-available-europe-frankfurt-asiapacific-singapore-seoul-sydney/). Which to be fair, was a mere 70 days[^3] after it became available at all.

{{< figure src="/2019/11/re-invent-2018-one-year-later/days-until-ga.png" title="How long did it take to go GA?" >}}
{{< figure src="/2019/11/re-invent-2018-one-year-later/days-until-ga-sydney.png" title="How long did it take services that were announced as GA to appear in Sydney?" >}}

Taking a closer look at the numbers however shows that while the EC2 p3dn.24xlarge instance type coming within 11 days was great, it was one of only two releases within the first 100 days. The other being the [EFS Infrequent Storage Class](https://aws.amazon.com/blogs/aws/new-infrequent-access-storage-class-for-amazon-elastic-file-system-efs/) after 80 days. That is a bit disappointing, and the situation for Sydney was exactly the same. After the Transit Gateway, the only other within 100 days was that same EFS Infrequent Storage Class. I think it's fair to say based on these numbers that there was a bit of a slow start after the initial rush from re:Invent, but that is to be expected as it takes time to fix assumptions during the preview periods. And there was the holiday period in between as well.

## What does this mean for this year?

Let's be clear, how last year's announcements performed doesn't necessarily mean anything about what will happen this year. But it's likely that things will work out similarly. Which means we can expect a number of announcements we can't use immediately, no matter how disappointing that is. In addition, you shouldn't expect anything to come shortly after re:Invent and in fact it can take a very long time before the service you really want becomes available. Especially if your region is one that doesn't get a lot of love.

On the other hand, the majority of announcements is available immediately and, based on what we've seen over the past several weeks[^4], it seems to me that there are likely a lot of interesting announcements waiting for us. So, I'm quite positive about the new toys we'll get to play with next week.

And of course, if you want to play around with the data I collected, you can download it as a [Numbers file with the formulas and graphs](/2019/11/re-invent-2018-one-year-later/re-invent2018-1-year-later.numbers), or as a [raw CSV file](/2019/11/re-invent-2018-one-year-later/re-invent2018-1-year-later.csv).

[^1]: Obviously not counting the services that didn't get released at all.

[^2]: Unfortunately, the Direct Connect integration took far longer to appear in Sydney.

[^3]: Less than half the average time!

[^4]: This time of year we get both the announcements that didn't make the cut for re:Invent and those that need to be in place already for the announcement.
