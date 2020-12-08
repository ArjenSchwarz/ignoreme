---
title:  AWS Inside the Region
slug:  aws-inside-the-region
blog: ig.nore.me
author: Arjen Schwarz
Date:  "2020-02-11T20:18:16+11:00"
lastmod: "2020-05-05T20:40:31+10:00"
categories:
- AWS
- Opinion
keywords:
- aws
- regions
Description: "During Andy Jassy's keynote at re:Invent he spent an entire section talking about several new products that would extend AWS 'Beyond the Region'. While this will no doubt give some more options, the main way we'll all be running our AWS services is still going to be within a Region. So let's have a look at how these evolved over time."
ogimage: 'https://ig.nore.me/2020/02/aws-inside-the-region/days-until-3rd-az.png'
---

During Andy Jassy's keynote at re:Invent he spent an entire section talking about several new products that would extend AWS "Beyond the Region". These were [Local Zones](https://aws.amazon.com/blogs/aws/aws-now-available-from-a-local-zone-in-los-angeles/), [Wavelength](https://aws.amazon.com/wavelength/), and the [long awaited Outposts](https://aws.amazon.com/blogs/aws/aws-outposts-now-available-order-your-racks-today/). In turn, these allow you to run AWS services in a mini-zone, in a Telco's 5G data centre, and in your own datacenter/office/backyard[^1]. While this will no doubt give some more options, the main way we'll all be running our AWS services is still going to be within a Region. So let's have a look at how these evolved over time.

## Regions

<div class='ignoreme-update'>
<strong>Update May 5, 2020:</strong> In the past month, Canada got a third AZ and both the South Africa and Milan regions were opened. I've updated the graphs to reflect this as well as minor tweaks to the text.
<strong>Update December 8, 2020:</strong> We've had announcements for 3 new regions in the past several weeks: Hyderabad, Zurich, and Melbourne. I've updated the graphs to show these.
</div>


