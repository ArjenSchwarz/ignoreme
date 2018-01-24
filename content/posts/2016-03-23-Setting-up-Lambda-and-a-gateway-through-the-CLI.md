---
title:        Setting up Lambda and a gateway through the CLI
slug:         "setting-up-lambda-and-a-gateway-through-the-cli"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-03-23T15:34:59+11:00
lastmod:      2016-09-23T09:54:55+10:00
categories:   ["AWS"]
projects:     ["Igor"]
keywords: ["serverless", "awscli", "code", "aws"]
Description:  "When I set up Igor in Lambda for the first time, I mostly followed the directions as provided in a Lambda template. This template has a description of all the steps that need to be taken, but to be honest it's a bit unwieldy. So I created a script to do this for me."
---

When I set up [Igor](/2016/03/introducing-igor/) in [Lambda](https://aws.amazon.com/lambda/) for the first time, I mostly followed the directions as provided in the *Python slack-slash-command* Lambda template. This template has a description of all the steps that need to be taken, but to be honest it's a bit unwieldy.

That's not the fault of the template, it's just that there are a lot of tiny things that need to be configured everywhere. In order to deal with that, I wrote a lengthy description of how to do this in the README[^1]. That however, is not the best solution if I want people to start using Igor. What's needed for that is a way to make it easy to install[^2].

So, I decided to write a script that would do this. The current version is a bash script that does all the work, but now that I know everything that is needed I might create a small Go application instead to make it more cross-platform. Instead of talking about that though, let's dive into the code. If you want to have a look at the complete (commented) scripts themselves you can do so [on GitHub](https://github.com/ArjenSchwarz/igor/installation).

# Creating a role

To set up a Lambda function, you need to grant that function a role. As it's very possible that people installing Igor will already have a role that is needed, I put this in a separate script called `createiamrole.sh`.

```bash
#!/usr/bin/env bash
aws iam create-role --role-name "IgorRole" --assume-role-policy-document file://iamtrustdocument.json
aws iam put-role-policy --role-name "IgorRole" --policy-name "IgorRolePolicy" --policy-document file://basiciamrole.json
```

The complete script first does some checks if a role by this name already exists, and if it does will output the ARN[^3] for that instead of creating a new one. The more interesting part however is the above. In this article you'll find that a lot of prep work is often needed before your desired result is reached, so it is the case for the role.

First a role needs to be created, and for this you need a Trust Document. The Trust Document is a JSON file that shows the principal service the role will be attached to, in this case Lambda.

```json
{
 "Version": "2012-10-17",
 "Statement": {
   "Effect": "Allow",
   "Principal": {"Service": "lambda.amazonaws.com"},
   "Action": "sts:AssumeRole"
 }
}
```

Now that the role is created, you can add the policy to it. The policy is what will actually determine what the Lambda function is allowed to do. As Igor doesn't (currently) do anything else with AWS, it only needs permission to write to Cloudwatch logs.

Lastly, the script will print the ARN for the just created role.

# Creating the Lambda function

We have now reached the real work in the main `setupaws.sh` script. This script accepts 3 parameters:

* The ARN of the role that needs to be used
* The name of the Lambda function
* The region it needs to be deployed in

The last two default to *igor* and *us-east-1* respectively, so they are optional. Leaving aside the boilerplate for dealing with these parameters, the first thing that needs to be done is adding the Lambda function itself. This is a relatively simple command.

```bash
aws lambda create-function --function-name "${NAME}" --runtime nodejs --role ${ARN_ROLE} --handler index.handler --zip-file fileb://igor.zip --region ${REGION}
```

All that happens here is that a function is created with the required settings, including the zip file containing the code. This last item is uploaded as part of the process[^4]. Unlike when you update your Lambda's function code, there is no requirement to publish this version. That happens automatically.

```bash
LAMBDAARN=$(aws lambda list-functions --query "Functions[?FunctionName==\`${NAME}\`].FunctionArn" --output text --region ${REGION})
```

Because it's needed later, the next line of code looks through the list of functions, queries there for the function with the right name, and retrieves its ARN.

# The API Gateway

And now we reach the truly fiddly bit: the API Gateway. The gateway is very useful, but configuring it is a pain. Especially the first time you do so, which is exactly why I wrote this installation script as I can reuse it for other projects.

A quick overview of what is needed here:
* First you need to create the gateway
* Then you need to add the resource, or endpoint, of the API
* This endpoint then needs a HTTP method attached (POST in this case)
* For the method you will need to configure the integration (how it deals with incoming requests)
* As well as the integration response (how it deals with the reply)
* Once this is all done you will need to deploy the application
* And finally you need to grant it access to the Lambda function

And that's "all". To be honest, if you need to manually run all of the commands for this from the command line it's probably quicker and easier to do some clicking in the Console. You can create a new API gateway directly from the Lambda function and it will handle some of the things you need to configure. However, obviously once you've got a working script that is a lot faster anyway.

On to the code for this then. We start simple, create the gateway and collect some details about it for later use.

```bash
aws apigateway create-rest-api --name "${APINAME}" --description "Api for ${NAME}" --region ${REGION}
APIID=$(aws apigateway get-rest-apis --query "items[?name==\`${APINAME}\`].id" --output text --region ${REGION})
PARENTRESOURCEID=$(aws apigateway get-resources --rest-api-id ${APIID} --query 'items[?path==/].id' --output text --region ${REGION})
```

For adding the resource, we need to supply both the API ID as well as the parent resource ID. For some reason, these IDs are completely different from any other AWS IDs I've encountered and are just a short string consisting of both numbers and letters.

```bash
aws apigateway create-resource --rest-api-id ${APIID} --parent-id ${PARENTRESOURCEID} --path-part igor --region ${REGION}
RESOURCEID=$(aws apigateway get-resources --rest-api-id ${APIID} --query 'items[?path==/igor].id' --output text --region ${REGION})
```

Next up is the POST method and as we don't want authorization at this level (since we can't control that with Slack) we set the authorization-type to NONE.

