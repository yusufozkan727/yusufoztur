# Yusuf �zkan Turlar � Proje Kurulumu ve Dagitim

Bu depo, Astro + Tailwind + Decap CMS (Git tabanli) ile �ok dilli (tr/en/pl) Istanbul �zel turlari web sitesi i�erir.

Hizli baslangi�:
- Node 18+
- Kurulum: `npm i`
- Gelistirme: `npm run dev` ve `http://localhost:4321`
- �retim derlemesi: `npm run build` (�ikti: `dist/`)

Dagitim � Cloudflare Pages:
- New Project ? mevcut repo bagla
- Build command: `npm run build`
- Output directory: `dist`
- Environment: `NODE_VERSION=18`

Dagitim � GitHub Pages (opsiyonel):
- GitHub Actions ile `npm ci && npm run build`, `dist/` yayinla

CMS (Decap):
- Y�netim paneli: `/admin`
- `public/admin/config.yml` i�inde GitHub repo adini g�ncelle: `<GITHUB_USERNAME>/yusuf-ozkan-turlar`

Asagida orijinal tek-seferlik spesifikasyon yer alir.

VIBECODING SINGLE-PROMPT SPEC — “Yusuf Özkan | İstanbul Özel Turlar”
ROLE: Full-stack generator. Produce a complete, deployable project.

NON-NEGOTIABLES

- Owner = Yusuf Özkan
- Free domain + hosting only
- Dynamic content updates via Git-based CMS (no paid services)
- Multilingual: pl, tr, en
- Site purpose: Istanbul private tours, attractions, contact via WhatsApp and email
- Structure similar to stambul.com.pl: Home, Places, Gallery, About, Testimonials, Contact
- Ship a working Git repo with docs and seed content

STACK

- Framework: Astro (React components allowed)
- Styling: Tailwind CSS
- CMS: Decap CMS (GitHub backend) with /admin
- Hosting: Cloudflare Pages (default) with free \*.pages.dev
- Optional alt-host: GitHub Pages compatible build
- Serverless: Cloudflare Pages Functions only if required for simple validations
- Images: /public/images + responsive images, lazy loading

REPO + DEPLOY BASICS

- Repository name: yusuf-ozkan-turlar
- Default branch: main
- Build: npm run build
- Output dir: dist
- Provide a CI-ready project that builds locally with: npm i && npm run dev
- README.md must include step-by-step deploy to Cloudflare Pages and GitHub Pages

INFORMATION ARCHITECTURE

1. / (Home)
   - Hero: headline, subtext, primary CTA = WhatsApp, secondary CTA = Places
   - Services section: 3–4 cards (Historic sites, Cultural experiences, Bosphorus tour, Custom tours)
   - About preview block with photo and “Read more” button
   - Featured tours carousel
   - Testimonials slider (3–5 items)
   - Secondary CTA: WhatsApp / Email
2. /places (List)
   - Grid of cards: cover, title, summary, “Details” link
3. /places/[slug] (Detail)
   - Hero image, body (markdown), practical info: location, open days/hours, ticket note
   - Related places section
4. /gallery
   - Masonry/lightbox gallery
5. /about
   - Portrait, bio, licenses, experience
6. /testimonials
   - List with rating, date, quote, avatar
7. /contact
   - Primary: WhatsApp click-to-chat
   - Secondary: mailto link
   - Optional simple form with client-side validation; fallback to prefilled WhatsApp or mailto

GLOBAL OWNER DATA

- name: "Yusuf Özkan"
- title: "Lisanslı Tur Rehberi (TR/EN/PL)"
- phone_whatsapp_e164: "+90XXXXXXXXXX" # replace only digits after +90
- email: "yusuf.ozkan@example.com"
- socials: instagram (optional), facebook (optional)
- license_id: "" (optional)

I18N

- Languages: pl, tr, en
- URLs: /pl, /tr, /en; / = language detection + manual switch
- Strategy: /src/i18n/\*.json for UI strings; content entries include a lang field
- Provide language switcher component and proper hreflang/alternate links

