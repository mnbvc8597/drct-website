# DRCT இணையதளம் + Admin Dashboard – தமிழ் வழிகாட்டி

**Dhandapani Rural Charitable Trust, Gobichettipalayam** – கோடிங் தெரியாமலேயே நீங்களே நிர்வகிக்கலாம்.

## 0. கோப்பு அமைப்பு (Folder structure)

```
drct-website/
├── index.html              ← பொது இணையதளம் (Public website)
├── admin.html              ← Admin Dashboard (login தேவை)
├── .nojekyll
├── assets/logo.png         ← ★ நீங்கள் வைக்க வேண்டியது: DRCT அதிகாரப்பூர்வ லோகோ
├── css/style.css
├── js/config.js            ← ★ நீங்கள் திருத்த வேண்டியது (Supabase URL + key)
├── js/common.js  js/app.js  js/admin.js
└── supabase/schema.sql  supabase/make_admin.sql
```

## நீங்கள் செய்ய வேண்டியவை – சுருக்கம் (Checklist)

- [ ] 1. Supabase கணக்கு + Project உருவாக்குதல்
- [ ] 2. `schema.sql` ஐ SQL Editor-இல் Run செய்தல்
- [ ] 3. `js/config.js` இல் URL + anon key ஒட்டுதல்
- [ ] 4. முதல் Admin user உருவாக்கி `make_admin.sql` Run செய்தல்
- [ ] 5. Public sign-up ஐ **Disable** செய்தல்
- [ ] 6. `assets/logo.png` ஆக DRCT லோகோவை வைத்தல்
- [ ] 7. GitHub Pages-இல் Publish செய்தல்
- [ ] 8. Supabase-இல் Site URL கொடுத்தல்
- [ ] 9. Admin → **Website Content** இல் உண்மையான முகவரி, தொலைபேசி, WhatsApp, Email நிரப்புதல்

> ⚠️ இந்த வலைத்தளத்தில் எந்த தொலைபேசி எண், முகவரி, சாதனை, அனுமதி விவரமும் நான் உருவாக்கி வைக்கவில்லை. அனைத்தும் காலியாக உள்ளன; **உண்மையான, அதிகாரப்பூர்வ தகவல்களை நீங்களே** நிரப்பவும்.

---

## படி 1 – Supabase Project உருவாக்குதல்

1. https://supabase.com → **Start your project** → GitHub அல்லது Email மூலம் Sign up.
2. **New project** → பெயர்: `drct-website` → Database Password (வலுவான password; பாதுகாப்பாக எழுதி வைக்கவும்) → Region: **South Asia (Mumbai)** → **Create**.
3. 2 நிமிடம் காத்திருக்கவும்.

## படி 2 – Database + Security அமைத்தல்

1. இடது மெனு → **SQL Editor** → **New query**.
2. `supabase/schema.sql` கோப்பை Notepad-இல் திறந்து **முழுவதையும் Copy** → SQL Editor-இல் Paste → **Run**.
3. "Success" என்று வர வேண்டும். இது அட்டவணைகள் (tables), பாதுகாப்பு விதிகள் (RLS), `public-files` Storage bucket அனைத்தையும் உருவாக்கும்.

## படி 3 – config.js நிரப்புதல்

1. Supabase → **Project Settings (⚙️)** → **API**.
2. **Project URL** மற்றும் **anon public** key ஐ copy செய்யவும்.
3. `js/config.js` ஐ Notepad-இல் திறந்து `PASTE_PROJECT_URL_HERE` மற்றும் `PASTE_ANON_PUBLIC_KEY_HERE` இடங்களில் ஒட்டவும். Save.

🔒 **anon key** frontend-இல் இருப்பது பாதுகாப்பானது (பாதுகாப்பு RLS விதிகளால்). ஆனால் **`service_role` key ஐ எங்கும் ஒட்டக்கூடாது; யாருக்கும் தரக்கூடாது.**

## படி 4 – முதல் Admin கணக்கை பாதுகாப்பாக உருவாக்குதல்

இணையதளத்தில் "Register" பக்கம் **இல்லை** – இது வேண்டுமென்றே.

1. Supabase → **Authentication** → **Users** → **Add user** → **Create new user**.
2. உங்கள் Email + வலுவான Password (12+ எழுத்துகள்) கொடுக்கவும். **Auto Confirm User** ✔ தேர்வு செய்து Create.
3. **SQL Editor** → New query → `supabase/make_admin.sql` ஐ paste செய்து, `PASTE-ADMIN-EMAIL-HERE` ஐ உங்கள் Email ஆக மாற்றி **Run**. 1 வரி காட்டினால் வெற்றி.
4. **படி 5 (மிக முக்கியம்):** **Authentication → Sign In / Providers** (அல்லது Settings) → **Allow new users to sign up** ஐ **OFF** செய்து Save. இதனால் வேறு யாரும் கணக்கு உருவாக்க முடியாது.

> `admins` பட்டியலில் இல்லாத எவரும் login செய்தாலும் எதையும் மாற்ற முடியாது.

## படி 6 – லோகோ

DRCT-இன் அதிகாரப்பூர்வ லோகோவை `logo.png` என்ற பெயரில் `assets` folder-இல் வைக்கவும். (லோகோ இல்லையென்றால் பெயர் மட்டும் தெரியும்.) லோகோவையோ பெயரையோ மாற்ற வேண்டாம்.

