/* L1.1 sheet template (land-b). G is injected above by build_l11.py. Field inches, origin at the field's top left. */
const PCT = v => +(v * 100).toFixed(3);
const fmt = n => Math.round(n).toLocaleString('en-US');

const CSS = `
.lb{position:absolute;inset:0}
.lb .dsvg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.lb .lbl{--l-b:max(calc(7.5px * var(--fl)),calc(var(--u) * .12));--l-i:max(calc(8.5px * var(--fl)),calc(var(--u) * .135))}
.lb .lbl.l{transform:translate(0,-50%);align-items:flex-start;text-align:left}
.lb .lbl.zn,.lb .lbl.zn2{background:rgba(246,245,241,.8);padding:.12em .35em}
.lb .lbl.zn b{font-size:max(calc(8px * var(--fl)),calc(var(--u) * .14))}
.lb .lbl.zn i{color:var(--ink);font-size:max(calc(9px * var(--fl)),calc(var(--u) * .15))}
.lb .lbl.zn2 b{color:var(--muted)}
.lb .lbl.tt{background:rgba(246,245,241,.72);padding:0 .2em}
.lb .lbl.tt b{letter-spacing:.08em}
.lb .lbl.hot b{color:var(--accent)}
.lb .lbl.zs b{font-size:max(calc(8px * var(--fl)),calc(var(--u) * .13))}
.lb .lbl.sm{background:rgba(246,245,241,.7);padding:0 .25em}
.lb .lbl.sm.l{align-items:flex-start}
.lb .lbl.dim{background:rgba(246,245,241,.7)}
.lb .lbl.dim i{font-size:max(calc(8.5px * var(--fl)),calc(var(--u) * .13))}
.lb-b{position:absolute}
.lb-h{margin:0 0 calc(var(--u) * .1);font:400 max(calc(9.5px * var(--fl)),calc(var(--u) * .19))/1.1 var(--ft);letter-spacing:.18em;text-transform:uppercase;white-space:nowrap}
.lb-h small{margin-left:.6em;font:italic 400 max(calc(9px * var(--fl)),calc(var(--u) * .15))/1 var(--fs);letter-spacing:0;text-transform:none;color:var(--muted)}
.lb-ul{list-style:none;margin:0;padding:0}
.lb-ul li{font:400 max(calc(9.5px * var(--fl)),calc(var(--u) * .158))/1.26 var(--fs);padding:calc(var(--u) * .12) 0 calc(var(--u) * .03);background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .09);text-wrap:pretty}
.lb-ul li b{font:400 max(calc(7px * var(--fl)),calc(var(--u) * .108))/1 var(--ft);letter-spacing:.16em;text-transform:uppercase;margin-right:.5em;color:var(--ink)}
.lb-ul li em{color:var(--muted)}
.lb-ul li .cf,.lb-t .cf{font:400 max(calc(6.5px * var(--fl)),calc(var(--u) * .1))/1 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-left:.35em;white-space:nowrap}
.lb-t{display:grid;align-items:baseline;column-gap:calc(var(--u) * .16)}
.lb-t > span{padding:calc(var(--u) * .07) 0 calc(var(--u) * .012);font:italic 400 max(calc(9px * var(--fl)),calc(var(--u) * .15))/1.14 var(--fs);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:lining-nums}
.lb-t > span.r0{background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .08)}
.lb-t > span.hd{font:400 max(calc(6.5px * var(--fl)),calc(var(--u) * .1))/1.2 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-style:normal;padding-bottom:calc(var(--u) * .05)}
.lb-t > span.gp{grid-column:1 / -1;font:400 max(calc(7.5px * var(--fl)),calc(var(--u) * .12))/1.2 var(--ft);letter-spacing:.2em;text-transform:uppercase;font-style:normal;padding-top:calc(var(--u) * .14);position:relative;padding-left:calc(var(--u) * .2)}
.lb-t > span.gp::before{content:"";position:absolute;left:0;top:calc(var(--u) * .14 + .45em);width:max(5px,calc(var(--u) * .1));height:max(5px,calc(var(--u) * .1));border-radius:50%;background:var(--accent)}
.lb-t > span.gp i{margin-left:.8em;font:italic 400 max(calc(9px * var(--fl)),calc(var(--u) * .14))/1 var(--fs);letter-spacing:0;text-transform:none;color:var(--muted)}
.lb-t > span.sy{font:400 max(calc(7.5px * var(--fl)),calc(var(--u) * .12))/1.22 var(--ft);letter-spacing:.1em;font-style:normal}
.lb-t > span.cn{font-style:normal}
.lb-t > span.hot{color:var(--accent)}
.lb-t > span.wr{white-space:normal;overflow:visible}
.lb-foot{margin:calc(var(--u) * .14) 0 0;font:italic 400 max(calc(8.5px * var(--fl)),calc(var(--u) * .135))/1.3 var(--fs);color:var(--muted);text-wrap:pretty}
.lb-lg{display:flex;gap:calc(var(--u) * .22);align-items:center;flex-wrap:wrap}
.lb-lg span{display:flex;align-items:center;gap:.5em;font:400 max(calc(7.5px * var(--fl)),calc(var(--u) * .11))/1 var(--ft);letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}
.lb-lg svg{width:calc(var(--u) * .46);height:calc(var(--u) * .26);flex:none;overflow:visible}
@media screen and (max-width:760px) and (orientation:portrait), screen and (max-width:760px) and (min-height:541px), screen and (max-width:760px) and (pointer:fine), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
  .sheet[data-id="L1.1"] .fhtml{position:relative;inset:auto}
  .lb{position:relative;inset:auto}
  .lb-b{position:relative !important;left:auto !important;top:auto !important;width:auto !important;margin:0 0 26px}
  .lb .dvt{margin:-14px 0 30px}
  .lb-t{overflow-x:auto}
  .lb-t > span{white-space:normal}
  .lb-lg{margin:-10px 0 26px}
}
`;

