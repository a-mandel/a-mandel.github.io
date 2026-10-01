/* overlays-plans crew (9/30/26): structural grids, dimension strings, room names and Design Book tags
   laid over the plan sheets A2.0 to A2.5 and the area diagram A0.6. Every point comes from window.SHARED
   (draw/shared.json): grid lines, dims, rooms and tags in model feet, placed with SHARED.plan(). Only the
   presentation lives here: string rows clear of the site header, tag offsets, what each sheet shows.
   Hairlines in one field SVG (0 0 31.25 23, field inches); type in HTML so it keeps the sheet's floors. */
(function () {
  const W = 31.25, H = 23;
  const ACC = 'var(--accent)';

  /* per sheet: what shows and where the rows sit (field inches) */
  const COMMON = {
    grid: true, faint: 1,
    nrow: 0.27,        // north bubble row
    wcol: 6.86,        // west bubble column
    ecol: 30.54,       // east bubble column
    skip: ['5:b', '7:b', '9:b', '11:b', '8:b'],   // bubbles that would land on rooms, the bridge or the terrace
    foot: 19.42,       // keep clear of the footer
    tree: 14           // ft, the court tree keeps its canopy clear (T11: about 14 ft to the walls)
  };
  /* header keep-outs: title band, then the three address lines */
  const HEAD = [{ x0: 0, y0: 0, x1: 11.45, y1: 1.1 }, { x0: 0, y0: 1.1, x1: 9.15, y1: 1.62 }, { x0: 0, y0: 1.62, x1: 6.75, y1: 2.15 }, { x0: 0, y0: 2.15, x1: 5.9, y1: 2.85 }];
  /* the section cut arrows drawn on A2.0 and A2.1 (east end), field inches */
  const CUTS = [{ x0: 29.95, y0: 3.75, x1: 30.78, y1: 4.92 }];

  const NORTH_ROW = { grid: 1.87, wing: 1.47 };          // grid to grid, then the north wing overall
  const TPOS = { north_wing_len: 0.7, bridge_len_w: 0.62, overall_ns: 0.55 };   // where the figure sits along its string
  const L1_DIMS = ['overall_ns', 'garage_d', 'bridge_w', 'bridge_len_w', 'south_w', 'south_depth', 'north_wing_len', 'north_wing_depth',
    'grid_north_1_2', 'grid_north_2_3', 'grid_north_3_4', 'grid_north_4_5', 'grid_north_5_7', 'grid_north_7_9', 'grid_north_9_11',
    'grid_bridge_6_8', 'grid_bridge_B_D', 'grid_bridge_D_E', 'grid_bridge_E_F'];
  const GRID_ROW = ['grid_north_1_2', 'grid_north_2_3', 'grid_north_3_4', 'grid_north_4_5', 'grid_north_5_7', 'grid_north_7_9', 'grid_north_9_11'];

  const SHEETS = {
    'A2.0': { dims: L1_DIMS, rooms: [], tags: ['T10'], cuts: true, hideDim: true, skipAlso: ['3:b'],
      legend: [9.2, 14.9], tagOff: { T10: [-2.4, 0.35, 'l'] } },
    'A2.1': { dimFoot: 19.8, dims: L1_DIMS, rooms: ['main', 'garage', 'lower', 'terrace', 'patio'], tags: 'auto', cuts: true, hideDim: true, hideLbl: true,
      legend: [0.62, 8.35],
      tagOff: { T_W1: [-0.2, -0.53], T09: [0.32, -0.9], T_W2: [-0.3, 1.2], T20: [0.25, -0.2], T_W10: [-0.2, 1.15], T_W7: [-0.15, 2.3], T_W11: [0.6, -0.75], T_W12: [0.35, 0.3], T_W13: [-1.6, 0.34], T10: [0.1, 1.6] },
      nudge: { entry: [0, -0.12], pantry: [0.35, 0.1], bar: [0.28, -0.05], stair: [0.35, 0.1], vestibule: [-0.55, 0.75], upper_terrace: [0.4, 1.4], nook: [-0.1, 0.55], garage: [0, -0.45],
        kitchen: [0, -0.93], living: [-1.965, 0.71], dining: [1.093, 0] } },   // clear of the 10/1/26 fit out (overlays-rooms.js)
    'A2.2': { dims: ['primary_w', 'primary_terrace'], rooms: [], tags: 'auto', legend: [0.62, 7.2],
      tagOff: { T_W7: [0.32, 1.5, 'r'], T_W11: [0.2, -1.62, 'r'], T_W12: [0.25, 0.5, 'r'], T_W13: [-1.6, -0.1, 'l'] } },
    'A2.3': { skipAlso: ['10:a'], dims: GRID_ROW, rooms: [], tags: 'auto', legend: [0.62, 9.0], noGridDimsWest: true,
      tagOff: { T01: [0.42, 0.95, 'l'], T02: [-0.4, -1.55, 'l'], T04: [-0.47, 1.64, 'l'], T05: [-2.06, 1.0, 'l'], T06: [0.75, 0.68, 'r'], T_chim_south_area: [0.25, 1.3, 'r'], T_chim_north_area: [0.85, 1.87, 'r'], T13: [-0.5, 1.83, 'r'], T14: [-0.55, 1.9, 'l'] } },
    'A2.4': { dimFoot: 19.8, skipRooms: ['pantry', 'powder', 'bar'], faint: 0.55, dims: GRID_ROW.concat(['overall_ns']), rooms: ['main', 'garage', 'lower'], ceil: true, tags: 'auto', legend: [0.62, 15.05], hideRcp: 'A2.4',
      tagOff: { T15: [-1.5, -1.2, 'r'] },
      nudge: { living: [0.9, 0.55], kitchen: [0.15, 0.55], powder: [-0.25, 0.6], pantry: [0.1, 0.55], mudroom: [0.05, 0], entry: [0.35, -0.02], porch: [0, 0.2], garage: [0, 0.5], gear: [0, 0.38],
        dining: [-0.5, -0.4], nook: [-0.1, 0.55], stair: [0.05, 0.1], bar: [0.45, -0.25], vestibule: [-0.7, 0.35], granny: [0, -0.4], flex: [0, -0.35], bunk: [0.1, 0.3], gym: [0.15, -0.25], bunk_bath: [0.1, 0.25] } },
    'A2.5': { skipAlso: ['10:a'], keep: [{ x0: 8.4, y0: 8.6, x1: 16.4, y1: 13.55 }], faint: 0.55, dims: ['primary_w'], rooms: ['primary'], ceil: true, tags: 'auto', legend: [0.62, 14.2], hideRcp: 'A2.5',
      tagOff: { T19: [-0.47, -0.6, 'l'] }, nudge: { primary: [-0.4, -1.1] } },
    'A0.6': { grid: false, dims: [], rooms: [], tags: 'auto', legend: [0.62, 17.45], tagOff: { T09: [-2.36, 0.87, 'r'] } }
  };
  const LEVELS = { main: ['main'], garage: ['garage'], lower: ['lower'], terrace: ['terrace'], patio: ['patio'], primary: ['primary'] };

  /* ---------- geometry helpers ---------- */
  const f3 = n => (+n).toFixed(3);
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
  const len = a => Math.hypot(a[0], a[1]), nrm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
  const inRect = (p, r, pad = 0) => p[0] > r.x0 - pad && p[0] < r.x1 + pad && p[1] > r.y0 - pad && p[1] < r.y1 + pad;

  /* the parts of segment p0 p1 left outside the keep-out circles and rects, as [t0, t1] intervals */
  function keepParts(p0, p1, circles, rects) {
    let iv = [[0, 1]];
    const cut = (a, b) => { const out = []; iv.forEach(([s, e]) => { if (b <= s || a >= e) out.push([s, e]); else { if (a > s) out.push([s, a]); if (b < e) out.push([b, e]); } }); iv = out; };
    const d = sub(p1, p0);
    circles.forEach(c => {
      const f = sub(p0, c.c), A = d[0] * d[0] + d[1] * d[1], B = 2 * (f[0] * d[0] + f[1] * d[1]), C = f[0] * f[0] + f[1] * f[1] - c.r * c.r, disc = B * B - 4 * A * C;
      if (disc > 0) { const q = Math.sqrt(disc); cut((-B - q) / (2 * A), (-B + q) / (2 * A)); }
    });
    rects.forEach(r => {
      let t0 = 0, t1 = 1; const P = [[-d[0], p0[0] - r.x0], [d[0], r.x1 - p0[0]], [-d[1], p0[1] - r.y0], [d[1], r.y1 - p0[1]]];
      for (const [p, q] of P) { if (p === 0) { if (q < 0) return; } else { const t = q / p; if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t); } }
      if (t0 < t1) cut(t0, t1);
    });
    return iv.filter(([s, e]) => e - s > 1e-3);
  }

  /* merge the grid lines that share a label and a line (one label per physical line across the house) */
  function gridGroups(S) {
    const by = {};
    S.grids.grids.forEach(g => ['num', 'let'].forEach(kind => (g[kind] || []).forEach(l => { (by[kind + l.id] = by[kind + l.id] || { id: l.id, kind, lines: [] }).lines.push(l); })));
    return Object.values(by).map(G => {
      const a0 = G.lines[0].a, d = nrm(sub(G.lines[0].b, a0));
      const segs = G.lines.map(l => { const t = [l.a, l.b].map(p => (p[0] - a0[0]) * d[0] + (p[1] - a0[1]) * d[1]); return [Math.min(...t), Math.max(...t)]; }).sort((x, y) => x[0] - y[0]);
      const merged = [];
      segs.forEach(s => { const m = merged[merged.length - 1]; if (m && s[0] <= m[1] + 1) m[1] = Math.max(m[1], s[1]); else merged.push(s.slice()); });
      return { id: G.id, kind: G.kind, a0, d, segs: merged, what: G.lines.map(l => l.what).join(' · ') };
    });
  }

  /* ---------- drawing ---------- */
  function build(id, ctx) {
    const S = ctx.SHARED || window.SHARED;
    if (!S || !S.plan) return '';
    const O = Object.assign({}, COMMON, SHEETS[id]);
    const U = ctx.U, E = ctx.esc || (s => String(s));
    const P = (x, z) => S.plan(id, x, z);
    const svg = [], html = [];
    const ln = (a, b, cls) => svg.push(`<line class="${cls}" x1="${f3(a[0])}" y1="${f3(a[1])}" x2="${f3(b[0])}" y2="${f3(b[1])}"/>`);
    const at = (p, inner, cls, extra = '') => html.push(`<div class="${cls}" style="left:${U(p[0])};top:${U(p[1])}${extra}">${inner}</div>`);

    /* keep-outs, field inches */
    const circles = [], rects = HEAD.concat([{ x0: 0, y0: O.foot, x1: W, y1: H }, { x0: 30.95, y0: 0, x1: W, y1: H }]);
    const tree = (S.tags.tags.find(t => t.id === 'T11') || {}).at;
    if (tree && O.tree && id !== 'A0.6') { const c = P(tree[0], tree[1]), c2 = P(tree[0] + O.tree, tree[1]); circles.push({ c, r: c2[0] - c[0] }); }
    if (O.keep) rects.push(...O.keep);
    if (O.cuts) {
      rects.push(...CUTS);
      const v = ((ctx.DRW || {}).sheets || {})['A2.1'];
      ((v && v.views[0].labels) || []).filter(l => l.k === 'bub').forEach(l => {
        const V = v.views[0]; circles.push({ c: [ctx.FX(V.x + l.p[0] * V.w), ctx.FY(V.y + l.p[1] * V.h)], r: 0.3 });
      });
    }

    /* 1 grids */
    const R = 0.15;                      // bubble radius, inches
    if (O.grid !== false) {
      gridGroups(S).forEach(G => {
        const pts = G.segs.map(([t0, t1]) => [P(...add(G.a0, mul(G.d, t0))), P(...add(G.a0, mul(G.d, t1)))]);
        const parts = [];
        pts.forEach(([p0, p1]) => keepParts(p0, p1, circles, rects).forEach(([s, e]) => parts.push([add(p0, mul(sub(p1, p0), s)), add(p0, mul(sub(p1, p0), e))])));
        if (!parts.length) return;
        /* outer ends, then push bubbles out to the north row and west column */
        const dir = nrm(sub(parts[parts.length - 1][1], parts[0][0]));
        const ends = [[parts[0][0], mul(dir, -1)], [parts[parts.length - 1][1], dir]];
        const unclipped = [pts[0][0], pts[pts.length - 1][1]];
        ends.forEach(([p, out], k) => {
          const clipped = len(sub(p, unclipped[k])) > 0.02;
          if (clipped || (O.skip || []).concat(O.skipAlso || []).includes(G.id + (k ? ':b' : ':a'))) return;   // an end lost to the header, footer, tree or a cut arrow: no bubble there
          let c = add(p, mul(out, R + 0.05));
          if (Math.abs(out[0]) < 0.2 && out[1] < 0 && c[1] > O.nrow && c[1] < 2.6) c = [c[0], O.nrow];
          if (Math.abs(out[1]) < 0.2 && out[0] < 0 && c[0] < 8.6 && c[0] > O.wcol) c = [O.wcol, c[1]];
          if (Math.abs(out[1]) < 0.2 && out[0] > 0 && c[0] > 26 && c[0] < O.ecol) c = [O.ecol, c[1]];
          const hit = circles.some(q => len(sub(c, q.c)) < q.r + R) || rects.some(r => inRect(c, r, R));
          if (hit) return;
          const edge = add(c, mul(out, -R));
          if (len(sub(edge, p)) > 0.01) keepParts(p, edge, circles, rects.filter(r => !inRect(c, r))).forEach(([s0, s1]) => ln(add(p, mul(sub(edge, p), s0)), add(p, mul(sub(edge, p), s1)), 'gx'));
          at(c, E(G.id), 'gb', G.kind === 'let' ? ';--k:1' : '');
        });
        parts.forEach(([a, b]) => ln(a, b, 'gl'));
      });
    }

    /* 2 dimensions */
    const dims = (O.dims || []).map(k => S.dims.find(d => d.id === k)).filter(Boolean);
    dims.forEach(d => {
      let e1 = P(...d.e[0]), e2 = P(...d.e[1]), s1 = P(...d.s[0]), s2 = P(...d.s[1]);
      const row = GRID_ROW.includes(d.id) ? NORTH_ROW.grid : d.id === 'north_wing_len' ? NORTH_ROW.wing : null;
      if (row != null && Math.abs(s1[1] - s2[1]) < 1e-3) { s1 = [s1[0], row]; s2 = [s2[0], row]; }
      const u = nrm(sub(s2, s1));
      let ang = Math.atan2(u[1], u[0]) * 180 / Math.PI;
      if (ang > 90.5 || ang < -90.5) ang += ang > 0 ? -180 : 180;
      const mid = add(s1, mul(sub(s2, s1), TPOS[d.id] != null ? TPOS[d.id] : 0.5));
      const drects = O.dimFoot ? rects.map(r => r.y0 === O.foot && r.x0 === 0 && r.x1 === W ? Object.assign({}, r, { y0: O.dimFoot }) : r) : rects;
      const segs = keepParts(add(s1, mul(u, -0.06)), add(s2, mul(u, 0.06)), circles, drects);
      if (segs.length !== 1 || segs[0][0] > 0.02 || segs[0][1] < 0.98) return;   // a string that would cross the header, a cut arrow or the tree stays off
      ln(add(s1, mul(u, -0.06)), add(s2, mul(u, 0.06)), 'dl');
      [s1, s2].forEach(s => { const t = [Math.cos((ang + 45) * Math.PI / 180) * 0.065, Math.sin((ang + 45) * Math.PI / 180) * 0.065]; ln(sub(s, t), add(s, t), 'dt'); });
      [[e1, s1], [e2, s2]].forEach(([e, s]) => {
        const v = sub(s, e), L = len(v); if (L < 0.12) return;
        const n = nrm(v), a = add(e, mul(n, 0.07)), b = add(s, mul(n, 0.07));
        keepParts(a, b, circles, drects).forEach(([p, q]) => ln(add(a, mul(sub(b, a), p)), add(a, mul(sub(b, a), q)), 'de'));
      });
      at(mid, `<span>${E(d.text)}</span>`, 'dx', `;--a:${ang.toFixed(2)}deg`);
    });

    /* 3 rooms */
    const want = [].concat(...(O.rooms || []).map(k => LEVELS[k] || []));
    S.rooms.filter(r => want.includes(r.level) && r.id !== 'fire_pit' && !(O.skipRooms || []).includes(r.id) && !(O.ceil && !r.ceiling_text)).forEach(r => {
      const nd = (O.nudge || {})[r.id] || [0, 0];
      const p = add(P(r.label[0], r.label[1]), nd);
      const sub2 = O.ceil ? (r.ceiling_text ? `<i>${E(r.ceiling_text)}</i>` : '') : `<i>about ${Number(r.sf_about).toLocaleString('en-US')} sf</i>`;
      at(p, `<b>${E(r.name)}</b>${sub2}`, 'rm' + (r.placeholder ? ' ph' : ''));
    });

    /* 4 Design Book tags, grouped by anchor */
    const pick = O.tags === 'auto' ? S.tags.tags.filter(t => t.sheets.includes(id) && t.at_field && t.at_field[id]) : S.tags.tags.filter(t => (O.tags || []).includes(t.id));
    const groups = [];
    pick.forEach(t => {
      const a = (t.at_field && t.at_field[id]) || P(t.at[0], t.at[1]);
      const g = groups.find(q => len(sub(q.a, a)) < 0.05);
      if (g) g.tags.push(t); else groups.push({ a, tags: [t] });
    });
    groups.forEach(g => {
      const off = (O.tagOff || {})[g.tags[0].id] || [0.5, -0.5];
      const p = add(g.a, off.slice(0, 2)), left = off[2] ? off[2] === 'l' : off[0] < 0;
      const q = add(p, [left ? 0.04 : -0.04, 0]);
      svg.push(`<path class="tl" d="M${f3(g.a[0])} ${f3(g.a[1])} L${f3(q[0])} ${f3(q[1])}"/>`);
      html.push(`<i class="ta" style="left:${U(g.a[0])};top:${U(g.a[1])}"></i>`);
      const rows = g.tags.map(t => {
        const m = /^([IVX]+\.\d+)\s+(.*)$/.exec(t.text), crc = /,?\s*(CRC R[\d.]+)/.exec(t.text);
        const code = m ? m[1] : t.a13 ? t.a13.section : crc ? crc[1] : 'Design brief', rest = m ? m[2] : !t.a13 && crc ? t.text.replace(crc[0], ',').replace(/,\s*,/, ',') : t.text;
        return `<span class="tr"><span class="t1"><i class="st ${t.status}"></i>${E(code)}${t.a13 ? `<b class="rn">${t.a13.n}</b>` : ''}</span><span class="t2">${E(rest)}</span></span>`;
      }).join('');
      at(p, rows, 'tg' + (left ? ' l' : ''));
    });

    /* legend */
    if (O.legend) {
      const hasTags = groups.length > 0, hasRooms = want.length > 0;
      const rowsL = [];
      if (O.grid !== false) rowsL.push(`<li><svg viewBox="0 0 1 .3"><line class="gl" x1="0" y1=".15" x2="1" y2=".15"/></svg><span>Structural grid</span><em>from the model</em></li>`);
      if (dims.length) rowsL.push(`<li><svg viewBox="0 0 1 .3"><line class="dl" x1=".08" y1=".15" x2=".92" y2=".15"/><line class="dt" x1=".03" y1=".25" x2=".13" y2=".05"/><line class="dt" x1=".87" y1=".25" x2=".97" y2=".05"/></svg><span>Dimension</span><em>outside face, about</em></li>`);
      if (hasTags) {
        rowsL.push(`<li><i class="st meets"></i><span>Meets</span><em>Design Book</em></li><li><i class="st variance"></i><span>Variance</span><em>request with DR</em></li><li><i class="st confirm"></i><span>Confirm</span><em>survey, engineer or LCC</em></li><li><b class="rn">7</b><span>A1.3 row</span><em>compliance matrix</em></li>`);
      }
      const foot = [hasRooms ? 'Rooms are placeholders, the 9/30/26 program.' : '', 'FA accuracy, confirm on survey.'].filter(Boolean).join(' ');
      const ttl = [O.grid !== false ? 'Grids' : '', dims.length ? 'dims' : '', hasTags ? 'Design Book' : ''].filter(Boolean);
      at(O.legend, `<h4>${ttl.length > 1 ? ttl.slice(0, -1).join(', ') + ' and ' + ttl[ttl.length - 1] : ttl[0]}</h4><ul>${rowsL.join('')}</ul><p>${E(foot)}</p>`, 'lg');
    }

    return `<div class="opx${O.faint < 1 ? ' rcp' : ''}" data-ov="${id}"><svg class="osv" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${svg.join('')}</svg>${html.join('')}</div>`;
  }

  /* ---------- style, injected once ---------- */
  const CSS = `
.opx{position:absolute;inset:0;pointer-events:none;--ov-t:max(calc(6.8px * var(--fl)),calc(var(--u) * .1));--ov-i:max(calc(8px * var(--fl)),calc(var(--u) * .118));--gb:max(calc(13px * var(--fl)),calc(var(--u) * .3))}
.opx .osv{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.opx .gl{stroke:var(--ink);stroke-opacity:.34;stroke-width:.5;vector-effect:non-scaling-stroke;stroke-dasharray:.42 .07 .04 .07;fill:none}
.opx .gx{stroke:var(--ink);stroke-opacity:.34;stroke-width:.5;vector-effect:non-scaling-stroke}
.opx.rcp .gl,.opx.rcp .gx{stroke-opacity:.2}
.opx .dl,.opx .de{stroke:var(--ink);stroke-opacity:.62;stroke-width:.5;vector-effect:non-scaling-stroke}
.opx .de{stroke-opacity:.38}
.opx .dt{stroke:var(--ink);stroke-width:1.1;vector-effect:non-scaling-stroke}
.opx.rcp .dl,.opx.rcp .dt{stroke-opacity:.45}
.opx .tl{stroke:${ACC};stroke-width:.6;fill:none;vector-effect:non-scaling-stroke}
.opx .gb{position:absolute;width:var(--gb);height:var(--gb);margin:calc(var(--gb) / -2) 0 0 calc(var(--gb) / -2);border:1px solid rgba(27,26,24,.62);border-radius:50%;background:var(--paper);
  display:grid;place-items:center;font:400 var(--ov-t)/1 var(--ft);letter-spacing:0;color:var(--ink);padding-top:.08em}
.opx.rcp .gb{border-color:rgba(27,26,24,.36);color:var(--muted)}
.opx .dx{position:absolute;width:0;height:0;transform:rotate(var(--a));transform-origin:0 0}
.opx .dx span{position:absolute;left:0;bottom:calc(var(--u) * .035);transform:translateX(-50%);white-space:nowrap;font:400 var(--ov-t)/1 var(--ft);letter-spacing:.06em;color:var(--ink);
  padding:0 .25em;text-shadow:0 0 2px var(--paper),0 0 2px var(--paper),0 0 3px var(--paper)}
.opx.rcp .dx span{color:var(--muted)}
.opx .rm{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;text-align:center;white-space:nowrap;line-height:1.15;
  text-shadow:0 0 2px var(--paper),0 0 2px var(--paper),0 0 4px var(--paper)}
.opx .rm b{font:400 var(--ov-t)/1.2 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--ink);white-space:normal;max-width:max(calc(82px * var(--fl)),calc(var(--u) * 1.75))}
.opx .rm i{font:italic 400 var(--ov-i)/1.15 var(--fs);color:var(--muted)}
.opx.rcp .rm{background:rgba(246,243,236,.86);padding:.15em .4em;border-radius:3px}
.opx .ta{position:absolute;width:max(calc(4px * var(--fl)),calc(var(--u) * .075));height:max(calc(4px * var(--fl)),calc(var(--u) * .075));border-radius:50%;background:${ACC};transform:translate(-50%,-50%)}
.opx .tg{position:absolute;transform:translate(0,-50%);display:flex;flex-direction:column;gap:.3em;white-space:nowrap;padding:.3em .45em .25em;border-radius:3px;background:rgba(246,243,236,.88)}
.opx .tg.l{transform:translate(-100%,-50%);align-items:flex-end}
.opx .tr{display:flex;flex-direction:column;gap:.12em;color:${ACC};text-shadow:0 0 2px var(--paper),0 0 2px var(--paper),0 0 3px var(--paper)}
.opx .tg.l .tr{align-items:flex-end}
.opx .t1{display:flex;align-items:center;gap:.4em;font:400 var(--ov-t)/1.1 var(--ft);letter-spacing:.1em}
.opx .t2{font:italic 400 var(--ov-i)/1.05 var(--fs);letter-spacing:0}
.opx .st{flex:none;display:inline-block;width:.78em;height:.78em;border-radius:50%;box-sizing:border-box}
.opx .st.meets{background:var(--ink)}
.opx .st.variance{background:${ACC}}
.opx .st.confirm{border:1px solid ${ACC};background:var(--paper)}
.opx .rn{flex:none;display:inline-grid;place-items:center;min-width:1.25em;height:1.25em;border:1px solid ${ACC};border-radius:.25em;font:400 calc(var(--ov-t) * .92)/1 var(--ft);color:${ACC};letter-spacing:0;padding:.08em .15em 0;box-sizing:border-box;background:var(--paper)}
.opx .lg{position:absolute;width:calc(var(--u) * 5.9);font:400 var(--ov-t)/1.2 var(--ft)}
.opx .lg h4{margin:0 0 .6em;font:400 var(--ov-t)/1 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--ink)}
.opx .lg ul{list-style:none;margin:0;padding:0;display:grid;gap:.5em}
.opx .lg li{display:grid;grid-template-columns:3.2em 9.6em 1fr;align-items:center;gap:.6em;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.opx .lg li>svg{width:3.2em;height:.96em;overflow:visible}
.opx .lg li>.st,.opx .lg li>.rn{justify-self:center}
.opx .lg li em{font:italic 400 var(--ov-i)/1 var(--fs);letter-spacing:0;text-transform:none;justify-self:end;color:var(--muted)}
.opx .lg p{margin:.7em 0 0;font:italic 400 var(--ov-i)/1.2 var(--fs);color:var(--muted)}
/* existing labels the overlay replaces */
.sheet[data-id="A2.1"] .dv .lbl.room,.sheet[data-id="A2.1"] .dv .lbl.tag,.sheet[data-id="A2.1"] .dv .lbl.dim,.sheet[data-id="A2.0"] .dv .lbl.dim{display:none}
.sheet[data-id="A2.1"] .dsvg path[d="M-22.08 -19.4 H37.32"],.sheet[data-id="A2.1"] .dsvg path[d="M-21.48 -18.5 L-19.68 -20.3"],.sheet[data-id="A2.1"] .dsvg path[d="M-20.58 -16.06 V-20.6"],
.sheet[data-id="A2.1"] .dsvg path[d="M34.92 -18.5 L36.72 -20.3"],.sheet[data-id="A2.1"] .dsvg path[d="M35.82 -16.06 V-20.6"],
.sheet[data-id="A2.0"] .dsvg path[d="M-22.08 -19.4 H37.32"],.sheet[data-id="A2.0"] .dsvg path[d="M-21.48 -18.5 L-19.68 -20.3"],.sheet[data-id="A2.0"] .dsvg path[d="M-20.58 -16.06 V-20.6"],
.sheet[data-id="A2.0"] .dsvg path[d="M34.92 -18.5 L36.72 -20.3"],.sheet[data-id="A2.0"] .dsvg path[d="M35.82 -16.06 V-20.6"]{display:none}
.sheet[data-id="A2.4"] .pbv .lbl.room,.sheet[data-id="A2.4"] .pbv > span.lbl:nth-of-type(3),.sheet[data-id="A2.4"] .pbv > span.lbl:nth-of-type(10){display:none}
.sheet[data-id="A2.5"] .pbv > span.lbl:first-of-type{display:none}
@media screen and (max-width:760px), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
  .opx{display:none}
}
@media print{.opx .tr,.opx .dx span,.opx .rm{text-shadow:none}}
`;
  if (typeof document !== 'undefined' && !document.getElementById('ov-plans-css')) {
    const st = document.createElement('style'); st.id = 'ov-plans-css'; st.textContent = CSS; (document.head || document.documentElement).appendChild(st);
  }

  Object.keys(SHEETS).forEach(id => LIVING_OVERLAYS.push({ id, z: 4, html: ctx => build(id, ctx) }));
})();
