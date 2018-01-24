---
title:        Increasing the size of a root EBS volume  
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2015-03-20T08:13:14+11:00  
date started: 19-03-2015
date posted:  20-03-2015
lastmod:      2016-08-23T17:47:39+10:00
categories:   ["AWS"]
keywords: ["ebs", "aws", "code"]
slug:         "increasing-the-size-of-a-root-ebs-volume"
Description:  "Sometimes the default size for your root volume in an EC2 instance isn't good enough. As there is no clear documentation on the best way to do this for CloudFormation managed instances, I'm describing my methods for increasing the size here."
---
Sometimes the default size for your root volume in an EC2 instance isn't good enough. As there is no clear documentation on the best way to do this for CloudFormation managed instances, I'm describing my methods for increasing the size here.

# The use case

When creating an EC2 instance it is usually set to use the default 8GB EBS root volume, but now we require more space than this. We can of course attach additional mount points, but in order to keep it simple we prefer not to do so.

That means we need to increase the size of the root volume. First off, you need to realise that this cannot be done without any downtime. If your servers are loadbalanced, make sure to only update them one at a time to prevent downtime.

There are explanations of how to [increase the size of volumes](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-expand-volume.html), but these are not compatible with CloudFormation and your root device might be replaced the next time you do an update. Obviously, that is not a desired outcome.

<div class='ignoreme-update'>
<strong>Update August 23, 2016:</strong> While everything in here is correct, I've found that for certain AMIs the disk won't always be resized automatically. I've written a <a href="/2016/08/increasing-the-size-of-a-redhat-based-ebs-volume/">separate article</a> on how I dealt with those cases.
</div>

# The CloudFormation solution

For this, we will use the [BlockDeviceMappings](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-blockdev-mapping.html) property for `AWS::EC2::Instance`. This setting allows you to set the size of your EBS volumes. Using the DSL this looks like the following snippet

> The below instruction will destroy your current root volume so don't run it until *after* you've read the rest.

```ruby
Resource("TestServer") {
    Type "AWS::EC2::Instance"
    Property("ImageId", FnFindInMap( "AWSRegionArch2AMI", Ref("AWS::Region"),"AMI"))
    Property("BlockDeviceMappings", [
        {
            "DeviceName" => "/dev/sda1",
            "Ebs" => {
                "VolumeSize" => "120",
                "VolumeType" => "gp2"
            }
        }
    ])
}
```

Updating your instance after adding the `BlockDeviceMappings` property this to your configuration will give you a new instance, with a *new* root volume at the specified size. In this case, a 120GB SSD[^ssdexplanation] volume. If that is all you need, you're done. If you wish to retain the data you need to do a bit more work before running the above.

Unfortunately, you cannot change the Snapshot Id for a root volume so we need another solution than taking a snapshot of the volume. What we'll do is create an AMI based on the whole instance instead.

First we will want to stop the instance, to ensure there can't be any data loss.

```bash
aws ec2 stop-instances --instance-ids "i-123456" --profile demo
```

And then we'll create the actual image.

```bash
aws ec2 create-image --instance-id i-123456 --name "test-bigger" --description "Bigger disk for Test server" --profile demo
```

The output of this command is similar to this.

```bash
{
    "ImageId": "ami-123456"
}
```

Now all that you need to do is update the ImageId in your CloudFormation template, add the `BlockDeviceMappings` section and update your stack to have your current instance replaced with a new one that has the increased disk size.

# Without CloudFormation

If you're not using CloudFormation you can still use the above method of creating an AMI and then launching a new instance using this. However, as your instance will likely be connected to other things like an Elastic IP it might be easier instead to replace the root volume. You can do this with the following commands.

Let's start with making sure we have all the information we need. We need the volume id of the root device, which we can find using the below command.

```bash
aws ec2 describe-instances --instance-id i-123456 --profile demo
```

Next, we stop the instance.

```bash
aws ec2 stop-instances --instance-ids i-123456 --profile demo
```

Then we create a snapshot of the root volume. The output of the command to create this snapshot also will provide the snapshot id.

```bash
aws ec2 create-snapshot --volume-id vol-123456 --description "backup for test server" --profile demo
```

Now we can create a volume based on this snapshot. When doing so we provide the size in GiB, the id of the snapshot, the availability zone, and the volume type.

```bash
aws ec2 create-volume --size 100 --snapshot-id snap-123456 --availability-zone us-east-1a --volume-type gp2 --profile demo
```

Now all we need to do is swap the the volumes and start the server again.

```bash
aws ec2 detach-volume --volume-id vol-123456 --profile demo
aws ec2 attach-volume --volume-id vol-234567 --instance-id i-123456 --device "/dev/sda1" --profile demo
aws ec2 start-instances --instance-ids i-123456 --profile demo
```

And that's all. The EC2 instance is now using the new volume and you can remove the old volume whenever you wish.

[^ssdexplanation]: Amazon's gp2 volume type is used to describe their SSD disks. The name seems to stand for 'general purpose version 2'.
