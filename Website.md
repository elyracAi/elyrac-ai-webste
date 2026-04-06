# CLAUDE.md — elyrac Ai Website Development Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- **Check `brand_assets/` folder** before designing. Use logos, color palettes, and style guides if present.

---

## Brand Identity

### Company
- **Name:** elyrac Ai
- **Tagline:** Grace in Design
- **Mission:** Making AI accessible, ethical, and transformative
- **Founded:** 2021
- **Email:** hello@elyracai.com
- **Booking:** https://calendly.com/ceo-elyracai/30min

### Social Media
| Platform | Handle/Link |
|----------|-------------|
| LinkedIn | https://www.linkedin.com/company/elyrac-ai/?viewAsMember=true |
| Twitter/X | https://x.com/ElGracAi |
| YouTube | https://www.youtube.com/@elyracAi |
| TikTok | https://www.tiktok.com/@elyracai |
| Facebook | https://www.facebook.com/elyracAi |
| Instagram | https://www.instagram.com/elyracai/ |

---

## Design Reference

Screenshots provided show a **nexteam.id**-style layout. The elyrac Ai website should match this layout structure but use elyrac Ai's brand content, colors, and identity.

### Layout Sections (in order)
1. **Navbar** — Logo left, pill nav center, CTA button right
2. **Hero** — Full-viewport, dark background, headline left, stats/tagline right
3. **Ticker** — Scrolling marquee of service keywords
4. **Social Proof / Companies** — "Companies Growing With Us" + stats + logo grid
5. **Problems** — "Most [X] Fail Before They Start" — 3-card pain point grid
6. **Solutions** — "A Different Approach" — 2x2 feature card grid with illustrated visuals
7. **Tools / Tech Stack** — "Built With Proven Tools" — icon grid
8. **Recent Work / Portfolio** — Alternating layout with project screenshots + stats
9. **Pricing** — Multi-step interactive pricing calculator (3 tabs)
10. **FAQ** — Two-column: left stats + right accordion
11. **CTA Banner** — Dark background, "Ready To Start?" with 2x2 feature mini-cards
12. **Footer** — Logo + description + 2 nav columns + copyright

---

## Brand Colors

```css
:root {
  --navy:           #1B3A6B;
  --navy-deep:      #122952;
  --navy-dark:      #0D1F3C;
  --navy-darker:    #090F1E;
  --blue:           #4A7FD4;
  --blue-bright:    #5B9BF5;
  --blue-electric:  #6EBBFF;
  --blue-glow:      rgba(91, 155, 245, 0.15);
  --white:          #FFFFFF;
  --white-soft:     rgba(255, 255, 255, 0.88);
  --white-dim:      rgba(255, 255, 255, 0.5);
  --white-ghost:    rgba(255, 255, 255, 0.08);
  --white-line:     rgba(255, 255, 255, 0.1);
  --gold:           #F5A623;
}
```

**Primary accent:** `#5B9BF5` (blue-bright)
**Background (dark):** `#0D1F3C` / `#090F1E`
**Background (light mode):** `#EBF2FC`

---

## Typography

```css
--serif:   "Playfair Display", Georgia, serif;
--sans:    "Outfit", sans-serif;
--display: "Raleway", sans-serif;
```

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
```

**Usage rules:**
- **Headings (h1, h2):** Playfair Display, 400 weight, italic emphasis in blue-bright
- **Body text:** Outfit, 300–400 weight, 1.85–1.9 line-height
- **Labels, nav, tags, CTAs:** Raleway, 600–700 weight, letter-spacing 2–4px, uppercase
- **Large numbers/stats:** Playfair Display, large size, letter-spacing -1px to -2px

---

## Component Reference

### Navbar
```html
<!-- Structure -->
<nav id="nav">
  <a class="nav-logo-text" href="#">[LOGO IMG]</a>
  <div class="nav-pill">
    <ul class="nav-center">
      <li><a href="#">About Us</a></li>
      <li><a href="#">Solutions</a></li>
      <li><a href="#">Portfolio</a></li>
      <li><a href="#">Blog</a></li>
    </ul>
  </div>
  <a class="nav-cta" href="https://calendly.com/ceo-elyracai/30min" target="_blank">Book a Call</a>
