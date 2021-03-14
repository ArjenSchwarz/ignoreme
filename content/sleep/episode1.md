---
Title: AWS VPC basics
slug: 1
date: 2021-02-25T20:06:19+11:00
author: Arjen Schwarz
Categories:
  - AWS
  - Opinion
Tags:
  - aws
  - vpc
summary: "In this very first episode of Arjen Without Sleep, I give a short overview of what a VPC is and how it works."
FrameEmbed: "https://share.transistor.fm/e/d248a6e1"
---

In this very first episode of Arjen Without Sleep, I give a short overview of what a VPC is and how it works.

You can listen to the episode above (you will need to be on the website, it doesn't work over RSS or email) or of course subscribe in your podcast player of choice. As it was only submitted to Apple's Podcasts library a couple hours before this post went up it likely isn't available yet in any player that uses that as their backend. Feel free to subscribe directly to [the RSS feed](https://feeds.transistor.fm/arjen-without-sleep) though.

## A brief introduction

Usually these posts will only show the transcript and additional shownotes and links. As this is the first one however, I'll include a short explanation.

This podcast came about when I discovered by accident that my daughter tends to fall asleep when I talk about cloud related things. Whether that's because I'm boring when I do so or because she doesn't like the subject is left as an exercise for the reader.

So, I figured I could use that as there are times where all the usual measures (playing, reading, singing, etc.) have been exhausted but she still isn't asleep. I then pick her up, put in my Airpods, start a recording and start talking. If you think that the quality isn't great, that's why. This isn't recorded in front of a nice microphone while sitting still.

Despite the fact that these episodes are all around 10 minutes long, that doesn't actually mean she falls asleep in that time. Generally I record somewhere between 25 and 40 minutes. I just cut out the times where I talk to her in Dutch, where she starts crying, or other interruptions that don't add anything to the episode.

In hindsight I noticed that this particular episode is edited a bit too much as you can barely hear her at all. That will change from the next episode, but I didn't want to either do over the editing or randomly insert noises.

I'll be honest. I hope this podcast will update rarely and infrequently as it means everyone in the house is getting sleep. However, at this point I've recorded 6 episodes already and will likely release these at a rate of 2 per week.

A final note about the trancscript. This is completely done by me. I wanted to use Transcribe to do this automatically, but unfortunately that has issues with my accent.

## Shownotes & Links

Links to relevant documentation:

* [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
* [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
* [NAT Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)
* [NAT Instance](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html)
* [Route Table](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html)
* [Security Groups](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
* [Network ACL](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)

## Transcript

Hello and welcome to Arjen Without Sleep. A podcast where, while carrying a little human around, I try to make her fall asleep by talking about all things cloud. Topics for this podcast will range from beginner to advanced, depending on how awake I am, or how much sleep I did not get.

Today's topic is going to be a foundational one, where I will talk a little bit about "what is a VPC?"

A VPC in AWS is a Virtual Private Cloud. Obviously, that's what the acronym stands for, because AWS loves its acronyms. But what is a VPC? A VPC is, it basically says it in the name, it looks like a network, your own little network that you can put different kinds of resources in. Most commonly, obviously, that would be EC2 instances, or databases running RDS, or similar services.

Now, a VPC basically consists of different subnets. No, let's take a step back. A VPC is a network, you give it a size, defined by a CIDR range. A CIDR range is something you're probably familiar, which iss the four dot-separated numbers that generate an IP-address followed by a slash and a block size. Where 0 is the highest, biggest, and 32 is just a single IP address. In the case of a VPC the biggest size you can get is a /16. This offers quite a lot of IP addresses so you don't have to worry that you'll run out of them quickly.

However, just a VPC doesn't help you in any way. To be able to use a VPC, you have to cut it up into what is known as subnets. These subnets are portions of that CIDR range that you assign to a specific Availability Zone within an AWS Region. An Availability Zone is basically a physical location that consists of one or more data centres, run by AWS.

Obviously, as I just said, the subnets themselves have a CIDR range that is smaller than the one from the VPC. You can have as many subnets as you wish. They can have different sizes, you can theoretically put them all in the same Availability Zone, although that would kind of defeat the purpose.

Now, there are two kinds of subnets. We call these public subnets and private subnets. A public subnet is directly connected to the Internet, through an Internet Gateway. An Internet Gateway, well, if we look at our house here we've got an NBN box that connects it to the Internet. Think of that as the Internet Gateway. Except that the Internet Gateway is obviously a lot faster.

Within a public subnet, if you put anything in there it needs to have a public IP address, otherwise it can't access anything on the Internet. Which kind of defeats the purpose of putting it in a public subnet in the first place. Now, best practice is that you don't put your instances, and especially your databases, in a public subnet. Public subnets are mostly meant just for things that need to be available directly from the Internet. Think of Load Balancers and as well, the other important part here, NAT Gateways or NAT Instances.

So, NAT Gateways actually brings us to the other type of subnet: private subnets. A private subnet is a subnet that does not have a direct connection out to the Internet. Instead, what it has is a connection to for example a NAT Gateway. NAT Gateway allows a transition from your private network to the public Internet. So, instead of connecting directly to the Internet, all the traffic from a private subnet will go through a NAT Gateway or NAT Instance in a public subnet.

This means that all your private instances do not have their own public IP address. When they make an outbound call they will get, or it will show up, as the IP address of the NAT Instance or the NAT Gateway.

I realise I've mentioned NAT Instance and NAT Gateway a lot interchangeably, that's basically because they're two ways to have a NAT. NAT Gateway is the managed service from AWS, that gives you access to the public Internet, and a NAT Instance basically does the same thing but you manage the instance yourself. There are pros and cons to both solutions, but in most cases it's easiest to just stick with the NAT Gateway because you don't have to think about it, you don't have to patch the instances, it will automatically scale, and if you eventually do run into limitations with it you, well, you will be running at such a high scale of network traffic you will likely have, or know somebody, have someone in your team able to deal with that.

Okay, so, I've briefly gone over VPC, subnets, private subnet, public subnets, but I didn't explain how instances know what to do. Because you can have a private subnet, but how does an instance in there actually know it needs to connect to a NAT Instance to connect to the outside world? For that we have something called Route Tables.

Route Tables are basically like a telephone book for your network. And your EC2 instances will always look at those Route Tables to see where to send traffic. A route consists of a CIDR range, that's the range I mentioned before, and the one range that is always present in a Route Table is the CIDR range of your VPC and that is mentioned as local.

That means that it always knows that "hey if I need something from my CIDR range I will do it in my local network". That means they don't have to go look for it, it's all around there.

The other big one though is 0.0.0.0/0. Which, as you can probably imagine, basically means "everywhere". This is the route that you need to connect to the rest of the Internet. So, in a public subnet that route will point to the Internet Gateway. In a private subnet it will point to one of your NAT Gateways.

Just a tip here, make sure that you've got NAT Gateways in all of your Availability Zones, so that the traffic doesn't have to cross to another Availability Zone. That always incurs extra charges. Basically network and traffic costs are a headache to get your head around. And if you don't have much traffic you won't feel like it makes a lot of difference as it won't be a big part of your cost, but the more data you transfer the more those costs will go up.

So, generally speaking, in a very simple setup you would have NAT Gateway deployed to public subnets in each Availability Zone and your private subnets will point to the relevant NAT Gateway for that Availability Zone. Now, this can all go way for complex, but I'm not going into that today as you can connect to other VPCs in various ways and you can connect Network Firewall, which is a new service from AWS, or other firewalls that run on instances. There are plenty of vendors that offered services like that long before AWS had theirs. But that's more for a different day.

There's two other things that I would like to mention. Both of these have to do with the connections within your network. Or rather, making sure that things can or cannot connect to each other. These are Security Groups, think of these as a firewall on your instances.

For a security group you open inbound traffic and outbound traffic. This can be so you allow it from a CIDR range or from a different security group. For example a common pattern I mentioned earlier is Load Balancers. A common pattern is that you have a security group on your Load Balancer that allows incoming traffic on ports 80 and 443, for HTTP traffic and HTTPS traffic. And those are the only ones you have open, which means that no other types of traffic can be sent to it.

However, your Load Balancer then passes this on to your instances. To keep this as secure as possible what you would do is to open the security groups on your instances only on the relevant port, which could be port 80 for example to serve your website. But you would only open this to the security group on your Load Balancer. This way, that is the only traffic that goes into your instance and you know that can only come from your Load Balancer. And on your Load Balancer you can have extra measures like a WAF, Web Application Firewall, or things like that. So that's one layer of protection.

Another one are NACLs, Network ACLs, Network Access Control Lists, however you prefer to call them. These function a bit like security groups but are at the subnet level instead. So you block things there in a much broader way. This way for example you can block access to and from different VPCs. I said I wouldn't go into that, but it's one common pattern. By default, when you create a VPC, these will all be open and that's a big difference as well with security groups.

There is of course a lot more to it, this was a basic overview for VPCs. As I'm now lucky enough that the little girl has fallen asleep I'm going to put her back in bed and I'll speak to you all next time.