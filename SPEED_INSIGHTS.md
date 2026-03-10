# Website Speed Insights (hamzaarya.com)

Summary of speed test results and actions taken.

## Latest results (2026-03-08, Desktop)

| Metric | Value | Target |
|--------|--------|--------|
| **Performance score** | 75 | 90+ |
| Speed Index | 3.6 s | &lt; 3.4 s |
| **Cumulative Layout Shift (CLS)** | **0.34** | &lt; 0.1 |
| First Contentful Paint | 0.4 s | Good |
| Total Blocking Time | 0 ms | Good |
| Largest Contentful Paint | 0.5 s | Good |

## Diagnostics

- **Reduce unused CSS (50)** – Main opportunity. One global CSS bundle is sent to every page, so the homepage receives styles for blog, shop, AI assistant, etc.
- Other diagnostics (document request latency, cache lifetimes, redirects, etc.) scored 0 in the report; review the speed tool’s “Details” for exact URLs and suggestions.

## Changes made

1. **Tailwind content paths** (`tailwind.config.js`)  
   - Added `"./src/pages/**/*.html"` so Tailwind scans `blog/` and `projects/` HTML.  
   - Ensures purging is based on all pages that share the same CSS, and avoids missing classes on subpages.

2. **Critical inline CSS** (`index.html`)  
   - Inline critical CSS for `html`, `body`, `#top`, `.container-pro`, and skip-link so first paint has correct layout and reduces CLS.

3. **Hero image dimensions** (`index.html`)  
   - Hero background image has explicit `width="1920"` and `height="1080"` plus `object-fit: cover` so the browser reserves space and reduces CLS.

4. **Intro overlay containment** (`src/styles/site.css`)  
   - `#intro-overlay` and `#intro-overlay.intro-exit` use `contain: layout style paint` and exit keeps `position: fixed` so the overlay does not affect document layout when it fades out, reducing CLS.

## Recommendations

### Reduce unused CSS (improve from 50)

- **Critical CSS**: Inline above-the-fold CSS for the homepage and load the rest asynchronously (e.g. with a Vite plugin or `media="print"` + swap to `all` after load).
- **Route-based CSS**: Split CSS by section (e.g. home vs blog vs shop) so each page loads only the CSS it needs. Requires build/routing changes.
- **Audit `site.css`**: A large share of unused CSS is likely from `src/styles/site.css` (blog, shop, AI assistant, intro). Consider moving section-specific blocks into separate files and loading them only on the relevant pages.

### Improve CLS (target &lt; 0.1)

- **Images**: Ensure all images have explicit `width` and `height` (or `aspect-ratio`) so layout doesn’t shift when they load. You already use blur placeholders and responsive images; confirm dimensions are set everywhere.
- **Fonts**: Use `font-display: swap` (already in use for Google Fonts) and consider preloading the primary font file to reduce layout shift when the font loads.
- **Dynamic content**: Avoid inserting content above existing content without reserving space (e.g. use min-height or skeleton placeholders for hero or other key areas).

### General

- **Cache**: Netlify headers already set long-lived cache for static assets; ensure HTML uses `max-age=0, must-revalidate` so updates are visible.
- **Accessibility:** See `IMPROVING_SCORES.md` for step-by-step ways to raise Performance and Accessibility (contrast, unused CSS, CLS).

## Past scores

| Date       | Device  | Score |
|------------|---------|--------|
| 2026-03-08 | Desktop | 75     |
| 2026-03-05 | Desktop | 80     |
| 2026-02-28 | Desktop | 100    |

Tracking these helps spot regressions after new features or dependencies.
