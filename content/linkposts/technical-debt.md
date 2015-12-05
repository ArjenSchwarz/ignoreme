---
Title: Technical Debt
Slug: technical-debt
Date: 2013-09-08T05:39:40+10:00
Redirect: http://www.sitepoint.com/technical-debt/
Aliases: ["/development/2013/09/technical-debt/"]
Categories: ["Development"]
---

> On the one hand, technical debt refers to the quick and dirty shortcuts we take and the effect they have on future development. On the other hand, technical debt is also about the things that we don’t do, such as not commenting our code, not developing documentation, not doing proper testing, etc.

Technical debt is an interesting subject, and one that every developer should take into account. In most cases as a developer you will want to have the most elegant solution for your problem, preferably using the latest or coolest technology. Depending on the situation though this might not always be the solution your boss or client wants, usually because that solution is more expensive than the quick hack you were forced to also mention. 
That's why before you then end up implementing the quick hack it is imperative to make it clear this will only postpone the "saved" time until a later moment. To be fair, often enough that trade-off might be worth it, even if this would lead to more time in the future.

Another case of technical debt that isn't really touched on in this article is caused by using old technology. When there is an existing codebase that makes it easy to build something new, but makes use of older or even no longer supported tools it's important to weigh the downsides of that very carefully. Especially when it comes to a project that will have to be supported for a long time.   
In the short term using this might bring about a successful result faster, and using something new will undoubtedly lead to new and unexpected bugs as well. However, looking at the longer term, there are a fair number of problems that might crop up. Ranging from the obvious security problems, upgrade trouble, and performance issues, to even the decreased ability of the future developers to understand the use of the code base.
