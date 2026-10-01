/* ================================================================
   ANDRÉ MANDEL · LIVING SET ENGINE v1.0 (10/1/26)
   Lifted from the Walsh Residence living set (walsh/set/v2.html, commit cb385c2) so any project can wear it.
   The engine is project agnostic: everything it says about a project comes from window.SET (project.js), every
   drawing from window.DRAWINGS (draw/drawings.js), every crew layer from LIVING_SHEETS and LIVING_OVERLAYS.
   Do not put project words in this file. See FRAMEWORK.md.
   ================================================================ */
const SET = window.SET;
if (!SET || !Array.isArray(SET.sheets)) throw new Error('Living Set: window.SET is missing. Load project.js before engine/living-set.js.');
const QR = SET.qr && SET.qr.d ? SET.qr : { size: 21, d: '' };
/* ================================================================
   THE CORNER IN THE BREEZE. Named so the email GIF can match it.
   The top right corner of every sheet folds back along a line near
   the logo's roof angle and lifts on an irregular loop.
   ================================================================ */
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
Object.assign(FLUTTER, (SET.tune || {}).flutter || {});
/* labels the engine prints that are not project facts, all overridable in SET.kit */
const KIT = Object.assign({
  docTitle: (SET.project && SET.project.name ? SET.project.name.replace(/ Residence$/, '') : 'Project') + ' Living Set',
  modelButtons: [['toModel', 'Enter the model'], ['toInfo', 'Project package']],
  conventions: 'A living set. The drawings are cut from the model at true scale; dashed boxes hold views to come; handwritten notes carry design intent.',
  gcPlaceholder: '',
  stampLabel: 'AGENCY STAMP'
}, SET.kit || {});


/* ================================================================ */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const U = n => `calc(var(--u) * ${+n.toFixed(4)})`;
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const MQ = matchMedia('screen and (max-width:760px), screen and (max-aspect-ratio:1/1) and (max-width:1100px)');
/* team sheets (9/30): each crew registers sheets in sheets/<team>.js with LIVING_SHEETS.push({ id, group, title, ..., html(ctx) });
   a sheet with an existing id replaces it, new ids slot in by group, then by sheet number */
(function mergeTeamSheets() {
  const add = (window.LIVING_SHEETS || []).filter(t => t && t.id);
  add.forEach(t => {
    const k = SET.sheets.findIndex(s => s.id === t.id);
    const sh = Object.assign({ issued: [4], scale: 'As noted' }, t, t.html ? { kind: 'html' } : {});
    if (k >= 0) SET.sheets[k] = Object.assign({}, SET.sheets[k], sh); else SET.sheets.push(sh);
  });
  const gi = g => { const i = SET.groups.indexOf(g); return i < 0 ? 99 : i; };
  const num = id => id.replace(/^[A-Z]+/, '').split('.').map(Number);
  const pre = id => id.match(/^[A-Z]+/)[0];
  SET.sheets.sort((a, b) => gi(a.group) - gi(b.group) || (pre(a.id) < pre(b.id) ? -1 : pre(a.id) > pre(b.id) ? 1 : 0) ||
    num(a.id)[0] - num(b.id)[0] || (num(a.id)[1] || 0) - (num(b.id)[1] || 0));
})();
const SHEETS = SET.sheets;
const N = SHEETS.length;
const pad2 = n => String(n).padStart(2, '0');

/* border geometry: a 1 in binding, the border clears it at x 1.25; the upper right corner is cut on the roof stroke angle */
const BL = 1.25;                     // border left
const K = 0.738;                     // dx/dy of the roof stroke (53.6 degrees from horizontal)
const TBX = 32.5;                                       // sidebar from the 32 1/2 line, 3 in wide (André 9/30)
const TXL = TBX + 0.3, TXR = 35.5 - 0.22;               // the sidebar's text margins
/* the lockup fills the sidebar at its old size; MANDEL (lockup px 26 to 352, center 189) sits centered between the
   sidebar's two vertical lines, the 32 1/2 rule and the border at 35 1/2, the mark rides along (André 10/1) */
const LK = (TXR - TXL) / 346;                           // inches per lockup px
const LOCK = { x: (TBX + 35.5) / 2 - 189 * LK, y: 0.74, w: 357 * LK };
const LOCK_BOTTOM = LOCK.y + 520 * LK;
/* the corner follows the roof stroke's concave sweep: its right edge, measured off the lockup, is
   x = 53.38 + 0.0741 y + 0.001358 y^2 (lockup px, good to about 4 px), offset outward by GAP */
const GAP = 0.3;
const ENV = py => 53.38 + 0.0741 * py + 0.001358 * py * py;
const CUT = py => [LOCK.x + ENV(py) * LK + GAP, LOCK.y + py * LK];
function cutSpan() {
  let a = (0.5 - LOCK.y) / LK, b = a;                     // top of the border
  while (CUT(b)[0] < 35.5 && b < 700) b += 0.25;          // down to the right border
  return [a, b];
}
const [PY0, PY1] = cutSpan();
const V1 = CUT(PY0), V2 = [35.5, CUT(PY1)[1]];
function borderPath() {
  const R = 0.3, r = 0.34, f = n => +n.toFixed(4);
  // sample the curve, easing off a fillet at each end
  const pts = [];
  const lenAt = [];
  for (let py = PY0; py <= PY1; py += 2) pts.push(CUT(py));
  pts.push(CUT(PY1));
  const sIn = pts.findIndex(p => Math.hypot(p[0] - V1[0], p[1] - V1[1]) >= r);
  let sOut = pts.length - 1; while (sOut > 0 && Math.hypot(pts[sOut][0] - V2[0], pts[sOut][1] - V2[1]) < r) sOut--;
  const body = pts.slice(sIn, sOut + 1).map(p => `L${f(p[0])} ${f(p[1])}`).join(' ');
  return `M${f(BL + R)} 0.5 H${f(V1[0] - r)} Q${f(V1[0])} 0.5 ${f(pts[sIn][0])} ${f(pts[sIn][1])} ${body} ` +
    `Q35.5 ${f(V2[1])} 35.5 ${f(V2[1] + r)} ` +
    `V${23.5 - R} Q35.5 23.5 ${35.5 - R} 23.5 H${BL + R} Q${BL} 23.5 ${BL} ${23.5 - R} V${0.5 + R} Q${BL} 0.5 ${BL + R} 0.5 Z`;
}

/* the ruler: a mark at every inch measured from the paper's edges (x 0 at the left edge, y 0 at the top), numbered by
   the inch, every 6th mark longer. Nothing lands in the binding (x 1 and less), on a rounded corner or in the corner cut. */
const RULER = {
  top: x => x >= 2 && x <= 35 && x < V1[0] - 0.4,
  bottom: x => x >= 2 && x <= 35,
  left: y => y >= 1 && y <= 23,
  right: y => y >= 1 && y <= 23 && y > V2[1] + 0.4,
  len: n => n % 6 === 0 ? 0.24 : 0.12,     // top, bottom and right margins
  lenL: n => n % 6 === 0 ? 0.13 : 0.07     // the left margin is a quarter inch between binding and border
};
function frameSVG() {
  let t = '';
  for (let x = 1; x <= 35; x++) {
    const L = RULER.len(x);
    if (RULER.top(x)) t += `<line class="tk${x % 6 ? '' : ' lg'}" data-ax="x" data-v="${x}" x1="${x}" y1="${0.5 - L}" x2="${x}" y2="0.5"/>`;
    if (RULER.bottom(x)) t += `<line class="tk${x % 6 ? '' : ' lg'}" data-ax="x" data-v="${x}" x1="${x}" y1="23.5" x2="${x}" y2="${23.5 + L}"/>`;
  }
  for (let y = 1; y <= 23; y++) {
    if (RULER.left(y)) t += `<line class="tk${y % 6 ? '' : ' lg'}" data-ax="y" data-v="${y}" x1="${BL - RULER.lenL(y)}" y1="${y}" x2="${BL}" y2="${y}"/>`;
    if (RULER.right(y)) t += `<line class="tk${y % 6 ? '' : ' lg'}" data-ax="y" data-v="${y}" x1="35.5" y1="${y}" x2="${35.5 + RULER.len(y)}" y2="${y}"/>`;
  }
  return `<svg class="frame" viewBox="0 0 36 24" preserveAspectRatio="none" aria-hidden="true">
    <path class="bd" d="${borderPath()}"/>
    <line class="vr" x1="${TBX}" y1="0.5" x2="${TBX}" y2="23.5"/>
    ${t}</svg>`;
}

// ruler numbers: centered past the mark on the top and bottom, just below the mark down the sides
function rulerLabels() {
  let h = '';
  const lab = (ax, v, x, y) => `<span class="zl${v % 6 ? '' : ' lg'}" data-ax="${ax}" data-v="${v}" style="left:${U(x)};top:${U(y)}">${v}</span>`;
  for (let x = 1; x <= 35; x++) {
    if (RULER.top(x)) h += lab('x', x, x, 0.16);
    if (RULER.bottom(x)) h += lab('x', x, x, 23.84);
  }
  for (let y = 1; y <= 23; y++) {
    if (RULER.left(y)) h += lab('y', y, 1.125, y + 0.14);
    if (RULER.right(y)) h += lab('y', y, 35.74, y + 0.14);
  }
  return h;
}

function paperTexture() { return '<div class="tex" aria-hidden="true"></div>'; }

function bindingHTML() {
  return `<div class="bindg" aria-hidden="true">${[4, 12, 20].map(y => `<i class="rv" style="top:${U(y)}"></i>`).join('')}</div>`;
}

/* ================================================================ the frayed corner
   One torn outline in corner inches (the sheet's top right corner at 0,0, the page toward x<0, y>0), seeded so every
   sheet and every print agree. The page, the flap in the breeze and print all draw this same outline. */
