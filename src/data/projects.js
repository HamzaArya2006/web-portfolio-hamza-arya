export const projects = [
  {
    title: 'E‑commerce Analytics Dashboard',
    description: 'Real-time analytics platform that increased checkout conversion by 18% through optimized user flows and intelligent caching strategies.',
    tech: 'React • Node.js • PostgreSQL • Redis • Chart.js',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    links: { 
      live: 'https://analytics-demo.hamzaarya.dev', 
      code: 'https://github.com/hamza/ecommerce-analytics' 
    },
    category: 'saas',
    metrics: {
      conversion: '+18%',
      performance: '95/100',
      users: '10K+'
    },
    features: ['Real-time dashboards', 'Custom reporting', 'A/B testing', 'Mobile responsive'],
    duration: '6 weeks',
    client: 'TechFlow Solutions'
  },
  {
    title: 'B2B SaaS Platform',
    description: 'Comprehensive project management platform that reduced client onboarding time by 40% with intuitive guided tours and comprehensive API documentation.',
    tech: 'React • Express • PostgreSQL • Stripe • Docker',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    links: { 
      live: 'https://saas-platform.hamzaarya.dev', 
      code: 'https://github.com/hamza/b2b-saas-platform' 
    },
    category: 'saas',
    metrics: {
      onboarding: '-40%',
      satisfaction: '4.8/5',
      retention: '92%'
    },
    features: ['Team collaboration', 'Project tracking', 'Payment integration', 'API documentation'],
    duration: '12 weeks',
    client: 'CloudScale Inc.'
  },
  {
    title: 'Local Services Website',
    description: 'High-converting local business website that boosted qualified leads by 2.3× through performance optimization and strategic local SEO implementation.',
    tech: 'Vite • Tailwind CSS • Netlify • Google Analytics',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    links: { 
      live: 'https://localservices.hamzaarya.dev', 
      code: 'https://github.com/hamza/local-services-site' 
    },
    category: 'web',
    metrics: {
      leads: '+230%',
      speed: '98/100',
      seo: '95/100'
    },
    features: ['Local SEO', 'Contact forms', 'Service booking', 'Mobile-first design'],
    duration: '3 weeks',
    client: 'Local Business Co.'
  },
  {
    title: 'Headless Commerce Storefront',
    description: 'Lightning-fast e-commerce platform with SSR and CDN caching delivering sub-second product pages even under peak traffic loads.',
    tech: 'Next.js • Stripe • Cloudflare • Sanity CMS',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop',
    links: { 
      live: 'https://storefront.hamzaarya.dev', 
      code: 'https://github.com/hamza/headless-commerce' 
    },
    category: 'commerce',
    metrics: {
      speed: '0.8s',
      conversion: '+25%',
      uptime: '99.9%'
    },
    features: ['Headless CMS', 'Payment processing', 'Inventory management', 'Order tracking'],
    duration: '8 weeks',
    client: 'RetailTech'
  },
  {
    title: 'Analytics ETL Pipeline',
    description: 'Automated data processing pipeline that handles nightly ETL operations into data warehouse with comprehensive quality checks and monitoring.',
    tech: 'Node.js • Apache Airflow • BigQuery • Python',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop',
    links: { 
      live: 'https://etl-dashboard.hamzaarya.dev', 
      code: 'https://github.com/hamza/analytics-etl' 
    },
    category: 'data',
    metrics: {
      processing: '1M+ rows/day',
      accuracy: '99.8%',
      latency: '<5min'
    },
    features: ['Data validation', 'Error handling', 'Monitoring', 'Scalable architecture'],
    duration: '4 weeks',
    client: 'DataCorp Analytics'
  },
  {
    title: 'Marketing Microsite Engine',
    description: 'Rapid deployment system that launched multi-region marketing microsites with a flexible templating system in just 1 week.',
    tech: 'Vite • Tailwind CSS • Cloudflare Pages • Netlify Forms',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop',
    links: { 
      live: 'https://microsites.hamzaarya.dev', 
      code: 'https://github.com/hamza/microsite-engine' 
    },
    category: 'web',
    metrics: {
      deployment: '1 week',
      sites: '15+',
      performance: '100/100'
    },
    features: ['Template system', 'Multi-region', 'Form handling', 'Analytics integration'],
    duration: '1 week',
    client: 'Marketing Agency Pro'
  },
  {
    title: 'Real-time Chat Application',
    description: 'Scalable chat platform with real-time messaging, file sharing, and video calls supporting thousands of concurrent users.',
    tech: 'React • Socket.io • Node.js • MongoDB • WebRTC',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1200&auto=format&fit=crop',
    links: { 
      live: 'https://chat-app.hamzaarya.dev', 
      code: 'https://github.com/hamza/realtime-chat' 
    },
    category: 'saas',
    metrics: {
      users: '5K+ concurrent',
      latency: '<100ms',
      uptime: '99.95%'
    },
    features: ['Real-time messaging', 'File sharing', 'Video calls', 'Group management'],
    duration: '10 weeks',
    client: 'Communication Solutions'
  },
  {
    title: 'AI-Powered Content Generator',
    description: 'Intelligent content creation platform that generates SEO-optimized articles and social media posts using advanced AI models.',
    tech: 'Next.js • OpenAI API • Prisma • PostgreSQL • Vercel',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
    links: { 
      live: 'https://ai-content.hamzaarya.dev', 
      code: 'https://github.com/hamza/ai-content-generator' 
    },
    category: 'saas',
    metrics: {
      content: '1000+ articles',
      quality: '4.7/5',
      time_saved: '80%'
    },
    features: ['AI writing', 'SEO optimization', 'Content scheduling', 'Analytics'],
    duration: '8 weeks',
    client: 'Content Marketing Co.'
  }
];


