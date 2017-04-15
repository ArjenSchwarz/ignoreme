---
title:        Google Cloud OnBoard
slug:         google-cloud-onboard
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2017-04-15T20:50:56+02:00
categories:   ["GCP"]
Description:  "A couple of weeks ago, I mentioned that I would like to learn more about Google Cloud Platform. Two days later I learned that there would be a Google Cloud OnBoard session in Melbourne. This happened recently, so I put on an AWS shirt and went to check it out."
---

A couple of weeks ago, I mentioned that I would like to learn more about Google Cloud Platform (GCP). Two days later I learned that there would be a [Google Cloud OnBoard](https://cloudplatformonline.com/gcp-au-googlecloudonboard.html) session in Melbourne. This happened recently, so I put on an AWS shirt and went to check it out.

This article is a polished version of the various notes I took on that day, hopefully organized in a way to give you a good idea of what I learned on that day. I don't include things I've learned since and bear in mind that while I came into it without knowledge about GCP in particular I have plenty of experience in cloud infrastructure and many of the other things that come with it. Because of that, the day itself was at times far too simple but at other times giving me some good insight into the platform.

# General thoughts

GCP is an interesting platform, and some of my impressions based on the [Google Next event](/weekly-notes/week-11-2017/) seemed to be correct as especially the security aspects they stressed during the sessions were things introduced at that time. That's not to say the platform wasn't ready before then, but it involved a lot more work. Now, while the speakers went out of their way not to mention the elephant in the room[^1], I will do a lot of comparisons to AWS.

So, the first main difference is that GCP runs in the same DCs as Google's own applications. Presumably there is a distinction somewhere between them, if only for security reasons, but no details were provided about it. This is a different setup from AWS and Azure, in part because the parent companies of these two (especially AWS) don't have the same server footprint as Google. After all, not many companies do.

In theory this should make it easier for them to roll out to new regions as they will already have a footprint there, and when I did a [region comparison](/weekly-notes/week-51-2016/) for the cloud platforms I noted how GCP will be expanding a lot this year. This was reiterated with a statement at OnBoard that sometime soon Google will make an announcement concerning a Sydney region.

Which then brings me to what might be my favorite feature of GCP: Cloud Shell. This is basically a tiny VM that is spun up for you in the Console (web interface), with a persistent home directory, that you can run commands on. Obviously, having the CLI tools installed on your own computer is often easier, but having direct access to those commands regardless of the computer you're running is quite a powerful tool. It also means you don't have to worry about authentication and things like that.

## Organization

Of course, speaking of authentication, it probably doesn't come as a surprise this is all connected to your Google account. It makes sense, but I can't say that I'm happy about that. I haven't tried anything with this yet, but as someone working at a professional services company it makes me wonder how this will work for our teams. Will they need accounts for each client or can they have a single Google account that can then be connected to the client's organization, and how would all of this work with permissions? If a member of the support team (or an engineer like myself) leaves, will his account need to be removed from all the clients? And the same if someone starts. With AWS there are good solutions for this, but while there might be solutions for all of this in GCP they didn't come up during the sessions.

We did learn more about how everything is organized in GCP. There is a hierarchy, with organizations at the top level[^2] and then followed by projects. Projects are the main distinction. Where in the AWS account you switch between accounts and regions, in GCP you switch between organizations and projects. You still have to define what region you want something placed in, but it's not as much of a separator as it is within AWS. That also means billing is at the project level, and the most important identifier that you will use is your project ID. I like this separation into projects, mostly because it makes it easier to identify what belongs together between regions. You can achieve something similar in AWS with tagging, but in many cases using a project as identification works quite well[^3].

## Billing

One of the few things I was already aware of with GCP is their billing structure. From a customer point of view this is better than AWS for a couple of reasons. First is that, unlike with AWS, resources aren't billed by the hour[^4]. Instead you pay by the minute with a minimum of 10 minutes. 

For anything that doesn't run pretty much continuously this is a more price friendly model, and for everything that does run continuously they have their sustained discount. This means that if you use a VM more than 25% of the time in a month, you automatically get a discount.

Whether this makes GCP cheaper for you than AWS of course depends on your use case and both companies tend to lower their prices frequently and in reaction to each other.

## Tooling

I already briefly mentioned the Console and its built-in [Cloud Shell](https://cloud.google.com/shell/docs/). This is the obvious starting point for using GCP, and seems to be well set up for beginners. There are ample explanations of what something is and one-click solutions to the common requirements. Aside from that the Console seems like a well-built interface, with a handy search function you can invoke with `/`. Similar to how you do it in Gmail if you have the keybindings enabled, or of course the original source vi.

As with the other platforms, the Console is only one of the ways to interface with GCP. The other options are their [CLI tool](https://cloud.google.com/sdk/gcloud/) called `gcloud`, the [REST APIs](https://cloud.google.com/apis/docs/overview) made available, and the various [programming language SDKs](https://cloud.google.com/sdk/). There isn't much to say about these, other than that at first sight they seem feature complete and very similar to their AWS counterparts.

There is also a CloudFormation like tool called [Google Cloud Deployment Manager](https://cloud.google.com/deployment-manager/).

# Security

At Google Next many security features were released, and these were touted as big things. I completely agree that they were, I just wonder how it worked before they were released. I can only assume that GCP users had to build their own solutions for things like KMS.

While at a high level security was an important topic, there wasn't a lot of specifics that were mentioned with the obvious exception of IAM. Identity and permissions management, which is what IAM handles just like in AWS, is an important thing and there are several differences here that are important.

First, permissions are granted at different levels, following to the structure of the organizations, projects, and resources. The most important thing to remember here is that these permissions flow down and that access granted at a higher level can't be taken away by a lower level. So, if a user is granted all rights on an organization level, they will have access to everything. Because of this it's recommended to manage these permissions at the lowest possible level.

Within a project there is a high level distinction between users based on 4 main roles. The most important of these is *owner* which gives you administration rights for the project, while the others are for more specific roles. On top of this however you can grant more specific permissions. These are not as fine grained as you can get with AWS, but are more groupings of general permissions you can use.

The other thing of note are service accounts. These are generally not meant to be used by humans, but instead work through API keys. This is similar to how you would set up an IAM account in AWS and only give it access keys but not Console access. Additionally, all VMs are automatically granted a service role which in that case acts like an IAM Instance Role does in AWS.

# Google App Engine

[Google App Engine](https://cloud.google.com/appengine/) is the simplest way to get an application up and running. There are two versions of it, called the [Standard](https://cloud.google.com/appengine/docs/standard/) and [Flexible](https://cloud.google.com/appengine/docs/flexible/) environments. The Standard Environment is similar to AWS Beanstalk, you have a limited environment with ephemeral storage and everything is configured for basic usage. There are many limitations, and only a couple of languages are included[^5]. On a personal level, this isn't very interesting. There are use cases for it, but those are not mine.

The Flexible Environment however, is far more interesting. To me this is a solution for running single Docker containers on a single instance. If you don't need anything fancy, no orchestration or interaction between multiple containers, and just want to roll out the same container you have locally this sounds like a good solution. As you're dealing with a Docker container you also don't have any restrictions related to the language or third-party software. Several other limitations from the Standard Environment are also removed or lessened, so you've got far more flexibility. Keep in mind that there are still limitations, but to me this sounds like a far more useful tool.

# Storage

As most of the storage options are very similar to AWS offerings, I'm not going into them too deep but will just focus on the parts that are different.

## Cloud Storage

Basically S3 and Glacier. There are 4 different pricing tiers, that depend on how accessible the data is. This goes from data that will be accessed all the time and is therefore stored multi region, to basically glacier level data you that is mostly for archiving. Unlike with Glacier however, the data is still instantly retrievable. The pricing tiers will have either higher storage costs or higher retrieval costs, so you can choose what you want. Additionally, there is no option like Snowball for importing very large amounts of data. The only option there is to use "offline import" which means you send your data to a third-party who then upload it.

## Cloud SQL

This is the [equivalent of RDS](https://cloud.google.com/sql/), a managed database. The main difference is that it only supports MySQL (with Postgres in beta) and has 2 generations. The latest generation is faster, but not yet feature complete.

## Cloud Datastore

Similar to DynamoDB, this is a [basic NoSQL solution](https://cloud.google.com/datastore/). Unlike DynamoDB though it has an emulator for local development, which can be really handy. And it offers the option for strong consistency. This comes with its own drawbacks, but it's useful to have it there if you need it.

## Bigtable

[Bigtable](https://cloud.google.com/bigtable/) doesn't have a clear AWS equivalent, and is touted as a wide column [^6]NoSQL solution for large-workload applications. It uses HBase, and some of the other storage options are built on top of this. There are several ways to access it, from HBase equivalent APIs to streams and batch processing, and it integrates with other GCP services and Hadoop. This seems to be what Google itself uses, and if you have workloads that can use this it could be a very good solution.

# Google Container Engine

As the creators of Kubernetes, it shouldn't come as a surprise that [GCP's Docker offering](https://cloud.google.com/container-engine/) is well done. The Google Container Engine is a light shell around [Kubernetes](https://kubernetes.io/)[^7], and in fact you interact with it using the regular `kubectl` commands. There are a lot of configuration options and it offers both a registry and a container builder service. As this basically is Kubernetes, there isn't much more to say about it. There are some GCP specific commands (`gcloud docker --push` for writing to the GCP repository for example), but mostly usage is similar to Kubernetes. 

# Google Compute Engine

[Google Compute Engine](https://cloud.google.com/compute/) is the basic VM service. As with other things I've mentioned, there isn't a lot of difference with EC2 but there are a couple I want to highlight. I've already mentioned the billing differences,  it another big one is the flexibility in configuration.

With GCP you can configure the amount of CPU and RAM more precisely than just based on predefined types. That said, there are a lot of different types in AWS so that once again it would depend on your exact requirements what is more useful to you.

Then there are [preemptible instances](https://cloud.google.com/compute/docs/instances/preemptible). In a way these are like spot instances, as in that they're a way to get access to temporary cheaper instances. That's where the similarities end though, as preemptible instances don't have am auction system for the pricing and can only run for a maximum of 24 hours before being shut down. It's likely that it will be shut down before that time, but 24 hours is the absolute maximum.

# Big Data

Which then brings us to the end part of the day where there was a short intro into what I see as GCP's biggest strength: Big Data and Machine Learning.

The Big Data platform consists of several services that I'll quickly go through. Even if they'd gone into them in depth[^8], I probably wouldn't have been able to appreciate everything about it.

## BigQuery

This is a [data warehouse system](https://cloud.google.com/bigquery/), meant to handle a lot of data (and probably built on top of BigTable). From the explanation given, it seems very fast and capable but I don't have any real experience with similar systems so I can't do a good comparison.

## Cloud Pub/Sub

This is a [messaging queue](https://cloud.google.com/pubsub). Similar to SQS, and no real differences that I could see.

## Cloud Dataflow

A [data-processing service](https://cloud.google.com/dataflow/), that can handle both streams and batched pipelines. 

## Cloud Dataproc

This is basically [Hadoop and Spark as a service](https://cloud.google.com/dataproc/). 

## DataLab

[DataLab](https://cloud.google.com/datalab/) is a visualization tool for the other big data services.

# Machine Learning

As with the Big Data tools, there unfortunately wasn't a lot of information about what is on offer for this.

## Cloud Machine Learning Engine

I've written about Tensorflow [recently](/weekly-notes/week-9-2017/), so I'm not going to explain what it is[^9] and I doubt anyone will be surprised that this is used as the underlying framework for GCP's [Machine Learning Engine](https://cloud.google.com/ml-engine/). The ML engine is integrated with several of their other services and is a managed service that you use to build your own models.

## Pre-trained models

There are several pre-trained models available as well that can be used through APIs. This includes the [Vision API](https://cloud.google.com/vision/) for use with image recognition and data[^10] and the [Speech API](https://cloud.google.com/speech/) for speech to text conversion. Both of these, and any other available ones, are easily useable through APIs and are managed services.

# Conclusion

After going to the Google Cloud OnBoard day I feel like I got a good idea of what the platform has to offer. Coincidentally there was the yearly AWS Summit in Sydney the next week which gave me a good way to compare the two as well. Based on that, I found that while GCP has its good sides, it is very far behind AWS in most respects. 

There are a couple of nice things that GCP has that AWS doesn't, and if the price of running your servers is more important than the cost of your team[^11] it could be worth it. This of course doesn't count special deals like what companies such as Spotify get for moving their infrastructure from AWS to GCP.

All in all, I therefore have to say that unless you only use Docker and want to run on a managed Kubernetes setup, or are most interested in Big Data or Machine Learning, there probably isn't a real reason to choose GCP over AWS. Having it as part of a multi-cloud solution might work, but you'll have to limit what you use in AWS. As my job is to build solutions in AWS (and other cloud platforms if required), I constantly use things that either aren't available in GCP or are far more limited. 

Personally I don't think it's worth going for the lowest common denominator if that results in either far higher costs or a worse experience for your users. Then again, if you don't want to[^12] make use of more than the basics such as virtual machines, GCP might be a good option. That is not a strategy I would usually recommend though because of how much work that involves at scale.

[^1]:	I'm sorry, but their refusal to call AWS by name when everyone knew who the "other cloud platforms" were was just silly. It's probably in their contracts, but it devalues GCP in my eyes.

[^2]:	Hence my feeling that accounts can probably quite easily be added to a client's organization.

[^3]:	Of course, you can create an AWS account per project and manage them all through the [organizations tool](https://aws.amazon.com/organizations/).

[^4]:	This counts for pure time based resources, like instances or RDS. Obviously some functionalities like S3, Lambda, and DynamoDB and their GCP equivalents have different pricing models.

[^5]:	One of those is Go however, so please pay attention AWS!

[^6]:	Meaning it supports different keys per row.

[^7]:	Which will automatically be updated to the latest version.

[^8]:	Which they didn't.

[^9]:	Or in short, it's a machine learning training environment.

[^10]:	Presumably similar to what is used in Google Photos.

[^11]:	As you'll need to do a lot more work in GCP to get the same result as in AWS.

[^12]:	or can't
