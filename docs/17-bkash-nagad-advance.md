# 17 — bKash / Nagad advance at checkout

_Date: 2026-10-18_ · Server side: `aanchol-server/docs/10-bkash-nagad-advance.md`

## Turning it on
**Admin → Settings → Payments**: switch on bKash and/or Nagad, enter the personal number, and set the advance used when delivery is free (৳120). Until a wallet is on, checkout stays plain cash on delivery.

## Checkout, step 04 Payment (`components/checkout/PaymentOptions.jsx`)
- Two choices: **Pay ৳150 now** (the delivery charge; ৳120 inside Dhaka), with the rest on delivery, or **Pay all now**.
- **Send with**: bKash or Nagad (only those switched on), each with its colour.
- Steps: open the app → Send Money → the number (tap to copy) → the amount → type the TrxID.
- Fields: Transaction ID, and "Sent from", which defaults to the mobile number above.
- The button reads "Place order · ৳120 sent". The rules are mirrored in `utils/payments.js`.
- When a gift card covers the whole order, nothing is asked.

## After ordering
- The confirmation page and the account order page show "Sent by bKash ৳120 · TrxID … · we're checking it" and the cash still due on delivery.
- Account orders show a **Checking payment** label until the admin confirms the payment.
- The WhatsApp order message includes the advance and the TrxID.

## Admin
- **Orders tab count** = payments to check. The list has a "Payment to check" filter and a label on each such order.
- **Order page → Payment box**: amount, wallet, TrxID, sender, and what to look for in the app. **Payment received** marks it checked (with who and when).
- **Confirm order** stays disabled until the payment is marked received.
- If an order whose payment was received is cancelled, a red note says to send the money back to the sender.
- The Rewards tab is now **Settings** (`/admin/settings`): Payments, Membership levels and Gift wrap.

## Gift cards
The order form lists the bKash and Nagad options that are switched on, with their numbers, plus cash.

## Checked
In headless Chrome: turned on bKash in Settings, placed an order inside Dhaka (asked ৳120, with an error for a missing TrxID), saw the confirmation and "checking it", then in the admin saw Confirm locked, tapped Payment received, and Confirm unlocked.
