---
title:        Multiple Deployments with Wercker
slug:         "multiple-deployments-with-wercker"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-04-01T14:05:25+11:00
categories:   ["CI-CD"]
projects:     ["Igor"]
keywords: ["wercker", "cicd"]
Description:  "At the Docker birthday event last week I decided that instead of working on the Birthday Challenge I would make Igor work on Docker as well. That meant I need to deploy two versions from a single build however, and in this article I'll explain how that works."
---

At the Docker birthday event last week I decided that instead of working on the Birthday Challenge I would make Igor work on Docker as well. That meant I need to deploy two versions from a single build however, and in this article I'll explain how that works.

# The requirements

First of all, before doing anything else I needed to make some changes to Igor. The requirements for running from Docker are quite different to running it from Lambda. For one, it needed to work in a server mode, and secondly I needed to be able to pass along configuration as environment variables[^errorhandling].
While the second part isn't technically needed, it means you don't need to build an extra container and can just simply run it by passing the configuration to the run command. Of course, as I had my configuration using YAML that also meant I had to support JSON. YAML is a good and very readable language for configuration files, but as it depends on indentation it isn't well suited for providing it as a variable.

Making these changes wasn't too hard, so now it's possible to provide Igor with different types of configuration and you can run it in server mode with the `-server` flag. Next up is then turning it into a Docker container. This of course means building a Dockerfile for the project. My initial plan was to use an Alpine base, but eventually I realized that was unnecessary so I changed it to build [FROM scratch](https://hub.docker.com/_/scratch/). This means that the container doesn't have *anything* except what I put into it.

This actually required a couple more changes than I expected. First, I needed to change the build command for Igor. A default Go build expects C libraries to be present, so I needed to change that dependency with `CGO_ENABLED=0`. Then there was need for a couple of other flags to make it completely independent and as compact as possible. If you don't do this, when trying to run the application from the container you get the error *no such file or directory*[^noerror].

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a  -ldflags '-s' -installsuffix cgo -o main
```

Because some plugins call https addresses (the GitHub status API for example), the container also needed to have certificates installed because otherwise it's not able to access these addresses. Thanks to [this article][sslarticle] I knew there is an easy solution to this and so added the certificate file[^sslgrab] to the container by storing it in the `dockerbuild` directory (in the correct directory structure) which I then add.

```docker
FROM scratch

EXPOSE 8080
ADD ./main /main
ADD ./dockerbuild /
CMD ["/main", "-server"]
```

[^errorhandling]: I also needed to get rid of the panic calls I'd left in the code when errors occurred. This is fine when your app is started anew every time, but crashing the server is not a desired result.

[^noerror]: Strangely enough, I only get this error when I build the container on Wercker, but not when I do so locally. /shrug

[sslarticle]: http://blog.codeship.com/building-minimal-docker-containers-for-go-applications/

[^sslgrab]: Which I just copied from another container

# Building Docker on Wercker

Once this was up and running, it was then time to make this work with Wercker. As [previously discussed](/2016/03/publishing-go-binaries-with-wercker/) I was already using Wercker for my builds and deployments so I wanted a solution that works for that.
As it happens, Wercker has wonderful support both for [multiple deployments](http://devcenter.wercker.com/docs/deploy/multi-deploy-targets.html) and [pushing up Docker containers](http://devcenter.wercker.com/docs/steps/internal-steps.html#scratch-push).

There are two ways to push up Docker containers from Wercker, the first is to push up the container you created during the entire build process where the second allows you to push up a scratch container. To be honest, I feel that only having the option between a very fat container and one without anything is a bit limiting and it looks like the people at Wercker are [working to improve that](http://blog.wercker.com/2016/03/09/Towards-a-Developer-Platform.html). As I only need a scratch container for Igor the current state is good enough.

Keep in mind here that Wercker doesn't read your Dockerfiles for building these containers, instead it's all managed through your `wercker.yml`. In that case, how to make it build the Docker container I want? In my previous article I already showed how I ended up preparing things for the Lambda file, so that is something to build on. In fact, the base preparation is simply to ensure the binary is copied again where it's needed and I know that it will show up.

```yaml
    - script:
        name: prepare for Docker build
        code: |
          cp main dockerbuild/
          cp -R dockerbuild $ORG_SOURCE/
```

For the deployment I use Wercker's *internal/docker-scratch-push* step. This step will copy everything in the `$WERCKER_ROOT` to the root of the container. As that points to the same path as `$WERCKER_SOURCE_DIR` I needed to move some things out of the way to ensure that everything works well. I also considered changing the value of the `$WERCKER_ROOT`, but decided that might just introduce more issues so I went for the easier option.

```yaml
    - script:
        name: Prepare for Docker build
        code: |
          mkdir -p /tmp/pipeline
          mv $WERCKER_ROOT/* /tmp/pipeline/
          mv /tmp/pipeline/dockerbuild/* $WERCKER_ROOT
```

As the deploy container isn't stored afterwards, there is no need to clean up these changes either. The configuration for building the Docker container isn't hard either. You simply provide the same information as for the Dockerfile, in a slightly different syntax. The only other things you need to provide are a deployment target and your credentials. I would really like to see Docker Hub support application specific credentials though, whether with OAUTH or some other sort of token. Needing to store my main username and password in a different service feels wrong and insecure.

```yaml
    - internal/docker-scratch-push:
        username: $HUB_USERNAME
        password: $HUB_PASSWORD
        cmd: "/main -server"
        ports: "8080"
        repository: arjenschwarz/igor
```

All that's left now is to ensure I can deploy both the original zip file and the new Docker container simultaneously.

# Publishing two versions

Having multiple deployment targets in Wercker is built-in by default. While the usual use case is probably to have different targets for different environments (like deploying a QA branch to a QA environment and a release branch to production) nothing prevents you from deploying the same code to multiple environments. Or as in my case, different parts of the same code to different targets.

Setting this up is pretty straightforward, and well explained in the above article. First, in the interface you create a second deployment target (I called this one *docker*). Afterwards you can then specify this target in your `wercker.yml` file. This makes the complete deployment configuration look like the below:

```yaml
deploy:
  steps:
    - tcnksm/ghr:
      token: $GITHUB_TOKEN
      input: $WERCKER_SOURCE_DIR/dist
      version: latest
      replace: true
  docker:
    - script:
        name: Prepare for Docker build
        code: |
          mkdir -p /tmp/pipeline
          mv $WERCKER_ROOT/* /tmp/pipeline/
          mv /tmp/pipeline/dockerbuild/* $WERCKER_ROOT
    - internal/docker-scratch-push:
        username: $HUB_USERNAME
        password: $HUB_PASSWORD
        cmd: "/main -server"
        ports: "8080"
        repository: arjenschwarz/igor
```

The `steps` part is the original configuration, still used for the GitHub deployment. If no match is found for the deploy target name this is what it will fall back to. That means that I can change it to say `github` instead, and it will still work.

And because of all this, you can now find a Dockerized version of Igor on [Docker Hub](https://hub.docker.com/r/arjenschwarz/igor) that is always up to date with the latest changes.