const FRAY = {
  reach: 2.8,     // inches along each edge that the tear runs from the corner
  depth: 0.105,   // inches, the deepest deckle, near the corner
  step: 0.016,    // inches between outline samples
  bite: 0.045,    // inches, the very corner worn away
  fibers: 22,     // loose fibers standing off the tear
  seed: SET.seed || 235
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

/* ================================================================ every sheet its own wear (André 10/1/26)
   Seeded by sheet index, so a sheet ages the same way on every visit. Eight aging layers (baked at idle, see
   bakeVariant) in four orientations give 32 looks; neighbors never share one. Some sheets carry a small deckle tear
   low on the bottom or outer edge, and a few ruler numbers have worn off. Screen only: print stays clean. */
const WEAR = { variants: 8, tear: 0.42, worn: [1, 5] };
const seeded = s => { s = (s * 2654435761 + 97) >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };   // mulberry32
function edgeTearSVG(r) {
  const f = v => +v.toFixed(4);
  // bottom edge (x along the sheet) or outer right edge (y along it); never near the top right corner
  const bottom = r() < 0.62, len = 0.7 + 0.7 * r(), at = bottom ? 4 + 25 * r() : 8 + 13 * r(), depth = 0.06 + 0.06 * r();
  const pts = [], n = Math.round(len / 0.014);
  const nk = 0.3 + 0.4 * r(), ph = r() * 9;
  for (let k = 0; k <= n; k++) {
    const t = k / n, env = Math.pow(Math.sin(Math.PI * t), 0.7);
    let d = depth * env * (0.7 + 0.2 * Math.sin(ph + t * 11) * Math.sin(ph * 1.7 + t * 5) + 0.1 * Math.sin(t * 61 + ph) + 0.06 * r());
    const bt = Math.max(0, 1 - Math.abs(t - nk) / 0.16); d += depth * 0.7 * bt * bt * (3 - 2 * bt);   // one deeper bite
    pts.push([t * len, Math.max(0, d)]);
  }
  // to sheet inches: along the edge, then in from it
  const map = bottom ? ([s, d]) => [at + s, 24 - d] : ([s, d]) => [36 - d, at + s];
  const P = pts.map(map), line = P.map((p, i) => (i ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1])).join(' ');
  const out = bottom ? `L${f(at + len)} 24.05 L${f(at)} 24.05 Z` : `L36.05 ${f(at + len)} L36.05 ${f(at)} Z`;
  // a short split running in from the deepest bite, a pale lip along one side of it
  const [bs, bd] = pts[Math.round(nk * n)], sl = 0.12 + 0.22 * r(), sa = (r() - 0.5) * 0.7;
  const s0 = map([bs, bd]), s1 = map([bs + Math.sin(sa) * sl, bd + Math.cos(sa) * sl]), sc = map([bs + Math.sin(sa) * sl * 0.5 + 0.02, bd + Math.cos(sa) * sl * 0.5]);
  const split = `M${f(s0[0])} ${f(s0[1])} Q${f(sc[0])} ${f(sc[1])} ${f(s1[0])} ${f(s1[1])}`;
  const lip = bottom ? `M${f(s0[0] + 0.012)} ${f(s0[1])} Q${f(sc[0] + 0.014)} ${f(sc[1])} ${f(s1[0] + 0.008)} ${f(s1[1])}` : `M${f(s0[0])} ${f(s0[1] + 0.012)} Q${f(sc[0])} ${f(sc[1] + 0.014)} ${f(s1[0])} ${f(s1[1] + 0.008)}`;
  let fib = '';
  for (let k = 0; k < 6; k++) {
    const p = P[Math.floor(r() * P.length)], l = 0.02 + 0.05 * r(), a = (r() - 0.5) * 1.6, o = bottom ? [0, 1] : [1, 0];
    const dx = o[0] * Math.cos(a) - o[1] * Math.sin(a), dy = o[0] * Math.sin(a) + o[1] * Math.cos(a);
    fib += `M${f(p[0])} ${f(p[1])} q${f(dx * l * 0.5 + dy * 0.01)} ${f(dy * l * 0.5 - dx * 0.01)} ${f(dx * l)} ${f(dy * l)}`;
  }
  return { bottom, at, len, svg: `<svg class="etear" viewBox="0 0 36 24" aria-hidden="true"><path class="tm" d="${line} ${out}"/><path class="te" d="${line}"/><path class="slh" d="${lip}"/><path class="sl" d="${split}"/><path class="fib" d="${fib}"/></svg>` };
}
function wearSheet(el, i) {
  const r = seeded(i + 1);
  // aging layer: variant and orientation; consecutive sheets always differ
  el.dataset.wear = i % WEAR.variants;
  const o = (Math.floor(i / WEAR.variants) + Math.floor(r() * 4)) % 4, tex = el.querySelector('.tex');
  if (tex && o & 1) tex.classList.add('fy');
  if (tex && o & 2) tex.classList.add('fx');
  // a small edge tear on some sheets
  let zl = [...el.querySelectorAll('.zl')];
  if (r() < WEAR.tear) {
    const T = edgeTearSVG(r);
    el.querySelector('.paper').insertAdjacentHTML('beforeend', T.svg);
    // the ruler numbers the tear runs through went with the paper
    zl.forEach(z => { const v = +z.dataset.v;
      if (T.bottom ? z.dataset.ax === 'x' && z.style.top.includes('23.84') && v > T.at - 0.5 && v < T.at + T.len + 0.5
                   : z.dataset.ax === 'y' && z.style.left.includes('35.74') && v > T.at - 0.6 && v < T.at + T.len + 0.4) z.classList.add('worn'); });
    zl = zl.filter(z => !z.classList.contains('worn'));
  }
  // a few ruler numbers worn away
  const n = WEAR.worn[0] + Math.floor(r() * (WEAR.worn[1] - WEAR.worn[0] + 1));
  for (let k = 0; k < n && zl.length; k++) zl.splice(Math.floor(r() * zl.length), 1)[0].classList.add('worn');
}

function qrSVG(cls) {
  return `<svg class="qr ${cls || ''}" viewBox="0 0 ${QR.size} ${QR.size}" shape-rendering="crispEdges" role="img" aria-label="QR code for the living set"><rect width="${QR.size}" height="${QR.size}"/><path d="${QR.d}"/></svg>`;
}

/* a note with a leader, inside a box of size w x h inches, positions as fractions */
function noteHTML(n, w, h, d) {
  const gx = 0.14 / w;
  const sx = n.a === 'r' ? n.t[0] + gx : n.t[0] - gx, sy = n.t[1];
  const [px, py] = n.p;
  const cx = sx + (px - sx) * 0.18, cy = sy + (py - sy) * 0.85;
  const P = v => +(v * 100).toFixed(3), X = v => +(v * w).toFixed(4), Y = v => +(v * h).toFixed(4);
  return `<svg class="ld" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true" style="--d:${d}"><path pathLength="1" d="M${X(sx)} ${Y(sy)} Q${X(cx)} ${Y(cy)} ${X(px)} ${Y(py)}"/></svg>
    <span class="note${n.a === 'r' ? ' r' : ''}" style="left:${P(n.t[0])}%;top:${P(n.t[1])}%;--d:${d};--nx:${P(n.t[0])}">${esc(n.text)}</span>
    <span class="dot" style="left:${P(px)}%;top:${P(py)}%;--d:${d}"></span>`;
}

function viewTitle(num, t, s) {
  return `<div class="vt"><span class="vn">${num}</span><span class="vtt"><b>${esc(t)}</b><i>${esc(s)}</i></span></div>`;
}

const FX = x => x - BL, FY = y => y - 0.5;   // sheet inches to field inches

function fieldCartoon(sh) {
  let d = 0, h = '';
  (sh.views || []).forEach((v, i) => {
    let nh = '';
    (sh.notes || []).filter(n => n.v === i).forEach(n => { nh += noteHTML(n, v.w, v.h, d); d += 520; });
    h += `<div class="view" style="left:${U(FX(v.x))};top:${U(FY(v.y))};width:${U(v.w)};height:${U(v.h)};--ar:${(v.w / v.h).toFixed(3)}">
      <div class="box"></div>${nh}${viewTitle(i + 1, v.t, v.s)}</div>`;
  });
  return h;
}

function sheetNotesFree(sh) {
  const notes = (sh.notes || []).filter(n => n.v === undefined);
  if (!notes.length) return '';
  const W = 31.25, H = 23;
  let d = 0;
  return `<div class="vfree">${notes.map(n => {
    const m = { ...n, t: [FX(n.t[0]) / W, FY(n.t[1]) / H], p: [FX(n.p[0]) / W, FY(n.p[1]) / H] };
    const s = noteHTML(m, W, H, d); d += 520; return s;
  }).join('')}</div>`;
}

function fieldModel() {
  return `<div class="model">
    <iframe data-src="${esc(SET.model.src)}" title="${esc(SET.project.name)} live model" allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer" loading="eager"></iframe>
    <img class="still" src="${esc(SET.model.still)}" alt="${esc(SET.project.name)} sketch model" loading="lazy">
  </div>`;
}

function fieldIndex(sh) {
  const P = SET.project, iss = SET.issuances, last = iss[iss.length - 1].no;
  const B = (x, y, w, inner, cls = '', st = '') => `<div class="blk ${cls}" style="left:${U(FX(x))};top:${U(FY(y))};width:${U(w)};${st}">${inner}</div>`;
  let rows = `<div class="trow si-t hd"><span>No.</span><span>Sheet</span><span>Scale</span>${iss.map(i => `<span class="c">${i.no}</span>`).join('')}</div>`;
  SET.groups.forEach(g => {
    const gs = SHEETS.filter(s => s.group === g);
    if (!gs.length) return;
    rows += `<div class="trow si-t gp"><span style="grid-column:1 / -1">${esc(g)}</span></div>`;
    gs.forEach(s => {
      rows += `<div class="trow si-t link" data-go="${s.id}" role="link" tabindex="0"><span class="n">${s.id}</span><span class="t">${esc(s.title)}</span><span class="sc">${esc(s.scale)}</span>${iss.map(i => `<span class="c">${(s.issued || []).includes(i.no) ? `<i class="idot${i.no === last ? ' new' : ''}"></i>` : ''}</span>`).join('')}</div>`;
    });
  });
  const pd = (SET.projectData || [
    ['Project', P.name], ['Site', P.site], ['Address', P.address], ['APN', P.apn], ['Zoning', P.zoning], ['Jurisdiction', P.county],
    ['Owner', [P.owner, P.ownerCo].filter(Boolean).join(', ')], ['Designer', SET.firm.signer || SET.firm.name],
    ...(SET.aor ? [[SET.aor.k, SET.aor.v]] : []),
    ...SET.permits.map(p => [p.k, [p.agency, p.v].filter(Boolean).join(' · ')]),
    ['Fire zone', SET.fire], ['Status', SET.status]
  ]).filter(r => r[1]).map(([k, v]) => `<div class="trow pd-t"><span class="k">${esc(k)}</span><span>${esc(v)}</span></div>`).join('');
  const isr = `<div class="trow is-t hd"><span>No.</span><span>Date</span><span>Issued for</span><span>Sheets</span></div>` +
    iss.slice().reverse().map(i => `<div class="trow is-t"><span class="n">${i.no}</span><span>${esc(i.date)}</span><span>${esc(i.for)}</span><span>${SHEETS.filter(s => (s.issued || []).includes(i.no)).length || ''}</span></div>`).join('');
  const legendNote = { text: 'a note in hand', t: [.6, .3], p: [.44, .62], a: 'l' };
  const legend = `<div class="legend-demo view" style="position:relative;width:${U(5.6)};height:${U(2.9)};--ar:1.93;margin-bottom:${U(1.2)}"><div class="box"></div>${noteHTML(legendNote, 5.6, 2.9, 400)}${viewTitle(1, 'View title', 'Scale')}</div>
    <p class="legend-p">${esc(KIT.conventions)}</p>`;
  return B(1.9, 3.8, 14.4, `<h2 class="h2">Sheet index</h2>${rows}`, '', `--ni:${iss.length}`) +
    B(17.6, 3.8, 13.8, `<h2 class="h2">Project data</h2>${pd}`) +
    B(17.6, 12.7, 6.4, `<h2 class="h2">Issuances</h2>${isr}`) +
    B(25.2, 12.7, 6.2, `<h2 class="h2">Conventions</h2>${legend}`) +
    sheetNotesFree(sh);
}

/* ================================================================ real drawings (9/30)
   Plans are vector (the model's own plan paths), elevations and sections are print resolution renders of the model.
   Everything sits at true scale: a view w inches wide on the sheet is w inches wide in print. */
const DRW = window.DRAWINGS || { sheets: {}, keys: {} };
const PC = v => +(v * 100).toFixed(3);
function lblHTML(l) {
  const k = l.k || 'room', cls = `lbl ${k}${l.hot ? ' hot' : ''}`;
  return `<span class="${cls}" style="left:${PC(l.p[0])}%;top:${PC(l.p[1])}%"><b>${esc(l.t)}</b>${l.s ? `<i>${esc(l.s)}</i>` : ''}</span>`;
}
function scaleBar(b) {
  const L = b.ft[b.ft.length - 1], w = L * b.sc;
  let r = '';
  for (let k = 1; k < b.ft.length; k++) r += `<rect x="${b.ft[k - 1] / L}" y="0" width="${(b.ft[k] - b.ft[k - 1]) / L}" height="1" class="${k % 2 ? 'on' : ''}"/>`;
  const labs = b.ft.map(v => `<span style="left:${PC(v / L)}%">${v}${v === L ? ' ft' : ''}</span>`).join('');
  return `<span class="gbar" style="width:${U(w)}"><svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">${r}</svg>${labs}</span>`;
}
function northArrow(n) {
  const a = DRW.north || 0;
  return `<div class="dnorth" style="left:${U(FX(n.x) - n.s / 2)};top:${U(FY(n.y) - n.s / 2)};width:${U(n.s)};height:${U(n.s)}" aria-label="North">
    <svg viewBox="-1 -1 2 2" aria-hidden="true"><circle r=".78"/><g transform="rotate(${a})"><path class="nd" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/><path class="nl" d="M0 .02 V.78"/></g></svg>
    <span style="left:${PC(.5 + .62 * Math.sin(a * Math.PI / 180))}%;top:${PC(.5 - .62 * Math.cos(a * Math.PI / 180))}%">N</span></div>`;
}
/* overlays (9/30): crews add layers on any sheet, e.g. grids, dimensions, room names, compliance tags, with
   LIVING_OVERLAYS.push({ id: 'A2.1', z: 4, html: ctx => '...' }); drawn in field inches like html sheets */
