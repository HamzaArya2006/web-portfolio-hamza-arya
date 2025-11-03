import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import handlebars from 'vite-plugin-handlebars'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync } from 'fs'

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
    'pages/case-studies': resolve(__dirname, 'src/pages/case-studies.html'),
    'pages/contact': resolve(__dirname, 'src/pages/contact.html'),
    'pages/services': resolve(__dirname, 'src/pages/services.html'),
    'pages/resume': resolve(__dirname, 'src/pages/resume.html'),
    'pages/open-source': resolve(__dirname, 'src/pages/open-source.html'),
    'pages/speaking': resolve(__dirname, 'src/pages/speaking.html'),
  }

  // Add dynamically generated blog posts
  const blogPosts = getHtmlFiles(resolve(__dirname, 'src/pages/blog'), 'pages/blog/')
  blogPosts.forEach(({ name, path }) => {
    inputs[name] = path
  })

  // Add dynamically generated project pages
  const projects = getHtmlFiles(resolve(__dirname, 'src/pages/projects'), 'pages/projects/')
  projects.forEach(({ name, path }) => {
    inputs[name] = path
  })

  return inputs
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
          server.middlewares.use((req, _res, next) => {
            if (req.url && req.url.startsWith('/pages/')) {
              req.url = `/src${req.url}`;
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
        manualChunks: {
          'vendor-core': [],
          'vendor-utils': []
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