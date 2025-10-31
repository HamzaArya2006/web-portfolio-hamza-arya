import { speakingEngagements, publications } from '../../data/speaking.js';

export function renderSpeakingEngagements() {
  const container = document.getElementById('speaking-engagements');
  if (!container) return;
  
  const upcoming = speakingEngagements.filter(e => e.upcoming);
  const past = speakingEngagements.filter(e => !e.upcoming);
  
  container.innerHTML = `
    ${upcoming.length > 0 ? `
      <div class="mb-12">
        <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
          <span class="text-emerald-400">📅 Upcoming Events</span>
        </h3>
        <div class="grid gap-6 md:grid-cols-2">
          ${upcoming.map(event => renderEvent(event, true)).join('')}
        </div>
      </div>
    ` : ''}
    ${past.length > 0 ? `
      <div>
        <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
          <span class="text-gray-400">🎤 Past Engagements</span>
        </h3>
        <div class="grid gap-6 md:grid-cols-2">
          ${past.map(event => renderEvent(event, false)).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

function renderEvent(event, isUpcoming) {
  const typeColors = {
    'Conference Talk': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Workshop': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Podcast': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  };
  
  return `
    <div class="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all ${isUpcoming ? 'border-emerald-500/30' : ''}">
      ${isUpcoming ? '<div class="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-max mb-3">🚀 Coming Soon</div>' : ''}
      <span class="text-xs px-3 py-1 rounded-full ${typeColors[event.type]} border w-max mb-3">${event.type}</span>
      <h3 class="font-semibold text-white mb-2">${event.title}</h3>
      <div class="text-sm text-gray-300 mb-4">
        <p class="font-medium">${event.event}</p>
        <p class="text-gray-400">${event.location}</p>
        ${event.attendees ? `<p class="text-gray-400">👥 ${event.attendees} attendees</p>` : ''}
      </div>
      <div class="flex items-center gap-3 text-xs text-gray-400 mb-4">
        <span>📅 ${new Date(event.date).toLocaleDateString()}</span>
      </div>
      <div class="flex gap-3">
        ${event.slides ? `<a href="${event.slides}" target="_blank" rel="noopener" class="text-sm text-blue-400 hover:text-blue-300">Slides</a>` : ''}
        ${event.recording ? `<a href="${event.recording}" target="_blank" rel="noopener" class="text-sm text-blue-400 hover:text-blue-300">Watch</a>` : ''}
      </div>
    </div>
  `;
}

export function renderPublications() {
  const container = document.getElementById('publications');
  if (!container) return;
  
  container.innerHTML = publications.map(pub => {
    const typeColors = {
      'Article': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Tutorial': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Guide': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    
    return `
      <div class="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
        <div class="flex items-start justify-between mb-3">
          <span class="text-xs px-3 py-1 rounded-full ${typeColors[pub.type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'} border w-max">${pub.type}</span>
          <span class="text-xs text-gray-400">${new Date(pub.date).toLocaleDateString()}</span>
        </div>
        <h3 class="font-semibold text-white mb-2">${pub.title}</h3>
        <p class="text-sm text-gray-400 mb-4">Published in ${pub.publication}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          ${pub.tags.map(tag => `<span class="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300">${tag}</span>`).join('')}
        </div>
        <a href="${pub.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
          Read Article
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15,3 21,3 21,9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    `;
  }).join('');
}

