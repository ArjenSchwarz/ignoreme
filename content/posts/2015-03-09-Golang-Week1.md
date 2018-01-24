---
title:        "Starting with Golang"
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2015-03-09T11:02:39+11:00   
date started: 08-03-2015  
categories:   ["Golang"]
series:       ["Learning Golang"]
keywords: ["go", "golang", "code"]
slug:         "starting-with-golang"
Description:  "The first weekly update for my month of Golang. I'll start this out with various resources I used to get up to speed with the language, before I'll move on to idea behind the structure for the Bugsnag SDK and how this is progressing."
---

The first weekly update for my month of Golang. I'll start this out with various resources I used to get up to speed with the language, before I'll move on to idea behind the structure for the Bugsnag SDK and how this is progressing.

# Where do you learn?

Every journey has a first step, and that is the case for learning a new language as well. In the case of Go, that starts with the really good interactive tutorial they have on their site. They call it a [tour](http://tour.golang.org/welcome/1), and it takes you through all the major parts of the language.

I did this tour about half a year ago, but as I didn't do anything with it forgot most of the details. So when I got back to working in Go I skimmed through this again and used it as a resource when I needed to know how something worked.

A very pleasant happenstance as well was that the [Golang Melbourne](http://www.meetup.com/golang-mel/) meetup group held a meetup for complete beginners last week. While at that point I might not be considered a complete beginner anymore, I still learned some useful things.

The biggest resource though is of course just generally the internet. Not only is it easy to find answers when you search for your questions (always remember to use golang instead of go), but there are plenty of existing [open source projects](https://github.com/trending?l=go) you can use as a way of learning from other people.

One place I don't want to forget mentioning is [godoc](http://godoc.org) which seems to have the documentation for a lot of the 3rd party libraries. Another source for documentation I rely on for the built-in libraries is the wonderful Mac application [Dash](http://kapeli.com/dash).

Finally, a resource I haven't really tested yet is the [Golang Slack community](http://blog.gopheracademy.com/gophers-slack-community/). I only joined this yesterday, and haven't really done any development since that time. It seems to have a fair number of people though, and has geographically divided channels. You should be able to find me in both the #australia and #netherlands channels.

# How to start with development?

First you will obviously need to have Go [installed](http://golang.org/doc/install). The documentation linked here has a number of ways to install it, depending on your platform, but one option that is missing is homebrew. If you've got homebrew running on your Mac all you need to install Go is to run

```bash
brew install go
```

This should get you the basic golang compiler and language sources. After the installation finishes you will be directed to install a couple of useful libraries, and to set up your `GOPATH`. The `GOPATH` is the directory on your computer that will be seen as the root of your work with Go. The source code of everything you write, as well as all dependencies, will be stored in the `$GOPATH/src` directory.

When you start coding in Go you will want to have your editor set up to be capable of giving you good code highlighting, auto completion, and all that kind of thing. I can't really help you with the specific plugin you will want for your preferred text editor, unless you happen to use [Sublime Text](http://sublimetext.com) like me. In that case your best choice is probably to use the [GoSublime](https://packagecontrol.io/packages/GoSublime) package. There are [other packages](https://packagecontrol.io/search/go) as well for various tasks so you might want to check those out.

# Designing the SDK

While I will be describing my work on the Bugsnag SDK, I actually started out with a couple of small projects that use the [Google Analytics SDK](http://godoc.org/code.google.com/p/google-api-go-client/analytics/v3), as well as the [AWS SDK](http://godoc.org/github.com/awslabs/aws-sdk-go/aws), and some basic work with [databases](http://golang.org/pkg/database/sql/). Some of this will be mentioned again later this month, but for now I mostly want to point out that I used these as inspiration for my work on the Bugsnag SDK.

When I decided to build a fully fledged SDK for Bugsnag I had seen and worked with the two SDKs mentioned above, so I modelled my work on them. Of course, the API I am working with is far smaller than these are, and will not be automatically generated based on the documentation as these are. It would be cool if I could do that, but I'll need some more knowledge of how things work before I can reach that point. Especially as the API documentation has some errors.

# Building the SDK

Golang uses packages to separate functionality. That means I created a package which I gave the very imaginative name `api`. I split up this package into several files, some of which I already know are going to need some refactoring. Right now there are files for accessing API functionality, like `users.go`,  as well as files related to tasks around this such as `auth.go`.

So, how does the SDK work? The main `struct` is the connection, and this is used for making all the different API calls. That means for example that you make a call to list all you accounts from this connection object. Let me illustrate this with the below snippet using the SDK.

```go
package main

import (
    bugsnag "github.org/arjenschwarz/bugsnag-go-sdk"
)

func main() {
    creds := bugsnag.ApiKey(apiKey)
    connection := bugsnag.New(creds)
    data, err := connection.Accounts()
}
```

This snippet isn't complete, and obviously doesn't even compile, but it illustrates how a call works. The part I didn't mention before is the need to register your credentials. This can be done in two ways, using an account api key generated in Bugsnag or by providing a username and password. Both have roughly the same result, except for a couple of API calls that are specific to one of these authentication methods.

I will probably refactor this so you only need to make a single call in order to get the connection you need.

To keep with the above example, every retrieval function will return a struct or collection of structs. The `Accounts` function returns a collection of `Account` structs which consist of every field the API returns.

```go
type Account struct {
    Id             string `json:"id"`
    Name           string `json:"name"`
    AccountCreator User   `json:"account_creator"`
    BillingContact User   `json:"billing_contact"`
    Url            string `json:"url"`
    UsersUrl       string `json:"users_url"`
    ProjectsUrl    string `json:"projects_url"`
    CreatedAt      jTime  `json:"created_at"`
    UpdatedAt      jTime  `json:"updated_at"`
}
```

The `Accounts` function itself is pretty small as well, as most of its functionality consists of preparing things for the `Query` function of the connection's http client.

```go
func (c *Connection) Accounts() ([]Account, error) {
    var resp []Account
    err := c.client.Query("GET", "/accounts", &resp)
    if err != nil {
        return nil, err
    }

    return resp, nil
}
```

This `Query` function is mostly copied from a similar function in the AWS SDK. What it does is parse the request, make the API call, and put the returned values into the passed struct. This last bit is the most interesting, as it relies on usage of the `interface{}` type.

Interfaces in Go are implicit, as long as your struct implements all the functions that are defined in an interface it will allow be seen as implementing the interface without the need to explicitly say it implements it. Because of that, every struct implements the basic interface `interface{}` which you can therefore define as an argument for your function.

```go
func (c *JSONClient) Query(method, uri string, resp interface{}) error {
    var body io.Reader
    httpReq, err := http.NewRequest(method, uri, body)
    if err != nil {
        return err
    }
    return c.sendMessage(httpReq, resp)
}
```

There is more to all of this, but to keep this article at a reasonably size I'll leave it at this.

# Current status

The work I've done so far is up on [GitHub](https://github.com/ArjenSchwarz/bugsnag-go-sdk). It's in a very early stage obviously, and I haven't even added a README file that explains its usage.

I've implemented both authentication methods, all of the accounts and projects endpoints, and several of the user endpoints.

My goal for the coming week is to finish the user endpoints, add a README, add unit tests, do some refactoring, and add support for adding parameters to the API calls.

I realise this article probably requires a bit of knowledge about the language, but at this point I'm not interested in duplicating the work of the Go Tour. Personally, I'm really enjoying working in Go and I hope that writing down my thoughts about it will help me to think about some of the underlying issues and decisions I am making here.
