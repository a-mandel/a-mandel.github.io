/* height crew (9/30/26): A1.4 Building height, method and calculation.
   Built by sheets/tools/height/build_height.py from tools/height/height.src.js: edit the template, then rebuild.
   Heights are measured from the pocket model's roofing over the FA terrain (natural grade, before grading), about,
   confirm on survey. Rules: Lahontan Community Design Book Rev 4/11, VII.5 and XII.15. */
(function () {
  const HT = /*@DATA@*/null;
  const T1 = HT.test1;
  const d1 = n => (Math.round(n * 10) / 10).toFixed(1);
  const d2 = n => (Math.round(n * 100) / 100).toFixed(2);
  const inch = ft => Math.round(ft * 12 * 8) / 8;               // feet to inches, nearest 1/8
  const inTxt = ft => { const v = Math.round(ft * 12 * 8) / 8, w = Math.floor(v), r = Math.round((v - w) * 8);
    const fr = r ? ['', '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8'][r] : ''; return (w ? w + (fr ? ' ' + fr : '') : fr) + ' in'; };
  const P = v => +(v * 100).toFixed(3);
  const byKey = k => HT.pts.find(p => p.key === k);
  const TIP = byKey('tip'), SC = byKey('south');

  const CSS = `<style>
  .ht-b{position:absolute}
  .ht-v{position:absolute}
  .ht-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .ht-svg .h{fill:none;stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke}
  .ht-l{position:absolute;white-space:nowrap;line-height:1.1;pointer-events:none;transform:translate(-50%,-50%)}
  .ht-l.l{transform:translate(0,-50%)} .ht-l.r{transform:translate(-100%,-50%)}
  .ht-l.a{transform:translate(0,-100%)} .ht-l.ar{transform:translate(-100%,-100%)} .ht-l.b{transform:translate(0,0)}
  .ht-l b{display:block;font:400 max(calc(7px * var(--fl)),calc(var(--u)*.1))/1.2 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--ink)}
  .ht-l i{display:block;font:italic 400 max(calc(8.5px * var(--fl)),calc(var(--u)*.13))/1.15 var(--fs);color:var(--muted)}
  .ht-l.o b,.ht-l.o i{color:var(--accent)}
  .ht-l.bg{background:rgba(246,245,241,.86);padding:.1em .3em}
  .ht-l.b2{transform:translate(-100%,0)}
  .ht-l.k i{color:var(--ink)}
  .ht-bub{position:absolute;transform:translate(-50%,-50%);width:max(calc(15px * var(--fl)),calc(var(--u)*.3));height:max(calc(15px * var(--fl)),calc(var(--u)*.3));border:1px solid var(--ink);border-radius:50%;background:rgba(246,245,241,.9);display:grid;place-items:center;font:400 max(calc(7.5px * var(--fl)),calc(var(--u)*.13))/1 var(--ft);pointer-events:none}
  .ht-bub.o{border-color:var(--accent);color:var(--accent)}
  .ht-h{margin:0 0 calc(var(--u)*.12);font:400 max(calc(10px * var(--fl)),calc(var(--u)*.19))/1.1 var(--ft);letter-spacing:.18em;text-transform:uppercase;white-space:nowrap}
  .ht-h i{font:italic 400 max(calc(10px * var(--fl)),calc(var(--u)*.16))/1 var(--fs);letter-spacing:.02em;text-transform:none;color:var(--muted);margin-left:.7em}
  .ht-p{margin:0 0 calc(var(--u)*.1);font:400 max(calc(9px * var(--fl)),calc(var(--u)*.158))/1.34 var(--fs);color:var(--ink)}
  .ht-p em{font-style:italic;color:var(--muted)}
  .ht-p u{text-decoration:none;font:400 max(calc(7.5px * var(--fl)),calc(var(--u)*.105))/1 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-right:.5em}
  .ht-mt{position:absolute;left:0;right:0;top:calc(100% + var(--u)*.14);display:flex;gap:calc(var(--u)*.14);align-items:flex-start}
  .ht-mt .vn{width:max(calc(var(--fl)*17px),calc(var(--u)*.38));height:max(calc(var(--fl)*17px),calc(var(--u)*.38));font-size:max(calc(var(--fl)*8.5px),calc(var(--u)*.15))}
  .ht-mt b{display:block;font:400 max(calc(8px * var(--fl)),calc(var(--u)*.14))/1.2 var(--ft);letter-spacing:.14em;text-transform:uppercase}
  .ht-mt i{display:block;font:italic 400 max(calc(9px * var(--fl)),calc(var(--u)*.14))/1.2 var(--fs);color:var(--muted);white-space:normal}
  .ht-leg{display:grid;grid-template-columns:auto auto auto;column-gap:.6em;row-gap:calc(var(--u)*.05);align-items:center}
  .ht-leg s{display:block;width:calc(var(--u)*.3);height:calc(var(--u)*.14);border:1px solid rgba(27,26,24,.35);border-radius:2px}
  .ht-leg span{font:400 max(calc(7px * var(--fl)),calc(var(--u)*.1))/1.1 var(--ft);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}
  .ht-leg em{font:italic 400 max(calc(8.5px * var(--fl)),calc(var(--u)*.13))/1 var(--fs);text-align:right;color:var(--muted)}
  .ht-tab{display:grid;grid-template-columns:var(--cols);column-gap:calc(var(--u)*.16)}
  .ht-tab > div{padding:calc(var(--u)*.1) 0 calc(var(--u)*.05);background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u)*.08);font:400 max(calc(9px * var(--fl)),calc(var(--u)*.15))/1.2 var(--fs);white-space:nowrap;font-variant-numeric:lining-nums tabular-nums}
  .ht-tab .hd{background:none;padding-top:0;font:400 max(calc(7px * var(--fl)),calc(var(--u)*.1))/1.2 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);white-space:normal}
  .ht-tab .nm{font:400 max(calc(7.5px * var(--fl)),calc(var(--u)*.115))/1.5 var(--ft);letter-spacing:.12em;text-transform:uppercase}
  .ht-tab .n{text-align:center}
  .ht-tab .n span{display:inline-grid;place-items:center;width:1.55em;height:1.55em;border:1px solid var(--ink);border-radius:50%;font:400 max(calc(7px * var(--fl)),calc(var(--u)*.1))/1 var(--ft)}
  .ht-tab .num{text-align:right;font-style:italic}
  .ht-tab .o{color:var(--accent)}
  .ht-tab .n span.o{border-color:var(--accent)}
  .ht-tab .st{font:400 max(calc(7px * var(--fl)),calc(var(--u)*.1))/1.9 var(--ft);letter-spacing:.14em;text-transform:uppercase}
  .ht-tab .t1{font-style:italic}
  .ht-dat{position:absolute;right:calc(100% + var(--u)*.06);transform:translateY(-50%);font:400 max(calc(7px * var(--fl)),calc(var(--u)*.095))/1 var(--ft);letter-spacing:.06em;color:var(--muted);white-space:nowrap}
  .ht-datl{position:absolute;right:100%;width:calc(var(--u)*.08);border-top:1px solid rgba(27,26,24,.45)}
  @media screen and (max-width:760px), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
    .fhtml:has(> .ht-root){position:relative;inset:auto}
    .ht-root{position:relative;padding-bottom:56px}
    .ht-root .ht-b{position:relative !important;left:auto !important;top:auto !important;width:auto !important;height:auto !important;margin:0 0 26px}
    .ht-root .ht-v{position:relative !important;left:auto !important;top:auto !important;width:100% !important;height:auto !important;aspect-ratio:var(--ar)}
    .ht-root .ht-v.sec{width:86% !important;margin-left:14%}
    .ht-root .ht-mgrid{display:block}
    .ht-root .ht-mgrid .ht-v{margin-bottom:64px}
    .ht-tab{--cols:22px 1fr auto auto !important;row-gap:0}
    .ht-tab .x{display:none}
    .ht-root .ht-mob-hide{display:none}
    .ht-leg{width:auto;justify-content:start}
    .ht-leg s{width:22px;height:10px}
  }
  </style>`;

  const place = (ctx, x, y, w, h, inner, cls = '', st = '') =>
    `<div class="ht-b ${cls}" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))};width:${ctx.U(w)};${h ? `height:${ctx.U(h)};` : ''}${st}">${inner}</div>`;
  const lab = (f, t, s, k = '') => `<span class="ht-l ${k}" style="left:${P(f[0])}%;top:${P(f[1])}%">${t ? `<b>${t}</b>` : ''}${s ? `<i>${s}</i>` : ''}</span>`;
  function gbar(ctx, sc, ticks) {
    const L = ticks[ticks.length - 1];
    let r = '';
    for (let k = 1; k < ticks.length; k++) r += `<rect x="${ticks[k - 1] / L}" y="0" width="${(ticks[k] - ticks[k - 1]) / L}" height="1" class="${k % 2 ? 'on' : ''}"/>`;
    return `<span class="gbar" style="width:${ctx.U(L * sc)}"><svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">${r}</svg>${ticks.map(v => `<span style="left:${P(v / L)}%">${v}${v === L ? ' ft' : ''}</span>`).join('')}</span>`;
  }
  const vtitle = (ctx, x, y, n, t, s, extra = '') => `<div class="dvt ht-b" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))}">${ctx.viewTitle(n, t, s)}${extra}</div>`;
  function northArrow(ctx, x, y, s) {
    const a = ctx.DRW.north || 0, r = a * Math.PI / 180;
    return `<div class="dnorth ht-mob-hide" style="left:${ctx.U(ctx.FX(x) - s / 2)};top:${ctx.U(ctx.FY(y) - s / 2)};width:${ctx.U(s)};height:${ctx.U(s)}" aria-label="North">
      <svg viewBox="-1 -1 2 2" aria-hidden="true"><circle r=".78"/><g transform="rotate(${a})"><path class="nd" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/><path class="nl" d="M0 .02 V.78"/></g></svg>
      <span style="left:${P(.5 + .62 * Math.sin(r))}%;top:${P(.5 - .62 * Math.cos(r))}%">N</span></div>`;
  }

  /* ---------------------------------------------------------------- layout, sheet inches */
  const MW = 3.9, MH = 2.8, MY = 4.1, MX = i => 1.9 + i * 4.18;          // four method diagrams, not to scale
  const SEC = 1 / 8, SY = 8.75;                                             // sections at 1/8 in = 1 ft
  const S1V = { x: 2.55, y: SY, w: HT.s1.w * SEC, h: HT.s1.h * SEC };
  const S2V = { x: 10.2, y: SY, w: HT.s2.w * SEC, h: HT.s2.h * SEC };
  const MAP = 3 / 32, MV = { x: 20.25, y: 4.1, w: HT.pvb[2] * MAP, h: HT.pvb[3] * MAP };
  const TB = { x: 20.25, y: 15.05, w: 11.3 };
  const NB = { y: 15.3 };

  /* ---------------------------------------------------------------- method diagrams (viewBox 100 x 72, schematic) */
  const VB = '0 0 100 72';
  const ln = (d, k = '', w = 1, dash = '', op = 1) => `<path d="${d}" fill="none" stroke="${k === 'o' ? '#c07a2c' : '#1b1a18'}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''} opacity="${op}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
  const tick = (x, y) => ln(`M${x - 1.4} ${y + 1.4} L${x + 1.4} ${y - 1.4}`, 'o', 1.1);
  const vdim = (x, y0, y1) => ln(`M${x} ${y0} V${y1}`, 'o', 1.1) + tick(x, y0) + tick(x, y1);
  const hatch = (id) => `<defs><pattern id="${id}" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="3" stroke="#1b1a18" stroke-width=".4" opacity=".28" vector-effect="non-scaling-stroke"/></pattern></defs>`;
  // natural grade: a gentle fall to the right, the same line in every diagram
  const NG = [[0, 44], [12, 45.2], [24, 47.4], [36, 48.6], [50, 51.2], [62, 53.4], [76, 55.2], [88, 57.8], [100, 59.2]];
  const gAt = x => { for (let i = 1; i < NG.length; i++) if (x <= NG[i][0]) { const [a, b] = [NG[i - 1], NG[i]]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return NG[NG.length - 1][1]; };
  const gPath = (dy = 0, x0 = 0, x1 = 100) => 'M' + [[x0, gAt(x0)], ...NG.filter(p => p[0] > x0 && p[0] < x1), [x1, gAt(x1)]].map(p => `${p[0]} ${(p[1] + dy).toFixed(2)}`).join(' L');
  const earth = id => `<path d="${gPath()} L100 72 L0 72 Z" fill="url(#${id})"/>`;
  // a folded ribbon roof over a two level block, the house in every diagram (x 26 to 74)
  const HOUSE = (lift = 0) => {
    const f = 49.5;                                         // main floor line
    const roof = `M24 ${22 - lift} L50 ${27 - lift} L76 ${16 - lift}`;
    return ln(`M27 ${f} V${21.4 - lift} M73 ${f + 2} V${17 - lift}`, '', .9) + ln(roof, '', 1.5) +
      ln(`M27 ${f} H50 V${f + 2} H73`, '', .9) + ln(`M27 ${f} V${f + 6} H73 V${f + 2}`, '', .5, '1.5 1.5', .6) + ln(`M50 ${27 - lift} V${f}`, '', .4, '', .45);
  };
  const roofY = (x, lift = 0) => x <= 50 ? (22 - lift) + (x - 24) * 5 / 26 : (27 - lift) + (x - 50) * (-11) / 26;

  function m1() {    // natural grade, not finish grade
    const fin = 'M0 44 L14 45.4 L22 49.6 L27 50.2 M73 53.2 L80 53.4 L90 57.2 L100 59.2';
    return `<svg class="ht-svg" viewBox="${VB}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${hatch('ht-e1')}${earth('ht-e1')}
      ${ln(gPath(0, 0, 27), '', 1.3)}${ln(gPath(0, 73, 100), '', 1.3)}${ln(gPath(0, 27, 73), '', 1, '1 2', .9)}
      ${ln(fin, '', .8, '4 2.5', .75)}${HOUSE()}${vdim(62, gAt(62), roofY(62))}</svg>` +
      lab([.01, 52 / 72], 'Natural grade', 'the site before grading', 'b') +
      lab([.99, 71 / 72], 'Finish grade', 'not the datum', 'ar') +
      lab([.25, 61.5 / 72], '', 'on under the house', 'b');
  }
  function m2() {    // straight down from every point
    const xs = [30, 44, 58, 72];
    const top = xs.map(x => [x, roofY(x)]);
    const hi = top.reduce((a, b) => (gAt(b[0]) - b[1]) > (gAt(a[0]) - a[1]) ? b : a);
    return `<svg class="ht-svg" viewBox="${VB}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${hatch('ht-e2')}${earth('ht-e2')}${ln(gPath(), '', 1.3)}${HOUSE()}
      ${top.map(([x, y]) => x === hi[0] ? '' : ln(`M${x} ${y} V${gAt(x)}`, 'o', .7, '2 1.6', .8)).join('')}
      ${vdim(hi[0], gAt(hi[0]), hi[1])}<circle cx="${hi[0]}" cy="${hi[1]}" r="1.2" fill="#c07a2c"/></svg>` +
      lab([(hi[0] + 2.5) / 100, (hi[1] + gAt(hi[0])) / 2 / 72], '', 'h, true vertical', 'l o') +
      lab([.02, .1], 'To the highest point', 'roofing and ridge caps included', 'l k') +
      lab([.99, .96], 'Grade directly below', 'no averaging', 'r');
  }
  function m3() {    // the 30 ft envelope follows grade; chimney masses 4 ft more
    const up = -30;                                          // 30 ft drawn as 30 units, schematic
    const cx = 37, cw = 5;                                   // chimney mass
    const env = gPath(up), envC = gPath(up - 4, 30, 50);
    return `<svg class="ht-svg" viewBox="${VB}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${hatch('ht-e3')}${earth('ht-e3')}${ln(gPath(), '', 1.3)}
      ${HOUSE(-7)}${ln(`M${cx} ${roofY(cx, -7)} V${gAt(cx) + up - 3.6} H${cx + cw} V${roofY(cx + cw, -7)}`, '', 1)}${ln(`M${cx - .8} ${gAt(cx) + up - 3.6} H${cx + cw + .8} V${gAt(cx) + up - 5.2} H${cx - .8} Z`, '', .6, '', .7)}
      ${ln(env, 'o', 1.1, '4 2.5')}${ln(`M${cx - 6} ${(gAt(cx) + up - 4).toFixed(2)} H${cx + cw + 6}`, 'o', .6, '1 1.6', .9)}
      ${vdim(9, gAt(9), gAt(9) + up)}</svg>` +
      lab([.115, (gAt(9) - 15) / 72], '30 ft', '', 'l o') +
      lab([(cx - 2) / 100, 9 / 72], 'Chimney mass', '4 ft more, cap excluded', 'ar');
  }
  function m4() {    // test one: the ridge within 30 ft of average natural grade at the footprint edges
    const hx = 27, lx = 73, gh = gAt(hx), gl = gAt(lx), ga = (gh + gl) / 2, lim = ga - 39;
    return `<svg class="ht-svg" viewBox="${VB}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${hatch('ht-e4')}${earth('ht-e4')}${ln(gPath(), '', 1.3)}${HOUSE()}
      <circle cx="${hx}" cy="${gh}" r="1.3" fill="#1b1a18"/><circle cx="${lx}" cy="${gl}" r="1.3" fill="#1b1a18"/>
      ${ln(`M${hx} ${gh} L${lx} ${gl}`, '', .5, '', .5)}${ln(`M14 ${ga} H86`, '', .8, '3 2')}
      ${ln(`M10 ${lim} H90`, 'o', 1.1, '4 2.5')}${vdim(88, ga, lim)}${ln(`M76 16 H82`, '', .5, '', .6)}</svg>` +
      lab([(hx - 2) / 100, (gh - 2) / 72], 'High', `${d1(T1.hi)}`, 'ar') +
      lab([(lx + 1) / 100, (gl + 2.5) / 72], 'Low', `${d1(T1.lo)}`, 'b') +
      lab([.01, (ga + 5) / 72], 'Average', `${d1(T1.avg)}`, 'b k') +
      lab([.11, (lim - 3.6) / 72], `Limit ${d1(T1.limit_el)}`, `average plus ${T1.limit_ft} ft`, 'a o') +
      lab([.77, 13 / 72], 'Ridge', `${d1(T1.ridge)}`, 'a k');
  }
  const METH = [
    ['Natural grade', 'VII.5 · before grading', m1],
    ['Measured straight down', 'VII.5 test two', m2],
    ['The 30 ft envelope', 'VII.5 · chimneys 4 ft more', m3],
    ['Test one · average grade', `VII.5 · slope ${T1.slope}%, so ${T1.limit_ft} ft`, m4]
  ];

  /* ---------------------------------------------------------------- sections: datum ticks down the left */
  function secView(ctx, V, S, key, pt, extra, envLeft, roofRight, dimLeft) {
    let dat = '';
    for (let el = Math.ceil(S.el0 / 10) * 10; el <= S.el1; el += 10) {
      const f = (S.el1 - el) / (S.el1 - S.el0);
      dat += `<span class="ht-datl" style="top:${P(f)}%"></span><span class="ht-dat" style="top:${P(f)}%">${el}</span>`;
    }
    const f = S.f_pt, g = S.f_gr, m = S.f_mid;
    const labs = lab([f[0] + (dimLeft ? -.03 : .03), m[1]], `${d2(pt.over)} ft`, `${d2(pt.margin)} ft to spare`, dimLeft ? 'r o' : 'l o') +
      lab([f[0] + (roofRight ? .025 : -.025), f[1] - .035], `Roof ${d1(pt.el)}`, '', roofRight ? 'a' : 'ar') +
      lab([f[0] + .03, g[1] + .06], `Natural grade ${d1(pt.grade)}`, '', 'b') +
      (envLeft ? lab([.02, S.f_envL[1] - .035], '30 ft envelope', 'parallel to grade', 'a o') : lab([S.f_env[0], S.f_env[1] - .03], '30 ft envelope', 'parallel to grade', 'ar o')) + extra;
    return `<div class="ht-v sec" style="left:${ctx.U(ctx.FX(V.x))};top:${ctx.U(ctx.FY(V.y))};width:${ctx.U(V.w)};height:${ctx.U(V.h)};--ar:${(V.w / V.h).toFixed(4)}">${S.svg}${dat}${labs}</div>`;
  }

  /* ---------------------------------------------------------------- the map: bubbles and spot labels */
  const TAG = { tip: [.28, .3], south: [.36, .1], beam: [0, -.34], sbeam: [0, .34], bridge: [-.42, .1], granny: [0, -.34], garage: [0, -.34], chimrib: [-.36, -.28], chimribN: [0, -.34] };
  function mapView(ctx) {
    const pts = HT.pts;
    let b = '';
    pts.forEach((p, i) => {
      const t = TAG[p.key] || [0, -.34];
      const hot = p.margin < 1 && !p.key.startsWith('chim');
      const fx = p.f[0] + t[0] / MV.w, fy = p.f[1] + t[1] / MV.h;
      b += `<span class="ht-bub${hot ? ' o' : ''}" style="left:${P(fx)}%;top:${P(fy)}%">${i + 1}</span>`;
    });
    b += lab([TIP.f[0] - .12 / MV.w, TIP.f[1] + .12 / MV.h], `Tip ${d1(TIP.el)}`, `${d1(TIP.over)} ft over grade`, 'r o bg b2');
    b += lab([SC.f[0] - .15 / MV.w, SC.f[1] - .14 / MV.h], `Corner ${d1(SC.el)}`, `${d2(SC.over)} ft, the tightest`, 'ar o bg');
    b += lab([HT.test1_f.hi[0] + .12 / MV.w, HT.test1_f.hi[1] + .12 / MV.h], 'Grade high', d1(T1.hi), 'b bg');
    b += lab([HT.test1_f.lo[0] + .25 / MV.w, HT.test1_f.lo[1] + .12 / MV.h], 'Grade low', d1(T1.lo), 'b bg');
    b += `<span class="ht-l" style="left:${P(HT.test1_f.hi[0])}%;top:${P(HT.test1_f.hi[1])}%"><svg width="8" height="8" viewBox="0 0 8 8" style="display:block"><circle cx="4" cy="4" r="3" fill="#1b1a18"/></svg></span>`;
    b += `<span class="ht-l" style="left:${P(HT.test1_f.lo[0])}%;top:${P(HT.test1_f.lo[1])}%"><svg width="8" height="8" viewBox="0 0 8 8" style="display:block"><circle cx="4" cy="4" r="3" fill="#1b1a18"/></svg></span>`;
    b += lab([HT.tree_f[0], HT.tree_f[1] + .02], 'The tree', 'kept', '');
    return `<div class="ht-v dv" style="left:${ctx.U(ctx.FX(MV.x))};top:${ctx.U(ctx.FY(MV.y))};width:${ctx.U(MV.w)};height:${ctx.U(MV.h)};--ar:${(MV.w / MV.h).toFixed(4)}">${HT.map}${b}</div>`;
  }
  function legend() {
    const B = HT.bands, R = HT.roof_sf;
    const rows = [['#efe7da', 'Under 20 ft', B.b0], ['#e7d7bf', '20 to 25 ft', B.b1], ['#ddc19c', '25 to 28 ft', B.b2], ['#d9a46a', '28 to 29 ft', B.b3], ['#c07a2c', '29 to 30 ft', B.b4], ['#8a2a12', 'Over 30 ft', B.b5]];
    return `<div class="ht-leg">${rows.map(([c, t, v]) => `<s style="background:${c}"></s><span>${t}</span><em>${v ? `about ${Math.max(1, Math.round(v))} sf` : 'none'}</em>`).join('')}</div>`;
  }

  /* ---------------------------------------------------------------- the calculation table */
  function table() {
    const cols = '0.34fr 2.9fr 1fr 1fr 1fr 1fr 1.05fr';
    let h = `<div class="ht-tab" style="--cols:${cols}">` +
      ['', 'Point', 'Roof el', 'Natural grade', 'Over grade', 'To the limit', 'Status'].map((t, k) => `<div class="hd${k === 2 || k === 3 || k === 5 ? ' x' : ''}${k > 1 && k < 6 ? ' num' : ''}">${t}</div>`).join('');
    HT.pts.forEach((p, i) => {
      const ch = p.key.startsWith('chim');
      const hot = p.margin < 1 && !ch;
      const st = ch ? 'Meets · 34 ft mass' : hot ? 'Tight' : 'Meets';
      h += `<div class="n"><span class="${hot ? 'o' : ''}">${i + 1}</span></div><div class="nm">${p.name}</div>` +
        `<div class="num x">${d1(p.el)}</div><div class="num x">${d1(p.grade)}</div><div class="num${hot ? ' o' : ''}">${d2(p.over)} ft</div>` +
        `<div class="num x${hot ? ' o' : ''}">${d2(p.margin)} ft</div><div class="st${hot ? ' o' : ''}">${st}</div>`;
    });
    h += `<div class="n"></div><div class="nm">Test one · highest ridge</div><div class="num x">${d1(T1.ridge)}</div><div class="num x t1">avg ${d1(T1.avg)}</div>` +
      `<div class="num">${d2(T1.ridge_over)} ft</div><div class="num x">${d2(T1.margin)} ft</div><div class="st">Meets</div></div>`;
    return h;
  }

  function a14(ctx) {
    let h = CSS + '<div class="ht-root">';
    /* 1 to 4 · method */
    h += `<div class="ht-b ht-mgrid" style="left:0;top:0;width:0;height:0">`;
    METH.forEach(([t, s, fn], i) => {
      h += `<div class="ht-v" style="left:${ctx.U(ctx.FX(MX(i)))};top:${ctx.U(ctx.FY(MY))};width:${ctx.U(MW)};height:${ctx.U(MH)};--ar:${(MW / MH).toFixed(4)}">${fn()}
        <div class="ht-mt"><span class="vn">${i + 1}</span><span><b>${t}</b><i>${s} · not to scale</i></span></div></div>`;
    });
    h += '</div>';

    /* 5 · 6 · sections */
    h += `<div class="ht-b" style="left:0;top:0;width:0;height:0">`;
    h += secView(ctx, S1V, HT.s1, 's1', TIP, '', true, true);
    h += '</div>';
    h += vtitle(ctx, S1V.x, S1V.y + S1V.h + 0.32, 5, 'Section at the tip', '1/8 in = 1 ft · 2 ft inside, looking east');
    h += `<div class="ht-b" style="left:0;top:0;width:0;height:0">`;
    h += secView(ctx, S2V, HT.s2, 's2', SC, '', false, false, true);
    h += '</div>';
    h += vtitle(ctx, S2V.x, S2V.y + S2V.h + 0.32, 6, 'Section at the south corner', '1/8 in = 1 ft · 3 ft inside, looking east', gbar(ctx, SEC, [0, 4, 8, 16]));

    /* 7 · the roof over grade map */
    h += `<div class="ht-b" style="left:0;top:0;width:0;height:0">${mapView(ctx)}</div>`;
    h += vtitle(ctx, MV.x, MV.y + MV.h + 0.3, 7, 'Roof over natural grade', '3/32 in = 1 ft · registers with A2.3', gbar(ctx, MAP, [0, 8, 16, 32]));
    h += northArrow(ctx, MV.x + MV.w - 0.45, MV.y + MV.h - 0.35, 0.62);
    h += place(ctx, MV.x + 0.15, MV.y + 7.35, 3.3, 0, legend(), '', '');

    /* 8 · calculation */
    h += place(ctx, TB.x, TB.y, TB.w, 0, `<h3 class="ht-h">Calculation<i>every critical point, feet · FA grade, about</i></h3>${table()}`);

    /* method and data notes */
    h += place(ctx, 1.9, NB.y, 7.9, 0, `<h3 class="ht-h">Method, as applied<i>Design Book Rev 4/11</i></h3>
      <p class="ht-p"><u>VII.5 test one</u>Ridge within ${T1.limit_ft} ft of average natural grade, the high and low grade at the footprint edges averaged. The footprint slopes about ${T1.slope}%, under 15%, so 30 ft, not 36. The Design Book calls this the Placer County ordinance.</p>
      <p class="ht-p"><u>VII.5 test two</u>No point over 30 ft, measured true vertical from the natural grade directly below, before grading, to the roofing and ridge caps. No averaging. This test governs Walsh.</p>
      <p class="ht-p"><u>VII.5 test three</u>The home must not appear overly tall. The wings step with the land and the ribbon holds low at the fold.</p>
      <p class="ht-p"><u>Chimneys</u>Masses may rise 4 ft over the allowable roof height nearby, caps excluded. Both caps sit under 30 ft anyway.</p>`);
    h += place(ctx, 10.3, NB.y, 8.0, 0, `<h3 class="ht-h">Data and survey</h3>
      <p class="ht-p"><u>Source</u>Roofing from the pocket model, FA2 Ribbon, over the FA terrain traced from the Ryan Group sheet labels, good to about 0.3 ft. Every roof face checked on a 6 in grid and at every vertex. 9/30/26.</p>
      <p class="ht-p"><u>Accuracy</u>FA accuracy, confirm on survey. Two corners sit inside 0.3 ft of the line, so the survey decides them.</p>
      <p class="ht-p"><u>If grade moves</u>Every foot the surveyed grade drops under the corner costs a foot of roof there. A drop of more than about ${inTxt(SC.margin)} at the south corner, or ${inTxt(TIP.margin)} at the tip, puts it over.</p>
      <p class="ht-p"><u>Placer County</u>RS PD 1.7 height and how the County measures it, confirm with Placer Planning. XII.15: a licensed surveyor sets benchmarks and certifies height during framing.</p>`);
    return h + '</div>';
  }

  const tight = HT.pts.filter(p => p.margin < 1 && !p.key.startsWith('chim')).length;
  LIVING_SHEETS.push({
    id: 'A1.4', group: 'Architectural', title: 'Building height', short: 'Building height', foot: 'Building height',
    scale: 'As noted', issued: [4],
    cap: 'Every roof measured straight down to the ground as it stands today. Two corners kiss the 30 ft line, the survey settles them.',
    data: [`Tightest about ${d2(SC.over)} ft, south corner`, `Tip about ${d1(TIP.over)} ft over grade`, `Test one ${d1(T1.ridge_over)} ft over average grade`, 'FA grade, confirm on survey'],
    notes: [
      { text: 'measure from grade before we touch it', t: [5.25, 3.72], p: [MX(0) + 0.06 * MW, MY + (44.4 / 72) * MH], a: 'l' },
      { text: 'the envelope rides the grade', t: [13.9, 3.72], p: [MX(2) + 0.62 * MW, MY + ((gAt(62) - 30) / 72) * MH + .02], a: 'l' },
      { text: `about ${inTxt(SC.margin)} to spare`, t: [13.15, 12.4], p: [S2V.x + HT.s2.f_pt[0] * S2V.w + 0.04, S2V.y + HT.s2.f_pt[1] * S2V.h + 0.05], a: 'l' },
      { text: 'the tip lifts, the line holds', t: [4.3, 8.45], p: [S1V.x + HT.s1.f_pt[0] * S1V.w, S1V.y + HT.s1.f_pt[1] * S1V.h], a: 'l' }
    ],
    html: a14
  });
})();
