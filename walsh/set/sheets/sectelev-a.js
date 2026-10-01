/* sectelev-a crew · A3.1 Building sections (9/30/26)
   Section 3 through the living room looking west, section 4 through the primary suite and the lower level looking north,
   a wall section strip at the living room glass, a key plan and a levels table. True scale, sheet inches throughout.
   The two sections are cut from the pocket model by sheets/tools/sectelev-a/build_a31.py, the same ?draw hook and
   method as A3.0 (3/16 in = 1 ft, 200 px per inch). That script rewrites the data block below; the rest is by hand. */
(function () {
  const A31 = /*A31:DATA*/{"views":{"A3.1-3":{"img":"sheets/assets/sectelev-a/A3.1-3.webp","px":3786,"py":1319,"h0":-81.37,"h1":19.59,"y0":-1.273,"y1":33.9,"cut":[-61.86,16.56,0.33,31.98],"view":"E","at":34.0,"axis":"x","nat":[[-81.0,1.99],[-80.0,1.99],[-79.0,1.99],[-78.0,1.99],[-77.0,1.98],[-76.0,1.98],[-75.0,1.98],[-74.0,1.98],[-73.0,1.98],[-72.0,1.98],[-71.0,1.99],[-70.0,1.99],[-69.0,1.99],[-68.0,1.99],[-67.0,1.99],[-66.0,2.0],[-65.0,2.0],[-64.0,2.01],[-63.0,2.02],[-62.0,2.03],[-61.0,2.04],[-60.0,2.05],[-59.0,2.07],[-58.0,2.08],[-57.0,2.09],[-56.0,2.11],[-55.0,2.12],[-54.0,2.14],[-53.0,2.16],[-52.0,2.18],[-51.0,2.2],[-50.0,2.23],[-49.0,2.25],[-48.0,2.28],[-47.0,2.3],[-46.0,2.33],[-45.0,2.36],[-44.0,2.39],[-43.0,2.42],[-42.0,2.45],[-41.0,2.49],[-40.0,2.52],[-39.0,2.55],[-38.0,2.59],[-37.0,2.62],[-36.0,2.66],[-35.0,2.7],[-34.0,2.74],[-33.0,2.78],[-32.0,2.82],[-31.0,2.86],[-30.0,2.9],[-29.0,2.95],[-28.0,2.99],[-27.0,3.04],[-26.0,3.08],[-25.0,3.13],[-24.0,3.18],[-23.0,3.23],[-22.0,3.28],[-21.0,3.33],[-20.0,3.38],[-19.0,3.43],[-18.0,3.48],[-17.0,3.54],[-16.0,3.59],[-15.0,3.65],[-14.0,3.7],[-13.0,3.76],[-12.0,3.82],[-11.0,3.87],[-10.0,3.93],[-9.0,3.99],[-8.0,4.04],[-7.0,4.1],[-6.0,4.16],[-5.0,4.22],[-4.0,4.28],[-3.0,4.34],[-2.0,4.41],[-1.0,4.47],[0.0,4.53],[1.0,4.59],[2.0,4.65],[3.0,4.71],[4.0,4.78],[5.0,4.84],[6.0,4.9],[7.0,4.97],[8.0,5.03],[9.0,5.09],[10.0,5.16],[11.0,5.22],[12.0,5.28],[13.0,5.34],[14.0,5.4],[15.0,5.46],[16.0,5.53],[17.0,5.59],[18.0,5.65],[19.0,5.72]],"grade":[[-82.0,1.99],[-81.0,1.99],[-80.0,1.99],[-79.0,1.99],[-78.0,1.99],[-77.0,1.98],[-76.0,1.98],[-75.0,1.98],[-74.0,1.98],[-73.0,1.98],[-72.0,1.98],[-71.0,1.99],[-70.0,1.99],[-69.0,1.99],[-68.0,1.99],[-67.0,1.99],[-66.0,2.0],[-65.0,2.0],[-64.0,2.01],[-63.0,2.02],[-62.0,2.03],[-61.0,2.04],[-60.0,2.05],[-59.0,1.73],[-58.0,1.73],[-57.0,1.73],[-56.0,1.73],[-55.0,1.73],[-54.0,1.73],[-53.0,1.73],[-52.0,1.73],[-51.0,1.73],[-50.0,1.73],[-49.0,1.73],[-48.0,1.73],[-47.0,1.73],[-46.0,1.73],[-45.0,1.73],[-44.0,1.73],[-43.0,1.73],[-42.0,1.73],[-41.0,1.73],[-40.0,1.73],[-39.0,1.73],[-38.0,1.73],[-37.0,1.73],[-36.0,1.73],[-35.0,2.7],[-34.0,2.74],[-33.0,2.78],[-32.0,2.82],[-31.0,2.86],[-30.0,2.9],[-29.0,2.95],[-28.0,2.99],[-27.0,3.04],[-26.0,3.08],[-25.0,3.13],[-24.0,3.18],[-23.0,3.23],[-22.0,3.28],[-21.0,3.33],[-20.0,3.38],[-19.0,3.43],[-18.0,3.48],[-17.0,3.54],[-16.0,3.59],[-15.0,3.65],[-14.0,3.7],[-13.0,3.76],[-12.0,3.82],[-11.0,3.87],[-10.0,3.93],[-9.0,3.99],[-8.0,4.04],[-7.0,4.1],[-6.0,4.16],[-5.0,4.22],[-4.0,4.28],[-3.0,4.34],[-2.0,4.41],[-1.0,4.47],[0.0,4.53],[1.0,4.59],[2.0,4.65],[3.0,4.71],[4.0,4.78],[5.0,4.84],[6.0,4.9],[7.0,4.97],[8.0,5.03],[9.0,5.09],[10.0,5.16],[11.0,5.22],[12.0,5.28],[13.0,5.34],[14.0,5.4],[15.0,5.46],[16.0,5.53],[17.0,5.59],[18.0,5.65],[19.0,5.72],[20.0,5.78]],"beyond":[[[-46.5,32.8,29.88],[-45.5,32.8,30.32],[-44.5,32.82,30.55],[-43.5,32.84,30.78],[-42.5,32.86,31.0],[-41.5,32.88,31.23],[-40.5,32.9,31.45],[-39.5,32.92,31.67],[-38.5,32.94,31.9],[-37.5,32.96,32.13],[-36.5,32.99,32.35],[-35.5,33.02,32.58],[-34.5,33.05,32.8],[-33.5,33.07,33.02]]]},"A3.1-4":{"img":"sheets/assets/sectelev-a/A3.1-4.webp","px":4619,"py":1343,"h0":-79.8,"h1":43.373,"y0":-1.913,"y1":33.9,"cut":[-21.6,42.89,0.33,28.62],"view":"S","at":52.0,"axis":"z","nat":[[-79.0,10.43],[-78.0,10.37],[-77.0,10.31],[-76.0,10.25],[-75.0,10.18],[-74.0,10.12],[-73.0,10.05],[-72.0,9.99],[-71.0,9.92],[-70.0,9.85],[-69.0,9.79],[-68.0,9.72],[-67.0,9.65],[-66.0,9.59],[-65.0,9.52],[-64.0,9.45],[-63.0,9.38],[-62.0,9.31],[-61.0,9.24],[-60.0,9.18],[-59.0,9.11],[-58.0,9.04],[-57.0,8.97],[-56.0,8.9],[-55.0,8.83],[-54.0,8.76],[-53.0,8.69],[-52.0,8.62],[-51.0,8.55],[-50.0,8.48],[-49.0,8.41],[-48.0,8.34],[-47.0,8.27],[-46.0,8.2],[-45.0,8.13],[-44.0,8.06],[-43.0,7.99],[-42.0,7.93],[-41.0,7.86],[-40.0,7.79],[-39.0,7.72],[-38.0,7.65],[-37.0,7.58],[-36.0,7.52],[-35.0,7.45],[-34.0,7.38],[-33.0,7.31],[-32.0,7.24],[-31.0,7.17],[-30.0,7.11],[-29.0,7.04],[-28.0,6.97],[-27.0,6.91],[-26.0,6.84],[-25.0,6.77],[-24.0,6.71],[-23.0,6.64],[-22.0,6.58],[-21.0,6.51],[-20.0,6.45],[-19.0,6.38],[-18.0,6.32],[-17.0,6.25],[-16.0,6.18],[-15.0,6.12],[-14.0,6.05],[-13.0,5.99],[-12.0,5.92],[-11.0,5.86],[-10.0,5.79],[-9.0,5.73],[-8.0,5.66],[-7.0,5.59],[-6.0,5.53],[-5.0,5.46],[-4.0,5.39],[-3.0,5.33],[-2.0,5.26],[-1.0,5.19],[0.0,5.12],[1.0,5.05],[2.0,4.98],[3.0,4.91],[4.0,4.84],[5.0,4.77],[6.0,4.69],[7.0,4.62],[8.0,4.55],[9.0,4.47],[10.0,4.4],[11.0,4.32],[12.0,4.25],[13.0,4.17],[14.0,4.09],[15.0,4.0],[16.0,3.92],[17.0,3.84],[18.0,3.75],[19.0,3.67],[20.0,3.58],[21.0,3.49],[22.0,3.4],[23.0,3.31],[24.0,3.21],[25.0,3.12],[26.0,3.02],[27.0,2.92],[28.0,2.82],[29.0,2.72],[30.0,2.61],[31.0,2.51],[32.0,2.4],[33.0,2.29],[34.0,2.18],[35.0,2.07],[36.0,1.95],[37.0,1.84],[38.0,1.72],[39.0,1.59],[40.0,1.47],[41.0,1.35],[42.0,1.22],[43.0,1.1]],"grade":[[-80.5,10.52],[-79.5,10.46],[-78.5,10.4],[-77.5,10.34],[-76.5,10.28],[-75.5,10.21],[-74.5,10.15],[-73.5,10.09],[-72.5,10.02],[-71.5,9.95],[-70.5,9.89],[-69.5,9.82],[-68.5,9.75],[-67.5,9.69],[-66.5,9.62],[-65.5,9.55],[-64.5,9.48],[-63.5,9.41],[-62.5,9.35],[-61.5,9.28],[-60.5,9.21],[-59.5,9.14],[-58.5,9.07],[-57.5,9.0],[-56.5,8.94],[-55.5,8.87],[-54.5,8.79],[-53.5,8.72],[-52.5,8.65],[-51.5,8.59],[-50.5,8.52],[-49.5,8.45],[-48.5,8.38],[-47.5,8.3],[-46.5,8.23],[-45.5,8.16],[-44.5,8.1],[-43.5,8.03],[-42.5,7.96],[-41.5,7.89],[-40.5,7.83],[-39.5,7.76],[-38.5,7.69],[-37.5,7.62],[-36.5,7.55],[-35.5,7.48],[-34.5,7.42],[-33.5,7.35],[-32.5,7.28],[-31.5,7.21],[-30.5,7.14],[-29.5,7.07],[-28.5,7.01],[-27.5,6.94],[-26.5,6.87],[-25.5,6.81],[-24.5,6.74],[-23.5,6.67],[-22.5,6.61],[-21.5,6.54],[-20.5,6.48],[-19.5,6.42],[-18.5,6.35],[-17.5,6.28],[-16.5,6.22],[-15.5,6.15],[-14.5,6.08],[-13.5,6.02],[-12.5,5.96],[-11.5,5.89],[-10.5,5.83],[-9.5,5.76],[-8.5,5.69],[-7.5,5.63],[-6.5,5.56],[-5.5,5.49],[-4.5,5.43],[-3.5,5.36],[-2.5,5.29],[-1.5,5.22],[-0.5,5.15],[0.5,1.5],[1.5,1.5],[2.5,1.5],[3.5,1.5],[4.5,1.5],[5.5,1.5],[6.5,1.5],[7.5,1.5],[8.5,1.5],[9.5,1.5],[10.5,1.5],[11.5,1.5],[12.5,1.5],[13.5,1.5],[14.5,1.5],[15.5,1.5],[16.5,1.5],[17.5,1.5],[18.5,1.5],[19.5,1.5],[20.5,1.5],[21.5,1.5],[22.5,1.5],[23.5,1.5],[24.5,1.5],[25.5,1.5],[26.5,1.73],[27.5,1.73],[28.5,1.73],[29.5,1.73],[30.5,1.73],[31.5,1.73],[32.5,1.73],[33.5,1.73],[34.5,1.73],[35.5,1.73],[36.5,1.73],[37.5,1.73],[38.5,1.66],[39.5,1.53],[40.5,1.41],[41.5,1.29],[42.5,1.16],[43.5,1.03]],"beyond":[[[23.5,33.68,30.91],[24.5,33.59,31.19],[25.5,33.51,31.48],[26.5,33.42,31.78],[27.5,33.33,32.09],[28.5,33.24,32.41],[29.5,33.15,32.73],[30.5,33.07,33.02],[31.5,32.97,32.68],[32.5,32.93,32.54],[33.5,32.93,31.08],[34.5,33.76,31.8],[35.5,33.76,32.46],[36.5,33.76,32.99]]]}},"key":{"svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"dsvg\" viewBox=\"-86 -26 136 112\" preserveAspectRatio=\"xMidYMid meet\" aria-hidden=\"true\"><path d=\"M-20.58 7.94 L35.82 7.94 L35.82 -14.56 L-63.58 -14.56 L-63.58 -15.06 L-75.78 -15.06 L-75.78 7.27 L-63.58 7.27 L-63.58 15.27 L-38.58 15.27 L-38.58 -6.06 L-20.58 -6.06ZM0.03 47.15 L15.90 41.96 L15.90 8.12 L0.03 8.06ZM-0.10 35.00 L-5.00 35.00 L-5.00 48.67 L-0.10 47.08ZM0.03 70.77 L25.80 62.38 L25.80 38.73 L0.03 47.16ZM-20.60 77.50 L-0.10 70.83 L-0.10 47.20 L-20.60 53.91Z\" fill=\"rgba(27,26,24,.08)\" stroke=\"#1b1a18\" stroke-width=\"0.9\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\" /><path d=\"M16.30 8.45 L35.85 8.45 L35.85 35.24 L30.52 36.98 L22.31 39.65 L16.30 41.44 Z\" fill=\"none\" stroke=\"#1b1a18\" stroke-width=\"0.5\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\" opacity=\"0.5\" /><path d=\"M43.12 59.79 L41.94 20.30 L35.85 18.51 L35.85 35.24 L30.54 36.98 L30.49 37.36 L26.45 38.87 L26.45 61.84 L37.67 58.33 L37.80 58.70 L42.09 60.13 Z\" fill=\"none\" stroke=\"#1b1a18\" stroke-width=\"0.5\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\" opacity=\"0.5\" /><path d=\"M25.81 62.38 L25.81 38.73 L25.81 38.73 L25.81 38.73 L25.81 38.73 L25.81 38.73 L25.81 38.73 L25.81 38.72 L25.81 38.72 L25.81 38.72 L25.81 38.72 L25.81 38.72 L25.80 38.72 L25.80 38.72 L22.42 39.82 L21.48 40.13 L21.19 40.22 L20.97 40.29 L20.97 40.29 L20.41 40.48 L20.41 40.48 L20.41 40.48 L20.40 40.48 L20.40 40.48 L20.40 40.48 L20.40 40.48 L20.40 40.48 L20.38 40.49 L20.09 40.58 L18.73 41.03 L18.73 41.03 L18.73 41.03 L18.73 41.03 L18.73 41.03 L18.73 41.03 L18.73 41.03 L18.61 41.07 L18.61 41.07 L18.32 41.16 L17.08 41.57 L17.08 41.57 L17.07 41.57 L17.07 41.57 L17.05 41.58 L17.05 41.58 L17.05 41.58 L17.04 41.58 L17.02 41.59 L17.02 41.59 L17.02 41.59 L17.01 41.59 L17.01 41.59 L16.79 41.67 L16.77 41.67 L16.74 41.68 L16.74 41.68 L16.62 41.72 L16.37 41.80 L16.33 41.81 L16.33 41.81 L16.02 41.91 L15.91 41.95 L15.91 41.94 L0.02 47.10 L0.02 47.15 L0.02 47.15 L0.02 47.15 L0.02 47.15 L0.02 47.15 L0.02 47.16 L0.02 47.16 L0.02 47.16 L0.02 47.16 L0.02 47.16 L0.02 47.16 L0.02 70.76Z\" fill=\"rgba(27,26,24,.12)\" stroke=\"#1b1a18\" stroke-width=\"0.5\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\" opacity=\"0.7\" /><path d=\"M8 -18 V80 M-79 -2 H43\" fill=\"none\" stroke=\"#1b1a18\" stroke-width=\"0.6\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\" stroke-dasharray=\"3 3\" opacity=\"0.3\" /><path d=\"M34 -21 V81\" fill=\"none\" stroke=\"#c07a2c\" stroke-width=\"1.3\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\" stroke-dasharray=\"6 3\" /><path d=\"M34 -21 H28 M34 81 H28\" fill=\"none\" stroke=\"#c07a2c\" stroke-width=\"1.3\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\" /><path d=\"M28.6 -22.9 L25.4 -21 L28.6 -19.1 Z M28.6 79.1 L25.4 81 L28.6 82.9 Z\" fill=\"#c07a2c\" /><path d=\"M-80 52 H46\" fill=\"none\" stroke=\"#c07a2c\" stroke-width=\"1.3\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\" stroke-dasharray=\"6 3\" /><path d=\"M-80 52 V46 M46 52 V46\" fill=\"none\" stroke=\"#c07a2c\" stroke-width=\"1.3\" vector-effect=\"non-scaling-stroke\" stroke-linejoin=\"round\" /><path d=\"M-81.9 46.6 L-80 43.4 L-78.1 46.6 Z M44.1 46.6 L46 43.4 L47.9 46.6 Z\" fill=\"#c07a2c\" /><circle cx=\"-14.59\" cy=\"24.67\" r=\"1.8\" fill=\"#c07a2c\"/></svg>","vb":[-86.0,-26.0,136.0,112.0],"bubbles":[[3,34,-29.5],[3,34,89.5],[4,-89,52],[4,55,52]],"north":39.3},"datum":5990.0,"ppi":200}/*A31:END*/;
  if (!A31.views || !window.LIVING_SHEETS) return;

  const S = 3 / 16, PPI = 200, DW = 2.2, DATUM = 5990;
  const INK = '#1b1a18', ACC = '#c07a2c', TIM = '#c98a52';
  const NS = 'vector-effect="non-scaling-stroke"';
  const r3 = v => +(+v).toFixed(3);
  const el = y => (DATUM + y).toFixed(1);
  const ftin = v => { let f = Math.floor(v + 1e-6), i = Math.round((v - f) * 12); if (i === 12) { f += 1; i = 0; } return `${f}′ ${i}″`; };

  /* ---------------------------------------------------------------- the two sections, placed at sheet inches */
  function geo(key, x, y) {
    const v = A31.views[key], iw = v.px / PPI, ih = v.py / PPI;
    const g = { v, x, y, iw, ih, w: iw + DW, h: ih };
    g.X = h => (h - v.h0) * S;                 // view inches
    g.Y = yy => (v.y1 - yy) * S;
    g.at = (h, yy) => [r3(x + g.X(h)), r3(y + g.Y(yy))];   // sheet inches
    return g;
  }
  const G3 = geo('A3.1-3', 1.9, 3.55);
  const G4 = geo('A3.1-4', 1.9, 11.55);

  const lerp = (arr, h) => {                    // arr sorted by h: [[h, y]]
    if (h <= arr[0][0]) return arr[0][1];
    for (let i = 1; i < arr.length; i++) if (arr[i][0] >= h) { const [a, b] = [arr[i - 1], arr[i]]; return a[1] + (b[1] - a[1]) * (h - a[0]) / ((b[0] - a[0]) || 1); }
    return arr[arr.length - 1][1];
  };
  const line = (pts, st) => `<path d="M${pts.map(p => `${r3(p[0])} ${r3(p[1])}`).join(' L')}" fill="none" ${st} ${NS} stroke-linejoin="round" stroke-linecap="round"/>`;

  function sectionHTML(ctx, G, o) {
    const { U, FX, FY, esc } = ctx, v = G.v, W = G.w, H = G.h;
    const pc = (x, y) => `left:${r3(100 * x / W)}%;top:${r3(100 * y / H)}%`;
    const lbl = (x, y, t, s, k, st) => `<span class="lbl ${k || 'room'}" style="${pc(x, y)}${st || ''}"><b>${esc(t)}</b>${s ? `<i>${esc(s)}</i>` : ''}</span>`;
    let ov = '', lb = '';
    // level datums: a faint dashed hairline across the cut, a darker stub and a tag in the run at the right
    const dx = G.iw + 0.3;
    o.datums.forEach(([t, yy, hot]) => {
      const py = r3(G.Y(yy));
      ov += `<path d="M0 ${py} H${r3(G.iw - 0.1)}" stroke="${INK}" stroke-width="0.5" stroke-dasharray="2 5" opacity=".2" ${NS}/>`;
      ov += `<path d="M${r3(G.iw - 0.1)} ${py} H${r3(dx + 0.3)}" stroke="${INK}" stroke-width="0.5" stroke-dasharray="3 3" opacity=".55" ${NS}/>`;
      ov += `<path d="M${r3(dx)} ${py} l0.09 -0.14 h-0.18 Z" fill="${hot ? ACC : INK}"/>`;
      lb += lbl(dx + 0.18, py, t, el(yy), 'dat');
    });
    // natural grade where the cut runs under the house (dashed), and the 30 ft line over it, following grade
    const nat = v.nat, runs = [];
    let run = [];
    nat.forEach(([h, g]) => { if (Math.abs(lerp(v.grade, h) - g) > 0.25) run.push([G.X(h), G.Y(g)]); else if (run.length) { runs.push(run); run = []; } });
    if (run.length) runs.push(run);
    runs.filter(r => r.length > 2).forEach(r => { ov += line(r, `stroke="${INK}" stroke-width="0.8" stroke-dasharray="5 3 1 3" opacity=".55"`); });
    ov += line(nat.map(([h, g]) => [G.X(h), G.Y(g + 30)]), `stroke="${ACC}" stroke-width="1.1" stroke-dasharray="7 4"`);
    const la = o.limAt;
    lb += lbl(G.X(la), G.Y(lerp(nat, la) + 30) - 0.13, '30 ft over natural grade', '', 'lim');
    if (o.natAt != null) lb += lbl(G.X(o.natAt), G.Y(lerp(nat, o.natAt)) - 0.12, 'natural grade', '', 'dim', ';opacity:.8');
    // a roof seen beyond the cut sits over its own grade: its own 30 ft line, dotted, where it comes close
    (v.beyond || []).forEach(r => {
      ov += line(r.map(([h, lim]) => [G.X(h), G.Y(lim)]), `stroke="${ACC}" stroke-width="0.8" stroke-dasharray="1.5 2.5"`);
    });
    if (o.beyondAt) lb += lbl(G.X(o.beyondAt[0]), G.Y(o.beyondAt[1]), 'dotted · the 30 ft line over the roof beyond', '', 'lim', ';opacity:.9');
    // vertical dimensions
    (o.dims || []).forEach(([h, y0, y1, side, sub]) => {
      const x = G.X(h), a = G.Y(y0), b = G.Y(y1), t = 0.06;
      ov += `<path d="M${r3(x)} ${r3(a + 0.06)} V${r3(b - 0.06)} M${r3(x - 0.13)} ${r3(a)} H${r3(x + 0.13)} M${r3(x - 0.13)} ${r3(b)} H${r3(x + 0.13)}" stroke="${INK}" stroke-width="0.7" ${NS}/>`;
      ov += `<path d="M${r3(x - t)} ${r3(a + t)} L${r3(x + t)} ${r3(a - t)} M${r3(x - t)} ${r3(b + t)} L${r3(x + t)} ${r3(b - t)}" stroke="${INK}" stroke-width="1.3" ${NS}/>`;
      const lx = x + side * 0.12, ly = (a + b) / 2;
      lb += `<span class="lbl dim sea-dim${side < 0 ? ' l' : ''}" style="${pc(lx, ly)}"><b>${esc(ftin(Math.abs(y1 - y0)))}</b>${sub ? `<i>${esc(sub)}</i>` : ''}</span>`;
    });
    (o.labels || []).forEach(([h, yy, t, s, k]) => { lb += lbl(G.X(h), G.Y(yy), t, s, k); });
    ov += o.extra ? o.extra(G) : '';
    lb += o.extraLb ? o.extraLb(G, pc) : '';
    const img = `<img class="dimg" src="${esc(v.img)}" alt="${esc(o.alt)}" width="${v.px}" height="${v.py}" style="width:${r3(100 * G.iw / W)}%;height:100%" decoding="async">`;
    return `<div class="view dv sea-sec" style="left:${U(FX(G.x))};top:${U(FY(G.y))};width:${U(W)};height:${U(H)};--ar:${r3(W / H)}">${img}` +
      `<svg class="dov" viewBox="0 0 ${r3(W)} ${r3(H)}" preserveAspectRatio="none" aria-hidden="true">${ov}</svg>${lb}</div>`;
  }

  /* ---------------------------------------------------------------- view titles and scale bars */
  function bar(ctx, sc, ft) {
    const L = ft[ft.length - 1];
    let r = '';
    for (let k = 1; k < ft.length; k++) r += `<rect x="${ft[k - 1] / L}" y="0" width="${(ft[k] - ft[k - 1]) / L}" height="1" class="${k % 2 ? 'on' : ''}"/>`;
    const labs = ft.map(v => `<span style="left:${r3(100 * v / L)}%">${v}${v === L ? ' ft' : ''}</span>`).join('');
    return `<span class="gbar" style="width:${ctx.U(L * sc)}"><svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">${r}</svg>${labs}</span>`;
  }
  function title(ctx, n, t, s, sc, ft, xr, y) {      // right aligned: xr is the right end, sheet inches
    return `<div class="dvt sea-vt" style="left:${ctx.U(ctx.FX(xr))};top:${ctx.U(ctx.FY(y))}">${ctx.viewTitle(n, t, s)}${bar(ctx, sc, ft)}</div>`;
  }

  /* ---------------------------------------------------------------- the wall section strip, 3/8 in = 1 ft, broken */
  const WS = { x: 23.4, y: 3.45, w: 8.7, h: 6.65, s: 0.375, gx: 4.15, top: 32.6, midA: 26.6, midB: 10.4, gap: 0.32 };
  const wx = u => r3(WS.gx + u * WS.s);
  const wyA = y => r3(0.3 + (WS.top - y) * WS.s);
  const wyB = y => r3(0.3 + (WS.top - WS.midA) * WS.s + WS.gap + (WS.midB - y) * WS.s);
  const yt = u => 31.0 - 0.35 * u;                 // roof top over the south glass at the cut, rising to the court
  function poly(pts, Y, st) { return `<path d="M${pts.map(([u, y]) => `${wx(u)} ${Y(y)}`).join(' L')} Z" ${st} ${NS}/>`; }
  function band(u0, u1, f0, f1, Y, st, n = 8) {   // a band under the roof slope, f0 and f1 are offsets below the top
    const a = [], b = [];
    for (let k = 0; k <= n; k++) { const u = u0 + (u1 - u0) * k / n; a.push([u, yt(u) - f0]); b.push([u, yt(u) - f1]); }
    return poly(a.concat(b.reverse()), Y, st);
  }
  const rect = (u0, u1, y0, y1, Y, st) => poly([[u0, y0], [u1, y0], [u1, y1], [u0, y1]], Y, st);

  function wallSection(ctx) {
    const { U, FX, FY, esc } = ctx;
    const cut = `stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"`, thin = `stroke="${INK}" stroke-width="0.45"`;
    const conc = `fill="url(#sea-conc)" ${cut}`, ins = `fill="url(#sea-ins)" ${thin}`, grav = `fill="url(#sea-grav)" ${thin}`;
    const steel = `fill="#2a2926" ${thin}`, frame = `fill="#4a4843" ${thin}`, glass = `fill="rgba(150,176,186,.28)" ${thin}`;
    const wood = op => `fill="${TIM}" fill-opacity="${op}" ${thin}`;
    const defs = `<defs>
      <pattern id="sea-conc" width=".16" height=".16" patternUnits="userSpaceOnUse"><rect width=".16" height=".16" fill="#f1efea"/><circle cx=".04" cy=".05" r=".008" fill="${INK}" opacity=".55"/><circle cx=".11" cy=".12" r=".006" fill="${INK}" opacity=".45"/><path d="M.1 .02 l.025 .03 h-.04 Z" fill="none" stroke="${INK}" stroke-width=".004" opacity=".5"/></pattern>
      <pattern id="sea-ins" width=".12" height=".3" patternUnits="userSpaceOnUse"><rect width=".12" height=".3" fill="#f6f5f1"/><path d="M0 .15 Q.03 0 .06 .15 T.12 .15" fill="none" stroke="${INK}" stroke-width=".006" opacity=".55"/></pattern>
      <pattern id="sea-grav" width=".09" height=".07" patternUnits="userSpaceOnUse"><circle cx=".025" cy=".03" r=".017" fill="none" stroke="${INK}" stroke-width=".005" opacity=".6"/><circle cx=".07" cy=".055" r=".012" fill="none" stroke="${INK}" stroke-width=".005" opacity=".5"/></pattern>
      <pattern id="sea-earth" width=".1" height=".1" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2=".1" stroke="${INK}" stroke-width=".006" opacity=".45"/></pattern>
      <clipPath id="sea-cA"><rect x="${wx(-4.2)}" y="${wyA(33.1)}" width="${r3(7.7 * WS.s)}" height="${r3(wyA(WS.midA) - wyA(33.1))}"/></clipPath>
      <clipPath id="sea-cB"><rect x="${wx(-4.2)}" y="${wyB(WS.midB)}" width="${r3(7.7 * WS.s)}" height="${r3(wyB(0.6) - wyB(WS.midB))}"/></clipPath>
    </defs>`;
    // roof and head, zone A
    let a = '';
    a += band(-2.62, 3.6, 1.0, 2.17, wyA, wood(0.2));                                     // joists, rafter tails into the soffit
    a += band(-2.62, 3.6, 0.83, 1.0, wyA, wood(0.5));                                     // T and G deck
    a += band(-2.4, 3.6, 0.08, 0.83, wyA, ins);                                           // insulation over the deck
    a += band(-2.72, -2.4, 0.08, 0.83, wyA, wood(0.45));                                  // edge blocking
    a += band(-2.72, 3.6, 0, 0.08, wyA, `fill="${INK}"`);                                 // standing seam
    for (let u = -2.2; u < 3.6; u += 1.4) a += `<path d="M${wx(u)} ${wyA(yt(u))} v-0.05" stroke="${INK}" stroke-width="0.8" ${NS}/>`;
    a += band(-2.62, 0, 2.17, 2.3, wyA, `fill="#dddbd5" ${thin}`);                       // enclosed soffit
    a += poly([[-2.86, yt(-2.72) + 0.08], [-2.72, yt(-2.72) + 0.08], [-2.72, yt(-2.72) - 2.45], [-2.86, yt(-2.72) - 2.45]], wyA, steel);   // dark steel fascia
    a += rect(0, 0.55, 28.3, yt(0.55) - 2.17, wyA, steel);                                // steel header
    a += rect(0.08, 0.47, 28.12, 28.3, wyA, frame);                                       // glass frame, head
    a += rect(0.2, 0.32, WS.midA - 0.4, 28.12, wyA, glass);                               // dual glazed panel
    a += `<path d="M${wx(0.26)} ${wyA(28.12)} V${wyA(WS.midA - 0.4)}" stroke="${INK}" stroke-width="0.3" opacity=".6" ${NS}/>`;
    // floor, terrace and foundation, zone B
    let b = '';
    b += rect(-4.4, -0.25, 4.05, 2.6, wyB, `fill="url(#sea-earth)" stroke="none"`);
    b += rect(0.42, 3.8, 6.43, 4.2, wyB, `fill="url(#sea-earth)" stroke="none" opacity=".7"`);
    b += rect(-4.4, -0.3, 4.05, 4.3, wyB, grav);                                          // zone 0 gravel
    b += `<path d="M${wx(-4.4)} ${wyB(4.1)} L${wx(-0.25)} ${wyB(4.03)}" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" ${NS}/>`;
    b += rect(-1.2, 1.35, 0.8, 1.8, wyB, conc);                                           // footing
    b += rect(-0.25, 0.42, 1.8, 7.45, wyB, conc);                                         // stem wall
    [[-0.8, 1.1], [0, 1.1], [0.85, 1.1], [0.08, 3.2], [0.08, 5.4]].forEach(([u, y]) => { b += `<circle cx="${wx(u)}" cy="${wyB(y)}" r=".018" fill="${INK}"/>`; });
    b += rect(0.42, 0.55, 5.9, 7.1, wyB, ins);                                            // slab edge insulation
    b += rect(0.55, 3.8, 6.43, 6.93, wyB, grav);                                          // gravel
    b += rect(0.55, 3.8, 6.93, 7.1, wyB, ins);                                            // under slab insulation
    b += rect(0.42, 3.8, 7.1, 7.5, wyB, conc);                                            // slab, radiant
    for (let u = 0.9; u < 3.8; u += 0.6) b += `<circle cx="${wx(u)}" cy="${wyB(7.26)}" r=".022" fill="none" stroke="${INK}" stroke-width="0.5" ${NS}/>`;
    b += rect(0.08, 0.47, 7.5, 7.75, wyB, frame);                                         // glass frame, sill
    b += rect(0.2, 0.32, 7.75, WS.midB + 0.4, wyB, glass);
    b += `<path d="M${wx(0.26)} ${wyB(7.75)} V${wyB(WS.midB + 0.4)}" stroke="${INK}" stroke-width="0.3" opacity=".6" ${NS}/>`;
    b += rect(-0.62, -0.25, 6.2, 7.13, wyB, wood(0.4));                                   // ledger
    b += rect(-4.4, -0.62, 6.2, 7.13, wyB, wood(0.16));                                   // deck joist
    for (let u = -0.35; u > -4.4; u -= 0.5) b += rect(Math.max(u - 0.46, -4.4), u, 7.13, 7.25, wyB, wood(0.55));   // deck boards, gapped
    // break lines and the glass run between
    const brk = yy => { const x0 = wx(-4.3), x1 = wx(3.7), xm = wx(2.3), d = 0.07;
      return `<path d="M${x0} ${yy} H${r3(xm - d)} L${r3(xm - d / 2)} ${r3(yy - d * 1.4)} L${r3(xm + d / 2)} ${r3(yy + d * 1.4)} L${r3(xm + d)} ${yy} H${x1}" fill="none" stroke="${INK}" stroke-width="0.6" ${NS}/>`; };
    const yA = wyA(WS.midA), yB = wyB(WS.midB);
    let brks = brk(yA) + brk(yB);
    brks += `<path d="M${wx(0.2)} ${yA} V${yB} M${wx(0.32)} ${yA} V${yB}" stroke="${INK}" stroke-width="0.4" stroke-dasharray="1 2" opacity=".6" ${NS}/>`;
    // notes: [side, sheet y in the strip, head, line, zone, u, y]
    const cc = 'concept, confirm';
    const N = [
      ['r', 0.22, 'Standing seam roof', `about 6021.0 at the glass · Class A, Chapter 7A · ${cc}`, 'A', 2.8, yt(2.8) - 0.03],
      ['r', 0.93, 'Insulation over the deck', 'Title 24, climate zone 16 · confirm', 'A', 3.15, yt(3.15) - 0.45],
      ['r', 1.5, 'T and G deck, timber joists', 'joists square to the fold beam', 'A', 2.2, yt(2.2) - 1.55],
      ['r', 2.05, 'Steel header', 'size per structural · confirm', 'A', 0.45, 28.55],
      ['r', 2.62, 'Glass wall to about 6018.1', `square panels, 4 by 8 ft max · dual glazed, tempered, Chapter 7A · ${cc}`, 'A', 0.26, 27.1],
      ['r', 3.62, 'Main floor 5997.5', 'slab on grade, radiant · concept', 'B', 2.7, 7.5],
      ['r', 4.22, 'Under the slab', 'rigid insulation, Title 24 · confirm', 'B', 3.0, 7.0],
      ['r', 5.82, 'Stem wall and footing', 'below frost, depth per geotech · confirm', 'B', 1.1, 1.3],
      ['l', 0.22, 'Snow load', 'Placer County ground snow load · confirm', 'A', -1.8, yt(-1.8) + 0.01],
      ['l', 0.95, 'Dark steel fascia', `noncombustible, Chapter 7A · ${cc}`, 'A', -2.8, yt(-2.72) - 1.3],
      ['l', 1.72, 'Enclosed soffit', `ignition resistant, no vents, Chapter 7A · ${cc}`, 'A', -1.4, yt(-1.4) - 2.24],
      ['l', 3.55, 'Upper terrace 5997.25', `ignition resistant decking, Chapter 7A · ${cc}`, 'B', -2.6, 7.2],
      ['l', 4.45, 'Deck framing, ledger', `per Chapter 7A, flashed to the stem · ${cc}`, 'B', -2.2, 6.6],
      ['l', 5.4, 'Grade about 5994.0', `Zone 0, 5 ft of ember resistant ground, gravel · ${cc}`, 'B', -3.2, 4.2],
    ];
    let lead = '', txt = '';
    const pc = (x, y) => `left:${r3(100 * x / WS.w)}%;top:${r3(100 * y / WS.h)}%`;
    N.forEach(([side, ny, head, sub, z, u, y]) => {
      const px = +wx(u), py = +(z === 'A' ? wyA(y) : wyB(y));
      const tx = side === 'r' ? 5.62 : 2.42, ax = side === 'r' ? tx - 0.06 : tx + 0.06, ay = ny + 0.09;
      const kx = side === 'r' ? Math.max(ax - 0.18, px + 0.12) : Math.min(ax + 0.18, px - 0.12);
      lead += `<path d="M${r3(ax)} ${r3(ay)} H${r3(kx)} L${r3(px)} ${r3(py)}" fill="none" stroke="${INK}" stroke-width="0.5" opacity=".7" ${NS}/><circle cx="${r3(px)}" cy="${r3(py)}" r=".025" fill="${INK}"/>`;
      const s2 = esc(sub).replace(cc, `<em>${cc}</em>`);
      txt += `<span class="sea-n ${side}" style="${pc(tx, ny)}"><b>${esc(head)}</b><i>${s2}</i></span>`;
    });
    txt += `<span class="sea-gl" style="${pc(+wx(0.05), (yA + yB) / 2)}">glass continues, about 20 ft</span>`;
    const svg = `<svg class="dov" viewBox="0 0 ${WS.w} ${WS.h}" preserveAspectRatio="none" aria-hidden="true">${defs}<g clip-path="url(#sea-cA)">${a}</g><g clip-path="url(#sea-cB)">${b}</g>${brks}<g class="sea-ld">${lead}</g></svg>`;
    return `<div class="view dv sea-ws" style="left:${U(FX(WS.x))};top:${U(FY(WS.y))};width:${U(WS.w)};height:${U(WS.h)};--ar:${r3(WS.w / WS.h)}">${svg}${txt}</div>`;
  }

  /* ---------------------------------------------------------------- key plan, levels table */
  const KP = { x: 27.62, y: 11.3, w: 4.4 };
  function keyPlan(ctx) {
    const { U, FX, FY } = ctx, K = A31.key, vb = K.vb, kh = KP.w * vb[3] / vb[2];
    const bub = K.bubbles.map(([n, x, y]) => `<span class="lbl bub" style="left:${r3(100 * (x - vb[0]) / vb[2])}%;top:${r3(100 * (y - vb[1]) / vb[3])}%"><b>${n}</b><i>A3.1</i></span>`).join('');
    const a = K.north, s = 0.62;
    const north = `<div class="dnorth" style="left:${U(0.05)};bottom:${U(0.05)};width:${U(s)};height:${U(s)}" aria-label="North"><svg viewBox="-1 -1 2 2" aria-hidden="true"><circle r=".78"/><g transform="rotate(${a})"><path class="nd" d="M0 -.98 L.2 .18 L0 .02 L-.2 .18 Z"/><path class="nl" d="M0 .02 V.78"/></g></svg><span style="left:${r3(50 + 62 * Math.sin(a * Math.PI / 180))}%;top:${r3(50 - 62 * Math.cos(a * Math.PI / 180))}%">N</span></div>`;
    return `<div class="dkey sea-key" style="left:${U(FX(KP.x))};top:${U(FY(KP.y))};width:${U(KP.w)}"><div class="kp" style="height:${U(kh)}">${K.svg}${bub}${north}</div>` +
      `<span class="kc"><b>Key plan</b><i>Cuts 3 and 4 in orange, A3.0 cuts dashed · not to scale</i></span></div>`;
  }
  function levels(ctx) {
    const { U, FX, FY, esc } = ctx;
    const rows = [
      ['Tip, north wing', '6023.0 · 29.4 ft over grade'],
      ['Fold beam', '6012.0'],
      ['Primary suite, level 2', '6004.0'],
      ['Main level', '5997.5'],
      ['Lower level', '5992.5 · one 5 ft step'],
      ['Height limit', '30 ft over natural grade'],
    ];
    return `<div class="dtab" style="left:${U(FX(KP.x))};top:${U(FY(16.05))};width:${U(KP.w)}"><h3>Levels</h3><ul>${rows.map(([k, v]) => `<li><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></li>`).join('')}</ul>` +
      `<p>From the pocket model, ribbon scheme. FA accuracy, confirm on survey.</p></div>`;
  }

  /* ---------------------------------------------------------------- styles for this sheet only */
  const CSS = `<style>
    .sea-vt{transform:translateX(-100%)}
    .sea-dim{transform:translate(0,-50%);align-items:flex-start;text-align:left}
    .sea-dim.l{transform:translate(-100%,-50%);align-items:flex-end;text-align:right}
    .sea-dim i{font:italic 400 max(calc(8px * var(--fl)),calc(var(--u) * .12))/1.1 var(--fs);color:var(--muted)}
    .sea-ws .dov{overflow:visible}
    .sea-n{position:absolute;display:flex;flex-direction:column;gap:calc(var(--u) * .015);width:calc(var(--u) * 3.02);line-height:1.12;pointer-events:none}
    .sea-n.l{transform:translateX(-100%);width:calc(var(--u) * 2.36);align-items:flex-end;text-align:right}
    .sea-n b{font:400 var(--l-b)/1.2 var(--ft);letter-spacing:.13em;text-transform:uppercase;color:var(--ink);white-space:nowrap}
    .sea-n i{font:italic 400 var(--l-i)/1.18 var(--fs);color:var(--muted)}
    .sea-n em{font-style:italic;color:var(--ink)}
    @media screen and (max-width:760px), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
      .sheet[data-id="A3.1"] .fhtml{position:relative;inset:auto}
      .sea-vt{transform:none;max-width:100%}
      .sea-vt .vt{white-space:normal;min-width:0}
      .sea-n,.sea-gl,.sea-ld,.sea-dim{display:none}
    }
    .sea-gl{position:absolute;transform:translate(-100%,-50%);font:italic 400 var(--l-i)/1 var(--fs);color:var(--muted);white-space:nowrap;pointer-events:none}
  </style>`;

  /* ---------------------------------------------------------------- the sheet */
  const V3 = A31.views['A3.1-3'], V4 = A31.views['A3.1-4'];
  const tipCut = V3.cut[3];          // the roof high point in the cut, near the tip
  LIVING_SHEETS.push({
    id: 'A3.1', group: 'Architectural', title: 'Building sections', short: 'Building sections', foot: 'Building sections',
    scale: '3/16 in = 1 ft', issued: [4],
    cap: 'Two more cuts. The living room rising to the tip, looking west, and the primary suite over the lower level, looking north.',
    data: ['Tip 6023.0, 29.4 ft over grade', 'Primary 6004.0 over lower 5992.5', 'Main 5997.5, one 5 ft step down', 'Chapter 7A notes, concept, confirm'],
    notes: [
      { text: 'the tip lifts to the court', t: [17.05, 4.2], p: G3.at(-10.9, tipCut - 0.2), a: 'l' },
      { text: 'one step down with the land', t: [10.3, 18.95], p: G4.at(-0.6, 6.3), a: 'l' },
      { text: 'every roof under 30 ft', t: [2.25, 11.33], p: G4.at(-52, lerp(V4.nat, -52) + 30), a: 'l' },
    ],
    html: ctx => {
      let h = CSS;
      h += sectionHTML(ctx, G3, {
        alt: 'Section 3, through the living room looking west',
        datums: [['Tip', 33.0, 1], ['Fold beam', 22.0], ['Primary', 14.0], ['Main', 7.5], ['Lower', 2.5]],
        limAt: 10.5,
        beyondAt: V3.beyond && V3.beyond.length ? [-40, 35.4] : null,
        labels: [
          [4.5, 11.2, 'Living room', 'double height', 'room'],
          [5.5, 19.7, 'Clerestory at the fold', '', 'room'],
          [-21, 8.9, 'Upper terrace', 'cedar deck', 'room'],
          [-39, 3.7, 'Lower patio', 'stone', 'room'],
          [-54, 16.4, 'Primary terrace', '', 'room'],
          [-73, 16.2, 'South wing beyond', 'primary over lower', 'room'],
        ],
        extra: G => `<rect x="${r3(G.X(-11.4))}" y="${r3(G.Y(33.2))}" width="${r3(6.8 * S)}" height="${r3((33.2 - 0.6) * S)}" rx=".08" fill="none" stroke="${INK}" stroke-width="0.7" stroke-dasharray="4 3" opacity=".75" ${NS}/>`,
        extraLb: (G, pc) => `<span class="lbl bub" style="${pc(G.X(-8), G.Y(33.2) - 0.02)}"><b>5</b><i>A3.1</i></span>`,
      });
      h += sectionHTML(ctx, G4, {
        alt: 'Section 4, through the primary suite and the lower level looking north',
        datums: [['Tip', 33.0, 1], ['Garage roof', 26.5], ['Primary', 14.0], ['Main', 7.5], ['Lower', 2.5]],
        limAt: -66, natAt: 20.5,
        beyondAt: V4.beyond && V4.beyond.length ? [24, 35.3] : null,
        dims: [[0.9, 2.5, 7.5, 1, 'one step'], [26.4, 2.5, 14.0, 1, 'level 2 over lower']],
        labels: [
          [12.5, 18.6, 'Primary suite', 'level 2', 'room'],
          [12, 5.0, 'Lower level', '5992.5', 'room'],
          [-10.5, 11.5, 'Granny suite', 'main level', 'room'],
          [33, 16.4, 'Primary terrace', '', 'room'],
          [36, 4.3, 'Lower patio', '', 'room'],
          [-47, 20.3, 'Garage beyond', '', 'room'],
        ],
      });
      h += wallSection(ctx);
      h += title(ctx, 3, 'Section 3 · living room, looking west', '3/16 in = 1 ft', S, [0, 4, 8, 16], G3.x + G3.w, G3.y + G3.h + 0.22);
      h += title(ctx, 4, 'Section 4 · primary suite and lower level, looking north', '3/16 in = 1 ft', S, [0, 4, 8, 16], G4.x + G4.w, G4.y + G4.h + 0.22);
      h += title(ctx, 5, 'Wall section · the living room glass', '3/8 in = 1 ft · Chapter 7A notes concept, confirm', WS.s, [0, 1, 2, 4], WS.x + WS.w - 0.05, G3.y + G3.h + 0.22);
      h += keyPlan(ctx) + levels(ctx);
      return h;
    }
  });
})();
