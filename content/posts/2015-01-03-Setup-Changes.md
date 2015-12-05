---
title:        Changes to my setup  
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2015-01-03T12:55:14+11:00   
date started: 03-01-2015  
categories:   ["AWS"]
slug:         "changes-to-my-setup"
Description:  "Over the Christmas break I made some time to implement changes to my AWS setup that I've been thinking of. As this invalidates some of the things I've written about in other articles I felt I should point them out here as well."
---

Over the Christmas break I made some time to implement changes to my AWS setup that I've been thinking of. As this invalidates some of the things I've written about in other articles I felt I should point them out here as well.

# arjen.eu "Hugofied"

First of all, I moved my other site [www.arjen.eu](https://www.arjen.eu) to Hugo as well. I use that site for writing about my travels, and I'd gotten so fed up with the old Wordpress way of handling all of it that I wanted to work with it the same way as I do this site.

As I've already gone into details about how that works in a [previous article](/2014/09/and-we-ve-gone-static/) I'll skip the details. However, as doing things exactly the same is boring I did decide to make a small change and so I'm hosting it on GitHub Pages instead of S3.   
The Hugo documentation site has an extensive explanation of how to do all of this, but not only did it seem overly complicated to me it involved manually publishing the generated code. 

Obviously I'm not in favour of manually doing boring things that can easily be automated as that's the whole point of having computers. Luckily using [Wercker](http://wercker.com) this was even easier than doing it for an S3 bucket as all the work was already done through publicly available steps.

This means that I only needed to do a couple of things:

1. Push the code up to GitHub.
2. Set up my Wercker config.
3. Configure the DNS config for `www.arjen.eu` and `arjen.eu` to point to `arjenschwarz.github.io`.

The first and last step require no further explanation as only the Wercker config is interesting here, and even that is straightforward. Searching for github pages in the available Steps in Wercker yielded immediate results so I simply went for the most popular choice.

![The Wercker step I ended up using](/img/posts/wercker-gh-pages.png)

For the `wercker.yml` file I then copied the one from this site and changed the deploy steps to use the step I found as shown below.

```ini
box: wercker/default
build:
  steps:
    - script:
        name: build hugo
        code: |
          wget https://github.com/spf13/hugo/releases/download/v0.12/hugo_0.12_linux_amd64.tar.gz
          tar xzf hugo_0.12_linux_amd64.tar.gz
          cp hugo_0.12_linux_amd64/hugo_0.12_linux_amd64 hugo
          ./hugo
deploy:
  steps:
    - lukevivier/gh-pages@0.2.1:
        token: $GIT_TOKEN
        domain: www.arjen.eu
        basedir: public
```

And that's all that was required. From there it neatly publishes everything to the gh-pages branch, adds the CNAME config for my own domain and it all works smoothly. Most importantly, I just push my Markdown files up and don't need to deal with any manual building.

And now I've added to my todo list that I really should create a real Wercker step for it to make this easier in the future.

# No more assets.* domains

This was mostly a leftover from using Wordpress, but I didn't bother changing it yet for this site when I switched it over. In fact, I even [described](/2014/07/introduction-to-the-aws-cli/) having a shortcut that would allow me to upload an image and create a Markdown image tag for it.

To be fair, this was a bit silly and sheer overkill for sites like mine with barely any traffic and not that many assets either so I moved all the images into the sites (I did it for arjen.eu as well) and updated my old function to something simple.

```bash
# Just give me the Markdown'd URL in the clipboard
blogimg() {
  echo "![alttext](/img/posts/$1)" | pbcopy;
}
```

I might update this at some point to become a OS X Service or even just a TextExpander snippet. Or I'll make it do some more work like moving the file to the right directory. For now this will do.

# Shutting down my server, and booting it up again

All of this led me to a decision to make about my server. I've got various scripts for doing things to and with my EC2 instance, but most of what I used it for had to do with my blogs. Now of course, that is no longer a concern so I had to review my purpose for it.

The only thing I'm actively using the server for is various cronjobs, most of which have to do with [Slogger](https://github.com/ttscoff/Slogger). I still want to keep those cronjobs running of course, so completely getting rid of the server wasn't an option. However, as it's an EC2 instance there is of course the other option of only running it for an hour a day and thereby turning it into a dedicated cronjobs machine. For any other tasks I might need in the future I can easily spin up an extra machine for the period I need it.

Once again, no point in doing this manually so I went looking for a way to automate this. Unfortunately, I couldn't find a solution I could run myself that wouldn't require something to always be running during that period. Instead I turned to [Skeddly](http://www.skeddly.com) which has a free tier that allows you to turn on and turn off a server 31 times a month. Exactly what I need.

Skeddly requires access though, but you can configure this to the absolute minimum that is required. Which means you start with no permissions and all, and only add permissions afterwards that are required for the tasks you need. In my case, the only thing it can do is see, start, and stop EC2 instances.

Once you've walked through their configuration, you can then add a `Start instance` task.

![The general info for the Skeddly task](/img/posts/skeddly-dailyrun-general.png)

In there you set all the basic things, most importantly the time it should start the server. Here you should remember that AWS bills you by the hour. Which doesn't mean that if your server is up for 60 minutes you get charged for an hour, but that it checks for the actual hours on the clock. So if you run the server for only 5 minutes but start it at 11:57 and shut it down at 12:02 it will actually charge you for **2 hours**. Which is why I start mine at 11:01.

![Also set it to stop again](/img/posts/skeddly-dailyrun-stop-instance.png)

And instead of needing a separate task for stopping the instance again, we can configure it to stop after a certain period. In my case after 57 minutes, so that it will have a couple of minutes to shut down before AWS decides to bill me more.

As an extra detail, by default Skeddly has notifications set to *all*. Which means it will even send you an email if everything works as it should. I don't think this is good behaviour as it leads to email fatigue, but it's easy enough to change in your preferences.