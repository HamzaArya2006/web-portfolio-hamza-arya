/**
 * Central link configuration for the portfolio site.
 * All internal navigation uses absolute paths from site root for consistency
 * across dev (Vite) and production builds.
 */

/** Base path for all page routes (no trailing slash) */
export const PAGES_BASE = '/pages';

/** Homepage */
export const HOME = '/index.html';

/** Main pages */
export const ABOUT = `${PAGES_BASE}/about.html`;
export const BLOG = `${PAGES_BASE}/blog.html`;
export const CONTACT = `${PAGES_BASE}/contact.html`;
export const PROJECTS = `${PAGES_BASE}/projects.html`;
export const SERVICES = `${PAGES_BASE}/services.html`;
export const SHOP = `${PAGES_BASE}/shop.html`;
export const RESUME = `${PAGES_BASE}/resume.html`;
export const THANK_YOU = `${PAGES_BASE}/thank-you.html`;
export const PRIVACY = `${PAGES_BASE}/privacy.html`;
export const TERMS = `${PAGES_BASE}/terms.html`;
export const SPEAKING = `${PAGES_BASE}/speaking.html`;

/**
 * Build URL for a blog post detail page
 * @param {string} slug - Blog post slug
 * @returns {string}
 */
export function blogPost(slug) {
  return `${PAGES_BASE}/blog/${slug}.html`;
}

/**
 * Build URL for blog page with optional tag filter
 * @param {string} [tag] - Optional tag to filter by
 * @returns {string}
 */
export function blogWithTag(tag) {
  return tag ? `${BLOG}?tag=${encodeURIComponent(tag)}` : BLOG;
}

/**
 * Build URL for a project detail page
 * @param {string} slug - Project slug
 * @returns {string}
 */
export function project(slug) {
  return `${PAGES_BASE}/projects/${slug}.html`;
}

/**
 * Build URL for projects page with optional hash
 * @param {string} [hash] - Optional section hash (e.g. 'projects')
 * @returns {string}
 */
export function projectsWithHash(hash) {
  return hash ? `${PROJECTS}#${hash}` : PROJECTS;
}
