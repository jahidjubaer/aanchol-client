# 07 — Admin: Orders

_Date: 2026-10-17_

The server side is documented in `aanchol-server/docs/02-admin-auth-and-orders.md`.

## What was done
A private admin at **`/admin`**, designed mainly for the phone, in the same ivory and gold style as the shop.

- **Separate download:** the admin pages are loaded only when someone opens `/admin` (about 20 KB). Shoppers never download them.
- **Hidden from search:** marked `noindex`, with no links to it from the shop.

### Login (`/admin/login`)
- Email and password; errors are shown in the form.
- Opening any admin page while logged out leads to the login page, then back to that page afterwards (`?next=`, limited to `/admin…` addresses).
- The session lasts 7 days. Any expired session or `401` logs out everywhere (`AdminAuthProvider.call`).

### Orders list (`/admin`)
- **Status tabs** with counts: All · New · Confirmed · Shipped · Delivered · Cancelled. On phones the tabs scroll sideways.
- **Search** by order number, phone or name. It updates as you type.
- **The browser tab** shows the number of new orders, e.g. "(2) Orders".
- **Each row** shows the number, status, customer, item count, city, time ("5 minutes ago") and total.
- **Refreshing:** a refresh button, plus automatic reload when you come back to the tab.
- Filters and page number are kept in the URL, so Back and refresh keep your place.

### Order page (`/admin/orders/AN-XXXXXX`)
- **Next step:** one big button for the next status (Confirm order, then Mark shipped, then Mark delivered).
- **Cancel order** asks first ("Yes, cancel / Keep order"). There are no browser pop-ups.
- **Customer:**
  - Name and phone, with **Call** (opens the dialer) and **WhatsApp** buttons. WhatsApp opens with a greeting that names the order.
  - Address, delivery type, and the customer's note, highlighted.
- **Items:** a price breakdown, with the payment shown as "Not paid yet" or "Paid".
- **Private note:** for things like "called, home after 5 pm". Customers never see it.
- **History:** every status change with the time and which admin made it.

## Files
- `src/layouts/AdminLayout.jsx`: admin header, login guard, `noindex`.
- `src/context/AdminAuthProvider.jsx` + `adminAuth.js`: session in `localStorage`, `login`, `logout`, `call`.
- `src/hooks/useAdminData.js`: loads data, reloads on focus, keeps showing old data while reloading.
- `src/pages/admin/AdminLogin.jsx`, `AdminOrders.jsx`, `AdminOrder.jsx`.
- `src/components/admin/StatusBadge.jsx`, `src/utils/adminFormat.js` (status labels, Dhaka-time dates, call and WhatsApp links).
- `src/routes/router.jsx`: `/admin` routes, loaded only when opened.
- `src/utils/api.js`: `request` is now exported and shared.

## Trying it locally
1. In `server/`, run `npm run dev:memory`. It prints the dev admin email; the password is in `server/.env.example`.
2. In `client/`, run `npm run dev`, then open http://localhost:5173/admin.

## Verification
- `npm run build` ✅ · `npm run lint` ✅
- **Headless Chrome on a 390px phone and a 1280px desktop**, against the running API:
  1. `/admin` sends you to the login page.
  2. A wrong password shows the error; the right one opens the list.
  3. The list shows 3 new orders. Searching updates the URL.
  4. On an order: Confirm order, then save a note, then Cancel and "Yes, cancel" leaves it cancelled. The history shows each step and the stock went back.
  5. The Cancelled tab shows the order. Logging out returns to the login page.
