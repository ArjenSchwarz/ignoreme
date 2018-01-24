---
title:             A Look at Igor's Internals
slug:            "a-look-at-igors-internals"
blog:            ig.nore.me  
author:         Arjen Schwarz  
Date:            2016-04-02T17:08:39+11:00
categories:   ["Golang"]
projects:       ["Igor"]
keywords: ["code", "serverless", "chatbot"]
Description:  "Over the past couple of weeks I've written several articles about the things that support Igor, from deployments to installation, but I haven't written much about how it actually works yet. This article aims to rectify that."
---

Over the past couple of weeks I've written several articles about the things that support Igor, from deployments to installation, but I haven't written much about how it actually works yet. This article aims to rectify that.

# Basic structure

The idea behind Igor is [already explained][introigor] so I won't go into that again. Similarly, in [this presentation][igorpres] I explain some of how it works, but it's good to have a written version of this as well so let me do that first.

Igor itself is designed to be as lightweight as possible, and let all the real work be done by its plugins. That means that the basic structure of the application itself is quite simple and straightforward. The plugins are all built-in (although I'm exploring ways to allow for separate plugins), but treated as their own entity. I'm showing some code snippets below, but feel free to check out the complete (and current) source [in GitHub][ghigor].

Because Lambda doesn't support Go natively (yet), Igor uses a NodeJS wrapper to receive the data. This wrapper simply passes the contents it receives along as an argument to a call to the application binary. My knowledge of NodeJS and how to deal with child processes in there is very limited, so it's very possible this can be improved.

```javascript
var child_process = require('child_process');

exports.handler = function(event, context) {
  var proc = child_process.spawn('./main', [JSON.stringify(event)], { stdio: [process.stdin, 'pipe', 'pipe'] });

  proc.stdout.on('data', function(line){
    var msg = JSON.parse(line);
    context.succeed(msg);
  })

  proc.stderr.on('data', function(line){
    var msg = new Error(line)
    context.fail(msg);
  })

  proc.on('exit', function(code){
    console.error('exit: %s', code)
    context.fail("No results")
  })
}
```

Inside the binary, this is then naturally caught by the `main()` function. Because it's good practice, and as I'm hopeful that at some point Lambda will support Go, this is kept simple and will only translate what it receives into a struct[^docker]. That way when Lambda has native support I will only need to make the changes in there to ensure it can run. The only other things that main does is pass this struct to the `handle()` function and print the output of that call.

```go
func main() {
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

Handle first loads the general configuration, does all the validation work (currently limited to checking if the right Slack key was provided), and then tries to determine the response. Slack expects that certain characters are escaped, so this is handled as the very last step before the response is returned.

```go
func handle(body body) slack.Response {
	request := slack.LoadRequestFromQuery(body.Body)
	config, err := config.GeneralConfig()
	if err != nil {
		response := slack.SomethingWrongResponse(request)
		response.Escape()
		return response
	}
	response := slack.Response{}
	if !request.Validate(config) {
		response = slack.ValidationErrorResponse()
	} else {
		response = determineResponse(request, config)
	}
	response.Escape()
	return response
}
```

The `determineResponse()` function loops over the enabled plugins, and tries to find a match for the command that it received. If it doesn't find a match, it will then return a `NothingFoundResponse`. This is just a standard response with a message that will be shown in Slack to indicate there was no match.

Additionally, it will return an error message if something actually went wrong with one of the plugins. However, because it might not always be relevant, it will only return that error if there was no match. This is to ensure that when a plugin that isn't called fails for some reason, it won't interfere with the actual call.

```go
func determineResponse(request slack.Request, config config.Config) slack.Response {
	pluginlist := plugins.GetPlugins(config)
	hasError := false
	for _, value := range pluginlist {
		response, err := value.Work(request)
		if err == nil {
			return response
		}
		switch err.(type) {
		case *plugins.NoMatchError:
		default:
			// Something actually went wrong with one of the plugins,
			// return that something went wrong if nothing matches
			// Don't send the actual message though
			hasError = true
		}
	}
	if hasError {
		return slack.SomethingWrongResponse(request)
	}

	return slack.NothingFoundResponse(request)
}
```

Looking at the above code, you may notice that it doesn't specifically check if a plugin can handle a command. Instead it tells the plugin to do the work, and return the result if it's capable of handling it. I went for this method at the start because it's faster, but it's possible that this will change in the future as an extra check might have some other benefits.

[introigor]: https://ig.nore.me/2016/03/introducing-igor/

[igorpres]: https://ig.nore.me/presentations/2016/03/igor-introduce-yourself

[^docker]: In the case of server mode, required for running it in Docker, this is done by running a server that does the same thing. The code for this is also in the main() function, but not shown in the snippet.

[ghigor]: https://github.com/ArjenSchwarz/igor

# The plugins

After all that, it's pretty obvious that most of the really interesting work will be in the plugins. So, let's follow the steps as they are taken in the code. That means we'll first have a look at the `GetPlugins()` function.

GetPlugins is, once again, fairly simple in the way it works. We define a map containing the plugins. These plugins are already instantiated but, other than potentially reading some configuration, haven't done anything yet. When the configuration is read it's possible for the instantiated plugin to return an error. As I haven't decided yet how to deal with these, they're just ignored for now. Yes, I know that's not a good thing to do.

In case you wonder about the provided, but unused, `Config` struct, that is because the below snippet doesn't show the handling of whitelisting and blacklisting of plugin defined in the configuration.

```go
func GetPlugins(config config.Config) map[string]IgorPlugin {
	plugins := make(map[string]IgorPlugin)
	plugins["help"] = Help()
	plugins["weather"], _ = Weather()
	plugins["tumblr"], _ = RandomTumblr()
	plugins["status"] = Status()

	return plugins
}
```

Each of these plugins have to implement the `IgorPlugin` interface. This is a fairly simple interface, with only 4 methods defined.

```go
type IgorPlugin interface {
	Work(slack.Request) (slack.Response, error)
	Describe() map[string]string
	Name() string
	Description() string
}
```

The `Work` method is the main one, it handles all the tasks that the Plugin can handle and matches the provided keywords to it. `Describe` needs to give a map of functionality descriptions and keywords for information purposes (specifically, to be used by the *help* command).

The other two are more boilerplate. `Name` provides a short name for the plugin that config items can be matched against and `Description` is for a global description of the plugin.

Looking back at `GetPlugins()`, we can see that it calls functions to instantiate the plugins. The goal of these functions is to return an `IgorPlugin` implementing struct. This can be a very simple struct like for the `HelpPlugin`.

```go
func Help() IgorPlugin {
	plugin := HelpPlugin{
		name:        "help",
		description: "I provide help with the following commands",
	}
	return plugin
}
```

Or like the `WeatherPlugin` that also needs to parse data from the configuration.

```go
func Weather() (IgorPlugin, error) {
	pluginName := "weather"
	pluginConfig, err := parseWeatherConfig()
	if err != nil {
		return WeatherPlugin{}, err
	}
	description := fmt.Sprintf("Igor provides weather information for the city you specify. If no city is specified, the default city (%s) is used.", pluginConfig.DefaultCity)
	plugin := WeatherPlugin{
		name:        pluginName,
		Source:      "http://api.openweathermap.org/data/2.5/",
		description: description,
		Config:      pluginConfig,
	}
	return plugin, nil
}
```

Either way, the instantiation shouldn't do anything that interacts with 3rd party services or tools. Doing so would slow down Igor, potentially without reason as that plugin might not be called.

Let's have a look at the `Work()` method for one of these plugins. I'll use the `WeatherPlugin` as an example, but they all work similarly.

```go
func (plugin WeatherPlugin) Work(request slack.Request) (slack.Response, error) {
	response := slack.Response{}
	if len(request.Text) >= 7 && request.Text[:7] == "weather" {
		response, err := plugin.handleWeather(request)
		return response, err
	} else if len(request.Text) >= 8 && request.Text[:8] == "forecast" {
		response, err := plugin.handleForecast(request)
		return response, err
	}

	return response, CreateNoMatchError("Nothing found")
}
```

As defined in the `IgorPlugin` interface, `Work()` expects a `slack.Request` struct and returns both a `slack.Response` struct and `error`. Going through the code, you can see that it tries to find a match to the Text from the request. If it finds a match, great, it will pass it along to a separate function that will handle the rest. If it doesn't find a match, it simply returns the empty response and a `NoMatchError`.

From this point, the results are simply returned along the chain and Slack will receive the result (or lack of results).

If you want to have a look at the rest of the code, feel free to do so on [Igor's GitHub page](https://github.com/ArjenSchwarz/igor). Additionally, if you have any questions or ideas for improvements don't hesitate to mention them either here or on GitHub. I'm always looking to improve Igor.
