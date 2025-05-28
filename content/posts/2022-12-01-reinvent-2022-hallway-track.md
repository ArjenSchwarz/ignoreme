---
Title: "2022 AWS Re:Invent; Important Highlights Between the Keynotes"
Slug: 2022-aws-re-invent-important-highlights-between-the-keynotes
date: 2022-12-01T16:26:34+11:00
Categories:
  - AWS
keywords:
  - aws
Author: Arjen Schwarz
summary: "If you've attended a conference before, you know that the most exciting things don't necessarily happen in the sessions themselves. Unfortunately, I'm not in Las Vegas, so I can't enjoy the hallway track. Still, AWS is kind enough to offer an alternative by releasing some of its announcements outside the keynotes. Best of all, you can see these announcements happening throughout the day without needing to get up at 3 am! Below are some of the announcements that stood out to us."
---

*This was originally posted on the CMD Solutions blog, as all of Mantel Group's brands (of which CMD was one) combined, some older blog posts got lost in the shuffle or links changed, so I'm replacing my linkblogs with the original content to ensure they stick around.*

If you've attended a conference before, you know that the most exciting things don't necessarily happen in the sessions themselves. Unfortunately, I'm not in Las Vegas, so I can't enjoy the hallway track. Still, AWS is kind enough to offer an alternative by releasing some of its announcements outside the keynotes. Best of all, you can see these announcements happening throughout the day without needing to get up at 3 am! Below are some of the announcements that stood out to us.

## Zero-trust networking with AWS Verified Access (Preview)

Zero-trust networking has become more popular in recent times as it is a secure way to manage access to otherwise inaccessible environments without the use of a VPN (Virtual Private Network). So it shouldn't be too surprising that AWS has been working on their own version of it to make life easier for those of us who run our applications there. Which is where [Verified Access](https://aws.amazon.com/blogs/aws/aws-verified-access-preview-vpn-less-secure-network-access-to-corporate-applications/) comes in.

Before looking into the service itself, let's go over what makes a zero-trust solution potentially better than a VPN. In my opinion, there are several  advantages:
- VPNs are usually deployed on instances and therefore require maintenance and are themselves potentially vulnerable to attacks.
- VPNs are harder to manage granular access. This may depend on the VPN you use, but I've seen in the past that anyone with access to the VPN will have access to all the applications it offers access to. Which can result in having multiple VPNs.
- From an end-user perspective VPNs require that you run an application for it on your computer and depending on how it's set up this can mean that all traffic goes through them. Which as the administrator also means you have a lot of traffic. Just think of how many of us had to deal with flaky VPNs at the start of COVID lockdowns because the systems couldn't handle the increase in traffic.

So with that in mind, how does Verified Access solve these issues? First, it's a managed service so you don't need to worry about maintaining it. As for granular access, you create an endpoint for every application and can then use the properties of your IAM Identity Center (or an OpenID Connect provider) to define access. This also means you can automate this and make it part of your code. Unfortunately, it doesn't look like there is CloudFormation support just yet, but I'm hopeful that will arrive soon. As for the last point, all you need to access the applications is a browser (limited to Chrome and Firefox right now) to access the service and it will work.

And the best part? Even though it's still in preview (and not recommended for production workloads) it's already available right here in our Sydney region.

## VPC Lattice (Preview)

