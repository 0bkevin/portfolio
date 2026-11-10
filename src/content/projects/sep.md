---
title: "SEP: Participant Evaluation System"
pubYear: '2024-01-01T12:00:00Z'
description: A platform for ProExcelencia operations, replacing scattered Excel files with real-time scholar, activity, volunteer-hour, and performance tracking.
image: { url: '/assets/projects/sep/cover.avif', alt: 'Generated portfolio cover for the SEP participant evaluation system platform' }
ogImage: { url: '/assets/projects/sep/og.jpg', alt: 'Generated portfolio cover for the SEP participant evaluation system platform' }
tags: [platform, education, full-stack, multi-tenant, operations]
technologies: [Next.js, PostgreSQL, Prisma, Auth.js, Azure, data modeling]
language: en
---

## Overview

SEP, the **Participant Evaluation System**, is the platform I built to help AVAA manage ProExcelencia with live data instead of scattered spreadsheets. It is a multi-tenant system serving around 400 monthly active users across all three states where ProExcelencia operates in Venezuela, centralizing scholar records, activities, chat clubs, volunteer hours, attendance, and reports.

## Context

Before SEP, program tracking depended on Excel files, manual updates, and fragmented historical records. Simple questions took extra time to answer: which scholars were active, how many activities had been completed, which hours were logged, and what still needed attendance review.

The team needed one operational record for activity planning, scholar follow-up, attendance control, and reporting.

## My role

I built SEP alone, from the first conversation to production. I started on this program as an intern, writing Python ETL scripts to clean and normalize historical records from 2020 to 2023. After months inside that data I understood the problem better than anyone, so instead of cleaning spreadsheets forever I proposed and built a single system the team could run the program from. The data I had cleaned became the seed dataset.

I built it with Next.js, PostgreSQL, Prisma, and Auth.js, deployed on Azure, and I owned the product structure, relational data model, interface design, backend workflows, and implementation. It is multi-tenant: each of the three national chapters manages its own scholars and operation while coordinators keep visibility over the whole program. After launch, I stayed the technical owner: I operated it in production on Azure, debugged and fixed errors, and turned staff feedback into workflow improvements.

## Product scope

SEP became the main platform for managing the scholar lifecycle, from activity registration to performance reporting.

The platform supports:

- scholar database management
- activity and calendar tracking
- chat club participation records
- volunteer-hour logs
- attendance review
- performance reports
- chapter-level monitoring

<figure>
  <img src="/assets/projects/sep/pes-calendar.svg" alt="PES calendar view with scholar activity KPIs and upcoming activity lists" />
  <figcaption>PES calendar view with scholar activity KPIs and upcoming activity lists</figcaption>
</figure>

This view shows the main operations panel: KPI cards, a monthly activity calendar, and lists for upcoming or pending activities.

## Reporting and analytics

The reporting views let staff review activity totals, monthly trends, attendance status, distribution charts, and exportable tables without manually filtering spreadsheets.

<figure>
  <img src="/assets/projects/sep/pes-reports.svg" alt="PES analytics view with activity totals, monthly charts, distribution charts, and a searchable table" />
  <figcaption>PES analytics view with activity totals, monthly charts, distribution charts, and a searchable table</figcaption>
</figure>

This screen focuses on program reporting. It turns activity records into charts and tables the team can use for follow-up and internal reports.

## Scholar visibility

SEP also includes scholar-facing views for personal progress. Participants can review their activity history, chat club progress, modality patterns, and goal completion.

<figure>
  <img src="/assets/projects/sep/scholar-portal.svg" alt="Scholar portal showing personal statistics, monthly activity trends, and progress by goal" />
  <figcaption>Scholar portal showing personal statistics, monthly activity trends, and progress by goal</figcaption>
</figure>

This view shows the participant side of the platform, where scholars can track their own progress and pending goals.

## Operational impact

SEP reduced repetitive tracking work by centralizing activity, attendance, volunteer-hour, and reporting workflows. The team gained more time for scholar mentoring, activity planning, chapter coordination, and impact reporting.

The practical result was a cleaner operating model. Data entered during daily work could later support reports and decisions without rebuilding the same information by hand.

## What I learned

This project reinforced that internal tools work when they follow the real workflow. SEP had to reflect how scholars move through activities, how attendance becomes evidence, how volunteer hours are validated, and how historical records become usable data.
