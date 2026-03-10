import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import handlebars from 'vite-plugin-handlebars'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, readFileSync, existsSync, mkdirSync, copyFileSync, unlinkSync, rmdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

// Function to get all HTML files from a directory
function getHtmlFiles(dir, basePath = '') {
  const files = []
  try {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name)
      if (entry.isFile() && entry.name.endsWith('.html')) {
        const name = basePath + entry.name.replace('.html', '')
        files.push({ name, path: fullPath })
      }
    }
  } catch (error) {
    // Directory doesn't exist yet, skip
  }
  return files
}

// Collect all page inputs dynamically
function getPageInputs() {
  const inputs = {
    main: resolve(__dirname, 'index.html'),
    'pages/about': resolve(__dirname, 'src/pages/about.html'),
    'pages/blog': resolve(__dirname, 'src/pages/blog.html'),
    'pages/contact': resolve(__dirname, 'src/pages/contact.html'),
    'pages/project': resolve(__dirname, 'src/pages/project.html'),
    'pages/projects': resolve(__dirname, 'src/pages/projects.html'),
    'pages/services': resolve(__dirname, 'src/pages/services.html'),
    'pages/shop': resolve(__dirname, 'src/pages/shop.html'),
    'pages/resume': resolve(__dirname, 'src/pages/resume.html'),
    'pages/thank-you': resolve(__dirname, 'src/pages/thank-you.html'),
    'pages/privacy': resolve(__dirname, 'src/pages/privacy.html'),
    'pages/terms': resolve(__dirname, 'src/pages/terms.html'),
    'pages/speaking': resolve(__dirname, 'src/pages/speaking.html'),
  };

  // Collect blog posts
  const blogPosts = getHtmlFiles(resolve(__dirname, 'src/pages/blog'), 'pages/blog/');
  blogPosts.forEach(({ name, path }) => {
    inputs[name] = path;
  });

  // Collect project pages
  const projects = getHtmlFiles(resolve(__dirname, 'src/pages/projects'), 'pages/projects/');
  projects.forEach(({ name, path }) => {
    inputs[name] = path;
  });

  return inputs;
}

