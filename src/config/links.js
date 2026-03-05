export function project(slug) {
  const encoded = encodeURIComponent(String(slug || '').trim());
  return `/pages/projects/${encoded}.html`;
}

export function blogPost(slug) {
  const encoded = encodeURIComponent(String(slug || '').trim());
  return `/pages/blog/${encoded}.html`;
}
