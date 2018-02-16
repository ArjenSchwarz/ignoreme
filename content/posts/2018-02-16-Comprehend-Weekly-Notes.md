---
title:        Comprehend-ing My Weekly Notes
slug:       comprehend-ing-my-weekly-notes
blog:         ig.nore.me  
author:       Arjen Schwarz  
Date:         2018-02-16T20:18:17+11:00
categories:
  - AWS
keywords:
   - aws
   - machinelearning
   - code
Description:  "Just for fun I decided to run AWS Comprehend over the weekly notes on this site. This is how I went about it, what came out of it, and what I think of Comprehend."
---

Just for fun I decided to run AWS Comprehend over the weekly notes on this site. This is how I went about it, what came out of it, and what I think of Comprehend.

# Comprehend

AWS Comprehend is a machine learning service that was announced at re:Invent 2017. Or rather, it's several services for text analysis or natural language processing that are grouped together under a single name. Right now it lets you detect the dominant language, sentiment, key phrases, and entities.

Considering I run this on my own writing, the language detection wasn't something I needed but the other ones sounded like fun. I was considering running this on everything I've written, when I ran into an unfortunate limitation. Comprehend has a character limit of 5000 characters. Most of my articles are longer than that, so I decided to limit myself to the ones that have the biggest chance of coming under this: my weekly notes.

Especially considering my [self-enforced length limit](/weekly-notes/week-1-2018/), this seemed like a good option.

# Turning the posts into plain text

Naturally, I don't want any links or HTML entities messing up my results[^1], so I needed to clean this up. That turned out to be surprisingly easy. All of my writing on this site is written in Markdown, with a metadata section for Hugo.

I was thinking about writing some kind of parser to strip everything out, but after searching for a good library to do that I noticed a comment about a tool I've used in the past, [Pandoc](http://pandoc.org).

Pandoc allows you to transform text files from one format to another. A translation from Markdown to plain text therefore means that it strips out everything I don't want, so I wrote a tiny script to transform all of my weekly notes[^2].

```bash
#!/bin/bash
source_path=${1}
destination_path=${2}

for filename in ${source_path}/*.md; do
    stripped_filename=$(basename ${filename})
    pandoc -f markdown -t plain --wrap=none ${filename} -o ${destination_path}/${stripped_filename}
done
```

# Running Comprehend

Comprehend offers a batch version, but that only does 25 strings[^3] at a time so doesn't help much. Besides, I wanted all my results separated so that I can do any type of analysis that I can think of. Again, a simple bash script for running this sufficed.

```bash
#!/bin/bash
source_path=${1}
destination_path=${2}

for filename in ${source_path}/*; do
    stripped_filename=$(basename ${filename})
    filesize=$(wc -c < ${filename})
    if [[ ${filesize} -gt 5000 ]]; then
      continue
    fi
    echo "Evaluating ${stripped_filename}"
    aws comprehend detect-entities --language-code en --text "$(cat ${filename})" > $destination_path/${stripped_filename}.entities
    aws comprehend detect-key-phrases --language-code en --text "$(cat ${filename})" > $destination_path/${stripped_filename}.phrases
    aws comprehend detect-sentiment --language-code en --text "$(cat ${filename})" > $destination_path/${stripped_filename}.sentiment
done
```

You will notice a file size check in here, this is to prevent me from making calls that go over the size limit. And it turns out that I needed this. Even stripped down, of the 97 weekly notes that I've written only 57 were short enough to be parsed.

Let's have a quick closer look at the comprehend command before we move on though.

`aws comprehend detect-sentiment --language-code en --text "This is my wonderful text!"`

As every AWS CLI command, comprehend is constructed of several parts:

1. aws - the name of the CLI tool
2. comprehend - the name of the service
3. detect-sentiment - the name of the command

Everything after this is a parameter, both of which are mandatory[^4]. The `language-code` is only limited to English or Spanish however, so you can't use these services for any other languages than those.

# Detect sentiment

Let's start with the sentiment results:


| Sentiment | Count | Percentage |
|-----|------|-----|
|  NEUTRAL  |  32  |  56%  |
|  POSITIVE  | 18  |  32%  |
|  MIXED  |  4  |  7%  |
|  NEGATIVE  |  3  |  5%  |


Now let's see how to get from the script above, to useful output like this. After running the script, I have a folder full of files containing json objects. Which leads to my best friend for parsing json: [jq](https://stedolan.github.io/jq/).

The JSON objects look like the below, and while I could go manually and count each type of Sentiment (well, grep for the words and `wc -l` the result) parsing it properly is more interesting.

```json
{
    "SentimentScore": {
        "Mixed": 0.0962539091706276,
        "Positive": 0.18013328313827515,
        "Neutral": 0.64349365234375,
        "Negative": 0.08011914044618607
    },
    "Sentiment": "NEUTRAL"
}
```

