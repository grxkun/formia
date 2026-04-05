# Typography System

Typography is the single highest-leverage design decision. A site with extraordinary
type and a plain white background will look more expensive than a site with bad type
and elaborate visual effects.

---

## Font Pairing Decision Tree

Pick a **voice** first. Then choose fonts.

```
VOICE: Cold / Precision
  → Display: Neue Montreal, Monument Extended, Druk, PP Neue Machina
  → Body: Suisse Int'l, GT America, ABC Diatype

VOICE: Luxury / Restrained
  → Display: Canela, Editorial New, Freight Display, Cormorant Garamond
  → Body: Graphik, Aktiv Grotesk, Lyon Text

VOICE: Editorial / Journalistic
  → Display: Playfair Display, Domaine Display, Tiempos Headline
  → Body: Tiempos Text, Source Serif, Lora

VOICE: Technical / Terminal
  → Display: Space Mono, JetBrains Mono, Geist Mono
  → Body: Geist, JetBrains Mono (all mono, different weights)

VOICE: Playful / Expressive
  → Display: Clash Display, Bricolage Grotesque, Darker Grotesque (800+)
  → Body: Outfit, Nunito, Plus Jakarta Sans

VOICE: Organic / Humanist
  → Display: Recoleta, Fraunces, Young Serif
  → Body: Lato, Libre Franklin, Nunito Sans
```

### Free Google Fonts pairs that actually look good

| Display | Body | Voice |
|---------|------|-------|
| Playfair Display | Source Serif 4 | Literary |
| Bebas Neue | Inter (acceptable here as body) | Impact/Sports |
| Fraunces | Lato | Warm Editorial |
| Syne | Syne (weight variation) | Geometric Modern |
| DM Serif Display | DM Sans | Contrast Serif |
| Josefin Sans | Josefin Sans | Minimalist All-same |
| Darker Grotesque | Darker Grotesque | Expressive Single |
| Unbounded | Jost | Contemporary |
| Cormorant Garamond | Cormorant (italic body) | Ultra Luxury |
| Bricolage Grotesque | Bricolage Grotesque | Variable Expressive |

---

## Fluid Type Scale

Never write fixed font sizes. Use `clamp()` for responsive type without media queries.

### The scale
```css
:root {
  /* Fluid scale — adjusts smoothly between 375px and 1440px viewport */
  --text-xs:   clamp(0.64rem,  0.6vw + 0.5rem,  0.75rem);   /* 10–12px */
  --text-sm:   clamp(0.8rem,   0.8vw + 0.6rem,  0.9rem);    /* 13–14px */
  --text-base: clamp(1rem,     0.5vw + 0.85rem, 1.125rem);  /* 16–18px */
  --text-lg:   clamp(1.125rem, 1vw + 0.9rem,    1.375rem);  /* 18–22px */
  --text-xl:   clamp(1.375rem, 2vw + 1rem,      2rem);      /* 22–32px */
  --text-2xl:  clamp(1.75rem,  3vw + 1rem,      3rem);      /* 28–48px */
  --text-3xl:  clamp(2.5rem,   5vw + 1rem,      5rem);      /* 40–80px */
  --text-4xl:  clamp(3.5rem,   8vw + 1rem,      9rem);      /* 56–144px */
  --text-hero: clamp(4rem,     12vw,             16rem);     /* 64–256px */
}
```

### Usage
```css
h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
p  { font-size: var(--text-base); }
.label { font-size: var(--text-xs); }
.hero-display { font-size: var(--text-hero); }
```

---

## Expressive Type Treatments

These are what separate forgettable sites from memorable ones.

### 1. Oversized bleeding display
```css
.bleeding-title {
  font-size: clamp(5rem, 15vw, 18rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-left: -0.05em; /* optically align */
  /* Let it bleed off screen */
  overflow: hidden; /* on parent */
}
```

### 2. Gradient text
```css
/* Use sparingly — one headline max per page */
.gradient-text {
  background: linear-gradient(135deg, var(--accent) 0%, var(--fg) 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Animated gradient text */
.gradient-text-animated {
  background: linear-gradient(90deg, var(--accent), var(--fg), var(--accent));
  background-size: 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 4s ease infinite;
}
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 3. Outlined / stroked text
```css
.outlined-text {
  -webkit-text-stroke: 1px var(--fg);
  color: transparent;
  /* Mix with filled text in the same headline for contrast */
}
```

### 4. Rotated / vertical text
```css
.vertical-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

### 5. Masked / clipped text
```css
/* Image showing through text */
.image-text {
  font-size: var(--text-hero);
  font-weight: 900;
  background: url('image.jpg') center/cover;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 6. Stacked tight headline (poster style)
```css
.poster-headline {
  font-size: clamp(3rem, 8vw, 10rem);
  line-height: 0.95;
  letter-spacing: -0.03em;
  font-weight: 900;
  /* Each line is a separate element for different treatments */
}
```

### 7. Tabular / data typography (Bloomberg terminal style)
```css
.data-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  color: var(--muted);
  text-transform: uppercase;
}
.data-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(1.5rem, 3vw, 3rem);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--accent);
}
```

---

## Leading and Measure Rules

```css
/* Display text — tight */
.heading-tight {
  line-height: 1.0;
  max-width: 20ch;
}

/* Body text — comfortable */
.body-reading {
  line-height: 1.6;
  max-width: 65ch; /* ~500px at 18px — never exceed 75ch */
}

/* Subheadings — medium */
.subheading {
  line-height: 1.3;
  max-width: 45ch;
}
```

---

## Section Openers (Editorial Devices)

Make sections feel intentional, not random.

```css
/* Chapter number */
.section-number {
  font-size: var(--text-xs);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-number::before {
  content: '';
  display: block;
  width: 32px;
  height: 1px;
  background: var(--muted);
}

/* Kicker label */
.kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 20px;
}
```

---

## Font Loading (Performance)

Always preconnect and use `display=swap`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=FONT_NAME:wght@400;600;700&display=swap" rel="stylesheet">
```

Variable fonts (single file, multiple weights):
```html
<!-- Variable font from Google — single request for all weights -->
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,100..900&display=swap" rel="stylesheet">
```
