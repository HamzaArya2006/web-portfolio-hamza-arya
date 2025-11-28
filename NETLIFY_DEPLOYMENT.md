# Netlify Deployment Guide

This project is configured for deployment on Netlify.

## Quick Deploy

1. **Connect your repository** to Netlify
2. **Build settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

## Environment Variables

Set these in Netlify Dashboard → Site settings → Environment variables:

### Required
- `FORMS_WEBHOOK_URL` (optional) - Webhook URL for contact form submissions (Slack, Discord, etc.)
- `FORMS_MIN_SUBMIT_MS` (optional) - Minimum time in ms before form submission (default: 3000)

### Optional (for analytics)
- `VITE_PLAUSIBLE_DOMAIN` - Plausible Analytics domain

### Admin Panel (if using)
- `VITE_ADMIN_API_URL` - Admin API URL (if running separate server)
- `VITE_PUBLIC_API_URL` - Public API URL

## API Functions

The contact form API is deployed as a Netlify Function:
- **Location**: `netlify/functions/contact.js`
- **Endpoint**: `/api/contact` (automatically mapped by Netlify)
- **Method**: POST only

## Build Process

1. Pre-build: Optimizes images and generates pages
2. Build: Vite builds the site to `dist/`
3. Post-build: Pages are reorganized from `dist/src/pages/` to `dist/pages/`

## Redirects

Redirects are configured in `public/_redirects`:
- `/admin` → `/admin/index.html`
- All other routes → `/index.html` (SPA fallback)

## Headers

Security and caching headers are configured in `netlify.toml`:
- Static assets: Long-term caching (1 year)
- HTML files: No cache, security headers
- Service worker: No cache

## Notes

- The `api/` folder contains Vercel-style functions (not used on Netlify)
- The `server/` folder is for a separate Express server (optional, not deployed to Netlify)
- Build artifacts in `dist/` are gitignored and generated during build

