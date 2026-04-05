# Design DNA — Reverse-Engineered Patterns

This file contains structural and visual patterns extracted from the best examples
of Framer, Squarespace, Webflow, editorial WordPress, and high-end agency work.
Use this as a reference library, not a checklist.

---

## FRAMER — Motion-First Design

**What Framer templates actually do well:**

### Structural patterns
- Full-viewport sections as "scenes" — each section is a complete composition
- Horizontal scroll for portfolio/feature showcases (overflow-x with scroll-snap)
- Large type that bleeds off screen (overflow: hidden on container)
- White space is structural, not decorative — it creates breathing room between dense sections

### Motion signature
- Spring-feel easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` — slight bounce
- Staggered reveals: children animate 60ms apart
- Scale + opacity combo on cards: `scale(0.95) opacity(0)` → normal
- Hover states feel physical: slight lift + shadow intensification
- Page transitions: clip-path wipe or opacity crossfade at 300ms

### Layout patterns
```css
/* Framer-style full-bleed section */
.scene {
  min-height: 100svh;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
}

/* Content column with bleed elements */
.content-col {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 80px);
}
```

### Framer type treatment
- Display text: 5vw–12vw, tight leading (1.0–1.1), negative letter-spacing
- Tags/labels: 10–11px, 0.12em letter-spacing, uppercase, muted color
- Body: 17–19px, 1.6 line-height, balanced measure (~65ch)

### Color philosophy
- Usually 2–3 colors max. Background + foreground + ONE accent.
- Accent is used on CTAs, key words, and hover states only
- Never full-bleed gradient backgrounds — gradient is used on elements, not backgrounds

---

## SQUARESPACE — Whitespace Discipline

**What Squarespace premium templates actually do:**

### The core philosophy
Squarespace works because it enforces constraints. Great Squarespace sites succeed through:
- **Reduction** — removing everything that doesn't need to be there
- **Typography as hero** — the type carries the aesthetic, not graphics
- **Photography as structure** — one great image per section, full-bleed

### Layout DNA
- Content max-width: 680px for body text, 1100–1400px for layouts
- Vertical padding: minimum `10vh` per section (often 15–20vh)
- Nav: Logo left, links right, always minimal (3–5 items), no dropdowns if avoidable
- Footer: Minimal. Logo + copyright + 4 social icons. Not a sitemap.

### The Squarespace spacing rhythm
```css
/* The SS rhythm that makes things look expensive */
:root {
  --section-pad: clamp(80px, 12vw, 180px);
  --content-width: min(1200px, 90vw);
  --body-width: min(680px, 90vw);
}

section {
  padding: var(--section-pad) 0;
}
```

### Typography approach
- One font family, multiple weights (not mixing families)
- Display: 72–120px on desktop, tight
- No gradient text. No outlined text. High contrast only.
- Text is either black on white or white on black. Period.
- Exception: one page might use cream/tan on a deep tone

### What Squarespace never does
- Card carousels with dots
- Accordion FAQs with plus/minus icons in gradient colors
- Social proof sections with circular avatars and star ratings in a carousel
- Countdown timers
- "As seen in" logo strips (unless the logos are very high-end)

---

## WEBFLOW SHOWCASE — Designer-Developer Synthesis

**Top 50 Webflow sites patterns:**

### Interactions-first structure
Webflow developers think in scroll states. Every scroll-linked site has:
- A "sticky container" that pins while children animate past it
- Usually 300–500vh of scroll distance to play 3–5 "scroll scenes"

```css
/* Webflow sticky scroll pattern */
.sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
.scroll-driver {
  height: 400vh; /* controls how long scenes play */
}
```

### Clip-path reveal — Webflow's signature
```css
/* Reveal from bottom */
[data-clip-reveal] {
  clip-path: inset(0 0 100% 0);
  transition: clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-clip-reveal].visible {
  clip-path: inset(0 0 0% 0);
}

/* Reveal from left */
[data-clip-reveal="left"] {
  clip-path: inset(0 100% 0 0);
}
[data-clip-reveal="left"].visible {
  clip-path: inset(0 0% 0 0);
}
```

### Grid systems they use
- 12-column CSS grid at desktop, 4-col at tablet, 1-col mobile
- Spanning elements: headline spans full 12 cols, body text 7 cols, aside 4 cols
- Intentional asymmetry: 7+4 split instead of 6+6

```css
.editorial-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}
.headline { grid-column: 1 / -1; }
.body-text { grid-column: 1 / 8; }
.sidebar-content { grid-column: 9 / 13; }
```

### Product/SaaS landing patterns
- Hero: Problem statement in large type, NOT a feature list
- Below fold: "How it works" as numbered steps with icons
- Social proof: logos of known companies (not testimonial cards with faces)
- Feature sections: alternating full-bleed background color changes
- CTA: Single, prominent, repeated 3x across page (top, mid, bottom)

---

## EDITORIAL WORDPRESS — Information Hierarchy

**What premium editorial themes (Newspack, Blocksy, GeneratePress Pro) do:**

### The editorial grid
```css
/* True editorial layout */
.editorial-layout {
  display: grid;
  grid-template-columns: 1fr 300px; /* content + sidebar */
  grid-template-rows: auto;
  gap: 48px;
}

