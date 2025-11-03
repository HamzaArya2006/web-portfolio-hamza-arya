import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

// Import data using dynamic import
async function loadData() {
  const blogPath = pathToFileURL(resolve(root, 'src/data/blog.js')).href;
  const projectsPath = pathToFileURL(resolve(root, 'src/data/projects.js')).href;
  
  const blogModule = await import(blogPath);
  const projectsModule = await import(projectsPath);
  
  return {
    blogPosts: blogModule.blogPosts,
    projects: projectsModule.projects
  };
}

// Generate blog post pages
function generateBlogPages(blogPosts) {
  const blogDir = resolve(root, 'src/pages/blog');
  
  // Ensure directory exists
  if (!existsSync(blogDir)) {
    mkdirSync(blogDir, { recursive: true });
  }

  blogPosts.forEach(post => {
    const html = `<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${post.title} — Hamza Arya's Blog</title>
    <meta name="description" content="${post.summary || post.excerpt}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${post.summary || post.excerpt}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${post.canonicalUrl || `https://hamzaarya.dev/blog/${post.slug}`}" />
    <meta property="og:image" content="${post.cover || post.image}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${post.title}" />
    <meta name="twitter:description" content="${post.summary || post.excerpt}" />
    <meta name="twitter:image" content="${post.cover || post.image}" />
    
    <link rel="preconnect" href="https://images.unsplash.com" />
    <link rel="stylesheet" href="/src/styles/main.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-gray-900 text-gray-100">
    {{> header}}

    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" class="border-b border-white/10 bg-black/60">
      <ol class="container-pro flex items-center gap-2 py-3 text-sm text-gray-300">
        <li><a href="/index.html" class="hover:text-white">Home</a></li>
        <li aria-hidden="true" class="opacity-60 inline-flex items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>
        <li><a href="./blog.html" class="hover:text-white">Blog</a></li>
        <li aria-hidden="true" class="opacity-60 inline-flex items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>
        <li aria-current="page" class="text-white">${post.title}</li>
      </ol>
    </nav>

    <!-- Article -->
    <article class="py-16 bg-black relative overflow-hidden">
      <div class="absolute inset-0 bg-grid opacity-20" data-parallax="0.02"></div>
      <div class="container-pro relative">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <header class="mb-12">
            <div class="flex items-center gap-3 mb-6">
              ${post.tags.map(tag => `<span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-medium">${tag}</span>`).join('\n              ')}
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">${post.title}</h1>
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-white">${post.author}</span>
              </div>
              <span>•</span>
              <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span>•</span>
              <span>${post.readingTime || post.readTime} read</span>
            </div>
          </header>

          <!-- Cover Image -->
          ${post.cover || post.image ? `<div class="mb-12">
            <img 
              src="${post.cover || post.image}" 
              alt="${post.title}" 
              class="w-full rounded-2xl object-cover"
              loading="eager"
            />
          </div>` : ''}

          <!-- Content -->
          <div class="prose prose-lg prose-invert max-w-none">
            ${post.content}
          </div>

          <!-- Footer -->
          <footer class="mt-16 pt-12 border-t border-white/10">
            <div class="flex flex-wrap gap-2 mb-6">
              ${post.tags.map(tag => `<a href="../blog.html?tag=${encodeURIComponent(tag)}" class="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-medium hover:bg-blue-500/20 transition-colors">#${tag}</a>`).join('\n              ')}
            </div>
            <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <a href="../blog.html" class="btn-ghost inline-flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="mr-2">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Back to Blog
              </a>
              <div class="flex items-center gap-4 text-sm text-gray-400">
                <span>Share:</span>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(post.canonicalUrl || `https://hamzaarya.dev/blog/${post.slug}`)}" target="_blank" rel="noopener" class="hover:text-white">Twitter</a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post.canonicalUrl || `https://hamzaarya.dev/blog/${post.slug}`)}" target="_blank" rel="noopener" class="hover:text-white">LinkedIn</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </article>

    {{> footer}}
    <script type="module" src="/src/scripts/main.js"></script>
  </body>
</html>`;

    const filePath = resolve(blogDir, `${post.slug}.html`);
    writeFileSync(filePath, html);
    console.log(`✓ Generated blog post: ${post.slug}.html`);
  });
}

// Generate project pages
function generateProjectPages(projects) {
  const projectsDir = resolve(root, 'src/pages/projects');
  
  // Ensure directory exists
  if (!existsSync(projectsDir)) {
    mkdirSync(projectsDir, { recursive: true });
  }

  projects.forEach(project => {
    const html = `<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${project.title} — Hamza Arya's Portfolio</title>
    <meta name="description" content="${project.description}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${project.title}" />
    <meta property="og:description" content="${project.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://hamzaarya.dev/projects/${project.slug}" />
    <meta property="og:image" content="${project.image}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${project.title}" />
    <meta name="twitter:description" content="${project.description}" />
    <meta name="twitter:image" content="${project.image}" />
    
    <link rel="preconnect" href="https://images.unsplash.com" />
    <link rel="stylesheet" href="/src/styles/main.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-gray-900 text-gray-100">
    {{> header}}

    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" class="border-b border-white/10 bg-black/60">
      <ol class="container-pro flex items-center gap-2 py-3 text-sm text-gray-300">
        <li><a href="/index.html" class="hover:text-white">Home</a></li>
        <li aria-hidden="true" class="opacity-60 inline-flex items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>
        <li><a href="#projects" class="hover:text-white">Projects</a></li>
        <li aria-hidden="true" class="opacity-60 inline-flex items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>
        <li aria-current="page" class="text-white">${project.title}</li>
      </ol>
    </nav>

    <!-- Project Detail -->
    <article class="py-16 bg-black relative overflow-hidden">
      <div class="absolute inset-0 bg-grid opacity-20" data-parallax="0.02"></div>
      <div class="container-pro relative">
        <div class="max-w-5xl mx-auto">
          <!-- Header -->
          <header class="mb-12">
            <div class="flex items-center gap-3 mb-6">
              ${project.tags ? project.tags.map(tag => `<span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-medium">${tag}</span>`).join('\n              ') : ''}
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">${project.title}</h1>
            <p class="text-xl text-gray-300 mb-8">${project.description}</p>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              ${project.role ? `<div class="flex items-center gap-2">
                <span class="font-semibold text-white">Role:</span>
                <span>${project.role}</span>
              </div>` : ''}
              ${project.client ? `<div class="flex items-center gap-2">
                <span class="font-semibold text-white">Client:</span>
                <span>${project.client}</span>
              </div>` : ''}
              ${project.duration ? `<div class="flex items-center gap-2">
                <span class="font-semibold text-white">Duration:</span>
                <span>${project.duration}</span>
              </div>` : ''}
            </div>
          </header>

          <!-- Main Image -->
          <div class="mb-12">
            <img 
              src="${project.image}" 
              alt="${project.title}" 
              class="w-full rounded-2xl object-cover"
              loading="eager"
            />
          </div>

          <!-- Tech Stack -->
          ${project.stack ? `<div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Tech Stack</h2>
            <div class="flex flex-wrap gap-3">
              ${project.stack.map(tech => `<span class="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 border border-white/10 text-gray-200 text-sm font-medium">${tech}</span>`).join('\n              ')}
            </div>
          </div>` : ''}

          <!-- Features -->
          ${project.features ? `<div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Key Features</h2>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${project.features.map(feature => `<li class="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 border border-white/5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="flex-shrink-0 text-green-400">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-gray-200">${feature}</span>
              </li>`).join('\n              ')}
            </ul>
          </div>` : ''}

          <!-- Metrics -->
          ${project.metrics ? `<div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Results</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${Object.entries(project.metrics).map(([key, value]) => `<div class="glass rounded-xl p-6 hover-lift">
                <div class="text-3xl font-bold text-blue-300 mb-2">${value}</div>
                <div class="text-sm text-gray-400 font-medium capitalize">${key.replace(/_/g, ' ')}</div>
              </div>`).join('\n              ')}
            </div>
          </div>` : ''}

          <!-- Additional Images -->
          ${project.images && project.images.length > 0 ? `<div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Gallery</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${project.images.map(img => `<img 
                src="${img}" 
                alt="${project.title}" 
                class="w-full rounded-xl object-cover"
                loading="lazy"
              />`).join('\n              ')}
            </div>
          </div>` : ''}

          <!-- Links -->
          ${project.links ? `<div class="mb-12">
            <div class="flex flex-wrap gap-4">
              ${project.links.live ? `<a href="${project.links.live}" target="_blank" rel="noopener" class="btn-primary inline-flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="mr-2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                View Live
              </a>` : ''}
              ${project.links.code ? `<a href="${project.links.code}" target="_blank" rel="noopener" class="btn-secondary inline-flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="mr-2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                View Code
              </a>` : ''}
            </div>
          </div>` : ''}

          <!-- Footer -->
          <footer class="mt-16 pt-12 border-t border-white/10">
            <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <a href="/index.html#projects" class="btn-ghost inline-flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="mr-2">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Back to Portfolio
              </a>
              <div class="flex items-center gap-4 text-sm text-gray-400">
                <span>Share:</span>
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title)}&url=${encodeURIComponent(`https://hamzaarya.dev/projects/${project.slug}`)}" target="_blank" rel="noopener" class="hover:text-white">Twitter</a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://hamzaarya.dev/projects/${project.slug}`)}" target="_blank" rel="noopener" class="hover:text-white">LinkedIn</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </article>

    {{> footer}}
    <script type="module" src="/src/scripts/main.js"></script>
  </body>
</html>`;

    const filePath = resolve(projectsDir, `${project.slug}.html`);
    writeFileSync(filePath, html);
    console.log(`✓ Generated project page: ${project.slug}.html`);
  });
}

// Main execution
(async () => {
  try {
    console.log('📦 Generating dynamic pages from data...\n');
    
    const { blogPosts, projects } = await loadData();
    
    console.log('📝 Generating blog posts...');
    generateBlogPages(blogPosts);
    
    console.log('\n💼 Generating project pages...');
    generateProjectPages(projects);
    
    console.log('\n✅ All pages generated successfully!');
  } catch (error) {
    console.error('❌ Error generating pages:', error);
    process.exit(1);
  }
})();

