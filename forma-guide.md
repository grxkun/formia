# FORMA Framework Guide

FORMA is a design-system-first micro-framework for Claude's frontend output.
It replaces Tailwind (utility soup) + Alpine (data-binding for data-binding's sake)
with a composition-first CSS system and a motion-first JS layer.

## How to use in projects

### Drop-in (inline in HTML)
```html
<!-- In <head> -->
<style>/* paste forma.css content */</style>

<!-- Before </body> -->
<script>/* paste forma.js content */</script>
```

### Or reference the assets
```html
<link rel="stylesheet" href="forma.css">
<script src="forma.js" defer></script>
```

---

## CSS Primitives

### Layout

**Stack** — vertical rhythm, gap-based
```html
<div class="stack" data-gap="7">
  <h2>Title</h2>
  <p>Body text</p>
  <a class="btn btn-primary">CTA</a>
</div>
```

**Cluster** — horizontal grouping that wraps
```html
<div class="cluster" data-justify="between">
  <span class="label">Category</span>
  <a class="btn btn-ghost">Learn more</a>
</div>
```

**Grid** — responsive columns
```html
<div class="grid" data-cols="3">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

**Cover** — full viewport, centered
```html
<section class="cover">
  <div class="stack text-center" data-gap="6">
    <h1 class="h1">Hero headline</h1>
    <p class="body text-muted">Subheadline</p>
  </div>
</section>
```

**Frame** — aspect ratio
```html
<div class="frame" data-ratio="16/9">
  <img src="..." alt="...">
</div>
```

**Content wrapper**
```html
<div class="content">           <!-- 1200px max -->
<div class="content" data-width="body">   <!-- 680px max -->
<div class="content" data-width="narrow"> <!-- 520px max -->
```

---

## JS Motion API (data attributes)

### Scroll Reveal
```html
<!-- Basic fade up -->
<div data-reveal>Revealed on scroll</div>

<!-- Directional -->
<div data-reveal="left">From left</div>
<div data-reveal="right">From right</div>

<!-- Scale up -->
<div data-reveal="scale">Scales up</div>

<!-- Clip-path wipe -->
<div data-reveal="clip">Wipes in</div>

<!-- With delay (ms) -->
<div data-reveal data-delay="200">Delayed</div>
```

### Stagger (children animate in sequence)
```html
<div class="grid" data-cols="3" data-stagger>
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

### Split Text (word-by-word reveal)
```html
<h1 data-split-text>Each word reveals separately</h1>
<h2 data-split-text="chars">Letter by letter</h2>
```

### Parallax
```html
<!-- Speed: 0 = no movement, 1 = full parallax, 0.3 = subtle -->
<img src="bg.jpg" data-parallax="0.3">
```

### Magnetic (element follows cursor)
```html
<button class="btn btn-primary" data-magnetic>Hover me</button>
```

### Custom Cursor
```html
<!-- Add data-cursor to body or any section -->
<body data-cursor>
```

### Number Counter
```html
<!-- Animates from 0 to target on scroll into view -->
<span data-counter data-value="2400" data-suffix="+">2400+</span>
<span data-counter data-value="99.9" data-suffix="%" data-decimals="1">99.9%</span>
<span data-counter data-value="4.8" data-prefix="$" data-decimals="1">$4.8</span>
```

### Scroll Progress Bar
```html
<!-- Add to any fixed element -->
<div data-progress style="
  position: fixed; top: 0; left: 0; right: 0;
  height: 2px; background: var(--accent);
  transform-origin: left; transform: scaleX(0);
  z-index: 9999;
"></div>
```

### Gradient Mesh (cursor-tracked)
```html
<div data-gradient-mesh style="
  background: 
    radial-gradient(ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%), 
      color-mix(in srgb, var(--accent) 20%, transparent) 0%, transparent 60%),
    var(--bg);
  transition: background 0.3s ease;
"></div>
```

---

## Token Customization

Override CSS variables per project:
```css
:root {
  /* Dark amber (BakerDex) */
  --bg:      #0d0c0b;
  --fg:      #f0ede8;
  --accent:  #d4a04a;
  --muted:   rgba(240,237,232,0.4);
  --surface: rgba(240,237,232,0.05);
  --border:  rgba(240,237,232,0.08);
}

/* ── Light theme example ── */
[data-theme="light"] {
  --bg:      #f8f6f1;
  --fg:      #1a1816;
  --accent:  #c4881a;
  --muted:   rgba(26,24,22,0.4);
  --surface: rgba(26,24,22,0.04);
  --border:  rgba(26,24,22,0.1);
}

/* ── Terminal / Bloomberg ── */
[data-theme="terminal"] {
  --bg:      #0a0d0a;
  --fg:      #c8ff96;
  --accent:  #ff6b35;
  --muted:   rgba(200,255,150,0.4);
  --surface: rgba(200,255,150,0.04);
  --border:  rgba(200,255,150,0.1);
}
```

---

## Complete Example: Hero Section

```html
<section class="cover noise" data-gradient-mesh data-cursor>
  <!-- Scroll progress -->
  <div data-progress style="position:fixed;top:0;left:0;right:0;height:2px;
    background:var(--accent);transform-origin:left;transform:scaleX(0);z-index:9999;"></div>

  <!-- Nav -->
  <nav style="position:fixed;top:0;left:0;right:0;z-index:100;
    padding:20px var(--content-x);" class="cluster" data-justify="between">
    <span class="label" style="color:var(--fg);">FORMA</span>
    <div class="cluster" data-gap="3">
      <a href="#" class="btn btn-ghost" style="padding:8px 20px">Docs</a>
      <a href="#" class="btn btn-primary" data-magnetic>Get started</a>
    </div>
  </nav>

  <!-- Hero -->
  <div class="content">
    <div class="stack text-center" data-gap="6" style="align-items:center;">
      <span class="kicker" data-reveal data-delay="0">Design-first framework</span>
      <h1 style="font-size:var(--text-hero);line-height:0.95;letter-spacing:-0.04em;" 
          data-split-text>
        Build different.
      </h1>
      <p class="body text-muted" style="max-width:48ch;text-align:center;" data-reveal data-delay="200">
        FORMA is the micro-framework for sites that don't look like every other site.
      </p>
      <div class="cluster" data-reveal data-delay="400">
        <a href="#" class="btn btn-primary" data-magnetic>Start building</a>
        <a href="#" class="btn btn-ghost">View docs</a>
      </div>
    </div>
  </div>
</section>
```

---

## Anti-patterns FORMA prevents

By using FORMA primitives, you avoid:
- Arbitrary margin/padding everywhere (use Stack + spacing tokens)
- Fixed pixel font sizes (use --text-* fluid scale)
- One-off media queries (use grid data-cols, sidebar-layout)
- Janky scroll animations (use data-reveal IntersectionObserver)
- Manual cursor tracking (use data-cursor)
- Magic number z-index values (document them)