One interesting functionality of jq that I discovered while working on this is the `-s` or `--slurp` flag. This flag ensures that jq puts an array around all of the objects that are being parsed. Which basically means that it puts all of the files I'm parsing into one big array that I can then deal with.

In addition I put the jq parse command in a separate file, which makes it a little bit easier to deal with. This can be triggered with the `-f` or `--from-file` followed by the filename.

```bash
.
| group_by(.Sentiment)
| map({Sentiment: .[0].Sentiment, Count: length, Percentage: length| (. * (100 / ($TOTAL | tonumber)))})
| sort_by(.Count)
| reverse
```

There are a couple of things going on here. First, I group by the value of Sentiment. But then I map this result, first with Sentiment itself and then the length of that grouping, which will represent the number of items in there. After that however, I also calculate the percentage. This is done in a slightly hack-y way.

`length| (. * (100 / ($TOTAL | tonumber)))` is the complete percentage calculation. This starts with using length, but then using this in a calculation. The calculation is the standard `subset * (100 / total)` you can use to calculate a percentage, but it uses an argument for the total number (which is treated as a string and so needs to be transformed to a number).

Once I've got the mapping, I just do some things to get the output I want: descending by number of occurrences.

Let's have a look at how this is run. As it was all just for my own benefit, I didn't bother getting super beautiful output and just translate the resulting json into the table above manually.

```bash
#!/bin/bash
source_path=${1}
source_search="${source_path}/*.sentiment"

echo "Combined results:"
TOTAL=$(cat $source_search | jq -s '. | length')
cat $source_search | jq --arg TOTAL $TOTAL -s -f sentiment.jq
```

There isn't anything special here. I take the path, add some specificity to it[^5], and run it through jq with the query from the file. The only thing in addition, is that I first calculate the total number of items and pass that in as an argument. This is the same argument used in the percentage calculation above. It's not a great solution, but I couldn't figure out how to get that number within a single jq command. If you do know, please tell me and I'll update it here.

Below are year specific results. As I only have 2 entries from 2015 that were small enough, I don't show anything for them. Please keep in mind that 2018 is still very young and that percentages are rounded and therefore might not match 100%.

| Sentiment | 2016 | 2017 | 2018 |
|---|----|----|-----|
|  NEUTRAL  |  7 (41%)  |  19 (61%)   |  5 (71%) |
|  POSITIVE  | 7 (41%) |   9 (29%)  |  1 (14%) |
|  NEGATIVE  | 2 (12%)  |  1 (3%)  |  0 (0%)  |
|  MIXED  | 1 (6%)  |  2 (6%)  |  1 (14%)  |

Based on the results, my writing is mostly neutral or positive. Which is of course great news, although means I should aim to have it be more positive[^6] as that's always nicer to read.

# Entities

Next up I wanted the same with the entities. I've limited my result here to the top 10.

| Entity | Type | Count |  Percentage  |
|----|----|----|----|
| AWS  |  ORGANIZATION  |  107   |  5.8   |
| Google  |  ORGANIZATION  |  70   |  3.8   |
| Apple  |  ORGANIZATION  |  54   |  2.9   |
| Docker  |  TITLE  |  44   |  2.4  |
| Android  |  TITLE  |  33   |  1.8  |
| Microsoft  |  ORGANIZATION  |  27   |  1.5 |
| iOS | TITLE |  24 | 1.3 |
| Jenkins | PERSON | 24 | 1.3 |
| Windows | TITLE | 23 | 1.3 |
| Kubernetes | TITLE | 23 | 1.3 |

These results are interesting not only in what they show of my writing, but also because of what Comprehend will see as an entity and what kind of entity.

I'm not surprised that AWS is my most used term in the weekly notes. It's one of my main interests, and they have a lot of updates. The remaining terms are all things that crop up once in a while so that makes sense. I didn't expect Windows to crop up that much though, and Kubernetes is probably mostly based on the last year as my interests grew more in that direction.

But, let's have a look at the code behind this. The json object per file is a nested array this time, which means I had to deal with that.

```json
{
    "Entities": [
        {
            "Text": "past week",
            "Score": 0.7420563101768494,
            "Type": "DATE",
            "BeginOffset": 114,
            "EndOffset": 123
        },
```

That said, aside from the jq query everything I did is very similar to the sentiment so I'll just focus on that. I've again split it up for readability.

```bash
[.[]
| .Entities
| .[]
| select(.Type != "QUANTITY")
| select(.Type != "DATE")]
| group_by(.Text)
| map({Item: .[0].Text, Type: .[0].Type, Count: length, Percentage: length| (. * (100 / ($TOTAL | tonumber))) })
| sort_by(.Count)
| reverse
| [limit(10;.[])]
```

You may notice the first 5 lines being wrapped in an array, this is to ensure that the nested values from the .Entities are together for the grouping. If I didn't do that, it would result in multiple lists of results.

