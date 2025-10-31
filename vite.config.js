import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import handlebars from 'vite-plugin-handlebars'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

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
    rollupOptions: {
      input: {
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
    }
  }
})