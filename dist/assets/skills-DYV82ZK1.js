const i={frontend:{category:"Frontend",description:"Building modern, responsive user interfaces with cutting-edge technologies",icon:"🎨",technologies:[{name:"React",proficiency:95,recent:!0,years:4},{name:"Next.js",proficiency:90,recent:!0,years:3},{name:"TypeScript",proficiency:92,recent:!0,years:3},{name:"Tailwind CSS",proficiency:95,recent:!0,years:4},{name:"Vite",proficiency:90,recent:!0,years:2},{name:"Vue.js",proficiency:80,recent:!1,years:2}]},backend:{category:"Backend",description:"Scalable server-side architecture and API development",icon:"⚙️",technologies:[{name:"Node.js",proficiency:93,recent:!0,years:4},{name:"Express",proficiency:90,recent:!0,years:4},{name:"Python",proficiency:85,recent:!0,years:3},{name:"REST APIs",proficiency:95,recent:!0,years:4},{name:"GraphQL",proficiency:75,recent:!0,years:2},{name:"PHP",proficiency:70,recent:!1,years:2}]},databases:{category:"Databases",description:"Data modeling, optimization, and management",icon:"🗄️",technologies:[{name:"PostgreSQL",proficiency:90,recent:!0,years:3},{name:"MongoDB",proficiency:85,recent:!0,years:3},{name:"Redis",proficiency:80,recent:!0,years:2},{name:"MySQL",proficiency:82,recent:!1,years:3}]},devops:{category:"DevOps & Cloud",description:"Deployment pipelines and infrastructure management",icon:"☁️",technologies:[{name:"AWS",proficiency:88,recent:!0,years:3},{name:"Docker",proficiency:90,recent:!0,years:3},{name:"CI/CD",proficiency:92,recent:!0,years:3},{name:"Vercel",proficiency:95,recent:!0,years:2},{name:"GitHub Actions",proficiency:88,recent:!0,years:2},{name:"Linux",proficiency:85,recent:!0,years:4}]},tools:{category:"Tools & Practices",description:"Development workflow and quality assurance",icon:"🛠️",technologies:[{name:"Git",proficiency:95,recent:!0,years:5},{name:"Testing",proficiency:85,recent:!0,years:3},{name:"Webpack",proficiency:80,recent:!1,years:2},{name:"Performance",proficiency:92,recent:!0,years:4},{name:"SEO",proficiency:88,recent:!0,years:4}]}};function c(){const r=document.getElementById("skills-container");r&&(r.innerHTML=Object.values(i).map(n=>{const t=n.technologies.filter(e=>e.recent).length;return`
      <div class="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">${n.icon}</span>
          <div>
            <h3 class="font-semibold text-white">${n.category}</h3>
            <p class="text-xs text-gray-400">${n.description}</p>
          </div>
        </div>
        <div class="space-y-4">
          ${n.technologies.map(e=>`
            <div class="skill-item">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-white">${e.name}</span>
                  ${e.recent?'<span class="text-xs text-emerald-400">Recent</span>':""}
                </div>
                <span class="text-xs text-gray-400">${e.proficiency}%</span>
              </div>
              <div class="skill-bar-container">
                <div class="skill-bar" style="width: ${e.proficiency}%;"></div>
              </div>
              ${e.years?`<div class="text-xs text-gray-500 mt-1">${e.years} years experience</div>`:""}
            </div>
          `).join("")}
        </div>
        ${t>0?`<div class="mt-4 text-xs text-emerald-400">✨ ${t} actively used</div>`:""}
      </div>
    `}).join(""))}export{c as renderSkills};
