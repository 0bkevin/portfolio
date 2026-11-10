// Single source for work history: the homepage shows `summary`, /experience shows everything.
// Every claim here must be backed by kevin-history.md. Keep bullets to one plain sentence each.

export interface Role {
  role: string;
  company: string;
  url?: string;
  period: string;
  /** Employment type and where the work happened. */
  setting: string;
  /** One line for the homepage list. */
  summary: string;
  bullets: string[];
  stack: string[];
}

export const EXPERIENCE: Role[] = [
  {
    role: "senior product engineer",
    company: "free2z",
    url: "https://free2z.cash",
    period: "mar 2025 - oct 2026",
    setting: "full-time · remote",
    summary:
      "Led the live creator platform's migration from React to SvelteKit without losing features, built an MCP server that lets AI agents publish and manage content through scoped, expiring access, and protected payments and Zcash sign-in against double charges and replayed requests.",
    bullets: [
      "Led the move of Free2Z, a live platform where creators publish, stream, and get paid by their community, from React to SvelteKit and TypeScript, rebuilding publishing, navigation, and mobile layouts without taking away any feature creators relied on.",
      "Built an MCP server in Python and Django so AI agents can write and edit pages, search content, upload media, and manage comments for a creator, without ever borrowing the creator's browser session.",
      "Kept that agent access safe with scoped, expiring tokens, input checks, and a log of every change an agent made, and designed the server to run across several copies so it could grow with demand.",
      "Made Stripe and Zcash payments safe to retry, so a lost response or a double tap never charged a supporter twice, and priced Zcash purchases from live exchange rates instead of fixed ones.",
      "Protected Zcash sign-in against replayed and spoofed requests by making each login challenge single-use in PostgreSQL, and updated the API contract, NGINX rules, and runbooks to match.",
      "Added Dyte live video and a Markdown publishing system with multilingual articles, so creators could host live sessions and write for readers in more than one language.",
      "Made Kubernetes releases safer with health checks, rollback safeguards, and resource limits, and sped up CI so engineers waited less to validate their changes.",
    ],
    stack: ["sveltekit", "typescript", "python", "django", "postgresql", "mcp", "kubernetes"],
  },
  {
    role: "product engineer",
    company: "u.s. department of state, via avaa",
    url: "https://ve.usembassy.gov/",
    period: "oct 2024 - aug 2025",
    setting: "contract · remote",
    summary:
      "Built Billingua Talent for the Venezuela Affairs Unit, a bilingual platform connecting Venezuelan professionals with employers; hired and led two engineers, designed separate access for candidates, employers, advisors, and admins, and piloted it with 50 users and five companies.",
    bullets: [
      "Built Billingua Talent for the U.S. Department of State's Venezuela Affairs Unit, a bilingual platform that connects Venezuelan professionals with employers hiring locally, owning discovery, product design, and the Next.js and PostgreSQL build.",
      "Hired two engineers to speed up the core features, then coordinated their work and brought it together into a single application.",
      "Designed separate access for candidates, employers, advisors, and administrators, so each group only sees its own records and tasks.",
      "Built bilingual candidate profiles, job listings, English-level tracking, course registrations, and advisor dashboards, so advisors could follow each candidate's readiness in one place.",
      "Presented working versions to AVAA and U.S. Embassy stakeholders in plain language and piloted the platform with 50 users and five companies, turning their feedback into product changes.",
    ],
    stack: ["next.js", "typescript", "postgresql", "drizzle", "fastapi"],
  },
  {
    role: "full stack engineer",
    company: "freelance software development",
    period: "jul 2024 - dec 2024",
    setting: "freelance · remote",
    summary:
      "Worked with a range of clients across education, finance, and professional services, building websites and mobile apps from first scoping conversations through launch and post-launch support.",
    bullets: [
      "Designed, built, and launched websites with Astro for education and professional-services clients, covering layout, content, contact forms, speed, and hosting.",
      "Built cross-platform mobile apps with Flutter, including Knowfi, a personal finance app that runs on iOS and Android from one codebase.",
      "Wrote automation scripts and integrations that cleaned client data and took recurring manual tasks off their plate.",
      "Worked directly with non-technical clients from the first scoping call through launch and support, showing progress often and adjusting to their feedback.",
    ],
    stack: ["astro", "flutter", "dart", "typescript"],
  },
  {
    role: "full stack engineer",
    company: "avaa",
    url: "https://avaa.org/",
    period: "oct 2022 - jul 2024",
    setting: "contract · hybrid, caracas",
    summary:
      "Replaced spreadsheets with two production platforms on Azure for AVAA's scholarship program and EducationUSA advisors; SEP serves about 400 monthly users across three chapters, with an AI assistant that answers staff questions from program records.",
    bullets: [
      "Built and ran SEP, the platform AVAA's ProExcelencia scholarship program uses to track scholars, activities, attendance, and volunteer hours, replacing scattered spreadsheets for about 400 monthly users across three chapters.",
      "Built SEA on the same Next.js, PostgreSQL, and Azure stack, so EducationUSA advisors could manage student histories, outreach, payments, and partnerships in one application.",
      "Built an AI assistant with LangChain and retrieval-augmented generation (RAG), so staff could ask plain-language questions about scholar participation and get answers drawn from SEP's own records.",
      "Met with program staff, advisors, and scholars to learn how they worked, turned their needs into requirements, and demoed progress in plain language to set priorities.",
      "Kept both platforms running on Azure by fixing reported issues and shipping updates, and set up a maintenance program so scholarship recipients could keep improving SEP after the build.",
    ],
    stack: ["next.js", "postgresql", "prisma", "azure", "langchain", "python"],
  },
  {
    role: "junior software engineer",
    company: "avaa, internship",
    url: "https://avaa.org/",
    period: "sep 2021 - aug 2022",
    setting: "internship · on-site, caracas",
    summary:
      "Cleaned four years of scattered scholarship records with Python into the program's first Power BI dashboard and automated recurring activity setup with Google Apps Script; that dataset later seeded SEP.",
    bullets: [
      "Cleaned and reconciled four years of scattered ProExcelencia records with Python scripts, producing a dataset staff could finally analyze and that later seeded SEP.",
      "Built the program's first interactive Power BI dashboard on scholar demographics, academics, employment, and long-term outcomes, giving staff one view of the program's history.",
      "Automated recurring activity setup with Google Apps Script, so staff spent less time maintaining program activities by hand.",
    ],
    stack: ["python", "power bi", "google apps script"],
  },
];