/* Lead article = full width above fold */
.lead-story {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 60vh;
}
```

### Typography hierarchy (strict)
1. **Kicker/label** — 11px, uppercase, letter-spaced, accent color, before headline
2. **Headline** — Display font, 2.5–5rem, tight leading
3. **Deck/subheadline** — 1.1–1.3rem, body font, regular weight, muted color
4. **Byline** — 12–13px, small-caps or uppercase, author + date
5. **Body** — 18–19px, 1.65 line-height, max 70ch width
6. **Pull quote** — 1.4–1.6rem, italic, full-width break in text flow

```css
/* Pull quote — breaks out of text column */
blockquote.pull-quote {
  grid-column: 1 / -1; /* break out of column */
  margin: 48px 0;
  padding: 32px 0;
  border-top: 2px solid var(--accent);
  border-bottom: 2px solid var(--accent);
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-style: italic;
  text-align: center;
  max-width: 800px;
  margin-inline: auto;
}
```

### Reading experience details
- Dropcap on first paragraph: `p:first-of-type::first-letter` — 3.5x line height float
- Reading progress bar: thin line at top of viewport
- Sibling article navigation: large prev/next at article bottom
- Chapter numbers: `01`, `02`, `03` as section openers

---

## HIGH-END AGENCY SITES — The 1%

**Patterns from Locomotive Scroll, Active Theory, Resn, Fantasy:**

### Custom cursor (5KB, huge impact)
```js
// Minimal custom cursor
const cursor = document.querySelector('.cursor');
let mouseX = 0, mouseY = 0, posX = 0, posY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
});

function animate() {
  posX += (mouseX - posX) * 0.15; // lag factor
  posY += (mouseY - posY) * 0.15;
  cursor.style.transform = `translate(${posX}px, ${posY}px)`;
  requestAnimationFrame(animate);
}
animate();

// Scale on hover
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});
```

```css
.cursor {
  position: fixed; top: -8px; left: -8px;
  width: 16px; height: 16px;
  background: var(--accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease;
  mix-blend-mode: difference;
}
.cursor.hover { width: 48px; height: 48px; top: -24px; left: -24px; }
```

### Noise texture overlay (adds tactility)
```css
/* SVG noise — no external file needed */
.noise::before {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.035;
  pointer-events: none;
  z-index: 1000;
  mix-blend-mode: overlay;
}
```

### Marquee / ticker tape (infinite scroll)
```css
.marquee-track {
  display: flex;
  gap: 48px;
  animation: marquee 20s linear infinite;
  white-space: nowrap;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); } /* clone content for seamless loop */
}

.marquee-wrapper {
  overflow: hidden;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 16px 0;
}
```

### Split text animation
```js
// Wrap each word in a span for stagger
function splitText(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.innerHTML = el.textContent
      .split(' ')
      .map(word => `<span class="word" style="display:inline-block;overflow:hidden">
        <span class="word-inner" style="display:inline-block">${word}</span>
      </span>`)
      .join(' ');
  });
}
// Then animate .word-inner: translateY(100%) → translateY(0) with stagger
```

### Gradient mesh background
```css
/* Organic gradient mesh — not a simple linear gradient */
.gradient-mesh {
  background:
    radial-gradient(ellipse at 20% 50%, hsla(45, 80%, 50%, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, hsla(200, 70%, 50%, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 80%, hsla(320, 60%, 50%, 0.08) 0%, transparent 50%),
    var(--bg);
}
```

---

## ANTI-PATTERNS TO ELIMINATE

These are the specific patterns that make 99% of AI-generated sites look the same:

### Layout anti-patterns
- ❌ Centered hero with large H1, paragraph, two buttons side by side
- ❌ "Features" section with 3 or 6 cards in equal-width grid, each with an icon on top
- ❌ Alternating image-left/text-right sections (×3)
- ❌ Testimonial carousel with circular avatars
- ❌ Pricing section with 3 columns: Starter / Pro / Enterprise
- ❌ FAQ accordion as the last section before footer
- ❌ Footer with 4 equal columns (Company / Product / Resources / Legal)

### Typography anti-patterns  
- ❌ Inter, Space Grotesk, DM Sans as the primary display font
- ❌ H1 font size exactly 64px or 72px (too common)
- ❌ "Gradient text" on generic marketing phrases ("Build faster. Ship smarter.")
- ❌ All caps navigation with letter-spacing on every nav

### Color anti-patterns
- ❌ Purple/violet gradient on white background
- ❌ Teal + coral (2019 palettes)
- ❌ Any gradient that goes blue → purple
- ❌ Pure #FFFFFF background with pure #000000 text
- ❌ "Dark mode" that is just #1a1a2e (dark navy blue — everyone uses this)

### Motion anti-patterns
- ❌ AOS.js with default `data-aos="fade-up"` on every section
- ❌ Scroll-triggered opacity fade on every element
- ❌ Hover scale(1.05) on every card
- ❌ CSS spinner / loading animation in hero
