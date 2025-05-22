---
title: Cloud Design as a Story
Slug: cloud-design-as-a-story
Categories:
  - opinion
Author: Arjen Schwarz
Date: 2025-05-22T22:48:48+10:00
Summary: For a fresh perspective, it's often helpful to look at a problem or task from a different lens. Sometimes, this will be better; sometimes, it's just a good way to refresh and renew your interest in something you've been doing for a while. In this post, we'll be looking at how similar designing for the cloud is to writing a story. What are the similarities, what are some key differences, and how does that actually help in any way?
Keywords:
  - cloud
  - design
ogimage: https://ig.nore.me/2025/05/cloud-design-as-a-story/protagonist.png
---

For a fresh perspective, it's often helpful to look at a problem or task from a different lens. Sometimes, this will be better; sometimes, it's just a good way to refresh and renew your interest in something you've been doing for a while. In this post, we'll be looking at how similar designing for the cloud is to writing a story. What are the similarities, what are some key differences, and how does that actually help in any way?

## The story of a story

> A long, long, time ago, in a galaxy far far away, a little hobbit lived in a hole in the ground.

When you read the above sentence, you get an idea in your head about the story that is being told. Depending on the kind of stories you've experienced before, that idea will consist of spaceships and robots, or maybe dwarves, rings, and dragons[^1]. Either way, that single sentence shows how much humans tend to think in stories. Stories are a powerful vehicle to transmit information, so let's have a look at how we can apply that knowledge.

First, we should define a story. At an almost instinctual level, all of us can recognise a story, but what are the key ingredients? What kind of things can we find in both the latest Marvel blockbuster and an ancient story like The Iliad? In my mind, the main ones are the setting, protagonist, antagonist, any other characters, and challenges.

{{% figure src="/2025/05/cloud-design-as-a-story/overview.png"  alt="Simple icons representing key elements of a story: mountain (setting), hero emoji (protagonist), villain emoji (antagonist), person at laptop (other characters), and flame (challenges)." %}}

The setting is where things take place, the protagonist is who we'll be rooting for, the antagonist actually is the baddie of the story, there will be side-characters of various importance, and the challenges are what need to be overcome to come to a happy conclusion. Of course, these are not the only things that can make up a story, and nor does every story contain each of these ingredients. But they are the things that make many stories interesting and ensure that we keep coming back for more.

So, how does that translate to cloud design?

## Enter our hero

{{% figure src="/2025/05/cloud-design-as-a-story/hero.jpg"  alt="A cowboy seen from behind, confidently looking out over a sunny rural landscape with horses and ranchers, symbolising the story's hero starting their journey." %}}

Let's start with our hero! The main character of any cloud design should, of course, be the application itself. Without an application, what would be the point of anything we design? That said, what *is* an application? Back in the olden days of web development[^2], an application was a piece of software that you built and then threw over the fence to the ops team to deploy on their precious production server. These days, however, there is a lot more to it, especially if you want to get the most out of running your application in the cloud. Whether that is for cost-efficiency, security, or any of the other reasons that are nicely encapsulated in the [Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html).

When it comes to the protagonist in a story, the story's author at least needs to know a lot about them. This includes the superficial things like their looks or the hero's background, but also the more intrinsic elements that fuel their motivations. And the same goes for the story of your cloud design. What language is the application written in? Is it even a single language? What kind of architecture does it have, is it a micro-service or monolith? Will it run serverless, on containers, on VMs, or a combination of it all? Why were these choices made?

{{% figure src="/2025/05/cloud-design-as-a-story/protagonist.png"  alt="Hand-drawn illustration showing two cartoon figures labeled 'Story' and 'Cloud' with thought bubbles and arrows pointing to questions about character details like architecture, dependencies, and deployment methods." %}}

Asking these questions is a big part of how you design your architecture, as every answer can lead you to a different path with different trade-offs and follow-up questions. For example, opting for a serverless micro-services architecture where the different parts of the application can be written in different languages will have a very different deployment method from a single monolithic application that needs to run on an x2iedn.32xlarge instance.

And of course, keep asking the questions:
- If you opt to run containers, are you thinking of doing so on ECS, EKS, or in a self-managed way?
- Are you aiming to have your containers run serverless or on instances?
- And are these instances managed for you, or do you have to do maintenance on them?
- What OS should the instances run on?
- What OS should your containers have?
- What dependencies should be installed?
- What...