## படி 7 – GitHub Pages-இல் வெளியிடுதல்

1. https://github.com → Sign up → **New repository** → பெயர் `drct-website` → **Public** → Create.
2. **uploading an existing file** → `drct-website` folder-க்குள் உள்ள **அனைத்து கோப்புகள் + folders** (`.nojekyll` உட்பட) drag & drop → **Commit changes**.
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `(root)` → **Save**.
4. 1–3 நிமிடத்தில் `https://<உங்கள்-username>.github.io/drct-website/` வரும்.
   - Public site: அந்த முகவரி
   - Admin: அந்த முகவரி + `/admin.html`
5. Supabase → **Authentication → URL Configuration** → **Site URL** இல் மேற்கண்ட முகவரியை உள்ளிடவும்.

`config.js` ஐ மாற்றினால் GitHub-இல் அந்த கோப்பை Edit → Commit செய்யவும்.

---

## தினசரி பயன்பாடு

### புதிய Course சேர்ப்பது
1. `…/admin.html` → Login.
2. **Courses** → **Add new**.
3. பாடப்பெயர், Code, Scheme, Admission status (**Open / Upcoming / Closed**), விளக்கம், தகுதி, காலம், இடம், படம் (Choose file) நிரப்பவும்.
4. **Preview** அழுத்தி எப்படி தெரியும் என பார்க்கவும்.
5. **Publish (show on website)** ✔ → **Save**.

### புதிய Announcement
1. **Announcements** → **Add new** → Title, Category, Publication date, விளக்கம்.
2. தேவையெனில் Related course, PDF, **Expiry date** (அந்த தேதிக்குப் பின் தானாக மறையும்).
3. **Publish** ✔ → **Save**. முகப்புப் பக்கத்தில் புதிய 5 அறிவிப்புகள் தானாகத் தெரியும்.

### Photo / PDF
- **Gallery → Add new** → Photo தேர்வு (தானாகச் சிறிதாக்கப்படும்) → Save.
- **PDF Downloads → Add new** → PDF (அதிகபட்சம் 10 MB) → Save.

### திருத்த / நீக்க
- பட்டியலில் **Edit**, **Unpublish** (தற்காலிகமாக மறைக்க), **Delete** (நிரந்தரம் – உறுதிப்படுத்தும் பெட்டி வரும்).
- About Us, முகவரி, தொலைபேசி, WhatsApp, Email, சமூக வலைதள இணைப்புகள்: **Website Content**.
- WhatsApp எண்: 10 இலக்கம் (எ.கா. `9XXXXXXXXX`) – தானாக 91 சேரும்.

---

## தனியுரிமை (Privacy)
மாணவர் விவரங்கள் எதுவும் சேகரிக்கப்படாது. "WhatsApp / Call / Email" பொத்தான்கள் நேரடியாக உங்கள் எண்/மின்னஞ்சலைத் திறக்கும். **Success Stories**-இல் சம்பந்தப்பட்டவரின் எழுத்துப்பூர்வ அனுமதியுடன் மட்டும் பெயர்/படம் போடவும்; தொலைபேசி, முகவரி, ஆதார் எண் ஆகியவற்றை எழுதவே கூடாது.

## பாதுகாப்பு சுருக்கம்
- Secret key எதுவும் frontend-இல் இல்லை (anon key மட்டும்).
- Visitors: **வெளியிடப்பட்ட (published) தகவலை மட்டும்** படிக்கலாம். Expiry ஆன அறிவிப்புகள் தானாக மறையும்.
- சேர்/திருத்து/நீக்கு: `admins` பட்டியலில் உள்ளவர்கள் மட்டும் (Database + Storage இரண்டிலும்).
- `admin.html` search engine-இல் வராது (noindex); ஆனால் உண்மையான பாதுகாப்பு Login + RLS.

## பிரச்சினைகள் (Troubleshooting)
| பிரச்சினை | தீர்வு |
|---|---|
| "Setup needed" என வருகிறது | `js/config.js` நிரப்பவில்லை (படி 3) |
| Login ஆகிறது, ஆனால் "not an authorised administrator" | `make_admin.sql` Run செய்யவில்லை / Email தவறு |
| Save செய்தால் "row-level security" பிழை | `schema.sql` முழுமையாக Run ஆகவில்லை; மீண்டும் Run செய்யவும் (மீண்டும் Run செய்வது பாதுகாப்பானது) |
| Upload failed | படம்/PDF மட்டும், 10 MB-க்குள்; Storage bucket `public-files` உள்ளதா சரிபார்க்கவும் |
| மாற்றம் தெரியவில்லை | Published ✔ உள்ளதா? Browser-ஐ Ctrl+F5 |
| இணையதளம் திடீரென வேலை செய்யவில்லை | Supabase இலவச project சில நாள் பயன்படுத்தாவிட்டால் Pause ஆகும் – Dashboard-இல் **Restore** அழுத்தவும் |

## வெளிப்படைத்தன்மை
இது உண்மையாக வேலை செய்யும் குறியீடு; ஆனால் உங்கள் Supabase திட்டத்துடன் இங்கிருந்து சோதிக்க முடியவில்லை. முதல் முறை படி 1–9 முடித்தபின், ஒரு சோதனை Course + Announcement சேர்த்து, Publish செய்து, முகப்புப் பக்கத்தில் தெரிகிறதா பார்க்கவும்; பின்னர் Delete செய்யவும்.
