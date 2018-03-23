---
title:        Featured in the Serverless Application Repository
slug:       featured-in-the-serverless-application-repository
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2018-03-23T20:09:44+11:00
categories:
  - AWS
keywords:
  - aws
  - serverless
  - code
Description:  "Yesterday I woke up to an email from AWS, saying that the serverless app I wrote was being featured on the SAR website. Which seems like a good enough reason to detail how it works."
---


Yesterday I woke up to an email from AWS, saying that the serverless app I wrote was being featured on the SAR website. Which seems like a good enough reason to detail how it works.

# Being Featured

Let's be clear, while being featured is always fun, in this case it just means that Packer Cleaner (and my name) are mentioned at the bottom of the page [describing the SAR](https://aws.amazon.com/serverless/serverlessrepo/)[^1].

![](/2018/03/featured-in-the-serverless-application-repository/sar_featured.png)

It doesn't look like it has triggered a lot of new installs, but it is a healthy sign that AWS is serious about promoting the SAR[^2]. When it was first released they already had some featured apps, but those were all added during the beta phase. I honestly haven't looked much at that page since, so I don't know if the apps mentioned there are refreshed on a regular basis or if this is the first refresh.

Either way, I hope they'll keep rotating apps so that it becomes a good place to find some quality apps.

# Packer Cleaner Code

Now, Packer Cleaner is a straightforward Python script. Let's go through it in sections to see what it does.

```python
from __future__ import print_function

import json
import urllib
import boto3
import datetime
import os

max_runtime = int(os.environ['max_runtime'])
# Available methods: stop or terminate, anything else means only notification
method = os.environ['method']
sns_topic = os.environ['sns_topic']

client = boto3.client('ec2')
```

As expected, the top consists of all the preparation work. Importing all required libraries, setting the variables defined by the Lambda function, and initialising the `boto3` client.

In the next part we start looking for the Packer instances themselves. This is done based by filtering both that the instances is running[^3] and that the key is named according to the schema Packer gives the keys it uses to access a machine. This is run inside a `try` statement to ensure we can catch any permission issues.

```python
def lambda_handler(event, context):
    try:
        response = client.describe_instances(
            Filters=[
                {
                    'Name': 'key-name',
                    'Values': [
                        'packer *'
                    ]
                },
                {
                    'Name': 'instance-state-name',
                    'Values': [
                        'running',
                    ]
                },
            ]
        )
```

Then it's simply a matter of looping over the `Instances`[^4] and comparing the launch time of the instance with when it should have ended based on the `max_runtime` set at the top. If an instance has been running for too long, it gets put into the `instances_to_terminate` array.

```python
        instances_to_terminate = []
        for reservation in response["Reservations"]:
            for instance in reservation["Instances"]:
                launchTime = instance["LaunchTime"]
                tz_info = launchTime.tzinfo
                now = datetime.datetime.now(tz_info)
                delta = datetime.timedelta(hours=max_runtime)
                the_past = now - delta
                # If the instance was launched more than the max_runtime ago,
                # get rid of it
                if the_past > instance["LaunchTime"]:
                    instances_to_terminate.append(instance["InstanceId"])
```

The next part is obvious, if we have any instances that were running for too long, these will be handled according to the method we set. As we already put the instance ids in an array, this can just be passed into the respective `stop_instances` or `terminate_instances` functions.

```python
        if len(instances_to_terminate) > 0:
            print("These instances were running too long: ")
            print(instances_to_terminate)
            # Decide how to handle the instances
            if method == "stop":
                client.stop_instances(
                    InstanceIds=instances_to_terminate
                )
            elif method == "terminate":
                client.terminate_instances(
                    InstanceIds=instances_to_terminate
                )
```

Then we end the handler function by sending the same list to an SNS topic if that was defined and catching the exception.

```python
            # Send an SNS message if the topic is defined
            if sns_topic != "":
                send_sns(instances_to_terminate)
    except Exception as e:
        print(e)
        raise e
```

The `send_sns` function is defined next, and doesn't contain surprises either. It first sets up the required `boto3` client before it formats the message we'll send the payload to the SNS Topic.

```python
def send_sns(instances):
    snsclient = boto3.client("sns")
    message = "The following instances were running too long:"
    for instance in instances:
        message += "\n* " + instance
    if method == "stop":
        message += "\n\nThey have been stopped"
    if method == "terminate":
        message += "\n\nThey have been terminated"
    snsclient.publish(TopicArn=sns_topic,
                      Message=message,
                      Subject="Packer instances running too long")
```

# The SAM Template

While we're at it, let's take a quick look at the SAM template as well. This too starts with all of the usual things like defining the `Transform` and setting the `Parameters`. It still doesn't have the `AllowedValues` as I haven't tested yet if that particular issue is fixed.

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Checks Packer instances to see if they've been running for too long
Parameters:
  RunFrequency:
    Type: String
    Description: When should the applications run checks?
    Default: rate(1 hour)
  MaxPackerRuntime:
    Type: Number
    Description: The number of hours after which a Packer instance can be cleaned up
    Default: 2
  CleaningMethod:
    Type: String
    Description: "What should be done with instances? terminate and stop require additional IAM permissions. Allowed values: notification, terminate, stop"
    Default: notification
```

The `Resources` section is a bit more interesting, with most of it taken up by the `AWS::Serverless::Function`. The properties in there define everything, from the location of the code—which gets changed when running the `aws cloudformation package` command—to the environment variables and policies. It also contains the `Events`, which is where the CloudWatch Schedule trigger is set.

```yaml
Resources:
  PackerCleaner:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.lambda_handler
      Runtime: python2.7
      CodeUri: ./code
      Description: Cleans up long-running Packer instances
      Environment:
        Variables:
          max_runtime: !Ref MaxPackerRuntime
          method: !Ref CleaningMethod
          sns_topic: !Ref PackerTopic
      Policies:
        - EC2DescribePolicy: {}
        - SNSPublishMessagePolicy:
            TopicName: !GetAtt [PackerTopic, TopicName]
      Events:
        HourlyTrigger:
          Type: Schedule
          Properties:
            Schedule: !Ref RunFrequency
```

The only other `Resource` in the template is the SNS Topic that is created for sending the messages.

```yaml
  PackerTopic:
    Type: AWS::SNS::Topic
    Properties:
      DisplayName: packer_cleaner
```

As I said, there aren't a lot of exciting things happening in the code, but that's part of why it's useful. It's a single purpose Lambda function that only does what it needs to do.

Again, let me point you to the [GitHub repo](https://github.com/ArjenSchwarz/packer_cleaner) and the app's [entry in the SAR](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:613864977396:applications~Packer-Cleaner), and then I'll invite you to write something for the SAR yourself. As you can see, you don't need to write something complicated as even a small function such as this can be very useful. And if you run into limitations that prevent you from building what you want, make sure to point this out to AWS so that hopefully they'll use all this feedback to allow us to build more useful functions.

[^1]:	I'm not going to be writing the full name out, too much work.

[^2]:	And apparently they don't hold it against you if you [point out limitations](/2018/03/publishing-to-the-serverless-application-repository/).

[^3]:	Obviously.

[^4]:	Which are still stored inside the `Reservations` section.
