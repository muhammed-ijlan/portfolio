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
    ...p.projects.flatMap((proj) => proj.tags),
  ];
  return Array.from(new Set([...base, ...fromCms].map((k) => k.trim()).filter(Boolean)));
}

export function buildJsonLd(p: Portfolio) {
  const { about, settings, skills, projects, experience } = p;
  const sameAs = [about.socials.github, about.socials.linkedin].filter(Boolean);
  const current = experience[0];

  const ogImage = {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#primaryimage`,
    url: `${SITE_URL}/opengraph-image`,
    width: 1200,
    height: 630,
    caption: `${about.name} — ${about.role}`,
  };

  const logo = {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: `${SITE_URL}/logo-mark.svg`,
    width: 128,
    height: 128,
    caption: "ijlan.dev",
  };

  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: about.name,
    alternateName: ["Ijlan", "ijlan.dev"],
    jobTitle: about.role,
    description: about.bio,
    email: `mailto:${about.email}`,
    ...(about.phone ? { telephone: about.phone } : {}),
    url: SITE_URL,
    image: { "@id": `${SITE_URL}/#primaryimage` },
    mainEntityOfPage: { "@id": `${SITE_URL}/#webpage` },
    address: { "@type": "PostalAddress", addressLocality: about.location },
    workLocation: { "@type": "Place", name: about.location },
    knowsAbout: skills.flatMap((s) => s.items),
    hasOccupation: {
      "@type": "Occupation",
      name: about.role,
      skills: skills.flatMap((s) => s.items).join(", "),
      occupationLocation: { "@type": "City", name: about.location },
    },
    ...(sameAs.length ? { sameAs } : {}),
    ...(current
      ? {
          worksFor: {
            "@type": "Organization",
            name: current.company,
            ...(current.place ? { location: current.place } : {}),
          },
        }
      : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    // Google's site name in search results comes from here — keep it short,
    // or it falls back to the bare domain.
    name: about.name,
    alternateName: [`${about.name} Portfolio`, "ijlan.dev"],
    description: settings.seoDescription,
    inLanguage: "en",
    image: { "@id": `${SITE_URL}/#logo` },
    publisher: { "@id": `${SITE_URL}/#person` },
    copyrightHolder: { "@id": `${SITE_URL}/#person` },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: settings.siteTitle,
    description: settings.seoDescription,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    mainEntity: { "@id": `${SITE_URL}/#person` },
    primaryImageOfPage: { "@id": `${SITE_URL}/#primaryimage` },
  };

  const work = {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#work`,
    name: "Selected work",
    numberOfItems: projects.length,
    itemListElement: projects.map((proj, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: proj.title,
        description: proj.desc,
        keywords: proj.tags.join(", "),
        author: { "@id": `${SITE_URL}/#person` },
        ...(proj.live ? { url: proj.live } : {}),
        ...(proj.image ? { image: proj.image } : {}),
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage, work, ogImage, logo],
  };
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
