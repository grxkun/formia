# Formia

> A design-system-first micro-framework. Drop in and build differently.

**forma.css** — Layout primitives, design tokens, fluid type scale, motion utilities.  
**forma.js** — Scroll reveals, parallax, magnetic elements, custom cursor, counters, split text.  
**formia.js** — Full design runtime: 11 themes, accent system, dark/light mode, viewport preview, GSAP choreography, Three.js hero scene, PWA manager.

No build step. No dependencies (for forma.css + forma.js). Zero config.

---

## Install

```bash
npm install formia
```

Or drop files directly into your project:

```html
<link rel="stylesheet" href="forma.css">
<script src="forma.js" defer></script>

<!-- Full design engine (requires GSAP + Three.js) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="formia.js" defer></script>
```

---

## forma.css — Design Tokens

Override the tokens in your project:

```css
:root {
  --bg:     #0d0c0b;
  --fg:     #f0ede8;
  --accent: #d4a04a;
}
```

### Layout Primitives

```html
<!-- Stack — vertical rhythm -->
<div class="stack" data-gap="6">
  <h2>Title</h2>
  <p>Body</p>
</div>

<!-- Grid — responsive columns -->
<div class="grid" data-cols="3">
  <div class="card">...</div>
</div>

<!-- Cover — full viewport, centered -->
<section class="cover">
  <h1 class="h1">Hero</h1>
</section>
```

---

## forma.js — Motion Attributes

All features are driven by HTML `data-` attributes.

| Attribute | Effect |
|-----------|--------|
| `data-reveal` | Fade + translateY on scroll |
| `data-reveal="left"` | Slide from left |
| `data-reveal="right"` | Slide from right |
| `data-reveal="scale"` | Scale up from 95% |
| `data-reveal="clip"` | Clip-path wipe |
| `data-stagger` | Stagger children on reveal |
| `data-parallax="0.3"` | Parallax scroll (0–1 speed) |
| `data-magnetic` | Element follows cursor |
| `data-cursor` | Enable custom cursor |
| `data-counter` | Animate number from 0 to `data-value` |
| `data-split-text` | Split words/chars for animation |

```html
<h1 data-reveal="clip">Build differently.</h1>
<div data-stagger>
  <p>Animates</p>
  <p>With</p>
  <p>Stagger</p>
</div>
<div data-parallax="0.4">Background layer</div>
<button data-magnetic>Magnetic CTA</button>
```

---

## formia.js — Design Engine

Handles themes, accents, color mode, viewport preview, GSAP animations, Three.js scene, and PWA.

### JavaScript API

```js
// Apply a theme
FORMIA.applyTheme('cobalt');

// Change accent color
FORMIA.setAccent('#ff00ff');

// Toggle color mode
FORMIA.setColorMode('dark'); // 'light' | 'dark' | 'system'

// Viewport preview
FORMIA.setViewport('phone'); // 'phone' | 'tablet' | 'desktop'

// Read current state
console.log(FORMIA.currentTheme);
console.log(FORMIA.currentAccent);
```

### URL Theme Override

```
yoursite.html?theme=cobalt
yoursite.html?theme=terminal
```

### Available Themes

| ID | Font | Palette |
|----|------|---------|
| `earth` | Fraunces | limestone + lime |
| `amber` | Cormorant Garamond | black + gold |
| `terminal` | JetBrains Mono | black + green |
| `editorial` | Playfair Display | ivory + crimson |
| `cobalt` | Unbounded | dark + electric blue |
| `professional` | Libre Baskerville | white + navy |
| `kindergarten` | Fredoka | pastel + pink |
| `beach` | Pacifico | ocean + coral |
| `forest` | Fraunces | dark green + sage |
| `digital` | JetBrains Mono | CRT cyan + magenta |
| `manufacturing` | Bebas Neue | dark + amber |

### Studio Panel

Add these elements to your HTML to get the live theme studio:

```html
<button id="studio-btn"><span class="spip"></span>FORMA Studio</button>
<div id="studio"><!-- panel markup from index.html --></div>
```

Press **T** to toggle the studio panel from any page.

---

## Files

| File | Size | Purpose |
|------|------|---------|
| `forma.css` | ~8KB | Design tokens + layout primitives |
| `forma.js` | ~5KB | Motion layer (zero dependencies) |
| `formia.js` | ~10KB | Full design runtime |

---

## License

MIT © [grxkun](https://github.com/grxkun)
