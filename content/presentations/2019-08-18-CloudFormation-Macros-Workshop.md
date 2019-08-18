---
title:        "CloudFormation Macros: Transform Your Templates"
blog:         ig.nore.me
author:       Arjen Schwarz
Date:         2019-08-18T22:34:54+10:00
presentation_date:  "July 10, 2019"
location:     "the Melbourne AWS Programming and Tools Meetup"
categories:   ["AWS"]
keywords:
  - cloudformation
  - macros
  - aws
slug:         "cloudformation-macros-transform-your-templates"
Description:  "Last month I was lucky enough to be asked back to give a workshop at the Melbourne AWS Programming and Tools Meetup. This meetup is always a lot of fun as it's all about going hands on. My subject this time around was CloudFormation Macros."
---

Last month I was lucky enough to be asked back to give a workshop at the [Melbourne AWS Programming and Tools Meetup](https://www.meetup.com/Melbourne-AWS-Programming-and-Tools-Meetup/). This meetup is always a lot of fun as it's all about going hands on. My subject this time around was CloudFormation Macros.

> Last year AWS released CloudFormation Macros and, by doing so, gave us the ability to fully customise our CloudFormation templates. Macros run as Lambda functions that you write yourself and CloudFormation will allow these functions to change your templates in any way you want them to.
> This can be anything you imagine; duplicating entries, ensuring naming standards, pulling information from S3, up to and including writing your own custom templates that create a complete environment. In this workshop we'll take a first step in this process by building one such Macro and laying the groundwork for you to create your own.

I've written about CloudFormation Macros [previously](/2018/11/building-and-testing-cloudformation-macros/), and the introduction part of this workshop mostly consisted of the same information. I've embedded the slides below anyway in case they might be useful.

<script async class="speakerdeck-embed" data-id="228f9f061cce4205a81dbae73ab07185" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

More useful is probably the workshop itself. This can be found on [GitHub and you can work through it at your own pace](https://github.com/ArjenSchwarz/workshop-cfn-macros). In the workshop you'll be building a CloudFormation Macro called NaclExpander, which basically allows you to more nicely define your NetworkAcl objects. Each step of the workshop brings you closer to the working solution, and I made the example code available in both Python and Javascript. And yes, the workshop has tests available in case you would like to do test-driven development.

## NaclExpander

About NaclExpander itself. My main issue with NACLs in CloudFormation has always been that the syntax is very verbose. Even if you don't have a lot of rules[^1] it quickly grows to multiple pages in length. For example if you have a simple (and not very good) configuration like this

```yaml
Resources:
  NaclPublic:
    Type: AWS::EC2::NetworkAcl
    Properties:
      VpcId: !Ref VPC

  SubnetANaclPublic:
    Type: AWS::EC2::SubnetNetworkAclAssociation
    Properties:
      NetworkAclId: !Ref NaclPublic
      SubnetId: !Ref SubnetA

  NaclPublicInbound100:
    Type: AWS::EC2::NetworkAclEntry
    Properties:
      Egress: false
      NetworkAclId: !Ref 'NaclPublic'
      Protocol: '6'
      RuleAction: allow
      RuleNumber: '100'
      CidrBlock: '0.0.0.0/0'
      PortRange:
        From: '443'
        To: '443'

  NaclPublicOutbound100:
    Type: AWS::EC2::NetworkAclEntry
    Properties:
      Egress: true
      NetworkAclId: !Ref 'NaclPublic'
      Protocol: '6'
      RuleAction: allow
      RuleNumber: '100'
      CidrBlock: '0.0.0.0/0'
      PortRange:
        From: '443'
        To: '443'
```

You can use NaclExpander to instead write this as

```yaml
Resources:
  NaclPublic:
    Type: AWS::EC2::NetworkAcl
    Properties:
      VpcId: !Ref VPC
      Inbound:
        - "100,6,allow,0.0.0.0/0,443"
      Outbound:
        - "100,6,allow,0.0.0.0/0,443"
      Association:
        - SubnetA
```

I hope that it's clear that when you have to look through your configuration, this is far more readable. Since I first started using it I've greatly enjoyed the clarity it brings the templates it's used in. If you want to try it out yourself, I recommend looking at my [CloudFormation Macros repo](https://github.com/ArjenSchwarz/cloudformation-macros). This contains an updated version compared to the workshop, as the version in there will not receive any changes.

[^1]:	Which you shouldn't as that interferes with your speed.