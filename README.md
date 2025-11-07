# Hamza Arya — Portfolio

A modern, multi-page developer portfolio built with Vite and Tailwind CSS. It showcases projects, services, testimonials, and a contact form with graceful fallback.

## Live Site

- https://hamzaarya.dev

## Tech Stack

- Vite (Dev server & build)
- Tailwind CSS (+ PostCSS & Autoprefixer)
- Vanilla JavaScript (ES Modules)
- Static HTML pages

## Getting Started

```bash
# install dependencies
npm install

# start dev server
npm run dev

# build for production (outputs to dist/)
npm run build

# preview production build
npm run preview
```

> Note: The repository ignores `node_modules/` and `dist/` via `.gitignore`. Build artifacts should not be committed.

## Project Structure

```text
web-portfolio-hamza-arya/
├─ index.html               # Landing page
├─ about.html               # About page
├─ blog.html                # Blog index
├─ case-studies.html        # Case studies
├─ contact.html             # Contact page
├─ services.html            # Services page
├─ resume.html              # Resume page
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  └─ sitemap.xml
├─ src/
│  ├─ scripts/main.js       # App JS (rendering, UX, forms)
│  ├─ styles/main.css       # Tailwind entrypoint + components/utilities
│  └─ data/
│     ├─ projects.js
│     └─ testimonials.js
├─ dist/                    # Production build (vite build) — not committed
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.js
├─ package.json
└─ LICENSE
```

## Features

- Responsive, accessible UI with Tailwind CSS
- Dynamic projects grid with filters and responsive images
- Testimonials with proximity interaction
- Contact form with validation, honeypot, endpoint support, and mailto fallback
- SEO basics: meta tags, Open Graph/Twitter, robots.txt, sitemap.xml
- Performance-minded: lazy images, content-visibility utilities, minimal JS

## Admin Control Center

An optional admin area is available for managing content and theme customizations.

- **Backend:** Express + MySQL (`/server` directory)
- **Frontend:** `/pages/admin/index.html`
- **Features:** project CRUD, card customization, site-wide copy updates, custom CSS/HTML injection, activity feed

See `/server/README.md` for setup instructions.

## Environment Variables (optional)

- `VITE_FORM_ENDPOINT` — Optional endpoint for contact form submissions (JSON POST)

## Deployment

- Any static hosting (Vercel, Netlify, GitHub Pages, S3/CloudFront)
- Ensure `dist/` is deployed. For frameworks that support static 404s, include `404.html` at project root.

## Notes on Tooling

- Lighthouse local runner was removed from devDependencies to reduce repository size (Chromium downloads). You can still use Lighthouse via Chrome DevTools or install it globally if needed.

## License

This project is licensed under the terms of the LICENSE file included in this repository.
