/* ==========================================================================
   HannahOS — asset generator (run with: node tools/build-assets.js)
   Creates: project thumbnails, avatar placeholder, favicon, OG/icon HTML
   sources. PNG + PDF rendering is done by tools/render.ps1 (headless Edge).
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/icons.js'), 'utf8'), ctx);
const D = ctx.window.HOS_DATA;
const HOS = ctx.window.HOS;

const out = (p, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };

function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))).toString(16).padStart(2, '0');
  return '#' + f(0) + f(8) + f(4);
}
/** Inline one of the UI icons as a nested SVG. */
function glyph(name, x, y, size, color) {
  const svg = HOS.icon(name).replace(/ class="[^"]*"/, '').replace(' aria-hidden="true" focusable="false"', '');
  return svg.replace('<svg ', '<svg x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" style="color:' + color + '" ');
}

/* ---------- Mock scenes ---------- */
function webScene(p, c) {
  const x = 130, y = 64, w = 540, h = 380;
  let s = `<g filter="url(#sh)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#0b111d" stroke="${c.line}"/></g>
  <rect x="${x}" y="${y}" width="${w}" height="36" rx="16" fill="#111a2a"/><rect x="${x}" y="${y + 20}" width="${w}" height="16" fill="#111a2a"/>
  <circle cx="${x + 20}" cy="${y + 18}" r="5" fill="#ff6b7d"/><circle cx="${x + 38}" cy="${y + 18}" r="5" fill="#fbbf24"/><circle cx="${x + 56}" cy="${y + 18}" r="5" fill="#3ddc97"/>
  <rect x="${x + 180}" y="${y + 10}" width="180" height="16" rx="8" fill="#1a2436"/>
  <rect x="${x}" y="${y + 36}" width="120" height="${h - 36}" fill="#0e1625"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${x + 16}" y="${y + 58 + i * 30}" width="${i === 1 ? 88 : 70 - (i % 3) * 10}" height="10" rx="5" fill="${i === 1 ? c.accent : '#24314a'}" opacity="${i === 1 ? 0.9 : 1}"/>`;
  const mx = x + 140, my = y + 56;
  if (p.id === 'xeleqt') {
    for (let i = 0; i < 3; i++) s += `<rect x="${mx + i * 128}" y="${my}" width="116" height="62" rx="10" fill="#131d2e" stroke="${c.line}"/><rect x="${mx + 12 + i * 128}" y="${my + 14}" width="44" height="8" rx="4" fill="#2a3852"/><rect x="${mx + 12 + i * 128}" y="${my + 32}" width="${64 - i * 10}" height="16" rx="5" fill="${i === 0 ? c.accent : i === 1 ? c.accent2 : '#3ddc97'}"/>`;
    s += `<rect x="${mx}" y="${my + 76}" width="380" height="150" rx="12" fill="#131d2e" stroke="${c.line}"/>`;
    const bars = [60, 92, 74, 110, 86, 124, 98, 132, 116];
    bars.forEach((b, i) => { s += `<rect x="${mx + 22 + i * 39}" y="${my + 76 + 136 - b}" width="22" height="${b}" rx="5" fill="url(#bar)"/>`; });
    for (let i = 0; i < 2; i++) s += `<rect x="${mx}" y="${my + 240 + i * 22}" width="380" height="14" rx="5" fill="#131d2e"/><rect x="${mx + 300}" y="${my + 243 + i * 22}" width="60" height="8" rx="4" fill="${i ? '#3ddc97' : c.accent}" opacity=".8"/>`;
  } else {
    const st = ['#3ddc97', '#fbbf24', '#3ddc97', c.accent2, '#3ddc97'];
    for (let i = 0; i < 5; i++) {
      const ry = my + i * 56;
      s += `<rect x="${mx}" y="${ry}" width="380" height="46" rx="10" fill="#131d2e" stroke="${c.line}"/>
      <circle cx="${mx + 24}" cy="${ry + 23}" r="12" fill="${hsl(p.hue + i * 30, 60, 55)}" opacity=".85"/>
      <rect x="${mx + 46}" y="${ry + 12}" width="${120 - i * 8}" height="9" rx="4" fill="#2f3d58"/><rect x="${mx + 46}" y="${ry + 27}" width="${80 + i * 6}" height="7" rx="3.5" fill="#222e44"/>
      <rect x="${mx + 290}" y="${ry + 14}" width="74" height="18" rx="9" fill="${st[i]}" opacity=".18"/><rect x="${mx + 302}" y="${ry + 20}" width="50" height="6" rx="3" fill="${st[i]}"/>`;
    }
  }
  return s;
}