export default defineConfig({
  plugins: [
    compression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false }),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials')
    }),
    {
      name: 'pages-output-reorganizer',
      writeBundle() {
        // Move pages from dist/src/pages/ to dist/pages/
        const srcPagesDir = resolve(__dirname, 'dist/src/pages');
        const targetPagesDir = resolve(__dirname, 'dist/pages');
        
        if (!existsSync(srcPagesDir)) {
          return;
        }

        try {
          // Recursively copy all files from src/pages to pages
          function copyRecursive(src, dest) {
            if (!existsSync(dest)) {
              mkdirSync(dest, { recursive: true });
            }
            
            const entries = readdirSync(src, { withFileTypes: true });
            for (const entry of entries) {
              const srcPath = resolve(src, entry.name);
              const destPath = resolve(dest, entry.name);
              
                if (entry.isDirectory()) {
                copyRecursive(srcPath, destPath);
              } else if (entry.isFile()) {
                // Copy file and .br compressed version if it exists
                copyFileSync(srcPath, destPath);
                const brPath = srcPath + '.br';
                if (existsSync(brPath)) {
                  copyFileSync(brPath, destPath + '.br');
                }
              }
            }
          }

          copyRecursive(srcPagesDir, targetPagesDir);
          
          // Clean up the source directory after copying (except admin which is handled separately)
          function removeRecursive(dir) {
            if (!existsSync(dir)) return;
            try {
              const entries = readdirSync(dir, { withFileTypes: true });
              for (const entry of entries) {
                const fullPath = resolve(dir, entry.name);
                if (entry.isDirectory()) {
                  removeRecursive(fullPath);
                  // Try to remove empty directory
                  try {
                    const subEntries = readdirSync(fullPath);
                    if (subEntries.length === 0) {
                      rmdirSync(fullPath);
                    }
                  } catch {
                    // Directory not empty or already removed
                  }
                } else {
                  try {
                    unlinkSync(fullPath);
                    // Also remove .br file if it exists
                    const brPath = fullPath + '.br';
                    if (existsSync(brPath)) {
                      unlinkSync(brPath);
                    }
                  } catch (err) {
                    // File might have been removed or doesn't exist
                  }
                }
              }
              // Try to remove the directory itself if it's empty
              try {
                const remainingEntries = readdirSync(dir);
                if (remainingEntries.length === 0) {
                  rmdirSync(dir);
                }
              } catch {
                // Directory not empty or already removed
              }
            } catch (err) {
              // Directory might not exist or be accessible
            }
          }
          
          // Remove copied files from src/pages
          removeRecursive(srcPagesDir);
          
          console.log('[pages-output-reorganizer] Successfully reorganized pages output');
        } catch (error) {
          console.warn('[pages-output-reorganizer] Failed to reorganize pages:', error);
        }
      },
    },
    {
      name: 'pages-rewrite',
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url?.split('?')[0] || '/';

            // Skip asset and internal Vite requests
            if (
              url.startsWith('/@') ||
              url.startsWith('/assets/') ||
              url.includes('.')
            ) {
              return next();
            }

            // Root pretty URLs like /about, /contact, etc.
            if (url !== '/') {
              const pageName = url.replace(/^\/+|\/+$/g, '');
              const htmlPath = resolve(__dirname, 'src', 'pages', `${pageName}.html`);
              const indexPath = resolve(__dirname, 'src', 'pages', pageName, 'index.html');

              try {
                const rawHtml = readFileSync(htmlPath, 'utf-8');
                const transformed = await server.transformIndexHtml(url, rawHtml);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(transformed);
                return;
              } catch {
                try {
                  const rawHtml = readFileSync(indexPath, 'utf-8');
                  const transformed = await server.transformIndexHtml(url, rawHtml);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'text/html; charset=utf-8');
                  res.end(transformed);
                  return;
                } catch {
                  // fall through to /pages/ handling below
                }
              }
            }

            // Existing /pages/ behavior (keeps support for /pages/about, etc.)
            if (url.startsWith('/pages/')) {
              let rewritten = url;
              if (!rewritten.endsWith('.html')) {
                rewritten = rewritten.endsWith('/') ? rewritten.slice(0, -1) : rewritten;
                rewritten = `${rewritten}.html`;
              }
              const filePath = resolve(__dirname, 'src', rewritten.slice(1));
              try {
                const rawHtml = readFileSync(filePath, 'utf-8');
                const transformed = await server.transformIndexHtml(rewritten, rawHtml);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(transformed);
                return;
              } catch {
                // fallback: try directory index.html (e.g. /pages/admin -> /pages/admin/index.html)
                const dirIndex = resolve(__dirname, 'src', rewritten.slice(1).replace(/\.html$/, '/index.html'));
                try {
                  const rawHtml = readFileSync(dirIndex, 'utf-8');
                  const transformed = await server.transformIndexHtml(rewritten, rawHtml);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'text/html; charset=utf-8');
                  res.end(transformed);
                  return;
                } catch {
                  // fall through to next middleware (likely 404 handler)
                }
              }
            }

            next();
          });
        };
      },
      // Apply similar rewrites for `vite preview` so localhost:4173/about works
      configurePreviewServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            const url = req.url?.split('?')[0] || '/';

            if (
              url.startsWith('/@') ||
              url.startsWith('/assets/') ||
              url.includes('.')
            ) {
              return next();
            }

            if (url !== '/') {
              const pageName = url.replace(/^\/+|\/+$/g, '');
                const htmlPath = resolve(__dirname, 'dist', 'pages', `${pageName}.html`);
              const indexPath = resolve(__dirname, 'dist', 'pages', pageName, 'index.html');

              // Try /dist/pages/<name>.html
              if (existsSync(htmlPath)) {
                const rawHtml = readFileSync(htmlPath, 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(rawHtml);
                return;
              }

              // Try /dist/pages/<name>/index.html
              if (existsSync(indexPath)) {
                const rawHtml = readFileSync(indexPath, 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(rawHtml);
                return;
              }
            }

            // Also keep supporting /pages/about style URLs in preview
            if (url.startsWith('/pages/')) {
              let rewritten = url;
              if (!rewritten.endsWith('.html')) {
                rewritten = rewritten.endsWith('/') ? rewritten.slice(0, -1) : rewritten;
                rewritten = `${rewritten}.html`;
              }
              const filePath = resolve(__dirname, 'dist', rewritten.slice(1));
              if (existsSync(filePath)) {
                const rawHtml = readFileSync(filePath, 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(rawHtml);
                return;
              }
            }

            next();
          });
        };
      },
    },
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    rollupOptions: {
      input: getPageInputs(),
      output: {
        manualChunks: (id) => {
          if (id.includes('assistant.js')) return 'assistant';
          // Split node_modules into vendor chunks
          if (id.includes('node_modules')) {
            // Sharp is a large image processing library
            if (id.includes('sharp')) {
              return 'vendor-image';
            }
            // All other node_modules go to vendor
            return 'vendor';
          }
          // Split large local modules
          if (id.includes('src/scripts/modules')) {
            const moduleName = id.split('modules/')[1]?.split('.')[0];
            // Group heavy modules together
            if (['projects', 'blog', 'openSource', 'speaking'].includes(moduleName)) {
              return 'modules-content';
            }
            if (['forms', 'pwa_perf', 'analytics'].includes(moduleName)) {
              return 'modules-core';
            }
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Optimize chunk splitting
    chunkSizeWarningLimit: 1000
  }
})