# 04 — Collection & Product Pages

_Date: 2026-10-17_

## Routes
| URL | Page |
|---|---|
| `/collections/jamdani` | Tangail Jamdani collection |
| `/collections/new` | New Arrivals (all products, newest first) |
| `/collections/jewellery` | "Coming soon" page with a *Notify me on WhatsApp* button |
| `/products/:slug` | Product page, e.g. `/products/ash-shapla-butidar-jamdani` |

Unknown collection or product slugs show the 404 page.

## Collection page (`src/pages/Collection.jsx`)
- **Banner:** full-width photo with Bangla and English title and intro text.
- **Toolbar:** piece count and sort (Featured, Newest, Price low→high, Price high→low).
- **Filters:** Fabric, Colour (with colour dots) and Price.
  - **Phones / tablets:** a *Filter* button opens a **bottom sheet** (`components/ui/Sheet.jsx`) with *Clear* and *Show N* buttons.
  - **Desktop (lg+):** sticky sidebar.
  - Only values that exist in the collection are offered, so no filter ever leads to zero products by itself.
- **Active filter chips** with remove buttons and *Clear all*; a friendly empty state.
- **Filters and sort live in the URL** (`?fabric=Silk&sort=price-asc`), so a filtered view can be shared or bookmarked, e.g. on Facebook.
- Logic lives in `src/utils/productFilters.js`. It was tested: Silk → 2, Red+Yellow → 2, over ৳20k → 2, price sort ascending ✅.

## Product page (`src/pages/Product.jsx`)
- **Gallery** (`components/product/ProductGallery.jsx`):
  - **Phones:** swipeable full-width slider (CSS scroll-snap) with dot indicators.
  - **Desktop:** images stacked on the left while the details stay fixed in view on the right.
  - Products without photos fall back to the woven pattern.
- **Details:** breadcrumb, badge, name in English and Bangla, price with optional strike-through, stock note, description, fabric and colour.
- **Buttons:**
  - **Add to bag:** adds the sari to the cart and shows a toast. It switches to "In your bag" once the stock limit is reached.
  - **Order on WhatsApp:** opens WhatsApp with a message that already includes the product name and link.
- **Assurances:** COD, handwoven, authenticity.
- **Accordions (DaisyUI collapse):** Details & size, The weaver's story, Care guide, Delivery & exchange.
- **Mobile sticky buy bar** (`components/product/StickyBuyBar.jsx`): slides up once the main buttons scroll out of view and shows name, price, a WhatsApp icon and *Add to bag*. Respects the iPhone safe area.
- **"More from the loom":** up to 4 related products.
- Page `<title>` is set per product (React 19 feature).

## Cart (basic)
- `src/context/CartProvider.jsx` + `src/context/cart.js` (`useCart()`).
- Saves `{ slug, qty }` lines in the browser (localStorage) until the backend exists.
- The navbar bag icon shows the live count (hidden when 0).
- **Not built yet:** cart page / drawer, checkout.

## Data changes
- `products.js`: each product now has `images[]`, `fabric`, `count`, `color`, `nameBangla`, `description`, `weavingTime`, `weaver`, `stock`, `addedOn`. Shared sari specs (length, width, care) are in `JAMDANI_SPECS`.
- `collections.js`: collection titles, banners and which products they contain.
- `utils/whatsapp.js`: builds `wa.me` links with a prefilled message.

## Placeholder content to confirm
- **Delivery:** inside Dhaka 1–2 days, free; outside Dhaka 2–5 days, ৳ 150.
- **Exchange:** within 3 days if unworn, with tags.
- **Payment:** COD, bKash, Nagad.
- **Sari size:** 5.5 m × 1.15 m, blouse piece not included.
- **Weaver details:** "Master weaver family, Pathrail, Tangail" and "Weaving cooperative, Tangail".
- The WhatsApp number in `brand.js` is still a placeholder, so WhatsApp buttons won't reach anyone yet.

## Verification
- `npm run build` ✅ · `npm run lint` ✅
- Screenshots at **390px phone** and **1440px desktop**:
  - Collection page, phone filter sheet, product page, related products.
  - Sticky bar appearing after scrolling.
  - Cart count updating after *Add to bag*.
