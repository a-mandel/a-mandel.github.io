/* overlays-site crew (9/30/26): dimensions, grid bubbles, wing names, natural grade spots and compliance tags
   over A1.2 Site plan, L1.0 Landscape concept and L1.1 Defensible space. F1.0 already carries its own dims.
   Built by sheets/tools/overlays-site/build.py from overlays-site.src.js: edit the template, then rebuild.
   Everything in model feet on each view's own viewBox, so the layer registers by construction. FA accuracy. */
(function () {
  const O = {"built": "9/30/26", "north": 39.3, "lot": [[-126.47, -37.06], [65.73, -37.06], [69.02, 72.89], [-113.0, 132.4]], "lot_lines": [{"side": "north", "a": [-126.47, -37.06], "b": [65.73, -37.06], "ft": 192.2, "brg": "N 51° E"}, {"side": "east", "a": [65.73, -37.06], "b": [69.02, 72.89], "ft": 110.0, "brg": "N 41° W"}, {"side": "south", "a": [69.02, 72.89], "b": [-113.0, 132.4], "ft": 191.5, "brg": "N 33° E"}, {"side": "front", "a": [-113.0, 132.4], "b": [-126.47, -37.06], "ft": 170.0, "brg": "N 44° W"}], "lot_sf": 26390, "street": [[-125.0, -18.6], [-113.67, 124.0]], "nin": [0.99686, -0.0792], "setback": [[-77.78, -17.06], [41.32, -17.06], [43.63, 60.15], [-69.85, 97.25], [-77.78, -17.06]], "front_sb": [46.9, 45.8], "rear_sb": [25.0, 25.0], "roof": [[37.83, -16.58], [-65.58, -16.58], [-65.6, -16.08], [-76.8, -16.06], [-76.8, 8.28], [-65.6, 8.29], [-65.59, 17.29], [-37.57, 17.29], [-39.55, 15.27], [-37.56, 13.27], [-39.53, 13.25], [-37.56, 11.28], [-39.53, 11.25], [-37.56, 9.28], [-39.53, 9.25], [-37.7, 7.42], [-20.62, 7.42], [-20.62, 8.01], [-19.47, 10.74], [-2.0, 10.74], [-2.0, 34.98], [-5.02, 34.99], [-5.02, 45.66], [-21.62, 51.06], [-21.61, 78.37], [0.04, 71.34], [0.05, 70.8], [37.5, 58.62], [40.28, 58.83], [40.37, 57.66], [32.43, 33.4], [17.04, 38.42], [17.04, 10.74], [36.96, 10.73], [36.96, -15.27], [37.84, -15.63]], "tight": {"north": {"ft": 20.5, "p": [37.83, -16.58], "q": [37.83, -37.06]}, "east": {"ft": 28.2, "p": [40.37, 57.66], "q": [68.54, 56.82]}, "south": {"ft": 22.3, "p": [40.28, 58.83], "q": [47.21, 80.02]}, "front": {"ft": 45.9, "p": [-76.8, 8.28], "q": [-122.58, 11.92]}}, "enc": {"inch": 9, "p": [-76.8, 8.28], "q": [-76.03, 8.23]}, "drive": {"w": 12.0, "len": 57, "a": [-120.08, 43.3], "b": [-63.57, 39.51], "wa": [-113.59, 36.47], "wb": [-112.87, 48.44]}, "tree": {"at": [-14.59, 24.67], "crown": 13.0, "footing": 14.1, "fq": [-5.0, 35.0]}, "spots": [{"name": "garage NW", "at": [-76.8, -16.06], "el": 6001.2}, {"name": "garage SW", "at": [-76.8, 8.28], "el": 6001.0}, {"name": "garage SE", "at": [-65.59, 17.29], "el": 6000.3}, {"name": "north wing NE", "at": [37.83, -16.58], "el": 5995.3}, {"name": "north wing SE", "at": [36.96, 10.73], "el": 5993.6}, {"name": "south wing NE", "at": [32.43, 33.4], "el": 5992.9}, {"name": "south wing SE", "at": [40.37, 57.66], "el": 5991.3}, {"name": "south wing SW", "at": [-21.61, 78.37], "el": 5995.3}, {"name": "granny NW", "at": [-21.62, 51.06], "el": 5996.6}], "bubbles": [{"id": "1", "at": [-75.78, -21.0], "lead": [[-75.78, -16.58], [-75.78, -20.0]]}, {"id": "2", "at": [-63.58, -21.0], "lead": [[-63.58, -16.58], [-63.58, -20.0]]}, {"id": "3", "at": [-39.0, -21.0], "lead": [[-39.0, -16.58], [-39.0, -20.0]]}, {"id": "4", "at": [-20.58, -21.0], "lead": [[-20.58, -16.58], [-20.58, -20.0]]}, {"id": "5", "at": [-9.19, -21.0], "lead": [[-9.19, -16.58], [-9.19, -20.0]]}, {"id": "7", "at": [5.82, -21.0], "lead": [[5.82, -16.58], [5.82, -20.0]]}, {"id": "9", "at": [20.82, -21.0], "lead": [[20.82, -16.58], [20.82, -20.0]]}, {"id": "11", "at": [35.82, -21.0], "lead": [[35.82, -16.58], [35.82, -20.0]]}, {"id": "A", "at": [-90.0, -14.56], "lead": [[-77.6, -14.56], [-89.0, -14.56]]}, {"id": "B", "at": [-90.0, 7.94], "lead": [[-77.6, 7.94], [-89.0, 7.94]]}, {"id": "C", "at": [-90.0, 15.27], "lead": [[-77.6, 15.27], [-89.0, 15.27]]}, {"id": "4", "at": [-20.58, 83.89], "lead": [[-20.58, 79.99], [-20.58, 82.89]]}, {"id": "6", "at": [0.03, 77.15], "lead": [[0.03, 73.25], [0.03, 76.15]]}, {"id": "10", "at": [25.8, 68.72], "lead": [[25.8, 64.82], [25.8, 67.72]]}, {"id": "F", "at": [-29.24, 56.73], "lead": [[-24.58, 55.21], [-28.38, 56.45]]}, {"id": "G", "at": [-29.24, 80.32], "lead": [[-24.58, 78.8], [-28.38, 80.04]]}], "tags": [{"id": "T07", "at": [-76.8, 8.28], "text": "III.6 roof edge over the front setback, about 9 in", "status": "confirm", "n": 1, "row": "Setbacks", "sec": "III.6", "note": "Front line traces about 46 to 47 ft, confirm on survey"}, {"id": "T08", "at": [-100.0, 41.0], "text": "III.7 impervious about 28.2%", "status": "confirm", "n": 2, "row": "Impervious coverage", "sec": "III.7", "note": "Under 30% by listing, tight on the model lot lines"}, {"id": "T11", "at": [-14.59, 24.67], "text": "IV.20 the tree, about 14 ft to the walls", "status": "confirm", "n": 14, "row": "Defensible space", "sec": "IV.20", "note": "Limbed up, Zone 0 rules pending"}, {"id": "T12", "at": [-51.0, 31.0], "text": "III.9 snow storage 30% of paving", "status": "confirm", "n": 13, "row": "Snow", "sec": "III.9 · VII.14", "note": "About 510 sf, clear of the easement"}], "calcs": {"roof_pct": 19.6, "imp_pct": 28.2, "lot_sf": 27440}, "matrix": {"1": {"n": 1, "name": "Setbacks", "section": "III.6", "status": "confirm"}, "2": {"n": 2, "name": "Impervious coverage", "section": "III.7", "status": "confirm"}, "3": {"n": 3, "name": "Living area", "section": "VII.4", "status": "meets"}, "4": {"n": 4, "name": "Height", "section": "VII.5", "status": "meets"}, "5": {"n": 5, "name": "Roof form and pitch", "section": "VII.13", "status": "variance"}, "6": {"n": 6, "name": "Roofing", "section": "IX.5", "status": "confirm"}, "7": {"n": 7, "name": "Glazing", "section": "VII.15 · IX.6", "status": "confirm"}, "8": {"n": 8, "name": "Window frames", "section": "IX.6 · IX.7", "status": "confirm"}, "9": {"n": 9, "name": "Chimneys", "section": "VII.20 · VII.5", "status": "confirm"}, "10": {"n": 10, "name": "Exterior lighting", "section": "VIII.2", "status": "confirm"}, "11": {"n": 11, "name": "Colors", "section": "IX.2", "status": "confirm"}, "12": {"n": 12, "name": "Wall materials", "section": "IX.4", "status": "confirm"}, "13": {"n": 13, "name": "Snow", "section": "III.9 · VII.14", "status": "confirm"}, "14": {"n": 14, "name": "Defensible space", "section": "IV.20", "status": "confirm"}, "15": {"n": 15, "name": "Slab on grade", "section": "XI.14", "status": "meets"}}};
  if (!window.LIVING_OVERLAYS) return;

  const CSS = `<style>
  .ovs{position:absolute;pointer-events:none;--o-b:max(calc(6.5px * var(--fl)),calc(var(--u) * .084));--o-i:max(calc(8px * var(--fl)),calc(var(--u) * .112));--o-w:max(calc(7px * var(--fl)),calc(var(--u) * .1))}
  .ovs-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .ovs-svg *{vector-effect:non-scaling-stroke;fill:none;stroke:#1b1a18;stroke-linecap:round}
  .ovs-svg .odl{stroke-width:.6;stroke-opacity:.8}
  .ovs-svg .oex{stroke-width:.45;stroke-opacity:.5}
  .ovs-svg .otk{stroke-width:1.1;stroke-opacity:.9}
  .ovs-svg .ocl{stroke-width:.45;stroke-opacity:.45;stroke-dasharray:5 2 1 2}
  .ovs-svg .osb{stroke-width:.55;stroke-opacity:.45;stroke-dasharray:4 3}
  .ovs-svg .oea{stroke-width:.55;stroke-opacity:.5;stroke-dasharray:1 3}
  .ovs-svg .ogl{stroke-width:.4;stroke-opacity:.45}
  .ovs-svg .ogb{stroke-width:.5;stroke-opacity:.6;fill:#f6f3ec;fill-opacity:.85}
  .ovs-svg .old{stroke-width:.45;stroke-opacity:.6}
  .ovs-svg .osx{stroke-width:.7;stroke-opacity:.75}
  .ovs-svg .oenc{stroke:#c07a2c;stroke-width:1.6;stroke-opacity:.95}
  .ovs-svg .oacc{stroke:#c07a2c;stroke-opacity:.9}
  .ovs-svg .odot{stroke:none;fill:#1b1a18}
  .ovs-svg .odot.variance{fill:#c07a2c}
  .ovs-svg .odot.confirm{fill:#f6f3ec;stroke:#1b1a18;stroke-width:.8}
  .ovs-svg .odot.acc{fill:#c07a2c;stroke:none}
  .ovs-f .ovs-svg{opacity:.62}
  .ovs-t{position:absolute;transform-origin:0 0;white-space:nowrap;line-height:1;color:var(--ink)}
  .ovs-t > span{display:inline-flex;flex-direction:column;align-items:center;gap:.14em;padding:.08em .22em;border-radius:2px;background:rgba(246,243,236,.66)}
  .ovs-t b{font:400 var(--o-b)/1 var(--ft);letter-spacing:.14em;text-transform:uppercase}
  .ovs-t i{font:italic 400 var(--o-i)/1 var(--fs)}
  .ovs-t em{font:italic 400 var(--o-b)/1 var(--fs);font-size:calc(var(--o-b) * 1.12);color:var(--muted);font-style:italic}
  .ovs-t.l > span{align-items:flex-start}
  .ovs-t.r > span{align-items:flex-end}
  .ovs-t.nb > span{background:none}
  .ovs-f .ovs-t{opacity:.72}
  .ovs-w{position:absolute;transform:translate(-50%,-50%);font:400 var(--o-w)/1 var(--ft);letter-spacing:.34em;text-transform:uppercase;color:var(--ink);opacity:.4;white-space:nowrap}
  .ovs-g{position:absolute;transform:translate(-50%,-42%);font:400 var(--o-b)/1 var(--ft);letter-spacing:0;color:var(--ink);opacity:.8}
  .ovs-sp{position:absolute;white-space:nowrap;line-height:1;transform:translate(var(--tx),var(--ty))}
  .ovs-sp b{font:400 calc(var(--o-b) * .9)/1 var(--ft);letter-spacing:.12em;color:var(--muted);margin-right:.35em}
  .ovs-sp i{font:italic 400 var(--o-i)/1 var(--fs)}
  .ovs-tag > span{align-items:flex-start;gap:.2em}
  .ovs-tag b{display:inline-flex;align-items:center;gap:.45em}
  .ovs-s{display:inline-block;width:max(calc(5.5px * var(--fl)),calc(var(--u) * .075));height:max(calc(5.5px * var(--fl)),calc(var(--u) * .075));border-radius:50%;background:var(--ink)}
  .ovs-s.variance{background:var(--accent)}
  .ovs-s.confirm{background:transparent;box-shadow:inset 0 0 0 1px var(--ink)}
  .ovs-rail{position:absolute}
  .ovs-rail h3{margin:0 0 calc(var(--u)*.1);font:400 max(calc(9px * var(--fl)),calc(var(--u) * .16))/1.1 var(--ft);letter-spacing:.18em;text-transform:uppercase;color:var(--ink)}
  .ovs-rail h3 small{font:italic 400 max(calc(8.5px * var(--fl)),calc(var(--u) * .13))/1 var(--fs);letter-spacing:0;text-transform:none;color:var(--muted);margin-left:.6em}
  .ovs-rail ul{margin:0;padding:0;list-style:none}
  .ovs-rail li{display:grid;grid-template-columns:calc(var(--u)*.16) calc(var(--u)*.3) 1fr;align-items:baseline;column-gap:calc(var(--u)*.06);padding:calc(var(--u)*.11) 0 calc(var(--u)*.03);background:var(--swoop) no-repeat 0 0 / 100% calc(var(--u)*.08)}
  .ovs-rail li .n{font:400 max(calc(7.5px * var(--fl)),calc(var(--u) * .105))/1 var(--ft);letter-spacing:.08em;color:var(--muted)}
  .ovs-rail li p{margin:0;font:italic 400 max(calc(8.5px * var(--fl)),calc(var(--u) * .128))/1.25 var(--fs)}
  .ovs-rail li p b{font:400 max(calc(7px * var(--fl)),calc(var(--u) * .098))/1 var(--ft);font-style:normal;letter-spacing:.14em;text-transform:uppercase;margin-right:.5em}
  .ovs-rail li p em{display:block;color:var(--muted);font-size:.92em}
  .ovs-rail .key{display:flex;gap:1.1em;margin-top:calc(var(--u)*.1);font:400 max(calc(7px * var(--fl)),calc(var(--u) * .095))/1 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
  .ovs-rail .key span{display:inline-flex;align-items:center;gap:.5em}
  .ovs-mlist{display:none}
  @media screen and (max-width:760px) and (orientation:portrait), screen and (max-width:760px) and (min-height:541px), screen and (max-width:760px) and (pointer:fine), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
    .ovs-reg.in{left:0 !important;top:0 !important;width:100% !important;height:100% !important;z-index:3}
    .ovs-reg:not(.in),.ovs-rail{display:none}
    .ovs-reg .ovs-t,.ovs-reg .ovs-sp,.ovs-reg .ovs-w{display:none}
    .ovs-mlist.in{display:block;position:relative;margin:4px 0 34px}
    .ovs-mlist h3{margin:0 0 8px;font:400 11px/1.1 var(--ft);letter-spacing:.18em;text-transform:uppercase}
    .ovs-mlist ul{margin:0;padding:0;list-style:none}
    .ovs-mlist li{display:grid;grid-template-columns:14px 30px 1fr;align-items:baseline;padding:8px 0 3px;background:var(--swoop) no-repeat 0 0 / 100% 6px}
    .ovs-mlist li .n{font:400 10px/1 var(--ft);color:var(--muted)}
    .ovs-mlist li p{margin:0;font:italic 400 15px/1.3 var(--fs)}
    .ovs-mlist li p b{font:400 9.5px/1 var(--ft);font-style:normal;letter-spacing:.14em;text-transform:uppercase;margin-right:.5em}
    .ovs-s{width:7px;height:7px}
  }
  </style>`;

  const f2 = v => +(+v).toFixed(2);
  const ftin = v => { let f = Math.floor(v + 1e-9), i = Math.round((v - f) * 12); if (i === 12) { f++; i = 0; } return `${f}′ ${i}″`; };
  const E = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  /* a registered frame: field inches box, model feet viewBox, k = feet per sheet inch */
  function Frame(box, vb, k) {
    const F = { box, vb, k, s: [], h: [] };
    F.px = x => f2((x - vb[0]) / vb[2] * 100);
    F.pz = z => f2((z - vb[1]) / vb[3] * 100);
    F.line = (a, b, c) => F.s.push(`<path class="${c}" d="M${f2(a[0])} ${f2(a[1])}L${f2(b[0])} ${f2(b[1])}"/>`);
    F.poly = (pts, c, close) => F.s.push(`<path class="${c}" d="M${pts.map(p => `${f2(p[0])} ${f2(p[1])}`).join('L')}${close ? 'Z' : ''}"/>`);
    F.circ = (p, r, c) => F.s.push(`<circle class="${c}" cx="${f2(p[0])}" cy="${f2(p[1])}" r="${f2(r)}"/>`);
    /* text: at a point, rotated deg, anchored c (center), l or r, dy in ems above (negative) or below */
    F.text = (p, html, o = {}) => {
      let a = o.rot || 0; const cls = o.cls || '';
      const tx = cls.includes(' l') || cls.startsWith('l') ? '0%' : cls.includes(' r') || cls.startsWith('r') ? '-100%' : '-50%';
      const ty = o.ty != null ? o.ty : '-50%';
      F.h.push(`<span class="ovs-t ${cls}" style="left:${F.px(p[0])}%;top:${F.pz(p[1])}%;transform:rotate(${f2(a)}deg) translate(${tx},${ty})"><span>${html}</span></span>`);
    };
    /* a dimension between measured points a and b; off moves the string square to it (feet, + to the left of a to b) */
    F.dim = (a, b, o = {}) => {
      const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L, nx = uz, nz = -ux;
      const off = o.off || 0, A = [a[0] + nx * off, a[1] + nz * off], B = [b[0] + nx * off, b[1] + nz * off];
      F.line(A, B, 'odl');
      if (off) {
        const g = Math.sign(off) * .05 * k, x = Math.sign(off) * .06 * k;
        F.line([a[0] + nx * g, a[1] + nz * g], [A[0] + nx * x, A[1] + nz * x], 'oex');
        F.line([b[0] + nx * g, b[1] + nz * g], [B[0] + nx * x, B[1] + nz * x], 'oex');
      }
      const tk = .055 * k, tx = (ux + nx) * tk / Math.SQRT2, tz = (uz + nz) * tk / Math.SQRT2;
      (o.ticks || [A, B]).forEach(p => F.line([p[0] - tx, p[1] - tz], [p[0] + tx, p[1] + tz], 'otk'));
      (o.mid || []).forEach(t => { const p = [A[0] + dx * t, A[1] + dz * t]; F.line([p[0] - tx, p[1] - tz], [p[0] + tx, p[1] + tz], 'otk'); });
      if (!o.text) return { A, B };
      let ang = Math.atan2(dz, dx) * 180 / Math.PI, side = o.side || 1;
      if (ang > 90.5 || ang <= -89.5) { ang += ang > 0 ? -180 : 180; side = -side; }
      const t = o.t != null ? o.t : .5, M = [A[0] + dx * t, A[1] + dz * t];
      F.text(M, o.text, { rot: ang, cls: (o.cls || '') + ' nb', ty: side > 0 ? '-118%' : '14%' });
      return { A, B };
    };
    F.out = (cls, view) => `<div class="ovs ovs-reg ${cls || ''}" data-view="${view || 0}" style="left:calc(var(--u) * ${box[0]});top:calc(var(--u) * ${box[1]});width:calc(var(--u) * ${box[2]});height:calc(var(--u) * ${box[3]})">`
      + `<svg class="ovs-svg" viewBox="${vb.join(' ')}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${F.s.join('')}</svg>${F.h.join('')}</div>`;
    return F;
  }
  const lin = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const along = (a, b, z) => lin(a, b, (z - a[1]) / (b[1] - a[1]));          // point on a line at a given z
  const sq = (p, a, b) => {                                                    // foot of p on the line a b
    const dx = b[0] - a[0], dz = b[1] - a[1], t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / (dx * dx + dz * dz);
    return [a[0] + dx * t, a[1] + dz * t];
  };
  const LL = Object.fromEntries(O.lot_lines.map(l => [l.side, l]));
  const SB = O.setback, ST = O.street, N = O.nin;
  const sbN = [SB[0], SB[1]], sbE = [SB[1], SB[2]], sbS = [SB[2], SB[3]], sbW = [SB[3], SB[0]];
  const lotN = [LL.north.a, LL.north.b], lotE = [LL.east.a, LL.east.b], lotS = [LL.south.a, LL.south.b];
  const eas = d => [[ST[0][0] + N[0] * d, ST[0][1] + N[1] * d], [ST[1][0] + N[0] * d, ST[1][1] + N[1] * d]];
  const E30 = eas(30);
  const clipZ = (seg, z0, z1) => [along(seg[0], seg[1], z0), along(seg[0], seg[1], z1)];
  const dot = (F, p, st, r) => F.circ(p, r || .045 * F.k, 'odot ' + st);
  const sdot = st => `<i class="ovs-s ${st}"></i>`;

  /* the property lines, lengths and bearings as the model knows them */
  function lotLabels(F, z) {
    const lab = (l, p, rot, side) => F.text(p, `<b>${E(l.brg)} · about ${Math.round(l.ft)} ft</b><em>property line, confirm on survey</em>`,
      { rot, cls: 'nb', ty: side > 0 ? '-116%' : '16%' });
    const deg = l => { let a = Math.atan2(l.b[1] - l.a[1], l.b[0] - l.a[0]) * 180 / Math.PI; if (a > 90.5 || a <= -89.5) a += a > 0 ? -180 : 180; return a; };
    lab(LL.north, [z.north, -37.06], deg(LL.north), 1);
    lab(LL.east, along(LL.east.a, LL.east.b, z.east), deg(LL.east), 1);
    lab(LL.south, lin(LL.south.a, LL.south.b, z.south), deg(LL.south), -1);
    lab(LL.front, along(LL.front.a, LL.front.b, z.front), deg(LL.front), -1);
  }

  /* setback strings: lot line, setback line, roof edge where it runs tightest */
  function setbackDims(F, o) {
    const faint = o.faint ? 'f' : '';
    // north side, square to the north line
    if (o.nx != null) { const x = o.nx, a = [x, -37.06], b = [x, -17.06];
      F.dim(a, b, { text: `<i>20′ 0″</i><em>side setback</em>`, side: o.faint ? 1 : -1, cls: faint });
      if (o.roof) { F.dim(b, [x, O.tight.north.p[1]], { ticks: [[x, O.tight.north.p[1]]] });
        F.text([x - .8, -18.4], `<em>roof edge ${ftin(O.tight.north.ft)} off the line</em>`, { cls: 'r nb', ty: '-50%' }); } }
    // rear (east), square to the east line
    { const p = along(sbE[0], sbE[1], o.ez), q = sq(p, lotE[0], lotE[1]);
      if (o.roof) {
        const r = O.tight.east.p, rs = sq(r, sbE[0], sbE[1]), rq = sq(r, lotE[0], lotE[1]);
        F.dim(r, rq, { mid: [(Math.hypot(rs[0] - r[0], rs[1] - r[1])) / O.tight.east.ft], text: `<i>25′ 0″ rear</i><em>roof ${ftin(O.tight.east.ft)}</em>`, t: .58, side: 1, cls: faint });
      } else F.dim(p, q, { text: `<i>25′ 0″</i><em>rear setback</em>`, side: 1, cls: faint });
    }
    // south side, square to the south line
    { if (o.roof) {
        const r = O.tight.south.p, rq = O.tight.south.q, rs = (() => { // where the string crosses the setback line
          const d = [rq[0] - r[0], rq[1] - r[1]], a = sbS[0], b = sbS[1], e = [b[0] - a[0], b[1] - a[1]];
          const den = d[0] * e[1] - d[1] * e[0], t = ((a[0] - r[0]) * e[1] - (a[1] - r[1]) * e[0]) / den; return t; })();
        F.dim(r, rq, { mid: [rs], text: `<i>20′ 0″ side</i><em>roof ${ftin(O.tight.south.ft)}</em>`, t: .62, side: -1, cls: faint });
      } else { const p = lin(sbS[0], sbS[1], o.st), q = sq(p, lotS[0], lotS[1]);
        F.dim(q, p, { text: `<i>20′ 0″</i><em>side setback</em>`, side: 1, cls: faint }); }
    }
    // front, square to the street line, at the north end of the traced setback
    { const p = along(sbW[0], sbW[1], o.fz), q = sq(p, ST[0], ST[1]), d = Math.hypot(p[0] - q[0], p[1] - q[1]);
      F.dim(q, p, { text: `<i>${ftin(d)} front setback, as traced</i><em>50 ft by III.6, confirm</em>`, side: 1, cls: faint, t: o.ft || .5 }); }
    // the 30 ft snow storage easement off the street
    { const e = clipZ(E30, -37.06 + 2.4, o.ezMax || 124); F.line(e[0], e[1], 'oea');
      const p = along(ST[0], ST[1], o.ez30), q = sq(p, E30[0], E30[1]);
      F.dim(p, q, { text: `<i>30′ 0″</i><em>snow storage easement</em>`, side: 1, cls: faint, t: .6 });
      if (o.easeLabel) F.text(along(E30[0], E30[1], o.easeLabel), `<em>snow storage easement, 30 ft</em>`, { rot: Math.atan2(E30[1][1] - E30[0][1], E30[1][0] - E30[0][0]) * 180 / Math.PI - 180, cls: 'nb', ty: '-120%' });
    }
  }

  function treeDims(F, o) {
    const T = O.tree, c = T.at, cr = T.crown;
    const w = [c[0] - cr * Math.cos(o.ca), c[1] - cr * Math.sin(o.ca)];
    if (o.crown) F.dim(c, w, { ticks: [w], text: `<i>about ${cr} ft</i><em>crown as drawn</em>`, side: o.cs || 1, cls: o.cls });
    if (!o.noFooting) F.dim(c, T.fq, { ticks: [T.fq], text: `<i>${ftin(T.footing)}</i><em>trunk to footing</em>`, side: o.fs || -1, cls: o.cls, t: o.ft || .5 });
    if (o.tag) {
      const at = o.tag;
      F.line(o.tagFrom || T.fq, at, 'old'); dot(F, o.tagFrom || T.fq, 'confirm');
      F.text(at, `<b>${sdot('confirm')}A1.3 · 14 · confirm dripline</b><em>${o.short ? `crown about ${cr} ft, footings about ${Math.round(T.footing)} ft` : `footings about ${Math.round(T.footing)} ft from the trunk, crown drawn about ${cr} ft`}</em>`, { cls: 'ovs-tag l', ty: '-50%' });
    }
  }

  function zoneDims(F, z, cls) {
    const x0 = 35.82, a = [x0, z];
    F.dim(a, [x0 + 30, z], { mid: [5 / 30], cls, text: '', side: 1 });
    F.text([x0 + 2.5, z], `<i>5′</i>`, { cls: 'nb ' + (cls || ''), ty: '-120%' });
    F.text([x0 + 17.5, z], `<i>30′</i><em>zone 1, from the walls</em>`, { cls: 'nb ' + (cls || ''), ty: '-112%' });
    F.text([x0 + 2.5, z], `<em>zone 0</em>`, { cls: 'nb ' + (cls || ''), ty: '20%' });
  }

  /* ------------------------------------------------------------------ A1.2 */
  const SPOT_OFF = { 'garage NW': [-1.2, -1.4, 'r'], 'garage SW': [1.0, 1.9, 'l'], 'garage SE': [-1, 2.2, 'r'], 'north wing NE': [1.1, -1.3, 'l'],
    'north wing SE': [1.3, 1.6, 'l'], 'south wing NE': [1.3, 1.5, 'l'], 'south wing SE': [-1.6, 2.3, 'r'], 'south wing SW': [-1.2, -1.6, 'r'], 'granny NW': [-1.2, -1.1, 'r'] };
  const TAG_POS = {   // where each A1.2 tag label sits, and where its dot lands if the tagged point is under another label
    T07: { lab: [-111, 2.2], dot: O.enc.p, s: 'roof edge over, about 9 in', acc: 1 },
    T08: { lab: [-109, 64], dot: [-104, 46.5], s: 'impervious about 28.2%' },
    T12: { lab: [-60.5, 49.5], dot: [-56, 37.5], s: 'snow storage, 30% of paving' },
    T11: { lab: [-36, 46.5], dot: O.tree.fq, s: 'the tree, 14 ft to the walls' }
  };
  function siteTag(F, t) {
    const P = TAG_POS[t.id]; if (!P) return;
    const at = P.from || P.dot;
    F.line(at, P.lab, 'old'); dot(F, at, P.acc ? 'acc' : t.status, P.acc ? .035 * F.k : 0);
    F.text(P.lab, `<b>${sdot(t.status)}A1.3 · ${t.n}</b><em>${E(P.s)}</em>`, { cls: 'ovs-tag l m', ty: '-50%' });
  }

  function a12(ctx) {
    const F = Frame([0.7, 3.05, 21.4, 16.2], [-141, -40, 214, 162], 10);
    lotLabels(F, { north: -3, east: 18, south: .47, front: 3 });
    setbackDims(F, { nx: -30, ez: 40, fz: -12, ft: .36, ez30: 100, roof: true, easeLabel: 112 });
    // garage roof edge past the traced front setback line: the sliver, in orange
    F.line(O.enc.p, O.enc.q, 'oenc');
    // front chain to the tightest roof point, the garage corner
    { const r = O.tight.front.p, q = O.tight.front.q; F.dim(q, r, { off: -3.6, text: `<i>${ftin(O.tight.front.ft)}</i><em>street line to the garage roof edge</em>`, side: 1, t: .45 }); }
    // drive
    { const D = O.drive; F.dim(D.wa, D.wb, { text: `<i>${ftin(D.w)}</i><em>drive</em>`, side: 1 });
      F.text([-93, 54.2], `<i>drive about ${D.len} ft</i><em>street line to the apron</em>`, { rot: -3.4, cls: 'nb' }); }
    // tree: trunk to the nearest footing
    treeDims(F, { crown: false, fs: 1, ft: .55 });
    // grid bubbles at the extents
    O.bubbles.forEach(b => { F.line(b.lead[0], b.lead[1], 'ogl'); F.circ(b.at, .085 * F.k, 'ogb'); F.h.push(`<span class="ovs-g" style="left:${F.px(b.at[0])}%;top:${F.pz(b.at[1])}%">${b.id}</span>`); });
    // wing names at roof level, faint
    [['north wing', [21, 3.2]], ['garage', [-57, -1]], ['bridge', [8.3, 22]], ['south wing', [-4, 66.5]]]
      .forEach(([t, p]) => F.h.push(`<span class="ovs-w" style="left:${F.px(p[0])}%;top:${F.pz(p[1])}%">${t}</span>`));
    // natural grade at the building corners
    O.spots.forEach(s => {
      const o = SPOT_OFF[s.name] || [1, 1, 'l'];
      F.line([s.at[0] - .5, s.at[1] - .5], [s.at[0] + .5, s.at[1] + .5], 'osx'); F.line([s.at[0] - .5, s.at[1] + .5], [s.at[0] + .5, s.at[1] - .5], 'osx');
      F.h.push(`<span class="ovs-sp" style="left:${F.px(s.at[0] + o[0])}%;top:${F.pz(s.at[1] + o[1])}%;--tx:${o[2] === 'r' ? '-100%' : '0'};--ty:-50%"><b>NG</b><i>${s.el.toFixed(1)}</i></span>`);
    });
    O.tags.forEach(t => siteTag(F, t));
    // the rail: site compliance keyed to A1.3
    const rows = O.tags.map(t => `<li>${sdot(t.status)}<span class="n">${t.n}</span><p><b>${E(t.sec)}</b>${E(t.text.replace(/^[IVX]+\.\d+\s*/, ''))}<em>${E(t.note)}</em></p></li>`).join('');
    const rail = `<div class="ovs ovs-rail" style="left:${ctx.U(23.09)};top:${ctx.U(8.35)};width:${ctx.U(7.0)}">
      <h3>Site compliance<small>rows of A1.3, FA accuracy</small></h3>
      <ul><li><span></span><span class="n"></span><p><b>III.6</b>setbacks front 50 ft, sides 20, rear 25; front traced about ${Math.round(O.front_sb[1])} to ${Math.round(O.front_sb[0])} ft<em>drive and utilities only in them, overhangs count</em></p></li>${rows}</ul>
      <div class="key"><span>${sdot('meets')}meets</span><span>${sdot('variance')}variance</span><span>${sdot('confirm')}confirm</span><span><i style="font:italic 400 1.2em var(--fs);letter-spacing:0;text-transform:none;color:var(--ink)">NG</i> natural grade</span></div></div>`;
    const ml = `<div class="ovs ovs-mlist" data-after="0"><h3>Site compliance</h3><ul>${O.tags.map(t => `<li>${sdot(t.status)}<span class="n">${t.n}</span><p><b>${E(t.sec)}</b>${E(t.text.replace(/^[IVX]+\.\d+\s*/, ''))}</p></li>`).join('')}</ul></div>`;
    return CSS + F.out('ovs-a12', 0) + rail + ml;
  }

  /* ------------------------------------------------------------------ L1.0, same registration as A1.2 */
  function l10() {
    const F = Frame([0.7, 3.05, 21.4, 15.5], [-141, -40, 214, 155], 10);
    F.poly(SB, 'osb', false);
    setbackDims(F, { nx: -30, ez: 33, st: .74, fz: -12, ez30: 104, faint: true, ezMax: 115 });
    treeDims(F, { crown: true, ca: -Math.PI / 2, cs: -1, fs: 1, ft: .55, tag: [-68, 4.2], tagFrom: [-25.8, 18.6] });
    zoneDims(F, -6.5, '');
    return CSS + F.out('ovs-f ovs-l10', 0);
  }

  /* ------------------------------------------------------------------ L1.1, the defensible space plan at 1 in = 20 ft, and the tree detail */
  function l11() {
    const F = Frame([0.65, 3.3, 13.6, 10.0], [-168, -52, 272, 200], 20);
    setbackDims(F, { ez: 45, st: .4, fz: -12, ez30: 57, faint: true, ezMax: 124 });
    const T = Frame([14.95, 3.3, 5.0, 4.5], [-40, 0, 50, 45], 10);
    treeDims(T, { crown: true, ca: Math.PI * 1.0, cs: 1, noFooting: true, short: true, tag: [-37, 4.2], tagFrom: [-14.59 - 13 * Math.SQRT1_2, 24.67 - 13 * Math.SQRT1_2] });
    return CSS + F.out('ovs-f ovs-l11', 0) + T.out('ovs-l11t', 1);
  }

  LIVING_OVERLAYS.push({ id: 'A1.2', z: 4, html: a12 });
  LIVING_OVERLAYS.push({ id: 'L1.0', z: 4, html: l10 });
  LIVING_OVERLAYS.push({ id: 'L1.1', z: 4, html: l11 });

  /* phones: the field reflows, so each registered layer moves into its own view (same viewBox, same box) */
  const MQ = 'screen and (max-width:760px) and (orientation:portrait), screen and (max-width:760px) and (min-height:541px), screen and (max-width:760px) and (pointer:fine), screen and (max-aspect-ratio:1/1) and (max-width:1100px)';
  function relocate() {
    const mob = matchMedia(MQ).matches;
    document.querySelectorAll('.ovs-reg, .ovs-mlist').forEach(el => {
      if (!el.__home) el.__home = el.parentNode;
      const sh = el.closest('.sheet'); if (!sh) return;
      const v = sh.querySelectorAll('.dv')[+(el.dataset.view || el.dataset.after || 0)];
      if (mob && v) {
        if (el.classList.contains('ovs-mlist')) { if (v.nextSibling !== el) v.after(el); } else if (el.parentNode !== v) v.appendChild(el);
        el.classList.add('in');
      } else if (!mob && el.parentNode !== el.__home) { el.__home.appendChild(el); el.classList.remove('in'); }
    });
  }
  const go = () => { try { relocate(); } catch (e) { console.error('overlays-site', e); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else setTimeout(go, 0);
  window.addEventListener('load', go);
  try { matchMedia(MQ).addEventListener('change', go); } catch (e) {}
})();
