---
title:        Increasing the size of a Redhat-based EBS volume  
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-08-23T17:47:31+10:00
lastmod:      2016-10-31T19:47:09+11:00
categories:   ["AWS"]
keywords: ["ebs", "aws"]
slug:         "increasing-the-size-of-a-redhat-based-ebs-volume"
Description:  "While following my own steps for resizing an EBS volume, I discovered that Redhat-based systems require more."
---

While following my own steps for [resizing an EBS volume][rootebs], I discovered that Redhat-based systems require more. This is a brief overview of what I needed to do to make it work.

# The difference

Ubuntu, which I generally use, will automatically run `resize2fs` when you give your snapshot a bigger disk. Unfortunately, it seems this is not the case when you're building Redhat AMIs. Of course, if it was just a matter of running `resize2fs` I wouldn't need to write about it, so you realise that more than that is needed. Which is true. Let's have a look at the situation.

Using Packer, I built an AMI based on the standard Redhat AMI where I defined the root EBS volume to be 50GB. When I then spin up an instance using this new image, it however shows that only 6GB is available. When running `lsblk` it becomes obvious that while the EBS volume has all 50GB available, it didn't give this to the main partition.

```bash
NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
xvda    202:0    0   50G  0 disk
└─xvda1 202:1    0    6G  0 part /
```

Running `resize2fs` then gives the lovely error:

```bash
The filesystem is already 1234567 blocks long.  Nothing to do!
```

[rootebs]: /2015/03/increasing-the-size-of-a-root-ebs-volume/

# The solution

<div class='ignoreme-update'>
<strong>Update October 31, 2016:</strong> There are a couple of alternative, and probably better, solutions in the comments. Make sure to read those as well as they might suit your situation better.
</div>

So, with nothing happening automatically, eventually[^stack] I turned my attention to a solution using fdisk as proposed in this [Stackoverflow answer][fdiskso]. Obviously, this solution involves manually doing things, so instead I turned it into a script.

```bash
#!/bin/bash
fdisk /dev/xvda <<EEOF
c
u
d
n
p
1


a
1
w
EEOF

# Because it's the active disk, fdisk always returns a warning so we ignore that
exit 0
```

Not my prettiest script, as I really don't like piping values into an interactive script, but it works. You'll see that it has a couple of differences to the Stackoverflow answer. In the first two lines of the piped values I switch off the command mode and make it use sectors. That's because I was working with Redhat 6, so it's possible that the defaults have already changed for 7 in which case you don't want the first two lines in your script. After that I just follow the directions provided: Delete the current partition (no data loss occurs though), create a new partition and set it as primary in the first cylinder. Use the default start and end sectors (the blank lines), make it bootable, and write your changes to disk.

One thing to note here about the size. When looking for this problem you can sometimes see people suggesting to put a value for the start sector. Don't do this. If you use a value that is too low your disk won't be able to boot, and the default value is the right one anyway.

The last line is an ugly, terrible, hack and I despise the need to put it in. The comment describes it already, but it comes down to the fact that fdisk throws a warning. Usually not a problem, but when you run the script from a tool like Packer this will make it fail. So, we force the script to always succeed even when it doesn't. Because hacks like that never cause any problems, right?

Now, it's possible that your changes won't take effect until you restart the system. As I ran it in an AMI this obviously wasn't a problem for me, but it's something to keep in mind.

# Why a script?

While this command can be executed in many ways (include it as userdata for the instance, run it from Packer when creating the AMI, etc). I decided to use it as a script that I bake into the AMI because while I can define the size in the AMI that might not always be the best thing to do. If you wish to reuse the AMI for different purposes you might require multiple sizes of root EBS volumes and in that case you want to keep it as small as possible as shrinking an EBS is a lot harder. With the script readily available in the AMI I can just call that on first boot (using userdata) and end up with the size I need when I need it without needing to define all the parameters each time.

[^stack]: Stackoverflow is your friend.

[fdiskso]: http://stackoverflow.com/a/14930504/5531735
