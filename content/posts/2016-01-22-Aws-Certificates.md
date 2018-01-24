---
title:        "AWS introduces free SSL certificates"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-01-22T16:53:19+11:00
date started: 22-01-2016
date posted:  22-01-2016
categories:   ["AWS"]
keywords: ["ssl", "code", "aws"]
slug:         "aws-introduces-free-ssl-certificates"
Description:  "Today AWS introduced the ability to request free SSL certificates for use with their services and I immediately jumped on that to try it out for this site. Let's have a look at how that went."
---

Today AWS introduced the ability to [request free SSL certificates](https://aws.amazon.com/blogs/aws/new-aws-certificate-manager-deploy-ssltls-based-apps-on-aws/) for use with their services and I immediately jumped on that to try it out for this site. Let's have a look at how that went.

First, before going into Amazon's solution, let's have a look at an important update to [Let's Encrypt](https://letsencrypt.org). Their work in providing automated free SSL certificates is great, and while I didn't find a way yet to automate it to provision certificates automatically for a site running on S3 that just became a lot easier. According to the below tweet, they turned on the ability to verify through DNS yesterday. This will make it a lot easier to provision certificates for servers, and especially non-internet connected machines.

{{< tweet 689919523164721152 >}}

Let's now have a look at the [AWS Certificate Manager (ACM)][ACM]. What does it bring to the table, and how does it stack up against Let's Encrypt?

[ACM]: https://aws.amazon.com/certificate-manager/

# Creating a certificate

The setup is quite easy, I did it for this site today and it went pretty smoothly[^downtime]. The process is as described in the original article, but there are a couple of things you need to take into account.

First of, unlike with Let's Encrypt, you can request wildcard certificates and have multiple domains (with the same root) on a single certificate. Technically speaking, when dealing with free certificates this shouldn't really matter as you can simply request one for each domain you wish to use. On the other hand, it does speed things up quite a bit.

The interface for requesting the certificates is as you would expect from AWS. Simple, and without anything you don't really need. I used the Console this time, although you can also use the CLI or API calls for automation.

The validation however, is still a bit messy. According to the documentation, what should happen is that it looks at your WHOIS records and sends an email to the contacts in there, *as well* as to the postmaster@, admin@, and several other high level email addresses. As I have the domain registered at the excellent [Hover][hover], it comes by default with WHOIS privacy enabled. So, I didn't get any emails to anything in there, but I also didn't receive any emails on the other addresses I should have gotten them.

Maybe this is a problem on their side, and maybe it's because I use a subdomain (although they showed the correct addresses when they were going to send the email). Either way, in the end I had to temporarily turn off the WHOIS privacy and then when I went through the request process again (using resend confirmation messages didn't update the email addresses) I immediately got *3* copies of the same email.

In a way it's good that AWS tries to email everybody so you don't have to think about it, but it does make for a lot of spam. Having had to deal with requesting SSL certificates for clients in the past, it's always already a hassle to ensure they click the confirmation email, but I think that will only get worse if multiple addresses receive that email. Of course, if you (or your company) is registered as the technical contact it probably makes it easier. Until the client calls up about these emails they received at least.

Once I clicked on the confirmation (no login of any kind required), the process was finished and the certificate available. Note that there was no notification of this happening, the status just changed from "Confirmation needed" to "Issued"[^notification].

After this it still took about 5-10 minutes before I could select the certificate in Cloudfront. While it showed up in the SSL certificate dropdown, I couldn't select the SSL option at all yet. Again, this is likely because I didn't have any SSL certificates yet on this account, but it did make the experience less pleasant.

The issued certificate is valid for 13 months, and according to the documentation should automatically renew at some time before it expires. For obvious reasons, I haven't been able to test that claim and for all I know they haven't even built support for it yet.

# Limitations

Other than the small annoyances I ran into as described above, there are a couple of other limitations currently with ACM. Presently it's only available in the US Standard (us-east-1) region and only works with ELB and Cloudfront. This mostly seems to be their usual method of rolling things out carefully over time, so I expect this will be released fairly quickly to other regions and more fully integrated with services like Elastic Beanstalk (as Beanstalk creates an ELB for you, you can already add the certificate there manually).

This also implies that AWS manages the certificate for you, which might be a dealbreaker if you want full control over your certificates. However, while through the Console it doesn't offer an option for it, you **can** download a copy of the certificate and its chain using the [CLI](http://docs.aws.amazon.com/cli/latest/reference/acm/get-certificate.html).

The documentation implies that the certificate only works with Cloudfront and ELBs however, so it might not work for anything else. On the other hand, you might be able to upload the certificates manually to other regions that don't support the Certificate Manager yet. Renewals won't be automated then, but that's a problem for next year.

# Compared to Let's Encrypt

Both solutions do good work in providing SSL certificates, and they both offer plenty of automation possibilities. Where it comes to validation I prefer Let's Encrypt's solution, especially with their support for DNS validation. However, with ACM as a service that also means once a certificate is provided you never have to think about it again. There is no need for cronjobs to renew the certificates like with Let's Encrypt.

From a user perspective, ACM is also a lot easier to use. Not in the least because there is a graphical interface and an easy way to have an overview of your certificates and it's all integrated with the tools you use.

On the other hand though, is the big limitation with ACM: you can't use it outside of the AWS ecosystem. While I like using AWS for many things, it's not the only place you can and should use certificates.

For me personally, the fact that it made it so easy to set up SSL for my site is great, and hopefully it will roll out to other regions soon. For anything other than Cloudfront or ELBs, Let's Encrypt is still the best solution around.

[hover]: https://hover.com/jCsxwetg

[^downtime]: Unfortunately, I tried to do a bit too much at the same time as I also moved the site to a different account. This caused some downtime as I hadn't taken everything into account. Apologies for that, I hope the faster site makes up for it.

[^notification]: To be fair, AWS doesn't know any contact details of an IAM user. On the other hand, it would be nice if you could hook it up to SNS.
