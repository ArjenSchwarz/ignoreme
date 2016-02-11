---
title:        Hugo build step for Wercker  
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2015-01-03T17:28:01+11:00   
date started: 03-01-2015  
lastmod:      2016-02-11T18:17:39+11:00
categories:   ["Development"]
slug:         "hugo-build-step-for-wercker"
Description:  "I mentioned that I was planning on building a step for making it easier to deploy Hugo sites using Wercker, and I've done so."
ogimage:      "https://ig.nore.me/img/posts/hugo-build.png"
---

I mentioned that I was planning on building a step for making it easier to deploy [Hugo](http://gohugo.io) sites using [Wercker](http://wercker.com), and I've done so.

![Showing Hugo Build in Wercker](/img/posts/hugo-build.png)

If you're familiar with both Hugo and Wercker, all you require to know is that the step is called `arjen/hugo-build` and you can easily find it in the Wercker steps repository.

<div class='ignoreme-update'>
<strong>Update February 11, 2015:</strong> This article describes the original work and functionality of the plugin. For an up to date tutorial please see the <a href="http://bit.ly/1C1CV10">Hugo documentation.</a> Similarly, for advice on deploying a Wercker site to GitHub please read <a href="/2016/01/deploying-a-static-site-to-github-pages/">this article.</a>
</div>

# Short Wercker introduction

Wercker is a continuous integration tool. This basically means you can make it do all the hard and boring work for you that you don't really want or need to do. 

It does this by using steps. These steps can be anything from running jshint to building entire applications.

# What does this step do?

The step I built is a fairly simple one. It will download the specified version of Hugo, and then build your site using that version. In fact, if you look at the [source code](https://github.com/ArjenSchwarz/wercker-step-hugo-build/blob/master/run.sh) you can clearly see that it downloads a version of Hugo, unpacks it, and then runs the build command from that binary.

# Why would I want to use this?

Because it's easier. As you can see in the examples below, it makes deployments to GitHub Pages or any other type of site a lot easier. It also means that you don't have to be on your computer if you want to post an article as you can just push up your latest Markdown file to GitHub or Bitbucket and everything else is handled for you.

# What options are there for using it?

You can specify 3 different things:

## The version of Hugo

This one is fairly obvious, and I would recommend that you specify your version as otherwise you might run into a problem when the next version of Hugo is released and changes things around that you don't expect.

## The theme

If you use a theme you can specify this in the Wercker configuration as well.

## Any other flags

If you have any other flags you wish to use with the hugo command you can provide these as a single line in the config.

# Examples

The following two examples are from the configuration for this site as well as my other [travel log site](https://www.arjen.eu).

## ig.nore.me

This shows an example of building the site with my step, and then deploying it to Amazon S3.

```ini
box: wercker/default
build:
  steps:
    - arjen/hugo-build:
        version: 0.12
deploy:
  steps:
    # Execute the s3sync deploy step, a step provided by wercker
    - s3sync:
        key_id: $AWS_ACCESS_KEY_ID
        key_secret: $AWS_SECRET_ACCESS_KEY
        bucket_url: $AWS_BUCKET_URL
        source_dir: public/
```

## www.arjen.eu

This example builds the site once again using my step, but the deployment is to GitHub Pages instead.

```ini
box: wercker/default
build:
  steps:
    - arjen/hugo-build:
        version: 0.12
deploy:
  steps:
    - lukevivier/gh-pages@0.2.1:
        token: $GIT_TOKEN
        domain: www.arjen.eu
        basedir: public
```

## Using a theme and flags

The same example as above, but this time using a theme and optional flags

```ini
box: wercker/default
build:
  steps:
    - arjen/hugo-build:
        version: 0.12
        theme: redlounge
        flags: --disableSitemap=true
deploy:
  steps:
    - lukevivier/gh-pages@0.2.1:
        token: $GIT_TOKEN
        domain: www.arjen.eu
        basedir: public
```