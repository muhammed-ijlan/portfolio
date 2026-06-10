import { AdminIcons } from "./icons";

export type NavItem = {
  id: string;
  label: string;
  icon: keyof typeof AdminIcons;
  badge?: string;
};

export type NavSection = {
  section: string;
  items: NavItem[];
};

export const NAV: NavSection[] = [
  { section: "Overview", items: [{ id: "dashboard", label: "Dashboard", icon: "grid" }] },
  {
    section: "Content",
    items: [
      { id: "projects", label: "Projects", icon: "briefcase" },
      { id: "experience", label: "Experience", icon: "layers" },
      { id: "skills", label: "Skills", icon: "code" },
      { id: "about", label: "About / Bio", icon: "userPen" },
    ],
  },
  {
    section: "Engagement",
    items: [
      { id: "messages", label: "Messages", icon: "mail", badge: "NEW" },
      { id: "media", label: "Media Library", icon: "image" },
    ],
  },
  {
    section: "System",
    items: [
      { id: "settings", label: "Site Settings", icon: "settings" },
      { id: "profile", label: "Admin Profile", icon: "user" },
    ],
  },
];

export const NAV_ITEMS = NAV.flatMap((s) => s.items);

export function hrefForId(id: string) {
  return id === "dashboard" ? "/admin" : `/admin/${id}`;
}

export function labelForPath(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  const id = pathname.split("/")[2];
  return NAV_ITEMS.find((i) => i.id === id)?.label ?? "Dashboard";
}
