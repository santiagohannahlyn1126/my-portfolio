/* ==========================================================================
   Core runtime
   Helpers · storage · toasts · tooltips · theme · iOS-style sheet
   ========================================================================== */

(function () {
  const HOS = window.HOS;
  const D = window.HOS_DATA;

  /* ---------- DOM helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- Storage (never throws: private mode, blocked storage…) ---------- */
  const store = {
    get(key, fallback) {
      try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); } catch (e) { return fallback; }
    },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ } }
  };

  const mq = {
    mobile: matchMedia('(max-width: 767px)'),
    reduced: matchMedia('(prefers-reduced-motion: reduce)'),
    dark: matchMedia('(prefers-color-scheme: dark)')
  };
  const isMobile = () => mq.mobile.matches;
  const reduced = () => mq.reduced.matches;

  /** Replace empty [data-icon] placeholders with inline SVG icons. */
  function fillIcons(root) {
    $$('[data-icon]', root).forEach((el) => { if (!el.firstElementChild) el.innerHTML = HOS.icon(el.dataset.icon); });
  }

  /* ---------- Data lookups ---------- */
  const skillById = (id) => D.skills.find((s) => s.id === id);
  const projectById = (id) => D.projects.find((p) => p.id === id);
  /** Projects that use a skill (listed in `tech`, or linked through `rel`). */
  function projectsForSkill(id) {
    const s = skillById(id);
    const rel = (s && s.rel) || [];
    return D.projects.filter((p) => p.tech.indexOf(id) > -1 || rel.indexOf(p.id) > -1);
  }

  /* ---------- Toast (iOS banner) ---------- */
  function toast(msg, icon) {
    const box = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = HOS.icon(icon || 'check') + '<span>' + msg + '</span>';
    box.appendChild(el);
    while (box.children.length > 2) box.firstElementChild.remove();
    setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 320); }, 2600);
  }

  /* ---------- Clipboard ---------- */
  function copy(text) {
    const done = () => toast('Copied <b>' + esc(text) + '</b>', 'copy');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text) && done());
    } else if (fallbackCopy(text)) done();
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  /* ---------- Count-up animation for stats ---------- */
  function countUp(root) {
    $$('[data-count]', root).forEach((el) => {
      const target = +el.dataset.count, suffix = el.dataset.suffix || '';
      if (reduced()) { el.textContent = target + suffix; return; }
      const start = performance.now(), dur = 1200;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /** <dl> stat tiles (used by the print résumé and the paper preview). */
  function statsHTML() {
    return D.stats.map((s) => {
      const val = s.text
        ? '<dd class="is-text">' + esc(s.text) + '</dd>'
        : '<dd>' + s.value + s.suffix + '</dd>';
      return '<div class="stat"><dt>' + esc(s.label) + '<small>' + esc(s.sub) + '</small></dt>' + val + '</div>';
    }).join('');
  }

  /* ---------- Skill tooltip (hover / focus / tap) ---------- */
  function showTip(target) {
    const el = $('#tip');
    const s = skillById(target.dataset.skill);
    const projs = projectsForSkill(s.id);
    const use = projs.length ? projs.map((p) => p.title).join(', ') : (s.note || 'Coursework and lab work');
    const hint = 'Tap for details';
    el.innerHTML = '<b>' + esc(s.name) + '</b><span class="tip__use">' + esc(s.name) + ' → ' + esc(use) + '</span><span class="tip__hint">' + hint + '</span>';
    el.hidden = false;
    const r = target.getBoundingClientRect(), tr = el.getBoundingClientRect();
    let y = r.top - tr.height - 10;
    if (y < 64) y = r.bottom + 10;
    el.style.left = clamp(r.left + r.width / 2 - tr.width / 2, 8, innerWidth - tr.width - 8) + 'px';
    el.style.top = y + 'px';
  }
  function hideTip() { const el = $('#tip'); if (el) el.hidden = true; }

  /* ---------- Theme (follows the device until the visitor picks one) ---------- */
  function applyTheme(theme, save) {
    document.documentElement.dataset.theme = theme;
    if (save) store.set('hos-theme', theme);
    $$('.theme-ico').forEach((el) => { el.innerHTML = HOS.icon(theme === 'dark' ? 'sun' : 'moon'); });
    $$('[data-action="theme"]').forEach((b) => b.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'));
  }
  const toggleTheme = () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
  mq.dark.addEventListener('change', (e) => { if (store.get('hos-theme', null) === null) applyTheme(e.matches ? 'dark' : 'light'); });

  /* ======================================================================
     SHEET: iOS modal sheet (bottom sheet on phones, centered card on desktop)
     ====================================================================== */
  const Sheet = {
    lastFocus: null,
    open(title, html, opts) {
      opts = opts || {};
      const sheet = $('#sheet'), panel = $('.sheet__panel', sheet), body = $('#sheet-body');
      if (sheet.hidden) this.lastFocus = document.activeElement;
      $('#sheet-title').textContent = title;
      panel.className = 'sheet__panel' + (opts.split ? ' sheet__panel--split' : opts.wide ? ' sheet__panel--wide' : '');
      body.innerHTML = html;
      fillIcons(body);
      body.scrollTop = 0;
      sheet.hidden = false;
      document.documentElement.classList.add('has-sheet');
      requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-open')));
      setTimeout(() => panel.focus({ preventScroll: true }), 40);
    },
    close() {
      const sheet = $('#sheet');
      if (sheet.hidden) return;
      sheet.classList.remove('is-open');
      document.documentElement.classList.remove('has-sheet');
      hideTip();
      setTimeout(() => { sheet.hidden = true; $('#sheet-body').innerHTML = ''; }, reduced() ? 0 : 320);
      if (this.lastFocus && document.contains(this.lastFocus)) this.lastFocus.focus({ preventScroll: true });
    },
    isOpen: () => !$('#sheet').hidden,
    bind() {
      const sheet = $('#sheet'), panel = $('.sheet__panel', sheet);
      // Keep keyboard focus inside the open sheet; Esc closes
      sheet.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
        if (e.key !== 'Tab') return;
        const f = $$('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])', panel).filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
      // Swipe the grabber / header down to dismiss (phones)
      let y0 = null, dy = 0;
      const start = (e) => { if (!isMobile()) return; y0 = e.touches[0].clientY; dy = 0; panel.classList.add('is-dragging'); };
      const move = (e) => { if (y0 === null) return; dy = Math.max(0, e.touches[0].clientY - y0); panel.style.transform = 'translateY(' + dy + 'px)'; };
      const end = () => { if (y0 === null) return; panel.classList.remove('is-dragging'); panel.style.transform = ''; if (dy > 110) this.close(); y0 = null; };
      [$('.sheet__grab', sheet), $('.sheet__head', sheet)].forEach((el) => {
        el.addEventListener('touchstart', start, { passive: true });
        el.addEventListener('touchmove', move, { passive: true });
        el.addEventListener('touchend', end);
      });
    }
  };

  Object.assign(HOS, {
    $, $$, esc, clamp, store, mq, isMobile, reduced, fillIcons,
    skillById, projectById, projectsForSkill,
    toast, copy, countUp, statsHTML, showTip, hideTip,
    applyTheme, toggleTheme, Sheet
  });
})();
