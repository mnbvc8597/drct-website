let SET={},COURSES=[],ROWS=[];
const CATS=["General","Admission","Notice","Examination","Event","Result","Careers"].map(x=>[x,x]);
const T={
courses:{label:"Courses",icon:"fa-book-open",table:"courses",title:"name",sub:r=>[r.code,r.scheme,STATUS[r.status]].filter(Boolean).join(" | "),def:{status:"upcoming"},f:[
 ["name","Course name","text",1],["code","Course code","text"],["scheme","Scheme","text",0,"Type the scheme name exactly as it is officially known"],
 ["status","Admission status","select",1,[["open","Open"],["upcoming","Upcoming"],["closed","Closed"]]],
 ["description","Description","textarea"],["eligibility","Eligibility","textarea"],["qualification","Qualification","text"],["duration","Duration","text",0,"Example: 3 months"],["location","Training location","text"],
 ["image_url","Course image","image"],["enquiry_phone","Enquiry phone","tel",0,"Leave empty to use the number in Website Content"],["enquiry_whatsapp","Enquiry WhatsApp","tel",0,"Leave empty to use the number in Website Content"],["enquiry_email","Enquiry email","email"],["published","Publish (show on website)","check"]]},
announcements:{label:"Announcements",icon:"fa-bullhorn",table:"announcements",title:"title",sub:r=>[r.category,fmt(r.pub_date),r.expiry_date?"expires "+fmt(r.expiry_date):""].filter(Boolean).join(" | "),def:{category:"General",pub_date:today()},f:[
 ["title","Title","text",1],["category","Category","select",1,CATS],["pub_date","Publication date","date",1,"Shown on the website from this date"],["description","Description","textarea"],
 ["course_id","Related course","select",0,()=>[["","— None —"],...COURSES.map(c=>[c.id,c.name])]],["pdf_url","PDF attachment (optional)","pdf"],["expiry_date","Expiry date (optional)","date",0,"Hidden automatically after this date"],["published","Publish (show on website)","check"]]},
gallery:{label:"Gallery",icon:"fa-images",table:"gallery",title:"title",def:{published:true},f:[["title","Photo caption","text"],["image_url","Photo","image",1],["published","Publish (show on website)","check"]]},
documents:{label:"PDF Downloads",icon:"fa-file-pdf",table:"documents",title:"title",sub:r=>r.category,def:{category:"Notice",published:true},f:[["title","Document title","text",1],["category","Type","select",1,["Notice","Brochure","Form","Syllabus","Other"].map(x=>[x,x])],["file_url","PDF file","pdf",1],["published","Publish (show on website)","check"]]},
faculty:{label:"Faculty & Staff",icon:"fa-chalkboard-user",table:"entries",fix:"faculty",title:"title",sub:r=>r.subtitle,def:{published:true},f:[["title","Name","text",1],["subtitle","Designation","text"],["body","About (short)","textarea"],["image_url","Photo","image"],["published","Publish (show on website)","check"]]},
stories:{label:"Success Stories",icon:"fa-trophy",table:"entries",fix:"story",title:"title",sub:r=>r.subtitle,def:{published:false},f:[["title","Name","text",1,"Use only with the person's written permission"],["subtitle","Course / year","text"],["body","Story","textarea",0,"Do NOT write phone numbers, addresses or ID numbers"],["image_url","Photo","image"],["published","Publish (show on website)","check"]]}
};
const CONTENT=[["tagline","Tagline (home page)","text"],["about","About Us","textarea"],["mission","Mission / Vision","textarea"],["schemes","Government Schemes – introduction","textarea"],["admissions","Admissions – how to apply","textarea"],["careers","Careers – introduction","textarea"],["address","Address","textarea"],["phone","Phone number","tel"],["whatsapp","WhatsApp number","tel",0,"Example: 9XXXXXXXXX (10 digits)"],["email","Email","email"],["hours","Office hours","text"],["map_url","Google Maps link","url"],["facebook","Facebook page link","url"],["instagram","Instagram link","url"],["youtube","YouTube link","url"]];
const el=$("#view");
const toast=(m,bad)=>{const t=$("#toast");t.textContent=m;t.className="show"+(bad?" bad":"");setTimeout(()=>t.className="",3500)};
const errBox=e=>`<div class="err">Something went wrong: ${esc(e.message||e)}. Check the Tamil guide, "Problems" section.</div>`;
const showMo=h=>{const m=$("#mo");m.innerHTML=`<div class="mb">${h}<p style="text-align:right"><button class="btn sm" data-act="close">Close</button></p></div>`;m.hidden=false};
function tabs(cur){$("#tabs").innerHTML=[["dash","Dashboard","fa-gauge"],...Object.entries(T).map(([k,v])=>[k,v.label,v.icon]),["content","Website Content","fa-pen-to-square"]].map(([k,l,i])=>`<button data-go="${k}" class="${k===cur?"on":""}"><i class="fa-solid ${i}"></i> ${l}</button>`).join("")}
function go(k,id){tabs(k);window.scrollTo(0,0);return k==="dash"?dash():k==="content"?content():id!==undefined?form(k,id):list(k)}
async function dash(){
  el.innerHTML="Loading…";const out=[];
  for(const k of ["courses","announcements","gallery","documents"]){
    const {data,error}=await sb.from(T[k].table).select("id,published"+(k==="announcements"?",expiry_date":""));if(error)return el.innerHTML=errBox(error);
    const live=data.filter(r=>r.published&&!(r.expiry_date&&r.expiry_date<today())).length;
    out.push(`<div class="dc"><b>${data.length}</b>${T[k].label}<br><small>${live} live on website, ${data.length-live} draft/expired</small></div>`)}
  el.innerHTML=`<h2>Welcome</h2><div class="dg">${out.join("")}</div><h3>Quick actions</h3><div class="ra" style="gap:10px"><button class="btn" data-go2="courses">+ Add course</button><button class="btn" data-go2="announcements">+ Add announcement</button><button class="btn" data-go2="gallery">+ Upload photo</button><button class="btn" data-go2="documents">+ Upload PDF</button></div>`;
}
const row=(k,r)=>{const t=T[k],exp=r.expiry_date&&r.expiry_date<today(),st=exp?'<span class="badge closed">Expired</span>':r.published?'<span class="badge open">Published</span>':'<span class="badge upcoming">Draft</span>';
  return `<div class="row">${r.image_url?`<img src="${esc(r.image_url)}" alt="">`:`<div class="ph sm"><i class="fa-solid ${t.icon}"></i></div>`}<div class="rt"><b>${esc(r[t.title]||"(no title)")}</b><small>${esc(t.sub?t.sub(r):"")}</small>${st}</div><div class="ra"><button data-act="edit" data-t="${k}" data-id="${r.id}">Edit</button><button data-act="prev" data-t="${k}" data-id="${r.id}">Preview</button><button data-act="tog" data-t="${k}" data-id="${r.id}">${r.published?"Unpublish":"Publish"}</button><button class="del" data-act="del" data-t="${k}" data-id="${r.id}">Delete</button></div></div>`};
