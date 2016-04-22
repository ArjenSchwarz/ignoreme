---
title:        "Using Docker for a more flexible Jenkins"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2015-09-23T11:12:48+10:00
date started: 06-09-2015
date posted:  23-09-2015
categories:   ["CI-CD"]
slug:         "using-docker-for-a-more-flexible-jenkins"
Description:  "Different parts of your project might require different environments. Additionally, when building web projects for clients you don't always have control over the server your project will run on. Both of these issues can be solved, and this article will show how you can use Docker to have a better and more efficient Jenkins setup."
---

As explained in [Building artifacts with Jenkins](https://ig.nore.me/2014/10/building-artifacts-with-jenkins/), different parts of your project might require different environments. Additionally, when building web projects for clients you don't always have control over the server your project will run on. Both of these issues can be solved, and this article will show how you can use Docker to have a better and more efficient Jenkins setup.

# The problem

When dealing with clients, your application might end up running on a variety of OS versions. A standard example of this is PHP websites; you will probably want to work in the latest version (currently PHP 5.6) but some projects run on a PHP 5.3 environment, others on PHP 5.5, and so on. Regardless of the version used, you will still want to run your lint checks, unit tests, and [anything else](https://ig.nore.me/2014/07/php-quality/) you have set up for ensuring a high quality application. However, this means you either need to set up hacks to run multiple versions on your Jenkins machine or find a different solution.

One solution for this is to have different Jenkins slaves set up for different PHP versions, while also configuring your projects to use these specific slaves. This is a straightforward solution, but also a bit of a waste. Not only will it mean you need to manage multiple servers, it also means that some of them will hardly be used while others might have multiple projects queued up.

!["Waiting for an executor"](/img/posts/docker-jenkins/jenkins-wait.png "Jenkins waiting for an executor")

Using different slaves works, but is far from ideal. Therefore, this article proposes a better solution in the form of using Docker containers to streamline this process and do it all on a single server[^slaves].

# Using Docker

Using Docker in combination with Jenkins or other CI tools isn't new. However, most of these solution seem to want to build a single Docker container capable of handling everything that needs to be run. To me that seems to go against the idea of using Docker containers as single purpose tools, and will mean you need to manage a Dockerfile for each project as well[^dockerrun].

Instead of trying to do everything with a single container, we can use specific containers fit for a single purpose. So instead of containers for application A, application B, etc. we can use containers for running PHP 5.3 CLI tasks, PHP 5.6 CLI tasks, Grunt, Gulp, Ember, or Go compilation. *A single container specific for a single type of task.*

These containers can then be reused by each project with the knowledge that they can manage what you need. And this has some additional benefits as well. If we take a PHP project as an example again, when the project will be deployed to a PHP 5.3 environment all unit and lint tests will need to be run against PHP 5.3. However, when it comes to running tasks such as phpcs or phpmd it is possible to instead run these on the much faster PHP 5.6 thereby making the build faster and further reducing the need for more hardware.

# Simple commands

When using multiple Docker containers in a single build, you have to manage this through the build file. I'll use ant build steps in my example, but there is nothing stopping you from using a Maven script or something else to achieve the same result (or even use a different CI).

```markup
<target name="lint" description="Perform syntax check of sourcecode files">
    <exec executable="docker" failonerror="true">
        <arg value="run"/>
        <arg value="--rm"/>
        <arg value="-v"/>
        <arg value="${basedir}:${basedir}"/>
        <arg value="php:5.4-cli"/>
        <arg value="/bin/bash"/>
        <arg value="-c"/>
        <arg value="find -L ${basedir}/src -name '*.php' -print0 | xargs -0 -n 1 -P 4 php -l"/>
    </exec>
</target>
```

I mentioned a PHP lint check before, and the above target shows how this works with Docker. As this syntax isn't very readable, as a CLI command this translates to:

```bash
docker run --rm -v `pwd`:`pwd` php:5.4-cli /bin/bash -c "find -L `pwd`/src -name '*.php' -print0 | xargs -0 -n 1 -P 4 php -l"
```

Instead of running `php -l` directly we instead run it as part of the Docker command. You will also notice that it doesn't just run lint on the src directory, that is because using find and xargs' `-P` option we can have it run the check on multiple files in parallel.

The used [flags for Docker](https://docs.docker.com/reference/run/) are `--rm`, which cleans up the container when we're done with it, and `-v` which mounts the filesystem in the Docker container. In this case, by mounting the current path at the same location in the container. We then run our command on the official PHP 5.4 image using the `-c` flag from bash to ensure the pipe in the command doesn't cause conflicts with the docker command. While in this case we use the official PHP 5.4 image, it will make more sense to use your own image customised to your own needs.

```markup
<target name="phpmd-ci" description="Mess detection">
    <exec executable="docker">
        <arg value="run"/>
        <arg value="--rm"/>
        <arg value="-v"/>
        <arg value="${basedir}:${basedir}"/>
        <arg value="php:5.6-cli"/>
        <arg value="${basedir}/bin/phpmd"/>
        <arg path="${basedir}/src" />
        <arg value="xml" />
        <arg value="${basedir}/vendor/evolution7/qa-tools/rulesets/phpmd/symfony2.xml" />
        <arg value="--reportfile" />
        <arg value="${basedir}/build/logs/pmd.xml" />
        <arg value="--exclude" />
        <arg value="DataFixtures,Resources,Tests,Migration" />
    </exec>
</target>
```

This second example uses the latest PHP 5.6 container to run a mess detection command, and also shows why we mount the directory in the same path as on our local machine instead of something like `/app`. This is because when using something like `phpmd` it generates a reportfile with the complete filepaths in there. This can then later be used together with a code browser, but for that Jenkins will need to be able to locate the files on the local filesystem.

```markup
<target name="grunt_build" description="Grunt build">
    <exec executable="docker" failonerror="true">
        <arg value="run"/>
        <arg value="--rm"/>
        <arg value="-v"/>
        <arg value="${basedir}:/app"/>
        <arg value="-w"/>
        <arg value="/app"/>
        <arg value="evolution7/nodejs-bower-grunt"/>
        <arg value="/bin/bash"/>
        <arg value="-c"/>
        <arg value="grunt build --no-color"/>
    </exec>
</target>
```

For the asset generation we can then use a similar thing. The [container](https://hub.docker.com/r/evolution7/nodejs-bower-grunt/) used here has NodeJS, [Bower](http://bower.io), and [Grunt](http://gruntjs.com). When using NodeJS and Bower however, take into account that Docker will by default run all commands as root so you should add the flags required for that `bower install --allow-root` and `npm install --unsafe-perm` or run as a different user.

```markup
<exec executable="id" failonerror="true" outputproperty="uid">
    <arg value="-u"/>
</exec>

<exec executable="id" failonerror="true" outputproperty="gid">
    <arg value="-g"/>
</exec>

<target name="fix_jenkins_perms" description="Fix all docker generated file permissions">
    <exec executable="docker" failonerror="true">
        <arg value="run"/>
        <arg value="--rm"/>
        <arg value="-v"/>
        <arg value="${basedir}:/app"/>
        <arg value="-w"/>
        <arg value="/app"/>
        <arg value="php:5.6-cli"/>
        <arg value="/bin/bash"/>
        <arg value="-c"/>
        <arg value="find . -user root -exec chown ${uid}:${gid} {} \;"/>
    </exec>
</target>
```

Speaking of running everything as root, this means that all files generated while running these commands will be owned by root instead of Jenkins. As that leads to problems in the long run, you can fix that by including the above `fix_jenkins_perms` target. This checks for all files that are owned by root and changes that to the user and group ids the target is run under (jenkins:jenkins when running from Jenkins). The container used for running this command doesn't matter.

# Using Docker Compose

Sometimes CLI commands by themselves are not good enough, and you need that little bit extra. Whether that is because you want to run integration tests with another application or even just something for which you need a database. While technically you can use a container that contains all of that, this will once again go against the *single purpose* of these containers. Instead you can use [Docker compose](https://docs.docker.com/compose/install/) for this.

```markup
<target name="vendors" description="">
    <exec executable="docker-compose" failonerror="true">
        <arg value="--file"/>
        <arg value="${basedir}/config/ci/composer-install.yml"/>
        <arg value="up"/>
        <arg value="--no-color"/>
    </exec>
</target>
```

The contents of the build file is similar, except this time all the details are contained in a separate Docker Compose config file.

```ini
cli:
    image: ignoreme/php5.6-cli
    command: php /app/composer.phar install
    links:
        - jenkinsdb
    volumes:
        - ../..:/app
jenkinsdb:
    image: mysql:latest
    environment:
        MYSQL_DATABASE: jenkins
        MYSQL_ROOT_PASSWORD: jenkins
```

Please note that Docker Compose and the PHP Composer utility are two different tools. Without going into the details for how Docker Compose works, this will spin up two docker containers: one custom PHP 5.6[^customphp] and one MySQL instance. The actual command that is run is managed in this same Docker Compose config file.

# Server requirements

The nice thing of using Docker for everything is that you don't need to install much on the system Jenkins runs on. Naturally you will need Jenkins and its dependencies, but you don't need anything for running the build commands. Except, of course, Docker and Docker Compose. The main thing you have to remember for this is to configure Docker so that it can be run by the Jenkins user.

[^slaves]: Naturally, with enough projects you might still want to use slaves and anything proposed here will work seamlessly with that.
[^dockerrun]: If your end product runs on Docker and you wish to build the container in your CI, obviously you still need to include your Dockerfile. You might want to wait until after all the other steps though so you can keep the container smaller.
[^customphp]: The reason for using a custom, private, Docker image when running [composer](https://getcomposer.org) is because it uses an oauth token to authenticate itself to Github. Naturally, this token is not something you want to share with the world.