function overlaysFor(sh) {
  const ctx = { U, esc, viewTitle, noteHTML, FX, FY, SET, DRW, BL, TBX, sheet: sh, W: 31.25, H: 23, SHARED: window.SHARED || {} };
  return (window.LIVING_OVERLAYS || []).filter(o => o && o.id === sh.id).map(o => {
    try { return `<div class="fover" style="z-index:${o.z || 4}">${o.html(ctx) || ''}</div>`; } catch (e) { console.error('overlay', sh.id, e); return ''; }
  }).join('');
}
function fieldHTML(sh) {
  const ctx = { U, esc, viewTitle, noteHTML, FX, FY, SET, DRW, BL, TBX, sheet: sh, W: 31.25, H: 23 };
  let h = '';
  try { h = sh.html(ctx) || ''; } catch (e) { console.error('sheet', sh.id, e); h = ''; }
  return `<div class="fhtml">${h}</div>` + sheetNotesFree(sh);
}
function fieldDraw(sh) {
  const D = DRW.sheets[sh.id];
  let h = '';
  D.views.forEach(v => {
    const art = v.svg ? v.svg : `<img class="dimg" src="${esc(v.img)}" alt="${esc(sh.title)}" width="${v.px}" height="${v.py}" style="width:${PC(v.iw / v.w)}%;height:100%" decoding="async">`;
    const ov = v.ov ? `<svg class="dov" viewBox="0 0 ${v.w} ${v.h}" preserveAspectRatio="none" aria-hidden="true">${v.ov}</svg>` : '';
    h += `<div class="view dv" style="left:${U(FX(v.x))};top:${U(FY(v.y))};width:${U(v.w)};height:${U(v.h)};--ar:${(v.w / v.h).toFixed(4)}">${art}${ov}${(v.labels || []).map(lblHTML).join('')}</div>`;
  });
  (D.vt || []).forEach(t => { h += `<div class="dvt" style="left:${U(FX(t.x))};top:${U(FY(t.y))}">${viewTitle(t.n, t.t, t.s)}${t.bar ? scaleBar(t.bar) : ''}</div>`; });
  (D.keys || []).forEach(k => { h += `<div class="dkey" style="left:${U(FX(k.x))};top:${U(FY(k.y))};width:${U(k.w)}"><div class="kp" style="height:${U(k.w / (DRW.keyAr || 1.2))}">${DRW.keys[k.k] || ''}</div><span class="kc"><b>${esc(k.t)}</b><i>${esc(k.s)} · not to scale</i></span></div>`; });
  (D.tables || []).forEach(t => {
    h += `<div class="dtab" style="left:${U(FX(t.x))};top:${U(FY(t.y))};width:${U(t.w)}"><h3>${esc(t.title)}</h3><ul>${t.rows.map(([k, v]) => `<li><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></li>`).join('')}</ul>${t.foot ? `<p>${esc(t.foot)}</p>` : ''}</div>`;
  });
  if (D.north) h += northArrow(D.north);
  return h + sheetNotesFree({ notes: D.notes || [] });
}

/* the live site's header and footer, carried onto the sheet */
function siteHeader() {
  const H = SET.header;
  return `<header class="rt"><h1>${esc(H.title)}</h1>${H.lines.map((l, k) => `<p${k ? ' class="r2"' : ''}>${esc(l)}</p>`).join('')}</header>`;
}
function siteFooter(sh, i) {
  const ticks = SHEETS.map((s, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"><b></b></i>`).join('');
  const live = '';   // one QR on the sheet, in the title block (André 10/1)
  return `<footer class="rb">
    <div class="ticks" aria-label="Sheet ${i + 1} of ${N}">${ticks}<span>${pad2(i + 1)} / ${pad2(N)}</span></div>
    <h2 class="shot">${esc(sh.foot || sh.short || sh.title)}</h2>
    <p class="shotline">${esc(sh.cap || '')}</p>
    <ul class="rdata">${(sh.data || []).map((d, k) => `<li style="--k:${k}">${esc(d)}</li>`).join('')}</ul>
    <div class="act">${live}<div class="row">${sh.kind === 'model' ? KIT.modelButtons.map(([id, t]) => `<button type="button" class="btn" data-reel="${esc(id)}">${esc(t)}</button>`).join('') : ''}<button type="button" class="btn" data-panel>Sheet index</button></div></div>
  </footer>`;
}
function liveText() {
  return `<div class="lt"><span class="lab">${esc(SET.live.label)}</span>${SET.live.show.map(l => `<span class="url">${esc(l)}</span>`).join('')}</div>`;
}

function titleBlock(sh, i) {
  const F = SET.firm, P = SET.project, iss = SET.issuances;
  // newest on top, then ruled blank rows so the table holds 15 issuances without the sidebar moving (André 10/1)
  const ISS_ROWS = 15;
  const issRows = iss.slice().reverse().map((r, k, arr) => {
    const d = (arr.length - 1 - k) * 170 + 260;     // oldest (bottom) first, newest (top) last
    return `<li class="${k === 0 ? 'new' : ''}" style="--d:${d}">${k === 0 ? '<svg class="tick" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 5.5 L4 8.5 L9 1.5"/></svg>' : ''}<span class="n">${r.no}</span><span class="d">${esc(r.date)}</span><span>${esc(r.for)}</span></li>`;
  }).join('') + Array.from({ length: Math.max(0, ISS_ROWS - iss.length) }, () => '<li class="nil" aria-hidden="true"><span class="n"></span><span class="d"></span><span></span></li>').join('');
  // no sheet index here (André 9/30): it lives on A0.1 and behind the Sheet index button
  const lw = LOCK.w, lx = LOCK.x - TBX, ly = LOCK.y - 0.5, G = SET.gc;
  const gcLogo = G.logo ? `<img src="${esc(G.logo)}" alt="${esc(G.name)}">` : `<b>${esc(KIT.gcPlaceholder || String(G.name || 'GC').split(/\s+/)[0].toUpperCase())}</b><i>logo</i>`;
  // agencies: short label, then the number; the AOR line only when the project has one
  const ag = [...(SET.aor ? [[SET.aor.abbr || 'AOR', SET.aor.v]] : []), ...SET.permits.map(p => [p.abbr || 'Permit', p.v])];
  const tbLines = P.tbLines || [P.street, [P.site, P.city].filter(Boolean).join(' · '), P.county].filter(Boolean);
  return `<aside class="tb" aria-label="Title block">
    <img class="lock" src="${esc(SET.marks.lockup)}" alt="${esc(F.name)}" width="357" height="520" style="left:${U(lx)};top:${U(ly)};width:${U(lw)}">
    <div class="tbc" style="top:${U(LOCK_BOTTOM - 0.5 + 0.22)}">
      <div class="sec"><span class="lab">Project</span><div class="pname">${esc(P.name)}</div>
        ${tbLines.map(l => `<span class="val line">${esc(l)}</span>`).join('')}
        ${P.apn ? `<span class="val line"><span class="il">APN</span>${esc(P.apn)}</span>` : ''}${P.owner ? `<span class="val line"><span class="il">Owner</span>${esc(P.owner)}</span>` : ''}</div>
      <div class="sec"><span class="lab">Issued</span><ol class="iss"><li class="hd" aria-hidden="true"><span>No</span><span>Date</span><span>For</span></li>${issRows}</ol></div>
      <div class="sec gc"><span class="lab">${esc(G.role)}</span><div class="logo" title="Logo placeholder">${gcLogo}</div><span class="val line">${esc(G.name)}</span></div>
      <div class="sec ag"><span class="lab">Agencies</span>${ag.map(([k, v]) => `<span class="val line"><span class="il">${esc(k)}</span>${esc(v)}</span>`).join('')}${SET.fire ? `<span class="val line">${esc(SET.fire)}</span>` : ''}</div>
      <div class="sec stz" aria-label="Agency stamp space"><span>${esc(KIT.stampLabel)}</span></div>
      <div class="sec tq">${qrSVG()}${liveText()}</div>
      <div class="sec colo"><b>${esc(F.signer || F.name)}</b><span>${esc((F.addr || []).join(', '))}</span><span>${esc([F.phone, F.email].filter(Boolean).join(' · '))}</span><span class="cp">${esc(SET.copy)}</span></div>
      <div class="sec sid"><div class="stitle">${esc(stTitle(sh))}</div><div class="meta"><span class="sc">${esc(scaleText(sh.scale))}</span></div>
        <div class="snum"><span class="lab">Sheet ${i + 1} of ${N}</span><div class="sn" data-sn="${sh.id}" aria-label="Sheet ${sh.id}">${cells(sh.id)}</div></div></div>
    </div></aside>`;
}
/* the sheet title as lettered in the title block: the part before any ' · ', so 'Cover · the site' reads COVER */
const stTitle = s => String(s.title).split(' · ')[0];
/* scales in drafting form: '1/4 in = 1 ft' reads 1/4" = 1'-0"; sheets without a drawn scale read NTS */
const scaleText = s => {
  const m = /^(\S+) in = (\d+) ft$/.exec(s || '');
  if (m) return `${m[1]}" = ${m[2]}'-0"`;
  return /^(None|Live model|)$/.test(s || '') ? 'NTS' : s;
};
const cells = s => [...s].map(c => `<span class="fc${c === '.' ? ' pt' : ''}" data-c="${c}">${c}</span>`).join('');

/* ================================================================ painted sheet numbers (André 10/1)
   Each glyph is a few sumi strokes, laid down with the Walsh pocket model's dry brush (walsh/mobile/app.js brush and
   sweepPts), so A0.0 reads like the A of the mark. Painted once per character into a cached image; the split flap
   keeps flipping the cell, the painted glyph rides on it. Strokes are in a 68 x 100 box (a '.' is 28 wide). */
const SUMI = (() => {
  const rng = s => { s = Math.abs(Math.floor(s)) % 2147483647 || 1; return () => (s = s * 16807 % 2147483647, (s - 1) / 2147483646); };
  function brush(g, pts, o) {
    const R = rng(o.seed || 7), n = o.bristles || 44, dry = o.dry == null ? 0.55 : o.dry;
    const Nn = pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [-dy / L, dx / L]; });
    const wmax = Math.max(...pts.map(p => p[2]));
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = o.color;
    if (o.fill) {
      g.globalAlpha = o.fill; g.beginPath();
      pts.forEach((p, i) => g.lineTo(p[0] + Nn[i][0] * p[2] * 0.36, p[1] + Nn[i][1] * p[2] * 0.36));
      for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i][0] - Nn[i][0] * pts[i][2] * 0.36, pts[i][1] - Nn[i][1] * pts[i][2] * 0.36);
      g.closePath(); g.fillStyle = o.color; g.fill();
    }
    for (let k = 0; k < n; k++) {
      const off = (k / (n - 1) - 0.5) * (0.9 + R() * 0.2), ink0 = 0.6 + R() * 0.5, fade = 0.3 + R() * 0.9;
      g.lineWidth = (wmax / n) * (1.4 + R() * 1.6);
      g.globalAlpha = (o.alpha || 0.9) * (0.5 + R() * 0.5);
      let on = false; g.beginPath();
      pts.forEach((p, i) => {
        const t = i / (pts.length - 1), ink = ink0 - t * fade * dry + (R() - 0.5) * 0.3 * dry - (Math.abs(off) > 0.4 ? 0.18 : 0);
        if (ink < 0.2) { if (on) { g.stroke(); g.beginPath(); on = false; } return; }
        const x = p[0] + Nn[i][0] * off * p[2], y = p[1] + Nn[i][1] * off * p[2];
        if (!on) { g.moveTo(x, y); on = true; } else g.lineTo(x, y);
      });
      if (on) g.stroke();
    }
    g.globalAlpha = 1;
  }
  // a stroke along a polyline, pressed at the start and lifting off at the end, like sweepPts; a stroke may be
  // { p: path, w: weight, tail: share of the stroke that lifts to a point } for the A's long sweep
  function along(st, w, n) {
    const path = st.p || st, tail = st.tail || 0.16;
    w *= st.w || 1;
    const seg = [], L = [0];
    for (let i = 1; i < path.length; i++) { seg.push([path[i - 1], path[i]]); L.push(L[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1])); }
    const tot = L[L.length - 1] || 1, pts = [];
    n = n || Math.max(24, Math.round(tot * 1.6));
    for (let k = 0, j = 0; k <= n; k++) {
      const s = tot * k / n; while (j < seg.length - 1 && L[j + 1] < s) j++;
      const [a, b] = seg[j], f = Math.min(1, (s - L[j]) / ((L[j + 1] - L[j]) || 1)), t = k / n;
      const ww = w * (0.62 + 0.38 * Math.sin(Math.PI * Math.min(1, t * 1.1 + 0.08))) * (t > 1 - tail ? 1 - (t - 1 + tail) / tail * 0.88 : 1);
      pts.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, Math.max(1, ww)]);
    }
    return pts;
  }
  const arc = (cx, cy, rx, ry, a0, a1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
  const qb = (a, c, b, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, s = 1 - t; return [s * s * a[0] + 2 * s * t * c[0] + t * t * b[0], s * s * a[1] + 2 * s * t * c[1] + t * t * b[1]]; });
  const G = {
    // the A of the mark: one long sweep from the top left falling to a point at the lower right, a short post, a bar
    A: [{ p: qb([16, 8], [22, 72], [66, 94]), w: 1.6, tail: 0.6 }, { p: [[9, 42], [8, 68], [7, 92]], w: 0.8 }, { p: [[9, 68], [22, 67], [34, 65]], w: 0.75 }],
    F: [[[14, 10], [14, 90]], [[12, 12], [36, 11], [56, 13]], [[14, 49], [32, 48], [48, 49]]],
    L: [[[14, 9], [14, 88]], [[12, 88], [36, 88], [58, 87]]],
    '0': [arc(34, 49, 23, 40, -100, 262)],
    '1': [[[22, 22], [36, 9], [36, 91]]],
    '2': [arc(33, 32, 21, 21, 195, 380).concat([[12, 89]]), [[11, 88], [36, 88], [58, 87]]],
    '3': [arc(32, 30, 19, 19, 205, 450), arc(32, 68, 23, 21, 265, 515)],
    '4': [[[46, 9], [8, 64], [60, 64]], [[46, 9], [46, 92]]],
    '5': [[[54, 12], [18, 12], [15, 46]], arc(33, 64, 24, 24, 235, 505)],
    '6': [arc(37, 52, 25, 41, 300, 170), arc(34, 66, 21, 22, 180, 540)],
    '7': [[[10, 12], [56, 12], [26, 92]]],
    '8': [arc(34, 29, 18, 18, 90, 450), arc(34, 67, 23, 21, -90, 270)],
    '9': [arc(34, 33, 21, 22, 0, 360), arc(13, 34, 42, 56, 0, 72)],
    '.': [[[12, 81], [17, 85]]],
    // added for the kit (10/1/26) so consultant and other discipline prefixes paint too: C G E M P S T
    C: [arc(38, 50, 26, 40, 40, 320)],
    G: [arc(38, 50, 26, 40, 320, 40), [[40, 58], [62, 58], [62, 82]]],
    E: [[[14, 10], [14, 90]], [[12, 12], [36, 11], [56, 13]], [[14, 49], [32, 48], [48, 49]], [[12, 88], [36, 88], [58, 87]]],
    M: [[[9, 91], [13, 10], [34, 62], [55, 10], [59, 91]]],
    P: [[[14, 9], [14, 91]], [[14, 11]].concat(arc(28, 31, 26, 21, -90, 90)).concat([[14, 52]])],
    S: [arc(34, 30, 20, 19, 340, 90), arc(34, 69, 23, 20, -90, 165)],
    T: [[[8, 12], [34, 11], [60, 13]], [[34, 12], [34, 92]]]
  };
  const cache = {};
  function paint(c) {
    if (c in cache) return cache[c];
    const strokes = G[c];
    if (!strokes) return (cache[c] = null);
    const S = 4, W = c === '.' ? 28 : 68, cv = document.createElement('canvas');
    cv.width = W * S; cv.height = 100 * S;
    const g = cv.getContext('2d'); g.scale(S, S);
    strokes.forEach((st, k) => brush(g, along(st, c === '.' ? 15 : 11.5), { color: '#151412', seed: 235 + 17 * k + c.charCodeAt(0), dry: 0.55, alpha: 0.95, fill: 0.88, bristles: 46 }));
    return (cache[c] = cv.toDataURL('image/png'));
  }
  function install(ids) {
    const chars = [...new Set(ids.join(''))];
    let css = '';
    chars.forEach(c => { const u = paint(c); if (u) css += `.tb .sn .fc[data-c="${c}"]{background-image:url(${u});color:transparent}\n`; });
    const st = document.createElement('style'); st.id = 'sumi-sn'; st.textContent = css; document.head.appendChild(st);
  }
  return { install, paint };
})();
try { SUMI.install(SET.sheets.map(s => s.id)); } catch (e) { console.error('sumi sheet numbers', e); }

