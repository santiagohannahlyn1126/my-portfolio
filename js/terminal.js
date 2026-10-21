/* ==========================================================================
   HannahOS — Portfolio console (Playground)
   Plain-English quick questions · typed commands · ↑/↓ history · Tab autocomplete
   ========================================================================== */

(function () {
  const HOS = window.HOS;
  const D = window.HOS_DATA;
  const { esc } = HOS;
  const P = D.profile;

  const PROMPT = '<span class="term__prompt" aria-hidden="true">›</span>';
  const sleep = (ms) => new Promise((r) => setTimeout(r, HOS.reduced() ? 0 : ms));

  /* Commands grouped for "help", each with a plain-English description */
  const GROUPS = [
    ['About Hannah', [
      ['about', 'Who Hannah is and what she does'],
      ['summary', 'Profile at a glance'],
      ['projects', 'All ' + D.projects.length + ' projects'],
      ['skills', 'Skills by category'],
      ['experience', 'Work and leadership roles'],
      ['education', 'Degree and school'],
      ['research', 'Approved thesis abstract']
    ]],
    ['Get in touch', [
      ['contact', 'Email and profile links'],
      ['resume', 'Preview and download the résumé'],
      ['hire', 'Run a quick hiring checklist']
    ]],
    ['Navigate', [
      ['open <name>', 'Go to a section, e.g. open skills'],
      ['open <number>', 'Open a project, e.g. open 1'],
      ['theme', 'Switch light / dark mode'],
      ['date', 'Current time in Cebu City'],
      ['clear', 'Clear the console']
    ]]
  ];
  /* Aliases: friendlier words and the old developer commands still work */
  const ALIAS = { whoami: 'about', neofetch: 'summary', info: 'summary', cv: 'resume', hr: 'resume', email: 'contact', work: 'experience', jobs: 'experience', school: 'education', thesis: 'research', 'sudo': 'hire', ls: 'help', commands: 'help', '?': 'help', cls: 'clear' };
  const go = (id) => () => HOS.goto(id);
  const APPS = { home: go('top'), overview: go('overview'), about: go('overview'), projects: go('projects'), skills: go('skills'), research: go('research'), education: go('education'), experience: go('experience'), contact: go('contact'), resume: () => HOS.openResume() };

  class Terminal {
    constructor(body) {
      this.body = body;
      this.history = [];
      this.hIndex = 0;
      this.busy = false;
      const uid = 'ti-' + Math.random().toString(36).slice(2, 7);
      body.innerHTML =
        '<div class="term">' +
          '<div class="term__out" role="log" aria-live="polite" aria-label="Console output">' +
            '<div class="term__lines"></div>' +
            '<form class="term__input-row" autocomplete="off">' +
              '<label class="term__prompt" for="' + uid + '">›</label>' +
              '<input class="term__input" id="' + uid + '" type="text" spellcheck="false" autocapitalize="off" autocorrect="off" enterkeyhint="send" placeholder="Type a command, e.g. projects" aria-describedby="' + uid + '-h">' +
              '<button class="term__send" type="submit" aria-label="Run command">Enter ↵</button>' +
              '<span class="sr-only" id="' + uid + '-h">Type a command and press Enter. Type help for the list. Tab completes, arrow keys browse history.</span>' +
            '</form>' +
          '</div>' +
        '</div>';
      this.out = body.querySelector('.term__out');
      this.lines = body.querySelector('.term__lines');
      this.input = body.querySelector('.term__input');
      this.bind();
      this.intro();
      HOS.termInstance = this;
    }

    bind() {
      const form = this.body.querySelector('form');
      form.addEventListener('submit', (e) => { e.preventDefault(); this.submit(); });
      this.input.addEventListener('keydown', (e) => this.keys(e));
      this.out.addEventListener('click', (e) => {
        const link = e.target.closest('[data-term]');
        if (link) { this.typeAndRun(link.dataset.term); return; }
        if (!window.getSelection().toString() && !e.target.closest('a, button')) this.input.focus();
      });
    }

    keys(e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (!this.history.length) return;
        e.preventDefault();
        this.hIndex = HOS.clamp(this.hIndex + (e.key === 'ArrowUp' ? -1 : 1), 0, this.history.length);
        this.input.value = this.history[this.hIndex] || '';
        requestAnimationFrame(() => this.input.setSelectionRange(this.input.value.length, this.input.value.length));
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.complete();
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        if (this.input.value) this.input.value = '';
        else this.input.blur();
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault(); this.lines.innerHTML = '';
      }
    }

    /** Tab completion over commands and section names. */
    complete() {
      const v = this.input.value.replace(/^\s+/, '').toLowerCase();
      const pool = GROUPS.flatMap((g) => g[1].map((c) => c[0])).filter((c) => c.indexOf('<') < 0)
        .concat(Object.keys(APPS).map((a) => 'open ' + a)).concat(['help', 'theme light', 'theme dark']);
      const hits = pool.filter((c) => c.indexOf(v) === 0 && c !== v);
      if (hits.length === 1) this.input.value = hits[0];
      else if (hits.length > 1) {
        let pre = hits[0];
        hits.forEach((h) => { while (h.indexOf(pre) !== 0) pre = pre.slice(0, -1); });
        this.input.value = pre;
        this.print('<span class="t-mut">Did you mean: </span>' + hits.map((h) => '<span class="t-link" data-term="' + esc(h) + '">' + esc(h) + '</span>').join('<span class="t-mut"> · </span>'));
      }
    }

    /* ---------- Output ---------- */
    print(html, cls) {
      const el = document.createElement('div');
      el.className = 'term__line is-in' + (cls ? ' ' + cls : '');
      el.innerHTML = html === '' ? ' ' : html;
      this.lines.appendChild(el);
      this.scroll();
      return el;
    }
    echo(cmd) { this.print('<span class="term__row">' + PROMPT + '<span class="t-b">' + esc(cmd) + '</span></span>', 'term__echo'); }
    heading(text) { return '<span class="t-head">' + esc(text) + '</span>'; }
    /** Two-column row: label | value (value wraps under itself). */
    kv(label, value) { return '<div class="t-kv"><span class="t-k">' + label + '</span><span class="t-v">' + value + '</span></div>'; }
    /** Bulleted line with a hanging indent. */
    bullet(html) { return '<div class="t-bul"><span class="t-dot">•</span><span>' + html + '</span></div>'; }
    /** Indented block (paragraphs, sub-lines). */
    block(html) { return '<div class="t-blk">' + html + '</div>'; }
    scroll() { this.out.scrollTop = this.out.scrollHeight; }
    async printLines(list, delay) {
      for (const l of list) { this.print(l); await sleep(delay === undefined ? 18 : delay); }
    }

    /** Type a command into the prompt, then run it (used by the quick-question buttons). */
    async typeAndRun(cmd) {
      if (this.busy) return;
      this.busy = true;
      this.input.value = '';
      for (const ch of cmd) { this.input.value += ch; await sleep(26); }
      await sleep(100);
      this.busy = false;
      this.submit();
      if (!HOS.isMobile()) this.input.focus({ preventScroll: true });
    }

    async intro() {
      await this.printLines([
        this.heading('Welcome to Hannah\'s portfolio console'),
        '<span class="t-mut">Ask about her projects, skills or experience. No technical knowledge needed.</span>',
        '',
        '<span class="t-mut">Pick a quick question, or type a command below and press Enter.</span>',
        '<span class="t-mut">Good places to start:</span> <span class="t-link" data-term="about">about</span><span class="t-mut"> · </span><span class="t-link" data-term="projects">projects</span><span class="t-mut"> · </span><span class="t-link" data-term="help">help</span>'
      ], 60);
    }

    submit() {
      if (this.busy) return;
      const raw = this.input.value.trim();
      this.input.value = '';
      this.run(raw);
    }

    /* ---------- Commands ---------- */
    async run(raw) {
      this.echo(raw);
      if (!raw) return;
      if (this.history[this.history.length - 1] !== raw) this.history.push(raw);
      this.hIndex = this.history.length;
      const parts = raw.split(/\s+/);
      let c = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');
      c = ALIAS[c] || c;

      switch (c) {
        case 'help':
          for (const g of GROUPS) {
            this.print(this.heading(g[0]));
            await this.printLines(g[1].map((x) => {
              const cmd = x[0].replace('<name>', 'skills').replace('<number>', '1');
              return this.kv('<span class="t-link" data-term="' + esc(cmd) + '">' + esc(x[0]) + '</span>', '<span class="t-desc">' + esc(x[1]) + '</span>');
            }), 10);
            this.print('');
          }
          this.print('<span class="t-mut">Tip: click any command to run it. Press Tab to complete, ↑ / ↓ for history.</span>');
          break;

        case 'about':
          await this.printLines([
            this.heading(P.name),
            '<span class="t-acc">' + esc(P.title) + '</span>',
            '<span class="t-mut">' + esc(P.location) + ' · ' + esc(P.status) + '</span>',
            '',
            esc(P.about),
            '',
            '<span class="t-mut">Next:</span> <span class="t-link" data-term="projects">projects</span><span class="t-mut"> · </span><span class="t-link" data-term="skills">skills</span><span class="t-mut"> · </span><span class="t-link" data-term="contact">contact</span>'
          ]);
          break;

        case 'summary': {
          const sw = D.projects.filter((p) => p.cat === 'software').length;
          const rows = [
            ['Name', P.name],
            ['Role', P.role],
            ['Education', D.school.degree + ', ' + D.school.short],
            ['Experience', '4 years as a READS Working Scholar'],
            ['Focus', 'Embedded systems · Software · QA'],
            ['Projects', D.projects.length + ' built (' + sw + ' software, ' + (D.projects.length - sw) + ' embedded)'],
            ['Skills', D.skills.length + ' across ' + D.skillCategories.length + ' areas'],
            ['Location', P.location + ' (UTC+8)'],
            ['Status', P.status]
          ];
          this.print(this.heading('Profile at a glance'));
          await this.printLines(rows.map((r) => this.kv(esc(r[0]), r[0] === 'Status' ? '<span class="t-ok">' + esc(r[1]) + '</span>' : esc(r[1]))), 25);
          break;
        }

        case 'projects':
          this.print(this.heading(D.projects.length + ' projects') + ' <span class="t-mut">· click a name to open it</span>');
          await this.printLines(D.projects.map((p, i) =>
            '<div class="t-proj">' +
              '<span class="t-num">' + String(i + 1).padStart(2, '0') + '</span>' +
              '<span class="t-tag ' + (p.cat === 'software' ? 't-tag--sw' : 't-tag--hw') + '">' + (p.cat === 'software' ? 'Software' : 'Embedded') + '</span>' +
              '<span class="t-pbody"><span class="t-link" data-term="open ' + (i + 1) + '">' + esc(p.title) + '</span>' +
              '<span class="t-pdesc">' + esc(p.pitch) + '</span></span>' +
            '</div>'), 26);
          break;

        case 'skills':
          this.print(this.heading(D.skills.length + ' skills in ' + D.skillCategories.length + ' areas'));
          for (const cat of D.skillCategories) {
            const items = D.skills.filter((s) => s.cat === cat.id).map((s) => esc(s.name)).join('<span class="t-mut"> · </span>');
            this.print(this.kv(esc(cat.name), items));
            await sleep(30);
          }
          this.print('<span class="t-mut">See them visually:</span> <span class="t-link" data-term="open skills">open skills</span>');
          break;

        case 'experience':
          this.print(this.heading('Experience'));
          for (const j of D.experience) {
            await this.printLines([
              this.block('<span class="t-b">' + esc(j.role) + '</span>' + (j.period ? ' <span class="t-mut">· ' + esc(j.period) + '</span>' : '') +
                '<br><span class="t-mut">' + esc(j.org) + '</span>')
            ].concat(j.points.slice(0, 4).map((p) => this.bullet(esc(p)))).concat(['']), 16);
          }
          this.print('<span class="t-mut">Full details:</span> <span class="t-link" data-term="open experience">open experience</span>');
          break;

        case 'education': {
          const S = D.school;
          await this.printLines([
            this.heading('Education'),
            this.kv('Degree', '<span class="t-b">' + esc(S.degree) + '</span>'),
            this.kv('School', esc(S.name)),
            this.kv('Years', esc(S.years) + ' <span class="t-mut">· ' + esc(S.city) + '</span>'),
            this.kv('Senior High', 'With High Honors · Academic Scholar'),
            '',
            '<span class="t-mut">More:</span> <span class="t-link" data-term="open education">open education</span>'
          ]);
          break;
        }

        case 'research': {
          const R = D.research;
          await this.printLines([
            this.heading('Research · ' + R.status + ' ' + R.year),
            this.block('<span class="t-b">' + esc(R.title) + '</span><br><span class="t-mut">' + esc(R.kind) + '</span>'),
            ''
          ].concat(R.abstract.map((x) => this.block(esc(x), 't-para'))).concat(['', this.kv('Keywords', R.keywords.map(esc).join('<span class="t-mut"> · </span>'))]), 18);
          break;
        }

        case 'contact':
          await this.printLines([
            this.heading('Contact'),
            this.kv('Email', '<a class="t-link" href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a>'),
            this.kv('School email', '<a class="t-link" href="mailto:' + esc(P.schoolEmail) + '">' + esc(P.schoolEmail) + '</a>'),
            this.kv('Location', esc(P.location) + ' <span class="t-mut">(UTC+8)</span>'),
            D.links.linkedin ? this.kv('LinkedIn', '<a class="t-link" href="' + esc(D.links.linkedin) + '" target="_blank" rel="noopener">' + esc(D.links.linkedin.replace(/^https?:\/\/(www\.)?/, '')) + '</a>') : '',
            D.links.github ? this.kv('GitHub', '<a class="t-link" href="' + esc(D.links.github) + '" target="_blank" rel="noopener">' + esc(D.links.github.replace(/^https?:\/\/(www\.)?/, '')) + '</a>') : '',
            '',
            '<span class="t-mut">Send a message:</span> <span class="t-link" data-term="open contact">open contact</span>'
          ].filter((l, i, a) => l !== '' || a[i - 1] !== ''));
          break;

        case 'resume':
          this.print('Opening the résumé… <span class="t-mut">or</span> <a class="t-link" href="' + esc(D.links.resume) + '" download>download the PDF</a>');
          await sleep(250);
          HOS.openResume();
          break;

        case 'open': {
          const n = parseInt(arg, 10), key = arg.toLowerCase();
          if (n >= 1 && n <= D.projects.length) {
            this.print('Opening <span class="t-b">' + esc(D.projects[n - 1].title) + '</span>…');
            HOS.openProject(D.projects[n - 1].id);
          } else if (APPS[key]) {
            this.print('Going to <span class="t-b">' + esc(arg) + '</span>…');
            await sleep(200);
            APPS[key]();
          } else {
            this.print('<span class="t-err">Couldn’t find “' + esc(arg || '…') + '”.</span> <span class="t-mut">Try</span> <span class="t-link" data-term="open projects">open projects</span><span class="t-mut">, </span><span class="t-link" data-term="open skills">open skills</span> <span class="t-mut">or</span> <span class="t-link" data-term="open 1">open 1</span>');
          }
          break;
        }

        case 'theme':
          if (arg === 'light' || arg === 'dark') HOS.applyTheme(arg, true); else HOS.toggleTheme();
          this.print('Theme set to <span class="t-b">' + document.documentElement.dataset.theme + '</span>.');
          break;

        case 'date':
          this.print(new Intl.DateTimeFormat('en-US', { timeZone: P.timezone, dateStyle: 'full', timeStyle: 'short' }).format(new Date()) + ' <span class="t-mut">· Cebu City</span>');
          break;

        case 'clear':
          this.lines.innerHTML = '';
          break;

        case 'hire':
          await this.hire();
          break;

        case 'hello': case 'hi': case 'hey':
          this.print('Hello, and thanks for visiting. Try <span class="t-link" data-term="about">about</span> or <span class="t-link" data-term="projects">projects</span>.');
          break;

        default:
          this.print('<span class="t-err">“' + esc(parts[0]) + '” isn’t a command.</span> <span class="t-mut">Type</span> <span class="t-link" data-term="help">help</span> <span class="t-mut">to see everything you can ask.</span>');
      }
    }

    /** A short, professional "hiring checklist" (replaces the old sudo joke). */
    async hire() {
      this.busy = true;
      this.print(this.heading('Hiring checklist'));
      const checks = [
        ['Embedded systems (ESP32, PIC, FPGA, PCB)', 'Yes'],
        ['Software (web, desktop, mobile)', 'Yes'],
        ['QA and validation mindset', 'Yes'],
        ['Reliability (4 years as a working scholar)', 'Yes'],
        ['Client communication', 'Yes'],
        ['Available for opportunities', 'Yes']
      ];
      for (const c of checks) {
        this.print('<div class="t-kv t-kv--check"><span class="t-k">' + esc(c[0]) + '</span><span class="t-v t-ok t-b">' + c[1] + '</span></div>');
        await sleep(140);
      }
      this.print('');
      this.print('<span class="t-b">All checks passed.</span> <span class="t-mut">Next step:</span> <a class="t-link" href="mailto:' + esc(P.email) + '?subject=' + encodeURIComponent('Opportunity for Hannah') + '">email Hannah</a><span class="t-mut"> · </span><a class="t-link" href="' + esc(D.links.resume) + '" download>download résumé</a>');
      this.busy = false;
    }
  }

  HOS.Terminal = Terminal;
})();
