---
title:        "Publishing Go binaries with Wercker"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-03-18T13:25:53+11:00  
categories:   ["Development"]
projects:     ["Igor"]
slug:         "publishing-go-binaries-with-wercker"
Description:  "For Igor I wanted to make sure that there is always a compiled, and up to date, binary ready for download. The obvious way for me to do this was using Wercker, but this turned out to be a bit more work than I expected, so I'm documenting it here."
---

For [Igor](/2016/03/introducing-igor/) I wanted to make sure that there is always a compiled, and up to date, binary ready for download. The obvious way for me to do this was using Wercker[^wercker], but this turned out to be a bit more work than I expected, so I'm documenting it here.

One thing you might notice with Igor is that it doesn't have any version numbers. This is not an oversight, but a deliberate choice. I didn't feel that supplying version numbers to this project will in any way be helpful, as most of the changes will be done in plugins. And increasing the version number every time a plugin is added or changed seems like a lot of overhead without an actual purpose.

Due to the way a bot like this works there shouldn't be any backwards compatibility issues either[^theoretically]. So, instead of offering a number of pointless versions there is always only a *latest* version ready for download.

# Building the application

Before I can push up any binaries, the application needs to be build. Instead of reinventing the wheel there, I simply copied the Wercker file from [Hugo](https://github.com/spf13/hugo "Hugo"). This takes care of all the basics, like retrieving the application's dependencies, running tests and lint checks[^1], and compiling the application.

```yaml
  # Sets the go workspace and places package
  # at the right place in the workspace tree.
  - wercker/setup-go-workspace:
    package-dir: github.com/ArjenSchwarz/igor
  # Get the dependencies
  - script:
      name: go get
      code: |
        cd $WERCKER_SOURCE_DIR
        go get -t ./...
  - wercker/golint
  - script:
      name: go build
      code: |
        GOOS=linux GOARCH=amd64 go build -o main
  - script:
      name: go test
      code: |
        go test ./...
```

Due to my requirements it's not an exact copy of Hugo's configuration, but the main things are the same and it gives me what I need. The important part here however is the `wercker/setup-go-workspace` step. This step has a [known issue](https://github.com/wercker/step-setup-go-workspace#changes-made-during-build-are-not-present-during-a-deploy) where it interferes with the copying of data between the build and deploy containers. The issue occurs because it copies the data of the `$WERCKER_SOURCE_DIR` and changes the path for the variable. However, when the output of the build container is stored it still looks in the old path.

In their repository Wercker recommends copying your binaries to the `$WERCKER_OUTPUT_DIR` instead, but that solution didn't work for me. For some reason, the `$WERCKER_OUTPUT_DIR` points to the same directory as the `$WERCKER_SOURCE_DIR` and therefore isn't useful.

What I ended up doing is create a variable that stores the original source directory so that I can store the binaries there later on.

```yaml
build:
 steps:
    # Store the original source dir so we can pass the zip file to deploy
   - script:
       name: provide chance for deployment
       code: |
        export ORG_SOURCE=$WERCKER_SOURCE_DIR
```

This is a very simple step, and obviously it needs to be placed at the start of the run[^2]. With this problem solved, the only remaining item is to prepare the zip files. There are 2 zip files in this case, one that contains everything needed for a deployment to Lambda (the binary, the node.js wrapper, and a sample configuration file) and one that contains scripts for easing the initial installation.

```yaml
   - install-packages:
         packages: zip
   - script:
     name: create zip file
        code: |
          mkdir dist
          cp config_example.yml config.yml
          zip -r dist/igor.zip main index.js config.yml
          zip -r dist/installation.zip installation
          cp -R dist $ORG_SOURCE/
```

This final build step is simply a matter of zipping everything up, copying it to a newly created *dist* folder, and then copying this folder to the `$ORG_SOURCE` that I created earlier where it can be picked up by the deploy steps.

# Deploying this to GitHub

For the actual deployment I found a good and easy to use step. The [tcnksm/ghr](https://github.com/tcnksm/ghr) step does exactly what I need it to. It will upload all the files in a directory to a release version, and offers the ability to replace these files if they already exist. 

```yaml 
deploy:
 steps:
   - tcnksm/ghr:
     token: $GITHUB_TOKEN
     input: $WERCKER_SOURCE_DIR/dist
     version: latest
     replace: true
```

All I needed to do here was add the details to the configuration and it worked. Using the version *latest* is mostly another way to indicate that this is the latest version, but it matches well with both the path it gets and the way it's displayed in GitHub.

You can find the complete `wercker.yml` file in [Igor's GitHub repository](https://github.com/ArjenSchwarz/igor/blob/master/wercker.yml).

![](/img/posts/2016-03-18-igor-latest.jpg "The latest Igor for download in GitHub")

[^1]:   After which I had to fix all the issues I'd ignored until then just so that Wercker would allow it to be built. A little annoying, but obviously it increased the quality of the project.

[^2]:   Or at least before the `wercker/setup-go-workspace` step

[^theoretically]: Theoretically at least, as nothing programmatic depends on it. Bugs, of course, are a different thing, but that's what tests are for.

[^wercker]: It being my CI tool of choice lately.
