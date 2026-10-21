/* ==========================================================================
   Page: renders every section from data.js and wires up interactions
   Overview · Projects (+ sheets) · Skills · Experience · Terminal · Contact
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

  /** Smooth-scroll to a section (respects reduced motion). */
  function goto(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: HOS.reduced() ? 'auto' : 'smooth', block: 'start' });
  }

  /* ======================================================================
     OVERVIEW: about, bento stats, why hire me
     ====================================================================== */
  function renderOverview() {
    $('#about-text').textContent = P.about;
    const [yrs, projs, tools, honors] = D.stats;
    const sw = D.projects.filter((p) => p.cat === 'software').length;
    $('#bento').innerHTML =
      '<article class="tile tile--hero">' +
        '<p class="tile__eyebrow">Working student</p>' +
        '<p class="tile__num grad-text" data-count="' + yrs.value + '" data-suffix="' + yrs.suffix + '">' + yrs.value + yrs.suffix + '</p>' +
        '<p class="tile__label">years supporting a high-volume office while studying engineering full-time.</p>' +
        '<p class="tile__sub">' + esc(yrs.sub) + ' · Registrar\'s Office, USJ-R</p>' +
      '</article>' +
      '<article class="tile">' +
        '<p class="tile__num" data-count="' + projs.value + '">' + projs.value + '</p>' +
        '<p class="tile__label">projects built</p><p class="tile__sub">' + sw + ' software · ' + (D.projects.length - sw) + ' embedded</p>' +
      '</article>' +
      '<article class="tile">' +
        '<p class="tile__num" data-count="' + tools.value + '" data-suffix="' + tools.suffix + '">' + tools.value + tools.suffix + '</p>' +
        '<p class="tile__label">languages, frameworks and tools</p><p class="tile__sub">' + esc(tools.sub) + '</p>' +
      '</article>' +
      '<article class="tile tile--wide">' +
        '<span class="tile__icon" data-tint="orange">' + icon('award') + '</span>' +
        '<div><p class="tile__big">' + esc(honors.text) + '</p><p class="tile__label">' + esc(honors.label) + ' · ' + esc(honors.sub) + '</p></div>' +
      '</article>';

    const tints = ['blue', 'green', 'purple'];
    $('#why').innerHTML = D.why.map((w, i) =>
      '<article class="why__card"><span class="tile__icon" data-tint="' + tints[i] + '">' + icon(w.icon) + '</span>' +
        '<h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p></article>').join('');
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
     SKILLS: category segmented control + logo tiles
     ====================================================================== */
  let skillCat = 'all';
  const CAT_TINT = { lang: 'blue', web: 'purple', db: 'green', hw: 'orange', plat: 'pink', tools: 'blue', qa: 'green', soft: 'purple' };
  const CAT_WIDE = { lang: 1, tools: 1 };          // big categories span the full row
  const usedIn = (id) => HOS.projectsForSkill(id).length;

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
    filterSkills();
  }

  /** Live search + "used in projects" toggle, without re-rendering (keeps focus in the field). */
  function filterSkills() {
    const q = $('#skill-q').value.trim().toLowerCase();
    const onlyUsed = $('#skill-used').checked;
    let shown = 0;
    $$('.sk-card').forEach((card) => {
      let n = 0;
      $$('.skill', card).forEach((t) => {
        const ok = (!q || t.dataset.search.indexOf(q) > -1 || card.dataset.cat === q) && (!onlyUsed || t.dataset.used === '1');
        t.hidden = !ok; if (ok) n++;
      });
      card.hidden = !n; shown += n;
    });
    $('.sk-empty').hidden = shown > 0;
    $('#skill-count').textContent = (q || onlyUsed) ? 'Showing ' + shown + ' of ' + D.skills.length + ' skills' : D.skills.length + ' skills across ' + D.skillCategories.length + ' categories';
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
        : '<div class="list"><p class="list__row">' + icon('info') + '<span>' + esc(s.note || 'Used in coursework and lab work.') + ' No public project lists it yet.</span></p></div>') +
      (s.note && projs.length ? '<p class="skd__note">' + icon('info') + esc(s.note) + '</p>' : '') +
      (paired.length ? '<h4 class="ps__h">Often paired with</h4><div class="tags">' + paired.map((t) => {
          const o = HOS.skillById(t);
          return '<button class="tag' + (o.dark ? ' is-dark' : '') + '" type="button" data-skill-open="' + t + '">' + HOS.logo(o, { size: 16 }) + esc(o.name) + '</button>';
        }).join('') + '</div>' : '') +
      (projs.length ? '<div class="skd__actions"><button class="btn btn--primary btn--sm" type="button" data-tech="' + id + '">' + icon('folder') + 'Show these projects</button></div>' : ''));
  }

  /* ======================================================================
     EXPERIENCE & EDUCATION
     ====================================================================== */
  function renderExperience() {
    const tints = ['blue', 'purple', 'green'], ics = ['briefcase', 'message', 'cap'];
    $('#exp').innerHTML = D.experience.map((j, i) =>
      '<article class="xp">' +
        '<span class="tile__icon" data-tint="' + tints[i % 3] + '">' + icon(ics[i % 3]) + '</span>' +
        '<div class="xp__main">' +
          '<div class="xp__top"><h3>' + esc(j.role) + '</h3>' +
            (j.status === 'ACTIVE' ? '<span class="badge-now">Current</span>' : '') + '</div>' +
          '<p class="xp__org">' + esc(j.org) + (j.period ? ' · <span class="xp__period">' + esc(j.period) + '</span>' : '') + '</p>' +
          '<ul class="xp__points">' + j.points.map((p) => '<li>' + esc(p) + '</li>').join('') + '</ul>' +
        '</div>' +
      '</article>').join('');
    $('#edu').innerHTML = D.education.map((e, i) =>
      '<article class="edu__card"><span class="tile__icon" data-tint="' + (i ? 'orange' : 'blue') + '">' + icon(i ? 'award' : 'cap') + '</span>' +
        '<div><h4>' + esc(e.title) + '</h4><p>' + esc(e.org) + '</p><small>' + esc(e.note) + '</small></div></article>').join('');
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
      const sk = t.closest('.sk-card [data-skill]');
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
    window.addEventListener('scroll', HOS.hideTip, { passive: true });

    // Nav hairline appears once the page scrolls (like apple.com)
    const nav = $('#nav');
    const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    Sheet.bind();

    // Skills: live search + toggle
    $('#skill-q').addEventListener('input', filterSkills);
    $('#skill-q').addEventListener('keydown', (e) => { if (e.key === 'Escape' && e.target.value) { e.target.value = ''; filterSkills(); } });
    $('#skill-used').addEventListener('change', filterSkills);
  }

  /* Highlight the current section in the nav and tab bar */
  function scrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const ids = ['top', 'overview', 'projects', 'skills', 'experience', 'playground', 'contact'];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        let id = en.target.id;
        if (id === 'playground') id = 'experience';
        $$('[data-spy]').forEach((l) => {
          const on = l.dataset.spy === id || (id === 'overview' && l.dataset.spy === 'top' && l.closest('.tabbar'));
          if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* Fade sections in as they scroll into view; count up the stats once */
  function reveal() {
    const els = $$('.sec-head, .tile, .why__card, .xp, .edu__card, .term-window, .ccard, .mailform');
    if (HOS.reduced() || !('IntersectionObserver' in window)) { HOS.countUp($('#bento')); return; }
    els.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        if (en.target.classList.contains('tile--hero')) HOS.countUp($('#bento'));
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
    renderSkills();
    renderExperience();
    renderContact();
    $('#print-cv').innerHTML = HOS.resumeHTML();
    HOS.fillIcons(document);
    HOS.applyTheme(document.documentElement.dataset.theme);
    bindEvents();
    scrollSpy();
    reveal();
    lazyTerminal();
    // Old "HR Mode" links (…/#hr) open the 1-page résumé
    if (location.hash === '#hr' || location.hash === '#resume') openResume();
  }

  Object.assign(HOS, { goto, openProject, openResume, openBugs, openSkill });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
