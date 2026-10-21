/* ==========================================================================
   HannahOS — Terminal
   Commands · typing animation · ↑/↓ history · Tab autocomplete · easter eggs
   ========================================================================== */

(function () {
  const HOS = window.HOS;
  const D = window.HOS_DATA;
  const { esc } = HOS;
  const P = D.profile;

  const PROMPT = '<span class="term__prompt">hannah@hannahos<i>:~$</i></span>';
  const sleep = (ms) => new Promise((r) => setTimeout(r, HOS.reduced() ? 0 : ms));

  const COMMANDS = {
    help: 'List every command',
    whoami: 'Who is Hannah?',
    neofetch: 'System info banner',
    skills: 'Languages, frameworks and tools',
    projects: 'All 9 projects',
    experience: 'Work history',
    research: 'My approved undergraduate thesis',
    contact: 'How to reach me',
    resume: 'Open and download my résumé',
    'sudo hire-hannah': 'Try it ;)',
    open: 'open <section | project #>  e.g. open 1',
    ls: 'List sections and files',
    cat: 'cat <file>  e.g. cat bugs_i_fixed.txt',
    theme: 'Toggle light / dark mode',
    hr: 'Open the 1-page résumé',
    date: 'Current time in Cebu City',
    clear: 'Clear the screen',
    exit: 'Try to leave'
  };
  /* "open <name>": scroll to a section or open a sheet */
  const go = (id) => () => HOS.goto(id);
  const APPS = { overview: go('overview'), about: go('overview'), projects: go('projects'), skills: go('skills'), experience: go('experience'), research: go('research'), contact: go('contact'), resume: () => HOS.openResume(), bugs: () => HOS.openBugs() };
  const CHIPS = ['help', 'whoami', 'projects', 'skills', 'contact', 'sudo hire-hannah'];

  class Terminal {
    constructor(body) {
      this.body = body;
      this.history = [];
      this.hIndex = 0;
      this.busy = false;
      const uid = 'ti-' + Math.random().toString(36).slice(2, 7);
      body.innerHTML =
        '<div class="term">' +
          '<div class="term__out" role="log" aria-live="polite" aria-label="Terminal output">' +
            '<div class="term__lines"></div>' +
            '<form class="term__input-row" autocomplete="off">' +
              '<label class="term__prompt" for="' + uid + '">hannah@hannahos<i>:~$</i></label>' +
              '<input class="term__input" id="' + uid + '" type="text" spellcheck="false" autocapitalize="off" autocorrect="off" enterkeyhint="send" aria-describedby="' + uid + '-h">' +
              '<span class="sr-only" id="' + uid + '-h">Type a command and press Enter. Type help for the list. Tab completes, arrow keys browse history.</span>' +
            '</form>' +
          '</div>' +
          '<div class="term__chips" role="group" aria-label="Suggested commands">' +
            CHIPS.map((c) => '<button class="term__chip" type="button" data-cmd="' + c + '">' + c + '</button>').join('') +
          '</div>' +
        '</div>';
      this.out = body.querySelector('.term__out');
      this.lines = body.querySelector('.term__lines');
      this.input = body.querySelector('.term__input');
      this.focusEl = this.input;
      this.bind();
      this.intro();
    }

    bind() {
      const form = this.body.querySelector('form');
      form.addEventListener('submit', (e) => { e.preventDefault(); this.submit(); });
      this.input.addEventListener('keydown', (e) => this.keys(e));
      this.out.addEventListener('click', (e) => {
        const link = e.target.closest('[data-term]');
        if (link) { this.typeAndRun(link.dataset.term); return; }
        if (!window.getSelection().toString()) this.input.focus();
      });
      this.body.querySelector('.term__chips').addEventListener('click', (e) => {
        const c = e.target.closest('[data-cmd]');
        if (c) this.typeAndRun(c.dataset.cmd);
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
        e.stopPropagation();          // Esc clears the line instead of closing the window
        if (this.input.value) this.input.value = '';
        else this.input.blur();
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault(); this.lines.innerHTML = '';
      }
    }

    /** Tab completion over commands, app names, files and project numbers. */
    complete() {
      const v = this.input.value.replace(/^\s+/, '');
      const pool = Object.keys(COMMANDS)
        .concat(Object.keys(APPS).map((a) => 'open ' + a))
        .concat(['cat bugs_i_fixed.txt', 'theme light', 'theme dark']);
      const hits = pool.filter((c) => c.indexOf(v) === 0 && c !== v);
      if (hits.length === 1) this.input.value = hits[0];
      else if (hits.length > 1) {
        // fill the common prefix, then list options
        let pre = hits[0];
        hits.forEach((h) => { while (h.indexOf(pre) !== 0) pre = pre.slice(0, -1); });
        this.input.value = pre;
        this.echo(v);
        this.print('<span class="t-mut">' + hits.map(esc).join('    ') + '</span>');
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
    echo(cmd) { this.print('<span class="term__row">' + PROMPT + '<span class="t-b">' + esc(cmd) + '</span></span>'); }
    scroll() { this.out.scrollTop = this.out.scrollHeight; }
    /** Print lines one after another for a typed-out feel. */
    async printLines(list, delay) {
      for (const l of list) { this.print(l); await sleep(delay === undefined ? 22 : delay); }
    }

    /** Type a command into the prompt character by character, then run it. */
    async typeAndRun(cmd) {
      if (this.busy) return;
      this.busy = true;
      this.input.value = '';
      for (const ch of cmd) { this.input.value += ch; await sleep(32); }
      await sleep(120);
      this.busy = false;
      this.submit();
      if (!HOS.isMobile()) this.input.focus({ preventScroll: true });
    }

    async intro() {
      this.busy = true;
      await sleep(250);
      for (const ch of 'neofetch') { this.input.value += ch; await sleep(45); }
      await sleep(150);
      this.input.value = '';
      this.busy = false;
      await this.run('neofetch', true);
      this.print('');
      this.print('<span class="t-mut">Type</span> <span class="t-acc">help</span> <span class="t-mut">to see commands, or tap a suggestion below.</span>');
    }

    submit() {
      if (this.busy) return;
      const raw = this.input.value.trim();
      this.input.value = '';
      this.run(raw);
    }

    /* ---------- Commands ---------- */
    async run(raw, silentEcho) {
      if (!silentEcho || raw) this.echo(raw);
      if (!raw) return;
      if (this.history[this.history.length - 1] !== raw) this.history.push(raw);
      this.hIndex = this.history.length;
      const [cmd, ...rest] = raw.split(/\s+/);
      const arg = rest.join(' ');
      const c = cmd.toLowerCase();

      switch (c) {
        case 'help': {
          const w = Math.max.apply(null, Object.keys(COMMANDS).map((k) => k.length)) + 3;
          await this.printLines(['<span class="t-b">Available commands</span>'].concat(Object.keys(COMMANDS).map((k) =>
            '  <span class="t-link" data-term="' + (k === 'open' ? 'open 1' : k === 'cat' ? 'cat bugs_i_fixed.txt' : k) + '">' + esc(k) + '</span>' +
            ' '.repeat(w - k.length) + '<span class="t-mut">' + esc(COMMANDS[k]) + '</span>')), 12);
          break;
        }
        case 'whoami':
          await this.printLines([
            '<span class="t-b">' + esc(P.name) + '</span>',
            '<span class="t-acc">' + esc(P.title) + '</span>',
            '<span class="t-mut">' + esc(P.location) + '</span>',
            '',
            esc(P.about),
            '',
            '<span class="t-vio">“' + esc(P.tagline) + '”</span>'
          ]);
          break;
        case 'neofetch':
          this.neofetch();
          break;
        case 'skills':
          for (const cat of D.skillCategories) {
            const items = D.skills.filter((s) => s.cat === cat.id).map((s) =>
              '<span class="t-skill">' + (s.logo
                ? '<img class="t-logo' + (s.dark ? ' is-dark' : '') + '" src="assets/icons/brands/' + s.logo + '.svg" alt="">'
                : '<span class="t-acc">◆ </span>') + esc(s.name) + '</span>').join('');
            this.print('<span class="t-vio">' + esc(cat.name.padEnd(20)) + '</span>');
            this.print('  ' + items);
            await sleep(40);
          }
          this.print('<span class="t-mut">Tip: open skills  → logos you can click to filter projects</span>');
          break;
        case 'projects':
          await this.printLines(['<span class="t-b">9 projects</span> <span class="t-mut">· click a name or type</span> <span class="t-acc">open &lt;#&gt;</span>']
            .concat(D.projects.map((p, i) =>
              '  <span class="t-mut">' + String(i + 1).padStart(2, '0') + '</span>  ' +
              '<span class="' + (p.cat === 'software' ? 't-acc' : 't-vio') + '">[' + (p.cat === 'software' ? 'SW' : 'HW') + ']</span> ' +
              '<span class="t-link" data-term="open ' + (i + 1) + '">' + esc(p.title) + '</span>' +
              '\n      <span class="t-mut">' + esc(p.pitch) + '</span>')), 30);
          break;
        case 'experience':
          for (const j of D.experience) {
            await this.printLines([
              '<span class="' + (j.status === 'ACTIVE' ? 't-ok' : 't-vio') + '">[' + j.status + ']</span> <span class="t-b">' + esc(j.role) + '</span> ' + (j.period ? '<span class="t-mut">· ' + esc(j.period) + '</span>' : ''),
              '        <span class="t-mut">' + esc(j.org) + '</span>'
            ].concat(j.points.map((p) => '        › ' + esc(p))).concat(['']), 18);
          }
          break;
        case 'research': {
          const R = D.research;
          await this.printLines([
            '<span class="t-ok">[' + esc(R.status.toUpperCase()) + ']</span> <span class="t-b">' + esc(R.title) + '</span>',
            '        <span class="t-mut">' + esc(R.kind) + ' · ' + esc(R.year) + '</span>'
          ].concat(R.headline.map((h) => '        › <span class="t-acc">' + esc(h[0]) + '</span> ' + esc(h[1])))
            .concat(['', '<span class="t-mut">Tip: open research  → interactive findings</span>']), 18);
          break;
        }
        case 'contact':
          await this.printLines([
            '<span class="t-b">Let\'s talk.</span>',
            '  email    <a class="t-link" href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a>',
            '  school   <a class="t-link" href="mailto:' + esc(P.schoolEmail) + '">' + esc(P.schoolEmail) + '</a>',
            '  where    ' + esc(P.location) + ' <span class="t-mut">(UTC+8)</span>',
            D.links.github ? '  github   <a class="t-link" href="' + esc(D.links.github) + '" target="_blank" rel="noopener">' + esc(D.links.github) + '</a>' : '  github   <span class="t-mut">coming soon</span>',
            D.links.linkedin ? '  linkedin <a class="t-link" href="' + esc(D.links.linkedin) + '" target="_blank" rel="noopener">' + esc(D.links.linkedin) + '</a>' : '  linkedin <span class="t-mut">coming soon</span>',
            D.links.facebook ? '  facebook <a class="t-link" href="' + esc(D.links.facebook) + '" target="_blank" rel="noopener">' + esc(D.links.facebook) + '</a>' : '',
            '<span class="t-mut">Taking you to Contact…</span>'
          ]);
          await sleep(300);
          HOS.goto('contact');
          break;
        case 'resume':
          this.print('<span class="t-ok">✓</span> Opening Résumé.pdf…  <a class="t-link" href="' + esc(D.links.resume) + '" download>download PDF</a>');
          await sleep(300);
          HOS.openResume();
          break;
        case 'open': {
          const n = parseInt(arg, 10);
          if (n >= 1 && n <= D.projects.length) {
            this.print('<span class="t-ok">✓</span> Opening ' + esc(D.projects[n - 1].title) + '…');
            HOS.openProject(D.projects[n - 1].id);
          } else if (APPS[arg.toLowerCase()]) {
            this.print('<span class="t-ok">✓</span> Opening ' + esc(arg) + '…');
            APPS[arg.toLowerCase()]();
          } else this.print('<span class="t-err">open: unknown target “' + esc(arg) + '”.</span> <span class="t-mut">Try: open 1 · open projects · open contact</span>');
          break;
        }
        case 'ls':
          this.print(['overview/', 'projects/', 'skills/', 'experience/', 'contact/', 'resume.pdf', 'bugs_i_fixed.txt']
            .map((f) => '<span class="' + (f.endsWith('/') ? 't-vio' : 't-acc') + '">' + f + '</span>').join('   '));
          break;
        case 'cat':
          if (/bugs/.test(arg)) {
            await this.printLines(D.bugs.map((b) =>
              '<span class="' + (b[0] === 'FIXED' ? 't-ok' : b[0] === 'OPEN' ? 't-err' : 't-warn') + '">' + b[0].padEnd(8) + '</span>' +
              '<span class="t-mut">' + b[1] + '</span>  ' + esc(b[2])), 40);
          } else if (/excuses/.test(arg)) this.print('<span class="t-mut">(empty) No excuses. Only fixes.</span>');
          else this.print('<span class="t-err">cat: ' + esc(arg || '<file>') + ': No such file.</span> <span class="t-mut">Try: cat bugs_i_fixed.txt</span>');
          break;
        case 'theme':
          if (arg === 'light' || arg === 'dark') HOS.applyTheme(arg); else HOS.toggleTheme();
          this.print('<span class="t-ok">✓</span> Theme set to ' + document.documentElement.dataset.theme + '.');
          break;
        case 'hr':
          this.print('<span class="t-ok">✓</span> Opening the 1-page résumé…');
          await sleep(300);
          HOS.openResume();
          break;
        case 'date':
          this.print(new Intl.DateTimeFormat('en-US', { timeZone: P.timezone, dateStyle: 'full', timeStyle: 'short' }).format(new Date()) + ' <span class="t-mut">(Cebu City)</span>');
          break;
        case 'echo':
          this.print(esc(arg));
          break;
        case 'clear':
          this.lines.innerHTML = '';
          break;
        case 'exit':
          this.print('<span class="t-mut">Nice try. This terminal lives on the page. Type</span> <span class="t-link" data-term="contact">contact</span> <span class="t-mut">instead.</span>');
          break;
        case 'sudo':
          if (/^hire[-\s]?hannah$/i.test(arg)) await this.hire();
          else this.print('<span class="t-err">hannah is not in the sudoers file for “' + esc(arg) + '”.</span> <span class="t-mut">Only </span><span class="t-link" data-term="sudo hire-hannah">sudo hire-hannah</span><span class="t-mut"> is allowed.</span>');
          break;
        case 'rm':
          this.print('<span class="t-err">Permission denied.</span> <span class="t-mut">Bugs go in the Recycle Bin, not the projects.</span>');
          break;
        case 'hello': case 'hi':
          this.print('Hi there! 👋 Try <span class="t-link" data-term="whoami">whoami</span>.');
          break;
        default:
          this.print('<span class="t-err">command not found: ' + esc(cmd) + '</span>  <span class="t-mut">Type</span> <span class="t-link" data-term="help">help</span>');
      }
    }

    neofetch() {
      const art = [
        '    ┃ ┃ ┃ ┃ ┃',
        '  ┏━┻━┻━┻━┻━┻━┓',
        ' ━┫           ┣━',
        ' ━┫  ██  ██   ┣━',
        ' ━┫  ██████   ┣━',
        ' ━┫  ██  ██   ┣━',
        ' ━┫           ┣━',
        '  ┗━┳━┳━┳━┳━┳━┛',
        '    ┃ ┃ ┃ ┃ ┃'
      ].join('\n');
      const sw = D.projects.filter((p) => p.cat === 'software').length;
      const rows = [
        ['OS', 'HannahOS 2026.10 (Computer Engineering)'],
        ['Host', 'University of San Jose–Recoletos'],
        ['Location', 'Cebu City, PH (UTC+8)'],
        ['Uptime', '4+ years as a working student'],
        ['Focus', 'Embedded · Software · QA'],
        ['Projects', D.projects.length + ' built (' + sw + ' software, ' + (D.projects.length - sw) + ' embedded)'],
        ['Stack', 'C · C# · TypeScript · React · .NET MAUI · ESP32 · VHDL'],
        ['Status', '<span class="t-ok">● Available for opportunities</span>']
      ];
      const info =
        '<span class="t-acc t-b">hannah</span><span class="t-mut">@</span><span class="t-vio t-b">hannahos</span>\n' +
        '<span class="t-mut">────────────────────────</span>\n' +
        rows.map((r) => '<span class="t-acc">' + r[0].padEnd(10) + '</span>' + (r[0] === 'Status' ? r[1] : esc(r[1]))).join('\n') +
        '<div class="neo__swatches">' + ['#2ee6d6', '#9d8cff', '#3ddc97', '#fbbf24', '#ff7a8a', '#60a5fa', '#e8eef7'].map((c) => '<span style="background:' + c + '"></span>').join('') + '</div>';
      this.print('<div class="neo"><pre class="neo__art" aria-hidden="true">' + art + '</pre><div class="neo__info">' + info + '</div></div>');
    }

    async hire() {
      this.busy = true;
      const pw = this.print('[sudo] password for recruiter: ');
      for (let i = 0; i < 8; i++) { pw.innerHTML += '•'; await sleep(55); }
      await sleep(200);
      await this.printLines([
        '<span class="t-ok">✓ Access granted.</span> Excellent decision.',
        '<span class="t-mut">Running pre-hire checks…</span>'
      ], 200);
      const checks = [
        ['Embedded systems (ESP32, PIC, FPGA)', 'PASS'],
        ['Software (web, desktop, mobile)', 'PASS'],
        ['QA mindset', 'PASS'],
        ['Reliability (4+ yrs working student)', 'PASS'],
        ['Communication', 'PASS']
      ];
      for (const c of checks) {
        this.print('  <span class="t-ok">✓</span> ' + esc(c[0].padEnd(40, '.')) + ' <span class="t-ok">' + c[1] + '</span>');
        await sleep(170);
      }
      const bar = this.print('Deploying Hannah to your team  <span class="term__bar"><span></span></span> <span class="t-acc pct">0%</span>');
      const fill = bar.querySelector('.term__bar span'), pct = bar.querySelector('.pct');
      requestAnimationFrame(() => { fill.style.width = '100%'; });
      for (let p = 0; p <= 100; p += 10) { pct.textContent = p + '%'; await sleep(130); }
      this.print('');
      this.print('<span class="t-ok t-b">🎉 Hire request compiled with 0 errors and 0 warnings.</span>');
      this.print('Next step: <a class="t-link" href="mailto:' + esc(P.email) + '?subject=' + encodeURIComponent("Let's talk, Hannah") + '">' + esc(P.email) + '</a>');
      this.print('  → <span class="t-link" data-term="contact">open Contact.mail</span>   → <a class="t-link" href="' + esc(D.links.resume) + '" download>download résumé</a>');
      this.busy = false;
      this.confetti();
    }

    confetti() {
      if (HOS.reduced()) return;
      const host = this.body.querySelector('.term');
      host.style.position = 'relative';
      const colors = ['#2ee6d6', '#9d8cff', '#3ddc97', '#fbbf24', '#ff7a8a'];
      for (let i = 0; i < 46; i++) {
        const s = document.createElement('i');
        const size = 5 + Math.random() * 5;
        s.style.cssText = 'position:absolute;left:50%;top:60%;width:' + size + 'px;height:' + size * 0.45 + 'px;border-radius:1px;pointer-events:none;background:' + colors[i % 5];
        host.appendChild(s);
        const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 220;
        s.animate([
          { transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 },
          { transform: 'translate(' + Math.cos(a) * v + 'px,' + (Math.sin(a) * v - 120) + 'px) rotate(' + (Math.random() * 720) + 'deg)', opacity: 0 }
        ], { duration: 1100 + Math.random() * 600, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => s.remove();
      }
    }
  }

  HOS.Terminal = Terminal;
})();
