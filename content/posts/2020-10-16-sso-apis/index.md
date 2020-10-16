---
title:        Building on the SSO APIs
slug:       building-on-the-sso-apis
blog:         ig.nore.me
author:       Arjen Schwarz
Date: 2020-10-16T11:29:37+11:00
categories:
  - AWS
keywords:
  - aws
  - cloudformation
  - sso
projects:
  - awstools
Description:  "Last week I wrote about AWS SSO's CloudFormation and how (with some assistance) that can be used to manage your permission sets and assignments of those permission sets. Today I want to take a bit more positive look at the actual underlying APIs."
ogimage: "https://ig.nore.me/2020/10/building-on-the-sso-apis/sso-by-permission-set-vertical.png"
---

Last week I [wrote about AWS SSO's CloudFormation](/2020/10/fixing-aws-ssos-cloudformation/) and how (with some assistance) that can be used to manage your permission sets and assignments of those permission sets. Today I want to take a bit more positive look at the actual underlying APIs.

And you know what? I'm not going to lead up to the conclusion here by taking the long way around[^1], and will just come out and say it: the APIs are quite cumbersome, *but that's OK*.

Does it fill me with joy that they're cumbersome? No, but it's also not the end of the world as they're APIs. Yes, for the CLI it would be great if you could get the information you need in a single call, but you can string commands together to get what you need. Or write your own tool to do so. (Spoiler alert, I may have done so.)

## Why cumbersome?

I've mentioned that the APIs are cumbersome, but what do I mean by that? Well, that's probably best explained if we have a look at what we want to achieve with APIs. I'm not saying anything new here, but generally APIs are used for two things:

1. Retrieving information
2. Making changes to the data

When you retrieve information you want to do so with the shortest path to getting something useful. To explain what I mean by this, let's use the AWS CLI to find out what buckets I have in my account:

```bash
$ aws s3 ls
2020-06-30 20:13:48 arjen-fake-bucket1
2020-06-30 20:13:48 arjen-fake-bucket2
2020-06-30 20:13:48 arjen-fake-bucket3
```

Straightforward and it gives all of the information I need[^2]. Now, to be fair, `aws s3` is an abstraction layer so if we use `aws s3api` instead the output is slightly different, but more useful for programmatic use.

```bash
$ aws s3api list-buckets
{
    "Buckets": [
        {
            "Name": "arjen-fake-bucket1",
            "CreationDate": "2020-06-30T10:13:48+00:00"
        },
        {
            "Name": "arjen-fake-bucket2",
            "CreationDate": "2020-06-30T10:13:48+00:00"
        },
        {
            "Name": "arjen-fake-bucket3",
            "CreationDate": "2020-06-30T10:13:48+00:00"
        }
    ],
    "Owner": {
        "DisplayName": "arjen",
        "ID": "1234567890"
    }
}
```

How about something that is a bit more abstract? IAM Roles sounds like a good example considering what we're talking about here.

```bash
$ aws iam list-roles
{
    "Roles": [
        {
            "Path": "/",
            "RoleName": "fake_role",
            "RoleId": "ABCDEFG1234ABCDEFG",
            "Arn": "arn:aws:iam::1234567890:role/fake_role",
            "CreateDate": "2016-04-18T04:18:30+00:00",
            "AssumeRolePolicyDocument": {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {
                            "Service": "lambda.amazonaws.com"
                        },
                        "Action": "sts:AssumeRole"
                    }
                ]
            },
            "MaxSessionDuration": 3600
        }
```

This command gives me a nice list of all the roles, with the most pertinent information available. Yes, obviously if I want to actually see the policies attached to the roles I will need to run some follow up commands, but I can see the name, ARN, session duration, and even the assume role policy.

Shall we try this with SSO now? As with the CloudFormation implementation, we only have access to Permission Sets and Assignments, so getting a list of Permission Sets is a good way to start.

```bash
$ aws sso-admin list-permission-sets
usage: aws [options] <command> <subcommand> [<subcommand> ...] [parameters]
To see help text, you can run:

  aws help
  aws <command> help
  aws <command> <subcommand> help
aws: error: the following arguments are required: --instance-arn
```

Ah, of course. Despite it only being possible to have a single SSO instance per Organization, we still need to provide its ARN[^3]. Ok, let's try this again.

```bash
aws sso-admin list-permission-sets --instance-arn $(aws sso-admin list-instances --query 'Instances[0].InstanceArn' --output text)
{
    "PermissionSets": [
        "arn:aws:sso:::permissionSet/ssoins-1234567890abcde/ps-5619a76d03abcdef",
        "arn:aws:sso:::permissionSet/ssoins-1234567890abcde/ps-a409654f38abcdef",
        "arn:aws:sso:::permissionSet/ssoins-1234567890abcde/ps-583b1091abcdef",
        "arn:aws:sso:::permissionSet/ssoins-1234567890abcde/ps-e953abdc3abcdef",
        "arn:aws:sso:::permissionSet/ssoins-1234567890abcde/ps-6254a8963abcdef",
        "arn:aws:sso:::permissionSet/ssoins-1234567890abcde/ps-5f360a72cabcdef"
    ]
}
```

And this gives us a beautiful list of unreadable permission sets! I hope it doesn't come as a shock that this isn't quite what I was looking for. Sure, it gives me a list of ARNs, but despite me not stating it before what I really want is information similar to what I got with `aws iam list-roles`. At the very least a human readable name would be nice.

Let's try again, by looping over these items and once again making an additional call. Obviously it no longer works as a one-liner.

```bash
instanceid=$(aws sso-admin list-instances --query 'Instances[0].InstanceArn' --output text)
for permissionSet in $(aws sso-admin list-permission-sets --instance-arn "${instanceid}" --query PermissionSets --output text)
do
    aws sso-admin describe-permission-set --instance-arn "${instanceid}" --permission-set-arn "${permissionSet}"
done
```

I'll forego once again complaining about the requirement to include the `instance-arn`[^4] for this command and am just happy with the result:

```bash
{
    "PermissionSet": {
        "Name": "FrontendDevelopers",
        "PermissionSetArn": "arn:aws:sso:::permissionSet/ssoins-1234567890abcde/ps-5619a76d03abcdef",
        "CreatedDate": "2020-09-29T20:45:59.347000+10:00",
        "SessionDuration": "PT1H"
    }
}
{
    "PermissionSet": {
        "Name": "ExampleSet",
        "PermissionSetArn": "arn:aws:sso:::permissionSet/ssoins-1234567890abcde/ps-a409654f38abcdef",
        "CreatedDate": "2020-10-06T20:55:38.219000+11:00",
        "SessionDuration": "PT1H"
    }
}
```

Well, mostly happy. Because we need to make separate calls for everything there is no easy way to sort or filter the output, so if I were to continue with this I'd probably want to turn it into something that can be parsed by [jq](https://stedolan.github.io/jq/)[^5] so I can then turn it into something useful with that.

Anyway, my point here was that using the SSO APIs is cumbersome and I think the above example proves my point. And this is still a fairly straightforward example that you're unlikely to be happy with. Yes, getting the list of permission sets[^6] is nice, but what you're usually after is a bit more complex than that. And guess what? That means you'll have to make additional calls for each little amount of information.

Actually, yes I will show you. Time to head deeper into the woods. Something that's actually useful is seeing which groups or users are assigned to which Permission Set in an account. This takes an additional two steps. For readability I've replaced all the ARNs with variables in the commands.

```bash
$ list-accounts-for-provisioned-permission-set --instance-arn ${instanceid} --permission-set-arn ${permissionset}
{
    "AccountIds": [
        "123456789012",
        "012345678901"
    ]
}
```

and

```bash
$ aws sso-admin list-account-assignments --instance-arn ${instanceid} --permission-set-arn ${permissionset} --account-id ${accountid}
{
    "AccountAssignments": [
        {
            "AccountId": "123456789012",
            "PermissionSetArn": "arn:aws:sso:::permissionSet/ssoins-1234567890abcde/ps-5619a76d03abcdef",
            "PrincipalType": "GROUP",
            "PrincipalId": "d877ef62-1d44-4331-b6b7-3a53cd03419f"
        }
    ]
}
```

Now all we have to do is parse this and we can clearly see which GUID is assigned to the permission set and account combination. Yes, after all this work and 5 different API calls we still actually have a name for the group shown here. Hopefully once we get more API calls, we'll be able to match this ID to a name in the identity store.

I would go into details as well for the other read-only calls or even the write calls, but I'm pretty sure you realise it is all similar in nature. And hopefully this makes you understand why I call these APIs cumbersome.

## Why is this OK?

I mentioned in the intro that I'm actually OK with these APIs being cumbersome. A feeling that's different than my opinion about the pure CloudFormation implementation. And that's simply because they're APIs. They are meant to be used as part of something you build yourself and don't necessarily offer a final result. They could, and probably should, at least offer a bit more, but they don't have to.

So, with that in mind I took a hold of my favourite little tool for working around cumbersome APIs. My [awstools](https://github.com/ArjenSchwarz/awstools) project[^7]. There are many reasons for why this tool is perfect for this:

1. It keeps my Go skills at least slightly up to date[^8]
2. A lot of the basic work is already done so I can hook into the existing structure
3. It has a naming function based on a lookup table, which allows me to translate ugly GUIDs into readable names
4. It has functionality to export into draw.io so I can generate diagrams
5. I think it's fun to work on

To be clear, I understand that not everyone takes enjoyment from spending their free time building tools that are mostly useful during their working hours. For me though, that's actually something I do enjoy. I won't go too deeply into every command I added, but let's look at a couple of example that answers the above question a bit better:

```bash
$ awstools sso list-permission-sets -n testdata.json | jq                                            22:19:28
[
  {
    "AccountIDs": "ignoreme, arjen-deepracer, ccau-serverless-demo, arjen-backups, arjen-root, awscli-tips",
    "InlinePolicy": "",
    "ManagedPolicies": "AWSSSOMasterAccountAdministrator, AdministratorAccess",
    "PermissionSet": "AdministratorAccess"
  }
]
```

I like this version of `list-permission-sets` a lot more. Accounts are shown by name[^9] and the policies are shown as well. Admittedly, the InlinePolicy isn't the most readable field but that's in part because it's a string instead of an object.

Or how about getting that overview of accounts, permission sets, and users?

```bash
$ awstools sso by-permission-set -n testdata.json -o drawio | pbcopy
```

![](/2020/10/building-on-the-sso-apis/sso-by-permission-set-vertical.png)

A similar diagram based around accounts can be generated with `awstools sso by-account` instead, and there are a couple more SSO related functions that are useful to me. I also keep on improving this, so if you are interested feel free to have a look and play around with it.

## Building Blocks

One of the things that is often said by AWS is "Go Build"[^10]. The idea is that they give you the building blocks to do what you want to do. Yes, usually this means that you can build your app, website, service, or whatever on top of their platform. But you can extend this to include their infrastructure tooling.

Many tools have been built to fill the gaps left by AWS, and I have discussed a fair number of these in the past. Sometimes these gaps get filled at a later date, and sometimes they are likely to stay for the long haul. But you know what? While I will always complain when I think an API is cumbersome[^11], I enjoy having these building blocks available and being able to turn it into the exact thing that I want.

[^1]:	We'll have plenty of that when we dive into the APIs.

[^2]:	I'm honestly unsure why all these buckets were "created" in the same second. While I changed the names from the output, these are 3 different buckets that I've had for years.

[^3]:	Yes, this does actually really annoy me, how did you guess?

[^4]:	Which as I mentioned last week, is literally embedded in the permission set ARN

[^5]:	Or, if I want to punish myself, some kind of spreadsheet application.

[^6]:	Or at least their name and session duration.

[^7]:	One day I'll actually spend time thinking about a good name and will rename it.

[^8]:	I tend to write so little of it nowadays that I have to look up some of the most basic things.

[^9]:	Turning a list like this in an array for the json output format is a future improvement.

[^10]:	I admit, considering [my language of choice](https://golang.org/cmd/go/#hdr-Compile_packages_and_dependencies) this speaks to me more than most.

[^11]:	Though not always publicly or in as polite words.