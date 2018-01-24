---
title:        "Igor: Serverless Chatbot Competitor"
slug:         igor-serverless-chatbot-competitor
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-09-30T03:13:10+10:00
categories:   ["AWS"]
projects: ["Igor"]
keywords: ["competition", "serverless"]
Description:  "Almost 2 months ago, AWS announced a serverless chatbot competition. As I happen to have one of those lying around I decided to enter this competition."
---

Almost 2 months ago, AWS announced a serverless chatbot competition. As I happen to have one of those lying around I decided to enter this competition.

# What is Igor?

Igor is the Slack chatbot that I built. It is designed to run on Lambda, but it's possible to run it as a Docker container instead. I designed it to be run in your own AWS environment, plugin driven, and to be very configurable. This means that while I've made some decisions about how things look and what you can do, you can configure most everything else. Including which plugins are enabled, what the default values are for plugins, who can do certain actions, and you can even add your own language.

Originally, Igor was far more limited so I'm taking this opportunity to run through the current state of this little chatbot.

# Top level features

## KMS support

It is possible to encrypt all tokens in the config with KMS, and these will be automatically decrypted by Igor[^access].

[^access]: Assuming Igor has access to KMS.

## Language support

All text shown by Igor, and the commands it responds to, are configured in language files. This means that it listens to every language that has a file and will respond in that same language. As of this writing, the repository has 5 languages[^well4] configured:

* English
* Dutch
* Traditional Chinese
* Simplified Chinese
* Emoji

You can set your default language as well, this is the language that you will fall back to if a plugin isn't implemented in a certain language.

[^well4]: Well, 4 if you don't think emoji counts as a language.

## Blacklist/Whitelist

You can blacklist or whitelist the plugins you want to have enabled.

## Configuration

The configuration can be provided as a file in YAML or JSON, or as an environment variable in JSON.

## Shout!

Many of the plugins show their information only to you, but if you prefix your request with an exclamation mark **!** everyone can see it.

# Plugins

A short overview of the different plugins.

## Help

The Help plugin helps you. It shows you what commands are available to you and can introduce itself. Aside from that it can also show you information about yourself and the channel you're in. This last one is useful for example if you want to restrict access to certain functionalities by user ID instead of name.

## (Random) Tumblr

This plugin shows you a random entry from a Tumblr blog that you configured.

## Remember

The Remember plugin lets you save the link to an image and then call it up again at a later time. This also allows you to define people as admins who can remove links or blacklist people from being able to save a link in the first place[^notsolution].

[^notsolution]: Of course, that won't stop them from just pasting the link into the channel.

## Status

If you want to know the status of a webservice, or even if a site is down, the Status plugin is what you want to use. You can specify which services should be shown in the main overview and for AWS you can get all of the details.

## Weather

You can check what the weather is right now or request a forecast for a specific city. If you don't specifically ask for a city, Igor will check what the default city is for your Slack, or even the channel that you're in.

## XKCD

Everybody loves XKCD, it's a great comic, and the XKCD plugin makes it easy to bring up that comic you liked so much.

# In conclusion

I glossed over all the settings of the various plugins, but they can all be read on the wiki. It is interesting that while I had a lot done already for Igor, I kept being distracted by other things during the competition period. Because of this I didn't add all the functionality I was hoping to add. Nevertheless it was fun, and I'm looking forward to adding more things to it in the near future.

I am particularly fond of the language support, and pretty happy with how I built that. It's the first time I've built this sort of thing into one of my side projects and I think I did a decent job of it. The user and channel specific functionalities were also fun to work on.

Below is a short demo of what it looks like to use, or you can watch it on the [competition page for Igor][comppage].

[comppage]: http://devpost.com/software/igor

{{% youtube QtNdC8LsWso %}}
