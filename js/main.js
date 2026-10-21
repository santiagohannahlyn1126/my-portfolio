/* ==========================================================================
   Page: renders every section from data.js and wires up interactions
   Overview · Projects (+ sheets) · Skills · Research · Experience · Terminal · Contact
   ========================================================================== */

(function () {
  const HOS = window.HOS;
  const D = window.HOS_DATA;
  const { $, $$, esc, icon, Sheet } = HOS;
  const P = D.profile;
  const L = D.links;

  const thumb = (p) => 'assets/projects/' + p.id + '.svg';
  const CAT = { software: { label: 'Software', icon: 'code' }, embedded: { label: 'Embedded', icon: 'chip' } };
  const catLine = (p) => CAT[p.cat].label + (p.qa ? ' · QA lead' : '');

  /** External profile link, or a polite "coming soon" button while the URL is empty. */
  function profileLink(kind, label, cls, inner) {
    const url = L[kind];
    if (url) return '<a class="' + cls + '" href="' + esc(url) + '" target="_blank" rel="noopener">' + inner + '</a>';
    return '<button class="' + cls + '" type="button" data-soon="' + label + ' profile">' + inner + '</button>';
  }

  /** Go to a screen, or to an element inside one (scrolls normally when the pager is off). */
  function goto(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const page = el.closest('.page');
    if (Pager.on && page) {
      Pager.show(page.id);
      if (el !== page) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
      return;
    }
    el.scrollIntoView({ behavior: HOS.reduced() ? 'auto' : 'smooth', block: 'start' });
  }

  /* ======================================================================
     OVERVIEW: intro card, stat tiles, logo marquee, flip "why hire me" cards
     ====================================================================== */
  function renderOverview() {
    const yrs = D.stats[0], honors = D.stats[3];
    const sw = D.projects.filter((p) => p.cat === 'software').length, emb = D.projects.length - sw;
    const logos = D.skills.filter((s) => s.logo);
    const stack = logos.slice(0, 5);
    $('#ov-intro').innerHTML =
      '<article class="ov-intro">' +
        '<div class="ov-intro__top">' +
          '<span class="ov-intro__ph"><img src="' + esc(P.photo) + '" alt="" width="64" height="64"><i></i></span>' +
          '<div><p class="ov-intro__hi">Hi, I\'m ' + esc(P.shortName) + '.</p><p class="ov-intro__role">' + esc(P.role) + ' · ' + esc(P.location) + '</p></div>' +
        '</div>' +
        '<p class="ov-intro__about">' + esc(P.about) + '</p>' +
        '<p class="ov-intro__now"><span>Right now I\'m</span> <b class="typer" id="typer">' + esc(P.doing[0]) + '</b></p>' +
        '<div class="ov-intro__cta">' +
          '<button class="btn btn--primary btn--sm" type="button" data-goto="projects">' + icon('folder') + 'See my work</button>' +
          '<button class="btn btn--tinted btn--sm" type="button" data-action="resume">' + icon('file') + 'Résumé</button>' +
        '</div>' +
      '</article>';
    $('#home-stats').innerHTML =
      '<button class="ov-stat" type="button" data-goto="experience" data-tint="blue">' +
        '<span class="ov-stat__head"><b class="ov-stat__num"><span data-count="' + yrs.value + '">' + yrs.value + '</span><small>yrs</small></b>' + icon('briefcase') + '</span>' +
        '<span class="ov-stat__label">as a working scholar</span>' +
        '<span class="ov-years">' + ['22', '23', '24', '25', '26'].map((y, i) => '<i style="--i:' + i + '"><em></em>&rsquo;' + y + '</i>').join('') + '</span>' +
      '</button>' +
      '<button class="ov-stat" type="button" data-goto="projects" data-tint="purple">' +
        '<span class="ov-stat__head"><b class="ov-stat__num"><span data-count="' + D.projects.length + '">' + D.projects.length + '</span></b>' + icon('folder') + '</span>' +
        '<span class="ov-stat__label">projects built</span>' +
        '<span class="ov-split" style="--a:' + sw + ';--b:' + emb + '"><i></i><i></i></span>' +
        '<span class="ov-split__key"><span>' + sw + ' software</span><span>' + emb + ' embedded</span></span>' +
      '</button>' +
      '<button class="ov-stat" type="button" data-goto="skills" data-tint="green">' +
        '<span class="ov-stat__head"><b class="ov-stat__num"><span data-count="' + D.skills.length + '">' + D.skills.length + '</span></b>' + icon('cpu') + '</span>' +
        '<span class="ov-stat__label">skills in the toolkit</span>' +
        '<span class="ov-logos">' + stack.map((s) => '<i class="' + (s.dark ? 'is-dark' : '') + '">' + HOS.logo(s, { size: 18 }) + '</i>').join('') + '<em>+' + (D.skills.length - stack.length) + '</em></span>' +
      '</button>' +
      '<button class="ov-stat" type="button" data-goto="education" data-tint="orange">' +
        '<span class="ov-stat__head"><b class="ov-stat__num ov-stat__num--text">' + esc(honors.text) + '</b>' + icon('award') + '</span>' +
        '<span class="ov-stat__label">' + esc(honors.label) + ' · ' + esc(honors.sub) + '</span>' +
        '<span class="ov-chip">' + icon('checkCircle') + 'Thesis approved · ' + esc(D.research.year) + '</span>' +
      '</button>';

    const chip = (s, hidden) => '<button class="mq' + (s.dark ? ' is-dark' : '') + '" type="button" data-skill-open="' + s.id + '"' + (hidden ? ' tabindex="-1" aria-hidden="true"' : '') + '>' +
      HOS.logo(s, { size: 22 }) + '<span>' + esc(s.name) + '</span></button>';
    $('#ov-marquee').innerHTML = '<p class="sr-only">Tools I use</p><div class="marquee__track">' +
      logos.map((s) => chip(s, false)).join('') + logos.map((s) => chip(s, true)).join('') + '</div>';

    const tints = ['blue', 'green', 'purple'];
    $('#why').innerHTML = D.why.map((w, i) =>
      '<article class="why__card" data-tint="' + tints[i] + '">' +
        '<div class="why__face why__front">' +
          '<span class="tile__icon" data-tint="' + tints[i] + '">' + icon(w.icon) + '</span>' +
          '<h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p>' +
          '<button class="why__flip" type="button" data-why-flip>' + icon('refresh') + 'Show proof</button>' +
        '</div>' +
        '<div class="why__face why__back" aria-hidden="true">' +
          '<p class="why__kicker">' + icon('checkCircle') + 'Proof</p>' +
          '<p class="why__proof">' + esc(w.proof) + '</p>' +
          '<div class="why__acts">' +
            '<button class="btn btn--primary btn--sm" type="button" tabindex="-1" ' + (w.project ? 'data-project="' + w.project + '"' : 'data-goto="' + w.go + '"') + '>' + esc(w.cta) + icon('next') + '</button>' +
            '<button class="why__flip" type="button" tabindex="-1" data-why-flip>' + icon('back') + 'Back</button>' +
          '</div>' +
        '</div>' +
      '</article>').join('');
  }

  function flipWhy(card) {
    const on = !card.classList.contains('is-flipped');
    card.classList.toggle('is-flipped', on);
    $('.why__front', card).setAttribute('aria-hidden', String(on));
    $('.why__back', card).setAttribute('aria-hidden', String(!on));
    $$('.why__front button', card).forEach((b) => { b.tabIndex = on ? -1 : 0; });
    $$('.why__back button', card).forEach((b) => { b.tabIndex = on ? 0 : -1; });
    $((on ? '.why__back' : '.why__front') + ' [data-why-flip]', card).focus({ preventScroll: true });
  }

  /** Endless logo strip: slides left on its own, pauses while hovered or focused. */
  function initMarquee() {
    const box = $('#ov-marquee'), track = $('.marquee__track', box);
    if (!track) return;
    const SPEED = 32;                                 // pixels per second
    let x = 0, paused = false, live = true, last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (live && !paused) {
        const half = track.scrollWidth / 2;
        x -= SPEED * dt;
        if (half && -x >= half) x += half;
        track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    box.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') paused = true; });
    box.addEventListener('pointerleave', () => { paused = false; });
    box.addEventListener('focusin', () => { paused = true; });
    box.addEventListener('focusout', () => { paused = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { live = en[0].isIntersecting; }).observe(box);
  }

  /** "Right now I'm …" typewriter (just swaps the text when motion is reduced). */
  function typer() {
    const el = $('#typer'), words = P.doing;
    if (!el || !words || words.length < 2) return;
    let w = 0;
    const next = () => {
      w = (w + 1) % words.length;
      const word = words[w];
      if (HOS.reduced()) { el.textContent = word; setTimeout(next, 3200); return; }
      const type = (i) => {
        el.textContent = word.slice(0, i);
        if (i < word.length) setTimeout(() => type(i + 1), 55);
        else setTimeout(next, 2200);
      };
      const erase = () => {
        const txt = el.textContent;
        if (txt.length) { el.textContent = txt.slice(0, -1); setTimeout(erase, 26); }
        else type(1);
      };
      erase();
    };
    setTimeout(next, 2600);
  }

  /** Cursor-following glow on cards (mouse only). */
  function spotlight() {
    const SPOT = '.ov-intro, .ov-stat, .why__card, .pcard, .xp, .rx-abstract__body, .edu-tile, .journey, .sk-me, .sk-match';
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const el = e.target.closest && e.target.closest(SPOT);
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ======================================================================
     PROJECTS: segmented filter, cards, detail sheets
     ====================================================================== */
  const FILTERS = [
    { id: 'all', label: 'All', test: () => true },
    { id: 'software', label: 'Software', test: (p) => p.cat === 'software' },
    { id: 'embedded', label: 'Embedded', test: (p) => p.cat === 'embedded' },
    { id: 'qa', label: 'QA', test: (p) => !!p.qa }
  ];
  const pstate = { cat: 'all', tech: null };

  function miniLogos(p, max) {
    const ids = p.tech.filter((t) => HOS.skillById(t) && HOS.skillById(t).cat !== 'qa');
    const extra = ids.length - max;
    return ids.slice(0, max).map((t) => {
      const s = HOS.skillById(t);
      return '<span class="mini-logo' + (s.dark ? ' is-dark' : '') + '" title="' + esc(s.name) + '">' + HOS.logo(s, { size: 18 }) + '</span>';
    }).join('') + (extra > 0 ? '<span class="mini-more">+' + extra + '</span>' : '');
  }

  function renderProjects() {
    const f = FILTERS.find((x) => x.id === pstate.cat);
    let list = D.projects.filter(f.test);
    let chip = '';
    if (pstate.tech) {
      const s = HOS.skillById(pstate.tech);
      const ids = HOS.projectsForSkill(pstate.tech).map((p) => p.id);
      list = list.filter((p) => ids.indexOf(p.id) > -1);
      chip = '<span class="filter-chip">' + HOS.logo(s, { size: 18 }) + 'Projects using ' + esc(s.name) +
        '<button type="button" data-clear-tech aria-label="Clear the ' + esc(s.name) + ' filter">' + icon('close') + '</button></span>';
    }
    $('#proj-filters').innerHTML =
      '<div class="seg" role="tablist" aria-label="Filter projects">' + FILTERS.map((x) =>
        '<button class="seg__btn" role="tab" type="button" data-filter="' + x.id + '" aria-selected="' + (pstate.cat === x.id) + '">' + x.label + '</button>').join('') + '</div>' + chip;

    $('#proj-grid').scrollLeft = 0;
    $('#proj-grid').innerHTML = list.length ? list.map((p, i) =>
      '<button class="pcard" type="button" data-project="' + p.id + '" style="--i:' + i + '">' +
        '<span class="pcard__img' + (p.cover ? ' pcard__img--shot' : '') + '"><img src="' + esc(p.cover || thumb(p)) + '" alt="" width="800" height="500" loading="lazy" decoding="async"' + (p.cover && p.id !== 'xeleqt' ? ' style="object-position:center"' : '') + '></span>' +
        '<span class="pcard__body">' +
          '<span class="pcard__eyebrow" data-cat="' + p.cat + '">' + catLine(p) + '</span>' +
          '<span class="pcard__title">' + esc(p.title) + '</span>' +
          '<span class="pcard__pitch">' + esc(p.pitch) + '</span>' +
          '<span class="pcard__foot"><span class="pcard__logos">' + miniLogos(p, 4) + '</span><span class="pcard__more">Details' + icon('next') + '</span></span>' +
        '</span>' +
      '</button>').join('')
      : '<div class="empty">' + icon('folder') + '<b>No public project lists ' + esc(HOS.skillById(pstate.tech).name) + ' yet</b><span>' +
        esc(HOS.skillById(pstate.tech).note || 'Used in coursework and lab work.') + '</span><button class="btn btn--tinted btn--sm" type="button" data-clear-tech>Show all projects</button></div>';
  }

  function filterTech(id) {
    pstate.tech = id;
    pstate.cat = 'all';
    renderProjects();
    Sheet.close();
    goto('projects');
  }

  function techButton(id) {
    const s = HOS.skillById(id);
    if (!s) return '';
    return '<button class="tag' + (s.dark ? ' is-dark' : '') + '" type="button" data-tech="' + s.id + '" title="See projects using ' + esc(s.name) + '">' +
      HOS.logo(s, { size: 16 }) + esc(s.name) + '</button>';
  }

  /** App Store-style screenshot carousel (scroll-snap, arrow buttons, keyboard friendly). */
  function gallery(p) {
    return '<div class="shots" aria-label="Screenshots">' +
      '<div class="shots__track" tabindex="0" aria-label="Screenshot carousel, scroll sideways">' +
        p.shots.map((s, i) => '<figure class="shots__item">' +
          '<img src="assets/projects/' + p.id + '/' + s[0] + '.webp" alt="' + esc(s[1]) + '" loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async">' +
          '<figcaption>' + esc(s[1]) + '</figcaption></figure>').join('') +
      '</div>' +
      '<button class="shots__nav shots__nav--prev" type="button" data-shots="-1" aria-label="Previous screenshot">' + icon('back') + '</button>' +
      '<button class="shots__nav shots__nav--next" type="button" data-shots="1" aria-label="Next screenshot">' + icon('next') + '</button>' +
    '</div>';
  }

  function openProject(id) {
    const p = HOS.projectById(id);
    const next = D.projects[(D.projects.indexOf(p) + 1) % D.projects.length];
    const action = (url, label, ic, primary) => url
      ? '<a class="btn ' + (primary ? 'btn--primary' : 'btn--tinted') + ' btn--sm" href="' + esc(url) + '" target="_blank" rel="noopener">' + icon(ic) + label + '</a>'
      : '<button class="btn ' + (primary ? 'btn--primary' : 'btn--tinted') + ' btn--sm" type="button" data-soon="' + label + '">' + icon(ic) + label + '</button>';
    Sheet.open(CAT[p.cat].label + ' project',
      '<article class="ps">' +
        '<header class="ps__head">' +
          '<img class="ps__icon" src="' + thumb(p) + '" alt="" width="96" height="96">' +
          '<div class="ps__id">' +
            '<p class="ps__cat" data-cat="' + p.cat + '">' + catLine(p) + '</p>' +
            '<h3 class="ps__title">' + esc(p.title) + '</h3>' +
            '<div class="ps__actions">' + action(p.demo, 'Live demo', 'play', true) + action(p.github, 'GitHub', 'github', false) + '</div>' +
          '</div>' +
        '</header>' +
        '<p class="ps__pitch">' + esc(p.pitch) + '</p>' +
        (p.client ? '<p class="ps__client">' + icon('briefcase') + esc(p.client) + '</p>' : '') +
        (p.shots ? gallery(p) : '<img class="ps__shot" src="' + thumb(p) + '" alt="' + esc(p.title) + ' illustration" width="800" height="500">') +
        '<h4 class="ps__h">Highlights</h4>' +
        '<ul class="list">' + p.points.map((x) => '<li class="list__row">' + icon('checkCircle') + '<span>' + esc(x) + '</span></li>').join('') + '</ul>' +
        (p.flow ? '<h4 class="ps__h">How it works</h4><ol class="flow">' + p.flow.map((f, i) =>
          '<li class="flow__step"><span class="flow__n">' + (i + 1) + '</span><b>' + esc(f[0]) + '</b><span>' + esc(f[1]) + '</span></li>').join('') + '</ol>' : '') +
        (p.features ? '<h4 class="ps__h">Key features</h4><ul class="feats">' + p.features.map((f) =>
          '<li>' + icon(f[0]) + '<span>' + esc(f[1]) + '</span></li>').join('') + '</ul>' : '') +
        '<h4 class="ps__h">Built with</h4>' +
        '<div class="tags">' + p.tech.map(techButton).join('') + p.tags.map(HOS.plainTag).join('') + '</div>' +
        (p.shots ? '<p class="ps__note">' + icon(/blur/i.test(p.shotsNote || 'blur') ? 'lock' : 'image') + esc(p.shotsNote || 'Screenshots are from the live system. Part numbers, suppliers, prices, partner names and emails are blurred to protect company data.') + '</p>' : '') +
        '<button class="list list__next" type="button" data-project="' + next.id + '"><span><small>Next project</small>' + esc(next.title) + '</span>' + icon('next') + '</button>' +
      '</article>', { wide: !!p.shots });
  }

  /* ======================================================================
     SKILLS: profile card + radar, stack matcher, orbit / grid views
     ====================================================================== */
  let skillCat = 'all';
  let skillView = HOS.store.get('hos-skill-view', 'orbit') === 'grid' ? 'grid' : 'orbit';   // 'orbit' | 'grid' | 'match'
  const stack = [];
  const CAT_TINT = { lang: 'blue', web: 'purple', db: 'green', hw: 'orange', plat: 'pink', tools: 'blue', qa: 'green', soft: 'purple' };
  const CAT_WIDE = { lang: 1, tools: 1 };          // big categories span the full row
  const CAT_SHORT = { lang: 'Languages', web: 'Web', db: 'Databases', hw: 'Hardware', plat: 'Platforms', tools: 'Tools', qa: 'QA' };
  const usedIn = (id) => HOS.projectsForSkill(id).length;
  const PRESETS = [
    { name: 'Embedded & IoT', icon: 'chip', ids: ['esp32', 'micropython', 'embeddedc', 'pcb'] },
    { name: 'Full-stack web', icon: 'layout', ids: ['react', 'typescript', 'php', 'mysql'] },
    { name: 'Mobile .NET', icon: 'phone', ids: ['maui', 'csharp', 'xaml', 'android'] },
    { name: 'QA', icon: 'shield', ids: ['functional', 'system', 'validation', 'defects'] }
  ];

  /** How many projects use each technical area (soft skills are listed separately). */
  function areaDepth() {
    return D.skillCategories.filter((c) => CAT_SHORT[c.id]).map((c) => {
      const seen = {};
      D.skills.filter((s) => s.cat === c.id).forEach((s) => HOS.projectsForSkill(s.id).forEach((p) => { seen[p.id] = 1; }));
      return { c, n: Object.keys(seen).length };
    });
  }

  function radarSVG(data) {
    const max = D.projects.length, N = data.length, cx = 180, cy = 142, R = 92;
    const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / N; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
    const xy = (p) => p[0].toFixed(1) + ',' + p[1].toFixed(1);
    const poly = (r) => data.map((_, i) => xy(pt(i, r))).join(' ');
    return '<svg class="radar" viewBox="0 0 360 280" aria-hidden="true">' +
      [1 / 3, 2 / 3, 1].map((f) => '<polygon class="radar__ring" points="' + poly(R * f) + '"/>').join('') +
      data.map((_, i) => { const p = pt(i, R); return '<line class="radar__spoke" x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '"/>'; }).join('') +
      '<polygon class="radar__shape" points="' + data.map((d, i) => xy(pt(i, R * d.n / max))).join(' ') + '"/>' +
      data.map((d, i) => { const p = pt(i, R * d.n / max); return '<circle class="radar__dot" data-axis="' + d.c.id + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.5"/>'; }).join('') +
      data.map((d, i) => {
        const p = pt(i, R + 16), anchor = Math.abs(p[0] - cx) < 4 ? 'middle' : p[0] > cx ? 'start' : 'end';
        return '<text class="radar__label" data-axis="' + d.c.id + '" x="' + p[0].toFixed(1) + '" y="' + p[1].toFixed(1) + '" text-anchor="' + anchor + '" dominant-baseline="middle">' + CAT_SHORT[d.c.id] + '</text>';
      }).join('') +
    '</svg>';
  }

  /** Profile card: flip photo, quick numbers, radar of hands-on depth. */
  function renderMe() {
    const data = areaDepth();
    const soft = D.skills.filter((s) => s.cat === 'soft');
    $('#sk-me').innerHTML =
      '<div class="sk-me__top">' +
        '<button class="flip" type="button" data-flip aria-pressed="false" aria-label="Flip to see another portrait">' +
          '<span class="flip__in"><img class="flip__face" src="' + esc(P.photo) + '" alt="Portrait of ' + esc(P.name) + '" width="112" height="112">' +
          '<img class="flip__face flip__back" src="' + esc(P.photoAlt || P.photo) + '" alt="" width="112" height="112" loading="lazy"></span>' +
          '<span class="flip__hint">' + icon('refresh') + '</span>' +
        '</button>' +
        '<div class="sk-me__id">' +
          '<p class="ps__cat">Player profile</p>' +
          '<h3>' + esc(P.name) + '</h3>' +
          '<p>' + esc(P.role) + ' · ' + esc(P.location) + '</p>' +
          '<p class="sk-me__status"><span class="pulse-dot"></span>' + esc(P.status) + '</p>' +
        '</div>' +
      '</div>' +
      '<dl class="sk-me__nums">' +
        '<div><dd>' + D.skills.length + '</dd><dt>skills</dt></div>' +
        '<div><dd>' + D.projects.length + '</dd><dt>projects</dt></div>' +
        '<div><dd>' + D.skillCategories.length + '</dd><dt>areas</dt></div>' +
      '</dl>' +
      '<h4 class="sk-me__h">Where I go deepest<small>Projects that use each area, out of ' + D.projects.length + '</small></h4>' +
      radarSVG(data) +
      '<div class="radar__keys">' + data.map((d) =>
        '<button class="radar__key" type="button" data-radar-cat="' + d.c.id + '"><span>' + esc(d.c.name) + '</span><b>' + d.n + '/' + D.projects.length + '</b></button>').join('') + '</div>' +
      '<p class="sk-me__soft"><b>Also brings</b>' + soft.map((s) =>
        '<button class="tag" type="button" data-skill-open="' + s.id + '">' + HOS.logo(s, { size: 16 }) + esc(s.name) + '</button>').join('') + '</p>';
  }

  /* ---------- "Does Hannah fit your stack?" ---------- */
  function renderMatch() {
    $('#sk-match').innerHTML =
      '<header class="skm__head"><span class="tile__icon" data-tint="green">' + icon('checkCircle') + '</span>' +
        '<div><h3 id="skm-title">Does Hannah fit your stack?</h3><p>Pick your team\'s tools and see where I\'ve used them.</p></div></header>' +
      '<div class="skm__presets">' + PRESETS.map((p, i) =>
        '<button class="skm__preset" type="button" data-preset="' + i + '">' + icon(p.icon) + esc(p.name) + '</button>').join('') + '</div>' +
      '<form class="skm__add" autocomplete="off">' +
        '<label class="sr-only" for="skm-q">Add a skill to your stack</label>' +
        '<input id="skm-q" list="skm-list" placeholder="Add a tool, e.g. Python">' +
        '<button class="btn btn--primary btn--sm" type="submit">' + icon('check') + 'Add</button>' +
        '<datalist id="skm-list">' + D.skills.map((s) => '<option value="' + esc(s.name) + '"></option>').join('') + '</datalist>' +
      '</form>' +
      '<div class="skm__tray" id="skm-tray"></div>' +
      '<div class="skm__result" id="skm-result" aria-live="polite"></div>';
    renderStack();
  }

  function addStack(id) {
    if (stack.indexOf(id) > -1) return;
    if (stack.length >= 8) { HOS.toast('Up to 8 tools at a time', 'info'); return; }
    stack.push(id);
    renderStack();
  }

  function renderStack() {
    $('#skm-tray').innerHTML = stack.map((id) => {
      const s = HOS.skillById(id);
      return '<span class="tag skm__chip' + (s.dark ? ' is-dark' : '') + '">' + HOS.logo(s, { size: 16 }) + esc(s.name) +
        '<button type="button" data-stack-del="' + id + '" aria-label="Remove ' + esc(s.name) + '">' + icon('close') + '</button></span>';
    }).join('') + (stack.length ? '<button class="btn btn--plain btn--sm" type="button" data-stack-clear>Clear</button>' : '');

    const out = $('#skm-result');
    if (!stack.length) {
      out.innerHTML = '<div class="skm__empty">' + icon('layers') + '<span>Your stack shows up here. Try a preset above.</span></div>';
      return;
    }
    const hands = stack.filter((id) => usedIn(id));
    const pct = Math.round(hands.length / stack.length * 100);
    const ranked = D.projects.map((p) => ({ p, hit: stack.filter((id) => HOS.projectsForSkill(id).indexOf(p) > -1) }))
      .filter((x) => x.hit.length).sort((a, b) => b.hit.length - a.hit.length).slice(0, 3);
    out.innerHTML =
      '<div class="skm__score">' +
        '<span class="skm__ring" style="--p:' + pct + '"><b>' + hands.length + '/' + stack.length + '</b></span>' +
        '<div><b>' + (pct === 100 ? 'Every tool used in a real project' : hands.length ? hands.length + ' of ' + stack.length + ' used in real projects' : 'Known from coursework and lab work') + '</b>' +
        '<span>' + stack.map((id) => '<i class="skm__pip' + (usedIn(id) ? ' is-on' : '') + '" title="' + esc(HOS.skillById(id).name) + (usedIn(id) ? ': used in projects' : ': coursework') + '"></i>').join('') + '</span></div>' +
      '</div>' +
      (ranked.length ? '<h4 class="ps__h">Best matching projects</h4><div class="list">' + ranked.map((x) =>
        '<button class="skd__proj" type="button" data-project="' + x.p.id + '"><img src="' + esc(x.p.cover || thumb(x.p)) + '" alt="" width="72" height="45" loading="lazy">' +
        '<span><b>' + esc(x.p.title) + '</b><small>Uses ' + x.hit.map((id) => esc(HOS.skillById(id).name)).join(', ') + '</small></span>' + icon('next') + '</button>').join('') + '</div>' : '');
  }

  /* ---------- Orbit view: most-used skills sit closest to the center ---------- */
  function renderOrbit() {
    const sorted = D.skills.slice().sort((a, b) => usedIn(b.id) - usedIn(a.id));
    const radii = [19, 30.5, 42], total = radii.reduce((a, b) => a + b, 0);
    const sizes = [Math.round(sorted.length * radii[0] / total), Math.round(sorted.length * radii[1] / total)];
    sizes.push(sorted.length - sizes[0] - sizes[1]);
    let k = 0;
    const rings = radii.map((r, ri) => {
      const list = sorted.slice(k, k += sizes[ri]);
      return '<div class="orbit__ring" style="--r:' + r + 'cqw">' +
        list.map((s, i) => {
          const n = usedIn(s.id);
          return '<button class="orb' + (s.dark ? ' is-dark' : '') + (s.glyph ? ' is-glyph' : '') + '" type="button" data-skill="' + s.id + '" data-cat="' + s.cat + '"' +
            ' data-used="' + (n ? 1 : 0) + '" data-search="' + esc((s.name + ' ' + (s.note || '')).toLowerCase()) + '"' +
            ' style="--a:' + (ri * 17 + i * 360 / list.length).toFixed(1) + 'deg;--brand:' + (s.brand || 'var(--accent)') + '">' +
            '<span class="orb__in">' + HOS.logo(s, { size: 28 }) + '</span><span class="sr-only">' + esc(s.name) + (n ? ', used in ' + n + ' projects' : '') + '</span></button>';
        }).join('') + '</div>';
    }).join('');
    $('#skill-orbit').innerHTML =
      '<div class="orbit" role="group" aria-label="Skills orbit. Skills closer to the center are used in more projects.">' + rings +
        '<div class="orbit__core"><img src="' + esc(P.photo) + '" alt="" width="120" height="120"></div>' +
      '</div>' +
      '<p class="orbit__legend"><span><i class="orbit__dot"></i>Closer to the center = used in more projects</span><span>' + icon('refresh') + 'Drag to spin · toss a logo · tap for details</span></p>';
    HOS.fillIcons($('#skill-orbit'));
  }

  /** Orbit physics: slow auto-spin, drag to spin (with momentum), drag a logo to toss it (it springs back). */
  function initOrbit() {
    const orbit = $('.orbit');
    if (!orbit) return;
    const rings = $$('.orbit__ring', orbit);
    const SPEED = [6, -4.5, 3];                       // auto-spin per ring, degrees per second
    const base = rings.map(() => 0);
    let offset = 0, vel = 0, hover = false, live = true, last = performance.now(), drag = null;
    const center = () => { const r = orbit.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    const angle = (e) => { const c = center(); return Math.atan2(e.clientY - c[1], e.clientX - c[0]) * 180 / Math.PI; };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (live && orbit.offsetParent) {
        if (!hover && !drag) rings.forEach((_, i) => { base[i] += SPEED[i] * dt; });
        if (!drag && Math.abs(vel) > 0.5) { offset += vel * dt; vel *= Math.pow(0.04, dt); }
        rings.forEach((r, i) => r.style.setProperty('--rot', (base[i] + offset).toFixed(2) + 'deg'));
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { live = en[0].isIntersecting; }).observe(orbit);

    orbit.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hover = true; });
    orbit.addEventListener('pointerleave', () => { hover = false; });
    orbit.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, orb: e.target.closest('.orb'), mode: null, ang: angle(e), t: performance.now(), v: 0 };
      vel = 0;
    });
    orbit.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.mode) {
        if (Math.hypot(dx, dy) < 6) return;
        drag.mode = drag.orb ? 'toss' : 'spin';
        try { orbit.setPointerCapture(e.pointerId); } catch (err) { /* synthetic or finished pointer */ }
        orbit.classList.add('is-grabbing');
        if (drag.orb) drag.orb.classList.add('is-held');
        HOS.hideTip();
      }
      if (drag.mode === 'toss') {
        drag.orb.style.setProperty('--dx', dx + 'px');
        drag.orb.style.setProperty('--dy', dy + 'px');
      } else {
        const a = angle(e), now = performance.now();
        let d = a - drag.ang;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;
        offset += d;
        drag.v = 0.7 * drag.v + 0.3 * (d / Math.max(0.008, (now - drag.t) / 1000));
        drag.ang = a; drag.t = now;
      }
    });
    const end = (cancel) => {
      if (!drag) return;
      const d = drag;
      drag = null;
      orbit.classList.remove('is-grabbing');
      if (d.mode === 'toss') {
        d.orb.classList.remove('is-held');
        d.orb.style.removeProperty('--dx');
        d.orb.style.removeProperty('--dy');
      } else if (d.mode === 'spin') {
        vel = Math.max(-720, Math.min(720, d.v));
      } else if (!cancel && d.orb) {
        HOS.hideTip();
        openSkill(d.orb.dataset.skill);
      }
    };
    orbit.addEventListener('pointerup', () => end(false));
    orbit.addEventListener('pointercancel', () => end(true));
    // Keyboard: left / right arrows give the orbit a spin
    orbit.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); vel = e.key === 'ArrowRight' ? 240 : -240; }
    });
  }

  function renderSkills() {
    const cats = [{ id: 'all', name: 'All' }].concat(D.skillCategories);
    $('#skill-tabs').innerHTML = cats.map((c) =>
      '<button class="seg__btn" role="tab" type="button" data-skill-cat="' + c.id + '" aria-selected="' + (skillCat === c.id) + '">' + esc(c.name) + '</button>').join('');

    const tile = (s, i) => {
      const n = usedIn(s.id);
      const where = n ? 'Used in ' + n + ' project' + (n > 1 ? 's' : '') : (s.note || 'Coursework');
      return '<button class="skill' + (s.dark ? ' is-dark' : '') + (s.glyph ? ' is-glyph' : '') + '" type="button" data-skill="' + s.id + '"' +
        ' data-used="' + (n ? 1 : 0) + '" data-search="' + esc((s.name + ' ' + (s.note || '')).toLowerCase()) + '"' +
        ' style="--brand:' + (s.brand || 'var(--accent)') + ';--i:' + i + '">' +
        '<span class="skill__icon">' + HOS.logo(s, { size: 44 }) + (n ? '<span class="skill__badge" aria-hidden="true">' + n + '</span>' : '') + '</span>' +
        '<span class="skill__name">' + esc(s.name) + '</span><span class="sr-only">. ' + esc(where) + '. Open details.</span>' +
      '</button>';
    };
    const groups = skillCat === 'all' ? D.skillCategories : D.skillCategories.filter((c) => c.id === skillCat);
    $('#skill-groups').innerHTML = groups.map((c) => {
      const list = D.skills.filter((s) => s.cat === c.id);
      const used = list.filter((s) => usedIn(s.id)).length;
      return '<section class="sk-card' + (CAT_WIDE[c.id] || skillCat !== 'all' ? ' sk-card--wide' : '') + '" data-cat="' + c.id + '" aria-labelledby="skc-' + c.id + '">' +
        '<header class="sk-card__head">' +
          '<span class="tile__icon" data-tint="' + CAT_TINT[c.id] + '">' + icon(c.icon) + '</span>' +
          '<div><h3 id="skc-' + c.id + '">' + esc(c.name) + '</h3><p>' + list.length + ' skills' + (used ? ' · ' + used + ' used in projects' : '') + '</p></div>' +
        '</header>' +
        '<div class="skill-grid">' + list.map(tile).join('') + '</div>' +
      '</section>';
    }).join('') + '<div class="empty sk-empty" hidden>' + icon('search') + '<b>No skills match</b><span>Try another word, or clear the filters.</span>' +
      '<button class="btn btn--tinted btn--sm" type="button" data-skill-reset>Clear filters</button></div>';
    HOS.fillIcons($('#skill-groups'));
    const tabs = $('#skill-tabs'), sel = $('[aria-selected="true"]', tabs);
    if (sel) tabs.scrollLeft = Math.max(0, sel.offsetLeft - (tabs.clientWidth - sel.offsetWidth) / 2);
    setSkillView(skillView);
  }

  function setSkillView(v) {
    skillView = v;
    if (v !== 'match') HOS.store.set('hos-skill-view', v);
    $('#skill-orbit').hidden = v !== 'orbit';
    $('#skill-groups').hidden = v !== 'grid';
    $('#sk-match').hidden = v !== 'match';
    $('#sk-main').dataset.view = v;
    $$('[data-skill-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.skillView === v)));
    filterSkills();
  }

  /** Live search + "used in projects" toggle + category, without re-rendering (keeps focus in the field). */
  function filterSkills() {
    const q = $('#skill-q').value.trim().toLowerCase();
    const onlyUsed = $('#skill-used').checked;
    const match = (t, cat) => (!q || t.dataset.search.indexOf(q) > -1 || cat === q) && (!onlyUsed || t.dataset.used === '1');
    let shown = 0;
    if (skillView === 'orbit') {
      $$('.orb').forEach((t) => {
        const ok = match(t, t.dataset.cat) && (skillCat === 'all' || t.dataset.cat === skillCat);
        t.classList.toggle('is-dim', !ok); t.tabIndex = ok ? 0 : -1; if (ok) shown++;
      });
    } else {
      $$('.sk-card').forEach((card) => {
        let n = 0;
        $$('.skill', card).forEach((t) => { const ok = match(t, card.dataset.cat); t.hidden = !ok; if (ok) n++; });
        card.hidden = !n; shown += n;
      });
      $('.sk-empty').hidden = shown > 0;
    }
    const filtered = q || onlyUsed || skillCat !== 'all';
    $('#skill-count').textContent = filtered ? 'Showing ' + shown + ' of ' + D.skills.length + ' skills' : D.skills.length + ' skills across ' + D.skillCategories.length + ' categories';
  }

  /** Skill detail sheet: where it was used + skills it was paired with. */
  function openSkill(id) {
    const s = HOS.skillById(id);
    const cat = D.skillCategories.find((c) => c.id === s.cat);
    const projs = HOS.projectsForSkill(id);
    const pairs = {};
    projs.forEach((p) => p.tech.forEach((t) => { if (t !== id && HOS.skillById(t)) pairs[t] = (pairs[t] || 0) + 1; }));
    const paired = Object.keys(pairs).sort((a, b) => pairs[b] - pairs[a]).slice(0, 8);
    Sheet.open('Skill',
      '<header class="skd__head">' +
        '<span class="skill' + (s.dark ? ' is-dark' : '') + (s.glyph ? ' is-glyph' : '') + ' skd__logo" style="--brand:' + (s.brand || 'var(--accent)') + '"><span class="skill__icon">' + HOS.logo(s, { size: 60 }) + '</span></span>' +
        '<div><p class="ps__cat">' + esc(cat.name) + '</p><h3 class="ps__title">' + esc(s.name) + '</h3>' +
        '<p class="skd__sum">' + (projs.length ? 'Used in ' + projs.length + ' project' + (projs.length > 1 ? 's' : '') : esc(s.note || 'Coursework and lab work')) + '</p></div>' +
      '</header>' +
      (projs.length
        ? '<h4 class="ps__h">Where I used it</h4><div class="list">' + projs.map((p) =>
            '<button class="skd__proj" type="button" data-project="' + p.id + '"><img src="' + esc(p.cover || thumb(p)) + '" alt="" width="72" height="45" loading="lazy">' +
            '<span><b>' + esc(p.title) + '</b><small>' + esc(p.pitch) + '</small></span>' + icon('next') + '</button>').join('') + '</div>'
        : s.points ? '' : '<div class="list"><p class="list__row">' + icon('info') + '<span>' + esc(s.note || 'Used in coursework and lab work.') + ' No public project lists it yet.</span></p></div>') +
      (s.note && projs.length ? '<p class="skd__note">' + icon('info') + esc(s.note) + '</p>' : '') +
      (s.points ? '<h4 class="ps__h">What this looks like</h4><ul class="list">' + s.points.map((x) => '<li class="list__row">' + icon('checkCircle') + '<span>' + esc(x) + '</span></li>').join('') + '</ul>' : '') +
      (paired.length ? '<h4 class="ps__h">Often paired with</h4><div class="tags">' + paired.map((t) => {
          const o = HOS.skillById(t);
          return '<button class="tag' + (o.dark ? ' is-dark' : '') + '" type="button" data-skill-open="' + t + '">' + HOS.logo(o, { size: 16 }) + esc(o.name) + '</button>';
        }).join('') + '</div>' : '') +
      '<div class="skd__actions">' +
        (projs.length ? '<button class="btn btn--primary btn--sm" type="button" data-tech="' + id + '">' + icon('folder') + 'Show these projects</button>' : '') +
        '<button class="btn btn--tinted btn--sm" type="button" data-stack-add="' + id + '">' + icon('layers') + 'Add to stack check</button>' +
      '</div>');
  }

  /* ======================================================================
     RESEARCH: abstract of the approved thesis (public-safe)
     ====================================================================== */
  function renderResearch() {
    const R = D.research;
    $('#research-body').innerHTML =
      '<header class="sec-head sec-head--row">' +
        '<div><p class="eyebrow">Research</p>' +
        '<h2 class="sec-title" id="research-title">' + esc(R.short.replace(/, (.*)$/, ',')) + ' <span class="muted">' + esc(R.short.replace(/^.*?, /, '')) + '.</span></h2></div>' +
        '<p class="sec-lead">' + esc(R.lead) + '</p>' +
      '</header>' +
      '<article class="rx-abstract">' +
        '<aside class="rx-abstract__meta">' +
          '<div class="rx-abstract__top"><span class="tile__icon" data-tint="green">' + icon('file') + '</span>' +
            '<span class="badge-now">' + icon('checkCircle') + esc(R.status) + ' · ' + esc(R.year) + '</span></div>' +
          '<h3 class="rx-abstract__title">' + esc(R.title) + '</h3>' +
          '<p class="rx-abstract__kind">' + esc(R.kind) + '<br>' + esc(R.team) + '</p>' +
          '<div class="rx-abstract__keys"><b>Keywords</b><div class="tags">' + R.keywords.map((k) => '<span class="tag tag--plain">' + esc(k) + '</span>').join('') + '</div></div>' +
        '</aside>' +
        '<div class="rx-abstract__body">' +
          '<p class="rx-abstract__label">' + icon('info') + 'Abstract</p>' +
          R.abstract.map((p) => '<p>' + esc(p) + '</p>').join('') +
        '</div>' +
      '</article>' +
      '<p class="rx-privacy">' + icon('lock') + '<span>' + esc(R.privacy) + '</span></p>';
  }

  /* ======================================================================
     EDUCATION: USJ-R campus card + journey timeline
     ====================================================================== */
  let eduStep = D.school.journey.length - 1;

  function renderEducation() {
    const S = D.school;
    $('#education-body').innerHTML =
      '<header class="sec-head sec-head--row">' +
        '<div><p class="eyebrow">Education</p>' +
        '<h2 class="sec-title" id="education-title">Engineered at ' + esc(S.short) + '. <span class="muted">' + S.motto.map(esc).join(' et ') + '.</span></h2></div>' +
      '</header>' +
      '<div class="edu-layout">' +
      '<article class="campus" data-tilt>' +
        '<img class="campus__bg" src="' + esc(S.photo) + '" alt="" width="790" height="720" loading="lazy" decoding="async">' +
        '<span class="campus__mark" aria-hidden="true">' + esc(S.short) + '</span>' +
        '<div class="campus__in">' +
          '<div class="campus__crest"><span class="campus__halo"></span><img src="' + esc(S.logo) + '" alt="' + esc(S.name) + ' seal" width="408" height="430"></div>' +
          '<div class="campus__id">' +
            '<p class="campus__years">' + icon('cap') + esc(S.years) + '</p>' +
            '<h3 class="campus__degree">' + esc(S.degree) + '</h3>' +
            '<p class="campus__school">' + esc(S.name) + '</p>' +
            '<p class="campus__meta">' + esc(S.dept) + '</p>' +
            '<p class="campus__meta">' + icon('pin') + esc(S.city) + '</p>' +
            '<div class="campus__motto">' + S.motto.map((m) => '<span>' + esc(m) + '</span>').join('') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="campus__stats">' + S.highlights.map((h) =>
          '<button class="campus__stat" type="button" data-goto="' + h[3] + '">' + icon(h[0]) + '<b>' + esc(h[1]) + '</b><span>' + esc(h[2]) + '</span></button>').join('') + '</div>' +
      '</article>' +
      '<div class="edu-grid">' +
        '<section class="journey" aria-labelledby="journey-title">' +
          '<h3 class="journey__title" id="journey-title">' + icon('map') + 'My journey</h3>' +
          '<div class="journey__track" role="group" aria-label="Education timeline">' + S.journey.map((j, i) =>
            '<button class="jstep" type="button" data-edu-step="' + i + '" aria-pressed="' + (i === eduStep) + '" style="--i:' + i + '">' +
              '<span class="jstep__dot">' + icon(j[1]) + '</span><span class="jstep__year">' + esc(j[0]) + '</span><span class="jstep__name">' + esc(j[2]) + '</span>' +
              '<span class="jstep__desc">' + esc(j[3]) + '</span>' +
            '</button>').join('') +
            '<span class="journey__fill" aria-hidden="true"></span>' +
          '</div>' +
        '</section>' +
        '<aside class="edu-side">' +
          '<div class="edu-tile"><h3>' + icon('chip') + 'What I trained in</h3><div class="edu-focus">' + S.focus.map((f) => '<span>' + esc(f) + '</span>').join('') + '</div></div>' +
        '</aside>' +
      '</div></div>';
    setEduStep(eduStep);
  }

  function setEduStep(i) {
    eduStep = i;
    const j = D.school.journey[i], n = D.school.journey.length;
    $$('[data-edu-step]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.eduStep === i)));
    $('.journey').style.setProperty('--p', n > 1 ? i / (n - 1) : 1);
    if ($('.journey__card')) $('.journey__card').innerHTML = '<span class="tile__icon" data-tint="green">' + icon(j[1]) + '</span><div><small>' + esc(j[0]) + '</small><b>' + esc(j[2]) + '</b><p>' + esc(j[3]) + '</p></div>';
  }

  /** Gentle 3D tilt + photo parallax on the campus card (mouse only, respects reduced motion). */
  function tiltCampus() {
    const card = $('[data-tilt]');
    if (!card || HOS.reduced()) return;
    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (x * 100 + 50).toFixed(1) + '%');
      card.style.setProperty('--my', (y * 100 + 50).toFixed(1) + '%');
      card.style.setProperty('--tx', (x * -18).toFixed(1) + 'px');
      card.style.setProperty('--ty', (y * -12).toFixed(1) + 'px');
    });
    card.addEventListener('pointerleave', () => { ['--rx', '--ry', '--mx', '--my', '--tx', '--ty'].forEach((v) => card.style.removeProperty(v)); });
  }

  /* ======================================================================
     EXPERIENCE: role list (left) + selected role details (right)
     ====================================================================== */
  const XP_TINT = ['blue', 'purple', 'green'], XP_ICON = ['briefcase', 'message', 'cap'];
  let xpSel = 0;

  function renderExperience() {
    $('#exp').innerHTML =
      '<div class="xp-list" role="tablist" aria-label="Roles" aria-orientation="vertical">' + D.experience.map((j, i) =>
        '<button class="xp-item" role="tab" type="button" id="xpt-' + i + '" data-xp="' + i + '" aria-controls="xp-detail" aria-selected="' + (i === xpSel) + '">' +
          '<span class="tile__icon" data-tint="' + XP_TINT[i % 3] + '">' + icon(XP_ICON[i % 3]) + '</span>' +
          '<span class="xp-item__txt"><b>' + esc(j.role) + '</b><small>' + esc(j.org) + '</small>' +
            (j.period ? '<small class="xp-item__period">' + esc(j.period) + '</small>' : '') + '</span>' +
          (j.status === 'ACTIVE' ? '<span class="badge-now">' + esc(j.badge || 'Current') + '</span>' : '') +
          icon('next') +
        '</button>').join('') +
      '</div>' +
      '<article class="xp" id="xp-detail" role="tabpanel"></article>';
    renderXp();
  }

  function renderXp() {
    const j = D.experience[xpSel], el = $('#xp-detail');
    $$('[data-xp]').forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.xp === xpSel)));
    el.setAttribute('aria-labelledby', 'xpt-' + xpSel);
    el.innerHTML =
      '<span class="tile__icon" data-tint="' + XP_TINT[xpSel % 3] + '">' + icon(XP_ICON[xpSel % 3]) + '</span>' +
      '<div class="xp__main">' +
        '<div class="xp__top"><h3>' + esc(j.role) + '</h3>' +
          (j.status === 'ACTIVE' ? '<span class="badge-now">' + esc(j.badge || 'Current') + '</span>' : '') + '</div>' +
        '<p class="xp__org">' + esc(j.org) + (j.period ? ' · <span class="xp__period">' + esc(j.period) + '</span>' : '') + '</p>' +
        '<ul class="xp__points">' + j.points.map((p, i) => '<li style="--i:' + i + '">' + esc(p) + '</li>').join('') + '</ul>' +
      '</div>';
    el.classList.remove('is-swap');
    void el.offsetWidth;
    el.classList.add('is-swap');
  }

  /* ======================================================================
     CONTACT: iOS contact card + mail compose
     ====================================================================== */
  function renderContact() {
    const row = (label, value, href, copyable) =>
      '<li class="list__row list__row--kv"><span class="list__label">' + label + '</span>' +
        (href ? '<a href="' + esc(href) + '">' + esc(value) + '</a>' : '<span>' + esc(value) + '</span>') +
        (copyable ? '<button class="list__copy" type="button" data-copy="' + esc(value) + '" aria-label="Copy ' + label + '">' + icon('copy') + '</button>' : '') +
      '</li>';
    const act = (ic, label) => icon(ic) + '<span>' + label + '</span>';

    $('#contact-body').innerHTML =
      '<div class="ccard">' +
        '<img class="ccard__avatar" src="' + esc(P.photo) + '" alt="" width="96" height="96">' +
        '<h3 class="ccard__name">' + esc(P.name) + '</h3>' +
        '<p class="ccard__role">' + esc(P.role) + '</p>' +
        '<div class="ccard__actions">' +
          '<a class="cact" href="mailto:' + esc(P.email) + '?subject=' + encodeURIComponent('Opportunity for Hannah') + '">' + act('mail', 'mail') + '</a>' +
          '<button class="cact" type="button" data-copy="' + esc(P.email) + '">' + act('copy', 'copy') + '</button>' +
          '<a class="cact" href="' + esc(L.resume) + '" download>' + act('download', 'résumé') + '</a>' +
          profileLink('linkedin', 'LinkedIn', 'cact', act('linkedin', 'linkedin')) +
        '</div>' +
        '<ul class="list">' +
          row('email', P.email, 'mailto:' + P.email, true) +
          row('school', P.schoolEmail, 'mailto:' + P.schoolEmail, true) +
          row('location', P.location) +
          (L.github ? row('github', L.github.replace(/^https?:\/\/(www\.)?/, ''), L.github) : '') +
          (L.linkedin ? row('linkedin', L.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), L.linkedin) : '') +
          (L.facebook ? row('facebook', L.facebook.replace(/^https?:\/\/(www\.)?/, ''), L.facebook) : '') +
        '</ul>' +
      '</div>' +
      '<form class="mailform" novalidate>' +
        '<h3 class="mailform__title">New message</h3>' +
        '<div class="list mailform__fields">' +
          '<div class="field"><span class="field__label">To:</span><span class="field__to">' + esc(P.name) + '</span></div>' +
          '<div class="field"><label class="field__label" for="cf-name">Name:</label><input id="cf-name" name="name" autocomplete="name" placeholder="Your name" required></div>' +
          '<div class="field"><label class="field__label" for="cf-email">Email:</label><input id="cf-email" name="email" type="email" autocomplete="email" placeholder="you@company.com" required></div>' +
          '<div class="field"><label class="field__label" for="cf-subject">Subject:</label><input id="cf-subject" name="subject" value="Opportunity for Hannah"></div>' +
        '</div>' +
        '<div class="list mailform__msg"><label class="sr-only" for="cf-msg">Message</label><textarea id="cf-msg" name="message" rows="6" placeholder="Hi Hannah, we\'d love to talk about…" required></textarea></div>' +
        '<div class="mailform__foot">' +
          '<p class="mailform__note" id="cf-note">' + (L.formEndpoint ? 'Sent securely through this site.' : 'Opens your email app with this message ready to send.') + '</p>' +
          '<button class="btn btn--primary" type="submit">' + icon('send') + 'Send</button>' +
        '</div>' +
      '</form>';

    const form = $('.mailform');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form));
      const note = $('#cf-note');
      const bad = !f.name.trim() ? 'cf-name' : !/^\S+@\S+\.\S+$/.test(f.email) ? 'cf-email' : !f.message.trim() ? 'cf-msg' : null;
      if (bad) {
        note.className = 'mailform__note is-error';
        note.textContent = { 'cf-name': 'Please add your name.', 'cf-email': 'Please add a valid email so Hannah can reply.', 'cf-msg': 'Please write a short message.' }[bad];
        $('#' + bad).focus();
        return;
      }
      note.className = 'mailform__note';
      if (L.formEndpoint) {
        fetch(L.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f) })
          .then((r) => { if (!r.ok) throw new Error(); form.reset(); HOS.toast('Message sent. Hannah will reply soon.', 'send'); })
          .catch(() => HOS.toast('Could not send. Please email ' + esc(P.email), 'info'));
        return;
      }
      const text = f.message + '\n\n— ' + f.name + ' (' + f.email + ')';
      location.href = 'mailto:' + P.email + '?subject=' + encodeURIComponent(f.subject || 'Opportunity for Hannah') + '&body=' + encodeURIComponent(text);
      HOS.toast('Opening your email app…', 'send');
    });
  }

  /* ======================================================================
     SHEETS: résumé preview, bugs_i_fixed.txt
     ====================================================================== */
  function openResume() {
    Sheet.open('Résumé',
      '<div class="rs__bar">' +
        '<a class="btn btn--primary btn--sm" href="' + esc(L.resume) + '" download>' + icon('download') + 'Download PDF</a>' +
        '<button class="btn btn--tinted btn--sm" type="button" data-action="print">' + icon('pdf') + 'Print</button>' +
        '<button class="btn btn--tinted btn--sm" type="button" data-copy="' + esc(P.email) + '">' + icon('copy') + 'Copy email</button>' +
      '</div>' +
      '<div class="rs__page paper">' + HOS.resumeHTML({ variant: 'paper' }) + '</div>', { wide: true });
  }

  function openBugs() {
    Sheet.open('bugs_i_fixed.txt',
      '<div class="notes">' +
        '<p class="notes__date">QA log · HannahOS</p>' +
        D.bugs.map((b) =>
          '<div class="notes__row"><span class="notes__st st-' + b[0] + '">' + b[0] + '</span><span class="notes__id">' + b[1] + '</span><span>' + esc(b[2]) +
          (b[0] === 'OPEN' ? ' <button class="btn btn--plain btn--sm" type="button" data-goto="contact">Contact ›</button>' : '') + '</span></div>').join('') +
      '</div>');
  }

  /* ======================================================================
     NAV PEEK: hover a top-menu item for a short preview with quick links
     ====================================================================== */
  function peekContent(id) {
    const row = (attrs, ic, label, sub) => '<button class="peek__item" type="button" ' + attrs + '>' + icon(ic) +
      '<span><b>' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span></button>';
    const S = D.school, R = D.research;
    const map = {
      overview: ['Who I am, what I\'m doing now, and three reasons to hire me.', [
        row('data-goto="overview"', 'user', 'About me', P.role + ' · ' + P.location),
        row('data-goto="why"', 'shield', 'Why hire me', D.why.map((w) => w.title).join(' · ')),
        row('data-action="resume"', 'file', 'Résumé', 'Preview, print or download')]],
      projects: [D.projects.length + ' builds across software and embedded systems.', D.projects.slice(0, 4).map((p) =>
        row('data-project="' + p.id + '"', CAT[p.cat].icon, p.title, catLine(p))).concat(row('data-goto="projects"', 'folder', 'See all ' + D.projects.length + ' projects', ''))],
      skills: [D.skills.length + ' skills across ' + D.skillCategories.length + ' areas, from firmware to soft skills.', [
        row('data-peek-view="orbit"', 'sparkles', 'Skill orbit', 'Drag it, spin it, tap a logo'),
        row('data-peek-view="grid"', 'grid', 'Skill grid', 'Search and filter by category'),
        row('data-peek-view="match"', 'checkCircle', 'Stack check', 'Does Hannah fit your stack?'),
        row('data-peek-cat="soft"', 'message', 'Soft skills', 'Client communication, teamwork and more')]],
      research: [R.status + ' undergraduate thesis · ' + R.year + '.', [
        row('data-goto="research"', 'file', R.short, 'Read the abstract'),
        row('data-goto="research"', 'lock', 'Public-safe summary', 'No case records or identities')]],
      education: [S.degree + ', ' + S.short + '.', [
        row('data-goto="education"', 'cap', S.name, S.years + ' · ' + S.city),
        row('data-goto="journey-title"', 'map', 'My journey', S.journey.length + ' milestones')]],
      experience: ['Working scholar since 2022, alongside full-time studies.', D.experience.map((j, i) =>
        row('data-peek-xp="' + i + '"', XP_ICON[i % 3], j.role, j.org + (j.period ? ' · ' + j.period : '')))],
      contact: ['Email is the fastest way to reach me.', [
        row('data-copy="' + esc(P.email) + '"', 'copy', 'Copy email', P.email),
        row('data-goto="contact"', 'send', 'Send a message', 'Opens your email app'),
        L.linkedin ? '<a class="peek__item" href="' + esc(L.linkedin) + '" target="_blank" rel="noopener">' + icon('linkedin') + '<span><b>LinkedIn</b><small>Opens in a new tab</small></span></a>' : '']]
    };
    return map[id];
  }

  function initPeek() {
    const panel = document.createElement('div');
    panel.className = 'peek';
    panel.id = 'peek';
    panel.hidden = true;
    document.body.appendChild(panel);
    const hover = document.createElement('span');
    hover.className = 'nav__hover';
    hover.setAttribute('aria-hidden', 'true');
    $('.nav__links').appendChild(hover);
    let timer = 0, current = null;

    const place = (link) => {
      const r = link.getBoundingClientRect(), w = panel.offsetWidth;
      const left = HOS.clamp(r.left + r.width / 2 - w / 2, 12, innerWidth - w - 12);
      panel.style.left = left + 'px';
      panel.style.top = (r.bottom + 10) + 'px';
      panel.style.setProperty('--caret', (r.left + r.width / 2 - left) + 'px');
      const nr = $('.nav__links').getBoundingClientRect();
      hover.style.width = r.width + 'px';
      hover.style.transform = 'translateX(' + (r.left - nr.left) + 'px)';
      hover.classList.add('is-on');
    };
    const open = (link) => {
      const id = link.getAttribute('href').slice(1), c = peekContent(id);
      if (!c) return;
      clearTimeout(timer);
      if (current !== link) {
        panel.innerHTML = '<p class="peek__lead">' + esc(c[0]) + '</p><div class="peek__list">' + c[1].join('') + '</div>' +
          '<a class="peek__open" href="#' + id + '">Open ' + esc(link.textContent) + icon('next') + '</a>';
        current = link;
      }
      panel.hidden = false;
      place(link);
      requestAnimationFrame(() => panel.classList.add('is-open'));
    };
    const close = (now) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        panel.classList.remove('is-open'); hover.classList.remove('is-on'); current = null;
        setTimeout(() => { if (!panel.classList.contains('is-open')) panel.hidden = true; }, 180);
      }, now ? 0 : 160);
    };

    $$('.nav__links a').forEach((a) => {
      a.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { clearTimeout(timer); timer = setTimeout(() => open(a), current ? 0 : 90); } });
      a.addEventListener('pointerleave', () => close());
      a.addEventListener('focus', () => open(a));
      a.addEventListener('blur', (e) => { if (!panel.contains(e.relatedTarget)) close(); });
    });
    panel.addEventListener('pointerenter', () => clearTimeout(timer));
    panel.addEventListener('pointerleave', () => close());
    panel.addEventListener('focusout', (e) => { if (!panel.contains(e.relatedTarget) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.nav__links'))) close(); });
    panel.addEventListener('click', (e) => { if (e.target.closest('button, a')) close(true); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { const c = current; close(true); if (c) c.focus(); } });
    window.addEventListener('resize', () => close(true));
  }

  /* ======================================================================
     PAGER: one screen per section. Nav links, dots, arrows, mouse wheel
     at the end of a screen, PageUp/PageDown and swipes all change screens.
     ====================================================================== */
  const Pager = {
    on: false, pages: [], i: 0, lock: 0, counted: false,

    init() {
      this.pages = $$('.page');
      if (!this.pages.length) return;
      this.on = true;
      document.documentElement.classList.add('paged');
      const want = location.hash.slice(1);
      const el = want && document.getElementById(want);
      const pg = el && el.closest('.page');
      const start = pg ? this.pages.indexOf(pg) : 0;
      this.pages.forEach((p, k) => { p.tabIndex = -1; p.hidden = k !== start; p.classList.toggle('is-active', k === start); });
      this.i = start;
      const bar = $('#pager');
      bar.hidden = false;
      bar.innerHTML =
        '<button class="pager__arrow" type="button" data-page-step="-1" aria-label="Previous screen">' + icon('back') + '</button>' +
        '<div class="pager__dots">' + this.pages.map((p) =>
          '<button class="pager__dot" type="button" data-page="' + p.id + '" aria-label="' + esc(p.dataset.title) + '"><span>' + esc(p.dataset.title) + '</span></button>').join('') + '</div>' +
        '<span class="pager__label"></span>' +
        '<button class="pager__arrow pager__arrow--next" type="button" data-page-step="1" aria-label="Next screen"><span class="pager__next"></span>' + icon('next') + '</button>';
      this.sync();
      this.bind();
      if (el && el !== pg) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
      this.onShow(this.pages[start].id);
    },

    sync() {
      const cur = this.pages[this.i], n = this.pages.length, next = this.pages[this.i + 1];
      $$('.pager__dot').forEach((d) => { if (d.dataset.page === cur.id) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
      $('.pager__label').textContent = (this.i + 1) + ' / ' + n + ' · ' + cur.dataset.title;
      $('.pager__next').textContent = next ? next.dataset.title : '';
      $('[data-page-step="-1"]').disabled = this.i === 0;
      $('[data-page-step="1"]').disabled = this.i === n - 1;
      $$('[data-spy]').forEach((l) => { if (l.dataset.spy === cur.id) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
      $('#nav').style.setProperty('--sp', n > 1 ? (this.i / (n - 1)).toFixed(4) : 1);
    },

    show(id, opts) {
      const k = this.pages.findIndex((p) => p.id === id);
      if (k < 0 || k === this.i) return;
      const from = this.pages[this.i], to = this.pages[k], dir = k > this.i ? 1 : -1;
      HOS.hideTip();
      to.hidden = false;
      to.scrollTop = 0;
      from.classList.remove('is-active');
      to.classList.add('is-active');
      this.i = k;
      this.lock = performance.now();
      // Web Animations: a short slide that still plays when the OS asks for less motion (it's user-initiated)
      if (to.animate) {
        to.animate([{ opacity: 0, transform: 'translateX(' + (dir * 48) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 440, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        const out = from.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(' + (-dir * 48) + 'px)' }], { duration: 240, easing: 'ease-in' });
        out.onfinish = () => { if (!from.classList.contains('is-active')) from.hidden = true; };
      } else from.hidden = true;
      this.sync();
      history.replaceState(null, '', id === 'top' ? location.pathname + location.search : '#' + id);
      if (!(opts && opts.keepFocus)) to.focus({ preventScroll: true });
      this.onShow(id);
    },

    step(d) {
      const k = this.i + d;
      if (k >= 0 && k < this.pages.length) this.show(this.pages[k].id);
    },

    onShow(id) {
      if (id === 'top' && !this.counted) { this.counted = true; HOS.countUp($('#home-stats')); }
    },

    /** Can this element (or a scroller between it and the screen) still scroll in direction dir? */
    innerCanScroll(target, page, dir) {
      for (let el = target; el && el !== page; el = el.parentElement) {
        if (el.scrollHeight > el.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(el).overflowY)) {
          if (dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
        }
      }
      return false;
    },

    bind() {
      const deck = $('#main');
      // Wheel: scroll the screen first; a fresh wheel gesture at its top / bottom flips the screen
      let acc = 0, lastWheel = 0, gestureAtEdge = false;
      deck.addEventListener('wheel', (e) => {
        if (Sheet.isOpen() || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        const page = this.pages[this.i], dir = e.deltaY > 0 ? 1 : -1, now = performance.now();
        const fresh = now - lastWheel > 220;
        lastWheel = now;
        if (this.innerCanScroll(e.target, page, dir)) { gestureAtEdge = false; return; }
        const atEdge = dir > 0 ? page.scrollTop + page.clientHeight >= page.scrollHeight - 2 : page.scrollTop <= 1;
        if (fresh) { gestureAtEdge = atEdge; acc = 0; }
        if (!atEdge || !gestureAtEdge || now - this.lock < 650) return;
        acc += Math.abs(e.deltaY);
        if (acc > 60) { acc = 0; gestureAtEdge = false; this.step(dir); }
      }, { passive: true });

      // Keys: PageUp / PageDown at a screen's edge, ← / → when nothing interactive has focus
      document.addEventListener('keydown', (e) => {
        if (Sheet.isOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
        const t = e.target;
        if (t.closest && t.closest('input, textarea, select, [contenteditable], [role="tab"], .orbit, .term-window, .proj-grid, .shots')) return;
        const page = this.pages[this.i];
        const idle = t === document.body || t === page || t.classList.contains('page');
        if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && idle) { e.preventDefault(); this.step(e.key === 'ArrowRight' ? 1 : -1); return; }
        if (e.key === 'PageDown' || e.key === 'PageUp') {
          const dir = e.key === 'PageDown' ? 1 : -1;
          const atEdge = dir > 0 ? page.scrollTop + page.clientHeight >= page.scrollHeight - 2 : page.scrollTop <= 1;
          if (atEdge) { e.preventDefault(); this.step(dir); }
        }
      });

      // Swipe left / right on phones (not on carousels, the orbit, the terminal or form fields)
      let sx = 0, sy = 0, st = 0, skip = false;
      deck.addEventListener('touchstart', (e) => {
        const p = e.touches[0];
        sx = p.clientX; sy = p.clientY; st = performance.now();
        skip = !!e.target.closest('.proj-grid, .shots, .orbit, .marquee, .seg, .term-window, input, textarea, .sk-bento, .journey__track');
      }, { passive: true });
      deck.addEventListener('touchend', (e) => {
        if (skip || Sheet.isOpen()) return;
        const p = e.changedTouches[0], dx = p.clientX - sx, dy = p.clientY - sy;
        if (performance.now() - st < 700 && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) this.step(dx < 0 ? 1 : -1);
      }, { passive: true });
    }
  };

  /* ======================================================================
     EVENTS
     ====================================================================== */
  const ACTIONS = {
    theme: HOS.toggleTheme,
    resume: openResume,
    bugs: openBugs,
    print: () => window.print(),
    'close-sheet': () => Sheet.close()
  };

  function bindEvents() {
    let lastPointer = 'mouse';
    document.addEventListener('pointerdown', (e) => { lastPointer = e.pointerType; }, true);

    document.addEventListener('click', (e) => {
      const t = e.target;
      const an = t.closest('a[href^="#"]');
      if (an && Pager.on) {
        const id = an.getAttribute('href').slice(1) || 'top';
        if (id === 'main') { e.preventDefault(); Pager.pages[Pager.i].focus(); return; }
        if (document.getElementById(id)) { e.preventDefault(); Sheet.close(); goto(id); return; }
      }
      const pd = t.closest('[data-page]');
      if (pd) { Pager.show(pd.dataset.page, { keepFocus: true }); return; }
      const ps = t.closest('[data-page-step]');
      if (ps) { Pager.step(+ps.dataset.pageStep); return; }
      const pc = t.closest('[data-proj-scroll]');
      if (pc) { const g = $('#proj-grid'); g.scrollBy({ left: +pc.dataset.projScroll * g.clientWidth * 0.8, behavior: 'smooth' }); return; }
      const xp = t.closest('[data-xp]');
      if (xp) { xpSel = +xp.dataset.xp; renderXp(); return; }
      const a = t.closest('[data-action]');
      if (a && ACTIONS[a.dataset.action]) { e.preventDefault(); ACTIONS[a.dataset.action](); return; }
      const pj = t.closest('[data-project]');
      if (pj) { openProject(pj.dataset.project); return; }
      const tech = t.closest('[data-tech]');
      if (tech) { filterTech(tech.dataset.tech); return; }
      const f = t.closest('[data-filter]');
      if (f) { pstate.cat = f.dataset.filter; renderProjects(); $('[data-filter="' + pstate.cat + '"]').focus(); return; }
      if (t.closest('[data-clear-tech]')) { pstate.tech = null; renderProjects(); $('[data-filter="all"]').focus(); return; }
      const sc = t.closest('[data-skill-cat]');
      if (sc) { skillCat = sc.dataset.skillCat; renderSkills(); $('[data-skill-cat="' + skillCat + '"]').focus(); return; }
      const sn = t.closest('[data-shots]');
      if (sn) { const tr = sn.parentElement.querySelector('.shots__track'); tr.scrollBy({ left: +sn.dataset.shots * tr.clientWidth * 0.9, behavior: HOS.reduced() ? 'auto' : 'smooth' }); return; }
      const so = t.closest('[data-skill-open]');
      if (so) { openSkill(so.dataset.skillOpen); return; }
      if (t.closest('[data-skill-reset]')) { $('#skill-q').value = ''; $('#skill-used').checked = false; skillCat = 'all'; renderSkills(); $('#skill-q').focus(); return; }
      const sv = t.closest('[data-skill-view]');
      if (sv) { setSkillView(sv.dataset.skillView); return; }
      const rc = t.closest('[data-radar-cat]');
      if (rc) { skillCat = rc.dataset.radarCat; if (skillView === 'match') skillView = 'orbit'; renderSkills(); goto('skill-tabs'); return; }
      const fl = t.closest('[data-flip]');
      if (fl) { fl.setAttribute('aria-pressed', String(fl.getAttribute('aria-pressed') !== 'true')); return; }
      const pr = t.closest('[data-preset]');
      if (pr) { stack.length = 0; PRESETS[+pr.dataset.preset].ids.forEach(addStack); return; }
      const sd = t.closest('[data-stack-del]');
      if (sd) { stack.splice(stack.indexOf(sd.dataset.stackDel), 1); renderStack(); $('#skm-q').focus(); return; }
      if (t.closest('[data-stack-clear]')) { stack.length = 0; renderStack(); $('#skm-q').focus(); return; }
      const sa = t.closest('[data-stack-add]');
      if (sa) { addStack(sa.dataset.stackAdd); Sheet.close(); setSkillView('match'); goto('skills'); return; }
      const wf = t.closest('[data-why-flip]');
      if (wf) { flipWhy(wf.closest('.why__card')); return; }
      const es = t.closest('[data-edu-step]');
      if (es) { setEduStep(+es.dataset.eduStep); return; }
      const pv = t.closest('[data-peek-view]');
      if (pv) { setSkillView(pv.dataset.peekView); goto('skills'); return; }
      const pcat = t.closest('[data-peek-cat]');
      if (pcat) { skillCat = pcat.dataset.peekCat; if (skillView === 'match') skillView = 'orbit'; renderSkills(); goto('skills'); return; }
      const px = t.closest('[data-peek-xp]');
      if (px) { xpSel = +px.dataset.peekXp; renderXp(); goto('experience'); return; }
      const sk = t.closest('.sk-card [data-skill], .orbit [data-skill]');
      if (sk && sk.closest('.orbit') && e.detail) return;   // pointer taps on the orbit are handled by initOrbit
      if (sk) { HOS.hideTip(); openSkill(sk.dataset.skill); return; }
      const cp = t.closest('[data-copy]');
      if (cp) { HOS.copy(cp.dataset.copy); return; }
      const soon = t.closest('[data-soon]');
      if (soon) { HOS.toast(esc(soon.dataset.soon) + ' link coming soon', 'info'); return; }
      const g = t.closest('[data-goto]');
      if (g) { Sheet.close(); goto(g.dataset.goto); return; }
      if (!t.closest('[data-skill]')) HOS.hideTip();
    });

    // Segmented controls: arrow keys move between options (WAI-ARIA tabs)
    document.addEventListener('keydown', (e) => {
      const tab = e.target.closest && e.target.closest('[role="tab"]');
      if (!tab || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      const tabs = $$('[role="tab"]', tab.parentElement), i = tabs.indexOf(tab);
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      e.preventDefault(); next.click();
    });

    // Skill tooltips: mouse hover + keyboard focus
    document.addEventListener('pointerover', (e) => { const s = e.target.closest('[data-skill]'); if (s && e.pointerType === 'mouse') HOS.showTip(s); });
    document.addEventListener('pointerout', (e) => { const s = e.target.closest('[data-skill]'); if (s && !s.contains(e.relatedTarget) && e.pointerType === 'mouse') HOS.hideTip(); });
    document.addEventListener('focusin', (e) => { const s = e.target.closest && e.target.closest('[data-skill]'); if (s && lastPointer !== 'touch') HOS.showTip(s); else if (!s) HOS.hideTip(); });
    document.addEventListener('scroll', HOS.hideTip, { passive: true, capture: true });

    // Radar keys highlight their axis
    const axis = (id, on) => $$('[data-axis="' + id + '"]').forEach((n) => n.classList.toggle('is-hot', on));
    ['pointerover', 'focusin'].forEach((ev) => document.addEventListener(ev, (e) => { const k = e.target.closest && e.target.closest('[data-radar-cat]'); if (k) axis(k.dataset.radarCat, true); }));
    ['pointerout', 'focusout'].forEach((ev) => document.addEventListener(ev, (e) => { const k = e.target.closest && e.target.closest('[data-radar-cat]'); if (k) axis(k.dataset.radarCat, false); }));

    // Stack matcher: add by name
    $('.skm__add').addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = $('#skm-q'), q = inp.value.trim().toLowerCase();
      if (!q) return;
      const s = D.skills.find((x) => x.name.toLowerCase() === q) || D.skills.find((x) => x.name.toLowerCase().indexOf(q) > -1);
      if (s) { addStack(s.id); inp.value = ''; }
      else HOS.toast('Not in my toolkit yet, but I learn fast', 'sparkles');
    });

    // Without the pager: nav hairline + progress follow the window scroll (with it, Pager.sync drives the bar)
    const nav = $('#nav');
    const onScroll = () => {
      if (Pager.on) return;
      nav.classList.toggle('is-scrolled', scrollY > 8);
      const max = document.documentElement.scrollHeight - innerHeight;
      nav.style.setProperty('--sp', max > 0 ? (scrollY / max).toFixed(4) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    Sheet.bind();

    // Skills: live search + toggle
    $('#skill-q').addEventListener('input', filterSkills);
    $('#skill-q').addEventListener('keydown', (e) => { if (e.key === 'Escape' && e.target.value) { e.target.value = ''; filterSkills(); } });
    $('#skill-used').addEventListener('change', filterSkills);
  }

  /* Fade sections in as they scroll into view; count up the stats once */
  function reveal() {
    const els = $$('.sec-head, .ov-intro, .why__card, .sk-me, .rx-abstract, .campus, .journey, .edu-tile, .xp-list, .term-window, .ccard, .mailform');
    if (HOS.reduced() || !('IntersectionObserver' in window)) return;
    els.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* Start the terminal only when it scrolls into view (no surprise focus or typing) */
  function lazyTerminal() {
    const host = $('#terminal');
    const start = () => { if (!host.dataset.ready) { host.dataset.ready = '1'; new HOS.Terminal(host); } };
    if (!('IntersectionObserver' in window)) return start();
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { start(); io.disconnect(); } }, { rootMargin: '150px' });
    io.observe(host);
  }

  /* ======================================================================
     INIT
     ====================================================================== */
  function init() {
    $$('[data-photo]').forEach((img) => { img.src = P.photo; });
    renderOverview();
    renderProjects();
    renderMe();
    renderMatch();
    renderOrbit();
    initOrbit();
    renderSkills();
    renderResearch();
    renderEducation();
    renderExperience();
    renderContact();
    $('#print-cv').innerHTML = HOS.resumeHTML();
    HOS.fillIcons(document);
    HOS.applyTheme(document.documentElement.dataset.theme);
    bindEvents();
    tiltCampus();
    typer();
    initMarquee();
    spotlight();
    Pager.init();
    initPeek();
    reveal();
    lazyTerminal();
    // Old "HR Mode" links (…/#hr) open the 1-page résumé
    if (location.hash === '#hr' || location.hash === '#resume') openResume();
  }

  Object.assign(HOS, { goto, openProject, openResume, openBugs, openSkill });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
