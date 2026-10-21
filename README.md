# Hannah Lyn T. Santiago: Portfolio

A single-page portfolio website in an Apple / iOS style. Static HTML, CSS and vanilla JavaScript.
No build step, no backend, no dependencies.

## Folder structure

```
hannahos/
├── index.html              Page structure, SEO + Open Graph tags
├── css/styles.css          All styles: iOS tokens (light/dark), components, sections, phone layout, print
├── js/
│   ├── data.js             ★ ALL CONTENT: profile, links, projects, skills, experience
│   ├── icons.js            Line-icon set + custom skill glyphs
│   ├── core.js             Helpers, theme, toasts, tooltips, iOS sheet (modal)
│   ├── resume.js           Résumé template (preview sheet + print/PDF)
│   ├── terminal.js         Playground terminal: commands, history, autocomplete
│   └── main.js             Renders every section and wires up interactions
├── assets/
│   ├── icons/brands/       Official logos (Devicon + Simple Icons), stored locally
│   ├── projects/           Project images (SVG, lazy-loaded)
│   ├── img/                Portraits (hannah.jpg, hannah-formal.jpg) + placeholder avatar.svg
│   ├── resume/             Hannah-Lyn-Santiago-Resume.pdf
│   └── og-image.png, favicon and app icons
├── tools/                  Asset generators (not needed to run the site)
└── favicon.svg · site.webmanifest · robots.txt
```

## What's on the page

**Screens, not a long scroll.** Each section is one screen (Home, Overview, Projects, Skills, Research, Education,
Experience, Playground, Contact). Move between them with the nav, the dots / arrows at the bottom, the mouse wheel
at the end of a screen, PageUp / PageDown, ← / →, or a swipe on phones. Links like `…/#research` open that screen.
Without JavaScript the page falls back to a normal scrolling layout.


- **Hero:** name, availability, tagline, and buttons for projects, résumé download and contact
- **Overview:** intro card with a typing "Right now I'm…" line (edit `profile.doing`), four clickable stat tiles,
  a scrolling logo strip, and "why hire me" cards that flip to show proof
- **Projects:** a carousel. The active card sits in the center with neighbours fanned out; it auto-advances every 5 s
  (pauses on hover), loops, and works with arrows, dots, swipe/drag and the arrow keys. Filters: All · Software · Embedded · QA.
  Tap the center card for its App Store-style detail sheet.
- **Skills:** a profile card (flip photo + radar of hands-on depth), a "Does Hannah fit your stack?" matcher with presets,
  and two views: an **Orbit** you can drag to spin or toss logos around (most-used skills closest to the center) or the logo **Grid**. Tap any skill for details.
- **Research:** public-safe summary of the approved thesis, with interactive findings charts. Content lives in `research` in `js/data.js`.
  Investigator identities, case records, sketches, locations and transcripts are deliberately left out. Don't add the PDF.
- **Education:** USJ-R campus card (seal, campus photo, motto, 3D tilt) plus a clickable journey timeline. Edit it in `school` in `js/data.js`.
  The logo and photo are in `assets/img/usjr/`.
- **Experience:** the READS Working Scholar role (Office of the Registrar), CpE Society and immersion work. `cv` holds the short résumé bullets.
- **Playground:** an interactive terminal (`help`, `whoami`, `projects`, `skills`, `sudo hire-hannah`…)
- **Contact:** an iOS contact card with quick actions, plus a mail compose form (opens the email app)
- **Résumé:** the nav button opens a preview sheet. The PDF downloads in one tap, and Ctrl/Cmd+P prints a clean single page.
- **Phones:** an iPhone-style bottom tab bar and bottom sheets you can swipe down to close
- Light or dark follows the visitor's device, with a toggle in the nav. Respects reduced motion.
- **Easter egg:** `bugs_i_fixed.txt` in the footer
- Old `…/#hr` links open the résumé sheet.

## Before you publish

1. **Links:** in `js/data.js`, fill `links.github` and `links.linkedin`. Empty links show a polite "coming soon" note.
2. **Photo:** done: `assets/img/hannah.jpg` (main) and `assets/img/hannah-formal.jpg` (shown when the skills card flips).
3. **Project links:** fill each project's `demo` and `github`. To use real screenshots, replace `assets/projects/<id>.svg` (16:10).
4. **Domain:** in `index.html`, uncomment the canonical link and make `og:image` / `twitter:image` full URLs.
5. **Résumé PDF:** after editing content, open the site in Chrome, press Ctrl/Cmd+P → Save as PDF (A4),
   and replace `assets/resume/Hannah-Lyn-Santiago-Resume.pdf`.

## Run locally

```bash
python -m http.server 8000      # then open http://localhost:8000
```

## Deploy (any static host)

- **Netlify / Vercel / Cloudflare Pages:** drag the folder in, or connect the repo. No build command, output dir `/`.
- **GitHub Pages:** push to a repo and enable Pages on the main branch.

## Credits

Logos: [Devicon](https://devicon.dev) and [Simple Icons](https://simpleicons.org).
Microchip and XAML have no logo in either set, so they use custom line icons. .NET MAUI uses the official .NET logo.
