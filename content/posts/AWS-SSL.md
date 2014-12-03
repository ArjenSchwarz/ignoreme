---
title:        Setting up SSL for an ELB  
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2014-12-04T08:32:57+11:00  
date started: 03-12-2014  
date posted:  04-12-2014
categories:   ["aws"]
slug:         "setting-up-ssl-for-an-elb"
---

Enabling SSL on an Elastic Load Balancer in AWS is fairly straightforward and [well documented][1], but that’s only one part of the whole process. When I needed to set it up again last week I figured that this time I would document the entire thing, from getting the keys to incorporating it into a CloudFormation template. 

# Step 1: Get the required keys and certificates

I’m not going to explain how to get an SSL certificate, while [by next year][2] we should be able to get one easy and for free at the moment there are many different providers.

Depending on your certificate provider this requires some steps including filling out all the details you need and possibly clicking on a confirmation link in an email. It’s a fairly boring process to be honest.

You’ll end up with several keys and certificates, 3 of which you’ll need:

* the SSL certificate,
* your private key,
* and a [root or CA key][3]

This last one is optional, but if your provider offers it you should add it.

AWS demands that everything is [PEM encoded][4]. Depending on the process, your private key might not be PEM encoded but this is solved by running a simple command:

```
openssl rsa -in privatekey.key -outform PEM -out privatekey.pem
```

This command takes the key named `privatekey.key` and transforms a copy of it into a pem encoded key named `privatekey.pem`.

# Step 2: Register the certificate at AWS

Next up is registering the certificate at AWS so you can use it. All this involves is uploading it to your AWS account as shown in the [documentation][1] . This can be done using the AWS Console, but of course I prefer to use the CLI.

With all 3 files in a single directory we run the following command:

```
aws iam upload-server-certificate --server-certificate-name “ignoreme-2014-12-03-2016-12-03” --certificate-body file://certificate.pem --private-key file://privatekey.pem --certificate-chain file://rootca.pem --profile demo
```

Let’s break this command down into parts to explain it.

`aws iam upload-server-certificate` is the actual command being run. The certificates fall under IAM, and the name of the command is clear.

`--server-certificate-name “ignoreme-2014-12-03-2016-12-03”`, here you define the name of the certificate. How you name it is up to you, but do yourself a favour and use clear names. In this case I chose a name that tells me it is a 2 year certificate for this site.

`--certificate-body file://certificate.pem --private-key file://privatekey.pem --certificate-chain file://rootca.pem` are all parameters that provide the location of the documents that need to be uploaded. 

`--profile demo` I’ve mentioned in other articles. This is to tell AWS that we’re using the profile configured with the name demo.

After running this command the output will contain the [ARN][5] of the certificate. You will need this for the CloudFormation template.

# Step 3: Add it to the CloudFormation template

As explained in my [babysteps article][6] I use a DSL for CloudFormation templates. That is why the below examples are written in ruby. To keep it brief I’m also only showing the relevant sections.

There are two parts to this, first you need to make sure that your ELB can be accessed on port 443 as that is the default port for SSL connections. We do this by adding an additional `SecurityGroupIngress` value for the SecurityGroup.

```ruby
  Resource("ElbSecurityGroup") {
    Type "AWS::EC2::SecurityGroup"
    Property("SecurityGroupIngress", [
              {"IpProtocol" => "tcp", "FromPort" => "80", "ToPort" => "80", "CidrIp" => "0.0.0.0/0"},
              {"IpProtocol" => "tcp", "FromPort" => "443", "ToPort" => "443", "CidrIp" => "0.0.0.0/0"}
            ])
    Property("SecurityGroupEgress", [{"IpProtocol" => "tcp", "FromPort" => "80", "ToPort" => "80", "CidrIp" => "0.0.0.0/0"}])
  }
```

The line `{"IpProtocol" => "tcp", "FromPort" => "443", "ToPort" => "443", "CidrIp" => “0.0.0.0/0”}` ensures that the whole world can reach the ELB over port 443. As you can see, I don’t add the same to the `SecurityGroupEgress` as we’re not going to communicate with the EC2 instances over port 443 but leave that communication insecure. While technically it is possible to add the SSL certificate to the instances as well this generally isn’t necessary.

```ruby
  Resource( "ElasticLoadBalancer") {
    Type "AWS::ElasticLoadBalancing::LoadBalancer"
    Property("SecurityGroups", [Ref("ElbSecurityGroup")])
    Property("Listeners" , [{
             "LoadBalancerPort" => "80",
             "InstancePort" => "80",
             "Protocol" => "HTTP"
            },
            {
             "LoadBalancerPort" => "443",
             "InstancePort" => "80",
             "Protocol" => "HTTPS",
             "SSLCertificateId" => "arn:aws:iam::1234567890:server-certificate/ignoreme-2014-12-03-2016-12-03"
            }])
  }
```

In this snippet you will notice that just allowing access through the SecurityGroup isn’t enough and we need to make the ELB listen to port 443 as well. Looking at the second listener you can see how we configure it to connect to port 80 on the EC2 instances for anything that comes in on port 443.

The protocol is set to HTTPS as well (the default for port 443), and that means that the `SSLCertificateId` value is required. You have to provide this, or your CloudFormation template won’t validate. You fill in the ARN that was returned when you ran the command earlier or look up an existing one with `aws iam list-server-certificates`.

And that’s it. I can now deploy this CloudFormation template and in two years I can go through the same steps  and update the CloudFormation stack with the new CertificateId to ensure the servers have a valid certificate.


[1]: http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/US_UpdatingLoadBalancerSSL.html
[2]: https://www.eff.org/deeplinks/2014/11/certificate-authority-encrypt-entire-web
[3]: https://en.wikipedia.org/wiki/Certificate_authority
[4]: https://en.wikipedia.org/wiki/Privacy-enhanced_Electronic_Mail
[5]: http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html
[6]: http://ig.nore.me/2014/08/the-first-babysteps-with-cloudformation/