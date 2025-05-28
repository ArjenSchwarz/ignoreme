---
Title: "Top highlights from AWS pre:Invent 2022 we're most excited about"
Slug: top-highlights-from-aws-pre-invent-2022-were-most-excited-about
date: 2022-11-24T16:40:15+11:00
Categories:
  - AWS
keywords:
  - aws
Author: Arjen Schwarz
summary: "Every year as we get closer to re:Invent, AWS starts releasing the big items that didn’t quite make the cut for the major announcements. That doesn’t mean these releases are less interesting than what will be released at re:Invent; just that they don’t necessarily fit the narrative for the conference. In fact, some of my favourite announcements in previous years happened during this time. So, with re:Invent now only a couple of days away, let’s look at some of the gifts AWS brought us during pre:Invent."
---

*This was originally posted on the CMD Solutions blog, as all of Mantel Group's brands (of which CMD was one) combined, some older blog posts got lost in the shuffle or links changed, so I'm replacing my linkblogs with the original content to ensure they stick around.*

Every year as we get closer to re:Invent, AWS starts releasing the big items that didn't quite make the cut for the major announcements. That doesn't mean these releases are less interesting than what will be released at re:Invent; just that they don't necessarily fit the narrative for the conference. In fact, some of my favourite announcements in previous years happened during this time. So, with re:Invent now only a couple of days away, let's look at some of the gifts AWS brought us during pre:Invent.

## Regions and more regions!

