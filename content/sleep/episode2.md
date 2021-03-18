---
Title: AWS - Organizations and SSO
slug: 2
date: 2021-03-18T13:45:03+11:00
author: Arjen Schwarz
Categories:
  - AWS
  - Opinion
Tags:
  - aws
  - organizations
  - sso
summary: "Organizations allows you to organise your accounts and SSO does this for your users. Both are useful, so let's have a look at them."
FrameEmbed: "https://share.transistor.fm/e/ce42a33c"
ogimage: https://ig.nore.me/img/arjen-without-sleep.jpg
---
Organizations allows you to organise your accounts and SSO does this for your users. Both are useful, so let's have a look at them.

## Shownotes and links

* [AWS Organizations - AWS Documentation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)
* [Consolidated billing for AWS Organizations - AWS Billing and Cost Management - AWS Documentation](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html)
* [Example SCP policies - AWS Documentation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples.html)
* [What is AWS Single Sign-On? - AWS Single Sign-On](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html)
* [The New and Improved AWS CLI v2 | ig.nore.me](https://ig.nore.me/2020/02/the-new-and-improved-aws-cli-v2/)

## Transcript

Hello, and welcome to Arjen Without Sleep. A podcast where I carry around a little human and try to make her fall asleep by talking about boring subjects like the Cloud. For today we'll take a high-level subject and talk about AWS Organizations and if there's still time afterwards we'll go a bit into AWS SSO, or AWS Single Sign-On.
But first, Organizations. Now, when you get started with AWS. (Aside: in your case probably by stealing daddy's credit card.) You start with a single account. Which is great, you spin up a couple of things, see what you can do. 
But, if you end up using it for any bigger workloads. Anything more... productionised. That's such a bad word, but something that you can share with different people and especially something where you want to have a clear separation between your development and playground environments and those where you run you production workloads. 

Once you have that you need a way to connect all of these together. So, within AWS the tool to do that is AWS Organizations. I'm guessing you can understand what that's all about: it's a way to organise the structure of your different accounts. In fact, it takes a lot of cues from organisational structures in companies. 

So, when you create an Organization you will do so in what will from that point on be the root account. *(Transcribe note, the official term these days is Management Account.)* Now, quick tip here: if you had this playground account where you did a lot of stuff, don't use that one to create your root account. Just create a completely new account and start your Organization from there.

One of the best practices for an Organization is that you don't use the root account for anything other than the Organization structure. And a bunch of services that AWS doesn't allow you to run from anywhere else despite that they say you shouldn't run anything from that account.

Now, once you've created the Organization in your new account, you can then add accounts to it. There's two ways to do so. Obviously, you can create completely new accounts from within the Organizational part of the Console. And the other way to do it is by adding existing accounts to it. This is a pretty straightforward process and all you have to do is send an invite and have that invite accepted and they're part of the Organization.

Now, within the Organization you can organise your accounts. And, it may not come as a big surprise, you can group accounts in Organizational Units. Yes, exactly like a company. So, some basic options here: you can have a production OU, a non-production OU, and you put the respective accounts under there. 

There are many blog posts about what the right way is to organise your accounts, which accounts you should have, and quite frankly I'm not going to go into that right now because a lot of that depends on your use case. What you use it for and what you need.

But why should you use an Organization even if you don't have a lot of accounts yet. Well, there's a bunch of good reasons for it. First one is that it's the preferred way these days to do consolidated billing. What is consolidated billing? That is something that you can set up in one account and everything you spent in all the other accounts on that one single bill. And when you go into the account you still see the costs per account, per region, per service, any way you want them. But you only get the one invoice. And that is very convenient. 

It also works when you have AWS credits. In the days when there were a lot of in-person events you would often get a chance to get credits *(transcribe note: this was especially the case when you attended AWS led workshops)*. But even now for example after re:Invent for example if you'd gone there, you probably got an invite for a survey and if you filled that in you got a hundred dollar credit. You apply these credits to your billing account and they will count for all your accounts. Wow, I did not mean to make that sound so silly.

Anyway, that's one reason: it makes your billing a lot easier and if you're in a company that means your finance department is a lot happier as they don't have to deal with eventually dozens of separate bills. But, there are other very good reasons.

There are a whole bunch of services that allow you to do things with other accounts within your Organization. Some examples of that are StackSets, which is a way to deploy CloudFormation templates from a single place across multiple accounts and regions which works really well with Organizations. You can set it up so that when a new account gets added it basically runs the StackSets on that account and you don't have to think about getting some baselining in place. Which is great!

Another useful one is RAM, the Resource Access Manager, this allows you to share certain resources with other accounts in your Organization. This can be many things, well, not that many to be honest, but it includes things like VPCs and Subnets so you can share those across different accounts. That sounds possibly more complicated than it actually is, but I'm not going to go into how that works right now.

But aside from that, a lot of the advantages are also around the security suite. So, when you look at a bunch of security-based services like Guard Duty or Security Hub. These are all based around the idea that you can use them within an Organization and you consolidate information into a single account from all over the Organization. Which is really great[^1].

The last part of Organizations that is really worth a mention is SCPs or Service Control Policies. What these allow you to do is, at the highest possible level, define some things that can't be done. So, one purpose that I've used this for in the past is to limit anything from running in other Regions. Say you're Australia based and due to regulations you may only want to have services run in Australia. You can do that with Service Control Policies. You can basically deny anyone from spinning anything up in a different Region.

You have to be careful with that though, there are some global services like IAM, Route53, and a whole bunch of others and you don't want to accidentally shut those out. So you'll have to include some exceptions. I'll include a [link to an example of this in the show notes](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples.html).

It looks like somebody isn't quite asleep yet, so we'll move on from Organizations which I've now given a high level overview of, to SSO Single Sign-On. So SSO is also a service that is dependent and additive to Organizations. By which I mean you can only run it from an Organization. And it needs to run from the Organizational root account as it's one of those services that unfortunately goes against AWS' best practices. I'm sure that one day that will get fixed and we can run it from a dedicated security account.

In the meantime, what SSO allows you to do is manage users from a single place. So, for example if you need access to any accounts or even other services that are hooked up. You can create a user for you in SSO and then you log in through the SSO portal and you'll see the different accounts. The accounts that you have access to, with the roles you can access. That is quite nice.

Obviously AWS is not the only service that does things like that. If you've spent any time in the business world you'll likely have run into similar solutions. It doesn't even have to be the business world as it's the same idea as Sign In with Facebook, Sign In with Google, Sign In with Apple. It allows you to use a single password to access multiple things.

Of course, the main feature here is access to AWS accounts and you can actually integrate it with other user backends. So while there is the possibility to manage the users in SSO, this is very limited and is all Console based. And the Console isn't very good. There are many things I like about the service, but the interface and especially the admin interface is pretty *(baby music)*, is not very good. But, again, that will probably improve over time.

But you hook it up to possibly an existing thing you already use. Say you use AD (Active Directory) for your user management or you use something like Okta or Ping and then you can use that to log in to AWS via SSO. Which by the way, is a free service. Just like Organizations. There is no overhead for using any of that.

So, when you log in you can have Permission Sets (which is what they are called) mapped to groups or users and when the user logs in they can see, for example, "I've got a developer role for the non prod account". That's great. Then they can click, or go to the role and either log in through the Console or get temporary access keys. Because these are IAM roles, not users. If you use AWS CLI V2 you can also [set that up to easily get renewing tokens](https://ig.nore.me/2020/02/the-new-and-improved-aws-cli-v2/).

And that, at a high level is what AWS SSO is. So, we've gone over Organizations, which we use to organise our accounts, and SSO, which we can use to organise our users.

Now, I think that you're asleep now so I'm going to put you in bed again and thank you all for listening.




[^1]:	Transcribe aside: It looks like I repeat things a lot when I'm tired, like "so" and "that's great".