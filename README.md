# Ronish Prajapati — Portfolio (Next.js + Prisma)

A fully dynamic developer portfolio with a database-backed admin CMS, designed as
**"The Summit: A Developer's Journey"**: a layered mountain landscape at first light, a route
that climbs through projects and experience, and the same mountain after sunrise at the
contact section. Every section is still managed from the admin panel without touching code.

## Tech Stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | Next.js 15 (App Router, React Server Components)  |
| Language       | TypeScript                                        |
| Styling        | Tailwind CSS (public "Summit" tokens) + shadcn/ui (admin) |
| Motion         | Motion (`motion/react`) for parallax and scroll-linked effects; CSS for the intro and reveals |
| Landscape      | Original three.js scene, rendered offline into image layers (no runtime WebGL) |
| Database       | PostgreSQL — **Neon** (free tier)                 |
| ORM            | Prisma                                            |
| Auth           | NextAuth v5 (Auth.js) — Credentials + bcrypt      |
| Images/Files   | **Cloudinary** (free tier)                        |
| Validation     | Zod (shared client + server)                      |
| Deployment     | Vercel                                            |

## Features

- **Public site** (server-rendered, statically generated + ISR): a layered landscape hero,
  Trailhead (introduction), Expeditions (projects), The climb (experience + education),
  Beyond the screen (about + gallery), Technical terrain (stack), Testimonials and the Summit
  (contact), plus `/projects/[slug]`, `/experience/[id]`, `/blog` and `/blog/[slug]`.
  Section anchors (`#projects`, `#experience`, `#education`, `#about`, `#contact`, ...) are stable.
- **Admin panel** at `/admin`: secure login, dashboard, full CRUD for Projects, Skills,
  Experience, Education, Blogs, Testimonials, an About/Profile editor, image uploads to
  Cloudinary, and a contact-message inbox.
- **Contact form** with Zod validation, honeypot + IP rate-limiting spam protection, stored in
  the database.
- **SEO**: dynamic metadata, generated OpenGraph image, `sitemap.xml`, `robots.txt`, and
  `Person` + `BlogPosting` JSON-LD.

---

## Design system and landscape

- **Tokens** live in `src/app/globals.css` ("The Summit" block) and `tailwind.config.ts`
  (`forest`, `sage`, `fog`, `snow`, `ember`, `font-display` / `font-body` / `font-label`).
  They are scoped to public pages (`main.summit`), so the admin panel keeps its own look.
- **Hero**: `src/components/landscape/HeroLandscape.tsx` composites five transparent depth
  layers (`public/landscape/hero-*.webp`) with pointer and scroll parallax. The intro (cloud
  veil, name rising behind the summit, route drawing) runs in CSS, waits for the layers to
  load, plays once per session and is skipped entirely under `prefers-reduced-motion`.
- **Generator**: `scripts/landscape/` builds the mountain scene in three.js (procedural
  terrain, pines, fog, dawn and sunrise lighting) and renders it offline with headless
  Chrome/Edge. Re-render after changing the scene:
  ```bash
  npm run landscape:render                      # hero layers, summit view, route + topo data
  npm run landscape:render -- --preview <dir>   # quick composite preview
  npm run landscape:render -- --summit          # only the sunrise "summit" view
  ```
  It writes `public/landscape/*` and `src/components/landscape/*.json` (route coordinates for
  the overlays). Requires a local Chrome or Edge install.
- **Content fallback**: if the database cannot be reached (local development without
  credentials, or an outage) public pages render `src/lib/content-snapshot.ts`, a snapshot of
  the published content, instead of empty sections. A reachable database always wins.

---

## Database Schema (Prisma models)

`Profile` (singleton — Hero/About/Footer), `Project`, `Skill`, `Experience`, `Education`,
`Blog`, `Testimonial`, `ContactMessage`, `AdminUser`. See [`prisma/schema.prisma`](prisma/schema.prisma)
for the full definition. Images are stored as **Cloudinary URL strings** — never as binary.