function lblHTML(l) {
  return `<span class="lbl ${l.k || 'room'}${l.a === 'l' ? ' l' : ''}" style="left:${PCT(l.p[0])}%;top:${PCT(l.p[1])}%"><b>${l.t}</b>${l.s ? `<i>${l.s}</i>` : ''}</span>`;
}
function gbar(U, ft, sc) {
  const L = ft[ft.length - 1];
  let r = '';
  for (let k = 1; k < ft.length; k++) r += `<rect x="${ft[k - 1] / L}" y="0" width="${(ft[k] - ft[k - 1]) / L}" height="1" class="${k % 2 ? 'on' : ''}"/>`;
  const labs = ft.map(v => `<span style="left:${PCT(v / L)}%">${v}${v === L ? ' ft' : ''}</span>`).join('');
  return `<span class="gbar" style="width:${U(L * sc)}"><svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">${r}</svg>${labs}</span>`;
}
function north(U, x, y, s) {
  const a = G.north;
  return `<div class="dnorth" style="left:${U(x - s / 2)};top:${U(y - s / 2)};width:${U(s)};height:${U(s)}" aria-label="North">
    <svg viewBox="-1 -1 2 2" aria-hidden="true"><circle r=".78"/><g transform="rotate(${a})"><path class="nd" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/><path class="nl" d="M0 .02 V.78"/></g></svg>
    <span style="left:${PCT(.5 + .62 * Math.sin(a * Math.PI / 180))}%;top:${PCT(.5 - .62 * Math.cos(a * Math.PI / 180))}%">N</span></div>`;
}
function view(U, v, x, y, w, h, notes, noteHTML, d0) {
  let nh = '', d = d0 || 0;
  (notes || []).forEach(n => { nh += noteHTML(n, w, h, d); d += 520; });
  return `<div class="view dv" style="left:${U(x)};top:${U(y)};width:${U(w)};height:${U(h)};--ar:${(w / h).toFixed(4)}">${v.svg}${v.labels.map(lblHTML).join('')}${nh}</div>`;
}
const swatch = (fill, stroke, dash) => `<svg viewBox="0 0 46 26" aria-hidden="true"><rect x="1" y="1" width="44" height="24" rx="4" fill="${fill}" stroke="${stroke || 'none'}" stroke-width="1" ${dash ? `stroke-dasharray="${dash}"` : ''}/></svg>`;

