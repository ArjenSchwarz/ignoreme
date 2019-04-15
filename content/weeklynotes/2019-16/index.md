---
title:        "Week 16, 2019 - Black Hole Photo; Google's Anthos and Cloud Run"
slug:         week-16-2019
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:          2019-04-15T19:50:05+10:00
categories:   
  - "Weekly Notes"
keywords:
  - gcp
  - space
  - containers
  - kubernetes 
  - serverless
Description:  "The black hole photo is a scientific marvel and Google held their Google Cloud Next conference from which I'll discuss Anthos and Cloud Run."
---

The black hole photo is a scientific marvel and Google held their Google Cloud Next conference from which I'll discuss Anthos and Cloud Run.

# Black Hole Photo

In all fairness, it's unlikely you haven't heard of the [first photo of a black hole](https://www.eso.org/public/images/eso1907a/) to ever be published, or seen it for that matter. So I'm not going to write a lot about it, but I think it's fantastic not just because of the image, but also how it was created. From the way they used telescopes all over the planet, to how there was so much data it had to be flown to a single place, and the algorithms needed to make it all work. Basically everything, except for the idiots who try to deny the vital part a member of that team played[^1]. Most importantly though, I want that photo on this site so I need to write about it.

![Source: Event Horizon Telescope via eso.org](/weekly-notes/week-16-2019/EAB5AD88-6002-4E62-8E26-590A67F14437.jpeg)

# Anthos

But now, let's focus on some things that came out of Google Cloud Next. There's [not enough space](https://cloud.google.com/blog/topics/inside-google-cloud/next19-recap-day1) to [discuss](https://cloud.google.com/blog/topics/inside-google-cloud/day-2-next-19-working-smarter-better-and-more-securely-cloud) [everything](https://cloud.google.com/blog/topics/inside-google-cloud/next19-recap-day3), and a lot of it was catching up with AWS and Azure[^2]. The usual all-in-one post [summarises it here](https://cloud.google.com/blog/topics/inside-google-cloud/100-plus-announcements-from-google-cloud-next19), but a couple of things stand out though, and the first of these is [Anthos](https://cloud.google.com/blog/topics/hybrid-cloud/new-platform-for-managing-applications-in-todays-multi-cloud-world).

Anthos is interesting in a way as it's the kind of product that can only come from someone who isn't the market leader. In effect, it plays on the perceived need for multi-cloud and hybrid solutions. Unsurprisingly it plays into GCP's strength in the Kubernetes world and invalidates the advantages of other clouds by switching to the lowest common denominator.

I should probably mention what Anthos is though. In short, it's a way to manage multiple Kubernetes clusters across different providers. In Google Cloud Platform you run it on GKE, while everywhere else you use the on-prem version of GKE. There is of course more to it as they add a security layer to it. All of this so that you don't need to be locked into a single provider. By using the product of a single provider[^3]. It's probably obvious, but I don't see the point in the product other as a stopgap measure. If you feel different, please explain it to me.

# Cloud Run

Where I'm very underwhelmed by Anthos, [Cloud Run](https://cloud.google.com/blog/products/serverless/announcing-cloud-run-the-newest-member-of-our-serverless-compute-stack) is more interesting. Again it builds on Google's Kubernetes strength as this is a managed [knative](https://cloud.google.com/knative/) service. What this gives you is serverless functions that you have complete control over. Anything you can run in a Linux Container is something you can turn into a function. In some ways that makes it similar to Lambda Layers as announced at re:Invent last year, but using an existing standard. It can also run by itself ORIO your existing GKE cluster, although it's not yet clear what it adds to running knative directly.

At first glance, this sounds more powerful than Lambda, but it has most of Lambda's limitations as well. Including a 15 minute timeout and surprisingly a lower memory limit than Lambda[^4]. It isn't as integrated with everything in GCP as Lambda is with AWS services, but it's still new[^5] so that will likely change. Building Docker containers is more work than uploading a function, but the additional freedom may offset that.

That said, Cloud Run doesn't seem to replace Cloud Functions quite yet, which also received an update[^6]. In all honesty, if Cloud Run works out as they hope I don't believe that Functions will stay around for the long run. Moving from one to the other would take some work, but if Google provides a convenience service to upload a function and transform that into a container[^7] that could take care of that. I just don't think that they will keep two so similar services around.

[^1]:	I find this sort of behaviour ridiculous and refuse to link to ignorant people like that. Seriously, they should take a look at themselves and work on improving that.

[^2]:	Please note that just because Google announced a similar service, that doesn't mean it wasn't in the works long before their competitors announced it.

[^3]:	I should write something about this whole multi-cloud and hybrid thing that's happening at the moment.

[^4]:	2GB vs Lambda's 3GB

[^5]:	Not to mention in beta. A common Google thing and which I have conflicting feelings about. Yes, it's nice to be able to use a new service, but there's also no guarantee that it won't change in such a way that you'll have to rewrite everything once it launches.

[^6]:	For one, Go support is out of beta.

[^7]:	And deploy it etc.