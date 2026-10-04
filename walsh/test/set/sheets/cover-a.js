/* cover-a crew sheets (9/30/26): A0.9 Renderings.
   Four stills of the Ribbon scheme rendered from the pocket model (walsh/index.html) at 200 px per inch of sheet,
   each laid into its own hairline drafting (sheets/tools/cover-a: render.py, composite.py, sheet_data.py).
   The rasters carry the render and the linework on clear ground; the datum runs, eye level lines and notes are drawn
   here in vector, placed by the same cameras (the @data block is written by sheet_data.py). */
(function () {
/* @data (sheet_data.py) */
const CA_P = {"arrival":{"p":{"tip":[0.5253,0.3487],"tipGrade":[0.5253,0.6237],"tip30":[0.5253,0.3428],"beam":[0.4157,0.4489],"garageTip":[0.2869,0.33],"treeMid":[0.5054,0.2441],"treeBase":[0.5054,0.6285],"gdoor":[0.3438,0.5183],"bridge":[0.5849,0.5103],"bridgeW":[0.5795,0.5557],"eglass":[0.4892,0.4991],"pit":[0.5697,0.584],"bench":[0.5623,0.5752],"terrace":[0.5256,0.5984],"chimS":[0.7658,0.3788],"chimSmid":[0.7658,0.4551],"chimN":[0.406,0.3955],"main":[0.5128,0.5875],"mainW":[0.3996,0.6218],"primary":[0.7423,0.5335],"primaryRidge":[0.7036,0.3253],"granny":[0.6566,0.4003],"lower":[0.6822,0.6448],"pdeck":[0.6984,0.5267],"drive":[0.378,0.6268],"porch":[0.3394,0.5474],"clere":[0.4145,0.4785],"post":[0.4607,0.543],"stip":[0.6349,0.3454]},"hz":0.4938,"eye":6007.5},"court":{"p":{"tip":[0.6696,0.1808],"tipGrade":[0.6696,0.7325],"tip30":[0.6696,0.169],"beam":[0.6715,0.4436],"garageTip":[0.3508,0.4656],"treeMid":[0.3899,0.266],"treeBase":[0.3899,0.6579],"gdoor":[0.3685,0.5607],"bridge":[0.421,0.5149],"bridgeW":[0.4091,0.5833],"eglass":[0.7175,0.4907],"pit":[0.5242,0.6399],"bench":[0.5008,0.6203],"terrace":[0.5559,0.6608],"chimS":[0.1462,0.2044],"chimSmid":[0.1462,0.3604],"chimN":[0.7107,0.3597],"main":[0.6802,0.6591],"mainW":[0.4645,0.6493],"primary":[0.1832,0.5283],"primaryRidge":[0.2545,0.1642],"granny":[0.2124,0.4247],"lower":[0.3752,0.7885],"pdeck":[0.3177,0.5104],"drive":[0.2536,0.6081],"porch":[0.472,0.5823],"clere":[0.6491,0.4899],"post":[0.5436,0.575],"stip":[0.4326,0.158]},"hz":0.6316,"eye":5999.0},"tip":{"p":{"tip":[0.4496,0.1955],"tipGrade":[0.4496,1.0244],"tip30":[0.4496,0.1777],"beam":[0.5596,0.6091],"garageTip":[0.2288,0.6796],"treeMid":[0.1962,0.3821],"treeBase":[0.1962,0.9344],"gdoor":[0.2371,0.8089],"bridge":[0.1512,0.7175],"bridgeW":[0.149,0.8175],"eglass":[0.5464,0.6628],"pit":[0.2524,0.8886],"bench":[0.2432,0.8641],"terrace":[0.3368,0.9251],"chimN":[0.6144,0.4796],"main":[0.4772,0.9158],"mainW":[0.3274,0.9265],"primaryRidge":[-0.1413,0.2249],"granny":[-0.051,0.6137],"lower":[-0.0774,1.0837],"pdeck":[-0.1357,0.6912],"drive":[0.1044,0.8793],"porch":[0.3582,0.834],"clere":[0.5334,0.6804],"post":[0.3814,0.8096],"stip":[0.0738,0.1882]},"hz":0.9434,"eye":5996.5},"aerial":{"p":{"tip":[0.7567,0.3742],"tipGrade":[0.7401,0.5762],"tip30":[0.7571,0.3696],"beam":[0.6802,0.2912],"garageTip":[0.3054,0.2258],"treeMid":[0.499,0.3178],"treeBase":[0.4991,0.5278],"gdoor":[0.36,0.3271],"bridge":[0.6134,0.5781],"bridgeW":[0.5942,0.595],"eglass":[0.7512,0.4292],"pit":[0.6834,0.6125],"bench":[0.6585,0.5915],"terrace":[0.6676,0.5522],"chimS":[0.6259,0.7827],"chimSmid":[0.6237,0.8303],"chimN":[0.7034,0.2339],"main":[0.7397,0.5307],"mainW":[0.4981,0.4038],"primary":[0.5996,0.8285],"primaryRidge":[0.615,0.6422],"granny":[0.4235,0.5818],"lower":[0.7036,0.8435],"pdeck":[0.6828,0.7859],"drive":[0.2265,0.4194],"porch":[0.4698,0.3072],"clere":[0.6628,0.3133],"post":[0.6105,0.4244],"stip":[0.6947,0.5555]},"hz":null,"eye":6240.0},"cover":{"p":{"tip":[0.7707,0.3416],"tipGrade":[0.7707,0.611],"tip30":[0.7707,0.3358],"beam":[0.7608,0.3853],"garageTip":[0.4591,0.2821],"treeMid":[0.5206,0.2587],"treeBase":[0.5206,0.4679],"gdoor":[0.4801,0.3514],"bridge":[0.569,0.4641],"bridgeW":[0.5561,0.4878],"eglass":[0.8056,0.4749],"pit":[0.6574,0.5565],"bench":[0.6351,0.5302],"terrace":[0.6753,0.5392],"chimS":[0.4048,0.4221],"chimSmid":[0.4048,0.4932],"chimN":[0.7935,0.3449],"main":[0.7778,0.5674],"mainW":[0.5753,0.4383],"primary":[0.4163,0.5391],"primaryRidge":[0.4624,0.3519],"granny":[0.3803,0.3584],"lower":[0.5726,0.7035],"pdeck":[0.5283,0.5673],"drive":[0.3722,0.3603],"porch":[0.5764,0.383],"clere":[0.7415,0.4035],"post":[0.6543,0.4471],"stip":[0.5985,0.3629]},"hz":0.1122,"eye":6048.0}};
/* @end */

  const PAL = {
    mist: ['Mist palette', [['#eeeeec', 'White mist'], ['#9c6139', 'Warm cedar'], ['#2c2e30', 'Charcoal seam'], ['#a9bfd1', 'Sky in the glass']]],
    meadow: ['Meadow palette', [['#7a949d', 'Mist sky'], ['#8c8881', 'Silvered cedar'], ['#e3a458', 'Amber glass'], ['#8f3522', 'Rust meadow']]],
    dusk: ['Meadow palette, at dusk', [['#34495a', 'Dusk sky'], ['#7a766f', 'Silvered cedar'], ['#f4aa52', 'Amber glass'], ['#5e2016', 'Rust meadow']]]
  };
  // the four views: sheet inches (x, y), 14.5 x 6.8 in each; overlay spec in view fractions, anchors from CA_P
  const W = 14.5, H = 6.8;
  const VIEWS = [
    { k: 'arrival', n: 1, t: 'Arrival from the west', pal: 'mist', x: 1.9, y: 3.75,
      dat: [{ at: 'garageTip', lab: 'Garage roof', val: '6016.5', to: 0.035 }],
      notes: [{ text: 'keep the signature tree', at: 'treeMid', t: [0.6, 0.11], a: 'l' },
              { text: 'two garage doors to the drive', at: 'gdoor', t: [0.1, 0.8], a: 'l' }] },
    { k: 'court', n: 2, t: 'Rear court and fire pit', pal: 'meadow', x: 16.9, y: 3.75,
      run: { at: 'tip', base: 'tipGrade', top: 0.04, side: 1, ticks: [{ at: 'tip', lab: 'Tip', val: '6023.0 · 29.4 ft over grade', acc: true }, { at: 'tip30', lab: '30 ft limit', val: '', dy: -0.045 }] },
      notes: [{ text: 'fire pit on the upper terrace', at: 'pit', t: [0.68, 0.975], a: 'l' },
              { text: 'board form chimney', at: 'chimSmid', t: [0.035, 0.1], a: 'l' }] },
    { k: 'tip', n: 3, t: 'Living room tip at dusk', pal: 'dusk', x: 1.9, y: 11.7,
      run: { at: 'tip', baseY: 0.97, top: 0.03, side: 1, ticks: [{ at: 'tip', lab: 'Tip', val: '6023.0 · the court corner', acc: true }, { at: 'tip30', lab: '30 ft limit', val: '', dy: -0.05 }] },
      notes: [{ text: 'raked glass only at the tip', at: 'eglass', t: [0.72, 0.2], a: 'l' }] },
    { k: 'aerial', n: 4, t: 'Aerial from the south', pal: 'mist', x: 16.9, y: 11.7,
      notes: [{ text: 'keep the signature tree', at: 'treeMid', t: [0.035, 0.05], a: 'l' },
              { text: 'bridge, dining in the middle', at: 'bridge', t: [0.86, 0.1], a: 'r' },
              { text: 'fire pit on the upper terrace', at: 'pit', t: [0.985, 0.955], a: 'r' },
              { text: 'approach from the west', at: 'drive', t: [0.05, 0.82], a: 'l' }] }
  ];
  const CSS = `<style>
    .ca-v{--l-b:max(calc(7.5px * var(--fl)),calc(var(--u) * .105));--l-i:max(calc(8.5px * var(--fl)),calc(var(--u) * .125))}
    .ca-v .ca-img{position:absolute;left:0;top:0;width:100%;height:100%;display:block}
    .ca-v .ca-ov{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
    .ca-ov path{fill:none;stroke:var(--ink);stroke-width:.8px;stroke-linecap:round;vector-effect:non-scaling-stroke}
    .ca-ov .hz{stroke-opacity:.2}
    .ca-ov .run{stroke-opacity:.55}
    .ca-ov .tk{stroke-width:1.1px;stroke-opacity:.85}
    .ca-ov .acc{stroke:var(--accent);stroke-width:1.6px;stroke-opacity:1}
    .ca-ov .dm{stroke-opacity:.42}
    .ca-ov circle{fill:var(--accent)}
    .ca-v .lbl.dat.ca-l{transform:translate(calc(var(--u) * .14),-50%)}
    .ca-v .lbl.dat.ca-r{transform:translate(calc(-100% - var(--u) * .14),-50%);flex-direction:row-reverse}
    .ca-v .lbl.dat.ca-acc b{color:var(--accent)}
    .ca-v .lbl.hzl{transform:translate(-100%,-120%);background:none}
    .ca-v .lbl.hzl i{color:var(--muted)}
    .ca-leg{position:absolute;right:0;top:calc(100% + var(--u) * .3);display:flex;gap:calc(var(--u) * .26);align-items:center;white-space:nowrap}
    .ca-leg span{display:flex;align-items:center;gap:calc(var(--u) * .08);font:400 max(calc(7px * var(--fl)),calc(var(--u) * .1))/1 var(--ft);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
    .ca-leg i{display:block;width:max(calc(8px * var(--fl)),calc(var(--u) * .15));height:max(calc(8px * var(--fl)),calc(var(--u) * .15));border-radius:50%;border:1px solid rgba(27,26,24,.35)}
    @media screen and (max-width:760px) and (orientation:portrait), screen and (max-width:760px) and (min-height:541px), screen and (max-width:760px) and (pointer:fine), screen and (max-aspect-ratio:1/1) and (max-width:1100px){
      .fhtml:has(> .ca-v){position:relative;inset:auto}
      .ca-v{max-height:none !important;margin-bottom:96px !important}
      .ca-v .lbl.dat{display:none}
      .ca-leg{left:0;right:auto;top:calc(100% + 46px);flex-wrap:wrap;gap:6px 12px}
    }
  </style>`;

  function view(ctx, v, d0) {
    const P = (CA_P[v.k] || {}).p || {}, hz = (CA_P[v.k] || {}).hz, eye = (CA_P[v.k] || {}).eye;
    const pc = f => +(f * 100).toFixed(3), X = f => +(f * W).toFixed(4), Y = f => +(f * H).toFixed(4);
    let svg = '', lab = '', d = d0;
    // eye level: a faint construction line that runs a little past the image
    if (hz != null && hz > 0.03 && hz < 0.97) {
      svg += `<path class="hz" d="M${X(-0.012)} ${Y(hz)} H${X(1.012)}"/>`;
      lab += `<span class="lbl dat hzl" style="left:${pc(0.995)}%;top:${pc(hz)}%"><b>Eye level</b><i>${eye ? eye.toFixed(1) : ''}</i></span>`;
    }
    // a vertical run off the key peak, with ticks
    if (v.run && P[v.run.at]) {
      const r = v.run, x = P[r.at][0], y0 = r.base && P[r.base] ? Math.min(P[r.base][1], 0.985) : (r.baseY || 0.97);
      svg += `<path class="run" d="M${X(x)} ${Y(y0)} V${Y(r.top)}"/>`;
      [0.25, 0.5, 0.75].forEach(f => { const yy = y0 + (r.top - y0) * f; svg += `<path class="run" d="M${X(x) - 0.06} ${Y(yy)} h0.12"/>`; });
      r.ticks.forEach(tk => {
        if (!P[tk.at]) return;
        const yy = P[tk.at][1] + (tk.dy || 0);
        svg += `<path class="${tk.acc ? 'acc' : 'tk'}" d="M${X(x) - 0.16} ${Y(yy)} h0.32"/>`;
        if (tk.acc) svg += `<circle cx="${X(x)}" cy="${Y(yy)}" r="0.045"/>`;
        lab += `<span class="lbl dat ${r.side > 0 ? 'ca-l' : 'ca-r'}${tk.acc ? ' ca-acc' : ''}" style="left:${pc(x + 0.012 * r.side)}%;top:${pc(yy)}%"><b>${ctx.esc(tk.lab)}</b>${tk.val ? `<i>${ctx.esc(tk.val)}</i>` : ''}</span>`;
      });
    }
    // datums run out to the margin
    (v.dat || []).forEach(dm => {
      if (!P[dm.at]) return;
      const [x, y] = P[dm.at], left = dm.to < x;
      svg += `<path class="dm" d="M${X(x)} ${Y(y)} H${X(dm.to)}"/><path class="tk" d="M${X(dm.to) - 0.07} ${Y(y) + 0.07} l0.14 -0.14"/>`;
      lab += `<span class="lbl dat ${left ? 'ca-l' : 'ca-r'}" style="left:${pc(dm.to)}%;top:${pc(y - 0.035)}%"><b>${ctx.esc(dm.lab)}</b><i>${ctx.esc(dm.val)}</i></span>`;
    });
    // handwritten notes on thin leaders ending in orange dots
    let nh = '';
    (v.notes || []).forEach(n => { if (!P[n.at]) return; nh += ctx.noteHTML({ text: n.text, t: n.t, p: P[n.at], a: n.a }, W, H, d); d += 520; });
    const [pn, chips] = PAL[v.pal];
    const leg = `<div class="ca-leg">${chips.map(([c, t]) => `<span><i style="background:${c}"></i>${ctx.esc(t)}</span>`).join('')}</div>`;
    return `<div class="view ca-v" style="left:${ctx.U(ctx.FX(v.x))};top:${ctx.U(ctx.FY(v.y))};width:${ctx.U(W)};height:${ctx.U(H)};--ar:${(W / H).toFixed(4)}">
      <img class="ca-img" src="sheets/assets/cover-a/${v.k}.webp" alt="${ctx.esc(v.t)}, ${ctx.esc(pn)}" width="2900" height="1360" decoding="async">
      <svg class="ca-ov" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${svg}</svg>${lab}${nh}
      ${ctx.viewTitle(v.n, v.t, pn)}${leg}</div>`;
  }

  LIVING_SHEETS.push({
    id: 'A0.9', group: 'General', title: 'Renderings', short: 'Renderings', foot: 'Renderings', scale: 'None', issued: [4],
    cap: 'Four stills of the Ribbon, rendered from the pocket model and let go into their own linework.',
    data: ['Rendered from the pocket model', 'Mist and Meadow palettes', 'Every roof under the 30 ft line', 'Illustrative, materials to come'],
    html: ctx => CSS + VIEWS.map((v, i) => view(ctx, v, 300 + i * 900)).join('')
  });
})();
