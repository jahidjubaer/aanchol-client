# 03 — Home Page + Temporary Photos

_Date: 2026-10-17_

## What was done
Built the full home page and added real Jamdani photos as temporary placeholders.

### Sections (in order), `src/components/home/`
| # | Component | Mobile | Desktop |
|---|---|---|---|
| 1 | `Hero` | Full-screen photo, dark gradient, text and two buttons side by side at the bottom | Split view: text on the left, tall framed photo on the right |
| 2 | `PromiseStrip` | Slow scrolling strip: Handwoven in Tangail · Authentic Jamdani · Cash on Delivery · Free Delivery in Dhaka (stops when the device is set to reduce motion) | same |
| 3 | `FeaturedEdit` | "The Jamdani Edit": 4 products in 2 columns, then "View All Jamdani" | 4 columns |
| 4 | `CraftStory` | Weaver photo, craft text, 3 facts (UNESCO 2013, weeks to months per sari, one of a kind), "Meet the Weavers" | Photo and text side by side, with a maroon "হাতে বোনা" tag |
| 5 | `ShopByCategory` | Jamdani photo tile; dark "Handmade Jewellery, coming soon" tile | Two square tiles |
| 6 | `Promises` | 4 promises in 2 columns, then a maroon WhatsApp styling band | 4 columns |

All sections animate in on scroll. The hero image zooms in slowly on load and moves slightly as you scroll (parallax).

### Other changes
- **ProductCard:** supports a `hoverImage` that cross-fades in on desktop hover (used on the Ash Shapla product).
- **Buttons:** DaisyUI's bold button text replaced by lighter Jost at 12px (`index.css`), which looks more refined.
- **Announcement bar:** phones show only "Cash on delivery across Bangladesh"; the Dhaka line appears from `sm` up, so the bar never wraps.
- **Products:** `src/data/products.js` now has 4 products with photos plus 2 with the woven placeholder; `featuredProducts` = the first 4 with photos.
- **New page:** `/credits` (Photo Credits), linked in the footer under Help.

## Temporary photos: licence
- 8 photos from **Wikimedia Commons**, found through Openverse, stored in `public/images/placeholder/`.
- Licence: **CC BY-SA 3.0 / 4.0**. Free to use commercially, **but the photographer must be credited**. The `/credits` page does this, using `src/data/photoCredits.js`.
- One candidate photo was rejected because it had a stock-photo watermark (not truly free).
- **When real product photos arrive:** replace the files and remove their entries from `photoCredits.js`. Delete `/credits` once no Wikimedia photos remain.
- A few product photos show sellers holding the sari. They're fine as placeholders, but real product shots should be on a model or flat-lay.

## Placeholder copy to confirm
These are proposals, not facts about the business. Please confirm or change them:
- "Sourced directly from weaving families in Tangail"
- "Every sari arrives folded in our keepsake wrap"
- "Free delivery inside Dhaka"
- Product names, prices and thread counts (all sample data)

## Verification
- `npm run build` ✅ · `npm run lint` ✅
- Screenshots taken with headless Chrome emulating a **390px phone** and a **1440px desktop**. Mobile issues found and fixed: announcement wrapping, a hero button wrapping, and an oversized jewellery tile.
