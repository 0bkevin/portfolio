/** Hackathon prizes and recognitions, newest first; grouped by year on the homepage. */
export const HONORS = [
  {
    date: "Oct 2026",
    title: "2nd Place, AI Security Track",
    issuer: "Platanus Hack Caracas",
    proof: "https://www.linkedin.com/feed/update/urn:li:activity:7520789632851197952/",
    summary:
      "Won second place in the AI Security track with Gotchu, an AI-powered security audit platform for small and medium-sized businesses.",
  },
  {
    date: "Sep 2025",
    title: "3rd Place Winner, EmprendeTECH Hackathon",
    issuer: "IESA",
    proof:
      "https://www.linkedin.com/in/0bkevin/overlay/Honor/887510572/treasury/?profileId=ACoAADSZ2zkB0ekFm1PJkO12A35maQbP-ni2b9w",
    summary:
      "Won third place with Planify in IESA's first EmprendeTECH Hackathon.",
  },
];

export type Honor = (typeof HONORS)[number];
