const a=[{name:"Smashing Magazine",logo:"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&h=60&fit=crop",link:"https://smashingmagazine.com",alt:"Featured in Smashing Magazine"},{name:"Dev.to",logo:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=60&fit=crop",link:"https://dev.to",alt:"Featured on Dev.to"},{name:"CSS-Tricks",logo:"https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=150&h=60&fit=crop",link:"https://css-tricks.com",alt:"Featured on CSS-Tricks"},{name:"TechCrunch",logo:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=60&fit=crop",link:"https://techcrunch.com",alt:"Featured in TechCrunch"}],e=[{name:"TechFlow Solutions",logo:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&h=60&fit=crop",alt:"TechFlow Solutions logo"},{name:"CloudScale Inc.",logo:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=60&fit=crop",alt:"CloudScale Inc. logo"},{name:"RetailTech",logo:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&h=60&fit=crop",alt:"RetailTech logo"},{name:"DataCorp Analytics",logo:"https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&h=60&fit=crop",alt:"DataCorp Analytics logo"}];function s(){const t=document.getElementById("press-logos");t&&(t.innerHTML=a.map(o=>`
    <a href="${o.link}" target="_blank" rel="noopener" 
       class="flex items-center justify-center p-4 glass rounded-lg border border-white/10 hover:border-white/20 transition-all group"
       title="${o.alt}">
      <img src="${o.logo}" alt="${o.alt}" class="h-8 w-auto opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
    </a>
  `).join(""))}function n(){const t=document.getElementById("client-logos");t&&(t.innerHTML=e.map(o=>`
    <div class="flex items-center justify-center p-4 glass rounded-lg border border-white/10 hover:border-white/20 transition-all group"
         title="${o.alt}">
      <img src="${o.logo}" alt="${o.alt}" class="h-10 w-auto opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
    </div>
  `).join(""))}export{n as renderClientLogos,s as renderPressLogos};
