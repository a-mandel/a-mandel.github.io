/* overlays crew (template): structural grid bubbles over the A2.1 and A2.3 plans.
   Overlays draw over any sheet in field inches. This one shows the registration every crew uses: a point in model
   feet lands on the sheet through its view, sheet x = reg.x + (ft - box[0]) * scale, then field x = sheet x - 1.25,
   field y = sheet y - 0.5. Grid lines come from SHARED.grids, so plans and sections stay on one grid. */
(function () {
  const ACC = 'var(--accent)';
  function grids(ctx, id) {
    const R = ctx.DRW.reg && ctx.DRW.reg[id] && ctx.DRW.reg[id][0], G = ctx.SHARED.grids;
    if (!R || !G) return '';
    const [x0, y0, x1, y1] = R.box, sc = R.scale;
    const fx = ft => R.x + (ft - x0) * sc - ctx.BL, fy = ft => R.y + (ft - y0) * sc - 0.5;
    const top = fy(y0) + 0.25, bot = fy(y1) - 0.25, left = fx(x0) + 0.25, right = fx(x1) - 0.25;
    const r = 0.17, f = n => +n.toFixed(4);
    let s = '', t = '';
    const bub = (cx, cy, label) => { s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="var(--paper)" stroke="var(--ink)" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
      t += `<span style="position:absolute;left:${ctx.U(cx)};top:${ctx.U(cy)};transform:translate(-50%,-50%);font:400 max(calc(7px * var(--fl)),calc(var(--u) * .13))/1 var(--ft);letter-spacing:.04em">${ctx.esc(label)}</span>`; };
    G.x.forEach(g => { const x = fx(g.at); s += `<path d="M${f(x)} ${f(top + r)} V${f(bot)}" stroke="var(--ink)" stroke-opacity=".28" stroke-width=".7" stroke-dasharray="6 2 1.5 2" vector-effect="non-scaling-stroke"/>`; bub(x, top, g.id); });
    G.y.forEach(g => { const y = fy(g.at); s += `<path d="M${f(left + r)} ${f(y)} H${f(right)}" stroke="var(--ink)" stroke-opacity=".28" stroke-width=".7" stroke-dasharray="6 2 1.5 2" vector-effect="non-scaling-stroke"/>`; bub(left, y, g.id); });
    // one burnt orange mark: where grid 1 meets grid A, the datum corner
    s += `<circle cx="${f(fx(G.x[0].at))}" cy="${f(fy(G.y[0].at))}" r=".06" fill="${ACC}"/>`;
    return `<svg viewBox="0 0 ${ctx.W} ${ctx.H}" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible" aria-hidden="true">${s}</svg>${t}`;
  }
  ['A2.1', 'A2.3'].forEach(id => LIVING_OVERLAYS.push({ id, z: 3, html: ctx => grids(ctx, id) }));
})();
