---
title:        "Introduction - Don't Ignore the AWS CLI"
slug:       dont-ignore-the-aws-cli-introduction
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2018-03-17T20:24:38+11:00
categories:
  - AWS
series: ["Don't Ignore the AWS CLI"]
keywords:
  - aws
  - awscli
Description:  "About two years ago, while waiting for my visa to come through, I started writing a book about the AWS CLI. I did a fair bit of writing on it, but life happened, and I forgot about it until recently. I've decided to finish the writing and start posting it here. "
---

About two years ago, while waiting for my visa to come through, I started writing a book about the AWS CLI. I did a fair bit of writing on it, but life happened, and I forgot about it until recently. I've decided to finish the writing and start posting it here.

While cleaning up what I've got, I'll be putting it all up here. As expected, it starts at the beginning so the first parts won't be exciting. Please bear with me, and hopefully you'll learn something once I'll dive into more advanced usage.

# Introduction

This extensive tutorial aims to make it easier to start using the AWS CLI and get the most benefit out of it. As the name implies, the AWS Command Line Interface requires the command line. Because of that, I assume you know how to access the command line on your computer. On Windows, this will be either Powershell, the command prompt, or even the Windows Subsystem for Linux. If you use macOS, you can use the Terminal application, and the same goes for Linux. As I'll try to explain everything, you don't need a lot of experience using the CLI, but some experience will make it easier.

After this introduction, we'll first go through the process of setting up the primary AWS CLI, followed by basic usage of this, before we introduce the AWS Shell. More advanced usage of the CLI tool is next, and at the end, we'll have a look at the broader AWS CLI ecosystem.

## Note for Windows users

Please be advised that while the primary AWS CLI works on all platforms, this will not be the case for every other tool mentioned. Some of these will only work on macOS or Linux, with no or limited support for Windows. If you have the Subsystem for Linux available in your Windows installation, it's probably a good idea to use that if you want to run the example scripts provided in later chapters. You can adapt these for use in Windows, but doing so is left as an exercise for the reader. Alternatively, you can use a Linux EC2 instance for running any commands.

## Why would you want to use the CLI?

As with everything, reasons for using something differ from person to person, but the best reason to use the AWS CLI tools is **saving time**.

AWS gives many options for interacting with their product: their web-based Console, their mobile apps, the AWS CLI tool(s), and their various APIs (programming interfaces)[^1]. Of these, the last two are the only ones that offer the possibility of automating your interactions. And of those two, the AWS CLI is the one that doesn't require being familiar with a programming language. Additionally, whereas the APIs need some[^2] work to get started, it is straightforward to get up and running with the AWS CLI.

So, what makes this automation so important? It's mainly to prevent anyone from doing repetitive tasks. Launching an EC2 instance with specific settings once is fine using the Console, but if you have to do it ten times it will quickly get very tedious to click the same buttons in the wizard over and over again. Automation helps to prevent this from happening, as you can make it so that you only have to do something once and then just rerun the same command.

Please note, that in this case I'm not even talking about scripts yet. Right now I mean automation in the broadest possible sense, where you don't need to go through the same actions over and over again. A shell, whether it's the terminal on your Mac or Linux PC or the Powershell on Windows, has a history of previously run commands. Using that history you can quickly retrieve previously used commands for repeating, or you can even save the commands you ran in a file on your computer to copy them out later. These are all valid ways of using the CLI tool's power and will result in less time spent on frustrating tasks[^3].

Hopefully, after reading the above you agree that automating your repetitive tasks is a good idea, but please be cautious with this as well. When using the Console, you will always get some confirmation message before you do something, whether it's creating a new EC2 instance, or deleting that RDS database that your company depends on. *With the CLI tool you don't get this confirmation request.*

There are ways to prevent accidental deletion of some resources, but you should still verify that you're about to run the correct command before you run it.

[^1]:	You can count CloudFormation as a way to interact with AWS, but in this case I'll count it as a product in AWS instead.

[^2]:	Not necessarily a lot, but you do have to figure out the libraries and how to set up a connection.

[^3]:	Unless you happened to forget where you stored that one command you need and then spend 3 hours looking for it. Try not to do that.
