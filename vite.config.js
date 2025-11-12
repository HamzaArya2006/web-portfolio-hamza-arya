import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import handlebars from 'vite-plugin-handlebars'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, readFileSync, existsSync, mkdirSync, copyFileSync } from 'fs'

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
    {
      name: 'admin-html-handler',
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            if (req.method !== 'GET') {
              next();
              return;
            }

            const { pathname } = new URL(req.url || '/', 'http://localhost');
            const adminPaths = new Set(['/admin', '/admin/', '/admin/index', '/admin/index.html']);

            if (!adminPaths.has(pathname)) {
              next();
              return;
            }

            try {
              const adminHtmlPath = resolve(__dirname, 'src/pages/admin/index.html');
              const rawHtml = readFileSync(adminHtmlPath, 'utf-8');
              const transformed = await server.transformIndexHtml('/admin/index.html', rawHtml);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(transformed);
            } catch (error) {
              next(error);
            }
          });
        };
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