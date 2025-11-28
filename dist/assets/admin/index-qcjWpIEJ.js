import"../main-DmZZ7gRn.js";import{n as c}from"../modules-core-BjSLM0i6.js";import"../modules-content-CiQL_H_f.js";const z="portfolio_admin_token",l={token:null,admin:null,projects:[],customizations:new Map,projectCustomizations:new Map,activity:[]};function ne(){const e=localStorage.getItem(z);return e&&(l.token=e),l}function m(){return l}function oe(e){l.token=e,e?localStorage.setItem(z,e):localStorage.removeItem(z)}function K(e){l.admin=e}function Q(e){l.projects=e}function se(e){const t=l.projects.findIndex(a=>a.id===e.id);t>=0?l.projects[t]=e:l.projects.push(e)}function re(e){l.projects=l.projects.filter(t=>t.id!==e)}function ie(e){l.customizations=new Map(e.map(t=>[t.key,t]))}function ce(e,t){l.customizations.set(e,t)}function Z(e,t){l.projectCustomizations.set(e,t)}function L(e){l.activity.unshift({...e,timestamp:Date.now()}),l.activity=l.activity.slice(0,25)}function X(){l.token=null,l.admin=null,l.projects=[],l.customizations.clear(),l.projectCustomizations.clear(),l.activity=[],localStorage.removeItem(z)}const le="http://localhost:3001";async function v(e,{token:t,method:a="GET",body:n,headers:o={}}={}){const r={method:a,headers:{"Content-Type":"application/json",...o}};t&&(r.headers.Authorization=`Bearer ${t}`),n!==void 0&&(r.body=JSON.stringify(n));const s=await fetch(`${le}${e}`,r);if(!s.ok){let i;try{i=await s.json()}catch{i={error:s.statusText||"Request failed"}}const f=new Error(i.error||"Request failed");throw f.status=s.status,f.details=i,f}if(s.status===204)return null;try{return await s.json()}catch{const f=new Error("Invalid JSON response");throw f.status=s.status,f.details={error:"Invalid JSON response"},f}}async function de(e,t){return v("/api/auth/login",{method:"POST",body:{email:e,password:t}})}async function ue(e){return v("/api/auth/profile",{token:e})}async function me(e){return v("/api/projects",{token:e})}async function fe(e,t){return v("/api/projects",{token:e,method:"POST",body:t})}async function pe(e,t,a){return v(`/api/projects/${t}`,{token:e,method:"PUT",body:a})}async function ge(e,t){return v(`/api/projects/${t}`,{token:e,method:"DELETE"})}async function he(e,t){throw new Error("Projects reordering is not available in this configuration.")}async function ye(e){try{return await v("/api/customizations",{token:e})}catch(t){if(t.status===404||t.status===501)return console.warn("[customizations] API not available, using defaults."),[];throw t}}async function ve(e,t,a,n="string"){throw new Error("Customization API is not available in this configuration.")}async function be(e,t){try{return await v(`/api/customizations/projects/${t}`,{token:e})}catch(a){if(a.status===404||a.status===501)return{project_id:Number(t),settings:{}};throw a}}async function we(e,t,a){throw new Error("Customization API is not available in this configuration.")}async function xe(e){try{return v("/api/customizations/activity",{token:e})}catch(t){if(t.status===404)return{logs:[]};throw t}}async function ke(){return v("/health")}const Se=[{id:"hero",title:"Hero section",description:"Headline copy and supporting text shown above the fold.",fields:[{key:"hero.title",label:"Hero Title",type:"text",placeholder:"Fast, reliable web apps for founders."},{key:"hero.subtitle",label:"Hero Subtitle",type:"textarea",rows:3},{key:"hero.cta.primary",label:"Primary CTA Label",type:"text",placeholder:"View case studies"},{key:"hero.cta.secondary",label:"Secondary CTA Label",type:"text",placeholder:"Book a call"}]},{id:"theme",title:"Theme colors",description:"Adjust key accent colors across the portfolio.",fields:[{key:"theme.primary",label:"Primary Accent",type:"color",defaultValue:"#3b82f6"},{key:"theme.secondary",label:"Secondary Accent",type:"color",defaultValue:"#6366f1"},{key:"theme.primary.hover",label:"Primary Hover",type:"color",defaultValue:"#1d4ed8"},{key:"theme.secondary.hover",label:"Secondary Hover",type:"color",defaultValue:"#4338ca"}]},{id:"meta",title:"Metadata & SEO",description:"Update page titles and descriptions used for SEO.",fields:[{key:"meta.home.title",label:"Home Title",type:"text"},{key:"meta.home.description",label:"Home Description",type:"textarea",rows:3}]}];let C,w,_,x,q,p,d,y,N,O,A,S,E,H,P,I="",T="",D="";const Ee=ne();async function $e(){if(Ce(),Le(),await Xe(),Ee.token)try{await ee();return}catch(e){console.warn("Stored token invalid:",e.message),X()}ae()}function Ce(){x=document.getElementById("admin-loader"),_=document.getElementById("admin-login"),q=document.getElementById("admin-dashboard"),C=document.getElementById("login-form"),w=document.getElementById("login-error"),p=document.getElementById("projects-list"),d=document.getElementById("projects-empty"),y=document.getElementById("customization-groups"),N=document.getElementById("custom-css"),O=document.getElementById("custom-hero"),A=document.getElementById("activity-log"),S=document.getElementById("status-api"),E=document.getElementById("status-db"),H=document.getElementById("status-sync"),P=document.getElementById("projects-filter"),D=(d==null?void 0:d.textContent.trim())||""}function Le(){var r,s,i,f,j,F,V,J,R,G;(r=document.getElementById("admin-logout"))==null||r.addEventListener("click",()=>{X(),ae(),c.info("Signed out","You have been logged out.")}),(s=document.getElementById("sync-customizations"))==null||s.addEventListener("click",()=>{te(!0)});const e=document.querySelectorAll(".admin-nav-btn[data-panel]");e.forEach(u=>{u.addEventListener("click",()=>{e.forEach(g=>g.classList.remove("active")),u.classList.add("active"),Ze(u.dataset.panel)})}),(i=document.querySelector("[data-sidebar-toggle]"))==null||i.addEventListener("click",Ae);const t=document.getElementById("mobile-menu-toggle"),a=document.getElementById("sidebar-overlay");t==null||t.addEventListener("click",()=>{const u=document.getElementById("admin-layout");if(!u)return;const g=u.dataset.sidebarState==="expanded";$(g?"collapsed":"expanded"),a&&a.classList.toggle("active",!g),t.setAttribute("aria-pressed",String(!g))}),a==null||a.addEventListener("click",()=>{$("collapsed"),a.classList.remove("active"),t&&t.setAttribute("aria-pressed","false")}),document.addEventListener("click",u=>{const g=document.getElementById("admin-layout"),W=document.getElementById("admin-sidebar");window.matchMedia("(max-width: 1024px)").matches&&(g==null?void 0:g.dataset.sidebarState)==="expanded"&&W&&!W.contains(u.target)&&!(t!=null&&t.contains(u.target))&&($("collapsed"),a==null||a.classList.remove("active"),t&&t.setAttribute("aria-pressed","false"))}),(f=document.querySelector('[data-action="sign-out"]'))==null||f.addEventListener("click",()=>{var u;(u=document.getElementById("admin-logout"))==null||u.click()}),(j=document.querySelector('[data-action="switch-user"]'))==null||j.addEventListener("click",Te),(F=document.querySelector('[data-action="create-user"]'))==null||F.addEventListener("click",De),(V=document.querySelector('[data-action="manage-users"]'))==null||V.addEventListener("click",Me);const n=window.matchMedia("(max-width: 1024px)"),o=u=>{const g=u.matches;$(g?"collapsed":"expanded"),a&&a.classList.remove("active"),t&&t.setAttribute("aria-pressed","false")};o(n),n.addEventListener("change",o),P==null||P.addEventListener("input",u=>{T=u.target.value,I=T.trim().toLowerCase(),B()}),C==null||C.addEventListener("submit",je),(J=document.getElementById("create-project"))==null||J.addEventListener("click",()=>{_e()}),p==null||p.addEventListener("click",qe),p==null||p.addEventListener("input",Ne),y==null||y.addEventListener("input",Y),y==null||y.addEventListener("change",Y),(R=document.querySelector("[data-save-css]"))==null||R.addEventListener("click",()=>{M("custom.css.global",N.value,"string","Global CSS overrides saved")}),(G=document.querySelector("[data-save-hero]"))==null||G.addEventListener("click",()=>{M("custom.hero.html",O.value,"string","Hero markup saved")})}async function je(e){e.preventDefault(),w==null||w.classList.add("hidden");const t=new FormData(C),a=t.get("email"),n=t.get("password");try{k(!0,"Signing you in…");const{token:o,admin:r}=await de(a,n);oe(o),K(r),await ee(),c.success("Welcome back!","You are now signed in.")}catch(o){w.textContent=o.message||"Unable to sign in. Please try again.",w.classList.remove("hidden"),c.error("Sign in failed",o.message||"Invalid credentials")}finally{k(!1)}}async function ee(){k(!0,"Loading admin data…"),_.classList.add("hidden");const e=m().token,[t]=await Promise.all([ue(e).catch(()=>{throw new Error("Session expired. Please sign in again.")})]);K(t),q.classList.remove("hidden"),await te(),k(!1)}async function te(e=!1){const t=m().token;if(t){k(!0,"Syncing data…");try{const[a,n,o]=await Promise.all([me(t),ye(t),xe(t).catch(()=>({logs:[]}))]);Q(a),ie(n),Array.isArray(o.logs)&&o.logs.forEach(r=>L(r)),B(),Ge(),Ke(),Qe(),H.textContent=new Date().toLocaleTimeString(),e&&c.success("Data synced","Latest portfolio data loaded.")}catch(a){c.error("Sync failed",a.message||"Unable to fetch data")}finally{k(!1)}}}function B(){const{projects:e=[]}=m(),t=e.length>0,a=e.slice().sort((r,s)=>(r.order_index??0)-(s.order_index??0)),n=I?a.filter(Pe):a;if(p.innerHTML="",!t){d&&(d.textContent=D||"No projects found yet. Create one to get started.",d.classList.remove("hidden"));return}if(!n.length){if(d){const r=T.trim();d.textContent=r?`No projects match “${r}”.`:"No projects available.",d.classList.remove("hidden")}return}d&&(d.textContent=D||"",d.classList.add("hidden"));const o=document.createDocumentFragment();n.forEach(r=>{o.appendChild(U(r))}),p.appendChild(o)}function Pe(e){return I?[e.title,e.slug,e.category,e.tech,e.description,Array.isArray(e.tags)?e.tags.join(" "):"",Array.isArray(e.stack)?e.stack.join(" "):"",e.client].filter(Boolean).join(" ").toLowerCase().includes(I):!0}function U(e,t=!1){var r,s,i;const a=document.createElement("article");a.className="admin-project-card",a.dataset.projectId=e.id??"new",t&&(a.dataset.new="true");const n=!!((r=e.stack)!=null&&r.length)||!!((s=e.tags)!=null&&s.length)||!!(e.links&&Object.keys(e.links).length)||!!(e.metrics&&Object.keys(e.metrics).length)||!!((i=e.features)!=null&&i.length)||!!e.image,o=e.is_featured?'<span class="project-badge">Featured</span>':"";return a.innerHTML=`
    <header class="project-card-header">
      <div>
        <div class="project-primary">
          <span class="project-name">${e.title||"Untitled project"}</span>
          ${o}
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
        ${h("Title","title",e.title,"text",!0)}
        ${h("Slug","slug",e.slug,"text",!0)}
      </div>

      ${ze("Description","description",e.description,!0)}

      <div class="form-grid">
        ${h("Category","category",e.category)}
        ${h("Client","client",e.client)}
        ${h("Tech summary","tech",e.tech)}
        ${Ie("Display order","order_index",e.order_index??0)}
      </div>

      <div class="form-grid">
        ${Be("Featured on home","is_featured",e.is_featured)}
      </div>

      <details class="form-advanced"${n?" open":""}>
        <summary>
          <span>Advanced fields</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <div class="form-grid">
          ${h("Primary image URL","image",e.image)}
          ${h("Duration","duration",e.duration)}
        </div>
        <div class="form-grid">
          ${b("Stack (array)","stack",e.stack)}
          ${b("Tags (array)","tags",e.tags)}
          ${b("Links (object)","links",e.links)}
          ${b("Metrics (object)","metrics",e.metrics)}
          ${b("Features (array)","features",e.features)}
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
  `,a}function h(e,t,a="",n="text",o=!1){return`
    <label class="form-field">
      <span class="form-label">${e}${o?" *":""}</span>
      <input
        name="${t}"
        type="${n}"
        value="${a??""}"
        ${o?"required":""}
        class="form-input"
      />
    </label>
  `}function ze(e,t,a="",n=!1){return`
    <label class="form-field md:col-span-2">
      <span class="form-label">${e}${n?" *":""}</span>
      <textarea
        name="${t}"
        rows="4"
        ${n?"required":""}
        class="form-textarea"
      >${a??""}</textarea>
    </label>
  `}function Ie(e,t,a=0){return`
    <label class="form-field">
      <span class="form-label">${e}</span>
      <input
        name="${t}"
        type="number"
        value="${a??0}"
        class="form-input"
      />
    </label>
  `}function Be(e,t,a=!1){return`
    <label class="form-checkbox md:col-span-2">
      <input type="checkbox" name="${t}" ${a?"checked":""} />
      <span>${e}</span>
    </label>
  `}function b(e,t,a){const n=a?JSON.stringify(a,null,2):"";return`
    <label class="form-field md:col-span-2">
      <span class="form-label">${e}</span>
      <textarea
        name="${t}"
        rows="4"
        class="form-textarea font-mono"
        spellcheck="false"
      >${n}</textarea>
    </label>
  `}function $(e){const t=document.getElementById("admin-layout");if(!t)return;const a=e==="collapsed"?"collapsed":"expanded";t.dataset.sidebarState=a;const n=document.querySelector("[data-sidebar-toggle]");n&&(n.setAttribute("aria-pressed",String(a==="collapsed")),n.setAttribute("aria-label",a==="collapsed"?"Expand sidebar":"Collapse sidebar"))}function Ae(){const e=document.getElementById("admin-layout");if(!e)return;const t=window.matchMedia("(max-width: 1024px)").matches,n=(e.dataset.sidebarState==="collapsed"?"collapsed":"expanded")==="collapsed"?"expanded":"collapsed";$(n);const o=document.getElementById("sidebar-overlay");t&&o&&o.classList.toggle("active",n==="expanded")}function Te(){var t;window.confirm("Switch to another admin account? This will sign you out of the current session.")&&((t=document.getElementById("admin-logout"))==null||t.click())}function De(){var a,n;const e=document.createElement("dialog");e.className="admin-dialog",e.innerHTML=`
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
  `;const t=()=>e.remove();e.addEventListener("close",t,{once:!0}),(a=e.querySelector("[data-dialog-cancel]"))==null||a.addEventListener("click",()=>e.close("cancel")),(n=e.querySelector("form"))==null||n.addEventListener("submit",o=>{o.preventDefault();const s=new FormData(o.currentTarget).get("email");c.info("Create user",`Send a request to your backend to create an account for ${s}.`),e.close("submit")}),document.body.appendChild(e),e.showModal()}function Me(){c.info("Manage users","Full user management is coming soon. For now, use your backend interface to update admin accounts.")}function _e(){var a,n;const e={title:"",slug:"",description:"",order_index:(((a=m().projects)==null?void 0:a.length)||0)+1},t=U(e,!0);p.prepend(t),d==null||d.classList.add("hidden"),t.scrollIntoView({behavior:"smooth",block:"center"}),(n=t.querySelector('input[name="title"]'))==null||n.focus()}async function qe(e){const t=e.target.closest("button[data-action]");if(!t)return;const a=t.closest("article"),n=a.dataset.projectId,o=t.dataset.action;o==="save"?await Oe(a,n==="new"):o==="delete"?await Ue(a,n):o==="move-up"||o==="move-down"?Fe(n,o==="move-up"):o==="reset"?Ve(a,n):o==="customize"&&Je(n)}function Ne(e){const t=e.target.closest("article");if(!t)return;const a=t.querySelector(".project-name"),n=t.querySelector(".project-slug"),o=new FormData(t.querySelector("footer").previousElementSibling);a&&(a.textContent=o.get("title")||"Untitled project"),n&&(n.textContent=o.get("slug")||"project-slug")}async function Oe(e,t){const a=m().token,n=e.querySelector("[data-project-form]"),o=new FormData(n),r=He(o);if(!r.title||!r.slug||!r.description){c.warning("Incomplete project","Title, slug, and description are required.");return}try{let s;if(t)s=await fe(a,r),e.dataset.projectId=s.id,delete e.dataset.new,c.success("Project created",`${s.title} is now live.`);else{const i=e.dataset.projectId;s=await pe(a,i,r),c.success("Project updated",`${s.title} saved successfully.`)}se(s),L({action:"project.save",details:{title:s.title}}),B()}catch(s){c.error("Save failed",s.message||"Unable to persist project")}}function He(e){const t={};for(const[a,n]of e.entries())if(["stack","tags","links","metrics","features"].includes(a))try{t[a]=n?JSON.parse(n):null}catch{c.warning("Invalid JSON",`Please check the ${a} field.`)}else a==="is_featured"?t[a]=!0:a==="order_index"?t[a]=Number(n)||0:t[a]=n||null;return e.has("is_featured")||(t.is_featured=!1),t}async function Ue(e,t){if(e.dataset.new==="true"){e.remove();return}if(confirm("Delete this project? This action cannot be undone."))try{await ge(m().token,t),re(Number(t)),e.remove(),c.info("Project removed","Project deleted successfully."),L({action:"project.delete",details:{id:t}}),p.children.length===0&&d.classList.remove("hidden")}catch(a){c.error("Delete failed",a.message||"Unable to delete the project")}}function Fe(e,t){const a=m().projects.slice(),n=a.findIndex(s=>String(s.id)===String(e));if(n===-1)return;const o=t?n-1:n+1;if(o<0||o>=a.length)return;const[r]=a.splice(n,1);a.splice(o,0,r),a.forEach((s,i)=>{s.order_index=i+1}),Q(a),B(),he(m().token,a.map(s=>({id:s.id,order_index:s.order_index}))).then(()=>c.success("Order updated","Project order saved.")).catch(s=>c.error("Order update failed",s.message||"Unable to save order."))}function Ve(e,t){if(e.dataset.new==="true"){e.remove(),p.children.length||d.classList.remove("hidden");return}const a=m().projects.find(o=>String(o.id)===String(t));if(!a)return;const n=U(a);e.replaceWith(n),c.info("Reverted changes","Fields reset to last saved values.")}async function Je(e){if(!e||e==="new"){c.warning("Save first","Save the project before customizing card details.");return}const t=Number(e);if(t)try{const a=await be(m().token,t);Z(t,a.settings||{}),Re(t,a.settings||{})}catch(a){c.error("Load failed",a.message||"Unable to load customization")}}function Re(e,t){const a=document.createElement("dialog");a.className="backdrop:bg-slate-950/80 rounded-2xl border border-white/10 bg-slate-900/80 p-0 text-slate-100 backdrop-blur-md";const n=m().projects.find(o=>o.id===e);a.innerHTML=`
    <form method="dialog" class="flex max-h-[80vh] w-[min(580px,90vw)] flex-col">
      <header class="flex items-center justify-between border-b border-white/5 p-4">
        <div>
          <h3 class="text-lg font-semibold text-white">Customize card — ${(n==null?void 0:n.title)??""}</h3>
          <p class="text-xs text-slate-400">Adjust badge colors, overlay text, or add ribbon labels.</p>
        </div>
        <button value="cancel" class="btn-ghost text-xs">Close</button>
      </header>

      <div class="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
        ${b("Badge labels (array)","badges",t.badges||[])}
        ${b("Highlight metrics (array)","highlights",t.highlights||[])}
        ${h("Overlay text","overlay",t.overlay||"","text")}
        ${h("CTA label","ctaLabel",t.ctaLabel||"","text")}
        ${h("CTA URL","ctaUrl",t.ctaUrl||"","text")}
        ${h("Card accent color","accentColor",t.accentColor||"#3b82f6","color")}
      </div>

      <footer class="flex items-center justify-end gap-2 border-t border-white/5 p-4">
        <button value="cancel" class="btn-ghost text-xs">Cancel</button>
        <button type="button" data-dialog-save class="btn-primary text-xs">Save</button>
      </footer>
    </form>
  `,document.body.appendChild(a),a.addEventListener("close",()=>a.remove()),a.querySelector("[data-dialog-save]").addEventListener("click",async()=>{const o=a.querySelector("form"),r=new FormData(o),s={};for(const[i,f]of r.entries())if(f)if(["badges","highlights"].includes(i))try{s[i]=f?JSON.parse(f):[]}catch{c.warning("Invalid JSON",`Please review the ${i} field.`);return}else s[i]=f;try{await we(m().token,e,s),Z(e,s),L({action:"project.customization",details:{projectId:e}}),c.success("Card updated","Project card customization saved."),a.close()}catch(i){c.error("Save failed",i.message||"Unable to save customization")}}),a.showModal()}function Ge(){const{customizations:e}=m();if(!e||!e.size){y.innerHTML='<p class="text-sm text-slate-400">No customizations available yet.</p>';return}const t=Se.map(a=>{const n=a.fields.map(o=>{var s;const r=((s=e.get(o.key))==null?void 0:s.value)??o.defaultValue??"";return We(o,r)}).join("");return`
      <section class="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h4 class="text-sm font-semibold text-white">${a.title}</h4>
            <p class="text-xs text-slate-400">${a.description}</p>
          </div>
          <button class="btn-secondary text-xs" data-save-group="${a.id}">Save group</button>
        </div>
        <div class="grid gap-3 md:grid-cols-2" data-customization-group="${a.id}">
          ${n}
        </div>
      </section>
    `}).join("");y.innerHTML=t,y.querySelectorAll("button[data-save-group]").forEach(a=>{a.addEventListener("click",()=>Ye(a.dataset.saveGroup))})}function We(e,t){const a=`
    <label class="form-field" data-customization-field="${e.key}">
      <span class="form-label">${e.label}</span>
  `;let n;return e.type==="textarea"?n=`<textarea rows="${e.rows??3}" class="form-textarea">${t??""}</textarea>`:e.type==="color"?n=`<input type="color" value="${t||"#3b82f6"}" class="form-input h-10" />`:e.type==="number"?n=`<input type="number" value="${t??""}" step="${e.step??1}" min="${e.min??""}" max="${e.max??""}" class="form-input" />`:n=`<input type="text" value="${t??""}" placeholder="${e.placeholder??""}" class="form-input" />`,`${a}${n}</label>`}function Y(e){const t=e.target.closest("[data-customization-field]");t&&(t.dataset.dirty="true")}function Ye(e){const t=y.querySelector(`[data-customization-group="${e}"]`);if(!t)return;t.querySelectorAll("[data-customization-field]").forEach(n=>{if(n.dataset.dirty==="true"){const o=n.dataset.customizationField,r=n.querySelector("input, textarea");let s=r.value,i="string";r.type==="number"&&(i="number"),r.type==="color"&&(i="string"),M(o,s,i),n.dataset.dirty="false"}})}async function M(e,t,a,n="Customization saved"){try{const o=await ve(m().token,e,t,a);ce(e,o),c.success("Saved",n),L({action:"customization.save",details:{key:e}})}catch(o){c.error("Save failed",o.message||"Unable to save customization")}}function Ke(){var t,a;const{customizations:e}=m();N.value=((t=e.get("custom.css.global"))==null?void 0:t.value)??"",O.value=((a=e.get("custom.hero.html"))==null?void 0:a.value)??""}function Qe(){const{activity:e}=m();if(!e.length){A.innerHTML='<p class="text-sm text-slate-500">No activity recorded yet.</p>';return}const t=e.map(a=>{const n=new Date(a.timestamp).toLocaleString();return`<div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
        <p class="text-xs font-semibold text-slate-200">${a.action}</p>
        <p class="text-xs text-slate-400">${JSON.stringify(a.details||{})}</p>
        <span class="mt-1 block text-[10px] uppercase tracking-wide text-slate-500">${n}</span>
      </div>`}).join("");A.innerHTML=t}function Ze(e){document.querySelectorAll("[data-panel-target]").forEach(t=>{t.classList.toggle("hidden",t.dataset.panelTarget!==e)})}function ae(){x.classList.add("hidden"),_.classList.remove("hidden"),q.classList.add("hidden")}function k(e,t){var a;x&&(x.classList.toggle("hidden",!e),t&&((a=x.querySelector("p"))==null||a.classList.remove("hidden"),x.querySelector("p").textContent=t))}async function Xe(){try{const e=await ke();S.textContent="Online",S.className="text-emerald-400",E.textContent="Connected",E.className="text-emerald-400",e!=null&&e.timestamp&&(H.textContent=new Date(e.timestamp).toLocaleTimeString())}catch{S.textContent="Offline",S.className="text-red-400",E.textContent="Unknown",E.className="text-slate-400"}}document.addEventListener("DOMContentLoaded",()=>{$e()});
