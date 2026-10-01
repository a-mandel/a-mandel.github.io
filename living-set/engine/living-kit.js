/* ================================================================
   ANDRÉ MANDEL · LIVING SET KIT COMPONENTS v1.0 (10/1/26)
   The house vocabulary for crew sheets drawn with html(ctx): notes in tidy columns, key value tables, the symbols
   legend, hairline details with labels and leaders, and schedules on curved rules. Lifted from the Walsh crews
   (reg-b: A0.2, A0.3, A6.1; sched-a: A7.0) with the class prefix lk, so any project's sheets read the same.
   Load after the engine CSS and before the crew files. Everything lands in window.LIVING_KIT. See FRAMEWORK.md, 7.
   ================================================================ */
(function () {
  /* ------------------------------------------------------------ notes, tables, legend, details */
  const CSS_NOTES = `
.lkx{position:absolute;inset:0;
  --lk-b:max(calc(10px * var(--fl)),calc(var(--u) * .212));
  --lk-h:max(calc(9.5px * var(--fl)),calc(var(--u) * .2));
  --lk-k:max(calc(7.4px * var(--fl)),calc(var(--u) * .13));
  --lk-v:max(calc(10px * var(--fl)),calc(var(--u) * .21));
  --lk-lb:max(calc(7px * var(--fl)),calc(var(--u) * .125));
  --lk-li:max(calc(8.5px * var(--fl)),calc(var(--u) * .165))}
.lkc{position:absolute}
.lks + .lks{margin-top:calc(var(--u) * .34)}
.lks h3{position:relative;margin:0 0 calc(var(--u) * .1);padding-bottom:calc(var(--u) * .13);font:400 var(--lk-h)/1.15 var(--ft);letter-spacing:.2em;text-transform:uppercase;color:var(--ink);
  background:var(--swoop) no-repeat 0 100% / 100% calc(var(--u) * .1)}
.lks h3 .no{display:inline-block;min-width:2.1em;color:var(--muted);letter-spacing:.08em}
.lks h3 .rf{float:right;font:italic 400 var(--lk-b)/1.15 var(--fs);letter-spacing:0;text-transform:none;color:var(--muted)}
.lko{list-style:none;margin:0;padding:0}
.lko li{display:grid;grid-template-columns:1.7em 1fr;font:400 var(--lk-b)/1.3 var(--fs);color:var(--ink);padding:calc(var(--u) * .018) 0;text-wrap:pretty}
.lko li > span:first-child{font:400 var(--lk-k)/1.9 var(--ft);letter-spacing:.06em;color:var(--muted)}
.lko li.sub{grid-template-columns:1.7em 1fr}
.lkx i.rf{font-style:italic;color:var(--muted);white-space:nowrap}
.lkx em.cf{font:400 var(--lk-k)/1 var(--ft);font-style:normal;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);white-space:nowrap;margin-left:.25em}
.lkp{margin:0 0 calc(var(--u) * .06);font:italic 400 var(--lk-b)/1.3 var(--fs);color:var(--muted);text-wrap:pretty}
.lkt{margin:0;padding:0}
.lkt > div{display:grid;grid-template-columns:var(--kw,1.9in) 1fr;column-gap:calc(var(--u) * .14);align-items:baseline;padding:calc(var(--u) * .12) 0 calc(var(--u) * .03);
  background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .09)}
.lkt dt{font:400 var(--lk-k)/1.3 var(--ft);letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}
.lkt dd{margin:0;font:italic 400 var(--lk-v)/1.25 var(--fs);color:var(--ink);font-variant-numeric:lining-nums;text-wrap:pretty}
.lka{display:grid;grid-template-columns:1fr 1fr;column-gap:calc(var(--u) * .3)}
.lka div{display:grid;grid-template-columns:3.9em 1fr;column-gap:.5em;align-items:baseline;padding:calc(var(--u) * .012) 0}
.lka b{font:400 var(--lk-k)/1.5 var(--ft);letter-spacing:.1em;color:var(--ink);font-weight:400}
.lka span{font:italic 400 var(--lk-b)/1.25 var(--fs);color:var(--ink)}
.lkl{display:grid;grid-template-columns:calc(var(--u) * 1.55) 1fr;column-gap:calc(var(--u) * .2);align-items:center;padding:calc(var(--u) * .07) 0 calc(var(--u) * .05);
  background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .08)}
.lkl:first-child,.lkt > div:first-child{background:none}
.lkl .sy{position:relative;height:calc(var(--u) * .56)}
.lkl .sy svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.lkl .tx{display:flex;flex-direction:column;line-height:1.2}
.lkl .tx b{font:400 var(--lk-k)/1.3 var(--ft);letter-spacing:.15em;text-transform:uppercase;font-weight:400}
.lkl .tx i{font:italic 400 var(--lk-b)/1.25 var(--fs);color:var(--muted)}
.lkl .sy .vt{position:absolute;left:0;top:50%;transform:translateY(-50%) scale(.82);transform-origin:0 50%}
.lkl .sy .note{position:absolute;left:0;top:30%;transform:translate(0,-50%);font-size:max(calc(11px * var(--fl)),calc(var(--u) * .24))}
.lkl .sy .dot{position:absolute}
.lkx .k{fill:none;stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.lkx .k2{fill:none;stroke:var(--ink);stroke-width:1.7;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.lkx .kf{fill:lkba(27,26,24,.075);stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.lkx .kh{stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.lkx .fi{fill:var(--ink)}
.lkx .kd{fill:none;stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:4 3}
.lkx .kt{fill:none;stroke:var(--ink);stroke-opacity:.5;stroke-width:.8;vector-effect:non-scaling-stroke;stroke-linecap:round}
.lkx .cl{fill:none;stroke:var(--ink);stroke-opacity:.13;stroke-width:.7;vector-effect:non-scaling-stroke}
.lkx .o{fill:none;stroke:var(--accent);stroke-width:1.7;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.lkx .od{fill:none;stroke:var(--accent);stroke-width:1.5;vector-effect:non-scaling-stroke;stroke-dasharray:1.5 1.5}
.lkx .of{fill:lkba(192,122,44,.3);stroke:var(--accent);stroke-width:1.2;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.lkx .ofs{fill:var(--accent)}
.lkx .ld1{fill:none;stroke:var(--ink);stroke-opacity:.72;stroke-width:.8;vector-effect:non-scaling-stroke}
.lkx .ldd{fill:var(--ink)}
.lkx svg text{font-family:var(--ft);fill:var(--ink);letter-spacing:.04em}
.lkd{position:absolute}
.lkd .art{position:relative}
.lkd .art > svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.lkd .vt{position:relative;top:auto;left:auto;margin-top:calc(var(--u) * .22)}
.lkd .dn{margin:calc(var(--u) * .16) 0 0;font:400 var(--lk-b)/1.3 var(--fs);color:var(--ink);text-wrap:pretty}
.lkd .dn i.rf{display:inline}
.lkd dl.lkt{margin-top:calc(var(--u) * .16)}
.lkq{position:absolute;display:flex;flex-direction:column;white-space:nowrap;line-height:1.14;pointer-events:none}
.lkq.l{transform:translate(0,-50%);align-items:flex-start;text-align:left}
.lkq.r{transform:translate(-100%,-50%);align-items:flex-end;text-align:right}
.lkq.c{transform:translate(-50%,-50%);align-items:center;text-align:center}
.lkq b{font:400 var(--lk-lb)/1.25 var(--ft);letter-spacing:.14em;text-transform:uppercase;font-weight:400;color:var(--ink)}
.lkq i{font:italic 400 var(--lk-li)/1.2 var(--fs);color:var(--muted)}
.lkq.dim i{color:var(--ink)}
.lkn{position:absolute;pointer-events:none}
.lkn svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.lkn circle{fill:none;stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke}
.lkn .nd{fill:var(--accent)}
.lkn .nl{stroke:var(--ink);stroke-width:1;vector-effect:non-scaling-stroke}
.lkn span{position:absolute;transform:translate(-50%,-50%);font:400 max(calc(8px * var(--fl)),calc(var(--u) * .14))/1 var(--ft);letter-spacing:.06em}
@media screen and (max-width:760px), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
  .fhtml:has(> .lkx){position:relative;inset:auto}
  .lkx{position:relative;inset:auto;--lk-b:14px;--lk-h:12px;--lk-k:10px;--lk-v:15px;--lk-lb:8.5px;--lk-li:11px}
  .lkc,.lkd{position:relative !important;left:auto !important;top:auto !important;width:auto !important;margin:0 0 30px}
  .lkd .art{width:100% !important;height:auto !important;aspect-ratio:var(--ar);max-width:460px}
  .lkd .dn{max-width:460px}
  .lkt > div{grid-template-columns:118px 1fr}
  .lkl{grid-template-columns:96px 1fr}
  .lkl .sy{height:40px}
  .lka{grid-template-columns:1fr}
}
@media print{ .lkx .ld1{stroke-width:.6} }`;
  /* ------------------------------------------------------------ schedules */
  const CSS_SCHED = `
.lsc{--lsc-k:max(calc(7.5px * var(--fl)),calc(var(--u) * .112));--lsc-v:max(calc(9.5px * var(--fl)),calc(var(--u) * .165));--lsc-n:max(calc(9px * var(--fl)),calc(var(--u) * .15))}
.lsc .lsc-kp svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.lsc .lsc-tg{position:absolute;transform:translate(-50%,-50%);width:max(calc(22px * var(--fl)),calc(var(--u) * .46));height:max(calc(22px * var(--fl)),calc(var(--u) * .46));border:1px solid var(--ink);border-radius:50%;
  background:var(--paper);display:grid;place-items:center;font:400 max(calc(7.5px * var(--fl)),calc(var(--u) * .135))/1 var(--ft);letter-spacing:.02em;color:var(--ink)}
.lsc .lsc-tg.lsc-up{border-style:dashed}
.lsc .lsc-kl{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;white-space:nowrap;line-height:1.15;pointer-events:none}
.lsc .lsc-kl b{font:400 var(--lsc-k)/1.2 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.lsc .lsc-kl i{font:italic 400 var(--lsc-k)/1.2 var(--fs);color:var(--muted)}
.lsc .lsc-na{position:absolute;width:max(calc(22px * var(--fl)),calc(var(--u) * .56));height:max(calc(22px * var(--fl)),calc(var(--u) * .56))}
.lsc .lsc-na svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.lsc h3{margin:0 0 calc(var(--u) * .1);font:400 max(calc(10px * var(--fl)),calc(var(--u) * .2))/1.1 var(--ft);letter-spacing:.18em;text-transform:uppercase}
.lsc .lsc-tab{position:absolute}
.lsc .lsc-tr{display:grid;grid-template-columns:var(--cols);column-gap:calc(var(--u) * .12);align-items:center;min-height:max(calc(22px * var(--fl)),calc(var(--u) * .47));
  background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .09);padding-top:calc(var(--u) * .05)}
.lsc .lsc-tr > span{min-width:0;font:italic 400 var(--lsc-v)/1.12 var(--fs);font-variant-numeric:lining-nums}
.lsc .lsc-tr .lsc-no{font:400 var(--lsc-n)/1 var(--ft);letter-spacing:.06em}
.lsc .lsc-tr .lsc-no i{display:inline-grid;place-items:center;width:max(calc(22px * var(--fl)),calc(var(--u) * .44));height:max(calc(22px * var(--fl)),calc(var(--u) * .44));border:1px solid var(--ink);border-radius:50%;font-style:normal;font-size:max(calc(7px * var(--fl)),calc(var(--u) * .12))}
.lsc .lsc-tr .lsc-op b{font:400 var(--lsc-k)/1 var(--ft);letter-spacing:.12em;margin-right:.35em}
.lsc .lsc-tr .lsc-mu{color:var(--muted)}
.lsc .lsc-tr .lsc-ac{color:var(--accent)}
.lsc .lsc-tr .lsc-th{position:relative;height:max(calc(18px * var(--fl)),calc(var(--u) * .38))}
.lsc .lsc-tr .lsc-th svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;opacity:.72}
.lsc .lsc-tr.lsc-hd{background:none;align-items:end;min-height:0;padding:0 0 calc(var(--u) * .08)}
.lsc .lsc-tr.lsc-hd > span{font:400 var(--lsc-k)/1.25 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-style:normal}
.lsc .lsc-tr.lsc-gp{min-height:max(calc(18px * var(--fl)),calc(var(--u) * .44));align-items:end;padding-bottom:calc(var(--u) * .05)}
.lsc .lsc-tr.lsc-gp > span{grid-column:1 / -1;font:400 max(calc(8px * var(--fl)),calc(var(--u) * .13))/1 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--accent);font-style:normal}
.lsc .lsc-tr.lsc-ph > span{color:var(--muted)}
.lsc .lsc-tr.lsc-ph .lsc-no i{border-style:dashed;color:var(--muted)}
.lsc .lsc-ft{display:flex;justify-content:space-between;align-items:flex-start;gap:calc(var(--u) * .4);margin-top:calc(var(--u) * .14)}
.lsc .lsc-ft .vt{position:static;flex:none}
.lsc .lsc-tf{margin:0;font:italic 400 max(calc(8.5px * var(--fl)),calc(var(--u) * .135))/1.3 var(--fs);color:var(--muted)}
.lsc .lsc-types{position:absolute;inset:0;pointer-events:none;--sft:calc(var(--u) * var(--sc))}
.lsc .lsc-ty{position:absolute;display:flex;flex-direction:column}
.lsc .lsc-dw{position:relative;width:calc(var(--tw) * var(--sft));height:calc(var(--th) * var(--sft))}
.lsc .lsc-dw svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.lsc .lsc-lb{margin-top:calc(var(--u) * .16);display:flex;gap:calc(var(--u) * .1);align-items:flex-start}
.lsc .lsc-lb em{flex:none;display:grid;place-items:center;min-width:max(calc(17px * var(--fl)),calc(var(--u) * .36));height:max(calc(15px * var(--fl)),calc(var(--u) * .3));padding:0 .3em;border:1px solid var(--ink);border-radius:999px;font:400 max(calc(8px * var(--fl)),calc(var(--u) * .14))/1 var(--ft);font-style:normal}
.lsc .lsc-lb span{display:flex;flex-direction:column;line-height:1.2}
.lsc .lsc-lb b{font:400 var(--lsc-k)/1.25 var(--ft);letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}
.lsc .lsc-lb i{font:italic 400 max(calc(9px * var(--fl)),calc(var(--u) * .14))/1.25 var(--fs);color:var(--muted);white-space:nowrap}
.lsc .lsc-col{position:absolute;display:flex;flex-direction:column;gap:calc(var(--u) * .42)}
.lsc .lsc-li ol,.lsc .lsc-li ul{list-style:none;margin:0;padding:0}
.lsc .lsc-li li{display:grid;grid-template-columns:max(calc(24px * var(--fl)),calc(var(--u) * .52)) 1fr;gap:calc(var(--u) * .08);padding:calc(var(--u) * .1) 0 calc(var(--u) * .04);
  background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .08);font:italic 400 max(calc(9px * var(--fl)),calc(var(--u) * .15))/1.3 var(--fs)}
.lsc .lsc-li li b{font:400 var(--lsc-k)/1.6 var(--ft);letter-spacing:.1em;font-style:normal;color:var(--muted)}
@media screen and (max-width:760px), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
  .fhtml:has(> .lsc){position:relative;inset:auto}
  .lsc{position:relative;padding-bottom:56px}
  .field:has(.lsc) .vfree .note{display:block;transform:none;margin:0 0 6px}
  .lsc .lsc-tab,.lsc .lsc-col,.lsc .lsc-types,.lsc .lsc-ty,.lsc .lsc-t3{position:relative !important;left:auto !important;top:auto !important;width:auto !important;inset:auto}
  .lsc .lsc-kp{margin-bottom:66px}
  .lsc .lsc-tab{margin:0 0 70px}
  .lsc .lsc-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:6px}
  .lsc .lsc-scroll > div{min-width:1010px;--cols:var(--mcols) !important}
  .lsc .lsc-types{display:flex;flex-wrap:wrap;align-items:flex-end;gap:22px 26px;--sft:9px;margin:0 0 14px}
  .lsc .lsc-t3{margin:0 0 30px}
  .lsc .lsc-t3 .vt{position:static}
  .lsc .lsc-ft{flex-direction:column;gap:14px}
  .lsc .lsc-col{gap:26px}
  .lsc .lsc-tr .lsc-no i{width:22px;height:22px}
}
`;
  if (!document.getElementById('living-kit-css')) {
    const st = document.createElement('style'); st.id = 'living-kit-css'; st.textContent = CSS_NOTES + '\n' + CSS_SCHED; document.head.appendChild(st);
  }
  /* ------------------------------------------------------------ helpers */
  const e = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const f = n => +(+n).toFixed(3);
  const pc = v => +(v * 100).toFixed(3);
  // rich text: {cf} becomes the orange confirm tag, [ref] becomes an italic code reference
  const rt = s => e(s).replace(/\{cf\}/g, '<em class="cf">confirm</em>').replace(/\[([^\]]+)\]/g, '<i class="rf">$1</i>');
  const sec = (no, title, items, ref) => `<section class="lks"><h3><span class="no">${no}</span>${e(title)}${ref ? `<span class="rf">${e(ref)}</span>` : ''}</h3>` +
    (Array.isArray(items) ? `<ol class="lko">${items.map((t, k) => `<li><span>${k + 1}</span><span>${rt(t)}</span></li>`).join('')}</ol>` : items) + '</section>';
  const tab = (rows, kw) => `<dl class="lkt"${kw ? ` style="--kw:${kw}"` : ''}>${rows.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${rt(v)}</dd></div>`).join('')}</dl>`;
  const col = (ctx, x, y, w, inner) => `<div class="lkc" style="left:${ctx.U(x)};top:${ctx.U(y)};width:${ctx.U(w)}">${inner}</div>`;

  /* a detail: art box w x h inches, viewBox vw x vh; labels {t:[x,y], a:'l'|'r'|'c', b, i, s:[x,y] (leader start), p:[x,y] (leader end)} */
  function detail(ctx, o) {
    const { x, y, w, h, vw, vh } = o;
    let lead = '', labs = '';
    (o.labels || []).forEach(L => {
      if (L.p) lead += `<path class="ld1" d="M${f(L.s[0])} ${f(L.s[1])} L${f(L.p[0])} ${f(L.p[1])}"/><circle class="ldd" cx="${f(L.p[0])}" cy="${f(L.p[1])}" r="${f(vw / 150)}"/>`;
      labs += `<span class="lkq ${L.a || 'l'}${L.dim ? ' dim' : ''}" style="left:${pc((L.t[0] - (o.vx || 0)) / vw)}%;top:${pc((L.t[1] - (o.vy || 0)) / vh)}%">${L.b ? `<b>${e(L.b)}</b>` : ''}${L.i ? `<i>${e(L.i)}</i>` : ''}</span>`;
    });
    const art = `<div class="art" style="width:${ctx.U(w)};height:${ctx.U(h)};--ar:${f(w / h)}"><svg viewBox="${o.vx || 0} ${o.vy || 0} ${vw} ${vh}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${o.svg}${lead}</svg>${labs}${o.extra || ''}</div>`;
    return `<div class="lkd" style="left:${ctx.U(x)};top:${ctx.U(y)};width:${ctx.U(w)}">${art}${ctx.viewTitle(o.n, o.title, o.scale)}${o.note ? `<p class="dn">${rt(o.note)}</p>` : ''}${o.after || ''}</div>`;
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
  const north = (l, t, s, deg) => `<div class="lkn" style="left:${l};top:${t};width:${s};height:${s}" aria-label="North">
    <svg viewBox="-1 -1 2 2" aria-hidden="true"><circle r=".78"/><g transform="rotate(${deg})"><path class="nd" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/><path class="nl" d="M0 .02 V.78"/></g></svg>
    <span style="left:${pc(.5 + .62 * Math.sin(deg * Math.PI / 180))}%;top:${pc(.5 - .62 * Math.cos(deg * Math.PI / 180))}%">N</span></div>`;

  const esc = e;
  function legend(ctx, o = {}) {
    const row = (sym, b, i) => `<div class="lkl"><div class="sy">${sym}</div><div class="tx"><b>${e(b)}</b><i>${rt(i)}</i></div></div>`;
    const S = (vb, body) => `<svg viewBox="${vb}" preserveAspectRatio="xMinYMid meet" aria-hidden="true">${body}</svg>`;
    const bub = (cx, cy, r, a, b) => `<circle class="k" cx="${cx}" cy="${cy}" r="${r}" style="fill:var(--paper)"/>${Ln(cx - r, cy, cx + r, cy)}<text x="${cx}" y="${cy - r * .22}" font-size="${r * .72}" text-anchor="middle">${a}</text><text x="${cx}" y="${cy + r * .66}" font-size="${r * .5}" text-anchor="middle">${b}</text>`;
    const rows = [
      row(`<div style="position:absolute;inset:0">${ctx.viewTitle(1, 'View', 'Scale')}</div>`, 'View title', 'view number, title and scale under every view'),
      row(S('0 0 31 11', `${Ln(1, 5.5, 22, 5.5, 'k2')}<path class="fi" d="M16 5.5 L16 1.2 L19.5 3.35 Z"/>${bub(26, 5.5, 4.2, '1', 'A3.0')}`), 'Section mark', 'cut line, flag looks the way the section looks; view over sheet'),
      row(S('0 0 31 11', `${bub(8, 5.5, 4.2, '2', 'A4.1')}<path class="fi" d="M12.6 5.5 L16.6 2.3 L16.6 8.7 Z"/>`), 'Elevation mark', 'the pointer faces the wall drawn; view over sheet'),
      row(S('0 0 31 11', `<circle class="kd" cx="7" cy="5.5" r="4.6"/>${Ln(11.2, 4, 17, 3)}${bub(22, 3.5, 3.4, '4', 'A6.1')}`), 'Detail callout', 'the dashed ring is enlarged on the sheet named'),
      row(S('0 0 31 11', `${Ln(1, 5.5, 13, 5.5, 'k')}<circle class="k" cx="6" cy="5.5" r="2.1"/><path class="fi" d="M6 3.4 A2.1 2.1 0 0 1 8.1 5.5 L6 5.5 Z M6 7.6 A2.1 2.1 0 0 1 3.9 5.5 L6 5.5 Z"/><text x="14.5" y="6.8" font-size="3.4">${esc(o.datum || "100.0")}</text>`), 'Level datum', 'finished floor, feet above the site datum'),
      row(S('0 0 31 11', `${Ln(3, 3.5, 7, 7.5)}${Ln(3, 7.5, 7, 3.5)}<text x="9" y="6.8" font-size="3.4">${esc(o.spot || "99.3")}</text>`), 'Spot elevation', 'grade or surface at a point'),
      row(`<svg viewBox="0 0 31 11" preserveAspectRatio="xMinYMid meet" aria-hidden="true"><circle class="k" cx="5.5" cy="5.5" r="4.2"/><g transform="translate(5.5 5.5) rotate(${ctx.DRW && ctx.DRW.north || 0}) scale(5.3)"><path class="ofs" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/></g></svg>`, 'North arrow', 'plan north, drawn from the survey bearing {cf}'),
      row(`<span class="note">note</span><span class="dot" style="left:78%;top:78%"></span><svg viewBox="0 0 31 11" preserveAspectRatio="none" aria-hidden="true"><path class="ld1" d="M13.5 4 Q16 8.5 24 8.6"/></svg>`, 'Hand note', 'design intent on a thin leader, never specification'),
      row(S('0 0 31 11', `<path class="k2" d="M1 5.5 H30" stroke-dasharray="7 1.6 1.2 1.6"/>`), 'Property line', 'from the lot data · confirm on survey'),
      row(S('0 0 31 11', `<path class="kd" d="M1 5.5 H30"/>`), 'Setback or limit', 'building setback, height or zone limit'),
      row(S('0 0 31 11', `<circle class="kd" cx="7" cy="5.5" r="4.8"/><circle class="ofs" cx="7" cy="5.5" r=".9"/>${Ln(14, 5.5, 30, 5.5, 'cl')}`), 'Tree to keep', 'canopy at the drip line'),
      row(S('0 0 31 11', `${Rc(1, 1.5, 8, 8)}${dots(1, 1.5, 9, 9.5, 1.6, .28, 3)}${Rc(11, 1.5, 8, 8)}${hatch(11, 1.5, 19, 9.5, 1.5)}${Rc(21, 1.5, 9, 8)}<path class="o" d="M21 3.6 C24 3 26 4.3 30 3.6 M21 6 C24 5.4 27 6.7 30 6 M21 8.2 C24 7.7 26 8.8 30 8.2"/>`), 'Hatches', 'concrete · earth · timber, the orange grain'),
      row(`<span style="position:absolute;left:0;top:50%;transform:translateY(-50%)"><em class="cf" style="margin:0">confirm</em></span>`, 'Confirm', 'not yet verified; holds until a survey, consultant or agency confirms it')
    ];
    return rows.join('');
  }


  /* ------------------------------------------------------------ schedule
     o: { x, y, w, title, cols: [[header, width in inches], ...], groups: [{ g: 'Group name', rows: [[cell, ...], ...] }],
          num: true makes the first cell a ringed tag, foot: 'small italic note', view: [n, title, scale], mcols: phone columns }
     A cell may be { t: 'text', c: 'mu' | 'ac' } for muted or accent text. Placeholder rows: { ph: 'text' } */
  function schedule(ctx, o) {
    const { U, viewTitle } = ctx;
    const cols = o.cols.map(c => U(c[1])).join(' ');
    let tb = `<div class="lsc-tr lsc-hd">${o.cols.map(c => `<span>${e(c[0])}</span>`).join('')}</div>`;
    (o.groups || []).forEach(grp => {
      if (grp.g) tb += `<div class="lsc-tr lsc-gp"><span>${e(grp.g)}</span></div>`;
      grp.rows.forEach(r => {
        if (r.ph) { tb += `<div class="lsc-tr lsc-ph"><span class="lsc-no"><i>${e(r.n || '·')}</i></span><span style="grid-column:2 / -1">${rt(r.ph)}</span></div>`; return; }
        tb += `<div class="lsc-tr">${r.map((c, k) => {
          const t = c && typeof c === 'object' ? c.t : c, cl = c && typeof c === 'object' && c.c ? ` class="lsc-${c.c}"` : '';
          return k === 0 && o.num !== false ? `<span class="lsc-no"><i>${e(t)}</i></span>` : `<span${cl}>${rt(String(t))}</span>`;
        }).join('')}</div>`;
      });
    });
    const mc = o.mcols ? `;--mcols:${o.mcols}` : `;--mcols:${o.cols.map(c => Math.round(c[1] * 52) + 'px').join(' ')}`;
    return `<div class="lsc"><div class="lsc-tab" style="left:${U(o.x)};top:${U(o.y)};width:${U(o.w)}">${o.title ? `<h3>${e(o.title)}</h3>` : ''}<div class="lsc-scroll"><div style="--cols:${cols}${mc}">${tb}</div></div>` +
      `<div class="lsc-ft">${o.foot ? `<p class="lsc-tf">${rt(o.foot)}</p>` : '<span></span>'}${o.view ? viewTitle(o.view[0], o.view[1], o.view[2]) : ''}</div></div></div>`;
  }
  /* a numbered or keyed list on curved rules: items [text] or [[key, text]] */
  function list(ctx, o) {
    const { U } = ctx;
    const items = o.items.map((v, i) => Array.isArray(v) ? `<li><b>${e(v[0])}</b><span>${rt(v[1])}</span></li>` : `<li><b>${i + 1}</b><span>${rt(v)}</span></li>`).join('');
    return `<div class="lsc"><div class="lsc-col" style="left:${U(o.x)};top:${U(o.y)};width:${U(o.w)}"><div class="lsc-li">${o.title ? `<h3>${e(o.title)}</h3>` : ''}<ol>${items}</ol></div></div></div>`;
  }

  window.LIVING_KIT = { e, esc, f, pc, rt, sec, tab, col, detail, legend, schedule, list, P, Ln, Rc, Pg, dots, hatch, tick, north,
    abbr: rows => `<div class="lka">${rows.map(([a, b]) => `<div><b>${e(a)}</b><span>${e(b)}</span></div>`).join('')}</div>` };
})();
