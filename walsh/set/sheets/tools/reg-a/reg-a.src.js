/* reg-a crew sheets (9/30/26): F1.0 Regulatory report, A1.3 Design review compliance.
   Built by sheets/tools/reg-a/build_reg.py from tools/reg-a/reg-a.src.js: edit the template, then rebuild.
   Numbers are measured from the pocket model on FA grade (about, confirm on survey); rules cite the
   Lahontan Community Design Book, Rev 4/11, by section. */
(function () {
  const RA = /*@DATA@*/null;
  const C = RA.calcs;
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const ft1 = n => (Math.round(n * 10) / 10).toFixed(1);

  const CSS = `<style>
  .ra-blk{position:absolute}
  .ra-h{margin:0 0 calc(var(--u)*.14);font:400 max(calc(10px * var(--fl)),calc(var(--u)*.2))/1.1 var(--ft);letter-spacing:.18em;text-transform:uppercase;white-space:nowrap}
  .ra-h i{font:italic 400 max(calc(10px * var(--fl)),calc(var(--u)*.17))/1 var(--fs);letter-spacing:.02em;text-transform:none;color:var(--muted);margin-left:.7em}
  .ra-p{margin:0;font:italic 400 max(calc(9px * var(--fl)),calc(var(--u)*.14))/1.32 var(--fs);color:var(--muted)}
  .ra-lab{position:absolute;white-space:nowrap;line-height:1;pointer-events:none}
  .ra-lab b{font:400 max(calc(7.5px * var(--fl)),calc(var(--u)*.11))/1 var(--ft);letter-spacing:.14em;text-transform:uppercase}
  .ra-lab i{font:italic 400 max(calc(9px * var(--fl)),calc(var(--u)*.15))/1 var(--fs);margin-left:.45em}
  .ra-lab.hot b,.ra-lab.lim b{color:var(--accent)}
  .ra-lab.lim i{color:var(--accent)}
  .ra-lab.mut b{color:var(--muted)}
  .ra-ax{position:absolute;transform:translate(-100%,-50%);font:400 max(calc(7px * var(--fl)),calc(var(--u)*.1))/1 var(--ft);letter-spacing:.06em;color:var(--muted);padding-right:.5em}
  .ra-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .ra-leg{display:grid;grid-template-columns:auto 1fr auto;column-gap:.6em;row-gap:calc(var(--u)*.06);align-items:center}
  .ra-leg s{display:block;width:calc(var(--u)*.34);height:calc(var(--u)*.16);border:1px solid rgba(27,26,24,.45);border-radius:2px}
  .ra-leg span{font:400 max(calc(7.5px * var(--fl)),calc(var(--u)*.105))/1.1 var(--ft);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}
  .ra-leg em{font:italic 400 max(calc(9px * var(--fl)),calc(var(--u)*.14))/1 var(--fs);text-align:right}
  /* approvals path */
  .ra-st{position:absolute}
  .ra-st .n{position:absolute;left:0;top:0;transform:translate(-50%,-50%);width:max(calc(20px * var(--fl)),calc(var(--u)*.46));height:max(calc(20px * var(--fl)),calc(var(--u)*.46));border:1px solid var(--ink);border-radius:50%;background:var(--paper);display:grid;place-items:center;font:400 max(calc(9px * var(--fl)),calc(var(--u)*.18))/1 var(--ft)}
  .ra-st.hot .n{border-color:var(--accent);color:var(--accent)}
  .ra-st .t{position:absolute;left:calc(var(--u)*-.23);top:calc(var(--u)*.42);width:calc(var(--u)*3.9)}
  .ra-st h4{margin:0;font:400 max(calc(9px * var(--fl)),calc(var(--u)*.16))/1.2 var(--ft);letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}
  .ra-st .c{display:block;margin:calc(var(--u)*.05) 0 calc(var(--u)*.08);font:italic 400 max(calc(9px * var(--fl)),calc(var(--u)*.15))/1.2 var(--fs);color:var(--accent)}
  .ra-st ul{margin:0;padding:0;list-style:none}
  .ra-st li{font:400 max(calc(9.5px * var(--fl)),calc(var(--u)*.155))/1.28 var(--fs);color:var(--ink)}
  .ra-cal{display:flex;align-items:flex-end;gap:calc(var(--u)*.34)}
  .ra-chip{flex:none;padding-top:calc(var(--u)*.24);background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u)*.1)}
  .ra-chip b{display:block;font:400 max(calc(7px * var(--fl)),calc(var(--u)*.1))/1 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
  .ra-chip i{display:block;margin-top:calc(var(--u)*.05);font:italic 400 max(calc(10px * var(--fl)),calc(var(--u)*.2))/1.1 var(--fs);white-space:nowrap}
  .ra-chip u{text-decoration:none}
  .ra-chip i u{color:var(--muted);font-size:.8em;margin:0 .25em}
  .ra-chip.cf i{color:var(--muted)}
  .ra-chip.ew i{color:var(--accent)}
  /* compliance matrix */
  .ra-m{display:grid;grid-template-columns:var(--cols);grid-template-rows:calc(var(--u)*.45) repeat(var(--nr),calc(var(--u)*.93));column-gap:calc(var(--u)*.26)}
  .ra-m > div{padding:calc(var(--u)*.17) 0 0;background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u)*.1)}
  .ra-m .hd{font:400 max(calc(7.5px * var(--fl)),calc(var(--u)*.11))/1.2 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--muted);background:none;padding-top:0}
  .ra-m .it{font:400 max(calc(8px * var(--fl)),calc(var(--u)*.14))/1.3 var(--ft);letter-spacing:.14em;text-transform:uppercase}
  .ra-m .rq{font:400 max(calc(9.5px * var(--fl)),calc(var(--u)*.176))/1.3 var(--fs)}
  .ra-m .sc{font:italic 400 max(calc(9.5px * var(--fl)),calc(var(--u)*.176))/1.3 var(--fs);color:var(--accent);white-space:nowrap}
  .ra-m .rs{font:italic 400 max(calc(9.5px * var(--fl)),calc(var(--u)*.176))/1.3 var(--fs)}
  .ra-m .ss{display:flex;align-items:baseline;gap:.5em;font:400 max(calc(7.5px * var(--fl)),calc(var(--u)*.12))/1.9 var(--ft);letter-spacing:.16em;text-transform:uppercase;white-space:nowrap}
  .ra-d{flex:none;display:inline-block;width:max(calc(7px * var(--fl)),calc(var(--u)*.15));height:max(calc(7px * var(--fl)),calc(var(--u)*.15));border-radius:50%;background:var(--ink);transform:translateY(.08em)}
  .ra-d.variance{background:var(--accent)}
  .ra-d.confirm{background:transparent;box-shadow:inset 0 0 0 1.2px var(--ink)}
  .ra-ss-variance{color:var(--accent)}
  .ra-key{display:flex;gap:1.4em;align-items:baseline;font:400 max(calc(7.5px * var(--fl)),calc(var(--u)*.11))/1 var(--ft);letter-spacing:.16em;text-transform:uppercase;white-space:nowrap}
  .ra-key span{display:flex;gap:.5em;align-items:baseline}
  .ra-key em{font:italic 400 max(calc(9.5px * var(--fl)),calc(var(--u)*.16))/1 var(--fs);letter-spacing:0;text-transform:none;color:var(--muted)}
  .ra-bars{display:grid;grid-template-columns:var(--bl) 1fr auto;column-gap:.7em;row-gap:calc(var(--u)*.1);align-items:center}
  .ra-bars .k{font:400 max(calc(7.5px * var(--fl)),calc(var(--u)*.112))/1.15 var(--ft);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}
  .ra-bars .b{position:relative;height:calc(var(--u)*.2)}
  .ra-bars .b i{position:absolute;left:0;top:0;bottom:0;background:rgba(27,26,24,.2);border:1px solid rgba(27,26,24,.55);border-radius:2px}
  .ra-bars .b i.hot{background:rgba(192,122,44,.45);border-color:var(--accent)}
  .ra-bars .b u{position:absolute;top:calc(var(--u)*-.08);bottom:calc(var(--u)*-.08);border-left:1px dashed var(--accent)}
  .ra-bars .v{font:italic 400 max(calc(9.5px * var(--fl)),calc(var(--u)*.155))/1 var(--fs);text-align:right;white-space:nowrap}
  .ra-ol{margin:calc(var(--u)*.1) 0 0;padding:0;list-style:none;counter-reset:ra}
  .ra-ol li{counter-increment:ra;display:flex;gap:.6em;font:400 max(calc(9.5px * var(--fl)),calc(var(--u)*.155))/1.32 var(--fs)}
  .ra-ol li::before{content:counter(ra);flex:none;width:1.1em;font:400 max(calc(8px * var(--fl)),calc(var(--u)*.12))/1.6 var(--ft);color:var(--accent)}
  @media screen and (max-width:760px), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
    .fhtml:has(> .ra-root){position:relative;inset:auto}
    .ra-root{position:relative}
    .ra-root .ra-blk,.ra-root .ra-st{position:relative !important;left:auto !important;top:auto !important;width:auto !important;height:auto !important;margin:0 0 22px}
    .ra-root .ra-desk{display:none !important}
    .ra-root .ra-mob{display:block !important}
    .ra-st .n{position:static;transform:none;display:inline-grid;margin-right:10px;vertical-align:top}
    .ra-st .t{position:static;display:inline-block;vertical-align:top;width:calc(100% - 44px)}
    .ra-st{margin-bottom:14px !important}
    .ra-cal{flex-wrap:wrap;gap:14px 20px}
    .ra-m{grid-template-columns:1fr !important;grid-template-rows:none !important;column-gap:0}
    .ra-m .hd{display:none}
    .ra-m > div{background:none;padding:2px 0}
    .ra-m .it{padding-top:16px;margin-top:4px;background:var(--swoop) no-repeat 0 0 / 100% 7px}
    .ra-m .sc{padding-top:4px}
    .ra-m .ss{padding:6px 0 4px}
    .ra-bars{--bl:132px !important}
    .ra-bars .b{height:10px}
    .ra-leg{width:auto !important}
    .ra-leg s{width:22px;height:10px}
    .ra-root{padding-bottom:56px}
  }
  .ra-mob{display:none}
  </style>`;

  // sheet inches to an absolutely placed block in the field
  const place = (ctx, x, y, w, h, inner, cls = '', st = '') =>
    `<div class="${cls}" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))};width:${ctx.U(w)};${h ? `height:${ctx.U(h)};` : ''}${st}">${inner}</div>`;
  const P = v => +(v * 100).toFixed(3);
  const lbl = (f, t, s, k) => `<span class="lbl ${k || 'tag'}" style="left:${P(f[0])}%;top:${P(f[1])}%"><b>${t}</b>${s ? `<i>${s}</i>` : ''}</span>`;

  function northArrow(ctx, x, y, s) {
    const a = ctx.DRW.north || 0, r = a * Math.PI / 180;
    return `<div class="dnorth" style="left:${ctx.U(ctx.FX(x) - s / 2)};top:${ctx.U(ctx.FY(y) - s / 2)};width:${ctx.U(s)};height:${ctx.U(s)}" aria-label="North">
      <svg viewBox="-1 -1 2 2" aria-hidden="true"><circle r=".78"/><g transform="rotate(${a})"><path class="nd" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/><path class="nl" d="M0 .02 V.78"/></g></svg>
      <span style="left:${P(.5 + .62 * Math.sin(r))}%;top:${P(.5 - .62 * Math.cos(r))}%">N</span></div>`;
  }
  function gbar(ctx, sc, ticks) {
    const L = ticks[ticks.length - 1];
    let r = '';
    for (let k = 1; k < ticks.length; k++) r += `<rect x="${ticks[k - 1] / L}" y="0" width="${(ticks[k] - ticks[k - 1]) / L}" height="1" class="${k % 2 ? 'on' : ''}"/>`;
    return `<span class="gbar" style="width:${ctx.U(L * sc)}"><svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">${r}</svg>${ticks.map(v => `<span style="left:${P(v / L)}%">${v}${v === L ? ' ft' : ''}</span>`).join('')}</span>`;
  }
  const vtitle = (ctx, x, y, n, t, s, extra = '') => `<div class="dvt" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))}">${ctx.viewTitle(n, t, s)}${extra}</div>`;

  /* ---------------------------------------------------------------- F1.0 geometry (sheet inches) */
  const V1 = { x: 1.9, y: 4.05, w: 222 / 30, h: 188 / 30 };           // zoning and setbacks, 1 in = 30 ft
  const V2 = { x: 16.75, y: 4.05, w: 119.2 / 16, h: 103 / 16 };       // height envelope, 1/16 in = 1 ft, registers with A2.3
  const DT = { x: 25.35, y: 4.05, w: 6.0, h: 6.45 };                   // datum run
  const AP = { x: 1.9, y: 12.5, w: 29.5 };                           // approvals path
  const SPINE = AP.y + 0.62;
  const ST = [
    { t: 'Survey', c: 'XI.4 · Form 1', b: ['Stamped topo, 2 ft contours, trees 4 in and up', 'Re certification of the record survey', 'Gates the pre design meeting'] },
    { t: 'Orientation, pre design', c: 'XI.3 · XI.4', b: ['On site with Design Review', 'Setbacks strung, corners marked', 'Notebook sheet initialed, geotech statement signed'] },
    { t: 'Conceptual', c: 'XI.7 · no fee', b: ['Statement of intent, site plan', 'Floor plan, elevation sketches', 'Massing model optional', 'Raise the roof pitch here'], hot: 1 },
    { t: 'Preliminary', c: 'XI.8 · XI.9 · fee', b: ['24 x 36 set, rolled, site analysis', '1/8 in model with the topography', 'Staking verified on site', 'Approval valid one year'] },
    { t: 'Final', c: 'XI.10 · XI.11', b: ['Landscape, roof plan, sections', 'Color board, colors and materials form', 'Light cutsheets, plant list', 'Approval valid two years'] },
    { t: 'Placer County permit', c: 'XI.9 · 2025 CBC, CRC, Title 24', b: ['County takes plans after Preliminary', 'Prudent to wait for Final', 'Very High FHSZ, 2025 WUI Code', 'Energy, CALGreen, sprinklers'] },
    { t: 'Permission to begin', c: 'XI.11 · XII.3 · IV.18', b: ['Pre construction conference', 'No work before Final approval', 'Earthwork 5/1 to 10/15', 'Clearing starts by 9/1, confirm'] }
  ];
  const STW = AP.w / ST.length;
  const stX = i => AP.x + 0.3 + i * STW;
  const CAL = [
    ['Submit', '10/14/26', 'LCC', '10/21/26'], ['Submit', '11/11/26', 'LCC', '11/18/26'], ['Submit', '12/9/26', 'LCC', '12/16/26', 'site shows 12/19, confirm'],
    ['Submit', '1/13/27', 'LCC', '1/20/27', 'cf'], ['Submit', '2/10/27', 'LCC', '2/17/27', 'cf'], ['Submit', '3/10/27', 'LCC', '3/17/27', 'cf'], ['Submit', '4/14/27', 'LCC', '4/21/27', 'cf']
  ];
  const CALY = AP.y + 3.9;

  function f10(ctx) {
    const U = ctx.U;
    let h = CSS + '<div class="ra-root">';

    /* 1 · zoning and setbacks */
    const S = RA.site;
    const siteLabels = [
      lbl(S.f_road, 'Lahontan Drive', '', 'road'),
      lbl(S.f_sse, 'Snow storage', '30 ft easement', 'tag'),
      lbl(S.f_n, '20 ft', '', 'dim'), lbl(S.f_e, '25 ft', '', 'dim'), lbl(S.f_s, '20 ft', '', 'dim'),
      lbl(S.f_f, `about ${Math.round(RA.front[0])} ft`, '', 'dim'),
      lbl(S.f_build, 'Buildable area', 'inside the setbacks', 'tag'),
      lbl(RA.tree.f, 'The tree', 'kept', 'tag')
    ].join('');
    h += `<div class="view dv" style="left:${U(ctx.FX(V1.x))};top:${U(ctx.FY(V1.y))};width:${U(V1.w)};height:${U(V1.h)};--ar:${(V1.w / V1.h).toFixed(4)}">${RA.svg_site}${siteLabels}</div>`;
    h += northArrow(ctx, V1.x + V1.w - 0.35, V1.y + V1.h - 0.25, 0.62);
    h += vtitle(ctx, V1.x, V1.y + V1.h + 0.3, 1, 'Zoning and setbacks', '1 in = 30 ft', gbar(ctx, 1 / 30, [0, 20, 40, 80]));
    const zrows = [
      ['Zoning', 'RS PD 1.7 · Placer County'],
      ['Front setback', `50 ft · traced about ${Math.round(RA.front[1])} to ${Math.round(RA.front[0])} ft`],
      ['Side · rear', '20 ft · 25 ft'],
      ['Street easements', 'snow 30 ft · multi purpose 12.5 ft'],
      ['Impervious', `about ${fmt(C.impervious_sf)} sf · ${C.impervious_pct}% of 30%`],
      ['Roof coverage', `about ${fmt(C.roof_footprint)} sf · ${C.coverage_pct}%`],
      ['Living area', `about ${fmt(C.conditioned)} sf of 6,000`],
      ['Footprint slope', `about ${RA.slope}% · the 30 ft limit governs`],
      ['Fire', 'Very High FHSZ · 2025 WUI Code']
    ];
    h += place(ctx, 10.05, V1.y, 5.75, 0, `<h3>Zoning and site</h3><ul>${zrows.map(([k, v]) => `<li><span class="k">${k}</span><span class="v">${v}</span></li>`).join('')}</ul>
      <p>Design Book III.6 to III.8, VII.4. Lines as traced for FA; the Development Notebook sheet sets the numbers. Lot about ${fmt(C.lot_sf)} sf by listing, the model's lines close near ${fmt(RA.lot_model)} sf. Confirm on survey.</p>`, 'dtab');

    /* 2 · height envelope: A2.3 roof linework under the height bands */
    const A23 = ctx.DRW && ctx.DRW.sheets && ctx.DRW.sheets['A2.3'] && ctx.DRW.sheets['A2.3'].views[0];
    const base = A23 && A23.svg ? `<div style="position:absolute;inset:0;opacity:.42;filter:grayscale(1)">${A23.svg}</div>` : '';
    const sp = RA.spots;
    const hl = [
      `<span class="lbl spot r hot" style="left:${P(sp.tip.f[0])}%;top:${P(sp.tip.f[1])}%"><b>Tip ${ft1(sp.tip.el)}</b><i>${ft1(C.heights.tip_over_grade)} ft over grade</i></span>`,
      `<span class="lbl spot r hot" style="left:${P(sp.south.f[0])}%;top:${P(sp.south.f[1])}%"><b>South corner ${ft1(sp.south.el)}</b><i>about ${ft1(sp.south.over)} ft, the tightest</i></span>`,
      `<span class="lbl spot" style="left:${P(sp.garage.f[0])}%;top:${P(sp.garage.f[1])}%"><b>Garage roof ${ft1(sp.garage.el)}</b><i>about ${ft1(sp.garage.over)} ft</i></span>`,
    ].join('');
    const tot = Object.values(RA.bands).reduce((a, b) => a + b, 0);
    const pc = k => `${Math.round(100 * RA.bands[k] / tot)}%`;
    const leg = `<div class="ra-leg">
      <s style="background:rgba(27,26,24,.04)"></s><span>Under 20 ft</span><em>${pc('b0')}</em>
      <s style="background:rgba(27,26,24,.16)"></s><span>20 to 25 ft</span><em>${pc('b1')}</em>
      <s style="background:rgba(27,26,24,.32)"></s><span>25 to 28 ft</span><em>${pc('b2')}</em>
      <s style="background:rgba(192,122,44,.72);border-color:var(--accent)"></s><span>28 to 30 ft</span><em>${Math.max(1, Math.round(100 * RA.bands.b3 / tot))}%</em>
      <span style="grid-column:1 / -1;margin-top:.3em;color:var(--muted)">Roof over natural grade · share of roof</span></div>`;
    h += `<div class="view dv" style="left:${U(ctx.FX(V2.x))};top:${U(ctx.FY(V2.y))};width:${U(V2.w)};height:${U(V2.h)};--ar:${(V2.w / V2.h).toFixed(4)}">${base}${RA.svg_height}${hl}</div>`;
    h += place(ctx, V2.x + 0.02 * V2.w, V2.y + 0.55 * V2.h, 2.55, 0, leg, 'ra-blk');
    h += vtitle(ctx, V2.x, V2.y + V2.h + 0.3, 2, 'Height envelope', '1/16 in = 1 ft · FA grade', gbar(ctx, 1 / 16, [0, 8, 16, 32]));

    /* datum run: every level and roof against the 30 ft line */
    const E0 = 5990, E1 = 6028, top = DT.y + 0.35, bot = DT.y + DT.h - 0.2;
    const ey = e => top + (E1 - e) / (E1 - E0) * (bot - top);
    const ax = DT.x + 0.55, lx = DT.x + 1.35;
    const tipGrade = sp.tip.grade;
    const items = [
      [RA.ridge_limit, 'Test one', `30 ft over average grade ${ft1(RA.avg_grade)}`, 'lim'],
      [tipGrade + 30, 'The 30 ft line', 'over grade at the tip', 'lim'],
      [sp.tip.el, `${ft1(sp.tip.el)} · Tip`, `${ft1(C.heights.tip_over_grade)} ft over grade`, 'hot'],
      [sp.south.el, `${ft1(sp.south.el)} · South corner`, `about ${ft1(sp.south.over)} ft over grade`, 'hot'],
      [RA.chim[0].cap, `${ft1(RA.chim[0].cap)} · Chimney caps`, `and ${ft1(RA.chim[1].cap)}`, ''],
      [C.heights.garage_roof, `${ft1(C.heights.garage_roof)} · Garage roof`, '', ''],
      [sp.bridge.el, `${ft1(sp.bridge.el)} · Bridge roof`, '', ''],
      [C.heights.beam, `${ft1(C.heights.beam)} · Fold beam`, '', ''],
      [C.levels.primary.el, `${ft1(C.levels.primary.el)} · Primary suite`, '', ''],
      [C.levels.main.el, `${ft1(C.levels.main.el)} · Main level`, '', ''],
      [tipGrade, `${ft1(tipGrade)} · Grade at the tip`, 'natural, FA', 'mut'],
      [C.levels.lower.el, `${ft1(C.levels.lower.el)} · Lower level`, '', '']
    ].sort((a, b) => b[0] - a[0]);
    // spread labels: at least 0.27 in apart, as close to their datum as they can sit
    const gap = 0.27, ly = items.map(it => ey(it[0]));
    for (let k = 0; k < 40; k++) {
      for (let i = 1; i < ly.length; i++) if (ly[i] - ly[i - 1] < gap) { const m = (ly[i] + ly[i - 1]) / 2; ly[i - 1] = m - gap / 2; ly[i] = m + gap / 2; }
      for (let i = 0; i < ly.length; i++) ly[i] = Math.max(top - 0.25, Math.min(bot + 0.1, ly[i]));
    }
    const L = (x, y) => `${(x - DT.x).toFixed(3)} ${(y - DT.y).toFixed(3)}`;
    let g = `<path d="M${L(ax, ey(E1))} L${L(ax, ey(E0))}" stroke="#1b1a18" stroke-width="1" vector-effect="non-scaling-stroke" fill="none"/>`;
    let axl = '';
    for (let e = E0; e <= E1; e += 2) {
      const big = e % 10 === 0;
      g += `<path d="M${L(ax - (big ? .16 : .08), ey(e))} L${L(ax, ey(e))}" stroke="#1b1a18" stroke-width="${big ? 1 : .6}" vector-effect="non-scaling-stroke"/>`;
      if (big) axl += `<span class="ra-ax" style="left:${U(ax - .17 - DT.x)};top:${U(ey(e) - DT.y)}">${e}</span>`;
    }
    // natural grade band under the tip, lightly toned
    g += `<rect x="${(ax - .5 - DT.x).toFixed(3)}" y="${(ey(tipGrade) - DT.y).toFixed(3)}" width=".5" height="${(ey(E0) - ey(tipGrade)).toFixed(3)}" fill="#1b1a18" fill-opacity=".08"/>`;
    let labs = '';
    items.forEach((it, i) => {
      const y0 = ey(it[0]), y1 = ly[i], lim = it[3] === 'lim';
      g += `<path d="M${L(lim ? ax - .3 : ax, y0)} L${L(ax + .22, y0)} L${L(lx - .12, y1)} L${L(lx - .04, y1)}" fill="none" stroke="${lim || it[3] === 'hot' ? '#c07a2c' : '#1b1a18'}" stroke-width="${lim ? 1 : .7}" ${lim ? 'stroke-dasharray="3 2"' : ''} vector-effect="non-scaling-stroke" opacity="${lim ? 1 : .75}"/>`;
      if (it[3] === 'hot') g += `<circle cx="${(ax - DT.x).toFixed(3)}" cy="${(y0 - DT.y).toFixed(3)}" r=".05" fill="#c07a2c"/>`;
      labs += `<span class="ra-lab ${it[3]}" style="left:${U(lx - DT.x)};top:${U(y1 - DT.y)};transform:translateY(-50%)"><b>${it[1]}</b>${it[2] ? `<i>${it[2]}</i>` : ''}</span>`;
    });
    h += place(ctx, DT.x, DT.y, DT.w, DT.h, `<svg class="ra-svg" viewBox="0 0 ${DT.w} ${DT.h}" preserveAspectRatio="none" aria-hidden="true">${g}</svg>${axl}${labs}`, 'ra-blk ra-desk');
    h += place(ctx, DT.x, DT.y - 0.05, DT.w, 0, `<h3 class="ra-h">Datum<i>elevations, ft</i></h3>`, 'ra-blk ra-desk');
    h += `<div class="dtab ra-mob"><h3>Datum, elevations</h3><ul>${items.map(it => `<li><span class="k">${it[1].replace(/^[0-9.]+ · /, '')}</span><span class="v">${it[3] === 'lim' ? ft1(it[0]) + ' · ' + it[2] : ft1(it[0]) + (it[2] ? ' · ' + it[2] : '')}</span></li>`).join('')}</ul></div>`;
    h += place(ctx, DT.x, V2.y + V2.h + 0.22, DT.w, 0, `<p class="ra-p">VII.5, three tests: the ridge within 30 ft of average natural grade, no point over 30 ft above the grade beneath it, and never overly tall. Chimney masses may rise 4 ft more. FA grade, confirm on survey.</p>`, 'ra-blk');

    /* 3 · approvals path */
    const x0 = stX(0), x1 = stX(ST.length - 1);
    const W = AP.w, Hh = 4.2;
    const sx = x => (x - AP.x).toFixed(3), sy = y => (y - AP.y).toFixed(3);
    let sv = `<path d="M${sx(x0)} ${sy(SPINE)} C${sx(x0 + 8)} ${sy(SPINE + .09)} ${sx(x1 - 9)} ${sy(SPINE + .12)} ${sx(x1)} ${sy(SPINE)}" fill="none" stroke="#1b1a18" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    // the variance rides over, from Conceptual to Preliminary
    const va = stX(2), vb = stX(3);
    sv += `<path d="M${sx(va + .25)} ${sy(SPINE - .2)} C${sx(va + 1.2)} ${sy(SPINE - .62)} ${sx(vb - 1.2)} ${sy(SPINE - .62)} ${sx(vb - .25)} ${sy(SPINE - .2)}" fill="none" stroke="#c07a2c" stroke-width="1" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>`;
    // the survey gate
    sv += `<path d="M${sx(stX(0) + STW / 2 + .05)} ${sy(SPINE - .3)} V${sy(SPINE + .3)}" stroke="#c07a2c" stroke-width="1.4" vector-effect="non-scaling-stroke"/>`;
    // County branch leaves after Preliminary
    let st = '';
    ST.forEach((s, i) => {
      st += place(ctx, stX(i), SPINE, 0, 0, `<span class="n">${i}</span><div class="t"><h4>${s.t}</h4><span class="c">${s.c}</span><ul>${s.b.map(b => `<li>${b}</li>`).join('')}</ul></div>`, `ra-st${s.hot ? ' hot' : ''}`);
    });
    h += place(ctx, AP.x, AP.y, W, Hh, `<svg class="ra-svg" viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" aria-hidden="true">${sv}</svg>`, 'ra-blk ra-desk');
    h += st;
    h += place(ctx, (va + vb) / 2 - 2.1, SPINE - 0.62, 4.2, 0, `<span class="ra-lab lim" style="position:relative;display:block;text-align:center;transform:translateY(-100%)"><b>Design Variance Request</b><i>roof pitch · XI.13 · $500</i></span>`, 'ra-blk ra-desk');
    // LCC calendar
    const chips = CAL.map(c => `<div class="ra-chip${c[4] === 'cf' ? ' cf' : ''}"><b>${c[0]} <u>·</u> ${c[2]}</b><i>${c[1]}<u>to</u>${c[3]}</i>${c[4] && c[4] !== 'cf' ? `<b style="margin-top:.35em;text-transform:none;letter-spacing:.02em;font-family:var(--fs);font-style:italic;font-size:max(calc(8.5px * var(--fl)),calc(var(--u)*.13))">${c[4]}</b>` : ''}</div>`).join('') +
      `<div class="ra-chip ew"><b>Earthwork window</b><i>5/1<u>to</u>10/15</i></div>`;
    h += place(ctx, AP.x, CALY, 6.2, 0, `<h3 class="ra-h" style="margin-bottom:.35em">LCC calendar</h3><p class="ra-p">Submit the 2nd Wednesday, the Commission meets the following Wednesday and answers in writing within 10 days (XI.9). 2027 by the pattern, not yet published.</p>`, 'ra-blk');
    h += place(ctx, AP.x + 6.6, CALY + 0.02, AP.w - 6.6, 0, `<div class="ra-cal">${chips}</div>`, 'ra-blk');
    h += vtitle(ctx, AP.x, CALY + 1.25, 3, 'Approvals path', 'Lahontan to Placer County · not to scale');
    return h + '</div>';
  }

  /* ---------------------------------------------------------------- A1.3 compliance matrix */
  const ch = RA.chim, gl = RA.glass;
  const paved = C.drive + C.apron_allowance;
  const ROWS = [
    ['Setbacks', 'Front 50 ft, side 20 ft, rear 25 ft unless the Development Notebook shows otherwise. Nothing in them but the drive and utilities, overhangs and decks included.', 'III.6',
      `Walls and terraces sit inside the lines as traced. The front line traces about ${Math.round(RA.front[1])} to ${Math.round(RA.front[0])} ft, not 50, and the garage roof edge crosses it by about 9 in at the street corner.`, 'confirm'],
    ['Impervious coverage', '30% of the gross homesite at most, the exact figure on the Development Notebook sheet. Clear of setbacks but for one drive up to 12 ft wide.', 'III.7',
      `About ${fmt(C.impervious_sf)} sf, ${C.impervious_pct}% of about ${fmt(C.lot_sf)} sf. The model's lot lines close near ${fmt(RA.lot_model)} sf, which reads about ${ft1(100 * C.impervious_sf / RA.lot_model)}%. Tight, the survey decides.`, 'confirm'],
    ['Living area', '6,000 sf at most on most homesites, heated area measured through the walls at every level.', 'VII.4',
      `About ${fmt(C.conditioned)} sf conditioned, well under.`, 'meets'],
    ['Height', 'No point over 30 ft above the natural grade beneath it, the ridge within 30 ft of average grade. 36 ft only where the footprint slopes over 15%.', 'VII.5',
      `Tip ${ft1(RA.spots.tip.el)} at ${ft1(C.heights.tip_over_grade)} ft. The south corner at ${ft1(RA.spots.south.el)} runs about ${ft1(RA.spots.south.over)} ft, the tightest point. Footprint slope about ${RA.slope}%, so 30 ft governs.`, 'meets'],
    ['Roof form and pitch', 'Pitched roofs, a predominant 4:12 minimum, up to one third may read flat at 1/4:12, 16:12 at most. Substantial overhangs at every edge.', 'VII.13',
      `The ribbon holds about ${ft1(RA.pitch.ok)}% of its roof at 4:12 or steeper, ${Math.round(RA.pitch.flat)}% flat, the rest between. Deep overhangs, the wings step with the land. Ask at Conceptual.`, 'variance'],
    ['Roofing', 'Composition, metal or slate, Class A, no wood shakes. Flat appearing roofs finished in colored aggregate ballast.', 'IX.5',
      'Standing seam metal at 18 in, matte, Class A. Raise the ballast rule for the flattest runs with the variance.', 'confirm'],
    ['Glazing', 'No excessive undivided glass. Over 140 sf per wall plane only with LCC approval and reflectivity mitigation. Vertical and square units, no reflective coatings.', 'VII.15 · IX.6',
      `${RA.glass_n} wall faces carry over 140 sf, the largest about ${fmt(RA.glass_max)} sf on the north wing court face. Square panes 4 by 8 ft at most between glulam posts, deep overhangs, clear glass. Raked glass only at the living room tip.`, 'confirm'],
    ['Window frames', 'Wood windows, the exterior may be clad in a matte finish. No raw metal, no clear anodized finishes.', 'IX.6 · IX.7',
      'Frame line still open. Carry wood with a matte dark cladding and matte steel at the posts.', 'confirm'],
    ['Chimneys', '18 to 60 sf in plan. Masses up to 4 ft over the allowable roof height, higher only where code requires. 1/2 in spark arrester, EPA Phase II or gas.', 'VII.20 · VII.5',
      `Board form concrete, about ${ch[0].area} and ${ch[1].area} sf, caps ${ft1(ch[0].cap)} and ${ft1(ch[1].cap)}, under the 30 ft line and 4 ft over the roofs they leave. Roofs within 10 ft reach about ${ft1(ch[0].within10)} and ${ft1(ch[1].within10)}, so check CRC R1003.9.`, 'confirm'],
    ['Exterior lighting', 'No accent, up or flood lighting, lamps concealed. Soft light only where people walk and gather, none in setbacks. Cutsheets with Final.', 'VIII.2',
      'Shielded fixtures at the entry, walks and terraces, the tree left dark. Fixtures and locations with the Final set.', 'confirm'],
    ['Colors', 'The hues of the setting, never brighter. Field and trim LRV 15 to 40, matte finishes, color changes only at inside corners.', 'IX.2',
      'Silvered cedar, dark steel, board form concrete, warm plaster. Verify the dark steel LRV, samples at the on site mockup.', 'confirm'],
    ['Wall materials', 'Stone and wood predominant, wood at least 30% of wall area net of openings, no change at an outside corner, semi transparent stains.', 'IX.4',
      'Vertical cedar boards lead. Board form concrete and plaster by LCC review, material changes turned at inside corners.', 'confirm'],
    ['Snow', 'Storage at least 30% of the paved area it serves, off the 30 ft easement and out of view. No roof shedding onto entries, decks or drives.', 'III.9 · VII.14',
      `Drive and apron about ${fmt(paved)} sf, so about ${fmt(Math.ceil(paved * 0.3 / 10) * 10)} sf of storage to show clear of the easement. Check the ribbon's shed paths at the entry and garage doors.`, 'confirm'],
    ['Defensible space', 'Thin, not clear, within 30 ft of the house. No branches within 10 ft of a chimney, spark arresters, new trees 6 ft off the walls.', 'IV.20',
      `The signature tree stays, limbed up, its trunk about ${Math.round(RA.tree.house)} ft from the walls and ${RA.tree.chim} ft from the nearest chimney. Very High FHSZ, 2025 WUI Code, Zone 0 rules pending.`, 'confirm'],
    ['Slab on grade', 'Prohibited but for garages, basements and outbuildings, otherwise by variance.', 'XI.14',
      'Framed floors over a conditioned crawlspace, slab at the garage only.', 'meets']
  ];
  const WORD = { meets: 'Meets', variance: 'Variance', confirm: 'Confirm' };
  const count = k => ROWS.filter(r => r[4] === k).length;
  const MX = { x: 1.9, y: 4.0, w: 21.55 };
  const RC = { x: 24.25, w: 7.15 };

  function a13(ctx) {
    let h = CSS + '<div class="ra-root">';
    const cols = [2.2, 6.9, 1.45, 8.75, 1.35].map(v => ctx.U(v)).join(' ');
    let m = ['Item', 'Design Book asks', 'Section', 'How Walsh responds', 'Status'].map(t => `<div class="hd">${t}</div>`).join('');
    ROWS.forEach(r => {
      m += `<div class="it">${r[0]}</div><div class="rq">${r[1]}</div><div class="sc">${r[2]}</div><div class="rs">${r[3]}</div>` +
        `<div class="ss ra-ss-${r[4]}"><i class="ra-d ${r[4]}"></i>${WORD[r[4]]}</div>`;
    });
    h += place(ctx, MX.x, MX.y, MX.w, 0, `<div class="ra-m" style="--cols:${cols};--nr:${ROWS.length}">${m}</div>`, 'ra-blk');

    // right column: key, roof pitch, glazing, the variance ask
    let y = MX.y;
    h += place(ctx, RC.x, y, RC.w, 0, `<h3 class="ra-h">Status<i>Ribbon scheme, FA2</i></h3>
      <div class="ra-key"><span><i class="ra-d"></i>Meets <em>${count('meets')}</em></span><span style="color:var(--accent)"><i class="ra-d variance"></i>Variance <em>${count('variance')}</em></span><span><i class="ra-d confirm"></i>Confirm <em>${count('confirm')}</em></span></div>`, 'ra-blk');
    y += 1.05;
    const pr = RA.pitch;
    const prow = [['Reads flat, 1/4:12', pr.flat, 33.3, 'up to 1/3'], ['1/4 to 2:12', pr.low], ['2 to 4:12', pr.mid], ['4:12 and up', pr.ok, 50, 'predominant', 1]];
    h += place(ctx, RC.x, y, RC.w, 0, `<h3 class="ra-h">Roof pitch<i>share of roof area · VII.13</i></h3>
      <div class="ra-bars" style="--bl:${ctx.U(1.75)}">${prow.map(r => `<span class="k">${r[0]}</span><span class="b"><i class="${r[4] ? 'hot' : ''}" style="width:${r[1]}%"></i>${r[2] ? `<u style="left:${r[2]}%"></u>` : ''}</span><span class="v">${ft1(r[1])}%</span>`).join('')}</div>
      <p class="ra-p" style="margin-top:.5em">Dashed marks what the book allows: a third may read flat, and 4:12 must lead. The ribbon inverts it, hence the variance.</p>`, 'ra-blk');
    y += 2.95;
    const gmax = Math.max(800, Math.ceil(RA.glass_max / 100) * 100);
    h += place(ctx, RC.x, y, RC.w, 0, `<h3 class="ra-h">Glazing by wall face<i>sf · VII.15</i></h3>
      <div class="ra-bars" style="--bl:${ctx.U(3.05)}">${gl.map((g, i) => `<span class="k">${g.name}</span><span class="b"><i class="${i === 0 ? 'hot' : ''}" style="width:${(100 * g.sf / gmax).toFixed(2)}%"></i><u style="left:${(100 * 140 / gmax).toFixed(2)}%"></u></span><span class="v">${fmt(g.sf)}</span>`).join('')}</div>
      <p class="ra-p" style="margin-top:.5em">Faces over 140 sf, dashed at 140. Measured from the model, glass area by coplanar face. LCC may approve more with the mitigations: smaller units, deep overhangs, recesses, low reflectance glass.</p>`, 'ra-blk');
    y += 3.85;
    h += place(ctx, RC.x, y, RC.w, 0, `<h3 class="ra-h">The variance ask<i>Form 7 · XI.13</i></h3>
      <ol class="ra-ol"><li>Name the section, VII.13, and its page.</li><li>The extent: a ribbon under 4:12, about a tenth at 4:12 or more.</li><li>Why: one fold beam, a lifted tip, snow held on the roof.</li><li>The benefit to neighbors and the land.</li><li>Mitigation: deep overhangs, matte seam, stepped masses.</li><li>Model views and sections to show it.</li></ol>
      <p class="ra-p" style="margin-top:.4em">$500 per submittal, several requests under one fee. LCC decides first, then Placer County.</p>`, 'ra-blk');
    h += place(ctx, RC.x, 15.55, RC.w, 0, `<h3 class="ra-h">Sources</h3><p class="ra-p">Lahontan Community Design Book, Rev 4/11, by section. Design Variance Request, Pre Design, Conceptual, Preliminary and Final submittal forms, Exterior Colors and Materials form. Heights, pitch, glazing and chimney areas measured from the pocket model, FA2 Ribbon, on FA grade 9/30/26. The Development Notebook sheet for Lot 235 and a stamped survey govern.</p>`, 'ra-blk');
    return h + '</div>';
  }

  const DAT_F = ['RS PD 1.7 · Placer County', `Tightest roof about ${ft1(RA.spots.south.over)} ft over grade`, 'Ribbon pitch asks for a variance', 'LCC submittals the 2nd Wednesday'];
  const nx = (V, f) => [V.x + f[0] * V.w, V.y + f[1] * V.h];

  LIVING_SHEETS.push({
    id: 'F1.0', group: 'Feasibility', title: 'Regulatory report', short: 'Regulatory report', foot: 'Regulatory report',
    scale: 'As noted', issued: [2, 4],
    cap: 'What Lahontan and Placer County ask of Lot 235, measured against the model, and the path from pre design to permit.',
    data: DAT_F,
    notes: [
      { text: 'every roof under 30 ft', t: [20.2, 3.7], p: nx(V2, RA.spots.tip.f), a: 'l' },
      { text: 'the survey gates pre design', t: [5.3, 11.8], p: [stX(0) + STW / 2 + 0.05, SPINE - 0.3], a: 'l' },
      { text: 'LCC meets the 2nd Wednesday', t: [12.2, CALY - 0.3], p: [AP.x + 6.9, CALY + 0.55], a: 'l' }
    ],
    html: f10
  });

  LIVING_SHEETS.push({
    id: 'A1.3', group: 'Architectural', title: 'Design review compliance', short: 'Design review compliance', foot: 'Design review compliance',
    scale: 'None', issued: [4],
    cap: 'The Lahontan Design Book, line by line, against the Ribbon scheme. One variance to ask for, the rest to prove on survey.',
    data: ['Design Book Rev 4/11', `${count('meets')} meet · ${count('variance')} variance · ${count('confirm')} confirm`, 'Variance fee $500 per submittal', 'FA grade, confirm on survey'],
    notes: [
      { text: 'the ribbon asks for a variance', t: [24.35, 7.72], p: [22.31, 8.43], a: 'l' }
    ],
    html: a13
  });
})();
