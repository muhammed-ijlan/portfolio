// Server-safe CMS types + seed data. Shared by the client store (cms-store.ts)
// and the backend (API route handlers, seed endpoint). No React / no "use client"
// here so it can be imported from server route handlers safely.

/* ---------- Types ---------- */
export type Project = {
  id: string;
  title: string;
  kind: string;
  desc: string;
  tags: string[];
  featured: boolean;
  live: string;
  repo: string;
  image: string;
  status: "published" | "draft";
  views: number;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  place: string;
  period: string;
  tags: string[];
  points: string[];
};

export type Skill = { id: string; title: string; items: string[]; accent: boolean };

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  date: string;
  starred: boolean;
};

export type Stat = { value: string; label: string; sub: string };

export type About = {
  name: string;
  headline: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  bio: string;
  chips: string[];
  stats: Stat[];
  socials: { github: string; linkedin: string; email: string };
};

export type Media = { id: string; name: string; kind: string; color?: string; src?: string };

export type Settings = {
  siteTitle: string;
  tagline: string;
  accent: string;
  defaultTheme: "dark" | "light";
  seoDescription: string;
  toggles: { animations: boolean; customCursor: boolean; maintenance: boolean; showResume: boolean };
};

export type CmsData = {
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  messages: Message[];
  about: About;
  media: Media[];
  settings: Settings;
};