function mobileScene(p, c) {
  const x = 300, y = 34, w = 200, h = 432;
  let s = `<g filter="url(#sh)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34" fill="#0b111d" stroke="${c.line}" stroke-width="2"/></g>
  <rect x="${x + 72}" y="${y + 12}" width="56" height="14" rx="7" fill="#05080f"/>`;
  if (p.id === 'jeepney') {
    s += `<rect x="${x + 12}" y="${y + 40}" width="${w - 24}" height="250" rx="18" fill="#101a2b"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M${x + 12} ${y + 70 + i * 38} H${x + w - 12}" stroke="#18243a" stroke-width="6"/>`;
    for (let i = 0; i < 4; i++) s += `<path d="M${x + 40 + i * 42} ${y + 40} V${y + 290}" stroke="#18243a" stroke-width="6"/>`;
    const route = `M${x + 30} ${y + 270} L${x + 70} ${y + 222} L${x + 70} ${y + 160} L${x + 130} ${y + 120} L${x + 170} ${y + 70}`;
    s += `<path d="${route}" fill="none" stroke="${c.accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
    [[30, 270], [70, 222], [70, 160], [130, 120], [170, 70]].forEach((pt, i) => { s += `<circle cx="${x + pt[0]}" cy="${y + pt[1]}" r="${i === 0 || i === 4 ? 9 : 6}" fill="#0b111d" stroke="${i === 4 ? c.accent2 : c.accent}" stroke-width="4"/>`; });
    s += `<rect x="${x + 12}" y="${y + 304}" width="${w - 24}" height="110" rx="16" fill="#131d2e" stroke="${c.line}"/>
      <rect x="${x + 28}" y="${y + 322}" width="90" height="10" rx="5" fill="#2f3d58"/><rect x="${x + 28}" y="${y + 342}" width="60" height="8" rx="4" fill="#222e44"/>
      <text x="${x + 28}" y="${y + 392}" font-family="Inter,Segoe UI,sans-serif" font-size="26" font-weight="800" fill="${c.accent}">₱13</text>
      <rect x="${x + 112}" y="${y + 370}" width="62" height="28" rx="14" fill="${c.accent}"/>`;
    s += `<g filter="url(#sh)"><rect x="530" y="150" width="170" height="96" rx="16" fill="#131d2e" stroke="${c.line}"/></g>
      <circle cx="560" cy="182" r="12" fill="${c.accent}" opacity=".9"/><rect x="582" y="174" width="90" height="9" rx="4" fill="#2f3d58"/><rect x="582" y="190" width="60" height="7" rx="3.5" fill="#222e44"/>
      <rect x="548" y="214" width="134" height="8" rx="4" fill="#1d2840"/><rect x="548" y="214" width="84" height="8" rx="4" fill="${c.accent2}"/>`;
  } else {
    for (let i = 0; i < 4; i++) {
      const ry = y + 46 + i * 92;
      s += `<rect x="${x + 12}" y="${ry}" width="${w - 24}" height="80" rx="16" fill="#131d2e" stroke="${c.line}"/>
      <rect x="${x + 26}" y="${ry + 14}" width="34" height="34" rx="10" fill="${hsl(p.hue + i * 25, 70, 55)}" opacity=".85"/>
      <rect x="${x + 70}" y="${ry + 16}" width="${90 - i * 8}" height="9" rx="4" fill="#2f3d58"/><rect x="${x + 70}" y="${ry + 32}" width="60" height="7" rx="3.5" fill="#222e44"/>`;
      for (let k = 0; k < 5; k++) s += `<path transform="translate(${x + 26 + k * 16} ${ry + 56}) scale(0.5)" d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" fill="${k < 5 - (i % 2) ? '#fbbf24' : '#2a3852'}"/>`;
      s += `<rect x="${x + 128}" y="${ry + 54}" width="46" height="16" rx="8" fill="${c.accent}" opacity=".9"/>`;
    }
    s += `<g filter="url(#sh)"><rect x="96" y="170" width="180" height="120" rx="16" fill="#131d2e" stroke="${c.line}"/></g>
      <rect x="116" y="192" width="70" height="9" rx="4" fill="#2f3d58"/>
      <text x="116" y="240" font-family="Inter,Segoe UI,sans-serif" font-size="30" font-weight="800" fill="${c.accent}">₱850</text>
      <rect x="116" y="258" width="140" height="8" rx="4" fill="#1d2840"/><rect x="116" y="258" width="96" height="8" rx="4" fill="${c.accent2}"/>`;
  }
  return s;
}