In the past few weeks, AWS opened not one, not two, but three new Regions! These are in [Switzerland](https://aws.amazon.com/blogs/aws/a-new-aws-region-opens-in-switzerland/), [Spain](https://aws.amazon.com/blogs/aws/now-open-aws-region-in-spain/), and a second region for India in [Hyderabad](https://aws.amazon.com/blogs/aws/now-open-the-30th-aws-region-asia-pacific-hyderabad-region-in-india/). Unfortunately, this is not the Melbourne region we've been waiting for but is still a big deal for workloads that can make use of these. It's important to note that you will have to enable these regions for your accounts before you can use them.

Additionally AWS pre-announced an upcoming region in [Bangkok, Thailand](https://www.aboutamazon.sg/news/company-news/amazon-web-services-announces-190-billion-baht-investment-to-drive-thailands-digital-future). Surprisingly this was not announced on the AWS blog, but instead on the Amazon blog where it's part of an announcement about investments AWS is making in the region. This also means we don't have any details on when we can expect this region. Maybe more news will be coming about this at a later date.

As the Melbourne region was estimated to be opened during the 2nd half of 2022, is it likely to be announced during re:Invent? Unfortunately, it's not very likely as AWS has never announced the opening of a region during re:Invent. However, there is a good record of regions being opened between re:Invent and Christmas, including last year's [Indonesia region](https://aws.amazon.com/blogs/aws/now-open-aws-asia-pacific-jakarta-region/), so we might still get to play with our new region this year. And you never know about re:Invent either.

## Where are my services?

Have you ever run into a situation where you can't find something you built, but you know it must be around somewhere in this account? Maybe you just want to be able to easily see a list of all your resources, or in a specific region? Well, that's where the new [AWS Resource Explorer](https://aws.amazon.com/blogs/aws/introducing-aws-resource-explorer-quickly-find-resources-in-your-aws-account/) comes into play.

![](/2022/11/top-highlights-from-aws-pre-invent-2022-were-most-excited-about/76a70b123caac542655ffa37fc26f4fbf607e1af.png)

Once you enable this, you will be able to have a look through your account, filter it by region or type, and get a good overview of what you have. There are a number of ways you can filter this and you can set up specific views as well. And best of all, it finally allows something that I've been hoping for since the new search bar was introduced: searching for resources.

![](/2022/11/top-highlights-from-aws-pre-invent-2022-were-most-excited-about/f4ac93531d85e280ae7d29a1cf1a3e198c90101c.png)

Of course, it's not all perfect and aside from it still being a little limited in the resources it can detect, the main improvement I'd love to see is integration with Organizations so it will work cross-account. Purely based on the first screenshot above, I feel like this is something that will come but will likely take time. All in all though, this is a great new service that will make understanding your AWS resources a little easier.

## It's all about the Lambdas

Lambda is the flagbearer for Serverless architectures, and it won't come as a surprise that it comes with several interesting announcements. And while [support for Node.js 18](https://aws.amazon.com/about-aws/whats-new/2022/11/aws-lambda-support-node-js-18/) is nice, it's not the kind of thing that makes that much of a difference to how we use it.

The first thing that came out was a new way to [retrieve parameters and secrets](https://aws.amazon.com/about-aws/whats-new/2022/10/aws-parameters-secrets-lambda-extension/) from your Lambda function. You can now do this by way of calling a URL. This means your application code doesn't need to load the appropriate AWS SDK which makes for a smaller and faster application.

Then there is the [Telemetry API](https://aws.amazon.com/blogs/compute/introducing-the-aws-lambda-telemetry-api/). This is a new way of retrieving logs for Lambda through an extension and replaces using the Logs API. It contains more data and is easier to link to a centralised log collection.

The last one I'll mention here is a pure development tool. The SAM CLI is a good way to test your Lambda functions locally, but one limitation to it was that you had to use CloudFormation (or specifically SAM) to define your infrastructure. For fans of Terraform, of which there are plenty here at CMD, there is now good news as the [SAM CLI now supports Terraform](https://aws.amazon.com/about-aws/whats-new/2022/11/aws-sam-cli-terraform-support-lambda-local-testing-debugging/) as well.

## Simplifying your networks

One announcement that got a number of us excited is [CloudFront's support for continuous deployment](https://aws.amazon.com/blogs/networking-and-content-delivery/use-cloudfront-continuous-deployment-to-safely-validate-cdn-changes/). While the name may not sound very exciting, what this allows you to do is set up a staging CloudFront distribution that you can point at your next version or use it to test changes to your Cloudfront configuration. You can then access it either by providing a special header in your calls to do (automated) testing, or send a portion of your traffic to it. This let's you do either a blue/green or canary style deployment. Once you're satisfied you can then make the staging distribution the main distribution and the deployment is complete.

Another interesting change here is the ability to [transfer Elastic IP addresses between your accounts](https://aws.amazon.com/about-aws/whats-new/2022/10/amazon-virtual-private-cloud-vpc-transfer-elastic-ip-addresses-between-aws-accounts/). Over the years best practices have moved from having a single or small number of accounts to a more complex structure of multiple accounts. Moving your applications to other accounts isn't always easy, and one potential issue is when you have a lot of third-party integrations that have whitelisted IP addresses in your old account. These are usually the Elastic IPs tied to your NAT Gateways.

With the ability to move your Elastic IPs to another account that means this is no longer an issue as those IPs can come to your new account. And in cases where you share those IPs across multiple applications, you can have a setup where you have a dedicated outbound VPC that you route all your outbound traffic through. This can all be tied together using Transit Gateway for a transparent traffic flow.

![](/2022/11/top-highlights-from-aws-pre-invent-2022-were-most-excited-about/0ef6c783ebdf31cd4f5c7e6b9c8286de0edbf193.png)

And speaking of restructuring your accounts, while AWS has a solution for managing your accounts using Control Tower, they have now also released [CloudFormation support for managing your Organization](https://aws.amazon.com/about-aws/whats-new/2022/11/manage-resources-aws-organizations-cloudformation/) structure, including the creation of accounts, management of OUs, and even your various policies like SCPs.

## Let's talk security

Security is an important part of any cloud journey, so we'll look at some of the things we can use from that. First, while it is recommended to use short-lived sessions using IAM roles with some kind of federated access like AWS IAM Identity Center (formerly AWS SSO), if you are using IAM users you can now [assign multiple MFA devices](https://aws.amazon.com/about-aws/whats-new/2022/11/aws-identity-access-management-multi-factor-authentication-devices/) to them as well as to the account's root user. This for example allows you to use either a FIDO security key as well as a token generator like Google Authenticator or Authy to access your account.

If you are using IAM Identity Center, you can now [set the maximum duration of CLI and SDK sessions](https://aws.amazon.com/about-aws/whats-new/2022/11/aws-iam-identity-center-session-management-aws-cli-sdks/). You could already do this for Console and application access, so this builds on top of that. The maximum duration can be configured to be any amount of time between 15 minutes and 7 days, but it should be noted that if the session for your IdP (for example Okta or Microsoft Exchange) times out, this will also cancel the session.

Some other notable releases in the security space include the ability to set a [delegated administration account for CloudTrail](https://aws.amazon.com/about-aws/whats-new/2022/11/aws-cloudtrail-delegated-account-support-aws-organizations/), which allows you to have all your centrally managed CloudTrail trails to collate in an account you specify instead of required to go to the Organization's management account. And another change is that you can now [export CloudWatch Logs to SSE-KMS encrypted S3 buckets](https://aws.amazon.com/about-aws/whats-new/2022/11/amazon-cloudwatch-logs-supports-export-sse-kms-encrypted-s3-buckets/). Until now you couldn't do this and instead had to rely on custom solutions to export logs to a bucket protected with a custom key.

## Wrapping it up

The above is only a fraction of the 400+ announcements AWS made in the past month, but they do reflect some of the things that I believe may have a positive impact on your usage of AWS. Of course, if you wish to learn how we can help you use these new features you're welcome to [reach out to us](https://www.cmdsolutions.com.au/contact-us/). In the meantime I'm looking forward to seeing what re:Invent will bring us next week.