/* ---------- Seed data (mirrors the real portfolio) ---------- */
export const SEED: CmsData = {
  projects: [
    { id: "p1", title: "Multi-Chain Crypto Wallet", kind: "Web3 · Chrome MV3", desc: "Non-custodial Ethereum & Tron wallet as a Manifest V3 extension — WASM crypto SDK, biometric auth, on-device signing.", tags: ["React", "TypeScript", "WebAssembly", "WebAuthn", "Vite"], featured: true, live: "https://example.com", repo: "https://github.com/muhammed-ijlan", image: "", status: "published", views: 3820 },
    { id: "p2", title: "Stack Ed — LMS", kind: "Full Stack", desc: "Learning Management System with course delivery, role-based access and analytics for thousands of learners.", tags: ["Next.js", "Node.js", "MongoDB", "SSR"], featured: false, live: "https://example.com", repo: "https://github.com/muhammed-ijlan", image: "", status: "published", views: 2140 },
    { id: "p3", title: "Lambda Gaming — E-commerce", kind: "Full Stack", desc: "High-performance gaming storefront with cart, payments and SEO-optimized product pages.", tags: ["React", "Express", "PostgreSQL", "Stripe"], featured: false, live: "https://example.com", repo: "https://github.com/muhammed-ijlan", image: "", status: "published", views: 1760 },
    { id: "p4", title: "Admin Analytics Platform", kind: "Dashboard", desc: "Wallet & transaction dashboards with 2FA, gas-fee controls, infinite scroll and asset-distribution analytics.", tags: ["React", "Charts", "2FA", "GraphQL"], featured: false, live: "", repo: "https://github.com/muhammed-ijlan", image: "", status: "draft", views: 980 },
  ],
  experience: [
    { id: "e1", role: "Senior Web Developer", company: "Token 13 Software LLC", place: "Dubai, UAE", period: "2025 — 2026", tags: ["React", "TypeScript", "Vite", "WebAssembly", "WebAuthn", "MV3"], points: [
      "Built a non-custodial multi-chain crypto wallet (Ethereum & Tron) as a Manifest V3 Chrome extension within a Turbo/pnpm monorepo.",
      "Integrated a WebAssembly cryptography SDK — BIP39, HD key derivation, AES-GCM encryption and on-device transaction signing.",
      "Implemented WebAuthn biometric auth with a service-worker security model, session auto-lock and a Protection Encryption Key.",
      "Built an admin platform: wallet/transaction dashboards, 2FA, Tron gas-fee controls and asset-distribution analytics.",
    ] },
    { id: "e2", role: "Senior Software Developer", company: "Stackroots Technology Solutions", place: "Calicut, India", period: "2022 — 2025", tags: ["React", "Next.js", "Node.js", "SSR", "SEO", "Mentoring"], points: [
      "Architected scalable full-stack apps serving thousands of users with high reliability.",
      "Cut API response times by up to 30% and raised maintainability ~25% with reusable component systems.",
      "Built SEO-optimized, high-performance SSR apps, delivering production features ahead of deadlines.",
      "Mentored junior developers through code reviews, best practices and performance-optimization techniques.",
    ] },
  ],
  skills: [
    { id: "s1", title: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "SQL"], accent: false },
    { id: "s2", title: "Frontend", items: ["React", "Next.js (SSR/SSG)", "Redux", "React Query", "Tailwind", "Material UI", "Vite"], accent: false },
    { id: "s3", title: "Web3", items: ["Ethereum", "WebAssembly", "WebAuthn", "MV3 Extensions"], accent: true },
    { id: "s4", title: "Backend", items: ["Node.js", "Express", "REST", "GraphQL", "JWT & 2FA", "Clean Architecture"], accent: false },
    { id: "s5", title: "Databases", items: ["MongoDB", "MySQL", "PostgreSQL", "Firebase"], accent: false },
    { id: "s6", title: "Cloud / DevOps", items: ["AWS (EC2, S3)", "Docker", "CI/CD", "Nginx", "Turbo / pnpm"], accent: false },
  ],
  messages: [
    { id: "m1", name: "Sarah Mitchell", email: "sarah@acmecorp.com", subject: "Senior Frontend role at Acme", message: "Hi Muhammed, we came across your portfolio and your Web3 wallet project really stood out. We're hiring a senior frontend engineer for our DeFi platform in Dubai. Would you be open to a chat this week?", status: "new", date: "2026-06-09T09:24:00", starred: true },
    { id: "m2", name: "Raj Patel", email: "raj.patel@fintechlabs.io", subject: "Contract: React + WebAuthn", message: "We need help shipping a WebAuthn biometric flow in a Chrome extension. Saw you did exactly this at Token 13. 6-week contract, remote. Interested?", status: "new", date: "2026-06-08T16:40:00", starred: false },
    { id: "m3", name: "Elena Rodriguez", email: "elena@designstudio.co", subject: "Collaboration opportunity", message: "Loved the Lambda Gaming storefront. We build e-commerce for gaming brands and would love to collaborate on an upcoming project. Let me know if you have bandwidth.", status: "read", date: "2026-06-07T11:15:00", starred: false },
    { id: "m4", name: "David Kim", email: "dkim@startupx.com", subject: "Full-stack advisory", message: "Early-stage startup, need an advisor for our architecture. Equity + retainer. Your LMS experience is a great fit.", status: "replied", date: "2026-06-05T14:02:00", starred: false },
    { id: "m5", name: "Aisha Khan", email: "aisha@recruithub.ae", subject: "Multiple Dubai opportunities", message: "I represent several Dubai-based companies looking for senior React/Web3 developers. Salary range AED 28-38k/month. Can I send you a few JDs?", status: "read", date: "2026-06-04T08:30:00", starred: true },
    { id: "m6", name: "Tom Becker", email: "tom@web3ventures.xyz", subject: "Smart contract integration", message: "Need someone to integrate Ethereum + Tron transaction signing into our React app. Your wallet project is exactly the expertise we need.", status: "replied", date: "2026-06-02T19:48:00", starred: false },
  ],
  about: {
    name: "Muhammed Ijlan",
    headline: "I build scalable, secure web & Web3 products.",
    role: "Senior Web Developer — Full Stack & Web3",
    location: "Dubai, UAE",
    email: "ijlan.dev@gmail.com",
    phone: "+971 56 766 9737",
    bio: "Senior Full Stack & Web3 Developer with 4+ years building scalable, secure web apps in React, Next.js, TypeScript, Node.js, Express and SQL/NoSQL. Recently shipped a non-custodial multi-chain crypto wallet (Ethereum & Tron) as a Chrome MV3 extension — with biometric authentication and on-device transaction signing.",
    chips: ["Scalable architecture", "Secure APIs", "Blockchain / Web3", "Cloud-ready", "Performance"],
    stats: [
      { value: "4+", label: "Years experience", sub: "production systems" },
      { value: "20+", label: "Projects shipped", sub: "web & web3" },
      { value: "30%", label: "Faster APIs", sub: "perf optimization" },
    ],
    socials: { github: "https://github.com/muhammed-ijlan", linkedin: "https://linkedin.com/in/ijlan", email: "ijlan.dev@gmail.com" },
  },
  media: [
    { id: "md1", name: "wallet-hero.png", kind: "cover", color: "linear-gradient(135deg,#22D3EE,#7C3AED)" },
    { id: "md2", name: "lms-dashboard.png", kind: "screenshot", color: "linear-gradient(135deg,#3b82f6,#22D3EE)" },
    { id: "md3", name: "gaming-store.png", kind: "screenshot", color: "linear-gradient(135deg,#7C3AED,#ec4899)" },
    { id: "md4", name: "analytics-panel.png", kind: "screenshot", color: "linear-gradient(135deg,#34d399,#22D3EE)" },
    { id: "md5", name: "profile-photo.jpg", kind: "avatar", color: "linear-gradient(135deg,#f59e0b,#ef4444)" },
    { id: "md6", name: "og-banner.png", kind: "social", color: "linear-gradient(135deg,#6366f1,#7C3AED)" },
  ],
  settings: {
    siteTitle: "Muhammed Ijlan — Senior Web Developer",
    tagline: "Full Stack & Web3 Developer",
    accent: "#22D3EE",
    defaultTheme: "dark",
    seoDescription: "Senior Web Developer (Full Stack & Web3) in Dubai. 4+ years building production-grade, high-performance web & Web3 applications.",
    toggles: { animations: true, customCursor: true, maintenance: false, showResume: true },
  },
};
