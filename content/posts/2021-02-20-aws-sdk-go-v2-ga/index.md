---
title:        aws-sdk-go-v2 is finally GA
slug:       aws-sdk-go-v2-is-finally-ga
blog:         ig.nore.me
author:       Arjen Schwarz
Date:         2021-02-20T18:05:53+11:00
categories:
  - AWS
  - Golang
keywords:
  - aws
  - golang
  - sso
  - code
projects:     ["awstools"]
Description:  "I wrote about version 2 of the Go SDK for AWS over 3 years ago. At the time it was just available in beta/preview mode and I expected it to become GA a bit quicker than it did. But now it's finally here!"
ogimage: "https://ig.nore.me/2021/02/aws-sdk-go-v2-is-finally-ga/migration.png"
---

I [wrote about version 2 of the Go SDK for AWS](/2018/01/trying-out-the-new-aws-go-sdk/) over 3 years ago. At the time it was just available in beta/preview mode and I expected it to become GA a bit quicker than it did. But now it's finally here!

I didn't really play with it or see where it was during those three years, nor did I like all the changes they made, and as it was moving slow, I decided to wait and see. So, now that it's been released I took a look at it and used it for my [awstools](https://github.com/ArjenSchwarz/awstools) project. Especially considering that this new release likely means that the old SDK won't get as much love or will be deprecated at some point. There have definitely been some improvements to the SDK since I last looked at it, so I'm happy to see this. I won't go over everything from [the announcement](https://aws.amazon.com/blogs/developer/aws-sdk-for-go-version-2-general-availability/) as some of that I haven't dealt with in my project, but I'll highlight some of the changes I care about.

![The migration docs are pretty good.](/2021/02/aws-sdk-go-v2-is-finally-ga/migration.png "The migration docs are pretty good.")

While I'll happily talk about the things I did for this, the obvious best place to start your own journey will be the [migration documentation](https://aws.github.io/aws-sdk-go-v2/docs/migrating/).

## AWS SSO profiles

One issue I had with the v1 SDK lately was that it didn't[^1] work with the SSO profiles you [can set up using the AWS CLI v2](/2020/02/the-new-and-improved-aws-cli-v2/). These are a major improvement to using the CLI when you're using AWS SSO (the old method was copy-pasting credentials, especially terrible when you have to often switch between accounts) and I sorely missed them when using my tools written in Go. In my article you can see my workaround for it at the time, but I'm happy that [I won't need that anymore](https://aws.amazon.com/blogs/developer/aws-sso-support-in-the-aws-sdk-for-go/).

Speaking of credentials, the session setup is replaced with a config and credentials work differently as well. For a basic configuration such as I used, it doesn't require a lot of work. The [pull request](https://github.com/ArjenSchwarz/awstools/pull/5) that combines my changes for using the v2 SDK has some additional restructuring in it to be a bit nicer to work with, but I could have done a more or less direct replacement without that.

Below is an example of what my code now looks like[^2]

```go
//In a config file, external is an alias for github.com/aws/aws-sdk-go-v2/config
func DefaultAwsConfig(config Config) AWSConfig {
	awsConfig := AWSConfig{}
	cfg, err := external.LoadDefaultConfig(context.TODO())
	if err != nil {
		panic(err)
	}
	awsConfig.Config = cfg
	return awsConfig
}

func (config *AWSConfig) Ec2Client() *ec2.Client {
	return ec2.NewFromConfig(config.Config)
}

//In the application code
func routes(cmd *cobra.Command, args []string) {
	awsConfig := config.DefaultAwsConfig(*settings)
	routes := helpers.GetAllVPCRouteTables(awsConfig.Ec2Client())
	return routes
}
```

While originally, it looked like this

```go
//In the application code
func routes(cmd *cobra.Command, args []string) {
	svc := helpers.Ec2Session()
 	routes := helpers.GetAllVPCRouteTables(svc)
	return routes
}

//In the helpers class
var ec2Session = ec2.New(session.New())

func Ec2Session() *ec2.EC2 {
 	return ec2Session
}

```

If you disregard the error handling[^3] and restructuring to put everything inside the config, you see that it isn't all that different.

## Context everywhere

While I was happy to see that in the intervening three years, they decided to step away from splitting up the API calls into a prepare and send step[^4], they definitely embraced the [Context](https://blog.golang.org/context) package. In the above code snippet, you can already see that the [config.LoadDefaultConfig](https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/config#LoadDefaultConfig) function requires a Context to be provided, but it doesn't stop there. The same goes for all calls to the API.

```go
func GetAllVPCRouteTables(svc *ec2.Client) []VPCRouteTable {
	var result []VPCRouteTable
	resp, err := svc.DescribeRouteTables(context.TODO(), &ec2.DescribeRouteTablesInput{})
	if err != nil {
		panic(err)
	}
...
}
```

In fact, this was already possible in the v1 SDK so the use of Context isn't new, but what is new is that it's now the only option whereas before these would have been different functions. This definitely simplifies the API and if you don't need the Context it's easy enough to just add a `context.TODO()` value.

## What's your Type?

While the fact that many types now have enum values is definitely nice, that actually hasn't changed since my first look and in many ways is straightforward. Another change that has some impact on your code, however, is that they've separated the API calls (and everything related) and the types into separate packages. While an API call like [DescribeRouteTables](https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/service/ec2#Client.DescribeRouteTables) will be in the `github.com/aws/aws-sdk-go-v2/service/ec2` package, the resulting [RouteTable](https://pkg.go.dev/github.com/aws/aws-sdk-go-v2/service/ec2@v1.1.1/types#RouteTable) type is in the `github.com/aws/aws-sdk-go-v2/service/ec2/types` package.

In a way this is a nice change to have it separated, and updating isn't much work, but you do have to keep it in mind until you get used to it. Something else that has changed is the format of certain values. Numerical values and booleans will now usually no longer be pointers, and the same goes for some types. In addition, I noticed that some numerical types had changed from `int64` to `int32`.

## Error handling

Error handling has changed. Where in the v1 SDK you were probably used to using `awserr` to get the details of your errors that now [works very different](https://aws.github.io/aws-sdk-go-v2/docs/handling-errors/). I'm not going to say it's good or bad, but it requires some rewriting, and I'm personally still figuring out how I want to do this. Which is one reason why my error handling currently consists of `panic(err)`[^5].

## CSM

When Ian McKay released his [iamlive](https://github.com/iann0036/iamlive) tool, one purpose I saw for that with `awstools` and my other applications is to write a script that makes all the calls and add a command that prints the resultant IAM policy. I figured this was a good way for people to see exactly what the application does and to only have it grant those permissions they need. Unfortunately, when trying this after switching to the new SDK I discovered that functionality has been lost.

After talking to Ian, he [re-raised](https://github.com/aws/aws-sdk-go-v2/issues/1142) an [old feature request](https://github.com/aws/aws-sdk-go-v2/issues/186) so hopefully at some point this functionality comes back. It's not entirely a surprise that a new SDK that was in development for 3 years may have lost some functionality that was implemented in the old SDK during that time, but it's still disappointing to run into one so quickly.

## Binary size

Three years ago, I complained that using the v2 SDK increased the size of my binary from 18 to 36 MB. Since then, the application has grown and the v1 version had actually ballooned up to 34 MB and using the v2 SDK turned that into 54 MB! That is, until I switched to the [just released Go 1.16](https://blog.golang.org/go1.16)[^6] and building it with that brought the size back down to 17 MB. I suspect this may have something to do with the way Go 1.16 has changed its module behaviour, but I'm happy either way.

## I'm happy

Looking at all of these changes that have impacted my work so far, the migration was pretty straightforward and it gave me some impetus to improve the tool more beyond just the SDK upgrade. I also realise that I probably haven't made the best use of everything the new SDK offers and that I can do things differently.

As `awstools` doubles for me as a useful tool to get information out of AWS accounts and a playground for Go and the AWS SDK, I'll likely investigate this and improve on it but won't rush it.

Have you used the new SDK and found something that's interesting (good or bad)? Let me know in the comments.

[^1]:	Support in the v1 SDK actually [arrived 9 days after v2 went GA](https://github.com/aws/aws-sdk-go/pull/3755). So I still count this as a win for the v2 SDK.

[^2]:	Adjusted to be shorter and simpler

[^3]:	If you can call a `panic` error handling

[^4]:	Which really didn't add any value in my opinion.

[^5]:	That and being lazy as I'm usually fine with seeing the error like that. One day I'll make it more user friendly.

[^6]:	The embed functionality is really nice, and I'll do a separate post on what I've done with that.