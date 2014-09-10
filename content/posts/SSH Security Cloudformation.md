---
Title:        Securing SSH access with Cloudformation  
Blog:         ig.nore.me  
Author:       Arjen Schwarz  
Date:         2014-08-10
Date started: 10-08-2014  
Date posted:  10-08-2014  
Categories:   ["aws"]
Slug:         securing-ssh-access-with-cloudformation
Aliasses:     ["/aws/2014/08/securing-ssh-access-with-cloudformation"]
---

In order to improve security for my EC2-instance, but still keep it useful, I came up with a script that automatically opens up SSH access for my current IP address.

# Why did I do this?

Yesterday I decided to take a look at the Trusted Advisor in the AWS console (at least the part of it that Amazon has made freely available). Most of what I found there wasn't a big shock, but one of them stood out to me: I left the SSH port on my EC2 instance open to the whole world.

Of course, when I did that I had a perfectly valid reason for it, as I wanted to be able to access my EC2 instance from anywhere. As access is limited by an SSH key anyway that seemed good enough. Of course, good enough isn't. So that needed to change.

# How did I do it?

The easiest solution was of course to restrict access to my IP address, and that's how I started. This meant I needed my external IP address. Easy enough to find, but as usual a bit of a hassle to go to the [whatismyip.com website][1]. So, after finding my IP and updating the security group in my CloudFormation configuration, I decided that was enough and I made a [TextExpander][2] snippet to find the IP for me in the future.

```language-bash
#!/bin/sh
/bin/echo -n `curl -s checkip.dyndns.org|sed -e 's/.*Current IP Address: //' -e 's/<.*$//'`
```

Useful of course, but not the main reason for this article. The result of my changes so far was that I couldn't access the EC2 instance from anywhere other than home. At least not without changing the IP address in the CloudFormation template and updating it again.

This could be done in an easier way. I just had to change the CloudFormation template so that I could provide the IP as a parameter.

```language-json
  "Parameters" : {
      "SshIp" : {
         "Type" : "String",
         "Default" : "10.0.0.0/24",
         "Description" : "IP address that should have direct access through SSH"
      }
```

By default it is set to only receive SSH connections from within its subnet, but I can override that by providing the IP address I want to have access. This of course is standard CloudFormation stuff, but it's also just the first step.

Combined with the TextExpander snippet I now had a fairly easy way to enable SSH access from my current IP, but it could still be easier. So, I wrote another function to include in my [oh-my-zsh config][3].

```language-bash
# Update the cloudformation stack with my current external IP address
blogcfssh() {
  externalip=`curl -s checkip.dyndns.org | sed -e 's/.*Current IP Address: //' -e 's/<.*$//'`
  echo "Current IP is: ${externalip}\n"
  echo "Updating blog cloudformation template with current IP address"
  cd ~/projects/server_personal; aws cloudformation update-stack --stack-name blog-server --template-body file://cloudformation-generated.json --parameters ParameterKey=SshIp,ParameterValue=${externalip}/32 --profile blogs
}
```

Using the above function, I retrieve my current IP address and fill it in as the parameter for the CloudFormation stack. This means that all I need to do to gain SSH access from my current location is to run `blogcfssh`. And as I have a similar function for updating the stack with just the default values, I can just as easily close this access.

# Improvements

This script isn't perfect yet, as it's too dependent on my current setup. Instead the CloudFormation template should be retrieved from an S3 bucket to ensure it works from everywhere. It would also be nice to have it automatically check if the update has finished and inform me of that.


[1]: http://www.whatismyip.com
[2]: http://www.smilesoftware.com/TextExpander/index.html
[3]: https://github.com/ArjenSchwarz/oh-my-zsh/blob/master/plugins/blogs/blogs.plugin.zsh