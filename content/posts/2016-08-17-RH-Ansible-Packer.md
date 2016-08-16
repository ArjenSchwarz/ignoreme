---
title:        Building Redhat AMIs with Packer and Ansible
slug:         "building-redhat-amis-with-packer-and-ansible"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-08-17T08:32:50+10:00
categories:   ["Devops"]
Description:  "Because Redhat-based OSes are slightly different from Debian-based ones, I ran into some issues provisioning an AMI with Ansible and Packer. This article is to ensure I can find the solution quickly in the future."
---

Because Redhat-based OSes are slightly different from Debian-based ones, I ran into some issues baking an AMI with Ansible and Packer. This article is to ensure I can find the solution quickly in the future.

# The setup

The setup for the project is in [Ansible][ansible], with [Packer][packer] being called from an Ansible role. As part of the provisioning, Packer in turn does various simple actions, before calling another Ansible playbook that is aimed at configuring the new server. The first part of this works as expected, and the rest has worked for Ubuntu-based AMIs as well. However, when I needed to bake an AMI running Redhat[^version] there were 2 issues that cropped up.

[ansible]: https://www.ansible.com

[packer]: https://www.packer.io

[^version]: Either RHEL 6 or 7, both gave me the same issues.

# Requiretty

Redhat has requiretty enabled by default in its sudoers file. This is a security focused featured that means you can only become sudo if you log in with an interactive terminal by using a specific flag (`-t`) when you SSH into it or starting this after you log in. As most of the interactions when creating an AMI are around installing or configuring tools as root, I obviously needed sudo access but instead I got the below error message.

```bash
sudo: sorry, you must have a tty to run sudo
```

Now, it is possible to provide a `ssh_pty: true` flag to your Packer configuration, but unfortunately this led to various other issues later in the process so that option was out. Instead I ended up following the advice in [this GitHub issue][ttysolution] and added userdata to the Packer configuration that removes `requiretty` from the sudoers file. Userdata in the AWS EC2 context is code that is run when the instance is started. It's also always run as root, meaning you can use it to bypass the requiretty requirement as it doesn't use sudo.

Adding userdata to your packer configuration is easy, there are 2 options for it: `user_data` and `user_data_file`. For the first of these you add the code directly in your packer configuration while the second lets you include a file. The biggest advantage of using the file is that you don't need to escape any of the values in it, making it easier to manage. So, obviously I used a file.

```json
"user_data_file": "removetty.sh"
```

```bash
#!/bin/bash
sed -i.bak -e '/Defaults.*requiretty/s/^/#/' /etc/sudoers
```

All that this does is comment out the `requiretty` line so it's no longer an issue.

[ttysolution]: https://github.com/mitchellh/packer/issues/3406

# SSH error

So, with this resolved I was then faced with the next issue.

```bash
SSH Error: data could not be sent to the remote host. Make sure this host can be reached over ssh
```

What a fun little error! Because the lines above it are all about SSH keys I initially thought this was because of problems with the user or keys, but that turned out to be unrelated and instead this is because it tries to set up an SSH connection and runs into issues with the tty. The problem is documented in [another GitHub issue][sshsolution] which also conveniently supplies a workaround. Adding the below line as a parameter to the ansible provider solves it.

```json
"ansible_env_vars": ["ANSIBLE_SCP_IF_SSH=true", "ANSIBLE_HOST_KEY_CHECKING=false"]
```

The first parameter ensures that Ansible will make connections through SCP when appropriate, thereby working past the issue with the tty. The second is to ensure that it won't ask you a silly question like:

```bash
The authenticity of host '[127.0.0.1]:56889 ([127.0.0.1]:56889)' can't be established.
RSA key fingerprint is SHA256:jqvqKR/buLH5OXUriqM9QPuFRdqLn+0rYAY4j5t7aQ0.
Are you sure you want to continue connecting (yes/no)? yes
```

After having done all of the above, everything worked as intended.


[sshsolution]: https://github.com/ansible/ansible/issues/13401
