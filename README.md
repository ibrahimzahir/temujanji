# Temu Janji

Tier: T2 — customer-facing invitation studio with account, event, and guest data.

## Local development

Use Node 24, Corepack, and a local PostgreSQL database dedicated to this app.

1. Copy `.env.example` to `.env`. Set `DATABASE_URL` and generate `BETTER_AUTH_SECRET` with `openssl rand -hex 32`.
2. Run `corepack pnpm install --frozen-lockfile`.
3. Run `corepack pnpm exec prisma migrate deploy`.
4. Run `corepack pnpm dev --port 3100` and visit `http://127.0.0.1:3100`.
5. Create a separate account for the studio. Using a trusted PostgreSQL admin session, grant that known account access with a bound parameter or a verified account ID. For example in psql, set `studio_id` to the verified account ID and run `UPDATE "User" SET studio = true WHERE id = :'studio_id';`. Visit `/studio`.

The checkout saves a pending order. The studio can publish a test invitation from that order and the customer can issue unique links from `/ruang`. Copy each link when issued. Only its hash is stored. Anyone holding the link can RSVP as that guest.

## Design and implementation

Next.js App Router and TypeScript serve the catalog and invitation pages. The interface uses the official shadcn Radix button with studio styling, locally served fonts, photo-led cards, and reduced-motion-aware Motion transitions. The bundled photos are from Unsplash and are shared among the first eight designs.

Better Auth stores sessions and throttling in PostgreSQL. Prisma handles data access, Zod validates form data, and the access layer enforces customer ownership and database-managed studio access (OWASP ASVS access control and validation). The guest response write has a database-enforced cooldown. The local Postgres instance uses a private Unix socket.

## Deployment status

The included Caddy file is a starting point for Cloudflare Tunnel on a Hostinger VPS. Set the origin to the Caddy listener and keep both listeners private. Configure Cloudflare TLS, WAF/rate-limit rules and cache bypass for account, order, studio, invitation, and auth routes. Ensure Caddy receives trusted Cloudflare IP headers only. Keep guest-token paths out of access logs.

Before launch, add verified email and password recovery, production CSP, moderation and retention controls, secret scanning, dependency audit gates, and a tested database restore. Configure Cloudflare R2 when studio uploads are introduced. Connect a merchant provider only after credentials are available, verify signed webhooks, and make studio publication depend on verified payment. GitHub verification is defined locally. Hosting and merchant services require configuration.