When AWS became [publicly available in 2006](https://aws.amazon.com/blogs/aws/amazon_ec2_beta/), it did so with a single Region. In public places (such as blog posts) it wasn't called a Region yet. After all, when you have a single of anything you don't need to name either the concept or the thing itself. At least not publicly. I wouldn't be surprised if internally people started thinking of names long before we were introduced to them.

Regardless, it all started with the single Region that has had several names. It's been called US Standard, US East, and more recently North Virginia. If you use API calls, you are probably familiar with its API name *us-east-1*. And of course, at the very start this Region was only for S3, with EC2 support not arriving until [later that year](https://aws.amazon.com/blogs/aws/amazon_ec2_beta/)[^2].

When S3 became available in Ireland, that still wasn't called a Region. Instead in [Werner Vogel's blog post](https://www.allthingsdistributed.com/2007/11/amazon_s3_in_europe.html) about it, he indicated this was a `<localconstraint>` configuration. The concept of a region[^3] was instead introduced [at the same time as Availability Zones](https://aws.amazon.com/blogs/aws/new-ec2-feature/)[^4].  As per the blog post:

> Availability Zones give you additional control of where your EC2 instances are run. We use a two level model which consists of geographic regions broken down into logical zones. Each zone is designed in such a way that it is insulated from failures which might affect other zones within the region. By running your application across multiple zones within a region you can protect yourself from zone-level failures.

Of course, [until EC2 became available in Ireland](https://aws.amazon.com/blogs/aws/amazon-ec2-crosses-the-atlantic/), this was still only applicable to the US Standard region. Once there were two Regions however, the number started growing. As Regions aren't exactly quick or easy to build this took time until we reached the current number of 24 regions, with another two already announced. Let's have a quick look at the data for that though. The raw data I use for this is available both as a [CSV](/2020/02/aws-inside-the-region/aws-regions-and-azs.csv) or a [Numbers file](/2020/02/aws-inside-the-region/aws-regions-and-azs.numbers).

![Past and announced region growth](/2020/02/aws-inside-the-region/regions-opened-2020-05.png)

In the above graph you can see how the number of Regions grew over the years. The first few years there was a Region per year[^5], until in 2011 four Regions opened shortly after each other. The next two years we only got a single region, but as that was Sydney it obviously[^6] counts as an important period. You can read the rest of the graph, and will see that we're in a stable period with getting two new Regions per year.

But what if none of the Regions are in an area you'd like it to be? How long will it take for them to show up? Unfortunately, I've got a bit of bad news for you there. The time between a Region getting announced and the day it actually opens is getting longer and longer.

<div class='ignoreme-update' style="margin-bottom:1em;">
<strong>Update May 5, 2020:</strong> At least it was, until the opening of South Africa and Milan, both of which were faster than any other region since GovCloud East.
</div>

![The number of days between announcing a region and the day it opened.](/2020/02/aws-inside-the-region/announcement-to-opening-2020-12.png)

You may notice two entries missing from that graph. Ohio and Ningxia are the only Regions in the past four years that were opened without a pre-announcement[^7]. I added in a trend line to see what this likely means for the newly announced regions, but in all honesty it doesn't seem to match the ones in the announcement posts.

Milan and South Africa were announced for the first half of 2020 while the trend line estimates put them at the end of the year, and clearly their release was in April. On the other hand, it shows Spain as coming in early 2022, while AWS claims late 2022 or early 2023. So, yeah, predicting the future on unclear data like this doesn't seem to be very useful[^8]. Nonetheless, with the announcements in late 2020 I've added some estimates based on what AWS claims (for example, Spain will be between October 31, 2022 and March 31, 2023). In these cases the trendline seems more accurate, although Spain is likely to be a big outlier and we don't have any dates for Indonesia.

If you've paid attention to recent announcements, you will notice that I've left off one "future" Region. This is the Osaka Region. Osaka originally [started](https://aws.amazon.com/jp/blogs/news/osaka-local-region-launch-2018feb/)[^9] as a local region with limited capabilities to offer customers in the Tokyo Region a geographically separate place for disaster recovery systems (presumably due to seismic dangers). Now however, AWS has announced that they'll be [expanding this to a full region in 2021](https://aws.amazon.com/blogs/aws/in-the-works-aws-osaka-local-region-expansion-to-full-region/). For hopefully obvious reasons, this is a very special case so I've left it out of everything.

## Availability Zones

That however brings us to that other mainstay we keep our services in: Availability Zones. As mentioned earlier, Availability Zones have been a part of AWS since 2008, but not every Region has the same number of Availability Zones. Most obvious in that regard is North Virginia, which has had 5 Availability Zones for a very long time[^10], while most others have been stuck with 2 or 3 zones.

However, while 5 (or now even 6) AZs is nice, the biggest win for regions is when they have at least 3 AZs. That is because over the years a number of services have come out that require at least 3 AZs. Possibly the most well-known of these is [Aurora, which requires these AZs for its data storage](https://aws.amazon.com/blogs/aws/highly-scalable-mysql-compat-rds-db-engine/), regardless of in how many regions you've got instances running.

This means that since 2015 there has been a lot of demand for having 3 AZs in a Region. Luckily, AWS has realised that as well and have in the past couple of years gone through a big effort of providing those 3 AZs. Every region since Paris in December 2017 has launched with 3 AZs[^11] and most existing regions have received a third AZ since then as well.

![Number of regions with 3 AZs over time](/2020/02/aws-inside-the-region/regions-with-3rd-az-2020-05.png)

Looking at this in terms of the percentage of Regions with 3 AZs it's even clearer how much of an improvement there has been, especially in the past 2 years. Although even now, there are still a couple of Regions that for some reason don't have three Availability Zones.

![Percentage of regions with 3 AZs over time](/2020/02/aws-inside-the-region/percentage-3-azs-2020-05.png)

The remaining regions with only 2 AZs[^12] are Beijing and Canada. It's an interesting combination and I have no idea what to make of it. The Beijing Region is in many ways a special case, so I'm not too surprised that Region is one of the exceptions but I don't know what AWS has against the Canada Region. To be fair, based on all this I expect that at least the Canada region will soon receive a third AZ, although for the accuracy of this post I hope it won't come within hours of me posting this[^13].

<div class='ignoreme-update'>
<strong>Update May 5, 2020:</strong> It <a href="https://aws.amazon.com/about-aws/whats-new/2020/03/aws-canada-central-region-adds-third-availability-zone/">took 1.5 months</a>.
</div>

I'll finish this overview of Regions and Availability Zones with a final graph, showing how long it took for a Region to receive its third AZ since it was opened. On average it only took about 737 days (787 before the openings in April 2020), or a bit over 2 years, but that is mostly because there have been a number of Regions with three AZs on launch. Based on these numbers, if I had to give a reward for the least loved Region, it seems that Singapore is the "winner" having had to wait 2827 days (almost EIGHT YEARS!) for that third AZ. To put that into perspective, in the time between Singapore's launch and that third Availability Zone, 14 completely new Regions were launched.

<div class='ignoreme-update'  style="margin-bottom:1em;">
<strong>Update December 8, 2020:</strong> As it's clear now that all new Regions will come with 3 AZs, this graph will not be updated for new Regions unless that changes.
</div>

![The time between opening of a region and receiving its 3rd AZ](/2020/02/aws-inside-the-region/days-until-3rd-az-2020-05.png)

As mentioned earlier, you can download the raw data I used for this as a [CSV](/2020/02/aws-inside-the-region/aws-regions-and-azs.csv) or a [Numbers file](/2020/02/aws-inside-the-region/aws-regions-and-azs.numbers)
.

[^1]:	Provided your backyard meets all of the security, power, and connection criteria.

[^2]:	Yes, I know, SQS came before or after S3 (depending on whether you count the beta) and was available before EC2 either way. That's not really relevant for this though.

[^3]:	The capitalisation of the term didn't come until later.

[^4]:	These had capitalisation from the start.

[^5]:	Except for 2008, which had no new regions as they were likely trying to figure out the concept.

[^6]:	For those of us in Australia at least.

[^7]:	Which technically means that you might be very lucky and your region will do the same. I wouldn't count on it though.

[^8]:	Still fun though.

[^9]:	I couldn't find a proper English version of this post, likely due to its limited access.

[^10]:	I couldn't find a source that told me how many AZs North Virginia at different points in time. So for now I just assume that it had 5 since 2008. If you can point me at a source that says otherwise, please do so.

[^11]:	Likely a big factor in the increased time it takes to build a Region.

[^12]:	Once again ignoring the Osaka local region that right now still only has a single AZ.

[^13]:	Hopefully not much longer than that though, as it would be nice to be sure that every region I have access to has 3 AZs.