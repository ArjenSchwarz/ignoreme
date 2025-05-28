---
Title: "Why the AWS close-account API is a big deal"
Slug: why-the-aws-close-account-api-is-a-big-deal
date: 2022-06-28T00:00:00Z
Categories:
  - AWS
keywords:
  - ec2
  - security
  - aws
Author: Arjen Schwarz
summary: "Once in a while AWS releases a feature that people have been demanding for a long time, and they did so again when they added the ability to close accounts from your Organization management account. Let's have a quick look at why it's so good to have this ability, how it actually works, and what this will enable us to do."
---

*This was originally posted on the CMD Solutions blog, as all of Mantel Group's brands (of which CMD was one) combined, some older blog posts got lost in the shuffle or links changed, so I'm replacing my linkblogs with the original content to ensure they stick around.*

Once in a while AWS releases a feature that people have been demanding for a long time, and they did so again when they added the ability to [close accounts from your Organization management account](https://aws.amazon.com/about-aws/whats-new/2022/03/aws-organizations-central-account-closure-lifecycle-management/). Let’s have a quick look at why it’s so good to have this ability, how it actually works, and what this will enable us to do.

## The joys of closing an account

Closing an AWS account is not something new. It’s obviously been possible for a long time, but you could only do this using the root user of the account in question. When you only have a standalone account, that isn’t really an issue. You set the details when you created the account and assuming you still have access to them you can just log in to delete your account.
That situation changes however when you’re using an Organization. Not only will you more likely be dealing with a larger number of accounts, you often won’t have the root password as accounts created from the Organization are given an automatically generated password. This in turn means that you need to go through the forgot password section of the Console login to get the password sent to your email. And if you don’t have access to that email, well… that’s a bit of an issue.
So, you can imagine this puts up a barrier around closing accounts and many Organizations are left with unused accounts. In fact, I can tell you that within a day of this coming out I cleaned up the accounts in my personal Organization. A task I’d been putting off because it was too much of a hassle.

## Let’s close all the accounts!

With the new close-account API, closing accounts has become a lot easier, so let’s see how it actually works. As is often the case with AWS, there are multiple ways to do this. You can use the Console, the AWS CLI, or one of the SDKs to include it in your management tools.
The CLI command is very straightforward as you can just run

```bash
aws organizations close-account --account-id 123456789012
```

Using the Console isn’t much more complex. Within your Organisation view, open the account you wish to delete.

![](/2022/06/why-the-aws-close-account-api-is-a-big-deal/close-account-account-list.jpg)

Then you press the **Close** button.

![](/2022/06/why-the-aws-close-account-api-is-a-big-deal/close-account-close-button.jpg)

And you get to see the below popup, where you have to acknowledge all the things and type in your account ID.

![](/2022/06/why-the-aws-close-account-api-is-a-big-deal/are-you-sure.png)

Afterwards your accounts overview will have a small (suspended) message added to your account.

![](/2022/06/why-the-aws-close-account-api-is-a-big-deal/suspended-account.png)

### Caveats to closing the account

This is an example of me cleaning up my personal accounts, and as you can see in the popup above it shows a list of things you should be aware of and that you need to acknowledge. Clearly using the CLI is a lot faster.
That said, there is a limit to the number of accounts you can close in a short period of time. By default the quota is set to being able to close 10 accounts, so if you have a large number of accounts that you wish to clean up you should start by requesting a quota increase.

There are some [other caveats related to closing accounts](https://aws.amazon.com/premiumsupport/knowledge-center/close-aws-account/). These are not specific to using the close-account API, but are important to be aware of. First of all, you won't be able to reuse the email address that is attached to the root user to create a new account. Every account needs a unique email address attached to it and that includes closed accounts.

Secondly, once an account is closed, it will first go into a 90-day cooldown period where you cannot use the account. Make sure to terminate everything in your account before closing it as some resources might keep incurring costs. A good tool to clean up your accounts is [aws-nuke](https://github.com/rebuy-de/aws-nuke). In addition, it's possible to reactivate your account within those 90 days at which point you will be charged again for any resources that are still in there. The purpose of this is obviously to ensure you are able to recover an important account if it was deleted prematurely. Please note that as this is an Organization, billing is handled through your Organization's management account so any charges you had before closing the account will still show up there.

## How do I stop my production accounts from being deleted?

As with all API calls, access to the close-account API is managed through IAM, and in addition it can only be used in the management account. Assuming you limit who has write access to the management account (if not, please do so) this in itself will already help with ensuring most people can't go around deleting accounts.

In addition however, it is possible to attach IAM policies to the roles or users that have the ability to close accounts. Right now it doesn't seem to work with SCPs, but using these IAM policies prevents certain accounts from being closed by accident. You can do this by hardcoding the account IDs or by the use of tags that you [apply to the accounts in your Organization structure](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_tagging.html). This means that you can set it up so that non-essential accounts can potentially be deleted, but prevents this for your important accounts.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PreventCloseAccountForTaggedAccts",
            "Effect": "Deny",
            "Action": "organizations:CloseAccount",
            "Resource": "*",
            "Condition": {
                "StringEquals": {"aws:ResourceTag/AccountType": "Critical"}
            }
        },
		{
            "Sid": "PreventCloseAccount",
            "Effect": "Deny",
            "Action": "organizations:CloseAccount",
            "Resource": [
                "arn:aws:organizations::555555555555:account/o-12345abcdef/123456789012",
                "arn:aws:organizations::555555555555:account/o-12345abcdef/123456789014"
            ]
        }
    ]
}
```

## What new options does this give me?

Above I already pointed out that this allows easier clean-up of accounts that are no longer required, but what indirect benefits does this bring? Obviously, it depends on you but I can give you a couple of examples.

The big thing is around temporary accounts. There are two main use cases I can see for that. First, you can create temporary accounts for demos. When you give a public talk it helps when you don't have to worry about potentially showing other things that you run in your account. This ability means that you can easily create a new account specifically for your presentation and then afterwards you just close the account. And you don't have to worry about any details that matter forever being captured on a video recording.

Secondly, you can create temporary accounts for training purposes. Imagine that you want to learn something new, but don't want to risk messing up your personal account? Create a new account and when you're done you can quickly delete it again. Similarly, if you run a training you can create a bunch of accounts and then delete them after the training is done. An example of this is the LearnCMD training we just ran for which we created about 60 accounts for students and teachers.

Another option that is more geared towards the business world is the ability to have sandbox accounts per developer. This is a dedicated account where members of your team can play around, and when they leave the company you can make the destruction of the the account part of the automated off-boarding process.

No doubt you can come up with some ideas yourself for the ability to quickly destroy accounts, and personally I'm quite excited about some of these use cases.