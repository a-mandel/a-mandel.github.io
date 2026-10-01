/* ANDRÉ MANDEL title block studio · shared kit (9/30/26)
   One cartoon sheet (A2.1 Level 1 plan) on true 36 x 24 paper, with the binding, the inch ruler,
   the weathered paper, the corner in the breeze, and the live page header and footer.
   A variation calls KIT.mount({ ... tb(c){ return html } }) and designs only its title block.
   The sidebar never carries the sheet index. */
(function () {
'use strict';

const SET = {
  firm: { name: 'ANDRÉ MANDEL', line: 'Residential design', addr: ['40 Edith St #4', 'San Francisco CA 94133'], phone: '510.459.7686', email: 'andre.mandel@gmail.com' },
  project: { name: 'Walsh Residence', site: 'Lahontan Lot 235', street: '8154 Lahontan Drive', city: 'Truckee CA', address: '8154 Lahontan Drive, Truckee CA', apn: '108 160 012 000', zoning: 'RS PD 1.7', county: 'Placer County', owner: 'Dustin Walsh', ownerCo: 'Elevated Developers' },
  header: { title: 'Walsh Residence', lines: ['8154 Lahontan Drive · Lot 235 · Truckee', 'APN 108 160 012 000 · RS PD 1.7', 'Feasibility FA2 · 9/28/26'] },
  permits: [ { k: 'Lahontan design review (LCC)', tb: 'Design review (LCC)', v: 'no. pending' }, { k: 'Placer County building permit', tb: 'Building permit', v: 'no. pending' } ],
  fire: 'Very High FHSZ · Chapter 7A',
  issuances: [ { no: 1, date: '9/28/26', for: 'Feasibility FA2' }, { no: 2, date: '9/30/26', for: 'Living set, cartoon' } ],
  aor: { label: '', name: '', note: '' },   // architect of record removed from all project documentation (9/30/26)
  date: '9/30/26', drawnBy: 'AM', status: 'Feasibility · not for construction',
  copy: '© 2026 André Mandel. Drawings are instruments of service.',
  live: { url: 'https://a-mandel.github.io/walsh/', show: ['a-mandel.github.io', '/walsh'], label: 'The living set' },
  marks: { lockup: new URL('../../marks/am_logo.svg', document.currentScript ? document.currentScript.src : location.href).href },
  count: 17, index: 7,
  sheet: { id: 'A2.1', group: 'Architectural', title: 'Level 1 plan', foot: 'Level 1 plan', scale: '3/16 in = 1 ft',
    cap: 'Living, kitchen, bridge and suites on one main floor, wrapped around the front court tree.',
    data: ['One main floor, one elevation', 'Living room double height', 'Dining on the bridge, about 20 ft wide', 'Granny suite at the main level'],
    notes: [ { v: 0, text: 'the court wraps the tree', t: [.6, .2], p: [.48, .42], a: 'l' }, { v: 0, text: 'living room tip, all glass', t: [.6, .86], p: [.8, .64], a: 'r' } ] }
};

const QR = { size: 41, d: 'M2 2h7v1h-7zM11 2h1v1h-1zM14 2h1v1h-1zM18 2h4v1h-4zM24 2h1v1h-1zM27 2h2v1h-2zM32 2h7v1h-7zM2 3h1v1h-1zM8 3h1v1h-1zM10 3h1v1h-1zM14 3h1v1h-1zM16 3h1v1h-1zM20 3h2v1h-2zM28 3h1v1h-1zM30 3h1v1h-1zM32 3h1v1h-1zM38 3h1v1h-1zM2 4h1v1h-1zM4 4h3v1h-3zM8 4h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM14 4h1v1h-1zM21 4h4v1h-4zM28 4h1v1h-1zM32 4h1v1h-1zM34 4h3v1h-3zM38 4h1v1h-1zM2 5h1v1h-1zM4 5h3v1h-3zM8 5h1v1h-1zM10 5h5v1h-5zM17 5h1v1h-1zM19 5h1v1h-1zM21 5h3v1h-3zM25 5h3v1h-3zM32 5h1v1h-1zM34 5h3v1h-3zM38 5h1v1h-1zM2 6h1v1h-1zM4 6h3v1h-3zM8 6h1v1h-1zM12 6h1v1h-1zM16 6h2v1h-2zM20 6h3v1h-3zM24 6h2v1h-2zM28 6h1v1h-1zM30 6h1v1h-1zM32 6h1v1h-1zM34 6h3v1h-3zM38 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM12 7h1v1h-1zM14 7h1v1h-1zM17 7h2v1h-2zM20 7h1v1h-1zM22 7h1v1h-1zM24 7h1v1h-1zM28 7h1v1h-1zM30 7h1v1h-1zM32 7h1v1h-1zM38 7h1v1h-1zM2 8h7v1h-7zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h1v1h-1zM26 8h1v1h-1zM28 8h1v1h-1zM30 8h1v1h-1zM32 8h7v1h-7zM10 9h2v1h-2zM15 9h1v1h-1zM21 9h2v1h-2zM25 9h1v1h-1zM28 9h1v1h-1zM30 9h1v1h-1zM2 10h1v1h-1zM8 10h1v1h-1zM10 10h4v1h-4zM16 10h2v1h-2zM20 10h4v1h-4zM26 10h3v1h-3zM30 10h3v1h-3zM35 10h3v1h-3zM2 11h2v1h-2zM6 11h2v1h-2zM9 11h4v1h-4zM14 11h2v1h-2zM19 11h1v1h-1zM22 11h1v1h-1zM24 11h2v1h-2zM29 11h1v1h-1zM31 11h1v1h-1zM33 11h3v1h-3zM37 11h1v1h-1zM4 12h1v1h-1zM6 12h1v1h-1zM8 12h1v1h-1zM13 12h1v1h-1zM16 12h1v1h-1zM19 12h1v1h-1zM22 12h3v1h-3zM26 12h2v1h-2zM29 12h3v1h-3zM33 12h3v1h-3zM37 12h2v1h-2zM2 13h2v1h-2zM6 13h1v1h-1zM13 13h2v1h-2zM17 13h2v1h-2zM20 13h1v1h-1zM28 13h7v1h-7zM38 13h1v1h-1zM3 14h2v1h-2zM8 14h1v1h-1zM10 14h1v1h-1zM12 14h3v1h-3zM16 14h1v1h-1zM18 14h1v1h-1zM21 14h2v1h-2zM25 14h2v1h-2zM30 14h1v1h-1zM32 14h2v1h-2zM35 14h1v1h-1zM38 14h1v1h-1zM3 15h2v1h-2zM6 15h2v1h-2zM9 15h1v1h-1zM11 15h5v1h-5zM17 15h5v1h-5zM25 15h1v1h-1zM29 15h2v1h-2zM33 15h1v1h-1zM35 15h1v1h-1zM2 16h1v1h-1zM7 16h2v1h-2zM11 16h1v1h-1zM14 16h1v1h-1zM16 16h4v1h-4zM22 16h2v1h-2zM26 16h1v1h-1zM28 16h8v1h-8zM37 16h2v1h-2zM4 17h3v1h-3zM9 17h4v1h-4zM14 17h1v1h-1zM18 17h4v1h-4zM24 17h2v1h-2zM28 17h1v1h-1zM31 17h1v1h-1zM33 17h1v1h-1zM35 17h4v1h-4zM4 18h1v1h-1zM7 18h6v1h-6zM16 18h3v1h-3zM21 18h1v1h-1zM23 18h1v1h-1zM25 18h1v1h-1zM27 18h1v1h-1zM31 18h2v1h-2zM34 18h1v1h-1zM36 18h3v1h-3zM2 19h1v1h-1zM6 19h2v1h-2zM10 19h1v1h-1zM14 19h1v1h-1zM20 19h1v1h-1zM22 19h2v1h-2zM25 19h1v1h-1zM27 19h1v1h-1zM29 19h1v1h-1zM35 19h3v1h-3zM3 20h2v1h-2zM7 20h5v1h-5zM14 20h2v1h-2zM17 20h1v1h-1zM19 20h1v1h-1zM22 20h11v1h-11zM34 20h1v1h-1zM36 20h1v1h-1zM38 20h1v1h-1zM4 21h1v1h-1zM7 21h1v1h-1zM10 21h3v1h-3zM15 21h2v1h-2zM20 21h3v1h-3zM26 21h1v1h-1zM31 21h3v1h-3zM35 21h1v1h-1zM38 21h1v1h-1zM3 22h1v1h-1zM5 22h1v1h-1zM7 22h4v1h-4zM12 22h2v1h-2zM17 22h1v1h-1zM19 22h1v1h-1zM21 22h1v1h-1zM24 22h5v1h-5zM31 22h2v1h-2zM34 22h1v1h-1zM36 22h1v1h-1zM2 23h2v1h-2zM5 23h2v1h-2zM9 23h3v1h-3zM13 23h1v1h-1zM15 23h1v1h-1zM17 23h1v1h-1zM21 23h1v1h-1zM23 23h1v1h-1zM25 23h3v1h-3zM29 23h2v1h-2zM34 23h1v1h-1zM36 23h1v1h-1zM2 24h1v1h-1zM4 24h1v1h-1zM7 24h4v1h-4zM12 24h2v1h-2zM17 24h2v1h-2zM20 24h1v1h-1zM22 24h1v1h-1zM24 24h1v1h-1zM27 24h4v1h-4zM32 24h4v1h-4zM37 24h2v1h-2zM4 25h1v1h-1zM11 25h1v1h-1zM18 25h1v1h-1zM23 25h1v1h-1zM28 25h8v1h-8zM38 25h1v1h-1zM3 26h1v1h-1zM5 26h1v1h-1zM8 26h1v1h-1zM12 26h1v1h-1zM15 26h2v1h-2zM18 26h3v1h-3zM23 26h1v1h-1zM26 26h1v1h-1zM30 26h1v1h-1zM32 26h2v1h-2zM38 26h1v1h-1zM2 27h1v1h-1zM5 27h1v1h-1zM9 27h1v1h-1zM11 27h1v1h-1zM14 27h3v1h-3zM18 27h1v1h-1zM25 27h1v1h-1zM28 27h3v1h-3zM33 27h1v1h-1zM2 28h1v1h-1zM6 28h1v1h-1zM8 28h1v1h-1zM11 28h1v1h-1zM13 28h1v1h-1zM16 28h1v1h-1zM19 28h2v1h-2zM22 28h3v1h-3zM26 28h2v1h-2zM29 28h3v1h-3zM36 28h3v1h-3zM2 29h1v1h-1zM6 29h2v1h-2zM11 29h2v1h-2zM15 29h1v1h-1zM17 29h1v1h-1zM20 29h1v1h-1zM22 29h1v1h-1zM25 29h1v1h-1zM28 29h3v1h-3zM33 29h4v1h-4zM38 29h1v1h-1zM2 30h1v1h-1zM4 30h1v1h-1zM6 30h1v1h-1zM8 30h5v1h-5zM15 30h1v1h-1zM19 30h1v1h-1zM24 30h15v1h-15zM10 31h3v1h-3zM14 31h2v1h-2zM17 31h6v1h-6zM25 31h1v1h-1zM30 31h1v1h-1zM34 31h1v1h-1zM2 32h7v1h-7zM12 32h2v1h-2zM15 32h1v1h-1zM17 32h1v1h-1zM21 32h5v1h-5zM30 32h1v1h-1zM32 32h1v1h-1zM34 32h1v1h-1zM38 32h1v1h-1zM2 33h1v1h-1zM8 33h1v1h-1zM11 33h1v1h-1zM13 33h1v1h-1zM18 33h5v1h-5zM24 33h2v1h-2zM29 33h2v1h-2zM34 33h1v1h-1zM2 34h1v1h-1zM4 34h3v1h-3zM8 34h1v1h-1zM11 34h2v1h-2zM14 34h2v1h-2zM18 34h1v1h-1zM21 34h1v1h-1zM23 34h1v1h-1zM25 34h3v1h-3zM29 34h6v1h-6zM36 34h2v1h-2zM2 35h1v1h-1zM4 35h3v1h-3zM8 35h1v1h-1zM12 35h1v1h-1zM15 35h1v1h-1zM18 35h1v1h-1zM20 35h1v1h-1zM25 35h3v1h-3zM29 35h1v1h-1zM31 35h2v1h-2zM38 35h1v1h-1zM2 36h1v1h-1zM4 36h3v1h-3zM8 36h1v1h-1zM11 36h3v1h-3zM17 36h2v1h-2zM21 36h1v1h-1zM26 36h3v1h-3zM37 36h2v1h-2zM2 37h1v1h-1zM8 37h1v1h-1zM11 37h3v1h-3zM16 37h1v1h-1zM21 37h2v1h-2zM25 37h2v1h-2zM28 37h4v1h-4zM34 37h2v1h-2zM38 37h1v1h-1zM2 38h7v1h-7zM10 38h2v1h-2zM17 38h2v1h-2zM20 38h1v1h-1zM22 38h1v1h-1zM24 38h3v1h-3zM30 38h4v1h-4zM38 38h1v1h-1z' };

/* the corner in the breeze: gusts with a quick lift and a slow settle, still air between them */
const FLUTTER = {
  period: 5.2,        // seconds, the base breath of the breeze; slower layers ride at 2.6x and 4.2x, a quicker one at 0.62x
  lift: 0.95,         // inches, largest fold distance along the top edge
  rest: 0.12,         // inches, fold distance when the air is still
  curl: 0.16,         // bow of the flap edges and the hinge, as a fraction of their length (grows a little with lift)
  roll: 0.22,         // how far the flap rolls over near its tip as it lifts, 0 = flat flap
  turnRest: 152,      // degrees the flap has turned over at rest (90 = on edge, 180 = folded flat)
  turnPeak: 124,      // degrees at the height of a gust (stands up more, shows more underside)
  skew: 1.355,        // right edge fold / top edge fold, 1.355 = parallel to the corner cut (53.6 degrees)
  gust: 0.38,         // 0 = an even breeze, 1 = very gusty from breath to breath
  calm: 0.44,         // wind below this (0 to 1) is a still spell: the corner settles and rests
  rise: 0.26,         // seconds, time constant of the lift when a gust arrives (quick)
  settle: 1.35,       // seconds, time constant of the settle when it passes (slow)
  flutter: 0.06,      // small quick tremble of the flap at the top of a gust
  shadow: 0.24,       // opacity of the flap's soft shadow on the page at rest
  blur: [0.035, 0.16] // shadow softness in inches, at rest and at full lift
};
const FRAY = {
  reach: 2.8,     // inches along each edge that the tear runs from the corner
  depth: 0.105,   // inches, the deepest deckle, near the corner
  step: 0.016,    // inches between outline samples
  bite: 0.045,    // inches, the very corner worn away
  fibers: 22,     // loose fibers standing off the tear
  seed: 235
};
const FRAYED = (() => {
  let sd = FRAY.seed >>> 0;
  const rnd = () => (sd = (Math.imul(sd, 1664525) + 1013904223) >>> 0) / 4294967296;
  const noise = n => { const v = Array.from({ length: n }, rnd); return x => { const i = Math.floor(x), f = x - i, k = f * f * (3 - 2 * f); return v[i % n] * (1 - k) + v[(i + 1) % n] * k; }; };
  // depth of the tear at t inches from the corner: a quick falloff, soft bites, fine deckle, a couple of sharp nicks
  const edge = nicks => {
    const big = noise(97), mid = noise(389), R = FRAY.reach;
    return t => {
      const r = t / R, env = FRAY.depth * (0.3 + 0.7 * Math.exp(-t / 1.1)) * Math.max(0, 1 - r * r);
      let d = env * (0.12 + 0.55 * big(t / 0.34) + 0.33 * mid(t / 0.055));
      nicks.forEach(([p, w, h]) => { d += h * Math.max(0, 1 - Math.abs(t - p) / w) * Math.max(0, 1 - r); });
      return d;
    };
  };
  const dT = edge([[0.52, 0.07, 0.075], [1.46, 0.05, 0.04]]), dR = edge([[0.34, 0.06, 0.06], [1.12, 0.08, 0.05], [2.0, 0.05, 0.03]]);
  const pts = [], side = [], par = [];     // the outline, which edge each point is on (0 top, 1 right), its t
  const t0 = FRAY.bite;
  for (let t = FRAY.reach; t >= t0 - 1e-9; t -= FRAY.step) { const j = (rnd() - 0.5) * 0.006; pts.push([-t + j, dT(t)]); side.push(0); par.push(t); }
  // the worn corner: a short ragged run between the two edges
  const a0 = pts[pts.length - 1], b0 = [-dR(t0), t0];
  pts.push([(a0[0] * 0.4 + b0[0] * 0.6) - 0.012, (a0[1] * 0.6 + b0[1] * 0.4) + 0.01]); side.push(0); par.push(0);
  for (let t = t0; t <= FRAY.reach + 1e-9; t += FRAY.step) { const j = (rnd() - 0.5) * 0.006; pts.push([-dR(t), t + j]); side.push(1); par.push(t); }
  const f4 = v => +v.toFixed(4), P = p => `${f4(p[0])} ${f4(p[1])}`;
  const line = pts.map((p, i) => (i ? 'L' : 'M') + P(p)).join(' ');
  const R = FRAY.reach, o = 0.004;
  const mask = `M${-R - 0.02} ${-o} L${P(pts[0])} ${line.replace(/^M/, 'L')} L${o} ${R + 0.02} L${o} ${-o} Z`;
  const region = `${line} L0 3.4 L-3.4 3.4 L-3.4 0 Z`;
  // loose fibers: rooted on the tear, most near the corner, standing off the edge and curling a little
  const fibers = [];
  for (let k = 0; k < FRAY.fibers; k++) {
    const e = k % 2, t = t0 + (R * 0.7 - t0) * Math.pow(rnd(), 1.7);
    let i = 0, best = 9;
    pts.forEach((p, j) => { if (side[j] === e && Math.abs(par[j] - t) < best) { best = Math.abs(par[j] - t); i = j; } });
    const base = pts[i], out = e ? [1, 0] : [0, -1], ang = (rnd() - 0.5) * 1.9, len = 0.025 + 0.085 * Math.pow(rnd(), 1.4) * (1 - t / R * 0.6);
    const dx = out[0] * Math.cos(ang) - out[1] * Math.sin(ang), dy = out[0] * Math.sin(ang) + out[1] * Math.cos(ang);
    const tip = [base[0] + dx * len - (e ? 0.02 : 0), base[1] + dy * len + (e ? 0 : 0.02)];
    const bend = (rnd() - 0.5) * 0.9 * len;
    const ctl = [(base[0] + tip[0]) / 2 - dy * bend, (base[1] + tip[1]) / 2 + dx * bend];
    fibers.push({ e, t: par[i], pts: [base, ctl, tip] });
  }
  const fibPath = fibers.map(f => `M${P(f.pts[0])} Q${P(f.pts[1])} ${P(f.pts[2])}`).join(' ');
  return { pts, side, par, line, mask, region, fibers, fibPath };
})();

function curlSVG(k) {
  const W = FRAYED;
  return `<svg class="tear" viewBox="-3 0 3 3" aria-hidden="true">
    <defs><clipPath id="tc${k}"><path d="${W.region}"/></clipPath>
      <radialGradient id="tg${k}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${FRAY.reach}">
        <stop offset="0" stop-color="rgb(150,112,62)"/><stop offset=".45" stop-color="rgb(150,112,62)" stop-opacity=".7"/><stop offset="1" stop-color="rgb(150,112,62)" stop-opacity="0"/></radialGradient>
      <radialGradient id="th${k}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${FRAY.reach}">
        <stop offset="0" stop-color="rgb(96,78,54)" stop-opacity=".24"/><stop offset=".6" stop-color="rgb(96,78,54)" stop-opacity=".14"/><stop offset="1" stop-color="rgb(96,78,54)" stop-opacity="0"/></radialGradient></defs>
    <g clip-path="url(#tc${k})" fill="none" stroke="url(#tg${k})" stroke-linejoin="round">
      <path d="${W.line}" stroke-width=".2" stroke-opacity=".035"/><path d="${W.line}" stroke-width=".11" stroke-opacity=".05"/>
      <path d="${W.line}" stroke-width=".05" stroke-opacity=".08"/><path d="${W.line}" stroke-width=".018" stroke-opacity=".12"/></g>
    <path class="tm" d="${W.mask}"/>
    <path class="te" d="${W.line}" stroke="url(#th${k})"/>
    <path class="fib" d="${W.fibPath}"/>
  </svg><svg class="curl" viewBox="-3 0 3 3" aria-hidden="true">
    <defs>
      <linearGradient id="cg${k}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#d8d1c3"/><stop offset=".5" stop-color="#e7e1d6"/><stop offset="1" stop-color="#f4f0e7"/></linearGradient>
      <linearGradient id="cr${k}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e2dccf"/><stop offset="1" stop-color="#eee9df"/></linearGradient>
      <filter id="cb${k}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation=".05"/></filter>
      <clipPath id="cp${k}"><path d="${W.region}"/></clipPath>
    </defs>
    <path class="rev" fill="url(#cr${k})" clip-path="url(#cp${k})" d=""/>
    <path class="csh" fill="#1b1a18" filter="url(#cb${k})" d=""/>
    <path class="flap" fill="url(#cg${k})" d=""/>
    <path class="fz" d=""/>
    <path class="crest" d=""/>
    <path class="hl" d=""/>
    <path class="fib" d=""/>
  </svg>`;
}

const TAU = Math.PI * 2;
// the wind: layered sines at unrelated periods, so no two gusts are alike; below FLUTTER.calm it is a still spell
function wind(t) {
  const P = FLUTTER.period, g = FLUTTER.gust;
  const n = 0.46 * Math.sin(TAU * t / P + 0.3) + 0.26 * Math.sin(TAU * t / (P * 2.618) + 1.7)
          + 0.17 * Math.sin(TAU * t / (P * 0.618) + 4.1) + 0.11 * Math.sin(TAU * t / (P * 4.236) + 0.9);
  const w = 0.5 + 0.5 * n;                                           // 0 to 1
  const x = Math.max(0, Math.min(1, (w - FLUTTER.calm) / (1 - FLUTTER.calm)));
  const size = 1 - g * 0.5 * (1 + Math.sin(TAU * t / (P * 3.7) + 2.2));   // each gust a different size
  const puff = Math.pow(Math.max(0, Math.sin(TAU * t / (P * 0.37) + 0.8)), 8) * 0.35 * (x > 0 ? 1 : 0.25);
  return Math.min(1, x * x * (3 - 2 * x) * size + puff);
}
// the paper answers the wind: a quick lift, a slow settle
function stepLift(L, t, dt) {
  const target = wind(t), tau = target > L ? FLUTTER.rise : FLUTTER.settle;
  return L + (target - L) * (1 - Math.exp(-dt / tau));
}
function curlShape(t, L) {
  const tr = FLUTTER.flutter * L * (Math.sin(TAU * t * 2.3) + 0.6 * Math.sin(TAU * t * 3.7 + 1.3) + 0.3 * Math.sin(TAU * t * 5.9 + 0.4)) / 1.9;
  const l = Math.max(0, Math.min(1, L + tr));
  const a = FLUTTER.rest + (FLUTTER.lift - FLUTTER.rest) * l;
  const b = a * (FLUTTER.skew + 0.06 * Math.sin(TAU * t / (FLUTTER.period * 0.71) + 2.1) * (0.3 + l));
  const turn = (FLUTTER.turnRest + (FLUTTER.turnPeak - FLUTTER.turnRest) * l + 5 * tr / Math.max(.01, FLUTTER.flutter) * l + 1.5 * Math.sin(TAU * t / (FLUTTER.period * 0.53))) * Math.PI / 180;
  const P = [-a, 0], Q = [0, b], dd = a * a + b * b;
  const F = [-a + a * a * a / dd, a * a * b / dd];                        // foot of the corner on the fold
  const n = [-F[0], -F[1]];                                              // fold to corner
  const c = Math.cos(turn);
  const T = [F[0] + n[0] * c, F[1] + n[1] * c];                          // the tip, seen from above
  return { P, Q, F, T, n, L: l };
}
function bow(A, B, away, k) {
  // control point for a gentle bow from A to B, pushed away from point 'away'
  const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = [B[0] - A[0], B[1] - A[1]], len = Math.hypot(d[0], d[1]) || 1;
  let p = [-d[1] / len, d[0] / len];
  if ((m[0] - away[0]) * p[0] + (m[1] - away[1]) * p[1] < 0) p = [-p[0], -p[1]];
  return [m[0] + p[0] * len * k, m[1] + p[1] * len * k];
}
const f4 = v => v.toFixed(4);
const pt = p => `${f4(p[0])} ${f4(p[1])}`;
const lerp2 = (A, B, k) => [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k];
function drawCurl(sv, S, k) {
  if (!sv) return;
  const { P, Q, F, T, n, L } = S, cu = FLUTTER.curl * (0.8 + 0.6 * L), ro = FLUTTER.roll * L;
  const sz = Math.hypot(n[0], n[1]), nh = [n[0] / sz, n[1] / sz];
  const cosT = ((T[0] - F[0]) * nh[0] + (T[1] - F[1]) * nh[1]) / sz;
  const M = lerp2(P, Q, 0.5), tipIn = lerp2(T, M, ro);                  // the tip rolls back over the flap as it lifts
  const pull = [(M[0] - T[0]) * ro, (M[1] - T[1]) * ro];
  // the flap's free edges bow outward and roll over toward the tip (the cubic bows of the plain corner, as offsets)
  const perp = (A, B, away) => { const d = [B[0] - A[0], B[1] - A[1]], l = Math.hypot(d[0], d[1]) || 1; let p = [-d[1] / l, d[0] / l];
    const m = lerp2(A, B, .5); if ((m[0] - away[0]) * p[0] + (m[1] - away[1]) * p[1] < 0) p = [-p[0], -p[1]]; return [p, l]; };
  const [pT, lT] = perp(P, tipIn, Q), [pR, lR] = perp(Q, tipIn, P);
  const o1 = 0.35 * cu, o2 = 0.55 * cu * (1 + 1.5 * ro), aa = -P[0], bb = Q[1];
  const hOf = X => (X[0] - F[0]) * nh[0] + (X[1] - F[1]) * nh[1];
  // a point of the page's corner, carried onto the turned flap: over the fold, foreshortened, rolled and bowed
  const carry = (X, e, t) => {
    const h = hOf(X), tt = h / sz, s2 = h * cosT - h;
    const u = Math.max(0, Math.min(1, 1 - t / (e ? bb : aa))), g = 3 * u * (1 - u) * (1 - u) * o1 + 3 * u * u * (1 - u) * o2;
    const pp = e ? pR : pT, ll = e ? lR : lT;
    return [X[0] + nh[0] * s2 + pull[0] * tt * tt + pp[0] * g * ll, X[1] + nh[1] * s2 + pull[1] * tt * tt + pp[1] * g * ll];
  };
  // the torn outline inside the fold turns over with the flap
  const W = FRAYED, pts = W.pts;
  let i0 = -1, i1 = -1;
  for (let i = 0; i < pts.length; i++) if (hOf(pts[i]) > 0) { if (i0 < 0) i0 = i; i1 = i; }
  const cross = (A, B) => { const ha = hOf(A), hb = hOf(B), k2 = ha / (ha - hb); return lerp2(A, B, k2); };
  const q = n => sv.querySelector(n);
  let flap = '', shadow = '', fz = '', A = P, B = Q, hinge = bow(Q, P, T, cu * 0.5);
  if (i0 >= 0) {
    A = i0 > 0 ? cross(pts[i0 - 1], pts[i0]) : pts[i0];
    B = i1 < pts.length - 1 ? cross(pts[i1], pts[i1 + 1]) : pts[i1];
    hinge = bow(B, A, T, cu * 0.5);               // the hinge bows toward the corner: a curl, not a crease
    const run = [];
    for (let i = i0; i <= i1; i++) run.push(carry(pts[i], W.side[i], W.par[i]));
    const off = [-(0.05 + 0.1 * L) * sz - 0.01, (0.08 + 0.16 * L) * sz + 0.012];   // the shadow drifts and softens as it lifts
    const poly = (d = [0, 0]) => `M${pt([A[0] + d[0], A[1] + d[1]])} ` + run.map(p => `L${f4(p[0] + d[0])} ${f4(p[1] + d[1])}`).join(' ') +
      ` L${pt([B[0] + d[0], B[1] + d[1]])} Q${pt([hinge[0] + d[0], hinge[1] + d[1]])} ${pt([A[0] + d[0], A[1] + d[1]])} Z`;
    flap = poly(); shadow = poly(off);
    fz = `M${pt(A)} ` + run.map(p => 'L' + pt(p)).join(' ') + ` L${pt(B)}`;
  }
  // loose fibers ride the flap when their root is inside the fold, otherwise they stay on the page
  const fib = W.fibers.map(f => {
    const q3 = hOf(f.pts[0]) > 0 ? f.pts.map(p => carry(p, f.e, f.t)) : f.pts;
    return `M${pt(q3[0])} Q${pt(q3[1])} ${pt(q3[2])}`;
  }).join(' ');
  const rev = `M${pt(A)} L${pt(P)} L0 0 L${pt(Q)} L${pt(B)} Q${pt(hinge)} ${pt(A)} Z`;
  // the roll's crest: a soft highlight across the flap where it turns over
  const c0 = lerp2(P, tipIn, 0.55 + 0.2 * (1 - L)), c1 = lerp2(Q, tipIn, 0.55 + 0.2 * (1 - L));
  const crest = flap ? `M${pt(c0)} Q${pt(bow(c0, c1, T, cu * 0.6))} ${pt(c1)}` : '';
  q('.rev').setAttribute('d', rev);
  q('.csh').setAttribute('d', shadow);
  q('.csh').setAttribute('opacity', (FLUTTER.shadow * (1 - 0.4 * L) * Math.min(1, sz / 0.25)).toFixed(3));
  q('#cb' + k + ' feGaussianBlur').setAttribute('stdDeviation', f4(FLUTTER.blur[0] + (FLUTTER.blur[1] - FLUTTER.blur[0]) * L));
  q('.flap').setAttribute('d', flap);
  q('.fz').setAttribute('d', fz);
  q('.crest').setAttribute('d', crest);
  q('.crest').setAttribute('stroke-opacity', (0.15 + 0.5 * L).toFixed(3));
  q('.hl').setAttribute('d', flap ? `M${pt(B)} Q${pt(hinge)} ${pt(A)}` : '');
  q('.fib').setAttribute('d', fib);
  const g = q('#cg' + k), r = q('#cr' + k);
  const H = [(hinge[0] + M[0]) / 2, (hinge[1] + M[1]) / 2];
  g.setAttribute('x1', f4(H[0])); g.setAttribute('y1', f4(H[1])); g.setAttribute('x2', f4(tipIn[0])); g.setAttribute('y2', f4(tipIn[1]));
  r.setAttribute('x1', f4(H[0])); r.setAttribute('y1', f4(H[1])); r.setAttribute('x2', '0'); r.setAttribute('y2', '0');
}


const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const U = n => `calc(var(--u) * ${+(+n).toFixed(4)})`;
const pad2 = n => String(n).padStart(2, '0');
const K = 0.738;            // dx/dy of the roof stroke, 53.6 degrees from horizontal
const LOGO = { x0: 5.58, y0: 4.68, w: 346.7, h: 512 };   // the A over MANDEL mark, cropped to its ink (svg units)
const RM = matchMedia('(prefers-reduced-motion: reduce)');

function mount(o) {
  const BL = o.borderLeft || 1.4;          // border clears the 1 in binding and the side ruler
  /* round 2 (9/30/26): the v2 geometry for every variation, not overridable.
     Sidebar from the 32 1/2 line, the lockup fills it between the text margins,
     and the upper right corner follows the concave sweep of the logo's roof stroke. */
  const tbx = 32.5;
  const TXL = tbx + 0.3, TXR = 35.5 - 0.3;                         // equal margins left and right (André 10/1)
  const LK = (TXR - TXL) / LOGO.w;                                  // the logo is centered and spans the text margins
  const lock = { x: TXL, y: 0.8, w: LOGO.w * LK };
  const gap = 0.3;
  /* the roof stroke's outer edge, fitted to the logo's ink (svg units, good to about 1.5): the corner follows it */
  const ENV = py => { const y = py + LOGO.y0; return 52.1183 + 0.090375 * y + 0.00132779 * y * y - LOGO.x0; };
  const CUT = py => [lock.x + ENV(py) * LK + gap, lock.y + py * LK];
  let PY0 = (0.5 - lock.y) / LK, PY1 = PY0;
  while (CUT(PY1)[0] < 35.5 && PY1 < 700) PY1 += 0.25;
  const V1 = CUT(PY0), V2 = [35.5, CUT(PY1)[1]];
  const cutX = y => y <= V1[1] ? V1[0] : y >= V2[1] ? 35.5 : CUT((y - lock.y) / LK)[0];
  const lockBottom = lock.y + LOGO.h * LK;
  const FB = o.fieldBottom || 23.5;
  const R = o.radius != null ? o.radius : 0.3;

  /* views of the cartoon sheet, fitted to the field */
  const fx0 = BL, fx1 = tbx, avail = fx1 - fx0 - 1.0;
  const colw = Math.max(4.6, avail * 0.19), vgap = 1.3, mainw = avail - colw - vgap;
  const vh = FB - 8.3, vy = 3.8;
  const views = [
    { t: 'Level 1 plan', s: '3/16 in = 1 ft', x: fx0 + 0.5, y: vy, w: mainw, h: vh },
    { t: 'Key plan', s: 'Not to scale', x: fx0 + 0.5 + mainw + vgap, y: vy, w: colw, h: Math.min(3.2, vh * 0.24) },
  ];
  views.push({ t: 'Plan notes', s: 'General', x: views[1].x, y: vy + views[1].h + 1.5, w: colw, h: vh - views[1].h - 1.5 });

  const c = {
    S: SET, sh: SET.sheet, N: SET.count, i: SET.index, esc, U, pad2, K, BL, tbx, gap, lock, lockBottom, V1, V2, FB, views,
    cutX, TXL, TXR, tbw: 35.5 - tbx,
    iss: SET.issuances.slice().reverse(),
    qr: cls => `<svg class="qr ${cls || ''}" viewBox="0 0 ${QR.size} ${QR.size}" shape-rendering="crispEdges" role="img" aria-label="QR code for the living set"><rect width="${QR.size}" height="${QR.size}"/><path d="${QR.d}"/></svg>`,
    cells: s => [...s].map(ch => `<span class="fc${ch === '.' ? ' pt' : ''}">${ch}</span>`).join(''),
    lockImg: (style, cls) => `<img class="lock ${cls || ''}" src="${SET.marks.lockup}" alt="André Mandel" width="347" height="512" style="${style}">`,
  };
  c.f = frags(c);

  /* frame: border with the corner cut, the rule, and the true inch ruler */
  function curvePts() {
    const pts = [];
    for (let py = PY0; py <= PY1; py += 2) pts.push(CUT(py));
    pts.push(CUT(PY1));
    return pts;
  }
  function borderPath() {
    const r = 0.34, f = n => +n.toFixed(4), pts = curvePts();
    const sIn = pts.findIndex(p => Math.hypot(p[0] - V1[0], p[1] - V1[1]) >= r);
    let sOut = pts.length - 1; while (sOut > 0 && Math.hypot(pts[sOut][0] - V2[0], pts[sOut][1] - V2[1]) < r) sOut--;
    const body = pts.slice(sIn, sOut + 1).map(p => `L${f(p[0])} ${f(p[1])}`).join(' ');
    return `M${f(BL + R)} 0.5 H${f(V1[0] - r)} Q${f(V1[0])} 0.5 ${f(pts[sIn][0])} ${f(pts[sIn][1])} ${body} ` +
      `Q35.5 ${f(V2[1])} 35.5 ${f(V2[1] + r)} ` +
      `V${23.5 - R} Q35.5 23.5 ${35.5 - R} 23.5 H${BL + R} Q${BL} 23.5 ${BL} ${23.5 - R} V${0.5 + R} Q${BL} 0.5 ${BL + R} 0.5 Z`;
  }

  function frame() {
    let t = '', z = '';
    const L = n => n % 6 === 0 ? 0.18 : 0.09;
    for (let x = 2; x <= 35; x++) {                      // x = 0 is the left paper edge; 0 and 1 sit in the binding
      const cl = x % 6 === 0 ? 'tk l' : 'tk';
      t += `<line class="${cl}" x1="${x}" y1="0" x2="${x}" y2="${L(x)}"/><line class="${cl}" x1="${x}" y1="24" x2="${x}" y2="${24 - L(x)}"/>`;
      z += `<span class="zl" style="left:${U(x)};top:${U(0.3)}">${x}</span><span class="zl" style="left:${U(x)};top:${U(23.7)}">${x}</span>`;
    }
    for (let y = 1; y <= 23; y++) {
      const cl = y % 6 === 0 ? 'tk l' : 'tk';
      t += `<line class="${cl}" x1="1" y1="${y}" x2="${1 + L(y) * 0.7}" y2="${y}"/><line class="${cl}" x1="36" y1="${y}" x2="${36 - L(y)}" y2="${y}"/>`;
      z += `<span class="zl" style="left:${U(1.24)};top:${U(y)}">${y}</span><span class="zl" style="left:${U(35.68)};top:${U(y)}">${y}</span>`;
    }
    let bd = '';
    if (o.border === 'none') bd = '';
    else if (o.border === 'marks') {
      const m = 0.45;
      bd = `<path class="bd" d="M${BL} ${0.5 + m} V0.5 H${BL + m} M${BL} ${23.5 - m} V23.5 H${BL + m} M${35.5 - m} 23.5 H35.5 V${23.5 - m} M${V1[0] - m} 0.5 H${V1[0]} ${curvePts().map(p => `L${+p[0].toFixed(4)} ${+p[1].toFixed(4)}`).join(' ')} V${V2[1] + m}"/>`;
    } else bd = `<path class="bd" d="${borderPath()}"/>`;
    let vr = '';
    if (o.rule !== false) {
      const y0 = o.ruleFrom != null ? o.ruleFrom : 0.5, y1 = o.ruleTo != null ? o.ruleTo : 23.5;
      vr = `<line class="vr" x1="${tbx}" y1="${y0}" x2="${tbx}" y2="${y1}"/>`;
    }
    return `<svg class="frame" viewBox="0 0 36 24" preserveAspectRatio="none" aria-hidden="true">${bd}${vr}${t}</svg>${z}`;
  }

  /* weathered paper: foxing, a whisper of graphite, long construction lines past the drawings */
  function weather() {
    const fox = [[5.2, 20.6, .34], [28.6, 2.2, .2], [14.6, 1.3, .14], [33.6, 21.7, .3], [22.4, 17.6, .11], [9.4, 7.8, .09], [30.2, 12.4, .16]];
    const m = views[0], k = views[1];
    const cl = o.construction === false ? '' : [
      `<line class="cl" x1="1.1" y1="${m.y}" x2="35.8" y2="${m.y}"/>`,
      `<line class="cl w" x1="1.1" y1="${m.y + m.h}" x2="${tbx + 1.2}" y2="${m.y + m.h}"/>`,
      `<line class="cl" x1="${m.x}" y1="0.15" x2="${m.x}" y2="23.85"/>`,
      `<line class="cl w" x1="${m.x + m.w}" y1="1.6" x2="${m.x + m.w}" y2="23.2"/>`,
      `<line class="cl w" x1="${k.x}" y1="0.3" x2="${k.x}" y2="${m.y + m.h + 0.9}"/>`,
      `<line class="cl w" x1="1.1" y1="${m.y + m.h * 0.42}" x2="${m.x + m.w + 0.8}" y2="${m.y + m.h * 0.42}"/>`
    ].join('');
    return `<svg class="weather" viewBox="0 0 36 24" preserveAspectRatio="none" aria-hidden="true">
      <defs><radialGradient id="fx"><stop offset="0" stop-color="rgb(150,112,64)" stop-opacity=".09"/><stop offset=".55" stop-color="rgb(150,112,64)" stop-opacity=".04"/><stop offset="1" stop-color="rgb(150,112,64)" stop-opacity="0"/></radialGradient>
      <filter id="gb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".35"/></filter></defs>
      ${fox.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#fx)"/>`).join('')}
      <ellipse cx="12.5" cy="21.2" rx="3.4" ry=".42" fill="#55524c" opacity=".045" filter="url(#gb)" transform="rotate(-3 12.5 21.2)"/>
      <ellipse cx="25.8" cy="2.9" rx="1.6" ry=".3" fill="#55524c" opacity=".035" filter="url(#gb)" transform="rotate(4 25.8 2.9)"/>
      ${cl}</svg>`;
  }

  /* cartoon field */
  const FX = x => x - BL, FY = y => y - 0.5;
  function noteHTML(n, w, h, d) {
    const gx = 0.14 / w, sx = n.a === 'r' ? n.t[0] + gx : n.t[0] - gx, sy = n.t[1], [px, py] = n.p;
    const cx = sx + (px - sx) * 0.18, cy = sy + (py - sy) * 0.85;
    const P = v => +(v * 100).toFixed(3), X = v => +(v * w).toFixed(4), Y = v => +(v * h).toFixed(4);
    return `<svg class="ld" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true" style="--d:${d}"><path pathLength="1" d="M${X(sx)} ${Y(sy)} Q${X(cx)} ${Y(cy)} ${X(px)} ${Y(py)}"/></svg>
      <span class="note${n.a === 'r' ? ' r' : ''}" style="left:${P(n.t[0])}%;top:${P(n.t[1])}%;--d:${d}">${esc(n.text)}</span>
      <span class="dot" style="left:${P(px)}%;top:${P(py)}%;--d:${d}"></span>`;
  }
  function field() {
    let d = 0, h = '';
    views.forEach((v, k) => {
      let nh = '';
      SET.sheet.notes.filter(n => n.v === k).forEach(n => { nh += noteHTML(n, v.w, v.h, d); d += 520; });
      h += `<div class="view" style="left:${U(FX(v.x))};top:${U(FY(v.y))};width:${U(v.w)};height:${U(v.h)}"><div class="box"></div>${nh}
        <div class="vt"><span class="vn">${k + 1}</span><span class="vtt"><b>${esc(v.t)}</b><i>${esc(v.s)}</i></span></div></div>`;
    });
    const H = SET.header, sh = SET.sheet, i = SET.index, N = SET.count;
    const ticks = Array.from({ length: N }, (_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"><b></b></i>`).join('');
    const head = `<header class="rt"><h1>${esc(H.title)}</h1>${H.lines.map((l, k) => `<p${k ? ' class="r2"' : ''}>${esc(l)}</p>`).join('')}</header>`;
    const foot = `<footer class="rb" style="padding-right:${U(0.6 + (o.footRight || 0))}">
      <div class="ticks" aria-label="Sheet ${i + 1} of ${N}">${ticks}<span>${pad2(i + 1)} / ${pad2(N)}</span></div>
      <h2 class="shot">${esc(sh.foot)}</h2><p class="shotline">${esc(sh.cap)}</p>
      <ul class="rdata">${sh.data.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="act"><button type="button" class="btn" title="The sheet index lives on A0.1">Sheet index</button></div></footer>`;
    return `<div class="field" style="left:${U(BL)};top:${U(0.5)};width:${U(fx1 - BL)};height:${U(FB - 0.5)}">${head}${h}${foot}</div>`;
  }


  /* build */
  document.title = `${o.no} · ${o.name}`;
  const stage = document.getElementById('stage');
  const sheet = document.createElement('section');
  sheet.className = 'sheet ' + (o.cls || '');
  sheet.dataset.v = o.no;
  const tbHTML = o.tb ? o.tb(c) : '';
  const lockHTML = o.lockHidden ? '' : c.lockImg(`left:${U(lock.x)};top:${U(lock.y)};width:${U(lock.w)}`, o.lockCls);
  const ovSVG = o.svg ? `<svg viewBox="0 0 36 24" preserveAspectRatio="none" aria-hidden="true">${o.svg(c)}</svg>` : '';
  sheet.innerHTML = `<div class="paper">${weather()}${frame()}${field()}
    <div class="ov">${ovSVG}${o.ov ? o.ov(c) : ''}</div>
    <aside class="tb" aria-label="Title block" style="left:${U(tbx)};top:${U(0.5)};width:${U(35.5 - tbx)};height:${U(23)}">${tbHTML}</aside>
    ${lockHTML}
    ${(() => { const B = o.binding || {}; const ys = B.rivets || [3, 9, 15, 21];
      return `<div class="bindg ${B.cls || ''}" aria-hidden="true">${ys.map(y => `<i class="rv" style="top:${U(y)}"></i>`).join('')}${B.spine ? `<span class="spine">${esc(B.spine)}</span>` : ''}${B.extra || ''}</div>`; })()}
    ${curlSVG(0)}</div>`;
  stage.appendChild(sheet);
  if (o.after) o.after(c, sheet);

  /* layout */
  const root = document.documentElement;
  let u = 46;
  function layout() {
    const W = innerWidth, H = innerHeight, mob = W <= 760;
    if (mob) { u = (W - 8) / 36; root.style.setProperty('--fl', '0'); }
    else { u = Math.max(8, Math.min((W - 28) / 36, (H - 28) / 24)); root.style.removeProperty('--fl'); }
    u = Math.floor(u * 100) / 100;
    root.style.setProperty('--u', u + 'px');
    stage.style.left = Math.round((W - 36 * u) / 2) + 'px';
    stage.style.top = (mob ? 8 : Math.round(Math.max(8, (H - 24 * u) / 2))) + 'px';
    document.getElementById('desk').style.minHeight = mob ? (24 * u + 40) + 'px' : '';
    sheet.querySelectorAll('.ld').forEach(sv => {
      const vb = sv.viewBox.baseVal, r = sv.getBoundingClientRect();
      if (vb && vb.width && r.width) sv.querySelector('path').style.strokeWidth = (1.05 * vb.width / r.width).toFixed(4) + 'px';
    });
    if (!mob) fit();
    if (o.layout) o.layout(c, sheet, u);
  }
  // if a small window makes the screen floors too tall, ease them down until the block fits
  function fit() {
    const tb = sheet.querySelector('.tb');
    let fl = 1;
    const over = () => { const r = tb.getBoundingClientRect(); let m = 0; tb.querySelectorAll('*').forEach(e => { if (e.closest('.nofit')) return; const q = e.getBoundingClientRect(); if (q.height) m = Math.max(m, q.bottom - r.bottom); }); return m > 1; };
    while (over() && fl > 0.55) { fl -= 0.05; root.style.setProperty('--fl', fl.toFixed(2)); }
  }
  addEventListener('resize', layout);
  layout();

  /* the breeze, as on the living set: gusts and still spells, the frayed flap turning over */
  const sv = sheet.querySelector('.curl');
  const br = { t0: performance.now(), last: 0, raf: 0, L: 0, frozen: false };
  function frameLoop(now) {
    br.raf = 0; if (document.hidden || RM.matches || br.frozen) { br.last = 0; return; }
    const t = (now - br.t0) / 1000, dt = br.last ? Math.min(0.1, (now - br.last) / 1000) : 1 / 60;
    br.last = now; br.L = stepLift(br.L, t, dt); drawCurl(sv, curlShape(t, br.L), 0);
    br.raf = requestAnimationFrame(frameLoop);
  }
  const startBreeze = () => { if (!br.raf && !RM.matches && !br.frozen) br.raf = requestAnimationFrame(frameLoop); };
  drawCurl(sv, curlShape(0, 0), 0);
  document.addEventListener('visibilitychange', startBreeze);
  window.__breeze = s => { br.frozen = true; cancelAnimationFrame(br.raf); br.raf = 0; let L = 0; for (let t = 0; t < s; t += 1 / 60) L = stepLift(L, t, 1 / 60); drawCurl(sv, curlShape(s, L), 0); return L; };
  window.__kit = c;

  addEventListener('beforeprint', () => sheet.classList.remove('play'));
  const go = () => { layout(); if (!RM.matches) { void sheet.offsetWidth; sheet.classList.add('play'); } startBreeze(); };
  (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]) : Promise.resolve()).then(go);
}

