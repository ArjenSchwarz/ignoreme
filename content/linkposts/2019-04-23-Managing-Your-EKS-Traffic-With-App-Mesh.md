---
Categories:
- AWS
Redirect: https://medium.com/digio-australia/managing-your-eks-traffic-with-app-mesh-a8838e27e7a1
keywords:
  - containers
  - aws
  - eks
  - appmesh
Slug: managing-your-eks-traffic-with-app-mesh
Author: Arjen Schwarz
Title: Managing Your EKS Traffic With App Mesh
date: 2019-04-23T09:24:22+1000
summary: "Recently I had some time to play around with AWS App Mesh and, as expected, decided to write up the experience. This also marks my first blog post at DigIO."
---

> AWS App Mesh is a managed service mesh from AWS. While announced at re:Invent 2018, it only became generally available at the end of March. In this post, I aim to give an overview of the service and how it works with EKS. I'll also highlight some differences with Istio and give a step-by-step walkthrough to make it work with an application.

Recently I had some time to play around with AWS App Mesh and, as expected, decided to write up the experience. This also marks my first blog post at DigIO which I'm quite happy about.