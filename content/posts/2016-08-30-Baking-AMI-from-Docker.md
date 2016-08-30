---
title:        Baking AMIs from Docker using Ansible
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-08-30T22:34:59+10:00
categories:   ["CI-CD"]
slug:         "baking-amis-from-docker-using-Ansible"
Description:  "When using Docker containers to trigger Ansible configuration, you can run into an issue regarding Docker's virtual filesystem and SSH sockets. This shows how I worked around that problem."
---

When using Docker containers to trigger Ansible configuration, you can run into an issue regarding Docker's virtual filesystem and SSH sockets. This shows how I worked around that problem.

As before, this is related to the RedHat AMIs that I build using a combination of Packer and Ansible. One point that wasn't mentioned in the previous articles is how these builds are triggered. Jenkins is being used for the CI/CD process, with Jenkins using the [Docker Plugin][dockerplugin] to spin up Docker containers as slaves. This is a pretty normal setup, and works quite well for most things.

When building the AMIs however, there was a problem. Although locally it worked perfectly[^always], when triggering the AMI build process through Jenkins it would fail upon reaching the point where Ansible starts to provision the server.

```bash
SSH encountered an unknown error during the connection. We recommend you re-run the command using -vvvv, which will enable SSH debugging output to help diagnose the issue
```

At that point the above error would appear. Well, first step then is to add the debug flag to Packer's Ansible provisioner.

```json
"extra_arguments": ["-vvvv", "--extra-vars", "key=value"],
```

This allowed me to discover the underlying issue, as the SSH connection process contains the following line.

```bash
Control socket connect(socketpath): Connection refused
```

However, the SSH socket exists in that location and is accessible by the user trying to connect. After searching around, it turns out the problem is caused by a [conflict][https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1214500] between the virtual filesystem used by Docker[^overlay] and SSH sockets. This means that SSH can't access the socket while it is hosted on a virtual filesystem. Instead it needs to be present on something more tangible[^tangible]. This can be either tmpfs, or a mountpoint. Because it was the least amount of work, I opted to add an extra mountpoint to the container. In order to ensure it will also work from my local machine (where it doesn't run through Docker), I opted to make it use `/tmp` as the new location for the socket. Adding the mountpoint to the containers is easy, and the only other thing needed is to configure the control path for Ansible in Packer.

```json
"ansible_env_vars": ["ANSIBLE_SSH_CONTROL_PATH=/tmp/ansible-ssh-%%h-%%p-%%r"]
```

While I added this as an environment variable, it is also possible to add it to the `ansible.cfg`. The environment variable is used as we use multiple playbooks from the same codebase and setting this specifically in Packer ensures it won't interfere with other builds.

[dockerplugin]: https://wiki.jenkins-ci.org/display/JENKINS/Docker+Plugin

[^always]: Doesn't everything?

[^tangible]: Tangible sounds probably a bit more physical than it actually is, considering the next layer down is still running on virtual machines.

[^overlay]: Or rather, what I found is that this is an issue with the overlay filesystem. While Docker seems to use something similar, [overlay isn't the default][overlaydocker].

[overlaydocker]: https://docs.docker.com/engine/userguide/storagedriver/overlayfs-driver/