The only other major differences between this and the sentiment query are the limit at the end and the select queries that filter out quantities and dates. These led to the result containing entities like "a couple" and "Australia", which I was not interested in at all. I do include those in the total value used for the percentage calculation though.

Yearly results for 2016 and 2017 are below. Adding 2018 in the table didn't help with clarity, and didn't add much either, so I've left it off.

| 2016 Entity | 2016 Count | 2017 Entity |  2017 Count  |
|---|----|----|-----|
| AWS  |  27 (4%) | AWS | 61 (6%) |
| Apple |  25 (4%) | Google | 47 (5%) |
| Jenkins | 20 (3%) | Docker | 32 (3%) |
| Google  |  15 (2%) | Apple | 27 (3%) |
| Microsoft  | 14 (2%) | Kubernetes | 21 (2%) |
| Android  |  12 (2%) | Azure | 20 (2%) |
| iOS | 12 (2%) | Android | 20 (2%) |
| Lambda | 12 (2%) | Oracle | 16 (2%) |
| Linux | 11 (2%) | Cloudflare | 15 (2%) |
| Facebook | 10 (2%) | Microsoft | 13 (1%) |

Not very surprising results, although there is a clear shift to container technologies in 2017.

# Key Phrases

In a way this is the least interesting part, except for seeing if I use certain phrases a bit too much. Or should I say,  a lot.

| Phrase | Count |
|---------|-------|
|  a lot  |  83  |
|  AWS  |  55  |
|  Google  |  46  |
|  Apple  |  40  |
|  things  |  38  |
|  Docker  |  32  |
|  people  |  31  |
|  a couple  |  27  |
|  Kubernetes  |  27  |
|  a bit  |  26  |

I've left out the percentages here, as aside from the first one they're all under 1%. You can see a lot of overlap here with the entities, and not really a lot of phrases. When I looked at the raw data I notice that a lot of the phrases[^7] are unique. Which makes the results here pretty useless for this kind of analysis.

```bash
[[.[]
| .KeyPhrases]
| flatten
| .[]
| select(.Text != "[1]")
| select(.Text != "[2]")
| select(.Text != "[3]")]
| group_by(.Text)
| map({Text: .[0].Text, Count: length, Percentage: length| (. * (100 / ($TOTAL | tonumber)))})
| sort_by(.Count)
| reverse
| [limit(10;.[])]
```

The jq query is very similar to the entities one, with the only difference being that I filtered out some bracketed values to hide my tendency for footnotes[^8] as they're not very helpful.

# Verdict

Comprehend is an interesting tool to play around with, and I had fun with it as a learning experience, but it seems to be at an early stage in its development. In its current form I can see how it will be useful in a number of situations, which the marketing seems aimed at already. That said, there are several improvements that I'd like to see even in just the current functionalities.

First of all, that 5000 character limit has to go. Either increase it by quite a bit, or just get rid of it completely. AWS charges per 100 characters, so the most likely reason I can imagine is some limitation in the machine learning. Whatever the reason is, if it can't even parse the articles on a site like this it becomes far less useful.

At this time the sentiment analysis is mostly a toy as it's only able to detect between positive and negative. While that can be useful in for example parsing communication to and from a helpdesk, it's not much use beyond that. It would be good to see more refinements here, even if they would act as sub-sentiments. For example, having a POSITIVE rating for an article, but with high ratings for snark and sarcasm in there and maybe some happiness mixed in. Yes, this is more complex, but I never said I would ask for the easy stuff.

The entities seem to work reasonably well at this point, but I can't tell if Comprehend is limited by the domains it knows. Naturally it will have been trained on tech related items, so I got good matches, but I don't know if it will perform as well in other domains.

As I said when discussing it, key phrases doesn't seem to be very useful at this point. The phrases themselves are too unique unless they're very short[^9]. One option here could be to match similar phrases, even if they're not exactly the same.

With regards to additional features, the obvious end result of a service like this would be for it to be able to summarise the contents you provide it. In that regard, the key components seem to be there but not working together yet. A first step would be the ability to get a combined result from a single call instead of calling 3 different APIs.

I am interested in seeing where Comprehend will go in the future. Not only in how it will expand its current capabilities, but also if the results it gives will change over time. In order to test that, I put my code and the raw and "comprehended" data up on [GitHub](https://github.com/ArjenSchwarz/ignoreme-comprehend) so I can compare it in maybe a year.

[^1]:	Or causing articles to be excluded because of the length.

[^2]:	As mentioned in [Writing on iOS](/2018/02/writing-on-ios/), the Markdown files aren't all in a single directory anymore, but there was only 1 exception so I did that one manually.

[^3]:	aka files

[^4]:	Except in the case of detect-dominant-language, where you obviously don't need to provide the language code.

[^5]:	There are similar source variables for year specific results.

[^6]:	When appropriate.

[^7]:	With over 7000 key phrases in total.

[^8]:	Not that I think there's anything wrong with those.

[^9]:	Unless my writing is unusual in the amount I repeat myself.
