# Echoes & Horizons

Interactive project site for the TELE / Ethnic Leadership program.  
Theme: **Growing Older** — intergenerational wisdom, culture, and what we carry forward.

Built for **GitHub Pages** (fully static). UWC-inspired visual language: clean blue & teal, international, hopeful.

## Structure

```
echoes-horizons/
├── index.html          # Main page
├── css/styles.css      # Design system
├── js/script.js        # Player, expandable rows, time capsule
├── assets/             # Drop podcast.mp3 + photos here
└── README.md
```

## Deploy to GitHub Pages

1. Create a new repository (e.g. `echoes-horizons`).
2. Upload the contents of this folder (or push via git).
3. Go to **Settings → Pages**.
4. Source: **Deploy from a branch** → `main` / root.
5. Wait a minute → your site is live at `https://USERNAME.github.io/echoes-horizons/`.

## What to replace before publishing

| Placeholder | Where | What to do |
|-------------|-------|------------|
| Podcast audio | `assets/podcast.mp3` + uncomment line in `js/script.js` | Export your 8–12 min episode |
| Team photos / avatars | CSS classes `.placeholder-avatar` or add `<img>` | Real photos |
| Guest photo + bio | Interview section | After the interview |
| Quotes & timestamps | Interview highlights + Voices details | From transcript |
| Reflection texts | Podcast section cards | From each team member |
| Time Capsule | Already interactive | Messages stay in visitor’s browser (localStorage) |

## Interactive features (already working)

- Smooth scroll navigation + mobile menu
- Expandable cultural-comparison rows
- Decorative audio player (becomes real when you add the mp3)
- Time Capsule form → saves messages locally (no backend needed)
- Scroll-triggered card reveals
- Fully responsive

## Design notes (UWC vibe)

- Primary blue `#0A4D8C` + teal `#008C7A`
- Source Sans 3 + Playfair Display
- Generous white space, soft gradients, circular motifs
- Accessible contrast, clean typography

---

Made across time zones · Armenia · USA · Morocco · and friends  
TELE Program / Ethnic Leadership
