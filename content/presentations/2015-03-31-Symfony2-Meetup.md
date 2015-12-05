---
title:        Splitting a Symfony project into separate tiers  
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2015-04-06T13:00:00Z
presentation_date:  "March 31, 2015"
location:     "the Symfony2 meetup in Melbourne"
categories:   ["PHP"]
slug:         "splitting-a-symfony-project-into-separate-tiers"
Description:  "For the Symfony2 meetup in Melbourne I gave a presentation on splitting a project into separate layers, why you might want to do this, how it works, what some of the downsides are, and why Symfony2 is a good fit for this."
---
For the Symfony2 meetup in Melbourne I gave a presentation on splitting a project into separate layers, why you might want to do this, how it works, what some of the downsides are, and why Symfony2 is a good fit for this.

# Video

As an experiment I decided to record the presentation (not live) and embed it on this page. This is in part because my slides and presentation style don't work well without my talk, but also because I wanted to see how this works and if people will find it useful.

{{% youtube L0Tv12mRCLw %}}

# Text version

## What do I mean?

By splitting up an application into separate tiers I refer to separating an application into different layers and functionalities. For example you can have a CMS layer, with an API, and web and/or mobile interface on top of this.

![Different tiers](/img/posts/2015-04-06-tiers.png "Different tiers")

## Why would you want to do this?

Despite the additional complexity this brings to your infrastructure, there are a number of reasons why you might want to do this. I'll only mention two of them here.

### Speed

An n-tier application[^ntier-explanation] allows by its very nature an easy way to introduce caching at different levels, which therefore allows it to be a lot faster. This is especially useful for high traffic sites and applications.

### Flexibility

Applications like this are far more flexible because you can improve each tier separately. Due to the API driven nature of this you can more easily horizontally scale your layers, but there is also no reason to limit yourself to the existing layers. If you need new functionality, whether it's an extra version of your interface[^extra-interface] or a cronjob you need to run daily for collecting data, you can keep this separate from the existing tiers.

Lastly, you have no need to limit yourself to a single framework or even programming language. If you feel that certain tasks/tiers would perform better, or can be built faster, using a different toolset there is nothing in the architecture to stop you from doing so.

## How to split up using Symfony2?

As I'm focusing here on [Symfony2][2] it is important to see how you can separate your tiers here. 

### Separate apps in a project

In Symfony2, as in Symfony 1 before it, it is still possible to have different applications in a single project. This means that you can not only have your original `/app` directory, but also a `/app2`, `/app3`, etc. Where you can name these however you wish to suit your needs.

```bash
/api
/cms
/frontend
```

However, it has already been decided that this will [no longer be supported by default in Symfony3][3] so this method is unlikely to keep your application forward compatible.

### Routing

Symfony2 offers very flexible [routing configuration][4] so it is possible to make your code use different controllers for different endpoints. You can give these separate prefixes, or even completely different hostnames. 
This will allow you to use the same application, but still be able (in theory) to deploy it to different servers with different vhost configurations.

```ini
project_api:
    resource: "@AppBundle/Controller/Api"
    type: annotation
    host:     api.project.com.au
project_cms:
    resource: "@AppBundle/Controller/Cms"
    type: annotation
    host:     cms.project.com.au
```

### Separate projects

The final way, which is not limited to Symfony, is to completely split up your application into separate projects. This offers the greatest flexibility, but also potentially the most work as it makes it harder to reuse things from other projects for example when your CMS and API both need database access.

## Tribal Football

I'm using [Tribal Football][1] as a use case here as this is a project we built this way at Evolution 7. This is a fairly high traffic football news site that we were asked to redevelop.

For the redevelopment we decided to built it as an n-tier application, and chose a combination of the last two methods above. We combined the CMS and API into a single project, separated by routing rules, and made the web interface a separate project.

## Web interface and caching 

