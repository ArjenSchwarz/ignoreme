---
title:        Automating Link Collection 
slug:       automating-link-collection
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2017-10-04T22:41:48+11:00
categories:   "Workflows"
Description:  "When I write something on this site I often refer to a previous article. So today I'll be detailing how I've made my life easier to do so on both iOS and macOS."
---

When I write something on this site I often refer to a previous article. So today I'll be detailing how I've made my life easier to do so on both iOS and macOS.

# Hugo

In my article about [Hugo Output Formats](/2017/05/json-feed-and-hugo-output-formats/), I explained how easy it is to create a JSONfeed output. When I did so, I realized this might also help me with the issue of getting links to old articles. Using the RSS feed I could already do so for the last 10 articles, but that doesn’t help me with older ones. True, it’s not that much work to open the site and look for the article I want, but it does take me out of the flow of writing.

So, I added an extra JSON output named `links.json`. This feed is a simple JSON object of key-value pairs, with the date[^1] and title as the key and a relative link as the value. It also goes all the way back to the very first thing I’ve written here and of course it’s constantly updated. 

```json
{
  {{ range $index, $item := .Data.Pages }}{{if $index}}, {{end}}"{{ .Date.Format "2006-01-02" }}: {{ .Title }}": "{{ .RelPermalink }}"{{ end }}
}
```

The above snippet is the entire template, which as you can see is very straightforward with only the need to not have a comma at the end complicating the layout.

# iOS Using Workflow

Most of my writing is done on the iPad, using [Ulysses](https://itunes.apple.com/au/app/ulysses/id1225571038?mt=8&uo=4&at=1000l9pK&ct=ignoreme), so I wanted an easy way of getting access to this. Luckily Workflow is perfect for just this kind of task[^2] as it allows you to create today widgets. This means I can build a workflow that lets me trigger it to display a list my articles from anywhere, and if I click on the article I want it will give me the link I need.

![iOS-article-workflow](/img/posts/2017-10-03-iOS-article-workflow.png)

After some trial and error, the above workflow[^3] came into being. Because Workflow doesn’t maintain the order of keys in a JSON object, I do a sort in here based on the name. Which is indeed the reason I prefix this with the publication date. After this, it’s just a matter of showing the list and putting the result on the clipboard. When run from the widget it then looks like below.

![iOS-select-article](/img/posts/2017-10-03-iOS-select-article.png)

Of course, I sometimes want the ability to search for matches but that’s where a limitation of iOS rears it’s ugly head. It’s easy enough to add a filter, in fact the below image shows the only change that needs to be made for it. Just a simple filter, and obviously an Ask for input box.

![iOS-article-filter](/img/posts/2017-10-03-iOS-article-filter.png)

However, text input is not allowed from today widgets so triggering this workflow will open up the Workflow app. Which makes it less ideal as it takes me out of the flow, and because of that I  usually end up looking through the list. 

One alternative to this that I've played around with is by letting it filter based on the contents of my clipboard. This works as expected and at times is more convenient, but the need to put something in the clipboard just to search is annoying.

# macOS Using Alfred

While most of my writing happens on iOS, there are times I prefer to do so on my Mac. Obviously I want to have the same ability there. The solution I eventually ended up with uses [Alfred](https://www.alfredapp.com). In case you're not familiar with Alfred, it's a replacement[^4] for Spotlight that does a lot more by default and also allows you to build your own workflows[^5] for running custom actions.

One of these custom actions is a [script filter](https://www.alfredapp.com/help/workflows/inputs/script-filter/json/). A script filter lets you write a script which results in a particularly formatted JSON object that can then be filtered. The resulting output can then be pushed to the clipboard and even automatically pasted in the active application.

![macOS-Alfred-workflow](/img/posts/2017-10-04-macOS-Alfred-workflow.png)

As the Hugo feed I built was designed for my iOS solution, it doesn't quite match the requirements here. However, on the Mac I've got far more options available and the one that matches here is [jq](https://stedolan.github.io/jq/). It's been a while since I last mentioned the tool, but it can still solve most of my JSON related issues with its powerful parser. And in fact, that was the case here as well.

```bash
curl -s https://ig.nore.me/links.json | /usr/local/bin/jq '{"items":[to_entries | .[] | .["title"] = (.key | split(": ")[1]) | .["subtitle"] = (.key | split(": ")[0]) | .["arg"] = .value ]}'
```

The above line is the only one that the script filter needs. It retrieves the links using `curl` and then passes it to jq[^6]. jq then turns this data into key, value pairs using `to_entries`, which in turn is then added into an array. This array is looped over so that we can split out the title and subtitle from the key, and the link as the argument that gets passed to the next action.

![macOS-Alfred-results](/img/posts/2017-10-04-macOS-Alfred-results.png)

And all this then combines into a useful search functionality.

# Future improvements?

As it stands right now, I'm quite happy with these solutions. While the iOS one isn't as good as I wish, it does do most of what I need and my wish for text entry without opening the app simply isn't possible in iOS right now. Maybe that will change if Apple incorporates Workflow into the OS.

The only thing I can think of that would improve on the current situation is a full-text search on the contents of the articles. However, this is not something I need often and I can always do a search in the repo for those times it comes up.

[^1]:	Formatted as year-month-day.

[^2]:	And so far Apple hasn’t killed it yet after they [bought it](/weekly-notes/week-13-2017/).

[^3]:	Yes, talking about my workflow using a workflow in Workflow does sound silly. Unfortunately that’s what it’s called.

[^4]:	Technically speaking, you can run it alongside Spotlight.

[^5]:	Yes, that word again.

[^6]:	jq requires the full path because bash scripts run without environment information