function buildSheet(sh, i) {
  const kind = sh.kind || 'cartoon';
  const field = overlaysFor(sh) + (kind === 'html' ? fieldHTML(sh) : kind === 'model' ? fieldModel() : kind === 'index' ? fieldIndex(sh) : kind === 'draw' && DRW.sheets[sh.id] ? fieldDraw(sh) : fieldCartoon(sh) + sheetNotesFree(sh));
  const el = document.createElement('section');
  el.className = 'sheet';
  el.dataset.id = sh.id; el.dataset.kind = kind;
  el.setAttribute('aria-label', `${sh.id} ${sh.title}`);
  el.innerHTML = `<div class="paper">${paperTexture()}${frameSVG()}${rulerLabels()}<div class="field">${siteHeader()}${field}${siteFooter(sh, i)}</div>${titleBlock(sh, i)}${bindingHTML()}${curlSVG(i)}<div class="shade"></div></div>`;
  return el;
}

/* ================================================================ build */
const stage = $('#stage');
SHEETS.forEach((s, i) => stage.appendChild(buildSheet(s, i)));
const els = [...stage.children];
els.forEach(wearSheet);
stage.insertAdjacentHTML('beforeend', '<div class="caret" id="cx"></div><div class="caret" id="cy"></div><div class="thumb" id="thumb" aria-hidden="true"></div>');
$('#smark').src = SET.marks.mark;

// the full index, a paper sheet on desktop and a drawer on mobile
(function buildDrawer() {
  const P = SET.project;
  let h = `<div class="dh"><h2>Sheet index</h2><button id="dclose">Close</button></div><p class="dsub">${esc(P.name)} · ${N} sheets · issued ${esc(SET.issuances[SET.issuances.length - 1].date)}</p>`;
  SET.groups.forEach(g => {
    h += `<div class="dg">${esc(g)}</div>`;
    SHEETS.filter(s => s.group === g).forEach(s => { h += `<button class="dr" data-go="${s.id}"><span class="n">${s.id}</span><span class="t">${esc(s.title)}</span><span class="c">${esc(s.cap || '')}</span></button>`; });
  });
  h += `<div class="dp"><div class="lab">Project</div>${esc(P.name)} · ${esc(P.site)}<br>${esc(P.address)}<br>APN ${esc(P.apn)} · ${esc(P.zoning)}<div class="lab">Issuances</div>${SET.issuances.slice().reverse().map(r => `${r.no} · ${esc(r.date)} · ${esc(r.for)}`).join('<br>')}<div class="lab">Status</div>${esc(SET.status)}</div>`;
  $('#drawer').innerHTML = h;
})();

/* ================================================================ layout */
let mob = MQ.matches, u = 46;
const root = document.documentElement;
function layout() {
  mob = MQ.matches;
  const W = innerWidth, H = innerHeight;
  if (mob) {
    u = 14; root.style.setProperty('--u', u + 'px');
    stage.style.left = stage.style.top = '0px';
    hairlines();
    return;
  }
  const ctrlH = 50;
  u = Math.max(8, Math.min((W - 28) / 36, (H - ctrlH - 14) / 24));
  u = Math.floor(u * 100) / 100;
  root.style.setProperty('--u', u + 'px');
  const sw = 36 * u, shh = 24 * u;
  const sx = Math.round((W - sw) / 2), sy = Math.round(Math.max(8, (H - ctrlH - shh) / 2));
  stage.style.left = sx + 'px'; stage.style.top = sy + 'px';
  const below = H - (sy + shh);
  $('#ctrl').style.bottom = Math.max(6, Math.round((below - 34) / 2)) + 'px';
  hairlines();
  els.forEach(fitTitleBlock);
}
// leaders are drawn in view inches; keep them one screen pixel wide at any scale
function hairlines(scope) {
  (scope || stage).querySelectorAll('.ld').forEach(sv => {
    const vb = sv.viewBox.baseVal, r = sv.getBoundingClientRect();
    if (!vb || !vb.width || !r.width) return;
    sv.querySelector('path').style.strokeWidth = (1.05 * vb.width / r.width).toFixed(4) + 'px';
  });
}
// too tall for this window: ease the px floors down until the title block fits
function fitTitleBlock(el) {
  const tbc = el.querySelector('.tb .tbc'); if (!tbc) return;
  el.style.removeProperty('--fl');
  let fl = 1;
  while (tbc.scrollHeight > tbc.clientHeight + 1 && fl > .5) { fl -= .05; el.style.setProperty('--fl', fl.toFixed(2)); }
}
addEventListener('resize', layout);
MQ.addEventListener ? MQ.addEventListener('change', layout) : MQ.addListener(layout);
layout();

/* ================================================================ split flap */
const FLAP = ' .0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const flapTimers = new Map();
function setCells(el, str) { el.innerHTML = cells(str); }
function flap(el, from, to) {
  if (!el) return;
  (flapTimers.get(el) || []).forEach(clearTimeout);
  flapTimers.set(el, []);
  setCells(el, to);
  if (RM.matches || !from) return;
  [...el.children].forEach((c, k) => {
    const a = FLAP.indexOf((from[k] || ' ').toUpperCase()), b = FLAP.indexOf(to[k]);
    if (a === b || to[k] === '.') return;
    let seq = [];
    for (let j = (a + 1) % FLAP.length; ; j = (j + 1) % FLAP.length) { seq.push(FLAP[j]); if (j === b || seq.length > 40) break; }
    seq = seq.slice(-7);
    c.textContent = c.dataset.c = from[k] || ' ';
    seq.forEach((ch, s) => {
      const t = setTimeout(() => { c.textContent = c.dataset.c = ch; c.classList.remove('flip'); void c.offsetWidth; c.classList.add('flip'); }, 90 * k + 62 * (s + 1));
      flapTimers.get(el).push(t);
    });
  });
}
function finishFlaps() {
  flapTimers.forEach(ts => ts.forEach(clearTimeout));
  flapTimers.clear();
  els.forEach((e, i) => setCells(e.querySelector('.tb .sn'), sid(i)));
  if (cur >= 0) setCells($('#ssn'), sid(cur));
}

/* ================================================================ turning */
let cur = -1, anim = null;
function loadModel(sheet) {
  const f = sheet.querySelector('iframe[data-src]');
  if (f && !f.src) {
    f.addEventListener('load', () => { f.classList.add('ready'); const s = sheet.querySelector('.still'); if (s) s.classList.add('gone'); reelBridge(sheet, f); }, { once: true });
    f.src = f.dataset.src;
  }
}
/* the cover runs the pocket model's reel: its shot title, caption, data and timing ticks feed the sheet footer,
   and the footer's buttons drive the model. Same origin, so the sheet reads the model page directly. */
