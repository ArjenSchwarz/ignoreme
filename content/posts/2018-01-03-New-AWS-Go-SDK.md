---
title:        Trying out the new AWS Go SDK
slug:       trying-out-the-new-aws-go-sdk
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2018-01-03T19:17:48+11:00
categories:
  - aws
Description:  "At the end of December, AWS released a developer preview of version 2 of their Go SDK. This promises several improvements and so I decided to give it a spin to see what's different.
"
---

At the end of December, AWS [released a developer preview](https://aws.amazon.com/blogs/developer/aws-sdk-for-go-2-0-developer-preview/) of [version 2 of their Go SDK](https://github.com/aws/aws-sdk-go-v2). This promises several improvements and so I decided to give it a spin to see what's different.

In order to test this, I decided to convert my [awstools](https://github.com/ArjenSchwarz/awstools) project to use the new SDK. This is a small project that I mostly use to get some data that is cumbersome to retrieve using the CLI. For example, a list of all the resources recursively found in a nested CloudFormation stack.

# Documentation

Unfortunately at this time the [GoDoc documentation](https://godoc.org/github.com/aws/aws-sdk-go-v2) is still a bit of a mess. To clarify, at the function level the documentation shows perfectly well what is needed but the high level documentation leaves a bit to be desired as it shows no longer supported ways. To be fair, this is clearly because it's a fork of the original SDK and just hasn't been updated yet to reflect the new way of doing things.

# Sessions

The biggest thing you run into immediately when doing upgrading to v2 is something that I would love to see updated in the documentation (and the examples included in the repo).

Creating a client in v1[^1] involves the following code:

```go
import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/rds"
)

func RDSSession() *rds.RDS {
	return rds.New(session.New())
}
```

This has completely changed in v2, as the concept of sessions has been removed. Instead, you instantiate a client using solely an `aws.Config` struct. The easiest way, and backwards compatible, is to use the `externals` package to do so.

```go
import (
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/aws/external"
	"github.com/aws/aws-sdk-go-v2/service/rds"
)

func RDSSession() *rds.RDS {
	cfg, err := external.LoadDefaultAWSConfig()
	if err != nil {
		panic(err)
	}
	return rds.New(cfg)
}
```

The main difference is actually not that the `aws.Config` is there. It was always possible to provide a configuration, but now you no longer need to provide a session object in front of it.

```go
rds.New(session.New(), aws.NewConfig().WithRegion("ap-southeast-2"))
```

As before, you can update the details in a Config struct, so changing a region (or other details) is still straightforward.

```go
func RDSSessions() map[string]*rds.RDS {
	sessions := make(map[string]*rds.RDS)
	cfg, err := external.LoadDefaultAWSConfig()
	if err != nil {
		panic(err)
	}
	cfg.Region = endpoints.UsEast1RegionID
	sessions["us-east-1"] = rds.New(cfg)
	cfg.Region = endpoints.ApSoutheast2RegionID
 	sessions["ap-southeast-2"] = rds.New(cfg)
	return sessions
}
```

# Enums

That last example actually brings me to another change that's worth noting. Many things that used to be plain strings have now been changed to enums[^2]. These are enums of a particular type, usually a string. 

```go
type ResourceStatus string

// Enum values for ResourceStatus
const (
	ResourceStatusCreateInProgress ResourceStatus = "CREATE_IN_PROGRESS"
	ResourceStatusCreateFailed     ResourceStatus = "CREATE_FAILED"
	ResourceStatusCreateComplete   ResourceStatus = "CREATE_COMPLETE"
	ResourceStatusDeleteInProgress ResourceStatus = "DELETE_IN_PROGRESS"
	ResourceStatusDeleteFailed     ResourceStatus = "DELETE_FAILED"
	ResourceStatusDeleteComplete   ResourceStatus = "DELETE_COMPLETE"
	ResourceStatusDeleteSkipped    ResourceStatus = "DELETE_SKIPPED"
	ResourceStatusUpdateInProgress ResourceStatus = "UPDATE_IN_PROGRESS"
	ResourceStatusUpdateFailed     ResourceStatus = "UPDATE_FAILED"
	ResourceStatusUpdateComplete   ResourceStatus = "UPDATE_COMPLETE"
)
```

This means that you'll have type checking on the values you put into an API call, which can obviously be very useful, but it also means you'll likely have some rewriting of your code to do.

As the constants, which you also get as return values, are no longer of type string you'll have to convert them before you can use them as such.

```go
resourceStruct := cfnResource{
				Status:       string(resource.ResourceStatus),
```

# Requests everywhere

Speaking of API calls and rewriting, the API call process has been split into 2 steps. First, you create a request and then you send that request. Let me show this with a simple v1 and v2 example.

```go
func GetAllSecurityGroupsV1() []*ec2.SecurityGroup {
	svc := ec2.New(session.New())
	resp, err := svc.DescribeSecurityGroups(&ec2.DescribeSecurityGroupsInput{})
	if err != nil {
		panic(err)
	}

	return resp.SecurityGroups
}
```

```go
func GetAllSecurityGroupsV2(config aws.Config) []ec2.SecurityGroup {
	svc := ec2.New(config)
	req := svc.DescribeSecurityGroupsRequest(&ec2.DescribeSecurityGroupsInput{})
	resp, err := req.Send()
	if err != nil {
		panic(err)
	}

	return resp.SecurityGroups
}
```

For an individual change in a function this isn't a lot of work, but if you want to upgrade a bigger project you'll definitely want a snippet for the `resp, err := req.Send()` line (or it's alternative that you use).

If you looked closely to the two functions above, you may have noticed another difference[^3]. The slices (and maps for that matter) in responses and inputs no longer consist of pointers, but instead are now values. This too is an improvement in my opinion, but again it's going to cause a lot of work when rewriting things. Especially as everything else remains a pointer, meaning you now get a mix of pointers and values. According to the announcement blog post they didn't find a good way to change this, but have implemented helper functions to ensure you don't have to use pointers. As it's only slices and maps that are now values it's still fairly easy to remember, but combined with the enums it does cause a lot of changes.

# Other things

Because the project I tested this on is fairly small, I didn't encounter too many other things and could mostly do a fairly straightforward conversion. There are a couple of other things I noticed though.

First, the value of `ec2.Reservations` has changed from a slice of `Reservation` types, to a slice of `RunInstancesOutput`. Nothing else about this has changed, and quite frankly I think it's a weird change. There probably is a reason for it, but I don't know what it is[^4]. And of course, while this is the only such change I encountered that doesn't mean it's the only one in the code base.

The other thing I noticed is the size of my binary. It's possible this is because it's still in preview mode, but where using v1 delivered a 18MB binary on macOS (using Go 1.9) this becomes 36MB with v2. 

Inside my project, I created a [pull request](https://github.com/ArjenSchwarz/awstools/pull/1) for the changes I had to make to change over to v2, so feel free to have a look at that to see what changes needed to be made to get it working. Most likely I didn't use the best solution for everything yet, but I can change that when I get more familiar with the SDK.

That said, I think v2 is an improvement. I wouldn't want to really rewrite a bigger project with it unless it's still under heavy development (and then obviously only after the SDK is out of preview), but for new projects it's definitely an improvement across the board.

[^1]:	I'll simply refer to v1 and v2 from here on.

[^2]:	This is not the case for the endpoints used above though, they are regular constants.

[^3]:	Not counting the config parameter.

[^4]:	If you happen to know, feel free to enlighten me.