Originally we wanted to build the web interface in [Silex][5] as we believed that to be lightweight yet powerful enough. Halfway through however, we decided that it would make things a lot easier if we used Symfony after all. One reason for this is the native support of Symfony for [ESIs][8][^caching-presentation]. 
When using a proxy cache such as Varnish, this allows you to easily cache certain parts of your page for a different time period than the rest of the page. As an example, this means you can have an article page cached for 30 days while updating the read count and top stories every hour.

Using ESIs in Symfony is very easy as you can use the `render_esi` Twig helper which will point to a Controller as usual. In the background however, Symfony will transparantly decide if it should render the result as an ESI or a standard include, based on the headers it receives in the request.

## The API

As the center of the application, I will want to go a bit deeper into the API and how we made that work as easy and clean as possible. For this I will dive through the different parts of the stack following a single call for viewing the articles related to a club[^simplified-code].

### Frontend tier Club Controller

Following the routing, the ClubController is called and in there the code for retrieving the club through the API client is very similar to doing so with Doctrine. We provide a command name, the requested parameters, and run execute with the expectation that this will result in us retrieving a club.

```php
public function indexAction(Request $request, $slug) {
    $club = $this->apiClient->getCommand(
                'GetClubBySlug',
                array(
                    'slug' => $slug,
                )
            )->execute();
}
```

### Frontend tier API Client

The API client called in the above code, is a [Guzzle][9] client. Using Guzzle we can define the configuration for the API in JSON files that look like the following.

```javascript
"GetClubBySlug": {
    "httpMethod": "GET",
    "parameters": {
        "slug": {
            "description": "Slug of the club to retrieve",
            "location": "uri",
            "required": true,
            "type": "string"
        }
    },
    "summary": "Return a Club by its slug",
    "uri": "clubs/{slug}"
},
```

Here the API client matches the parameters and command name and turns this into an actual API call, in this case to the `clubs/{slug}` endpoint of the configured API.

### API tier Club Controller

In order to keep all controllers as simple as possible, we define them as services. For the API tier's ClubController that shows up as below, where we provide the formatter to the constructor, but nothing else. Despite that the `getAction`, which listens to the endpoint we're calling, consists only of a single line.

Most of the logic for this is handled through the [ParamConverter][10].

```php

/**
 * @Route(service="controller.club")
 */
class ClubController extends Controller implements ApiControllerInterface
{
    private $formatter;

    public function __construct(Formatter\ClubFormatter $formatter)
    {
        $this->formatter = $formatter;
    }

    /**
     * @Route("/clubs/{slug}")
     * @Method({"GET"})
     * @ParamConverter("club.converter", options={"name" = "club"})
     */
    public function getAction($club)
    {
        return new JsonResponse($this->formatter->formatClub($club));
    }
}
```

### API tier ParamConverter

The ParamConverter is a functionality of the [SensioFrameworkExtraBundle][12] that allows you to transform/convert request parameters into objects. For this you implement an interface and you provide the resulting class as a service to the action you wish to use it with. 

The `apply` function in this class will then carry out the conversion; in this example it finds the club[^club-not-found] and then sets the result as an attribute in the request object with the provided name. You can see that the request parameter provided to the `getAction` method above has the same name as the `name` value provided to the converter.

```php
public function apply(Request $request, ParamConverter $configuration)
{
    $club = $this->findClub($request);
    if (null === $club) {
        throw new NotFoundHttpException($message);
    }

    $options = $configuration->getOptions();
    $request->attributes->set($options['name'], $club);
    return true;
}
```

### API tier Formatter

The final part here is the formatter. This is not Symfony specific, and simply ensures that our resulting club is formatted as an array and contains all the relevant data.

```php
public function formatClub(Entity\Club $club) {
    $result = $club->toArray();
    $result['logo'] = $this->formatImage($club->getLogo());
    $league = $this->clubHelper->determineCurrentLeague($club);
    $leagueDetails = $this->formatMainLeague($league);
    $result['mainLeague'] = $leagueDetails;
    return $result;
}
```

