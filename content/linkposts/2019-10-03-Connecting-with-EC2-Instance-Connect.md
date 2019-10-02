---
Title: Connecting with EC2 Instance Connect
Slug: connecting-with-ec2-instance-connect
date: 2019-10-03T08:12:43+10:00
Categories:
- AWS
Redirect: https://www.cmdsolutions.com.au/connecting-with-ec2-instance-connect/
keywords:
  - ec2
  - security
  - aws
Author: Arjen Schwarz
summary: "This is my first post on the CMD blog and is the first in a series of three concerned with connecting safely to an EC2 instance. In this first post I dive into the new-ish EC2 Instance Connect."
---

> Many of us have probably built tools that allow someone to use their own SSH key to access a server; I know I have. Instance Connect is the AWS solution for this. It lets you upload a temporary key to an instance and then immediately connect to it. And for two of the options, you don’t even need to use your own key.

This is my first post on the CMD blog and is the first in a series of three concerned with connecting safely to an EC2 instance. In this first post I dive into the new-ish EC2 Instance Connect.

CMD Solutions is the AWS focused brand within Mantel Group, which DigIO (my employer) is also a part of. Because of my status as AWS APN Ambassador, I represent CMD as well. Which also means that for some of my blogposts[^1], those focused on some small part of AWS for example, CMD is the better outlet. This is a good example of that.

[^1]: At least those that I write as a representive of my company. Obviously, the best place for anything I write is right here ;).
