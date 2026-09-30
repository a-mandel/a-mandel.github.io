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
  live: { url: 'https://a-mandel.github.io/walsh/set/v2.html', show: ['a-mandel.github.io', '/walsh', '/set/v2.html'], label: 'The living set' },
  marks: { lockup: '../../marks/am10_lockup.webp', mark: '../../marks/am10_mark.webp', name: '../../marks/am10_name.webp' },
  count: 17, index: 7,
  sheet: { id: 'A2.1', group: 'Architectural', title: 'Level 1 plan', foot: 'Level 1 plan', scale: '3/16 in = 1 ft',
    cap: 'Living, kitchen, bridge and suites on one main floor, wrapped around the front court tree.',
    data: ['One main floor, one elevation', 'Living room double height', 'Dining on the bridge, about 20 ft wide', 'Granny suite at the main level'],
    notes: [ { v: 0, text: 'the court wraps the tree', t: [.6, .2], p: [.48, .42], a: 'l' }, { v: 0, text: 'living room tip, all glass', t: [.6, .86], p: [.8, .64], a: 'r' } ] }
};

const QR = { size: 41, d: 'M2 2h7v1h-7zM11 2h1v1h-1zM14 2h1v1h-1zM18 2h4v1h-4zM24 2h1v1h-1zM27 2h2v1h-2zM32 2h7v1h-7zM2 3h1v1h-1zM8 3h1v1h-1zM10 3h1v1h-1zM14 3h1v1h-1zM16 3h1v1h-1zM20 3h2v1h-2zM28 3h1v1h-1zM30 3h1v1h-1zM32 3h1v1h-1zM38 3h1v1h-1zM2 4h1v1h-1zM4 4h3v1h-3zM8 4h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM14 4h1v1h-1zM21 4h4v1h-4zM28 4h1v1h-1zM32 4h1v1h-1zM34 4h3v1h-3zM38 4h1v1h-1zM2 5h1v1h-1zM4 5h3v1h-3zM8 5h1v1h-1zM10 5h5v1h-5zM17 5h1v1h-1zM19 5h1v1h-1zM21 5h3v1h-3zM25 5h3v1h-3zM32 5h1v1h-1zM34 5h3v1h-3zM38 5h1v1h-1zM2 6h1v1h-1zM4 6h3v1h-3zM8 6h1v1h-1zM12 6h1v1h-1zM16 6h2v1h-2zM20 6h3v1h-3zM24 6h2v1h-2zM28 6h1v1h-1zM30 6h1v1h-1zM32 6h1v1h-1zM34 6h3v1h-3zM38 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM12 7h1v1h-1zM14 7h1v1h-1zM17 7h2v1h-2zM20 7h1v1h-1zM22 7h1v1h-1zM24 7h1v1h-1zM28 7h1v1h-1zM30 7h1v1h-1zM32 7h1v1h-1zM38 7h1v1h-1zM2 8h7v1h-7zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h1v1h-1zM26 8h1v1h-1zM28 8h1v1h-1zM30 8h1v1h-1zM32 8h7v1h-7zM10 9h2v1h-2zM15 9h1v1h-1zM21 9h2v1h-2zM25 9h1v1h-1zM28 9h1v1h-1zM30 9h1v1h-1zM2 10h1v1h-1zM8 10h1v1h-1zM10 10h4v1h-4zM16 10h2v1h-2zM20 10h4v1h-4zM26 10h3v1h-3zM30 10h3v1h-3zM35 10h3v1h-3zM2 11h2v1h-2zM6 11h2v1h-2zM9 11h4v1h-4zM14 11h2v1h-2zM19 11h1v1h-1zM22 11h1v1h-1zM24 11h2v1h-2zM29 11h1v1h-1zM31 11h1v1h-1zM33 11h3v1h-3zM37 11h1v1h-1zM4 12h1v1h-1zM6 12h1v1h-1zM8 12h1v1h-1zM13 12h1v1h-1zM16 12h1v1h-1zM19 12h1v1h-1zM22 12h3v1h-3zM26 12h2v1h-2zM29 12h3v1h-3zM33 12h3v1h-3zM37 12h2v1h-2zM2 13h2v1h-2zM6 13h1v1h-1zM13 13h2v1h-2zM17 13h2v1h-2zM20 13h1v1h-1zM28 13h7v1h-7zM38 13h1v1h-1zM3 14h2v1h-2zM8 14h1v1h-1zM10 14h1v1h-1zM12 14h3v1h-3zM16 14h1v1h-1zM18 14h1v1h-1zM21 14h2v1h-2zM25 14h2v1h-2zM30 14h1v1h-1zM32 14h2v1h-2zM35 14h1v1h-1zM38 14h1v1h-1zM3 15h2v1h-2zM6 15h2v1h-2zM9 15h1v1h-1zM11 15h5v1h-5zM17 15h5v1h-5zM25 15h1v1h-1zM29 15h2v1h-2zM33 15h1v1h-1zM35 15h1v1h-1zM2 16h1v1h-1zM7 16h2v1h-2zM11 16h1v1h-1zM14 16h1v1h-1zM16 16h4v1h-4zM22 16h2v1h-2zM26 16h1v1h-1zM28 16h8v1h-8zM37 16h2v1h-2zM4 17h3v1h-3zM9 17h4v1h-4zM14 17h1v1h-1zM18 17h4v1h-4zM24 17h2v1h-2zM28 17h1v1h-1zM31 17h1v1h-1zM33 17h1v1h-1zM35 17h4v1h-4zM4 18h1v1h-1zM7 18h6v1h-6zM16 18h3v1h-3zM21 18h1v1h-1zM23 18h1v1h-1zM25 18h1v1h-1zM27 18h1v1h-1zM31 18h2v1h-2zM34 18h1v1h-1zM36 18h3v1h-3zM2 19h1v1h-1zM6 19h2v1h-2zM10 19h1v1h-1zM14 19h1v1h-1zM20 19h1v1h-1zM22 19h2v1h-2zM25 19h1v1h-1zM27 19h1v1h-1zM29 19h1v1h-1zM35 19h3v1h-3zM3 20h2v1h-2zM7 20h5v1h-5zM14 20h2v1h-2zM17 20h1v1h-1zM19 20h1v1h-1zM22 20h11v1h-11zM34 20h1v1h-1zM36 20h1v1h-1zM38 20h1v1h-1zM4 21h1v1h-1zM7 21h1v1h-1zM10 21h3v1h-3zM15 21h2v1h-2zM20 21h3v1h-3zM26 21h1v1h-1zM31 21h3v1h-3zM35 21h1v1h-1zM38 21h1v1h-1zM3 22h1v1h-1zM5 22h1v1h-1zM7 22h4v1h-4zM12 22h2v1h-2zM17 22h1v1h-1zM19 22h1v1h-1zM21 22h1v1h-1zM24 22h5v1h-5zM31 22h2v1h-2zM34 22h1v1h-1zM36 22h1v1h-1zM2 23h2v1h-2zM5 23h2v1h-2zM9 23h3v1h-3zM13 23h1v1h-1zM15 23h1v1h-1zM17 23h1v1h-1zM21 23h1v1h-1zM23 23h1v1h-1zM25 23h3v1h-3zM29 23h2v1h-2zM34 23h1v1h-1zM36 23h1v1h-1zM2 24h1v1h-1zM4 24h1v1h-1zM7 24h4v1h-4zM12 24h2v1h-2zM17 24h2v1h-2zM20 24h1v1h-1zM22 24h1v1h-1zM24 24h1v1h-1zM27 24h4v1h-4zM32 24h4v1h-4zM37 24h2v1h-2zM4 25h1v1h-1zM11 25h1v1h-1zM18 25h1v1h-1zM23 25h1v1h-1zM28 25h8v1h-8zM38 25h1v1h-1zM3 26h1v1h-1zM5 26h1v1h-1zM8 26h1v1h-1zM12 26h1v1h-1zM15 26h2v1h-2zM18 26h3v1h-3zM23 26h1v1h-1zM26 26h1v1h-1zM30 26h1v1h-1zM32 26h2v1h-2zM38 26h1v1h-1zM2 27h1v1h-1zM5 27h1v1h-1zM9 27h1v1h-1zM11 27h1v1h-1zM14 27h3v1h-3zM18 27h1v1h-1zM25 27h1v1h-1zM28 27h3v1h-3zM33 27h1v1h-1zM2 28h1v1h-1zM6 28h1v1h-1zM8 28h1v1h-1zM11 28h1v1h-1zM13 28h1v1h-1zM16 28h1v1h-1zM19 28h2v1h-2zM22 28h3v1h-3zM26 28h2v1h-2zM29 28h3v1h-3zM36 28h3v1h-3zM2 29h1v1h-1zM6 29h2v1h-2zM11 29h2v1h-2zM15 29h1v1h-1zM17 29h1v1h-1zM20 29h1v1h-1zM22 29h1v1h-1zM25 29h1v1h-1zM28 29h3v1h-3zM33 29h4v1h-4zM38 29h1v1h-1zM2 30h1v1h-1zM4 30h1v1h-1zM6 30h1v1h-1zM8 30h5v1h-5zM15 30h1v1h-1zM19 30h1v1h-1zM24 30h15v1h-15zM10 31h3v1h-3zM14 31h2v1h-2zM17 31h6v1h-6zM25 31h1v1h-1zM30 31h1v1h-1zM34 31h1v1h-1zM2 32h7v1h-7zM12 32h2v1h-2zM15 32h1v1h-1zM17 32h1v1h-1zM21 32h5v1h-5zM30 32h1v1h-1zM32 32h1v1h-1zM34 32h1v1h-1zM38 32h1v1h-1zM2 33h1v1h-1zM8 33h1v1h-1zM11 33h1v1h-1zM13 33h1v1h-1zM18 33h5v1h-5zM24 33h2v1h-2zM29 33h2v1h-2zM34 33h1v1h-1zM2 34h1v1h-1zM4 34h3v1h-3zM8 34h1v1h-1zM11 34h2v1h-2zM14 34h2v1h-2zM18 34h1v1h-1zM21 34h1v1h-1zM23 34h1v1h-1zM25 34h3v1h-3zM29 34h6v1h-6zM36 34h2v1h-2zM2 35h1v1h-1zM4 35h3v1h-3zM8 35h1v1h-1zM12 35h1v1h-1zM15 35h1v1h-1zM18 35h1v1h-1zM20 35h1v1h-1zM25 35h3v1h-3zM29 35h1v1h-1zM31 35h2v1h-2zM38 35h1v1h-1zM2 36h1v1h-1zM4 36h3v1h-3zM8 36h1v1h-1zM11 36h3v1h-3zM17 36h2v1h-2zM21 36h1v1h-1zM26 36h3v1h-3zM37 36h2v1h-2zM2 37h1v1h-1zM8 37h1v1h-1zM11 37h3v1h-3zM16 37h1v1h-1zM21 37h2v1h-2zM25 37h2v1h-2zM28 37h4v1h-4zM34 37h2v1h-2zM38 37h1v1h-1zM2 38h7v1h-7zM10 38h2v1h-2zM17 38h2v1h-2zM20 38h1v1h-1zM22 38h1v1h-1zM24 38h3v1h-3zM30 38h4v1h-4zM38 38h1v1h-1z' };

