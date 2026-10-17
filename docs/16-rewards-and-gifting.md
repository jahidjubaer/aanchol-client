# 16 — Membership, gift cards, gift wrap, restock alerts, complete the look, drop-down menu

_Date: 2026-10-18_ · Server side: `aanchol-server/docs/09-membership-gift-cards-restock.md`

## Membership
- **/membership**: public page with the four cards (Silver, Gold, Platinum, Diamond; the colour follows the level's position, so renamed levels still look right), how it works, and Join / Sign in buttons.
- **/account/membership**: the customer's card (8-digit number, member since), spend on delivered orders, a progress bar to the next level, and the list of levels.
- **Checkout**:
  - Members see "Gold member: your 5% discount is applied (৳506 off)".
  - Others see how much more they need to spend.
  - Guests get a link to membership.
  - The Place order button waits until the level has loaded, so the total is never wrong.
- The discount comes off the sale price. The totals use `utils/orderTotals.js`, which follows the same rules and rounding as the server.

## Gifting at checkout (new step 03)
- **Gift wrap**: a checkbox plus a message of up to 200 characters, at the fee set in the admin.
- **Gift card**: apply a code (any spacing or case). It shows "Using ৳2,000 of ৳2,000" and how much stays on the card.
- The summary shows member discount, delivery, gift wrap and gift card. The total becomes **To pay**.
- The confirmation page, account order page, admin order page and WhatsApp message all show the same lines (`components/checkout/OrderExtras.jsx`).
- The gift message also appears on the confirmation and account pages.

## Gift cards
- **/gift-cards**:
  - Amount: ৳1,000 to ৳10,000 presets, or another amount from ৳500 to ৳50,000.
  - Recipient name and optional mobile, a message, your name and mobile, and bKash or cash.
  - Shows a live card preview and a **balance checker**.
- After ordering, the customer gets a reference (GC-…) and a "Pay now on WhatsApp" button.
- **/account/gift-cards** lists the customer's cards with state, balance and a copyable code once paid.

## Product page
- **Sold out**: "Tell me when it's back" takes a mobile number (pre-filled when signed in). The browser remembers the request.
- **Complete the look** (below the product):
  - Shows up to 3 in-stock pieces chosen in the admin.
  - If none are chosen, it shows the newest pieces from other categories.
  - Has an "Add all N to bag · ৳total" button.

## Menu
- **Desktop**: hovering or focusing a category opens a panel with its types (as links to `?type=`), its intro, and its 3 newest pieces. Esc or moving away closes it.
- **Phone menu**: a + button opens a category's types. Gift cards and Membership links were added.
- **Footer**: the Shop column adds Gift cards and Membership.

## Admin
New tabs: **Gift cards** (count waiting for payment), **Restock** (count of people who can be told now) and **Rewards**.

- **Gift cards**:
  - The list filters by state and searches by code, reference, phone or name.
  - The detail page offers "Payment received: activate", "Ask for payment" on WhatsApp, the code with Copy, Send to buyer and Send to recipient (ready-made WhatsApp messages), usage history with refunds, a private note, and Cancel.
  - "New card" makes an active card for one sold in person.
- **Restock**: grouped by piece, with a WhatsApp "back in stock" message and a "Told" tick for each person.
- **Rewards**: edit membership levels (name, spend, %), and switch gift wrap on or off and set its fee.
- **Product editor**: a "Complete the look" picker that searches pieces and adds or removes them.
- **Order page**: a gold box saying "Gift wrap · leave prices out · Write on the card: …". The list marks gift-wrapped orders.
- **Customer page**: shows level, spend and card number.

## Checked
- Lint is clean and the build passes.
- Headless Chrome with sample data:
  - Signed in as the sample customer (Gold): the membership card, gift cards list and checkout all showed correctly.
  - A full order placed: sale price, then Gold 5%, gift wrap with a message, and ৳2,000 from the gift card, leaving ৳7,719 to pay.
  - Shop pages: sold-out piece with notify form, complete the look, the drop-down menu, the /membership page (desktop and phone) and /gift-cards.
  - Admin: activated a pending card (the tab count dropped), and checked the restock, rewards, order gift-wrap box and product picker pages.
