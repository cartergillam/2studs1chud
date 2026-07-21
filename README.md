# 2 Studs 1 Chud

The official website of the Stud/Chud Selection Authority. Built with Next.js and deployed on Vercel.

## Local development

```bash
npm install
npm run dev
```

The site works without a database. When Redis is unavailable it automatically uses local, session-only Chud standings.

## Enable the global leaderboard

1. Open the project in Vercel.
2. Open the Vercel Marketplace.
3. Install an Upstash Redis integration for this project.
4. Confirm `KV_REST_API_URL` and `KV_REST_API_TOKEN` are attached to Production, Preview, and Development as appropriate.
5. Redeploy the project.
6. Optionally pull the variables locally with the Vercel CLI.
7. Never commit `.env.local` or real Redis credentials.

The Vercel Marketplace variables are preferred automatically. Standard `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` variables are also supported as a fallback for local or non-Marketplace setups.

Copy `.env.example` to `.env.local` only when configuring local Redis access, and configure one complete variable pair. Redis tokens are server-only and must never use a `NEXT_PUBLIC_` prefix.
