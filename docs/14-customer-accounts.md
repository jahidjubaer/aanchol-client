# 14 — Customer accounts

_Date: 2026-10-18_ · Server side: `aanchol-server/docs/07-customer-accounts-and-sample-data.md`

Sign in with **mobile number + password**. Guest checkout stays. Forgotten passwords are handled on WhatsApp with a one-time link from the admin.

## Shop pages (each loads only when opened)
| Page | What it does |
|---|---|
| `/account/login` | Sign in / Create account tabs, show-password button, "Forgot password? Message us" (WhatsApp with the number filled in). Router state can carry `{ mode, name, phone, claim, next }`, so personal details never go into the address bar |
| `/account` | Orders: photos, number, status, date, total. "Ordered before as a guest? Add that order" (order number, placed with the same phone) |
| `/account/orders/:id` | Progress line Received → Confirmed → On the way → Delivered with dates, items, sale savings, delivery address, "Ask about this order" on WhatsApp |
| `/account/addresses` | Up to 5, one default, edit/remove |
| `/account/profile` | Name, email, change password (signs out other devices) |
| `/account/reset?token=` | New password from the admin's link; signs straight in |

Navbar person icon goes to the account (a small gold dot when signed in); the phone menu says "Sign in" / "My account".

## Checkout
- Guests see "Have an account? Sign in for a faster checkout" (returns to checkout after signing in).
- Signed in: the default address is filled in, saved addresses are one-tap chips, and "Save this address to my account" offers to keep a new one (on by default for the first).
- The order is sent with the login, so it goes into the account. An expired login never blocks an order (the server takes it as a guest order).
- Guest confirmation page offers **Track this order → Create account**: name and phone are pre-filled, and the new account claims the order automatically.

## Why guest orders aren't added by phone automatically
Numbers aren't SMS-verified, so someone could sign up with another person's number. Orders join an account only when placed signed in, or claimed with their order number.

## Wishlist
Signed in, the wishlist lives in the account too: on sign-in, pieces saved on this device are merged in, and later changes are saved to the account. Signing out clears it from the device (it stays in the account), which matters on shared computers.

## Code
- `context/AccountProvider.jsx` / `account.js`: session `{ token, customer }` in `aanchol-account`; `login`, `register`, `logout`, `call` (signs out on 401), `setCustomer`, `setSession`, `serverWishlist`. Refreshes the profile once per sign-in.
- `components/ui/TextField.jsx`, `components/account/OrderBits.jsx` (status pill, item photos), `utils/orderStatus.js` (customer wording).

## Admin: Customers tab
- `/admin/customers`: search by phone or name, order count, joined date, Paused and Sample badges, pages of 30.
- `/admin/customers/:id`: contact (call / WhatsApp), addresses, their orders and total spent, **Make reset link** (copy, or Send on WhatsApp with a ready message, valid 24 h, one use), **Account active** switch (pausing signs them out).
- Orders show a link to the customer's account when there is one. Orders, products and customers from sample data carry a dashed **Sample** badge.

## Sample data
Loaded into Atlas on 2026-10-18 (`npm run sample:add` in the server): 3 Jamdani and 4 jewellery sample products (Jewellery is now **live**), a sample customer with 3 orders, 4 guest orders, and a sample Eid campaign **switched off**. Sample customer: phone `01100000001`, password in `server/.env` (`SAMPLE_CUSTOMER_PASSWORD`). Remove everything before launch with `npm run sample:remove`, which also puts Jewellery back to Coming soon.

## Checked
Lint clean, build passes, every new page compiles in the dev server. Against the local API: sample login and orders, sign-up, signed-in checkout with the sale price, saving an address, order timeline. **Not clicked through in a browser** (Chrome extension not connected).
