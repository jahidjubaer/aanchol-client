# 05 — Cart Drawer & Checkout

_Date: 2026-10-17_

## What was done

### Cart drawer (`src/components/cart/`)
- Opens from the **bag icon** in the navbar, or from **"View"** on the "added to your bag" message.
- Slides in from the right, full width on phones and 448px wide on desktop. Closes with ✕, Esc or a backdrop tap.
- Each item shows a photo, name, details, a **quantity stepper** (limited by stock) and **Remove**.
- The footer shows the subtotal, a note about delivery and COD, **Checkout** and *Continue shopping*.
- When empty: a message in English and Bangla with *Explore Jamdani*.
- `CartLine` is shared by the drawer and the checkout summary (`compact` mode shows a quantity badge).

### Cart logic (`src/context/CartProvider.jsx`)
- Adds `items` (lines joined with product data), `subtotal`, `setQty`, `removeItem`, `clear`, `openCart`, `closeCart`.
- Removed products are dropped and quantities are capped at stock.
- Opening the drawer hides the "added" message so it doesn't cover the drawer.

### Checkout (`/checkout`, `src/pages/Checkout.jsx`)
- **Phones:** a collapsible "Show order summary · ৳ total" bar at the top.
- **Desktop:** the summary sits in a box on the right that stays in view while scrolling.
- **01 Contact:** full name, mobile number (Bangladesh format check: `01[3-9]XXXXXXXX`, `+88` allowed) and optional email.
- **02 Delivery:** Inside Dhaka (free) or Outside Dhaka (৳ 150) as selectable cards; city/district; full address; optional note.
- **03 Payment:** Cash on delivery. bKash, Nagad and Card are shown as *Coming soon*.
- Errors appear after the first submit attempt and update as you type; the first wrong field gets focus.
- Fields use the right `autocomplete` and `inputMode` values, so phones offer autofill and the number keypad.
- The empty-cart state links back to the collection.

### Order confirmation (`/order-confirmed`)
- Thanks the customer by first name and shows the order number (e.g. `AN-BF3WJD`), items, delivery, total and address.
- **Send on WhatsApp** sends the full order (items, total, name, phone, address) to the shop's WhatsApp. Until the backend exists, this is how an order actually reaches you.
- Opening the page directly (without an order) redirects to Home.

### Config
- `DELIVERY_OPTIONS` in `src/config/brand.js` (labels, delivery times, fees).
- `src/utils/checkout.js`: validation, order ID, WhatsApp order message.

### Fix: Taka sign (৳)
Cormorant Garamond and Jost have no ৳ character, so prices used a mismatched fallback glyph. `Tiro Bangla` is now second in both font stacks, so ৳ renders consistently.

## ⚠️ Important limitation
**Orders are not saved anywhere yet.** "Place order" only empties the cart and shows the confirmation. Orders reach you only if the customer taps **Send on WhatsApp**. Real order storage comes with the backend (Express + MongoDB). Don't launch publicly before then.

## Placeholders to confirm
- Delivery fees and times (Inside Dhaka free / 1–2 days; Outside Dhaka ৳ 150 / 2–5 days)
- "We'll call to confirm your order before dispatch"
- The WhatsApp number in `brand.js`

## Verification
- `npm run build` ✅ · `npm run lint` ✅
- **Automated test on a 390px phone and a 1440px desktop**, run in headless Chrome:
  1. Add 2 saris and open the drawer (subtotal ৳ 24,600) ✅
  2. Go to checkout ✅
  3. Submit an empty form: 4 correct error messages ✅
  4. Fill in valid details and submit: goes to `/order-confirmed`, cart emptied ✅
