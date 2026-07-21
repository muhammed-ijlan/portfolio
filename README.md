# Muhammed Ijlan — Portfolio

A production portfolio for a Senior Web & Web3 Developer, with a self-hosted headless CMS, a contact form wired to email, and an analytics dashboard pulling live data from Google Analytics 4 and Search Console.

Built on **Next.js 16** (App Router) + **React 19** + **TypeScript**, backed by **MongoDB**.

---

## Features

- **Public site** — hero, about, experience, skills, projects, and contact sections rendered from CMS data (ISR, revalidated every 120s).
- **Admin CMS** (`/admin`) — manage every section, media, and site settings behind session-cookie auth. No third-party CMS.
- **Contact form** — submissions are stored in the DB and emailed to the owner via [Resend](https://resend.com); replies go straight back to the sender.
- **Analytics dashboard** — GA4 traffic + Search Console performance charts via the Google Data APIs (read-only service account).
- **Media** — image/asset uploads to [Cloudinary](https://cloudinary.com), with orphan cleanup on delete.
- **SEO** — metadata, JSON-LD structured data, `sitemap.ts`, `robots.ts`, web manifest, and a dynamic OG image.
- **Theming** — dark/light with a configurable accent color, optional animations and custom cursor, plus a maintenance mode.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router, RSC) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | Custom scrypt hashing + HMAC-signed session cookies |
| Email | Resend |
| Media | Cloudinary |
| Charts | Chart.js + react-chartjs-2 |
| Analytics | GA4 Data API + Search Console API (`google-auth-library`) |

## Getting started

### Prerequisites
- Node.js 18+ and npm
- A MongoDB database (Atlas or local)

### Install & run

```bash
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

## Environment variables

Create a `.env` file (it is gitignored). None of these are committed.

| Variable | Required | Purpose |
|----------|:--------:|---------|
| `MONGODB_URI` | ✅ | MongoDB connection string (include the DB name in the path). |
| `AUTH_SECRET` | ✅ | Long random string used to sign admin session cookies. |
| `ADMIN_EMAIL` | ✅ | Email for the default admin, created on first seed/login. |
| `ADMIN_PASSWORD` | ✅ | Password for that default admin (change it after first login). |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical site URL, used for SEO/OG metadata. |
| `SEED_SECRET` | ⛔️ prod | Gate for `POST /api/seed`. Leave **unset in production** to disable seeding. |
| `CLOUDINARY_URL` | optional | Enables media uploads. |
| `RESEND_API_KEY` | optional | Enables contact-form email notifications. |
| `RESEND_FROM` | optional | From-address; must be a Resend-verified domain. |
| `CONTACT_NOTIFY_EMAIL` | optional | Fallback recipient when the admin "notification email" is blank. |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | optional | Base64 (or raw JSON) service-account key for the analytics dashboard. |
| `GA4_PROPERTY_ID` | optional | Numeric GA4 property ID — dashboard traffic charts. |
| `GOOGLE_SEARCH_CONSOLE_SITE` | optional | Search Console property, e.g. `sc-domain:example.com` — dashboard search charts. |
| `GA4_MEASUREMENT_ID` | optional | `G-XXXXXXXXXX` tracking tag for the public site (production only). |
| `VERCEL_ANALYTICS_TOKEN` | optional | Vercel access token — reads Web Analytics into the admin dashboard. |
| `VERCEL_PROJECT_ID` | optional | Vercel project id for the Web Analytics query. |
| `VERCEL_TEAM_ID` | optional | Only for team-owned Vercel projects. |

> **Secrets:** generate strong values for `AUTH_SECRET` and `SEED_SECRET`, e.g. `openssl rand -base64 48`. Never reuse the dev placeholders in production.

## Seeding the database

The seed endpoint **wipes and recreates** content, about, and settings from [`lib/seed-data.ts`](lib/seed-data.ts), and creates the default admin if none exists:

```bash
curl -X POST http://localhost:3000/api/seed -H "x-seed-secret: $SEED_SECRET"
```

It returns `503` if `SEED_SECRET` is unset and `401` on a bad secret. Because it is destructive, keep `SEED_SECRET` unset in production.

## Project structure

```
app/            App Router — public pages, /admin panel, and /api routes
  api/          REST endpoints (portfolio data, auth, media, analytics, contact, seed)
components/     UI: sections/, layout/, ui/, and the admin/ CMS
lib/            DB, auth, models, email, Cloudinary, GA4 + Search Console, SEO helpers
types/          Shared types
```

## Analytics setup (optional)

The admin dashboard reads live data through a Google Cloud **service account**:

1. Create a service account and enable the **Google Analytics Data API** and **Search Console API**.
2. Add the service-account email as a **Viewer** on the GA4 property and a **user** in Search Console.
3. Put the service-account JSON key in `GOOGLE_SERVICE_ACCOUNT_KEY` (base64 recommended).
4. Set `GA4_PROPERTY_ID`, `GOOGLE_SEARCH_CONSOLE_SITE` and `GA4_MEASUREMENT_ID` in your environment.

These are deploy-time configuration rather than editable content, so they live in
env alongside the service-account key instead of in the CMS. Every analytics
surface degrades gracefully when they are unset. The public GA4 tracking tag
renders only in production, so local traffic never reaches analytics.

## Deployment

Deploy on any Node host ([Vercel](https://vercel.com/new) recommended). Set **all** the environment variables above in the host's dashboard — `.env` is not deployed. After the first deploy, log into `/admin` and change the default admin password.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
