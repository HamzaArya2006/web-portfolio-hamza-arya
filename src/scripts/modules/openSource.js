import { openSourceContributions, pinnedRepos } from '../../data/openSource.js';

export function renderOpenSourceContributions() {
  const contributionsContainer = document.getElementById('open-source-contributions');
  if (!contributionsContainer) return;
  
  contributionsContainer.innerHTML = openSourceContributions.map(contrib => `
    <div class="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="font-semibold text-white">${contrib.repo}</h3>
          <p class="text-sm text-gray-300 mt-1">${contrib.contribution}</p>
        </div>
        <span class="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          ${contrib.type}
        </span>
      </div>
      <div class="flex items-center gap-4 text-xs text-gray-400">
        <span>⭐ ${contrib.stars.toLocaleString()}</span>
        <span>📅 ${new Date(contrib.date).toLocaleDateString()}</span>
      </div>
      <a href="${contrib.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-4 text-sm text-blue-400 hover:text-blue-300">
        View on GitHub
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16,18 22,12 16,6"></polyline>
          <polyline points="8,6 2,12 8,18"></polyline>
        </svg>
      </a>
    </div>
  `).join('');
}

export function renderPinnedRepos() {
  const reposContainer = document.getElementById('pinned-repos');
  if (!reposContainer) return;
  
  reposContainer.innerHTML = pinnedRepos.map(repo => `
    <div class="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all ${repo.featured ? 'border-blue-500/30' : ''}">
      ${repo.featured ? '<div class="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 w-max mb-3">⭐ Featured</div>' : ''}
      <h3 class="font-semibold text-white mb-2">${repo.name}</h3>
      <p class="text-sm text-gray-300 mb-4">${repo.description}</p>
      <div class="flex items-center gap-4 text-xs text-gray-400 mb-4">
        <span>⭐ ${repo.stars}</span>
        <span class="px-2 py-1 rounded bg-gray-800">${repo.language}</span>
      </div>
      <a href="${repo.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
        View Repository
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15,3 21,3 21,9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </div>
  `).join('');
}

