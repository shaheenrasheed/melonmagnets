# Melon Magnets — Website

Official website for **Melon Magnets**, Bengaluru's premium custom magnet studio. Built with React, TypeScript, Vite, and Tailwind CSS.

---

## Commands

### Run locally (development)
```bash
npm run dev
```
Opens at **http://localhost:5173** with hot-reload — any file you save instantly updates in the browser.

### Build for production
```bash
npm run build
```
Compiles and bundles everything into the `dist/` folder, ready to deploy.

### Preview the production build
```bash
npm run preview
```
Serves the `dist/` folder locally at **http://localhost:4173** — use this to test exactly what visitors will see before deploying.

### Type-check (no build output)
```bash
npx tsc --noEmit
```
Checks for TypeScript errors without producing any files. Run this before deploying if you've made code changes.

### Lint
```bash
npm run lint
```
Checks code quality using ESLint.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Vite](https://vitejs.dev) | Dev server & bundler |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Three.js](https://threejs.org) | 3D particle hero background |
| [Lucide React](https://lucide.dev) | Icons |

---

## Project Structure

```
src/
├── App.tsx                      # Main app — all sections (Nav, Hero, Products, About, Footer)
├── main.tsx                     # React entry point
├── index.css                    # Global styles, Tailwind imports, custom animations
├── App.css                      # Unused (legacy from template)
├── global.d.ts                  # Global type declarations (e.g. window.gtag)
└── components/
    └── ui/
        └── woven-canvas.tsx     # Three.js particle animation used in the hero

public/
├── logo.png                     # Melon Magnets logo
├── whatsapp-logo.png            # WhatsApp icon used on CTA buttons
├── images/                      # Fallback product images (product1.jpg … product6.jpg)
├── videos/                      # Product demo videos (product1.mp4 … product6.mp4)
└── clients/                     # Client/brand logos shown in the marquee strip
```

---

## Key Features

- **Hero** — Full-height dark section with an interactive Three.js torus-knot particle animation (gold/yellow particles that react to mouse movement). Text is protected by a left-to-right gradient overlay.
- **Client marquee** — Auto-scrolling brand logo strip with hover-to-pause.
- **Product grid** — Two categories (Rubber Magnets, Square Metal Magnets) with video/image cards. Each card links directly to a WhatsApp inquiry.
- **Bulk quote modal** — Slide-up form that pre-fills a WhatsApp message with quantity, size, location, and deadline.
- **About section** — Editorial dark section with compact inline contact strip (email, studio location, delivery) optimised for mobile.
- **Google Analytics** — `window.gtag` conversion events fire on every WhatsApp CTA click.

---

## Brand & Theme

- **Primary colour:** `#F5C518` (melon-yellow) — used for accents, badges, and CTA buttons
- **Dark sections:** `bg-stone-950` (hero, about, footer)
- **Body:** white (`#ffffff`)
- **Fonts:** Inter (UI/headings), Plus Jakarta Sans (body)

To change the brand colour, update `tailwind.config.js` and the `@theme` block in `src/index.css`:

```js
// tailwind.config.js
colors: {
  'melon-yellow': '#F5C518',   // ← change this hex
}
```

```css
/* src/index.css */
@theme {
  --color-melon-yellow: #F5C518;  /* ← same hex here */
}
```

---

## Adding / Editing Products

Products are defined as arrays at the top of `src/App.tsx`:

```ts
const RubberMagnets = [
  {
    id: 1,
    name: 'Standard Portrait',
    sizeIn: '2.17" × 3.39"',   // inches — shown in card
    sizeCm: '5.5 × 8.6 cm',   // centimetres — shown after the | separator
    price: '₹50',
    media: '/videos/product1.mp4',    // video path inside /public
    fallback: '/images/product1.jpg', // shown while video loads
  },
  // ...
];
```

Drop new video/image files into `public/videos/` and `public/images/`, then add an entry to the array.

---

## WhatsApp Integration

The WhatsApp number is set in one place at the top of the `App` component:

```ts
const whatsappNumber = '919787337194'; // country code + number, no +
```

Change this to update every CTA button on the site.

---

## Deployment

After `npm run build`, upload the contents of `dist/` to any static host:

- **Vercel** — connect the repo, it auto-detects Vite
- **Netlify** — drag-and-drop the `dist/` folder, or connect the repo
- **GitHub Pages** — set `base` in `vite.config.ts` if hosting in a sub-path
