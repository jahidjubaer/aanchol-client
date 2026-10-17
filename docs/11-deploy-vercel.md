# 11 — Live on Vercel

_Date: 2026-10-17_

**Shop:** https://aanchol-client.vercel.app · **Admin:** https://aanchol-client.vercel.app/admin

The server side is documented in `aanchol-server/docs/05-deploy-render.md`.

## What was done
- **Vercel project** `aanchol-client` (jahidjubaers-projects), connected to the GitHub repo. **Every push to `main` deploys automatically.**
- **`VITE_API_URL`** (Production) = `https://aanchol-api.onrender.com`. It's read when the site is built, so after changing it, redeploy (Vercel → Deployments → ⋯ → Redeploy).
- **`vercel.json`:**
  - **Page links:** every page address (e.g. `/products/…`, `/admin/orders/…`) serves the app. Opening a link directly or refreshing works, but a missing `/assets/…` file still returns 404.
  - **Caching:** files in `/assets/` are cached for a year. Their names change on every build, so new versions always load.
  - **Search engines:** `/admin` pages send `X-Robots-Tag: noindex`.
- **`public/robots.txt`:** search engines skip `/admin`, `/checkout` and `/order-confirmed`.

## Live checks (headless Chrome, 390px)
- Home, collection ("6 pieces"), product (live stock "Only 2 available") and the admin login all load from the live API ✅
- Opening `/our-story`, `/products/…` and `/admin/products` directly: 200 ✅ · a missing asset: 404 ✅
- The built site points to `https://aanchol-api.onrender.com` ✅

## Still to try by hand
- Log in at `/admin` with your admin email, then upload a photo to a product. This is the only part I couldn't test without your password.
- Place one real test order from your phone, then cancel it in the admin. Cancelling puts the stock back.

## Next
- **Own domain:** buy it, add it in Vercel → Settings → Domains, then add it to `CLIENT_ORIGIN` on Render.
