---
title:        "fcd: A fuzzy project switcher"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2015-08-09T22:30:14+10:00  
date started: 01-08-2015
date posted:  09-08-2015
lastmod: 2016-03-16T18:57:30+11:00
categories:   ["Development"]
keywords: ["cli", "code", "zsh"]
slug:         "fcd-a-fuzzy-project-switcher"
Description:  "fcd is a zsh plugin I built for easily switching between different projects on the command line."
---
As I often switch between various projects, I got tired of constantly typing `cd ~/projects/...` to find the project I needed to switch to and decided to come up with a better way. The tool I came up with is a zsh plugin I call *fcd*.

## Why do this?

A basic use case for this can also be solved with a [TextExpander](https://smilesoftware.com/TextExpander/index.html) shortcut, but unfortunately that doesn't scale very well when you have more complex directory structures.
For example, Go projects will by definition be stored in a path similar to `$GOPATH/src/github.com/ignoreme/projectname` and when doing client work you might want to separate sites (`~/projects/ignoreme/sites/ignoreme`) and server configuration (`~/projects/ignoreme/sites/ignoreme`).

So, what I really wanted was the ability to type a command followed by a couple of characters for the project and then automatically switching to it regardless of where it might be stored.

I actually wanted to go even further than this, and have it use autocompletion as well. This way I could use either fuzzy search (typing some part of the name) or tab completion to find the result I want to switch to.

## What did I create?

As I use [zsh](http://zsh.sourceforge.net) as my shell, using [Oh My Zsh](http://ohmyz.sh), I figured the easiest way to do this was by building a plugin for that. It has good native support for [autocompletion](http://zsh.sourceforge.net/Guide/zshguide06.html) and creating a custom plugin for Oh My Zsh is a standard functionality for it.

While it took a lot of trial and error, the end result is actually fairly simple and compact. The code can be found on my fork of [Oh My Zsh](https://github.com/ArjenSchwarz/oh-my-zsh/blob/master/plugins/fcd/fcd.plugin.zsh) and I created a [pull request](https://github.com/robbyrussell/oh-my-zsh/pull/3465) for it as well, although I'm unsure if it will ever be merged.

## How does it work?

Saying it's simple is easy, but let's have a look at how it works.
The method `fcd()` is the basis of it all, but before that can be used we need to define `$FCD_BASEDIR` in our `.zshrc` config file.

```bash
FCD_BASEDIR=($HOME/projects/*/sites $HOME/projects/*/servers $GOPATH/src/github.com/arjenschwarz)
```
This configuration gives me 3 sets of possible sources for my projects to be located. And as you can see, wildcards are accepted.

```bash
fcd() {
    DIRS=("${(@f)$(find ${FCD_BASEDIR} -mindepth 1 -maxdepth 1 -type d -path "*$1*" ! -iname ".*")}")
    if (( ${#DIRS} == 1 )); then
        cd ${DIRS[1]}
    else
        echo "Multiple results found:"
        print -C 1 $DIRS
        cd ${DIRS[1]}
    fi
}
```

`fcd()` will now use [find](http://manpages.org/find) to look at the children of the `$FCD_BASEDIR` paths. Each (non-hidden) directory in there will be matched against the first argument. It will always switch to the first result, but if multiple results are found it will also show a list of all matches.

Next is the autocompletion.

```bash
compdef _fcd fcd
```

Using the zsh method `compdef` we first define that when we run the command `fcd` this will trigger the autocompletion defined in `_fcd()`.

```bash
_fcd() {
   compadd _fcd_get_list
}
```
`_fcd()` in turn will add the results of `_fcd_get_list()` to the the autocompletion using `compadd`.
```bash
_fcd_get_list() {
    DIRS=("${(@f)$(find ${FCD_BASEDIR} -mindepth 1 -maxdepth 1 -type d -path "*$1*" ! -iname ".*")}")
    print -C 1 $DIRS | awk '{gsub(/\/.*\//,"",$1); print}'
}
```

And finally, there is `_fcd_get_list()` itself, which simply prints a list of the same result we would get when running the command itself. The only difference being that it will only print the final directory name instead of the whole path.

## What does it look like?
The below gif is a short demonstration of fcd, but you're of course welcome to [copy the code](https://github.com/ArjenSchwarz/oh-my-zsh/blob/master/plugins/fcd/fcd.plugin.zsh) for your own use.

![fcd in action](/img/posts/fcd-example.gif)
