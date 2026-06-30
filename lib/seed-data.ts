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
  resumeUrl: string;
  notifyEmail: string;
  searchConsoleSite: string;
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

export const SEED: CmsData = {
  projects: [
    { id: "p1", title: "Multi-Chain Crypto Wallet", kind: "Web3 · Chrome MV3", desc: "Non-custodial Ethereum & Tron wallet as a Manifest V3 extension — WASM crypto SDK, biometric auth, on-device signing.", tags: ["React", "TypeScript", "WebAssembly", "WebAuthn", "Vite"], featured: true, live: "https://example.com", repo: "https://github.com/muhammed-ijlan", image: "", status: "published", views: 0 },
    { id: "p2", title: "Stack Ed — LMS", kind: "Full Stack", desc: "Learning Management System with course delivery, role-based access and analytics for thousands of learners.", tags: ["Next.js", "Node.js", "MongoDB", "SSR"], featured: false, live: "https://example.com", repo: "https://github.com/muhammed-ijlan", image: "", status: "published", views: 0 },
    { id: "p3", title: "Lambda Gaming — E-commerce", kind: "Full Stack", desc: "High-performance gaming storefront with cart, payments and SEO-optimized product pages.", tags: ["React", "Express", "PostgreSQL", "Stripe"], featured: false, live: "https://example.com", repo: "https://github.com/muhammed-ijlan", image: "", status: "published", views: 0 },
    { id: "p4", title: "Admin Analytics Platform", kind: "Dashboard", desc: "Wallet & transaction dashboards with 2FA, gas-fee controls, infinite scroll and asset-distribution analytics.", tags: ["React", "Charts", "2FA", "GraphQL"], featured: false, live: "", repo: "https://github.com/muhammed-ijlan", image: "", status: "draft", views: 0 },
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
  // Real visitor messages arrive through the public contact form (`/api/contact`).
  // Seeding starts empty so the admin never shows fabricated enquiries.
  messages: [],
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
  // Real assets are added via the Media Library upload (Cloudinary-backed).
  media: [],
  settings: {
    siteTitle: "Muhammed Ijlan — Senior Web Developer",
    tagline: "Full Stack & Web3 Developer",
    accent: "#22D3EE",
    defaultTheme: "dark",
    seoDescription: "Senior Web Developer (Full Stack & Web3) in Dubai. 4+ years building production-grade, high-performance web & Web3 applications.",
    resumeUrl: "",
    notifyEmail: "ijlan.dev@gmail.com",
    searchConsoleSite: "sc-domain:ijlan.dev",
    toggles: { animations: true, customCursor: false, maintenance: false, showResume: true },
  },
};