function boardScene(p, c) {
  const x = 110, y = 70, w = 580, h = 360;
  const board = hsl(p.hue, 45, 15), copper = hsl(p.hue, 70, 55);
  let s = `<g filter="url(#sh)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${board}" stroke="${c.line}" stroke-width="2"/></g>`;
  [[x + 22, y + 22], [x + w - 22, y + 22], [x + 22, y + h - 22], [x + w - 22, y + h - 22]].forEach((m) => { s += `<circle cx="${m[0]}" cy="${m[1]}" r="9" fill="#05080f" stroke="${copper}" stroke-width="3"/>`; });
  // routed traces
  const tr = [
    `M${x + 60} ${y + 90} H${x + 180} L${x + 210} ${y + 120} H${x + 250}`,
    `M${x + 60} ${y + 140} H${x + 160} L${x + 190} ${y + 170} H${x + 250}`,
    `M${x + 60} ${y + 270} H${x + 150} L${x + 200} ${y + 220} H${x + 250}`,
    `M${x + 330} ${y + 120} H${x + 400} L${x + 440} ${y + 80} H${x + 520}`,
    `M${x + 330} ${y + 170} H${x + 420} L${x + 450} ${y + 200} H${x + 520}`,
    `M${x + 330} ${y + 220} H${x + 380} L${x + 420} ${y + 280} H${x + 520}`
  ];
  tr.forEach((d, i) => { s += `<path d="${d}" fill="none" stroke="${copper}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>`; });
  tr.forEach((d, i) => { if (i % 2 === 0) s += `<path d="${d}" fill="none" stroke="${c.accent}" stroke-width="5" stroke-linecap="round" stroke-dasharray="26 400" opacity=".95"/>`; });
  [[60, 90], [60, 140], [60, 270], [520, 80], [520, 200], [520, 280]].forEach((pt) => { s += `<circle cx="${x + pt[0]}" cy="${y + pt[1]}" r="8" fill="${board}" stroke="${copper}" stroke-width="4"/>`; });

  const cx = x + 250, cy = y + 90, cw = 80, ch = 160;
  if (p.id === 'fpga') {
    s += `<rect x="${x + 210}" y="${y + 70}" width="160" height="200" rx="10" fill="#0a0f1a" stroke="${c.line}"/>`;
    for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) s += `<rect x="${x + 226 + i * 34}" y="${y + 86 + j * 34}" width="24" height="24" rx="4" fill="${(i + j) % 3 === 0 ? c.accent : (i * j) % 4 === 1 ? c.accent2 : '#1d2840'}" opacity="${(i + j) % 3 === 0 ? 0.9 : 1}"/>`;
  } else if (p.id === 'pcb') {
    s += `<rect x="${x + 170}" y="${y + 90}" width="240" height="180" rx="10" fill="#0a0f1a" stroke="${c.line}"/>`;
    for (let i = 0; i < 8; i++) s += `<rect x="${x + 182 + i * 28}" y="${y + 102}" width="24" height="156" rx="4" fill="#e8eef7"/>`;
    [0, 1, 3, 4, 5].forEach((i) => { s += `<rect x="${x + 198 + i * 28}" y="${y + 102}" width="16" height="96" rx="3" fill="#0a0f1a"/>`; });
    s += `<rect x="${x + 238}" y="${y + 102}" width="24" height="156" rx="4" fill="${c.accent}" opacity=".85"/>`;
  } else {
    s += `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="8" fill="#0a0f1a" stroke="${c.line}"/>`;
    for (let i = 0; i < 7; i++) {
      s += `<rect x="${cx - 12}" y="${cy + 14 + i * 20}" width="12" height="8" rx="2" fill="#c9d3e0"/><rect x="${cx + cw}" y="${cy + 14 + i * 20}" width="12" height="8" rx="2" fill="#c9d3e0"/>`;
    }
    s += `<circle cx="${cx + 16}" cy="${cy + 16}" r="5" fill="#1d2840"/>`;
    s += glyph(p.glyph, cx + 16, cy + 58, 48, c.accent);
  }
  // scene extras
  if (p.id === 'ballsort') ['#ff5470', '#3ddc97', '#4f8cff'].forEach((col, i) => { s += `<g filter="url(#sh)"><circle cx="${x + 120 + i * 60}" cy="${y + h + 34}" r="22" fill="${col}"/></g><circle cx="${x + 113 + i * 60}" cy="${y + h + 27}" r="6" fill="#fff" opacity=".45"/>`; });
  if (p.id === 'smarthome') {
    s += `<g filter="url(#sh)"><rect x="560" y="26" width="190" height="96" rx="18" fill="#131d2e" stroke="${c.line}"/></g>` + glyph('home', 580, 46, 36, c.accent) +
      `<rect x="628" y="50" width="96" height="9" rx="4" fill="#2f3d58"/><rect x="628" y="68" width="62" height="8" rx="4" fill="#3ddc97"/><rect x="580" y="94" width="150" height="8" rx="4" fill="#1d2840"/><rect x="580" y="94" width="110" height="8" rx="4" fill="${c.accent2}"/>`;
    [0, 1, 2].forEach((i) => { s += `<circle cx="${x + 470 + i * 30}" cy="${y + 320}" r="8" fill="${i === 1 ? '#fbbf24' : c.accent}" opacity=".9"/>`; });
  }
  if (p.id === 'sumobot') {
    s += `<g filter="url(#sh)"><circle cx="640" cy="400" r="74" fill="#131d2e" stroke="${c.line}" stroke-width="2"/></g><circle cx="640" cy="400" r="58" fill="none" stroke="${c.accent}" stroke-width="3" stroke-dasharray="6 8"/>` +
      `<rect x="606" y="372" width="68" height="56" rx="12" fill="#0a0f1a" stroke="${c.accent2}" stroke-width="2"/><rect x="596" y="378" width="10" height="44" rx="4" fill="#c9d3e0"/><rect x="674" y="378" width="10" height="44" rx="4" fill="#c9d3e0"/><circle cx="628" cy="392" r="4" fill="${c.accent}"/><circle cx="652" cy="392" r="4" fill="${c.accent}"/>`;
  }
  return s;
}

