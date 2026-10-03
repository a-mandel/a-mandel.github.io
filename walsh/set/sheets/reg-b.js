/* reg-b crew sheets (9/30/26): A0.2 General notes, A0.3 Code and energy notes, A6.1 Wildfire hardening.
   Notes set in tidy columns of small type, details drawn as inline SVG hairlines, one orange accent.
   Everything unverified carries an orange "confirm" tag. 2025 California codes, effective 1/1/26. */
(function () {
  /* ------------------------------------------------------------ shared style, injected once */
  const CSS = `
.rgx{position:absolute;inset:0;
  --rg-b:max(calc(10px * var(--fl)),calc(var(--u) * .212));
  --rg-h:max(calc(9.5px * var(--fl)),calc(var(--u) * .2));
  --rg-k:max(calc(7.4px * var(--fl)),calc(var(--u) * .13));
  --rg-v:max(calc(10px * var(--fl)),calc(var(--u) * .21));
  --rg-lb:max(calc(7px * var(--fl)),calc(var(--u) * .125));
  --rg-li:max(calc(8.5px * var(--fl)),calc(var(--u) * .165))}
.rgc{position:absolute}
.rgs + .rgs{margin-top:calc(var(--u) * .34)}
.rgs h3{position:relative;margin:0 0 calc(var(--u) * .1);padding-bottom:calc(var(--u) * .13);font:400 var(--rg-h)/1.15 var(--ft);letter-spacing:.2em;text-transform:uppercase;color:var(--ink);
  background:var(--swoop) no-repeat 0 100% / 100% calc(var(--u) * .1)}
.rgs h3 .no{display:inline-block;min-width:2.1em;color:var(--muted);letter-spacing:.08em}
.rgs h3 .rf{float:right;font:italic 400 var(--rg-b)/1.15 var(--fs);letter-spacing:0;text-transform:none;color:var(--muted)}
.rgo{list-style:none;margin:0;padding:0}
.rgo li{display:grid;grid-template-columns:1.7em 1fr;font:400 var(--rg-b)/1.3 var(--fs);color:var(--ink);padding:calc(var(--u) * .018) 0;text-wrap:pretty}
.rgo li > span:first-child{font:400 var(--rg-k)/1.9 var(--ft);letter-spacing:.06em;color:var(--muted)}
.rgo li.sub{grid-template-columns:1.7em 1fr}
.rgx i.rf{font-style:italic;color:var(--muted);white-space:nowrap}
.rgx em.cf{font:400 var(--rg-k)/1 var(--ft);font-style:normal;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);white-space:nowrap;margin-left:.25em}
.rgp{margin:0 0 calc(var(--u) * .06);font:italic 400 var(--rg-b)/1.3 var(--fs);color:var(--muted);text-wrap:pretty}
.rgt{margin:0;padding:0}
.rgt > div{display:grid;grid-template-columns:var(--kw,1.9in) 1fr;column-gap:calc(var(--u) * .14);align-items:baseline;padding:calc(var(--u) * .12) 0 calc(var(--u) * .03);
  background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .09)}
.rgt dt{font:400 var(--rg-k)/1.3 var(--ft);letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}
.rgt dd{margin:0;font:italic 400 var(--rg-v)/1.25 var(--fs);color:var(--ink);font-variant-numeric:lining-nums;text-wrap:pretty}
.rga{display:grid;grid-template-columns:1fr 1fr;column-gap:calc(var(--u) * .3)}
.rga div{display:grid;grid-template-columns:3.9em 1fr;column-gap:.5em;align-items:baseline;padding:calc(var(--u) * .012) 0}
.rga b{font:400 var(--rg-k)/1.5 var(--ft);letter-spacing:.1em;color:var(--ink);font-weight:400}
.rga span{font:italic 400 var(--rg-b)/1.25 var(--fs);color:var(--ink)}
.rgl{display:grid;grid-template-columns:calc(var(--u) * 1.55) 1fr;column-gap:calc(var(--u) * .2);align-items:center;padding:calc(var(--u) * .07) 0 calc(var(--u) * .05);
  background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .08)}
.rgl:first-child,.rgt > div:first-child{background:none}
.rgl .sy{position:relative;height:calc(var(--u) * .56)}
.rgl .sy svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.rgl .tx{display:flex;flex-direction:column;line-height:1.2}
.rgl .tx b{font:400 var(--rg-k)/1.3 var(--ft);letter-spacing:.15em;text-transform:uppercase;font-weight:400}
.rgl .tx i{font:italic 400 var(--rg-b)/1.25 var(--fs);color:var(--muted)}
.rgl .sy .vt{position:absolute;left:0;top:50%;transform:translateY(-50%) scale(.82);transform-origin:0 50%}
.rgl .sy .note{position:absolute;left:0;top:30%;transform:translate(0,-50%);font-size:max(calc(11px * var(--fl)),calc(var(--u) * .24))}
.rgl .sy .dot{position:absolute}
.rgx .k{fill:none;stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.rgx .k2{fill:none;stroke:var(--ink);stroke-width:1.7;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.rgx .kf{fill:rgba(27,26,24,.075);stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.rgx .kh{stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.rgx .fi{fill:var(--ink)}
.rgx .kd{fill:none;stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:4 3}
.rgx .kt{fill:none;stroke:var(--ink);stroke-opacity:.5;stroke-width:.8;vector-effect:non-scaling-stroke;stroke-linecap:round}
.rgx .cl{fill:none;stroke:var(--ink);stroke-opacity:.13;stroke-width:.7;vector-effect:non-scaling-stroke}
.rgx .o{fill:none;stroke:var(--accent);stroke-width:1.7;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.rgx .od{fill:none;stroke:var(--accent);stroke-width:1.5;vector-effect:non-scaling-stroke;stroke-dasharray:1.5 1.5}
.rgx .of{fill:rgba(192,122,44,.3);stroke:var(--accent);stroke-width:1.2;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.rgx .ofs{fill:var(--accent)}
.rgx .ld1{fill:none;stroke:var(--ink);stroke-opacity:.72;stroke-width:.8;vector-effect:non-scaling-stroke}
.rgx .ldd{fill:var(--ink)}
.rgx svg text{font-family:var(--ft);fill:var(--ink);letter-spacing:.04em}
.rgd{position:absolute}
.rgd .art{position:relative}
.rgd .art > svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.rgd .vt{position:relative;top:auto;left:auto;margin-top:calc(var(--u) * .22)}
.rgd .dn{margin:calc(var(--u) * .16) 0 0;font:400 var(--rg-b)/1.3 var(--fs);color:var(--ink);text-wrap:pretty}
.rgd .dn i.rf{display:inline}
.rgd dl.rgt{margin-top:calc(var(--u) * .16)}
.rgq{position:absolute;display:flex;flex-direction:column;white-space:nowrap;line-height:1.14;pointer-events:none}
.rgq.l{transform:translate(0,-50%);align-items:flex-start;text-align:left}
.rgq.r{transform:translate(-100%,-50%);align-items:flex-end;text-align:right}
.rgq.c{transform:translate(-50%,-50%);align-items:center;text-align:center}
.rgq b{font:400 var(--rg-lb)/1.25 var(--ft);letter-spacing:.14em;text-transform:uppercase;font-weight:400;color:var(--ink)}
.rgq i{font:italic 400 var(--rg-li)/1.2 var(--fs);color:var(--muted)}
.rgq.dim i{color:var(--ink)}
.rgn{position:absolute;pointer-events:none}
.rgn svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.rgn circle{fill:none;stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke}
.rgn .nd{fill:var(--accent)}
.rgn .nl{stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke}
.rgn span{position:absolute;transform:translate(-50%,-50%);font:400 max(calc(8px * var(--fl)),calc(var(--u) * .14))/1 var(--ft);letter-spacing:.06em}
@media screen and (max-width:760px) and (orientation:portrait), screen and (max-width:760px) and (min-height:541px), screen and (max-width:760px) and (pointer:fine), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
  .sheet[data-id="A0.2"] .fhtml,.sheet[data-id="A0.3"] .fhtml,.sheet[data-id="A6.1"] .fhtml{position:relative;inset:auto}
  .rgx{position:relative;inset:auto;--rg-b:14px;--rg-h:12px;--rg-k:10px;--rg-v:15px;--rg-lb:8.5px;--rg-li:11px}
  .rgc,.rgd{position:relative !important;left:auto !important;top:auto !important;width:auto !important;margin:0 0 30px}
  .rgd .art{width:100% !important;height:auto !important;aspect-ratio:var(--ar);max-width:460px}
  .rgd .dn{max-width:460px}
  .rgt > div{grid-template-columns:118px 1fr}
  .rgl{grid-template-columns:96px 1fr}
  .rgl .sy{height:40px}
  .rga{grid-template-columns:1fr}
}
@media print{ .rgx .ld1{stroke-width:.6} }`;
  if (!document.getElementById('regb-css')) {
    const st = document.createElement('style'); st.id = 'regb-css'; st.textContent = CSS; document.head.appendChild(st);
  }

  /* ------------------------------------------------------------ helpers */
  const e = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const f = n => +(+n).toFixed(3);
  const pc = v => +(v * 100).toFixed(3);
  // rich text: {cf} becomes the orange confirm tag, [ref] becomes an italic code reference
  const rt = s => e(s).replace(/\{cf\}/g, '<em class="cf">confirm</em>').replace(/\[([^\]]+)\]/g, '<i class="rf">$1</i>');
  const sec = (no, title, items, ref) => `<section class="rgs"><h3><span class="no">${no}</span>${e(title)}${ref ? `<span class="rf">${e(ref)}</span>` : ''}</h3>` +
    (Array.isArray(items) ? `<ol class="rgo">${items.map((t, k) => `<li><span>${k + 1}</span><span>${rt(t)}</span></li>`).join('')}</ol>` : items) + '</section>';
  const tab = (rows, kw) => `<dl class="rgt"${kw ? ` style="--kw:${kw}"` : ''}>${rows.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${rt(v)}</dd></div>`).join('')}</dl>`;
  const col = (ctx, x, y, w, inner) => `<div class="rgc" style="left:${ctx.U(x)};top:${ctx.U(y)};width:${ctx.U(w)}">${inner}</div>`;

  /* a detail: art box w x h inches, viewBox vw x vh; labels {t:[x,y], a:'l'|'r'|'c', b, i, s:[x,y] (leader start), p:[x,y] (leader end)} */
  function detail(ctx, o) {
    const { x, y, w, h, vw, vh } = o;
    let lead = '', labs = '';
    (o.labels || []).forEach(L => {
      if (L.p) lead += `<path class="ld1" d="M${f(L.s[0])} ${f(L.s[1])} L${f(L.p[0])} ${f(L.p[1])}"/><circle class="ldd" cx="${f(L.p[0])}" cy="${f(L.p[1])}" r="${f(vw / 150)}"/>`;
      labs += `<span class="rgq ${L.a || 'l'}${L.dim ? ' dim' : ''}" style="left:${pc((L.t[0] - (o.vx || 0)) / vw)}%;top:${pc((L.t[1] - (o.vy || 0)) / vh)}%">${L.b ? `<b>${e(L.b)}</b>` : ''}${L.i ? `<i>${e(L.i)}</i>` : ''}</span>`;
    });
    const art = `<div class="art" style="width:${ctx.U(w)};height:${ctx.U(h)};--ar:${f(w / h)}"><svg viewBox="${o.vx || 0} ${o.vy || 0} ${vw} ${vh}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${o.svg}${lead}</svg>${labs}${o.extra || ''}</div>`;
    return `<div class="rgd" style="left:${ctx.U(x)};top:${ctx.U(y)};width:${ctx.U(w)}">${art}${ctx.viewTitle(o.n, o.title, o.scale)}${o.note ? `<p class="dn">${rt(o.note)}</p>` : ''}${o.after || ''}</div>`;
  }
  const P = (d, c = 'k') => `<path class="${c}" d="${d}"/>`;
  const Ln = (x1, y1, x2, y2, c = 'k') => `<path class="${c}" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}"/>`;
  const Rc = (x, y, w, h, c = 'k') => `<rect class="${c}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/>`;
  const Pg = (pts, c = 'k') => `<path class="${c}" d="M${pts.map(p => `${f(p[0])} ${f(p[1])}`).join(' L')} Z"/>`;
  const dots = (x0, y0, x1, y1, step, r, seed = 1) => {   // a scatter of gravel or aggregate
    let s = '', k = seed;
    for (let yy = y0; yy < y1; yy += step) for (let xx = x0; xx < x1; xx += step) {
      k = (k * 9301 + 49297) % 233280; const jx = (k / 233280 - .5) * step * .8;
      k = (k * 9301 + 49297) % 233280; const jy = (k / 233280 - .5) * step * .8;
      s += `<circle class="fi" cx="${f(xx + step / 2 + jx)}" cy="${f(yy + step / 2 + jy)}" r="${f(r)}" opacity=".45"/>`;
    }
    return s;
  };
  const hatch = (x0, y0, x1, y1, step, c = 'kt') => {   // 45 degree hatch clipped to a rectangle
    let s = '';
    for (let t = x0 - (y1 - y0); t < x1; t += step) {
      let ax = t, ay = y1, bx = t + (y1 - y0), by = y0;
      if (ax < x0) { ay -= (x0 - ax); ax = x0; }
      if (bx > x1) { by += (bx - x1); bx = x1; }
      if (ay > by) s += Ln(ax, ay, bx, by, c);
    }
    return s;
  };
  const tick = (x, y) => Ln(x - .7, y + .7, x + .7, y - .7, 'k');   // dimension tick, 45 degrees
  const north = (l, t, s, deg) => `<div class="rgn" style="left:${l};top:${t};width:${s};height:${s}" aria-label="North">
    <svg viewBox="-1 -1 2 2" aria-hidden="true"><circle r=".78"/><g transform="rotate(${deg})"><path class="nd" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/><path class="nl" d="M0 .02 V.78"/></g></svg>
    <span style="left:${pc(.5 + .62 * Math.sin(deg * Math.PI / 180))}%;top:${pc(.5 - .62 * Math.cos(deg * Math.PI / 180))}%">N</span></div>`;

  /* ============================================================ A0.2 General notes */
  const GENERAL = [
    'This feasibility set records design intent for Lahontan Lot 235, for owner review, budgeting and the Lahontan pre design meeting. It is not for construction and not for permit.',
    'All work shall comply with the 2025 California Building Standards Code, Title 24, effective 1/1/26, as amended by Placer County, and with the Lahontan Design Book and design review conditions. Where two rules differ, the stricter governs.',
    'Site information is at feasibility accuracy. Property lines, setbacks, grades, trees and utilities shall be confirmed on a current boundary and topographic survey before design review submittal. {cf}',
    'Areas, heights and quantities are about, measured from the design model, gross to the outside face of walls. They will change as the design and the survey mature.',
    'Structural, civil, geotechnical, mechanical, electrical, plumbing, Title 24 energy and landscape consultants are not yet engaged. Their work joins later issuances and governs within their disciplines.',
    'At construction the contractor shall verify all dimensions and conditions at the site and report any discrepancy in writing before proceeding.',
    'Written dimensions govern over scaled ones, and larger scale details govern over smaller scale drawings. Never scale from a screen.',
    'Protect the signature tree in the front court through every phase: fence at the drip line, no grading, trenching, storage or parking inside it. Arborist to confirm the protection zone. {cf}',
    'Earthwork only inside the Lahontan window, 5/1 to 10/15, with clearing and excavation begun by 9/1. {cf}',
    'Any change to drawings approved by Lahontan design review needs Lahontan approval before it is built.',
    'These drawings and the living set are instruments of service of André Mandel. Reuse or alteration needs written consent.'
  ];
  const SCOPE = [
    'Site plan with coverage and impervious area, sheet A1.2.',
    'Floor plans of each level and the roof, sheets A2.1 to A2.3.',
    'Sections and elevations cut from the model, sheets A3.0 to A4.3.',
    'One exterior rendering and the live pocket model, sheets A0.0 and A9.1.',
    'Outline specifications, budget framework, regulatory report and preliminary timeline, sheets F1.0 to F4.0.',
    'Not included: construction documents, engineering, energy compliance, permit submittal and bidding.'
  ];
  const CONVENTIONS = [
    'Sheets are 36 by 24 in. Scales noted are true only on a full size print; on screen the set scales to fit.',
    'Elevations are feet above the site datum used by the model: main floor 5997.5, lower level 5992.5, primary suite 6004.0. Datum to be tied to the survey benchmark. {cf}',
    'Heights are measured from natural grade below, per the Lahontan Design Book. Every roof holds under 30 ft.',
    'Plans are drawn looking down with plan north shown by the arrow on each plan. Sections and elevations are drawn looking the way the flag points.',
    'Views are numbered on each sheet. A bubble reads view number over the sheet where the view is drawn.',
    'Hatches, line types and marks follow the symbols legend on this sheet.',
    'Handwritten notes on thin leaders are design intent, never specification.',
    'Burnt orange is the one accent: timber in the models, the hardened element on A6.1, and every item still to confirm.',
    'The living set on the web is current. A printed sheet is a snapshot of the issuance in its title block; the newest issuance governs.'
  ];
  const ABBR = [
    ['AFF', 'above finished floor'], ['APN', 'assessor parcel number'], ['ASCE', 'American Society of Civil Engineers'], ['ASTM', 'ASTM International'],
    ['CBC', 'California Building Code'], ['CFC', 'California Fire Code'], ['CLR', 'clear'], ['CMC', 'California Mechanical Code'], ['CO', 'carbon monoxide'],
    ['CONC', 'concrete'], ['CPC', 'California Plumbing Code'], ['CRC', 'California Residential Code'], ['CWUIC', 'California Wildland Urban Interface Code'],
    ['CZ', 'climate zone'], ['DR', 'design review'], ['EERO', 'emergency escape and rescue opening'], ['EL', 'elevation'], ['EXT', 'exterior'],
    ['FA', 'feasibility analysis'], ['FF', 'finished floor'], ['FHSZ', 'fire hazard severity zone'], ['FRT', 'fire retardant treated'], ['GA', 'gauge'],
    ['GYP', 'gypsum board'], ['HERS', 'home energy rating system'], ['LCC', 'Lahontan design review'], ['MAX', 'maximum'], ['MIN', 'minimum'],
    ['NTS', 'not to scale'], ['OC', 'on center'], ['PL', 'property line'], ['PV', 'photovoltaic'], ['SF', 'square feet'], ['TYP', 'typical'],
    ['UON', 'unless otherwise noted'], ['VIF', 'verify in field'], ['WUI', 'wildland urban interface'], ['WRB', 'weather resistive barrier']
  ];
  const CODE = [
    ['Codes', '2025 CRC, CBC, CALGreen, California Energy Code, California WUI Code (Title 24 Part 7), CMC, CPC, California Electrical Code, CFC. Effective 1/1/26.'],
    ['Jurisdiction', 'Placer County, unincorporated. Building Services.'],
    ['Fire district', 'Truckee Fire Protection District {cf}'],
    ['Design review', 'Lahontan LCC, Design Book'],
    ['Zoning', 'RS PD 1.7 · APN 108 160 012 000'],
    ['Occupancy', 'R3 single family dwelling · U attached garage'],
    ['Construction', 'Type VB, sprinklered throughout'],
    ['Sprinklers', 'Required, NFPA 13D or CPC 612 [CRC R309]'],
    ['Fire hazard', 'Very High FHSZ, full wildfire hardening [CRC R337] · LRA or SRA {cf}'],
    ['Climate zone', 'CZ 16'],
    ['Stories', 'Two, the south wing stepping down with grade'],
    ['Conditioned', 'about 3,779 sf'],
    ['Garage', 'about 1,006 sf'],
    ['Lot', 'about 27,440 sf, 0.63 ac · confirm on survey'],
    ['Coverage', 'about 19.6% · impervious about 28.2%'],
    ['Height', '30 ft max over natural grade · tip about 29.4 ft']
  ];
  const CRITERIA = [
    ['Ground snow', 'Per Placer County at about 6,000 ft · confirm with the engineer'],
    ['Roof snow', 'ASCE 7, 2022 edition, drift at the ribbon fold and every step · confirm with the engineer'],
    ['Wind', 'ASCE 7, 2022 edition, exposure C assumed · confirm with the engineer'],
    ['Seismic', 'Design category D assumed · confirm with the engineer'],
    ['Soils', 'Per the geotechnical report, not yet engaged {cf}'],
    ['Frost depth', 'Per Placer County · confirm with the engineer'],
    ['Live loads', 'Per [CRC Table R301.5], decks and balconies included'],
    ['Datum', 'Main floor 5997.5, site datum · confirm on survey']
  ];

  function legend(ctx) {
    const row = (sym, b, i) => `<div class="rgl"><div class="sy">${sym}</div><div class="tx"><b>${e(b)}</b><i>${rt(i)}</i></div></div>`;
    const S = (vb, body) => `<svg viewBox="${vb}" preserveAspectRatio="xMinYMid meet" aria-hidden="true">${body}</svg>`;
    const bub = (cx, cy, r, a, b) => `<circle class="k" cx="${cx}" cy="${cy}" r="${r}" style="fill:var(--paper)"/>${Ln(cx - r, cy, cx + r, cy)}<text x="${cx}" y="${cy - r * .22}" font-size="${r * .72}" text-anchor="middle">${a}</text><text x="${cx}" y="${cy + r * .66}" font-size="${r * .5}" text-anchor="middle">${b}</text>`;
    const rows = [
      row(`<div style="position:absolute;inset:0">${ctx.viewTitle(1, 'View', 'Scale')}</div>`, 'View title', 'view number, title and scale under every view'),
      row(S('0 0 31 11', `${Ln(1, 5.5, 22, 5.5, 'k2')}<path class="fi" d="M16 5.5 L16 1.2 L19.5 3.35 Z"/>${bub(26, 5.5, 4.2, '1', 'A3.0')}`), 'Section mark', 'cut line, flag looks the way the section looks; view over sheet'),
      row(S('0 0 31 11', `${bub(8, 5.5, 4.2, '2', 'A4.1')}<path class="fi" d="M12.6 5.5 L16.6 2.3 L16.6 8.7 Z"/>`), 'Elevation mark', 'the pointer faces the wall drawn; view over sheet'),
      row(S('0 0 31 11', `<circle class="kd" cx="7" cy="5.5" r="4.6"/>${Ln(11.2, 4, 17, 3)}${bub(22, 3.5, 3.4, '4', 'A6.1')}`), 'Detail callout', 'the dashed ring is enlarged on the sheet named'),
      row(S('0 0 31 11', `${Ln(1, 5.5, 13, 5.5, 'k')}<circle class="k" cx="6" cy="5.5" r="2.1"/><path class="fi" d="M6 3.4 A2.1 2.1 0 0 1 8.1 5.5 L6 5.5 Z M6 7.6 A2.1 2.1 0 0 1 3.9 5.5 L6 5.5 Z"/><text x="14.5" y="6.8" font-size="3.4">5997.5</text>`), 'Level datum', 'finished floor, feet above the site datum'),
      row(S('0 0 31 11', `${Ln(3, 3.5, 7, 7.5)}${Ln(3, 7.5, 7, 3.5)}<text x="9" y="6.8" font-size="3.4">5996.8</text>`), 'Spot elevation', 'grade or surface at a point'),
      row(`<svg viewBox="0 0 31 11" preserveAspectRatio="xMinYMid meet" aria-hidden="true"><circle class="k" cx="5.5" cy="5.5" r="4.2"/><g transform="translate(5.5 5.5) rotate(${ctx.DRW && ctx.DRW.north || 39.3}) scale(5.3)"><path class="ofs" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/></g></svg>`, 'North arrow', 'plan north, drawn from the survey bearing {cf}'),
      row(`<span class="note">note</span><span class="dot" style="left:78%;top:78%"></span><svg viewBox="0 0 31 11" preserveAspectRatio="none" aria-hidden="true"><path class="ld1" d="M13.5 4 Q16 8.5 24 8.6"/></svg>`, 'Hand note', 'design intent on a thin leader, never specification'),
      row(S('0 0 31 11', `<path class="k2" d="M1 5.5 H30" stroke-dasharray="7 1.6 1.2 1.6"/>`), 'Property line', 'from the lot data · confirm on survey'),
      row(S('0 0 31 11', `<path class="kd" d="M1 5.5 H30"/>`), 'Setback or limit', 'building setback, height or zone limit'),
      row(S('0 0 31 11', `<circle class="kd" cx="7" cy="5.5" r="4.8"/><circle class="ofs" cx="7" cy="5.5" r=".9"/>${Ln(14, 5.5, 30, 5.5, 'cl')}`), 'Tree to keep', 'canopy at the drip line, the signature tree in the court'),
      row(S('0 0 31 11', `${Rc(1, 1.5, 8, 8)}${dots(1, 1.5, 9, 9.5, 1.6, .28, 3)}${Rc(11, 1.5, 8, 8)}${hatch(11, 1.5, 19, 9.5, 1.5)}${Rc(21, 1.5, 9, 8)}<path class="o" d="M21 3.6 C24 3 26 4.3 30 3.6 M21 6 C24 5.4 27 6.7 30 6 M21 8.2 C24 7.7 26 8.8 30 8.2"/>`), 'Hatches', 'concrete · earth · timber, the orange grain'),
      row(`<span style="position:absolute;left:0;top:50%;transform:translateY(-50%)"><em class="cf" style="margin:0">confirm</em></span>`, 'Confirm', 'not yet verified; holds until a survey, consultant or agency confirms it')
    ];
    return rows.join('');
  }

  LIVING_SHEETS.push({
    id: 'A0.2', group: 'General', title: 'General notes', short: 'General notes', foot: 'General notes',
    scale: 'None', issued: [4],
    cap: 'The ground rules for the set: what it is, how to read it, and the code basis it stands on.',
    data: ['2025 California codes, effective 1/1/26', 'R3 · Type VB · sprinklered', 'Very High FHSZ · CZ 16', 'Loads confirmed by the engineer'],
    notes: [
      { text: 'every roof under 30 ft', t: [27.4, 18.05], p: [26.2, 16.5], a: 'l' }
    ],
    html: ctx => {
      const top = 3.35;
      let h = '<div class="rgx">';
      h += col(ctx, .6, top, 6.85, sec('01', 'General conditions', GENERAL) + sec('02', 'Scope of the FA set', SCOPE));
      h += col(ctx, 7.85, top, 6.85, sec('03', 'Drawing conventions', CONVENTIONS) +
        sec('04', 'Abbreviations', `<div class="rga">${ABBR.map(([a, b]) => `<div><b>${e(a)}</b><span>${e(b)}</span></div>`).join('')}</div>`));
      h += col(ctx, 15.1, top, 6.75, sec('05', 'Symbols legend', legend(ctx)));
      h += col(ctx, 22.25, top, 8.1, sec('06', 'Design criteria', tab(CRITERIA, '1.35in')) + sec('07', 'Code analysis', tab(CODE, '1.35in')));
      return h + '</div>';
    }
  });

  /* ============================================================ A0.3 Code and energy notes */
  const CAL_GREEN = [
    'Mandatory residential measures of the 2025 California Green Building Standards Code, Title 24 Part 11, apply in full. [CALGreen Ch 4]',
    'Storm water kept on site during construction; grading drains water away from the house. [4.106.2, 4.106.3]',
    'Electric vehicle charging at the attached garage, raceway and panel capacity per the adopted text. [4.106.4] {cf}',
    'Plumbing fixtures: toilets 1.28 gpf, showerheads 1.8 gpm, lavatory faucets 1.2 gpm, kitchen faucets 1.8 gpm. [4.303.1]',
    'Outdoor water per the state landscape ordinance, fire wise and drip irrigated. [4.304.1]',
    'At least 65% of construction waste diverted from landfill, tracked by the contractor. [4.408.1]',
    'Fireplaces: direct vent sealed combustion gas, or a certified low emission wood appliance where Lahontan and the air district allow. [4.503.1] {cf}',
    'Low VOC adhesives, sealants, paints and flooring; composite wood to state emission limits. [4.504]',
    'Capillary break under slabs; framing at 19% moisture or less before it is closed in. [4.505.2, 4.505.3]',
    'Bath fans Energy Star, humidity controlled, ducted outside. HVAC sized by Manual J, D and S. [4.506.1, 4.507.2]',
    'An operation and maintenance manual goes to the owner at final. [4.410.1]'
  ];
  const ENERGY = [
    '2025 California Energy Code, Title 24 Part 6, climate zone 16. Compliance by the performance method, prepared by a certified energy analyst. {cf}',
    'Mandatory measures apply on either path: insulation minimums, fenestration U factor caps, air sealing, duct sealing, lighting and controls. [§150.0]',
    'All electric heat pump heating, cooling and hot water assumed for design. {cf}',
    'Solar PV per the code sizing, adjusted for snow, shade and the tree canopy; battery ready panel and raceway. [§150.1(c)14, §150.0(s)] {cf}',
    'Whole house ventilation and kitchen exhaust to ASHRAE 62.2, MERV 13 filtration at the air handlers. [§150.0(m), §150.0(o)]',
    'High efficacy lighting throughout, dimming in living spaces, vacancy sensors in baths, garage and laundry, exterior lights on photocell and timer. [§150.0(k)]',
    'Fenestration NFRC rated and labeled; every pane tempered for wildfire, dual or triple glazed to meet the model.',
    'Documents: CF1R on the permit set, CF2R during installation, CF3R HERS field verification, all registered.',
    'The glass walls, the lifted tip and the clerestory at the fold will carry the energy model; the prescriptive tables are unlikely to fit this much glass.'
  ];
  const WUI = [
    'Lahontan lies in a Very High FHSZ. Every assembly is hardened per [CRC R337] and the 2025 California Wildland Urban Interface Code, Title 24 Part 7. Section numbers {cf} against the adopted text.',
    'Class A roof assembly, eave and ridge gaps fire stopped, valley flashing over a cap sheet. [CWUIC 504.2]',
    'Vents listed to ASTM E2886 or approved by the State Fire Marshal; none in eaves unless listed for it. [CWUIC Ch 5] {cf}',
    'Eaves and soffits enclosed, ignition resistant or noncombustible. [CWUIC 504.3]',
    'Exterior walls ignition resistant or noncombustible from foundation to roof. [CWUIC 504.5]',
    'Decks: walking surfaces ignition resistant, exterior FRT or noncombustible. [CWUIC 504.7]',
    'Glazing: at least one tempered pane in every unit; doors noncombustible, 1 3/8 in solid core or 20 min. [CWUIC 504.8, 504.9]',
    'Defensible space and Zone 0 per PRC 4291 and the fire district. Details on sheet A6.1.'
  ];
  const LIFE = [
    'Automatic fire sprinklers throughout, NFPA 13D or CPC 612, designed by a licensed fire protection contractor as a deferred submittal. Water supply and meter size by the purveyor. [CRC R309] {cf}',
    'Smoke alarms in every sleeping room, outside each sleeping area and on every level, hardwired, interconnected, battery backed. [CRC R310]',
    'Carbon monoxide alarms outside each sleeping area and on every level, required by the attached garage and any fuel burning appliance. [CRC R311]',
    'Garage to house: 1/2 in gypsum on the garage side, 5/8 in Type X under any room above; door solid core 1 3/8 in or 20 min, self closing and self latching; no opening into a bedroom. [CRC R302.5, R302.6]'
  ];
  const EGRESS = [
    'One egress door, side hinged, 32 in clear wide and 78 in clear high, with a landing at least 36 in deep. [CRC R318.2, R318.3]',
    'Emergency escape opening in every sleeping room and any basement: 5.7 sf net clear (5.0 sf at grade), 24 in high, 20 in wide, sill 44 in max above the floor. Fixed square panes do not count; operable units are sized to meet it. [CRC R319]',
    'Safety glazing at doors, beside doors, at stairs and landings, wet areas and large low panes. Glass in guards laminated and tempered. [CRC R324.4] {cf}',
    'Aging in place: grab bar blocking in one entry level bath, a 32 in clear doorway to one entry level bath and bedroom, the granny suite included. [CRC R328]'
  ];
  const STAIR = [
    'Guards where a floor, deck or stair is more than 30 in above the surface below within 36 in: 36 in high min, 34 in at stair sides. [CRC R321.1] {cf}',
    'Guard openings pass no 4 in sphere, 4 3/8 in at stair sides; 6 in triangle at the riser, tread and bottom rail. [CRC R321.1]',
    'Window fall protection where an operable sill is less than 24 in above the floor and more than 72 in above grade. [CRC R321.2]',
    'Stairs: 36 in wide min, headroom 6 ft 8 in, risers 7 3/4 in max, treads 10 in min, nosing 3/4 to 1 1/4 in, 3/8 in max variation in a flight. [CRC R318.7]',
    'A flight rises 12 ft 7 in max between landings. A 12 ft rise takes about 19 risers at about 7 9/16 in and about 15 ft of run, inside the bridge. {cf}',
    'Landings at the top and bottom of each flight, as wide as the stair and 36 in deep. Open risers pass no 4 in sphere. [CRC R318.7]',
    'Handrails on flights of four risers or more, 34 to 38 in above the nosing, 1 1/4 to 2 in grip, 1 1/2 in clear of the wall, continuous. [CRC R320]',
    'Chimneys: 3 ft over the roof penetration and 2 ft over anything within 10 ft; the design holds 4 ft over adjacent roofs. Spark arrester at every flue. [CRC R1003.9]'
  ];

  const CODE_BAND = 13.3;
  /* code diagrams for A0.3: typical, not this plan */
  const tk = (x, y) => Ln(x - .6, y + .6, x + .6, y - .6, 'k');
  function cStair() {
    let s = '', d = 'M8 31';
    const R = 3.1, T = 4, X0 = 15;
    for (let k = 0; k < 5; k++) d += ` H${f(X0 + k * T)} V${f(31 - (k + 1) * R)}`;
    d += ` H50`;
    s += Ln(0, 31, 55.5, 31, 'cl') + P(d, 'k2');
    for (let k = 0; k < 5; k++) s += Ln(X0 + k * T - .45, 31 - (k + 1) * R, X0 + k * T, 31 - (k + 1) * R, 'k2');
    const ny = x => 31 - R - (x - X0) * R / T;
    s += Ln(X0 - 2, ny(X0 - 2), X0 + 18, ny(X0 + 18), 'kd');
    s += Ln(X0 - 2, ny(X0 - 2) - 5.5, X0 + 17, ny(X0 + 17) - 5.5, 'k') + Ln(X0 + 17, ny(X0 + 17) - 5.5, 50, ny(X0 + 17) - 5.5, 'k');
    s += Ln(X0 - 3, ny(X0 - 3) - 16.2, X0 + 17, ny(X0 + 17) - 16.2, 'kt');
    s += Ln(X0, ny(X0), X0, ny(X0) - 16.2, 'k') + tk(X0, ny(X0)) + tk(X0, ny(X0) - 16.2);
    s += Ln(12.4, 31, 12.4, 31 - R, 'k') + tk(12.4, 31) + tk(12.4, 31 - R) + Ln(11.8, 31 - R, X0, 31 - R, 'cl');
    s += Ln(X0, 34, X0 + T, 34, 'k') + tk(X0, 34) + tk(X0 + T, 34);
    return { svg: s, labels: [
      { t: [X0 - .8, 17.2], a: 'r', b: '', i: '6 ft 8 in min', dim: 1 },
      { t: [11.6, 29.4], a: 'r', b: '', i: '7 3/4 in max', dim: 1 },
      { t: [X0 + 2, 35.9], a: 'l', b: '', i: '10 in min', dim: 1 },
      { t: [53.5, 4.6], a: 'r', b: 'Handrail', i: '34 to 38 in over the nosing', s: [44, 7], p: [40, ny(X0 + 17) - 5.5] }
    ] };
  }
  function cGuard() {
    let s = '';
    s += Ln(0, 19, 55, 19, 'cl');
    s += Rc(2, 19, 22, 2.4, 'kf') + Ln(24, 21.4, 24, 33, 'kt') + Ln(2, 33, 50, 33, 'k2') + hatch(24, 33.4, 50, 36, 1.4);
    s += Rc(21.6, 4.4, 2.4, 1.2, 'k2') + Ln(22.8, 5.6, 22.8, 19, 'k');
    s += Ln(2, 5, 24, 5, 'kt');
    [6, 10.4, 14.8, 19.2].forEach(x => { s += Ln(x, 5.6, x, 19, 'k'); });
    s += Rc(2, 4.4, 22, 1.2, 'k2');
    s += `<circle class="kd" cx="12.6" cy="12.5" r="2.05"/>`;
    s += Ln(29, 4.4, 29, 19) + tk(29, 4.4) + tk(29, 19) + Ln(24.4, 4.4, 30, 4.4, 'cl');
    s += Ln(29, 21.4, 29, 33) + tk(29, 21.4) + tk(29, 33);
    return { svg: s, labels: [
      { t: [30.4, 11.5], a: 'l', b: '', i: '36 in min', dim: 1 },
      { t: [30.4, 27], a: 'l', b: '', i: 'over 30 in, a guard', dim: 1 },
      { t: [41, 6.5], a: 'l', b: '4 in sphere', i: 'must not pass', s: [40.4, 7.4], p: [14.3, 11.2] }
    ] };
  }
  function cEero() {
    let s = '';
    s += Ln(0, 32, 55, 32, 'k2') + Ln(0, 17, 55, 17, 'cl');
    s += Rc(14, 3, 20, 14.6, 'k2') + Rc(15.2, 4.2, 17.6, 12.2, 'kf');
    s += P('M32.8 4.2 L42 1.8 L42 18.8 L32.8 16.4', 'k');
    s += Ln(15.2, 1.2, 32.8, 1.2) + tk(15.2, 1.2) + tk(32.8, 1.2);
    s += Ln(9.6, 4.2, 9.6, 16.4) + tk(9.6, 4.2) + tk(9.6, 16.4);
    s += Ln(9.6, 17.6, 9.6, 32) + tk(9.6, 17.6) + tk(9.6, 32) + Ln(9, 17.6, 14, 17.6, 'cl');
    return { svg: s, labels: [
      { t: [24, 25], a: 'c', b: '5.7 sf net clear', i: '5.0 sf at grade', s: [24, 22.9], p: [24, 12.5] },
      { t: [24, -1], a: 'c', b: '', i: '20 in min wide', dim: 1 },
      { t: [8.6, 10.3], a: 'r', b: '', i: '24 in min', dim: 1 },
      { t: [8.6, 24.8], a: 'r', b: '', i: '44 in max sill', dim: 1 },
      { t: [43.5, 24], a: 'l', b: 'Operable', i: 'fixed panes don\'t count' }
    ] };
  }
  function cAlarm() {
    let s = '';
    s += Rc(2, 2, 51, 30, 'k2');
    s += Ln(2, 13, 53, 13) + Ln(19, 2, 19, 13) + Ln(36, 2, 36, 13) + Ln(14, 13, 14, 32);
    const al = (x, y, t, o) => `<circle class="${o ? 'of' : 'k'}" cx="${x}" cy="${y}" r="2.3" ${o ? '' : 'style="fill:var(--paper)"'}/><text x="${x}" y="${f(y + .95)}" font-size="2.5" text-anchor="middle">${t}</text>`;
    s += al(10.5, 7.5, 'S') + al(27.5, 7.5, 'S') + al(44.5, 7.5, 'S') + al(26, 17.5, 'S') + al(33, 17.5, 'CO', 1) + al(40, 24.5, 'S');
    return { svg: s, labels: [
      { t: [8, 35.2], a: 'c', b: 'Garage', i: 'attached' },
      { t: [45.5, 29.2], a: 'c', b: '', i: 'every level' },
      { t: [36, 35.2], a: 'c', b: '', i: 'sleeping rooms, placeholders', dim: 1 }
    ] };
  }
  function cDocs() {
    let s = '';
    const X = [5, 19, 33, 48];
    s += P('M5 16 C12 14.6 14 17.4 19 16 S27 14.6 33 16 S42 17.4 48 16', 'k');
    X.forEach((x, k) => { s += `<circle class="${k === 2 ? 'of' : 'k'}" cx="${x}" cy="16" r="1.5" style="fill:var(--paper)"/>`; });
    return { svg: s, labels: [
      { t: [5, 8.5], a: 'c', b: 'CF1R', i: 'on the permit set' },
      { t: [19, 23.5], a: 'c', b: 'CF2R', i: 'during install' },
      { t: [33, 8.5], a: 'c', b: 'CF3R', i: 'HERS verifies' },
      { t: [48, 23.5], a: 'c', b: 'Final', i: 'all registered' }
    ] };
  }

  LIVING_SHEETS.push({
    id: 'A0.3', group: 'General', title: 'Code and energy notes', short: 'Code and energy notes', foot: 'Code and energy',
    scale: 'None', issued: [4],
    cap: 'Green building, energy, wildfire and life safety, cited to the 2025 California codes that took effect on 1/1/26.',
    data: ['CALGreen mandatory measures', 'Title 24 Part 6 · performance path', 'CRC R337 · Title 24 Part 7', 'Sprinklers, alarms, egress, guards, stairs'],
    notes: [
      { text: 'this much glass wants the performance path', t: [8.3, 11.35], p: [14.6, 9.62], a: 'l' }
    ],
    html: ctx => {
      const top = 3.35;
      let h = '<div class="rgx">';
      h += col(ctx, .6, top, 7.05, sec('01', 'CALGreen', CAL_GREEN, 'Title 24 Part 11'));
      h += col(ctx, 8.05, top, 7.05, sec('02', 'Energy', ENERGY, 'Title 24 Part 6'));
      h += col(ctx, 15.5, top, 7.05, sec('03', 'Wildfire', WUI, 'Title 24 Part 7 · CRC R337') + sec('04', 'Fire and life safety', LIFE, 'CRC Ch 3'));
      h += col(ctx, 22.95, top, 7.4, sec('05', 'Egress and glazing', EGRESS, 'CRC Ch 3') + sec('06', 'Guards and stairs', STAIR, 'CRC Ch 3'));
      const C = [
        { n: 1, title: 'Stair geometry', g: cStair, note: 'Risers, treads and headroom. [CRC R318.7, R320]' },
        { n: 2, title: 'Guards', g: cGuard, note: 'Height and openings. [CRC R321.1]' },
        { n: 3, title: 'Escape opening', g: cEero, note: 'Every sleeping room. [CRC R319]' },
        { n: 4, title: 'Smoke and CO alarms', g: cAlarm, note: 'Hardwired, interconnected. [CRC R310, R311]' },
        { n: 5, title: 'Energy documents', g: cDocs, note: 'Performance path, CZ 16. [Title 24 Part 6]' }
      ];
      const bw = 5.55, by = CODE_BAND;
      C.forEach((c, k) => {
        const g = c.g();
        h += detail(ctx, { x: .6 + k * (bw + .5), y: by, w: bw, h: 3.4, vy: -3, vw: 55.5, vh: 39, svg: g.svg, labels: g.labels, n: c.n, title: c.title, scale: 'Typical · not to scale', note: c.note });
      });
      return h + '</div>';
    }
  });

  /* ============================================================ A6.1 Wildfire hardening, the details */
  const VW = 50, VH = 50, VY = -4;

  function dRoof() {
    const y = x => 18 - .15 * (x - 4);
    let s = '';
    s += Ln(0, y(0) - 1.3, 50, y(50) - 1.3, 'cl') + Ln(38, 0, 38, 42, 'cl');
    s += Pg([[6, y(6) + 1], [49, y(49) + 1], [49, y(49) + 7], [6, y(6) + 7]], 'kf');
    s += Ln(8, y(8) + 3.4, 47, y(47) + 3.4, 'kt') + Ln(10, y(10) + 5, 44, y(44) + 5, 'kt');
    s += Pg([[4.5, y(4.5)], [49, y(49)], [49, y(49) + 1], [4.5, y(4.5) + 1]], 'k');
    s += Ln(4.5, y(4.5) - .55, 49, y(49) - .55, 'o');
    s += Ln(3.6, y(3.6) - 1.3, 49, y(49) - 1.3, 'k2');
    [10, 17, 24, 31, 38, 45].forEach(x => { s += P(`M${f(x)} ${f(y(x) - 1.3)} V${f(y(x) - 3.1)} H${f(x + .7)} V${f(y(x + .7) - 1.3)}`, 'k'); });
    s += Pg([[5.9, y(5.9) - 1.3], [9.2, y(9.2) - 1.3], [9.2, y(9.2)], [5.9, y(5.9)]], 'of');
    s += Rc(3.6, 16.2, 2.2, 10, 'kf');
    s += P('M2.6 15.7 L6.4 15.3 M2.6 15.7 V17.8', 'k2');
    s += Rc(5.8, 26.2, 32.2, .75, 'k');
    s += Rc(38, y(38) + 7, 4, 26.2 - y(38) - 7, 'k') + Ln(38, y(38) + 7, 42, 26.2, 'kt') + Ln(42, y(42) + 7, 38, 26.2, 'kt');
    s += Ln(38, 26.2, 38, 42) + Ln(42, 26.2, 42, 42) + Ln(37.2, 26.95, 37.2, 42);
    return {
      svg: s, labels: [
        { t: [1, -1.6], a: 'l', b: 'Standing seam metal', i: 'Class A assembly', s: [8, .9], p: [10.35, y(10) - 3.1] },
        { t: [49.5, -1.6], a: 'r', b: 'Mineral cap sheet', i: '72 lb, under the metal', s: [46.5, .9], p: [44, y(44) - .55] },
        { t: [1.5, 33.5], a: 'l', b: 'Eave fire stopped', i: 'no open gap at eave or ridge', s: [4.5, 31.7], p: [7.6, y(7.6) - .65] }
      ]
    };
  }
  function dVent() {
    let s = '';
    s += Ln(0, 14, 50, 14, 'cl') + Ln(0, 28, 50, 28, 'cl');
    s += Ln(17, 2, 17, 14) + Ln(17, 28, 17, 34) + Ln(18.2, 2, 18.2, 14) + Ln(18.2, 28, 18.2, 34);
    s += Ln(27, 2, 27, 14) + Ln(27, 28, 27, 34) + Ln(26, 2, 26, 14, 'kt') + Ln(26, 28, 26, 34, 'kt');
    s += P('M19.5 4 l1.8 1.6 l1.8 -1.6 l1.8 1.6 l1.8 -1.6 M19.5 30.6 l1.8 1.6 l1.8 -1.6 l1.8 1.6 l1.8 -1.6', 'kt');
    s += Rc(16.4, 14, 11.2, 14, 'k2');
    s += P('M19.4 14.6 L22.6 18 L19.4 21.4 L22.6 24.8 L19.4 27.4 M22.8 14.6 L26 18 L22.8 21.4 L26 24.8 L22.8 27.4', 'k');
    s += Ln(17.6, 14.3, 17.6, 27.7, 'od') + Ln(18.3, 14.3, 18.3, 27.7, 'od');
    [[6, 12], [9.5, 18.5], [4, 23], [12, 25.5], [7.5, 31], [15.6, 20.5]].forEach(([x, y2], k) => {
      s += P(`M${f(x - 3.4)} ${f(y2 + 1.4)} Q${f(x - 1.6)} ${f(y2 + 1.3)} ${f(x)} ${f(y2)}`, 'kt');
      s += `<circle class="ofs" cx="${f(x)}" cy="${f(y2)}" r="${k === 5 ? .55 : .42}"/>`;
    });
    s += P('M28.5 21 C31.5 19.4 33.5 22.6 37 21 S41 19.6 43.5 21', 'kt') + P('M42.4 19.9 L43.8 21 L42.3 22', 'kt');
    return {
      svg: s, labels: [
        { t: [29, 7.5], a: 'l', b: 'Listed vent', i: 'ASTM E2886, ember and flame', s: [28.6, 9.4], p: [26.6, 14.4] },
        { t: [29.5, 39.8], a: 'l', b: 'Baffle', i: 'no straight path for embers', s: [30.5, 38.2], p: [24.4, 25.6] },
        { t: [1, 39.8], a: 'l', b: 'Noncombustible mesh', i: 'corrosion resistant', s: [8.5, 38.2], p: [17.6, 27.2] }
      ]
    };
  }
  function dEave() {
    const y = x => 10 - .12 * (x - 6);
    let s = '';
    s += Ln(0, 22.4, 50, 22.4, 'cl') + Ln(36, 0, 36, 42, 'cl');
    s += Pg([[6.5, y(6.5)], [49, y(49)], [49, y(49) + 5.5], [6.5, y(6.5) + 5.5]], 'kf');
    s += Ln(4.8, y(4.8) - 1, 49, y(49) - 1, 'k') + Ln(4.8, y(4.8) - 1.9, 49, y(49) - 1.9, 'k2');
    s += Rc(4.8, y(4.8) - 1, 1.7, 23 - y(4.8) + 1, 'kf');
    s += Rc(6.5, 22.4, 29.5, .9, 'of');
    s += Rc(36, y(36) + 5.5, 6, 22.4 - y(36) - 5.5, 'of') + Ln(36, y(36) + 5.5, 42, 22.4, 'o') + Ln(42, y(42) + 5.5, 36, 22.4, 'o');
    s += Ln(36, 22.4, 36, 42) + Ln(42, 22.4, 42, 42) + Ln(34.8, 23.3, 34.8, 42) + Ln(35.4, 23.3, 35.4, 42, 'kt');
    s += Ln(34.6, 23.3, 36, 23.3);
    s += Ln(8, 22.4, 8, 23.3, 'kt') + Ln(20, 22.4, 20, 23.3, 'kt') + Ln(32, 22.4, 32, 23.3, 'kt');
    return {
      svg: s, labels: [
        { t: [3, 29], a: 'l', b: 'Enclosed soffit', i: 'noncombustible, or 1 hr underside', s: [5.5, 27.4], p: [12, 23.3] },
        { t: [33.2, 36.5], a: 'r', b: 'Solid blocking', i: '2 in nominal, at the wall top', s: [33.8, 35], p: [38.2, 19.6] },
        { t: [3, 4], a: 'l', b: 'No vents in the eave', i: 'the ribbon overhang included' }
      ]
    };
  }
  function dSiding() {
    let s = '';
    s += Ln(0, 30, 50, 30, 'cl') + Ln(0, 36, 50, 36, 'cl');
    s += Rc(11.8, 1, 1.6, 29, 'kf');
    [5, 12, 19, 26].forEach(y2 => { s += Ln(11.8, y2, 13.4, y2 - .3, 'kt'); });
    s += Ln(13.4, 1, 13.4, 30, 'kt') + Ln(14.6, 1, 14.6, 30, 'kt');
    [4, 10, 16, 22, 28].forEach(y2 => { s += Rc(13.5, y2 - 1.1, 1, 2.2, 'kt'); });
    s += Ln(14.9, 1, 14.9, 30, 'k') + Rc(15.2, 1, 1, 28, 'of');
    s += Ln(16.2, 1, 16.2, 29, 'k') + Ln(22, 1, 22, 29, 'k');
    s += P('M16.6 2 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4 l-4.9 1.4 l4.9 1.4', 'kt');
    s += Rc(22, 1, .7, 28, 'k');
    s += Rc(16.2, 29, 5.8, 1, 'k');
    s += Rc(14, 30, 9, 12, 'k') + dots(14, 30, 23, 42, 1.5, .2, 7);
    s += P('M11.3 30.6 L11.3 29.6 L13.6 29.6 L14 30', 'k2');
    s += Ln(0, 36, 14, 36, 'k2') + hatch(0, 36, 14, 42, 1.6);
    s += Ln(8.2, 30, 8.2, 36, 'k') + tick(8.2, 30) + tick(8.2, 36);
    return {
      svg: s, labels: [
        { t: [26, 6.5], a: 'l', b: 'Cedar boards, FRT', i: 'exterior grade, weathered test', s: [25.4, 6.5], p: [12.6, 8.5] },
        { t: [26, 14.5], a: 'l', b: '5/8 in Type X sheathing', i: 'behind the WRB and battens', s: [25.4, 14.5], p: [15.7, 15.5] },
        { t: [26, 35.5], a: 'l', b: '6 in noncombustible', i: 'siding clear of grade', s: [25.4, 35.5], p: [23, 33] },
        { t: [7.4, 33], a: 'r', b: '', i: '6 in', dim: 1 }
      ]
    };
  }
  function dDeck() {
    let s = '';
    s += Ln(0, 12, 50, 12, 'cl') + Ln(0, 34.5, 50, 34.5, 'cl');
    s += Rc(1.4, 0, 3.6, 42, 'kf') + Ln(.8, 0, .8, 42, 'kt');
    s += Rc(5, 13.2, 1, 5.8, 'k');
    for (let x = 6.1; x < 45.5; x += 3.55) s += Rc(x, 12, 3.1, 1.2, 'of');
    [9, 17, 25, 33, 41].forEach(x => { s += Rc(x, 13.2, 1.5, 5.8, 'kf'); });
    s += Rc(6, 19, 40.5, 3.4, 'kf') + Ln(8, 20.7, 44, 20.7, 'kt');
    s += Rc(20, 22.4, 3, 11, 'kf');
    s += Pg([[17, 33.4], [26, 33.4], [26, 38.4], [17, 38.4]], 'k') + dots(17, 33.4, 26, 38.4, 1.5, .2, 5);
    s += Ln(5, 34.5, 17, 34.5, 'k2') + Ln(26, 34.5, 50, 34.5, 'k2');
    s += dots(5, 34.5, 17, 36.6, 1.1, .24, 2) + dots(26, 34.5, 46.5, 36.6, 1.1, .24, 9);
    s += hatch(5, 36.8, 17, 42, 1.6) + hatch(26, 36.8, 50, 42, 1.6);
    s += Ln(46.7, 13.2, 46.7, 34.5, 'od');
    return {
      svg: s, labels: [
        { t: [9, 4.2], a: 'l', b: 'Ignition resistant decking', i: 'or exterior FRT, or noncombustible', s: [11, 6.7], p: [14.3, 11.9] },
        { t: [45.4, 25.6], a: 'r', b: 'Skirt of 1/8 in mesh', i: 'or keep it open', s: [45.9, 25.6], p: [46.7, 23.5] },
        { t: [45.4, 31], a: 'r', b: 'Gravel below', i: 'nothing stored beneath', s: [31.4, 33.1], p: [29, 35.2] }
      ]
    };
  }
  function dGlass() {
    let s = '';
    s += Ln(0, 5, 50, 5, 'cl') + Ln(0, 36, 50, 36, 'cl');
    s += Rc(6.6, 4.4, 16.4, 32.2, 'k2') + Rc(7.6, 5.4, 14.4, 30.2, 'o');
    s += Ln(10, 12, 14, 8, 'kt') + Ln(11.5, 13.5, 16.5, 8.5, 'kt') + Ln(16, 31, 19.5, 27.5, 'kt');
    s += Ln(4.8, 5.4, 4.8, 35.6) + tick(4.8, 5.4) + tick(4.8, 35.6);
    s += Ln(7.6, 38.3, 22, 38.3) + tick(7.6, 38.3) + tick(22, 38.3);
    s += Rc(27, 16.5, 4.6, 9.5, 'kf') + Rc(26.3, 16, 1, 10.5, 'k');
    s += Rc(31.3, 19.9, 1.5, 2.8, 'k');
    s += Ln(29.5, 19.4, 48.6, 19.4, 'o') + Ln(29.5, 19.9, 48.6, 19.9, 'o') + Ln(29.5, 22.7, 48.6, 22.7, 'o') + Ln(29.5, 23.2, 48.6, 23.2, 'o');
    s += P('M48.6 18.4 L49.4 20 L48 21.3 L49.2 22.6 L48.6 24.2', 'k');
    return {
      svg: s, labels: [
        { t: [49.6, 9.8], a: 'r', b: 'Every pane tempered', i: 'dual or triple glazed', s: [46.6, 12], p: [42, 19.2] },
        { t: [49.6, 32.5], a: 'r', b: 'Metal clad frame', i: 'doors 1 3/8 in solid core or 20 min', s: [30.2, 31.3], p: [29.2, 26.2] },
        { t: [4, 20.5], a: 'r', b: '', i: '8 ft', dim: 1 },
        { t: [14.8, 40.4], a: 'c', b: '', i: '4 by 8 ft max pane', dim: 1 }
      ]
    };
  }
  function dGutter() {
    const y = x => 8 + .2 * x;
    let s = '';
    s += Ln(0, y(0) - 1.6, 50, y(50) - 1.6, 'cl') + Ln(31, 0, 31, 42, 'cl');
    s += Pg([[0, y(0) + 1], [30.5, y(30.5) + 1], [30.5, y(30.5) + 6], [0, y(0) + 6]], 'kf');
    s += Ln(0, y(0), 30.5, y(30.5), 'k') + Ln(0, y(0) + 1, 30.5, y(30.5) + 1, 'k') + Ln(0, y(0) - .9, 31.4, y(31.4) - .9, 'k2');
    s += Rc(30.5, y(30.5) - .6, 1.7, 11, 'kf');
    s += P(`M31.4 ${f(y(31.4) - .9)} L33.6 ${f(y(33.6) - .3)} L33.6 ${f(y(33.6) + 1.4)}`, 'k2');
    s += P('M32.4 16.4 L32.4 24.6 Q32.4 26.4 34.4 26.4 L42.4 26.4 Q44.6 26.4 45.1 24 L46.6 15.8 L47.8 15.4', 'k2');
    s += P(`M31.8 ${f(y(31.8) - .6)} L47.4 15.2`, 'od');
    s += `<circle class="ofs" cx="47.4" cy="15.2" r=".35"/>`;
    [[36, 13.6, 2], [40.6, 13.6, 1.4], [44.2, 13.3, 1.8]].forEach(([x, y2, l]) => { s += P(`M${f(x)} ${f(y2)} l${f(l)} ${f(-.25)}`, 'kt'); });
    s += P('M48.4 17.6 q.9 1.6 .6 3.2 M47.2 20.6 q1 1.5 .5 3.1', 'kt');
    return {
      svg: s, labels: [
        { t: [2, 2.6], a: 'l', b: 'Noncombustible guard', i: 'needles slide off the lip', s: [16.3, 4.6], p: [40, 13.9] },
        { t: [9.5, 34], a: 'l', b: 'Metal gutter', i: 'drip edge closes the deck', s: [22.6, 32.8], p: [34.5, 26.3] }
      ]
    };
  }
  function dChim() {
    const r = x => 31 - .12 * x;
    let s = '';
    s += Ln(0, 6, 50, 6, 'cl') + Ln(0, r(0), 50, r(50), 'cl');
    s += Ln(0, r(0), 16, r(16), 'k2') + Ln(28, r(28), 50, r(50), 'k2') + Ln(0, r(0) + 1.3, 16, r(16) + 1.3, 'k') + Ln(28, r(28) + 1.3, 50, r(50) + 1.3, 'k');
    s += Rc(16, 6, 12, 36, 'kf');
    for (let yy = 7.5; yy < 41.6; yy += 1.45) s += Ln(16, yy, 28, yy, 'kt');
    [[18, 9.5], [26, 9.5], [18, 16.75], [26, 16.75], [18, 24], [26, 24]].forEach(([x, y2]) => { s += `<circle class="fi" cx="${x}" cy="${y2}" r=".22" opacity=".6"/>`; });
    s += Ln(20, 6, 20, 41, 'kd') + Ln(24, 6, 24, 41, 'kd');
    s += Rc(15.2, 5.1, 13.6, .9, 'k2');
    s += Rc(18.2, 1.6, 7.6, 3.5, 'of');
    for (let x = 19.2; x < 25.8; x += 1) s += Ln(x, 1.6, x, 5.1, 'o');
    s += Rc(17.4, .8, 9.2, .8, 'k2');
    s += Ln(11, 5.1, 11, r(11)) + tick(11, 5.1) + tick(11, r(11)) + Ln(10, 5.1, 15, 5.1, 'kt');
    return {
      svg: s, labels: [
        { t: [30.5, 3.3], a: 'l', b: 'Spark arrester', i: '3/8 to 1/2 in mesh', s: [30, 3.3], p: [26, 3.3] },
        { t: [31, 15], a: 'l', b: 'Board form concrete', i: 'noncombustible, no cladding', s: [30.5, 15], p: [27.4, 15] },
        { t: [10.2, 16.5], a: 'r', b: '', i: '4 ft', dim: 1 }
      ]
    };
  }

  /* defensible space zones, drawn on the site plan's own geometry (draw/A1.2.svg, feet) */
  const ROOF = 'M37.83 -16.58 L-65.58 -16.58 L-76.8 -16.06 L-76.8 8.28 L-65.6 8.29 L-65.59 17.29 L-37.6 17.29 L-37.6 7.42 L-20.62 7.42 L-19.47 10.74 L-2 10.74 L-2 34.98 L-5.02 34.99 L-5.02 45.66 L-21.62 51.06 L-21.61 78.37 L0.04 71.34 L37.5 58.62 L40.37 57.66 L32.43 33.4 L17.04 38.42 L17.04 10.74 L36.96 10.73 L36.96 -15.27 Z';
  const LOT = 'M-125 -37.06 L65.73 -37.06 L69.02 72.89 L-87.3 124 Z';
  const TREE = [-14.59, 24.67, 13];
  const ZV = [-136, -54, 212, 186];
  function dZones() {
    let s = `<defs><clipPath id="rgb-lot"><path d="${LOT}"/></clipPath></defs>`;
    s += `<g clip-path="url(#rgb-lot)"><path d="${LOT}" fill="#f0eee9"/>`;
    s += `<path d="${ROOF}" fill="#e5e2da" stroke="#1b1a18" stroke-opacity=".55" stroke-width="61" stroke-linejoin="round"/>`;
    s += `<path d="${ROOF}" fill="#e5e2da" stroke="#e5e2da" stroke-width="60" stroke-linejoin="round"/>`;
    s += `<path d="${ROOF}" fill="#ecd3b4" stroke="#c07a2c" stroke-width="10.9" stroke-linejoin="round"/>`;
    s += `<path d="${ROOF}" fill="#ecd3b4" stroke="#ecd3b4" stroke-width="10" stroke-linejoin="round"/></g>`;
    s += `<path d="${ROOF}" class="k2" style="fill:#f6f5f1"/>`;
    s += `<path class="k2" d="${LOT}" stroke-dasharray="7 1.6 1.2 1.6"/>`;
    s += `<circle class="kd" cx="${TREE[0]}" cy="${TREE[1]}" r="${TREE[2]}"/><circle class="ofs" cx="${TREE[0]}" cy="${TREE[1]}" r="1.3"/>`;
    const L = [
      { t: [8, -46], a: 'c', b: 'Zone 0 · 0 to 5 ft', i: 'ember resistant', s: [8, -42.4], p: [8, -19.2] },
      { t: [-104, -2], a: 'c', b: 'Zone 1', i: '5 to 30 ft' },
      { t: [-64, 108], a: 'c', b: 'Zone 2', i: '30 ft to the line' },
      { t: [52, 108], a: 'c', b: 'Property line', i: 'confirm on survey', s: [44, 103.6], p: [34, 83.6] },
    ];
    return { svg: s, labels: L };
  }

  const ZONES = [
    ['Zone 0 · 0 to 5 ft', 'Hard, noncombustible ground: gravel, stone, concrete. No plants, bark, wood fences, furniture or firewood. No branches over the roof. {cf}'],
    ['Zone 1 · 5 to 30 ft', 'Lean and green. Spaced low plants, irrigated. Trees limbed up 6 ft, 10 ft clear of the chimneys.'],
    ['Zone 2 · to 100 ft', 'Reduced fuel with space between shrubs and trees, here to the property line.'],
    ['Basis', 'PRC 4291, the Board of Forestry Zone 0 rules, the fire district and Lahontan landscape rules {cf}']
  ];

  LIVING_SHEETS.push({
    id: 'A6.1', group: 'Architectural', title: 'Wildfire hardening', short: 'Wildfire hardening', foot: 'Wildfire hardening',
    scale: 'Not to scale', issued: [2, 4],
    cap: 'Lahontan sits in a Very High FHSZ, so every edge an ember can find is closed, from the ridge to the gravel.',
    data: ['Class A roof, listed vents', 'Tempered glass, FRT cedar', 'Zone 0 within 5 ft', 'CRC R337 · Title 24 Part 7'],
    notes: [
      { text: 'keep the signature tree', t: [25.05, 3.72], p: [27.9, 6.45], a: 'l' }
    ],
    html: ctx => {
      const w = 5, hh = 5, gx = .45, x0 = .6, rows = [3.35, 10.7];
      const D = [
        { n: 1, title: 'Class A roof', scale: 'Not to scale', g: dRoof, note: 'Class A roof assembly throughout. Eave and ridge gaps fire stopped; valley flashing 26 ga over a 36 in cap sheet. [CWUIC 504.2]' },
        { n: 2, title: 'Ember resistant vents', scale: 'Not to scale', g: dVent, note: 'Every vent listed to ASTM E2886 or approved by the State Fire Marshal. None in eaves or soffits unless listed for it. [CWUIC Ch 5] {cf}' },
        { n: 3, title: 'Protected eaves', scale: 'Not to scale', g: dEave, note: 'Soffits enclosed, noncombustible or ignition resistant; fascia and siding stop at 2 in solid blocking. The ribbon overhang too. [CWUIC 504.3] {cf}' },
        { n: 4, title: 'Ignition resistant siding', scale: 'Not to scale', g: dSiding, note: 'Silvered cedar boards, fire retardant treated for exterior use, over 5/8 in Type X. Foundation to roof, 6 in clear of grade. [CWUIC 504.5] {cf}' },
        { n: 5, title: 'Decks and terraces', scale: 'Not to scale', g: dDeck, note: 'Walking surface ignition resistant, exterior FRT or noncombustible. Underside open or screened, kept clear of anything that burns. [CWUIC 504.7]' },
        { n: 6, title: 'Tempered glazing', scale: 'Not to scale', g: dGlass, note: 'Square panes, 4 by 8 ft max, every pane tempered. Exterior doors 1 3/8 in solid core or 20 min; garage door gaps 1/8 in max. [CWUIC 504.8, 504.9]' },
        { n: 7, title: 'Gutter guards', scale: 'Not to scale', g: dGutter, note: 'Metal gutters under noncombustible guards that shed needles; a drip edge closes the roof deck. Kept clean before each fire season. [CRC R337] {cf}' },
        { n: 8, title: 'Spark arresters', scale: 'Not to scale', g: dChim, note: 'Board form concrete chimneys 4 ft over adjacent roofs. Arrester mesh 3/8 to 1/2 in, net area four times the flue. [CRC R1003.9]' }
      ];
      let h = '<div class="rgx">';
      D.forEach((d, k) => {
        const g = d.g();
        h += detail(ctx, { x: x0 + (k % 4) * (w + gx), y: rows[k >> 2], w, h: hh, vy: VY, vw: VW, vh: VH, svg: g.svg, labels: g.labels, n: d.n, title: d.title, scale: d.scale, note: d.note });
      });
      const zw = 7.75, zh = zw * ZV[3] / ZV[2];
      const z = dZones();
      h += detail(ctx, {
        x: 22.6, y: 3.35, w: zw, h: zh, vx: ZV[0], vy: ZV[1], vw: ZV[2], vh: ZV[3], svg: z.svg,
        labels: z.labels,
        n: 9, title: 'Defensible space', scale: 'Diagram · on the site plan', extra: north('84%', '76%', ctx.U(.62), ctx.DRW && ctx.DRW.north || 39.3),
        after: tab(ZONES, '1.45in')
      });
      return h + '</div>';
    }
  });
})();
