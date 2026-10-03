/* renderer for the reflected ceiling plans; PB (data) is injected above by build_rcp.py */
const K = PB.colors;
const pc = v => +(v * 100).toFixed(3);
const STYLE = `<style>
.pbv .lbl.clg{flex-direction:row;align-items:baseline;gap:.4em;padding:.08em .5em;border:1px solid rgba(27,26,24,.7);border-radius:999px;background:rgba(246,245,241,.9)}
.pbv .lbl.clg b{font:italic 400 max(calc(9.5px * var(--fl)),calc(var(--u) * .145))/1.1 var(--fs);letter-spacing:0;text-transform:none}
.pbv .lbl.clg i{font:400 max(calc(7px * var(--fl)),calc(var(--u) * .1))/1.1 var(--ft);letter-spacing:.08em;color:var(--muted);font-style:normal}
.pbv .lbl.clg.low{border-color:var(--accent)}
.pbv .lbl.clg.low b{color:var(--accent)}
.pbv .lbl.lite{background:none}
.pbv .lbl.lite b{color:var(--accent)}
.pb-leg li{display:grid !important;grid-template-columns:calc(var(--u) * .62) auto 1fr;align-items:center !important;column-gap:calc(var(--u) * .12)}
.pb-leg li .v{text-align:right;white-space:normal !important;font-size:max(calc(8.5px * var(--fl)),calc(var(--u) * .135)) !important;line-height:1.15 !important}
.pb-leg svg{width:calc(var(--u) * .55);height:calc(var(--u) * .26);overflow:visible}
.pb-notes ol{margin:0;padding:0;list-style:none;counter-reset:pbn}
.pb-notes li{counter-increment:pbn;position:relative;padding:calc(var(--u) * .14) 0 calc(var(--u) * .04) calc(var(--u) * .34);background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .1);
  font:italic 400 max(calc(9px * var(--fl)),calc(var(--u) * .145))/1.3 var(--fs);color:var(--ink)}
.pb-notes li::before{content:counter(pbn);position:absolute;left:0;top:calc(var(--u) * .17);font:400 max(calc(7.5px * var(--fl)),calc(var(--u) * .11))/1 var(--ft);letter-spacing:.08em;color:var(--accent)}
@media screen and (max-width:760px) and (orientation:portrait), screen and (max-width:760px) and (min-height:541px), screen and (max-width:760px) and (pointer:fine), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
  .fhtml:has(.pbv){position:relative;inset:auto}
  .sheet:has(.pbv) .vfree{margin:0 0 22px}
  .sheet:has(.pbv) .vfree .note{display:block;margin:0 0 6px}
  .pb-leg,.pb-notes{max-width:420px}
}
</style>`;

function sym(k) {
  const i = K.ink, a = K.acc, t = K.timber, p = K.paper;
  const S = b => `<svg viewBox="0 0 24 12" aria-hidden="true">${b}</svg>`;
  switch (k) {
    case 'cove': return S(`<path d="M1 6 H23" stroke="${a}" stroke-width="5" opacity=".22" stroke-linecap="round"/><path d="M1 6 H23" stroke="${a}" stroke-width="2"/><path d="M1 6 H23" stroke="${p}" stroke-width=".7" stroke-dasharray="2 3"/>`);
    case 'lin': return S(`<path d="M5 6 H19" stroke="${i}" stroke-width="4" stroke-linecap="round"/><path d="M5 6 H19" stroke="${a}" stroke-width="2.2" stroke-linecap="round"/>`);
    case 'rec': return S(`<circle cx="12" cy="6" r="3.6" fill="${p}" stroke="${i}" stroke-width=".9"/><circle cx="12" cy="6" r="1.5" fill="${a}"/>`);
    case 'pend': return S(`<circle cx="12" cy="6" r="5" fill="${p}" stroke="${i}" stroke-width=".9"/><path d="M8.5 2.5 L15.5 9.5 M8.5 9.5 L15.5 2.5" stroke="${i}" stroke-width=".7"/><circle cx="12" cy="6" r="1.6" fill="${a}"/>`);
    case 'ext': return S(`<circle cx="12" cy="6" r="3.6" fill="${p}" stroke="${i}" stroke-width=".9"/><path d="M8.4 6 A3.6 3.6 0 0 0 15.6 6 Z" fill="${a}"/>`);
    case 'joist': return S(`<path d="M3 11 L9 1 M9 11 L15 1 M15 11 L21 1" stroke="${t}" stroke-width="1"/>`);
    case 'glulam': return S(`<rect x="1" y="4" width="22" height="4" fill="${t}" fill-opacity=".45" stroke="#8a4f1e" stroke-width=".7"/>`);
    case 'beam': return S(`<rect x="1" y="2" width="22" height="4" fill="#d9d6cf" stroke="${i}" stroke-width="1"/><rect x="1" y="7" width="22" height="3" fill="${p}" stroke="${i}" stroke-width=".6"/><path d="M8 7 V10 M16 7 V10" stroke="${i}" stroke-width=".5"/>`);
    case 'eave': return S(`<path d="M1 3 H23 V11" fill="none" stroke="${i}" stroke-width=".9" stroke-dasharray="3 2"/><path d="M4 11 L12 3 M10 11 L18 3 M16 11 L23 4" stroke="${i}" stroke-width=".5" opacity=".4"/>`);
    case 'clg': return S(`<rect x="1.5" y="1.5" width="21" height="9" rx="4.5" fill="${p}" stroke="${i}" stroke-width=".8"/><path d="M6 6 H18" stroke="${i}" stroke-width=".6" opacity=".5"/>`);
    case 'up': return S(`<path d="M2 6 H19" stroke="${i}" stroke-width="1"/><path d="M22 6 L16.5 3 L16.5 9 Z" fill="${i}"/>`);
  }
  return '';
}

