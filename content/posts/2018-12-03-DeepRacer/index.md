---
title:        DeepRacer
slug:       deepracer
blog:         ig.nore.me
author:       Arjen Schwarz
Date:         2018-12-03T21:53:33+11:00
categories:
  - AWS
keywords:
  - aws
  - machinelearning
  - ml
  - deepracer
Description:  "In lieu of a single weekly note, I will be writing several articles to catch up with some of the events from re:Invent. Chris helped out last week with his post about the DynamoDB changes, and today I will start my write-ups with the coolest new toy: DeepRacer."
---


In lieu of a single weekly note, I will be writing several articles to catch up with some of the events from re:Invent. Chris helped out last week with his post about the DynamoDB changes, and today I will start my write-ups with the coolest new toy: DeepRacer.

[DeepRacer](https://aws.amazon.com/blogs/aws/aws-deepracer-go-hands-on-with-reinforcement-learning-at-reinvent/) is a self-driving car, or rather a self-driving toy car. It's small, and you can buy it yourself on Amazon for an introductory price of $250 USD. At re:Invent attending the DeepRacer workshop ensured you would get one, and it will come as no surprise that these workshops then became super popular[^1].

## Reinforcement Learning

But before going into DeepRacer itself, let's look at the reason why it exists in the first place. One of the new functionalities introduced for [SageMaker is reinforcement learning](https://aws.amazon.com/blogs/aws/amazon-sagemaker-rl-managed-reinforcement-learning-with-amazon-sagemaker/). This is a specific type of training a machine learning model, where the model gets taught by rewarding or punishing certain behaviours. In other words, it's very close to how you would for example train a dog[^2]: when it does something right you give it a treat, and when it does something wrong you don't give it one.

Except this will all take place into simulated environments and you will be able to have more granular control over your rewards. And hopefully your model is paying more attention than your pet[^3].

## DeepRacer

So, where does DeepRacer come in here? In essence, it's a toy to get you hooked on reinforcement learning. The idea is simple, you have your car and you need to train a model that carries it around the track in the shortest amount of time. Let's have a look at how that works.

Unfortunately I start here with bad news, right now DeepRacer is not enabled for every account[^4]. And there is no link in the Console to it either. What you need to do is to manually change the URL to go to where the link will point to, which is basically /deepracer (or even easier, just click [this link](https://console.aws.amazon.com/deepracer)). There you will be redirected to a sign-up page.

Luckily, the temporary account that we got during [the workshop](https://github.com/aws-samples/aws-deepracer-workshops) still seems to work[^5], so I'm using that to demonstrate this.

![](/2018/12/deepracer/create-model.png)

The goal is to train your model. You do this by writing the reward and punishment system I described above. The example code, which works pretty well, trains the car by teaching it to stay in the middle of the road.

```python
def reward_function(on_track, x, y, distance_from_center, car_orientation, progress, steps, throttle, steering, track_width, waypoints, closest_waypoint):

    marker_1 = 0.1 * track_width
    marker_2 = 0.25 * track_width
    marker_3 = 0.5 * track_width

    reward = 1e-3
    if distance_from_center >= 0.0 and distance_from_center <= marker_1:
        reward = 1
    elif distance_from_center <= marker_2:
        reward = 0.5
    elif distance_from_center <= marker_3:
        reward = 0.1
    else:
        reward = 1e-3  # likely crashed/ close to off track

    return float(reward)
```

I'm not going to take you through the rest of the details here, they are clearly explained in the [workshop documentation](https://github.com/aws-samples/aws-deepracer-workshops). But, once you have created your training model, the fun actually starts.

![](/2018/12/deepracer/Screen%20Shot%202018-11-30%20at%2012.24.26.png)

Well, it will start after about 6 minutes. Apparently training machine learning models doesn't quite work with my usual way of working where I expect a result within a couple of seconds to see if it was written correctly.

![](/2018/12/deepracer/training-results.png)

As you define the time a training takes, it will keep running the model over and over again until that time has been reached. It also shows you the results of your reward, which you return at the end of your function as shown above.

The best part however, happens while you're training. Using a combination of RoboMaker and Sumerian, you can follow live what is happening during the training.

{{% youtube QMlCte9pph4 %}}

Yes, this can be quite a lot of fun. Especially when your car is not behaving as you want it to and you can make fun of it with friends.

![](/2018/12/deepracer/Screen%20Shot%202018-11-30%20at%2021.39.23.png)

Moving on though. Once your training is complete (for a good model you'll probably want about 2 hours of training), you can then do an evaluation to see how well the model performs. What this means is that it's once again put on the track, but without the reinforcement training and you'll get to see how well it performed.

![](/2018/12/deepracer/evaluation-results.png)

Personally, I one day hope to get good results out of this.

After this you can export your model and run it on your actual car where you can make it run on your track. Unfortunately, right now my car is[^6] somewhere between Las Vegas and my house.

{{% tweet user="ArjenSchwarz" id="1068215326288924673" %}}

## DeepRacer League

So, one other thing that AWS announced is that they will be running DeepRacer championships at all of their Summits in 2019. While there was a competition at re:Invent itself, this was obviously not very intensive as there wasn't a lot of time to train the models. I think that will be a lot of fun in itself.

However, as they also released instructions on how to [build your own physical tracks](https://docs.aws.amazon.com/deepracer/latest/developerguide/deepracer-build-your-track.html) I have spoken to a number of people who are planning to build these and have some additional competitions. Unfortunately at this stage it's unclear if you can design your own tracks and upload those to the DeepRacer UI. Right now only the re:Invent 2018 track is available for training, but it would be really nice to build our own.

[^1]:	I myself waited [1.5 hours in line](https://twitter.com/8_b1t_chr15/status/1067970134831026176) to ensure I got a spot. Well worth the wait.

[^2]:	Please note, I have no actual experience with training pets. I only had fish while growing up and they never paid any attention to me.

[^3]:	Unless you want to train a simulated fish I guess.

[^4]:	I really hope at least those of us who got a DeepRacer will get access soon.

[^5]:	Please don't tell anyone at AWS about this...

[^6]:	hopefully