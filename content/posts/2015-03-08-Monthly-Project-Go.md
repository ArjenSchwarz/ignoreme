---
title:        "Monthly project: Golang"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2015-03-08T19:13:06+11:00   
date started: 08-03-2015  
categories:   ["golang"]
series:       ["Learning Golang"]
slug:         "monthly-project-golang"
Description:  "In an attempt to stop my mind from constantly jumping to the next interesting thing I encounter, I decided to start doing monthly research projects. I'm starting this with something that has been on my list for quite a while now, learning the language Go (or Golang as it's often called)."
---
# Monthly project: Golang

In an attempt to stop my mind from constantly jumping to the next interesting thing I encounter, I decided to start doing monthly research projects. What that means is that I'll be spending a month looking into and learning a single subject. In some cases this will be one big thing, like learning a new programming language, and sometimes a collection of related smaller things.

The plan is to give weekly updates on my subjects, and to have something to show for my work at the end of the month.

I'm starting this with something that has been on my list for quite a while now, learning the language [Go][1] (or Golang as it's often called). To be completely honest, I actually started looking into the language properly a couple of weeks ago (disregarding a bit of time I spent on it last year, most of which I've since forgotten).

This first post about is my introduction to what I wish to achieve, and later today I will put up an article with my current status.

# What is Golang?

Go is a programming language developed by Google. The names Go and Golang are both used to describe it with Golang being the more useful when you wish to search for it on the internet. After all, searching for the word `Go` is unlikely to always give you the result you're looking for. Instead of repeating the information on the official site <http://golang.org> or [Wikipedia][2] I will give my opinion about it.

It's a modern language that seems to be best suited for command line and API usage. While it is certainly possible to put a user interface on top of it, and the [latest version][3] even offers some basic support for running on Android, that's not where its strengths are. 

As a server based language Go is well suited because it makes it really easy to work with APIs as it can parse markup like JSON or XML into objects (structs in Go parlance) with a single command. But in my opinion the main advantage of Go is how easy it is to do concurrency. For this Go uses something called [goroutines][4] which allows you to easily make many calls at the same time. Later this month I will show examples where I'm using this, but for the SDK itself this will not be used.

# The goal

The only real way to learn a programming language is to build things. While you can read as much about it as you like, and even work on some of the basic problems, you don't get to really understand it until you use it solve a problem you have. Luckily (I guess), I always have problems I want to solve, and so I will try to solve at least one of them using Go during this month.

## Bugsnag

[Bugsnag][5] is an error collection service. Basically, you implement their error notification API in your application and they will receive copies of these errors, display them for you, and show you a lot of context around them. This part of the service is great, and works very well.

However, I have an issue with the way they display their error information. To be precise, I don't like that you can only have an overview of the errors that occur at a project level. What I would really like is to have a dashboard that shows all of my projects that have outstanding errors, and how often these occur.

My initial goal therefore this month is to solve that, but do more than just that. Apart from their error notification API, Bugsnag also offers a [separate API][6] for their dashboard. The first step of my work is therefore to implement an SDK written in Go for this API, implementing all of its documented features. 

Only after I have completed this SDK will I then write a command line tool that uses the SDK to do various things, one of which will be storing the details for all projects and errors in a database so a dashboard can simply grab them and display them. This dashboard itself is outside of the scope of this project.

## Bonus goal

In case I'm finished with the Bugsnag implementation before the month is finished, I will also try to build a limited SDK for [Bitbucket][7]. The exact details of what I will do for that will depend on when I will be finished with Bugsnag, and I'll clarify my exact goal once that happens.


[1]: http://golang.org
[2]: http://en.wikipedia.org/wiki/Go_(programming_language)
[3]: https://blog.golang.org/go1.4
[4]: https://golang.org/doc/effective_go.html#concurrency
[5]: https://bugsnag.com/
[6]: https://bugsnag.com/docs/api
[7]: https://bitbucket.org