export interface Volunteering {
  role: string;
  org: string;
  period: string;
  summary: string;
}

export const VOLUNTEERING: Volunteering[] = [
  {
    role: "vice president",
    org: "ja venezuela alumni",
    period: "mar 2026 - present",
    summary:
      "Set yearly priorities with the board and coordinate committees and project leads, after helping launch the national alumni network as a volunteer.",
  },
  {
    role: "hackathon hub organizer",
    org: "dev3pack",
    period: "apr 2026 - may 2026",
    summary:
      "Ran the Caracas hub of a global AI and Web3 hackathon, from venue and sponsors to mentoring teams through their final submissions.",
  },
  {
    role: "code mentor",
    org: "technovation girls venezuela",
    period: "jan 2026 - apr 2026",
    summary: "Mentored four students taking a mobile app for a community problem from idea to working prototype.",
  },
  {
    role: "web developer & technical consultant",
    org: "finnancity",
    period: "sep 2025 - present",
    summary: "Build web pages and forms and advise on product and tool choices for education and finance initiatives.",
  },
  {
    role: "education committee member",
    org: "avaa",
    period: "sep 2024 - present",
    summary:
      "Help plan how the ProExcelencia scholarship program evolves for around 300 scholars, bringing an engineering view as a former scholar.",
  },
  {
    role: "project lead, una mano amiga por el ambiente",
    org: "avaa",
    period: "feb 2020 - feb 2021",
    summary:
      "Moved an environmental education project online during the pandemic, building 28 alliances and reaching more than 1,300 participants.",
  },
];
