import { blogPosts } from '../../data/blog.js';

let currentBlogFilter = 'all';

export function renderBlogPosts() {
  const container = document.getElementById('blog-content');
  if (!container) return;
  const filtered = blogPosts.filter(post => currentBlogFilter === 'all' || post.category === currentBlogFilter);
  container.innerHTML = filtered
    .map((post) => {
      const formattedDate = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      return `
        <article data-reveal class="opacity-0 translate-y-6 blog-post-card">
          <div class="blog-post-image">
            <img 
              width="400" 
              height="250" 
              alt="${post.title}" 
              class="blog-image" 
              loading="lazy"
              decoding="async"
              data-src="${post.image}"
            />
            ${post.featured ? '<div class="featured-badge">Featured</div>' : ''}
          </div>
          <div class="blog-post-content">
            <div class="blog-meta">
              <span class="blog-category">${post.category}</span>
              <span class="blog-date">${formattedDate}</span>
              <span class="blog-read-time">${post.readTime}</span>
            </div>
            <h2 class="blog-title">${post.title}</h2>
            <p class="blog-excerpt">${post.excerpt}</p>
            <div class="blog-tags">
              ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
            <a href="#blog-post-${post.id}" class="blog-read-more" data-post-id="${post.id}">
              Read Article
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </a>
          </div>
        </article>
      `;
    })
    .join('');
}

export function bindBlogFilters() {
  const filters = document.getElementById('blog-filters');
  if (!filters) return;
  const buttons = filters.querySelectorAll('.blog-filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentBlogFilter = btn.getAttribute('data-category') || 'all';
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBlogPosts();
    });
  });
}

export function bindBlogPostHandlers() {
  const readMoreLinks = document.querySelectorAll('.blog-read-more');
  readMoreLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = link.getAttribute('data-post-id');
      showBlogPost(postId);
    });
  });
}

export function showBlogPost(postId) {
  const post = blogPosts.find(p => p.id === postId);
  if (!post) return;
  const modal = document.createElement('div');
  modal.className = 'blog-modal';
  modal.innerHTML = `
    <div class="blog-modal-overlay">
      <div class="blog-modal-content">
        <button class="blog-modal-close" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <article class="blog-post-full">
          <header class="blog-post-header">
            <div class="blog-meta">
              <span class="blog-category">${post.category}</span>
              <span class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span class="blog-read-time">${post.readTime}</span>
            </div>
            <h1 class="blog-post-title">${post.title}</h1>
            <p class="blog-post-subtitle">${post.excerpt}</p>
            <div class="blog-tags">
              ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
          </header>
          <div class="blog-post-body">${post.content}</div>
          <footer class="blog-post-footer">
            <div class="blog-author">
              <div class="author-avatar">${post.author.split(' ').map(n => n[0]).join('')}</div>
              <div class="author-info">
                <div class="author-name">${post.author}</div>
                <div class="author-title">Full-Stack Developer</div>
              </div>
            </div>
            <div class="blog-share">
              <button class="share-btn" data-url="${window.location.origin}/blog#${post.id}" data-title="${post.title}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16,6 12,2 8,6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                Share
              </button>
            </div>
          </footer>
        </article>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  const closeBtn = modal.querySelector('.blog-modal-close');
  const overlay = modal.querySelector('.blog-modal-overlay');
  const closeModal = () => {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
  };
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}


