# Hostinger VPS + Cloudflare + Caddy + Resend + GitHub Actions Setup

## 1. Hostinger VPS Provisioning (Ubuntu 24.04 LTS)
1. Install Node.js 24 LTS, pnpm (`corepack enable`), PostgreSQL 16, Caddy, and `cloudflared`.
2. Clone the repository into `/var/www/temujanji` and copy `.env.example` to `.env` with production values:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET` (`openssl rand -base64 32`)
   - `BETTER_AUTH_URL=https://temujanji.id`
   - `NEXT_PUBLIC_SITE_URL=https://temujanji.id`
   - `RESEND_API_KEY` & `RESEND_FROM_EMAIL`
3. Install systemd unit & Caddy config:
   ```bash
   sudo cp deploy/temujanji.service /etc/systemd/system/temujanji.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now temujanji
   sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
   sudo systemctl reload caddy
   ```

## 2. Cloudflare Tunnel & DNS
1. Point Cloudflare Tunnel (`cloudflared`) ingress for `temujanji.id` and `www.temujanji.id` to `http://127.0.0.1:8080` (Caddy).
2. Enable Cloudflare SSL/TLS (`Full (Strict)`), Bot Fight Mode, and Always Use HTTPS.

## 3. Resend (2FA OTP Delivery)
1. Verify domain `temujanji.id` in Resend (SPF, DKIM, DMARC DNS records in Cloudflare).
2. Add `RESEND_API_KEY` to `.env` on the VPS.

## 4. GitHub Actions CI/CD Secrets
In `ibrahimzahir/temujanji` -> Settings -> Secrets and variables -> Actions:
- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_PORT` (default `22`)

## 5. Pinterest Scheduler Cron on VPS
```bash
(crontab -l 2>/dev/null; echo "*/15 * * * * curl -sf -X POST http://127.0.0.1:3100/api/cron/pinterest >/dev/null") | crontab -
```