CMS (DECAP) CONFIG — /admin/config.yml
backend:
name: github
repo: <GITHUB_USERNAME>/yusuf-ozkan-turlar
branch: main
publish_mode: editorial_workflow
media_folder: "public/images/uploads"
public_folder: "/images/uploads"
collections:

- name: pages
  label: Pages
  files:
  - file: "content/home.yml"
    label: Home
    name: home
    fields:
    - {label: Language, name: lang, widget: select, options: ["pl","tr","en"]}
    - {label: Hero Title, name: hero_title, widget: string}
    - {label: Hero Subtitle, name: hero_subtitle, widget: text}
    - {label: Primary CTA Text, name: primary_cta, widget: string}
    - {label: Secondary CTA Text, name: secondary_cta, widget: string}
  - file: "content/about.yml"
    label: About
    name: about
    fields:
    - {label: Language, name: lang, widget: select, options: ["pl","tr","en"]}
    - {label: Title, name: title, widget: string}
    - {label: Body, name: body, widget: markdown}
    - {label: Portrait, name: portrait, widget: image, required: false}
  - file: "content/contact.yml"
    label: Contact
    name: contact
    fields:
    - {label: Language, name: lang, widget: select, options: ["pl","tr","en"]}
    - {label: WhatsApp Number (E.164), name: whatsapp, widget: string}
    - {label: Email, name: email, widget: string}
    - {label: Prefilled Message, name: msg, widget: string, required: false}
- name: places
  label: Places
  folder: "content/places"
  create: true
  slug: "{{slug}}"
  fields:
  - {label: Language, name: lang, widget: select, options: ["pl","tr","en"]}
  - {label: Title, name: title, widget: string}
  - {label: Summary, name: summary, widget: text}
  - {label: Body, name: body, widget: markdown}
  - {label: Cover, name: cover, widget: image}
  - label: Gallery
    name: gallery
    widget: list
    fields:
    - {label: Image, name: src, widget: image}
    - {label: Alt, name: alt, widget: string}
  - label: Location
    name: location
    widget: object
    fields:
    - {label: Name, name: name, widget: string}
    - {label: Lat, name: lat, widget: number}
    - {label: Lng, name: lng, widget: number}
  - label: Tips
    name: tips
    widget: list
    field: {label: Tip, name: tip, widget: string}
- name: tours
  label: Tours
  folder: "content/tours"
  create: true
  slug: "{{slug}}"
  fields:
  - {label: Language, name: lang, widget: select, options: ["pl","tr","en"]}
  - {label: Title, name: title, widget: string}
  - {label: Duration, name: duration, widget: string}
  - {label: Price Info, name: price_info, widget: string}
  - label: Includes
    name: includes
    widget: list
    field: {label: Item, name: item, widget: string}
  - label: Itinerary
    name: itinerary
    widget: list
    field: {label: Step, name: step, widget: string}
  - {label: Cover, name: cover, widget: image}
  - label: Gallery
    name: gallery
    widget: list
    fields:
    - {label: Image, name: src, widget: image}
    - {label: Alt, name: alt, widget: string}
- name: testimonials
  label: Testimonials
  folder: "content/testimonials"
  create: true
  slug: "{{slug}}"
  fields:
  - {label: Language, name: lang, widget: select, options: ["pl","tr","en"]}
  - {label: Name, name: name, widget: string}
  - {label: Rating, name: rating, widget: number, min: 1, max: 5, step: 1}
  - {label: Quote, name: quote, widget: text}
  - {label: Date, name: date, widget: datetime}
  - {label: Avatar, name: avatar, widget: image, required: false}
