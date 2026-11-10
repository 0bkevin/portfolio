export interface NavItem {
  label: string;
  href: string;
}

/** Main pages, shared by the navbar and the footer. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Experience", href: "/experience" },
  { label: "About", href: "/me/who-is-kevin-bravo" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/0b" },
  { label: "Contact", href: "/contact" },
  { label: "AMA", href: "/me/ama" },
];

/** The nav item whose page (or a page under it) is open, so the highlight means "you are here". */
export const activeNavHref = (pathname: string): string | undefined => {
  const path = pathname.replace(/\/$/, "") || "/";
  return NAV_ITEMS.find((item) => path === item.href || path.startsWith(`${item.href}/`))?.href;
};
