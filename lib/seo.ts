import type { Portfolio } from "./portfolio-service";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function buildKeywords(p: Portfolio): string[] {
  const base = [
    "Ijlan",
    "Muhammed Ijlan",
    "Senior Web Developer",
    "Full Stack Developer",
    "Web3 Developer",
    "Blockchain Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "Frontend Developer",
    "Software Engineer",
    "Web Developer Dubai",
    "Hire React Developer",
    "Portfolio",
  ];
  const fromCms = [
    p.about.role,
    p.about.location,
    ...p.about.chips,
    ...p.skills.flatMap((s) => s.items),
  ];
  return Array.from(new Set([...base, ...fromCms].map((k) => k.trim()).filter(Boolean)));
}

export function buildJsonLd(p: Portfolio) {
  const { about, settings, skills, projects, experience } = p;
  const sameAs = [about.socials.github, about.socials.linkedin].filter(Boolean);
  const current = experience[0];

  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: about.name,
    jobTitle: about.role,
    description: about.bio,
    email: `mailto:${about.email}`,
    ...(about.phone ? { telephone: about.phone } : {}),
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    address: { "@type": "PostalAddress", addressLocality: about.location },
    knowsAbout: skills.flatMap((s) => s.items),
    ...(sameAs.length ? { sameAs } : {}),
    ...(current ? { worksFor: { "@type": "Organization", name: current.company } } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: settings.siteTitle,
    description: settings.seoDescription,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#person` },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: settings.siteTitle,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    primaryImageOfPage: `${SITE_URL}/opengraph-image`,
  };

  const work = {
    "@type": "ItemList",
    name: "Selected work",
    itemListElement: projects.map((proj, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: proj.title,
        description: proj.desc,
        keywords: proj.tags.join(", "),
        ...(proj.live ? { url: proj.live } : {}),
        ...(proj.image ? { image: proj.image } : {}),
      },
    })),
  };

  return { "@context": "https://schema.org", "@graph": [person, website, profilePage, work] };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