function reelBridge(sheet, f) {
  let doc;
  try { doc = f.contentDocument; } catch (e) { return; }
  if (!doc) return;
  const q = id => doc.getElementById(id);
  sheet.querySelectorAll('[data-reel]').forEach(b => b.addEventListener('click', () => { const t = q(b.dataset.reel); if (t) t.click(); }));
  const rb = sheet.querySelector('.rb'), shot = rb.querySelector('.shot'), line = rb.querySelector('.shotline'), data = rb.querySelector('.rdata'), ticks = rb.querySelector('.ticks');
  let last = '', lastLive = null;
  const tick = () => {
    const app = q('app');
    if (!app) return;
    const plans = doc.querySelector('.plansheet');
    const info = q('info');
    const plansOpen = !!(plans && !plans.hidden && getComputedStyle(plans).display !== 'none');
    const live = app.dataset.mode === 'model' || (info && !info.hidden) || plansOpen;
    if (live !== lastLive) { sheet.classList.toggle('live-model', live); lastLive = live; }
    // the plans follow the title block: Site A1.2, Level 1 A2.1, Level 2 A2.2, Roof A2.3; closing them restores A0.0
    const lv = plansOpen ? ((doc.querySelector('#plSheets button[aria-pressed="true"]') || {}).dataset || {}).sh : null;
    coverAs(sheet, lv ? PLAN_SHEETS[lv] || null : null);
    if (app.dataset.mode !== 'reel') return;
    const t = (q('shotTitle') || {}).textContent || '';
    const l = (q('shotLine') || {}).textContent || '';
    const d = [...doc.querySelectorAll('#shotData li')].map(li => li.textContent);
    const no = (q('shotNo') || {}).textContent || '';
    const key = t + '|' + l + '|' + d.join('|') + '|' + no;
    if (!t || key === last) return;
    last = key;
    shot.textContent = t; line.textContent = l;
    data.innerHTML = d.map((x, k) => `<li style="--k:${k}">${esc(x)}</li>`).join('');
    const src = [...doc.querySelectorAll('#ticks i')];
    ticks.innerHTML = src.map(i => `<i class="${i.className}" style="--dur:${i.style.getPropertyValue('--dur') || '10s'}"><b></b></i>`).join('') + `<span>${esc(no)}</span>`;
  };
  setInterval(tick, 250);
  tick();
}
/* the cover borrows a plan sheet's number, title and scale while the model's plans are open on it */
const sid = k => k === 0 && coverAlias ? coverAlias : SHEETS[k].id;
const PLAN_SHEETS = SET.model.planSheets || { site: 'A1.2', l1: 'A2.1', l2: 'A2.2', roof: 'A2.3' };
let coverAlias = null;
function coverAs(sheet, id) {
  if (id === coverAlias) return;
  const was = coverAlias || SHEETS[0].id;
  coverAlias = id;
  const k = id ? idxOf(id) : 0, s = SHEETS[k], tb = sheet.querySelector('.tb');
  const st = tb.querySelector('.stitle'), sc = tb.querySelector('.meta .sc');
  if (st) st.textContent = stTitle(s);
  if (sc) sc.textContent = scaleText(s.scale);
  tb.querySelector('.snum .lab').textContent = `Sheet ${k + 1} of ${N}`;
  const sn = tb.querySelector('.sn'); sn.dataset.sn = s.id; sn.setAttribute('aria-label', `Sheet ${s.id}`);
  flap(sn, was, s.id);
  if (cur === 0) { $('#cn').textContent = s.id; flap($('#ssn'), was, s.id); $('#stt').textContent = s.foot || s.short || s.title; }
}
function arrive(el, prevIdx) {
  el.classList.remove('play');
  const rows = el.querySelectorAll('.tb .ix');
  const c = el.querySelector('.tb .ix.cur');
  if (c && prevIdx >= 0 && rows[prevIdx]) c.style.setProperty('--from', (rows[prevIdx].offsetTop - c.offsetTop) + 'px');
  else if (c) c.style.setProperty('--from', '0px');
  if (RM.matches) return;
  void el.offsetWidth;
  el.classList.add('play');
}
function updateChrome(i, prev) {
  const s = i === 0 && coverAlias ? SHEETS[idxOf(coverAlias)] : SHEETS[i];
  $('#cn').textContent = s.id;
  $('#stt').textContent = s.foot || s.short || s.title;
  $('#stl').textContent = s.cap || '';
  $('#scount').textContent = `${pad2(i + 1)} / ${pad2(N)}`;
  flap($('#ssn'), prev >= 0 ? $('#ssn').textContent || SHEETS[prev].id : '    ', s.id);
  $('#drawer').querySelectorAll('.dr').forEach(b => b.classList.toggle('cur', b.dataset.go === s.id));
  document.title = `${s.id} ${s.title} · ${KIT.docTitle}`;
  const h = '#' + SHEETS[i].id;
  if (location.hash !== h) history.replaceState(null, '', h);
}
function go(i, dir) {
  i = Math.max(0, Math.min(N - 1, i));
  if (i === cur) return;
  if (anim) { anim.forEach(a => a.finish()); anim = null; }
  hideThumb();
  const prev = cur, next = els[i], old = prev >= 0 ? els[prev] : null;
  dir = dir || (i > prev ? 1 : -1);
  cur = i;
  loadModel(next);
  updateChrome(i, prev);
  const sn = next.querySelector('.tb .sn');
  deskArrows();
  if (!old) {
    els.forEach(e => e.classList.remove('on', 'top', 'turning'));
    next.classList.add('on');
    flap(sn, '    ', sid(i));
    arrive(next, prev);
    return;
  }
  if (RM.matches) {
    // reduced motion: a quick crossfade, no curl
    els.forEach(e => { if (e !== old) e.classList.remove('on', 'top', 'turning'); });
    old.classList.add('on'); next.classList.add('on', 'top');
    flap(sn, SHEETS[prev].id, sid(i));
    arrive(next, prev);
    const a = next.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
    anim = [a];
    a.onfinish = () => { old.classList.remove('on'); next.classList.remove('top'); anim = null; };
    return;
  }
  // forward: the current leaf curls off and the next sheet shows beneath; back: the previous leaf curls back down onto the set
  const leaf = dir > 0 ? old : next, under = dir > 0 ? next : old;
  under.classList.add('on'); leaf.classList.add('on', 'top', 'turning');
  anim = [pageTurn(leaf, dir, () => {
    leaf.style.clipPath = '';
    leaf.classList.remove('top', 'turning');
    old.classList.remove('on');
    anim = null;
  })];
  setTimeout(() => { flap(sn, SHEETS[prev].id, sid(i)); arrive(next, prev); }, dir > 0 ? 230 : 520);
}

/* ================================================================ the page turn (André 10/1/26)
   A corner lifts and the leaf folds back over itself on its way to the binding. Flat paper folds along the
   perpendicular bisector of the corner and the point it has reached; the leaf is clipped along that fold, its
   underside drawn as a flap over it, foreshortened while it stands up off the sheet, with a shadow cast on the sheet
   beneath and a softer one under the flap. The corner is held to the binding by the leaf's own width, so the far end
   of the fold lags behind. One of three moves at random, per turn. Driven by one rAF loop, no filters. */
const TURN = {
  variants: [
    { name: 'bottom curl', corner: 'b', lift: .34, ms: 960, k: .42 },    // the lower right corner peels up and over
    { name: 'top curl', corner: 't', lift: .3, ms: 900, k: .42 },        // the upper right corner leads
    { name: 'full flip', corner: 'b', lift: .06, ms: 1080, k: .55 }      // the whole edge lifts nearly as one
  ],
  shadow: .3,   // darkest cast shadow on the sheet beneath, at mid turn
  back: '#ece7dc'
};
const turnfx = (() => {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('class', 'turnfx'); s.setAttribute('aria-hidden', 'true');
  s.innerHTML = `<defs>
      <linearGradient id="tfS" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1b1a18" stop-opacity="1"/><stop offset=".35" stop-color="#1b1a18" stop-opacity=".35"/><stop offset="1" stop-color="#1b1a18" stop-opacity="0"/></linearGradient>
      <linearGradient id="tfF" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1b1a18" stop-opacity=".16"/><stop offset=".035" stop-color="#fffdf7" stop-opacity=".55"/><stop offset=".16" stop-color="#fffdf7" stop-opacity=".12"/><stop offset=".55" stop-color="#1b1a18" stop-opacity=".02"/><stop offset="1" stop-color="#1b1a18" stop-opacity=".11"/></linearGradient>
      <clipPath id="tfK"><polygon/></clipPath><clipPath id="tfR"><polygon/></clipPath></defs>
    <g clip-path="url(#tfR)"><polygon class="cs" fill="url(#tfS)"/></g>
    <g class="fg"><g clip-path="url(#tfK)"><polygon class="u1" fill="none" stroke="#1b1a18" stroke-linejoin="round"/><polygon class="u2" fill="none" stroke="#1b1a18" stroke-linejoin="round"/></g>
      <polygon class="fb" fill="${TURN.back}"/><polygon class="fs" fill="url(#tfF)" stroke="rgba(27,26,24,.2)" stroke-width=".8" stroke-linejoin="round"/></g>`;
  return s;
})();
stage.appendChild(turnfx);
// clip a convex polygon to the half plane f(p) >= 0
function halfClip(poly, f) {
  const out = [];
  for (let k = 0; k < poly.length; k++) {
    const a = poly[k], b = poly[(k + 1) % poly.length], fa = f(a), fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  return out;
}
const ptsAttr = P => P.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
// slow to lift, quicker through the middle, settling gently
const turnEase = t => { const c = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; return .7 * c + .3 * (1 - Math.pow(1 - t, 2)); };
function turnFrame(leaf, V, p) {
  const W = stage.clientWidth, H = stage.clientHeight, b = mob ? 4 : u, L = W - b;
  const top = V.corner === 't', cy = top ? 0 : H, C = [W, cy];
  const lift = Math.sin(Math.PI * Math.pow(p, .85)) * V.lift * H * (top ? 1 : -1);
  let M = [W - p * 2 * L, cy + lift];
  // the leaf is held at the binding: the corner can never be farther from the spine than the leaf is wide
  const hold = (A, r) => { const dx = M[0] - A[0], dy = M[1] - A[1], d = Math.hypot(dx, dy); if (d > r) M = [A[0] + dx * r / d, A[1] + dy * r / d]; };
  hold([b, cy], L); hold([b, H - cy], Math.hypot(L, H));
  const rect = [[b, 0], [W, 0], [W, H], [b, H]];
  const dx = M[0] - C[0], dy = M[1] - C[1], dd = Math.hypot(dx, dy);
  if (dd < 0.5) { leaf.style.clipPath = ''; turnfx.classList.remove('on'); return; }
  const n = [dx / dd, dy / dd], Q = [(C[0] + M[0]) / 2, (C[1] + M[1]) / 2];
  const side = P => (P[0] - Q[0]) * n[0] + (P[1] - Q[1]) * n[1];
  const keep = halfClip(rect, side), fold = halfClip(rect, P => -side(P));
  leaf.style.clipPath = keep.length > 2 ? `polygon(${keep.map(P => `${P[0].toFixed(1)}px ${P[1].toFixed(1)}px`).join(',')})` : 'polygon(0 0,0 0,0 0)';
  // the flap: the folded part reflected over the fold, foreshortened while it stands up off the sheet
  // k: the flap's width seen from above, 1 lying flat, 0 standing on edge; it narrows to nothing as the leaf reaches the spine
  const up = Math.sin(Math.PI * p), sm = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x), k = (1 - V.k * up) * (1 - sm((p - .5) / .5));
  let reach = 0;
  let flapP = fold.map(P => { const d = -side(P); reach = Math.max(reach, d * k); return [P[0] + d * (1 + k) * n[0], P[1] + d * (1 + k) * n[1]]; });
  flapP = halfClip(flapP, P => P[0] - b);                  // never over the binding
  if (flapP.length < 3) flapP = [[0, 0], [0, 0], [0, 0]];
  const fade = 1 - sm((p - .9) / .1), sh = (.35 + .65 * up) * fade;
  const q = s => turnfx.querySelector(s);
  ['.fb', '.fs', '.u1', '.u2'].forEach(s => q(s).setAttribute('points', ptsAttr(flapP)));
  q('.fg').setAttribute('opacity', fade.toFixed(3));
  // the flap's shading runs across it, from the fold out to its edge: a crease, a bright bend, then a darker roll
  const gF = q('#tfF'), far = Math.max(reach, 1);
  gF.setAttribute('x1', Q[0]); gF.setAttribute('y1', Q[1]); gF.setAttribute('x2', Q[0] + n[0] * far); gF.setAttribute('y2', Q[1] + n[1] * far);
  // shadow under the flap, kept to the part of the leaf still lying flat
  q('#tfK polygon').setAttribute('points', ptsAttr(keep.length > 2 ? keep : [[0, 0], [0, 0], [0, 0]]));
  q('.u1').setAttribute('stroke-width', (u * (.5 + 1.1 * up)).toFixed(1)); q('.u1').setAttribute('stroke-opacity', (.05 * sh).toFixed(3));
  q('.u2').setAttribute('stroke-width', (u * (.18 + .3 * up)).toFixed(1)); q('.u2').setAttribute('stroke-opacity', (.07 * sh).toFixed(3));
  // the leaf's shadow on the sheet beneath, deepest at the fold, wider as the leaf stands up
  const w = u * (.5 + 2.1 * up), F0 = [Q[0] - n[1] * 4 * W, Q[1] + n[0] * 4 * W], F1 = [Q[0] + n[1] * 4 * W, Q[1] - n[0] * 4 * W];
  q('.cs').setAttribute('points', ptsAttr([F0, F1, [F1[0] - n[0] * w, F1[1] - n[1] * w], [F0[0] - n[0] * w, F0[1] - n[1] * w]]));
  q('.cs').setAttribute('opacity', (TURN.shadow * sh).toFixed(3));
  const gS = q('#tfS'); gS.setAttribute('x1', Q[0]); gS.setAttribute('y1', Q[1]); gS.setAttribute('x2', Q[0] - n[0] * w); gS.setAttribute('y2', Q[1] - n[1] * w);
  q('#tfR polygon').setAttribute('points', ptsAttr(fold.length > 2 ? fold : [[0, 0], [0, 0], [0, 0]]));
  turnfx.classList.add('on');
}
// returns an Animation-like handle with finish(), so go() can cut a turn short
function pageTurn(leaf, dir, done) {
  const V = TURN.variants[window.__turnVariant != null ? window.__turnVariant : Math.floor(Math.random() * TURN.variants.length)];
  const ms = V.ms * (0.94 + 0.12 * Math.random());
  let raf = 0, t0 = 0, over = false;
  const end = () => { if (over) return; over = true; cancelAnimationFrame(raf); turnfx.classList.remove('on'); done(); };
  const step = now => {
    if (!t0) t0 = now;
    const t = Math.min(1, (now - t0) / ms), e = turnEase(t);
    turnFrame(leaf, V, dir > 0 ? e : 1 - e);
    if (t < 1) raf = requestAnimationFrame(step); else end();
  };
  turnFrame(leaf, V, dir > 0 ? 0 : 1);
  raf = requestAnimationFrame(step);
  // a still frame for captures: __turn.hold() stops the clock, __turn.frame(p) draws progress p (0 flat, 1 turned)
  window.__turn = { V, frame: p => turnFrame(leaf, V, p), hold: () => cancelAnimationFrame(raf) };
  return { finish: end, variant: V.name };
}
const idxOf = id => SHEETS.findIndex(s => s.id.toLowerCase() === String(id).toLowerCase());
function fromHash() { const k = idxOf(decodeURIComponent(location.hash.slice(1))); return k >= 0 ? k : 0; }
addEventListener('hashchange', () => go(fromHash()));

