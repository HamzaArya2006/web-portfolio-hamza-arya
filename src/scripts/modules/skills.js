import { skills } from '../../data/skills.js';

export function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;
  
  container.innerHTML = Object.values(skills).map(skill => {
    const recentCount = skill.technologies.filter(t => t.recent).length;
    return `
      <div class="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">${skill.icon}</span>
          <div>
            <h3 class="font-semibold text-white">${skill.category}</h3>
            <p class="text-xs text-gray-400">${skill.description}</p>
          </div>
        </div>
        <div class="space-y-4">
          ${skill.technologies.map(tech => `
            <div class="skill-item">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-white">${tech.name}</span>
                  ${tech.recent ? '<span class="text-xs text-emerald-400">Recent</span>' : ''}
                </div>
                <span class="text-xs text-gray-400">${tech.proficiency}%</span>
              </div>
              <div class="skill-bar-container">
                <div class="skill-bar" style="width: ${tech.proficiency}%;"></div>
              </div>
              ${tech.years ? `<div class="text-xs text-gray-500 mt-1">${tech.years} years experience</div>` : ''}
            </div>
          `).join('')}
        </div>
        ${recentCount > 0 ? `<div class="mt-4 text-xs text-emerald-400">✨ ${recentCount} actively used</div>` : ''}
      </div>
    `;
  }).join('');
}

