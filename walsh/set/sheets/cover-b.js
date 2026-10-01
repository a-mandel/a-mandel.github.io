/* cover-b crew sheets (9/30/26): A0.5 Axonometrics and A9.1 Perspectives.
   Stills are rendered from the pocket model (walsh/index.html) by sheets/tools/cover-b/render_stills.py: ink on a clear
   ground, so the sheet's paper shows through. The cameras below match that script exactly; hand notes find their points
   by projecting model coordinates through the same cameras, so a re-render keeps every leader on its mark. */
(function () {
  const IMG = 'sheets/assets/cover-b/';
  const CSS = '<style>.cb-still .note{white-space:pre}.cb-still .dimg{pointer-events:none}.cb-key .kp svg{width:100%;height:100%;overflow:visible}' +
    /* phone: the field scrolls as one column, so these views join the flow under the header */
    '@media screen and (max-width:760px),screen and (max-aspect-ratio:1/1) and (max-width:1100px){.fhtml:has(.cb-still){position:relative;inset:auto}.dv.cb-still{margin-bottom:66px}.cb-still .note{white-space:pre;font-size:13px}.cb-key{margin-top:-20px}}</style>';
  const V = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };

  /* model anchors (DATA.A and the site, model feet: x east, y up from 5990, z south) */
  const P = {
    tip: [36.94, 33.0, 10.72],        // the ribbon's lifted corner, 6023.0
    tree: [-14.59, 30.0, 24.67],      // the signature tree, up its trunk
    beam: [17.04, 22.0, -7.24],       // north wing beam, dead level at 6012
    entry: [4.0, 15.5, 22.0]
  };

  /* A0.5: parallel projection, as render_stills.py draws it */
  const AXO = { el: 0.56, half: 47.0, t: [-17.0, 11.5, 30.0], w: 14.2, h: 6.9 };
  function axoXY(yaw, p) {
    const r = [Math.cos(yaw), 0, -Math.sin(yaw)];
    const u = [-Math.sin(AXO.el) * Math.sin(yaw), Math.cos(AXO.el), -Math.sin(AXO.el) * Math.cos(yaw)];
    const d = V(p, AXO.t), asp = AXO.w / AXO.h;
    return [0.5 + dot(d, r) / (2 * AXO.half * asp), 0.5 - dot(d, u) / (2 * AXO.half)];
  }
  /* A9.1: the model's eye level camera on its wide lens (64 degrees vertical at full width) */
  const FOV = 64;
  function persXY(cam, w, h, p) {
    const f = nrm(V(cam.at, cam.eye)), r = nrm(cross(f, [0, 1, 0])), u = cross(r, f);
    const d = V(p, cam.eye), z = dot(d, f), tv = Math.tan(FOV / 2 * Math.PI / 180);
    return [0.5 + dot(d, r) / (z * tv * (w / h)) / 2, 0.5 - dot(d, u) / (z * tv) / 2];
  }
  const inside = q => q[0] > 0.04 && q[0] < 0.96 && q[1] > 0.06 && q[1] < 0.94;

  /* a note on a view: p is the point (fractions of the view), dx dy the text offset in sheet inches */
  function note(ctx, text, p, dx, dy, w, h, d) {
    const t = [p[0] + dx / w, p[1] + dy / h];
    return ctx.noteHTML({ text, t, p, a: dx < 0 ? 'r' : 'l' }, w, h, d);
  }
  function still(ctx, src, alt, x, y, w, h, inner) {
    return `<div class="view dv cb-still" style="left:${ctx.U(x)};top:${ctx.U(y)};width:${ctx.U(w)};height:${ctx.U(h)};--ar:${(w / h).toFixed(4)}">
      <img class="dimg" src="${IMG}${src}" alt="${ctx.esc(alt)}" style="width:100%;height:100%" decoding="async">${inner}</div>`;
  }

  /* ------------------------------------------------------------ A0.5 Axonometrics */
  const AXONS = [
    { src: 'axo-sw.webp', t: 'Axon from the southwest', yaw: -Math.PI / 4, n: { text: 'the signature tree,\nthe house wraps it', at: P.tree, dx: -2.2, dy: -1.1 } },
    { src: 'axo-se.webp', t: 'Axon from the southeast', yaw: Math.PI / 4, n: { text: 'the tip lifts\nto the court', at: P.tip, dx: 1.2, dy: -1.1 } },
    { src: 'axo-nw.webp', t: 'Axon from the northwest', yaw: -3 * Math.PI / 4, n: { text: 'every roof under 30 ft', at: P.tip, dx: -0.5, dy: -0.9 } },
    { src: 'axo-ne.webp', t: 'Axon from the northeast', yaw: 3 * Math.PI / 4, n: { text: 'beam dead level at 6012', at: P.beam, dx: 2.2, dy: 1.6 } }
  ];
  const AXPOS = [[0.65, 3.3], [15.95, 3.3], [0.65, 11.6], [15.95, 11.6]];

  LIVING_SHEETS.push({
    id: 'A0.5', group: 'General', title: 'Axonometrics', short: 'Axonometrics', foot: 'Axonometrics',
    scale: 'Not to scale', issued: [4],
    cap: 'The ribbon on its ground from the four corners. One gesture on every roof, the court tree held in the middle.',
    data: ['Ribbon scheme on the FA grade', 'Tip 6023.0, about 29.4 ft over grade', 'Every roof under 30 ft', 'Cut from the pocket model, 10/1/26'],
    html: ctx => CSS + AXONS.map((a, i) => {
      const [x, y] = AXPOS[i], q = axoXY(a.yaw, a.n.at);
      const nt = inside(q) ? note(ctx, a.n.text, q, a.n.dx, a.n.dy, AXO.w, AXO.h, 400 + i * 420) : '';
      return still(ctx, a.src, a.t, x, y, AXO.w, AXO.h, nt + ctx.viewTitle(i + 1, a.t, 'Parallel projection · not to scale'));
    }).join('')
  });

  /* ------------------------------------------------------------ A9.1 Perspectives */
  const CAMS = [
    { src: 'pers-arrival.webp?v=261001', t: 'Arrival from the west', s: 'Eye level · saved view Entry', eye: [-45, 14.2, 33], at: [4, 15.5, 22], x: 0.65, y: 3.3, w: 19.34, h: 15.2,
      notes: [{ text: 'the signature tree, kept', at: P.tree, dx: -2.6, dy: -1.6 }] },
    { src: 'pers-dining.webp?v=261001', t: 'Bridge and dining, into the court', s: 'Eye level · saved view Dining', eye: [13.4, 13.1, 37.5], at: [-14.6, 16.5, 22.5], x: 21.37, y: 3.3, w: 8.78, h: 6.9,
      notes: [{ text: 'dining in the middle\nof the bridge', fx: [0.84, 0.83], dx: -4.9, dy: 0.1 }] },
    { src: 'pers-tip.webp?v=261001', t: 'Living room tip', s: 'Eye level · from the east grade', eye: [60, 8.0, 26], at: [33, 21, 8], x: 21.37, y: 11.6, w: 8.78, h: 6.9,
      notes: [{ text: 'raked glass only\nat the tip', fx: [0.5, 0.45], dx: -1.6, dy: -1.5 }] }
  ];
  /* where each camera stands, on a key plan: the level plans' footprint (from draw/drawings.js) without its section cuts */
  function keyPlan(ctx, x, y, w) {
    const src = (ctx.DRW.keys && ctx.DRW.keys.sections) || '';
    if (!src) return '';
    let svg = src.replace(/<path[^>]*stroke="#c07a2c"[^>]*\/>/g, '').replace(/viewBox="[^"]*"/, 'viewBox="-82 -26 150 112"');
    const cams = CAMS.map((c, i) => {
      const a = Math.atan2(c.at[2] - c.eye[2], c.at[0] - c.eye[0]), hf = Math.atan(Math.tan(FOV / 2 * Math.PI / 180) * c.w / c.h), L = 15;
      const p1 = [c.eye[0] + Math.cos(a - hf) * L, c.eye[2] + Math.sin(a - hf) * L], p2 = [c.eye[0] + Math.cos(a + hf) * L, c.eye[2] + Math.sin(a + hf) * L];
      const lx = c.eye[0] - Math.cos(a) * 5.2, lz = c.eye[2] - Math.sin(a) * 5.2;
      return `<path d="M${p1[0].toFixed(2)} ${p1[1].toFixed(2)} L${c.eye[0]} ${c.eye[2]} L${p2[0].toFixed(2)} ${p2[1].toFixed(2)}" fill="rgba(192,122,44,.12)" stroke="#c07a2c" stroke-width="0.9" vector-effect="non-scaling-stroke"/>
        <circle cx="${c.eye[0]}" cy="${c.eye[2]}" r="1.3" fill="#c07a2c"/>
        <circle cx="${lx.toFixed(2)}" cy="${lz.toFixed(2)}" r="3.1" fill="#f6f5f1" stroke="#1b1a18" stroke-width="0.7" vector-effect="non-scaling-stroke"/>
        <text x="${lx.toFixed(2)}" y="${(lz + 1.35).toFixed(2)}" text-anchor="middle" font-size="3.8" font-family="Tenor Sans, sans-serif" fill="#1b1a18">${i + 1}</text>`;
    }).join('');
    svg = svg.replace('</svg>', cams + '</svg>');
    const h = w * 112 / 150;
    return `<div class="dkey cb-key" style="left:${ctx.U(x)};top:${ctx.U(y)};width:${ctx.U(w)}"><div class="kp" style="height:${ctx.U(h)}">${svg}</div><span class="kc"><b>Key plan</b><i>Where each view stands · not to scale</i></span></div>`;
  }

  LIVING_SHEETS.push({
    id: 'A9.1', group: 'Architectural', title: 'Perspectives', short: 'Perspectives', foot: 'Perspectives',
    scale: 'None', issued: [2, 4],
    cap: 'Standing in it: the arrival from the west, dining on the bridge looking into the court, and the living room tip.',
    data: ['Eye level, about 5 ft 3 in over the floor', 'The model\'s wide lens, 64 degree view', 'Clear glass, warm interiors', 'Cut from the pocket model, 10/1/26'],
    html: ctx => CSS + CAMS.map((c, i) => {
      let d = 400 + i * 480;
      const nt = c.notes.map(n => {
        const q = n.fx || persXY(c, c.w, c.h, n.at);
        return inside(q) ? note(ctx, n.text, q, n.dx, n.dy, c.w, c.h, (d += 520)) : '';
      }).join('');
      return still(ctx, c.src, c.t, c.x, c.y, c.w, c.h, nt + ctx.viewTitle(i + 1, c.t, c.s));
    }).join('') + keyPlan(ctx, 14.3, 13.75, 5.2)
  });
})();
