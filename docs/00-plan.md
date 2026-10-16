# 00 — Project Plan

_Last updated: 2026-10-17_

## Business
Semi-luxury Bangladeshi traditional fashion, women first (men later).

| Phase | Products |
|---|---|
| Launch | Tangail Jamdani saree |
| Next | Handmade / wood / carved jewellery, women's accessories |
| Later | Dhakai muslin, Sylheti Manipuri, salwar kameez, men's line |

Brand name: **not final**. `Aanchol` (আঁচল) is used as a placeholder and lives only in `client/src/config/brand.js` and `client/index.html`.

## Confirmed decisions
| Area | Decision |
|---|---|
| Frontend | React + Vite, Tailwind CSS v4, DaisyUI 5, React Router, Motion (formerly Framer Motion) |
| Backend | Node.js + Express REST API |
| Database | MongoDB Atlas (free M0) |
| Images | Cloudinary (free) |
| Hosting | Frontend: Vercel or Netlify (free). API: Render (free) |
| Domain | Buy a `.com` first; add `.com.bd` later and redirect it |
| Visual direction | Ivory & Gold Heritage |

## Design direction: Ivory & Gold Heritage
- **Colours:** ivory `#FAF6EE` background, deep brown ink `#2B1D16`, maroon `#7A1F2B` (primary), antique gold `#B8892D` (thin accents only), bottle green `#1F4D3A` (rare accent).
- **Type:** Cormorant Garamond for headings, Jost for body text, Tiro Bangla for Bangla accent words.
- **Motifs:** thin gold rules and subtle Jamdani geometric borders as dividers, used sparingly.
- **Motion:** slow fades and image reveals, never bouncy.
- **Content:** a craft story on each product (weaver, loom, motif, weaving time), a handwoven-irregularity note, care instructions and delivery times.
- **Mobile first:** sticky bottom actions, swipeable full-screen product gallery, filter drawer, WhatsApp order button.
- **References:** aarong.com (Taaga), tabaya.com, Sabyasachi, Raw Mango, Taneira, Good Earth.

## Roadmap
1. ✅ Client scaffold (see `01-client-setup.md`)
2. Design system: tokens, buttons, motif dividers, product card, navbar and mobile drawer, footer
3. Pages with mock data: Home, Collection, Product, Our Story, Cart, Checkout, About, Contact
4. Server: Express + MongoDB, with products, orders and admin auth
5. Connect frontend to API; Cloudinary images
6. Deploy (Vercel + Render) and connect the domain
7. Payments: COD first, then bKash / SSLCommerz

## Working rules
- Every decision is confirmed with the owner before implementation.
- Each task ends with a numbered doc in `docs/` (client repo) or `server/docs/` (server repo).
- Git/GitHub: only **jahidjubaer** appears as contributor (no co-author trailers).
