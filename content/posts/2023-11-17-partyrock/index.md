---
title: Party on, dude!
Slug: party-on-dude
Categories:
  - AWS
Author: Arjen Schwarz
Date: 2023-11-17T08:48:10+11:00
Sumary: Earlier this morning, AWS released PartyRock, an Amazon Bedrock Playground. In short, this is a fun little playground that lets you create miniature apps using both text and image generation. Through the Community Builders program, I got access a couple of days ago and have been playing around with it. So, grab your air guitar and have a look at what this most resplendent app actually does.
Keywords:
  - aiml
  - Bedrock
  - PartyRock
ogimage: https://ig.nore.me/2023/11/party-on-dude/partyrock-simpledb.png

---

Earlier this morning, AWS [released PartyRock](https://aws.amazon.com/blogs/aws/build-ai-apps-with-partyrock-and-amazon-bedrock/), an Amazon Bedrock Playground. In short, this is a fun little playground that lets you create miniature apps using both text and image generation. Through the Community Builders program, I got access a couple of days ago and have been playing around with it. As a spoiler, it's the most fun I've had playing with AWS tools for a very long time. So, grab your air guitar and have a look at what this most resplendent app actually does.

## Building an App

First, let's be very clear here that this is a playground. It's clearly meant to highlight fun things you can do with generative AI, and not necessarily meant to be something you use for what you might call "proper work". However, it is a lot of fun to make these little apps, and you can get stuck on doing your best to improve them very quickly. Or just seeing what it comes up with. That said, I have seen some more practical examples of what it can do including code generation, trip planning, and similar things. Is a PartyRock app the best way to do these things? I don't know and I don't care as I'm sure that the people who built it had fun.

Anyway, to explain how it works, let's go through a quick example. To stay in the theme of PartyRock, we'll want Bill and Ted (from the movie series[^1]) to explain things to us. Having logged into PartyRock we simply click on the "Generate App" button. This brings up the App Builder, where you can provide a description of your app. Based on that description, PartyRock will then literally generate an app for you.

{{% figure src="/2023/11/party-on-dude/partyrock-bill-ted-generate.png"  alt="An image showing the app generation form for PartyRock" %}}

Generating the app takes about a minute or so and a fun little detail is that the generated app won't be the same every time. If you provide the same prompt multiple times, you will get different apps. And of course, as with all generative AI interactions, slightly changing the wording you use can give a very different result. As an example, for the above prompt of "Explain or describe the concept asked about by the user as a conversation between Bill and Ted from the Bill and Ted movie series", I've received a chat interface, separate output widgets for Bill and Ted, and a single output widget where a conversation takes place. Obviously though, afterwards you can change the generated app however you like. (At least, within the constraints of PartyRock).

I'm not going to take you through the editing UI; it's easy to understand how everything works, and just trying it out for a minute or two will explain it better than I probably can. Also, Jeff Bar literally went through every step in the [announcement post](https://aws.amazon.com/blogs/aws/build-ai-apps-with-partyrock-and-amazon-bedrock/). Suffice it to say, I went with the single output widget for the conversation and decided to add an image generation widget that uses the prompt "A portrait of Bill and Ted from the Bill and Ted movies looking confused about @What would you like to know about". The @-sign there refers to that being a field it will get the input from.

{{% figure src="/2023/11/party-on-dude/partyrock-billted-swf.png"  alt="An image showing the a PartyRock app where Bill and Ted have a discussion about Simple Workflow Service" %}}

As you can see, the image isn't great, but the provided answer is both fun[^2] and informative. And making this only took a couple of minutes (not counting the 30 minutes experimenting with prompts to see what kind of answers came out of it). Yes, you can choose which model is used for the text generation, but other than that you can only change the prompts and the sizing and placement of the widgets.

Which brings us to the most obvious thing about PartyRock: the look and feel. Even if you haven't looked at the announcement post, it should be pretty obvious that this doesn't run in the AWS Console. The look and feel are certainly different from what we're used to with AWS, and may not be to everyone's taste. But then, what is? It does make you feel like you're working in a sandbox environment, and the grid for the widgets works pretty well, so there are no complaints from me about that.

Now, the service isn't perfect obviously. You can get the occasional error, especially with image generation, but there is very active development going on[^3], and I don't want to dive into the issues I've encountered because they could all be gone already by the time this is posted. Also, let's keep it fun.

## Snapshots

So, instead, let me highlight some of the fun things I've built with this by showing examples. Which reminds me, did I mention there is a snapshot feature that generates a URL you can share that contains your inputs and the generated outputs? I really love this feature as it's a great way to show the results you can get.

So, let's have a look:

From my Bill and Ted explainer app, [Bill and Ted explaining the heat death of the universe, and then suddenly deciding they should do something about that.](https://partyrock.aws/u/ignoreme/hRmih5FgW/Excellent-Adventure-Explainer/snapshot/AXGv1Fk9Y) I feel like this shows so well how things can take some very interesting twists.

From my Fantastical Services app that generates a fantasy background for AWS Services:

- [AWS Lambda, the central continent of the world](https://partyrock.aws/u/ignoreme/bvmI8nHt9/Fantastical-Services/snapshot/YhXxmbMZZ)
- [SimpleDB, the magical database created by the gods depicted as a grand castle](https://partyrock.aws/u/ignoreme/bvmI8nHt9/Fantastical-Services/snapshot/hzsesRztB)

{{% figure src="/2023/11/party-on-dude/partyrock-simpledb.png"  alt="An image showing an AI generated castle on an island with blue light shining on the top" %}}

From my Monkey Mayhem Generator, which I created to create short fun stories for my daughter:

- [A monkey depicted with 5 hands that has an adventure climbing on a bed](https://partyrock.aws/u/ignoreme/6Oe0y4St-/Monkey-Mayhem-Storyteller/snapshot/M9sJauMhU)

And last, but certainly not least, my Meetup Intro generator [tells you exactly why you should come to our meetup next week](https://partyrock.aws/u/ignoreme/FyVXzAuTw/Meetup-Intro-Generator/snapshot/2LcI6A1fp).

So, while I'm sure there are more useful playgrounds out there than mine, I had a lot of fun creating them and highly recommend everyone to do the same. Luckily for all of us, it's a free service right now that doesn't even require an AWS account.

So, give it a shot by building something at [PartyRock](https://partyrock.aws/). And of course, be excellent to each other!

[^1]: If you haven't watched any of the Bill and Ted movies, feel free to watch them and be fully consumed by the insane idea of a couple of time-travelling, failed musicians whose music will supposedly save the world in the future.

[^2]: Assuming you think the way the characters talk is fun.

[^3]: One bug I reported was a misspelled error message, a couple minutes later I got the same error but this time it had both the correct and original misspelled message. After that I only got the fixed message. So, very quick turnaround.
