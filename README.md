> **Dokploy failure fix (27 October 2026):** See [DOKPLOY-FIX.md](DOKPLOY-FIX.md). Original `/opengraph-image` prerender failure was replaced by a static PNG. Real credentials are shipped only as a separate private `.env` file.

# Poll policy update — verified email only (27 October 2026)

- **Both game modes** are still available to guests without registration. Guest scores and progress are retained.
- **The election poll** cannot be submitted as a guest: a successful email OTP check is required before a response is recorded. No account creation or password is necessary.
- **Existing unverified guest poll records are removed from the database**: `ensure()` drops the old `community_poll_guest` table when the new application first connects. This permanently deletes those records; a standalone SQL migration is provided. Back up your database first.
- The browser's old `ge27_poll_guest` cookie is cleared the next time the visitor checks poll status; old anonymous vote routes are not available.
- Only `community_poll_email` (email OTP-confirmed) responses appear in the top-three poll results.

---

# GeneralElection2027.com — Brevo Email-Verified Poll Update (27 October 2026)

This release adds **email OTP confirmation for the community poll**, using Brevo SMTP relay. Both Oga President, Fix Naija! game modes remain free for guests without registration. Community polling requires only a valid email and six-digit verification code — **no full account or password**.

## What changed in this release

- `/api/poll/email/start`: rate-limited six-digit OTP emails, 10-minute expiry, 60-second resend cooldown, four code requests/email/hour, limits per IP.
- `/api/poll/email/confirm`: five wrong-code attempts per request series; database transaction confirms code and creates at most one poll response for a verified email.
- **One entry per email** enforced by PostgreSQL primary key on HMAC of normalized email. Changing browsers cannot generate a second entry using the same address. Multiple email addresses per person remain possible.
- `/api/poll` reads verified community results and lets the same email (via session cookie) withdraw a response. Withdrawing removes the public vote but does **not** permit a second response with the same email.
- Historical anonymous poll records are **permanently deleted** by `DROP TABLE IF EXISTS community_poll_guest` on database initialization. This does not affect game guests, game scores or saved progress. Verify this cleanup after deploying, and back up the database first. No unverified visitor poll responses are accepted or counted.
- `community_poll_email` stores **hashed email identifiers**, not plain-text email; the Brevo SMTP service receives the recipient email for delivery.
- Existing account/login/Facebook game saving flows are unchanged.

## Brevo SMTP deployment settings

In Brevo, authenticate your domain and create a **verified sender** (for instance `no-reply@generalelection2027.com` only if that sender is valid and verified in your account). Go to Brevo → Settings → SMTP & API → SMTP and obtain the **SMTP key**; it is not the REST API key. In **Dokploy → application → Environment**, enter the following variables:

```dotenv
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=YOUR_BREVO_SMTP_LOGIN
SMTP_PASS=PASTE_YOUR_NEW_SMTP_KEY_IN_DOKPLOY
SMTP_FROM="General Election 2027 <YOUR_VERIFIED_SENDER@YOUR_DOMAIN>"
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_DATABASE_HOST:5432/YOUR_DB
DATABASE_SSL=false
AUTH_SECRET=KEEP_YOUR_EXISTING_RANDOM_64_CHAR_SECRET
POLL_HASH_SECRET=KEEP_YOUR_EXISTING_RANDOM_64_CHAR_SECRET
```

**Do not use the SMTP login address as `SMTP_FROM`**. Use your Brevo-verified sender. Keep existing `AUTH_SECRET` and `POLL_HASH_SECRET` unchanged to preserve existing sessions and hashes. Never prefix these with `NEXT_PUBLIC_`.

**CRITICAL: The SMTP key was shared in a chat message. Revoke it in Brevo, generate a new SMTP key, and add the new value only in Dokploy.** The package does not contain that key. Also rotate any previously shared database password before the site is open to the public.

### Quick smoke test on the deployed site

1. Open `/games#community-poll` — game still loads without a login.
2. Choose a candidate, enter a reachable email, tick the two consent/age checkboxes and request a code.
3. Check inbox (and spam), then submit the six-digit OTP within 10 minutes.
4. Verify exactly **one** new poll response appears in the top-three totals.
5. Open an incognito browser, use the **same email** and verify a new OTP; the existing response should reappear, **without increasing total votes**.
6. Try an incorrect OTP five times, then request a new one after the resend cooldown.
7. Withdraw the existing response — the tally decreases; the same email cannot cast another response.
8. Play both simulation modes without logging in to confirm they remain available.

If SMTP returns `535`, check the Brevo **SMTP key** and user. If Brevo says sender invalid, set `SMTP_FROM` to a verified email in your Brevo account. If SMTP times out, check that Dokploy allows outbound TCP 587.

## Database migration

`lib/db.js` creates `poll_email_otps`, `community_poll_email` and `poll_email_sessions` when the site first connects. The legacy `community_poll_guest` table (including every unverified anonymous poll response) **is deleted**, while existing verified email poll and guest game tables are preserved. Back up the database before upgrading. The standalone migration is also included at `migrations/2026-10-27-delete-anonymous-poll.sql`. The schema cleanup is executed on the next database initialization after deployment. This source package intentionally excludes real credentials.