Asking these questions is what you need to flesh out the hero of your story, but of course, there is more to a hero than just their intrinsic items. Where we live has a big impact on ourselves, and the same goes for our hero.

## Setting the scene

{{% figure src="/2025/05/cloud-design-as-a-story/scene.jpg"  alt="A vibrant, colourful fantasy world map featuring mountains, rivers, forests, and various terrains, representing the diverse setting of the cloud environment." %}}

So, where does our hero live? In a fantasy story this can be an inspiring fantasy world with lush forests and giant mountain peaks surrounded by dragons, but for an application? I hate to break it, but unless you're an amazing artist it probably won't look as nice as that.
At the lowest level this is likely a VPC. While some serverless solutions can live outside of the VPC, in the end a VPC is still the basis that everything else builds on. But what does this look like in practice? VPCs have been around for so long there are plenty of best practices for it, and depending on your organisation you may have limited control over it. Exactly like in the real world.
As an example, let's take a standard 3-tier subnet structure spread out over 3 Availability Zones.

{{% figure src="/2025/05/cloud-design-as-a-story/vpc.png"  alt="Sketch-style diagram of a three-tier AWS VPC architecture with public, private, and data subnets across three availability zones, clearly showing user interaction through a load balancer to application instances and an Aurora database." %}}

In this environment your application and database live in a private and data or isolated subnet respectively. For your application this VPC is its home, but of course that doesn't give much of a setting. So let's look at the broader landscape. First, there needs to be a way to interact with the world outside of the home. A load balancer can serve as our front door, where we receive visitors, and we can have a NAT Gateway or Transit Gateway to facilitate our hero going out themselves. But this is still limited.

Again, you end up asking a lot of questions to figure out the details:

- Where is this home?
- What region is it in?
- Are there limitations like missing services to this region?
- What account?
- What else is running in this account that you should be aware of?
- Where does this account sit in the Organization structure and what impact does this have?

These questions will help you envision the home of your hero better, and thereby how it fits into it all. Of course, not every design will need to care about all of this, just like not every story involves a trip to the other side of the world to throw a ring in a mountain. But, what is a world without anyone in it? Let's look at what fills this world.

## The supporting cast

{{% figure src="/2025/05/cloud-design-as-a-story/cast.jpg"  alt="A mysterious cowboy viewed from behind, observing other cowboys riding horses on a dusty trail, symbolising interactions with the supporting cast of characters." %}}

A solitary journey can be a lonely one, and generally speaking stories and design are about the interactions. Who our hero meets is a major part of the story, and that doesn't change when our hero is an application. There are other applications in your environment that it will interact with, third-party services, and of course those who will be using the application.

So the main question you have to ask here is "Who does our hero interact with?". But in addition to that, you also need to figure out how that interaction will take place. In a story that has a medieval setting, you don't usually have instant communication over long distances[^3] and similarly you have to take what's available into account. Do they communicate over VPC Peering? A Transit Gateway? Or do you use PrivateLink connections to various internal and external endpoints? What kind of protocols are used, both for interactions with the end-users and other applications/APIs, and what's the impact for that on your security groups and NACLs? Who do you need to send alarms to when something goes wrong?

Speaking of things going wrong...

## Trials and tribulations

{{% figure src="/2025/05/cloud-design-as-a-story/villain.jpg"  alt="Close-up of a mysterious cowboy wearing a dark hat and a mask with glowing red eyes, representing the antagonist or villain in the cloud story." %}}

Many stories have a villain, and the story of cloud design is no stranger to this. Unfortunately, in the case of a villain, cloud design is more likely to fall in the mystery genre as we don't really know who or what our protagonist will have to face. There are a great many cyber security threats out there, all of whom have different motives and strategies. So instead of trying to figure out who we need to protect against, you should instead focus on what you're protecting.

Are you protecting your data? Or is there critical infrastructure that can't go down? There are many different things that can be targeted by an attack, and you need to determine what it is that's most important to protect. And once you know what's most important, you can ensure that your cloud environment prioritises protecting that. Of course, don't ignore everything else, and always keep in mind that a layered defense, or defense in depth, will get the best results. Villains aren't the only challenge you may need to confront however, so let's see what else is out there.

## Confronting your dragons

