# 06 — Checkout Connected to the API

_Date: 2026-10-17_

The server side is documented in `aanchol-server/docs/01-api-setup-products-orders.md`.

## What was done
- **`src/utils/api.js`:** a small `fetch` wrapper with `ApiError` (`status` and `body`) and `placeOrder()`. The address comes from `VITE_API_URL` (see `.env.example`, default `http://localhost:4000`).
- **Checkout sends the order to `POST /api/orders`.** It sends only slugs and quantities. The server works out prices and the total and checks stock.
- **While sending:** the button shows a spinner ("Placing order") and is disabled, so the order can't be sent twice.
- **When something goes wrong,** a message appears above the button and scrolls into view, with an "Or order on WhatsApp" link:
  - **Wrong details:** the server's messages show under the matching fields.
  - **Sold out:** the bag is corrected automatically (the item is removed or its quantity lowered) and the customer is asked to check it.
  - **Server unreachable:** "We couldn't reach our shop just now…"; the bag is kept.
- **The confirmation page** shows the order saved on the server, with its real number (e.g. `AN-MC9HFC`).
- Removed the browser-made order ID (`makeOrderId`).

## Running locally
```bash
# Terminal 1, in server/
npm run dev:memory
# Terminal 2, in client/
npm run dev
```

## Still to do
- Product and collection pages still read `src/data/products.js`. Next, they'll load from the API, so stock and prices shown on the site always match the database.

## Verification
- `npm run build` ✅ · `npm run lint` ✅
- Headless Chrome on a 390px phone, against the running API:
  1. Valid order: confirmation with the server's order number; Kacha Holud stock went 1 → 0 and Ash Shapla 2 → 1 ✅
  2. Ordering the sold-out Kacha Holud again: message shown, Kacha Holud removed from the bag, total corrected to ৳ 11,200 ✅
  3. API stopped: "couldn't reach" message shown, bag kept ✅