function thumb(p) {
  const c = {
    accent: hsl(p.hue, 85, 62), accent2: hsl(p.hue + 50, 80, 70), line: 'rgba(255,255,255,0.12)'
  };
  const scene = p.kind === 'web' ? webScene(p, c) : p.kind === 'mobile' ? mobileScene(p, c) : boardScene(p, c);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hsl(p.hue, 45, 13)}"/><stop offset="1" stop-color="${hsl(p.hue + 35, 50, 6)}"/></linearGradient>
  <radialGradient id="glow" cx="0.78" cy="0.12" r="0.75"><stop offset="0" stop-color="${c.accent}" stop-opacity="0.38"/><stop offset="1" stop-color="${c.accent}" stop-opacity="0"/></radialGradient>
  <radialGradient id="glow2" cx="0.05" cy="1" r="0.7"><stop offset="0" stop-color="${c.accent2}" stop-opacity="0.22"/><stop offset="1" stop-color="${c.accent2}" stop-opacity="0"/></radialGradient>
  <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.accent}"/><stop offset="1" stop-color="${c.accent2}" stop-opacity="0.5"/></linearGradient>
  <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#ffffff" stroke-opacity="0.045"/></pattern>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity="0.5"/></filter>
</defs>
<rect width="800" height="500" fill="url(#bg)"/>
<rect width="800" height="500" fill="url(#grid)"/>
<rect width="800" height="500" fill="url(#glow)"/>
<rect width="800" height="500" fill="url(#glow2)"/>
${scene}
</svg>`;
}

D.projects.forEach((p) => out('assets/projects/' + p.id + '.svg', thumb(p)));

/* ---------- Avatar placeholder (swap for a real photo in data.js) ---------- */
out('assets/img/avatar.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
<defs>
  <linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#123b4a"/><stop offset="1" stop-color="#241a4d"/></linearGradient>
  <linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#48f0e1"/><stop offset="1" stop-color="#b3a6ff"/></linearGradient>
  <radialGradient id="g" cx="0.3" cy="0.2" r="0.8"><stop offset="0" stop-color="#2ee6d6" stop-opacity="0.35"/><stop offset="1" stop-color="#2ee6d6" stop-opacity="0"/></radialGradient>
</defs>
<rect width="240" height="240" fill="url(#a)"/><rect width="240" height="240" fill="url(#g)"/>
<path d="M0 180 H60 L80 160 H140 M240 60 H190 L170 80 H120 M30 0 V40 L50 60" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="3"/>
<text x="120" y="146" text-anchor="middle" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="92" font-weight="800" letter-spacing="-4" fill="url(#t)">HS</text>
</svg>`);

