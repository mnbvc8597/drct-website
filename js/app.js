let S={},COURSES=[];
const app=$("#app");
const RANK={open:0,upcoming:1,closed:2};
const head=(t,s)=>`<section class="phead"><div class="wrap"><h1>${t}</h1>${s?`<p>${s}</p>`:""}</div></section>`;
const empty=m=>`<div class="empty">${m||"This information will be updated soon."}</div>`;
const page=(t,s,body)=>head(t,s)+`<div class="wrap sec">${body}</div>`;
const prose=k=>S[k]?`<div class="prose">${nl(S[k])}</div>`:empty();
const rows=async(t,f)=>{let q=sb.from(t).select("*").eq("published",true);if(f)q=f(q);const {data,error}=await q;if(error)throw error;return data||[]};
const getCourses=async()=>(COURSES=(await rows("courses",q=>q.order("name"))).sort((a,b)=>RANK[a.status]-RANK[b.status]));
async function annList(n){
  let q=sb.from("announcements").select("*,courses(name)").eq("published",true).lte("pub_date",today()).or(`expiry_date.is.null,expiry_date.gte.${today()}`).order("pub_date",{ascending:false});
  if(n)q=q.limit(n);const {data,error}=await q;if(error)throw error;return data||[];
}
const pages={
async home(){
  const [an,cs]=await Promise.all([annList(5),getCourses()]);
  const open=cs.filter(c=>c.status==="open");
  return `<section class="hero"><div class="wrap"><div><div class="rule"></div><h1>DHANDAPANI RURAL CHARITABLE TRUST</h1><p>${esc(S.tagline||"Gobichettipalayam, Tamil Nadu")}</p><div class="row2"><a class="btn gold" href="#/courses">View courses</a><a class="btn line" href="#/admissions">Admissions information</a></div></div>
  <div class="openbox"><h3><i class="fa-solid fa-door-open"></i> Admission open now</h3>${open.length?`<ul>${open.slice(0,5).map(c=>`<li>${esc(c.name)}</li>`).join("")}</ul>`:`<p class="mut">No course is open for admission right now. Please check Announcements.</p>`}<a class="btn sm" href="#/courses">All courses</a></div></div></section>
  <div class="wrap sec"><div class="sh"><h2>Latest announcements</h2><a href="#/announcements">View all</a></div>${an.length?an.map(annCard).join(""):empty("No announcements at the moment.")}
  <div class="sh" style="margin-top:34px"><h2>Courses</h2><a href="#/courses">View all</a></div>${cs.length?`<div class="grid">${cs.slice(0,6).map(c=>courseCard(c,S)).join("")}</div>`:empty("Courses will be added soon.")}
  <div class="sh" style="margin-top:34px"><h2>Quick links</h2></div><div class="tiles"><a href="#/schemes"><i class="fa-solid fa-landmark"></i>Government Schemes</a><a href="#/downloads"><i class="fa-solid fa-file-arrow-down"></i>Downloads</a><a href="#/gallery"><i class="fa-solid fa-images"></i>Gallery</a><a href="#/contact"><i class="fa-solid fa-phone"></i>Contact Us</a></div></div>`;
},
about:async()=>page("About Us","",prose("about")+(S.mission?`<div class="prose" style="margin-top:16px"><h3>Our mission</h3>${nl(S.mission)}</div>`:"")),
async courses(){await getCourses();return head("Courses","Training programmes offered by DRCT")+`<div class="wrap sec"><div class="filters"><input id="cq" type="search" placeholder="Search courses…" aria-label="Search courses"><button data-s="all" class="on">All</button><button data-s="open">Open</button><button data-s="upcoming">Upcoming</button><button data-s="closed">Closed</button></div><div id="cl" class="grid"></div></div>`},
async schemes(){
  const cs=await getCourses(),g={};cs.forEach(c=>{if(c.scheme)(g[c.scheme]=g[c.scheme]||[]).push(c)});
  return page("Government Schemes","",prose("schemes")+Object.keys(g).map(k=>`<div class="prose" style="margin-top:16px"><h3>${esc(k)}</h3><ul>${g[k].map(c=>`<li>${esc(c.name)} ${badge(c.status)}</li>`).join("")}</ul></div>`).join(""));
},
async gallery(){const g=await rows("gallery",q=>q.order("created_at",{ascending:false}));return page("Gallery","",g.length?`<div class="gal">${g.map(x=>`<button data-img="${esc(x.image_url)}" aria-label="${esc(x.title||"Photo")}"><img src="${esc(x.image_url)}" alt="${esc(x.title||"DRCT photo")}" loading="lazy"></button>`).join("")}</div>`:empty("Photos will be added soon."))},
async announcements(){const a=await annList();return page("Announcements","",a.length?a.map(annCard).join(""):empty("No announcements at the moment."))},
async stories(){const d=await rows("entries",q=>q.eq("type","story").order("created_at",{ascending:false}));return page("Success Stories","",d.length?`<div class="grid">${d.map(personCard).join("")}</div>`:empty())},
async faculty(){const d=await rows("entries",q=>q.eq("type","faculty").order("created_at"));return page("Faculty & Staff","",d.length?`<div class="grid">${d.map(personCard).join("")}</div>`:empty())},
async downloads(){const d=await rows("documents",q=>q.order("created_at",{ascending:false}));return page("Downloads","Notices, brochures and forms",d.length?d.map(docRow).join(""):empty("No documents available yet."))},
async careers(){const a=(await annList()).filter(x=>x.category==="Careers");return page("Careers","",prose("careers")+(a.length?`<div class="sh" style="margin-top:26px"><h2>Current openings</h2></div>`+a.map(annCard).join(""):""))},
async admissions(){const c=(await getCourses()).filter(x=>x.status==="open");return page("Admissions Information","",prose("admissions")+`<div class="sh" style="margin-top:26px"><h2>Courses open for admission</h2></div>`+(c.length?`<div class="grid">${c.map(x=>courseCard(x,S)).join("")}</div>`:empty("No course is open for admission right now.")))},
async contact(){
  const wa=digits(S.whatsapp),i=(ic,t)=>t?`<p><i class="fa-solid ${ic}" style="color:var(--teal);width:22px"></i> ${nl(t)}</p>`:"";
  const ok=u=>/^https?:\/\//i.test(u||"");
  const b=[];if(wa)b.push(`<a class="btn wa" href="https://wa.me/${wa.length===10?"91"+wa:wa}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>`);
  if(S.phone)b.push(`<a class="btn" href="tel:+${digits(S.phone).length===10?"91"+digits(S.phone):digits(S.phone)}"><i class="fa-solid fa-phone"></i> Call</a>`);
  if(S.email)b.push(`<a class="btn mail" href="mailto:${esc(S.email)}"><i class="fa-solid fa-envelope"></i> Email</a>`);
  if(ok(S.map_url))b.push(`<a class="btn gold" href="${esc(S.map_url)}" target="_blank" rel="noopener"><i class="fa-solid fa-map-location-dot"></i> Open map</a>`);
  const any=S.address||S.phone||S.email||S.hours||b.length;
  return page("Contact Us","",any?`<div class="prose"><h3>DHANDAPANI RURAL CHARITABLE TRUST</h3>${i("fa-location-dot",S.address)}${i("fa-phone",S.phone)}${i("fa-envelope",S.email)}${i("fa-clock",S.hours)}<div class="row2">${b.join("")}</div></div>`:empty("Contact details will be updated soon."));
}};
function drawCourses(){
  const s=$("#cl");if(!s)return;const on=$(".filters .on").dataset.s,k=($("#cq").value||"").toLowerCase();
  const l=COURSES.filter(c=>(on==="all"||c.status===on)&&[c.name,c.code,c.scheme].join(" ").toLowerCase().includes(k));
  s.innerHTML=l.length?l.map(c=>courseCard(c,S)).join(""):`<div class="empty" style="grid-column:1/-1">No courses found.</div>`;
}
async function route(){
  const k=location.hash.replace(/^#\/?/,"")||"home",f=pages[k]||pages.home;
  document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#/"+k));
  $("#nav").classList.remove("open");
  if(!CONFIGURED){app.innerHTML=page("Setup needed","",`<div class="notice">Website is not connected yet. Open <b>js/config.js</b> and paste your Supabase URL and anon key (see the Tamil guide, Step 3).</div>`);return}
  app.innerHTML=`<div class="wrap sec mut">Loading…</div>`;
  try{app.innerHTML=await f();if(k==="courses")drawCourses()}catch(e){console.error(e);app.innerHTML=page("Sorry","",empty("This page could not be loaded. Please try again later."))}
  window.scrollTo(0,0);
}
function footer(){
  const ok=u=>/^https?:\/\//i.test(u||""),soc=[["facebook","fa-facebook"],["instagram","fa-instagram"],["youtube","fa-youtube"]].filter(x=>ok(S[x[0]])).map(x=>`<a href="${esc(S[x[0]])}" target="_blank" rel="noopener"><i class="fa-brands ${x[1]}"></i> ${x[0][0].toUpperCase()+x[0].slice(1)}</a>`).join("");
  $("#foot").innerHTML=`<div class="wrap"><div><h4>DHANDAPANI RURAL CHARITABLE TRUST</h4>${S.address?`<p>${nl(S.address)}</p>`:"<p>Gobichettipalayam, Tamil Nadu, India</p>"}${S.phone?`<p><i class="fa-solid fa-phone"></i> ${esc(S.phone)}</p>`:""}${S.email?`<p><i class="fa-solid fa-envelope"></i> ${esc(S.email)}</p>`:""}</div><div><h4>Explore</h4><a href="#/courses">Courses</a><a href="#/announcements">Announcements</a><a href="#/admissions">Admissions</a><a href="#/downloads">Downloads</a></div><div><h4>Follow</h4>${soc||"<span>—</span>"}</div><div class="cp">© ${new Date().getFullYear()} DHANDAPANI RURAL CHARITABLE TRUST. This is an informational website; it does not collect personal data.</div></div>`;
}
document.addEventListener("click",e=>{
  const g=e.target.closest("[data-img]");if(g){const l=$("#lb");l.innerHTML=`<div class="mb big"><img src="${esc(g.dataset.img)}" alt=""></div>`;l.hidden=false;return}
  if(e.target.closest("#lb")){$("#lb").hidden=true;return}
  const s=e.target.closest(".filters button");if(s){document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("on"));s.classList.add("on");drawCourses()}
  if(e.target.closest("#burger"))$("#nav").classList.toggle("open");
});
document.addEventListener("input",e=>{if(e.target.id==="cq")drawCourses()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#lb").hidden=true});
window.addEventListener("hashchange",route);
(async()=>{if(CONFIGURED){const {data}=await sb.from("site_content").select("*");(data||[]).forEach(r=>S[r.key]=r.value)}footer();route()})();
