const C=window.DRCT_CONFIG;
const CONFIGURED=!/PASTE_/.test(C.SUPABASE_URL+C.SUPABASE_ANON_KEY);
const sb=CONFIGURED?supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY,{auth:{persistSession:!!window.IS_ADMIN,autoRefreshToken:!!window.IS_ADMIN,detectSessionInUrl:false}}):null;
const $=(s,e=document)=>e.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const nl=s=>esc(s).replace(/\n/g,"<br>");
const today=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
const fmt=d=>d?new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"";
const STATUS={open:"Admission Open",upcoming:"Upcoming",closed:"Admission Closed"};
const badge=s=>`<span class="badge ${esc(s)}">${esc(STATUS[s]||s)}</span>`;
const digits=s=>String(s||"").replace(/\D/g,"");
function enquiry(c,S){
  let wa=digits(c.enquiry_whatsapp||S.whatsapp);if(wa.length===10)wa="91"+wa;
  let ph=digits(c.enquiry_phone||S.phone);if(ph.length===10)ph="91"+ph;
  const em=c.enquiry_email||S.email,msg=encodeURIComponent("Hello, I would like to know more about: "+(c.name||""));
  const b=[];
  if(wa)b.push(`<a class="btn sm wa" href="https://wa.me/${wa}?text=${msg}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>`);
  if(ph)b.push(`<a class="btn sm" href="tel:+${ph}"><i class="fa-solid fa-phone"></i> Call</a>`);
  if(em)b.push(`<a class="btn sm mail" href="mailto:${esc(em)}?subject=${msg}"><i class="fa-solid fa-envelope"></i> Email</a>`);
  return b.length?`<div class="enq">${b.join("")}</div>`:"";
}
function courseCard(c,S={}){
  const img=c.image_url?`<img src="${esc(c.image_url)}" alt="${esc(c.name)}" loading="lazy">`:`<div class="ph"><i class="fa-solid fa-graduation-cap"></i></div>`;
  const li=(i,t)=>t?`<li><i class="fa-solid ${i}"></i> ${esc(t)}</li>`:"";
  const det=[["Eligibility",c.eligibility],["Qualification",c.qualification],["About this course",c.description]].filter(x=>x[1]).map(x=>`<h4>${x[0]}</h4><p>${nl(x[1])}</p>`).join("");
  return `<article class="card"><div class="cimg">${img}${badge(c.status)}</div><div class="cbody">${c.scheme?`<span class="tag">${esc(c.scheme)}</span>`:""}<h3>${esc(c.name)}</h3>${c.code?`<small class="mut">Course code: ${esc(c.code)}</small>`:""}<ul class="meta">${li("fa-clock",c.duration)}${li("fa-location-dot",c.location)}</ul>${det?`<details><summary>View details</summary>${det}</details>`:""}${enquiry(c,S)}</div></article>`;
}
function annCard(a){
  const d=a.pub_date?new Date(a.pub_date+"T00:00:00"):null,cn=a.courses&&a.courses.name;
  return `<article class="ann"><div class="date"><b>${d?d.getDate():"–"}</b><span>${d?d.toLocaleString("en-IN",{month:"short",year:"2-digit"}):""}</span></div><div><span class="tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3>${cn?`<small class="mut"><i class="fa-solid fa-book"></i> ${esc(cn)}</small>`:""}${a.description?`<p>${nl(a.description)}</p>`:""}${a.pdf_url?`<a class="btn sm" href="${esc(a.pdf_url)}" target="_blank" rel="noopener"><i class="fa-solid fa-file-pdf"></i> Download PDF</a>`:""} ${a.expiry_date?`<small class="mut">Valid till ${fmt(a.expiry_date)}</small>`:""}</div></article>`;
}
const docRow=d=>`<div class="doc"><div><i class="fa-solid fa-file-pdf"></i> <b>${esc(d.title)}</b><br><span class="tag">${esc(d.category||"Document")}</span></div><a class="btn sm" href="${esc(d.file_url||"#")}" target="_blank" rel="noopener"><i class="fa-solid fa-download"></i> Download</a></div>`;
const personCard=p=>`<div class="card person">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.title)}" loading="lazy">`:`<div class="ph sm"><i class="fa-solid fa-user"></i></div>`}<div><h3>${esc(p.title)}</h3>${p.subtitle?`<span class="tag">${esc(p.subtitle)}</span>`:""}<p>${nl(p.body)}</p></div></div>`;
