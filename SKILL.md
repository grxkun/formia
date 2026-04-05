---
name: frontend-design-v2
description: >
  Build exceptional, visually distinctive web interfaces that look nothing like generic AI output.
  Use this skill for ANY frontend task: landing pages, components, dashboards, portfolios, product pages,
  marketing sites, or UI systems. Triggers on: "build a site", "make a landing page", "design a component",
  "create a UI", "frontend", "web page", "hero section", "dashboard layout" — or any request to produce
  HTML, CSS, React, or visual interface code. DO NOT produce frontend output without reading this skill first.
  This is especially important for marketing sites, product pages, and any page that needs to look premium.
---

# Frontend Design Skill v2

You are designing for the 1% — the sites people screenshot and share.
The baseline bar is: a senior designer at a top agency would be proud of this.

## Step 0: Read Before Anything Else

Before writing a single line of code:
1. Read `references/design-dna.md` — reverse-engineered patterns from Framer, Squarespace, Webflow, editorial WordPress
2. Read `references/typography-system.md` — type pairing, fluid scales, expressive treatments
3. Decide which FORMA primitives from `references/forma-guide.md` apply to this project

## Step 1: Design Interrogation

Answer these before coding. Even 30 seconds here prevents mediocre output.

**Brand voice**: Is this cold/precision, warm/human, playful/irreverent, luxe/restrained, raw/editorial?

**The One Thing**: What is the single most memorable visual element of this page? Commit to it.
Examples: a massive rotating word, an animated gradient that tracks cursor, a typographic poster hero,
a timeline that animates on scroll, a product image that sticks and rotates.

**Layout archetype** (pick one, then break it):
- `EDITORIAL` — newspaper/magazine hierarchy, strong type, ink-on-paper density
- `CINEMATIC` — full-viewport scenes, scroll = time, imagery dominates
- `TERMINAL` — monospace, dark, dense data, Bloomberg/Figma aesthetic
- `ORGANIC` — soft curves, blobs, warmth, human photography, generous space
- `BRUTALIST` — raw structure, no decoration, function as form
- `LUXURY` — restraint, serif type, gold/cream/black, nothing extraneous

**Anti-mediocrity check** — if your design has ANY of these, redesign:
- Inter or Space Grotesk as the primary font
- Purple/violet gradient on white
- Centered hero text + subtitle + two buttons (default AI layout)
- 3-column card grid as the main content pattern
- Footer with 4 equal columns

## Step 2: Typography First

Typography IS the design on 80% of great sites. Choose before colors.

Load `references/typography-system.md` for:
- Font pairing decision tree
- Fluid clamp() scale
- Expressive treatments (oversized, rotated, masked, clipped, gradient)
- When to use display vs body fonts

**Quick rules:**
- Display font: something with personality (not generic sans)
- Body: legible, not boring. Can be the same family at different weights.
- Scale: 4-5 stops. Don't use pixel values — use the fluid clamp scale.
- Line-height: 1.1–1.2 for display, 1.5–1.65 for body. Never default.
- Letter-spacing: negative for large display (-0.02em to -0.05em), slightly positive for caps (0.05em–0.1em)

## Step 3: Color System

