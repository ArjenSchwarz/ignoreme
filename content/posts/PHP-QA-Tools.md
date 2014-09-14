---
Title:        PHP Quality  
Blog:         ig.nore.me  
Author:       Arjen Schwarz  
Date:         2014-07-17T10:32:40+10:00
Date started: 12-07-2014  
Date posted:  17-07-2014  
Slug:         php-quality  
Categories:   ["php"]
Aliasses:     ["/php/2014/07/php-quality"]
---

When it comes to software development, quality is often a difficult thing to measure. Often you will be able to recognize it when you see it, but defining why something is well done is harder. Luckily there are a number of [tools][9] and [standards][10] out there that will enable you to put metrics against your code.

The question is how and when to use these tools? There are two moments when you want checks done against your code. Before you commit your code - in order to prevent fatal errors from entering your codebase - and after your code is pushed up - when you can gather more in-depth information without it interfering with your workflow.

If you are a developer, you will most likely already be aware of the solutions to these problems. [Git Hooks][1] (or the equivalent in your VCS of choice) and a Continuous Integration system like [Travis][2] or [Jenkins][3].

This article introduces a [evolution7/qa-tools library][4] that can ease the setup and sharing across team members for both of these steps.

# Continuous Integration

While I am long time user of Jenkins for my Continuous Integration tool. For the library the actual CI tool being used is irrelevant as all that matters is what you can do with it, but I will use Jenkins as the example CI in this article as I know it best.

## How this usually works

Just a few years ago when you wanted to set up Continuous Integration for a PHP project you would end up with a server (or VM) on which you would install all the different PEAR packages. This process was greatly eased by the [Jenkins PHP][5] site, which has provided a nice overview of PEAR packages and example `build.xml` files that should be installed.   
As PEAR has fallen out of favour, the site has been updated to reflect that all these requirements should be installed through either downloading PHAR files or installing them globally with Composer.

## The problems with this approach

While this generally works well, installing the tools at the server/virtual machine level has a couple of downsides. First of all is that you have to keep each server up to date.   
While that isn't very hard, it just doesn't scale. If you need multiple servers to handle different versions of PHP or distributed builds, you need to keep each server up to date and in sync with each other. Additionally with the rise of containers such as [Docker][6] you have the option of spinning up a container for each application, but you would have to ensure these tools are installed on those containers.

Another potential issue is that when a developer wants to run a test locally to see if something is fixed that same tool and configuration would need to be present on their development machine.

## My solution

The [evolution7/qa-tools][7] is a single bundle you can add to the require-dev section of your `composer.json` file. It can simply be installed with a `composer require --dev "evolution7/qa-tools=1.*"` command and will contain the tools mentioned on the Jenkins PHP site.

Putting a single library in your require-dev means that you will have access to these tools on your development and CI machines, but don't need to deploy them to your production server.   
Additionally, the library contains sample CI configuration. At the moment this is only for Jenkins, but the advantage of the Jenkins [ant][11] controlled `build.xml` files is that you can run the commands in there easily from the command line as well.

# Git Hooks

The other tool offered by the [evolution7/qa-tools][7] is a number of Git Hooks. The two main issues with git hooks are generally that you need to combine everything in a single hook, and that it's not easy to share these hooks among your team.
Both of these issues are solved with the great [git-hooks library][8], which I would recommend anyone to install and use. Using this tool you can use the hooks provided in our library to prevent most common mistakes among your project. 

In order to use the hooks, you will need to have the git-hooks tool installed, but once you have you can create a `git_hooks` directory in the root of your project, put your hooks there, and share them with the rest of your team.   
And of course, if you want it really easy, just create a symlink to the hooks that come with the qa-tools bundle.

# What will the future bring?

This release is version 1.0 of the library, and at the moment it is limited to the most common tools we use across our projects. This means that we expect to add more tools, as well as more configuration examples (including for other CI tools) and git hooks.

As we love to see quality improve in all code, please use the [evolution7/qa-tools][7] as much as you see fit. Fork it so you can customize it to your needs or create pull requests to have your favorite tools included.


[1]: http://git-scm.com/book/en/Customizing-Git-Git-Hooks "Git - Git Hooks"
[2]: http://travis-ci.org "Travis CI - Free Hosted Continuous Integration Platform for the Open Source Community"
[3]: http://jenkins-ci.org "Welcome to Jenkins CI! | Jenkins CI"
[4]: http://github.com/evolution7/qa-tools
[5]: http://jenkins-php.org "Template for Jenkins Jobs for PHP Projects"
[6]: http://www.docker.com/ "Docker - Build, Ship, and Run Any App, Anywhere"
[7]: http://github.com/evolution7/qa-tools "Evolution 7 - QA Tools"
[8]: https://github.com/icefox/git-hooks
[9]: http://phpqatools.org
[10]: http://www.php-fig.org/psr/
[11]: http://ant.apache.org