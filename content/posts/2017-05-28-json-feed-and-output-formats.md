---
title:        JSON Feed and Hugo Output Formats
slug:         json-feed-and-hugo-output-formats
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:        2017-05-28T16:05:42+10:00
lastmod:     2017-05-30T22:00:49+10:00
categories:   ["Development"]
Description:  "Last week JSONFeed, an RSS/Atom alternative using JSON, was introduced and to me that seemed like a good excuse to play around with Hugo's new Output Formats."
---

Last week JSONFeed, an RSS/Atom alternative using JSON, was introduced and to me that seemed like a good excuse to play around with Hugo's new Output Formats.

# JSON Feed

[JSON Feed](https://jsonfeed.org) is exactly what it sounds like, an RSS feed using JSON and a standard format. Support for it at the moment is limited, with sites implementing it one at a time but with at least a couple of [feed](https://feedbin.com/blog/2017/05/22/feedbin-supports-json-feed/) [readers](http://blog.newsblur.com/post/160982162270/newsblur-now-supports-the-new-json-feed-spec) already supporting them. To be honest, the relatively quick uptake surprised me. There is plenty to complain about RSS or Atom feeds, as nobody I know actually enjoys working with XML, but hardly anyone actually has to build the feeds these days.

There are 2 main reasons for that, first is that an ever decreasing number of people actually use RSS feeds, instead trusting that anything really interesting finds its way to them. And the second reason is that RSS is built into every blogging platform available. Whether you use an application like Wordpress or a static site generator like Hugo, RSS comes out of the box and unless you want to make changes to it, it's there and it works.

The above article from Feedbin however shows that for feed readers it is a far better solution because of how messy the XML feeds usually are. So there is a chance that this will take off more than I expected, but even before feed readers supported it I already wanted to build a JSON Feed, simply because I can. As with everything when it comes to personal projects, if there is an excuse to play with something new I'll happily take it.

# Hugo Output Formats

In this case, that something new is Hugo's [Output Formats](https://gohugo.io/extras/output-formats/). Introduced in version 0.20, these allow you to more easily provide different types of output for your contents. Examples on the website are standard things like AMP[^1] or JSON search indices, but obviously JSON Feed fits into that category as well.

Without repeating the documentation linked above, let me give a brief explanation of how creating a new Output Format works by using JSON Feed as an example.

First, you define the Output Format in your configuration file. I use a YAML configuration file, but the other supported formats are very similar[^2].

```yaml
outputFormats:
  jsonfeed:
    mediaType: "application/json"
    baseName: "feed"
    isPlainText: true
```

As you can see, all rather straightforward. We mention that it's based on JSON, to ensure it gets the correct encoding, we give it a filename of feed so that it generates into a `feed.json` file, and that's basically all.

The next step is to set it up so that it will be generated for the homepage.

```yaml
outputs:
  home:
    - "html"
    - "rss"
    - "jsonfeed"
  page:
    - "html"
```

This outputs setting is the default, with jsonfeed added as an additional output type for the homepage.

Now every time you generate your site it will attempt to create a JSON Feed file as well. Which obviously means that we'll need to add a template for that. This is slightly different from how templates worked before Output Formats were introduced, as the filename structure has changed. While the old way still works for basic things, you should follow the new naming standard of `$type.$outputformat.$extension`.

For a JSON Feed attached to the homepage that means a `index.jsonfeed.json` in the root of your layouts (or theme) folder. The contents of which is not surprising.

```html
{
  "version": "https://jsonfeed.org/version/1",
  "title": "{{ .Site.Title }}",
   "home_page_url": "{{ .Permalink }}",
   "feed_url": "{{ .Permalink }}feed.json",
   "favicon": "{{ .Permalink }}favicon-192.png",
   "author": {
     "url": "{{ .Site.Params.TwitterPage }}",
     "name": "{{ .Site.Params.AuthorName }}",
     "avatar": "{{ .Site.Params.AuthorAvatar }}"
   },
   "items": [ {{ range $index, $item := first 15 .Data.Pages }}{{if $index}}, {{end}}
      {
       "id": "{{ .Permalink }}",
       "title": "{{ .Title }}",
       "url": "{{ if isset .Params "redirect" }}{{ .Params.redirect }}{{ else }}{{ .Permalink }}{{ end }}",
       "content_html": "{{ replace .Content "\n" "\\n" | replaceRE "\"" "\\\""}}{{ if isset .Params "redirect" }}<p><a href="{{ .Permalink }}">Read on site</a></p>{{ end }}",
       "summary": "{{ replace .Summary "\n" "\\n" | replaceRE "\"" "\\\"" }}",
       {{ range $taxonomy := .Params.categories }}"banner_image": "https://ig.nore.me/img/categories/category-{{ $taxonomy | urlize }}-full.jpg",{{ end }}
       {{ if isset .Params "ogimage" }}"image": "{{ .Params.ogimage }}",{{ end }}
       "date_published": "{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}",
       "date_modified": "{{ .Lastmod.Format "2006-01-02T15:04:05Z07:00" }}"
     }{{ end }}
   ]
}
```

Obviously, because it's JSON there are some requirements such as the need to escape all newlines and double quotes. But other than that it's all about following the [JSON Feed spec](https://jsonfeed.org/version/1). There are a couple of things in here that are specific to this site, so make sure you adapt the template to your own needs.

In the end though, while I spent a little bit of time figuring out Output Formats[^3] the Output Formats work well and provide an easy way to extend your site's capabilities. It's given me some ideas to try out and of course, if you really want to you can now follow this site on its new [JSON Feed](/feed.json).

[^1]:	Nope, I'm not interested in creating AMP pages for this site. First, despite the banner images it's not exactly a heavy site, and secondly I don't like the proprietary nature of it.

[^2]:	The documentation above uses TOML if you prefer that.

[^3]:	And dealing with getting everything right according to the JSON Feed specs.
