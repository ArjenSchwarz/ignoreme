---
title:        "Automating Lambda Deployment Using Wercker"
slug:         "automating-lambda-deployment-using-wercker"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2016-04-22T09:24:51+10:00
categories:   ["CI-CD"]
projects:     ["Lambda Deploy Step for Wercker"]
keywords: ["wercker", "serverless", "aws"]
Description:  "While Aqua neatly makes the initial setup for my Lambda functions easier, that still left me with the deployments. In order to deal with that, I therefore made a simple deployment step for Wercker. I'll first go over how to use it, before showing how it works."
---

While [Aqua][aquapost] neatly makes the initial setup for my Lambda functions easier, that still left me with the deployments. In order to deal with that, I therefore made a simple deployment step for Wercker. I'll first go over how to use it, before showing how it works.

# Using the step

The step works the same as other steps: you define the step, and the various parameters you wish to use. Let's take Aqua as an example.

```yaml
deploy:
    steps:
         - arjen/lambda:
              access_key: $AWS_ACCESS_KEY
              secret_key: $AWS_SECRET_KEY
              function_name: aqua
              filepath: $WERCKER_SOURCE_DIR/dist/aqua_lambda.zip
```

It's possible to define the `region:` (defaults to us-east-1) or turn of automatic publishing with `publish: false` as well, but the defaults for these are good for my purpose. The filepath is the full path of your Lambda ready zip file where you need to keep in mind that the `$WERCKER_OUTPUT_DIR` in your build steps becomes the `$WERCKER_SOURCE_DIR` in deploy steps.

For the AWS Access and Secret keys, you need to have a user with sufficient permissions. I would suggest creating a IAM user that can only update and publish lambda functions, possibly even limiting it to the specific functions you want to use it for. You can copy the below json and add them as the user's permissions.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1461228078000",
            "Effect": "Allow",
            "Action": [
                "lambda:PublishVersion",
                "lambda:UpdateFunctionCode"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

Once you have updated your `wercker.yml` file and have the keys, you can add these as variables in your deployment target using [Wercker's interface][stepconfig]. Just remember to use the same names for the variables as you do in the config file, and to mark them as protected.

The only thing left at that point is to run the deployment and that should give you an output similar to the below:

```bash
/pipeline/lambda-ac3b10e3-d0af-4753-affb-9d26646fbd69/lambda-deploy --functionname aqua --region us-east-1 --filepath /pipeline/source/dist/aqua_lambda.zip
Reading file at /pipeline/source/dist/aqua_lambda.zip
Successfully read the file
Uploading the file to Lambda
Successfully updated the Lambda function
Lambda update succeeded
```

# A little bit of Golang

Which brings us to how the step is built. The preferred setup for a step is to be lightweight and be able to immediately run. Because of this I figured the best way to do the actual deployment was by using a small Go application. And it's definitely small, with the main part of the code consisting of only a couple of lines.

```go
func runUpdate() {
	svc := lambda.New(session.New(), &aws.Config{Region: aws.String(region)})

	params := &lambda.UpdateFunctionCodeInput{
		FunctionName: aws.String(functionname),
		Publish:      aws.Bool(publish),
		ZipFile:      zipfile,
	}
	_, err := svc.UpdateFunctionCode(params)
}
```

The rest of the code is error checking, reading the zipfile, and handling the flags. All the hard work is done by the [AWS Go SDK][gosdk], and I'm just using that. It's good when you can simply build on other people's hard work.

# The run wrapper

The endpoint for a Wercker step is always a bash script called `run.sh`, so this will have to serve as a wrapper for the binary. This is mostly straightforward as well. `debug`, `fail`, and `success` are Wercker specific commands that show the command being run or formatted messages.

```bash
#!/usr/bin/env bash

PUBLISH=""
if [[ $WERCKER_LAMBDA_PUBLISH == "false" ]]; then
  $PUBLISH="--publish false"
fi

LAMBDA="${WERCKER_STEP_ROOT}/lambda-deploy --functionname ${WERCKER_LAMBDA_FUNCTION_NAME} --region ${WERCKER_LAMBDA_REGION} --filepath ${WERCKER_LAMBDA_FILEPATH} ${PUBLISH}"
debug "$LAMBDA"
update_output=$($LAMBDA)

if [[ $? -ne 0 ]];then
    echo "${update_output}"
    fail 'Lambda update failed';
else
    echo "${update_output}"
    success 'Lambda update succeeded';
fi
```

The only other thing that needs to be included[^validation] however is the keys. As I mentioned when I introduced Aqua, the AWS Go SDK expects these in several ways. Because I already have a wrapper however, that makes it a bit easier. I can simply export the values within the wrapper by including the below lines before calling the Go binary and they are then picked up by it.

```bash
export AWS_ACCESS_KEY_ID=$WERCKER_LAMBDA_ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=$WERCKER_LAMBDA_SECRET_KEY
```

# Building the step

Storing the binary Go application in the repository is a bad idea, so instead using the `wercker.yml` file I build the binary and then ensure that the `$WERCKER_OUTPUT_DIR` contains it along with the other files. Now, a rather unfortunate thing with creating Wercker steps at the moment is that they can only be built on the old infrastructure[^oldstuff]. So instead of using a Docker container, the `wercker.yml` file has to define one of the old "boxes".

```yaml
box: wercker/golang
build:
  steps:
    - setup-go-workspace
    - script:
        name: go get
        code: |
          cd $WERCKER_SOURCE_DIR
          go version
          go get -t ./...
    - wercker/golint
    - script:
        name: go build
        code: |
          go build -a -o lambda-deploy
    - script:
        name: check contents
        code: |
          ls -lh $WERCKER_SOURCE_DIR
    - script:
        name: Copy to output dir
        code: |
          cp README.md run.sh lambda-deploy wercker.yml wercker-step.yml $WERCKER_OUTPUT_DIR
```

Other than that however, the build process is similar to other Go applications I've described in the past and I finish it by copying all the required files to the ``$WERCKER_OUTPUT_DIR` in the end. This is then picked up and deployed to the Wercker step repository where it can then be used.

If you're like me, and would really prefer to automate your Lambda deployments this should make it easier for you. And if you just want to have a quick look on how it all works, you can do so on [GitHub][github].

[aquapost]: https://ig.nore.me/2016/04/aqua-easy-api-gateway-creation/

[gosdk]: https://github.com/aws/aws-sdk-go

[stepconfig]: http://devcenter.wercker.com/docs/environment-variables/creating-env-vars.html#text-env-var

[^oldstuff]: It would be really nice if this changes in the near future.

[^validation]: Not counting validation and default values.

[github]: https://github.com/ArjenSchwarz/wercker-step-deploy-lambda
