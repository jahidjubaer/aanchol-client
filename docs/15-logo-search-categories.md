# 15 — Logo, search, quick add to bag, more categories

_Date: 2026-10-18_ · Server side: `aanchol-server/docs/08-more-categories.md`

## Logo
A Jamdani **buti** (the small woven flower scattered across a sari) set inside a diamond, the way motifs sit in the weave. It's built from diamonds only, like a motif made thread by thread on the loom.

| File | Use |
|---|---|
| `src/components/ui/Logo.jsx` | `LogoMark` (frame takes the text colour, flower is gold; `flower` prop to change it) and `Logo` (mark + name) |
| `public/favicon.svg` | Browser tab: maroon tile, ivory frame, gold flower |
| `public/apple-touch-icon.png` | 180 px icon when added to an iPhone home screen |
| `public/logo.svg` | Maroon and gold mark on transparent, 512 px, for Facebook, printing, etc. |

Shown in the navbar (shrinks on scroll), phone menu, footer (ivory on dark), admin bar and admin login. If the brand name changes, the mark still works because it has no letters.

## Search
- The search icon (and **/** on a keyboard) opens a panel at the top of the page. Results appear while typing: photo, name, details, price. Category names that match get a shortcut ("All Handmade Jewellery"). Enter or "See all" opens **/search?q=…**.
- `/search` shows the results as product cards with sorting (Best match, Newest, Price).
- Matching (`src/utils/search.js`): every word must appear at the **start of a word** somewhere (name, category, type, colour, fabric, origin, badge, weaver, details, description). "silk" finds Half-silk; "red" doesn't find "hundred". Name matches rank first, sold-out pieces last. Common spellings are understood: sari/shari → saree, jewelry → jewellery. Bangla names are searched too.
- Runs in the browser on the catalogue that's already loaded, so it's instant.

## Add to bag on product cards
- Desktop: hovering a card slides up an **Add to bag** bar (it was "View details"; clicking the photo still opens the piece).
- Phones: a round bag button on the photo's bottom right corner.
- Once every piece in stock is in the bag it shows a tick / "In your bag". Sold-out pieces have no button. The usual "added to your bag" message appears with a View link.
- The wishlist page keeps its own "Move to bag" button, so cards there have no quick add.

## New categories (Coming soon, not in the menu)
Handloom Sarees (Muslin, Katan & Benarasi, Rajshahi Silk, Monipuri), Three-Piece (Unstitched, Ready to wear), Orna, Scarves & Shawls (Orna, Scarf, Shawl), Nakshi Kantha & Gifts (Nakshi Kantha, Gift sets, Crafts). Added to Atlas on 2026-10-18.

To open one: **Admin → Categories →** set status to Live, add a banner photo, tick "Show in menu" if wanted, then add products. Edit the types (filter chips) there too.

Home page "Shop by craft": live categories keep the big tiles; coming-soon ones are a smaller row underneath ("Coming soon to the shop"), so the page doesn't look unfinished. The footer lists only live categories.

## Checked
Lint clean, build passes. Screenshots in headless Chrome at desktop (1280) and phone (390) widths: navbar logo, search panel and results page, hover add-to-bag (bag count went to 1), phone card buttons, coming-soon row, footer.

## Ideas from Aarong (not built yet)
See the list in the chat reply of 2026-10-18; the ones chosen will get their own doc.
