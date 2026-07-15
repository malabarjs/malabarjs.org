# malabarjs.org

The website of [MalabarJS](https://malabarjs.org) - a community for JavaScript
developers in Kerala, India. Built with [Nuxt 4](https://nuxt.com) and
[Nuxt UI](https://ui.nuxt.com).

## Setup

```bash
pnpm install
cp .env.example .env

# Local Postgres for the form engine
docker compose up -d
pnpm db:migrate

pnpm dev
```

## Form engine

Forms (`/cfp`, `/volunteer`, `/sponsor`, `/contact`) are config-driven. Each
form is a `defineForm()` config in `shared/forms/` with its fields, steps, and
Zod schemas - shared by client and server validation. The engine
(`app/components/form/Engine.vue`) renders any config with multi-step
progress, inline validation, draft autosave, and a success screen.

Adding a new form:

1. Create `shared/forms/<slug>.ts` with `defineForm({ slug, title, steps, … })`.
2. Register it in `shared/forms/index.ts`.

That's it - the page (`/<slug>`), API endpoint (`POST /api/forms/<slug>`),
validation, and persistence all pick it up automatically.

Submissions are stored in Postgres (`form_submissions`, one JSONB row per
submission) via [Drizzle ORM](https://orm.drizzle.team). The connection is
provider-agnostic: any standard Postgres works via `DATABASE_URL` (Neon,
Railway, RDS, Docker, self-hosted…).

```bash
pnpm db:generate   # generate migrations after schema changes
pnpm db:migrate    # apply migrations
pnpm db:studio     # browse data
```

## Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string for form submissions and stats |
| `NUXT_FORMS_WEBHOOK_URL` | Optional Discord-compatible webhook pinged on new submissions |

The member count comes from the database (distinct emails across all form
submissions). Legacy members from the old Google Sheet can be imported once:

```bash
DATABASE_URL=postgres://… node scripts/import-members.mjs <csv-url-or-file>
```

## Scripts

```bash
pnpm dev         # start dev server
pnpm build       # production build
pnpm preview     # preview production build
pnpm lint        # eslint
pnpm typecheck   # vue-tsc
```
