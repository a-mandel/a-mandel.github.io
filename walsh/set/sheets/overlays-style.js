/* overlays-style crew (9/30/26): the drafting layer over the stills of A0.9 Renderings, A9.1 Perspectives and A0.5 Axonometrics.
   The render stays the hero; this layer lets it dissolve into drafting, after André's reference boards: datum runs rising off the
   true peaks, dimension strings floating in the sky, construction lines running long, grid bubbles on the ground, a few burnt
   orange dots, one column of tiny technical type and one small inset per sheet.
   Registration: every mark is a model point (window.SHARED: levels, dims, grids, heights) projected through the same camera the
   still was rendered with. A0.9 uses cover-a's render.py cameras and frames (tools/cover-a, raw pass json), A9.1 and A0.5 use
   cover-b's cameras exactly as cover-b.js projects its notes. tools/overlays-style/probe.py prints the same projections in Python. */
(function () {
  const DATUM = 5990.0, RAD = Math.PI / 180;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
  const r3 = v => +v.toFixed(3);

  /* ------------------------------------------------------------ cameras: model point [x, y, z] to view fractions */
  // A0.9: cover-a render.py JOBS (eye, look, level) and the frame each render pass reported (l, r, t, b on the image plane)
  const CA_CAM = {
    arrival: { eye: [-150, 17.5, 74], look: [-10, 17, 22], level: true, fr: [-0.5773502691896257, 0.5773502691896257, 0.2674094202199276, -0.2741053150199973] },
    court: { eye: [104, 9, 70], look: [14, 16, 20], level: true, fr: [-0.6494075931975106, 0.6494075931975106, 0.3847217689231323, -0.22437776676556737] },
    tip: { eye: [114, 6.5, 36], look: [30, 20, 4], level: true, fr: [-0.4663076581549986, 0.4663076581549986, 0.41260418334820015, -0.024760240852350263] },
    aerial: { eye: [59, 250, 236], look: [-16, 6, 20], level: false, fr: [-0.33459531950207316, 0.33459531950207316, 0.15691366707683432, -0.15691366707683432] }
  };
  function caProj(c) {
    const E = c.eye, T = c.look.slice(); if (c.level) T[1] = E[1];
    const z = nrm(sub(E, T)), x = nrm([z[2], 0, -z[0]]), y = cross(z, x), [l, r, t, b] = c.fr;
    return p => { const d = sub(p, E), zc = dot(d, z); if (zc >= 0) return null; const u = dot(d, x) / -zc, v = dot(d, y) / -zc; return [(u - l) / (r - l), (t - v) / (t - b)]; };
  }
  // A9.1: the model's eye level camera on its wide lens, 64 degrees vertical (cover-b.js persXY)
  function pbProj(eye, at, w, h) {
    const f = nrm(sub(at, eye)), r = nrm(cross(f, [0, 1, 0])), u = cross(r, f), tv = Math.tan(32 * RAD);
    return p => { const d = sub(p, eye), z = dot(d, f); if (z <= 0.5) return null; return [0.5 + dot(d, r) / (z * tv * (w / h)) / 2, 0.5 - dot(d, u) / (z * tv) / 2]; };
  }
  // A0.5: parallel projection (cover-b.js axoXY)
  function axProj(yaw, w, h) {
    const el = 0.56, half = 47.0, t = [-17.0, 11.5, 30.0];
    const r = [Math.cos(yaw), 0, -Math.sin(yaw)], u = [-Math.sin(el) * Math.sin(yaw), Math.cos(el), -Math.sin(el) * Math.cos(yaw)];
    return p => { const d = sub(p, t); return [0.5 + dot(d, r) / (2 * half * (w / h)), 0.5 - dot(d, u) / (2 * half)]; };
  }

  /* ------------------------------------------------------------ shared data */
  const SH = () => window.SHARED || {};
  const LV = id => ((SH().levels || []).find(l => l.id === id) || {}).el;
  const HT = id => ((SH().heights || {}).points || []).find(p => p.id === id) || {};
  const GRID = (g, id) => { const G = ((SH().grids || {}).grids || []).find(x => x.id === g); return G ? G.num.concat(G.let).find(l => l.id === id) : null; };
  const DIM = id => (SH().dims || []).find(d => d.id === id);
  const REF = id => (((SH().grids || {}).refs) || []).find(r => r.id === id);
  const TIP = () => { const h = HT('tip'); return { x: (h.at || [36.94])[0], z: (h.at || [0, 10.72])[1], el: h.el || 6023.0, grade: h.grade || 5993.63, over: h.over || 29.37, margin: h.margin || 0.63 }; };
  const f1 = v => (Math.round(v * 10) / 10).toFixed(1);
  const ft = v => (window.SHARED && SHARED.ftin) ? SHARED.ftin(v) : f1(v) + ' ft';

  /* ------------------------------------------------------------ the pen: one per still, geometry in view inches */
  function pen(ctx, w, h, P) {
    const o = { w, h, svg: '', html: '' };
    o.q = (x, el, z) => { const f = P([x, el - DATUM, z]); return f ? [f[0] * w, f[1] * h] : null; };
    const X = v => +v.toFixed(4), pc = (v, s) => +(v / s * 100).toFixed(3);
    o.path = (d, c) => { o.svg += `<path class="${c || ''}" d="${d}"/>`; };
    o.line = (a, b, c) => { if (a && b) o.path(`M${X(a[0])} ${X(a[1])} L${X(b[0])} ${X(b[1])}`, c); };
    o.lab = (p, inner, c, st) => { if (p) o.html += `<span class="${c}" style="left:${pc(p[0], w)}%;top:${pc(p[1], h)}%;${st || ''}">${inner}</span>`; };
    o.dot = (p, r, c) => { if (p) o.svg += `<circle class="${c || 'od'}" cx="${X(p[0])}" cy="${X(p[1])}" r="${r || 0.045}"/>`; };
    o.ring = (p, r, c) => { if (p) o.svg += `<circle class="${c || 'or'}" cx="${X(p[0])}" cy="${X(p[1])}" r="${r}"/>`; };
    o.esc = ctx.esc;
    return o;
  }
  const along = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const ext = (a, b, e) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [b[0] + (b[0] - a[0]) / L * e, b[1] + (b[1] - a[1]) / L * e]; };

  /* a datum run: the true vertical through (x, z), grade up past the peak, ticks at the levels (side 1 labels right, -1 left) */
  function run(o, x, z, el0, el1, ticks, opt) {
    opt = opt || {};
    const a = o.q(x, el0, z), b = o.q(x, el1, z); if (!a || !b) return;
    const top = ext(a, b, opt.over == null ? 0.7 : opt.over), bot = ext(b, a, opt.under == null ? 0.15 : opt.under);
    o.line(bot, top, 'run');
    ticks.forEach(t => {
      const p = o.q(x, t.el, z); if (!p) return;
      const s = t.side || opt.side || 1, L = t.acc ? 0.2 : 0.11;
      o.line([p[0] - L, p[1]], [p[0] + L, p[1]], t.acc ? 'acc' : 'tk');
      if (t.acc) o.dot(p, 0.05);
      if (t.lab != null) o.lab([p[0] + s * 0.16, p[1] + (t.dy || 0)], `<b>${o.esc(t.lab)}</b><i>${o.esc(t.val || '')}</i>`, `os-t ${s > 0 ? 'l' : 'r'}${t.acc ? ' acc' : ''}`);
    });
  }
  /* a dimension string floating at elevation el through plan points pts [[x, z]...], with ticks, short extension legs and labels */
  function dimString(o, pts, el, texts, opt) {
    opt = opt || {};
    const Q = pts.map(p => o.q(p[0], el, p[1])); if (Q.some(q => !q)) return;
    const n = Q.length - 1, over = opt.over == null ? 0.5 : opt.over;
    o.line(ext(Q[1], Q[0], over), ext(Q[n - 1], Q[n], over), 'dm');
    if (opt.far) o.line(ext(Q[n - 1], Q[n], over), ext(Q[n - 1], Q[n], opt.far), 'far');
    Q.forEach((q, i) => {
      const lo = o.q(pts[i][0], el - (opt.leg || 3.5), pts[i][1]), hi = o.q(pts[i][0], el + 1.2, pts[i][1]);
      o.line(lo, hi, 'lg');
      if (opt.bubbles && opt.bubbles[i]) {   // the grid's bubble, floating over its leg
        const top = o.q(pts[i][0], el + (opt.bub || 4), pts[i][1]);
        if (top) { o.line(hi, ext(q, top, -0.115), 'lg'); o.html += `<span class="os-b" style="left:${+(top[0] / o.w * 100).toFixed(3)}%;top:${+(top[1] / o.h * 100).toFixed(3)}%">${o.esc(opt.bubbles[i])}</span>`; }
      }
      // the architect's tick: a short slash at 45 degrees to the string
      const a = Q[Math.max(0, i - 1)], b = Q[Math.min(n, i + 1)], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, c = Math.SQRT1_2, k = 0.075;
      const sx = ux * c - uy * c, sy = ux * c + uy * c;
      o.line([q[0] - sx * k, q[1] - sy * k], [q[0] + sx * k, q[1] + sy * k], (opt.accEnds && (i === 0 || i === n)) ? 'acc' : 'tk');
    });
    for (let i = 0; i < n; i++) {
      const t = texts[i]; if (!t) continue;
      const a = Q[i], b = Q[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L < (opt.min || 0.55)) continue;
      let ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / RAD; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
      o.lab(along(a, b, 0.5), o.esc(t), 'os-d', `transform:translate(-50%,-50%) rotate(${ang.toFixed(2)}deg) translateY(-0.72em)`);
    }
  }
  /* a grid line on the ground at el, run on past its bubble end ('a' or 'b') by feet in the model, so the bubble stands clear of the roofs */
  function gridLine(o, g, el, end, feet) {
    if (!g) return;
    const [m0, m1] = end === 'a' ? [g.b, g.a] : [g.a, g.b], L = Math.hypot(m1[0] - m0[0], m1[1] - m0[1]) || 1, k = (feet == null ? 10 : feet) / L;
    const p0 = o.q(m0[0], el, m0[1]), p1 = o.q(m1[0], el, m1[1]), c = o.q(m1[0] + (m1[0] - m0[0]) * k, el, m1[1] + (m1[1] - m0[1]) * k), r = 0.115;
    if (!p0 || !p1 || !c) return;
    o.line(ext(p1, p0, 0.12), ext(p0, c, -r), 'gl');
    o.html += `<span class="os-b" style="left:${+(c[0] / o.w * 100).toFixed(3)}%;top:${+(c[1] / o.h * 100).toFixed(3)}%">${o.esc(g.id)}</span>`;
  }
  /* one large construction circle, with a tiny orange station on it */
  function bigCircle(o, c, R, ang) {
    if (!c) return;
    o.ring(c, R, 'cc');
    [0, 90, 180, 270].forEach(a => { const x = Math.cos(a * RAD), y = Math.sin(a * RAD); o.line([c[0] + x * (R - 0.08), c[1] + y * (R - 0.08)], [c[0] + x * (R + 0.08), c[1] + y * (R + 0.08)], 'tk'); });
    o.line([c[0] - R - 0.35, c[1]], [c[0] + R + 0.35, c[1]], 'far');
    o.ring([c[0] + Math.cos(ang * RAD) * R, c[1] + Math.sin(ang * RAD) * R], 0.05, 'orr');
  }
  /* a view's overlay box: field inches, svg in view inches */
  function box(ctx, x, y, o, id) {
    return `<div class="os-v"${id ? ` data-os="${id}"` : ''} style="left:${ctx.U(x)};top:${ctx.U(y)};width:${ctx.U(o.w)};height:${ctx.U(o.h)}">
      <svg class="os-s" viewBox="0 0 ${o.w} ${o.h}" preserveAspectRatio="none" aria-hidden="true">${o.svg}</svg>${o.html}</div>`;
  }
  /* the tip, marked for the registration crop: a hidden hook, the dot itself is in the svg */
  const tipHook = (o, t) => { const p = o.q(t.x, t.el, t.z); if (p) o.html += `<i class="os-hook" style="left:${+(p[0] / o.w * 100).toFixed(3)}%;top:${+(p[1] / o.h * 100).toFixed(3)}%"></i>`; };

  /* ------------------------------------------------------------ the tiny type column and the insets */
  function typeCol(ctx, x, y, w, title, rows) {
    return `<div class="os-col" style="left:${ctx.U(x)};top:${ctx.U(y)};width:${ctx.U(w)}"><h4>${ctx.esc(title)}</h4>${rows.map(r =>
      r === '' ? '<hr>' : `<p${r[2] ? ' class="acc"' : ''}><span>${ctx.esc(r[0])}</span><i>${ctx.esc(r[1])}</i></p>`).join('')}</div>`;
  }
  function footprint(ctx, vb) {
    const src = (ctx.DRW && ctx.DRW.keys && ctx.DRW.keys.sections) || '';
    if (!src) return null;
    return src.replace(/<path[^>]*stroke="#c07a2c"[^>]*\/>/g, '').replace(/ksec-/g, 'osk-').replace(/viewBox="[^"]*"/, `viewBox="${vb.join(' ')}"`).replace(/class="dsvg"/, 'class="os-kp"');
  }
  function inset(ctx, x, y, w, h, svg, cap, sub) {
    return `<div class="os-in" style="left:${ctx.U(x)};top:${ctx.U(y)};width:${ctx.U(w)}"><div class="os-inb" style="height:${ctx.U(h)}">${svg}</div><span class="os-ic"><b>${ctx.esc(cap)}</b><i>${ctx.esc(sub)}</i></span></div>`;
  }
  // plan inset marks, model feet on the key plan's own viewBox
  const kBub = (x, z, t, r) => `<circle cx="${r3(x)}" cy="${r3(z)}" r="${r || 3}" fill="#f6f3ec" stroke="#1b1a18" stroke-width="0.7" vector-effect="non-scaling-stroke"/><text x="${r3(x)}" y="${r3(z + (r || 3) * 0.42)}" text-anchor="middle" font-size="${((r || 3) * 1.2).toFixed(2)}" font-family="Tenor Sans, sans-serif" fill="#1b1a18">${t}</text>`;
  const kLine = (a, b, c) => `<path d="M${r3(a[0])} ${r3(a[1])} L${r3(b[0])} ${r3(b[1])}" fill="none" stroke="${c || '#1b1a18'}" stroke-opacity="${c ? 1 : 0.45}" stroke-width="${c ? 0.9 : 0.55}" ${c ? '' : 'stroke-dasharray="3 1.6 0.6 1.6"'} vector-effect="non-scaling-stroke"/>`;

  const CSS = `<style>
    .os-v{position:absolute;pointer-events:none}
    .os-s{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
    .os-s path{fill:none;stroke:var(--ink);stroke-linecap:round;vector-effect:non-scaling-stroke}
    .os-s .run{stroke-width:.7px;stroke-opacity:.42}
    .os-s .tk{stroke-width:.9px;stroke-opacity:.6}
    .os-s .acc{stroke:var(--accent);stroke-width:1.3px;stroke-opacity:.95}
    .os-s .dm{stroke-width:.7px;stroke-opacity:.46}
    .os-s .lg{stroke-width:.6px;stroke-opacity:.3}
    .os-s .far{stroke-width:.6px;stroke-opacity:.16}
    .os-s .gl{stroke-width:.6px;stroke-opacity:.26;stroke-dasharray:7 3 1.5 3}
    .os-s .cb{stroke-width:.7px;stroke-opacity:.34}
    .os-s .od{fill:var(--accent)}
    .os-s .or{fill:none;stroke:var(--accent);stroke-width:.9px;vector-effect:non-scaling-stroke}
    .os-s .orr{fill:none;stroke:var(--accent);stroke-width:1px;vector-effect:non-scaling-stroke}
    .os-s .cc{fill:none;stroke:var(--ink);stroke-opacity:.17;stroke-width:.6px;vector-effect:non-scaling-stroke}
    .os-t{position:absolute;display:flex;align-items:baseline;gap:.4em;white-space:nowrap;line-height:1;transform:translate(0,-50%)}
    .os-t.r{transform:translate(-100%,-50%);flex-direction:row-reverse}
    .os-t b{font:400 max(calc(6.5px * var(--fl)),calc(var(--u) * .085))/1 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
    .os-t i{font:italic 400 max(calc(7.5px * var(--fl)),calc(var(--u) * .105))/1 var(--fs);color:var(--ink);opacity:.8}
    .os-t.acc b{color:var(--accent)}
    .os-d{position:absolute;white-space:nowrap;font:italic 400 max(calc(8.5px * var(--fl)),calc(var(--u) * .135))/1 var(--fs);color:var(--ink);opacity:.72;transform-origin:50% 50%}
    .os-b{position:absolute;width:max(calc(12px * var(--fl)),calc(var(--u) * .23));height:max(calc(12px * var(--fl)),calc(var(--u) * .23));transform:translate(-50%,-50%);border:1px solid rgba(27,26,24,.5);border-radius:50%;
      display:grid;place-items:center;font:400 max(calc(6.5px * var(--fl)),calc(var(--u) * .11))/1 var(--ft);color:var(--ink);background:rgba(246,243,236,.55)}
    .os-hook{position:absolute;width:0;height:0}
    .os-col{position:absolute;pointer-events:none;color:var(--ink)}
    .os-col h4{margin:0 0 .45em;font:400 max(calc(6.5px * var(--fl)),calc(var(--u) * .09))/1.2 var(--ft);letter-spacing:.2em;text-transform:uppercase;color:var(--ink);display:flex;align-items:center;gap:.6em}
    .os-col h4::before{content:'';flex:none;width:max(calc(5px * var(--fl)),calc(var(--u) * .08));height:max(calc(5px * var(--fl)),calc(var(--u) * .08));border-radius:50%;background:var(--accent)}
    .os-col p{margin:0;display:flex;justify-content:space-between;gap:1em;align-items:baseline;line-height:1.28}
    .os-col p span{font:400 max(calc(5.5px * var(--fl)),calc(var(--u) * .075))/1.28 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
    .os-col p i{font:italic 400 max(calc(7px * var(--fl)),calc(var(--u) * .1))/1.28 var(--fs);white-space:nowrap}
    .os-col p.acc i{color:var(--accent)}
    .os-col hr{border:0;height:1px;margin:.35em 0;background:linear-gradient(90deg,rgba(27,26,24,.28),rgba(27,26,24,0))}
    .os-in{position:absolute;pointer-events:none}
    .os-inb{position:relative}
    .os-inb svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
    .os-ic{display:flex;flex-direction:column;margin-top:calc(var(--u) * .08);line-height:1.2}
    .os-ic b{font:400 max(calc(6.5px * var(--fl)),calc(var(--u) * .09))/1.2 var(--ft);letter-spacing:.18em;text-transform:uppercase}
    .os-ic i{font:italic 400 max(calc(7px * var(--fl)),calc(var(--u) * .1))/1.2 var(--fs);color:var(--muted)}
    @media screen and (max-width:760px), screen and (max-aspect-ratio:1/1) and (max-width:1100px){ .os-v,.os-col,.os-in{display:none} }
  </style>`;

  const LEVELS = () => [
    { el: LV('main_ff') || 5997.5, lab: 'Main FF', val: f1(LV('main_ff') || 5997.5) },
    { el: LV('primary_ff') || 6004.0, lab: 'L2 FF', val: f1(LV('primary_ff') || 6004.0) },
    { el: LV('fold_beam') || 6012.0, lab: 'Fold beam', val: f1(LV('fold_beam') || 6012.0) }
  ];
  const bFeet = ext0 => { const a = GRID('north', 'A'), b = GRID('north', 'B'); return a && b ? b.a[0] - a.a[0] + ext0 : ext0; };
  const NORTH = () => ['1', '2', '3', '4', '5', '7', '9', '11'].map(k => GRID('north', k)).filter(Boolean);
  const nSpacing = () => { const G = ((SH().grids || {}).grids || []).find(g => g.id === 'north'); return G ? G.num_spacing.filter(s => !s.overall).map(s => s.text) : []; };

  /* ================================================================ A0.9 Renderings */
  const A09 = [
    { k: 'arrival', x: 1.9, y: 3.75 }, { k: 'court', x: 16.9, y: 3.75 }, { k: 'tip', x: 1.9, y: 11.7 }, { k: 'aerial', x: 16.9, y: 11.7 }
  ];
  function a09(ctx) {
    const W = 14.5, H = 6.8, T = TIP(), out = [];
    A09.forEach(v => {
      const o = pen(ctx, W, H, caProj(CA_CAM[v.k]));
      const N = NORTH(), zA = (GRID('north', 'A') || { at: -14.56 }).at, zB = (GRID('north', 'B') || { at: 7.94 }).at;
      if (v.k === 'arrival') {
        // the north wing's grid chain, floating over the roofs along the north wall
        const pts = N.map(g => [g.at, zA]);
        dimString(o, pts.slice(2), 6027, nSpacing().slice(2), { over: 0.55, far: 2.2, min: 0.6 });
        const ov = DIM('overall_ew');
        if (ov) dimString(o, [[ov.e[0][0], zA], [ov.e[1][0], zA]], 6031.5, [`${ov.text} overall`], { over: 0.35, leg: 2.5, accEnds: true });
        tipHook(o, T);
      }
      if (v.k === 'court') {
        run(o, T.x, T.z, T.grade, T.el, LEVELS().map(l => Object.assign({ side: -1 }, l)), { over: 0, under: 0 });
        // court posts at 15 ft, floating over the court glulam
        const pts = ['5', '7', '9', '11'].map(k => [GRID('north', k).at, zB]);
        dimString(o, pts, 6028.5, ['15′ 0″', '15′ 0″', '15′ 0″'], { over: 0.45, far: 3.2 });
        tipHook(o, T);
      }
      if (v.k === 'tip') {
        run(o, T.x, T.z, T.grade, T.el, LEVELS().map(l => Object.assign({ side: -1 }, l)), { over: 0, under: 0 });
        const fb = REF('FB');
        if (fb) { const a = o.q(fb.a[0], fb.el, fb.a[1]), b = o.q(fb.b[0], fb.el, fb.b[1]); o.line(ext(b, a, 1.6), ext(a, b, 3.2), 'far'); }
        bigCircle(o, o.q(T.x, T.el, T.z), 2.35, 208);
        tipHook(o, T);
      }
      if (v.k === 'aerial') {
        const g = LV('main_ff') || 5997.5;
        N.forEach(l => gridLine(o, l, g, 'a', 16));
        gridLine(o, GRID('north', 'A'), g, 'a', 12); gridLine(o, GRID('north', 'B'), g, 'a', bFeet(12));
        run(o, T.x, T.z, T.grade, T.el, [{ el: T.el, lab: 'Tip', val: f1(T.el), acc: true }], { over: 0.55, under: 0.1 });
        tipHook(o, T);
      }
      out.push(box(ctx, ctx.FX(v.x), ctx.FY(v.y), o, v.k));
    });
    return out.join('');
  }
  function a09Key(ctx) {
    const vb = [-92, -34, 146, 124], fp = footprint(ctx, vb); if (!fp) return '';
    const [x0, z0, w, h] = vb, x1 = x0 + w, z1 = z0 + h;
    const marks = A09.map((v, i) => {
      const c = CA_CAM[v.k], e = [c.eye[0], c.eye[2]], t = [c.look[0], c.look[2]];
      // clip the station to the key's frame, then draw the view's cone toward its target
      let s = 1; [[x0 + 5, 0], [x1 - 5, 0], [z0 + 5, 1], [z1 - 5, 1]].forEach(([lim, k]) => {
        const d = t[k] - e[k]; if (Math.abs(d) < 1e-6) return; const u = (lim - e[k]) / d;
        const p = [e[0] + (t[0] - e[0]) * u, e[1] + (t[1] - e[1]) * u];
        if (u > 0 && u < s && p[0] >= x0 + 4.9 && p[0] <= x1 - 4.9 && p[1] >= z0 + 4.9 && p[1] <= z1 - 4.9) s = u;
      });
      const inside = e[0] > x0 && e[0] < x1 && e[1] > z0 && e[1] < z1, st = inside ? e : [e[0] + (t[0] - e[0]) * s, e[1] + (t[1] - e[1]) * s];
      const a = Math.atan2(t[1] - e[1], t[0] - e[0]), hf = Math.atan(-c.fr[0]), L = 17;
      const p1 = [st[0] + Math.cos(a - hf) * L, st[1] + Math.sin(a - hf) * L], p2 = [st[0] + Math.cos(a + hf) * L, st[1] + Math.sin(a + hf) * L];
      return `<path d="M${r3(p1[0])} ${r3(p1[1])} L${r3(st[0])} ${r3(st[1])} L${r3(p2[0])} ${r3(p2[1])}" fill="rgba(192,122,44,.1)" stroke="#c07a2c" stroke-width="0.8" vector-effect="non-scaling-stroke"/>
        <circle cx="${r3(st[0])}" cy="${r3(st[1])}" r="1.4" fill="#c07a2c"/>` + kBub(st[0] - Math.cos(a) * 6, st[1] - Math.sin(a) * 6, i + 1, 3.4);
    }).join('');
    return inset(ctx, 21.2, 0.3, 3.5, 2.95, fp.replace('</svg>', marks + '</svg>'), 'Key plan', 'Where each still stands · not to scale');
  }

  /* ================================================================ A9.1 Perspectives */
  const PB = [
    { k: 'arrival', eye: [-45, 14.2, 33], at: [4, 15.5, 22], x: 0.65, y: 3.3, w: 19.34, h: 15.2 },
    { k: 'dining', eye: [13.4, 13.1, 37.5], at: [-14.6, 16.5, 22.5], x: 21.37, y: 3.3, w: 8.78, h: 6.9 },
    { k: 'tip', eye: [60, 8.0, 26], at: [33, 21, 8], x: 21.37, y: 11.6, w: 8.78, h: 6.9 }
  ];
  function a91(ctx) {
    const T = TIP(), zB = (GRID('north', 'B') || { at: 7.94 }).at;
    return PB.map(v => {
      const o = pen(ctx, v.w, v.h, pbProj(v.eye, v.at, v.w, v.h));
      if (v.k === 'arrival') {
        // court posts 5 to 11, their spacing floating over the court, the grid bubbles standing on the terrace line
        const ks = ['5', '7', '9', '11'], pts = ks.map(k => [GRID('north', k).at, zB]);
        dimString(o, pts, 6027.5, ['15′ 0″', '15′ 0″', '15′ 0″'], { over: 0.7, far: 4.5, leg: 4, bubbles: ks, bub: 5 });
        run(o, T.x, T.z, T.grade, T.el, [{ el: T.el, lab: 'Tip', val: `${f1(T.el)} · ${f1(T.over)} ft over grade`, acc: true },
          { el: T.grade + 30, lab: '30 ft limit', val: f1(T.grade + 30), dy: -0.2 }], { over: 1.1, under: 0.1 });
        tipHook(o, T);
      }
      if (v.k === 'dining') {
        // the bridge post rows, on the floor, under the table
        ['D', 'E'].forEach(k => { const g = GRID('bridge', k); gridLine(o, g, LV('main_ff') || 5997.5, 'a', 2); });
      }
      if (v.k === 'tip') {
        run(o, T.x, T.z, T.grade, T.el, [{ el: T.el, lab: 'Tip', val: f1(T.el), acc: true }].concat(LEVELS().map(l => Object.assign({ side: -1 }, l))), { over: 0.5, under: 0 });
        const d = DIM('north_wing_depth');
        if (d) dimString(o, [[T.x - 1.12, d.e[0][1]], [T.x - 1.12, d.e[1][1]]], 6027.5, [d.text], { over: 0.3, far: 1.2, leg: 3 });
        tipHook(o, T);
      }
      return box(ctx, v.x, v.y, o, v.k);
    }).join('');
  }
  function a91Detail(ctx) {
    // the tip in section: natural grade, the 30 ft line and the lifted corner, one unit a foot, true vertical scale
    const T = TIP(), base = 34.5, E = el => base - (el - T.grade), SC = 44, LX = 47, VX = 83;
    const yG = E(T.grade), y30 = E(T.grade + 30), yT = E(T.el), yM = E(LV('main_ff') || 5997.5), yF = E(LV('fold_beam') || 6012);
    const ln = (d, c, w, op, da) => `<path d="${d}" fill="none" stroke="${c || '#1b1a18'}" stroke-width="${w || 0.6}" stroke-opacity="${op || 1}"${da ? ` stroke-dasharray="${da}"` : ''} vector-effect="non-scaling-stroke"/>`;
    const txt = (x, y, t, k, a) => `<text x="${x}" y="${r3(y)}" font-size="2.3" text-anchor="${a || 'start'}" ${k ? 'font-family="EB Garamond, serif" font-style="italic"' : 'font-family="Tenor Sans, sans-serif" letter-spacing="0.35"'} fill="${k === 'acc' ? '#c07a2c' : '#1b1a18'}" fill-opacity="${k ? 1 : 0.6}">${t}</text>`;
    const row = (y, a, b, k, dy) => ln(`M${SC - 1.2} ${r3(y)} h2.4`, k === 'acc' ? '#c07a2c' : 0, 0.7) + txt(LX, y + (dy || 0.8), a) + txt(VX, y + (dy || 0.8), b, k || 1, 'end');
    const svg = `<svg viewBox="0 0 84 38" preserveAspectRatio="xMidYMid meet">
      ${ln(`M1 ${r3(yG + 0.5)} Q14 ${r3(yG - 0.5)} 28 ${r3(yG + 0.1)} T${SC - 2} ${r3(yG + 0.9)}`, 0, 0.9)}
      ${[5, 9, 13, 17, 21, 25, 29, 33, 37].map(x => ln(`M${x} ${r3(yG + 0.6)} l-1.5 1.7`, 0, 0.5, 0.4)).join('')}
      ${ln(`M3 ${r3(y30)} H${SC + 1.5}`, '#c07a2c', 0.8, 1, '2.2 1.3')}
      <path d="M5 ${r3(yF)} L36 ${r3(yT)} L36 ${r3(yT + 1.3)} L5 ${r3(yF + 1.3)} Z" fill="#c9824a" fill-opacity=".25" stroke="#1b1a18" stroke-width="0.8" vector-effect="non-scaling-stroke"/>
      ${ln(`M5 ${r3(yF + 1.3)} V${r3(yM)} H36 V${r3(yT + 1.3)}`, 0, 0.6, 0.55)}
      ${ln(`M36 ${r3(yT)} H${SC}`, '#c07a2c', 0.6, 0.7, '0.8 0.8')}
      <circle cx="36" cy="${r3(yT)}" r="0.75" fill="#c07a2c"/>
      ${ln(`M${SC} ${r3(yG + 1)} V${r3(y30 - 2.5)}`, 0, 0.6, 0.5)}
      ${row(y30, '30 FT LIMIT', f1(T.grade + 30), 1, -1.1)}${row(yT, 'TIP', f1(T.el), 'acc', 2.6)}
      ${row(yF, 'FOLD BEAM', f1(LV('fold_beam') || 6012))}${row(yM, 'MAIN FF', f1(LV('main_ff') || 5997.5))}${row(yG, 'GRADE', f1(T.grade), 1, 2.6)}
      ${txt(34, y30 - 1.4, f1(T.margin) + ' ft to spare', 'acc', 'end')}
      ${txt(20.5, (yM + yG) / 2 + 0.9, f1(T.over) + ' ft over grade', 1, 'middle')}
    </svg>`;
    return inset(ctx, 19.9, 0.3, 4.9, 2.3, svg, 'Detail at the tip', 'Height over natural grade · true vertical scale');
  }

  /* ================================================================ A0.5 Axonometrics */
  const AX = [
    { k: 'sw', yaw: -Math.PI / 4, x: 0.65, y: 3.3 }, { k: 'se', yaw: Math.PI / 4, x: 15.95, y: 3.3 },
    { k: 'nw', yaw: -3 * Math.PI / 4, x: 0.65, y: 11.6 }, { k: 'ne', yaw: 3 * Math.PI / 4, x: 15.95, y: 11.6 }
  ];
  function a05(ctx) {
    const W = 14.2, H = 6.9, T = TIP(), g0 = LV('main_ff') || 5997.5, zA = (GRID('north', 'A') || { at: -14.56 }).at;
    return AX.map(v => {
      const o = pen(ctx, W, H, axProj(v.yaw, W, H));
      if (v.k === 'sw') {
        NORTH().forEach(l => gridLine(o, l, g0, 'a', 14));
        gridLine(o, GRID('north', 'A'), g0, 'a', 10); gridLine(o, GRID('north', 'B'), g0, 'a', bFeet(10));
        ['4', '6', '10'].forEach(k => gridLine(o, GRID('south', k), g0, 'b', 8));
        tipHook(o, T);
      }
      if (v.k === 'se') {
        run(o, T.x, T.z, T.grade, T.el, [{ el: T.el, lab: 'Tip', val: `${f1(T.el)} · ${f1(T.over)} ft over grade`, acc: true },
          { el: T.grade + 30, lab: '30 ft limit', val: f1(T.grade + 30), dy: -0.2 }, { el: T.grade, lab: 'Natural grade', val: f1(T.grade) }].concat(LEVELS()), { over: 0.9, under: 0.25 });
        tipHook(o, T);
      }
      if (v.k === 'nw') {
        const N = NORTH(), pts = N.map(g => [g.at, zA - 9]);
        dimString(o, pts, g0, nSpacing(), { over: 0.4, leg: 0.01, min: 0.5 });
        const ov = DIM('overall_ew');
        if (ov) dimString(o, [[ov.e[0][0], zA - 15], [ov.e[1][0], zA - 15]], g0, [`${ov.text} overall`], { over: 0.3, leg: 0.01, accEnds: true, far: 2.2 });
        N.forEach(g => { const a = o.q(g.at, g0, zA), b = o.q(g.at, g0, zA - 15.5); o.line(a, b, 'lg'); });
        tipHook(o, T);
      }
      if (v.k === 'ne') {
        const fb = REF('FB');
        if (fb) {
          const a = o.q(fb.a[0], fb.el, fb.a[1]), b = o.q(fb.b[0], fb.el, fb.b[1]);
          o.line(ext(b, a, 2.2), ext(a, b, 2.6), 'far'); o.dot(a, 0.045); o.dot(b, 0.045);
          o.lab(ext(a, b, 2.6), `<b>Fold beam</b><i>${f1(fb.el)} dead level</i>`, 'os-t l');
        }
        bigCircle(o, o.q(T.x, T.el, T.z), 1.9, -35);
        tipHook(o, T);
      }
      return box(ctx, v.x, v.y, o, v.k);
    }).join('');
  }
  function a05Key(ctx) {
    const vb = [-92, -34, 146, 124], fp = footprint(ctx, vb); if (!fp) return '';
    let m = '';
    ((SH().grids || {}).grids || []).forEach(G => G.num.concat(G.let).forEach(l => {
      m += kLine(l.a, l.b);
    }));
    NORTH().forEach(l => { m += kBub(l.a[0], l.a[1] - 5, l.id, 2.6); });
    ['A', 'B', 'C'].forEach(k => { const l = GRID('north', k); if (l) m += kBub(l.a[0] - 5, l.a[1], k, 2.6); });
    // the four axon eyes, looking at the house from the corners (parallel projection: arrows, not cones)
    const C = [-17, 30];
    AX.forEach((v, i) => {
      const d = [Math.sin(v.yaw), Math.cos(v.yaw)], R = 58, p = [C[0] + d[0] * R, C[1] + d[1] * R], q = [C[0] + d[0] * (R - 11), C[1] + d[1] * (R - 11)];
      m += kLine(p, q, '#c07a2c') + `<circle cx="${r3(q[0])}" cy="${r3(q[1])}" r="1.2" fill="#c07a2c"/>` + kBub(p[0] + d[0] * 4.4, p[1] + d[1] * 4.4, i + 1, 3.2);
    });
    return inset(ctx, 21.2, 0.3, 3.5, 2.95, fp.replace('</svg>', m + '</svg>'), 'Grid key', 'Grids from the model, each axon’s eye · not to scale');
  }

  /* ================================================================ the type columns */
  function col09(ctx) {
    const T = TIP(), M = (SH().heights || {}).meta || {};
    return typeCol(ctx, 25.35, 0.3, 2.35, 'Render data', [
      ['Datum', 'model 0 = ' + f1(DATUM)], ['North', ((SH().meta || {}).north_deg || 39.3) + '°'], '',
      ['Tip', f1(T.el), 1], ['Natural grade', f1(T.grade)], ['Over grade', f1(T.over) + ' ft'], ['Limit', (M.limit_ft || 30) + ' ft'], ['To spare', f1(T.margin) + ' ft'], '',
      ['Eye 1 · 3', `${f1(DATUM + CA_CAM.arrival.eye[1])} · ${f1(DATUM + CA_CAM.tip.eye[1])}`], ['Eye 2 · 4', `${f1(DATUM + CA_CAM.court.eye[1])} · ${f1(DATUM + CA_CAM.aerial.eye[1])}`],
      ['Lens', `${Math.round(2 * Math.atan(-CA_CAM.arrival.fr[0]) / RAD)}° to ${Math.round(2 * Math.atan(-CA_CAM.aerial.fr[0]) / RAD)}° wide`]
    ]);
  }
  function col91(ctx) {
    const lv = ['tip', 'south_high', 'primary_ridge', 'fold_beam', 'bridge_beam', 'primary_ff', 'main_ff', 'lower_ff'].map(id => (SH().levels || []).find(l => l.id === id)).filter(Boolean);
    const nm = { tip: 'Tip', south_high: 'South wing high', primary_ridge: 'Primary high point', fold_beam: 'Fold beam', bridge_beam: 'Bridge beam', primary_ff: 'L2 FF', main_ff: 'Main FF', lower_ff: 'Lower FF' };
    return typeCol(ctx, 25.35, 0.3, 2.35, 'Levels', lv.map(l => [nm[l.id], f1(l.el), l.id === 'tip']).concat(['', ['Eye height', 'about 5′ 3″ over floor'], ['Lens', '64° vertical']]));
  }
  function col05(ctx) {
    const G = ((SH().grids || {}).grids || []), n = G.find(g => g.id === 'north'), b = G.find(g => g.id === 'bridge'), s = G.find(g => g.id === 'south');
    const ow = DIM('overall_ew'), on = DIM('overall_ns');
    return typeCol(ctx, 25.35, 0.3, 2.35, 'Grids', [
      ['North 1 to 4', n ? n.num_spacing.slice(0, 3).map(x => x.text).join(' · ') : ''], ['North 4 to 11', n ? n.num_spacing.slice(3).filter(x => !x.overall).map(x => x.text).join(' · ') : ''],
      ['Bridge 6 to 8', b ? b.num_spacing[0].text : ''], ['Bridge B to F', b ? b.let_spacing.filter(x => !x.overall).map(x => x.text).join(' · ') : ''],
      ['South 4 to 10', s ? s.num_spacing.filter(x => !x.overall).map(x => x.text).join(' · ') : ''], ['South skew', s ? Math.abs(s.axis_deg).toFixed(1) + '°' : ''], '',
      ['Overall', ow && on ? `${ow.text} by ${on.text}` : ''], ['Tip', f1(TIP().el), 1], ['View', 'parallel, 32° down']
    ]);
  }

  LIVING_OVERLAYS.push({ id: 'A0.9', z: 4, html: ctx => CSS + a09(ctx) + a09Key(ctx) + col09(ctx) });
  LIVING_OVERLAYS.push({ id: 'A9.1', z: 4, html: ctx => CSS + a91(ctx) + a91Detail(ctx) + col91(ctx) });
  LIVING_OVERLAYS.push({ id: 'A0.5', z: 4, html: ctx => CSS + a05(ctx) + a05Key(ctx) + col05(ctx) });
})();
