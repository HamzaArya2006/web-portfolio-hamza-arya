import { skills } from '../../data/skills.js';

export function renderSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  container.innerHTML = Object.values(skills)
    .map((skill) => {
      const recentCount = skill.technologies.filter((t) => t.recent).length;

      return `
      <div class="service-card skill-card group">
        <div class="service-icon">
          <span class="text-2xl md:text-3xl">${skill.icon}</span>
        </div>
        <h3 class="service-title">${skill.category}</h3>
        <p class="service-description">
          ${skill.description}
        </p>
        <ul class="skill-tech-list">
          ${skill.technologies
            .map(
              (tech) => `
            <li class="skill-tech-pill">
              <span class="skill-tech-name">${tech.name}</span>
              ${
                tech.recent
                  ? '<span class="skill-tech-badge">Recent</span>'
                  : ''
              }
              <span class="skill-tech-meta">
                ${tech.proficiency}%${
                  tech.years ? ` · ${tech.years} yrs` : ''
                }
              </span>
            </li>
          `,
            )
            .join('')}
        </ul>
        ${
          recentCount > 0
            ? `<p class="skill-card-footnote">${recentCount} actively used in recent work</p>`
            : ''
        }
      </div>
    `;
    })
    .join('');
}