/* ready made pieces of a title block; variations restyle or ignore them */
function frags(c) {
  const S = c.S, P = S.project, F = S.firm, sh = c.sh, e = c.esc;
  const L = (o, d) => o && o.lab === false ? '' : `<span class="lab">${e((o && o.lab) || d)}</span>`;
  return {
    firm: o => `<div class="sec s-firm">${L(o, 'Designer')}<div class="fname">${e(F.name)}</div><span class="val line">${e(F.line)}</span>${F.addr.map(a => `<span class="val line">${e(a)}</span>`).join('')}<span class="val line">${e(F.phone)}</span><span class="val line">${e(F.email)}</span></div>`,
    project: o => `<div class="sec s-proj">${L(o, 'Project')}<div class="pname">${e(P.name)}</div>
      <span class="val line">${e(P.site)}</span><span class="val line">${e(P.street)}</span><span class="val line">${e(P.city)} · ${e(P.county)}</span>
      <span class="val line"><span class="il">APN</span>${e(P.apn)}</span><span class="val line"><span class="il">Zoning</span>${e(P.zoning)}</span>
      <span class="val line"><span class="il">Owner</span>${e(P.owner)}</span><span class="val line">${e(P.ownerCo)}</span></div>`,
    issued: o => `<div class="sec s-iss">${L(o, 'Issued')}<ol class="iss">${c.iss.map((r, k) => `<li class="${k === 0 ? 'new' : ''}"><span class="n">${r.no}</span><span class="d">${e(r.date)}</span><span class="w">${e(r.for)}</span></li>`).join('')}</ol></div>`,
    permits: o => `<div class="sec s-perm">${L(o, 'Agency and permits')}${S.permits.map(p => `<span class="val line">${e(p.tb)} <span class="pend">${e(p.v)}</span></span>`).join('')}<span class="val line">${e(S.fire)}</span></div>`,
    stamp: o => '',
    title: o => `<div class="sec s-title">${L(o, 'Sheet title')}<div class="stitle">${e(sh.title)}</div>
      <div class="meta"><span><span class="il">Scale</span>${e(sh.scale)}</span><span><span class="il">Date</span>${e(S.date)}</span><span><span class="il">Drawn</span>${e(S.drawnBy)}</span></div>
      <div class="status">${e(S.status)}</div></div>`,
    number: o => `<div class="sec s-num">${L(o, `Sheet ${c.i + 1} of ${c.N}`)}<div class="sn" aria-label="Sheet ${sh.id}">${c.cells(sh.id)}</div></div>`,
    live: o => `<div class="sec s-live tlive">${c.qr()}<div class="lt"><span class="lab">${e(S.live.label)}</span>${S.live.show.map(l => `<span class="url">${e(l)}</span>`).join('')}</div></div>`,
    colo: o => `<div class="sec s-colo colo">${o && o.firm ? `<b>${e(F.name)}</b> · <i>${e(F.line)}</i>. ${F.addr.map(e).join(', ')} · ${e(F.phone)} · ${e(F.email)}. ` : ''}${e(S.copy)}</div>`,
  };
}

window.KIT = { SET, mount, esc, U };
})();