This array is then returned with a `JsonResponse`, until it flows back up the stack until it ends up at the frontend tier's Controller which can pass it to the Twig template.

All this means that with the help of Symfony's structure we can keep all this code small and very testable.

## The downsides

I've refered to the complexity of the n-tier architecture before, and that is where we discovered most of the downsides. 

This starts with something as basic as the development environment. Even if you are working on the web interface for the frontend, you will still need to have the complete stack running locally to ensure you've got access to everything. Later on in the process you might change this to point to the production (or staging/preview) API instead, but that comes with additional latency as they are unlikely to be in the same place.

A second complication can be found in the deployment process, as this will have to be done in the correct order and ensure there are no backwards compatibility breaks. For example, if there is an API change that involves database changes you will need to update your database first, making sure nothing changes that the CMS/API still depends on, before you then release a new version of the CMS/API tier, finally followed by the web frontend.

The last downside I'll mention here is that it can be slow in the development environment. As everything is optimised to work as fast as possible in the production environment this can mean that you end up with a lot of extra API calls during development that in production will be cached. After all, it's often hard to do any development using cached data. The easiest solution we found for this is to hardcode some results before actually reaching the API.

## Conclusion

Based on our work with Tribal Football, we were really happy with the result of using an n-tier architecture. Especially the flexibility that allowed us to make quick changes[^quick-changes] and the ability to have some developers work with dummy output of the API while others are ensuring the backend systems are properly designed helped a lot in the development process.

Since starting on Tribal Football (which at the time I write this has unfortunately not gone live yet), we have built other projects with a similar architecture as well and have reaped the benefits of this. Keep in mind however that the added complexity means you should always make sure that it is worth it. For small projects it will often be easier to keep everything together.

# References

* [Tribal Football][1]
* [Symfony, High Performance PHP Framework for Web Development][2]
* [Symfony3 not supporting multiple applications][3]
* [Routing in Symfony2][4]
* [Silex - The PHP micro-framework based on Symfony2 Components][5]
* [Amazon Web Services (AWS) - Cloud Computing Services][6]
* [Symfony2 & HTTP Caching presentation by Ryan Djurovich][7]
* [Using ESIs in Symfony2][8]
* [Guzzle][9]
* [ParamConverters in Symfony2][10]
* [Interactive Service Description][11] - a tool mentioned in the discussion after the presentation that we use for mimicking the service calls made by the Guzzle client.


[1]: http://www.tribalfootball.com
[2]: http://symfony.com/
[3]: https://github.com/symfony/symfony-standard/issues/584#issuecomment-23148928
[4]: http://symfony.com/doc/current/book/routing.html
[5]: http://silex.sensiolabs.org/
[6]: https://aws.amazon.com/
[7]: http://www.ryandjurovich.com/slides/2014/symfony2-http-caching/
[8]: http://symfony.com/doc/current/book/http_cache.html#using-esi-in-symfony
[9]: https://github.com/guzzle/guzzle
[10]: http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/annotations/converters.html
[11]: https://github.com/adeslade/interactive-service-description
[12]: http://symfony.com/doc/current/bundles/SensioFrameworkExtraBundle/index.html

[^ntier-explanation]: An application that has been split up is often refered to as an n-tier application because it consists of a number of tiers.
[^extra-interface]: Which can be anything from a mobile specific site or app to an interface for a specific partner/client.
[^caching-presentation]: If you wish to have more details about caching in a Symfony application you can have a look at the [presentation][7] given by my former colleague Ryan Djurovich.
[^quick-changes]: The change from Silex to Symfony2 for the frontend only took about 4 hours, and didn't impact any other ongoing work.
[^simplified-code]: These code samples are simplified, and in general don't hold any consideration for things like error checking or caching.
[^club-not-found]: Or in this case if it's not found it will throw an exception which later in the process is converted to a JSON error response that the API consumer can understand.