/* ================================================================ input */
document.addEventListener('click', e => {
  const p = e.target.closest('[data-panel]');
  if (p) { openDrawer(); return; }
  const t = e.target.closest('[data-go]');
  if (t) { go(idxOf(t.dataset.go)); closeDrawer(); }
});
document.addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('input,textarea')) return;
  const k = e.key;
  if (k === 'Escape') { closeDrawer(); return; }
  if ($('#drawer').classList.contains('show')) return;
  if (k === 'Enter' && e.target.matches && e.target.matches('.si-t.link')) { go(idxOf(e.target.dataset.go)); return; }
  if (k === 'ArrowRight' || k === 'PageDown') { go(cur + 1, 1); e.preventDefault(); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { go(cur - 1, -1); e.preventDefault(); }
  else if (k === 'Home') go(0); else if (k === 'End') go(N - 1);
});
$('#prev').onclick = () => go(cur - 1, -1);
$('#next').onclick = () => go(cur + 1, 1);
$('#print').onclick = () => window.print();
/* swipes turn sheets: touch, and two finger horizontal swipes on a trackpad (wheel events with deltaX dominant).
   One gesture turns one sheet: deltas add up to a threshold, then the gesture is spent until the wheel goes quiet
   (the trackpad's momentum tail included). Nothing fires over the live model, which uses drags of its own. */
const SWIPE = { wheel: 70, quiet: 420, cooldown: 1000, touch: 50 };
const inModel = el => !!(el && el.closest && el.closest('.model'));
const blocked = () => $('#drawer').classList.contains('show');
let sw = null;
addEventListener('touchstart', e => { sw = e.touches.length === 1 && !inModel(e.target) ? { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() } : null; }, { passive: true });
addEventListener('touchend', e => {
  if (!sw) return;
  const t = e.changedTouches[0], dx = t.clientX - sw.x, dy = t.clientY - sw.y;
  if (Math.abs(dx) > SWIPE.touch && Math.abs(dx) > 1.6 * Math.abs(dy) && Date.now() - sw.t < 700 && !blocked()) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  sw = null;
}, { passive: true });
const wh = { acc: 0, last: 0, spent: false, until: 0 };
addEventListener('wheel', e => {
  if (inModel(e.target) || blocked() || e.ctrlKey) return;
  const now = performance.now();
  const gap = now - wh.last; wh.last = now;
  if (gap > SWIPE.quiet) { wh.acc = 0; if (now > wh.until) wh.spent = false; }
  const dx = e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX, dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  if (Math.abs(dx) <= 1.2 * Math.abs(dy)) return;          // a vertical scroll: leave it to the page
  e.preventDefault();                                      // no browser back or forward on a sideways swipe
  if (wh.spent) return;
  wh.acc += dx;
  if (Math.abs(wh.acc) >= SWIPE.wheel) {
    const d = wh.acc > 0 ? 1 : -1;                         // fingers move left: the next sheet
    wh.spent = true; wh.acc = 0; wh.until = now + SWIPE.cooldown;
    go(cur + d, d);
  }
}, { passive: false });
let lastFocus = null;
function openDrawer() { lastFocus = document.activeElement; $('#drawer').classList.add('show'); $('#scrim').classList.add('show'); $('#ib').setAttribute('aria-expanded', 'true'); const c = $('#drawer .dr.cur') || $('#dclose'); c && c.focus({ preventScroll: false }); }
function closeDrawer() { if (!$('#drawer').classList.contains('show')) return; $('#drawer').classList.remove('show'); $('#scrim').classList.remove('show'); $('#ib').setAttribute('aria-expanded', 'false'); if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }
$('#ib').onclick = () => $('#drawer').classList.contains('show') ? closeDrawer() : openDrawer();
$('#scrim').onclick = closeDrawer;
$('#dclose').onclick = closeDrawer;

