/* ==========================================================================
   HannahOS — Icon system
   One consistent 24×24 line-icon set (1.75 stroke, round caps) for the UI,
   plus custom glyphs for skills that have no official logo.
   ========================================================================== */

(function () {
  const P = {
    /* ---- UI ---- */
    user:      '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    folder:    '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6l2 2h7.4A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/>',
    cpu:       '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5"/>',
    log:       '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4M9 9h1.5"/>',
    pdf:       '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5"/>',
    terminal:  '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m7.5 9.5 3 2.5-3 2.5M13 15h4"/>',
    mail:      '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
    trash:     '<path d="M4 7h16M10 11v6M14 11v6M6 7l.9 12.1A2 2 0 0 0 8.9 21h6.2a2 2 0 0 0 2-1.9L18 7M9 7V4.5h6V7"/>',
    search:    '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun:       '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    moon:      '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    minimize:  '<path d="M6 12h12"/>',
    maximize:  '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    restore:   '<rect x="5" y="9" width="10" height="10" rx="2"/><path d="M9 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>',
    close:     '<path d="M7 7l10 10M17 7 7 17"/>',
    back:      '<path d="m15 18-6-6 6-6"/>',
    next:      '<path d="m9 18 6-6-6-6"/>',
    arrow:     '<path d="M5 12h14M13 6l6 6-6 6"/>',
    external:  '<path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
    download:  '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    copy:      '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    check:     '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    pin:       '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5.5A2.5 2.5 0 0 1 11 3h2a2.5 2.5 0 0 1 2.5 2.5V7M3 13h18"/>',
    cap:       '<path d="M2 9.5 12 5l10 4.5L12 14z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5M22 9.5V15"/>',
    award:     '<circle cx="12" cy="9" r="6"/><path d="m8.6 14-1.4 7 4.8-2.8 4.8 2.8-1.4-7"/>',
    sparkles:  '<path d="M11 3.5 12.8 9 18 11l-5.2 2L11 18.5 9.2 13 4 11l5.2-2z"/><path d="M19 3v4M17 5h4"/>',
    refresh:   '<path d="M20 11a8 8 0 0 0-14.6-4.5M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5M20 20v-4h-4"/>',
    image:     '<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    info:      '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.2"/>',
    power:     '<path d="M12 3v8M6.6 6.6a8 8 0 1 0 10.8 0"/>',
    lock:      '<rect x="5" y="10" width="14" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    send:      '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    play:      '<path d="M7 5v14l12-7z"/>',
    filter:    '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
    wifi:      '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r=".6"/>',
    battery:   '<rect x="2.5" y="7" width="17" height="10" rx="2.5"/><path d="M22 10.5v3"/><rect x="5" y="9.5" width="10" height="5" rx="1" fill="currentColor" stroke="none"/>',
    signal:    '<rect x="3" y="15" width="3" height="5" rx="1" fill="currentColor" stroke="none"/><rect x="8" y="11.5" width="3" height="8.5" rx="1" fill="currentColor" stroke="none"/><rect x="13" y="8" width="3" height="12" rx="1" fill="currentColor" stroke="none"/><rect x="18" y="4.5" width="3" height="15.5" rx="1" fill="currentColor" stroke="none"/>',
    sliders:   '<rect x="3" y="4" width="8" height="8" rx="4"/><rect x="13" y="12" width="8" height="8" rx="4"/><path d="M14 8h7M3 16h7"/>',
    upload:    '<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',
    scan:      '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M8 8v8M11 8v8M14 8v8M17 8v8"/>',
    chart:     '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3"/>',
    truck:     '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H14v11H3zM14 9h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>',
    grid4:     '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    keyboard:  '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    github:    '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    facebook:  '<path d="M14.5 8H17V4.5h-2.5A3.5 3.5 0 0 0 11 8v2.5H8.5V14H11v6.5h3.5V14H17l.5-3.5h-3V8.5a.5.5 0 0 1 .5-.5z"/>',
    linkedin:  '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V16M8 7.8v.2M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3"/>',
    file:      '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    zip:       '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M10 4v2M10 8v2M10 12v2M9 16h2v2H9z"/>',
    dot:       '<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',

    /* ---- Categories & project glyphs ---- */
    code:      '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5.5l-3 13"/>',
    layout:    '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M9 9v11"/>',
    database:  '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    chip:      '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5M10 10h4v4h-4z"/>',
    phone:     '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    wrench:    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
    shield:    '<path d="M12 3 5 6v5.5c0 4.4 3 7.9 7 9.5 4-1.6 7-5.1 7-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    message:   '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    clock:     '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    zoom:      '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4M8.5 11h5M11 8.5v5"/>',
    layers:    '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12.5 9 5 9-5M3 16.5l9 5 9-5"/>',
    bug:       '<rect x="8" y="7" width="8" height="13" rx="4"/><path d="M12 7V4M9.5 4.5 10.5 7M14.5 4.5 13.5 7M4 12.5h4M16 12.5h4M5 19l3-2M19 19l-3-2M5 7l3 2M19 7l-3 2M12 11v9"/>',
    checkCircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8L16.3 9"/>',
    box:       '<path d="m12 2.8 8.5 4.7v9L12 21.2l-8.5-4.7v-9z"/><path d="m3.5 7.5 8.5 4.8 8.5-4.8M12 12.3v8.9"/>',
    map:       '<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    home:      '<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>',
    palette:   '<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><circle cx="12" cy="16" r="3"/>',
    bot:       '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4.5M9 13h.01M15 13h.01M9.5 16.5h5M2 12.5v3M22 12.5v3"/><circle cx="12" cy="3.8" r="1"/>',
    grid:      '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3zM10 8.5h4M8.5 10v4M15.5 10v4M10 15.5h4"/>',
    music:     '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v9M11 5v9M15 5v9M5.5 5v6h3V5M13.5 5v6h3V5"/>',

    /* ---- Custom skill glyphs (no official logo) ---- */
    chipC:     '<rect x="5" y="5" width="14" height="14" rx="2.5"/><path d="M9 2.5V5M15 2.5V5M9 19v2.5M15 19v2.5M2.5 9H5M2.5 15H5M19 9h2.5M19 15h2.5M14.2 10a2.6 2.6 0 1 0 0 4"/>',
    gate:      '<path d="M7 5.5h4.5a6.5 6.5 0 0 1 0 13H7z"/><path d="M2.5 9H7M2.5 15H7M18 12h3.5"/>',
    xaml:      '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M10 12l-2 2 2 2M14 12l2 2-2 2"/>',
    dip:       '<rect x="7" y="3" width="10" height="18" rx="1.5"/><path d="M4 6.5h3M4 10h3M4 13.5h3M4 17h3M17 6.5h3M17 10h3M17 13.5h3M17 17h3"/><path d="M10.5 3a1.5 1.5 0 0 0 3 0"/>',
    fpga:      '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3zM10 8.5h4M8.5 10v4M15.5 10v4M10 15.5h4"/>',
    pcb:       '<rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="8" cy="8" r="1.6"/><circle cx="16" cy="8" r="1.6"/><circle cx="16" cy="16" r="1.6"/><circle cx="8" cy="16" r="1.6"/><path d="M9.6 8h4.8M8 9.6V12l2.5 2.5h4M16 9.6v4.8"/>',
    mplab:     '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 8.5h18"/><rect x="9.5" y="11" width="5" height="5.5" rx="1"/><path d="M7.5 12.5h2M7.5 15h2M14.5 12.5h2M14.5 15h2"/>'
  };

  /** Inline SVG icon. `cls` adds classes; icons inherit currentColor. */
  function icon(name, cls) {
    const body = P[name] || P.dot;
    return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + '</svg>';
  }

  /** Logo for a skill: official SVG <img> or custom accent glyph. */
  function logo(skill, opts) {
    opts = opts || {};
    const size = opts.size || 48;
    if (skill.logo) {
      return '<img class="logo-img" src="assets/icons/brands/' + skill.logo + '.svg" alt="" width="' + size +
        '" height="' + size + '" loading="lazy" decoding="async">';
    }
    return '<span class="logo-glyph" style="width:' + size + 'px;height:' + size + 'px">' + icon(skill.glyph) + '</span>';
  }

  const HOS = (window.HOS = window.HOS || {});
  HOS.icon = icon;
  HOS.logo = logo;
})();