**The formula that works:**
- 1 background (not pure white or pure black — off by 2–5%)
- 1 foreground (not #000 — use #0a0a0a, #111, #1a1a1a)  
- 1 accent (the most important decision — one bold, saturated color)
- 1 muted (desaturated version of accent for secondary elements)
- Optional: 1 contrast pop (near-complementary to accent, used sparingly)

**Accent color rules:**
- Never default. Never violet. Never generic blue.
- Choose from: deep amber, electric lime, blood orange, teal-green, rose, raw umber, cobalt
- Use it on at most 10% of the surface area — makes it mean something

**CSS variables setup (always do this):**
```css
:root {
  --bg: #0d0c0b;
  --fg: #f0ede8;
  --accent: #d4a04a;
  --muted: #6b5a3e;
  --surface: #1a1814;
  --border: rgba(240,237,232,0.08);
}
```

## Step 4: Layout Primitives (FORMA system)

Always use FORMA primitives for layout. Read `references/forma-guide.md`.

Never use arbitrary margin/padding everywhere. Use:
- `.stack` for vertical rhythm (gap-based, not margin-based)
- `.cluster` for inline groupings that wrap
- `.sidebar` for asymmetric two-column
- `.grid` for responsive grids
- `.cover` for full-viewport centering
- `.frame` for aspect-ratio boxes (images, video)

Spacing scale (use these values only):
`4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px, 192px, 256px`

## Step 5: Motion (The Difference Between Good and Great)

Motion is not decoration. It is communication.

**Load FORMA.js** — gives you these for free via data attributes:
- `data-reveal` — fade+translateY on scroll into view
- `data-reveal="left"` / `"right"` — directional reveal  
- `data-stagger` — staggers children with delay cascade
- `data-parallax="0.3"` — scroll parallax (value = speed factor)
- `data-magnetic` — element follows cursor within proximity

**Motion rules:**
- One "hero moment" — the most dramatic animation, on load
- Scroll reveals should feel earned, not automatic (don't reveal everything)
- Duration: 400–700ms for reveals, 150–250ms for interactions
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for reveals (expo out), `ease` for interactions
- Never animate opacity alone — always pair with transform

**Signature techniques to use:**
```css
/* Split text reveal — stagger each word/letter */
/* Clip-path reveal — content slides in from behind a mask */
clip-path: inset(0 100% 0 0); → clip-path: inset(0 0% 0 0);

/* Gradient text */
background: linear-gradient(135deg, var(--accent), var(--fg));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* Noise texture overlay */
background-image: url("data:image/svg+xml,...");  /* SVG noise */
mix-blend-mode: overlay;
opacity: 0.03;
```

## Step 6: Signature Elements

Every great site has one unforgettable element. Pick at minimum ONE:

| Signature | How |
|-----------|-----|
| Oversized display type | 12vw–20vw font-size on a single word/phrase |
| Horizontal scroll section | Scroll-linked horizontal content strip |
| Sticky hero + parallax depth | Position sticky with translateZ layers |
| Rotating ticker tape | Marquee-style infinite scroll text bar |
| Cursor follower | Custom cursor that scales on hover |
| Gradient mesh background | Multi-point CSS gradient that shifts subtly |
| Split-screen layout | Two completely different content panels side by side |
| Masked image reveal | Image revealed through text or shape mask |
| Number counter | Animated stat counters on scroll enter |
| Rotated type | Sideways/diagonal text as structural element |

## Step 7: Code Quality Standards

**HTML semantics:**
- Real semantic elements: `<article>`, `<section>`, `<header>`, `<aside>`, `<figure>`
- ARIA labels where needed
- Images always have meaningful `alt` text

**CSS discipline:**
- Variables for everything that repeats
- No magic numbers — if you write `47px`, explain why
- Mobile-first media queries
- `clamp()` for fluid sizing instead of breakpoint hacks

**Performance:**
- Google Fonts via `display=swap` and preconnect
- Images get `loading="lazy"` except above the fold
- Animations use `transform` and `opacity` only (GPU composited)
- `will-change: transform` on animated elements

## Step 8: Motion Stack Selection

Choose the right motion layer before writing a line of code:

```
Basic site (no heavy animation)
  → FORMA.js + CSS → data-reveal, data-stagger, data-magnetic

Scroll-driven storytelling, timelines, clip-path sequences
  → FORMA.js + GSAP + ScrollTrigger + forma-motion.js
  → Use: data-gsap-reveal, data-gsap-split, data-gsap-pin, data-gsap-scene

React / Next.js project
  → Framer Motion → variants, useScroll, AnimatePresence, useMotionTemplate
  → Read: references/motion-framer.md

Hi-fi visual signature (3D, particles, shaders)
  → Three.js or raw WebGL + forma-motion.js
  → Use: data-three="noise-blob|particles|wireframe|gradient"
  → Read: references/visuals-hifi.md

Pre-rendered vector animation
  → Lottie + forma-motion.js
  → Use: data-lottie="path.json" data-lottie-scroll="true"
```

### CDN load order (HTML projects)
```html
<!-- 1. Fonts -->
<link href="...googleapis..." rel="stylesheet">
<!-- 2. FORMA base -->
<link rel="stylesheet" href="forma.css">
<!-- 3. GSAP (optional) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<!-- 4. Three.js (optional) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<!-- 5. FORMA runtime -->
<script src="forma.js" defer></script>
<script src="forma-motion.js" defer></script>
```

## Step 9: Reference files by context

| Building... | Read |
|-------------|------|
| Any site | `design-dna.md` for chosen archetype |
| Typography-heavy | `typography-system.md` full |
| GSAP timelines / scroll scenes | `motion-gsap.md` |
| React / Framer Motion | `motion-framer.md` |
| 3D / particles / shaders | `visuals-hifi.md` |
| Portfolio / agency | `design-dna.md` > Framer + Agency patterns |
| Editorial / blog | `design-dna.md` > WordPress editorial |
| SaaS / product | `design-dna.md` > Webflow product patterns |
| Dark / terminal | `design-dna.md` > Terminal archetype |

## Hi-Fi Visual Signatures (choose ONE per project)

| Signature | Stack | Data attr |
|-----------|-------|-----------|
| Organic 3D blob | Three.js | `data-three="noise-blob"` |
| Particle field | Three.js | `data-three="particles"` |
| Shader gradient (Stripe-style) | Three.js ShaderMaterial | `data-three="gradient"` |
| Connected dot network | Canvas API | (inline, from visuals-hifi.md) |
| Gooey blobs | SVG filter | `.gooey` class |
| Aurora gradient | Pure CSS | `.aurora` class |
| Animated gradient border | CSS @property | `.gradient-border` |
| Glass morphism | CSS backdrop-filter | `.glass` class |
| Lottie on scroll | Lottie | `data-lottie data-lottie-scroll` |
| Scroll-driven horizontal | GSAP ScrollTrigger | `data-gsap-horizontal` |
| Spotlight grid | forma-motion.js | `data-spotlight-grid` |
| 3D card tilt | forma-motion.js | `data-tilt` |

## Final Output Checklist

Before delivering, verify:
- [ ] Font choice is unexpected — not Inter/Space Grotesk/Roboto
- [ ] Color palette has one bold accent used sparingly
- [ ] Layout has at least one grid-breaking element
- [ ] **One signature element** (from Step 6 or Hi-Fi table)
- [ ] Motion layer matches complexity: CSS → GSAP → Three.js
- [ ] No default hero pattern (centered text + two buttons)
- [ ] CSS variables defined at `:root`
- [ ] Fluid type with `clamp()`
- [ ] `forma.css` and `forma.js` included
- [ ] `forma-motion.js` included if using GSAP, Three.js, or Lottie
- [ ] Libraries loaded in correct order (fonts → forma.css → GSAP → Three → forma.js → forma-motion.js)
