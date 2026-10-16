# 02 — Design System

_Date: 2026-10-17_

## What was done
Built the reusable UI for the **Ivory & Gold Heritage** look, plus a preview page at **`/style-guide`** (not linked in the navigation).

### Layout components (`src/components/layout/`)
| Component | Description |
|---|---|
| `Navbar.jsx` | Maroon announcement bar plus a sticky header. **Mobile:** menu and search on the left, logo centred, cart on the right. **Desktop:** links on the left (gold underline on hover/active), logo centred, then search, account, wishlist and cart. Gets shorter after scrolling. A thin motif band runs under the header. |
| `MobileMenu.jsx` | Slide-in drawer (Motion): large serif links with Bangla labels, account/wishlist shortcuts and a WhatsApp help button. Locks page scroll; closes on Esc, a backdrop tap or a link tap. Respects the iPhone safe area. |
| `Footer.jsx` | Dark ink background with a gold motif band: brand blurb, Shop/Help links (two columns on mobile), newsletter field, social links, payment methods. |

### UI components (`src/components/ui/`)
| Component | Use |
|---|---|
| `JamdaniDivider` | Gold rule with a Jamdani flower. Goes between sections and under headings. |
| `MotifBand` | Repeating border strip inspired by a sari border (paar). Takes its colour from a `text-*` class. |
| `SectionHeading` | Eyebrow label, serif title, optional Bangla line, divider and intro text. Animates on scroll. |
| `Reveal` | Wrapper that fades content up when it scrolls into view. |
| `ProductCard` | 3:4 image with a slow zoom on hover, badge, wishlist heart, and "View Details" bar (desktop). Shows name, details and price in ৳ with lakh grouping. |
| `WovenImage` | SVG stand-in for product photos (sari field + border) in each product's colours. Used automatically when a product has no `image`. |

### Other
- `src/data/products.js`: 6 sample Tangail Jamdani sarees (placeholder data).
- `src/config/brand.js`: announcement text, phone/WhatsApp (**placeholders**), socials, nav, footer links, payment methods.
- `src/hooks/`: `useScrolled`, `useLockBodyScroll`.
- `src/utils/`: `formatPrice` (৳ 12,500 / ৳ 1,25,000), `motion.js` (`EASE_LUXE` easing shared by all animations).
- New dependency: `lucide-react` (icons). Facebook/Instagram are text links because Lucide has no brand icons.

## Mobile decisions
- Product grid uses **2 columns** on phones, 3 on tablets, 4 on desktop.
- Tap targets are at least 40px; the wishlist heart is always visible (no hover on touch screens).
- The "View Details" hover bar shows only on desktop. On mobile, tapping the image opens the product.

## Placeholders to replace later
- Brand name, phone, WhatsApp number and social URLs in `brand.js`.
- Real product photos: set `image` on each product, and `WovenImage` stops being used.
- Search, account, wishlist and cart buttons don't do anything yet (cart count is 0).

## Verify
`npm run build` ✅ · `npm run lint` ✅ · dev server serves `/` and `/style-guide` ✅. Visual check in a browser was **not** done this round (browser extension not connected).
