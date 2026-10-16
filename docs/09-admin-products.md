# 09 — Admin: Products & Photos

_Date: 2026-10-17_

The server side is documented in `aanchol-server/docs/04-product-management.md`.

## What was done

### Admin sections
The admin header now has **Orders | Products** tabs.

### Product list (`/admin/products`)
- **Filter tabs** with counts: All · In shop · Sold out · Hidden.
- **Search** by name, Bangla name or colour.
- **Each row** shows the photo (or the woven pattern), name, price and stock ("2 in stock", "Sold out", "Hidden from shop").
- **Add:** a button that opens a new product.

### Add / edit product (`/admin/products/new`, `/admin/products/:slug`)
The form is split into sections:
- **Photos:**
  - Upload several at once (each with a progress bar), up to 8.
  - The first photo is the **main** one; arrows change the order, and ✕ removes a photo.
  - On phones, the picker offers the camera or gallery.
- **Name & category:** name, Bangla name (in the Bangla font), category, and an optional label (New, Limited…).
- **Price & stock:** price, old price (shown crossed out) and stock (0 shows Sold out). Number keypad on phones.
- **Details:** origin, fabric, thread count, colour (used by the shop filter), weaving time, weaver and description.
- **Pattern colours:** two colour pickers with a live preview of the woven pattern shown when there's no photo.
- **Visibility:** a "Show in shop" switch, to hide a piece without deleting it.
- **Save bar** pinned to the bottom of the screen. It reads "Save changes" only when something changed, otherwise "Saved".
- **Errors** from the server appear under the matching fields.
- **Leaving with unsaved changes** asks "Leave without saving?" with Leave / Keep editing.
- **Delete product** asks first. A product that has orders can't be deleted; the message suggests hiding it.
- **View in shop** link.

### Photos on the shop (`src/utils/image.js`)
- Cloudinary photos are requested at the size each place needs: cards 500px, gallery 900px, bag 160px, plus a 2× version for sharp phone screens.
- They're served as `f_auto,q_auto`, so phones get WebP or AVIF, often a fraction of the size of the original JPEG.
- The temporary placeholder photos are unchanged.

### Uploading (`src/utils/uploadImage.js`)
- Photos are **shrunk on the phone before uploading** (longest side 2400px, JPEG quality 88%). A 6–10 MB phone photo usually becomes well under 1 MB, which is faster on mobile data.
- Each upload is signed by our server and sent straight to Cloudinary.
- Removing a photo while another is still uploading is handled correctly.

## Verification
- `npm run build` ✅ · `npm run lint` ✅
- **Headless Chrome at 390px**, with a local stand-in for Cloudinary that checks signatures:
  1. The product list shows 6 products ✅
  2. Add: 2 photos uploaded (signatures OK) ✅. An old price lower than the price shows a field error ✅. Fixing it creates `/admin/products/nil-shapla-jamdani` with "Product added" ✅
  3. Changing stock to 0 and pressing "All products" shows the leave guard ✅. Keep editing, then Save, shows "Saved" ✅
  4. Shop product page: "Sold out", with the photo loaded from Cloudinary at `w_900`, `f_auto` ✅
  5. Hiding makes the shop API return 404 ✅. Delete works for a never-ordered product ✅
