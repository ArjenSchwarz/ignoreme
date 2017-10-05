---
title:        "Aqua: Easy API Gateway creation"
slug:         "aqua-easy-api-gateway-creation"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-04-20T09:54:05+10:00
categories:   ["AWS"]
projects:     ["Aqua"]
Description:  "Last month I wrote about the installation script I built for Igor, but as I started writing more Lambda functions recently I realized that I needed that same functionality in a more easily accessible way. So I created Aqua to do this for me."
---

Last month I wrote about the [installation script][bashscript] I built for Igor, but as I started writing more Lambda functions recently I realized that I needed that same functionality in a more easily accessible way. So I created Aqua[^name] to do this for me.

[^name]: The name comes from the weird way my mind sometimes wanders. Gateway => arches => aqueducts => water.

# What is Aqua?

Aqua is an application capable of building the API gateways for your Lambda function. What it creates is a straightforward path, without support for things like complicated models or multiple endpoints. Instead, it just focuses on creating something that works for many (at least my) use cases in the easiest way possible. Oh, and it can run as a Lambda function itself.

# Why use this?

As I've [mentioned in the past][bashscript], setting up API Gateways is a pain and I don't like the amount of time that goes into it. Usually my requirements for the API Gateway are extremely simple, just a translation from a form to something Lambda can handle[^lambdacan]. And in those cases I just want to be able to create my function, push it up, and have everything work without spending an hour clicking through the interface.

In an attempt to keep Aqua as simple as possible, the functionalities are limited. This may change in the future, but it's designed to create a very simple API Gateway for Lambda functions. It's not to be used for designing big and complicated Gateway configurations. But then, for Lambda functions this will probably usually be enough.

[^lambdacan]: Lambda is incapable of handling request parameters of any type, so they always need to be translated by the API Gateway.

[bashscript]: https://ig.nore.me/2016/03/setting-up-lambda-and-a-gateway-through-the-cli/

# How does it work?

If you want to use it, you can simply download the binary that matches your system. No configuration is needed, and the only thing that you require is access to your AWS account. Authentication to AWS is handled by the AWS SDK, which allows 3 different ways:

* Use the values in your environment variables (`AWS_ACCESS_KEY` and `AWS_SECRET_ACCESS_KEY`).
* Use the values in your `~/.aws/credentials` file.
* Use the permissions from the Role the application has access to (when running on AWS)

There are several different parameters and commands you can provide to Aqua. You can see them all when you ask for help:

```bash
$ aqua --help
Usage:
  aqua [flags]
  aqua [command]

Available Commands:
  apikey      List and create API keys
  install     Install Aqua as a Lambda function
  role        Display or create IAM roles

Flags:
  -k, --apikey                  Endpoint can only be accessed with an API key
  -a, --authentication string   The Authentication method to be used (default "NONE")
  -f, --file string             The zip file for your Lambda function, either locally or http(s). The file will first be downloaded locally.
      --json                    Set to true to print output in JSON format
  -n, --name string             The name of the Lambda function
      --region string           The region for the lambda function and API Gateway (default "us-east-1")
  -r, --role string             The name of the IAM Role
      --runtime string          The runtime of the Lambda function. (default "nodejs4.3")

Use "aqua [command] --help" for more information about a command.
```

To show how it actually works though, I'll quickly take you through the most common use cases.

## Add a Gateway to an existing function

If you have already created your Lambda function, and only want to add a Gateway to it you can do so by running:

```bash
$ aqua --name functionname
endpoint: https://l95wn9kf7.execute-api.us-east-1.amazonaws.com/prod/functionname
api: l95wn9kf7
```

This will then create a gateway with a POST endpoint[^postonly] that simply translates all form fields into a JSON object formatted like the below example and passes that to the Lambda function.

```json
{ "body": "param1=value1&param2=value2" }
```

Aqua will not change any existing API Gateways. That means if you run it, Aqua will *add* an endpoint. It will not remove an endpoint, or change an existing one. You can have multiple endpoints for a Lambda function, so you might want to keep an eye on that.

[^postonly]: Yes, at the moment only POST is supported. Adding GET support (and others) will require different API structures, so I haven't done so yet.

## Create a Lambda function with a Gateway