const PLANTS = [
  { g: 'Natural vegetation', s: 'Design Book tables V.1 to V.4 · the homesite’s own natives first' },
  ['JP', 'Pinus jeffreyi', 'Jeffrey pine', 'salvage or 5 gal', 'semidry', 'Zone 2 gaps', 'Thick bark, limb 6 ft, 10 ft crowns'],
  ['LP', 'Pinus contorta ssp. murrayana', 'Lodgepole pine', '5 gal', 'semidry', 'Zone 2', 'Thin bark, single and well spaced'],
  ['SB', 'Amelanchier alnifolia', 'Serviceberry', '5 gal', 'dry', 'Zones 1 and 2', 'Deciduous, low resin'],
  ['WC', 'Ribes cereum', 'Wax currant', '1 gal', 'dry', 'Zones 1 and 2', 'Low resin, 2 × height apart'],
  ['WR', 'Rosa woodsii', 'Wood’s rose', '1 gal', 'dry to moist', 'Zones 1 and 2', 'Deciduous, clumps kept apart'],
  ['MM', 'Cercocarpus ledifolius', 'Curl leaf mountain mahogany', '5 gal', 'dry', 'Zone 2', 'Dense evergreen, past 30 ft only'],
  ['SF', 'Eriogonum umbellatum', 'Sulfur flower', '1 gal', 'dry', 'Zone 1', 'Low mound, binds the slope'],
  ['YA', 'Achillea millefolium', 'White yarrow', 'plug', 'dry', 'Zone 1', 'Low, stays green into summer'],
  ['ME', 'Wyethia mollis', 'Woolly mule’s ears', '1 gal', 'dry', 'Zone 2', 'Dries by August, past 30 ft only'],
  ['LS', 'Lahontan seed mix', 'Forest Understory Blend', 'broadcast, fall', 'none', 'All disturbed ground', 'Never irrigated, mow to 4 in'],
  { g: 'Enhanced vegetation', s: 'Tables VI.1 to VI.6 · in contained beds by the terraces, 5 ft out, drip' },
  ['DG', 'Cornus sericea', 'Red twig dogwood', '5 gal', 'moist', 'Rear court beds', 'Deciduous, high leaf moisture'],
  ['MA', 'Acer glabrum', 'Mountain maple, multi stem', '15 gal', 'semimoist', 'Rear court beds', 'Deciduous, limbs off the roof'],
  ['SP', 'Spiraea densiflora', 'Mountain spirea', '1 gal', 'semimoist', 'Entry and court beds', 'Low, deciduous'],
  ['PF', 'Potentilla fruticosa', 'Shrubby cinquefoil', '1 gal', 'moist to dry', 'Entry beds', 'Low, deciduous'],
  { g: 'Zone 0 ground plane', s: 'nothing that burns within 5 ft' },
  ['Z0', 'Weathered basalt gravel', 'or stone, DR approved shade', '3 in', 'none', 'Zone 0 all around', 'No plants, bark or needles', true]
];

function plantTable() {
  const cols = 'calc(var(--u) * .5) 2.75fr 2.6fr 1.5fr 1.05fr 1.95fr 3.1fr';
  let h = ['Sym', 'Botanical name', 'Common name', 'Size', 'Water', 'Where', 'Fire note'].map(t => `<span class="hd">${t}</span>`).join('');
  PLANTS.forEach(r => {
    if (!Array.isArray(r)) { h += `<span class="gp">${r.g}<i>${r.s}</i></span>`; return; }
    h += `<span class="r0 sy">${r[0]}</span><span class="r0">${r[1]}</span><span class="r0 cn">${r[2]}</span><span class="r0">${r[3]}</span><span class="r0">${r[4]}</span><span class="r0">${r[5]}</span><span class="r0${r[7] ? ' hot' : ''}">${r[6]}${r[7] ? '<b class="cf">confirm</b>' : ''}</span>`;
  });
  return `<div class="lb-t" style="grid-template-columns:${cols}">${h}</div>`;
}

function treeTable() {
  const cols = 'calc(var(--u) * .42) calc(var(--u) * .5) calc(var(--u) * .66) 1fr';
  let h = ['No.', 'Zone', 'Crown', 'Action'].map(t => `<span class="hd">${t}</span>`).join('');
  G.trees.forEach(t => {
    h += `<span class="r0 sy${t.n === 1 ? ' hot' : ''}">T${t.n}</span><span class="r0">${t.zone > 2 ? 'past' : t.zone}</span><span class="r0">${Math.round(t.r * 2)} ft</span><span class="r0 wr">${t.act}</span>`;
  });
  return `<div class="lb-t" style="grid-template-columns:${cols}">${h}</div>`;
}