[VPC Lattice](https://aws.amazon.com/blogs/aws/introducing-vpc-lattice-simplify-networking-for-service-to-service-communication-preview/) is a new service network. What this allows you to do is easily connect different kinds of applications, whether they're serverless, container-based, running on EC2 instances, or even VMs in your own data centre.

You do this by setting up the service network and then adding services to it. These services are virtual constructs that in turn point to your applications. In addition, you can configure routing rules and listeners to connect to. All of this allows you to then have a single endpoint that can be called. Oh, and did I mention you can use the Resource Access Manager to share your network with other accounts so they can hook into the same service network?

Security also plays a big part in VPC Lattice, as it allows you to set granular access controls for your services and it comes with access logging as well.

All that said, it's still early days for VPC Lattice. It looks like it will be a good solution for allowing easier interconnections between related applications, but right now you need to sign up for the preview to get access and even then it's only available in the Oregon region.


## Security

There have been some interesting security updates as well, and potentially the one with the biggest impact is [proactive rules for AWS Config](https://aws.amazon.com/blogs/aws/new-aws-config-rules-now-support-proactive-compliance/). This means that you can have AWS Config do checks not only on resources that have already been deployed, but also for resources before they get deployed. This does require a bit of extra work, as you need to use your CI/CD platform to use this. In effect, you have to use an API call (which can be an SDK) or [CloudFormation Guard](https://docs.aws.amazon.com/cfn-guard/latest/ug/what-is-guard.html) to trigger the proactive verification. You then need to check the results and can stop your pipeline if it's not compliant. The advantage here is that you can have all of your compliance checks in a single place and use the same checks for existing resources (or ones spun up outside of your CI/CD pipeline) and new ones. Which should make it easier to remain compliant. This feature is currently rolling out to all regions and hopefully is available for use in Sydney by the time you read this.

If you're familiar with Inspector, you will already know how useful this is for scanning your EC2 instances and container images for vulnerabilities. This has now been [extended to Lambda](https://aws.amazon.com/blogs/aws/amazon-inspector-now-scans-aws-lambda-functions-for-vulnerabilities/). Unlike for EC2, Inspector doesn't scan the Lambda functions on a regular schedule but instead it will do so when the function is updated or a CVE is announced. This seems to me to be a good way of doing this as it means your stable and long-lived functions don't get constantly scanned. One downside is that it currently only supports functions written in Java, NodeJS, and Python but on the other hand these are the most popular languages so it should cover most use cases. This is available in Sydney as well, but you do need to enable it by [following these steps](https://docs.aws.amazon.com/inspector/latest/user/enable-disable-scanning-lambda.html). As a last note though, if you haven't looked at Inspector for a while, this is a good time to do so. It has improved significantly over the past few years.

[KMS External Key Store, or XKS](https://aws.amazon.com/blogs/aws/announcing-aws-kms-external-key-store-xks/), is the last one I'll mention here. While it may be a bit of a niche case, the ability to run your own HSM (Hardware Security Module) and have that integrate with KMS can be a game changer. What this basically means is that if you already have an HSM in place in your own data centre, you can now integrate this with KMS to use that to generate the keys for your AWS environment. The most likely reason you would do this is for regulatory reasons, and that should make your life a lot easier. And yes, this is available in Sydney.

## Other announcements

A quick summary of some of the other announcements of note.

- [Amazon Omics](https://aws.amazon.com/blogs/aws/introducing-amazon-omics-a-purpose-built-service-to-store-query-and-analyze-genomic-and-biological-data-at-scale/) - A service aimed at helping healthcare and life sciences handle genomic and biological data
- [Connect Machine Learning capabilities](https://aws.amazon.com/blogs/aws/amazon-connect-new-ml-powered-capabilities-for-forecasting-capacity-planning-scheduling-and-agent-empowerment/) - Two ML related features of Connect have become generally available, and two new ones are now in preview
- [Glue 4.0](https://aws.amazon.com/blogs/aws/new-aws-glue-4-0-new-and-updated-engines-more-data-formats-and-more/) - A new version of Glue that is better in every way, including supporting more data formats
- [AWS Wickr](https://aws.amazon.com/blogs/aws/aws-wickr-a-secure-end-to-end-encrypted-communication-service-for-enterprises-with-auditing-and-regulatory-requirements/) - Amazon bought the company Wickr and has now released an updated version of the secure messaging platform
- [Automated Data discovery for Macie](https://aws.amazon.com/blogs/aws/automated-data-discovery-for-amazon-macie/) - You can now use Macie to discover where sensitive data is stored in your S3 buckets
- [Comprehensive Controls for Control Tower (Preview)](https://aws.amazon.com/blogs/aws/new-for-aws-control-tower-comprehensive-controls-management-preview/) - An improved way of managing compliance and security controls for your accounts
- [Redshift Streaming Ingestion for Kinesis Data Streams and Managed Streaming for Apache Kafka](https://aws.amazon.com/blogs/aws/new-for-amazon-redshift-general-availability-of-streaming-ingestion-for-kinesis-data-streams-and-managed-streaming-for-apache-kafka/) - You can now directly ingest data from Kinesis and MSK into your Redshift cluster
- [QuickSight Paginated Reports](https://aws.amazon.com/blogs/aws/new-create-and-share-operational-reports-at-scale-with-amazon-quicksight-paginated-reports/) - You can now create paginated reports of your data
- [QuickSight programmatic creation and management of dashboards, analysis, and templates](https://aws.amazon.com/blogs/aws/new-amazon-quicksight-api-capabilities-to-accelerate-your-bi-transformation/) - Using the API you can now use Infrastructure as Code to manage your dashboards
- [Automated Data Preparation for QuickSight Q](https://aws.amazon.com/blogs/aws/new-announcing-automated-data-preparation-for-amazon-quicksight-q/) - This can parse traditionally stored data to make it easier for questions asked using natural language to find relevant results

These are only the main items that were announced outside of the keynotes so far, but there are a large number of other announcements as well. Unfortunately we can't cover all of them in these blogposts, but if there's anything we discover it will likely show up in a future blogpost.