If you haven't created a Lambda function yet, but already want to create the Gateway you can do this the same way. When Aqua discovers that a function doesn't already exist, it will try to create it first. This does require that you provide Aqua with the name of the IAM role you wish to use for the function, and potentially the location of the zip file you wish to upload[^nos3].

Please note, Aqua doesn't create roles automatically. As from a security standpoint many AWS users will not be able allowed to create roles, this will otherwise cause problems. You *can* use Aqua to create certain roles, but this needs to be done as a separate command.

```bash
aqua --name functionname --role SimpleLambda --file path/to/file.zip
```

The above example will create a Lambda function called "functionname" and assigns the role "SimpleLambda" to it. For the code it will provide the zip file added as an argument.

It is possible to create a function without providing a zip file[^nozip]. In that case it will create a very simple NodeJS application that echoes back the query parameters you send it.

[^nos3]: At the moment this is limited to either local or http(s), it doesn't support uploading from an S3 bucket yet.

[^nozip]: There can be different reasons why you might want this, but the main reason it's built in is for the Lambda functionality.

## Create a Role

As mentioned, you can create roles using Aqua. This is limited to a couple of basic roles as well as a role specific for making Aqua work on Lambda.

```bash
$ aqua role create --name TestRole --type basic
Role TestRole of type basic has been created
```

While these roles are useful, I recommended that you create the roles you actually want using your management tool of choice[^limitroles]. See the [AWS documentation regarding Roles][rolesdoc] for more information.

[^limitroles]: And of course, manage who can assign which roles to a Lambda function.

[rolesdoc]: http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html

# Run it as a Lambda function

You can run Aqua as a Lambda function itself as well. This means that you can share its functionality with other people on your team, without them needing to install it. Or, more likely, so that you can use its functionalities from a machine where you don't have an API key installed.

Please be aware that this has obvious security implications. Anyone able to access a Lambda version of Aqua will be able to add unsecured endpoints for your Lambda applications. It is therefore **important** that you add some kind of security to this API Gateway. Following the below installation instructions it will by default create an endpoint that requires an API key to access it.

Installing the Gateway as a Lambda function is very easy using the built-in installation functionality:

1. Download Aqua for your machine
2. Run `aqua role create --name AquaRole --type aqua` to create the required Role (or create it manually)
3. Run `aqua install --name aqua --role AquaRole`

And that's all. At this point it's installed, and the access is limited by use of API keys. You will need to [assign these API keys][apikeydocs] yourself though (or use any other type of security you want).

As a Lambda function Aqua can only use its most basic functionalities:

* Add a Gateway to an existing Lambda function
* Create the default Lambda function, with its Gateway.

No other functionalities are supported by the Lambda function.

## API key

To make life a little easier, it's possible to create an API key and assign this key to the API using the command:

```bash
$ aqua apikey create --name testkey --description "Key for testing" --apiid 72nounhf38
```

Unfortunately, due to limitations of the SDK[^sdklimitation], it's currently not possible to add an existing to key to an API using Aqua. You will have to do that using the Console.

[apikeydocs]: http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-api-keys.html

[^sdklimitation]: If you happen to know a way to do this, please let me know.

# Why all the limitations?

Quite simply, I don't want Aqua to do too much. For example, when you're building a complete API, there are better options for it than a command line application. I use Aqua to quickly have something up and running, and if it can do all the things that can be done with the Console, CLI, or SDKs it will no doubt become just as unwieldy. If you have bigger requirements, it's still possible that Aqua will help you be a little faster, but you'll have to try that out for yourself.

Of course, if you believe that Aqua is missing something important feel free to create an issue (or pull request) in it's [GitHub repository][ghaqua]. I don't doubt that there are features that will improve Aqua without making it more unwieldy. For now though, it does exactly what I need it to do so I can spend more time working on other projects instead of getting annoyed.

If you think Aqua is useful for you, you can download the latest version for your Operating System [here][dlaqua]. Finally, below is a short demo of some of the features, going from nothing to installing Aqua as a Lambda function and then using that Lambda function to create another Lambda function.

![Demo](https://cloud.githubusercontent.com/assets/1787643/14594491/7c09ac98-057a-11e6-9cf4-1097d1c887b9.gif)

[dlaqua]: https://github.com/ArjenSchwarz/aqua/releases#latest

[ghaqua]: https://github.com/ArjenSchwarz/aqua
