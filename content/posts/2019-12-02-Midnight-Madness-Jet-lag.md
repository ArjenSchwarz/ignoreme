---
Title: Midnight Madness Jet lag
Slug: midnight-madness-jet-lag
Author: Arjen Schwarz
date: 2019-12-02T07:26:20-08:00
Categories:
- AWS
keywords:
  - aws
  - deepcomposer
  - cicd
  - imagebuilder
summary: "With Midnight Madness, AWS kicked off the official re:Invent announcements. For some reason, I didn't go to Midnight Madness, but jet lag woke me up early enough that I can at least write about some of the announcements before I'm immersed in re:Invent activities."
---

With Midnight Madness, AWS kicked off the official re:Invent announcements. For some reason[^1], I didn't go to Midnight Madness, but jet lag woke me up early enough that I can at least write about some of the announcements before I'm immersed in re:Invent activities.

## The Ambassador Lounge Podcast

Before anything else, I haven't actually mentioned on here yet that I launched a podcast. I'm planning over time for this to be hosted by different APN Ambassadors instead of just me, but so far I'm in every[^2] episode. The second episode went up hours before Midnight Madness, and as we made predictions that immediately came true we're not too bad at it. That said, the meat of the episode is about the recent CloudFormation updates, so check it (and the first episode) out on the [Ambassador Lounge website](https://www.ambassador-lounge.com/podcast).

## DeepComposer

It certainly seems that re:Invent is becoming a place where AWS releases a hardware device to show off their AI/ML tools. This time around that's with [DeepComposer](https://aws.amazon.com/blogs/aws/aws-deepcomposer-compose-music-with-generative-machine-learning-models/), a (musical) keyboard for use with [Generative Adversarial Networks](https://arxiv.org/abs/1406.2661). There is a short primer on GANs in the DeepComposer announcement, so I recommend you read that.

As someone who isn't particularly good at music, I'm still interested in trying this out. It looks like there are some walk-up only workshops about DeepComposer starting on Tuesday, so I'll try to get into one. It would be cool if that too follows the pattern from DeepLens and DeepRacer and attending a workshop might get you one of these keyboards. Either way, I'll reserve further judgment until I've played with it myself.

## EC2 Image Builder

The [EC2 Image Builder](https://aws.amazon.com/blogs/aws/automate-os-image-build-pipelines-with-ec2-image-builder/) is a big one for anyone using EC2 instances. It's also clearly aimed at tools like [Packer](https://www.packer.io) which allow you to do the same, with the big difference being that Image Builder is a managed service. The announcement post shows how to build a pipeline, using a recipe with only AWS provided components (the installation scripts). There are some important things in here, not the least the ability to test the resulting image and then share it to other regions and/or accounts.

But let's be honest. Right now there are only a handful of those AWS provided components, and while they're nice to have that's not what I really care about. I want to build my own components so I can install my applications on it and any custom libraries I might need. So for that we need to look at the Components part of the Image Builder.

The Components are written in YAML, which is an improvement over Packer's JSON[^3] and based on the example it seems pretty straightforward. The [list of possible actions](https://docs.aws.amazon.com/imagebuilder/latest/userguide/image-builder-action-modules.html) isn't huge, but you can probably handle most things with the `Execute*` type actions anyway.

```yaml
name: HelloWorldTestingDocument
description: This is hello world testing document.
schemaVersion: 1.0

phases:
  - name: build
    steps:
      - name: HelloWorldStep
        action: ExecuteBash
        inputs:
          commands:
            - echo "Hello World! Build."

  - name: validate
    steps:
      - name: HelloWorldStep
        action: ExecuteBash
        inputs:
          commands:
            - echo "Hello World! Validate."

  - name: test
    steps:
      - name: HelloWorldStep
        action: ExecuteBash
        inputs:
          commands:
            - echo "Hello World! Test."
```

Personally I'm really looking forward to playing with this one. It would have been nice to see CloudFormation support out of the box, but most of this is going to be one-time setup anyway. Being used to the flexibility and power of Packer I can see some space for improvement here, but I'm sure that will come. However, AWS seems to continue with its recent streak of terrible UI.

When you pick components for your recipes, the pagination implies there are more pages than there actually are, and when you go to the second page[^4] it needs to separately load every item beyond the first. On a 15" MacBook you can only see a maximum of 3 components at the same time, and there is no way to adjust the number of items on a page. In addition, the various list overviews take about 4 or 5 seconds to load when I've only got a single item in them so far. I fear what that loading time will be like once I'm using it for real.

All that said, I do look forward to using this even though I'll likely [stick to the CLI](https://docs.aws.amazon.com/imagebuilder/latest/userguide/managing-image-builder-cli.html) to save myself a lot of frustration.



[^1]:	Was I sensible, stupid, or just boring? Who knows?

[^2]:	Well, there have only been two so far, so that doesn't mean much.

[^3]:	I know some of you disagree. That's ok, you're just wrong.

[^4]:	Which is currently the last one.