</nav>
```
- Transparent on load, blurred dark on scroll (`nav.scrolled`)
- Center links inside a glassmorphism pill with 6px 8px padding
- CTA: white background, navy text, pill border-radius, hover → blue-electric

### Hero Section
- **Full viewport height**, dark gradient background with animated constellation SVG overlay
- **Left column:** Eyebrow label + h1 with italic blue word + subtext + CTA buttons
- **Right column:** Tagline (serif, soft white) + 4-row stat stack (Think / Build / Move / Grow)
- Stat stack rows: hover reveals bottom blue underline animation
- Buttons: `btn-primary` (clip-path polygon shape) + `btn-ghost` (border only)

**Hero copy:**
- Eyebrow: "AI-First Studio"
- H1: "Intelligence with *Grace.*"
- Subtext: "We make artificial intelligence accessible, ethical, and transformative — turning complex technology into your most powerful strategic advantage."
- Button 1: "Our Solutions" (scrolls to #services)
- Button 2: "How We Work" (scrolls to #process)
- Right tagline: "Empowering businesses to *grow with AI.*"
- Stats: Think / Build / Move / Grow

### Ticker
- Auto-scrolling marquee: `AI Strategy & Audit · Intelligent Automation · Custom AI Agents · Team Education · Continuous Support · Ethical AI Design · Workflow Architecture · Scalable Systems`
- Dark navy-deep background, subtle white text, blue stars as separators

### Social Proof Section (Companies)
- **Section label:** "COMPANIES GROWING WITH US"
- **H2:** "A Growth Partner to 50+ Companies"
- **Subtext:** "Trusted by teams at Bukit Vista, DOT Indonesia, and government institutions — companies that chose speed over uncertainty."
- **Stat cards:** `1000+ Users enabled with smooth adoption` | `50% Cost reduction average for our clients`
- **Logo grid:** 2 rows x 5 logos (use client logos or placehold.co)

### Problems Section
- **Section label:** "MOST STARTUP PROBLEMS" (blue dot prefix)
- **H2:** "Most MVPs Fail Before They Start"
- **Red subtext:** "90% of startups fail due to these common pitfalls that turn promising ideas into costly failures"
- **3 cards:**
  1. Endless Development — "6+ month development cycles that kill momentum → *Lost market opportunity*"
  2. Technical Debt Trap — "Technical debt that makes iteration impossible → *Stuck with legacy code*"
  3. Budget Drain — "Budget overruns that drain your runway → *Running out of resources*"
- Cards have 3D-style dark sphere icons with white symbols
- Arrow consequences in red/accent text

### Solutions Section
- **Section label:** "OUR SOLUTIONS"
- **H2:** "A Different Approach"
- **Subtext:** "Why settle for generic solutions when you can have a battle-tested, AI-accelerated approach that delivers results? Join the 10% that succeed."
- **2x2 grid of feature cards:**
  1. AI-accelerated development — binary/code background with floating tag pills (Faster Iterations, Early Bug Detection, Smarter Estimates, AI Integrated)
  2. Full-stack ownership — orbital diagram with logo center + service tags floating (Mobile Apps, Web Development, Seamless Integration, Faster Iterations)
  3. 30-day delivery — chat bubble quotes + "Fast Delivery" badge
  4. Battle-tested foundation — hub-and-spoke tech logo diagram (Tailwind, Next.js, NestJS, Prisma, PostgreSQL, Redis)

### Tech Stack Section
- **Section label:** "TOOLS WE USE"
- **H2:** "Built With Proven Tools"
- **Subtext:** "6 years of experience with these tools"
- Scrolling 2-row grid of technology icons: React, Laravel, Flutter, Tailwind, Node.js, PostgreSQL, Docker, TypeScript, AWS, etc.
- Each icon in a light border rounded card, hover scale effect

### Portfolio / Recent Work Section
- **Section label:** "WORK WE'RE PROUD OF"
- **H2:** "Recent Work"
- **Subtext:** "Real projects, real results. Here's how we've helped businesses ship their MVPs successfully."
- **Alternating layout:** image left + details right, then details left + image right
- Each project card shows:
  - Title + category badge
  - Challenge (red dot) + Result (green dot)
  - 3 stats: percentage/number + label

**Sample projects:**
1. KOL Platform — Ads Management — 99% uptime, 5,000+ users, 3 months
2. Government Dashboard — Government — 75% improvement, 60+ institutions, 4 months
3. Healthcare System — Health & Wellness — 80% cost reduction, 4 clinics, 3 months

### Pricing Section
- **Section label:** "PRICING"
- **H2:** "Fair And Transparent Pricing"
- **Subtext:** "Build your project budget based on team composition and timeline. No hidden fees; just clear pricing for quality development."
- **3-tab stepper:** 1. Choose Role → 2. Configure Team → 3. Ads On
- **Roles:** DevOps Engineer, Quality Assurance, Project Manager, Fullstack Developer ($500/person/month each)
- **Right panel:** Budget Estimation — Total Team Size, Team Members list, Total Estimation, "Get Detailed Quote" + "Schedule Consultation" buttons
- Active role button: blue filled; inactive: outlined with blue text

### FAQ Section
- **Left column:**
  - Section label: "COMMON QUESTIONS"
  - H2: "Frequently Asked Questions"
  - Subtext: "Get answers to common questions about our development process, project complexity, and system integrations."
  - 4 stat badges: 50+ Clients, 6+ Years, 100% On Time, 98+ Success Rate
- **Right column:** Accordion with chevron open/close icons
  - "How do you deliver so quickly?"
  - "What if my project is complex?"
  - "How do you handle system integrations?"

### CTA Banner Section
- **Dark blue background** (navy gradient with subtle radial glow)
- **White rounded card** centered on top of dark bg
- **Left inside card:** "GET STARTED" label + "Ready To Start?" H2 + "Let's discuss how we can bring your vision to life" + booking card with "Schedule a Call" button
- **Right inside card:** 2x2 grid of mini feature cards:
  - 1-on-1 Call (headset 3D icon) — "Personal attention."
  - 30 Minutes (handshake 3D icon) — "Quick & focused."
  - Free Consultation (tag 3D icon) — "No commitment."
  - Feasibility Check (search 3D icon) — "Check technical viability."

### Footer
- **Logo** + description: "Building reliable software, faster— transparent and outcome-driven."
- **Company column:** Home, About Us, Portfolio, Career
- **Services column:** MVP Development, Enterprise Software, AI-Powered Development, Tech Consulting
- **Social icons:** GitHub, LinkedIn, email
- **Copyright:** `© 2026 elyrac Ai — Grace in Design. All rights reserved.`

---

## Animations & Interactions

### Custom Cursor
- Small 10px blue-electric dot (`#cursor`), `mix-blend-mode: screen`
- Trailing 36px ring (`#cursor-ring`) with lagged lerp follow (0.1 factor)
- On hover over interactive elements: dot scales 2.8x, ring expands to 56px
- Light mode: use `mix-blend-mode: normal`, color `#4A7FD4`