- name: settings
  label: Settings
  file: "content/settings.yml"
  fields:
  - {label: Owner Name, name: owner_name, widget: string, default: "Yusuf Özkan"}
  - {label: Title, name: owner_title, widget: string, default: "Lisanslı Tur Rehberi (TR/EN/PL)"}
  - {label: WhatsApp E.164, name: whatsapp_number, widget: string}
  - {label: Email, name: email, widget: string}
  - label: Socials
    name: socials
    widget: object
    fields:
    - {label: Instagram, name: instagram, widget: string, required: false}
    - {label: Facebook, name: facebook, widget: string, required: false}
  - {label: Primary CTA, name: primary_cta_text, widget: string, default: "WhatsApp ile iletişim"}
  - {label: Secondary CTA, name: secondary_cta_text, widget: string, default: "Mekânları keşfet"}

FILES TO GENERATE

- package.json with scripts:
  - dev: astro dev
  - build: astro build
  - preview: astro preview
  - format: prettier --write .
- astro.config.mjs with i18n base settings
- tailwind.config.js + postcss.config.cjs + src/styles/global.css
- /src/pages: index.astro, places/index.astro, places/[slug].astro, gallery.astro, about.astro, testimonials.astro, contact.astro
- /src/components: Hero.astro, ServiceCard.astro, PlaceCard.astro, TestimonialSlider.astro, LangSwitcher.astro, ContactPanel.astro, LightboxGallery.astro, WhatsAppButton.tsx
- /src/i18n/{pl,tr,en}.json with UI strings
- /admin/index.html and /admin/config.yml (as above)
- /content seed files (see below)
- public/favicon.svg, public/og-image.jpg, public/robots.txt, public/sitemap.xml

WHATSAPP CTA RULES

- Use https://wa.me/<E164>?text=<urlencoded_message>
- Pre-fill dynamic message per language, e.g. “Merhaba, {tour_or_place} hakkında bilgi alabilir miyim?”
- Ensure only digits in number after country code (no spaces, parentheses, hyphens)

SEO + ACCESSIBILITY

- Add hreflang alternates, OpenGraph, Twitter meta
- Add schema.org LocalBusiness and TouristAttraction where relevant
- Images responsive and lazy
- Contrast ≥ 4.5:1, alt text on images, keyboard navigable menus/lightbox
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95

SEED CONTENT

- Places (6 x per language): Ayasofya, Topkapı Sarayı, Sultanahmet Camii, Yerebatan Sarnıcı, Dolmabahçe Sarayı, Hipodrom
  - Each with short summary and a markdown body (2–3 paragraphs), dummy lat/lng, tips list, cover + 2 gallery images
- Testimonials (5 x mixed languages) with rating=5 and realistic dates
- About page per language: short bio for Yusuf Özkan, license mention
- Home page per language: hero_title, hero_subtitle, CTA texts
- Contact content per language: WhatsApp number placeholder, email, default message
- Gallery: 12 placeholder images with descriptive alts

NAVIGATION

- Header: Home, Places, Gallery, About, Testimonials, Contact
- Footer: phone, WhatsApp, email, socials, license note

LANGUAGE SWITCHING

- Provide a LangSwitcher component that toggles between /pl, /tr, /en for the current route
- Persist selection in localStorage for initial hint; still render server-safe default

ACCEPTANCE CHECKLIST (MUST PASS)

- npm i && npm run build creates /dist without errors
- /admin opens Decap CMS UI and allows creating entries; committing creates Git commit/PR
- Adding or editing content triggers deploy on Cloudflare Pages
- Language switch updates all navigational and UI strings plus content
- WhatsApp button opens correct wa.me link with prefilled message in the active language
- Lighthouse scores meet targets on a clean run
- README includes explicit Cloudflare Pages deploy steps with screenshots or CLI commands

README REQUIREMENTS

- Prereqs: Node LTS, GitHub account, Cloudflare account
- Local dev run
- GitHub repo creation
- Cloudflare Pages setup (project from repo, set build command and output dir)
- Decap CMS GitHub OAuth (brief steps)
- How to edit content via /admin
- Custom domain option explanation (optional); default keeps free \*.pages.dev
- FAQ: How to change WhatsApp number, email, add a new language, add a new place/tour

QUALITY BAR

- Clean, minimal UI, fast first paint, no console errors
- Type-safe props where TS is used
- No paid dependencies

BEGIN GENERATION NOW.

