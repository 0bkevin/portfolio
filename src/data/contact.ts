import type { IconName } from "@lib/icons";

export const CONTACT_EMAIL = "0bravokevin@gmail.com";

interface BaseChannel {
  label: string;
  value: string;
  icon: IconName;
}

/** A channel with a profile URL. */
export interface LinkChannel extends BaseChannel {
  href: string;
}

/** A channel without a profile URL (Discord usernames), whose handle is copied instead. */
export interface CopyChannel extends BaseChannel {
  copy: true;
}

export type ContactChannel = LinkChannel | CopyChannel;

export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  // Telegram usernames cannot start with a digit, hence "Obkevin" with a letter O.
  { label: "Telegram", value: "@Obkevin", icon: "telegram", href: "https://t.me/Obkevin" },
  { label: "Discord", value: "0bkevin", icon: "discord", copy: true },
  { label: "X", value: "@0bkevin", icon: "x", href: "https://x.com/0bkevin" },
  { label: "LinkedIn", value: "Kevin Bravo", icon: "linkedin", href: "https://www.linkedin.com/in/0bkevin/" },
];
