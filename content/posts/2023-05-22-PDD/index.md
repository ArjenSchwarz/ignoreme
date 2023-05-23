---
Categories:
- Opinion
Slug: presso-driven-development
Author: Arjen Schwarz
Title: Presso-Driven Development
date: 2023-05-23T10:07:28+10:00
summary: Last Thursday I gave a presentation at the Melbourne Golang meetup. In this presentation, I had a slide that contained a warning about "Presso-Driven Development". Presso-Driven Development, or PDD, is a term I use to explain how some of my code comes into being. To make my life easier, and see how it fares in the wider world, I figured it's time to put a proper definition out there.
ogimage: https://ig.nore.me/2023/05/presso-driven-development/pddslide.png
---

Last Thursday I gave a presentation at the Melbourne Golang meetup. In this presentation, I had a slide that contained a warning about "Presso-Driven Development". Presso-Driven Development, or PDD, is a term I use to explain how some of my code comes into being. To make my life easier, and see how it fares in the wider world, I figured it's time to put a proper definition out there.

{{% figure src="/2023/05/presso-driven-development/pddslide.png" alt="A slide depicted as a warning sign with the text Presso-Driven Development" %}}

Disclaimer; this would likely be called Presentation-Driven Development if I lived anywhere other than Australia, which would make it sound incredibly boring.

## The definition

A presso[^presso] represents *any* form of showing people something you've built. This can be in person or online, live or recorded, formal or casual, interactive or one-directional. There needs to be a time constraint attached to it, however; a set date when you need to deliver this by.

Presso-Driven Development takes place when giving a presso is the driving force behind building a feature. The idea for the feature already exists before you plan to give the presso, but giving the presso depends on the feature being implemented. This feature represents something you want to implement, whether that is a small functionality in an application or a complete application, but it is something that can be used to achieve an actual task and will be functional beyond the presso itself. And of course, once you have completed building what you need for the presso, you don't touch it again until after the presso to prevent bugs[^notouch].

Not required, but a recommended best-practice for PDD, is to make sure your feature includes at least one visually fun property that doesn't add value other than looking cool.

[^presso]: Or presentation, if you really must use such a long term.
[^notouch]: Unless something changes in the service you're depending on, in which case you also shouldn't forget to add a slide complaining about that.

### Main points

- You build the feature because you need it for the presso, but you are giving the presso as an excuse to build the feature
- You build it as a minimal viable feature
- Once it works well enough, you don't touch the feature until after your presso
- Include a visually fun, but otherwise useless, property
- Documentation, tests, and other good coding practice are completely optional and can wait until after the presso (when you probably don't have time for them anymore)

## Some background

Now, you might ask, why would anyone build features after they've decided to give a talk on it? Isn't that a bit backwards?

Yes, yes it is. I understand that a more logical sequence of events is "Think of something cool/useful" -> "Write an implementation of this" -> "Give a talk about it". And that makes perfect sense when you live in an ideal world and have lots of spare time.

In a world filled with other activities[^parent] however, this is more likely to be: "Think of something cool/useful" -> "Don't have time to implement it" -> "See an opportunity to give a talk about that cool thing" -> "Propose that talk" -> "Talk is accepted" -> "Realise you should probably make sure it actually works before the talk" -> "Finally implement it" -> "Give the talk". The timeframe for this can also be very long as sometimes an idea can stay in that second step for months, if not years, and is completely dependent on everything else going on in your life. The below diagram attempts to show the different paths for an ideal world where everyone has all the time, and the one we happen to live in.

{{% figure src="/2023/05/presso-driven-development/pdd-diagram.png" alt="A flowchart depicting the above two paths" %}}

In short, presso-driven development means that you can actually implement these features/tools that you want to play around with.

[^parent]: Whether that is work, social activities, or the never-ending task of being a parent.

## Concerning code quality

Most "Something"-Driven Development methods are focused on getting high-quality code, documentation, tests, etc. That... is not a driving factor for Presso-Driven Development. As should be clear from the above background section, PDD generally happens when you don't have a lot of time to get your desired feature working. In the unlikely event that you're finished building the feature but have spare time before your presso, there is no reason not to add documentation, tests, etc. As long as you don't touch the code itself anymore! After all, to reiterate, **once it works, don't touch it until after your presso**. Most importantly though, don't forget that you could spend that time working on the cool but useless visual property!

## A definition in progress

It is my belief that Presso-Driven Development is a very common development strategy, and I have probably missed some parts of this. I would love to keep this post updated with details on how PDD is used in the world, so if this strikes a chord with you please let me know either here in the comments, [on Mastodon as @arjen@ig.nore.me](https://mastodon.ig.nore.me/@arjen), [on LinkedIn](https://linkedin.com/in/arjenschwarz), or in person. Similarly, if you think of a way to improve the definition let me know.