---
title:        Deploying a static site to GitHub Pages
slug:         "deploying-a-static-site-to-github-pages"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-01-31T16:10:17+11:00
categories:   ["Development"]
keywords: ["hugo", "wercker", "code"]
Description:  "GitHub Pages works differently based on how you set it up. As several people have asked me for help when they ran into issues with deploying the site they generated using my Hugo Wercker step, this article will serve as a place to point them to."
---

GitHub Pages works differently based on how you set it up. As several people have asked me for help when they ran into issues with deploying the site they generated using my Hugo Wercker step, this article will serve as a place to point them to.

# Two types of sites

[GitHub Pages][ghp] can be used in two different ways: based on your account, or based on a project. The distinction between these two is made based on the name of the repository:

* *username*.github.io is a personal site, where *username* is either your account or organization name.
* Any other repository is project based.

The main difference between these is where the source code for your site needs to go, and this is an important distinction. For personal sites you have to deploy your site in the *master* branch, while for project sites it needs to go in the *gh-pages* branch.

I can understand why GitHub made this distinction, but it's not a very elegant solution and quite confusing if you aren't aware this is how it works.

# Using Wercker to deploy

In the [Hugo tutorial][had] a step by step process is shown for searching for and configuring steps, as well as how to supply tokens. Instead of repeating that, below I will provide solutions that have worked for me in the past. I'm only showing the deploy steps, but naturally these will have to be fit in with the rest of your `wercker.yml` file.

## Personal site

For a personal site you first need to ensure that the code that generates your site (like Wercker or Jekyll) is in a different branch than *master*. You can use any branch name that you like, such as *develop* or *code*. Alternatively, you can store that code in another repository and only use your *username*.github.io repository to store your site. The below works for either method. For automated deployments, make sure that you've got this branch [configured][werckeraut] as the one to deploy from.

As the deploy step we can use `leipert/git-push`, which allows us to push to any git repository, including those on GitHub. There are 4 options that need to be filled in here.

* *gh_oauth*: You need to provide a [GitHub token][ght] which you need to [configure][werckerenv] in Wercker.
* *repo*: The repository you wish to push to. This will be your *username*/*username*.github.io repository.
* *branch*: The branch you wish to push to. This **needs** to be *master*.
* *basedir*: The directory that contains your generated site, in the case of Hugo this will be *public*.

```yaml
deploy:
  steps:
    - install-packages:
      packages: git ssh-client
    - leipert/git-push:
       gh_oauth: $GIT_TOKEN
       repo: ArjenSchwarz/ArjenSchwarz.github.io
       branch: master
       basedir: public
```

## Project site

For a project site you can use the same step as for a personal site, but I've found that the `lukevivier/gh-pages`deploy step works a little nicer as it's more focused on GitHub Pages. To use this, we again first install a couple of packages to ensure these are present, but other than that it's just a matter of configuring the step which has 3 options.

* *token*: You need to provide a [GitHub token][ght] which you need to [configure][werckerenv] in Wercker.
* *domain*: An optional domain in case you wish you to have your site accessible through a [custom][custom] URL.
* *basedir*: The directory that contains your generated site, in the case of Hugo this will be *public*.

```yaml
deploy:
  steps:
    - install-packages:
        packages: git ssh-client
    - lukevivier/gh-pages@0.2.1:
        token: $GIT_TOKEN
        domain: hugo-wercker.ig.nore.me
        basedir: public
```

I hope this helps people, and feel free to let me know if you're missing something in here.

[ghp]: https://pages.github.com/
[had]: http://gohugo.io/tutorials/automated-deployments/
[ght]: https://help.github.com/articles/creating-an-access-token-for-command-line-use/
[werckerenv]: http://devcenter.wercker.com/docs/environment-variables/creating-env-vars.html
[custom]: https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/
[werckeraut]: http://devcenter.wercker.com/docs/deploy/auto-deploy.html
