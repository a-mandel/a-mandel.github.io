/* sched-b · A7.1 Window schedule (9/30/26).
   Built by sheets/tools/sched-b/build.py from the pocket model's Ribbon glass (walsh/index.html DATA); edit the template
   there and rebuild rather than editing this file. Glass is panelized to André's rule: square, 4 ft by 8 ft max,
   raked only at the living room tip, clear only. */
(function () {
  const SB = /*DATA*/null;
  if (!SB || !window.LIVING_SHEETS) return;
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const f2 = n => +n.toFixed(3);
  const ftin = v => { let f = Math.floor(v + 1e-6), i = Math.round((v - f) * 12); if (i === 12) { f++; i = 0; } return `${f}′ ${i}″`; };
  const T = SB.types, W = SB.walls, K = SB.key, TOT = SB.tot;
  const NS = 'vector-effect="non-scaling-stroke"';
  const px = (p, u) => `max(calc(${p}px * var(--fl)), calc(var(--u) * ${u}))`;

  /* ---------------------------------------------------------------- layout, sheet inches */
  const L = { x: 1.9, w: 19.2, sy: 3.55, rh: 0.5, hh: 0.5 };
  const COLS = [['Type', 0.6], ['View', 0.9], ['No.', 0.55], ['Width', 1.55], ['Height', 1.95], ['Opens', 0.95],
    ['Frame', 1.3], ['Glazing', 1.85], ['U · SHGC', 1.65], ['Egress', 0.95], ['Wall planes', 1.95], ['Notes', 5.0]];
  const schedH = L.hh + T.length * L.rh;
  const EL = { y: L.sy + schedH + 1.5, sc: 3 / 16 };              // type elevations, 3/16 in = 1 ft
  EL.base = EL.y + 0.45 + 8 * EL.sc;
  const NT = { y: EL.base + 1.62 };                                  // glazing notes
  const R = { x: 21.9, w: 10.0, ky: 3.45, kh: 6.2 };                // key plan and wall planes
  R.kw = R.kh * K.vb[2] / K.vb[3];
  R.ty = R.ky + R.kh + 0.95; R.rh = 0.3;

  /* ---------------------------------------------------------------- one pane, drawn in inches at (x, y top left) */
  function paneSVG(t, x, base, sc, detail) {
    const w = t.dw * sc, h = t.dh * sc, y = base - h, rise = (t.rise || 0) * sc;
    const top = t.fam === 'raked' ? `M${f2(x)} ${f2(y + rise)} L${f2(x + w)} ${f2(y)}` : `M${f2(x)} ${f2(y)} L${f2(x + w)} ${f2(y)}`;
    const yl = t.fam === 'raked' ? y + rise : y;
    let s = `<path d="${top} L${f2(x + w)} ${f2(base)} L${f2(x)} ${f2(base)} Z" class="fr" ${NS}/>`;
    if (detail) {                                      // the frame's inner line, about 2 in in
      const i = Math.min(2 / 12 * sc, w * 0.08);
      s += `<path d="M${f2(x + i)} ${f2(yl + i)} L${f2(x + w - i)} ${f2(y + i)} L${f2(x + w - i)} ${f2(base - i)} L${f2(x + i)} ${f2(base - i)} Z" class="gl" ${NS}/>`;
    }
    const op = t.op;
    if (op === 'Casement') s += `<path d="M${f2(x + w)} ${f2(y)} L${f2(x)} ${f2((y + base) / 2)} L${f2(x + w)} ${f2(base)}" class="sw" ${NS}/>`;
    if (op === 'Awning') s += `<path d="M${f2(x)} ${f2(base)} L${f2(x + w / 2)} ${f2(y)} L${f2(x + w)} ${f2(base)}" class="sw" ${NS}/>`;
    if (t.fam === 'raked') s += `<path d="M${f2(x - 0.05)} ${f2(yl)} L${f2(x + w + 0.05)} ${f2(y - 0.05 * rise / w)}" class="rk" ${NS}/>`;
    return s;
  }

  /* ---------------------------------------------------------------- the schedule table */
  function thumb(t) {
    const bw = 1.0, bh = L.rh - 0.1, sc = (bh - 0.06) / 8;
    const x = (bw - t.dw * sc) / 2;
    return `<svg class="th" viewBox="0 0 ${bw} ${f2(bh)}" aria-hidden="true">${paneSVG(t, x, bh - 0.03, sc, false)}</svg>`;
  }
  function schedule(ctx) {
    const { U, esc } = ctx;
    const gt = COLS.map(c => U(c[1])).join(' ');
    let h = `<div class="sb-row sb-hd" style="grid-template-columns:${gt};height:${U(L.hh)}">${COLS.map(c => `<span>${esc(c[0])}</span>`).join('')}</div>`;
    T.forEach(t => {
      h += `<div class="sb-row" style="grid-template-columns:${gt};height:${U(L.rh)}">
        <span class="sb-tag"><b>${t.t}</b></span><span class="sb-th">${thumb(t)}</span><span class="v n">${t.n}</span>
        <span class="v">${esc(t.w)}</span><span class="v">${esc(t.h)}</span><span class="v">${esc(t.op)}</span><span class="v">${esc(t.frm)}</span>
        <span class="v">Tempered dual pane, clear</span><span class="v">0.27 · tbd <em>confirm</em></span>
        <span class="v${t.egress === 'No' ? ' mu' : ''}">${esc(t.egress)}</span><span class="v w">${esc(t.where)}</span><span class="v nt">${esc(t.note)}</span></div>`;
    });
    h += `<div class="sb-row sb-tot" style="grid-template-columns:${gt}"><span></span><span></span><span class="v n">${TOT.panes}</span><span class="v" style="grid-column:4 / -1">panes in ${T.length} types · about ${fmt(TOT.sf)} sf of clear glass · sizes about, nominal to the nearest 6 in, set out at CD · glazing tempered dual pane, clear, Chapter 7A</span></div>`;
    return `<div class="sb-blk sb-sched" style="left:${U(ctx.FX(L.x))};top:${U(ctx.FY(L.sy))};width:${U(L.w)}">${h}
      <div class="sb-vt">${ctx.viewTitle(1, 'Window schedule', 'Ribbon scheme · FA accuracy')}</div></div>`;
  }

  /* ---------------------------------------------------------------- type elevations at 3/16 in = 1 ft */
  function elevations(ctx) {
    const { U, esc } = ctx;
    const slot = L.w / T.length, sc = EL.sc, base = EL.base - EL.y;
    let svg = '', lab = '';
    T.forEach((t, k) => {
      const w = t.dw * sc, h = t.dh * sc, cx = slot * k + slot * 0.56, x = cx - w / 2;
      svg += paneSVG(t, x, base, sc, true);
      // width dimension under, height dimension at the left
      const dy = base + 0.17, dx = x - 0.14, tk = 0.035;
      svg += `<path d="M${f2(x - 0.06)} ${f2(dy)} H${f2(x + w + 0.06)} M${f2(x - tk)} ${f2(dy + tk)} L${f2(x + tk)} ${f2(dy - tk)} M${f2(x + w - tk)} ${f2(dy + tk)} L${f2(x + w + tk)} ${f2(dy - tk)}" class="dm" ${NS}/>`;
      svg += `<path d="M${f2(dx)} ${f2(base + 0.06)} V${f2(base - h - 0.06)} M${f2(dx - tk)} ${f2(base + tk)} L${f2(dx + tk)} ${f2(base - tk)} M${f2(dx - tk)} ${f2(base - h + tk)} L${f2(dx + tk)} ${f2(base - h - tk)}" class="dm" ${NS}/>`;
      lab += `<span class="sb-eb" style="left:${U(cx)};top:${U(base - h - 0.36)}"><b>${t.t}</b></span>`;
      lab += `<span class="sb-ed" style="left:${U(cx)};top:${U(dy + 0.05)}">${esc(ftin(t.dw))}</span>`;
      lab += `<span class="sb-eh" style="left:${U(dx - 0.05)};top:${U(base - h / 2)}">${esc(ftin(t.dh))}</span>`;
      lab += `<span class="sb-ec" style="left:${U(cx)};top:${U(dy + 0.33)}">${esc(t.op.toLowerCase())} · ${t.n}</span>`;
    });
    const H = base + 0.75;
    return `<div class="sb-blk sb-elev" style="left:${U(ctx.FX(L.x))};top:${U(ctx.FY(EL.y))};width:${U(L.w)}">
      <div class="sb-ein" style="width:${U(L.w)};height:${U(H)}"><svg class="sb-es" viewBox="0 0 ${L.w} ${f2(H)}" style="width:100%;height:100%" aria-hidden="true">${svg}</svg>${lab}</div>
      <div class="sb-vt">${ctx.viewTitle(2, 'Window types', '3/16 in = 1 ft · nominal, viewed from outside')}</div></div>`;
  }

  /* ---------------------------------------------------------------- key plan with the wall planes tagged */
  const KPOS = { W1: [26, 13.5], W11: [23.5, 33.5], W13: [3, 82], W14: [21, 71], W17: [10, 51.5] };   // crowded tags, plan feet
  const KNUDGE = { W7: [-6, 5], W8: [0, 3.5], W9: [-4, 4.5], W11: [-2, 0], W14: [0, 2], W15: [0, -3], W16: [0, 3], W3: [4, -2], W4: [8, 0], W12: [0, 3], W13: [3, 0], W17: [-10, 1], W6: [0, -3] };
  function keyplan(ctx) {
    const { U, esc } = ctx, vb = K.vb;
    const P = (x, z) => [((x - vb[0]) / vb[2] * 100).toFixed(2), ((z - vb[1]) / vb[3] * 100).toFixed(2)];
    let g = `<path d="${K.foot}" class="kf" ${NS}/>` + K.terr.map(d => `<path d="${d}" class="kt" ${NS}/>`).join('');
    let tags = '';
    W.forEach(w => {
      let best = null, bl = -1;
      w.segs.forEach(s => {
        g += `<path d="M${s[0]} ${s[1]} L${s[2]} ${s[3]}" class="kw${w.flag ? ' hot' : ''}" ${NS}/>`;
        const l = Math.hypot(s[2] - s[0], s[3] - s[1]); if (l > bl) { bl = l; best = s; }
      });
      if (!best) return;
      const n = KNUDGE[w.tag] || [0, 0], o = 6.5;
      const at = KPOS[w.tag] || [(best[0] + best[2]) / 2 + w.out[0] * o + n[0], (best[1] + best[3]) / 2 + w.out[1] * o + n[1]];
      const [px, pz] = P(at[0], at[1]);
      tags += `<span class="sb-kt${w.flag ? ' hot' : ''}" style="left:${px}%;top:${pz}%">${w.tag}</span>`;
    });
    const tr = K.tree;
    g += `<circle cx="${tr[0]}" cy="${tr[1]}" r="1.5" class="ktr"/>`;
    const nx = vb[0] + 10, nz = vb[1] + vb[3] - 16;
    g += `<g transform="translate(${nx} ${nz}) rotate(${K.north})"><circle r="5" class="kn" ${NS}/><path d="M0 -6.5 L1.5 1 L0 0 L-1.5 1 Z" class="kna"/></g>`;
    const [nlx, nlz] = P(nx, nz + 7.5);
    return `<div class="sb-blk sb-key" style="left:${U(ctx.FX(R.x))};top:${U(ctx.FY(R.ky))};width:${U(R.kw)};height:${U(R.kh)}">
      <svg viewBox="${vb.join(' ')}" style="width:100%;height:100%" aria-hidden="true">${g}</svg>${tags}
      <span class="sb-kn" style="left:${nlx}%;top:${nlz}%">N</span>
      <div class="sb-vt">${ctx.viewTitle(3, 'Key plan · wall planes', 'Not to scale · plan north up, true north shown')}</div></div>`;
  }

  /* ---------------------------------------------------------------- glazing by wall plane, the 140 sf flag */
  function wallTable(ctx) {
    const { U, esc } = ctx;
    const gt = [0.55, 3.0, 0.6, 1.5, 1.1, 3.25].map(U).join(' ');
    let h = `<div class="sb-row sb-hd" style="grid-template-columns:${gt};height:${U(0.42)}"><span>Wall</span><span>Wall plane</span><span>Face</span><span>Types</span><span>Glass</span><span>VII.15 · 140 sf</span></div>`;
    W.forEach(w => {
      h += `<div class="sb-row sb-wr" style="grid-template-columns:${gt};height:${U(R.rh)}"><span class="sb-wt">${w.tag}</span><span class="v">${esc(w.name)}</span><span class="v mu">${w.face}</span>
        <span class="v w">${esc(w.types)}</span><span class="v n">${fmt(w.sf)} sf</span>
        <span class="v${w.flag ? ' fl' : ' mu'}">${w.flag ? '<i class="sb-dot"></i>over, mitigate · confirm' : 'under'}</span></div>`;
    });
    h += `<div class="sb-row sb-tot" style="grid-template-columns:${gt}"><span></span><span class="v" style="grid-column:2 / 5">All glass · ${TOT.over} of ${W.length} planes over 140 sf</span><span class="v n">${fmt(TOT.sf)} sf</span><span class="v">about ${TOT.pct}% of ${fmt(TOT.cfa)} sf conditioned</span></div>`;
    return `<div class="sb-blk sb-walls" style="left:${U(ctx.FX(R.x))};top:${U(ctx.FY(R.ty))};width:${U(R.w)}">${h}
      <div class="sb-vt">${ctx.viewTitle(4, 'Glazing by wall plane', 'Design Book VII.15 · confirm')}</div></div>`;
  }

  /* ---------------------------------------------------------------- notes */
  const NOTES = [
    'Derived from the pocket model, Ribbon scheme, 9/30/26: every glass surface grouped by wall plane, solid cedar and white bays taken out, then panelized. Sizes are about, nominal to the nearest 6 in. FA accuracy, confirm on survey.',
    'Glass square and panelized everywhere, panes 4 ft wide by 8 ft tall max, the 8 ft pane at the bottom and transoms above. Heads level, cedar above. Raked glass only at the living room tip corner, type E.',
    'Clear glass only. No tints, no reflective or mirror coatings; low E kept to a clear, neutral coat.',
    'Very High FHSZ: every unit tempered dual pane, both lites tempered, Chapter 7A and Title 24 Part 7. Tempering also covers hazardous locations, CRC R308.',
    'Frames: dark steel, thermally broken, in the north wing, bridge and clerestories; aluminum clad wood, dark bronze, in the south wing, garage and entry.',
    `Energy: U factor and SHGC are placeholders for Title 24 Part 6, climate zone 16 (2025), confirm with the Title 24 consultant. Glass is about ${TOT.pct}% of conditioned floor area, far past the prescriptive allowance, so plan on the performance path.`,
    'Egress, type M: CRC R310, net clear opening 5.7 sf min (5.0 at grade), 24 in clear high, 20 in clear wide, sill 44 in max. Rooms are not programmed yet, so these are placeholders.',
    `Lahontan Design Book VII.15: glass over 140 sf in one wall plane calls for mitigation (confirm). ${TOT.over} planes are over. Candidates: deep overhangs, low reflectance clear glass, interior shades on timers, dark sky lighting. Raise at the pre design meeting.`,
    'The model still carries glass into the rake at the primary suite (W11, W12). This schedule squares it per the rule, cedar above; the model follows.',
    'Terrace guard glass is not a window and is not scheduled here. Glazed doors: A7.0.'
  ];
  function notes(ctx) {
    const { U, esc } = ctx;
    return `<div class="sb-blk sb-notes" style="left:${U(ctx.FX(L.x))};top:${U(ctx.FY(NT.y))};width:${U(L.w)}">
      <h3>Glazing notes</h3><ol>${NOTES.map(n => `<li>${esc(n)}</li>`).join('')}</ol></div>`;
  }

  const CSS = `<style>
  .sb7{position:absolute;inset:0}
  .sb7 .sb-blk{position:absolute}
  .sb7 .sb-vt{position:relative;height:calc(var(--u)*.55);margin-top:calc(var(--u)*.14)}
  .sb7 .sb-vt .vt{top:0}
  .sb7 .sb-row{display:grid;align-items:center;column-gap:calc(var(--u)*.08);background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u)*.1);padding-top:calc(var(--u)*.05)}
  .sb7 .sb-row > span{min-width:0}
  .sb7 .sb-hd span{font:400 ${px(8.5, .115)}/1.15 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
  .sb7 .v{font:italic 400 ${px(10, .15)}/1.08 var(--fs);color:var(--ink);font-variant-numeric:lining-nums}
  .sb7 .v em{margin-left:.35em;font-style:normal;font-family:var(--ft);font-size:${px(7.5, .1)};letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
  .sb7 .v.mu{color:var(--muted)}
  .sb7 .v.n{font-style:normal;font-family:var(--ft);letter-spacing:.06em}
  .sb7 .v.w{font-style:normal;font-family:var(--ft);font-size:${px(8.5, .12)};letter-spacing:.1em}
  .sb7 .v.nt{font-size:${px(9.5, .14)}}
  .sb7 .sb-tag b,.sb7 .sb-eb b{display:grid;place-items:center;width:${px(19, .36)};height:${px(19, .36)};border:1px solid var(--ink);border-radius:50%;font:400 ${px(10, .18)}/1 var(--ft);letter-spacing:0}
  .sb7 .sb-th svg{display:block;width:100%;height:calc(var(--u)*${L.rh - 0.1})}
  .sb7 svg .fr{fill:rgba(255,255,255,.35);stroke:var(--ink);stroke-width:.9}
  .sb7 svg .gl{fill:none;stroke:var(--ink);stroke-width:.4;opacity:.7}
  .sb7 svg .sw{fill:none;stroke:var(--ink);stroke-width:.55;stroke-dasharray:4 3;opacity:.8}
  .sb7 svg .rk{fill:none;stroke:var(--accent);stroke-width:.9}
  .sb7 svg .dm{fill:none;stroke:var(--ink);stroke-width:.45;opacity:.75}
  .sb7 .sb-tot{padding-top:calc(var(--u)*.14);background-size:100% calc(var(--u)*.12)}
  .sb7 .sb-tot .v{font-size:${px(9.5, .14)}}
  .sb7 .sb-eb,.sb7 .sb-ed,.sb7 .sb-eh,.sb7 .sb-ec{position:absolute;white-space:nowrap}
  .sb7 .sb-eb{transform:translate(-50%,-50%)}
  .sb7 .sb-ed{transform:translateX(-50%);font:italic 400 ${px(9, .13)}/1 var(--fs)}
  .sb7 .sb-eh{transform:translate(-50%,-50%) rotate(-90deg);transform-origin:50% 50%;font:italic 400 ${px(9, .13)}/1 var(--fs);background:var(--paper);padding:0 2px}
  .sb7 .sb-ec{transform:translateX(-50%);font:400 ${px(7.5, .1)}/1 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
  .sb7 .sb-ein{position:relative}
  .sb7 .sb-elev .sb-vt{margin-top:0}
  .sb7 .sb-key svg .kf{fill:rgba(27,26,24,.07);stroke:var(--ink);stroke-width:.7}
  .sb7 .sb-key svg .kt{fill:none;stroke:var(--ink);stroke-width:.45;opacity:.45}
  .sb7 .sb-key svg .kw{fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linecap:round}
  .sb7 .sb-key svg .kw.hot{stroke:var(--accent)}
  .sb7 .sb-key svg .ktr{fill:var(--accent)}
  .sb7 .sb-key svg .kn{fill:none;stroke:var(--ink);stroke-width:.6}
  .sb7 .sb-key svg .kna{fill:var(--ink)}
  .sb7 .sb-key .sb-vt{position:absolute;left:0;top:100%}
  .sb7 .sb-kt,.sb7 .sb-kn{position:absolute;transform:translate(-50%,-50%);white-space:nowrap}
  .sb7 .sb-kt{font:400 ${px(8.5, .13)}/1 var(--ft);letter-spacing:.08em;padding:.28em .45em .22em;border:1px solid var(--ink);border-radius:999px;background:var(--paper)}
  .sb7 .sb-kt.hot{border-color:var(--accent);color:var(--ink)}
  .sb7 .sb-kn{font:400 ${px(8.5, .13)}/1 var(--ft)}
  .sb7 .sb-wt{font:400 ${px(8.5, .12)}/1 var(--ft);letter-spacing:.08em}
  .sb7 .v.fl{color:var(--ink)}
  .sb7 .sb-dot{display:inline-block;width:${px(6, .1)};height:${px(6, .1)};border-radius:50%;background:var(--accent);margin-right:.45em;vertical-align:.08em}
  .sb7 .sb-notes h3{margin:0 0 calc(var(--u)*.14);font:400 ${px(10, .2)}/1.1 var(--ft);letter-spacing:.18em;text-transform:uppercase}
  .sb7 .sb-notes ol{margin:0;padding:0 0 0 1.4em;columns:2;column-gap:calc(var(--u)*.7)}
  .sb7 .sb-notes li{font:italic 400 ${px(9.5, .15)}/1.28 var(--fs);margin:0 0 calc(var(--u)*.07);break-inside:avoid}
  .sb7 .sb-notes li::marker{font-family:var(--ft);font-style:normal;font-size:.8em;color:var(--muted)}
  @media screen and (max-width:760px) and (orientation:portrait), screen and (max-width:760px) and (min-height:541px), screen and (max-width:760px) and (pointer:fine), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
    .fhtml:has(.sb7){position:relative;inset:auto}
    .sb7{position:relative;inset:auto}
    .sb7 .sb-blk{position:relative !important;left:auto !important;top:auto !important;width:auto !important;margin:0 0 40px}
    .sb7 .sb-sched,.sb7 .sb-walls,.sb7 .sb-elev{--u:44px;--fl:1;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;max-width:100%;padding-bottom:6px}
    .sb7 .sb-sched .sb-row,.sb7 .sb-walls .sb-row{width:max-content}
    .sb7 .sb-vt{position:sticky;left:0}
    .sb7 .sb-key .sb-vt{position:relative;top:auto}
    .sb7 .sb-key{height:auto !important;aspect-ratio:${f2(K.vb[2] / K.vb[3])};max-width:100%}
    .sb7 .sb-key .sb-vt{margin-top:12px}
    .sb7 .sb-notes ol{columns:1}
    .sb7 .sb-notes li{font-size:14px}
  }
  </style>`;

  LIVING_SHEETS.push({
    id: 'A7.1', group: 'Architectural', title: 'Window schedule', short: 'Window schedule', foot: 'Window schedule',
    scale: 'As noted', issued: [4],
    cap: 'Every pane square and clear, 4 by 8 or less. Only the living room tip rakes with the ribbon.',
    data: [`${TOT.panes} panes in ${T.length} types`, `About ${fmt(TOT.sf)} sf of clear glass`, `${TOT.over} of ${W.length} wall planes over 140 sf`, 'Tempered dual pane · Chapter 7A'],
    notes: [
      { text: 'raked only at the tip', t: [31.6, 9.45], p: [28.72, 5.35], a: 'r' },
      { text: 'every pane 4 by 8 or less', t: [9.4, 15.35], p: [3.35, 14.0], a: 'l' }
    ],
    html: ctx => `<div class="sb7">${CSS}${schedule(ctx)}${elevations(ctx)}${keyplan(ctx)}${wallTable(ctx)}${notes(ctx)}</div>`
  });
})();
