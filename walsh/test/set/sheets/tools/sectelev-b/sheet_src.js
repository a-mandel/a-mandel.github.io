/* sectelev-b crew sheets: A5.0 interior elevations, A5.1 exterior materials and colors.
   Built by sheets/tools/sectelev-b/build.py, which inlines the north wing plan pulled from the pocket model
   (extract_plan.py). Edit sheet_src.js, then run build.py. */
(function () {
  const PLAN = /*PLAN_DATA*/null;

  /* ------------------------------------------------------------ shared bits */
  const f3 = v => +(+v).toFixed(3);
  const pc = v => +(v * 100).toFixed(3);
  function rng(seed) {                       // mulberry32, so every sample reads the same on every load
    let a = seed >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function shade(hex, k) {                   // k in -1..1, darken or lighten
    const n = parseInt(hex.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255];
    const o = c.map(v => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k));
    return '#' + o.map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
  }
  const ftin = v => { let ft = Math.floor(v + 1e-6), inch = Math.round((v - ft) * 12); if (inch === 12) { ft++; inch = 0; } return `${ft}′ ${inch}″`; };
  const NS = 'vector-effect="non-scaling-stroke"';
  const ln = (x1, y1, x2, y2, w = .6, extra = '') => `<line x1="${f3(x1)}" y1="${f3(y1)}" x2="${f3(x2)}" y2="${f3(y2)}" stroke="#1b1a18" stroke-width="${w}" ${NS} ${extra}/>`;
  const rc = (x, y, w, h, st = 'fill="none" stroke="#1b1a18" stroke-width=".6"', extra = '') => `<rect x="${f3(x)}" y="${f3(y)}" width="${f3(w)}" height="${f3(h)}" ${st} ${NS} ${extra}/>`;
  const pth = (d, st) => `<path d="${d}" ${st} ${NS}/>`;
  const poly = pts => 'M' + pts.map(p => `${f3(p[0])} ${f3(p[1])}`).join(' L') + 'Z';

  const CSS = `<style>
  .seb{--sb:max(calc(7.5px * var(--fl)),calc(var(--u) * .105));--si:max(calc(9px * var(--fl)),calc(var(--u) * .135));--sh3:max(calc(10px * var(--fl)),calc(var(--u) * .2))}
  .seb-v{position:absolute}
  .seb-v .dsvg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .seb-v .simg{position:absolute;inset:0;width:100%;height:100%;max-width:none}
  .seb-key{position:absolute;transform:translate(-50%,-50%);width:max(calc(15px * var(--fl)),calc(var(--u) * .3));height:max(calc(15px * var(--fl)),calc(var(--u) * .3));border:1px solid var(--ink);border-radius:50%;background:var(--paper);
    display:grid;place-items:center;font:400 max(calc(7.5px * var(--fl)),calc(var(--u) * .115))/1 var(--ft);letter-spacing:.02em;color:var(--ink);pointer-events:none}
  .seb-board{position:absolute;inset:0;border-radius:calc(var(--u) * .04);background:linear-gradient(170deg,#f1efe9,#e9e6df 70%,#e4e1d9);
    box-shadow:0 0 0 1px rgba(27,26,24,.1),0 calc(var(--u) * .05) calc(var(--u) * .18) rgba(27,26,24,.16)}
  .seb-chip{position:absolute;overflow:hidden;border-radius:1px;box-shadow:0 0 0 .5px rgba(27,26,24,.35),0 calc(var(--u) * .03) calc(var(--u) * .07) rgba(27,26,24,.3)}
  .seb-chip svg{position:absolute;inset:0;width:100%;height:100%}
  .seb-cap{position:absolute;display:grid;grid-template-columns:auto 1fr;column-gap:calc(var(--u) * .1);align-items:start;line-height:1.18}
  .seb-cap .seb-key{position:static;transform:none;grid-row:span 2;margin-top:-.1em}
  .seb-cap b{font:400 var(--sb)/1.25 var(--ft);letter-spacing:.14em;text-transform:uppercase;white-space:nowrap}
  .seb-cap i{font:italic 400 var(--si)/1.2 var(--fs);color:var(--muted)}
  .seb-bh{position:absolute;display:flex;flex-direction:column;gap:calc(var(--u) * .04)}
  .seb-bh b{font:400 max(calc(9px * var(--fl)),calc(var(--u) * .17))/1 var(--ft);letter-spacing:.3em;text-transform:uppercase}
  .seb-bh i{font:italic 400 var(--si)/1.2 var(--fs);color:var(--muted)}
  .seb-bh.r{align-items:flex-end;text-align:right}
  .seb-blk{position:absolute}
  .seb-blk h3{margin:0 0 calc(var(--u) * .1);font:400 var(--sh3)/1.1 var(--ft);letter-spacing:.18em;text-transform:uppercase}
  .seb-blk .sub{margin:0 0 calc(var(--u) * .12);font:italic 400 var(--si)/1.25 var(--fs);color:var(--muted)}
  .seb-list{list-style:none;margin:0;padding:0}
  .seb-list li{padding:calc(var(--u) * .13) 0 calc(var(--u) * .05);background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .1);font:italic 400 var(--si)/1.25 var(--fs)}
  .seb-list li em{display:block;font:400 max(calc(7px * var(--fl)),calc(var(--u) * .095))/1.3 var(--ft);font-style:normal;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
  .seb-list li.c em{color:var(--accent)}
  .seb-tab{display:grid;column-gap:calc(var(--u) * .18)}
  .seb-tab > span{padding:calc(var(--u) * .12) 0 calc(var(--u) * .03);background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u) * .09);font:italic 400 var(--si)/1.2 var(--fs);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .seb-tab > span.k{font:400 var(--sb)/1.5 var(--ft);font-style:normal;letter-spacing:.1em;color:var(--ink)}
  .seb-tab > span.hd{font:400 max(calc(7px * var(--fl)),calc(var(--u) * .095))/1.3 var(--ft);font-style:normal;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);background:none;padding-top:0}
  .seb-tab > span.gp{grid-column:1 / -1;font:400 var(--sb)/1.2 var(--ft);font-style:normal;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);padding-top:calc(var(--u) * .2);background:none}
  .seb-tab > span.cf{color:var(--accent)}
  @media screen and (max-width:760px) and (orientation:portrait), screen and (max-width:760px) and (min-height:541px), screen and (max-width:760px) and (pointer:fine), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
    .seb-cap,.seb-bh{display:none}
    .seb-key{width:13px;height:13px;font-size:7px}
    .seb-blk{position:relative !important;left:auto !important;top:auto !important;width:auto !important;margin:0 0 30px}
    .fhtml:has(> .seb){position:relative;inset:auto;padding-bottom:56px}
    .seb .view.seb-v{margin-bottom:70px}
    .seb-tab{grid-template-columns:30px 1.4fr 1fr !important}
    .seb-tab > span.c1,.seb-tab > span.c3{display:none}
    .seb-tab > span{white-space:normal}
  }
  @media print{.seb-board,.seb-chip{box-shadow:0 0 0 1px rgba(27,26,24,.25)}}
  </style>`;

  /* texture filters, userSpaceOnUse so grain frequencies are per sheet inch */
  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <filter id="seb-gv" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="7 .28" numOctaves="3" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 .16  0 0 0 0 .14  0 0 0 0 .12  1.5 0 0 0 -.62"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="seb-gvl" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="5 .2" numOctaves="2" seed="11"/><feColorMatrix type="matrix" values="0 0 0 0 .96  0 0 0 0 .95  0 0 0 0 .92  1.4 0 0 0 -.6"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="seb-gh" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency=".22 8" numOctaves="3" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .3  0 0 0 0 .16  0 0 0 0 .06  1.5 0 0 0 -.6"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="seb-mo" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="4" seed="2"/><feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .09  0 0 0 0 .08  1.3 0 0 0 -.5"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="seb-mol" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="4" seed="9"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 .98  0 0 0 0 .94  1.3 0 0 0 -.55"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="seb-sp" x="0" y="0" width="1" height="1" primitiveUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="22" numOctaves="1" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 .1  0 0 0 0 .09  0 0 0 0 .08  3 0 0 0 -1.75"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <linearGradient id="seb-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#aebcc0"/><stop offset=".55" stop-color="#cfd8d8"/><stop offset="1" stop-color="#e3e7e3"/></linearGradient>
    <linearGradient id="seb-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
    <linearGradient id="seb-pan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".1"/><stop offset=".45" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>
  </defs></svg>`;
  const over = (w, h, id, op = 1) => `<rect width="${f3(w)}" height="${f3(h)}" fill="#000" filter="url(#${id})" opacity="${op}"/>`;

  /* ------------------------------------------------------------ the samples (w, h in sheet inches) */
  const PAINT = {
    cedar(w, h, r) {           // silvered cedar, vertical boards, semi transparent grey stain
      let s = '', x = 0, bw = .44;
      while (x < w) {
        const t = shade('#979186', (r() - .5) * .24);
        s += rc(x, 0, bw, h, `fill="${t}" stroke="none"`);
        s += `<rect x="${f3(x)}" y="0" width=".018" height="${f3(h)}" fill="#4f4a43" opacity=".7"/><rect x="${f3(x + .018)}" y="0" width=".012" height="${f3(h)}" fill="#e2ddd3" opacity=".5"/>`;
        if (r() < .35) { const ky = r() * h; s += `<ellipse cx="${f3(x + bw * (.3 + r() * .4))}" cy="${f3(ky)}" rx=".05" ry=".11" fill="#5b554c" opacity=".45"/>`; }
        x += bw;
      }
      return s + over(w, h, 'seb-gv', .9) + over(w, h, 'seb-gvl', .7) + `<rect width="${f3(w)}" height="${f3(h)}" fill="url(#seb-sheen)"/>`;
    },
    glulam(w, h, r) {          // warm timber, laminations
      let s = '', y = 0, lh = .15;
      while (y < h) {
        s += rc(0, y, w, lh, `fill="${shade('#c4884f', (r() - .5) * .14)}" stroke="none"`);
        s += `<rect x="0" y="${f3(y)}" width="${f3(w)}" height=".01" fill="#7c4b22" opacity=".45"/>`;
        y += lh;
      }
      return s + over(w, h, 'seb-gh', .85) + `<rect width="${f3(w)}" height="${f3(h)}" fill="url(#seb-sheen)"/>`;
    },
    seam(w, h) {               // standing seam, matte dark grey
      let s = rc(0, 0, w, h, 'fill="#5a5e62" stroke="none"'), x = -.1, pw = .72;
      while (x < w) {
        s += `<rect x="${f3(x)}" y="0" width="${f3(pw)}" height="${f3(h)}" fill="url(#seb-pan)"/>`;
        s += `<rect x="${f3(x + pw - .05)}" y="0" width=".035" height="${f3(h)}" fill="#8e9397"/><rect x="${f3(x + pw - .015)}" y="0" width=".03" height="${f3(h)}" fill="#34373a" opacity=".85"/>`;
        x += pw;
      }
      return s + over(w, h, 'seb-sp', .5) + over(w, h, 'seb-mo', .35);
    },
    bform(w, h, r) {           // board form concrete, 6 in boards, staggered butt joints, stained dark
      let s = rc(0, 0, w, h, 'fill="#86817a" stroke="none"'), y = 0, bh = .25;
      while (y < h) {
        let x = -r() * 1.4;
        while (x < w) {
          const L = 1.1 + r() * 1.3;
          s += rc(x, y, L, bh, `fill="${shade('#88837b', (r() - .5) * .12)}" stroke="none"`);
          s += `<rect x="${f3(x)}" y="${f3(y)}" width=".012" height="${f3(bh)}" fill="#4b4741" opacity=".6"/>`;
          x += L;
        }
        s += `<rect x="0" y="${f3(y)}" width="${f3(w)}" height=".01" fill="#4b4741" opacity=".55"/><rect x="0" y="${f3(y + .01)}" width="${f3(w)}" height=".008" fill="#c9c4bb" opacity=".45"/>`;
        y += bh;
      }
      for (let ty = .5; ty < h; ty += 1.0) for (let tx = .45; tx < w; tx += 1.0) s += `<circle cx="${f3(tx)}" cy="${f3(ty)}" r=".035" fill="#3f3b36" opacity=".75"/>`;
      return s + over(w, h, 'seb-gh', .3) + over(w, h, 'seb-mo', .45) + over(w, h, 'seb-sp', .5);
    },
    steel(w, h) {              // dark matte steel, a folded fascia edge along the top
      return rc(0, 0, w, h, 'fill="#2f2e2c" stroke="none"') + over(w, h, 'seb-mol', .28) + over(w, h, 'seb-sp', .6) +
        `<rect x="0" y="0" width="${f3(w)}" height=".16" fill="#4a4845"/><rect x="0" y=".16" width="${f3(w)}" height=".02" fill="#161514"/>` +
        `<rect width="${f3(w)}" height="${f3(h)}" fill="url(#seb-sheen)"/>`;
    },
    plaster(w, h, r) {         // warm hand troweled plaster
      let s = rc(0, 0, w, h, 'fill="#b3a590" stroke="none"');
      for (let k = 0; k < 16; k++) {
        const x = r() * w, y = r() * h, R = .3 + r() * .5, a = r() * 6.28;
        s += `<path d="M${f3(x)} ${f3(y)} a${f3(R)} ${f3(R * .55)} ${f3(a * 57)} 0 1 ${f3(R * 1.2)} ${f3(R * .2)}" fill="none" stroke="${r() < .5 ? '#fff' : '#6d624f'}" stroke-opacity=".07" stroke-width="${f3(.03 + r() * .05)}"/>`;
      }
      return s + over(w, h, 'seb-mol', .5) + over(w, h, 'seb-mo', .3);
    },
    glass(w, h) {              // clear glass, dark matte frame, square panes
      const fw = .17, m = w / 2;
      return rc(0, 0, w, h, 'fill="#2d2c2a" stroke="none"') + rc(fw, fw, w - 2 * fw, h - 2 * fw, 'fill="url(#seb-glass)" stroke="none"') +
        `<path d="M${f3(fw)} ${f3(h * .62)} L${f3(w * .55)} ${f3(fw)} L${f3(w * .75)} ${f3(fw)} L${f3(fw)} ${f3(h * .9)}Z" fill="#fff" opacity=".28"/>` +
        `<path d="M${f3(w * .6)} ${f3(h - fw)} L${f3(w - fw)} ${f3(h * .45)} L${f3(w - fw)} ${f3(h * .55)} L${f3(w * .7)} ${f3(h - fw)}Z" fill="#fff" opacity=".2"/>` +
        rc(m - .05, fw, .1, h - 2 * fw, 'fill="#2d2c2a" stroke="none"') + over(w, h, 'seb-mol', .18);
    },
    deck(w, h, r) {            // cedar decking, warm natural
      let s = rc(0, 0, w, h, 'fill="#3a2d22" stroke="none"'), y = .02, bh = .3;
      while (y < h) {
        let x = -r() * 2;
        while (x < w) {
          const L = 3.2 + r() * 4;
          s += rc(x + .01, y, L - .02, bh - .025, `fill="${shade('#93694a', (r() - .5) * .16)}" stroke="none"`);
          for (let jx = .5; jx < w; jx += 1.0) if (jx > x + .1 && jx < x + L - .1) s += `<circle cx="${f3(jx)}" cy="${f3(y + .08)}" r=".013" fill="#2a2018"/><circle cx="${f3(jx)}" cy="${f3(y + bh - .12)}" r=".013" fill="#2a2018"/>`;
          x += L;
        }
        y += bh;
      }
      return s + over(w, h, 'seb-gh', .7) + `<rect width="${f3(w)}" height="${f3(h)}" fill="url(#seb-sheen)"/>`;
    },
    stone(w, h, r) {           // regional flagstone, earth tone, tight joints: voronoi cells, each pulled in a hair
      let s = rc(0, 0, w, h, 'fill="#5e584f" stroke="none"');
      const n = Math.round(w * h * 2.6) + 4, pts = [];
      for (let i = 0; i < n; i++) pts.push([-.3 + r() * (w + .6), -.3 + r() * (h + .6)]);
      const tones = ['#8b8378', '#968b79', '#7f7c76', '#8f8474', '#857d71', '#9a9083'];
      pts.forEach((a, i) => {
        let cell = [[-.4, -.4], [w + .4, -.4], [w + .4, h + .4], [-.4, h + .4]];
        pts.forEach((b, j) => {
          if (i === j || !cell.length) return;
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = b[0] - a[0], ny = b[1] - a[1];
          const side = q => (q[0] - mx) * nx + (q[1] - my) * ny;   // keep side < 0
          const out = [];
          cell.forEach((q, k) => {
            const nq = cell[(k + 1) % cell.length], sq = side(q), sn = side(nq);
            if (sq <= 0) out.push(q);
            if ((sq < 0) !== (sn < 0)) { const t = sq / (sq - sn); out.push([q[0] + (nq[0] - q[0]) * t, q[1] + (nq[1] - q[1]) * t]); }
          });
          cell = out;
        });
        if (cell.length < 3) return;
        const c = cell.reduce((o, p) => [o[0] + p[0] / cell.length, o[1] + p[1] / cell.length], [0, 0]);
        const g = .035;                                          // joint half width
        const q = cell.map(p => { const dx = p[0] - c[0], dy = p[1] - c[1], L = Math.hypot(dx, dy) || 1; return [p[0] - dx / L * g, p[1] - dy / L * g]; });
        s += `<path d="${poly(q)}" fill="${shade(tones[Math.floor(r() * tones.length)], (r() - .5) * .1)}" stroke="${shade('#8b8378', .1)}" stroke-opacity=".25" stroke-width=".01" stroke-linejoin="round"/>`;
      });
      return s + over(w, h, 'seb-mo', .5) + over(w, h, 'seb-mol', .35) + over(w, h, 'seb-sp', .55);
    },
    hstone(w, h, r) {          // honed stone slab for the hearth, soft veining
      let s = rc(0, 0, w, h, 'fill="#8d877d" stroke="none"');
      for (let k = 0; k < 7; k++) { let x = r() * w, y = -.2, d = `M${f3(x)} ${f3(y)}`; while (y < h + .2) { y += .25 + r() * .3; x += (r() - .5) * .5; d += ` L${f3(x)} ${f3(y)}`; } s += `<path d="${d}" fill="none" stroke="${r() < .5 ? '#c9c3b8' : '#5a554d'}" stroke-opacity=".35" stroke-width="${f3(.01 + r() * .02)}"/>`; }
      s += `<rect x="0" y="${f3(h * .58)}" width="${f3(w)}" height=".012" fill="#4e4943" opacity=".6"/>`;
      return s + over(w, h, 'seb-mo', .4) + over(w, h, 'seb-mol', .3) + over(w, h, 'seb-sp', .35);
    },
    oak(w, h, r) {             // interior floor allowance, wide plank
      let s = '', x = 0, bw = .5;
      while (x < w) { s += rc(x, 0, bw, h, `fill="${shade('#b08a62', (r() - .5) * .14)}" stroke="none"`) + `<rect x="${f3(x)}" y="0" width=".01" height="${f3(h)}" fill="#5e4329" opacity=".5"/>`; x += bw; }
      return s + over(w, h, 'seb-gv', .5) + `<rect width="${f3(w)}" height="${f3(h)}" fill="url(#seb-sheen)"/>`;
    },
    ceiling(w, h, r) {         // warm wood ceiling, joists square to the fold
      let s = rc(0, 0, w, h, 'fill="#c58c55" stroke="none"'), y = 0;
      while (y < h) { s += rc(0, y, w, .12, `fill="${shade('#c99058', (r() - .5) * .12)}" stroke="none"`) + `<rect x="0" y="${f3(y)}" width="${f3(w)}" height=".008" fill="#7c4b22" opacity=".5"/>`; y += .12; }
      for (let jx = .3; jx < w; jx += .9) s += `<rect x="${f3(jx)}" y="0" width=".2" height="${f3(h)}" fill="#a86f3a" opacity=".55"/><rect x="${f3(jx + .2)}" y="0" width=".02" height="${f3(h)}" fill="#5c3818" opacity=".45"/>`;
      return s + over(w, h, 'seb-gh', .6);
    },
    wplaster(w, h, r) {        // interior plaster, warm white
      let s = rc(0, 0, w, h, 'fill="#e2dccf" stroke="none"');
      for (let k = 0; k < 12; k++) { const x = r() * w, y = r() * h, R = .3 + r() * .4; s += `<path d="M${f3(x)} ${f3(y)} a${f3(R)} ${f3(R * .5)} 0 0 1 ${f3(R * 1.3)} ${f3(R * .1)}" fill="none" stroke="#8a806f" stroke-opacity=".1" stroke-width="${f3(.04 + r() * .05)}"/>`; }
      return s + over(w, h, 'seb-mo', .18);
    },
    walnut(w, h, r) {          // cabinetry allowance, rift cut
      let s = '', x = 0, bw = .9;
      while (x < w) { s += rc(x, 0, bw, h, `fill="${shade('#6f5a48', (r() - .5) * .12)}" stroke="none"`) + `<rect x="${f3(x)}" y="0" width=".012" height="${f3(h)}" fill="#2b221a" opacity=".6"/>`; x += bw; }
      return s + over(w, h, 'seb-gv', .7) + `<rect width="${f3(w)}" height="${f3(h)}" fill="url(#seb-sheen)"/>`;
    }
  };
  function chip(ctx, kind, seed, left, top, w, h, W, H) {   // a sample, placed in % of its parent (W x H in)
    const r = rng(seed);
    return `<div class="seb-chip" style="left:${pc(left / W)}%;top:${pc(top / H)}%;width:${pc(w / W)}%;height:${pc(h / H)}%"><svg viewBox="0 0 ${f3(w)} ${f3(h)}" preserveAspectRatio="none" aria-hidden="true"><g>${PAINT[kind](w, h, r)}</g></svg></div>`;
  }
  const cap = (k, t, s, left, top, width, W, H) => `<div class="seb-cap" style="left:${pc(left / W)}%;top:${pc(top / H)}%;width:${pc(width / W)}%"><span class="seb-key">${k}</span><b>${ctx0.esc(t)}</b><i>${ctx0.esc(s)}</i></div>`;
  let ctx0 = null;

  /* a view at true scale: x, y sheet inches, vb = [x0, y0, w, h] in feet, sc = inches per foot */
  function dview(ctx, o) {
    const [x0, y0, vw, vh] = o.vb, w = vw * o.sc, h = vh * o.sc;
    const L = (o.labels || []).map(l => `<span class="lbl ${l.k || 'room'}" style="left:${pc((l.x - x0) / vw)}%;top:${pc((l.y - y0) / vh)}%"><b>${ctx.esc(l.t)}</b>${l.s ? `<i>${ctx.esc(l.s)}</i>` : ''}</span>`).join('');
    return `<div class="view dv seb-v" style="left:${ctx.U(ctx.FX(o.x))};top:${ctx.U(ctx.FY(o.y))};width:${ctx.U(w)};height:${ctx.U(h)};--ar:${(w / h).toFixed(4)}">
      <svg class="dsvg" viewBox="${f3(x0)} ${f3(y0)} ${f3(vw)} ${f3(vh)}" preserveAspectRatio="none" aria-hidden="true">${o.svg}</svg>${L}${o.extra || ''}${ctx.viewTitle(o.num, o.title, o.scale)}</div>`;
  }
  /* dimension strings in feet, ticks at 45 degrees, label placed by the caller */
  function dimH(x0, x1, y, e0, e1) {
    const t = .35;
    return ln(x0, y, x1, y, .6) + ln(x0 - t, y + t, x0 + t, y - t, .9) + ln(x1 - t, y + t, x1 + t, y - t, .9) +
      (e0 !== undefined ? ln(x0, e0, x0, y + (e0 > y ? -.3 : .3), .45, 'stroke-opacity=".6"') : '') + (e1 !== undefined ? ln(x1, e1, x1, y + (e1 > y ? -.3 : .3), .45, 'stroke-opacity=".6"') : '');
  }
  function dimV(y0, y1, x, e0, e1) {
    const t = .35;
    return ln(x, y0, x, y1, .6) + ln(x - t, y0 + t, x + t, y0 - t, .9) + ln(x - t, y1 + t, x + t, y1 - t, .9) +
      (e0 !== undefined ? ln(e0, y0, x + (e0 > x ? -.3 : .3), y0, .45, 'stroke-opacity=".6"') : '') + (e1 !== undefined ? ln(e1, y1, x + (e1 > x ? -.3 : .3), y1, .45, 'stroke-opacity=".6"') : '');
  }
  const HATCH = id => `<pattern id="${id}" width=".6" height=".6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2=".6" stroke="#1b1a18" stroke-width=".5" opacity=".5" ${NS}/></pattern>`;
  const leader = (x1, y1, x2, y2) => ln(x1, y1, x2, y2, .5, 'stroke-opacity=".75"') + `<circle cx="${f3(x2)}" cy="${f3(y2)}" r=".14" fill="#1b1a18"/>`;

  /* ============================================================ A5.0 interior elevations */
  const FF = 5997.5;
  function kitchenWall(ctx, x, y) {
    const C = 9.0;                                  // ceiling about 9 ft, under the kitchen roof at 6007.25
    const vb = [-24.0, -11.2, 29.0, 13.0];
    let s = `<defs>${HATCH('seb-h1')}</defs>`;
    s += rc(-21.08, -C - .9, .5, C + .9, 'fill="url(#seb-h1)" stroke="#1b1a18" stroke-width=".9"');          // west wall, cut
    s += rc(-20.58, -C - .9, 24.6, .9, 'fill="url(#seb-h1)" stroke="none"') + ln(-20.58, -C, 4.2, -C, 1.1);  // ceiling and roof structure
    s += ln(-21.6, 0, 4.2, 0, 1.4) + rc(-21.6, 0, 25.8, .45, 'fill="url(#seb-h1)" stroke="none"');         // floor
    // tall block, fridge and pantry
    s += rc(-19.78, -8.5, 6.7, 8.5, 'fill="rgba(27,26,24,.04)" stroke="#1b1a18" stroke-width=".9"');
    s += ln(-16.78, -8.5, -16.78, 0, .6) + ln(-14.93, -8.5, -14.93, 0, .5) + ln(-19.78, -.35, -13.08, -.35, .45);
    s += ln(-17.2, -5.2, -17.2, -3.4, 1.1) + ln(-15.3, -5.0, -15.3, -3.6, 1.1) + ln(-14.55, -5.0, -14.55, -3.6, 1.1);
    // base run, counter at 36 in
    s += rc(-13.08, -3.0, 16.08, .13, 'fill="#1b1a18" stroke="none"');
    s += rc(-13.08, -2.87, 16.08, 2.52, 'fill="none" stroke="#1b1a18" stroke-width=".7"') + ln(-13.08, -.35, 3.0, -.35, .45);
    [-11.58, -8.58, -7.0, -4.5, -2.5, -.5, 1.25].forEach(v => { s += ln(v, -2.87, v, -.35, .5); });
    [[-13.08, -11.58], [-.5, 1.25], [1.25, 3.0]].forEach(([a, b]) => { s += ln(a, -1.9, b, -1.9, .4) + ln(a, -1.1, b, -1.1, .4); });
    s += rc(-11.4, -2.6, 2.64, 1.6, 'fill="none" stroke="#1b1a18" stroke-width=".5"');                    // range, placeholder
    [-10.9, -10.3, -9.7, -9.1].forEach(v => { s += `<circle cx="${v}" cy="-2.75" r=".09" fill="#1b1a18"/>`; });
    s += `<path d="M-11.58 -5.6 L-8.58 -5.6 L-9.1 -${C} L-11.06 -${C} Z" fill="rgba(27,26,24,.05)" stroke="#1b1a18" stroke-width=".8" ${NS}/>`; // plaster hood
    // window over the sink, two square 4 ft panes, dark frames
    s += rc(-7.5, -7.5, 8.0, 4.0, 'fill="rgba(160,178,184,.14)" stroke="#1b1a18" stroke-width="1.2"') + ln(-3.5, -7.5, -3.5, -3.5, 1.0);
    s += `<path d="M-6.8 -4.1 L-4.9 -7.0 M-6.1 -4.1 L-4.5 -6.6 M-2.6 -4.1 L-.9 -6.9" stroke="#1b1a18" stroke-opacity=".25" stroke-width=".5" ${NS}/>`;
    s += rc(-4.5, -3.13, 2.0, .06, 'fill="#fff" stroke="#1b1a18" stroke-width=".5"');                     // sink
    s += ln(-3.5, -3.13, -3.5, -3.8, .8) + ln(-3.5, -3.8, -3.1, -3.8, .8);
    // open shelves
    [-5.6, -7.0].forEach(v => { s += rc(-13.08, v, 1.5, .1, 'fill="#1b1a18" stroke="none"') + rc(.5, v, 2.5, .1, 'fill="#1b1a18" stroke="none"'); });
    s += ln(3.0, -C, 3.0, 0, .6, 'stroke-dasharray="4 3"');                                               // open to the bridge
    // dims
    s += dimH(-19.78, 3.0, -10.35, -8.9, -3.4) + dimV(-C, 0, 3.9, 3.2) + dimV(-8.5, 0, -21.9, -20.1);
    return dview(ctx, {
      x, y, vb, sc: .25, svg: s, num: 2, title: 'Kitchen wall', scale: '1/4 in = 1 ft · concept',
      labels: [
        { x: -8.39, y: -10.35, t: ftin(22.78), k: 'dim' },
        { x: -16.4, y: -6.9, t: 'Tall', s: 'fridge and pantry' },
        { x: -10.1, y: -7.45, t: 'Hood', s: 'plaster' },
        { x: -3.5, y: -5.5, t: 'Window', s: '4 ft panes' },
        { x: 1.75, y: -6.3, t: 'Shelves' },
        { x: -23.0, y: -4.25, t: '8′ 6″', k: 'dim' },
        { x: -5.6, y: -1.62, t: 'Base', s: 'allowance' },
        { x: 5.3, y: -4.5, t: ftin(C), k: 'dim' }
      ]
    });
  }
  function island(ctx, x, y) {
    const vb = [-.9, -4.5, 12.6, 5.6];
    let s = `<defs>${HATCH('seb-h2')}</defs>`;
    s += ln(-.9, 0, 11.7, 0, 1.4) + rc(-.9, 0, 12.6, .45, 'fill="url(#seb-h2)" stroke="none"');
    s += rc(0, -3.0, 10, .13, 'fill="#1b1a18" stroke="none"') + rc(.15, -2.87, 9.7, 2.87, 'fill="rgba(27,26,24,.04)" stroke="#1b1a18" stroke-width=".8"');
    s += ln(.15, -2.35, 9.85, -2.35, .4, 'stroke-dasharray="3 2"');
    [2.0, 5.0, 8.0].forEach(c => {                        // stools, placeholder
      s += `<path d="M${c - .75} -2.1 L${c + .75} -2.1 M${c - .6} -2.1 L${c - .75} 0 M${c + .6} -2.1 L${c + .75} 0 M${c - .68} -.9 L${c + .68} -.9" fill="none" stroke="#1b1a18" stroke-width=".7" stroke-dasharray="3 2" ${NS}/>`;
    });
    s += dimH(0, 10, -3.95, -3.2, -3.2);
    return dview(ctx, {
      x, y, vb, sc: .25, svg: s, num: 3, title: 'Island, dining side', scale: '1/4 in = 1 ft · concept',
      labels: [{ x: 5, y: -3.95, t: '10′ 0″', k: 'dim' }]
    });
  }
  function fireplaceWall(ctx, x, y) {
    // looking square at the chimney face, which sits about 22 degrees off the wing, parallel to the living room
    const vb = [-7.6, -17.6, 23.9, 19.2];
    const cl = s0 => -(14.5 + (s0 + 6.5) * 1.5 / 21);   // the ceiling follows the ribbon, about 14 ft 6 in rising to 16 ft
    const x0 = -6.5, x1 = 14.5, cH = 1.4;                  // hearth 16.8 in, from the model
    let s = `<defs>${HATCH('seb-h3')}</defs>`;
    s += ln(-7.4, 0, 15.2, 0, 1.4) + rc(-7.4, 0, 22.6, .45, 'fill="url(#seb-h3)" stroke="none"');
    s += `<path d="M${x0} ${f3(cl(x0))} L${x1} ${f3(cl(x1))} L${x1} ${f3(cl(x1) - .9)} L${x0} ${f3(cl(x0) - .9)}Z" fill="url(#seb-h3)" stroke="none"/>` + ln(x0, cl(x0), x1, cl(x1), 1.1);
    for (let j = x0 + .4; j < x1; j += 2) s += ln(j, cl(j), j, cl(j) + .55, .45) + ln(j + .25, cl(j + .25), j + .25, cl(j + .25) + .55, .45) + ln(j, cl(j) + .55, j + .25, cl(j + .25) + .55, .45);
    // chimney face, board form concrete, 6 in boards with staggered butt joints
    const top = cl(8);
    s += rc(0, top, 8, -top, 'fill="rgba(27,26,24,.07)" stroke="#1b1a18" stroke-width="1.1"');
    const r = rng(235);
    for (let b = -.5; b > top; b -= .5) {
      s += ln(0, b, 8, b, .35, 'stroke-opacity=".55"');
      let bx = r() * 2.4; while (bx < 8) { s += ln(bx, b, bx, b + .5, .35, 'stroke-opacity=".5"'); bx += 2.2 + r() * 2.2; }
    }
    s += ln(0, top, 0, top - 1.4, .7, 'stroke-dasharray="3 2"') + ln(8, top, 8, top - 1.4, .7, 'stroke-dasharray="3 2"');
    // hearth bench, stone
    s += rc(-1, -cH, 10, cH, 'fill="#f6f5f1" stroke="#1b1a18" stroke-width="1"');
    [.9, 3.3, 5.2, 7.6].forEach(v => { s += ln(v, -cH, v + .2, 0, .4, 'stroke-opacity=".6"'); });
    s += ln(-1, -.7, 2.1, -.72, .4, 'stroke-opacity=".5"') + ln(4.2, -.75, 9, -.7, .4, 'stroke-opacity=".5"');
    // firebox, placeholder
    s += rc(1.5, -4.1, 5, 2.0, 'fill="rgba(27,26,24,.72)" stroke="#1b1a18" stroke-width="1"') + ln(1.5, -2.1, 6.5, -2.1, .5, 'stroke="#c07a2c" stroke-opacity=".9"');
    // flanking walls: plaster, a door to the powder room beyond
    s += rc(10.2, -8, 3, 8, 'fill="none" stroke="#1b1a18" stroke-width=".7" stroke-dasharray="4 3"');
    s += ln(-6.5, cl(-6.5), -6.5, 0, .6, 'stroke-dasharray="4 3"') + ln(14.5, cl(14.5), 14.5, 0, .6, 'stroke-dasharray="4 3"');
    // dims
    s += dimH(0, 8, top - 2.1, top - .2, top - .2) + dimH(-1, 9, 1.0, .1, .1) + dimV(cl(-6.5), 0, -7.2, -6.5);
    return dview(ctx, {
      x, y, vb, sc: .25, svg: s, num: 4, title: 'Living room fireplace wall', scale: '1/4 in = 1 ft · concept',
      labels: [
        { x: 4, y: top - 2.1, t: '8′ 0″', k: 'dim' },
        { x: 4, y: 1.0, t: '10′ 0″', k: 'dim' },
        { x: -7.2, y: -7.6, t: ftin(14.5), k: 'dim' },
        { x: 4, y: -7.4, t: 'Board form concrete', s: 'chimney face, concept' },
        { x: 4, y: -4.75, t: 'Firebox', s: 'placeholder' },
        { x: 11.7, y: -4.4, t: 'Powder', s: 'beyond, placeholder' },
        { x: -3.3, y: -6.0, t: 'Plaster', s: 'walls' },
        { x: -3.4, y: cl(-3.4) + 1.35, t: 'Wood ceiling', s: 'follows the joists' },
        { x: 11.6, y: top - .9, t: 'To 6016.8', s: '4 ft over the roof' }
      ]
    });
  }
  function wingPlan(ctx, x, y) {
    const P = PLAN, [bx, bz, bw, bh] = P.box;
    const vb = [bx, bz - 3.2, bw, bh + 3.2];
    let s = `<defs>${HATCH('seb-h4')}<clipPath id="seb-pc"><rect x="${bx}" y="${bz}" width="${bw}" height="${bh}"/></clipPath>
      <pattern id="seb-fl" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-22)"><path d="M0 0 L1.4 .2 L1.6 1.3 L.2 1.5Z M1.6 1.3 L3 1.1 M1.4 .2 L2.2 0 M.2 1.5 L0 3 M.2 1.5 L1.2 1.8 L1.4 3 M1.2 1.8 L2.6 2.1 L3 3" fill="none" stroke="#1b1a18" stroke-width=".4" opacity=".5" ${NS}/></pattern></defs>`;
    s += `<g clip-path="url(#seb-pc)">`;
    s += pth(P.wall, 'fill="#1b1a18" stroke="#1b1a18" stroke-width=".35"') + pth(P.glass, 'fill="#f6f5f1" stroke="#1b1a18" stroke-width=".55"');
    // kitchen: counters solid, island and tall block; living: furniture dashed as placeholders
    P.furn.forEach((b, i) => {
      const tall = b.y[1] - b.y[0] > 6, cab = b.y[1] - b.y[0] >= 2.9 && b.p[0][0] < 5;
      s += pth(poly(b.p), cab || tall ? `fill="${tall ? 'url(#seb-h4)' : 'rgba(27,26,24,.05)'}" stroke="#1b1a18" stroke-width=".8"` : 'fill="none" stroke="#1b1a18" stroke-width=".55" stroke-dasharray="3 2"');
    });
    s += pth(poly(P.hearth.p), 'fill="url(#seb-fl)" stroke="#1b1a18" stroke-width=".8"');
    s += pth(poly(P.chim.p), 'fill="url(#seb-h4)" stroke="#1b1a18" stroke-width="1.2"');
    s += `</g>`;
    // elevation marks: bubble plus a pointer toward the wall it looks at
    const mark = (cx, cz, ang) => { const a = ang * Math.PI / 180, dx = Math.sin(a), dz = -Math.cos(a), px = -dz, pz = dx;
      return `<path d="M${f3(cx + dx * 2.3)} ${f3(cz + dz * 2.3)} L${f3(cx + px * 1.05)} ${f3(cz + pz * 1.05)} L${f3(cx - px * 1.05)} ${f3(cz - pz * 1.05)}Z" fill="#1b1a18"/>`; };
    const M = [[-16.0, -4.4, 0, 2], [-4.4, 3.4, -22, 3], [24.1, -3.0, -22, 4]];
    M.forEach(m => { s += mark(m[0], m[1], m[2]); });
    { const a = (ctx.DRW.north || 0) * Math.PI / 180, cx = 36.6, cz = 8.6, R = 1.1, dx = Math.sin(a), dz = -Math.cos(a);
      s += `<circle cx="${cx}" cy="${cz}" r="${R}" fill="none" stroke="#1b1a18" stroke-width=".8" ${NS}/><path d="M${f3(cx + dx * R * 1.25)} ${f3(cz + dz * R * 1.25)} L${f3(cx - dz * .3)} ${f3(cz + dx * .3)} L${f3(cx + dz * .3)} ${f3(cz - dx * .3)}Z" fill="#c07a2c"/>`; }
    // overall dims from the model footprint
    s += dimH(-20.58, 35.82, bz - 1.8, -15.3, -15.3);
    const labels = [
      { x: 7.62, y: bz - 1.8, t: ftin(56.4), k: 'dim' },
      { x: 36.6 + Math.sin((ctx.DRW.north || 0) * Math.PI / 180) * 2.1, y: 8.6 - Math.cos((ctx.DRW.north || 0) * Math.PI / 180) * 2.1, t: 'N', k: 'dim' },
      { x: -9.5, y: -9.6, t: 'Kitchen', s: 'concept' },
      { x: 12.5, y: 2.0, t: 'Living', s: 'double height' },
      { x: 21.1, y: -12.9, t: 'Fireplace' },
      { x: -17.2, y: -10.6, t: 'Pantry' },
      ...M.map(m => ({ x: m[0], y: m[1], t: String(m[3]), s: 'A5.0', k: 'bub' }))
    ];
    return dview(ctx, { x, y, vb, sc: .25, svg: s, labels, num: 1, title: 'North wing, enlarged plan', scale: '1/4 in = 1 ft · from the model' });
  }
  function palette(ctx, x, y) {
    const W = 12.9, H = 4.25, cw = 1.86, ch = 2.55, g = (W - 6 * cw) / 5;
    const items = [
      ['ceiling', 'I1', 'Wood ceiling', 'follows the joists'],
      ['wplaster', 'I2', 'Plaster walls', 'warm white'],
      ['hstone', 'I3', 'Stone hearth', 'regional, honed'],
      ['bform', 'I4', 'Chimney face', 'board form'],
      ['oak', 'I5', 'Floors', 'wide plank, allowance'],
      ['walnut', 'I6', 'Cabinetry', 'allowance']
    ];
    let h = '';
    items.forEach((it, i) => { const l = i * (cw + g); h += chip(ctx, it[0], 50 + i, l, 0, cw, ch, W, H) + cap(it[1], it[2], it[3], l, ch + .14, cw + g, W, H); });
    return `<div class="view seb-v" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))};width:${ctx.U(W)};height:${ctx.U(H)};--ar:${(W / H).toFixed(4)}">${h}${ctx.viewTitle(5, 'Interior palette', 'Concept · selections after design review')}</div>`;
  }
  function allowances(ctx, x, y, w) {
    const rows = [
      ['Kitchen', 'Cabinetry by the lineal foot, counters by the sf, Dustin confirms rates'],
      ['Appliances', 'One allowance, a 36 in range and a column fridge assumed'],
      ['Fireplace', 'Insert type to confirm; spark arrester, flue per Title 24 Part 7'],
      ['Ceilings', 'Wood follows the roof joists, square to the fold beam'],
      ['Walls', 'Plaster, low VOC, CALGreen'],
      ['Floors', 'Wide plank, allowance by the sf; stone at the hearth'],
      ['Lighting', 'Allowance; exterior cut sheets due with the Final submittal']
    ];
    return `<div class="seb-blk dtab" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))};width:${ctx.U(w)}"><h3>Allowances and intent</h3>
      <ul>${rows.map(([k, v]) => `<li><span class="k">${ctx.esc(k)}</span><span class="v">${ctx.esc(v)}</span></li>`).join('')}</ul>
      <p>Concept level. Real dimensions from the pocket model at FA accuracy; field verify after framing.</p></div>`;
  }

  LIVING_SHEETS.push({
    id: 'A5.0', group: 'Architectural', title: 'Interior elevations', short: 'Interior elevations', foot: 'Interior elevations',
    scale: '1/4 in = 1 ft', issued: [4],
    cap: 'The kitchen wall and the fireplace wall, drawn loose. Finishes wait for design review.',
    data: ['Kitchen run about 22 ft 9 in', 'Island 10 ft on the dining axis', 'Hearth 10 ft by 17 in, chimney face 8 ft', 'Concept, carried as allowances'],
    notes: [
      { text: 'stone at the hearth', t: [20.7, 17.95], p: [17.9, 17.58], a: 'l' },
      { text: 'concept, selections after DR', t: [4.6, 13.55], p: [3.2, 15.95], a: 'l' }
    ],
    html: ctx => {
      ctx0 = ctx;
      return CSS + DEFS + `<div class="seb">` +
        wingPlan(ctx, 1.9, 3.95) +
        palette(ctx, 18.6, 4.0) +
        kitchenWall(ctx, 1.9, 15.35) +
        island(ctx, 9.55, 17.2) +
        fireplaceWall(ctx, 14.15, 13.45) +
        allowances(ctx, 21.0, 10.1, 10.4) + `</div>`;
    }
  });

  /* ============================================================ A5.1 exterior materials and colors */
  const MAT = [
    // key, paint, name, finish line on the board
    ['M1', 'cedar', 'Cedar siding', 'silvered, vertical boards'],
    ['M2', 'steel', 'Dark steel', 'fascia and columns'],
    ['M3', 'bform', 'Board form concrete', 'chimneys, stained dark'],
    ['M4', 'plaster', 'Warm plaster', 'accent walls only'],
    ['M5', 'seam', 'Standing seam', 'matte, dark grey'],
    ['M6', 'glass', 'Clear glass', 'dark matte frames'],
    ['M7', 'glulam', 'Glulam and joists', 'warm natural stain'],
    ['M8', 'deck', 'Cedar decking', 'terraces'],
    ['M9', 'stone', 'Stone patio', 'regional flagstone']
  ];
  function board(ctx, x, y) {
    const W = 12, H = 9;
    // row A four tall samples, row B five
    const A = [[0, .5, 2.5], [6, 3.25, 2.5], [4, 6.0, 2.5], [2, 8.75, 2.75]], B = [[1, .5], [3, 2.75], [5, 5.0], [7, 7.25], [8, 9.5]];
    let h = `<div class="seb-board"></div>`;
    h += `<div class="seb-bh" style="left:${pc(.5 / W)}%;top:${pc(.36 / H)}%"><b>Homesite 235</b><i>Walsh Residence · exterior colors and materials</i></div>`;
    h += `<div class="seb-bh r" style="right:${pc(.5 / W)}%;top:${pc(.36 / H)}%"><b>Color board</b><i>18 x 24 in, shown at half size</i></div>`;
    A.forEach(([m, l, w], i) => { const M = MAT[m]; h += chip(ctx, M[1], 10 + m, l, 1.3, w, 2.75, W, H) + cap(M[0], M[2], M[3], l, 4.2, w, W, H); });
    B.forEach(([m, l], i) => { const M = MAT[m]; h += chip(ctx, M[1], 10 + m, l, 5.3, 2.0, 2.05, W, H) + cap(M[0], M[2], M[3], l, 7.5, 2.1, W, H); });
    return `<div class="view seb-v" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))};width:${ctx.U(W)};height:${ctx.U(H)};--ar:${(W / H).toFixed(4)}">${h}${ctx.viewTitle(1, 'Color board', 'Half size · real samples at Final')}</div>`;
  }
  /* an elevation cut from the model, at 1/8 in, keyed to the board: k = [key, tag x, tag y, point x, point y] as fractions */
  function keyedElev(ctx, o) {
    const w = o.W / o.ppf * .125, h = o.H / o.ppf * .125;
    let ld = '', tags = '';
    o.keys.forEach(([k, tx, ty, px, py]) => {
      ld += `<line x1="${f3(tx * w)}" y1="${f3(ty * h)}" x2="${f3(px * w)}" y2="${f3(py * h)}" stroke="#1b1a18" stroke-width=".6" stroke-opacity=".8" ${NS}/><circle cx="${f3(px * w)}" cy="${f3(py * h)}" r=".045" fill="#1b1a18"/>`;
      tags += `<span class="seb-key" style="left:${pc(tx)}%;top:${pc(ty)}%">${k}</span>`;
    });
    return `<div class="view dv seb-v" style="left:${ctx.U(ctx.FX(o.x))};top:${ctx.U(ctx.FY(o.y))};width:${ctx.U(w)};height:${ctx.U(h)};--ar:${(w / h).toFixed(4)}">
      <img class="simg" src="${o.img}" alt="${ctx.esc(o.title)}" width="${o.W}" height="${o.H}" decoding="async">
      <svg class="dsvg" viewBox="0 0 ${f3(w)} ${f3(h)}" preserveAspectRatio="none" aria-hidden="true">${ld}</svg>${tags}${ctx.viewTitle(o.num, o.title, '1/8 in = 1 ft · keyed to the board')}</div>`;
  }
  function asks(ctx, x, y, w) {
    const L = [
      ['LRV 15 to 40 for field and trim colors', 'IX.2', 0],
      ['Matte only. Nothing shiny or reflective', 'IX.2 · IX.7', 0],
      ['Stone and wood lead; plaster as accent', 'IX.4 · IX.9', 0],
      ['Visible concrete textured and darkened', 'IX.9', 0],
      ['Metal roofs matte, under 20 gloss units at 85°', 'IX.5.2', 0],
      ['Class A roofs, no wood shakes', 'IX.5', 0],
      ['Wood windows, clad matte; mid range frames preferred', 'IX.6 · confirm dark frames', 1],
      ['Color changes at inside corners; darker low, lighter high', 'IX.2', 0],
      ['Matte black steel under LRV 15 as trim', 'IX.7 list · confirm with the LCC', 1],
      ['Color board 18 x 24 in, real samples, labeled, homesite no.', 'IX.12 · Final submittal', 0],
      ['Form 6, the colors and materials form', 'Final submittal', 0],
      ['Mockup on site: 16 sf of each siding and roof, 4 ft of stone', 'IX.13 · foundation stage', 0]
    ];
    return `<div class="seb-blk" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))};width:${ctx.U(w)}"><h3>Lahontan asks</h3><p class="sub">Design Book 2011, chapter IX</p>
      <ul class="seb-list">${L.map(([t, r, c]) => `<li${c ? ' class="c"' : ''}>${ctx.esc(t)}<em>${ctx.esc(r)}</em></li>`).join('')}</ul></div>`;
  }
  function form6(ctx, x, y, w, groups, title) {
    const cols = `${f3(w * .05)}fr ${f3(w * .2)}fr ${f3(w * .34)}fr ${f3(w * .29)}fr ${f3(w * .12)}fr`;
    let h = ['Key', 'Element', 'Material', 'Color and finish', 'LRV'].map((t, i) => `<span class="hd c${i}">${t}</span>`).join('');
    groups.forEach(([g, rows]) => {
      h += `<span class="gp">${ctx.esc(g)}</span>`;
      rows.forEach(r => { h += r.map((c, i) => `<span class="c${i}${i === 0 ? ' k' : ''}${i === 4 && /confirm/.test(c) ? ' cf' : ''}">${ctx.esc(c)}</span>`).join(''); });
    });
    return `<div class="seb-blk" style="left:${ctx.U(ctx.FX(x))};top:${ctx.U(ctx.FY(y))};width:${ctx.U(w)}"><h3>${ctx.esc(title)}</h3><div class="seb-tab" style="grid-template-columns:${cols}">${h}</div></div>`;
  }

  LIVING_SHEETS.push({
    id: 'A5.1', group: 'Architectural', title: 'Exterior materials and colors', short: 'Materials and colors', foot: 'Materials and colors',
    scale: 'As noted', issued: [2, 4],
    cap: 'Silvered cedar, dark steel and board form concrete. Plaster kept to accents, the glass kept clear.',
    data: ['LRV 15 to 40, field and trim', 'Matte finishes only', 'Color board 18 x 24 in at Final', 'Mockup at the foundation'],
    notes: [
      { text: 'cedar, dark steel, board form concrete', t: [6.9, 13.35], p: [6.0, 12.62], a: 'l' },
      { text: 'darker low, lighter high', t: [27.7, 9.35], p: [24.3, 7.72], a: 'r' }
    ],
    html: ctx => {
      ctx0 = ctx;
      const v = [
        ['M1', 'Walls', 'Cedar vertical boards, WUI tested or FRT', 'Silvered grey, semi transparent stain', 'about 30, confirm'],
        ['M2', 'Fascia, posts, columns', 'Steel, factory finish', 'Matte black', 'under 15, confirm'],
        ['M3', 'Chimneys', 'Board form concrete, 6 in boards', 'Charcoal stain, textured', 'about 20'],
        ['M4', 'Accent walls', 'Integral color plaster, hand troweled', 'Warm sand', 'about 38, confirm'],
        ['M7', 'Beams, joists, eaves', 'Glulam and heavy timber', 'Warm natural stain, matte', 'about 30, confirm']
      ];
      const r = [
        ['M5', 'Roofs', 'Standing seam, Class A', 'Low gloss dark grey', 'about 15, confirm'],
        ['M2', 'Flashing, chimney caps', 'Steel, spark arresters', 'Matte black, match M2', 'match M2']
      ];
      const hz = [
        ['M8', 'Upper and primary terraces', 'Cedar decking, ignition resistant', 'Warm natural, matte', 'about 25, confirm'],
        ['M9', 'Lower patio', 'Regional flagstone, tight joints', 'Earth tone grey', 'confirm on sample'],
        ['', 'Drive at the front setback', 'Asphalt, IX.11', 'Dark, no contrast edge', '']
      ];
      const ot = [
        ['M6', 'Windows and doors', 'Wood, clad; clear low e glass', 'Dark matte clad', 'confirm'],
        ['M1', 'Garage doors', 'Cedar, to match the walls', 'As M1', 'as M1'],
        ['', 'Light fixtures', 'Shielded, dark matte', 'Cut sheets at Final', '']
      ];
      return CSS + DEFS + `<div class="seb">` +
        board(ctx, 1.9, 3.95) +
        keyedElev(ctx, { x: 14.95, y: 3.95, img: 'draw/A4.1.webp', W: 5048, H: 1927, ppf: 50, num: 2, title: 'East elevation, the court',
          keys: [['M5', .54, .05, .405, .115], ['M7', .63, .19, .6, .36], ['M3', .09, .16, .165, .32], ['M2', .27, .95, .222, .8], ['M6', .5, .95, .53, .55], ['M1', .08, .95, .125, .72], ['M4', .02, .33, .055, .56]] }) +
        keyedElev(ctx, { x: 14.95, y: 9.8, img: 'draw/A4.3.webp', W: 5048, H: 1706, ppf: 50, num: 3, title: 'West elevation, the arrival',
          keys: [['M5', .3, .05, .24, .22], ['M3', .17, .06, .08, .26], ['M2', .02, .66, .05, .497], ['M4', .22, .93, .2, .62], ['M6', .45, .95, .44, .62], ['M1', .42, .2, .357, .36], ['M7', .755, .95, .725, .75]] }) +
        asks(ctx, 28.25, 3.95, 3.2) +
        form6(ctx, 1.9, 14.95, 14.1, [['Vertical surfaces', v], ['Roofing', r]], 'Form 6 schedule') +
        form6(ctx, 17.1, 14.95, 14.35, [['Horizontal surfaces', hz], ['Other', ot]], 'Form 6 schedule, continued') + `</div>`;
    }
  });
})();
