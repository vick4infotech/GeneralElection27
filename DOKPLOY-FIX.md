# Dokploy: General Election 2027 build fix and setup

## Root cause in the supplied failure log

The Nixpacks build finishes `npm install`, compiles Next.js, and fails specifically while prerendering `/opengraph-image`:
`Expected <div> to have explicit display: flex or display: none`.

The problematic Satori / ImageResponse JSX was removed and replaced by a fully static
`app/opengraph-image.png` (1200x630). `app/layout.js` references `/opengraph-image.png`.
This avoids Satori prerendering entirely and addresses the logged failure.

## How to actually deploy this fix

1. **Back up your PostgreSQL database** before upgrading. The current app's `ensure()`
   removes the older anonymous-poll table when it initializes. Do not deploy until
   this deletion is understood and approved.
2. **Replace the files in your GitHub repository** `vick4infotech/GeneralElection27` with
   the contents of the extracted `general-election-2027/` source directory. The
   existing Dokploy logs show a *GitHub clone*, so uploading a ZIP only in ChatGPT
   will not change what Dokploy builds. Commit and push your changes.
3. In Dokploy, open the application and select **Build Type = Dockerfile** where available
   (rather than Nixpacks). Use file path `Dockerfile`; application port **3000**.
4. Open **Environment** in Dokploy and paste the exact values from the *separate private*
   `.env` file supplied with this update. NEVER commit `.env` or publish it in GitHub.
5. Set `SMTP_FROM` to an **approved/verified sender in Brevo**. The supplied Gmail
   address is only a default; it may fail until explicitly verified.
6. Confirm the app's Docker network can resolve `data-genel-duok18` and connect to port
   5432. An internal Dokploy hostname will not work from arbitrary computers or networks.
7. Redeploy and inspect the **last lines** of the build output and the container logs.
8. Test the website and `/games` without login; then test the poll using an email OTP.
   Check one verified email creates at most one response.

## Optional: Nixpacks

Nixpacks should also avoid the original Open Graph error because the code is removed;
Dockerfile is recommended because this repository includes a Node 22 container recipe.

## Secrets and authentication

- Brevo `xsmtpsib-...` values are **SMTP credentials**, used in `SMTP_PASS`, *not* as a
  Brevo REST API Bearer key.
- Use Brevo STARTTLS relay on port `587`. Outbound TCP 587 must be available.
- OTP sending requires a verified Brevo sender and active SMTP account.
- Changing `POLL_HASH_SECRET` after real verified votes have been counted changes
  the identity hashes for returning email addresses; keep it stable.
- This project's games are open to guests; the poll requires email OTP.
- Keep the two private environment artifacts separate from the public source ZIP.
- The database password and SMTP key were previously shared. Rotate both after
  recovering deployment, and update only Dokploy's private environment variables.

## Verification performed for this package

- Confirmed the old Next.js/Satori `app/opengraph-image.js` is absent.
- Confirmed `app/opengraph-image.png` exists and measures 1200 x 630 pixels.
- Confirmed Open Graph metadata points to `/opengraph-image.png`.
- Confirmed local source package does not contain live secrets.
- Full Next.js build / outbound SMTP / PostgreSQL end-to-end test unavailable here
  because npm dependency installation could not complete in this environment.
