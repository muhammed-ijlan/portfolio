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

export type PublicProject = Omit<ProjectType, "status" | "views">;
export type PublicExperience = ExperienceType;
export type PublicSkill = SkillType;
export type PublicAbout = AboutType;
export type PublicSettings = Omit<
  SettingsType,
  "notifyEmail" | "searchConsoleSite" | "ga4PropertyId"
>;

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
    resumeUrl: src.resumeUrl ?? "",
    ga4MeasurementId: src.ga4MeasurementId ?? "",
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
      resumeUrl: settings.resumeUrl ?? "",
      ga4MeasurementId: settings.ga4MeasurementId ?? "",
      toggles: settings.toggles,
    },
    contact: { email: about.email, phone: about.phone, socials: about.socials },
  };
}

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