/* ================================================================ live thumbnail */
const thumb = $('#thumb');
let thumbFor = null;
function showThumb(row) {
  if (mob || !matchMedia('(hover:hover)').matches) return;
  const id = row.dataset.go, k = idxOf(id);
  if (k < 0 || k === cur) { hideThumb(); return; }
  const tu = Math.max(5.4, u * 0.16);
  const tw = 36 * tu, th = 24 * tu;
  if (thumbFor !== id) {
    thumbFor = id;
    const clone = els[k].querySelector('.paper').cloneNode(true);
    clone.querySelectorAll('iframe,.curl').forEach(f => f.remove());
    clone.querySelectorAll('.still').forEach(s => { s.classList.remove('gone'); s.loading = 'eager'; });
    clone.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
    const wrap = document.createElement('div');
    wrap.className = 'tpaper';
    wrap.style.cssText = `--u:${tu}px;--fl:0;width:${tw}px;height:${th}px`;
    wrap.appendChild(clone);
    thumb.innerHTML = '';
    thumb.appendChild(wrap);
    thumb.style.cssText = `left:-9999px;top:0;width:${tw}px;height:${th}px`;
    hairlines(wrap);
    thumb.insertAdjacentHTML('beforeend', `<span class="cap">${esc(id)} · ${esc(SHEETS[k].short || SHEETS[k].title)}</span>`);
    if (!RM.matches) requestAnimationFrame(() => wrap.classList.add('play'));
  }
  const sr = stage.getBoundingClientRect(), rr = row.getBoundingClientRect();
  const x = (TBX - 0.25) * u - tw;
  let y = rr.top + rr.height / 2 - sr.top - th / 2;
  y = Math.max(0.6 * u, Math.min(23.4 * u - th, y));
  thumb.style.cssText = `left:${x}px;top:${y}px;width:${tw}px;height:${th}px`;
  thumb.classList.add('show');
}
function hideThumb() { thumb.classList.remove('show'); }
stage.addEventListener('mouseover', e => { const r = e.target.closest('.tb .ix'); if (r) showThumb(r); });
stage.addEventListener('mouseout', e => {
  const r = e.target.closest('.tb .ix');
  if (r && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.tb .ix'))) hideThumb();
});

/* ================================================================ drafting readout: ticks warm near the cursor */
let mx = null, raf = 0, hotSheet = null;
function clearHot(sheet) {
  if (!sheet) return;
  sheet.querySelectorAll('.tk').forEach(t => { t.style.strokeOpacity = ''; t.classList.remove('hot'); });
  sheet.querySelectorAll('.zl').forEach(z => z.classList.remove('hot', 'warm'));
}
function readout() {
  raf = 0;
  const sheet = els[cur];
  if (!sheet) return;
  if (hotSheet && hotSheet !== sheet) clearHot(hotSheet);
  hotSheet = sheet;
  const cx = $('#cx'), cy = $('#cy'), rd = $('#rd');
  const off = () => { clearHot(sheet); cx.classList.remove('show'); cy.classList.remove('show'); rd.innerHTML = 'Inch <b>&#183;</b>'; };
  if (!mx || mob) return off();
  const sr = stage.getBoundingClientRect();
  const ix = (mx.x - sr.left) / u, iy = (mx.y - sr.top) / u;
  if (!(ix >= BL && ix <= 35.5 && iy >= 0.5 && iy <= 23.5)) return off();
  const rx = Math.min(35, Math.max(2, Math.round(ix))), ry = Math.min(23, Math.max(1, Math.round(iy)));   // nearest inch marks
  sheet.querySelectorAll('.tk').forEach(t => {
    const v = +t.dataset.v, d = Math.abs(v - (t.dataset.ax === 'x' ? ix : iy));
    const k = Math.max(0, 1 - d / 3.2);
    t.style.strokeOpacity = (0.42 + 0.58 * k).toFixed(2);
    t.classList.toggle('hot', d < 0.5);
  });
  sheet.querySelectorAll('.zl').forEach(z => {
    const v = +z.dataset.v, c = z.dataset.ax === 'x' ? rx : ry;
    z.classList.toggle('hot', v === c);
    z.classList.toggle('warm', Math.abs(v - c) === 1);
  });
  cx.style.left = (ix * u) + 'px'; cx.style.top = (0.5 * u - 7) + 'px';
  cy.style.left = (BL * u - 7) + 'px'; cy.style.top = (iy * u) + 'px';
  cx.classList.add('show'); cy.classList.add('show');
  rd.innerHTML = `<b>${rx} · ${ry}</b>`;
}
addEventListener('mousemove', e => { mx = { x: e.clientX, y: e.clientY }; if (!raf) raf = requestAnimationFrame(readout); }, { passive: true });
document.addEventListener('mouseleave', () => { mx = null; if (!raf) raf = requestAnimationFrame(readout); });

/* ================================================================ the corner in the breeze
   Local coordinates: inches, the sheet's top right corner at (0,0), the page toward x<0, y>0.
   The fold runs from P on the top edge to Q on the right edge. The flap turns over the fold by
   an angle; seen from above, its tip lands at F + (C - F) cos(angle), F the foot of the corner on
   the fold. Past 90 degrees we see the flap's underside, a touch darker, with a soft shadow. */
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
const breeze = { t0: performance.now(), last: 0, raf: 0, L: 0 };
function breezeFrame(now) {
  breeze.raf = 0;
  if (cur < 0 || document.hidden || RM.matches) { breeze.last = 0; return; }
  const t = (now - breeze.t0) / 1000, dt = breeze.last ? Math.min(0.1, (now - breeze.last) / 1000) : 1 / 60;
  breeze.last = now;
  breeze.L = stepLift(breeze.L, t, dt);
  drawCurl(els[cur].querySelector('.curl'), curlShape(t, breeze.L), cur);
  breeze.raf = requestAnimationFrame(breezeFrame);
}
function startBreeze() { if (!breeze.raf && !RM.matches) breeze.raf = requestAnimationFrame(breezeFrame); }
els.forEach((e, k) => drawCurl(e.querySelector('.curl'), curlShape(0, 0), k));   // every sheet starts at rest
document.addEventListener('visibilitychange', startBreeze);
RM.addEventListener && RM.addEventListener('change', startBreeze);
// a still frame for tests and captures: window.__breeze(seconds) replays the wind to that instant, draws it and stops the loop
window.__breeze = s => {
  cancelAnimationFrame(breeze.raf); breeze.raf = 0;
  let L = 0; for (let t = 0; t < s; t += 1 / 60) L = stepLift(L, t, 1 / 60);
  drawCurl(els[cur].querySelector('.curl'), curlShape(s, L), cur);
  return +L.toFixed(3);
};
window.__wind = wind;

/* ================================================================ print: everything in its final still state */
function toStill() {
  if (anim) { anim.forEach(a => a.finish()); anim = null; }
  finishFlaps();
  els.forEach(e => e.classList.remove('play', 'turning'));
  hideThumb();
}
addEventListener('beforeprint', toStill);
matchMedia('print').addEventListener && matchMedia('print').addEventListener('change', e => { if (e.matches) toStill(); });

/* ================================================================ weathered paper, baked once
   SVG turbulence (fibers, grain, mottling, mist) and canvas gradients (foxing, graphite smudges, long construction
   lines, weathered edges) are drawn one time into a 36 x 24 in bitmap at 60 px per inch. Every sheet shows that one
   cached image, so page turns and the breeze never re-run filters or gradients. */
const PAPER = { ppi: 60, W: 2160, H: 1440 };
const PAPER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='${PAPER.W}' height='${PAPER.H}'>` +
  "<filter id='a' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.014 .15' numOctaves='3' seed='11'/><feColorMatrix values='0 0 0 0 .40 0 0 0 0 .36 0 0 0 0 .30 5 0 0 0 -3.1'/></filter>" +
  "<filter id='c' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.038 .07' numOctaves='2' seed='31'/><feColorMatrix values='0 0 0 0 .98 0 0 0 0 .97 0 0 0 0 .94 5 0 0 0 -3.2'/></filter>" +
  "<filter id='g' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='2' seed='2'/><feColorMatrix values='0 0 0 0 .30 0 0 0 0 .28 0 0 0 0 .25 1.6 0 0 0 -.62'/></filter>" +
  "<filter id='m' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.0016 .0021' numOctaves='4' seed='23'/><feColorMatrix values='0 0 0 0 .55 0 0 0 0 .47 0 0 0 0 .36 2.2 0 0 0 -1.0'/></filter>" +
  "<filter id='w' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.0012' numOctaves='3' seed='5'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 .99 2.4 0 0 0 -1.15'/></filter>" +
  "<filter id='y' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.0009 .0013' numOctaves='3' seed='47'/><feColorMatrix values='0 0 0 0 .78 0 0 0 0 .62 0 0 0 0 .36 3 0 0 0 -1.2'/></filter>" +
  "<rect width='100%' height='100%' filter='url(#y)' opacity='.045'/><rect width='100%' height='100%' filter='url(#m)' opacity='.09'/><rect width='100%' height='100%' filter='url(#w)' opacity='.35'/>" +
  "<rect width='100%' height='100%' filter='url(#a)' opacity='.05'/><rect width='100%' height='100%' filter='url(#c)' opacity='.3'/><rect width='100%' height='100%' filter='url(#g)' opacity='.06'/></svg>";
// [x, y] in sheet fractions, radii in inches, rgb, alpha at the center
const FOX = [
  [.084, .91, .16, .16, '150,108,58', .11], [.096, .885, .09, .09, '150,108,58', .09], [.47, .065, .22, .22, '150,108,58', .05],
  [.83, .94, .12, .12, '150,108,58', .09], [.58, .52, .3, .3, '150,108,58', .04], [.34, .71, .07, .07, '150,108,58', .1],
  [.22, .84, 4.6, 1.3, '70,66,60', .035], [.71, .12, 3.2, .9, '70,66,60', .03],
  [.86, .8, 9, 6, '160,130,90', .05], [.12, .18, 11, 7, '160,130,90', .04]
];
// long faint construction lines: [x1, y1, x2, y2] in sheet fractions, alpha
const GRAPHITE = [[0, .375, 1, .375, .05], [.618, 0, .618, 1, .04], [0, .70, 1, .722, .035], [.172, 0, .188, 1, .03]];
/* age: a gentle yellowing, deeper toward the edges and the binding, foxing specks, stray fibers and a hint of handling
   wear where hands turn the sheets. Seeded, so every visit ages the same way. */
const AGE = {
  tint: 'rgba(206,176,118,.012)',   // the whole sheet, a warm cast
  edge: [1.7, 'rgba(168,128,66,', .065],   // inches, color, alpha at the very edge
  bind: [5, .045],                         // inches from the binding and alpha of the extra yellowing there
  specks: 170, fibers: 90, seed: 71
};
function age(x, W, H, ppi) {
  let sd = AGE.seed;
  const rnd = () => (sd = (Math.imul(sd, 1664525) + 1013904223) >>> 0) / 4294967296;
  x.fillStyle = AGE.tint; x.fillRect(0, 0, W, H);
  // edges: soft and uneven, deeper at the corners where they overlap
  const [ei, ec, ea] = AGE.edge, e = ei * ppi;
  const band = (x0, y0, x1, y1, rx, ry, rw, rh) => { const g = x.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, ec + ea + ')'); g.addColorStop(.3, ec + (ea * .42).toFixed(3) + ')'); g.addColorStop(1, ec + '0)'); x.fillStyle = g; x.fillRect(rx, ry, rw, rh); };
  band(0, 0, 0, e, 0, 0, W, e); band(0, H, 0, H - e, 0, H - e, W, e); band(W, 0, W - e, 0, W - e, 0, e, H); band(0, 0, e, 0, 0, 0, e, H);
  // the binding side: the paper by the spine has seen the most air
  const b0 = 1 * ppi, g = x.createLinearGradient(b0, 0, b0 + AGE.bind[0] * ppi, 0);
  g.addColorStop(0, `rgba(172,132,70,${AGE.bind[1]})`); g.addColorStop(.35, `rgba(172,132,70,${(AGE.bind[1] * .4).toFixed(3)})`); g.addColorStop(1, 'rgba(172,132,70,0)');
  x.fillStyle = g; x.fillRect(0, 0, b0 + AGE.bind[0] * ppi, H);
  const soft = (cx, cy, rx, ry, rgb, a, rot = 0) => { x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(1, ry / rx);
    const gr = x.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(.55, `rgba(${rgb},${(a * .45).toFixed(3)})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = gr; x.fillRect(-rx, -rx, 2 * rx, 2 * rx); x.restore(); };
  // handling wear: where thumbs turn the sheet (right edge, lower half) and the lower right corner
  soft(W - .5 * ppi, H * .62, 1.1 * ppi, 3.2 * ppi, '110,96,76', .03, .08);
  soft(W - .35 * ppi, H * .8, .8 * ppi, 1.6 * ppi, '110,96,76', .025, -.1);
  soft(W - 1.2 * ppi, H - 1 * ppi, 3 * ppi, 2 * ppi, '150,118,72', .05);
  soft(2.4 * ppi, H - .8 * ppi, 2.2 * ppi, 1 * ppi, '110,96,76', .02);
  // a faint old crease across the lower right corner, a pale ridge with a soft shadow line
  x.lineCap = 'round';
  [[W - 4.1 * ppi, H, W, H - 3.3 * ppi]].forEach(([x1, y1, x2, y2]) => {
    x.lineWidth = 2.2; x.strokeStyle = 'rgba(255,253,247,.22)'; x.beginPath(); x.moveTo(x1, y1); x.quadraticCurveTo((x1 + x2) / 2 + 6, (y1 + y2) / 2 + 4, x2, y2); x.stroke();
    x.lineWidth = 1; x.strokeStyle = 'rgba(110,92,66,.07)'; x.beginPath(); x.moveTo(x1 + 1.6, y1 + 1); x.quadraticCurveTo((x1 + x2) / 2 + 7.6, (y1 + y2) / 2 + 5, x2 + 1.6, y2 + 1); x.stroke();
  });
  // foxing: small rust specks, more of them near the edges, a few with a darker core
  for (let k = 0; k < AGE.specks; k++) {
    let px = rnd(), py = rnd();
    if (rnd() < .6) { const s2 = rnd() < .5 ? 0 : 1, d = Math.pow(rnd(), 2.2) * .16; if (rnd() < .5) px = s2 ? 1 - d : 1 / 36 + d; else py = s2 ? 1 - d : d; }
    const r = (0.008 + 0.035 * Math.pow(rnd(), 2.4)) * ppi, a = .07 + .16 * rnd();
    soft(px * W, py * H, r * 2.4, r * (1.6 + rnd()), '168,112,56', a * .45, rnd() * 3);
    if (rnd() < .45) soft(px * W, py * H, r * .7, r * .6, '130,82,38', a);
  }
  // stray fibers in the sheet
  for (let k = 0; k < AGE.fibers; k++) {
    const x0 = rnd() * W, y0 = rnd() * H, l = (0.08 + 0.3 * rnd()) * ppi, a = rnd() * Math.PI;
    x.lineWidth = .7; x.strokeStyle = `rgba(118,100,74,${(.04 + .06 * rnd()).toFixed(3)})`;
    x.beginPath(); x.moveTo(x0, y0);
    x.quadraticCurveTo(x0 + Math.cos(a + .6) * l * .5, y0 + Math.sin(a + .6) * l * .5, x0 + Math.cos(a) * l, y0 + Math.sin(a) * l); x.stroke();
  }
}
function bakePaper() {
  const { W, H, ppi } = PAPER, img = new Image();
  img.onload = () => {
    try {
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d');
      x.drawImage(img, 0, 0);
      FOX.forEach(([fx, fy, rx, ry, rgb, a]) => {
        x.save(); x.translate(fx * W, fy * H); x.scale(1, ry / rx);
        const g = x.createRadialGradient(0, 0, 0, 0, 0, rx * ppi);
        g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
        x.fillStyle = g; x.fillRect(-rx * ppi, -rx * ppi, 2 * rx * ppi, 2 * rx * ppi); x.restore();
      });
      x.lineWidth = 1.3;
      GRAPHITE.forEach(([x1, y1, x2, y2, a]) => { x.strokeStyle = `rgba(27,26,24,${a})`; x.beginPath(); x.moveTo(x1 * W, y1 * H); x.lineTo(x2 * W, y2 * H); x.stroke(); });
      age(x, W, H, ppi);
      c.toBlob(b => { if (b) root.style.setProperty('--paper-tex', `url(${URL.createObjectURL(b)})`); }, 'image/png');
    } catch (err) { /* no grain: the paper stays plain */ }
  };
  img.src = 'data:image/svg+xml,' + encodeURIComponent(PAPER_SVG);
}

