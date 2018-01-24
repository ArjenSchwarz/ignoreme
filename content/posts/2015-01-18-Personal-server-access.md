---
title:        Personal access to your servers  
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2015-01-18T22:35:34+11:00   
date started: 18-01-2015  
categories:   ["AWS", "Security"]
slug:         "personal-access-to-your-servers"
keywords: ["cloudformation", "code", "aws", "security"]
Description:  "This article describes setting up a single security group with cloudformation that you can use to ensure you can easily gain access to your servers wherever you are. And as a bonus it describes how you can update the parameters of your stack from the command line without needing access to its template."
---

The problem: You want to have easy access to your servers regardless of where you are, but don't want to open them up completely to the entire world. If this sounds familiar, that is because I mentioned this already in my article about [SSH Security](https://ig.nore.me/2014/08/securing-ssh-access-with-cloudformation/). That article was limited however, only explaining how to do this for servers connected to a single template. Today we'll rectify that with a better solution.

# One security group to rule them all

When you encounter the problem that you need to update the IP for multiple servers, the solution seems obvious. You want a single security group that you can then include from all your server templates.

The idea here isn't that you will use this security group to replace all the functionalities of your regular EC2 security groups, you add it as an additional security group to your instances in order to ensure you will have access.

So, as our first step we'll create a template for this security group. Both the DSL and JSON file are available in my [cloudformation-examples GitHub repository](https://github.com/ArjenSchwarz/cloudformation-templates).

```ruby
  CloudFormation {
  AWSTemplateFormatVersion "2010-09-09"

  Description "Security group for personal access only"

  Parameter("AccessIP") {
    Description "IP address that should have direct access"
    Type "String"
    Default "10.0.0.0/24"
  }

  vpcId = "vpc-a817cfcd"
  ports = [22, 80, 443]
  secgroupIngres = []

  ports.each do | portnumber |
    secgroupIngres.push({
      "IpProtocol" => "tcp",
      "FromPort" => "#{portnumber}",
      "ToPort" => "#{portnumber}",
      "CidrIp" => Ref("AccessIP")
    })
  end

  Resource("InstanceSecurityGroup" ) {
    Type "AWS::EC2::SecurityGroup"
    Property("VpcId", vpcId)
    Property("Tags", [{"Key" => "Name", "Value" => "Personal access"}])
    Property("GroupDescription" , "SSH and HTTP(S) access from my current IP Address")
    Property("SecurityGroupIngress", secgroupIngres)
  }
}
```

Clearly, this is a very basic template, as we've already included this in other templates. The only things of note here are the hardcoded VPC ID (remember to change this if you use it yourself) and that I moved the ports into an array we loop over.

Creating the security group is then a simple matter of running the `aws cloudformation create-stack` command. If you want a refresh on that have a look at my [introductory article on Cloudformation](https://ig.nore.me/2014/08/the-first-babysteps-with-cloudformation/).

Now all that you need to do is add this new security group to all your cloudformation templates. Even if you don't use cloudformation for your other servers you can add the security group manually and it will still work the same way.

# use-previous-template

With a central security group set up you just need to update it from where you are. It's easy to do this using the [AWS Console](https://aws.amazon.com/console/) or using an [app](http://pocketconsoleapp.com) from your mobile device.

But where's the fun in that? While you might not always have a choice, if you're on your own laptop there are more interesting methods that don't involve needing to look up your current IP address.

In the SSH Security article I mentioned a script that I use for this purpose and I've updated that to deal with this new situation. While doing so I discovered that the CLI now has an interesting feature, the `--use-previous-template` flag.

This does pretty much what it says, and allows you to update a cloudformation stack without the need to describe its template. As we will only need to update the existing template with a new IP address that is exactly what we want here.

```bash
externalip=`curl -s checkip.dyndns.org | sed -e 's/.*Current IP Address: //' -e 's/<.*$//'`
echo "Current IP is: ${externalip}\n"
echo "Updating Personal Access template with current IP address"
aws cloudformation update-stack --stack-name personal-access --use-previous-template --parameters ParameterKey=AccessIP,ParameterValue=${externalip}/32 --profile blogs
}
```

The script starts by collecting your current IP and has some output, but most importantly you can see that the call to the AWS CLI doesn't pass in a template but uses this new flag. If you want a separate script for closing access down (useful if you're done with your work in a public place) you can run the same command without supplying the `AccessIP` parameter.

I'm not sure how long this flag has been part of the CLI, but I'm very happy that it is there now as it makes this sort of thing a lot easier.
