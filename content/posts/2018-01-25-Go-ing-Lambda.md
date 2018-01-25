---
title:        "Go-ing Lambda"
slug:         go-ing-lambda
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:        2018-01-25T18:18:43+11:00
categories:   
  - AWS
  - Golang
keywords:
  - aws
  - golang
  - serverless
  - code
Projects: ["Igor"]
Description:  "With the release of the Go runtime for AWS Lambda, I took the opportunity to convert some of my code to run natively instead of through wrappers."
---

# Go-ing Lambda

With the release of the Go runtime for AWS Lambda, I took the opportunity to convert some of my code to run natively instead of through wrappers.

Before I started on the code, I believed that this would become a long article detailing various pain points and all the work I had to do for it. Unfortunately, this turned out to be not quite true as the conversion went very smooth and quick.

# Igor

The obvious application to try out here was Igor, my chatbot. If you have a remarkable memory, or recently read my [introduction to Igor](/2016/03/introducing-igor/)[^1], you'll remember that I built it with a NodeJS wrapper around it. At the same time however, I did design it in such a way that I could easily switch to native Go once that became available. This took almost 2 years, but it did happen and my preparation at the time bore fruit.

You can find the full changeset[^2] in this [pull request](https://github.com/ArjenSchwarz/igor/pull/4), but I'll take you through it below as well.

# index.js

No longer is there a need for this wrapper, so it was just deleted.

# Too many handlers

As described in the weekly note, the way handlers work is that they are called from the main function. Originally, the main function contained code to handle dealing with the wrapper:

```go
	} else {
		buf := new(bytes.Buffer)
		args := os.Args		
		event := []byte(args[1])		
		
		body := body{}		
		json.Unmarshal(event, &body)		
		
		response := handle(body)		
		
		responseString, _ := json.Marshal(response)		
		fmt.Fprintf(buf, "%s", responseString)		
		buf.WriteTo(os.Stdout)		
	}
```

This was all to do a conversion from the command line arguments the code received from the wrapper and then output it to stdout where the wrapper would pick it up[^3].

Any required conversions are now handled in the handler itself, so this part of the main function changed to:

```go
		} else {
			lambda.Start(Handler)
		}
```

That obviously requires the Handler function provided as an argument to then actually do all the work, but again that requires very little work.

```go
// Handler handles incoming Lambda requests
func Handler(request events.APIGatewayProxyRequest) (slack.Response, error) {
	log.Printf("Processing Lambda request %s\n", request.RequestContext.RequestID)

	response := handle(body{Body: request.Body})

	return response, nil
}
```

This entire handler could almost be a one-liner, but let's go through it one step at a time. 

The function declaration itself shows that it expects an `events.APIGatewayProxyRequest`, which is obviously what it will receive from the API Gateway. This is a struct that everything gets automatically unwrapped into. Unfortunately you have to look at the [code on GitHub](https://github.com/aws/aws-lambda-go/blob/master/events/apigw.go)[^4] to see the format of the struct as there doesn't seem to be a godoc available at this time. As return values it has my `slack.Response` object, and an error object that I'm not actually using. Obviously I'll have to improve on that. The `slack.Response` object will again be automatically converted to JSON by Lambda, so I don't need to think about what to do with that.

The first statement is just to do logging to CloudWatch, which is [now possible](https://docs.aws.amazon.com/lambda/latest/dg/go-programming-model-logging.html) and makes debugging a lot easier. After that we just run the `handle` function, which now turns out to have been an unfortunate naming choice, and return the response of that. No further changes[^5] were necessary to get the code running.

# Lambda runtime configuration

From here on it was a matter of updating the Lambda configuration to use the Go1.x runtime. I (lazily) did this through the Console and noticed a weird little thing there. When changing to the Go runtime it automatically changed the handler name as well, but instead of using `main`, which is what every bit of documentation shows, it changed it to `hello`. 

To make the function work I had to change it to main, but I now do wonder why it is like this. I haven't tested yet what happens if I create a `hello`[^6] function and call the Handler from there, but if that works that would be an easy way to differentiate between Lambda and non-Lambda calls. Or even to use the same code base for different Lambda functions (which probably isn't a good idea).

# Future improvements

While the code now works, I will be making some more changes based on what's possible with a native Go runtime. The first thing I'll need to change is the name of the `handle` function to prevent confusion, but with proper debugging now possible I want to enable that so I can more easily find any issues.

Aside from that I want to build a proper test for the Lambda functionality, as described in the [announcement post](https://aws.amazon.com/blogs/compute/announcing-go-support-for-aws-lambda/), and change the deployment methods to using the SAM framework. This is in part so that once SAM Local works with Go, I can use that to do local development.

I also have ideas for a major refactor, but that probably won't happen soon.

[^1]:	As I didn't really done any work on it in the last year I too had to look at it a bit to see how everything works.

[^2]:	Excluding some documentation changes

[^3]:	The else statement is there to differentiate between it running as Lambda and within a Docker container.

[^4]:	Or on your local machine after running go get.

[^5]:	Aside from the necessary import statements

[^6]:	Or something more appropriate 
