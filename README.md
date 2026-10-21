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
│   ├── img/avatar.svg      Placeholder photo
│   ├── resume/             Hannah-Lyn-Santiago-Resume.pdf
│   └── og-image.png, favicon and app icons
├── tools/                  Asset generators (not needed to run the site)
└── favicon.svg · site.webmanifest · robots.txt
```

## What's on the page

- **Hero:** name, availability, tagline, and buttons for projects, résumé download and contact
- **Overview:** an Apple-style bento grid of stats plus three reasons to hire
- **Projects:** a segmented control (All · Software · Embedded · QA). Tap a card to open an App Store-style detail sheet.
- **Skills:** app-icon logo tiles with red count badges. Hover shows where each skill was used; tap shows those projects.
- **Experience:** experience entries, plus education and honors
- **Playground:** an interactive terminal (`help`, `whoami`, `projects`, `skills`, `sudo hire-hannah`…)
- **Contact:** an iOS contact card with quick actions, plus a mail compose form (opens the email app)
- **Résumé:** the nav button opens a preview sheet. The PDF downloads in one tap, and Ctrl/Cmd+P prints a clean single page.
- **Phones:** an iPhone-style bottom tab bar and bottom sheets you can swipe down to close
- Light or dark follows the visitor's device, with a toggle in the nav. Respects reduced motion.
- **Easter egg:** `bugs_i_fixed.txt` in the footer
- Old `…/#hr` links open the résumé sheet.

## Before you publish

1. **Links:** in `js/data.js`, fill `links.github` and `links.linkedin`. Empty links show a polite "coming soon" note.
2. **Photo:** save it as `assets/img/hannah.jpg` (square, ~480×480) and set `photo: 'assets/img/hannah.jpg'` in `js/data.js`.
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
