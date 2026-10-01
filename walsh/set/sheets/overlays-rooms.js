/* overlays-rooms crew (10/1/26): the first pass room fit out on A2.1 and A2.2, a conceptual sketch, not a layout of record.
   Furniture footprints and the two board form chimneys are cut from the pocket model (walsh/mobile/model.json), so plan
   and model agree; partitions, fixtures, the stair, the bunks and the granny suite are sketched here in model feet and
   placed with SHARED.plan(). Pencil weights only; burnt orange stays with the notes. */
(function () {
  const W = 31.25, H = 23;
  const MODEL = {"l1":[[[19.77,0.83],[28.11,-2.55],[29.24,0.24],[20.89,3.61]],[[20.7,-3.54],[24.4,-5.04],[25.34,-2.72],[21.63,-1.22]],[[13.98,-1.47],[16.58,-2.52],[17.63,0.08],[15.03,1.13]],[[28.07,-7.17],[30.67,-8.22],[31.72,-5.62],[29.12,-4.57]],[[-11.35,-2.76],[-2.08,-6.51],[-0.77,-3.26],[-10.04,0.49]],[[-19.58,-13.76],[3.0,-13.76],[3.0,-11.56],[-19.58,-11.56]],[[-19.78,-13.76],[-13.08,-13.76],[-13.08,-8.56],[-19.78,-8.56]],[[6.02,19.22],[10.02,19.22],[10.02,29.22],[6.02,29.22]],[[7.62,20.22],[8.42,20.22],[8.42,28.22],[7.62,28.22]],[[4.22,26.92],[5.82,26.92],[5.82,28.52],[4.22,28.52]],[[10.22,26.92],[11.82,26.92],[11.82,28.52],[10.22,28.52]],[[4.22,23.42],[5.82,23.42],[5.82,25.02],[4.22,25.02]],[[10.22,23.42],[11.82,23.42],[11.82,25.02],[10.22,25.02]],[[4.22,19.92],[5.82,19.92],[5.82,21.52],[4.22,21.52]],[[10.22,19.92],[11.82,19.92],[11.82,21.52],[10.22,21.52]],[[7.22,29.72],[8.82,29.72],[8.82,31.32],[7.22,31.32]],[[7.22,17.12],[8.82,17.12],[8.82,18.72],[7.22,18.72]],[[16.78,-7.88],[26.05,-11.64],[26.8,-9.78],[17.53,-6.03]]],"l2":[[[7.21,50.65],[7.97,50.41],[10.81,59.16],[10.05,59.4]],[[8.34,51.55],[15.18,49.32],[17.29,55.79],[10.44,58.01]],[[7.75,49.42],[9.27,48.93],[9.83,50.64],[8.31,51.14]],[[10.66,58.36],[12.18,57.87],[12.73,59.58],[11.21,60.08]],[[16.48,49.74],[17.81,49.31],[19.42,54.26],[18.08,54.69]],[[17.82,56.77],[20.29,55.97],[21.25,58.92],[18.77,59.72],[17.97,57.25]],[[21.81,55.48],[24.28,54.67],[24.44,55.15],[25.24,57.62],[22.77,58.42],[21.96,55.95]],[[8.46,51.61],[15.12,49.45],[17.16,55.72],[10.5,57.89]],[[8.65,51.87],[9.89,51.46],[10.77,54.17],[9.53,54.58]],[[9.62,54.86],[10.86,54.46],[11.74,57.17],[10.5,57.57]],[[19.72,61.41],[26.57,59.19],[27.05,60.66],[20.2,62.89]]],"chimN":[[16.39,-11.5],[23.81,-14.51],[25.12,-11.26],[17.71,-8.26]],"chimS":[[19.82,63.01],[27.43,60.54],[28.82,64.82],[21.21,67.29]]};

  /* ---------- sketch geometry, model feet: x east, z south ---------- */
  const R = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
  // a rectangle laid along a wall: s along the wall from a, d in from it (n is the inward normal)
  function onWall(a, b, s0, s1, d0, d1) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [u[1], -u[0]];
    const p = (s, d) => [a[0] + u[0] * s + n[0] * d, a[1] + u[1] * s + n[1] * d];
    return [p(s0, d0), p(s1, d0), p(s1, d1), p(s0, d1)];
  }
  const SOUTH_BUNK = [[8.79, 67.88], [25.8, 62.32]];      // the bunk room's south wall, west to east
  const bunks = [onWall(...SOUTH_BUNK, 2.8, 6.2, 0.15, 6.95), onWall(...SOUTH_BUNK, 6.8, 10.2, 0.15, 6.95)];         // heads to the south wall, clear of the chimney
  const pillows = [onWall(...SOUTH_BUNK, 3.1, 5.9, 0.45, 1.75), onWall(...SOUTH_BUNK, 7.1, 9.9, 0.45, 1.75)];
  const L1 = {
    walls: [
      [[-13.08, -14.56], [-13.08, -8.56]], [[-20.58, -8.56], [-16.4, -8.56]],                 // pantry
      [[25.32, -14.56], [25.32, -8.96]], [[25.32, -8.96], [28.5, -8.96]], [[31.32, -14.56], [31.32, -8.96]],   // powder room, door to the east
      [[-29.79, -14.56], [-29.79, -11.6]], [[-29.79, -8.7], [-29.79, -6.06]],                 // entry and mudroom
      [[-7.0, 49.46], [-7.0, 57.0]], [[-7.0, 57.0], [-3.4, 57.0]],                            // granny bath
      [[8.79, 44.29], [8.79, 49.6]], [[8.79, 52.6], [8.79, 63.2]], [[8.79, 65.9], [8.79, 67.88]],   // gym, bunk bath
      [[0.03, 61.79], [8.79, 58.92]]
    ],
    furn: [
      R(-38.4, -14.4, -30.3, -12.9), R(-37.4, -12.6, -31.6, -11.5),                         // mudroom lockers and bench
      R(-27.6, -14.4, -23.0, -13.3),                                                          // entry console
      R(4.63, 33.0, 6.63, 40.0),                                                              // bar
      R(10.4, 8.3, 15.6, 9.6), R(14.3, 9.6, 15.6, 12.6),                                      // nook banquette
      R(-20.4, 55.0, -18.6, 62.0),                                                            // granny kitchenette
      R(-12.0, 63.4, -7.0, 70.1), R(-13.6, 63.6, -12.2, 65.0), R(-6.8, 63.6, -5.4, 65.0),      // granny bed, nightstands
      R(-17.6, 64.2, -15.2, 66.6), R(-17.6, 67.4, -15.2, 69.8),                              // granny lounge chairs
      R(9.3, 46.6, 12.3, 54.6), R(13.4, 48.6, 16.0, 52.6),                                    // flex sofa, low table
      R(0.5, 48.0, 2.2, 54.0), R(5.4, 55.0, 8.0, 58.6)                                        // gym rack, treadmill
    ],
    fixt: [
      { r: R(-3.5, 49.0, -0.4, 52.4) }, { r: R(-6.6, 51.0, -5.2, 52.8), wc: 1 }, { r: R(-6.6, 55.2, -2.6, 57.0), sink: 1 },   // granny bath
      { r: R(0.5, 66.0, 3.5, 69.2) }, { r: R(5.0, 66.4, 6.5, 68.2), wc: 1 }, { r: R(1.0, 62.0, 6.4, 63.6), sink: 1 },          // bunk bath
      { r: R(29.5, -14.4, 31.1, -12.7), wc: 1 }, { r: R(25.5, -10.7, 27.3, -9.2), sink: 1 }                                  // powder room
    ],
    dashed: [R(-59.7, -0.8, -53.5, 14.7), R(-48.7, -0.8, -42.5, 14.7), R(0.5, 48.6, 8.3, 58.6)],   // two cars, gym mat
    stair: { x0: 0.03, x1: 4.03, z0: 31.0, z1: 45.4 },
    nook: [12.3, 11.0],
    game: [20.6, 55.4],
    notes: [
      { t: 'bunks along the south wall,\nsleeps four', at: onWall(...SOUTH_BUNK, 8.2, 8.2, 1.7, 1.7)[0], dx: 1.15, dy: 0.95 },
      { t: 'stair: up 10 to the primary,\ndown 8 to the lower level', at: [2.0, 40.0], dx: -2.9, dy: 1.55 },
      { t: 'island on the dining axis', at: [-6.0, -3.0], dx: 0.84, dy: 1.09, a: 'r' },
      { t: 'sofa faces the board form chimney', at: [24.0, 0.6], dx: 0.4, dy: 1.6 },
      { t: 'granny bed, bath and kitchenette', at: [-9.5, 66.8], dx: -2.6, dy: 1.25 }
    ],
    stamp: { t: 'conceptual layout, first pass 10/1/26', at: [15.6, 18.15] }
  };
  const L2 = {
    walls: [
      [[0.02, 50.0], [2.0, 50.0]], [[5.0, 50.0], [6.8, 50.0]],                                // landing to dressing
      [[6.8, 50.0], [6.8, 68.55]],                                                             // dressing and bath, behind the bed
      [[0.02, 58.0], [2.2, 58.0]], [[4.4, 58.0], [6.8, 58.0]]                                  // dressing to bath
    ],
    furn: [R(0.2, 50.3, 2.0, 57.7), R(5.0, 50.3, 6.6, 57.7)],                                 // closet runs either side of the aisle
    fixt: [
      { r: R(4.0, 62.2, 6.4, 67.4), tub: 1 }, { r: R(0.4, 65.6, 3.4, 69.3) },
      { r: R(0.2, 58.6, 2.0, 63.6), sink: 2 }, { r: R(4.6, 58.6, 6.2, 60.3), wc: 1 }
    ],
    dashed: [R(0.03, 45.9, 4.03, 50.0)],                                                       // stair head
    notes: [
      { t: 'bath to the southwest this pass;\nthe stair lands at the northwest', at: [4.0, 64.0], dx: -3.7, dy: 1.3 },
      { t: 'king bed faces east to the terrace', at: [13.0, 53.6], dx: -2.0, dy: -1.6 },
      { t: 'board form chimney, fireplace', at: [24.3, 63.9], dx: 0.6, dy: 1.2 }
    ],
    stamp: { t: 'conceptual layout, first pass 10/1/26', at: [15.6, 18.15] }
  };

  /* ---------- drawing ---------- */
  const f3 = n => (+n).toFixed(3);
  function build(id, ctx) {
    const S = ctx.SHARED || window.SHARED;
    if (!S || !S.plan) return '';
    const D = id === 'A2.1' ? L1 : L2, U = ctx.U, E = ctx.esc || (s => String(s));
    const P = (x, z) => S.plan(id, x, z);
    const pts = poly => poly.map(([x, z]) => P(x, z).map(f3).join(',')).join(' ');
    const k = P(1, 0)[0] - P(0, 0)[0];                     // field inches per foot
    const svg = [], html = [];
    const poly = (p, cls) => svg.push(`<polygon class="${cls}" points="${pts(p)}"/>`);
    const line = (a, b, cls) => { const A = P(...a), B = P(...b); svg.push(`<line class="${cls}" x1="${f3(A[0])}" y1="${f3(A[1])}" x2="${f3(B[0])}" y2="${f3(B[1])}"/>`); };
    const circ = (c, r, cls) => { const C = P(...c); svg.push(`<circle class="${cls}" cx="${f3(C[0])}" cy="${f3(C[1])}" r="${f3(r * k)}"/>`); };

    // the model's furniture and the chimneys
    (id === 'A2.1' ? MODEL.l1 : MODEL.l2).forEach(p => poly(p, 'mf'));
    if (id === 'A2.1') poly(MODEL.chimN, 'ch');
    poly(MODEL.chimS, 'ch');
    // sketched furniture, fixtures, partitions
    D.furn.forEach(p => poly(p, 'sf'));
    D.dashed.forEach(p => poly(p, 'dsh'));
    D.fixt.forEach(f => {
      poly(f.r, 'fx');
      const xs = f.r.map(p => p[0]), zs = f.r.map(p => p[1]), cx = (Math.min(...xs) + Math.max(...xs)) / 2, cz = (Math.min(...zs) + Math.max(...zs)) / 2;
      const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...zs) - Math.min(...zs);
      if (f.wc) circ([cx, cz + h * 0.12], Math.min(w, h) * 0.32, 'fxi');
      if (f.sink) for (let i = 0; i < f.sink; i++) circ(h > w ? [cx, Math.min(...zs) + h * (i + 0.5) / f.sink] : [Math.min(...xs) + w * (i + 0.5) / f.sink, cz], Math.min(w, h) * 0.28, 'fxi');
      if (f.tub) { const p = f.r; poly([[p[0][0] + 0.35, p[0][1] + 0.35], [p[1][0] - 0.35, p[1][1] + 0.35], [p[2][0] - 0.35, p[2][1] - 0.35], [p[3][0] + 0.35, p[3][1] - 0.35]], 'fxi'); }
      if (!f.wc && !f.sink && !f.tub) line(f.r[0], f.r[2], 'fxi');          // a shower: one diagonal
    });
    D.walls.forEach(([a, b]) => line(a, b, 'pw'));
    if (id === 'A2.1') {
      bunks.forEach(p => { poly(p, 'sf'); line(p[0], p[2], 'up'); line(p[1], p[3], 'up'); });
      pillows.forEach(p => poly(p, 'fx'));
      const s = D.stair;
      for (let z = s.z0; z <= s.z1 + 1e-6; z += 0.917) line([s.x0, z], [s.x1, z], 'tr');
      line([(s.x0 + s.x1) / 2, s.z0 + 1.2], [(s.x0 + s.x1) / 2, s.z1 - 0.6], 'ar');
      const tip = P((s.x0 + s.x1) / 2, s.z1 - 0.6); svg.push(`<path class="ah" d="M${f3(tip[0] - 0.06)} ${f3(tip[1] - 0.1)} L${f3(tip[0])} ${f3(tip[1])} L${f3(tip[0] + 0.06)} ${f3(tip[1] - 0.1)}"/>`);
      circ(D.nook, 1.3, 'sf');
      circ(D.game, 1.4, 'sf'); [[0, -2.1], [2.1, 0], [0, 2.1], [-2.1, 0]].forEach(([a, b]) => circ([D.game[0] + a, D.game[1] + b], 0.55, 'sf'));
    }
    // hand notes, on white, with a dotted leader and the orange dot
    // on a desktop they wait for a hover on their dot, like every note in the set (André 10/1/26)
    D.notes.forEach((n, k) => {
      const A = P(...n.at), T = [A[0] + n.dx, A[1] + n.dy];
      svg.push(`<path class="nl" data-n="${k}" d="M${f3(T[0])} ${f3(T[1])} Q${f3((A[0] + T[0]) / 2)} ${f3(T[1])} ${f3(A[0])} ${f3(A[1])}"/><circle class="nd" cx="${f3(A[0])}" cy="${f3(A[1])}" r=".045"/>`);
      html.push(`<div class="hn${(n.a ? n.a === 'r' : n.dx < 0) ? ' r' : ''}" data-n="${k}" style="left:${U(T[0])};top:${U(T[1])}">${E(n.t)}</div>`);
      html.push(`<i class="rhit" data-n="${k}" style="left:${U(A[0])};top:${U(A[1])}" aria-hidden="true"></i>`);
    });
    html.push(`<div class="hn st" style="left:${U(D.stamp.at[0])};top:${U(D.stamp.at[1])}">${E(D.stamp.t)}</div>`);
    return `<div class="rmx" data-ov="${id}"><svg class="rsv" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="rmH${id.replace('.', '')}" width=".09" height=".09" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2=".09" stroke="#1b1a18" stroke-opacity=".35" stroke-width=".012"/></pattern></defs>${svg.join('').replace(/class="ch"/g, `class="ch" fill="url(#rmH${id.replace('.', '')})"`)}</svg>${html.join('')}</div>`;
  }

  const CSS = `
.rmx{position:absolute;inset:0;pointer-events:none;--hn:max(calc(9px * var(--fl)),calc(var(--u) * .135))}
.rmx .rsv{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.rmx .mf{fill:rgba(255,255,255,.72);stroke:var(--ink);stroke-opacity:.7;stroke-width:.6;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.rmx .sf{fill:rgba(255,255,255,.66);stroke:var(--ink);stroke-opacity:.62;stroke-width:.55;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.rmx .fx{fill:rgba(255,255,255,.8);stroke:var(--ink);stroke-opacity:.7;stroke-width:.55;vector-effect:non-scaling-stroke}
.rmx .fxi{fill:none;stroke:var(--ink);stroke-opacity:.55;stroke-width:.5;vector-effect:non-scaling-stroke}
.rmx .ch{stroke:var(--ink);stroke-opacity:.9;stroke-width:1.1;vector-effect:non-scaling-stroke}
.rmx .pw{stroke:var(--ink);stroke-opacity:.82;stroke-width:2.1;stroke-linecap:square;vector-effect:non-scaling-stroke}
.rmx .dsh{fill:none;stroke:var(--ink);stroke-opacity:.45;stroke-width:.55;stroke-dasharray:4 3;vector-effect:non-scaling-stroke}
.rmx .up{stroke:var(--ink);stroke-opacity:.4;stroke-width:.5;stroke-dasharray:3 3;vector-effect:non-scaling-stroke}
.rmx .tr{stroke:var(--ink);stroke-opacity:.6;stroke-width:.5;vector-effect:non-scaling-stroke}
.rmx .ar,.rmx .ah{fill:none;stroke:var(--ink);stroke-opacity:.8;stroke-width:.7;vector-effect:non-scaling-stroke}
.rmx .nl{fill:none;stroke:var(--ink);stroke-opacity:.55;stroke-width:.6;stroke-dasharray:1.5 2.5;vector-effect:non-scaling-stroke}
.rmx .nd{fill:var(--accent)}
.rmx .hn{position:absolute;white-space:pre;transform:translate(0,-50%);font:400 var(--hn)/1.12 'Nothing You Could Do','EB Garamond',cursive;color:var(--ink);background:rgba(255,255,255,.82);border-radius:4px;padding:0 4px;box-shadow:0 0 5px 2px rgba(255,255,255,.7)}
.rmx .hn.r{transform:translate(-100%,-50%)}
.rmx .hn.st{transform:none;color:var(--muted);background:none;box-shadow:none}
@media screen and (max-width:760px), screen and (max-aspect-ratio:1/1) and (max-width:1100px){.rmx{display:none}}
@media print{.rmx .hn{box-shadow:none}}
.rmx .rhit{display:none}
@media screen and (hover:hover) and (pointer:fine){
  .hovernotes .rmx .rhit{display:block;position:absolute;width:calc(var(--u)*1.1);height:calc(var(--u)*1.1);transform:translate(-50%,-50%);border-radius:50%;pointer-events:auto;cursor:help;z-index:2}
  .hovernotes:not(.allnotes) .rmx .nl[data-n]{opacity:0;transition:opacity .25s ease}
  .hovernotes:not(.allnotes) .rmx .hn[data-n]{opacity:0;clip-path:inset(-40% 100% -40% -10%);transition:opacity .25s ease,clip-path .25s ease}
  .hovernotes .rmx .nl.on[data-n]{opacity:1;transition:opacity .4s ease}
  .hovernotes .rmx .hn.on[data-n]{opacity:1;clip-path:inset(-40% -10% -40% -10%);transition:opacity .3s ease .2s,clip-path .7s ease .2s;pointer-events:auto}
}
`;
  if (typeof document !== 'undefined' && !document.getElementById('ov-rooms-css')) {
    const st = document.createElement('style'); st.id = 'ov-rooms-css'; st.textContent = CSS; (document.head || document.documentElement).appendChild(st);
  }
  ['A2.1', 'A2.2'].forEach(id => LIVING_OVERLAYS.push({ id, z: 3, html: ctx => build(id, ctx) }));
})();
