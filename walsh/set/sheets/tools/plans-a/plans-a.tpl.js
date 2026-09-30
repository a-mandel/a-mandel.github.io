/* plans-a crew (9/30/26): A0.6 area diagrams, A2.0 lower level and foundation plan.
   Built by sheets/tools/plans-a/build_plans_a.py from the pocket model through draw/build_drawings.py; do not edit by hand.
   Geometry is inline vector SVG at true scale; every number is read live from DRAWINGS.calcs (draw/calcs.json). */
(function () {
  const PA = /*PA_DATA*/null;
  const CC = (window.DRAWINGS && window.DRAWINGS.calcs) || PA.calcs;
  const get = k => k.split('+').reduce((s, p) => s + p.trim().split('.').reduce((o, q) => (o == null ? o : o[q]), CC), 0);
  const num = (k, v) => /pct|_ac$/.test(k) ? String(v) : Math.round(v).toLocaleString('en-US');
  const fill = s => String(s).replace(/\{([^}]+)\}/g, (m, k) => { const v = get(k); return Number.isFinite(v) ? num(k, v) : m; });
  const PC = v => +(v * 100).toFixed(3);

  const CSS = `<style>
.pa .lbl.pk{background:none;padding:0}
.pa .lbl.pk b{font:400 max(calc(8px * var(--fl)),calc(var(--u) * .14))/1 var(--ft);letter-spacing:.06em;color:var(--accent)}
.pa .lbl.pf{background:rgba(246,245,241,.75);padding:0 .2em}
.pa .lbl.pf b{letter-spacing:.08em}
.pa .lbl.pd{transform:translate(calc(-100% - var(--u) * .1),-50%);align-items:flex-end;background:none;padding:0}
.pa .lbl.pd b{color:var(--muted);letter-spacing:.06em}
.pa .lbl.tag.big b{font-size:max(calc(9px * var(--fl)),calc(var(--u) * .15))}
.pa-leg li{justify-content:flex-start !important;align-items:center !important}
.pa-leg .sw{flex:none;width:calc(var(--u) * .56);height:calc(var(--u) * .28);margin-right:calc(var(--u) * .16)}
.pa-leg .v{margin-left:auto;font-size:max(calc(9px * var(--fl)),calc(var(--u) * .15)) !important}
.pa-pr .dsvg{overflow:visible}
@media screen and (max-width:760px), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
  .pa-leg .sw{width:34px;height:17px}
  .pa .dnorth{display:none}
  .pa .view{margin-bottom:18px}
  .sheet[data-id="A0.6"] .fhtml,.sheet[data-id="A2.0"] .fhtml{position:relative;inset:auto}
}
</style>`;

  const lbl = l => {
    const k = l.k || 'room';
    return `<span class="lbl ${k}${l.hot ? ' hot' : ''}" style="left:${PC(l.p[0])}%;top:${PC(l.p[1])}%"><b>${fill(l.t)}</b>${l.s ? `<i>${fill(l.s)}</i>` : ''}</span>`;
  };
  const view = (ctx, v, cls = '') =>
    `<div class="view dv ${cls}" style="left:${ctx.U(ctx.FX(v.x))};top:${ctx.U(ctx.FY(v.y))};width:${ctx.U(v.w)};height:${ctx.U(v.h)};--ar:${(v.w / v.h).toFixed(4)}">${v.svg}${(v.labels || []).map(lbl).join('')}</div>`;
  const bar = (ctx, sc, ft) => {
    const L = ft[ft.length - 1];
    let r = '';
    for (let k = 1; k < ft.length; k++) r += `<rect x="${ft[k - 1] / L}" y="0" width="${(ft[k] - ft[k - 1]) / L}" height="1" class="${k % 2 ? 'on' : ''}"/>`;
    return `<span class="gbar" style="width:${ctx.U(L * sc)}"><svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">${r}</svg>${ft.map(v => `<span style="left:${PC(v / L)}%">${v}${v === L ? ' ft' : ''}</span>`).join('')}</span>`;
  };
  const vt = (ctx, x, y, n, t, s, b) => `<div class="dvt" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))}">${ctx.viewTitle(n, t, s)}${b || ''}</div>`;
  const table = (ctx, x, y, w, title, rows, foot, cls = '') =>
    `<div class="dtab ${cls}" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))};width:${ctx.U(w)}"><h3>${ctx.esc(title)}</h3><ul>${rows.map(([k, v, sw]) =>
      `<li>${sw || ''}<span class="k">${ctx.esc(fill(k))}</span><span class="v">${ctx.esc(fill(v))}</span></li>`).join('')}</ul>${foot ? `<p>${ctx.esc(fill(foot))}</p>` : ''}</div>`;
  const legend = (ctx, x, y, w, title, items) => table(ctx, x, y, w, title, items.map(i => [i.k, i.v, i.svg]), '', 'pa-leg');
  const north = (ctx, n) => {
    const a = (ctx.DRW && ctx.DRW.north) || 0, r = a * Math.PI / 180;
    return `<div class="dnorth" style="left:${ctx.U(ctx.FX(n.x) - n.s / 2)};top:${ctx.U(ctx.FY(n.y) - n.s / 2)};width:${ctx.U(n.s)};height:${ctx.U(n.s)}" aria-label="North">
      <svg viewBox="-1 -1 2 2" aria-hidden="true"><circle r=".78"/><g transform="rotate(${a})"><path class="nd" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/><path class="nl" d="M0 .02 V.78"/></g></svg>
      <span style="left:${PC(.5 + .62 * Math.sin(r))}%;top:${PC(.5 - .62 * Math.cos(r))}%">N</span></div>`;
  };

  /* ---------------------------------------------------------------- A0.6 area diagrams */
  const A6 = PA['A0.6'];
  const v6 = id => A6.views.find(v => v.id === id);
  LIVING_SHEETS.push({
    id: 'A0.6', group: 'General', title: 'Area diagrams', short: 'Area diagrams', foot: 'Area diagrams',
    scale: 'As noted', issued: [4],
    cap: 'Every square foot sorted by what it is, then what the roof and the drive cover on the lot.',
    data: [fill('Conditioned about {conditioned} sf'), fill('Garage about {garage} sf'), fill('Coverage about {coverage_pct}%'), fill('Impervious about {impervious_pct}%')],
    notes: A6.notes,
    html: ctx => {
      const l1 = v6('l1'), l2 = v6('l2'), kc = v6('kc'), ki = v6('ki');
      let h = CSS + '<div class="pa">';
      h += view(ctx, l1) + vt(ctx, l1.x, l1.y + l1.h + 0.3, 1, 'Level 1 · areas', '1/8 in = 1 ft', bar(ctx, 1 / 8, [0, 8, 16, 32]));
      h += view(ctx, l2) + vt(ctx, l2.x, l2.y + l2.h + 0.3, 2, 'Level 2 · areas', '1/8 in = 1 ft', bar(ctx, 1 / 8, [0, 8, 16]));
      h += legend(ctx, 18.3, 10.55, 5.75, 'Area types', A6.legend);
      h += table(ctx, 24.75, 3.95, 7.0, 'Areas', [
        ['Main level · 5997.5', 'about {levels.main.sf} sf'],
        ['Lower level · 5992.5', 'about {levels.lower.sf} sf'],
        ['Level 1 conditioned', 'about {level1_conditioned} sf'],
        ['Primary suite · 6004.0', 'about {levels.primary.sf} sf'],
        ['Total conditioned', 'about {conditioned} sf'],
        ['Garage and gear bay', 'about {garage} sf'],
        ['Upper terrace, cedar', 'about {decks.upper_terrace} sf'],
        ['Primary terrace, cedar', 'about {decks.primary_terrace} sf'],
        ['Stone patio', 'about {patio_stone} sf'],
        ['Building footprint', 'about {footprint} sf'],
      ], CC.note);
      h += table(ctx, 24.75, 9.1, 7.0, 'Coverage and impervious', [
        ['Lot area', 'about {lot_sf} sf · {lot_ac} ac'],
        ['Roof, to the drip line', 'about {roof_footprint} sf'],
        ['Building coverage', 'about {coverage_pct}%'],
        ['Driveway', 'about {drive} sf'],
        ['Apron, allowance', 'about {apron_allowance} sf'],
        ['Stone patio', 'about {patio_stone} sf'],
        ['Walks, allowance', 'about {walks_allowance} sf'],
        ['Impervious', 'about {impervious_sf} sf · {impervious_pct}%'],
      ], CC.lot_note + '. Decks with gaps stay out of impervious.');
      h += view(ctx, kc) + vt(ctx, kc.x, kc.y + kc.h + 0.25, 3, 'Lot coverage', fill('about {coverage_pct}% · 1/32 in = 1 ft'), bar(ctx, 1 / 32, [0, 32, 64]));
      h += view(ctx, ki) + vt(ctx, ki.x, ki.y + ki.h + 0.25, 4, 'Impervious', fill('about {impervious_pct}% · 1/32 in = 1 ft'), bar(ctx, 1 / 32, [0, 32, 64]));
      h += A6.north.map(n => north(ctx, n)).join('');
      return h + '</div>';
    }
  });

  /* ---------------------------------------------------------------- A2.0 lower level and foundation plan */
  const A0 = PA['A2.0'];
  const v0 = id => A0.views.find(v => v.id === id);
  const g = A0.grade;
  LIVING_SHEETS.push({
    id: 'A2.0', group: 'Architectural', title: 'Lower level and foundation plan', short: 'Lower level and foundation', foot: 'Lower level and foundation',
    scale: '3/16 in = 1 ft', issued: [4],
    cap: 'The house steps with the land: the garage up 2 1/2 ft, the south wing down 5 ft to its own slab.',
    data: [fill('Lower level about {levels.lower.sf} sf at 5992.5'), 'Three floor datums, two steps', 'Footings clear of the signature tree', 'Structure per geotech and engineer'],
    notes: A0.notes,
    html: ctx => {
      const fd = v0('fd'), pr = v0('pr');
      let h = CSS + '<div class="pa">';
      h += view(ctx, fd) + vt(ctx, 10.4, 18.75, 1, 'Lower level and foundation plan', '3/16 in = 1 ft', bar(ctx, 3 / 16, [0, 4, 8, 16]));
      h += table(ctx, 1.9, 4.0, 5.9, 'Foundation', [
        ['Garage and gear bay', 'slab on grade · 6000.0'],
        ['Main level', 'crawl space and slab · 5997.5'],
        ['Lower level', 'slab on grade · 5992.5'],
        ['Lower level area', 'about {levels.lower.sf} sf'],
        ['Steps', '2 1/2 ft up · 5 ft down'],
        ['Grade under the house', `about ${Math.round(g[0])} to ${Math.round(g[1])}`],
        ['Building footprint', 'about {footprint} sf'],
        ['Pad footings', `${A0.cols} columns and posts`],
      ], `Grade within 18 in of the main floor under about ${A0.high}% of it: slab there, or cut for a crawl space. Footings by the engineer from the geotech report, below frost. Ember resistant vents, Very High FHSZ. FA accuracy, confirm on survey.`);
      h += legend(ctx, 1.9, 9.35, 5.9, 'Legend', A0.legend);
      h += view(ctx, pr, 'pa-pr') + vt(ctx, 1.9, pr.y + pr.h + 0.42, 2, 'Foundation steps · A B C', 'along sections 2 and 1 · 3/64 in = 1 ft · vertical 4x', bar(ctx, 3 / 64, [0, 8, 16, 32]));
      h += A0.north.map(n => north(ctx, n)).join('');
      return h + '</div>';
    }
  });
})();
