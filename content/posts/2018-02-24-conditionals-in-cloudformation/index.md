---
title: Conditionals in CloudFormation       
slug: conditionals-in-cloudformation       
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2018-02-24T13:10:00+11:00
categories:
  - AWS
keywords:
  - aws
  - cloudformation
  - code
Description:  "You can use conditionals in CloudFormation to make a template more reusable across projects or environments. Today I'll be showing how that works."
---


You can use conditionals in CloudFormation to make a template more reusable across projects or environments. Today I'll be showing how that works.

As this concerns a base functionality of CloudFormation I won't be using my [preferred cfndsl](/2014/08/the-first-babysteps-with-cloudformation/) to do the magic for me[^1], but instead plain CloudFormation. Using the more human readable YAML syntax of course.

Your first question might be, why would you want to do this? The answer to that really is just reusability. If you have a single template that you can use across different environments, whether that is production vs development or different projects, it makes it a lot easier to maintain and update those different environments.

But environments are rarely exactly the same. For example, in your development environment you might not care about HTTPS, but in your production environment it's required. With conditionals you can still use a single template to manage these two environmentsYou can use conditionals in CloudFormation to make a template more reusable across projects or environments. Today I'll be showing how that works..

# The setup

We'll build a basic environment consisting of an autoscaling group behind an ELB[^2]. VPC, subnets, and security groups will be provided as parameters, and we're not going to set up a database. Everything in the template is limited to the minimal requirement to make it work, so not optimised in any way.

Most importantly, the template will provide the ability to set an SSL certificate to enable HTTPS and an SSH key and Bastion/Jump box. These are optional and setting them will determine the eventual setup of your environment.

![](/2018/02/conditionals-in-cloudformation/2018-02-24-conditionals-example.png)

# Parameters

Let's have a look at how this works, and as usual we start with the parameters we'll want to provide. There is quite a list of them, and as you can see I've used specific types for all of them. Especially the AWS specific ones are useful as that offers additional validation before changes happen to your environment.

