---
title:        The New and Improved AWS CLI v2
slug:       the-new-and-improved-aws-cli-v2
blog:         ig.nore.me
author:       Arjen Schwarz
Date:        2020-02-17T21:40:17+11:00
categories:
  - AWS
keywords:
  - aws
  - cli
Description:  "The AWS CLI is one of the major ways of interacting with AWS, so in that regard the release of version 2.0 last week is a major milestone. Therefore, I want to take a look at what it is, how it's different, and what's good not so good about it."
---

The AWS CLI is one of the major ways of interacting with AWS, so in that regard the [release of version 2.0](https://aws.amazon.com/blogs/developer/aws-cli-v2-is-now-generally-available/) last week is a major milestone. Therefore, I want to take a look at what it is, how it's different, and what's good and not so good about it.

## Installing the CLI

One of the biggest differences from the original is when installing the CLI. Where [before](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv1.html) you likely used `pip` or a package manager to install the CLI, not in the least to make sure all the dependencies were in place[^1], it [now comes as an installer](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) that has all of these dependencies baked in. Yes, for good or bad, it comes with all the required Python libraries baked in.

The goal here is to make it easier to install the application, especially on Windows and macOS where installers are provided. To be perfectly honest, I feel like the installer makes it a little harder. Luckily you can still do it completely from the command line so I wrote a tiny script to make updates easier on my Mac:

```bash
function updateawscli() {
  curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
  sudo installer -pkg AWSCLIV2.pkg -target /
  rm AWSCLIV2.pkg
}
```

Of course, there is no checksum in here but in theory that should be covered by [macOS' notarizing](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution). This basically means that the installation package and its contents is verified as coming from the developer. This wasn't added until late in the process, so there were some issues with getting [earlier betas](https://github.com/aws/aws-cli/issues/4737) to run.

In addition, right now you can't install v2 in an Alpine Linux container. According to the [GitHub issue about it](https://github.com/aws/aws-cli/issues/4685), this seems to be caused by it being compiled against `glibc`. Hopefully this will be solved one way or another at some point, but only time will tell.

## AWS SSO login

So, aside from the new shiny installer, what's actually new about this v2? While there aren't all that many new features, they're potentially pretty big ones. The first one is that it offers the ability to log in using AWS SSO. This was explained in [a blogpost](https://aws.amazon.com/blogs/developer/aws-cli-v2-now-supports-aws-single-sign-on/), but was also discussed in the very first episode of the [Ambassador Lounge podcast](https://www.ambassador-lounge.com/podcast/1/). In the end what it comes down to is that you can set up a profile to authenticate against AWS SSO. Then once per day[^2] you run `aws sso login --profile $profilename` and you're authenticated for the rest of the day. This doesn't always seem to carry on between terminal sessions and I've heard from at least one colleague that they needed to re-authenticate after switching profiles using the same SSO endpoint. Which sounds like it works less than perfectly, but I personally haven't had these issues.

One issue I have had with this is the pain caused when I want to run something else. In particular, I like using my [awstools](https://github.com/ArjenSchwarz/awstools)[^3] to collect data and generate diagrams. Unfortunately, the Go SDK doesn't yet support SSO profiles. Luckily one of my colleagues wrote a [bash script](https://github.com/furikake/aws-cli-helper/blob/master/.aws_functions) that exports the credentials of a profile, and I [adapted that](https://github.com/ArjenSchwarz/custom_zsh/blob/master/plugins/aws-shorts/aws-shorts.plugin.zsh) for zsh and more limited to my own needs[^4]. It's not perfect as you may end up with multiple conflicting authentications active, so be careful about that.

## Autocompletion

Autocompletion is much improved speed wise, and now actually comes from a binary. The speed is a lot better, and one of the nicest things about it is that it finally allows for completion of resources as well. I haven't had much luck with it myself, but I'm not sure if that's because I haven't run into something that's supported or if it's because of something wrong with my autocompletion.

Because there is a chance that something is wrong with my autocompletion. In particular, as I use zsh[^5] the installation of the autocompletion might not have been done perfectly. The [README for v2](https://github.com/aws/aws-cli/blob/v2/README.rst#command-completion) mentions:

> For zsh please refer to bin/aws\_zsh\_completer.sh. Source that file, e.g. from your ~/.zshrc, and make sure you run compinit before:
> $ source bin/aws\_zsh\_completer.sh

It then refers you to look at [that file](https://github.com/aws/aws-cli/blob/v2/bin/aws_zsh_completer.sh) for more details, which points out it uses a bash compatibility layer. Nice and hacky. It's also a bit annoying as I don't want to go through even more trouble installing the CLI. Luckily, it turns out that [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh) has a compatibility layer[^6] already active, so if you use oh-my-zsh you can just add:

```bash
complete -C aws_completer aws
```

to your .zshrc (or however you've got it setup).

## Wizards and auto-prompts

The other big thing is the inclusion of wizards and auto-prompts. One of these I think is useful, the other maybe not so much. I'm not generally a fan of the wizards that AWS has built into the Console, but to be fair it looks like these are more aimed at the ability to not have to deal with learning all of the settings and getting the CLI to ask you questions instead in an interactive session. For now this is limited to only a couple of services, and I have to see how well this will go.

Auto-prompts however seem pretty great so far, and will likely replace my need for `aws service help` when running commands I don't often use. Adding `--cli-auto-prompt` to a command will prompt you for the value of each required flag and give you the option to add whichever optional flag you wish to set. That will likely be very useful. The only thing I'd love to see improved on it however is that it would recognise if I've already added certain flags so I can just add it if I can't remember that one annoying flag[^7].

## Some annoyances

Some of the above items are really nice, and obviously I've switched to using it because of the SSO login functionality alone. However, there are a couple of things that bug me. First, let me give you a very useful tip:

Add `export AWS_PAGER=` to your .bashrc or .zshrc[^8]. Yes, that is an `=` without anything behind it, if you prefer you can use `=''` instead. If you don't do this, pagination will default to using your system pager, even for single line outputs and I can't tell you how annoying it is when your shell scripts suddenly open `less` in the middle of running. A possible alternative to this is to configure less to not open for less than a page of contents. This can be achieved with `export LESS=-RFX`. Just to be sure I've set both, because that really annoyed me.

The second item is the rate of updates. It's been a week now since 2.0.0 was released, and this is still the latest version. However, the v1 version has had 4 releases since.

![](/2020/02/the-new-and-improved-aws-cli-v2/awscli-releases.png)

This means that v2 is now definitely behind v1 as [features that were released since then](https://aws.amazon.com/blogs/aws/new-multi-attach-for-provisioned-iops-io1-amazon-ebs-volumes) aren't supported in v2 yet even though they exist in v1. I don't like this. Doing development in two separate branches always ends up with one getting behind and as releases for this one are likely far more involved[^9], that presumably makes v2 the more likely one to be behind. This reminds me of the Golang SDK v2 which I [wrote about over two years ago](/2018/01/trying-out-the-new-aws-go-sdk/) and that still hasn't come out of beta.

Hopefully this is just a case of the team organising how they're going to handle multiple releases, because if using v2 means we'll end up with delayed access to features that won't make me happy at all.

[^1]:	Mostly python and the boto framework.

[^2]:	At least in my experience.

[^3]:	No, I still haven't come up with a better name.

[^4]:	I tend to set my profile as an environment variable as my prompt shows that information. And I hate having to add `--profile` to everything.

[^5]:	Which is now the default on macOS anyway.

[^6]:	At least that's what I assume it is.

[^7]:	That said, autocomplete now also works for the flags so I'm just as likely to use that.

[^8]:	Or whichever shell you use.

[^9]:	Considering the installers and anything that comes with that.