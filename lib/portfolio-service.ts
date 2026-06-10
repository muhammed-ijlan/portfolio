// Public portfolio data service. Reads the published CMS content from MongoDB
// and shapes it for the public site (drafts excluded, admin-only fields dropped).
// Used by the public API routes — and reusable from server components if you
// later render the site straight from the DB.

import { cache } from "react";
import { connectDB } from "./db";
import { Project } from "./models/Project";
import { Experience } from "./models/Experience";
import { Skill } from "./models/Skill";
import { About } from "./models/About";
import { Settings } from "./models/Settings";
import { SEED } from "./seed-data";
import type {
  About as AboutType,
  Experience as ExperienceType,
  Project as ProjectType,
  Settings as SettingsType,
  Skill as SkillType,
} from "./seed-data";

// What the public site cares about for a project — no draft status, no views.
export type PublicProject = Omit<ProjectType, "status" | "views">;
export type PublicExperience = ExperienceType;
export type PublicSkill = SkillType;
export type PublicAbout = AboutType;
// Settings are already public-safe; expose them as-is.
export type PublicSettings = SettingsType;

function pid(d: Record<string, unknown>) {
  const { _id, __v, createdAt, updatedAt, ...rest } = d;
  void __v;
  void createdAt;
  void updatedAt;
  return { id: String(_id), ...rest };
}

export async function getPublicProjects(): Promise<PublicProject[]> {
  await connectDB();
  const docs = await Project.find({ status: "published" })
    .sort({ featured: -1, createdAt: -1 })
    .lean();
  return docs.map((d) => {
    const { status, views, ...rest } = pid(d as Record<string, unknown>) as Record<string, unknown>;
    void status;
    void views;
    return rest as unknown as PublicProject;
  });
}

export async function getPublicExperience(): Promise<PublicExperience[]> {
  await connectDB();
  const docs = await Experience.find().sort({ createdAt: -1 }).lean();
  return docs.map((d) => pid(d as Record<string, unknown>) as unknown as PublicExperience);
}

export async function getPublicSkills(): Promise<PublicSkill[]> {
  await connectDB();
  const docs = await Skill.find().sort({ createdAt: 1 }).lean();
  return docs.map((d) => pid(d as Record<string, unknown>) as unknown as PublicSkill);
}

export async function getPublicAbout(): Promise<PublicAbout> {
  await connectDB();
  const doc = await About.findOne({ key: "singleton" }).lean<Record<string, unknown>>();
  if (!doc) return SEED.about;
  const { _id, __v, key, createdAt, updatedAt, ...rest } = doc;
  void _id;
  void __v;
  void key;
  void createdAt;
  void updatedAt;
  return rest as unknown as PublicAbout;
}

export async function getPublicSettings(): Promise<PublicSettings> {
  await connectDB();
  const doc = await Settings.findOne({ key: "singleton" }).lean<Record<string, unknown>>();
  const src = (doc ?? SEED.settings) as unknown as typeof SEED.settings;
  return {
    siteTitle: src.siteTitle,
    tagline: src.tagline,
    accent: src.accent,
    defaultTheme: src.defaultTheme,
    seoDescription: src.seoDescription,
    toggles: src.toggles,
  };
}

export type Portfolio = {
  about: PublicAbout;
  projects: PublicProject[];
  experience: PublicExperience[];
  skills: PublicSkill[];
  settings: PublicSettings;
  contact: { email: string; phone: string; socials: PublicAbout["socials"] };
};

// One call that returns everything the public site needs to render.
export async function getPortfolio(): Promise<Portfolio> {
  await connectDB();
  const [about, projects, experience, skills, settings] = await Promise.all([
    getPublicAbout(),
    getPublicProjects(),
    getPublicExperience(),
    getPublicSkills(),
    getPublicSettings(),
  ]);
  return {
    about,
    projects,
    experience,
    skills,
    settings,
    contact: { email: about.email, phone: about.phone, socials: about.socials },
  };
}

// Build a Portfolio straight from the in-repo SEED — used as a fallback when the
// database isn't configured/reachable so the public site always renders.
function seedPortfolio(): Portfolio {
  const { about, settings } = SEED;
  const projects = SEED.projects
    .filter((p) => p.status === "published")
    .map(({ status, views, ...rest }) => {
      void status;
      void views;
      return rest as unknown as PublicProject;
    });
  return {
    about,
    projects,
    experience: SEED.experience,
    skills: SEED.skills,
    settings: {
      siteTitle: settings.siteTitle,
      tagline: settings.tagline,
      accent: settings.accent,
      defaultTheme: settings.defaultTheme,
      seoDescription: settings.seoDescription,
      toggles: settings.toggles,
    },
    contact: { email: about.email, phone: about.phone, socials: about.socials },
  };
}

// Request-cached portfolio for server components. Resilient: if the DB is down or
// MONGODB_URI is unset (e.g. at build time on a fresh deploy) it serves the seed
// instead of throwing, so the page renders either way. Memoized per-request via
// React.cache so multiple components share a single DB round-trip.
export const getPortfolioCached = cache(async (): Promise<Portfolio> => {
  try {
    return await getPortfolio();
  } catch (err) {
    console.error(
      "[portfolio] DB unavailable — serving seed content:",
      err instanceof Error ? err.message : err
    );
    return seedPortfolio();
  }
});
