---
title:        Writing on iOS
slug:       writing-on-ios
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2018-02-03T16:01:16+11:00
categories:
  - Workflows
keywords:
  - writing
  - ios
  - git
  - workflow
  - hugo
Description:  "As I've mentioned in the past, I do a lot of my writing on my phone and iPad. Things have changed there recently, and I wanted to write out some parts of this improved workflow."
---

As I've mentioned in the past, I do a lot of my writing on my phone and iPad. Things have changed there recently, and I wanted to write out some parts of this improved workflow.

# The Writing Part

There isn't much to say about this. I've been using [Ulysses](https://itunes.apple.com/au/app/ulysses/id1225571038?mt=8&uo=4&at=1000l9pK&ct=ignoreme) for quite a long time now. I really enjoy the way it allows me to write plain Markdown but also allows me to do things like adding images and notes, has features like writing goals, and can export to pretty much every format I require. Which means I can even write work-related documents in Markdown before I export them to Word or PDF.

# Putting It In The Blog

With a recent change in Hugo[^1], it is now possible to easily have images in the same place as your article.

![](/2018/02/writing-on-ios/112078C3-943B-4A6C-93F1-2F8F87D1245C.jpeg)

This has improved my workflow quite a bit as it means that instead of my previous way of doing things I can now simply export  my entire Ulysses sheet, including the images, directly. Previously I had to export the images separately and then paste in a Markdown link for them. There is still a slight issue with this, which I'll come back to in a bit.

The actual exporting is done by sharing the Ulysses sheet to [Working Copy](https://itunes.apple.com/au/app/working-copy/id896694807?mt=8&uo=4&at=1000l9pK&ct=ignoreme), which I believe to be the most capable git client for iOS. At this point there will usually still be a couple of changes that need to be made. In particular, code blocks within Ulysses don't support the  `````bash`` type language choice that I need for syntax highlighting. 

To make that change[^2] I will load the file in [Textastic](https://itunes.apple.com/au/app/textastic-code-editor-6/id1049254261?mt=8&uo=4&at=1000l9pK&ct=ignoreme) and make the changes there. As both Working Copy and Textastic have integration with Files (Apple's admission that file management is indeed useful) that means I can edit the file in place and changes are immediately ready to commit.

![](/2018/02/writing-on-ios/435FF488-572F-48C9-A035-77098EC82FB1.jpeg)

# The Image Issue

That just leaves me with a single issue, when a Ulysses sheet is exported it will add images as a proper Markdown link, but as the images are in the same directory it doesn't have a path in there[^3]. This is not an issue where it comes to seeing them on the website, but unfortunately the RSS feed then doesn't convert them to complete paths. Which will result in not having images if you read my writing through an RSS reader or by email.

Up until earlier this week that meant that I had to add the path manually in Textastic, an annoying task. However, [OpenTerm](https://itunes.apple.com/au/app/openterm/id1323205755?mt=8&uo=4&at=1000l9pK&ct=ignoreme), an open source sandboxed local terminal now supports opening directories from Files, and therefore the ability to make changes to files in those directories. This basically gives me the full power of a proper terminal, so instead of figuring out how to do it manually I can just run a `sed` command such as `sed -i -e 's$!\[\]($![](/2018/02/writing-on-ios//newpath/$' index.md` .

Except, I still need to know exactly what I'll need to put in there. So, I wrote a little workflow that allows me to get the full path based on the slug of the article I'm writing.

![](/2018/02/writing-on-ios/FCCA2A1C-F6D0-49B8-89A5-4CCFA5B871D7.jpeg)

It's very simple, with just an if-statement based on whether or not it's a weekly note[^4], but it allows me to quickly make the change I need.

# Why though?

Is all of this worth it? Wouldn't it be easier to just do this on a regular computer? Maybe. I'd still need scripts to do most of the same things. And in the end it's all about convenience. I like the ability to just write how and where I like. 

Whether it's standing in the train to work, sitting in the garden, or lying on the couch. In none of those situations a laptop would work as well for me and I don't want to switch to a different device just to do the last bits of work before I can upload it here.

[^1]:	Version 0.33 to be exact.

[^2]:	And others, like the requirement to have a newline after the final footnote.

[^3]:	And I suspect Hugo believes you should use its figure [shortcode](http://gohugo.io/content-management/shortcodes/) instead.

[^4]:	Other exceptions will be added when needed.