/* the corner in the breeze: gusts with a quick lift and a slow settle, still air between them */
const FLUTTER = { lift: 0.95, rest: 0.1, curl: 0.16, turnRest: 154, turnPeak: 124, skew: 1.355, shadow: 0.24, loop: 96, seed: 11 };

const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const U = n => `calc(var(--u) * ${+(+n).toFixed(4)})`;
const pad2 = n => String(n).padStart(2, '0');
const K = 0.738;            // dx/dy of the roof stroke, 53.6 degrees from horizontal
const LOCK_PX = { w: 357, h: 520, env: 23 };   // stroke envelope x = 23 + 0.738 y (lockup px)
const RM = matchMedia('(prefers-reduced-motion: reduce)');

function mount(o) {
  const BL = o.borderLeft || 1.4;          // border clears the 1 in binding and the side ruler
  const tbx = o.tbx || 32;
  const lock = Object.assign({ w: 2.14, dx: 0.86, y: 0.84 }, o.lock || {});
  lock.x = lock.x != null ? lock.x : tbx + lock.dx;
  const LK = lock.w / LOCK_PX.w;
  const gap = o.gap != null ? o.gap : 0.34;
  const aCut = lock.x + LOCK_PX.env * LK - K * lock.y + gap;        // cut line: X = aCut + K * Y
  const V1 = [aCut + K * 0.5, 0.5], V2 = [35.5, (35.5 - aCut) / K];
  const lockBottom = lock.y + lock.w * LOCK_PX.h / LOCK_PX.w;
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
    cutX: y => aCut + K * y, tbw: 35.5 - tbx,
    iss: SET.issuances.slice().reverse(),
    qr: cls => `<svg class="qr ${cls || ''}" viewBox="0 0 ${QR.size} ${QR.size}" shape-rendering="crispEdges" role="img" aria-label="QR code for the living set"><rect width="${QR.size}" height="${QR.size}"/><path d="${QR.d}"/></svg>`,
    cells: s => [...s].map(ch => `<span class="fc${ch === '.' ? ' pt' : ''}">${ch}</span>`).join(''),
    lockImg: (style, cls) => `<img class="lock ${cls || ''}" src="${SET.marks.lockup}" alt="André Mandel" width="357" height="520" style="${style}">`,
  };
  c.f = frags(c);

  /* frame: border with the corner cut, the rule, and the true inch ruler */
  function borderPath() {
    const r = 0.38, dx = K / Math.hypot(K, 1), dy = 1 / Math.hypot(K, 1), f = n => +n.toFixed(4);
    return `M${f(BL + R)} 0.5 H${f(V1[0] - r)} Q${f(V1[0])} 0.5 ${f(V1[0] + r * dx)} ${f(0.5 + r * dy)} ` +
      `L${f(V2[0] - r * dx)} ${f(V2[1] - r * dy)} Q35.5 ${f(V2[1])} 35.5 ${f(V2[1] + r)} ` +
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
      bd = `<path class="bd" d="M${BL} ${0.5 + m} V0.5 H${BL + m} M${BL} ${23.5 - m} V23.5 H${BL + m} M${35.5 - m} 23.5 H35.5 V${23.5 - m} M${V1[0] - m} 0.5 H${V1[0]} L${V2[0]} ${V2[1]} V${V2[1] + m}"/>`;
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

  function curlSVG() {
    return `<svg class="curl" viewBox="-3 0 3 3" aria-hidden="true"><defs>
      <linearGradient id="cg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6d2c8"/><stop offset=".5" stop-color="#e6e3dc"/><stop offset="1" stop-color="#f4f2ed"/></linearGradient>
      <linearGradient id="cr" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2dfd7"/><stop offset="1" stop-color="#f1efe9"/></linearGradient>
      <filter id="cb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".05"/></filter></defs>
      <path fill="url(#cr)" d=""/><path fill="#1b1a18" filter="url(#cb)" d=""/><path class="flap" fill="url(#cg)" d=""/><path class="hl" d=""/></svg>`;
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
    <div class="bindg" aria-hidden="true">${[3, 9, 15, 21].map(y => `<i class="rv" style="top:${U(y)}"></i>`).join('')}</div>
    ${curlSVG()}</div>`;
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

  /* the breeze */
  const rnd = (s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; })(FLUTTER.seed);
  const gusts = [];
  for (let t = 0.8; t < FLUTTER.loop - 7;) {
    const a = 0.18 + rnd() * 0.22, dcy = 1.2 + rnd() * 1.6, A = 0.3 + rnd() * 0.7;
    let pk = 0; for (let x = 0; x < 6; x += 0.02) pk = Math.max(pk, (1 - Math.exp(-x / a)) * Math.exp(-x / dcy));
    gusts.push({ t, a, d: dcy, A: A / pk });
    t += (rnd() < 0.3 ? 0.7 + rnd() * 1.2 : 2.4 + rnd() * 5.2);   // sometimes a double gust, sometimes long stillness
  }
  function lift(t) {
    t = ((t % FLUTTER.loop) + FLUTTER.loop) % FLUTTER.loop;
    let env = 0;
    for (const g of gusts) { const x = t - g.t; if (x > 0 && x < 14) env += g.A * (1 - Math.exp(-x / g.a)) * Math.exp(-x / g.d); }
    env = Math.min(1.05, env);
    const TAU = Math.PI * 2;
    const flick = env * (0.09 * Math.sin(TAU * t / 0.43 + 0.3) + 0.055 * Math.sin(TAU * t / 0.27 + 1.1) + 0.045 * Math.sin(TAU * t / 0.71 + 2.3));
    const breath = 0.035 * (0.5 + 0.5 * Math.sin(TAU * t / 11.3)) + 0.02 * (0.5 + 0.5 * Math.sin(TAU * t / 4.7 + 1));
    return Math.max(0, Math.min(1, env * 0.92 + flick + breath));
  }
  function shape(t) {
    const L = lift(t), TAU = Math.PI * 2;
    const a = FLUTTER.rest + (FLUTTER.lift - FLUTTER.rest) * L;
    const b = a * (FLUTTER.skew + 0.08 * Math.sin(TAU * t / 3.1 + 2.1) * (0.3 + L));
    const turn = (FLUTTER.turnRest + (FLUTTER.turnPeak - FLUTTER.turnRest) * L + 3.5 * L * Math.sin(TAU * t / 0.61) + 1.5 * Math.sin(TAU * t / 5.3)) * Math.PI / 180;
    const P = [-a, 0], Q = [0, b], dd = a * a + b * b;
    const F = [-a + a * a * a / dd, a * a * b / dd], n = [-F[0], -F[1]], cc = Math.cos(turn);
    return { P, Q, F, T: [F[0] + n[0] * cc, F[1] + n[1] * cc], n, L };
  }
  function bow(A, B, away, k) {
    const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = [B[0] - A[0], B[1] - A[1]], len = Math.hypot(d[0], d[1]) || 1;
    let p = [-d[1] / len, d[0] / len];
    if ((m[0] - away[0]) * p[0] + (m[1] - away[1]) * p[1] < 0) p = [-p[0], -p[1]];
    return [m[0] + p[0] * len * k, m[1] + p[1] * len * k];
  }
  const f4 = v => v.toFixed(4), pt = p => `${f4(p[0])} ${f4(p[1])}`;
  const sv = sheet.querySelector('.curl');
  function draw(S) {
    const { P, Q, T, n, L } = S, cu = FLUTTER.curl * (0.85 + 0.3 * L);
    const hinge = bow(Q, P, T, cu * 0.5), e1 = bow(P, T, Q, cu), e2 = bow(T, Q, P, cu);
    const sz = Math.hypot(n[0], n[1]), sh = [-0.06 * sz - 0.01, 0.1 * sz + 0.012 + 0.05 * L], mv = p => [p[0] + sh[0], p[1] + sh[1]];
    const q = sv.querySelectorAll('path');
    q[0].setAttribute('d', `M${pt(P)} L0 0 L${pt(Q)} Q${pt(hinge)} ${pt(P)} Z`);
    q[1].setAttribute('d', `M${pt(P)} Q${pt(mv(e1))} ${pt(mv(T))} Q${pt(mv(e2))} ${pt(Q)} Q${pt(hinge)} ${pt(P)} Z`);
    q[1].setAttribute('opacity', (FLUTTER.shadow * Math.min(1, sz / 0.25) * (0.8 + 0.5 * L)).toFixed(3));
    q[2].setAttribute('d', `M${pt(P)} Q${pt(e1)} ${pt(T)} Q${pt(e2)} ${pt(Q)} Q${pt(hinge)} ${pt(P)} Z`);
    q[3].setAttribute('d', `M${pt(Q)} Q${pt(hinge)} ${pt(P)}`);
    const H = [(hinge[0] + (P[0] + Q[0]) / 2) / 2, (hinge[1] + (P[1] + Q[1]) / 2) / 2];
    const g = sv.querySelector('#cg'), r = sv.querySelector('#cr');
    g.setAttribute('x1', f4(H[0])); g.setAttribute('y1', f4(H[1])); g.setAttribute('x2', f4(T[0])); g.setAttribute('y2', f4(T[1]));
    r.setAttribute('x1', f4(H[0])); r.setAttribute('y1', f4(H[1])); r.setAttribute('x2', '0'); r.setAttribute('y2', '0');
  }
  const br = { t0: performance.now(), raf: 0, frozen: false };
  function frameLoop(now) { br.raf = 0; if (document.hidden || RM.matches || br.frozen) return; draw(shape((now - br.t0) / 1000)); br.raf = requestAnimationFrame(frameLoop); }
  const startBreeze = () => { if (!br.raf && !RM.matches && !br.frozen) br.raf = requestAnimationFrame(frameLoop); };
  draw(shape(0));
  document.addEventListener('visibilitychange', startBreeze);
  window.__breeze = s => { br.frozen = true; cancelAnimationFrame(br.raf); br.raf = 0; draw(shape(s)); };
  window.__lift = lift;
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