### Scroll Reveal
```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.85s ease, transform 0.85s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```
- Use `IntersectionObserver` with threshold 0.1
- Stagger multiple `.reveal` elements within a section by 90ms each

### Navigation
- On scroll > 60px: add `.scrolled` — applies `backdrop-filter: blur(24px)` + dark semi-transparent bg + bottom border

### Hero Load Animation
- `.hero-left` and `.hero-right` fade/slide in on page load with 300ms + 480ms delays

### Theme Toggle
- Floating button (bottom-right, fixed position, z-index 9997)
- Sun/moon icon swap with opacity transition
- Toggles `.light-mode` on `<body>`
- Saves to `localStorage` key `'elyrac-theme'`
- Spring-style hover: `scale(1.12) rotate(20deg)`

---

## Light Mode

Apply CSS variable overrides on `body.light-mode`:
```css
body.light-mode {
  --navy:          #E8EFF8;
  --navy-deep:     #D4E2F2;
  --navy-dark:     #EBF2FC;
  --navy-darker:   #DCE9F7;
  --blue:          #2A5FAA;
  --blue-bright:   #2B72D8;
  --blue-electric: #1A5FC8;
  --white:         #0D1F3C;
  --white-soft:    rgba(13,31,60,0.88);
  --white-dim:     rgba(13,31,60,0.5);
  --white-ghost:   rgba(13,31,60,0.06);
  --white-line:    rgba(13,31,60,0.1);
}
```
- Logo: `filter: invert(1) brightness(0)` to show as dark
- Hero background: light blue radial gradient instead of dark navy
- All section backgrounds shift to corresponding light variants
- Nav scrolled: `rgba(235,242,252,0.95)` + light border

---

## Page Structure

Single-page with client-side page switching (no URL routing):
```javascript
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + name).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  // Re-observe reveal elements
  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.visible)").forEach(r => obs.observe(r));
  }, 50);
}

function scrollToSection(selector) {
  // If not on home page, switch to it first, then scroll
  const homeEl = document.getElementById("page-home");
  if (homeEl && !homeEl.classList.contains("active")) {
    showPage("home");
    setTimeout(() => document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" }), 50);
  } else {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
```

**Pages:**
- `page-home` — Main landing (default active: `display:block`)
- `page-about` — Company story, stats panel, values, CTA

All pages have `display:none` by default; `.page.active` has `display:block`.

---

## Output Requirements

