import type { IconName } from "@lib/icons";

/** One-page CV shared from Google Drive. */
export const CV_URL = "https://drive.google.com/file/d/17i14DI4StC3FRe67TaIAGxRkV_3h7RoP/view?usp=sharing";

export interface ProfileLink {
  label: string;
  href: string;
  icon: IconName;
}

/** Official profiles, shown in the hero and the footer. */
export const PROFILE_LINKS: readonly ProfileLink[] = [
  { label: "X profile", href: "https://x.com/0bkevin", icon: "x" },
  { label: "GitHub profile", href: "https://github.com/0bkevin", icon: "github" },
  { label: "LinkedIn profile", href: "https://www.linkedin.com/in/0bkevin/", icon: "linkedin" },
];
