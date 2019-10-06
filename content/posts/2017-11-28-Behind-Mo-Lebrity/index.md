---
Categories:
- Security
- AWS
Slug: behind-mo-lebrity-at-bulletproof
Author: Arjen Schwarz
Title: Behind Mo-Lebrity @ Bulletproof
date: 2017-11-28T14:35:04+11:00
lastmod: 2019-10-06T13:39:40+11:00
summary: "Together with my colleagues at Bulletproof we wondered if we could do something fun and interesting to help the charity Movember. This quickly turned into a brainstorming session that resulted in a number of ideas, where we eventually settled on Mo-lebrity: a site where someone can take a photo of themselves and see which moustache-wearing celebrity they look the most like."
---

It started as a simple question, can we do something fun and interesting to help the charity [Movember](https://movember.com/)? This quickly turned into a brainstorming session that resulted in a number of ideas, where we eventually settled on [Mo-lebrity](https://www.molebrity.io/): a site where someone can take a photo of themselves and see which moustache-wearing celebrity they look the most like.

<div class='ignoreme-update'>
<strong>Update October 6, 2019:</strong> The original version of this post was on the Bulletproof blog. Unfortunately as that company was acquired by AC3 a number of blog posts are no longer available there, including this one. So I've reposted it here in full.
</div>

The next step was then to figure out how to make this work. We set ourselves another goal, to make this all serverless. Which means that we didn't want to use any servers or traditional databases and instead only use AWS services like [Lambda](https://aws.amazon.com/lambda), [DynamoDB](https://aws.amazon.com/dynamodb), and of course [Rekognition](https://aws.amazon.com/rekognition). This post aims to take the hood off and give a peek at how we made this all work together.

The interface you see when you visit the website is created using the JavaScript framework [React](https://reactjs.org/). This allows it to run on [S3](https://aws.amazon.com/s3) without the need for any servers to host the website itself. In front of this is [Cloudfront](https://aws.amazon.com/cloudfront), and [Lambda@Edge](http://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html) to provide some extra functionalities.

![](/2017/11/behind-mo-lebrity-at-bulletproof/Mo-lebrity-site.png)

Just having a good looking website is not enough however, after all it needs to do something. Which means we needed a good matching functionality. In order to match a celebrity the website pushes the photo up to S3 (1), which has lifecycle rules set to delete the photo as soon as possible, and then goes through an API Gateway (2) to call the Lambda function for matching (3) to do the matching. The Lambda function uses Rekognition (4) to compare the photo in the S3 bucket to a set of images we collected. The function takes the closest match, and collects metadata about this photo from DynamoDB (5). Then it returns the photo and metadata to the website (6) which displays it for you to see how your Mo matches up.

![](/2017/11/behind-mo-lebrity-at-bulletproof/Mo-lebrity-matching.png)

This then leaves the question of how the Rekognition collection was created. For this we built code that goes through a Wikipedia page of famous people, follows each link, checks if it describes a person, and then collects the URL of the image as well as metadata such as the attribution for the image. This image is then passed through the Rekognition [Celebrity API](http://docs.aws.amazon.com/rekognition/latest/dg/celebrity-recognition.html) to confirm it is indeed a celebrity.

Based on this match we also retrieve the name of the celebrity, to ensure it is correct. After this match, the image is put through the face detection API which tells us the likelihood of the person having a moustache. Based on this percentage the celebrity is then added to a Rekognition collection including, if it matched high enough, the collection that is used by the matching code.

All of this is held together by the [Serverless framework](https://serverless.com/), which took care of a lot of the boilerplate functionalities for us so we could focus on the functionality we wanted to build.

For us, building this was a fun learning experience for a good cause. If you want to have a look at the code, stay tuned as we will be releasing this soon, in the meantime you can see who your mo-lebrity match is on [the site](https://www.molebrity.io/), and of course feel free to make a donation to this [good cause](https://moteam.co/bulletproof).
