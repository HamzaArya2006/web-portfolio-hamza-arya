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
  // Manually specify admin to force dist/admin/index.html
  const inputs = {
    main: resolve(__dirname, 'index.html'),
    'admin/index': resolve(__dirname, 'src/pages/admin/index.html'),
    'pages/about': resolve(__dirname, 'src/pages/about.html'),
    'pages/blog': resolve(__dirname, 'src/pages/blog.html'),
    'pages/case-studies': resolve(__dirname, 'src/pages/case-studies.html'),
    'pages/contact': resolve(__dirname, 'src/pages/contact.html'),
    'pages/services': resolve(__dirname, 'src/pages/services.html'),
    'pages/resume': resolve(__dirname, 'src/pages/resume.html'),
    'pages/open-source': resolve(__dirname, 'src/pages/open-source.html'),
    'pages/speaking': resolve(__dirname, 'src/pages/speaking.html'),
  };

  // Collect blog posts - ignore any admin page by path
  const blogPosts = getHtmlFiles(resolve(__dirname, 'src/pages/blog'), 'pages/blog/');
  blogPosts.forEach(({ name, path }) => {
    inputs[name] = path;
  });

  // Collect project pages - ignore any admin page by path
  const projects = getHtmlFiles(resolve(__dirname, 'src/pages/projects'), 'pages/projects/');
  projects.forEach(({ name, path }) => {
    inputs[name] = path;
  });

  // DO NOT loop over src/pages in a way that would add src/pages/admin/index.html as 'pages/admin/index'
  // Any other dynamic loader (like one for miscellaneous pages) should filter or .filter(x => !x.path.includes('/admin/'))
  
  return inputs;
}

export default defineConfig({
  plugins: [
    compression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false }),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials')
    }),
    {
      name: 'admin-html-handler',
      enforce: 'pre', // Run before other plugins
      configureServer(server) {
        // Register middleware immediately to intercept /admin routes early
        const adminHandler = async (req, res, next) => {
          // Skip non-GET requests immediately
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            next();
            return;
          }

          if (!req.url) {
            next();
            return;
          }

          // More robust URL parsing
          let pathname = '/';
          try {
            // Remove query string and hash
            const pathOnly = req.url.split('?')[0].split('#')[0];
            // Normalize trailing slashes
            pathname = pathOnly.endsWith('/') && pathOnly.length > 1 
              ? pathOnly.slice(0, -1) 
              : pathOnly;
            // Ensure it starts with /
            if (!pathname.startsWith('/')) {
              pathname = '/' + pathname;
            }
          } catch (err) {
            // Fallback parsing
            pathname = req.url.split('?')[0].split('#')[0];
          }

          // Check if this is an admin path
          const normalizedPath = pathname.toLowerCase();
          const isAdminPath = normalizedPath === '/admin' || 
                             normalizedPath === '/admin/' ||
                             normalizedPath.startsWith('/admin/index');

          if (!isAdminPath) {
            next();
            return;
          }

          // Handle admin route
          try {
            const adminHtmlPath = resolve(__dirname, 'src/pages/admin/index.html');
            
            // Check if file exists
            if (!existsSync(adminHtmlPath)) {
              console.error(`[admin-html-handler] Admin file not found at: ${adminHtmlPath}`);
              res.statusCode = 404;
              res.end('Admin page not found');
              return;
            }

            const rawHtml = readFileSync(adminHtmlPath, 'utf-8');
            const transformed = await server.transformIndexHtml('/admin/index.html', rawHtml);
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.end(transformed);
          } catch (error) {
            console.error('[admin-html-handler] Error serving admin page:', error);
            res.statusCode = 500;
            res.end('Error loading admin page');
          }
        };

        // Register middleware at the beginning
        server.middlewares.use(adminHandler);
      },
      writeBundle() {
        const builtAdminPath = resolve(__dirname, 'dist/src/pages/admin/index.html');
        const targetDir = resolve(__dirname, 'dist/admin');
        try {
          if (existsSync(builtAdminPath)) {
            mkdirSync(targetDir, { recursive: true });
            copyFileSync(builtAdminPath, resolve(targetDir, 'index.html'));
          }
        } catch (error) {
          console.warn('[admin-html-handler] Failed to copy admin build output:', error);
        }
      },
    },
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
                // Skip admin directory (handled by admin-html-handler)
                if (entry.name === 'admin') {
                  continue;
                }
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
                  // Skip admin directory
                  if (entry.name === 'admin') {
                    continue;
                  }
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
              // Try to remove the directory itself if it's empty or only contains admin
              try {
                const remainingEntries = readdirSync(dir);
                if (remainingEntries.length === 0 || (remainingEntries.length === 1 && remainingEntries[0] === 'admin')) {
                  // Don't remove if admin is the only thing left
                  if (remainingEntries.length === 0) {
                    rmdirSync(dir);
                  }
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
            if (req.url && req.url.startsWith('/pages/')) {
              let url = req.url;
              if (!url.endsWith('.html')) {
                url = url.endsWith('/') ? url.slice(0, -1) : url;
                url = `${url}.html`;
              }
              const filePath = resolve(__dirname, 'src', url.slice(1));
              try {
                const rawHtml = readFileSync(filePath, 'utf-8');
                const transformed = await server.transformIndexHtml(url, rawHtml);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(transformed);
                return;
              } catch (err) {
                // fallback: try directory index.html (e.g. /pages/admin -> /pages/admin/index.html)
                const dirIndex = resolve(__dirname, 'src', url.slice(1).replace(/\.html$/, '/index.html'));
                try {
                  const rawHtml = readFileSync(dirIndex, 'utf-8');
                  const transformed = await server.transformIndexHtml(url, rawHtml);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'text/html; charset=utf-8');
                  res.end(transformed);
                  return;
                } catch (err2) {
                  // fall through to next middleware (likely 404 handler)
                }
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