/* ================================================================ start */
/* ================================================================ eight aging layers, one per idle slice (André 10/1/26)
   Transparent overlays at 30 px per inch on top of the shared grain: foxing in clusters, graphite smudges where a hand
   dragged, handling wear at a different edge each time, an old crease on some, a faint dried splash on a few. Each
   is baked once into a blob and shown by every sheet that wears it (data-wear), so turns still only composite. */
const VAR = { ppi: 30, splash: [1, 4, 6], crease: [0, 3, 5, 7] };
function bakeVariant(v) {
  const ppi = VAR.ppi, W = 36 * ppi, H = 24 * ppi, r = seeded(1000 + v * 37);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const soft = (cx, cy, rx, ry, rgb, a, rot = 0, mid = .45) => { x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(1, ry / rx);
    const g = x.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(.55, `rgba(${rgb},${(a * mid).toFixed(3)})`); g.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = g; x.fillRect(-rx, -rx, 2 * rx, 2 * rx); x.restore(); };
  // keep clear of the binding: everything lands right of 1.4 in
  const X = () => (1.4 + 34 * r()) * ppi, Y = () => (0.4 + 23.2 * r()) * ppi;
  // foxing clusters: a loose family of rust specks around a center
  const nc = 2 + Math.floor(r() * 4);
  for (let k = 0; k < nc; k++) {
    const cx = X(), cy = Y(), spread = (0.3 + 1.2 * r()) * ppi, m = 6 + Math.floor(r() * 16);
    soft(cx, cy, spread * 1.6, spread * (0.8 + r()), '160,118,64', .025 + .02 * r(), r() * 3);
    for (let j = 0; j < m; j++) {
      const a = r() * 6.283, d = spread * Math.pow(r(), .8), R = (0.01 + 0.05 * Math.pow(r(), 2.2)) * ppi * 2, al = .06 + .14 * r();
      soft(cx + Math.cos(a) * d, cy + Math.sin(a) * d, R * 2.2, R * (1.4 + r()), '168,112,56', al * .5, r() * 3);
      if (r() < .5) soft(cx + Math.cos(a) * d, cy + Math.sin(a) * d, R * .7, R * .6, '128,80,36', al * .9);
    }
  }
  // graphite smudges: a palm's drag, long and soft, with a few streaks along it
  const ns = 1 + Math.floor(r() * 3);
  for (let k = 0; k < ns; k++) {
    const cx = X(), cy = Y(), len = (1.5 + 4 * r()) * ppi, wd = (0.25 + 0.7 * r()) * ppi, rot = (r() - .5) * .9;
    soft(cx, cy, len, wd, '62,60,56', .028 + .02 * r(), rot, .5);
    x.save(); x.translate(cx, cy); x.rotate(rot); x.lineCap = 'round';
    for (let j = 0; j < 5; j++) { const oy = (r() - .5) * wd * 1.2, l0 = -len * (.3 + .5 * r()), l1 = len * (.2 + .6 * r());
      x.strokeStyle = `rgba(52,50,46,${(.02 + .03 * r()).toFixed(3)})`; x.lineWidth = .6 + 1.4 * r();
      x.beginPath(); x.moveTo(l0, oy); x.quadraticCurveTo((l0 + l1) / 2, oy + (r() - .5) * 4, l1, oy + (r() - .5) * 3); x.stroke(); }
    x.restore();
  }
  // handling wear: a darker thumb zone on one edge, never the same as the last variant
  const ed = v % 4, tw = (0.6 + 0.8 * r()) * ppi, tl = (1.5 + 3 * r()) * ppi;
  if (ed === 0) soft(W - tw * .4, H * (.3 + .5 * r()), tw, tl, '110,96,76', .035);
  else if (ed === 1) soft(W * (.3 + .55 * r()), H - tw * .4, tl, tw, '110,96,76', .03);
  else if (ed === 2) soft(W * (.15 + .7 * r()), tw * .4, tl, tw, '120,100,72', .025);
  else soft(W - 1.2 * ppi, H - (1 + 3 * r()) * ppi, 2.4 * ppi, 1.6 * ppi, '150,118,72', .04);
  // an old crease on some: a pale ridge with a soft shadow line beside it
  if (VAR.crease.includes(v)) {
    const vert = r() < .5, p = vert ? (6 + 26 * r()) * ppi : (4 + 16 * r()) * ppi, sk = (r() - .5) * 1.4 * ppi;
    const [x1, y1, x2, y2] = vert ? [p, 0, p + sk, H] : [0, p, W, p + sk];
    x.lineCap = 'round';
    x.lineWidth = 1.6; x.strokeStyle = 'rgba(255,253,247,.2)'; x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke();
    x.lineWidth = .8; x.strokeStyle = 'rgba(110,92,66,.06)'; x.beginPath(); x.moveTo(x1 + 1.2, y1 + 1); x.lineTo(x2 + 1.2, y2 + 1); x.stroke();
  }
  // a faint dried splash: an irregular tide line, a paler wash inside, a few droplets thrown off one side
  if (VAR.splash.includes(v)) {
    const cx = (6 + 22 * r()) * ppi, cy = (3 + 16 * r()) * ppi, R = (0.5 + 0.9 * r()) * ppi, ph = r() * 9, ph2 = r() * 9;
    const rad = a => R * (1 + .09 * Math.sin(3 * a + ph) + .05 * Math.sin(7 * a + ph2) + .03 * Math.sin(13 * a));
    const ring = (sc) => { x.beginPath(); for (let a = 0; a <= 6.3; a += .05) { const q = rad(a) * sc; a ? x.lineTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q * .92) : x.moveTo(cx + q, cy); } x.closePath(); };
    ring(1); x.fillStyle = 'rgba(176,140,86,.016)'; x.fill();
    ring(1); x.lineWidth = 1.4; x.strokeStyle = 'rgba(150,108,58,.045)'; x.stroke();
    ring(.985); x.lineWidth = .6; x.strokeStyle = 'rgba(130,92,46,.035)'; x.stroke();
    const dir = r() * 6.283;
    for (let k = 0; k < 7; k++) {
      const a = dir + (r() - .5) * 1.1, d = R * (1.25 + 1.4 * r()), s2 = (0.03 + 0.08 * r()) * ppi;
      const px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d;
      x.beginPath(); x.ellipse(px, py, s2 * 1.3, s2, a, 0, 6.283);
      x.fillStyle = 'rgba(176,140,86,.02)'; x.fill(); x.lineWidth = .6; x.strokeStyle = 'rgba(150,108,58,.045)'; x.stroke();
    }
  }
  return new Promise(res => c.toBlob(b => res(b), 'image/png'));
}
function bakeVariants() {
  const css = document.createElement('style');
  document.head.appendChild(css);
  const idle = window.requestIdleCallback || (f => setTimeout(f, 60));
  // the sheet on screen first; a failed bake leaves those sheets on the shared grain only
  const v = cur >= 0 ? cur % WEAR.variants : 0;
  const order = [...Array(WEAR.variants).keys()].map(j => (v + j) % WEAR.variants);
  let oi = 0;
  const nextOrdered = () => {
    if (oi >= order.length) return;
    const k = order[oi++];
    try {
      bakeVariant(k).then(b => {
        if (b) css.textContent += `.sheet[data-wear="${k}"] .tex{--paper-var:url(${URL.createObjectURL(b)})}\n`;
        idle(nextOrdered, { timeout: 1200 });
      });
    } catch (err) { idle(nextOrdered, { timeout: 1200 }); }
  };
  idle(nextOrdered, { timeout: 1500 });
}

/* ================================================================ desk arrows (André 10/1/26)
   In the empty desk beside the set on a wide screen: a sumi brush stroke after the AM mark's long roof stroke, a
   tapering sweep with a short stub at the head, faint until hovered. Hidden when the margins are too narrow. */
const DARR = { min: 64, op: 0.1 };
function brushArrowPath(seed) {
  const r = seeded(seed), f = v => v.toFixed(2);
  // centerline: a long sweep, slightly bowed, ending at the tip (100, 20); width tapers from heel to tip like the mark's stroke
  const N = 40, L = [], R = [];
  const C = t => [6 + 94 * t, 30 - 10 * t - 7 * Math.sin(Math.PI * t) * (1 - t * .4)];
  for (let k = 0; k <= N; k++) {
    const t = k / N, p = C(t), q = C(Math.min(1, t + .01)), p0 = C(Math.max(0, t - .01));
    const tx = q[0] - p0[0], ty = q[1] - p0[1], tl = Math.hypot(tx, ty), nx = -ty / tl, ny = tx / tl;
    const w = (t < .06 ? 2.4 + 10 * t : 3 * Math.pow(1 - t, .9) + .25) * (1 + (r() - .5) * .12);
    const sk = .4 * Math.sin(t * 9 + seed);
    L.push([p[0] + nx * (w + sk * .3), p[1] + ny * (w + sk * .3)]); R.push([p[0] - nx * w * .8, p[1] - ny * w * .8]);
  }
  const main = 'M' + L.map(p => f(p[0]) + ' ' + f(p[1])).join(' L') + ' L' + R.reverse().map(p => f(p[0]) + ' ' + f(p[1])).join(' L') + ' Z';
  // the stub: a short, heavier stroke coming down into the tip, like the mark's crossbar meeting the long stroke
  const S = [], T = [];
  for (let k = 0; k <= 16; k++) {
    const t = k / 16, p = [78 + 21 * t + 1.5 * Math.sin(Math.PI * t), 6 + 13.5 * t], w = (t < .1 ? 1.4 + 12 * t : 2.6 * Math.pow(1 - t, .7) + .2);
    S.push([p[0] - w * .55, p[1] + w * .8]); T.push([p[0] + w * .55, p[1] - w * .8]);
  }
  const stub = 'M' + S.map(p => f(p[0]) + ' ' + f(p[1])).join(' L') + ' L' + T.reverse().map(p => f(p[0]) + ' ' + f(p[1])).join(' L') + ' Z';
  const dry = `M${f(18)} ${f(29.5)} Q${f(52)} ${f(27)} ${f(86)} ${f(21.6)}`;
  return { main, stub, dry };
}
const darr = ['prev', 'next'].map((side, k) => {
  const a = brushArrowPath(k ? 23 : 41), b = document.createElement('button');
  b.className = 'darr'; b.dataset.side = side;
  b.setAttribute('aria-label', k ? 'Next sheet' : 'Previous sheet');
  b.innerHTML = `<svg viewBox="0 0 106 40" aria-hidden="true"${k ? '' : ' style="transform:scaleX(-1)"'}><path class="bs" d="${a.main}"/><path class="bs" d="${a.stub}"/><path class="hl" d="${a.dry}"/></svg>`;
  b.onclick = () => go(cur + (k ? 1 : -1), k ? 1 : -1);
  document.body.appendChild(b);
  return b;
});
function deskArrows() {
  const sr = stage.getBoundingClientRect(), gap = Math.min(sr.left, innerWidth - sr.right);
  darr.forEach((b, k) => {
    if (mob || gap < DARR.min) { b.hidden = true; return; }
    b.hidden = false;
    const w = Math.min(120, gap * 0.62), h = w * 40 / 106;
    const x = k ? sr.right + (gap - w) / 2 : sr.left - (gap + w) / 2;
    b.style.cssText = `left:${x.toFixed(0)}px;top:${(sr.top + sr.height / 2 - h / 2).toFixed(0)}px;width:${w.toFixed(0)}px;height:${h.toFixed(0)}px`;
    b.classList.toggle('off', k ? cur >= N - 1 : cur <= 0);
  });
}
addEventListener('resize', deskArrows);

const start = () => { go(fromHash()); startBreeze(); deskArrows(); const idle = window.requestIdleCallback || (f => setTimeout(f, 600)); idle(bakePaper, { timeout: 1500 }); idle(bakeVariants, { timeout: 2500 }); };
(document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]) : Promise.resolve()).then(() => { layout(); start(); });