LIVING_SHEETS.push({
  id: 'L1.1', group: 'Landscape', title: 'Defensible space and planting', short: 'Defensible space', foot: 'Defensible space and planting',
  scale: '1 in = 20 ft', issued: [4],
  cap: 'Five feet of stone at the walls, pines limbed and spaced, the signature tree kept. The native ground zips back up around the house.',
  data: ['Very High FHSZ · PRC 4291, 100 ft or the lot line', `Zone 1 about ${fmt(G.areas.z1)} sf, Zone 2 about ${fmt(G.areas.z2)} sf`, 'Slopes under 20%, 10 ft between crowns', 'Drip only, in the enhanced beds'],
  html: ctx => {
    const { U, viewTitle, noteHTML } = ctx;
    const P = { x: .65, y: 3.3, w: 13.6, h: 10.0 };
    const T = { x: 14.95, y: 3.3, w: 5.0, h: 4.5 };
    const S = { x: .65, y: 14.55, w: 9.07, h: 2.75 };
    const sig = G.sig;
    let h = `<style>${CSS}</style><div class="lb">`;

    // 1 · defensible space plan, 1 in = 20 ft
    h += view(U, G.plan, P.x, P.y, P.w, P.h, [
      { text: 'keep the signature tree', t: [.3, .955], p: [.535, .44], a: 'l' },
      { text: 'reduce, don’t clear', t: [.3, .035], p: [.3, .3], a: 'r' }
    ], noteHTML, 0);
    h += `<div class="dvt" style="left:${U(P.x)};top:${U(P.y + P.h + .22)}">${viewTitle(1, 'Defensible space plan', '1 in = 20 ft')}${gbar(U, [0, 20, 40], 1 / 20)}</div>`;
    h += `<div class="lb-b lb-lg" style="left:${U(P.x + 6.7)};top:${U(P.y + P.h + .36)};width:${U(6.9)}">
      <span>${swatch('rgba(27,26,24,.2)', '#1b1a18', '2 1.5')}Zone 0</span>
      <span>${swatch('rgba(27,26,24,.1)', '#1b1a18', '5 2.5')}Zone 1</span>
      <span>${swatch('rgba(27,26,24,.04)', '#1b1a18', '9 3 2 3')}Zone 2</span>
      <span>${swatch('none', 'rgba(27,26,24,.45)', '2 3')}100 ft</span></div>`;

    h += north(U, P.x + P.w - .55, P.y + .6, 1.0);

    // 2 · the signature tree, 1 in = 10 ft
    h += view(U, G.tree, T.x, T.y, T.w, T.h, [
      { text: 'off the roof, up 6 ft', t: [.47, .94], p: [.64, .47], a: 'l' }
    ], noteHTML, 1040);
    h += `<div class="dvt" style="left:${U(T.x)};top:${U(T.y + T.h + .22)}">${viewTitle(2, 'Signature tree', '1 in = 10 ft')}${gbar(U, [0, 5, 10, 20], 1 / 10)}</div>`;

    // 3 · zones in section
    h += view(U, G.sect, S.x, S.y, S.w, S.h, [], noteHTML, 1560);
    h += `<div class="dvt" style="left:${U(S.x)};top:${U(S.y + S.h + .2)}">${viewTitle(3, 'Zones in section', '1 in = 12 ft, a diagram')}</div>`;

    // spacing and limbing
    h += `<div class="lb-b" style="left:${U(10.2)};top:${U(14.3)};width:${U(4.25)}"><h3 class="lb-h">Spacing and limbing</h3><ul class="lb-ul">
      <li><b>Slope</b>about ${G.slope.z1[0]}% in Zone 1, under 20% everywhere, so the flat to mild rule: 10 ft between crowns, shrubs 2 × their height apart.</li>
      <li><b>Limbs</b>6 ft off the ground, small trees a third of their height, 3 × the shrub below. Lahontan: 30% or 6 ft, whichever is less.</li>
      <li><b>Always</b>dead wood out, limbs 10 ft from chimney outlets, none over the roof or in gutters.</li>
    </ul></div>`;

    // T1 treatment
    h += `<div class="lb-b" style="left:${U(20.55)};top:${U(3.3)};width:${U(4.85)}"><h3 class="lb-h">Signature tree<small>T1, kept</small></h3><ul class="lb-ul">
      <li><b>Protect</b>flagged, 4 ft fence at the dripline through construction; no cut or fill over 2 in under the crown (IV.7, IV.11).</li>
      <li><b>Roots</b>footings about ${Math.round(sig.wall)} ft from the trunk, crown drawn about ${Math.round(sig.r)} ft. Overdig and utilities stay outside it or go by hand with an ISA arborist.<span class="cf">confirm dripline</span></li>
      <li><b>Prune</b>limb to 6 ft, take back limbs within 5 ft of the roof (orange), dead wood out.<span class="cf">confirm Zone 0 clearance</span></li>
      <li><b>Ground</b>gravel inside 5 ft, a 1 to 2 in needle layer beyond, deep water at the dripline, never at the trunk.</li>
      <li><b>Species</b>and dbh by the arborist report.<span class="cf">confirm</span></li>
    </ul></div>`;

    // existing trees
    h += `<div class="lb-b" style="left:${U(25.95)};top:${U(3.3)};width:${U(4.85)}"><h3 class="lb-h">Existing trees</h3>${treeTable()}<p class="lb-foot">Positions and crowns from the model and A1.2. Species, dbh and driplines on survey.</p></div>`;

    // planting schedule
    h += `<div class="lb-b" style="left:${U(14.95)};top:${U(8.85)};width:${U(15.85)}"><h3 class="lb-h">Planting schedule<small>after Lahontan Form 5, Plant List</small></h3>${plantTable()}
      <p class="lb-foot">Quantities and the LCC column come with the Final Design Submittal. Species match what grows on Lot 235, confirmed at the Pre Design site walk. No turf.</p></div>`;

    // bottom row
    h += `<div class="lb-b" style="left:${U(14.95)};top:${U(15.75)};width:${U(5.05)}"><h3 class="lb-h">Lahontan, squared</h3><ul class="lb-ul">
      <li><b>Reduce</b>never clear (IV.20). Zones 1 and 2 thin to a mosaic that reads natural; DR staff walk the site before any cut.</li>
      <li><b>Needles</b>a 1 to 2 in layer past 5 ft; inside 5 ft, gravel, as Appendix F already asks.</li>
      <li><b>Pines</b>kept, firs and brush thinned first. Small trees in the build area move to Zone 2 gaps (V.5).</li>
      <li><b>Edges</b>Zone 1 runs past the north and east lot lines; work there is the neighbor’s or Lahontan’s call. The stricter rule governs.</li>
    </ul></div>`;
    h += `<div class="lb-b" style="left:${U(20.35)};top:${U(15.75)};width:${U(5.05)}"><h3 class="lb-h">Irrigation concept</h3><ul class="lb-ul">
      <li><b>Drip</b>only, design build by the landscape contractor, on the Final Landscape Plan.</li>
      <li><b>Permanent</b>in the enhanced beds only (VI.7), smart controller with rain and freeze shutoff.</li>
      <li><b>Temporary</b>on a timer for transplants and natives, two seasons, then abated (V.6). No spray, no water on seed, none in setbacks.</li>
      <li><b>In</b>before the 10/15 grading deadline. MWELO thresholds with Placer County.<span class="cf">confirm</span></li>
    </ul></div>`;
    h += `<div class="lb-b" style="left:${U(25.75)};top:${U(15.75)};width:${U(5.05)}"><h3 class="lb-h">Basis</h3><ul class="lb-ul">
      <li><b>State</b>PRC 4291; 14 CCR 1299.03. Zone 0 emergency rules adopted 8/19/26, start date for new homes.<span class="cf">confirm</span></li>
      <li><b>Code</b>2025 California WUI Code, Title 24 Part 7, and CRC R337, effective 1/1/26. Very High FHSZ.</li>
      <li><b>Local</b>Truckee Fire Protection District ordinance and inspection; Placer County.<span class="cf">confirm</span></li>
      <li><b>Lahontan</b>Design Book 2011, IV.7 to IV.20, V, VI, Appendix F.</li>
    </ul></div>`;

    return h + '</div>';
  }
});
