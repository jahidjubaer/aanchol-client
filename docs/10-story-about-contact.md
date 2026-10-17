# 10 — Our Story, About & Contact Pages

_Date: 2026-10-17_

## What was done

### Our Story (`/our-story`)
The craft and why the brand exists. The menu, the home hero and "Meet the Weavers" link here.
- **Opening:** a full-width loom photo with "A cloth woven from memory" (আমাদের গল্প).
- **Intro:** Jamdani's heritage (UNESCO, 2013) and the brand's purpose: direct from weaving families, so more of the price reaches the weaver.
- **How a Jamdani is made:** 4 numbered steps (the warp, two weavers at one loom, motifs from memory, weeks of weaving).
- **The motifs:** Butidar, Tesri, Jaal and Panna Hazar, each with its Bangla name.
- **"Made by hand, never identical":** a note on handwoven irregularities, plus Shop Jamdani and About Us buttons.

### About Us (`/about`)
The shop itself: who we are and how buying works.
- **The name:** what the brand name means (`BRAND.meaning` in `config/brand.js`, rewrite it if the name changes).
- **What we promise:** direct from the loom, fair to the weaver, honest photos, a real person on WhatsApp.
- **Shopping with us:** delivery times and fees, cash on delivery, exchange and gift wrap.

### Contact Us (`/contact`)
- **Four ways to reach us:** WhatsApp (highlighted, with a message already typed), phone (tap to call), Facebook and email.
- **Hours** and **"Already ordered?"**, which opens WhatsApp ready for the order number.
- **Questions:** delivery, payment, exchange, colour on screen and the care guide.
- **Footer links open the matching answer:** `/contact#delivery`, `#exchange` and `#care` open that answer and scroll to it.

### Links fixed
- **Footer:** the footer has a new **About** column (Our Story, About Us, Photo Credits). Help now links to Contact and its answers. The old links (`/shipping`, `/returns`, `/care`) went to the 404 page.
- **Mobile menu:** now has About Us and Contact links.
- **Product page:** the Delivery & exchange section links to the Contact page.

### One place for shop details
- Delivery times and fees come from `DELIVERY_OPTIONS`, and the exchange rule from `EXCHANGE_POLICY` (both in `config/brand.js`). Changing them there updates the product, About and Contact pages together. Helpers are in `utils/contact.js`.
- `BRAND.email` and `BRAND.hours` were added.
- `SectionHeading` takes `as="h1"` for a page's main title. The Contact and Credits pages now have a proper `h1`, which helps search engines and screen readers.

## Placeholders to confirm
| What | Where | Now |
| --- | --- | --- |
| WhatsApp, phone | `BRAND.whatsapp`, `BRAND.phone` | `8801XXXXXXXXX` |
| Email | `BRAND.email` | `hello@aanchol.com` (needs the domain) |
| Hours | `BRAND.hours` | Every day, 10am to 8pm |
| Facebook / Instagram pages | `BRAND.socials` | facebook.com / instagram.com |
| Exchange rule | `EXCHANGE_POLICY` | 3 days, unworn, with tags |
| Delivery fees | `DELIVERY_OPTIONS` | Dhaka free, outside ৳150 |
| Photos | `public/images/placeholder` | Wikimedia photos (credited on `/credits`) |

## Verification
- `npm run lint` ✅ · `npm run build` ✅
- **Headless Chrome at 390px and 1280px**, all three pages:
  - correct page titles, no sideways scrolling, no broken images, a clean console ✅
  - the footer "Exchange" link opens `/contact#exchange` with only that answer open, scrolled below the header ✅
