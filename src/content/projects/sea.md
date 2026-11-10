---
title: "SEA: Advisee Evaluation System"
pubYear: '2024-01-01T12:00:00Z'
description: An internal platform for EducationUSA advisory operations, centralizing student histories, outreach activities, institutional alliances, and funnel visibility.
image: { url: '/assets/projects/sea/cover.avif', alt: 'Minimal abstract cover for the SEA EducationUSA advisory operations platform' }
ogImage: { url: '/assets/projects/sea/og.jpg', alt: 'Minimal abstract cover for the SEA EducationUSA advisory operations platform' }
tags: [platform, education, full-stack, operations]
technologies: [Next.js, PostgreSQL, Prisma, Auth.js, Azure, data modeling]
language: en
---

## Overview

SEA, the **Advisee Evaluation System**, is the internal platform I engineered for EducationUSA to give the advisor full control over the advisory funnel. The system centralizes student records, advisory history, outreach activities, and institutional alliances in one operational workspace.

The goal was simple: replace scattered records with a system that made follow-up, reporting, and opportunity tracking easier to manage. Education advising depends on context. SEA keeps that context visible throughout the student journey.

<figure>
  <img src="/assets/projects/sea/image.avif" alt="SEA dashboard showing advisee totals, monthly registrations, and top advisees by step" />
  <figcaption>SEA dashboard showing advisee totals, monthly registrations, and top advisees by step</figcaption>
</figure>

## Context

EducationUSA supports students who are exploring international academic opportunities. That work requires more than one-time guidance. Advisors need to understand each student's profile, track previous interactions, document progress, and connect candidates with relevant opportunities abroad.

Before SEA, that information was harder to manage as a single record. Student histories, promotional activities, and partner institutions could live in separate files or informal workflows. This made reporting slower and reduced visibility into where each student stood in the advisory process.

## My role

I built the system alone, from requirements to implementation, focusing on the workflows the advisor needed to operate every week. I built it with Next.js, PostgreSQL, Prisma, and Auth.js, deployed on Azure, and my work covered the relational data model, interface structure, feature development, and the core backend flows for advisory and outreach records.

The product had to support real operational use, not just store information. Each section was designed around the questions an advisor needs to answer quickly: who needs follow-up, what has already happened, which outreach activities are active, and what alliances can create new study opportunities.

## Product scope

SEA became a management tool for the advisory funnel. It organizes the information EducationUSA needs to support students from initial contact to ongoing guidance.

The platform supports:

- student profile and advisee history management
- advisory funnel tracking
- records of outreach and promotional activities
- institutional alliance management
- follow-up visibility for active students
- reporting support for advisory operations

## Advisory records

The student record is the center of the system. SEA keeps a detailed history for each person seeking international academic guidance, including their profile, progress, and advisory interactions.

This matters because advising depends on continuity. With a structured record, the advisor can review prior context before each interaction and avoid rebuilding the student's history from memory or scattered notes.

<figure>
  <img src="/assets/projects/sea/image copy 3.avif" alt="SEA database view showing scholar records, status filters, and academic profile fields" />
  <figcaption>SEA database view showing scholar records, status filters, and academic profile fields</figcaption>
</figure>

## Advisory journey

SEA also included a student-facing structure based on EducationUSA's five steps to U.S. study. This helped connect the internal advising workflow with the path students were already expected to follow, from researching academic options to preparing for departure.

<figure>
  <img src="/assets/projects/sea/image copy 4.avif" alt="SEA student-facing view showing the five steps to U.S. study" />
  <figcaption>SEA student-facing view showing the five steps to U.S. study</figcaption>
</figure>

## Outreach and alliances

SEA also manages the operational side of EducationUSA's work. Outreach and promotional activities can be recorded as part of the same platform, giving the advisor a clearer view of what has been done, what audiences were reached, and how those efforts relate to the advisory pipeline.

The system also maintains a database of institutional alliances. These records help track relationships with schools, universities, organizations, and partners that can expand access to study opportunities abroad.

## Payments and services

The platform also records paid services connected to the advising process, including initial advising, follow-up advising, and translations. This gives the advisor one place to review service history, monthly payment activity, receipts, and the type of support each student received.

<figure>
  <img src="/assets/projects/sea/image copy 2.avif" alt="SEA payment registry showing service history, monthly payment charts, and transaction records" />
  <figcaption>SEA payment registry showing service history, monthly payment charts, and transaction records</figcaption>
</figure>

## Operational impact

SEA gave the advisor a clearer operating model for managing students, activities, and alliances. Instead of treating advisory records, outreach work, and partner relationships as separate administrative tasks, the platform brought them into one workflow.

That improved day-to-day visibility across the funnel. The advisor could track student progress, preserve historical context, review outreach activity, and manage institutional relationships with less manual coordination.

## What I learned

This project reinforced that internal tools are most valuable when they match the real work. SEA was not only a database. It was a way to make advisory operations easier to inspect, maintain, and improve over time.