## Verification limits

Full Next.js build, live Brevo delivery and a real PostgreSQL deployment still require testing on your own environment. Neither one-email-one-response nor a cookie proves one-response-per-human. The poll must remain labelled as a self-selected website sample, not a national election prediction.

---

# GeneralElection2027.com — Hicroft edition (27 October 2026)

Next.js 15 site with an election information homepage, game, voluntary email-verified visitor poll, registered party directory, candidate directory, optional Facebook save, and advertising enquiries through Hicroft Technology.

## What changed

- **Hicroft logo** on a non-blocking first-visit welcome card, in the footer, and on `/advertise`.
- **Advertising and campaign enquiries:** `hicrofttechnology@gmail.com` via `mailto:` on the contact page (this does *not* secretly send email from the server).
- **Nigerian flag imagery** in the header, candidate and party placeholders, 2027 editorial sections and other national cues; Wikimedia coat of arms in footer when available.
- **Candidate portraits:** freely licensed remote Wikimedia sources for four candidate portraits, Nigeria-flag fallback for others. See `IMAGE-SOURCES.md` and `/credits` for links. The BBC Pidgin article is linked for reference; images from it were not copied without authorization.
- **SEO:** unique metadata, semantic headings, server-rendered text, JSON-LD, canonical URLs, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/voter-guide`, `/election-2027/timetable`, `/credits`, and internal links to Games, candidates and parties. See `SEO-CHECKLIST.md`.
- **Guest activities remain guest-friendly:** Story and weekly challenges require no account. Visitors may opt into the poll without registration; verified email accounts or optional Facebook connection are *not* required to play the games.
- Poll homepage and game page show **up to three candidates with real visitor responses**, including their photos and party marks where sourced. No invented results. Survey is opt-in and not representative of all Nigerian voters.

## Install and start locally

Install Node.js 20+ and, from this folder:

```bash
npm install
npm run dev
```

Go to `http://localhost:3000`. If an unrelated API is serving a JSON error `Cannot GET /`, ensure you are opening the **Next.js** port (`npm run dev -- -p 3001` to use 3001).

## PostgreSQL / environment

Create an `.env.local` file by copying `.env.example`, then configure your database and server-only secrets. **Private credentials have intentionally been excluded from this ZIP.** The supplied Dokploy-internal PostgreSQL host is only accessible from its connected Docker network; a regular Windows PC cannot resolve it without network access or port forwarding. Do not put passwords in `NEXT_PUBLIC_*` variables.

Relevant variables:

```dotenv
NEXT_PUBLIC_SITE_URL=https://generalelection2027.com
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/YOUR_DB
DATABASE_SSL=false
AUTH_SECRET=<strong-random-server-side-secret>
POLL_HASH_SECRET=<another-independent-secret>
# Only for optional Meta login:
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_REDIRECT_URI=https://generalelection2027.com/api/auth/facebook/callback
# SMTP is optional for the games, but required for email-verified polling:
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

Use `openssl rand -hex 32` twice for secrets. The earlier database password was shared in a conversation and a previous ZIP, so **rotate it before exposing the production site**. Existing database tables and responses remain intact when the connection uses the same database.

## Dokploy deployment

Deploy the `Dockerfile` with application/container port **3000**. Configure the environment variables on the Dokploy application, not inside the Docker image. The `.dockerignore` excludes `.env*` files, `.git` and build artifacts. The `/api` endpoints will not provide poll results until the app can reach PostgreSQL and the schema is created. Secure the deployment and review anti-bot protection for email OTP abuse before public launch.

## What is *not* verified

The Next.js production build, real PostgreSQL integration, SMTP delivery, Meta login and live browser workflow **could not be tested in this environment**. `npm install` failed with `EAI_AGAIN` because the npm registry was unreachable. JavaScript/JSX parsing and local import resolution were checked. Candidate and party images may be blocked or unavailable on remote hosts; fallback national flag artwork is built in. Google and AI search placement is never guaranteed.

## Source licensing and accuracy

Read `IMAGE-SOURCES.md`, `SEO-CHECKLIST.md`, and `/credits` before production. Party and candidate listings may change after publication; keep source dates, INEC links and correction practices current. Paid promotions must not alter editorial facts or the visitor poll tallies. A clear nonrepresentative visitor-poll label remains near results.

## Browser favicon and candidate pictures

The favicon references the Nigerian coat of arms image from Wikimedia Commons (Lumia1234, CC BY-SA 3.0); attribution appears on `/credits`. See `CANDIDATE-PHOTOS.md` to update any candidate portrait, or use `npm run photo:set`. The favicon is loaded from Wikimedia's image server; if you want it fully self-hosted, download the correctly licensed PNG to `/public/nigeria-coat-of-arms.png` and change `nigerianCoatIcon` in `app/layout.js` to that local path.
