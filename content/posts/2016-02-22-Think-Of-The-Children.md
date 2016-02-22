---
title:        Think of the Children
slug:         "think-of-the-children"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-02-22T18:56:09+11:00
categories:   ["Security"]
Description:  "Apple was commanded by a court to provide a way for breaking into an iPhone. This doesn't make me happy, so this post serves as a way to clear my mind and calm down about it."
---

Apple was commanded by a court to provide a way for breaking into an iPhone. This doesn't make me happy, so this post serves as a way to clear my mind and calm down about it. This was originally intended to be part of my Weekly Notes, but while writing it became so big I decided it should have its own article.

So, what's going on? As somebody who doesn't live in the US, let me give my overview of what happened. I'm leaving out what I consider to be irrelevant details, and will probably flavor it with some of my opinions.

In a court case[^irrelevant], the FBI has invoked an ancient law in the USA to compel Apple to provide a way for them to unlock an iPhone. This is required because since iOS 8 full disk encryption prevents anyone from accessing that data in any other way. Well, almost any other way. Because as it turns out, if [someone hadn't messed up][passchange] [^messup] they could have triggered an iCloud backup which would ensure that Apple could hand over the data without putting anyone else at risk[^handover]. 

Let's also be clear, Apple has complied with other requests in this and other cases. The big difference is that this time they will need to write software designed to weaken the security of their operating system instead of providing data they have access to.

After receiving this demand, Apple responded in an [open letter][appleletter] where they refuse to do so as it puts every iPhone user at risk. Of course, as the election circus in the USA is in full swing this ensures that every politician who doesn't understand what they're talking about weighs in on the matter to demand that we ["think of the children"][think]. The Department of Justice has unsurprisingly come down on the side of the FBI and applies more pressure on Apple for this as well. 

In the meantime, reactions from the tech industry have been disappointing. While Twitter and several others came out strong on the side of Apple, both Google and Microsoft have delivered such weak non-responses that I am almost willing to believe they've already built in back doors into their systems[^backdoors]. I'm assuming that's not the case, and Android in particular is a very complicated situation as discussed in this [re/code article][android]. Number wise it's far more likely that a case like this would involve Android, but it's possible that with the number of 0-day bugs in Android (and almost everyone running unpatched versions) the FBI doesn't need Google to explicitly provide access[^0day].

In the days since something close to a media/propaganda war seems to have broken out about this case. I could say that it looks like they don't understand each other's points, but I suspect[^hope] that the main actors on both sides understand perfectly well what's at stake here, and that's the problem.

For a while now in the USA there has been a political attempt underway to undermine the privacy and security measures people can have on their phones. This is mostly portrayed by these people as a way to fight criminals and terrorists, and of course if you have "nothing to hide" there's nothing wrong with it. Anyone thinking critically knows that "nothing to hide" doesn't hold up in any way, and organizations like the [EFF][eff] are fighting this. Technology companies have become more involved with these fights as well, and in the past few years Apple has emerged as one of the leading voices for security and privacy[^front]. With this high-profile case however, these political forces now have a good opportunity for forcing Apple to break open iOS.

Because when it comes to an operating system, there is no such thing as a one-device fix. It isn't possible to write code that only works on a single phone, or even a model of phone. This is a backdoor for every iPhone and once that code is written, prosecutors all over the USA will start demanding that it's used and updated for each version of iOS. Naturally, once Apple accedes to this, Android, Windows and 3rd party apps will be next on the list.

"So what?"" some of you might still think (although I hope not) as you trust this government that has such a great history of respecting people's privacy[^sarcasm]. But who believes that this will stop at the borders of the USA? Once Apple allows one government to have this access, what is to stop any other country from demanding the same? Do you really believe that a government like China isn't [paying close attention][china] to this? They've wanted this just as badly as the USA, probably even more. So far they've refrained from pushing too hard, but once this backdoor exists I doubt it will take more than a month before China demands the same access, as will every other government in the world.

I hope you'll forgive me for the rant this has turned into, but privacy is something I care about a lot. There are many things these days that have an impact on your privacy, Google's and Facebook's products in particular mean that these companies have an enormous amount of data about their users, but right now this fight between Apple and the FBI makes that pale in comparison.

After all, remember that this will have the greatest impact on regular people. If everything is opened up to governments all over the world (and anyone else who can steal that code) criminals, terrorists, and their like will still use other tools to encrypt their systems that are independent of the OS. So let's say that all of those are outlawed as no doubt certain people wish for as well, what do you think is going to happen? That they won't install it because that would mean breaking the law? Yeah right... 

In the end, I hope that sanity will prevail here and that the FBI will realize what it means and back off. Where *hope* is unfortunately something very different from *expect*.

Before I go, a couple of good insights into all of this that I haven't linked to yet:

* [Stratechery][stratechery], where Ben Thompson does his usual great job of explaining the situation and consequences.
* [Zdziarky's blog][forensic], where Jonathon Zdziarsky explains how this differs from previous cases in that Apple is asked to create a forensic methodology (and what that means).

And this excellent cartoon from [Stuart Carlson][carlsontoons] that sums it all up in a single image.

![Waiting for the backdoor to be opened][cartoon]


[^irrelevant]: Yes, I consider what is being investigated irrelevant. Not because of any personal feelings one way or the other (I hope anyone reading this will understand what any sane person's feelings about the events are), but because the FBI is abusing the type of case to push this through.

[passchange]: http://www.buzzfeed.com/johnpaczkowski/apple-terrorists-appleid-passcode-changed-in-government-cust

[appleletter]: http://www.apple.com/customer-letter/

[think]: https://en.m.wikipedia.org/wiki/Think_of_the_children

[^backdoors]: Yes, that sounds harsh. Their responses to this situation however are far too weak to call a stand on either side.

[^0day]: That's not a dig against Android, just stating facts. Besides, I doubt the security apparatus in the USA doesn't have access to similar things for iOS, but unlike existing Android bugs those aren't public so they can pretend they don't have it.

[^messup]: The FBI released a [statement][recode] that nobody messed up here, that it was done deliberately but shouldn't matter anyway.

[^handover]: No, I'm not happy about the possibility that backups can be requested either, but I'm also pretty sure that because of all this Apple is now working hard to make that impossible in the future as well.

[^front]: No doubt some of you will see this as a "marketing stunt" or something similar by Apple. First, congratulations on using the same argument as the FBI is. Second, I'm not claiming that Apple's motives here are completely pure, although I think for a major part they are. But even if their focus on privacy is driven by marketing, does it matter when it means you get a far more secure device to store your data on?

[^sarcasm]: I really hope that at some point the HTML spec will include <sarcasm> tags.

[^hope]: I know that many people doubt the FBI understands that this is an everyone or noone has access situation, as in this case stupidity would be the lesser of two evils, but I feel that too much has been written for that to be possible.

[china]: http://www.nytimes.com/2016/02/21/technology/apple-sees-value-in-privacy-vow.html?_r=0

[stratechery]: https://stratechery.com/2016/apple-versus-the-fbi-understanding-iphone-encryption-the-risks-for-apple-and-encryption/

[forensic]: http://www.zdziarski.com/blog/?p=5645

[carlsontoons]: http://www.carlsontoons.com/

[recode]: http://recode.net/2016/02/21/fbi-says-resetting-san-bernardino-shooters-apple-id-password-not-a-screwup/

[android]: http://recode.net/2016/02/21/what-if-san-bernardino-suspect-had-used-an-android-instead-of-an-iphone/

[eff]: https://www.eff.org

[cartoon]: https://pbs.twimg.com/media/CbzXiLwW8AA-b_f.jpg
