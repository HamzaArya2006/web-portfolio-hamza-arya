# How to Improve PageSpeed & Lighthouse Scores

Actionable steps to raise **Performance** (currently ~80) and **Accessibility** (currently ~87) toward 90+.

---

## 1. Performance (target 90+)

### 1.1 Reduce unused CSS (biggest lever)

**Problem:** One large CSS bundle is sent to every page. The homepage gets styles for blog, shop, AI assistant, intro, etc., so “Reduce unused CSS” stays around 50.

**Options (pick one or combine):**

| Approach | Effort | What to do |
|----------|--------|------------|
| **Split CSS by route** | Medium | Move blog-only styles to `blog.css`, shop-only to `shop.css`, AI assistant to `assistant.css`. In each HTML file, link only the CSS that page needs. Homepage would load `main.css` (base + home) only. |
| **Critical CSS + async rest** | Medium | Use a Vite plugin (e.g. `vite-plugin-critical` or custom) to extract above-the-fold CSS, inline it in `<head>`, and load the full stylesheet with `media="print"` + `onload="this.media='all'"` so it doesn’t block first paint. |
| **Trim `site.css`** | Low | In `src/styles/site.css`, identify blocks that only apply to specific pages (e.g. `.blog-modal`, `.shop-card`, `.ai-assistant-*`). Move them to separate files and import or link them only on blog, shop, or pages that use the assistant. |

**Quick win:** In `main.css`, conditionally import heavy section CSS only when needed (e.g. via data attribute or route), or split `site.css` into `site-base.css` + `site-blog.css` + `site-shop.css` + `site-assistant.css` and link section CSS only on those pages.

### 1.2 Improve Cumulative Layout Shift (CLS &lt; 0.1)

**Already done:** Hero image dimensions, intro overlay containment, critical inline layout.

**Still do:**

- **All images:** Give every `<img>` explicit `width` and `height` (or use `aspect-ratio` in CSS) so the browser reserves space. Check project cards, blog images, and any dynamically injected images in `src/scripts/modules/`.
- **Fonts:** You use `display=swap`; optionally preload the main font file so layout doesn’t shift when the font loads:  
  `<link rel="preload" href="https://fonts.gstatic.com/..." as="font" type="font/woff2" crossorigin>`  
  (Use the actual font URL from the Google Fonts stylesheet.)
- **Ads or embeds:** If you add third-party widgets, put them in a container with a fixed `min-height` or reserve space so they don’t push content down when they load.

### 1.3 Improve LCP and Speed Index

- **LCP element:** Ensure the LCP (usually hero heading or hero image) is visible as early as possible. Keep critical CSS inlined (already done) and avoid loading large render-blocking CSS/JS before it.
- **Preload LCP image:** You already preload the hero SVG. If LCP is another image (e.g. a large project image on the homepage), add `<link rel="preload" as="image" href="..." fetchpriority="high">` for it.
- **Server/CDN:** Use a fast host and enable compression (Brotli/Gzip). Netlify does this; ensure cache headers are correct (you already have long-lived cache for assets).

### 1.4 Keep TBT and FCP good

- **Total Blocking Time:** You’re at 0 ms; keep script payloads small and avoid long tasks. Lazy-load heavy chunks (e.g. assistant, shop) after first paint (you already use dynamic imports).
- **First Contentful Paint:** Inline critical CSS and defer non-critical CSS/JS so the first paint stays fast.

---

## 2. Accessibility (target 90+)

### 2.1 Fix contrast (main issue)

**Problem:** “Background and foreground colors do not have a sufficient contrast ratio.” Gray text on dark backgrounds (e.g. `text-white/60`, `rgba(255,255,255,0.6)`) often fails WCAG AA (4.5:1 for normal text).

**Do this:**

- Replace low-contrast grays with higher contrast:
  - Prefer **`text-gray-300`** or **`text-white/80`** instead of `text-white/60` or `text-white/70` for body/secondary text.
  - In `site.css`, change `color: rgba(255, 255, 255, 0.6)` to **`rgba(255, 255, 255, 0.85)`** (or at least 0.75) for readable text.
- **Done in this repo:** `site.css`, `notifications.css`, and `sw-update-toast.css` use `rgba(255, 255, 255, 0.82)` for secondary text. Input placeholders use `placeholder:text-gray-300` for better contrast on dark inputs. Hero labels in `index.html` use `text-white/80` instead of `text-white/60`. If you add new muted text, use at least 0.82 or `text-gray-300`/`text-white/80`.
- **Placeholders:** Keep `placeholder:text-gray-400` only if the input background is light enough; on dark inputs use a lighter placeholder (e.g. `placeholder:text-gray-300`) so contrast passes.
- **Buttons and links:** Ensure link and button text on dark backgrounds meets 4.5:1 (or 3:1 for large text). Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify.

### 2.2 Other accessibility checks

- **Focus visible:** You use `focus-visible:ring-*`; ensure all interactive elements (buttons, links, inputs) have a visible focus ring and that it’s not removed with `outline: none` without a replacement.
- **ARIA:** PageSpeed may flag “ARIA roles only on compatible elements.” Use roles only where needed (e.g. `role="menu"` on a `div` is fine; don’t add redundant roles to native elements like `<button>`).
- **Links:** “Identical links have the same purpose” – if the same text links to different URLs, make the purpose clear (e.g. “GitHub – Project X”, “GitHub – Profile”) or add `aria-label`.
- **Images:** All meaningful images have `alt`; decorative images use `alt=""` and `aria-hidden="true"` (you already do this in places).

---

## 3. Best Practices & SEO (already 100)

- Keep dependencies updated and avoid known vulnerabilities.
- Use HTTPS, valid HTML, and safe cross-origin policies (you already do).
- No changes needed unless a future audit flags something.

---

## 4. Order of operations

1. **Quick wins (same day)**  
   - Bump contrast: replace `0.6` / `text-white/60` with `0.8` / `text-white/80` (or `text-gray-300`) for body/secondary text.  
   - Add `width`/`height` to any remaining images that don’t have them.

2. **Next (this week)**  
   - Split or trim CSS: either route-based CSS or move blog/shop/assistant styles into separate files and link them only on the relevant pages.  
   - Re-run PageSpeed and fix any new contrast or focus issues.

3. **Later (optional)**  
   - Critical CSS plugin to inline above-the-fold CSS and load the rest async.  
   - Font preload for the primary font.  
   - Further split of JS chunks if any page loads too much script.

---

## 5. How to re-test

- **Live site:** [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https://hamzaarya.com) – run Mobile and Desktop after each deploy.
- **Local:** Install Chrome, then `npm run lh:serve` and `npm run perf:report` to get Lighthouse scores and the HTML report in `lighthouse-reports/`.

After each change, deploy and retest so you can see the impact on Performance and Accessibility scores.
