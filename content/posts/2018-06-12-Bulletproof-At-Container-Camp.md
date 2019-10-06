---
Categories:
- Opinion
keywords:
  - containers
Slug: bulletproof-at-container-camp-2018
Author: Arjen Schwarz
Title: Bulletproof at Container Camp 2018
date: 2018-06-12T17:30:35+10:00
lastmod:      2019-10-06T13:38:18+11:00
summary: "On May 23, the second iteration in Australia of the Container Camp conference started and this year Bulletproof was a sponsor. Conferences like this always give a good indication of where the market is, and especially to see where it's going."
---

On May 23, the second iteration in Australia of the [Container Camp conference](https://2018.container.camp/au/) started and this year Bulletproof was a sponsor. Conferences like this always give a good indication of where the market is, and especially to see where it's going.

In case you didn't get a chance to attend this year, videos of the talks will be available soon, but below are some of the things we as a team took away from it.

<div class='ignoreme-update'>
<strong>Update October 6, 2019:</strong> The original version of this post was on the Bulletproof blog. Unfortunately as that company was acquired by AC3 a number of blog posts are no longer available there, including this one. So I've reposted it here in full.
</div>

## Kubernetes Ecosystem

With the releases of [AWS' EKS](https://aws.amazon.com/blogs/aws/amazon-eks-now-generally-available/) and [Azure's AKS](https://azure.microsoft.com/en-us/services/container-service/) all three major cloud vendors now have their own dedicated Kubernetes services, and the easy availability of Kubernetes means that the focus has shifted to extending rather than using it in the first place.

As Kubernetes is a very extensible system, this means that many tools have shown up to fill in the gaps in the system. This ranges from [Helm Charts](https://www.helm.sh/) or [kubecfg](https://github.com/ksonnet/kubecfg) for managing the installation of your applications, [Envoy](https://www.envoyproxy.io/) and [Contour](https://github.com/heptio/contour) for ingress control, or [Istio](https://istio.io/) for intelligent routing, policies, and even to give you insight into how your applications are running. In addition, there are cloud-specific tools, such as plugins that handle the [networking optimised for your cloud provider](https://github.com/aws/amazon-vpc-cni-k8s) or tools that allow you to [continuously deploy and debug from your IDE](https://docs.microsoft.com/en-us/azure/dev-spaces/azure-dev-spaces).

The growing maturity of Kubernetes and the constant improvement by the community means that we now have more production stories to learn from as well. Whether that is from companies that kindly [share problems they've run into](https://community.monzo.com/t/resolved-current-account-payments-may-fail-major-outage-27-10-2017/26296/95), those who show us how they run a multi-tenant system, or even how we will be able to run these clusters across multiple cloud vendors.

## Containers Revisited

Related to Kubernetes, there is a second shift happening as well. Over the past year, many parts of container workloads have become standardised, including [container runtimes and container images](https://www.opencontainers.org/announcement/2017/07/19/open-container-initiative-oci-releases-v1-0-of-container-standards). Where before Docker was the de-facto standard of dealing with these, Kubernetes and other tools can now work with anything that follows the standards.

While Docker is useful for many things, there might be environments you don't want to run it on. This can be on a Kubernetes cluster where you use custom runtimes or even IoT devices where you encounter many limitations. As traditionally Docker is still used to build the images for this, it was good to see that more image building tools are becoming available as well.

## Security

No discussion about containers seems complete without mentioning security. There are distinct security advantages to running containers, but that doesn't negate the need to do work to keep them secure. As with the Kubernetes ecosystem, the security space keeps evolving and providing better tools.

Whether this is for securing and verifying your containers before they run or dealing with security once deployed. A big theme was also a "shift to the left" which means that development should take security in account from the start, and even include it in the continuous integration pipelines.

## The Conference

Finally, a quick shoutout to the conference itself and the fantastic speakers. Having attended both of the Australian conferences, I am impressed by how well-organised, informing, and fun these events are.

If you are in Australia and interested in containers, I highly recommend going next year. With many of the brightest minds from both Australia and overseas attending, the hallway track allows you to meet and discuss things with them as well. I hope to see you there next year!