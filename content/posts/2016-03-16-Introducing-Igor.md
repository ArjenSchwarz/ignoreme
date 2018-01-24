---
title:        "Introducing Igor"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-03-16T21:09:33+11:00  
categories:   ["Development"]
projects:     ["Igor"]
keywords: ["chatbot", "golang"]
slug:         "introducing-igor"
ogimage:      "https://ig.nore.me/img/posts/2016-03-16-igor-example.jpg"
Description:  "Over the past weeks I've been working on a new tool. Now, Igor has reached a state where I'm happy with showing it off and so it's time to introduce it to the world."
---

Over the past weeks I've been working on a new tool. Now, Igor has reached a state where I'm happy with showing it off and so it's time to introduce it to the world.

# Igor

I've been meaning to do some programming in Go, the programming language, for a while now but I needed a purpose. As I'm currently waiting for a new visa before I can start my next job I don't have any professional uses I can point Go at, which means I needed something for fun.

So, after thinking about it for a while I finally came up with the idea of building a Slack bot in Go, that runs on Lambda. And the result of this is [Igor](https://github.com/ArjenSchwarz/igor "Igor"). While it conveniently has the letters "go" in the name, the name is based on Terry Pratchett's interpretation of the classical servants that went by this name[^1].

# Why?

Aside from Go, Lambda has been in my sights as something I really want to play around with for a while. The concept of "serverless"[^2] computing feels like the future, and running within the constraints it therefore poses comes with its own challenge. So, that's why I wanted to build something on Lambda.

And then there is the Slack side of things. Now, I use Slack quite a bit to keep in touch with friends and am in several more specific groups as well (ones for Go and Wercker for example). Naturally bots already exist for it, but that shouldn't stop you from building something if you feel like it. Besides, there aren't all that many that run on Lambda[^3].

# What does it do?

Now, technically speaking due to the limitations of Lambda (only running for a short time) you can't build a proper bot as that requires a constant connection. So, instead what I did is create a slash command that just happens to accept a large number of commands and can be extended through plugins.

![](/img/posts/2016-03-16-igor-example.jpg)

This means that while it can't react proactively (do something  in reaction to events in the channel) Igor is capable of handling most other things you ask of it. Aside from the obvious things such as image search, weather forecasts, and checking whether GitHub is down that means you can theoretically have it carry out any commands you wish. For example, adding a task to Asana[^4].

# How does it work?

Using Igor from Slack is easy, and if you use Slack you're probably already familiar with the idea of slash commands. You simply call it with command like:

    /igor help
    /igor weather
    /igor status ig.nore.me

These are all simple commands, and in the backend each of these is handled by a different plugin. Every command is handled by a plugin, the only time you will get a non-plugin reply is if no plugin is found to handle the command[^5].

Another decision concerning these plugins is that they are designed to handle multiple commands. Simply because I don't see the point in having overlapping functionalities. In part this is a reaction to the limitations of Go. Or rather, the fact that Go is a compiled language. That means that unlike with Hubot, it's not possible to provide plugins separately but instead they have to be compiled into the main binary.

Because of this, I made the decision to make a lot of things configurable through the settings file. A good example of this is the (Random) Tumblr plugin. This plugin lets you collect an image and title from a Tumblr blog. Instead of having a separate plugin for every single Tumblr blog, it takes advantage of the fact that Tumblr blogs are very similar so you can configure them in the settings file. You'll still need to understand a little of what is needed, but the below code is from the example config file, and allows you to get images from the DevOps and Security Reactions Tumblrs through `/igor tumblr devops` and `/igor tumblr infosec` respectively. Running `/igor tumblr` on the other hand will randomly pick one of these configured blogs to pull from.

```yaml
randomtumblr:
  devops:
    name: DevOps Reactions
    url: "http://devopsreactions.tumblr.com"
    image_src: ".item img"
    title_src: ".post_title"
  infosec:
    name: Security Reactions
    url: "http://securityreactions.tumblr.com"
    image_src: "#posts .body-text img"
    title_src: "#posts .post-content .title"
```

The plugin can parse this and so knows exactly where to get the images it needs to display. This way it's really easy to add any Tumblr you want, without the need to download the source and write your own plugin.

As this article is meant to introduce Igor, I'm not diving into the internals yet. I'll leave that for a number of more technical posts I'm planning to write.

# Using Igor

If you wish to use Igor right now, that's certainly possible. I have it running for a couple of Slack teams now, and am writing new plugins all the time. Of course, I realise that setting up and configuring a Lambda function can be a bit of a challenge. Which is why I created a script that automates all of that[^6].

Additionally, every time some code is pushed up to the master branch it will automatically create a zip file with everything you need. After the initial setup that means an update consists of downloading this file, adjusting the configuration file, and uploading it to Lambda.

# Future work

While it works now, Igor is still pretty limited in its abilities. As I'm having a lot of fun working on it, improvements will be made continuously. That includes things like (better) documentation, internationalization, and of course more plugins. I also want to see if I can make it even easier to install and upgrade, so that a bare minimum of technical knowledge is required.

However, it's not necessarily a one person show. Anyone willing to contribute (whether with code, documentation,  bug reports, feature requests, or anything else) is certainly welcome to do so. And if you've given it a try, even just letting me know about your experience would be great.

![Demo](/img/posts/2016-03-16-igor-demo.gif)

[^1]:   I highly recommend reading the Discworld books if you haven't do so yet. It isn't necessary to read them in order either, and I would not recommend starting with the first ones anyway as they aren't nearly as good as the later books.

[^2]:   Technically there is still a server that it runs on, it just isn't running unless you call it.

[^3]:   As far as I know, there is one other that I read about last week when I'd already been using mine for a while, but that's written in NodeJS and it seems like you have to do everything inside the main index.js file. It's still interesting in its own way, but not for me.

[^4]:   Not actually a functionality that has been written at this very moment.

[^5]:   Obviously...

[^6]:   This script in itself was quite interesting, so there will be an article about that as well.
