---
categories: ["development"]  
author: Arjen Schwarz  
blog: ig.nore.me  
date: 2014-09-15T08:19:53+10:00  
title: And we've gone static  
slug: and-we-ve-gone-static  
Description: "As I actually started writing again for this site, I found that I just wasn't happy with Wordpress. I originally chose Wordpress because it was the path of least resistance, but it turns out that it doesn't suit my needs."
---

As I actually started writing again for this site, I found that I just wasn't happy with Wordpress. I originally chose Wordpress because it was the path of least resistance, but it turns out that it doesn't suit my needs.

# Why?

My biggest issue with Wordpress was that it didn't fit in with my workflow properly. While there is some limited support for Markdown in recent versions (and before that I used a plugin), it converts the Markdown into HTML when you save it. Also, because I create a separate file for each article I would then need to copy that into the Wordpress editor and publish it from there. 

All of this could be worked around, but it just wasn't worth the hassle. I also didn't use most of Wordpress' features, and besides doing a redev of the site sounded like a fun little project.

# Then what?

So, while there is the option of using another blogging system I figured I might as well go all the way and join the ranks of statically generated sites. At the time I was mostly familiar with two systems for this, [Jekyll](http://jekyllrb.com) and [Middleman](http://middlemanapp.com). Both are interesting options for building a site and offer a lot of useful things, but I never used either one.

While trying to decide which one to use, I asked around if anyone knew a good alternative. Which is how I was then introduced to [Hugo](http://hugo.spf13.com/). Hugo is "yet another static site generator", but written in Go. As I've been meaning to learn more about this language this immediately made it sound like something I'd like to play around with. The fact that it's ridiculously fast also helps. How fast? The below is output from [Wercker](http://wercker.com) which I use to build and deploy the site.

```bash
$ ./hugo
0 draft content 
0 future content 
17 pages created 
7 categories created
in 45 ms
```

While obviously I need to write more, the build time is almost ridiculously low.

# The nitty-gritty

Converting the site actually took a couple of weeks. A major factor for that is that I didn't spend as much time on it as I could, but of course I was also getting used to Go templates and Hugo itself. This wasn't helped by how the documentation for the project was updated before the new release. Once the latest version of Hugo was released, everything went a lot smoother as things I'd been trying to do suddenly worked.

It was well worth the time though as I learned plenty and it rekindled my interest in Go as a language. I've turned the site into a slightly leaner version of itself as well, and some of the things that annoyed me before now seem to work properly.

No doubt there are plenty of improvements that can be made, and there are quite a few less neat things in my themes and code right now. I decided to make it public anyway so if you're really interested you can have a look on [Github](https://github.com/ArjenSchwarz/ignoreme).

As far as hosting goes, I brought it down to two options: [Github Pages](https://pages.github.com) and [Amazon S3](http://aws.amazon.com/s3/) with [Cloudfront](http://aws.amazon.com/cloudfront/). While I could write all kinds of things about why I chose the AWS solution instead of Github pages there was really only one thing that mattered. Hugo, like apparently all static site generators, has the main RSS feed in a different place than my Wordpress blog had, and Github doesn't have an option for redirecting the old address while S3 does.

## Deployments

As I mentioned before, the actual deployments are handled with Wercker. Wercker allows you to set up both build and deploy steps for your projects and so far I'm very happy with the way it handles both of these.

Hugo is not a standard option yet in Wercker (I might create one though), but one great advantage of Go is that it packs all its dependencies in a single executable file. I'm not going to explain all the details of Wercker here, but in case you wish to set up something similar I'll share my setup for it.

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
    # Execute the s3sync deploy step, a step provided by wercker
    - s3sync:
        key_id: $AWS_ACCESS_KEY_ID
        key_secret: $AWS_SECRET_ACCESS_KEY
        bucket_url: $AWS_BUCKET_URL
        source_dir: public/
```

The build step is just a script where I download the latest release of Hugo, unpack it, and then run it. This can be cleaned up a bit, but it works so I'm happy with it for now.

The deployment itself is a copy of a Wercker blogpost about [deploying Middleman to S3](http://blog.wercker.com/2013/06/10/Streamlining-Middleman-Deploys-to-s3.html) so I'd recommend reading that post instead. It's all very easy, and now every time I commit to the master branch of the repository, the site is built and deployed automatically.

And that's it. The site should work fine, but I might need to do some finetuning in the future so don't hesitate to let me know if something isn't working right.