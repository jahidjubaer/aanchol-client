# 13 — Admin: home page, campaigns, categories

_Date: 2026-10-18_ · Uses the API from `aanchol-server/docs/06-site-content-and-campaigns.md`

Three new admin tabs (the tab bar scrolls sideways on phones): **Home page**, **Campaigns**, **Categories**. Like the product editor they are mobile-first, with a sticky save bar, field errors from the server and a "leave without saving?" guard.

## Home page (`/admin/home`)
- **Hero slides**: list with thumbnail (with its shade), Live/Scheduled/Ended/Off badge, ↑ ↓ to reorder (saved as 10, 20, 30…), eye button to show or hide. Up to 8.
- **Slide editor** (`/admin/home/slides/new`, `/:id`): live computer + phone preview; main photo and optional tall phone photo; photo description; small line, title, italic second line, Bangla line, short text; two optional buttons (a shop page like `/collections/jamdani` or an `https://` link); shade slider 0–90 %; text left or centre; on/off; optional From/Until dates (e.g. an Eid slide that appears and disappears by itself).
- **Home page sections**: reorder and show or hide Promise strip, New from the loom, Shop by craft, Craft story, Our promises (the hero is always first). Saved on each tap.
- **Announcement bar**: up to 3 lines; phones show the first, computers the first two. A running campaign's title goes before them.

## Campaigns (`/admin/campaigns`)
- List: percent, name, headline, status badge, dates, which categories.
- Editor: percent off (0 = announcement only, max 70) with a worked price example using the server's rounding; **applies to** all categories or chosen ones; start and end (device time); admin name, headline, Bangla line, message, button, optional portrait popup photo; popup on/off; campaign on/off.
- The server refuses overlapping campaigns, so a price is never discounted twice. Prices return to normal by themselves at the end date. Deleting a past campaign is safe: orders keep their copy of the discount.

## Categories (`/admin/categories`)
- List: banner, name + Bangla, status, product count, in menu, types.
- Editor: name (sets the fixed web address `/collections/<slug>`), Bangla name, introduction, banner; **status** Live / Coming soon / Hidden; show in menu; order; **product form** Sari (fabric, count, weaver, loom specs, care) or Other products (free detail rows); **types** as editable chips (e.g. Wood, Carved, Handmade). Renaming a type keeps products linked; a type in use can't be removed; a category with products can only be hidden.

## Product editor changes
- Categories come from the API (non-live ones are marked, with a hint that the product won't show yet). Switching category clears the type.
- Type picker when the category has types. Sari categories keep fabric, count, weaving time and weaver; other categories show **detail rows** (label + value, up to 10).
- A note that festival discounts come from Campaigns, so prices needn't be edited by hand.

## Orders
Order page shows the full price crossed out on discounted lines and "<campaign> · 10% off applied".

## Shared code
- `components/admin/FormParts.jsx`: Field, Section, ToggleRow, SaveBar, UnsavedDialog, DeleteButton (two-step), Loading, LoadError.
- `hooks/useEditor.js`: form state, dirty check, unsaved-changes blocker, `save(path, method, pick)`, `remove(path, thenGo)`, `leave(to)`.
- `components/admin/SinglePhoto.jsx`: one-photo upload / replace / remove through the existing Cloudinary signature.
- `components/admin/ScheduleBadge.jsx` and `utils/adminFormat.js` (`toLocalInput`, `fromLocalInput`, `scheduleState`).
- `utils/heroShade.js` is shared by the shop hero and the slide preview, so they always match.

## Checked
Lint clean, build passes (each admin page loads as its own small file). Against a local in-memory API: created a slide (empty dates), set an end date, created a category with types, created an "other products" item with detail rows and type, switched its category (type cleared), saved the announcement; `/api/site` reflected all of it. **Not yet clicked through in a browser.**
