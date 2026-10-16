# 08 — Products Loaded from the API

_Date: 2026-10-17_

## What was done
The shop no longer contains any product data. Every page now uses the products in MongoDB via `GET /api/products`, so the prices and stock shown always match the database (and the admin).

### Catalogue (`src/context/CatalogProvider.jsx`, hook `useCatalog()`)
- **Loaded once per visit and shared** by all pages: home, collections, product pages, cart and checkout. The catalogue is small, so filtering and sorting stay instant in the browser.
- **Browser copy (`localStorage`, key `aanchol-catalog-v1`):**
  - A returning visitor sees products immediately, while fresh prices and stock load in the background.
  - This matters on Render's free plan, where the server sleeps after 15 minutes idle and can take 30–60 seconds to wake.
  - Tested: with the server stopped, a returning visitor still saw all 6 pieces.
- **Refreshing:** when you return to the tab after more than a minute, the catalogue reloads, so stock stays current.
- **`status`:** `loading` (no copy yet), `ready` or `error`, plus `retry()`.

### Loading and error states (`src/components/ui/CatalogState.jsx`)
- **Skeleton cards** while loading on Home (The Jamdani Edit), on collections, and as a product page skeleton.
- **After 5 seconds of loading:** "Opening the shop… the first visit can take up to a minute."
- **On failure:** "We couldn't load our pieces just now" with **Try again**, which recovers without reloading the page (tested).
- The collection count ("6 pieces") is hidden until products have loaded.
- **Checkout** waits for the catalogue before deciding the bag is empty.

### Sold out (`stock: 0`)
- **Product card:** a dark "Sold out" label, and the image is slightly faded.
- **Product page:**
  - The button reads "Sold out" and is disabled, on the page and in the sticky bar.
  - The stock line reads "Sold out · message us on WhatsApp for a similar piece".
  - The WhatsApp button stays active.
- **Elsewhere:** sold-out pieces are left out of "New from the loom" (home) and "More from the loom" (related).
- **Cart:** a sold-out item drops out of the bag automatically.

### Moved and removed
- `src/data/products.js` was **deleted**. The sample products now live only in `server/src/seed/products.js`.
- `getSubtitle`, `isSoldOut` and `getFeatured` moved to `src/utils/product.js`.
- The shared Jamdani size and care details moved to `src/config/jamdani.js`.
- In `src/data/collections.js`, `items(products)` now receives the catalogue.

## Note for deployment
To avoid the slow first visit after the server sleeps, a free uptime monitor (e.g. UptimeRobot) can call `/api/health` every 10 minutes. This will be set up in the deploy step.

## Verification
- `npm run build` ✅ · `npm run lint` ✅
- **Headless Chrome at 390px**, against the local API:
  - Collection (6 pieces), product page and home featured load from the API ✅
  - After selling Rongdhonu (stock 0): "Sold out" on the card and the product page ✅
  - Server stopped, returning visitor: products shown from the browser copy ✅
  - Server stopped, first visit: error message with Try again, and Try again recovers once the server is back ✅
  - Full add-to-bag, checkout and order confirmation still work ✅