async function list(k){
  const t=T[k];el.innerHTML="Loading…";let q=sb.from(t.table).select("*").order("created_at",{ascending:false});if(t.fix)q=q.eq("type",t.fix);
  const {data,error}=await q;if(error)return el.innerHTML=errBox(error);ROWS=data;if(k==="announcements")COURSES=(await sb.from("courses").select("id,name")).data||[];
  el.innerHTML=`<div class="vh"><h2>${t.label}</h2><button class="btn" data-act="new" data-t="${k}"><i class="fa-solid fa-plus"></i> Add new</button></div>`+(data.length?data.map(r=>row(k,r)).join(""):`<div class="empty">Nothing here yet. Click “Add new”.</div>`);
}
function field(f,v){
  const [k,l,ty,req,x]=f;v=v??"";const r=req?"required":"";
  if(ty==="check")return `<label class="chk"><input type="checkbox" name="${k}" ${v?"checked":""}> ${l}</label>`;
  let i;
  if(ty==="textarea")i=`<textarea name="${k}" rows="5" ${r}>${esc(v)}</textarea>`;
  else if(ty==="select"){const o=typeof x==="function"?x():x;i=`<select name="${k}" ${r}>${o.map(a=>`<option value="${esc(a[0])}" ${a[0]==v?"selected":""}>${esc(a[1])}</option>`).join("")}</select>`}
  else if(ty==="image"||ty==="pdf")i=`<input type="hidden" name="${k}" value="${esc(v)}" ${r}><input type="file" data-up="${k}" accept="${ty==="image"?"image/*":"application/pdf"}"><div class="fn" id="fn_${k}">${v?"A file is already attached ✓":"No file chosen"}</div>${ty==="image"?`<img class="thumb" id="th_${k}" src="${esc(v)}" alt="" ${v?"":"hidden"}>`:""}`;
  else i=`<input type="${ty}" name="${k}" value="${esc(v)}" ${r}>`;
  return `<div class="fld"><label>${l}${req?" *":""}</label>${i}${x&&ty!=="select"?`<small>${x}</small>`:""}</div>`;
}
async function form(k,id){
  const t=T[k];if(k==="announcements"||!COURSES.length)COURSES=(await sb.from("courses").select("id,name").order("name")).data||[];
  const r=id?ROWS.find(x=>x.id===id)||{}:(t.def||{});
  el.innerHTML=`<div class="vh"><h2>${id?"Edit":"Add"} – ${t.label}</h2></div><form class="form" id="f" data-t="${k}" data-id="${id||""}">${t.f.map(f=>field(f,r[f[0]])).join("")}<div class="ra"><button class="btn" type="submit">Save</button><button class="btn2" type="button" data-act="prevform">Preview</button><button class="btn2" type="button" data-go="${k}">Cancel</button></div></form>`;
}
function read(f,t){const o={};T[t].f.forEach(([k,,ty])=>{const e=f.elements[k];o[k]=ty==="check"?e.checked:e.value.trim()===""?null:e.value.trim()});return o}
function preview(k,o){
  if(k==="courses")return courseCard(o,SET);
  if(k==="announcements"){o.courses=COURSES.find(c=>c.id===o.course_id)||null;return annCard(o)}
  if(k==="gallery")return o.image_url?`<img src="${esc(o.image_url)}" alt="">`:"No photo uploaded yet";
  if(k==="documents")return docRow(o);
  return personCard(o);
}
const shrink=f=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>{const s=Math.min(1,1600/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*s;c.height=i.height*s;const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);c.toBlob(b=>b?res(b):rej(new Error("Image error")),"image/jpeg",.85)};i.onerror=()=>rej(new Error("Cannot read image"));i.src=URL.createObjectURL(f)});
async function upload(inp){
  const f=inp.files[0];if(!f)return;const k=inp.dataset.up,fn=$("#fn_"+k),img=f.type.startsWith("image/");
  if(!img&&f.type!=="application/pdf"){inp.value="";return toast("Only photos or PDF files are allowed",1)}
  if(f.size>10*1048576){inp.value="";return toast("File is larger than 10 MB",1)}
  fn.textContent="Uploading… please wait";
  try{
    const blob=img?await shrink(f):f,nm=f.name.replace(/\.[^.]+$/,"").replace(/[^a-z0-9]+/gi,"-").toLowerCase().slice(0,40)||"file",path=`${img?"images":"pdfs"}/${Date.now()}-${nm}.${img?"jpg":"pdf"}`;
    const {error}=await sb.storage.from(C.BUCKET).upload(path,blob,{contentType:img?"image/jpeg":"application/pdf"});if(error)throw error;
    const url=sb.storage.from(C.BUCKET).getPublicUrl(path).data.publicUrl;inp.form.elements[k].value=url;fn.textContent="Uploaded ✓ "+f.name;
    const th=$("#th_"+k);if(th){th.src=url;th.hidden=false}
  }catch(e){fn.textContent="Upload failed: "+(e.message||e)}
}
const rmFiles=(r,t)=>{const p=T[t].f.filter(f=>f[2]==="image"||f[2]==="pdf").map(f=>(r[f[0]]||"").split("/object/public/"+C.BUCKET+"/")[1]).filter(Boolean);return p.length?sb.storage.from(C.BUCKET).remove(p):0};
async function content(){
  el.innerHTML="Loading…";const {data,error}=await sb.from("site_content").select("*");if(error)return el.innerHTML=errBox(error);SET={};data.forEach(r=>SET[r.key]=r.value);
  el.innerHTML=`<div class="vh"><h2>Website Content</h2></div><p class="mut">About Us, contact details and other texts. Empty boxes are hidden on the website. Add only real, official information.</p><form class="form" id="cf">${CONTENT.map(f=>field(f,SET[f[0]])).join("")}<button class="btn" type="submit">Save</button></form>`;
}
document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-go],[data-go2],[data-act]");if(!b)return;
  if(b.dataset.go)return go(b.dataset.go);
  if(b.dataset.go2)return go(b.dataset.go2,"");
  const a=b.dataset.act,t=b.dataset.t,id=b.dataset.id;
  if(a==="close"){$("#mo").hidden=true;return}
  if(a==="new")return go(t,"");
  if(a==="edit")return go(t,id);
  const r=ROWS.find(x=>x.id===id);
  if(a==="prev")return showMo(`<p class="mut">Preview – this is how it looks on the website.</p>${preview(t,{...r})}`);
  if(a==="prevform"){const f=$("#f");return showMo(`<p class="mut">Preview (not saved yet).</p>${preview(f.dataset.t,read(f,f.dataset.t))}`)}
  if(a==="tog"){const {error}=await sb.from(T[t].table).update({published:!r.published}).eq("id",id);if(error)return toast(error.message,1);toast(r.published?"Unpublished":"Published");return list(t)}
  if(a==="del"){if(!confirm(`Delete “${r[T[t].title]||"this item"}” permanently?\n\nThis cannot be undone. (To hide it temporarily, use Unpublish instead.)`))return;
    const {error}=await sb.from(T[t].table).delete().eq("id",id);if(error)return toast(error.message,1);await rmFiles(r,t);toast("Deleted");list(t)}
});
document.addEventListener("change",e=>{if(e.target.dataset&&e.target.dataset.up)upload(e.target)});
document.addEventListener("submit",async e=>{
  const f=e.target;if(f.id==="lf")return;e.preventDefault();
  if(f.id==="cf"){const rows=CONTENT.map(([k])=>({key:k,value:f.elements[k].value.trim()}));const {error}=await sb.from("site_content").upsert(rows);return error?toast(error.message,1):toast("Saved")}
  if(f.id==="f"){const t=f.dataset.t,id=f.dataset.id,o=read(f,t);if(T[t].fix)o.type=T[t].fix;
    const miss=T[t].f.find(x=>x[3]&&(x[2]==="image"||x[2]==="pdf")&&!o[x[0]]);if(miss)return toast("Please upload: "+miss[1],1);
    const {error}=id?await sb.from(T[t].table).update(o).eq("id",id):await sb.from(T[t].table).insert(o);
    if(error)return toast(error.message,1);toast("Saved");go(t)}
});
$("#lo").onclick=async()=>{await sb.auth.signOut();login()};
function login(msg){$("#appBox").hidden=true;$("#loginBox").hidden=false;const e=$("#le");e.hidden=!msg;e.textContent=msg||""}
$("#lf").onsubmit=async e=>{e.preventDefault();const {error}=await sb.auth.signInWithPassword({email:$("#em").value.trim(),password:$("#pw").value});if(error)return login("Wrong email or password.");enter()};
async function enter(){
  const {data}=await sb.from("admins").select("user_id").maybeSingle();
  if(!data){await sb.auth.signOut();return login("This account is not an authorised administrator.")}
  const s=await sb.from("site_content").select("*");(s.data||[]).forEach(r=>SET[r.key]=r.value);
  $("#loginBox").hidden=true;$("#appBox").hidden=false;go("dash");
}
(async()=>{
  if(!CONFIGURED){document.body.innerHTML='<div class="login"><h3>Setup needed</h3><p>Open <b>js/config.js</b> and paste your Supabase URL and anon key.</p></div>';return}
  const {data:{session}}=await sb.auth.getSession();session?enter():login();
})();
