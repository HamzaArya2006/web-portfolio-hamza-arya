# Performance Optimizations

This document outlines the performance optimizations implemented in the portfolio.

## Images

### Build-time Optimizations
- **Responsive Images**: Generate multiple sizes (480px, 768px, 1024px, 1440px, 1920px)
- **Modern Formats**: AVIF and WebP variants generated automatically
- **Blur-up Placeholders**: Base64-encoded low-quality placeholders for instant visual feedback
- **Metadata Generation**: JSON files with image dimensions, aspect ratios, and placeholder data

### Implementation
- Enhanced `scripts/optimize-images.mjs` to generate:
  - AVIF/WebP variants at multiple widths
  - Blur-up placeholders (20px, heavily blurred)
  - Metadata JSON files for each image
- Created `src/scripts/modules/responsive-images.js` utility for:
  - Picture elements with AVIF/WebP sources
  - Automatic srcset generation
  - Blur-up placeholder integration

### Usage
```javascript
import { generatePictureElement, loadImageMetadata } from './modules/responsive-images.js';

// Generate picture element with blur-up
const picture = generatePictureElement({
  alt: 'Project screenshot',
  basePath: '/images/project-name',
  classes: 'project-image',
  lazy: true,
  placeholder: metadata.placeholder
});
```

### Hero Image Preloading
- Hero images preloaded with `<link rel="preload" as="image" fetchpriority="high">`
- Implemented in `index.html` head section

## CSS

### Module Structure
- Split `main.css` into:
  - `components.css` - Component styles
  - `utilities.css` - Utility classes and performance hints
  - `sw-update-toast.css` - Service worker update notifications
  - `critical.css` - Critical above-the-fold styles (for future inlining)

### Tailwind Configuration
- Content purging configured in `tailwind.config.js`
- Only used classes are included in production build
- PostCSS configured for autoprefixing

### Future: Critical CSS Inlining
- `src/styles/critical.css` prepared for build-time inlining
- Can be integrated with Vite plugin for automatic inlining

## JavaScript

### Code Splitting
- **Dynamic Imports**: Heavy modules loaded on-demand
- **Conditional Loading**: Sections load only when entering viewport
- **Vendor Chunks**: Configured in `vite.config.js` for optimal splitting

### Implementation Details
- Critical code loads on `DOMContentLoaded`:
  - Navigation
  - Theme initialization
  - Service worker registration
  - Lazy image binding
  
- Deferred code loads on `load` event:
  - Analytics
  - Heavy section modules
  
- Viewport-based loading:
  - Projects section
  - Testimonials
  - Blog posts
  - Contact form
  - Other heavy components

### Intersection Observer
- 200px rootMargin for preloading before viewport entry
- Threshold: 0.01 (triggers as soon as 1% visible)

## Caching

### Vite Build
- **Hashed Assets**: All assets include content hash in filename
- Configured in `vite.config.js`:
  - `chunkFileNames: 'assets/[name]-[hash].js'`
  - `assetFileNames: 'assets/[name]-[hash].[ext]'`

### Cache-Control Headers
- Configured in `vercel.json`:
  - Static assets: `max-age=31536000, immutable` (1 year)
  - HTML: `max-age=0, must-revalidate`
  - Service worker: `no-cache`
  - Manifest/robots: `max-age=86400` (24 hours)

## PWA Features

### Service Worker (`public/sw.js`)
- **Multiple Cache Strategies**:
  - Static assets: Stale-while-revalidate
  - Images: Cache-first with background update
  - Pages: Network-first with offline fallback
  - Navigation: Network-first with offline page

### Offline Support
- Offline fallback page (`/offline.html`)
- Runtime caching for images and pages
- Automatic cache cleanup on service worker update

### Background Sync
- Contact form submissions queued in IndexedDB
- Automatic retry when connection restored
- Implemented in `src/scripts/modules/forms.js`

### Update Notifications
- Toast notification when new service worker available
- User can reload or dismiss
- Styled in `src/styles/sw-update-toast.css`
- Implemented in `src/scripts/modules/pwa_perf.js`

### IndexedDB Integration
- Stores failed form submissions for background sync
- Automatic cleanup after successful sync

## Build Configuration

### Vite Configuration
- `cssCodeSplit: true` - Separate CSS files per route
- Manual chunk configuration for vendor code
- Optimized asset naming with hashes

### Image Optimization Script
- Runs in `prebuild` step
- Generates optimized images before Vite build
- Supports JPG, PNG input formats

## Performance Monitoring

- Performance metrics logging in `src/scripts/modules/pwa_perf.js`
- Tracks:
  - Page load time
  - DOM content loaded
  - Paint metrics

## Best Practices Implemented

1. **Lazy Loading**: Images load only when near viewport
2. **Code Splitting**: JavaScript split into logical chunks
3. **Critical Path Optimization**: Critical CSS/JS loads first
4. **Resource Hints**: Preload for hero images
5. **Modern Image Formats**: AVIF/WebP with fallbacks
6. **Caching Strategy**: Appropriate cache headers for all assets
7. **Offline Support**: Full PWA with offline fallback
8. **Background Sync**: Resilient form submissions
9. **Update Notifications**: User-aware service worker updates

## Testing

To verify optimizations:
```bash
npm run build
npm run preview
npm run lighthouse
```

## Future Enhancements

- [ ] Automatic critical CSS inlining via Vite plugin
- [ ] Image CDN integration for even faster delivery
- [ ] Advanced prefetching for likely next pages
- [ ] Service worker precaching for predicted routes

