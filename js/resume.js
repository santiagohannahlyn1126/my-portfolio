/* ==========================================================================
   HannahOS — Résumé renderer
   One template, two uses: the résumé preview sheet ("paper") and print/PDF.
   ========================================================================== */

(function () {
  const HOS = window.HOS;
  const D = window.HOS_DATA;
  const { esc } = HOS;
  const P = D.profile;
  const L = D.links;

  /** Tech tag with its logo badge. */
  function techTag(id) {
    const s = HOS.skillById(id);
    if (!s) return '';
    return '<span class="tag' + (s.dark ? ' is-dark' : '') + '">' + HOS.logo(s, { size: 15 }) + esc(s.name) + '</span>';
  }
  const plainTag = (t) => '<span class="tag tag--plain">' + esc(t) + '</span>';

  function linkItem(icon, label, href) {
    return '<li>' + HOS.icon(icon) + (href ? '<a href="' + esc(href) + '"' + (/^http/.test(href) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(label) + '</a>' : '<span>' + esc(label) + '</span>') + '</li>';
  }

  function resumeHTML(opts) {
    opts = opts || {};
    const paper = opts.variant === 'paper';
    const H = paper ? 'h3' : 'h2';

    const contact = [
      linkItem('pin', P.location),
      linkItem('mail', P.email, 'mailto:' + P.email),
      linkItem('cap', P.schoolEmail, 'mailto:' + P.schoolEmail),
      L.github ? linkItem('github', L.github.replace(/^https?:\/\/(www\.)?/, ''), L.github) : '',
      L.linkedin ? linkItem('linkedin', L.linkedin.replace(/^https?:\/\/(www\.)?/, ''), L.linkedin) : ''
    ].join('');

    const jobs = D.experience.map((j) =>
      '<article class="cv__job">' +
        '<div class="cv__job-top"><h4>' + esc(j.role) + '</h4>' + (j.period ? '<span class="cv__job-period">' + esc(j.period) + '</span>' : '') + '</div>' +
        '<p class="cv__job-org">' + esc(j.org) + '</p>' +
        '<ul>' + (j.cv || j.points).map((p) => '<li>' + esc(p) + '</li>').join('') + '</ul>' +
      '</article>').join('');

    const projGroup = (cat, label, icon) =>
      '<div class="cv__proj-group">' +
        '<p class="cv__proj-label">' + HOS.icon(icon) + label + '</p>' +
        '<div class="cv__projs">' +
          D.projects.filter((p) => p.cat === cat).map((p) =>
            '<article class="cv__proj">' +
              '<h5>' + esc(p.title) + '</h5>' +
              '<p>' + esc(p.pitch) + '</p>' +
              '<ul>' + p.points.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
              '<div class="cv__proj-tech">' + p.tech.filter((t) => HOS.skillById(t) && HOS.skillById(t).cat !== 'qa').map(techTag).join('') + p.tags.map(plainTag).join('') + '</div>' +
            '</article>').join('') +
        '</div>' +
      '</div>';

    const skills = D.skillCategories.map((c) =>
      '<div class="cv__skillcat"><h5>' + esc(c.name) + '</h5><div class="cv__skilllist">' +
        D.skills.filter((s) => s.cat === c.id).map((s) => techTag(s.id)).join('') +
      '</div></div>').join('');

    const edu = D.education.map((e) =>
      '<div class="cv__edu"><b>' + esc(e.title) + '</b><span>' + esc(e.org) + '</span><small>' + esc(e.note) + '</small></div>').join('');

    const why = D.why.map((w) =>
      '<div class="why__item">' + HOS.icon(w.icon) + '<b>' + esc(w.title) + '</b><p>' + esc(w.text) + '</p></div>').join('');

    return '' +
      '<div class="cv">' +
        '<header class="cv__head">' +
          '<img class="cv__photo" src="' + esc(P.photo) + '" alt="Portrait of ' + esc(P.name) + '" width="120" height="120">' +
          '<div>' +
            '<' + H + ' class="cv__name"' + (paper ? '' : ' id="hr-title" tabindex="-1"') + '>' + esc(P.name) + '</' + H + '>' +
            '<p class="cv__title">' + esc(P.title) + '</p>' +
            '<p class="cv__tagline">' + esc(P.tagline) + '</p>' +
            '<ul class="cv__contact">' + contact + '</ul>' +
          '</div>' +
        '</header>' +
        '<dl class="cv__stats">' + HOS.statsHTML() + '</dl>' +
        '<div class="cv__grid">' +
          '<div>' +
            '<section class="cv__sec cv__sec--sum"><h3 class="cv__h">Summary</h3><p class="cv__summary">' + esc(P.about) + '</p><div class="cv__why">' + why + '</div></section>' +
            '<section class="cv__sec cv__sec--exp"><h3 class="cv__h">Experience</h3>' + jobs + '</section>' +
            '<section class="cv__sec cv__sec--proj"><h3 class="cv__h">Projects</h3>' +
              projGroup('software', 'Software · 4 projects', 'code') +
              projGroup('embedded', 'Hardware & Embedded · 5 projects', 'chip') +
            '</section>' +
          '</div>' +
          '<aside>' +
            '<section class="cv__sec cv__sec--skills"><h3 class="cv__h">Skills</h3>' + skills + '</section>' +
            '<section class="cv__sec cv__sec--edu"><h3 class="cv__h">Education & Honors</h3>' + edu + '</section>' +
          '</aside>' +
        '</div>' +
        '<section class="cv__cta">' +
          '<h3>Need someone who builds, wires and tests?</h3>' +
          '<p>Open to opportunities in embedded systems, software and QA. I reply fastest by email.</p>' +
          '<div class="cv__cta-actions">' +
            '<a class="btn btn--primary" href="mailto:' + esc(P.email) + '?subject=' + encodeURIComponent('Opportunity for Hannah') + '">' + HOS.icon('mail') + 'Email Hannah</a>' +
            '<button class="btn btn--soft" type="button" data-copy="' + esc(P.email) + '">' + HOS.icon('copy') + 'Copy email</button>' +
            '<a class="btn btn--ghost" href="' + esc(L.resume) + '" download>' + HOS.icon('download') + 'Download PDF</a>' +
          '</div>' +
        '</section>' +
      '</div>';
  }

  HOS.resumeHTML = resumeHTML;
  HOS.techTag = techTag;
  HOS.plainTag = plainTag;
})();
