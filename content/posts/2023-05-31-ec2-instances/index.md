---
Categories:
- AWS
keywords:
  - aws
  - ec2
Slug: ec2-instance-naming-explained
Author: Arjen Schwarz
Title: EC2 Instance Naming Explained
date: 2023-05-31T17:10:07+10:00
summary: "In January last year there was an announcement for the X2iezn instance type going GA. When I saw that, two thoughts went through my head: 'How do I pronounce this on a podcast?' and 'What does that even mean'? This post tries to explain the second part of that."
ogimage: https://ig.nore.me/2023/05/ec2-instance-naming-explained/instance-cheatsheet.png
---

In January last year there was [an announcement for the X2iezn instance type going GA](https://aws.amazon.com/blogs/aws/new-amazon-ec2-x2iezn-instances-powered-by-the-fastest-intel-xeon-scalable-cpu-for-memory-intensive-workloads/). When I saw that, two thoughts went through my head: "How do I pronounce this on a podcast?" and "What does that even mean"?

In this case, the announcement post actually explained what everything meant. Clearly, someone at AWS understood that this block of letters might be a bit confusing. But I figured, let's get this cleared up in the future by doing a bit of research and getting it all in a single place that I can then look up to see what it means in the future. And while I could keep this somewhere only for me[^andhave], it's just as easy to keep it public. Hopefully, this will help some of you as well. I'll try to keep this updated as new types and attributes come in.

I have used two main sources of documentation for this, the "marketing" page about EC2 instance details and the documentation page about the same. These have slightly conflicting data in places, and are clearly not kept in sync, but as the marketing page seems to contain more detailed information about the instances I have used that as the leading source, with the documentation being used to fill in any gaps.

If you're not interested in the whole document, but are looking for something that gives you all the useful information, you can download the below cheatsheet (pdf) I made that explains the various instance families, attributes, and sizes.

{{% figure src="/2023/05/ec2-instance-naming-explained/instance-cheatsheet.png" link="/instance-cheatsheet.pdf" alt="The PDF cheatsheet for instance naming" width="200" %}}

[^andhave]: And have, considering I wrote most of this a year ago before I forgot about it...

## Anatomy of an instance type

Let's break down how an instance is put together and then go into the details for each of these sections. I'll use the X2iezn as the source for this explanation.

An instance type consists of four parts:
1. Instance family (the X)
2. Generation (the 2)
3. Attributes (iezn)
4. Size (the size you want the instance at, e.g. 2xlarge)

Some of these are a lot easier to understand than others, but let's go through them one by one.

## Instance family

On the EC2 types website, AWS has grouped these families into 6 groups. To make things easier, I'll use these groups as well even though two of them only contain a single family. Instance families started out being represented by a single letter, which at times became a bit awkward and unwieldy, and lately AWS has started using longer family names.

One note before we look at the families concerning capitalization of the families. AWS is not consistent about this and often shows a family and generation as starting with an uppercase letter (e.g. T3 or Mac1), but will show a specific size using lowercase (e.g. t3.medium or mac1.metal). There are exceptions to this as well, and instead of trying to make sense of it all, I'm following the pattern I name above where I capitalize the families unless it's for a specific size.

### General Purpose

These are the usual workhorses and the [standard instance types](https://aws.amazon.com/ec2/instance-types/#General_Purpose) you're most likely to use unless you've done some investigating and work on figuring out what's best for your environment. It consists of the following types:

| Family | AWS Description                                            | Additional notes                                                                                                                                                                                                                        |
| ------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mac    | Powered by Apple Mac mini computers                        | The first one on the list, but already doesn't follow the standard pattern of a single letter. Mac instances (in AWS) have only existed since late 2020, and it's unlikely Apple would allow a different name.                          |
| T      | Burstable general-purpose instance types                   | Basically the same as `m` instances, but with only a portion of the CPU always usable and the rest through burst credits. Interestingly, in the documentation it is said the T stands for Turbo, but this term isn't used anywhere else |
| M      | General-purpose instance type                              | The standard general-purpose instance family                                                                                                                                                                                            |
| A      | The first EC2 instances powered by AWS Graviton Processors | Basically Graviton 1, which started as its own family until it was turned into a type detail. Obviously an outdated family                                                                                                              |

### Compute optimized

[Compute optimized instances](https://aws.amazon.com/ec2/instance-types/#Compute_Optimized) generally have half the memory of an equivalent general purpose instance. Which delivers a cost-saving for applications that don't need as much memory. This

| Family | AWS Description                                                                        | Additional notes                                                                                    |
| ------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| C      | An ideal fit for compute-intensive workloads                                           | The standard compute-optimized family                                                                                                    |


### Memory optimized

[Memory optimized instances](https://aws.amazon.com/ec2/instance-types/#Memory_Optimized) have a multiple amount of the memory of an equivalent general purpose instance. Which makes it a good fit for anything that needs lots of memory, like Java applications.

| Family          | AWS Description                                                     | Additional notes                                                                                                                 |
| --------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| R               | Optimized for memory-intensive applications                         | The standard memory-optimized instance family                                                                                    |
| X               | Optimized for enterprise-class databases and in-memory applications | Depending on the generation and type details, these have multiple times the memory of the equivalent R instance                  |
| U / High Memory | Purpose built to run large in-memory databases                      | Ridiculous amounts of memory, and the weirdest naming scheme of any instance type                                                |
| Z               | Offers both high compute capacity and a high memory footprint       | Basically an R instance, but with a high-frequency processor. If this came out now it probably would be a variant of R instances |

As you can see in the table, there are two interesting families here. The Z instances, which as we'll see later is now just a attribute but like the A family got its own type when it came out. It should be fairly clear these are on their way out and will soon enough become a variant of the R6 or R7 generations.

The other weird one is the High Memory instances. These have a different naming scheme, where the name actually shows how much memory they have; `u-6tb` to `u-24tb`. These are still part of the family name, but more a sub-family and not quite shown as such as some others we'll be discussing later.

### Accelerated Computing

These are [instance types](https://aws.amazon.com/ec2/instance-types/#Accelerated_Computing) optimized for specific use cases, such as machine learning or video transcoding. Each of them is special in its own way, and to really know what suits you best you're better off looking into the details.

| Family | AWS Description                                                                       | Additional notes                                                                                                               |
| ------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| P      | GPU-based instances                                                                   | These use a P instead of G because that was already in use                                                                     |
| DL     | Powered by Gaudi accelerators from Habana Labs                                        | Our first 2 letter instance type, but not a subfamily of the D instances which are specialized in HDD storage                  |
| Trn    | Powered by AWS Trainium                                                               | An instance type for training your ML models, developed by AWS and one of the view that has a name longer than a single letter |
| Inf    | Built from the ground up to support machine learning inference applications           | Uses Inferentia chips in addition to the usual Intel ones. Probably the first one to use a longer family name                  |
| G      | Designed to accelerate graphics-intensive applications and machine learning inference | Has been longer around than the P instances, and stole the G name                                                              |
| F      | Customizable hardware acceleration with field programmable gate arrays                | FPGAs are cool, and obviously this is a good name                                                                              |
| VT     | Designed to deliver low cost real-time video transcoding                              | Another 2 letter name. At least this one makes sense, but why not use V?                                                       |

While the group as a whole is called accelerated computing, it's clear that most of the instance families are focused on one part of the AI/ML stack or another. With the increasing focus on AI, I expect that these instance types receive a lot of attention and will have new types get introduced soon enough. I also wouldn't be surprised if at that point AWS breaks the AI/ML focused families out into their own category like they did for the HPC ones which originally fell under Compute Optimized.

### Storage Optimized

[These instance families](https://aws.amazon.com/ec2/instance-types/#Storage_Optimized) are all about the local storage. Either NVMe SSDs or classic HDD.

| Family | AWS Description                                                                                                   | Additional notes                                                                                                                                          |
| ------ | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I      | Provides Non-Volatile Memory Express (NVMe) SSD-backed instance storage                                           | If you want lots of fast local storage, these are what you need. The I stands for I/O, although they could have chosen S                                  |
| D      | Feature up to 48 TB of HDD-based local storage                                                                    | If you really need a lot of (slow) local storage. D presumably stands for disk.                                                                             |
| H      | Feature up to 16 TB of HDD-based local storage, deliver high disk throughput, and a balance of compute and memory | I'm guessing H stands for High throughput, but I suspect this family is on its way out as it hasn't received any updates and the processor it uses is now 7 years old |

The I family of instances is currently the only one that has a modifier in front of the generation number, specifically the Im4gn and Is4gen instances. We've seen a couple of instance types with longer names (Mac, Trn), but this is the only case of an actual sub-family defined in this way. I hope this was done on purpose and not that someone forgot how the naming scheme works.

| Sub-family | AWS Description                                                                              |
| ---------- | -------------------------------------------------------------------------------------------- |
| Im         | Provide the best price performance for storage-intensive workloads                           |
| Is         | Offers the lowest cost per TB of SSD storage and the highest density of SSD storage per vCPU |

That said, I have no idea what the m and s stand for. It's not medium and small, as the Is instances have more memory than Im. It's a bit of a stretch, but the only thing I can think of is based on [the announcement](https://aws.amazon.com/about-aws/whats-new/2021/11/amazon-ec2-im4gn-is4gen-aws-graviton2/) where the use cases are described and the Im4gn is described as being good for databases like **M**ySQL and the Is4gen are good for **s**treaming. Someone, please tell me the actual meaning behind these letters so I can get that thought out of my head.

### HPC Optimized

These are instances focused on delivering the best result for High-Performance Compute workloads. Not much else to say, as it's all in the name. Weirdly enough, depending on which part of the official documentation you look at these can be categorised as [HPC Optimised](https://aws.amazon.com/ec2/instance-types/#Storage_Optimized) or as part of the [Compute Optimised](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/compute-optimized-instances.html) section. As stated above, I've chosen to use the more complete appearing marketing page as the main source, which is why they are in this section.

| Family | AWS Description                                                                        | Additional notes                                                                                    |
| ------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Hpc    | Optimized for tightly coupled, compute-intensive, high performance computing workloads | A new instance type from January 2022, that's so powerful it couldn't be reduced to a single letter |


## Generation

The generation of a family. Higher is newer (M7 is newer than M6), but newer families will obviously have lower generation numbers (e.g. Trn1 is newer than M6), so these generation numbers can't be compared between families. AWS does use this to promote their Graviton processors by always making them part of a new generation of processors. So Graviton2 came out first in the M6g when Intel was still only on M5, and Graviton3 can be found on the M/C/R7g while no equivalent 7th generation Intel or AMD instances exist.

## Attributes

### Processor type

The processor type letter didn't exist until Graviton2 came out, and it didn't even include options for Intel or AMD until the M6i and M6a respectively became available. Unfortunately, this is also not consistently applied even for new instances *except* when they run Graviton which always gets a `g`.

Typically everything without an attribute is Intel, as for a very long time that was the only option available, but that's not always the case. An example of this is the new G5 and G5g families. G5g is clearly Graviton, but unless you are familiar with the G series of instances you might be mistaken in your believe that G5 is an Intel type[^obvious].

The chosen letters in this case are clear, and already mentioned above but let me repeat them anyway:

* `i`: Intel
* `a`: AMD
* `g`: Graviton

To be clear, this doesn't indicate anything other than the type of chip. So Graviton2 and Graviton3 are both represented by a `g`, and when in the future `i` and `a` have different chipsets they will still keep it to just `i` and `a`.

One thing to note here, Mac instances come in both Intel and Apple Silicon (aka ARM) processor types but AWS doesn't make a distinction there. It's simply that the mac1.metal instances use Intel while mac2.metal instances use Apple Silicon. As it's unlikely Apple will ship any more Mac Minis with Intel processors that probably won't be a big concern going forward.

[^obvious]: I hope you realise that means it's AMD seeing there are only 3 types.

### Generic attributes

- b: block-storage optimized (increases the EBS bandwidth, but is currently only available in the older R5b instances)
- n: network optimized (usually 100Gb networking )
- z: high frequency
- d: local NVMe storage


### Family group specific attributes

There is one attribute that means different things based on the instance family group. This is the attribute `e`.

`e` stands for `extra`[^notme], specifically for memory or storage. The only instance families with this attribute are in the memory optimized and storage optimized groups and they exacerbate the values of the group. So, for memory optimized instances the amount of memory is doubled compared to the same type without an `e`, and for storage optimized you get more storage (there is no fixed pattern for that one that I could figure out).

[^notme]: Proving that it's not just me who comes up with weird names

### Summary table

| attribute | meaning                                          |
| --------- | ------------------------------------------------ |
| i         | This is an Intel instance                        |
| a         | This is an AMD instance                          |
| g         | This is a Graviton instance                      |
| b         | This instance has higher EBS bandwidth           |
| n         | This instance has more network bandwidth         |
| t         | This instance has a higher CPU clock speed       |
| d         | This instance has local NVMe storage             |
| e         | This instance has its defining property improved |

## Sizing

At first glance, sizing is very straightforward. They basically work on the concept of t-shirt sizes[^shirtsize] and the size is always based on the number of vCPUs available. Medium size instances have a single vCPU, large has 2 vCPUs, xlarge has 4, and from there you multiply by the number in front of it so 2xlarge has 8, etc. The one exception to this is the T-type instances. These don't go lower than 2 vCPUs even for the nano sizing. However, there the size is mostly based on vCPU credits that determine how long you can use the full capacity of the instance.

An instance family type then usually has a multiplier for the amount of memory; for the M types this is 4, meaning you get 4GiB of memory for each vCPU core, with the C types it is 2, and with R it is 8.

The one complication that comes with sizing is all the special modifiers that can have differences based on the size of the instance. For example, for C6gn, the network optimized part scales up with the instance size. So a c6gn.8xlarge has 50Gbps network bandwidth, but a c6gn.16xlarge has 100Gbps.

And then there is the "metal" size. This isn't really a size as much as a different type of instance as it doesn't offer you a virtualised instance but what AWS terms "bare metal". This means you get access to the full underlying hardware and don't share it with anyone. This also means you don't get a choice about the sizing of a metal instance as it's always the maximum possible size for the instance family. In addition, however, you don't get any overhead caused by virtualisation.

[^shirtsize]: Ok, not micro or nano and I admit not seeing many 112xlarge t-shirts either.