import type {
  About,
  Experience,
  Media,
  Message,
  Project,
  Settings,
  Skill,
} from "./seed-data";
import type {
  Portfolio,
  PublicAbout,
  PublicExperience,
  PublicProject,
  PublicSettings,
  PublicSkill,
} from "./portfolio-service";
import type { SearchConsoleResult } from "./search-console";
import type { GA4Result } from "./ga4";

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

export type AdminUserPublic = {
  id: string;
  email: string;
  name: string;
  role: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    ...init,
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.ok) {
    throw new Error(json.ok ? `Request failed (${res.status})` : json.error);
  }
  return json.data;
}

function resource<T extends { id: string }>(name: string) {
  return {
    list: () => request<T[]>(`/${name}`),
    get: (id: string) => request<T>(`/${name}/${id}`),
    create: (body: Omit<T, "id">) =>
      request<T>(`/${name}`, { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<T>) =>
      request<T>(`/${name}/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (id: string) =>
      request<{ id: string }>(`/${name}/${id}`, { method: "DELETE" }),
  };
}

function singletonResource<T>(name: string) {
  return {
    get: () => request<T>(`/${name}`),
    update: (body: Partial<T>) =>
      request<T>(`/${name}`, { method: "PUT", body: JSON.stringify(body) }),
  };
}

type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
};

export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: AdminUserPublic }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request<{ loggedOut: boolean }>("/auth/logout", { method: "POST" }),
  me: () => request<{ user: AdminUserPublic }>("/auth/me"),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ changed: boolean }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  register: (input: { email: string; password: string; name?: string; role?: string }) =>
    request<{ user: AdminUserPublic }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};

export const api = {
  projects: resource<Project>("projects"),
  experience: resource<Experience>("experience"),
  skills: resource<Skill>("skills"),
  messages: resource<Message>("messages"),
  media: resource<Media>("media"),
  about: singletonResource<About>("about"),
  settings: singletonResource<Settings>("settings"),
  health: () => request<{ db: string; name: string }>("/health"),
  searchConsole: () => request<SearchConsoleResult>("/analytics/search-console"),
  ga4: () => request<GA4Result>("/analytics/ga4"),
};

export type UploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

async function uploadFile(file: File): Promise<UploadResult> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    credentials: "same-origin",
    body,
  });
  const json = (await res.json()) as ApiResponse<UploadResult>;
  if (!res.ok || !json.ok) {
    throw new Error(json.ok ? `Upload failed (${res.status})` : json.error);
  }
  return json.data;
}

export const uploadApi = {
  image: uploadFile,
  file: uploadFile,
};

export const portfolioApi = {
  all: () => request<Portfolio>("/portfolio"),
  projects: () => request<PublicProject[]>("/portfolio/projects"),
  experience: () => request<PublicExperience[]>("/portfolio/experience"),
  skills: () => request<PublicSkill[]>("/portfolio/skills"),
  about: () => request<PublicAbout>("/portfolio/about"),
  settings: () => request<PublicSettings>("/portfolio/settings"),
  contact: (input: ContactInput) =>
    request<{ delivered: boolean; id?: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
