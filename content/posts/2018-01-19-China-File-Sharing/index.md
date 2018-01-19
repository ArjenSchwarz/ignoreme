---
title:        File Sharing in China
slug:      file-sharing-in-china
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:           2018-01-19T16:59:22+08:00
categories:
  - Workflows
Description:  "Once again visiting China, I ran into an issue. How do I share photos taken on my iPhone with Android users in a country where most file sharing options don't work?"
---

Once again visiting China, I ran into an issue. How do I share photos taken on my iPhone with Android users in a country where most file sharing options don't work? 

Let me start with saying that I don't have a perfect answer for this due to some iOS limitations. That said, I started writing this article shortly after I ran into this and it has helped me in figuring out something I'm mostly happy with.

# The problem 

The issue isn't so much that I have an iPhone[^1], as it is that the services I use to share files don't work in China. There is no access to anything from Google, which rules out both my email and Google Drive, and Dropbox doesn't work either. 

And for some reason that I can't fathom, iCloud Drive or Photos doesn't have the ability to share a photo properly. By which I mean that you can give someone a link to a file. Obviously, social media and messaging apps were out as well. Except for WeChat, which I don't have[^2].

In the end I did have an easy way to solve it in this situation, as I could AirDrop the photos to someone else with an iPhone who then sent it on through WeChat. However, that might not always be the case and I still wanted to eventually solve this issue so I don't run into it again.

# Possible solutions

So, in order to have this work easily in the future, what did I come up with?

As usual, my mind goes to the things I'm most familiar with. Which means that I quickly ended up with the idea of uploading it to an S3 bucket and letting people download it from there. As that can use a URL I own I can be pretty sure it's not blocked in China[^3]. Which then changes the issue to "How do I get the files on S3".

Or rather, the entire workflow I want is:

1. Select photos (or any other files)
2. Create a zip file
3. Temporarily store this locally
4. Upload this to S3
5. Display the URL for the file and put it on my clipboard
6. Use S3 lifecycle management to remove the files after 30 days.

The AWS Console app doesn't let you upload files, and besides I don't really want to log into my AWS account using anything more than the bare minimum of permissions for what's needed. So, basically I just want to use an API call. And preferably something that is completely automated. I also considered posting the file through a Lambda function, but I'm not confident that scales well if the zip file becomes very big.

So, the first steps of this are easy to do. I can build a [Workflow](https://itunes.apple.com/au/app/workflow/id915249334?mt=8&uo=4&at=1000l9pK&ct=ignoreme) that lets me select photos, zips them up[^4], and then stores them somewhere. If this was for Dropbox I could have it simply store the file in a dedicated Dropbox folder and get a share link. Unfortunately, there is no such integration for S3 directly into the iOS Files app. 

![](/2018/01/file-sharing-in-china/9486F4A5-5FF3-4A4A-911C-4621C1D02B4B.jpeg)

Technically speaking I can have Workflow post the file through Transmit, but as that was announced as being [end of life](https://panic.com/blog/the-future-of-transmit-ios/) that's not really an option I want to use. MacStories had an article this week [detailing some alternatives](https://www.macstories.net/ios/ipad-diaries-transmit-replacements-and-ftp-clients/), but they all seem to have downsides. Most importantly, there is no way to automate the process. For all of these, I would have to open the app, use the Files browser to select the file I want, import that into the app and then upload it to S3. While I can do so, it is far too much manual work for what I want.

In the end, it came down to using [Pythonista](https://itunes.apple.com/au/app/pythonista-3/id1085978097?mt=8&uo=4&at=1000l9pK&ct=ignoreme), which allows you to write and run Python scripts on your iOS device. With that I can use the Boto3 framework to push things to S3, but the big issue is how to get the images into the app. Unfortunately, due to sandboxing restrictions I can't have Workflow save the files somewhere that Pythonista can directly open them. 

As I have no idea how to work around that, I therefore will just open the Files app and do the last step directly from there.

![](/2018/01/file-sharing-in-china/A89A0D8E-8DA0-4601-8366-F817482DE1DC.jpeg)

Where that last step is then "sharing" that file, and selecting the Pythonista script to run on it.

```python
from __future__ import absolute_import
from __future__ import print_function
import appex
import boto3
import keychain
import sys

# Set the access key and retrieve secret key from keychain
key = "NOT_MY_KEY"
secret = keychain.get_password("aws-arjen", key)
if secret == None:
  secret = console.password_alert("Enter secret key")
  keychain.set_password("aws-arjen", key, secret)

print("Connecting")
s3_client = boto3.client(
  's3',
  region_name="us-east-1",
  aws_access_key_id=key,
  aws_secret_access_key=secret)

if appex.is_running_extension():
  filepath = appex.get_file_path()
  filename_array = filepath.split('/')
  filename = filename_array.pop()
  print("Uploading...")
  s3_client.upload_file(filepath, 'NOT_MY_BUCKET', filename)
  print("Uploaded the file, now available as:")
  print("https://NOT_MY_URL/" + filename)
else:
  print("You need to run this as an extension")
```

I can and probably will do a little bit of cleaning up of the script[^5], but as you can see it's pretty straightforward. The AWS secret access key is stored in keychain and then we just make a connection to S3 and upload the file. When you share a file explicitly as is required for this script, it doesn't matter where it comes from as it then has permission to access it.

One advantage of using a share extension through Pythonista is that I can upload any file I want, but I'm still a bit disappointed I can't make it work fully automated.

[^1]:	Although that prevented basic Bluetooth copying to an Android device.

[^2]:	And I later discovered Slack works as well, but that's too much work to set up to act as a proper solution anyway.

[^3]:	I suspect that if my site gets blocked in China, it might not be a good idea to visit the country either.

[^4]:	Potentially first transforming them into JPEGs if they're stored as HEIF and/or are live photos.

[^5]:	At which point I'll put it on GitHub somewhere as well.