/* ---------- Favicon ---------- */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2ee6d6"/><stop offset="1" stop-color="#6a55e0"/></linearGradient></defs>
<rect width="64" height="64" rx="18" fill="url(#f)"/>
<path d="M22 18v28M42 18v28M22 32h20" stroke="#041a1a" stroke-width="7" stroke-linecap="round"/>
</svg>`;
out('favicon.svg', favicon);

/* ---------- Render sources for PNGs (OG image + app icons) ---------- */
const P = D.profile;
out('tools/og.html', `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;overflow:hidden;font-family:Inter,sans-serif;color:#e8eef7;
background:radial-gradient(800px 500px at 0% 0%,rgba(46,230,214,.22),transparent 60%),radial-gradient(800px 600px at 100% 100%,rgba(157,140,255,.26),transparent 60%),linear-gradient(180deg,#0a1120,#060a13);position:relative}
.grid{position:absolute;inset:0;background:radial-gradient(circle at 1px 1px,rgba(120,160,210,.16) 1px,transparent 0) 0 0/28px 28px}
.wrap{position:relative;display:grid;grid-template-columns:1fr 430px;gap:48px;align-items:center;height:100%;padding:0 72px}
.badge{display:inline-flex;align-items:center;gap:10px;height:38px;padding:0 16px;border-radius:999px;font-size:18px;font-weight:600;color:#3ddc97;background:rgba(61,220,151,.12);border:1px solid rgba(61,220,151,.3)}
.badge i{width:10px;height:10px;border-radius:50%;background:#3ddc97}
h1{margin-top:26px;font-size:64px;font-weight:800;letter-spacing:-.04em;line-height:1.02}
.role{margin-top:18px;font-size:24px;color:#a9b6c9;font-weight:500}
.tag{margin-top:26px;font-size:30px;font-weight:600;letter-spacing:-.02em;line-height:1.3}
.tag em{font-style:normal;background:linear-gradient(100deg,#48f0e1,#b3a6ff);-webkit-background-clip:text;color:transparent}
.foot{margin-top:34px;display:flex;gap:12px;font-family:'JetBrains Mono';font-size:17px;color:#8592a8}
.foot span{padding:8px 14px;border-radius:10px;border:1px solid rgba(160,180,210,.18);background:rgba(255,255,255,.03)}
.win{border-radius:22px;background:rgba(7,12,22,.92);border:1px solid rgba(160,180,210,.2);box-shadow:0 40px 90px -20px rgba(0,0,0,.8);overflow:hidden;font-family:'JetBrains Mono';font-size:16px;line-height:1.75}
.bar{height:44px;display:flex;align-items:center;gap:8px;padding:0 16px;border-bottom:1px solid rgba(255,255,255,.07);color:#a9b6c9;font-family:Inter;font-size:14px;font-weight:600}
.bar b{width:12px;height:12px;border-radius:50%}
.body{padding:18px 22px 24px}.p{color:#48f0e1}.v{color:#b3a6ff}.m{color:#7d8aa0}.ok{color:#3ddc97}
.logo{position:absolute;top:48px;right:72px;display:flex;align-items:center;gap:12px;font-weight:800;font-size:22px}
.logo span{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(145deg,#2ee6d6,#6a55e0);color:#041a1a;font-size:22px}
</style></head><body><div class="grid"></div>
<div class="logo"><span>H</span>Portfolio</div>
<div class="wrap"><div>
<div class="badge"><i></i>Available for opportunities</div>
<h1>${P.name}</h1>
<p class="role">Computer Engineering · Embedded Systems · Software · QA</p>
<p class="tag">I build it, wire it, and <em>break it</em> before users do.</p>
<div class="foot"><span>9 projects</span><span>4 yrs working scholar</span><span>Cebu City, PH</span></div>
</div>
<div class="win"><div class="bar"><b style="background:#ff6b7d"></b><b style="background:#fbbf24"></b><b style="background:#3ddc97"></b>&nbsp;Terminal</div>
<div class="body"><div><span class="p">hannah@hannahos</span><span class="v">:~$</span> sudo hire-hannah</div>
<div class="m">[sudo] password for recruiter: ••••••••</div>
<div><span class="ok">✓</span> Embedded systems ..... <span class="ok">PASS</span></div>
<div><span class="ok">✓</span> Software ............. <span class="ok">PASS</span></div>
<div><span class="ok">✓</span> QA mindset ........... <span class="ok">PASS</span></div>
<div class="ok">🎉 0 errors · 0 warnings</div></div></div>
</div></body></html>`);

out('tools/icon.html', `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;background:transparent}svg{width:100%;height:100%;display:block}</style></head><body>${favicon.replace('rx="18"', 'rx="0"')}</body></html>`);

console.log('Generated', D.projects.length, 'thumbnails, avatar, favicon, og.html, icon.html');