The names should be clear, but otherwise the [full template](https://github.com/ArjenSchwarz/cloudformation-templates/blob/master/conditionals/conditionals.yml) has descriptions for each of the parameters. Most importantly, we'll be treating both `KeyName` and `SSLCertifateArn` as optional[^3].

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Parameters:
  MinSize:
    Type: Number
  MaxSize:
    Type: Number
  DesiredSize:
    Type: Number
  ImageId:
    Type: "AWS::EC2::Image::Id"
  InstanceType:
    Type: String
  KeyName:
    Type: String
  SSLCertificateArn:
    Type: String
  PrivateSubnets:
    Type: "List<AWS::EC2::Subnet::Id>"
  PublicSubnets:
    Type: "List<AWS::EC2::Subnet::Id>"
  ASGSecurityGroups:
    Type: "List<AWS::EC2::SecurityGroup::Id>"
  BastionSecurityGroups:
    Type: "List<AWS::EC2::SecurityGroup::Id>"
  LoadBalancerSecurityGroups:
    Type: "List<AWS::EC2::SecurityGroup::Id>"
```

# Conditions

The Conditions section in a CloudFormation template is fairly straightforward. This is the part where you define the conditions that you will later test against. In a way, you can see this as setting boolean variables to be later used in your if statements.

```yaml
Conditions:
  HasSSL: !Not [ !Equals [ !Ref SSLCertificateArn, "" ]]
  HasSSHKey: !Not [ !Equals [ !Ref KeyName, "" ]]
```

As you can see, I create 2 variables here named `HasSSL` and `HasSSHKey` that check if our optional Parameters are set. The syntax is a bit cumbersome when compared to regular string comparisons, but it is readable enough despite the nested statement. What I do here is check if the references are equal to an empty string, and then inverse the result with the `!Not` statement.

# LoadBalancer

Which leads us to the resources section of the template, starting with the loadbalancer.

```yaml
Resources:
  LoadBalancer:
    Type: AWS::ElasticLoadBalancing::LoadBalancer
    Properties:
      Subnets: !Ref PublicSubnets
      SecurityGroups: !Ref LoadBalancerSecurityGroups
      Listeners:
        - LoadBalancerPort: '80'
          InstancePort: '80'
          Protocol: HTTP
        - !If [HasSSL, { LoadBalancerPort: '443', InstancePort: '80', Protocol: HTTPS, SSLCertificateId: !Ref SSLCertificateArn }, !Ref "AWS::NoValue" ]
      HealthCheck:
        Target: HTTP:80/
        HealthyThreshold: '3'
        UnhealthyThreshold: '5'
        Interval: '30'
        Timeout: '5'
```

Most of this is fairly standard, with the various properties defined as you'd expect. The one thing that stands out is the `!If` statement in the listeners. What happens here is that I've made the HTTPS listener dependent on the SSL certificate being there. Let's quickly break down what happens here by looking at the syntax of this if statement. In essence, it's very similar to ternary if statements in other languages.

`!If [ValueToCheckIsTrue, DoThis, ElseDoThis ]`

So, if the stack `HasSSL` we provide a value for this and otherwise we set it to NoValue. This is an AWS helper value that you have to call through a reference and basically ensures the value is unused. Again comparing it to a programming language, this is the CloudFormation equivalent of a null or nil statement.

# Autoscaling Group

This use of an if-statement is clearly useful, and we can use it to completely get rid of a property as well. The below LaunchConfiguration shows this by having the SSH key be optional[^4].

```yaml
  WebServerLaunchConfig:
    Type: "AWS::AutoScaling::LaunchConfiguration"
    Properties:
      KeyName: !If [HasSSHKey, !Ref KeyName, !Ref "AWS::NoValue"]
      ImageId: !Ref ImageId
      UserData:
        Fn::Base64:
          !Sub |
            #!/bin/bash
            yum install -y nginx
            service nginx start
      SecurityGroups: !Ref ASGSecurityGroups
      InstanceType: !Ref InstanceType
```

The syntax is the same as before, and it uses NoValue again to get rid of the value. That said, while these examples only use NoValue for the else statement you can use other values as well in order to set defaults or environment specific choices.

The rest of the autoscaling configuration is standard, so I'll just refer you to the complete template for that.

# Bastion

Let's now have a look at how me can make a resource optional. If we don't have SSH keys on our ASG instances, we don't need a bastion server to connect to them either. But when we do set the SSH key, we obviously also want to be able to reach them.

```yaml
  Bastion:
    Type: "AWS::EC2::Instance"
    Condition: HasSSHKey
    Properties:
      ImageId: !Ref ImageId
      KeyName: !Ref KeyName
      InstanceType: t2.micro
      NetworkInterfaces:
        - AssociatePublicIpAddress: "true"
          DeviceIndex: "0"
          GroupSet: !Ref BastionSecurityGroups
          SubnetId: !Select [ 0, !Ref PublicSubnets ]
```

As you see, the syntax for this is different. Instead of an if-statement, we set a `Condition`. This condition has to be true in order for the resource to be created.

The other interesting part in here is possibly the use of a select statement on the last line. If you're not familiar with this, it allows you to get the selected item out of a list. In this case it solves the issue of having to define the subnet the bastion gets deployed in. It will simply pick the first of the public subnets we defined earlier.

# Implicit vs Explicit

I structured this template to never explicitly ask if you want a bastion server or HTTPS listener, it just assumes that based on the information you provide. However, If you prefer for it to be explicit you can do so by creating parameters for that and matching against the value for that. One example of that is in the code below.

```yaml
Parameters:
  CreateBastion:
    Type: String
    Description: Do you want to create a bastion instance? (yes/no)
    Default: no
    AllowedValues: ["yes", "no"]

Conditions:
  NeedsBastion: [ !Equals [ !Ref CreateBastion, "yes" ]]
```

# Summary

In this article I showed how you can use conditions to change the behaviour of your CloudFormation template. Which basically consists of 3 steps.

1. Define your parameters
2. Set your `Conditions`
3. Match against those `Conditions ` using if-statements or `Condition` requirements in your resources and outputs sections

For the `Conditions` you can compare against any parameters that you provide, or are provided by AWS[^5]. And you can change or make optional any part of your resources.

If you want to read more, there is the AWS [documentation on conditions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html) and an overview of the [condition functions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html).

In addition, you can find the template and a couple of parameter file examples[^6] [on GitHub](https://github.com/ArjenSchwarz/cloudformation-templates/tree/master/conditionals). The template is limited, but works. If you want to use it to practice something, I'd recommend trying to automate the creation of the web server security group and ensure that it automatically grants access to the Bastion server when that exists.

[^1]:	As obviously Ruby is capable of conditionals in its own way.

[^2]:	Using an ALB is preferred, but it's also far more verbose in CloudFormation so an ELB works better for demonstration purposes.

[^3]:	Unfortunately, you will still need to provide the parameter, even if it's empty.

[^4]:	After all we [don't really need SSH keys](/presentations/2017/09/hardening-your-aws-environment/), do we?

[^5]:	Useful for example in case you'd like to hardcode a difference between the Sydney and North Virginia regions.

[^6]:	The ImageID is a real Amazon Linux one, the other values are fake.