`Project.role` (optional) is a one-line summary of your contribution, shown on the homepage
and the case study page. Its migration (`20261017120000_add_project_role`) only adds a nullable
column and is applied automatically by `prisma migrate deploy` on the next Vercel build. Fill it
in from **Admin → Projects → My Role**.

---

## Local Setup

### 1. Prerequisites
- Node.js 18.18+ (20+ recommended)
- A free **Neon** Postgres database — https://neon.tech
- A free **Cloudinary** account — https://cloudinary.com

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Fill in `.env`:
- `DATABASE_URL` / `DIRECT_URL` — from the Neon dashboard (pooled + direct connection strings).
- `AUTH_SECRET` — generate with `openssl rand -base64 32`.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` — the first admin account (created by the seed).
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` and
  `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — from the Cloudinary dashboard.
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` locally; your domain in production.

### 4. Create the database schema + seed content
```bash
npx prisma migrate dev --name init   # creates tables
npm run db:seed                       # seeds current portfolio content + admin user
```

### 5. Run
```bash
npm run dev
```
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

---

## Environment Variables

| Variable                            | Required | Purpose                                 |
| ----------------------------------- | -------- | --------------------------------------- |
| `DATABASE_URL`                      | yes      | Pooled Postgres connection (runtime)    |
| `DIRECT_URL`                        | yes      | Direct Postgres connection (migrations) |
| `AUTH_SECRET`                       | yes      | NextAuth session encryption secret      |
| `NEXTAUTH_URL`                      | prod     | Deployed site URL                       |
| `ADMIN_EMAIL`                       | seed     | First admin login email                 |
| `ADMIN_PASSWORD`                    | seed     | First admin login password              |
| `ADMIN_NAME`                        | seed     | Admin display name                      |
| `CLOUDINARY_CLOUD_NAME`             | uploads  | Cloudinary cloud name                   |
| `CLOUDINARY_API_KEY`                | uploads  | Cloudinary API key                      |
| `CLOUDINARY_API_SECRET`             | uploads  | Cloudinary API secret                   |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | uploads  | Public cloud name                       |
| `NEXT_PUBLIC_SITE_URL`              | yes      | Canonical URL for SEO/sitemap/OG        |
| `CONTACT_NOTIFY_EMAIL`              | optional | Where to surface contact notifications  |

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Neon, create a project and copy the **pooled** and **direct** connection strings.
3. In Vercel: **New Project → import the repo.**
4. Add all environment variables (from the table above) in **Project Settings → Environment
   Variables**. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to your production domain.
5. The build command is already wired via `vercel-build`:
   ```
   prisma generate && prisma migrate deploy && next build
   ```
   This applies migrations automatically on deploy.
6. After the first deploy, seed the database once (locally, pointing `DATABASE_URL` at Neon, or
   via the Neon SQL editor):
   ```bash
   npm run db:seed
   ```
7. Visit `https://your-domain/admin` and log in.

---

## Useful Scripts

| Script                | Action                                       |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start dev server                             |
| `npm run build`       | Production build                             |
| `npm run db:migrate`  | Create/apply a dev migration                 |
| `npm run db:deploy`   | Apply migrations (production)                |
| `npm run db:seed`     | Seed database with portfolio content + admin |
| `npm run db:studio`   | Open Prisma Studio                           |
| `npm run landscape:render` | Re-render the landscape layers and data |

---

## Project Structure

```
prisma/                schema.prisma + seed.ts
src/
  app/                 App Router pages, API routes, admin, sitemap/robots/og
  actions/             server actions (auth, resource CRUD, profile, messages)
  components/
    sections/          public site sections (Hero, Trailhead, Projects, …, Contact, Footer)
    landscape/         hero and summit landscape components + generated route data
    summit/            design-system pieces (reveals, parallax frame, climb route, form, rail)
    admin/             admin shell, forms, table, image upload
    ui/                shadcn/ui primitives
  lib/                 prisma, auth, cloudinary, queries, validations, resources
public/images/         seeded section images
public/landscape/      rendered landscape layers, summit view, topo map, mist
scripts/landscape/     three.js landscape generator (offline)
```
