export const blogPosts = [
  {
    id: 'modern-web-performance',
    title: 'Modern Web Performance: Beyond Core Web Vitals',
    slug: 'modern-web-performance',
    excerpt: 'Explore advanced performance optimization techniques that go beyond basic Core Web Vitals to create truly exceptional user experiences.',
    summary: 'Advanced performance optimization techniques that go beyond basic Core Web Vitals to create exceptional user experiences with measurable business impact.',
    content: `
      <p>Web performance has evolved far beyond simple page load times. Today's users expect instant interactions, smooth animations, and seamless experiences across all devices.</p>
      
      <h3>Advanced Optimization Strategies</h3>
      <p>Modern performance optimization involves multiple layers:</p>
      <ul>
        <li><strong>Critical Resource Hints:</strong> Preload, prefetch, and preconnect for optimal resource delivery</li>
        <li><strong>Code Splitting:</strong> Dynamic imports and route-based splitting</li>
        <li><strong>Image Optimization:</strong> WebP, AVIF, and responsive images</li>
        <li><strong>Service Workers:</strong> Offline functionality and background sync</li>
      </ul>
      
      <h3>Real-World Impact</h3>
      <p>In my recent projects, implementing these techniques resulted in:</p>
      <ul>
        <li>40% improvement in First Contentful Paint</li>
        <li>60% reduction in Cumulative Layout Shift</li>
        <li>25% increase in user engagement</li>
      </ul>
    `,
    author: 'Hamza Arya',
    date: '2024-01-15',
    readTime: '8 min read',
    readingTime: 8,
    category: 'Performance',
    tags: ['Performance', 'Web Vitals', 'Optimization', 'JavaScript'],
    featured: true,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    canonicalUrl: 'https://hamzaarya.dev/blog/modern-web-performance'
  },
  {
    id: 'react-architecture-patterns',
    title: 'React Architecture Patterns for Scalable Applications',
    slug: 'react-architecture-patterns',
    excerpt: 'Learn proven patterns and best practices for building maintainable React applications that scale with your team and business needs.',
    summary: 'Proven patterns and best practices for building maintainable React applications that scale with your team and business needs.',
    content: `
      <p>Building scalable React applications requires more than just knowing the framework. It's about establishing patterns that promote maintainability, testability, and team collaboration.</p>
      
      <h3>Key Architecture Patterns</h3>
      <ul>
        <li><strong>Component Composition:</strong> Building flexible, reusable components</li>
        <li><strong>Custom Hooks:</strong> Encapsulating logic and state management</li>
        <li><strong>Context API:</strong> Managing global state without external libraries</li>
        <li><strong>Error Boundaries:</strong> Graceful error handling and recovery</li>
      </ul>
      
      <h3>State Management Strategies</h3>
      <p>Choosing the right state management approach depends on your application's complexity and team size. For most applications, a combination of local state, context, and server state works best.</p>
    `,
    author: 'Hamza Arya',
    date: '2024-01-10',
    readTime: '12 min read',
    readingTime: 12,
    category: 'React',
    tags: ['React', 'Architecture', 'JavaScript', 'Best Practices'],
    featured: true,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    canonicalUrl: 'https://hamzaarya.dev/blog/react-architecture-patterns'
  },
  {
    id: 'api-design-best-practices',
    title: 'RESTful API Design: Best Practices for 2024',
    slug: 'api-design-best-practices',
    excerpt: 'Design APIs that developers love to use. Learn modern RESTful design principles, versioning strategies, and documentation techniques.',
    summary: 'Modern RESTful design principles, versioning strategies, and documentation techniques for building APIs that developers love to use.',
    content: `
      <p>Great APIs are invisible to users but crucial for developers. They should be intuitive, consistent, and well-documented.</p>
      
      <h3>Design Principles</h3>
      <ul>
        <li><strong>Resource-Based URLs:</strong> Clear, hierarchical endpoint structure</li>
        <li><strong>HTTP Methods:</strong> Proper use of GET, POST, PUT, DELETE</li>
        <li><strong>Status Codes:</strong> Meaningful response codes for different scenarios</li>
        <li><strong>Error Handling:</strong> Consistent error response format</li>
      </ul>
      
      <h3>Versioning Strategies</h3>
      <p>API versioning is essential for maintaining backward compatibility while introducing new features. URL versioning, header versioning, and content negotiation each have their place.</p>
    `,
    author: 'Hamza Arya',
    date: '2024-01-05',
    readTime: '10 min read',
    readingTime: 10,
    category: 'Backend',
    tags: ['API', 'Backend', 'REST', 'Node.js'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    canonicalUrl: 'https://hamzaarya.dev/blog/api-design-best-practices'
  },
  {
    id: 'css-grid-vs-flexbox',
    title: 'CSS Grid vs Flexbox: When to Use Each',
    slug: 'css-grid-vs-flexbox',
    excerpt: 'Master the art of CSS layout with a comprehensive guide to Grid and Flexbox, including practical examples and use cases.',
    summary: 'Comprehensive guide to CSS Grid and Flexbox with practical examples and use cases for creating efficient, maintainable layouts.',
    content: `
      <p>CSS Grid and Flexbox are both powerful layout tools, but they serve different purposes. Understanding when to use each is key to creating efficient, maintainable layouts.</p>
      
      <h3>Flexbox: One-Dimensional Layouts</h3>
      <p>Use Flexbox for:</p>
      <ul>
        <li>Distributing space within a single row or column</li>
        <li>Centering content</li>
        <li>Creating flexible navigation bars</li>
        <li>Building card layouts with equal heights</li>
      </ul>
      
      <h3>Grid: Two-Dimensional Layouts</h3>
      <p>Use CSS Grid for:</p>
      <ul>
        <li>Complex page layouts</li>
        <li>Overlapping elements</li>
        <li>Precise positioning</li>
        <li>Responsive design without media queries</li>
      </ul>
    `,
    author: 'Hamza Arya',
    date: '2024-01-01',
    readTime: '6 min read',
    readingTime: 6,
    category: 'CSS',
    tags: ['CSS', 'Grid', 'Flexbox', 'Layout'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    canonicalUrl: 'https://hamzaarya.dev/blog/css-grid-vs-flexbox'
  },
  {
    id: 'typescript-tips-tricks',
    title: 'TypeScript Tips and Tricks for Better Code',
    slug: 'typescript-tips-tricks',
    excerpt: 'Level up your TypeScript skills with advanced techniques, utility types, and patterns that make your code more robust and maintainable.',
    summary: 'Advanced TypeScript techniques, utility types, and patterns that make your code more robust and maintainable.',
    content: `
      <p>TypeScript is more than just JavaScript with types. It's a powerful tool for building maintainable, scalable applications.</p>
      
      <h3>Advanced Type Techniques</h3>
      <ul>
        <li><strong>Utility Types:</strong> Pick, Omit, Partial, and Required</li>
        <li><strong>Conditional Types:</strong> Type-level programming</li>
        <li><strong>Template Literal Types:</strong> String manipulation at the type level</li>
        <li><strong>Mapped Types:</strong> Transforming existing types</li>
      </ul>
      
      <h3>Best Practices</h3>
      <p>Effective TypeScript usage involves understanding the type system deeply and using it to catch errors at compile time rather than runtime.</p>
    `,
    author: 'Hamza Arya',
    date: '2023-12-28',
    readTime: '9 min read',
    readingTime: 9,
    category: 'TypeScript',
    tags: ['TypeScript', 'JavaScript', 'Types', 'Best Practices'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop',
    canonicalUrl: 'https://hamzaarya.dev/blog/typescript-tips-tricks'
  },
  {
    id: 'docker-development-workflow',
    title: 'Docker for Development: Streamlining Your Workflow',
    slug: 'docker-development-workflow',
    excerpt: 'Set up a consistent development environment with Docker. Learn best practices for containerizing applications and managing dependencies.',
    summary: 'Best practices for setting up a consistent development environment with Docker, containerizing applications, and managing dependencies.',
    content: `
      <p>Docker has revolutionized how we develop, ship, and run applications. For developers, it provides consistency across different environments and simplifies dependency management.</p>
      
      <h3>Development Benefits</h3>
      <ul>
        <li><strong>Environment Consistency:</strong> Same environment across team members</li>
        <li><strong>Easy Setup:</strong> New team members can start coding immediately</li>
        <li><strong>Isolation:</strong> No conflicts between different project dependencies</li>
        <li><strong>Reproducible Builds:</strong> Same results every time</li>
      </ul>
      
      <h3>Best Practices</h3>
      <p>Effective Docker usage in development requires understanding multi-stage builds, volume management, and networking.</p>
    `,
    author: 'Hamza Arya',
    date: '2023-12-25',
    readTime: '7 min read',
    readingTime: 7,
    category: 'DevOps',
    tags: ['Docker', 'DevOps', 'Development', 'Containers'],
    featured: false,
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?q=80&w=800&auto=format&fit=crop',
    cover: 'https://images.unsplash.com/photo-1605745341112-85968b19335a?q=80&w=800&auto=format&fit=crop',
    canonicalUrl: 'https://hamzaarya.dev/blog/docker-development-workflow'
  }
];
