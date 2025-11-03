# Content Structure Documentation

This document describes the evolved content/data structure for the portfolio site.

## Data Structure

### Blog Posts (`src/data/blog.js`)

Each blog post now includes the following structured fields:

```javascript
{
  id: 'unique-id',
  title: 'Post Title',
  slug: 'url-friendly-slug',
  excerpt: 'Short preview text',
  summary: 'Detailed summary for meta descriptions',
  content: 'HTML content of the post',
  author: 'Author Name',
  date: 'YYYY-MM-DD',
  readTime: '8 min read', // Display format
  readingTime: 8, // Numeric minutes
  category: 'Performance',
  tags: ['Performance', 'Web Vitals', 'Optimization'],
  featured: true/false,
  image: 'thumbnail-url',
  cover: 'cover-image-url',
  canonicalUrl: 'https://hamzaarya.dev/blog/slug'
}
```

### Projects (`src/data/projects.js`)

Each project now includes:

```javascript
{
  id: 'unique-id',
  title: 'Project Title',
  slug: 'url-friendly-slug',
  description: 'Project description',
  role: 'Lead Developer',
  stack: ['React', 'Node.js', 'PostgreSQL'],
  tags: ['SaaS', 'Analytics'],
  tech: 'Tech stack display string',
  image: 'primary-image-url',
  images: ['image1-url', 'image2-url'],
  links: {
    live: 'https://demo.url',
    code: 'https://github.com/repo'
  },
  category: 'saas',
  metrics: {
    conversion: '+18%',
    performance: '95/100'
  },
  features: ['Feature 1', 'Feature 2'],
  duration: '6 weeks',
  client: 'Client Name'
}
```

### Testimonials (`src/data/testimonials.js`)

Each testimonial now includes:

```javascript
{
  author: 'Client Name',
  role: 'CEO',
  company: 'Company Name',
  quote: 'Testimonial text',
  avatar: 'Initials',
  projectSlug: 'related-project-slug',
  rating: 5,
  project: 'Project Name',
  result: 'Key result'
}
```

## Build-Time Page Generation

The site generates individual HTML pages for each blog post and project at build time.

### Generation Script

**Script:** `scripts/generate-pages.mjs`

This script:
1. Imports blog and project data from `src/data/*.js`
2. Generates individual HTML pages in `src/pages/blog/` and `src/pages/projects/`
3. Creates fully-formed HTML with proper meta tags, Open Graph, Twitter cards
4. Includes breadcrumbs, tags, sharing links, and related content

### Build Process

The generation script runs automatically as part of the build process:

```bash
npm run build
```

This executes:
1. Image optimization (`scripts/optimize-images.mjs`)
2. **Page generation** (`scripts/generate-pages.mjs`)
3. Vite build with all generated pages

### Manual Generation

You can also run page generation manually:

```bash
npm run generate-pages
```

### Vite Configuration

The `vite.config.js` automatically includes all generated pages in the build. It:
1. Scans `src/pages/blog/` and `src/pages/projects/` directories
2. Adds all `.html` files as build inputs
3. Generates proper output paths for routing

## Benefits

1. **Structured Data**: Consistent, type-safe data structures
2. **SEO**: Each page gets proper meta tags, Open Graph, and Twitter cards
3. **Performance**: Static HTML pages generated at build time
4. **Maintainability**: Single source of truth in data files
5. **Scalability**: Easy to add new blog posts or projects by updating data files
6. **Type Safety**: Clear schema for each content type

## Adding New Content

### New Blog Post

1. Add entry to `src/data/blog.js`
2. Run `npm run generate-pages`
3. Commit changes

### New Project

1. Add entry to `src/data/projects.js`
2. Run `npm run generate-pages`
3. Commit changes

The build process will automatically include new pages in the production build.

## File Structure

```
src/
├── data/
│   ├── blog.js              # Blog posts data
│   ├── projects.js          # Projects data
│   └── testimonials.js      # Testimonials data
├── pages/
│   ├── blog/
│   │   ├── blog.html        # Blog index
│   │   ├── [slug].html      # Generated blog posts
│   │   └── ...
│   └── projects/
│       ├── [slug].html      # Generated project pages
│       └── ...
scripts/
└── generate-pages.mjs       # Page generator
```

## Next Steps

Potential enhancements:
- Add content previews in list views
- Generate related content suggestions
- Add RSS feed generation
- Create sitemap.xml from data
- Add JSON-LD structured data
- Implement pagination for large content sets

