export function project(slug) {
  const encoded = encodeURIComponent(String(slug || '').trim());
  return `/pages/project.html?slug=${encoded}`;
}

export function blogPost(slug) {
  const encoded = encodeURIComponent(String(slug || '').trim());
  return `/pages/blog/${encoded}.html`;
}