```bash
aws apigateway put-method --rest-api-id ${APIID} --resource-id ${RESOURCEID} --http-method POST --authorization-type NONE --region ${REGION}
```

Adding the integration is a long command, and therefore split out over multiple lines to improve readability. Again we need to supply all the details concerning the method we want to attach this to, but then we can hook it up to our Lambda function by calling a very long URI. This URI is an ARN that contains *another* ARN[^5].

```bash
aws apigateway put-integration --rest-api-id ${APIID} \
--resource-id ${RESOURCEID} \
--http-method POST \
--type AWS \
--integration-http-method POST \
--uri arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/${LAMBDAARN}/invocations \
--request-templates '{"application/x-www-form-urlencoded":"{\"body\": $input.json(\"$\")}"}'
--region ${REGION}
```

The last line then finally contains the request template. What we need to happen here is that the POST command provided by Slack is translated into a nice simple JSON string. This doesn't unpack the POST values, it just adds them as a single string so that the result of a post like:

```bash
POST https://ig.nore.me/test
Value1=test
Value2=command
```

Will turn into:

```javascript
{"body": "Value1=test&Value2=command"}
```

The response translations that we need are very simple as well. In fact, we don't need any translations. That means we provide an empty model for the method response and a complete pass through for the integration response. Again, the actual commands for this are a lot longer. Even though these are so simple, they are required though.

```bash
aws apigateway put-method-response \
--rest-api-id ${APIID} \
--resource-id ${RESOURCEID} \
--http-method POST \
--status-code 200 \
--response-models "{}"
--region ${REGION}

aws apigateway put-integration-response \
--rest-api-id ${APIID} \
--resource-id ${RESOURCEID} \
--http-method POST \
--status-code 200 \
--selection-pattern ".*"
--region ${REGION}
```

And finally the gateway is now configured. At least, a version of it is configured as we still need to deploy it. That luckily though is quite simple again

```bash
aws apigateway create-deployment --rest-api-id ${APIID} --stage-name prod --region ${REGION}
```

# Making the two work together

At this point we have a Lambda function and an API Gateway, but despite having connected the API Gateway to the Lambda function they still don't play nice. For that we need to authorize the Gateway to execute the Lambda function.

We want to set up two permissions. The first so you can run a test command from either the command line or the test function in the Console, and one for the actual production environment used for external calls.

```bash
APIARN=$(echo ${LAMBDAARN} | sed -e 's/lambda/execute-api/' -e "s/function:${NAME}/${APIID}/")
aws lambda add-permission \
--function-name ${NAME} \
--statement-id apigateway-igor-test-2 \
--action lambda:InvokeFunction \
--principal apigateway.amazonaws.com \
--source-arn "${APIARN}/*/POST/igor"
--region ${REGION}

aws lambda add-permission \
--function-name ${NAME} \
--statement-id apigateway-igor-prod-2 \
--action lambda:InvokeFunction \
--principal apigateway.amazonaws.com \
--source-arn "${APIARN}/prod/POST/igor"
--region ${REGION}
```

And now it works. After the whole script has run there will be a complete Lambda and API Gateway setup that perfectly matches the requirements for Igor (and similar functions). All that is left now, is to let you know what the URL is for your new Igor!

```bash
echo "The url you have to use in your Slack settings is:
https://${APIID}.execute-api.${REGION}.amazonaws.com/prod/igor"
```

[^1]:	This has now been moved to the installation directory/zip file.

[^2]:	Another way to make it easier is to let go of the Lambda requirement. More on that soon.

[^3]:	Amazon Resource Name, the long string that looks like *arn:aws:andthenalotofotherstuff*

[^4]:	Remember, you can always just download this zip file from the Igor repository as it's updated with every commit to master.

[^5]:	ARNception?
