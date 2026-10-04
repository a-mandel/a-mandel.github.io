/* sched-a crew sheets: A7.0 Door schedule. Built by sheets/tools/sched-a/build.py from the pocket model; edit the template there. */
(function () {
  const KEY = __KEY__;

  /* the exterior doors, from the ribbon scheme in the pocket model (see build.py for where each one sits) */
  const T = {
    A: { name: 'Pivot', sub: 'solid core cedar', w: 4, h: 9.17 },
    B: { name: 'Glazed swing', sub: 'full lite, side lite', w: 4.25, h: 8 },
    C: { name: 'Solid swing', sub: 'flush, solid core', w: 3, h: 8 },
    D: { name: 'Lift and slide', sub: 'four panels, OXXO, transom over', w: 16, h: 10 },
    E: { name: 'Overhead', sub: 'sectional, cedar clad', w: 9, h: 8 }
  };
  const G = [
    { g: 'Lower level · FF 5992.5', rows: [
      ['001', 'Flex room to lower patio', 'D', '16′ 0″', '8′ 0″', 'Aluminum clad', 'Dual, tempered, 7A', 'HW4', 'none', 'Fixed transom to the 10 ft head'],
      ['002', 'Lower level, south garden', 'C', '3′ 6″', '7′ 4″', 'Dark steel', 'None, solid cedar', 'HW2', 'none', 'Plus fixed cedar panel, confirm the step'] ] },
    { g: 'Main level · FF 5997.5 · garage 6000.0', rows: [
      ['101', 'Main entry, bridge vestibule', 'A', '4′ 0″', '9′ 2″', 'Dark steel', 'None, solid core', 'HW1', 'none', 'Faces the front court tree'],
      ['102', 'Family entry, mudroom', 'B', '3′ 0″', '8′ 0″', 'Aluminum clad', 'Dual, tempered, 7A', 'HW2', 'none', 'Off the porch, under the kitchen roof'],
      ['103', 'Garage to house', 'C', '3′ 0″', '8′ 0″', 'Dark steel', 'None', 'HW3', '20 min', 'Self closing and latching · garage 2′ 6″ up'],
      ['104', 'Garage, bay 1', 'E', '9′ 0″', '8′ 0″', 'Dark steel jamb', 'None', 'HW5', 'none', 'Two separate doors, ember seals'],
      ['105', 'Garage, bay 2', 'E', '9′ 0″', '8′ 0″', 'Dark steel jamb', 'None', 'HW5', 'none', 'Matches 104'],
      ['106', 'Living room to upper terrace', 'D', '15′ 4″', '8′ 0″', 'Dark steel', 'Dual, tempered, 7A', 'HW4', 'none', 'Three wing bays, glass fixed above'],
      ['107', 'Dining, bridge to terrace', 'D', '16′ 0″', '8′ 0″', 'Aluminum clad', 'Dual, tempered, 7A', 'HW4', 'none', 'Stair stays inside the bridge, clear'],
      ['108', 'Granny suite, west garden', 'B', '3′ 0″', '8′ 0″', 'Aluminum clad', 'Dual, tempered, 7A', 'HW2', 'none', 'Side lites fill the 8 ft glass bay'] ] },
    { g: 'Level 2 · FF 6004.0', rows: [
      ['201', 'Primary suite to its terrace', 'D', '16′ 0″', '8′ 0″', 'Aluminum clad', 'Dual, tempered, 7A', 'HW4', 'none', 'Flush sill, the floor runs out to the deck'] ] }
  ];
  const HW = [
    ['HW1', 'Floor pivot with closer, long pull, keyed deadbolt and smart lock'],
    ['HW2', 'Butt hinges, lever, deadbolt, ember seal weatherstrip, drained sill'],
    ['HW3', 'Spring hinges, latching lever, deadbolt, smoke gasket, sweep'],
    ['HW4', 'Lift handle, multipoint lock, low sill in a drained pan'],
    ['HW5', 'Belt opener with battery backup, photo eyes, perimeter ember seal']
  ];
  const NOTES = [
    'Sizes are about, cut from the pocket model at FA accuracy. Confirm rough openings with the maker.',
    'Very High FHSZ. Every exterior door meets Chapter 7A, CRC R337: glazing dual with tempered lites, solid leaves ignition resistant or solid core 1 3/8 in min, ember seals all round.',
    'Leaves and glass panels hold to about 4 ft by 8 ft, panelized like every other pane in the house.',
    'Garage to house per CRC R302.5.1: 20 minute or solid core 1 3/8 in, self closing and self latching.',
    'Title 24 Part 6: glazed doors count as fenestration. U factor and SHGC come from the energy model.',
    'Snow and water: every sill flashed into a drained pan; low sills only under the deep eaves.'
  ];

  const MQ = 'screen and (max-width:760px) and (orientation:portrait), screen and (max-width:760px) and (min-height:541px), screen and (max-width:760px) and (pointer:fine), screen and (max-aspect-ratio:1/1) and (max-width:1100px)';
  const CSS = `<style>
.sa{--sa-k:max(calc(7.5px * var(--fl)),calc(var(--u) * .112));--sa-v:max(calc(9.5px * var(--fl)),calc(var(--u) * .165));--sa-n:max(calc(9px * var(--fl)),calc(var(--u) * .15))}
.sa .sa-kp svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.sa .sa-tg{position:absolute;transform:translate(-50%,-50%);width:max(calc(22px * var(--fl)),calc(var(--u) * .46));height:max(calc(22px * var(--fl)),calc(var(--u) * .46));border:1px solid var(--ink);border-radius:50%;
  background:var(--paper);display:grid;place-items:center;font:400 max(calc(7.5px * var(--fl)),calc(var(--u) * .135))/1 var(--ft);letter-spacing:.02em;color:var(--ink)}
.sa .sa-tg.sa-up{border-style:dashed}
.sa .sa-kl{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;white-space:nowrap;line-height:1.15;pointer-events:none}
.sa .sa-kl b{font:400 var(--sa-k)/1.2 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.sa .sa-kl i{font:italic 400 var(--sa-k)/1.2 var(--fs);color:var(--muted)}
.sa .sa-na{position:absolute;width:max(calc(22px * var(--fl)),calc(var(--u) * .56));height:max(calc(22px * var(--fl)),calc(var(--u) * .56))}
.sa .sa-na svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.sa h3{margin:0 0 calc(var(--u) * .1);font:400 max(calc(10px * var(--fl)),calc(var(--u) * .2))/1.1 var(--ft);letter-spacing:.18em;text-transform:uppercase}
.sa .sa-tab{position:absolute}
.sa .sa-tr{display:grid;grid-template-columns:var(--cols);column-gap:calc(var(--u) * .12);align-items:center;min-height:max(calc(22px * var(--fl)),calc(var(--u) * .47));
  background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .09);padding-top:calc(var(--u) * .05)}
.sa .sa-tr > span{min-width:0;font:italic 400 var(--sa-v)/1.12 var(--fs);font-variant-numeric:lining-nums}
.sa .sa-tr .sa-no{font:400 var(--sa-n)/1 var(--ft);letter-spacing:.06em}
.sa .sa-tr .sa-no i{display:inline-grid;place-items:center;width:max(calc(22px * var(--fl)),calc(var(--u) * .44));height:max(calc(22px * var(--fl)),calc(var(--u) * .44));border:1px solid var(--ink);border-radius:50%;font-style:normal;font-size:max(calc(7px * var(--fl)),calc(var(--u) * .12))}
.sa .sa-tr .sa-op b{font:400 var(--sa-k)/1 var(--ft);letter-spacing:.12em;margin-right:.35em}
.sa .sa-tr .sa-mu{color:var(--muted)}
.sa .sa-tr .sa-ac{color:var(--accent)}
.sa .sa-tr .sa-th{position:relative;height:max(calc(18px * var(--fl)),calc(var(--u) * .38))}
.sa .sa-tr .sa-th svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;opacity:.72}
.sa .sa-tr.sa-hd{background:none;align-items:end;min-height:0;padding:0 0 calc(var(--u) * .08)}
.sa .sa-tr.sa-hd > span{font:400 var(--sa-k)/1.25 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-style:normal}
.sa .sa-tr.sa-gp{min-height:max(calc(18px * var(--fl)),calc(var(--u) * .44));align-items:end;padding-bottom:calc(var(--u) * .05)}
.sa .sa-tr.sa-gp > span{grid-column:1 / -1;font:400 max(calc(8px * var(--fl)),calc(var(--u) * .13))/1 var(--ft);letter-spacing:.16em;text-transform:uppercase;color:var(--accent);font-style:normal}
.sa .sa-tr.sa-ph > span{color:var(--muted)}
.sa .sa-tr.sa-ph .sa-no i{border-style:dashed;color:var(--muted)}
.sa .sa-ft{display:flex;justify-content:space-between;align-items:flex-start;gap:calc(var(--u) * .4);margin-top:calc(var(--u) * .14)}
.sa .sa-ft .vt{position:static;flex:none}
.sa .sa-tf{margin:0;font:italic 400 max(calc(8.5px * var(--fl)),calc(var(--u) * .135))/1.3 var(--fs);color:var(--muted)}
.sa .sa-types{position:absolute;inset:0;pointer-events:none;--sft:calc(var(--u) * var(--sc))}
.sa .sa-ty{position:absolute;display:flex;flex-direction:column}
.sa .sa-dw{position:relative;width:calc(var(--tw) * var(--sft));height:calc(var(--th) * var(--sft))}
.sa .sa-dw svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.sa .sa-lb{margin-top:calc(var(--u) * .16);display:flex;gap:calc(var(--u) * .1);align-items:flex-start}
.sa .sa-lb em{flex:none;display:grid;place-items:center;min-width:max(calc(17px * var(--fl)),calc(var(--u) * .36));height:max(calc(15px * var(--fl)),calc(var(--u) * .3));padding:0 .3em;border:1px solid var(--ink);border-radius:999px;font:400 max(calc(8px * var(--fl)),calc(var(--u) * .14))/1 var(--ft);font-style:normal}
.sa .sa-lb span{display:flex;flex-direction:column;line-height:1.2}
.sa .sa-lb b{font:400 var(--sa-k)/1.25 var(--ft);letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}
.sa .sa-lb i{font:italic 400 max(calc(9px * var(--fl)),calc(var(--u) * .14))/1.25 var(--fs);color:var(--muted);white-space:nowrap}
.sa .sa-col{position:absolute;display:flex;flex-direction:column;gap:calc(var(--u) * .42)}
.sa .sa-li ol,.sa .sa-li ul{list-style:none;margin:0;padding:0}
.sa .sa-li li{display:grid;grid-template-columns:max(calc(24px * var(--fl)),calc(var(--u) * .52)) 1fr;gap:calc(var(--u) * .08);padding:calc(var(--u) * .1) 0 calc(var(--u) * .04);
  background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .08);font:italic 400 max(calc(9px * var(--fl)),calc(var(--u) * .15))/1.3 var(--fs)}
.sa .sa-li li b{font:400 var(--sa-k)/1.6 var(--ft);letter-spacing:.1em;font-style:normal;color:var(--muted)}
@media ${MQ}{
  .fhtml:has(> .sa){position:relative;inset:auto}
  .sa{position:relative;padding-bottom:56px}
  .field:has(.sa) .vfree .note{display:block;transform:none;margin:0 0 6px}
  .sa .sa-tab,.sa .sa-col,.sa .sa-types,.sa .sa-ty,.sa .sa-t3{position:relative !important;left:auto !important;top:auto !important;width:auto !important;inset:auto}
  .sa .sa-kp{margin-bottom:66px}
  .sa .sa-tab{margin:0 0 70px}
  .sa .sa-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:6px}
  .sa .sa-scroll > div{min-width:1010px;--cols:40px 34px 150px 104px 50px 50px 92px 116px 36px 50px 250px !important}
  .sa .sa-types{display:flex;flex-wrap:wrap;align-items:flex-end;gap:22px 26px;--sft:9px;margin:0 0 14px}
  .sa .sa-t3{margin:0 0 30px}
  .sa .sa-t3 .vt{position:static}
  .sa .sa-ft{flex-direction:column;gap:14px}
  .sa .sa-col{gap:26px}
  .sa .sa-tr .sa-no i{width:22px;height:22px}
}
</style>`;

  const ft = v => { const f = Math.floor(v + 1e-6), i = Math.round((v - f) * 12); return `${f}′ ${i}″`; };

  /* a door type in hairline elevation, feet, y down, floor at y = h */
  function typeArt(k) {
    const t = T[k], W = t.w, H = t.h, S = 'fill="none" stroke="#1b1a18" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"';
    const R = (x, y, w, h, sw = 1, op = 1, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${S} stroke-width="${sw}"${op < 1 ? ` opacity="${op}"` : ''} ${extra}/>`;
    const L = (d, sw = .7, op = 1, dash) => `<path d="${d}" ${S} stroke-width="${sw}"${op < 1 ? ` opacity="${op}"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
    const glint = (x, y, w, h) => L(`M${x + w * .2} ${y + h * .36} l${w * .22} ${-h * .12} M${x + w * .2} ${y + h * .44} l${w * .12} ${-h * .066}`, .6, .45);
    const chev = (hx, lx, y0, y1) => L(`M${lx} ${y0} L${hx} ${(y0 + y1) / 2} L${lx} ${y1}`, .6, .55, '3 2');
    let s = L(`M-0.8 ${H} H${W + .8}`, 1.1);
    if (k === 'A') {
      s += R(0, 0, W, H, 1.1) + R(.14, .14, W - .28, H - .14, .7);
      for (let x = .64; x < W - .2; x += .5) s += L(`M${x.toFixed(2)} .4 V${(H - .3).toFixed(2)}`, .5, .3);
      s += R(W - .78, 2.3, .14, 4.4, .8);
      s += `<circle cx="1" cy="${H - .14}" r=".09" fill="#c07a2c"/><circle cx="1" cy=".14" r=".09" fill="#c07a2c"/>`;
      s += chev(1, W - .14, .14, H - .14);
    } else if (k === 'B') {
      s += R(0, 0, W, H, 1.1) + L(`M3 0 V${H}`, .9);
      s += R(.36, .36, 2.28, H - .72, .6) + R(3.24, .24, .77, H - .48, .6);
      s += glint(.36, .36, 2.28, H - .72) + glint(3.24, .24, .77, H - .48);
      s += L(`M2.62 3.6 h-.34`, 1.1) + chev(.1, 2.9, .1, H - .1);
    } else if (k === 'C') {
      s += R(0, 0, W, H, 1.1) + R(.12, .12, W - .24, H - .12, .7);
      s += L(`M2.62 3.6 h-.34`, 1.1) + chev(.12, W - .12, .12, H - .12);
    } else if (k === 'D') {
      s += R(0, 0, W, H, 1.1) + L(`M0 2 H${W}`, .9);
      for (let i = 1; i < 4; i++) s += L(`M${i * 4} 0 V${H}`, i === 2 ? .9 : .7);
      for (let i = 0; i < 4; i++) {
        s += R(i * 4 + .22, 2.22, 3.56, 7.56, .55) + glint(i * 4 + .22, 2.22, 3.56, 7.56);
        s += R(i * 4 + .18, .18, 3.64, 1.64, .45, .8);
      }
      s += L('M7.2 6.6 H5 M5.5 6.3 L5 6.6 L5.5 6.9 M8.8 6.6 H11 M10.5 6.3 L11 6.6 L10.5 6.9', .8);
    } else if (k === 'E') {
      s += R(-.28, -.28, W + .56, H + .28, .9) + R(0, 0, W, H, .8);
      for (let y = 2; y < H; y += 2) s += L(`M0 ${y} H${W}`, .8);
      for (let y = .5; y < H; y += .5) if (y % 2) s += L(`M.1 ${y} H${W - .1}`, .45, .3);
    }
    return s;
  }
  const typeSVG = (k, pad = 1) => `<svg viewBox="${-pad} ${-.4} ${T[k].w + 2 * pad} ${T[k].h + .8}" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${typeArt(k)}</svg>`;

  LIVING_SHEETS.push({
    id: 'A7.0', group: 'Architectural', title: 'Door schedule', short: 'Door schedule', foot: 'Door schedule',
    scale: 'As noted', issued: [4],
    cap: 'Eleven doors to the outside, each where the model opens. Big glass to every terrace, every leaf Chapter 7A.',
    data: ['11 exterior doors · 5 types', 'Lift and slide to each terrace', 'Garage to house · 20 min, self closing', 'Interior doors after room planning'],
    notes: [
      { text: 'the entry faces the tree', t: [1.95, 11.05], p: [7.17, 8.42], a: 'l' },
      { text: 'every panel 4 by 8 or less', t: [25.55, 19.0], p: [25.9, 16.0], a: 'l' }
    ],
    html: ctx => {
      const { U, esc, viewTitle } = ctx;
      let h = CSS + '<div class="sa">';

      /* 1 · key plan */
      const kx = 0.65, ky = 3.75, kw = 8.8, kh = kw / KEY.ar;
      h += `<div class="view sa-kp" style="left:${U(kx)};top:${U(ky)};width:${U(kw)};height:${U(kh)};--ar:${KEY.ar.toFixed(4)}">${KEY.svg}`;
      KEY.labels.forEach(l => { h += `<span class="sa-kl" style="left:${(l.p[0] * 100).toFixed(2)}%;top:${(l.p[1] * 100).toFixed(2)}%"><b>${esc(l.t)}</b>${l.s ? `<i>${esc(l.s)}</i>` : ''}</span>`; });
      KEY.tags.forEach(t => { h += `<span class="sa-tg${t.n[0] === '2' ? ' sa-up' : ''}" style="left:${(t.p[0] * 100).toFixed(2)}%;top:${(t.p[1] * 100).toFixed(2)}%">${t.n}</span>`; });
      h += `<div class="sa-na" style="right:0;top:0" aria-label="North"><svg viewBox="-1 -1 2 2"><circle r=".78" fill="none" stroke="#1b1a18" stroke-width="1" vector-effect="non-scaling-stroke"/><g transform="rotate(${KEY.north})"><path d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z" fill="#c07a2c"/><path d="M0 .02 V.78" stroke="#1b1a18" stroke-width="1" vector-effect="non-scaling-stroke"/></g></svg></div>`;
      h += viewTitle(1, 'Key plan · exterior doors', 'Not to scale · 201 is level 2, dashed') + '</div>';

      /* 2 · schedule */
      const tx = 10.35, tw = 20.4;
      const cols = [0.72, 0.72, 3.15, 1.95, 0.95, 0.95, 1.75, 2.15, 0.62, 0.95, 5.05].map(v => U(v)).join(' ');
      const head = ['No.', 'Type', 'Location', 'Operation', 'Width about', 'Height about', 'Frame', 'Glazing', 'Hdwr', 'Fire rating', 'Notes'];
      let tb = `<div class="sa-tr sa-hd">${head.map(c => `<span>${c}</span>`).join('')}</div>`;
      G.forEach(grp => {
        tb += `<div class="sa-tr sa-gp"><span>${esc(grp.g)}</span></div>`;
        grp.rows.forEach(r => {
          const [n, loc, ty, w, ht, fr, gl, hw, fire, note] = r;
          tb += `<div class="sa-tr"><span class="sa-no"><i>${n}</i></span><span class="sa-th">${typeSVG(ty, .3)}</span><span>${esc(loc)}</span>` +
            `<span class="sa-op"><b>${ty}</b>${esc(T[ty].name)}</span><span>${w}</span><span>${ht}</span><span>${esc(fr)}</span><span>${esc(gl)}</span>` +
            `<span>${hw}</span><span class="${fire === 'none' ? 'sa-mu' : 'sa-ac'}">${esc(fire)}</span><span>${esc(note)}</span></div>`;
        });
      });
      tb += `<div class="sa-tr sa-gp"><span>Interior doors</span></div>` +
        `<div class="sa-tr sa-ph"><span class="sa-no"><i>1xx</i></span><span></span><span style="grid-column:3 / -1">Interior doors to follow room planning. The plan stays open for now, so each one lands here once the rooms do.</span></div>`;
      h += `<div class="sa-tab" style="left:${U(tx)};top:${U(3.75)};width:${U(tw)}"><h3>Door schedule</h3><div class="sa-scroll"><div style="--cols:${cols}">${tb}</div></div>` +
        `<div class="sa-ft"><p class="sa-tf">Numbers run by level: 0xx lower, 1xx main, 2xx level 2. Sizes about, nominal leaf or panel set, FA accuracy.</p>` +
        `${viewTitle(2, 'Exterior doors', 'Schedule · ribbon scheme')}</div></div>`;

      /* 3 · door types, hairline elevations at 3/8 in = 1 ft, set on one floor line */
      const S = 0.375, floorY = 16.85, slots = [['A', 10.35], ['B', 13.35], ['C', 16.45], ['D', 19.05], ['E', 26.55]];
      h += `<div class="sa-types" style="--sc:${S}">`;
      slots.forEach(([k, x]) => {
        const t = T[k];
        h += `<div class="sa-ty" style="left:${U(x)};top:${U(floorY - (t.h + .4) * S)}"><div class="sa-dw" style="--tw:${t.w + 2};--th:${t.h + .8}">${typeSVG(k)}</div>` +
          `<div class="sa-lb" style="margin-left:${U(S)}"><em>${k}</em><span><b>${esc(t.name)}</b><i>${esc(t.sub)}</i><i>${k === 'D' ? 'panels about 4′ 0″ × 8′ 0″' : `about ${ft(t.w === 4.25 ? 3 : t.w)} × ${ft(t.h)}`}</i></span></div></div>`;
      });
      h += `</div><div class="dvt sa-t3" style="left:${U(10.35)};top:${U(18.2)}">${viewTitle(3, 'Door types', '3/8 in = 1 ft · outside face · leaves 1 3/4 in')}</div>`;

      /* 4 · notes and hardware sets */
      h += `<div class="sa-col" style="left:${U(0.65)};top:${U(12.55)};width:${U(8.8)}">` +
        `<div class="sa-li"><h3>Door notes</h3><ol>${NOTES.map((v, i) => `<li><b>${i + 1}</b><span>${esc(v)}</span></li>`).join('')}</ol></div>` +
        `<div class="sa-li"><h3>Hardware sets</h3><ul>${HW.map(([k, v]) => `<li><b>${k}</b><span>${esc(v)}</span></li>`).join('')}</ul></div></div>`;
      return h + '</div>';
    }
  });
})();
