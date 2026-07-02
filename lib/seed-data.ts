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

export type Hero = {
  roles: string[];
  availability: string;
  focus: string[];
  stack: string[];
  experience: string;
  openToWork: boolean;
};

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
  hero: Hero;
  socials: { github: string; linkedin: string; email: string };
};

export type Media = { id: string; name: string; kind: string; color?: string; src?: string };

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage: string;
  readTime: string;
  status: "published" | "draft";
  featured: boolean;
  date: string;
};

export type Settings = {
  siteTitle: string;
  tagline: string;
  accent: string;
  defaultTheme: "dark" | "light";
  seoDescription: string;
  resumeUrl: string;
  notifyEmail: string;
  searchConsoleSite: string;
  ga4PropertyId: string;
  ga4MeasurementId: string;
  toggles: { animations: boolean; customCursor: boolean; maintenance: boolean; showResume: boolean };
};

export type CmsData = {
  projects: Project[];
  experience: Experience[];
  skills: Skill[];
  messages: Message[];
  about: About;
  media: Media[];
  posts: BlogPost[];
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
    hero: {
      roles: ["Web Developer", "Web3 Engineer", "Full Stack Developer"],
      availability: "Available for senior roles",
      focus: ["Full Stack", "Web3"],
      stack: ["React", "Next.js", "Node"],
      experience: "4+ years",
      openToWork: true,
    },
    socials: { github: "https://github.com/muhammed-ijlan", linkedin: "https://linkedin.com/in/ijlan", email: "ijlan.dev@gmail.com" },
  },
  media: [],
  posts: [
    {
      id: "b1",
      title: "Signing Ethereum transactions on-device in a Chrome MV3 extension",
      slug: "on-device-signing-mv3",
      excerpt:
        "Private keys should never leave the device. Here's how I built transaction signing that runs entirely inside a Manifest V3 service worker — no server, no leaks.",
      content:
        "Non-custodial means the user holds the keys. In a browser extension that promise is only as strong as where the signing happens. If a private key ever touches a network request, it's game over.\n\n## The Manifest V3 constraint\n\nMV3 killed long-lived background pages. Everything now runs in an ephemeral service worker that Chrome can tear down at any moment. That's actually good for security — but it means secrets can't just sit in memory.\n\n- Keys are derived on demand from an encrypted vault\n- The vault is unlocked by a Protection Encryption Key, never persisted in plaintext\n- The worker auto-locks after inactivity\n\n## Signing flow\n\nWhen a dApp requests a signature, the request is routed to the worker, the vault is unlocked, the transaction is signed with a WASM crypto core, and the key material is zeroed immediately after.\n\n```ts\nconst signed = await wallet.signTransaction(tx);\nzeroize(privateKey); // wipe the buffer\nreturn signed.rawTransaction;\n```\n\n> The key exists for microseconds, in one worker, and never crosses a network boundary.\n\nThe result: an Ethereum and Tron wallet where signing is provably local. Users can verify it — the network tab never shows a key.",
      tags: ["Web3", "Security", "WebAssembly"],
      coverImage: "",
      readTime: "6 min",
      status: "published",
      featured: true,
      date: "2026-05-18T09:00:00.000Z",
    },
    {
      id: "b2",
      title: "WebAuthn biometric auth with a service-worker security model",
      slug: "webauthn-service-worker-security",
      excerpt:
        "Passwords are a liability for a crypto wallet. I replaced them with WebAuthn biometrics wired into an auto-locking session model.",
      content:
        "A wallet guarded by a password is a wallet guarded by a phishing page. WebAuthn moves the secret into the platform authenticator — Touch ID, Windows Hello, a security key — where it can't be typed into the wrong box.\n\n## Why WebAuthn fits a wallet\n\nThe credential is bound to the origin and lives in hardware. There's nothing to reuse, nothing to leak.\n\n1. Register the authenticator once, tied to the extension origin\n2. Gate every unlock behind a biometric assertion\n3. Derive the Protection Encryption Key only after a successful assertion\n\n## Auto-lock\n\nThe session is a short-lived grant. After inactivity the worker discards the key and the next action re-prompts the biometric.\n\n> Convenience and safety aren't opposites here — a fingerprint is faster than a password *and* harder to steal.\n\nThe whole flow lives in the service worker, so there's a single choke point for auth decisions.",
      tags: ["Web3", "Security", "WebAuthn"],
      coverImage: "",
      readTime: "5 min",
      status: "published",
      featured: false,
      date: "2026-04-02T09:00:00.000Z",
    },
    {
      id: "b3",
      title: "Cutting API response times by 30%",
      slug: "cutting-api-response-times",
      excerpt:
        "A story about profiling before optimizing — the wins came from query shape and caching, not from rewriting anything in a faster language.",
      content:
        "\"Make it faster\" is not a plan. The plan is: measure, find the p95, fix the biggest offender, repeat.\n\n## Where the time actually went\n\nProfiling showed most latency was database round-trips, not CPU. Two patterns dominated:\n\n- N+1 queries hiding behind ORM lazy-loading\n- Endpoints re-computing the same aggregate on every request\n\n## The fixes\n\n```js\n// before: one query per item\nfor (const o of orders) o.items = await Item.find({ orderId: o.id });\n// after: one query, grouped in memory\nconst items = await Item.find({ orderId: { $in: ids } });\n```\n\nAdding a short-lived cache on hot aggregates and collapsing N+1s into batched lookups took p95 down by roughly a third — with zero change to the framework.\n\n> The fastest code is the query you don't send.",
      tags: ["Backend", "Performance", "Node.js"],
      coverImage: "",
      readTime: "4 min",
      status: "published",
      featured: false,
      date: "2026-02-20T09:00:00.000Z",
    },
    {
      id: "b4",
      title: "SSR and SEO that actually rank in Next.js",
      slug: "ssr-seo-nextjs",
      excerpt:
        "Server rendering is table stakes; ranking is about metadata, structured data and shipping fast HTML. A field guide from real projects.",
      content:
        "Next.js gives you SSR for free, but a rendered page is not a ranking page. Search engines reward the details.\n\n## The checklist that moves the needle\n\n- Per-route `generateMetadata` with real titles and descriptions\n- Open Graph + Twitter cards so links look intentional\n- JSON-LD structured data for the entity type\n- A real `sitemap.ts` and `robots.ts`\n\n## Rendering strategy\n\nStatic where you can, incremental where content changes, dynamic only when you must. This portfolio revalidates every couple of minutes — fresh enough for a CMS, cheap enough to stay fast.\n\n```ts\nexport const revalidate = 120;\n```\n\n> Fast HTML is an SEO feature. Core Web Vitals are literally a ranking signal.\n\nDo the boring metadata work and the rankings follow.",
      tags: ["Next.js", "SEO", "React"],
      coverImage: "",
      readTime: "5 min",
      status: "published",
      featured: false,
      date: "2026-01-12T09:00:00.000Z",
    },
    {
      id: "b5",
      title: "Taming a Turbo + pnpm monorepo",
      slug: "turbo-pnpm-monorepo",
      excerpt:
        "One repo, several packages, shared config. How Turborepo and pnpm workspaces keep a wallet extension and its admin platform building in seconds.",
      content:
        "Shipping an extension, a shared crypto SDK and an admin dashboard from one repo only works if the tooling stays out of your way.\n\n## Workspaces\n\npnpm links local packages so the SDK is imported like any dependency but edited in place. No publishing, no version drift.\n\n```json\n{ \"packages\": [\"apps/*\", \"packages/*\"] }\n```\n\n## Caching the build graph\n\nTurborepo caches task outputs keyed by inputs. Change one package and only its dependents rebuild — everything else is a cache hit.\n\n- Shared ESLint/TS config as internal packages\n- `turbo run build` respects the dependency graph\n- CI restores the remote cache, so cold builds are rare\n\n> The monorepo isn't the hard part. Cache invalidation is — and Turbo makes it boring.",
      tags: ["DevOps", "Tooling", "Monorepo"],
      coverImage: "",
      readTime: "4 min",
      status: "published",
      featured: false,
      date: "2025-11-28T09:00:00.000Z",
    },
    {
      id: "b6",
      title: "BIP39, HD derivation and AES-GCM in WebAssembly",
      slug: "wasm-crypto-bip39",
      excerpt:
        "The cryptography under a non-custodial wallet — mnemonic seeds, hierarchical keys and authenticated encryption — compiled to WASM for speed and safety.",
      content:
        "A wallet is, underneath, a small pile of well-specified cryptography. Getting it exactly right matters more than anything else in the app.\n\n## From words to keys\n\nBIP39 turns entropy into a human-readable mnemonic; the seed derives a tree of keys via BIP32/BIP44.\n\n1. Generate entropy, encode as a 12/24-word mnemonic\n2. Derive the master seed, then per-chain accounts\n3. Never store the seed — re-derive on unlock\n\n## Why WebAssembly\n\nThe crypto core is compiled to WASM: constant-time primitives, no JS number quirks, and it runs fast enough to sign without a spinner.\n\n```ts\nconst seed = await bip39.mnemonicToSeed(mnemonic);\nconst account = hd.derivePath(\"m/44'/60'/0'/0/0\");\n```\n\nVault contents are sealed with AES-GCM, which gives confidentiality *and* integrity — a tampered vault fails to decrypt rather than silently returning garbage.\n\n> Roll your own protocol, never your own primitives. Use the standards, and test against their vectors.",
      tags: ["Web3", "WebAssembly", "Cryptography"],
      coverImage: "",
      readTime: "6 min",
      status: "published",
      featured: false,
      date: "2025-10-15T09:00:00.000Z",
    },
  ],
  settings: {
    siteTitle: "Muhammed Ijlan — Senior Web Developer",
    tagline: "Full Stack & Web3 Developer",
    accent: "#22D3EE",
    defaultTheme: "dark",
    seoDescription: "Senior Web Developer (Full Stack & Web3) in Dubai. 4+ years building production-grade, high-performance web & Web3 applications.",
    resumeUrl: "",
    notifyEmail: "ijlan.dev@gmail.com",
    searchConsoleSite: "sc-domain:ijlan.dev",
    ga4PropertyId: "",
    ga4MeasurementId: "",
    toggles: { animations: true, customCursor: false, maintenance: false, showResume: true },
  },
};
