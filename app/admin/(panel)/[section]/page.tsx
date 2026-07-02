"use client";

import { notFound, useParams } from "next/navigation";
import { ProjectsPage } from "@/components/admin/pages/ProjectsPage";
import { BlogPage } from "@/components/admin/pages/BlogPage";
import { ExperiencePage } from "@/components/admin/pages/ExperiencePage";
import { SkillsPage } from "@/components/admin/pages/SkillsPage";
import { AboutPage } from "@/components/admin/pages/AboutPage";
import { MessagesPage } from "@/components/admin/pages/MessagesPage";
import { MediaPage } from "@/components/admin/pages/MediaPage";
import { SettingsPage } from "@/components/admin/pages/SettingsPage";
import { ProfilePage } from "@/components/admin/pages/ProfilePage";

const PAGES: Record<string, () => React.JSX.Element> = {
  projects: ProjectsPage,
  blog: BlogPage,
  experience: ExperiencePage,
  skills: SkillsPage,
  about: AboutPage,
  messages: MessagesPage,
  media: MediaPage,
  settings: SettingsPage,
  profile: ProfilePage,
};

export default function SectionPage() {
  const { section } = useParams<{ section: string }>();
  const Page = PAGES[section];
  if (!Page) notFound();
  return <Page />;
}