function lbl(l) {
  return `<span class="lbl ${l.k || 'room'}${l.hot ? ' hot' : ''}" style="left:${pc(l.p[0])}%;top:${pc(l.p[1])}%"><b>${l.t}</b>${l.s ? `<i>${l.s}</i>` : ''}</span>`;
}

function bar(ctx, b) {
  const L = b.ft[b.ft.length - 1];
  let r = '';
  for (let k = 1; k < b.ft.length; k++) r += `<rect x="${b.ft[k - 1] / L}" y="0" width="${(b.ft[k] - b.ft[k - 1]) / L}" height="1" class="${k % 2 ? 'on' : ''}"/>`;
  const labs = b.ft.map(v => `<span style="left:${pc(v / L)}%">${v}${v === L ? ' ft' : ''}</span>`).join('');
  return `<span class="gbar" style="width:${ctx.U(L * b.sc)}"><svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">${r}</svg>${labs}</span>`;
}

function north(ctx, n) {
  const a = (ctx.DRW && ctx.DRW.north) || 0;
  return `<div class="dnorth" style="left:${ctx.U(ctx.FX(n.x) - n.s / 2)};top:${ctx.U(ctx.FY(n.y) - n.s / 2)};width:${ctx.U(n.s)};height:${ctx.U(n.s)}" aria-label="North">
    <svg viewBox="-1 -1 2 2" aria-hidden="true"><circle r=".78"/><g transform="rotate(${a})"><path class="nd" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/><path class="nl" d="M0 .02 V.78"/></g></svg>
    <span style="left:${pc(.5 + .62 * Math.sin(a * Math.PI / 180))}%;top:${pc(.5 - .62 * Math.cos(a * Math.PI / 180))}%">N</span></div>`;
}

function block(ctx, b) {
  const pos = `left:${ctx.U(ctx.FX(b.x))};top:${ctx.U(ctx.FY(b.y))};width:${ctx.U(b.w)}`;
  const e = ctx.esc;
  if (b.kind === 'table')
    return `<div class="dtab" style="${pos}"><h3>${e(b.title)}</h3><ul>${b.rows.map(([k, v]) => `<li><span class="k">${e(k)}</span><span class="v">${e(v)}</span></li>`).join('')}</ul>${b.foot ? `<p>${e(b.foot)}</p>` : ''}</div>`;
  if (b.kind === 'legend')
    return `<div class="dtab pb-leg" style="${pos}"><h3>${e(b.title)}</h3><ul>${b.rows.map(([s, k, v]) => `<li>${sym(s)}<span class="k">${e(k)}</span><span class="v">${e(v)}</span></li>`).join('')}</ul></div>`;
  if (b.kind === 'notes')
    return `<div class="dtab pb-notes" style="${pos}"><h3>${e(b.title)}</h3><ol>${b.rows.map(r => `<li>${e(r)}</li>`).join('')}</ol></div>`;
  return '';
}

function rcp(ctx, id) {
  const S = PB.sheets[id], V = PB.view;
  let h = STYLE;
  h += `<div class="view dv pbv" style="left:${ctx.U(ctx.FX(V.x))};top:${ctx.U(ctx.FY(V.y))};width:${ctx.U(V.w)};height:${ctx.U(V.h)};--ar:${(V.w / V.h).toFixed(4)}">${S.svg}${S.labels.map(lbl).join('')}</div>`;
  const t = S.vt;
  h += `<div class="dvt" style="left:${ctx.U(ctx.FX(t.x))};top:${ctx.U(ctx.FY(t.y))}">${ctx.viewTitle(t.n, t.t, t.s)}${bar(ctx, PB.tick)}</div>`;
  h += north(ctx, S.north);
  S.blocks.forEach(b => { h += block(ctx, b); });
  return h;
}

LIVING_SHEETS.push({
  id: 'A2.4', group: 'Architectural', title: 'Level 1 reflected ceiling plan', short: 'Level 1 ceiling plan', foot: 'Level 1 ceiling plan',
  scale: '3/16 in = 1 ft', issued: [4],
  cap: 'Look up from the main level: the joists are the ceiling, square to the level beam, lifting to the tip at the court.',
  data: ['Beam 6012.0 · tip 6023.0', 'Plates 9 ft over the main floor', 'Lighting concept, confirm'],
  notes: PB.sheets['A2.4'].notes || [],
  html: ctx => rcp(ctx, 'A2.4')
});

LIVING_SHEETS.push({
  id: 'A2.5', group: 'Architectural', title: 'Level 2 reflected ceiling plan', short: 'Level 2 ceiling plan', foot: 'Level 2 ceiling plan',
  scale: '3/16 in = 1 ft', issued: [4],
  cap: 'The primary suite under the south wing’s own fold, the joists lifting to the northeast corner.',
  data: ['Beam 6013.0 · primary floor 6004.0', 'South edge under 7 ft, confirm', 'Lighting concept, confirm'],
  notes: PB.sheets['A2.5'].notes || [],
  html: ctx => rcp(ctx, 'A2.5')
});
