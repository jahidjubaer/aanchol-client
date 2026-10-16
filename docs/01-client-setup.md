# 01 — Client Setup

_Date: 2026-10-17_

## What was done
- Scaffolded `client/` with Vite (React, JavaScript template).
- Installed: `tailwindcss` + `@tailwindcss/vite` (v4), `daisyui` (v5), `react-router` (v8), `motion` (v14).
- Removed Vite demo files.
- Added the custom DaisyUI theme **heritage** (Ivory & Gold) and font tokens in `src/index.css`.
- Loaded Google Fonts: Cormorant Garamond, Jost, Tiro Bangla (`index.html`).
- Set up routing with `createBrowserRouter`, a root layout, placeholder Navbar/Footer, a temporary Home page and a 404 page.
- Verified: `npm run build` ✅, `npm run lint` ✅ (no warnings).

## Run it
```bash
cd client
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run lint
```

## Folder structure
```
client/src/
  assets/images/      static images
  components/
    layout/           Navbar, Footer
    ui/               reusable UI pieces (next task)
  config/brand.js     brand name, tagline, nav links  ← change the name here
  data/               mock product data (next task)
  hooks/              custom hooks
  layouts/RootLayout.jsx
  pages/              Home, NotFound
  routes/router.jsx   all routes
  index.css           Tailwind, DaisyUI theme, design tokens
  main.jsx
```

## Design tokens (Tailwind classes)
| Purpose | Class |
|---|---|
| Heading font | `font-display` |
| Body font | `font-sans` (default) |
| Bangla text | `font-bangla` |
| Colours | `bg-primary` (maroon), `text-secondary` / `gold` (gold), `bg-base-100` (ivory), `text-ink` |
| Small label | `.eyebrow` |
| Gold divider | `.gold-rule` |

DaisyUI components (`btn`, `drawer`, `modal`, …) automatically use the heritage theme.

## Notes
- The brand name is a placeholder (`Aanchol`).
- Nav links point to routes that don't exist yet (`/collections/jamdani` etc.). They show the 404 page until built.
