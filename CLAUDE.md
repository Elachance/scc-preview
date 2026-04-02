# Silverado Children's Center — Website Redesign

## Project overview
Rebuilding the SCC website as clean, custom HTML/CSS. Staging is on GitHub Pages; long-term production target is WordPress. The live Wix site at silveradochildrenscenter.com is the reference for content only — all design and structure is being rebuilt from scratch.

**Staging preview:** https://elachance.github.io/scc-preview/
**Repo:** elachance/scc-preview

---

## Tech stack
- Pure HTML + CSS (no frameworks, no build step)
- Fonts: Cormorant Garamond + Jost via Google Fonts (registered as a shared nav, some inner pages may use Playfair Display + Nunito — standardize to Cormorant + Jost on new pages)
- No JavaScript frameworks
- Form backend: Formspree (not yet connected — awaiting endpoint URL from client)

---

## Design system

### Color palette (CSS variables)
```css
--ochre:    #c17f3a;   /* primary accent, headings */
--sage:     #7a9e7e;   /* secondary accent, vaccine bar */
--bark:     #5c3d2e;   /* dark text */
--stone:    #8c7b6e;   /* muted text */
--clay:     #a0522d;   /* links */
--parchment:#f5f0e8;   /* card backgrounds */
--cream:    #faf7f2;   /* page background */
```

### Typography
- Headings: Cormorant Garamond (serif), weights 400/500/600
- Body: Jost, weight 300 (light) for copy, 400/500 for labels/UI
- `.label` class: small-caps eyebrow text above section headings

### Layout conventions
- Max content width: 900px centered, padding 1.5rem sides
- `.container` wraps all page content
- `.section` adds vertical rhythm between content blocks
- `.card-grid` for 3-column card layouts
- `.highlight-box` for callout/notice boxes (sage left border)
- `hr.divider` between sections

---

## Site structure

### Pages built ✅
| File | URL | Status |
|------|-----|--------|
| `index.html` | `/` | Complete |
| `about.html` | `/about.html` | Complete |
| `programs.html` | `/programs.html` | Complete |
| `vaccines.html` | `/vaccines.html` | Complete |
| `tour.html` | `/tour.html` | Complete — form not connected |
| `foscc.html` | `/foscc.html` | Complete |
| `wheelie.html` | `/wheelie.html` | Complete |
| `scc-registration-form.html` | `/scc-registration-form.html` | Complete — form not connected |

### Pages needed ⚠️ (linked but will 404)
| File | Notes |
|------|-------|
| `faq.html` | Content available on live Wix site — ready to build |
| `gallery.html` | Needs photos from Laurie |
| `summer.html` | Summer program registration — awaiting client input on field differences |
| `afterschool.html` | Minimal content on live site — may need client input |
| `merchandise.html` | No content on live site — needs product info from client |

---

## Navigation (shared across all pages)
All pages share the same nav and footer. Inner pages use an earth-tone sticky nav; the homepage uses a dark gradient nav for contrast against the hero photo.

Nav links (in order):
- About → `/about.html`
- Programs → `/programs.html`
- FAQ → `/faq.html`
- Gallery → `/gallery.html`
- Tour → `/tour.html`
- Enroll → `/scc-registration-form.html`

Footer community links:
- Friends of SCC → `/foscc.html`
- Wheelie Fun Fest → `/wheelie.html`
- Merchandise → `/merchandise.html`

---

## Key content facts (do not invent or change these)
- **Founded:** 1990
- **Ages served:** 2–7
- **School hours:** 8:30 AM – 5:00 PM, Monday–Friday
- **Address:** 7525 Santiago Canyon Rd, Silverado, CA 92676
- **Phone:** (714) 649-2214
- **Setting:** Always refer to as "canyons of Silverado" (not "Santa Ana Mountains")
- **Animals on campus:** 2 goats, 1 miniature horse, 1 tortoise (Tank — pulled in red wagon), 1 leopard gecko, wild bunnies in the hills. Wildlife camera on canyon. No chickens.
- **Governance:** SMRPD (Silverado Modjeska Recreation and Parks District)
- **Curriculum:** Emergent curriculum, nature-based, outdoor-focused
- **Campus landmarks:** Bobcat Creek, Hawk Tree, The Stables, Library of the Canyons

### Classroom groupings
- Seedlings / Acorns: ages 2–3
- Pinecones / Oak Trees: ages 4–7

### Schedule options
- Half Day, Three-Quarter Day, Full Day

---

## Enrollment flow
"Schedule a Tour" is always the primary CTA. "Begin Enrollment" is secondary, always paired with the note: *"A campus tour is required before enrollment is finalized."*

---

## Forms (Formspree — PENDING)
Both forms need a Formspree endpoint URL from the client (Laurie) before they go live. When received, update:
- `tour.html` → `<form action="FORMSPREE_URL">`
- `scc-registration-form.html` → `<form action="FORMSPREE_URL">`

Formspree free tier = 50 submissions/month. Emails submissions directly to Laurie's inbox.

---

## Friends of SCC (FoSCC)
501(c)(3) nonprofit that fundraises for SCC.
- Email: friendsofsilveradocc@gmail.com
- Zelle: friendsofsilveradocc@gmail.com
- Venmo: @FriendsofSilveradoCC
- PayPal donate link: https://www.paypal.com/donate/?hosted_button_id=J5X5LPB9VTDTU
- Ralphs Rewards ID: RJ841
- Minted code: FUNDRAISESILVERADO
- Amazon Wish List: https://www.amazon.com/hz/wishlist/ls/1AS8ED8CIGL64
- Facebook: https://www.facebook.com/FriendsofSCC

### Fundraiser events
- **Wheelie Fun Fest** — annual bike/trike/scooter ride fundraiser. 2021 inaugural: $6,500+. 2022: $9,000+.
- **Silverado Country Fair** — annual community fair
- At enrollment, families commit to one: Wheelie Fun Fest volunteer OR Silverado Country Fair volunteer. If commitment not fulfilled → $250 donation required.

---

## Photo policy
Only use back-of-head, animal, or campus shots until Laurie confirms face photo permissions from families. All photos provided by client.

---

## Client contact
**Laurie** — school director, not highly technical. Keep any instructions simple. She will:
- Sign up for Formspree and provide the endpoint URL
- Confirm face photo permissions
- Provide content for summer.html, afterschool.html, merchandise.html, gallery.html
