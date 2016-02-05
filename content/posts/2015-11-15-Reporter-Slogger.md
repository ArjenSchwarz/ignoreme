---
title:        "Reporter plugin for Slogger"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2015-11-15T18:16:40+11:00
date started: 15-11-2015
date posted:  15-11-2015
categories:   ["Development"]
slug:         "reporter-plugin-for-slogger"
Description:  "I wanted something that could ensure my usage of the Reporter app would be logged in my journaling app of choice, so I built it."
---

Several years ago, while backpacking in New Zealand, I once again picked up the habit of journaling. This time around[^journaling] I was seduced by how good [Day One][2][^dayoneappstore] looks. While the benefits of journaling are mentioned in many places, I'm not going to go into that.

Over the years I found that logging more and more events is very useful and helps me get a better idea of what took place on a certain day. Whether it's my tweets, GitHub activity, completed tasks, or even my weight[^weight], all of these add to the insight I get from what I remembered to write down. 

Luckily there is a tool to automate the logging of all this data called [Slogger][7], which I use with a daily cronjob. Slogger uses plugins to create entries (either Day One or plain Markdown) based on plugins you enable. And while in the past I've provided a couple of small patches to this project, this time I provided an actual plugin so I wanted to share this.

# Reporter App

Earlier this year, a friend pointed out the [Reporter App][5][^reporterapp] to me. The idea behind this app is fairly simple, but very powerful. Throughout the day it pops up a notification and asks you what you're doing as well as other questions you might have set up. At the same time it records things like your location, the weather, and a whole lot of other things. As you probably understand based on my earlier words, this appeals to me. 

!["A reporter log entry"](/img/posts/2015-11-15-reporter-result.jpg)

There was just one thing missing: integration with Day One. Luckily[^luckreporter], Reporter gives you the option to save all your results on Dropbox. Which meant that it was possible to create a Slogger plugin for it, and I then [did so][1].

The plugin combines the most interesting (to me) data of all the reports from a day into a single Day One entry. Showing the questions (and answers) as well as some environmental information, all separated by the time of the entry.

!["Day One entry for reporter"](/img/posts/2015-11-15-dayone-reporter-entry.png)

Other than telling me that spring here in Melbourne isn't great at the moment, this is pretty much the overview I like for this. Of course, because Slogger is well-designed, building the plugin wasn't all that hard. As I'm not very familiar with Ruby some things were harder than expected, but it was fun to figure out how to make it work properly. I'm not going to show the whole code here, but I will give a few snippets to explain how it works. For the full code, just have a look on [GitHub][1].

## Retrieving the files

Reporter creates a separate file for each day, so we need to open each of those files as requested. Slogger allows the user to specify a number of days, and I added an extra option to retrieve all entries for a backlog.

```ruby
  def get_filelist(config)
    inputDir = config['reporter_source_directory']
    if config['reporter_all_entries']
      Dir.chdir(inputDir)
      filelist = Dir.glob("*reporter-export.json")
```

All files created by Reporter have a filename in the format `year-month-day-reporter-export.json`, so when we want the complete list the easiest solution was to just get every file in the source directory that ended with `reporter-export.json` and put that in a list of filenames.

```ruby
    else
      days = $options[:timespan]
      $i = 0
      filelist = Array.new()
      until $i >= days do
        currentDate = Time.now - ((60 * 60 * 24) * $i)
        date = currentDate.strftime('%Y-%m-%d')
        filename = "#{inputDir}/#{date}-reporter-export.json"
        if File.exists?(filename)
          filelist.push(filename)
        end
        $i += 1
      end
    end
    return filelist
  end
```

For the regular option it was a bit more work, as we first have to see how many days need to be parsed. For each of those we then generate the potential filename and check if it exists before adding it to the list.

## Dates and times

After having retrieved the filenames we loop over them, parse the JSON in each, and then create a single entry. Here however, we run into that thing everybody loves when it comes to development: Timezones.

It might come as a surprise, but it turns out that most of us live in a timezone that is not UTC. So the times we want to show in the entry itself have to based on the timezone they were created, which isn't necessarily the same timezone as where you run Slogger[^timezones]. However, Day One wants the creation dates of its entries to be formatted in UTC. Usually this is handled automatically by Slogger, but because I wanted the entry date/time to be the same as that of the last Reporter item I had to convert it mysef.

```ruby
content['snapshots'].each do |snapshot|
  snapshot_date = DateTime.parse(snapshot['date'])
  snapshot_text = sprintf("\n## %s\n", snapshot_date.strftime(@time_format))
  # Do other stuff

  # Set the logging timestamp to the time of the last snapshot
  # has to be in UTC and following the Day One required format
  options['datestamp'] = snapshot_date.new_offset(0).strftime('%FT%TZ')
end
```

While in the end it is actually quite simple, the above took me a bit of time to figure out.

As I said, the plugin isn't very complex but I'm quite happy with the result. While both Day One and Reporter are paid apps, in my opinion they are more than worth their prices. So, below once again their links in case you want to check them out.

* Day One: [website][2], [iOS appstore][3], [Mac appstore][4]
* Reporter App: [website][5], [iOS appstore][6]
* Slogger: [GitHub][7]

**Update February 5, 2016**

The original version of Day One is no longer available, so I updated the links to point to the new one.

[^journaling]: As many others, I've started and stopped journaling many times and in fact looking back over the past 4 years there are still some unfortunate holes where I skipped it for a several days or weeks.
[^dayoneappstore]: Direct links to [Mac][4] and [iOS][3] appstores.
[^weight]: Yes, I log all of these things.
[^reporterapp]: Direct link to the [iOS][6] appstore
[^luckreporter]: Ok, I probably wouldn't use the app if it wasn't possible to save the data outside of it.
[^timezones]: I generally log my entries in Melbourne's timezone, but run Slogger from a server with a UTC timezone.

[1]: https://github.com/ttscoff/Slogger/blob/master/plugins_disabled/reporterlogger.rb
[2]: http://dayoneapp.com
[3]: https://itunes.apple.com/au/app/day-one-2-journal-+-notes/id1044867788?mt=8&uo=4&at=1000l9pK
[4]: https://itunes.apple.com/au/app/day-one-2-journal-+-notes/id1055511498?mt=12&uo=4&at=1000l9pK
[5]: http://www.reporter-app.com
[6]: https://geo.itunes.apple.com/us/app/reporter-app/id779697486?mt=8&at=1000l9pK
[7]: https://github.com/ttscoff/Slogger