{{% figure src="/2025/05/cloud-design-as-a-story/challenges.jpg"  alt="A cowboy standing bravely in front of a dramatic, erupting volcano with flowing lava, symbolising confronting major challenges." %}}

No story would be complete without a challenge to overcome. As it happens, the challenges we need to overcome don't involve throwing an evil ring into a volcano or blowing up a moon-sized space station. Instead when dealing with the cloud we have to face other types of challenges. Which can be challenging themselves[^4]!

These challenges can take many forms and can be either internal or external. Internal challenges can include things like having to deal with an old application that doesn't support modern architectures. Or you are faced with a release and approval process that requires many meetings and literal months before a change can be deployed to production. Maybe there are business or security requirements that you need to follow.

And then there are the external challenges. The biggest challenge here is often regulation, especially if you're working in industries that have a lot of oversight, and the only way to face that is by doing the work to comply. Similarly, whether by regulation or otherwise, you may not have a choice which AWS region you can use, and whether that region has that one feature or service you really need.

But if you think of these as part of a story, maybe, just maybe, you will find a way to deal with them all and have your happy ending.

## And they lived happily ever after

{{% figure src="/2025/05/cloud-design-as-a-story/happy.jpg"  alt="A victorious cowboy on a brightly lit stage, facing an enthusiastic cheering audience, representing successful completion and celebration." %}}

And then our story is complete! We've released our cloud infrastructure; our hero is happy and talking with all their friends in our beautiful world. The antagonist is kept away, and we've overcome all of our challenges. And so our story ends on a happy note and we can watch the credits roll.

Except... this is the real world and the point where the metaphor breaks down a bit[^5]. Because, unlike a story with a defined beginning and end, the world of the cloud is always changing and evolving. Because of that you have to keep up to date to stay relevant; this can include updating your protection against new plots the antagonist may be hatching[^6], but the architecture you use can also become deprecated and replaced by something better.

One other key difference between cloud design and crafting a story is that you're not alone. Where a story is created by a single person, or small group of people, for cloud design you have the whole world as your ally. Obviously this includes the colleagues you work with, but there is your local community[^7] you can discuss things with, there is also a lot of documentation out there, and people who have faced the same questions. And nobody minds if you use the same ideas and solutions for your design.

And with regard to using other people's solutions, there is a quote attributed to William Faulkner that is as true for a story as it is for your cloud design:

> In writing, you must kill all your darlings

In practical terms, what this means is that you shouldn't hold too tightly onto anything you've built. Yes, you may have sweat blood, tears, and lots of AI tokens over building a working solution, but if AWS releases a service that does almost exactly what you need, you should take a very good look at it. Maintaining your custom solution is harder than using a service, and will take more of your time - time that can be better utilised elsewhere.

And of course, there is the other thing we've all experienced when it comes to cloud design[^8]. Once you're done building something, you get to do it all over again for the next project. But maybe, for your next project consider using a framework like this to envision your design as part of a story. Think of your hero, their place in the world, the friends they make along the way, who might be opposing them, and what other challenges will be faced along the way.

{{% figure src="/2025/05/cloud-design-as-a-story/sequel.jpg"  alt="A cowboy and a young child, viewed from behind, standing side by side watching a hopeful sunrise, symbolising a new beginning or sequel." %}}

## The after credits

I'd love to hear in the comments, or elsewhere, if you have thought of design like this and if this take is useful. Or just fun and you would like me to expand on it. And, if you're interested, I've given a couple of talks about this topic. The first one embedded below was at the Melbourne AWS User Group in March last year[^9], and the second was a shorter version at ADAConf in Melbourne.

{{% youtubestart  h5Czgp9RIGM 2697 %}}
{{% youtube r3xZO0H0_XQ %}}


[^1]: Or you could be an overzealous copyright lawyer and start to wonder if there's money to be made here. Spoiler: there isn't.

[^2]: Let's not go back all the way to when we bought our applications on floppies or CDs in a store. That just makes me feel way too old.

[^3]: Unless magic is involved. Pro tip: don't rely on magic for your cloud architecture.

[^4]: Just, you know, without having to risk your life.

[^5]: Or does it?

[^6]: Or a new antagonist is introduced.

[^7]: As a meetup organiser, I can objectively say that they're a great way to learn and meet people.

[^8]: Especially if you're a consultant like me.

[^9]: Guess who took forever to write this up?
