import"../main-CIXZckt1.js";import{n as c}from"../modules-core-aybpRuGB.js";const j="portfolio_admin_token",l={token:null,admin:null,projects:[],customizations:new Map,projectCustomizations:new Map,activity:[]};function ee(){const e=localStorage.getItem(j);return e&&(l.token=e),l}function u(){return l}function te(e){l.token=e,e?localStorage.setItem(j,e):localStorage.removeItem(j)}function J(e){l.admin=e}function R(e){l.projects=e}function ae(e){const t=l.projects.findIndex(a=>a.id===e.id);t>=0?l.projects[t]=e:l.projects.push(e)}function oe(e){l.projects=l.projects.filter(t=>t.id!==e)}function ne(e){l.customizations=new Map(e.map(t=>[t.key,t]))}function se(e,t){l.customizations.set(e,t)}function G(e,t){l.projectCustomizations.set(e,t)}function C(e){l.activity.unshift({...e,timestamp:Date.now()}),l.activity=l.activity.slice(0,25)}function W(){l.token=null,l.admin=null,l.projects=[],l.customizations.clear(),l.projectCustomizations.clear(),l.activity=[],localStorage.removeItem(j)}const re="http://localhost:3001";async function y(e,{token:t,method:a="GET",body:o,headers:n={}}={}){const r={method:a,headers:{"Content-Type":"application/json",...n}};t&&(r.headers.Authorization=`Bearer ${t}`),o!==void 0&&(r.body=JSON.stringify(o));const s=await fetch(`${re}${e}`,r);if(!s.ok){let i;try{i=await s.json()}catch{i={error:s.statusText||"Request failed"}}const m=new Error(i.error||"Request failed");throw m.status=s.status,m.details=i,m}if(s.status===204)return null;try{return await s.json()}catch{const m=new Error("Invalid JSON response");throw m.status=s.status,m.details={error:"Invalid JSON response"},m}}async function ie(e,t){return y("/api/auth/login",{method:"POST",body:{email:e,password:t}})}async function ce(e){return y("/api/auth/profile",{token:e})}async function le(e){return y("/api/projects",{token:e})}async function de(e,t){return y("/api/projects",{token:e,method:"POST",body:t})}async function ue(e,t,a){return y(`/api/projects/${t}`,{token:e,method:"PUT",body:a})}async function me(e,t){return y(`/api/projects/${t}`,{token:e,method:"DELETE"})}async function fe(e,t){throw new Error("Projects reordering is not available in this configuration.")}async function pe(e){try{return await y("/api/customizations",{token:e})}catch(t){if(t.status===404||t.status===501)return console.warn("[customizations] API not available, using defaults."),[];throw t}}async function he(e,t,a,o="string"){throw new Error("Customization API is not available in this configuration.")}async function ge(e,t){try{return await y(`/api/customizations/projects/${t}`,{token:e})}catch(a){if(a.status===404||a.status===501)return{project_id:Number(t),settings:{}};throw a}}async function ye(e,t,a){throw new Error("Customization API is not available in this configuration.")}async function ve(e){try{return y("/api/customizations/activity",{token:e})}catch(t){if(t.status===404)return{logs:[]};throw t}}async function be(){return y("/health")}const we=[{id:"hero",title:"Hero section",description:"Headline copy and supporting text shown above the fold.",fields:[{key:"hero.title",label:"Hero Title",type:"text",placeholder:"Fast, reliable web apps for founders."},{key:"hero.subtitle",label:"Hero Subtitle",type:"textarea",rows:3},{key:"hero.cta.primary",label:"Primary CTA Label",type:"text",placeholder:"View case studies"},{key:"hero.cta.secondary",label:"Secondary CTA Label",type:"text",placeholder:"Book a call"}]},{id:"theme",title:"Theme colors",description:"Adjust key accent colors across the portfolio.",fields:[{key:"theme.primary",label:"Primary Accent",type:"color",defaultValue:"#3b82f6"},{key:"theme.secondary",label:"Secondary Accent",type:"color",defaultValue:"#6366f1"},{key:"theme.primary.hover",label:"Primary Hover",type:"color",defaultValue:"#1d4ed8"},{key:"theme.secondary.hover",label:"Secondary Hover",type:"color",defaultValue:"#4338ca"}]},{id:"meta",title:"Metadata & SEO",description:"Update page titles and descriptions used for SEO.",fields:[{key:"meta.home.title",label:"Home Title",type:"text"},{key:"meta.home.description",label:"Home Description",type:"textarea",rows:3}]}];let $,b,D,w,_,f,d,h,q,M,T,k,S,N,L,P="",I="",B="";const xe=ee();async function ke(){if(Se(),$e(),await Ke(),xe.token)try{await Y();return}catch(e){console.warn("Stored token invalid:",e.message),W()}Z()}function Se(){w=document.getElementById("admin-loader"),D=document.getElementById("admin-login"),_=document.getElementById("admin-dashboard"),$=document.getElementById("login-form"),b=document.getElementById("login-error"),f=document.getElementById("projects-list"),d=document.getElementById("projects-empty"),h=document.getElementById("customization-groups"),q=document.getElementById("custom-css"),M=document.getElementById("custom-hero"),T=document.getElementById("activity-log"),k=document.getElementById("status-api"),S=document.getElementById("status-db"),N=document.getElementById("status-sync"),L=document.getElementById("projects-filter"),B=(d==null?void 0:d.textContent.trim())||""}function $e(){var o,n,r,s,i,m,E,H,U,F;(o=document.getElementById("admin-logout"))==null||o.addEventListener("click",()=>{W(),Z(),c.info("Signed out","You have been logged out.")}),(n=document.getElementById("sync-customizations"))==null||n.addEventListener("click",()=>{K(!0)});const e=document.querySelectorAll(".admin-nav-btn[data-panel]");e.forEach(g=>{g.addEventListener("click",()=>{e.forEach(X=>X.classList.remove("active")),g.classList.add("active"),Ye(g.dataset.panel)})}),(r=document.querySelector("[data-sidebar-toggle]"))==null||r.addEventListener("click",ze),(s=document.querySelector('[data-action="sign-out"]'))==null||s.addEventListener("click",()=>{var g;(g=document.getElementById("admin-logout"))==null||g.click()}),(i=document.querySelector('[data-action="switch-user"]'))==null||i.addEventListener("click",Te),(m=document.querySelector('[data-action="create-user"]'))==null||m.addEventListener("click",Ie),(E=document.querySelector('[data-action="manage-users"]'))==null||E.addEventListener("click",Be);const t=window.matchMedia("(max-width: 1024px)"),a=g=>{Q(g.matches?"collapsed":"expanded")};a(t),t.addEventListener("change",a),L==null||L.addEventListener("input",g=>{I=g.target.value,P=I.trim().toLowerCase(),z()}),$==null||$.addEventListener("submit",Ce),(H=document.getElementById("create-project"))==null||H.addEventListener("click",()=>{Ae()}),f==null||f.addEventListener("click",De),f==null||f.addEventListener("input",_e),h==null||h.addEventListener("input",V),h==null||h.addEventListener("change",V),(U=document.querySelector("[data-save-css]"))==null||U.addEventListener("click",()=>{A("custom.css.global",q.value,"string","Global CSS overrides saved")}),(F=document.querySelector("[data-save-hero]"))==null||F.addEventListener("click",()=>{A("custom.hero.html",M.value,"string","Hero markup saved")})}async function Ce(e){e.preventDefault(),b==null||b.classList.add("hidden");const t=new FormData($),a=t.get("email"),o=t.get("password");try{x(!0,"Signing you in…");const{token:n,admin:r}=await ie(a,o);te(n),J(r),await Y(),c.success("Welcome back!","You are now signed in.")}catch(n){b.textContent=n.message||"Unable to sign in. Please try again.",b.classList.remove("hidden"),c.error("Sign in failed",n.message||"Invalid credentials")}finally{x(!1)}}async function Y(){x(!0,"Loading admin data…"),D.classList.add("hidden");const e=u().token,[t]=await Promise.all([ce(e).catch(()=>{throw new Error("Session expired. Please sign in again.")})]);J(t),_.classList.remove("hidden"),await K(),x(!1)}async function K(e=!1){const t=u().token;if(t){x(!0,"Syncing data…");try{const[a,o,n]=await Promise.all([le(t),pe(t),ve(t).catch(()=>({logs:[]}))]);R(a),ne(o),Array.isArray(n.logs)&&n.logs.forEach(r=>C(r)),z(),Ve(),Ge(),We(),N.textContent=new Date().toLocaleTimeString(),e&&c.success("Data synced","Latest portfolio data loaded.")}catch(a){c.error("Sync failed",a.message||"Unable to fetch data")}finally{x(!1)}}}function z(){const{projects:e=[]}=u(),t=e.length>0,a=e.slice().sort((r,s)=>(r.order_index??0)-(s.order_index??0)),o=P?a.filter(Ee):a;if(f.innerHTML="",!t){d&&(d.textContent=B||"No projects found yet. Create one to get started.",d.classList.remove("hidden"));return}if(!o.length){if(d){const r=I.trim();d.textContent=r?`No projects match “${r}”.`:"No projects available.",d.classList.remove("hidden")}return}d&&(d.textContent=B||"",d.classList.add("hidden"));const n=document.createDocumentFragment();o.forEach(r=>{n.appendChild(O(r))}),f.appendChild(n)}function Ee(e){return P?[e.title,e.slug,e.category,e.tech,e.description,Array.isArray(e.tags)?e.tags.join(" "):"",Array.isArray(e.stack)?e.stack.join(" "):"",e.client].filter(Boolean).join(" ").toLowerCase().includes(P):!0}function O(e,t=!1){var r,s,i;const a=document.createElement("article");a.className="admin-project-card",a.dataset.projectId=e.id??"new",t&&(a.dataset.new="true");const o=!!((r=e.stack)!=null&&r.length)||!!((s=e.tags)!=null&&s.length)||!!(e.links&&Object.keys(e.links).length)||!!(e.metrics&&Object.keys(e.metrics).length)||!!((i=e.features)!=null&&i.length)||!!e.image,n=e.is_featured?'<span class="project-badge">Featured</span>':"";return a.innerHTML=`
    <header class="project-card-header">
      <div>
        <div class="project-primary">
          <span class="project-name">${e.title||"Untitled project"}</span>
          ${n}
        </div>
        <span class="project-slug">${e.slug||"project-slug"}</span>
      </div>
      <div class="project-card-actions">
        <button data-action="move-up" type="button" class="icon-btn" title="Move project up">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
        <button data-action="move-down" type="button" class="icon-btn" title="Move project down">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </button>
        <button data-action="customize" type="button" class="btn-secondary text-xs">Customise card</button>
        <button data-action="delete" type="button" class="icon-btn danger" title="Delete project">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 6 3 18h12l3-18" />
            <path d="M5 6h14" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </header>

    <form data-project-form class="project-form">
      <div class="form-grid">
        ${p("Title","title",e.title,"text",!0)}
        ${p("Slug","slug",e.slug,"text",!0)}
      </div>

      ${Le("Description","description",e.description,!0)}

      <div class="form-grid">
        ${p("Category","category",e.category)}
        ${p("Client","client",e.client)}
        ${p("Tech summary","tech",e.tech)}
        ${je("Display order","order_index",e.order_index??0)}
      </div>

      <div class="form-grid">
        ${Pe("Featured on home","is_featured",e.is_featured)}
      </div>

      <details class="form-advanced"${o?" open":""}>
        <summary>
          <span>Advanced fields</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <div class="form-grid">
          ${p("Primary image URL","image",e.image)}
          ${p("Duration","duration",e.duration)}
        </div>
        <div class="form-grid">
          ${v("Stack (array)","stack",e.stack)}
          ${v("Tags (array)","tags",e.tags)}
          ${v("Links (object)","links",e.links)}
          ${v("Metrics (object)","metrics",e.metrics)}
          ${v("Features (array)","features",e.features)}
        </div>
      </details>
    </form>

    <footer class="project-card-footer">
      <small>Last updated: ${e.updated_at?new Date(e.updated_at).toLocaleString():"—"}</small>
      <div class="action-group">
        <button data-action="reset" type="button" class="icon-btn" title="Reset changes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3v6h6" />
            <path d="M21 21v-6h-6" />
            <path d="M3 9a9 9 0 0 1 9-9 9 9 0 0 1 6.36 15.36L21 21" />
          </svg>
        </button>
        <button data-action="save" type="button" class="btn-primary text-xs">Save changes</button>
      </div>
    </footer>
  `,a}function p(e,t,a="",o="text",n=!1){return`
    <label class="form-field">
      <span class="form-label">${e}${n?" *":""}</span>
      <input
        name="${t}"
        type="${o}"
        value="${a??""}"
        ${n?"required":""}
        class="form-input"
      />
    </label>
  `}function Le(e,t,a="",o=!1){return`
    <label class="form-field md:col-span-2">
      <span class="form-label">${e}${o?" *":""}</span>
      <textarea
        name="${t}"
        rows="4"
        ${o?"required":""}
        class="form-textarea"
      >${a??""}</textarea>
    </label>
  `}function je(e,t,a=0){return`
    <label class="form-field">
      <span class="form-label">${e}</span>
      <input
        name="${t}"
        type="number"
        value="${a??0}"
        class="form-input"
      />
    </label>
  `}function Pe(e,t,a=!1){return`
    <label class="form-checkbox md:col-span-2">
      <input type="checkbox" name="${t}" ${a?"checked":""} />
      <span>${e}</span>
    </label>
  `}function v(e,t,a){const o=a?JSON.stringify(a,null,2):"";return`
    <label class="form-field md:col-span-2">
      <span class="form-label">${e}</span>
      <textarea
        name="${t}"
        rows="4"
        class="form-textarea font-mono"
        spellcheck="false"
      >${o}</textarea>
    </label>
  `}function Q(e){const t=document.getElementById("admin-layout");if(!t)return;const a=e==="collapsed"?"collapsed":"expanded";t.dataset.sidebarState=a;const o=document.querySelector("[data-sidebar-toggle]");o&&(o.setAttribute("aria-pressed",String(a==="collapsed")),o.setAttribute("aria-label",a==="collapsed"?"Expand sidebar":"Collapse sidebar"))}function ze(){const e=document.getElementById("admin-layout");if(!e)return;const a=(e.dataset.sidebarState==="collapsed"?"collapsed":"expanded")==="collapsed"?"expanded":"collapsed";Q(a)}function Te(){var t;window.confirm("Switch to another admin account? This will sign you out of the current session.")&&((t=document.getElementById("admin-logout"))==null||t.click())}function Ie(){var a,o;const e=document.createElement("dialog");e.className="admin-dialog",e.innerHTML=`
    <form class="admin-dialog__panel">
      <header class="admin-dialog__header">
        <h3>Create admin user</h3>
        <p>Generate credentials for a teammate or a new administrator.</p>
      </header>
      <div class="admin-dialog__body">
        <label class="form-field">
          <span class="form-label">Email *</span>
          <input type="email" name="email" class="form-input" required placeholder="admin@example.com" />
        </label>
        <label class="form-field">
          <span class="form-label">Temporary password *</span>
          <input type="password" name="password" class="form-input" required placeholder="••••••••" />
        </label>
        <label class="form-field">
          <span class="form-label">Role</span>
          <select name="role" class="form-input">
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
        <p class="admin-dialog__note">After creation, share the credentials securely. The user will be prompted to update their password on first login.</p>
      </div>
      <footer class="admin-dialog__footer">
        <button type="button" class="btn-secondary" data-dialog-cancel>Cancel</button>
        <button type="submit" class="btn-primary">Create user</button>
      </footer>
    </form>
  `;const t=()=>e.remove();e.addEventListener("close",t,{once:!0}),(a=e.querySelector("[data-dialog-cancel]"))==null||a.addEventListener("click",()=>e.close("cancel")),(o=e.querySelector("form"))==null||o.addEventListener("submit",n=>{n.preventDefault();const s=new FormData(n.currentTarget).get("email");c.info("Create user",`Send a request to your backend to create an account for ${s}.`),e.close("submit")}),document.body.appendChild(e),e.showModal()}function Be(){c.info("Manage users","Full user management is coming soon. For now, use your backend interface to update admin accounts.")}function Ae(){var a,o;const e={title:"",slug:"",description:"",order_index:(((a=u().projects)==null?void 0:a.length)||0)+1},t=O(e,!0);f.prepend(t),d==null||d.classList.add("hidden"),t.scrollIntoView({behavior:"smooth",block:"center"}),(o=t.querySelector('input[name="title"]'))==null||o.focus()}async function De(e){const t=e.target.closest("button[data-action]");if(!t)return;const a=t.closest("article"),o=a.dataset.projectId,n=t.dataset.action;n==="save"?await qe(a,o==="new"):n==="delete"?await Ne(a,o):n==="move-up"||n==="move-down"?Oe(o,n==="move-up"):n==="reset"?He(a,o):n==="customize"&&Ue(o)}function _e(e){const t=e.target.closest("article");if(!t)return;const a=t.querySelector(".project-name"),o=t.querySelector(".project-slug"),n=new FormData(t.querySelector("footer").previousElementSibling);a&&(a.textContent=n.get("title")||"Untitled project"),o&&(o.textContent=n.get("slug")||"project-slug")}async function qe(e,t){const a=u().token,o=e.querySelector("[data-project-form]"),n=new FormData(o),r=Me(n);if(!r.title||!r.slug||!r.description){c.warning("Incomplete project","Title, slug, and description are required.");return}try{let s;if(t)s=await de(a,r),e.dataset.projectId=s.id,delete e.dataset.new,c.success("Project created",`${s.title} is now live.`);else{const i=e.dataset.projectId;s=await ue(a,i,r),c.success("Project updated",`${s.title} saved successfully.`)}ae(s),C({action:"project.save",details:{title:s.title}}),z()}catch(s){c.error("Save failed",s.message||"Unable to persist project")}}function Me(e){const t={};for(const[a,o]of e.entries())if(["stack","tags","links","metrics","features"].includes(a))try{t[a]=o?JSON.parse(o):null}catch{c.warning("Invalid JSON",`Please check the ${a} field.`)}else a==="is_featured"?t[a]=!0:a==="order_index"?t[a]=Number(o)||0:t[a]=o||null;return e.has("is_featured")||(t.is_featured=!1),t}async function Ne(e,t){if(e.dataset.new==="true"){e.remove();return}if(confirm("Delete this project? This action cannot be undone."))try{await me(u().token,t),oe(Number(t)),e.remove(),c.info("Project removed","Project deleted successfully."),C({action:"project.delete",details:{id:t}}),f.children.length===0&&d.classList.remove("hidden")}catch(a){c.error("Delete failed",a.message||"Unable to delete the project")}}function Oe(e,t){const a=u().projects.slice(),o=a.findIndex(s=>String(s.id)===String(e));if(o===-1)return;const n=t?o-1:o+1;if(n<0||n>=a.length)return;const[r]=a.splice(o,1);a.splice(n,0,r),a.forEach((s,i)=>{s.order_index=i+1}),R(a),z(),fe(u().token,a.map(s=>({id:s.id,order_index:s.order_index}))).then(()=>c.success("Order updated","Project order saved.")).catch(s=>c.error("Order update failed",s.message||"Unable to save order."))}function He(e,t){if(e.dataset.new==="true"){e.remove(),f.children.length||d.classList.remove("hidden");return}const a=u().projects.find(n=>String(n.id)===String(t));if(!a)return;const o=O(a);e.replaceWith(o),c.info("Reverted changes","Fields reset to last saved values.")}async function Ue(e){if(!e||e==="new"){c.warning("Save first","Save the project before customizing card details.");return}const t=Number(e);if(t)try{const a=await ge(u().token,t);G(t,a.settings||{}),Fe(t,a.settings||{})}catch(a){c.error("Load failed",a.message||"Unable to load customization")}}function Fe(e,t){const a=document.createElement("dialog");a.className="backdrop:bg-slate-950/80 rounded-2xl border border-white/10 bg-slate-900/80 p-0 text-slate-100 backdrop-blur-md";const o=u().projects.find(n=>n.id===e);a.innerHTML=`
    <form method="dialog" class="flex max-h-[80vh] w-[min(580px,90vw)] flex-col">
      <header class="flex items-center justify-between border-b border-white/5 p-4">
        <div>
          <h3 class="text-lg font-semibold text-white">Customize card — ${(o==null?void 0:o.title)??""}</h3>
          <p class="text-xs text-slate-400">Adjust badge colors, overlay text, or add ribbon labels.</p>
        </div>
        <button value="cancel" class="btn-ghost text-xs">Close</button>
      </header>

      <div class="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
        ${v("Badge labels (array)","badges",t.badges||[])}
        ${v("Highlight metrics (array)","highlights",t.highlights||[])}
        ${p("Overlay text","overlay",t.overlay||"","text")}
        ${p("CTA label","ctaLabel",t.ctaLabel||"","text")}
        ${p("CTA URL","ctaUrl",t.ctaUrl||"","text")}
        ${p("Card accent color","accentColor",t.accentColor||"#3b82f6","color")}
      </div>

      <footer class="flex items-center justify-end gap-2 border-t border-white/5 p-4">
        <button value="cancel" class="btn-ghost text-xs">Cancel</button>
        <button type="button" data-dialog-save class="btn-primary text-xs">Save</button>
      </footer>
    </form>
  `,document.body.appendChild(a),a.addEventListener("close",()=>a.remove()),a.querySelector("[data-dialog-save]").addEventListener("click",async()=>{const n=a.querySelector("form"),r=new FormData(n),s={};for(const[i,m]of r.entries())if(m)if(["badges","highlights"].includes(i))try{s[i]=m?JSON.parse(m):[]}catch{c.warning("Invalid JSON",`Please review the ${i} field.`);return}else s[i]=m;try{await ye(u().token,e,s),G(e,s),C({action:"project.customization",details:{projectId:e}}),c.success("Card updated","Project card customization saved."),a.close()}catch(i){c.error("Save failed",i.message||"Unable to save customization")}}),a.showModal()}function Ve(){const{customizations:e}=u();if(!e||!e.size){h.innerHTML='<p class="text-sm text-slate-400">No customizations available yet.</p>';return}const t=we.map(a=>{const o=a.fields.map(n=>{var s;const r=((s=e.get(n.key))==null?void 0:s.value)??n.defaultValue??"";return Je(n,r)}).join("");return`
      <section class="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h4 class="text-sm font-semibold text-white">${a.title}</h4>
            <p class="text-xs text-slate-400">${a.description}</p>
          </div>
          <button class="btn-secondary text-xs" data-save-group="${a.id}">Save group</button>
        </div>
        <div class="grid gap-3 md:grid-cols-2" data-customization-group="${a.id}">
          ${o}
        </div>
      </section>
    `}).join("");h.innerHTML=t,h.querySelectorAll("button[data-save-group]").forEach(a=>{a.addEventListener("click",()=>Re(a.dataset.saveGroup))})}function Je(e,t){const a=`
    <label class="form-field" data-customization-field="${e.key}">
      <span class="form-label">${e.label}</span>
  `;let o;return e.type==="textarea"?o=`<textarea rows="${e.rows??3}" class="form-textarea">${t??""}</textarea>`:e.type==="color"?o=`<input type="color" value="${t||"#3b82f6"}" class="form-input h-10" />`:e.type==="number"?o=`<input type="number" value="${t??""}" step="${e.step??1}" min="${e.min??""}" max="${e.max??""}" class="form-input" />`:o=`<input type="text" value="${t??""}" placeholder="${e.placeholder??""}" class="form-input" />`,`${a}${o}</label>`}function V(e){const t=e.target.closest("[data-customization-field]");t&&(t.dataset.dirty="true")}function Re(e){const t=h.querySelector(`[data-customization-group="${e}"]`);if(!t)return;t.querySelectorAll("[data-customization-field]").forEach(o=>{if(o.dataset.dirty==="true"){const n=o.dataset.customizationField,r=o.querySelector("input, textarea");let s=r.value,i="string";r.type==="number"&&(i="number"),r.type==="color"&&(i="string"),A(n,s,i),o.dataset.dirty="false"}})}async function A(e,t,a,o="Customization saved"){try{const n=await he(u().token,e,t,a);se(e,n),c.success("Saved",o),C({action:"customization.save",details:{key:e}})}catch(n){c.error("Save failed",n.message||"Unable to save customization")}}function Ge(){var t,a;const{customizations:e}=u();q.value=((t=e.get("custom.css.global"))==null?void 0:t.value)??"",M.value=((a=e.get("custom.hero.html"))==null?void 0:a.value)??""}function We(){const{activity:e}=u();if(!e.length){T.innerHTML='<p class="text-sm text-slate-500">No activity recorded yet.</p>';return}const t=e.map(a=>{const o=new Date(a.timestamp).toLocaleString();return`<div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
        <p class="text-xs font-semibold text-slate-200">${a.action}</p>
        <p class="text-xs text-slate-400">${JSON.stringify(a.details||{})}</p>
        <span class="mt-1 block text-[10px] uppercase tracking-wide text-slate-500">${o}</span>
      </div>`}).join("");T.innerHTML=t}function Ye(e){document.querySelectorAll("[data-panel-target]").forEach(t=>{t.classList.toggle("hidden",t.dataset.panelTarget!==e)})}function Z(){w.classList.add("hidden"),D.classList.remove("hidden"),_.classList.add("hidden")}function x(e,t){var a;w&&(w.classList.toggle("hidden",!e),t&&((a=w.querySelector("p"))==null||a.classList.remove("hidden"),w.querySelector("p").textContent=t))}async function Ke(){try{const e=await be();k.textContent="Online",k.className="text-emerald-400",S.textContent="Connected",S.className="text-emerald-400",e!=null&&e.timestamp&&(N.textContent=new Date(e.timestamp).toLocaleTimeString())}catch{k.textContent="Offline",k.className="text-red-400",S.textContent="Unknown",S.className="text-slate-400"}}document.addEventListener("DOMContentLoaded",()=>{ke()});