- **Single `index.html`** file, all CSS inline in `<style>`, all JS inline in `<script>`
- **Tailwind CSS via CDN:** `<script src="https://cdn.tailwindcss.com"></script>`
- **Placeholder images:** `https://placehold.co/WIDTHxHEIGHT`
- **Mobile-first responsive** with breakpoints at 768px and 1024px
- All navigation uses `onclick="showPage('...')"` or `onclick="scrollToSection('#...')"`
- All external links: `target="_blank" rel="noopener noreferrer"`

---

## elyrac Ai Content

### Services (4 Pillars)
| # | Label | Title | Description | Tags |
|---|-------|-------|-------------|------|
| 01 | STRATEGY | AI Strategy & Audit | We map your business, review your systems, and craft a precise roadmap — identifying where AI delivers the highest, most measurable return. | Discovery · Roadmap |
| 02 | BUILD | AI Development | Bespoke AI agents, automation workflows, and industry-specific applications. Engineered to work for your business — not a template of someone else's. | Agents · Automation |
| 03 | EDUCATE | AI Education | From executive briefings to hands-on team workshops, we build genuine AI capability inside your organization — so the transformation lasts. | Workshops · Training |
| 04 | SUSTAIN | Continuous Support | AI isn't a one-time project. We monitor, iterate, and evolve your systems alongside your business — always keeping your edge sharp. | Monitoring · Scale |

### Process (4 Steps)
| Step | Title | Description | Duration |
|------|-------|-------------|----------|
| 01 | Discovery Call | We map your current systems, uncover your real pain points, and set shared goals. No jargon — just honest, clear conversation about where AI can help. | ~30 minutes |
| 02 | AI Roadmap | We deliver a tailored strategy document showing your highest-leverage AI opportunities, ranked by impact and implementation effort. | 1–2 weeks |
| 03 | Build & Deploy | Our engineers build and ship your AI systems — from simple automations to full custom agent architectures — with rigorous testing at every stage. | 4–6 weeks |
| 04 | Grow & Evolve | We continuously monitor, improve, and scale your AI systems as your business grows. Your AI gets smarter as your company does. | Ongoing |

### Philosophy Pillars
| Icon | Title | Description |
|------|-------|-------------|
| 🎯 | Accessible | Enterprise-grade AI doesn't need enterprise-grade prices. We make intelligent systems available to businesses of every size. |
| ⚖️ | Ethical | Every system we build is transparent, fair, and trustworthy — because AI that respects people is AI that lasts. |
| 🔄 | Transformative | We're not here to automate tasks. We're here to fundamentally shift how your business operates and competes. |

### About Page Stats
- 150+ Systems Built
- 40+ Industries
- 2021 Founded
- 🌍 Globally Scalable

### About Page Values
| Value | Description |
|-------|-------------|
| Accessibility | AI for every business, not just the largest ones. |
| Ethics First | Transparent, fair, trustworthy systems by design. |
| Continuous Innovation | We stay at the frontier so you don't have to. |
| Long-term Partnership | We're with you from first strategy session to scale. |

### CTA Copy
- Booking URL: https://calendly.com/ceo-elyracai/30min
- Primary CTA: "Book a Free Call"
- Secondary CTA: "Learn About Us"
- CTA body text: "Join hundreds of businesses using elyrac Ai to move faster, operate smarter, and grow with genuine confidence. Your first discovery call is completely free."

---

## Anti-Generic Guardrails
- **Colors:** Never default Tailwind indigo/blue. Use the elyrac Ai palette only.
- **Shadows:** Layered, color-tinted: e.g., `0 8px 32px rgba(91,155,245,0.35)`
- **Typography:** Playfair + Outfit + Raleway. Never Inter, Roboto, Arial, or system fonts.
- **Gradients:** Multiple radial gradients layered; add SVG `<feTurbulence>` noise filter for grain/depth
- **Animations:** Only `transform` and `opacity`. Never `transition-all`. Use spring-style easing (`cubic-bezier(.34,1.56,.64,1)`)
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states — no exceptions
- **Images:** Use gradient overlays + optional color-blend treatment
- **Depth:** Surfaces use a z-plane system (base → elevated → floating)

---

## Hard Rules
- Do not add sections, features, or content not in the reference or brief
- Do not "improve" a reference design — match it exactly, then ask
- Do not stop after one screenshot pass — do at least 2 comparison rounds
- Do not use `transition-all` anywhere
- Do not use default Tailwind blue/indigo as the primary brand color
- Do not hardcode email addresses — use mailto or an obfuscated span
- All external links must have `target="_blank" rel="noopener noreferrer"`
- Do not break the single-file structure unless explicitly instructed
- Screenshots: always compare against reference images and document specific pixel-level differences
