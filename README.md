# Aidia Hub

Share the ideas you never built, and find ones worth picking up. Live at https://aidiahub.com.

Next.js 14 (app router) on Vercel, Postgres, Auth0 for login, OpenAI for idea moderation, titles and tags.

## Local development

```bash
npm install
npm run dev
```

Configuration lives in `.env.local` (not committed):

| Variable | Purpose |
| --- | --- |
| `AUTH0_SECRET`, `AUTH0_BASE_URL`, `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET` | Auth0 login |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_DATABASE` | Database connection |
| `POSTGRES_SCHEMA` | `dev`, `staging` or `production` |
| `OPENAI_API_KEY` | Idea analysis |
| `OPENAI_MODEL` | Optional, defaults to `gpt-4o-mini` |
| `ADMIN_EMAILS` | Comma-separated emails allowed to open `/admin` |

## Migrations

```bash
just add-migration <name>   # create a new SQL migration
just migration-up           # apply migrations to the dev schema
```

`npm run build` applies migrations for `$ENV` before building, which is what Vercel runs.
