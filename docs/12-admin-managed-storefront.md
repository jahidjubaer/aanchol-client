# 12 — Admin-managed storefront: categories, hero slider, campaign popup, wishlist

_Date: 2026-10-17_ · Server side: `aanchol-server/docs/06-site-content-and-campaigns.md`

The shop now draws its menu, collections, hero, popup and home layout from `GET /api/site`, so the owner changes them in the admin with no code changes. New product lines (Muslin, Manipuri, Salwar Kameez, men's) are new **categories**.

## Site data
- `context/SiteProvider.jsx` loads `/api/site` and keeps the last copy in the browser (`aanchol-site-v1`), like the catalogue: repeat visits draw instantly, fresh content follows. It refreshes when the tab regains focus after a minute.
- `config/siteDefaults.js` is shown on a first visit until the server answers (the free server can take ~30 s to wake), and if it can't be reached. Keep it roughly in line with `server/src/seed/content.js`.
- `useSite()` gives `categories, slides, campaign, announcement, homeSections, status, fresh, refresh, getCategory`. A cached campaign past its end date is dropped.

## What reads from it
| Place | Behaviour |
|---|---|
| Top bar | The running campaign title first, then the admin's announcement lines (`hooks/useNavLinks.js`) |
| Menu (desktop + phone) | Categories with "show in menu", then Our Story. "Tangail Jamdani" shows as "Jamdani" to save room |
| Footer → Shop | Every visible category, New Arrivals, Wishlist |
| `/collections/:slug` | `utils/collections.js`: an admin category, or `new` (all products, newest first). Coming-soon categories show the WhatsApp "notify me" page. A new category not yet in the cached copy shows a spinner rather than "not found" |
| Filters | New **Type** filter from the category's types (e.g. Wood / Carved / Handmade). Each group only appears when it has 2+ choices |
| Product page | `template: 'saree'` keeps fabric/count, loom specs, weaver story, care guide. `general` shows the admin's detail rows and artisan wording |
| Home | Hero, then sections in the admin's order; hidden ones are skipped. Default order puts **Shop by craft before the Craft story** |
| Shop by craft | One tile per category: photo tile when live with a banner, woven "Coming soon" tile otherwise. 1, 2 or 3-column grid by count |

## Hero slider (`components/home/Hero.jsx`)
- Full-bleed photo on phones and desktop, with a shade the admin sets per slide (0–90 %): darker at the bottom on phones, on the text side on desktop (radial when text is centred).
- Optional separate phone photo (`<picture>`), Cloudinary-resized (1000 px phone, 2400 px desktop). The first slide loads eagerly with high priority.
- Autoplay every 7 s with a slow zoom and crossfade. Pauses on hover, keyboard focus, touch/drag, when the tab is hidden, and for reduced-motion users. Pause/play button (WCAG 2.2.2), progress lines that double as slide pickers, `01 / 03` counter, arrows on desktop, swipe on phones, ← → keys.
- One slide = no controls. Admin links: site pages use the router, `https://` links open in a new tab (`components/ui/SmartLink.jsx`).

## Campaign popup (`components/home/CampaignPopup.jsx`)
- Home page only, 1.5 s after the **fresh** site data arrives (never from a stale cached copy).
- Once per visitor per day per campaign (`aanchol-campaign-seen`); editing the campaign shows it again.
- Big "10% off", title, Bangla line, message, "Until 25 October", button + "Continue browsing". Photo on the left on desktop, on top on phones (bottom sheet). Closes on Esc, backdrop or button; focus moves to the close button.

## Sale prices
- The server adds `salePrice` to products a campaign covers. `utils/product.js`: `unitPrice` (what you pay now), `wasPrice` (crossed out), `percentOff`.
- `components/ui/Price.jsx` is used on cards, product page, sticky bar, cart lines. Cards show a maroon "10% off" label. Cart subtotal, filters and price sorting use the sale price.
- Checkout sends `expectedSubtotal`. If the server answers `PRICE_CHANGED` (sale ended mid-checkout), the shop reloads prices and says nothing was ordered. The confirmation page shows "You saved ৳ X".

## Wishlist
- `context/WishlistProvider.jsx`: slugs saved in this browser (`aanchol-wishlist`), synced across tabs. Moves to customer accounts later.
- Heart on every product card and an "Add to wishlist" button on the product page, with a toast linking to the list. Navbar heart shows the count (now on phones too); also in the phone menu and footer.
- `/wishlist`: saved pieces with "Move to bag" and remove. Pieces no longer in the shop are skipped but kept in case they return.

## Checked
`npm run lint` clean, `npm run build` passes, every changed module compiles in the dev server, and the in-memory API returned the right sale price and `/api/site` with CORS. **Not yet checked in a browser** (the Chrome extension wasn't connected): please look over the hero, popup and wishlist on phone and desktop.
