
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const app = $('#app');
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let STYLE = 'annot';
  let MODE = 'loading';

  // ------------------------------------------------------------------ seeded random and the brush
  function rng(s) { s = Math.abs(Math.floor(s)) % 2147483647 || 1; return () => (s = s * 16807 % 2147483647, (s - 1) / 2147483646); }
  function brush(g, pts, o) {
    // pts: [[x, y, width]]; dry brush from bristles with ink running out along the stroke
    const R = rng(o.seed || 7), n = o.bristles || 44, dry = o.dry == null ? 0.55 : o.dry;
    const upto = Math.max(2, Math.floor(pts.length * (o.upto == null ? 1 : o.upto)));
    const N = pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [-dy / L, dx / L]; });
    const wmax = Math.max(...pts.map(p => p[2]));
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = o.color;
    if (o.fill) {
      g.globalAlpha = o.fill; g.beginPath();
      for (let i = 0; i < upto; i++) { const p = pts[i], q = N[i]; g.lineTo(p[0] + q[0] * p[2] * 0.36, p[1] + q[1] * p[2] * 0.36); }
      for (let i = upto - 1; i >= 0; i--) { const p = pts[i], q = N[i]; g.lineTo(p[0] - q[0] * p[2] * 0.36, p[1] - q[1] * p[2] * 0.36); }
      g.closePath(); g.fillStyle = o.color; g.fill();
    }
    for (let k = 0; k < n; k++) {
      const off = (k / (n - 1) - 0.5) * (0.9 + R() * 0.2);
      const ink0 = 0.6 + R() * 0.5, fade = 0.3 + R() * 0.9;
      g.lineWidth = (wmax / n) * (1.4 + R() * 1.6);
      g.globalAlpha = (o.alpha || 0.9) * (0.5 + R() * 0.5);
      let on = false; g.beginPath();
      for (let i = 0; i < upto; i++) {
        const t = i / (pts.length - 1), p = pts[i], q = N[i];
        const ink = ink0 - t * fade * dry + (R() - 0.5) * 0.3 * dry - (Math.abs(off) > 0.4 ? 0.18 : 0);
        if (ink < 0.2) { if (on) { g.stroke(); g.beginPath(); on = false; } continue; }
        const x = p[0] + q[0] * off * p[2], y = p[1] + q[1] * off * p[2];
        if (!on) { g.moveTo(x, y); on = true; } else g.lineTo(x, y);
      }
      if (on) g.stroke();
    }
    g.globalAlpha = 1;
  }
  function ensoPts(cx, cy, r, w, seed) {
    const R = rng(seed), pts = [], a0 = -1.9, a1 = a0 + Math.PI * 1.86, n = 220;
    const ph = R() * 6;
    for (let i = 0; i <= n; i++) {
      const t = i / n, a = a0 + (a1 - a0) * t;
      const rr = r * (1 + 0.035 * Math.sin(a * 2 + ph) + 0.015 * Math.sin(a * 5));
      const ww = w * (0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, t * 1.25 + 0.08))) * (1 - 0.55 * Math.pow(t, 3));
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, ww]);
    }
    return pts;
  }
  function sweepPts(x0, y0, x1, y1, w, bend, n) {
    const pts = []; n = n || 120;
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * bend;
      const ww = w * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.1 + 0.05))) * (t > 0.82 ? 1 - (t - 0.82) * 2.2 : 1);
      pts.push([x, y, Math.max(1, ww)]);
    }
    return pts;
  }
  function drawSeal(c, color, bg) {
    const g = c.getContext('2d'), W = c.width, R = rng(31);
    g.clearRect(0, 0, W, W);
    g.fillStyle = color; g.beginPath();
    const m = W * 0.08, r = W * 0.12;
    g.moveTo(m + r, m); g.arcTo(W - m, m, W - m, W - m, r); g.arcTo(W - m, W - m, m, W - m, r); g.arcTo(m, W - m, m, m, r); g.arcTo(m, m, W - m, m, r); g.fill();
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 260; i++) { g.globalAlpha = 0.3 + R() * 0.7; g.beginPath(); g.arc(R() * W, R() * W, R() * 1.4 + 0.3, 0, 7); g.fill(); }
    g.globalAlpha = 1;
    g.font = '600 ' + Math.round(W * 0.42) + 'px "EB Garamond", Georgia, serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('AM', W / 2, W / 2 + W * 0.03);
    g.globalCompositeOperation = 'source-over';
  }

  // ------------------------------------------------------------------ loader
  // Study B, "Gyroscope" (André 9/28 11:29 pm, "we used to have the gyroscopic motion for the logo and the compass"):
  // two tilted wheels, the compass spinning clockwise and the mark counterclockwise, both swinging upright together.
  const ldBar = $('#ldBar'), ldMsg = $('#ldMsg');
  const MSGS = ['Sharpening the pencils', 'Leveling the grade', 'Setting the beam at 6012', 'Framing the gable ends', 'Squaring the windows', 'Planting the pines', 'Checking 30 ft over grade'];
  const LD_T = 4.6, LD_HOLD = 0.4;               // seconds of motion, then a beat at rest before diving in
  const LD = { built: 0, done: false, err: false, a: 0 };      // a: motion progress 0..1, advanced only by drawn frames
  function step(i) { LD.built = (i + 1) / MSGS.length; if (i >= MSGS.length - 1) LD.done = true; }
  const clampL = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const eOutL = (t, p = 3) => 1 - Math.pow(1 - t, p);
  const eBackL = t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function ldStrokes() {
    const ring = [], burst = [];
    const arc = (A, r, a0, a1, w, al) => { const p = []; for (let i = 0; i <= 120; i++) { const a = a0 + (a1 - a0) * i / 120; p.push([210 + Math.cos(a) * r, 210 + Math.sin(a) * r]); } A.push({ p, w, al }); };
    const line = (A, x0, y0, x1, y1, w, al) => A.push({ p: [[x0, y0], [x1, y1]], w, al });
    // a drafting construction: a compass circle, overshooting cross hairs and tick marks, drawn in pencil
    arc(ring, 150, -2.1, -2.1 + Math.PI * 2.04, 1.3, 0.85); arc(ring, 156, -1.2, -1.2 + Math.PI * 1.1, 0.7, 0.4);
    line(ring, 22, 210, 398, 210, 0.7, 0.45); line(ring, 210, 22, 210, 398, 0.7, 0.45);
    { const NA = (39.3 - 90) * Math.PI / 180, c = Math.cos(NA), s = Math.sin(NA);   // cross lines on the true north axis (André 9/29 9:38 pm)
      line(ring, 210 - c * 190, 210 - s * 190, 210 + c * 190, 210 + s * 190, 0.6, 0.3); line(ring, 210 + s * 170, 210 - c * 170, 210 - s * 170, 210 + c * 170, 0.5, 0.22); }
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2, r0 = k % 6 ? 146 : 140; line(ring, 210 + Math.cos(a) * r0, 210 + Math.sin(a) * r0, 210 + Math.cos(a) * 154, 210 + Math.sin(a) * 154, k % 6 ? 0.6 : 1.1, 0.7); }
    // a fine starburst around the mark, echoing the compass on the site
    for (let k = 0; k < 48; k++) { const a = k / 48 * Math.PI * 2, r1 = k % 6 ? (k % 2 ? 78 : 86) : 98; line(burst, 210 + Math.cos(a) * 70, 210 + Math.sin(a) * 70, 210 + Math.cos(a) * r1, 210 + Math.sin(a) * r1, k % 6 ? 0.45 : 0.8, k % 6 ? 0.28 : 0.5); }
    arc(burst, 64, 0, Math.PI * 2, 0.6, 0.35);
    return { ring, burst };
  }
  function ldDraw(c, strokes, prog) {
    const g = c.getContext('2d'); g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, 420, 420);
    g.lineCap = 'round'; g.strokeStyle = '#1b1a18';
    const n = strokes.length;
    strokes.forEach((s, i) => {
      const f = clampL((prog - 0.5 * i / n) / 0.5);
      if (f <= 0) return;
      g.globalAlpha = s.al; g.lineWidth = s.w * 2; g.beginPath();
      if (s.p.length === 2) { const [a, b] = s.p; g.moveTo(a[0], a[1]); g.lineTo(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); }
      else s.p.slice(0, Math.max(2, Math.ceil(s.p.length * f))).forEach((q, j) => j ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]));
      g.stroke();
    });
    g.globalAlpha = 1;
  }
  function ldArrow(c, e) {
    // north arrow (André 9/28 7:32 pm): true north from the CAD, about 39 degrees east of plan up, so it points to the NE
    const g = c.getContext('2d'); g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, 420, 420);
    if (e <= 0) return;
    const NA = (39.3 - 90) * Math.PI / 180, ca = Math.cos(NA), sa = Math.sin(NA);
    const P = r => [210 + ca * r, 210 + sa * r], Q = (r, off) => [210 + ca * r - sa * off, 210 + sa * r + ca * off];
    g.lineCap = 'round'; g.strokeStyle = '#1b1a18'; g.lineWidth = 2.2; g.globalAlpha = 0.9;
    const [a0, a1] = P(66), [b0, b1] = P(66 + (178 - 66) * e);
    g.beginPath(); g.moveTo(a0, a1); g.lineTo(b0, b1); g.stroke();
    g.lineWidth = 1.1; g.globalAlpha = 0.45;
    const [c0, c1] = P(-66), [d0, d1] = P(-66 - 40 * e);
    g.beginPath(); g.moveTo(c0, c1); g.lineTo(d0, d1); g.stroke();
    g.beginPath(); g.arc(...P(-110 * Math.max(0.6, e)), 4.5, 0, 7); g.stroke();
    g.globalAlpha = 1;
    if (e > 0.85) {
      const k = Math.min(1, (e - 0.85) / 0.15), tip = P(178 + 18 * k), l = Q(160, -9), r = Q(160, 9), m = P(166);
      g.fillStyle = '#c07a2c'; g.beginPath(); g.moveTo(...tip); g.lineTo(...r); g.lineTo(...m); g.closePath(); g.fill();
      g.strokeStyle = '#1b1a18'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(...tip); g.lineTo(...l); g.lineTo(...m); g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(...tip); g.lineTo(...r); g.stroke();
      g.globalAlpha = k; g.fillStyle = '#1b1a18'; g.font = 'italic 500 30px "EB Garamond", Garamond, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      { const nP = Q(204, 0); g.save(); g.translate(nP[0], nP[1]); g.rotate(NA + Math.PI / 2); g.fillText('N', 0, 0); g.restore(); } g.globalAlpha = 1;
    }
  }
  function gyroC(t) {   // study C, Gimbal (André 9/29 9:38 pm)
    const a = 78 * Math.pow(1 - t, 1.3), d = p => Math.pow(1 - t, p);
    return {
      R: `rotateX(${a * Math.cos(5 * Math.PI * t)}deg) rotateY(${a * 0.4 * Math.sin(3 * Math.PI * t)}deg) rotateZ(${-540 * d(2)}deg)`,
      B: `rotateY(${a * Math.sin(4 * Math.PI * t + 1)}deg) rotateX(${a * 0.3 * Math.cos(2 * Math.PI * t)}deg)`,
      A: `rotateX(${a * 0.6 * Math.sin(6 * Math.PI * t)}deg) rotateZ(${-360 * d(2)}deg)`,
      M: `translateZ(${70 * d(1.5)}px) rotateY(${720 * d(2.4)}deg) rotateX(${a * 0.4 * Math.cos(5 * Math.PI * t)}deg)`,
      shadow: 0.8 * (1 - t)
    };
  }
  function gyro(t) {
    const u = eOutL(clampL(t / 0.95), 1.7), w = eBackL(clampL(t / 0.92)), k = 1 - u, kw = 1 - w;   // spin eases out over the whole 6.8 s (André 9/29 8:15 pm)
    return {
      comp: `rotateY(${-46 * kw + 9 * Math.sin(t * 17) * kw}deg) rotateX(${74 * kw + 7 * Math.cos(t * 13) * kw}deg) rotateZ(${-900 * k}deg)`,
      mark: `translateZ(${120 * kw}px) rotateX(${-72 * kw + 10 * Math.sin(t * 11) * kw}deg) rotateY(${58 * kw}deg) rotateZ(${720 * k}deg)`,
      shadow: 0.2 + 0.8 * clampL(kw)
    };
  }
  function loaderArt() {
    document.documentElement.classList.add('ld-live');   // the pencil sketch hands the dial to the drawn gyroscope
    const S2 = ldStrokes(), comp = $('#ldComp'), mk = $('#ldMk'), nmI = $('#ldMk img.nm'), sh = $('#ldShadow'), cR = $('#ldRingC'), cB = $('#ldBurst'), cA = $('#ldArrow');
    const paint = t => {
      const m = gyroC(t);
      comp.style.transform = 'none'; cR.style.transform = m.R; cB.style.transform = m.B; cA.style.transform = m.A; mk.style.transform = m.M;
      mk.style.opacity = clampL((t - 0.03) / 0.25); nmI.style.opacity = clampL((t - 0.86) / 0.12);
      sh.style.opacity = t > 0 && t < 1 ? clampL(m.shadow) : 0; sh.style.transform = `scaleX(${0.7 + 0.3 * clampL(m.shadow)})`;
      ldDraw(cR, S2.ring, clampL(t / 0.55)); ldDraw(cB, S2.burst, clampL((t - 0.15) / 0.5)); ldArrow(cA, clampL((t - 0.45) / 0.45));
      if (!LD.err) {
        // the bar and messages move with the dial, and never run ahead of the model build
        const k = Math.min(t, LD.done ? 1 : Math.max(LD.built, 0.12) * 0.94);
        ldBar.style.width = (100 * k).toFixed(1) + '%';
        ldMsg.textContent = MSGS[Math.min(MSGS.length - 1, Math.floor(k * MSGS.length * 0.999))];
      }
    };
    // the clock moves only while frames are drawn, at most 34 ms a frame: a long stall (the model build on a phone)
    // pauses the spin instead of skipping it, so the whole motion always plays (André 9/29 12:27 pm)
    if (REDUCE) { LD.a = 1; paint(1); return; }
    let last = 0;
    const tick = now => {
      if (last) LD.a = clampL(LD.a + Math.min(now - last, 34) / 1000 / LD_T);
      last = now; paint(LD.a);
      if (LD.a < 1 || (!LD.done && !LD.err)) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  window.__ld = { freeze: t => { LD.a = t; } };

  // ------------------------------------------------------------------ boot
  async function boot() {
    loaderArt();
    const tStart = performance.now();
    step(0);
    await nextFrame(); await sleep(80);
    if (!window.THREE) { LD.err = true; ldMsg.textContent = 'The model needs a connection to load. Refresh to try again.'; return; }
    let DATA; try { DATA = await (window.__md || fetch('model.json').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })); } catch (e) { LD.err = true; ldMsg.textContent = 'The model needs a connection to load. Refresh to try again.'; return; }
    step(1); await nextFrame();
    const W3 = build(DATA, step);
    await W3.ready;
    step(6);
    if (REDUCE) { const wait = 600 - (performance.now() - tStart); if (wait > 0) await sleep(wait); }
    else { while (LD.a < 1) await nextFrame(); await sleep(LD_HOLD * 1000); }      // the full motion, then a beat at rest
    if (!REDUCE) { $('#ld').classList.add('dive'); await sleep(380); }
    { const dial = $('#ldDial'); dial.style.transform = ''; $('#enterGy').prepend(dial); }
    $('#loader').classList.add('gone');
    setTimeout(() => { $('#loader').hidden = true; }, 1000);
    W3.enterReel(true);
  }

  // ------------------------------------------------------------------ the 3D house
  function build(DATA, step) {
    const INK = 0x151412, TIMBER = 0x7b5334, JOIST = 0xffffff, SOFFIT = 0xb98a58, WALL = 0xefece6, ROOF = 0x5f666d;   // André 9/29 10:02 pm: brown framing, white walls, darker metal   // André 9/29 9:25 pm: tans and browns, grays for white
    const LINES = 1;
    const cv = $('#cv'), stage = $('#stage');
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: false, preserveDrawingBuffer: true });
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 200, 900);
    const camera = new THREE.PerspectiveCamera(34, 1, 1, 6000);
    camera.layers.enable(LINES);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d6cf, 0.8));
    const sun = new THREE.DirectionalLight(0xfff4e6, 0.66); sun.position.set(60, 110, 80); scene.add(sun);
    // lamps inside the living room, so the room glows through its glass (André 9/28 7:32 pm)
    [[24, 14, -2, 1.25], [8, 13, -8, 0.8]].forEach(([x, y, z, k]) => { const l = new THREE.PointLight(0xffb45a, k * 1.15, 46, 1.6); l.position.set(x, y, z); scene.add(l); });

    // ---------------- helpers
    const f1 = v => (Math.round(+v * 10 + 1e-6) / 10).toFixed(1);
    const allMats = [];
    function geo(arr, uv) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      if (uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.computeVertexNormals();
      return g;
    }
    function metal(color, o) { const m = new THREE.MeshPhongMaterial(Object.assign({ color, specular: 0x5a6066, shininess: 30, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }, o || {})); allMats.push(m); return m; }
    function lam(color, o) { const m = new THREE.MeshLambertMaterial(Object.assign({ color, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }, o || {})); allMats.push(m); return m; }
    const lineMats = [];
    function lmat(color, opacity) { const m = new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }); lineMats.push(m); return m; }
    const has = a => a && a.length;
    function mesh(arr, mat, uv) { const m = new THREE.Mesh(geo(arr, uv), mat); return m; }
    // André 9/29 10:02 pm: joists are not one homogeneous orange; each runs light golden at its high end to brown at its low end
    const JOIST_RAMP = [[0.97, 0.86, 0.55], [0.91, 0.71, 0.36], [0.82, 0.55, 0.26], [0.69, 0.45, 0.22], [0.55, 0.33, 0.18], [0.42, 0.27, 0.16]];
    function ramp(t) { t = Math.max(0, Math.min(0.999, t)) * (JOIST_RAMP.length - 1); const i = Math.floor(t), f = t - i, a = JOIST_RAMP[i], b = JOIST_RAMP[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }
    const jointMat = new THREE.MeshLambertMaterial({ color: 0xffffff, vertexColors: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }); allMats.push(jointMat);
    function joistMesh(arr) {
      const m = new THREE.Mesh(geo(arr), jointMat), P = m.geometry.attributes.position.array, n = P.length / 3;
      let y0 = 1e9, y1 = -1e9; for (let i = 0; i < n; i++) { y0 = Math.min(y0, P[i * 3 + 1]); y1 = Math.max(y1, P[i * 3 + 1]); }
      const col = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
        const jit = (Math.sin(Math.floor(x * 0.5) * 12.99 + Math.floor(z * 0.5) * 78.23) * 43758.5) % 1;
        const t = 1 - (y - y0) / Math.max(1, y1 - y0) + 0.18 * (Math.abs(jit) - 0.5);
        const c = ramp(t); col.set(c, i * 3);
      }
      m.geometry.setAttribute('color', new THREE.BufferAttribute(col, 3)); return m;
    }
    // each glass pane gets its own value 0..1 (André 9/29 8:21 pm: panes at slightly different opacity read as depth in the reel)
    function paneAttr(m) {
      const P = m.geometry.attributes.position.array, nt = P.length / 9, par = new Int32Array(nt), key = new Map();
      for (let i = 0; i < nt; i++) par[i] = i;
      const f = i => { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; };
      for (let i = 0; i < nt; i++) for (let v = 0; v < 3; v++) {
        const o = i * 9 + v * 3, k = Math.round(P[o] * 20) + ',' + Math.round(P[o + 1] * 20) + ',' + Math.round(P[o + 2] * 20);
        if (key.has(k)) { const a = f(i), b = f(key.get(k)); if (a !== b) par[a] = b; } else key.set(k, i);
      }
      const val = new Float32Array(nt * 3);
      for (let i = 0; i < nt; i++) { const r = f(i); const h = Math.abs(Math.sin(r * 12.9898 + 78.233) * 43758.5453) % 1; val[i * 3] = val[i * 3 + 1] = val[i * 3 + 2] = h; }
      m.geometry.setAttribute('pane', new THREE.BufferAttribute(val, 1));
    }
    function edges(arr, color, opacity, thr) { const l = new THREE.LineSegments(new THREE.EdgesGeometry(geo(arr), thr || 20), lmat(color, opacity)); l.layers.set(LINES); return l; }
    function segs(arr, color, opacity) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); const l = new THREE.LineSegments(g, lmat(color, opacity)); l.layers.set(LINES); return l; }
    function pline(arr, color, opacity) { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); const l = new THREE.Line(g, lmat(color, opacity)); l.layers.set(LINES); return l; }

    // ---------------- materials
    const M = {
      terrain: lam(0xd9e2cd), slab: lam(0xc9c6bf), wall: lam(WALL), roofT: metal(ROOF, { side: THREE.FrontSide }), roofU: lam(SOFFIT, { side: THREE.BackSide }),
      rearT: metal(0x5f666d, { side: THREE.FrontSide }), rearU: lam(0xb98a58, { side: THREE.BackSide }), gabU: lam(0xb98a58, { side: THREE.BackSide }),
      dark: lam(0x2a2927), deck: lam(0xbdbbb6), beam: lam(0x232221), timber: lam(TIMBER), joist: lam(JOIST), rafter: lam(0xffffff),
      furn: lam(0x3b3a38), linen: lam(0xf1eee7), stone: lam(0x4f4b46), groof: metal(0x5f666d, { side: THREE.FrontSide }), slab: lam(0xcac7c0), band: lam(0xcfccc5),
      gwall: lam(0xe4e1dc), fwhite: lam(0xd3d0ca), fwood: lam(0xa9784a), fcedar: lam(0x9f978b), cedar: lam(0x94643c), pwhite: lam(0xd1cdc5),
      paver: lam(0xcac5b9), bform: lam(0xd6d5d1), tdeck: lam(0xc9965a), flag: lam(0xc8c3b4), fire: lam(0xe8883a), carBody: lam(0xcfcac2), carGlass: lam(0x2e3235), wheel: lam(0x1f1e1d)
    };
    const glassClear = new THREE.MeshLambertMaterial({ color: 0x9fb1bb, transparent: true, opacity: 0.36, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
    const glassWarm = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { opacity: { value: 0.93 }, depthK: { value: 0 } },
      vertexShader: 'attribute float pane; varying vec3 wp; varying float vp; void main(){ vp = pane; vec4 w = modelMatrix * vec4(position,1.0); wp = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: [
        'uniform float opacity; uniform float depthK; varying vec3 wp; varying float vp;',
        'float h2(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }',
        'float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x), mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x), f.y); }',
        'void main(){',
        '  float h = clamp((wp.y - 7.0) / 15.0, 0.0, 1.0);',
        '  vec3 lo = vec3(0.56, 0.33, 0.13), mid = vec3(0.97, 0.68, 0.32), hi = vec3(1.0, 0.89, 0.62);',
        '  vec3 c = mix(lo, mid, smoothstep(0.0, 0.18, h)); c = mix(c, hi, smoothstep(0.35, 0.95, h));',
        '  vec2 q = wp.xz / 7.5 + vec2(wp.y * 0.03);',
        '  vec2 f = fract(q) - 0.5; float lamp = exp(-dot(f,f) * 26.0) * step(0.55, h2(floor(q)));',
        '  c += vec3(1.0, 0.84, 0.52) * lamp * 0.35 * smoothstep(0.25, 0.7, h);',
        '  c *= 0.84 + 0.2 * n2(wp.xz * 0.35 + wp.y * 0.08);',
        '  float furn = smoothstep(0.62, 0.72, n2(vec2(wp.x + wp.z, wp.y * 2.0) * 0.45)) * (1.0 - smoothstep(0.04, 0.2, h));',
        '  c = mix(c, vec3(0.32, 0.2, 0.1), furn * 0.5);',
        '  float w1 = n2(wp.xz * 0.22 + wp.y * 0.11), w2 = n2(wp.xz * 0.9 + vec2(wp.y * 0.6, -wp.y * 0.4)), w3 = n2(wp.xz * 3.2 + wp.y * 2.7);',
        '  float gran = n2(wp.xz * 11.0 + wp.y * 9.0);',
        '  vec3 rust = vec3(0.64, 0.36, 0.2), pale = vec3(0.99, 0.93, 0.78);',
        '  c = mix(c, c * rust * 1.45, smoothstep(0.52, 0.86, w2) * 0.55);',
        '  c = mix(c, pale, smoothstep(0.62, 0.9, w1) * 0.45);',
        '  float streak = smoothstep(0.55, 0.95, n2(vec2((wp.x + wp.z) * 1.7, wp.y * 0.18)));',
        '  c = mix(c, c * vec3(0.8, 0.62, 0.48), streak * 0.3);',
        '  c *= 0.9 + 0.16 * gran + 0.1 * (w3 - 0.5);',
        '  float L = dot(c, vec3(0.299, 0.587, 0.114)); c = mix(vec3(L), c, 0.9);',
        '  float voids = smoothstep(0.58, 0.9, w3 * 0.6 + w1 * 0.6);',
        '  float k = mix(1.0, 0.5 + 0.95 * vp, depthK) * (1.0 - 0.45 * voids * depthK);',
        '  c *= mix(1.0, 0.9 + 0.2 * vp, depthK);',
        '  gl_FragColor = vec4(c, clamp(opacity * k, 0.0, 1.0));',
        '}'].join('\n')
    });
    const glassMeshes = [];
    // the living room glass reads clearer so the room shows through (André 9/28 7:32 pm)
    const glassSee = glassWarm.clone(); glassSee.uniforms = { opacity: { value: 0.26 }, depthK: { value: 0 } };
    const glassIn = glassClear.clone(); glassIn.opacity = 0.14;     // eye level views inside: clear glass to look out through
    const quiet = [glassClear, glassWarm, glassSee, glassIn];   // see through surfaces stay out of the line pass

    // ---------------- ground
    const SITE = DATA.site;
    const ground = new THREE.Group();
    ground.add(mesh(SITE.terrain, M.terrain));
    SITE.contours.forEach(c => ground.add(pline(c.p, c.m ? 0x9fae93 : 0xc3cdb8, 1)));
    SITE.setback.forEach(p => ground.add(pline(p, INK, 0.35)));
    SITE.lot.forEach(p => ground.add(pline(p, INK, 0.6)));
    ground.add(mesh(DATA.slab, M.slab));
    ground.add(segs(DATA.construct, INK, 0.22));
    const CC = [SITE.trees[0][0], DATA.hring[1], SITE.trees[0][2]];      // the compass turns on the signature tree (André 9/28 7:32 pm)
    [104, 106.5].forEach((r, i) => { const pts = []; for (let a = 0; a <= 160; a++) { const t = a / 160 * Math.PI * 2; pts.push(CC[0] + Math.cos(t) * r, CC[1], CC[2] + Math.sin(t) * r); } ground.add(pline(pts, INK, i ? 0.14 : 0.3)); });
    // compass rose on the site circle (André 4:57 pm): true north from the north arrow in his CAD (3 ANDRE.dxf)
    {
      const [cx, cy, cz] = CC, NV = DATA.north, R0 = 104, R1 = 106.5, y = cy + 0.05;
      const dir = deg => { const t = deg * Math.PI / 180, px = NV[0], py = -NV[1]; return [px * Math.cos(t) + py * Math.sin(t), -(-px * Math.sin(t) + py * Math.cos(t))]; };
      const P = (deg, r) => { const [dx, dz] = dir(deg); return [cx + dx * r, cz + dz * r]; };
      const tk = [];
      for (let a = 0; a < 360; a += 5) { const L = a % 90 === 0 ? 7 : a % 15 === 0 ? 3.4 : 1.5; const [x0, z0] = P(a, R0 - L), [x1, z1] = P(a, R0); tk.push(x0, y, z0, x1, y, z1); }
      ground.add(segs(tk, INK, 0.55));
      // north arrow (André 9/28 11:29 pm): black and white, one arrow from the star out across the ring, tip about 4 ft past it
      const [ndx, ndz] = dir(0), nrt = [-ndz, ndx], NP = (r, o) => [cx + ndx * r + nrt[0] * o, cz + ndz * r + nrt[1] * o];
      const NTIP = R1 + 20, NBASE = R1 - 8, NW = 3.2, ya = y + 0.1;
      const [tx, tz] = NP(NTIP, 0), [hl0, hl1] = NP(NBASE, -NW), [hr0, hr1] = NP(NBASE, NW), [hc0, hc1] = NP(NBASE + 2.2, 0);
      ground.add(new THREE.Mesh(geo([hl0, ya, hl1, hc0, ya, hc1, tx, ya, tz]), lam(0x2a2927)));
      ground.add(new THREE.Mesh(geo([hc0, ya, hc1, hr0, ya, hr1, tx, ya, tz]), lam(0xf6f5f1)));
      ground.add(segs([hl0, ya + 0.01, hl1, tx, ya + 0.01, tz, tx, ya + 0.01, tz, hr0, ya + 0.01, hr1, hr0, ya + 0.01, hr1, hc0, ya + 0.01, hc1, hc0, ya + 0.01, hc1, hl0, ya + 0.01, hl1, hc0, ya + 0.01, hc1, tx, ya + 0.01, tz], INK, 1));
      // axes right across the site through the tree: north south and east west, the diagonals fainter
      const ax = [], ax2 = [];
      [0, 90].forEach(d => { const [a0, b0] = P(d, R1 + 6), [a1, b1] = P(d + 180, R1 + 6); ax.push(a0, y, b0, a1, y, b1); });
      [45, 135].forEach(d => { const [a0, b0] = P(d, R0 - 1), [a1, b1] = P(d + 180, R0 - 1); ax2.push(a0, y, b0, a1, y, b1); });
      ground.add(segs(ax, INK, 0.42)); ground.add(segs(ax2, INK, 0.16));
      const nl = []; [-0.35, 0.35].forEach(o => { const [ix, iz] = NP(22, o), [ox, oz] = NP(NBASE + 2.2, o); nl.push(ix, y + 0.04, iz, ox, y + 0.04, oz); }); ground.add(segs(nl, INK, 0.85));
      // starburst at the tree: an eight point star, long points to the cardinals, short to the diagonals, each split light and dark
      const ys = y + 0.08, dark = [], light = [], northD = [], outl = [];
      for (let k = 0; k < 8; k++) {
        const d = k * 45, Lp = k % 2 ? 12 : 22, ri = 3.4;
        const [tx2, tz2] = P(d, Lp), [lx, lz] = P(d - 22.5, ri), [rx, rz] = P(d + 22.5, ri);
        (k === 0 ? northD : dark).push(cx, ys, cz, lx, ys, lz, tx2, ys, tz2);
        light.push(cx, ys, cz, tx2, ys, tz2, rx, ys, rz);
        outl.push(lx, ys + 0.01, lz, tx2, ys + 0.01, tz2, tx2, ys + 0.01, tz2, rx, ys + 0.01, rz, cx, ys + 0.01, cz, tx2, ys + 0.01, tz2);
      }
      ground.add(new THREE.Mesh(geo(dark.concat(northD)), lam(0x2a2927))); ground.add(new THREE.Mesh(geo(light), lam(0xf6f5f1)));
      ground.add(segs(outl, INK, 0.85));
      // a fine medallion: two rings and a burst of hairline rays
      const burst = [];
      for (let a = 0; a < 360; a += 3.75) { const L2 = a % 45 === 0 ? 34 : a % 15 === 0 ? 29.5 : 27; const [a0, b0] = P(a, 24.6), [a1, b1] = P(a, L2); burst.push(a0, ys, b0, a1, ys, b1); }
      ground.add(segs(burst, INK, 0.3));
      [23.4, 24.6].forEach((r, i) => { const pts = []; for (let a = 0; a <= 96; a++) { const t = a / 96 * Math.PI * 2; pts.push(cx + Math.cos(t) * r, ys, cz + Math.sin(t) * r); } ground.add(pline(pts, INK, i ? 0.3 : 0.55)); });
      // letters, read from the centre looking out
      const GL = {
        N: [[0, 0, 0, 1], [0, 1, 1, 0], [1, 0, 1, 1]],
        E: [[1, 0, 0, 0], [0, 0, 0, 1], [0, 1, 1, 1], [0, .5, .75, .5]],
        W: [[0, 1, .25, 0], [.25, 0, .5, .62], [.5, .62, .75, 0], [.75, 0, 1, 1]],
        S: (() => { const q = [[1, .85], [.8, 1], [.2, 1], [0, .82], [.06, .6], [.3, .52], [.7, .48], [.95, .38], [1, .18], [.8, 0], [.2, 0], [0, .15]]; const o = []; for (let i = 0; i < q.length - 1; i++) o.push([...q[i], ...q[i + 1]]); return o; })()
      };
      const letter = (ch, deg, r, w, h, col, dbl) => {
        const [dx, dz] = dir(deg), out = [dx, dz], rt = [-dz, dx];            // up = outward, right = clockwise
        const [c0, c1] = P(deg, r), pts = [];
        const map = (u, v, o) => [c0 + (u - .5) * w * rt[0] + (v - .5) * h * out[0] + o * rt[0], c1 + (u - .5) * w * rt[1] + (v - .5) * h * out[1] + o * rt[1]];
        (dbl ? [0, 0.28] : [0]).forEach(o => GL[ch].forEach(([u0, v0, u1, v1]) => { const [a0, b0] = map(u0, v0, o), [a1, b1] = map(u1, v1, o); pts.push(a0, y, b0, a1, y, b1); }));
        ground.add(segs(pts, col, 1));
      };
      letter('N', 0, NTIP + 17, 8.5, 12, INK, true);
      letter('E', 90, R1 + 7, 4, 5.5, INK, false); letter('S', 180, R1 + 7, 4, 5.5, INK, false); letter('W', 270, R1 + 7, 5, 5.5, INK, false);
    }
    ground.add(segs(DATA.people, INK, 0.9));
    DATA.drive.forEach(p => ground.add(pline(p, INK, 0.85)));     // driveway and road edges from André's CAD
    // trees: crisp hand sketched conifers, taller (André 9/28); the big court tree off the front yard is kept and drawn at full size
    const tv = [], tvBig = [], treeDims = [];
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    SITE.trees.forEach(([x, y, z, r, h], ti) => {
      const big = ti === 0;
      h = big ? 74 : h * 1.35; r = big ? 13 : r * 1.12;
      const bw = big ? 1.3 : 0.7;                                   // trunk half width at the base
      const tv_ = big ? tvBig : tv; if (!big) treeDims.push([x, y, z, r, h]);
      tv_.push(x - bw, y, z, x - 0.08, y + h, z, x + bw, y, z, x + 0.08, y + h, z, x, y, z - bw, x, y + h * 0.98, z);
      const tiers = 22;   // every tree as full as the signature tree (André 9/29 10:02 pm)
      for (let i = 0; i < tiers; i++) {
        const t = 0.2 + 0.78 * (i + rnd() * 0.5) / tiers, yy = y + h * t, w = r * Math.pow(1 - t, 0.9) * (0.85 + rnd() * 0.3);
        const nb = 5 + (i % 2);
        for (let k = 0; k < nb; k++) {
          const a = (k + rnd() * 0.6) * Math.PI * 2 / nb + i * 0.9, ca = Math.cos(a), sa = Math.sin(a);
          const mx = x + ca * w * 0.55, mz = z + sa * w * 0.55, my = yy - 0.35 - w * 0.06;
          const ex = x + ca * w, ez = z + sa * w, ey = yy - 0.9 - w * 0.2;
          tv_.push(x, yy, z, mx, my, mz, mx, my, mz, ex, ey, ez);
          tv_.push(mx, my, mz, mx + ca * w * 0.18 - sa * w * 0.14, my - 0.7, mz + sa * w * 0.18 + ca * w * 0.14);   // a twig off each limb
        }
      }
    });
    const treeLines = segs(tv, 0x2c5a37, 0.92);   // green, like the signature tree
    ground.add(treeLines);
    // the signature tree in the front court (André 9/28 7:32 pm): the project wraps around it, so it reads greener than the rest
    const treeBig = segs(tvBig, 0x2c5a37, 0.95);
    ground.add(treeBig);
    {
      const [x, y, z] = SITE.trees[0], h = 74, r = 13;
      const canopyMat = new THREE.MeshLambertMaterial({ color: 0x9dbb8f, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide });
      quiet.push(canopyMat);
      [[0.22, 0.62, 1.0], [0.46, 0.84, 0.72], [0.66, 1.0, 0.44]].forEach(([a, b, k]) => {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(r * k, h * (b - a) * 1.25, 28, 1, true), canopyMat);
        cone.position.set(x, y + h * (a + b) / 2, z); ground.add(cone);
      });
      treeLines.userData.canopy = new THREE.Group();
      treeDims.forEach(([x2, y2, z2, r2, h2]) => [[0.22, 0.62, 1.0], [0.46, 0.84, 0.72], [0.66, 1.0, 0.44]].forEach(([a, b, k]) => {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(r2 * k, h2 * (b - a) * 1.25, 20, 1, true), canopyMat);
        cone.position.set(x2, y2 + h2 * (a + b) / 2, z2); treeLines.userData.canopy.add(cone);
      }));
      ground.add(treeLines.userData.canopy);
    }
    scene.add(ground);

    // ---------------- ribbon: north wing (version D) + the rest of the ribbon house
    const RIB = { skin: new THREE.Group(), body: new THREE.Group(), panels: new THREE.Group() };
    {
      const s = DATA.wing;
      [mesh(s.roof, M.roofT), mesh(s.roof, M.roofU), mesh(s.rear, M.rearT), mesh(s.rear, M.rearU), mesh(s.fascia, M.dark), mesh(s.deck, M.deck)].forEach(m => RIB.skin.add(m));
      RIB.skin.add(edges(s.roof, INK, 1)); RIB.skin.add(edges(s.rear, INK, 1)); RIB.skin.add(edges(s.fascia, INK, 1)); RIB.skin.add(edges(s.deck, INK, 1));
      RIB.skin.add(segs(s.seam, 0xc4c9cc, 0.42));   // standing seam, 18 in
      RIB.body.add(mesh(s.wall, M.wall)); RIB.body.add(edges(s.wall, INK, 0.9, 30));
      const gm = mesh(s.glass, glassClear); gm.userData.warm = glassSee; glassMeshes.push(gm); RIB.body.add(gm); RIB.body.add(segs(s.mull, INK, 0.6));
      RIB.body.add(mesh(s.beam, M.beam)); RIB.body.add(edges(s.beam, INK, 1));
      RIB.body.add(mesh(s.glulam, M.timber)); RIB.body.add(edges(s.glulam, 0x4a3020, 0.6, 30));
      if (has(s.glulamLam)) RIB.body.add(segs(s.glulamLam, 0x5c3c22, 0.42));     // laminations run with the curve
      RIB.body.add(mesh(s.col, M.timber)); RIB.body.add(edges(s.col, 0x4a3020, 0.8, 30));
      RIB.body.add(joistMesh(s.joist)); RIB.body.add(edges(s.joist, 0x5a3a1e, 0.6));
      RIB.body.add(segs(s.cons, INK, 0.16));
      RIB.body.add(joistMesh(s.rafter)); RIB.body.add(edges(s.rafter, 0x5a3a1e, 0.35));   // kitchen joists, always shown
      const I = DATA.interior;
      RIB.body.add(mesh(I.stone, M.stone)); RIB.body.add(edges(I.stone, INK, 0.85));
      RIB.body.add(mesh(I.furn, M.furn)); RIB.body.add(edges(I.furn, INK, 0.9));
    }
    {
      const s = DATA.rib;
      [mesh(s.roof, M.roofT), mesh(s.roof, M.roofU), mesh(s.fascia, M.dark)].forEach(m => RIB.skin.add(m));
      RIB.skin.add(edges(s.roof, INK, 1)); RIB.skin.add(edges(s.fascia, INK, 0.9));
      if (has(s.deck)) { RIB.skin.add(mesh(s.deck, M.deck)); RIB.skin.add(edges(s.deck, INK, 1)); }
      RIB.body.add(mesh(s.wall, M.wall)); RIB.body.add(edges(s.wall, INK, 0.9, 30));
      const gm = mesh(s.glass, glassClear); glassMeshes.push(gm); RIB.body.add(gm); RIB.body.add(edges(s.glass, INK, 0.35, 30));
      if (has(s.timber)) { RIB.body.add(joistMesh(s.timber)); RIB.body.add(edges(s.timber, 0x5a3a1e, 0.6, 30)); }
      if (has(s.glulam)) { RIB.body.add(mesh(s.glulam, M.timber)); RIB.body.add(edges(s.glulam, 0x4a3020, 0.6, 30)); }
      if (has(s.glulamLam)) RIB.body.add(segs(s.glulamLam, 0x5c3c22, 0.42));
      if (has(s.col)) { RIB.body.add(mesh(s.col, M.timber)); RIB.body.add(edges(s.col, 0x4a3020, 0.8, 30)); }
      if (has(s.beam)) { RIB.body.add(mesh(s.beam, M.beam)); RIB.body.add(edges(s.beam, INK, 1)); }
      if (has(s.mull)) RIB.body.add(segs(s.mull, INK, 0.6));
      if (has(s.furn)) { RIB.body.add(mesh(s.furn, M.furn)); RIB.body.add(edges(s.furn, INK, 0.9)); }
      addMaster(RIB.body);
      if (has(s.joist)) { RIB.body.add(joistMesh(s.joist)); RIB.body.add(edges(s.joist, 0x5a3a1e, 0.6)); }
      if (has(s.seam)) RIB.skin.add(segs(s.seam, 0xc4c9cc, 0.42));
      if (has(s.over)) RIB.body.add(segs(s.over, INK, 0.16));   // horizontal overstrikes, subtle
    }
    function addMaster(g) {     // primary suite: king bed looking east to the terrace, lounge chairs at the fireplace
      const F = DATA.furn;
      g.add(mesh(F.master, M.furn)); g.add(edges(F.master, INK, 0.9));
      g.add(mesh(F.linen, M.linen)); g.add(edges(F.linen, INK, 0.6));
      g.add(mesh(F.hearthM, M.stone)); g.add(edges(F.hearthM, INK, 0.85));
    }
    function addChimney(g, c) {
      if (!c) return;
      // board form concrete (André 9/29 3:05 pm): 6 in boards, staggered butt joints, snap ties on a 2 ft grid
      if (has(c.stone)) { g.add(mesh(c.stone, M.bform)); g.add(edges(c.stone, INK, 0.95)); }
      g.add(mesh(c.cap, M.dark)); g.add(edges(c.cap, INK, 1));
      g.add(segs(c.course, 0x8f8d88, 0.3));
    }
    addChimney(RIB.body, DATA.chim.rib);
    addChimney(RIB.body, DATA.chim.ribN);     // north wing chimney: lowered, same floating cap and coursing (André 9/28 7:32 pm)
    // square windows (André 9/28 9:00 pm): a level head on every window but the living room and primary suite, panels filled in above
    const SQ = DATA.sq || {}, SQB = DATA.sqBoard || {};
    if (has(SQ.rib)) { RIB.body.add(mesh(SQ.rib, M.cedar)); RIB.body.add(edges(SQ.rib, INK, 0.85, 30)); }
    function addSq(g, k) { if (!has(SQ[k])) return; g.add(mesh(SQ[k], M.gwall)); g.add(edges(SQ[k], INK, 0.9, 30)); if (has(SQB[k])) g.add(segs(SQB[k], 0x8d8a84, 0.32)); }
    // two garage doors facing the drive (André 9/28 9:00 pm)
    function addDoors(g) { const d = DATA.gdoor; if (!d) return; g.add(mesh(d.face, M.cedar)); g.add(edges(d.face, INK, 0.9, 30)); g.add(mesh(d.frame, M.dark)); g.add(segs(d.line, INK, 0.7)); }
    addDoors(RIB.body);
    Object.values(RIB).forEach(g => scene.add(g));
    if (step) step(2);

    // ---------------- solid panels: a cedar or white bay every so often, the rest clear glass
    RIB.panels.add(mesh(DATA.panels.wood, M.cedar)); RIB.panels.add(mesh(DATA.panels.white, M.pwhite));
    RIB.panels.add(segs(DATA.panels.line, INK, 0.9));
    if (step) step(3);

    // ---------------- eaveless gables at 8, 10 and 12 to 12
    const GAB = {};
    Object.entries(DATA.gab).forEach(([p, s]) => {
      const roof = new THREE.Group(), body = new THREE.Group();
      roof.add(mesh(s.roof, M.groof)); roof.add(mesh(s.roof, M.gabU)); roof.add(mesh(s.knife, M.dark));
      roof.add(edges(s.roof, INK, 1)); roof.add(edges(s.knife, INK, 1));
      roof.add(segs(s.seam, 0xc4c9cc, 0.45));    // standing seam, 18 in
      body.add(mesh(s.wall, M.gwall));
      body.add(segs(s.wline, INK, 0.9));
      body.add(segs(s.board, 0x8d8a84, 0.32));
      const gm = mesh(s.glass, glassClear); glassMeshes.push(gm); body.add(gm); body.add(edges(s.glass, INK, 0.5, 30));
      if (has(s.glassSee)) { const gs = mesh(s.glassSee, glassClear); gs.userData.warm = glassSee; glassMeshes.push(gs); body.add(gs); body.add(edges(s.glassSee, INK, 0.5, 30)); }
      body.add(segs(s.mull, 0x111111, 0.95));
      if (has(s.over)) body.add(segs(s.over, INK, 0.16));
      // deep picture frame at every gable end: silvered cedar band wrapping the rake, white reveal, glass set deep (André 8:16 photo)
      roof.add(mesh(s.froof, M.groof)); roof.add(mesh(s.froof, M.gabU)); roof.add(edges(s.froof, INK, 0.9));
      body.add(mesh(s.fwhite, M.fcedar)); body.add(edges(s.fwhite, INK, 1));
      body.add(mesh(s.fwood, M.fwhite)); body.add(edges(s.fwood, INK, 0.45));
      body.add(mesh(s.fwall, M.gwall)); body.add(edges(s.fwall, INK, 0.9));
      addChimney(body, DATA.chim[p]); addChimney(body, DATA.chim['lr' + p]);
      if (has(s.door)) { body.add(mesh(s.door, M.dark)); body.add(edges(s.door, INK, 1, 30)); }
      if (has(s.col)) { body.add(mesh(s.col, M.timber)); body.add(edges(s.col, 0x4a3020, 0.8, 30)); }
      // furnished like the ribbon (same plan): kitchen, living, bridge dining, primary suite; hearth at the north wall chimney
      [DATA.interior.furn, DATA.rib.furn].forEach(f => { body.add(mesh(f, M.furn)); body.add(edges(f, INK, 0.9)); });
      body.add(mesh(DATA.furn.hearthG, M.stone)); body.add(edges(DATA.furn.hearthG, INK, 0.85));
      addMaster(body);
      addSq(body, 'g' + p); addDoors(body);
      scene.add(roof); scene.add(body);
      GAB[p] = { roof, body };
    });
    const FLAT = { roof: new THREE.Group(), body: new THREE.Group() };   // the flat scheme came out 9/29 3:58 pm
    glassMeshes.forEach(paneAttr);
    // ---------------- primary floor, slab edge band, terrace railings (ribbon and gable)
    const EXTRA = new THREE.Group();
    {
      const x = DATA.extra;
      EXTRA.add(mesh(x.slab, M.slab)); EXTRA.add(edges(x.slab, INK, 0.8, 30));
      EXTRA.add(mesh(x.band, M.band)); EXTRA.add(edges(x.band, INK, 1, 30));
      EXTRA.add(segs(x.rail, 0x151412, 1)); EXTRA.add(segs(x.railPost, 0x151412, 0.95));
      const rg = new THREE.Mesh(geo(x.railGlass), new THREE.MeshLambertMaterial({ color: 0xbfd0d8, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide })); EXTRA.add(rg);
      const X = DATA.xt;                              // rear court terraces and the car on the drive (André 4:57 pm)
      // André 9/29 3:05 pm: upper terrace and primary terrace in cedar decking, lower patio in flagstone, no stairs for now;
      // the fire pit moves up to the upper terrace inside a semicircular built in bench
      EXTRA.add(mesh(X.stone, M.paver)); EXTRA.add(mesh(X.stoneTop, M.flag)); EXTRA.add(edges(X.stone.concat(X.stoneTop), INK, 0.9, 25));
      EXTRA.add(segs(X.joint, INK, 0.3));
      EXTRA.add(mesh(X.deckTop, M.tdeck)); EXTRA.add(edges(X.deckTop, INK, 0.7, 25)); EXTRA.add(segs(X.deckLine, 0x7a5530, 0.42));
      EXTRA.add(mesh(X.pit, M.stone)); EXTRA.add(edges(X.pit, INK, 0.8, 40)); EXTRA.add(mesh(X.pitFire, M.fire));
      EXTRA.add(mesh(X.bench, M.bform)); EXTRA.add(edges(X.bench, INK, 0.85, 30)); EXTRA.add(mesh(X.benchSeat, M.cedar)); EXTRA.add(edges(X.benchSeat, INK, 0.6, 30));
      EXTRA.add(mesh(X.carBody, M.carBody)); EXTRA.add(edges(X.carBody, INK, 1, 25));
      EXTRA.add(mesh(X.carGlass, M.carGlass)); EXTRA.add(edges(X.carGlass, INK, 0.8, 25));
      EXTRA.add(mesh(X.carWheel, M.wheel)); EXTRA.add(edges(X.carWheel, INK, 0.6, 40));
      scene.add(EXTRA);
    }
    if (step) step(4);

    // ---------------- render targets and the brush / sketch composite
    const isWGL2 = renderer.capabilities.isWebGL2;
    function makeRT() {
      const o = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
      if (isWGL2 && THREE.WebGLMultisampleRenderTarget) { const r = new THREE.WebGLMultisampleRenderTarget(4, 4, o); r.samples = 4; return r; }
      return new THREE.WebGLRenderTarget(4, 4, o);
    }
    const rtF = makeRT(), rtL = makeRT();
    const sunCanvas = document.createElement('canvas'); sunCanvas.width = sunCanvas.height = 512;
    {
      const g = sunCanvas.getContext('2d'), R = rng(77);
      g.fillStyle = '#c93a22'; g.beginPath();
      for (let i = 0; i <= 180; i++) { const a = i / 180 * Math.PI * 2, rr = 214 * (1 + (R() - 0.5) * 0.035 + 0.012 * Math.sin(a * 7)); g.lineTo(256 + Math.cos(a) * rr, 256 + Math.sin(a) * rr); }
      g.fill();
      g.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < 900; i++) { const a = R() * Math.PI * 2, rr = 205 + R() * 16; g.globalAlpha = R() * 0.8; g.beginPath(); g.arc(256 + Math.cos(a) * rr, 256 + Math.sin(a) * rr, R() * 2.6, 0, 7); g.fill(); }
      for (let i = 0; i < 1400; i++) { g.globalAlpha = R() * 0.12; g.beginPath(); g.arc(R() * 512, R() * 512, R() * 2, 0, 7); g.fill(); }
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    }
    const sunTex = new THREE.CanvasTexture(sunCanvas);
    const comp = new THREE.ShaderMaterial({
      depthTest: false, depthWrite: false,
      uniforms: {
        tF: { value: rtF.texture }, tL: { value: rtL.texture }, tSun: { value: sunTex },
        res: { value: new THREE.Vector2(1, 1) }, dpr: { value: DPR }, sty: { value: 0 },
        sun: { value: new THREE.Vector4(0.7, 0.6, 0.15, 0) }, focus: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
        paper: { value: new THREE.Color(0xf3efe6) }, ink: { value: new THREE.Color(0x151412) }
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: [
        'uniform sampler2D tF, tL, tSun; uniform vec2 res; uniform float dpr, sty; uniform vec4 sun; uniform vec3 focus, paper, ink; varying vec2 vUv;',
        'float h2(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }',
        'float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x), mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x), f.y); }',
        'float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*n2(p); p*=2.03; a*=0.5; } return v; }',
        'float lum(vec3 c){ return dot(c, vec3(0.299,0.587,0.114)); }',
        'void main(){',
        '  vec2 px = vUv * res; vec2 tx = 1.0 / res;',
        '  vec4 F = texture2D(tF, vUv);',
        '  float grain = fbm(px / (2.5 * dpr));',
        '  if (sty < 0.5) {',
        '    vec3 P = paper * (0.955 + 0.06 * grain);',
        '    P -= vec3(0.03, 0.028, 0.024) * smoothstep(0.66, 0.9, n2(vec2(px.x / (26.0 * dpr), px.y / (1.6 * dpr))));',
        '    vec3 bg = P;',
        '    if (sun.w > 0.001) { vec2 d = (vUv - sun.xy) * vec2(res.x / res.y, 1.0) / sun.z; if (max(abs(d.x), abs(d.y)) < 1.0) { vec4 S = texture2D(tSun, d * 0.5 + 0.5); bg = mix(bg, S.rgb * (0.94 + 0.08 * grain), S.a * sun.w); } }',
        '    float L = lum(F.rgb);',
        '    vec2 o = 2.5 * dpr * tx;',
        '    float Lb = 0.25 * (lum(texture2D(tF, vUv + vec2(o.x, o.y)).rgb) + lum(texture2D(tF, vUv - vec2(o.x, o.y)).rgb) + lum(texture2D(tF, vUv + vec2(o.x, -o.y)).rgb) + lum(texture2D(tF, vUv + vec2(-o.x, o.y)).rgb));',
        '    float w = clamp((0.96 - mix(L, Lb, 0.6)) * 1.5, 0.0, 1.0);',
        '    w = w * w * (3.0 - 2.0 * w) * (0.8 + 0.4 * fbm(px / (1.6 * dpr) + 7.0));',
        '    vec3 face = P * (1.0 - 0.8 * w);',
        '    float mx = max(F.r, max(F.g, F.b)), mn = min(F.r, min(F.g, F.b)); float sat = (mx - mn) / (mx + 0.001);',
        '    vec3 wc = mix(P, F.rgb * (0.9 + 0.2 * grain), 0.82) * (1.0 - 0.3 * w);',
        '    face = mix(face, wc, smoothstep(0.2, 0.55, sat));',
        '    vec3 col = mix(bg, face, clamp(F.a, 0.0, 1.0));',
        '    vec3 l0 = texture2D(tL, vUv).rgb; float d0 = 1.0 - lum(l0);',
        '    float wid = mix(0.7, 2.6, n2(px / (70.0 * dpr) + 3.7)) * dpr;',
        '    float inkv = d0; vec3 lc = l0;',
        '    for (int i = 0; i < 8; i++) { float a = float(i) * 0.7853982 + 0.3; vec2 off = vec2(cos(a), sin(a)) * wid * tx; vec3 l = texture2D(tL, vUv + off).rgb; float d = 1.0 - lum(l); float k = smoothstep(0.35, 0.8, d) * d; if (k > inkv) { inkv = k; lc = l; } }',
        '    float dry = n2(vec2(px.x / (1.3 * dpr), px.y / (5.0 * dpr)) + grain);',
        '    inkv *= mix(1.0, 0.45 + 0.75 * dry, 0.55);',
        '    float lsat = (max(lc.r, max(lc.g, lc.b)) - min(lc.r, min(lc.g, lc.b)));',
        '    vec3 inkc = mix(ink, lc * 0.85, smoothstep(0.15, 0.4, lsat));',
        '    col = mix(col, inkc, clamp(inkv * 1.05, 0.0, 0.96));',
        '    gl_FragColor = vec4(col, 1.0);',
        '  } else {',
        '    vec3 P = paper * (0.985 + 0.03 * grain);',
        '    vec3 bg = mix(P, vec3(0.905, 0.912, 0.918), smoothstep(0.35, 1.0, vUv.y) * 0.55);',
        '    vec2 d = (vUv - focus.xy) * vec2(res.x / res.y, 1.0);',
        '    float dist = length(d) / focus.z + (fbm(px / (55.0 * dpr)) - 0.5) * 0.5 + (n2(vec2(px.x / (3.0 * dpr), px.y / (40.0 * dpr))) - 0.5) * 0.12;',
        '    float m = 1.0 - smoothstep(0.78, 1.12, dist);',
        '    vec3 face = mix(F.rgb, F.rgb * (0.98 + 0.04 * grain), 0.5);',
        '    vec3 ghost = mix(bg, bg * (0.86 + 0.14 * lum(F.rgb)), 0.6);',
        '    vec3 col = mix(bg, mix(ghost, face, m), clamp(F.a, 0.0, 1.0));',
        '    vec3 l0 = texture2D(tL, vUv).rgb; vec2 o = 0.55 * dpr * tx;',
        '    vec3 lm = min(min(l0, texture2D(tL, vUv + vec2(o.x, 0.0)).rgb), min(texture2D(tL, vUv + vec2(0.0, o.y)).rgb, texture2D(tL, vUv - o).rgb));',
        '    float dl = 1.0 - lum(lm);',
        '    col = mix(col, col * mix(vec3(1.0), lm, 0.92), clamp(0.72 + 0.28 * (1.0 - m), 0.0, 1.0) * step(0.01, dl));',
        '    gl_FragColor = vec4(col, 1.0);',
        '  }',
        '}'].join('\n')
    });
    const compScene = new THREE.Scene(), compCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    compScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), comp));

    // ---------------- state
    const HC = DATA.hcenter, A = DATA.A, I = DATA.info;
    const WG = [2, 18, 0];
    const CEN = [-19.15, 15, 31.2];   // middle of the house; every model view orbits here
    const VIEWS = {
      house: { yaw: 1.15, el: 0.38, dist: 168, t: CEN },
      arrival: { yaw: -0.95, el: 0.22, dist: 195, t: CEN },
      tip: { yaw: 1.2, el: 0.2, dist: 190, t: CEN },
      court: { yaw: 0.8, el: 0.5, dist: 205, t: CEN },
      rear: { yaw: 2.85, el: 0.42, dist: 210, t: CEN },
      plan: { yaw: 0.0, el: 1.5, dist: 220, t: [CEN[0], 0, CEN[2]] },
      // eye level (André 9/28 9:00 pm): standing in the rooms and on the terraces, drag to look around
      living: { eye: [33.5, 13.2, -3.5], at: [0.0, 14.8, -3.5], room: true },   // from the east end, due west (André 9/29 9:25 pm)
      dining: { eye: [13.4, 13.1, 37.5], at: [-14.6, 16.5, 22.5], room: true },
      terrace: { eye: [19.5, 12.75, 35.0], at: [31.0, 16.0, 6.0] },
      patio: { eye: [42.5, 7.85, 51.0], at: [22.0, 12.5, 29.0] },
      entry: { eye: [-45.0, 14.2, 33.0], at: [4.0, 15.5, 22.0] }
    };
    function eyeCam(v) { const dx = v.eye[0] - v.at[0], dy = v.eye[1] - v.at[1], dz = v.eye[2] - v.at[2], dist = Math.hypot(dx, dy, dz); return { yaw: Math.atan2(dx, dz), el: Math.asin(dy / dist), dist, t: v.at, fp: 1 }; }
    const cam = { yaw: 1.15, el: 0.42, dist: 215, t: new THREE.Vector3(...VIEWS.house.t), fp: 0 };
    const S = { scheme: 'rib', pitch: '12', inside: false, roof: false, panels: true, lens: 'wide', trees: true, notes: true, room: false };   // wide angle lens by default (André 9/28 9:57 am)
    const IN_SHEET = document.documentElement.classList.contains('in-sheet');
    if (IN_SHEET) S.lens = 'ultra';   // inside the living set the model opens on the widest lens; the quick toggle reads pressed (André 9/30)
    const REEL_SHEET_K = 1.4;          // inside a sheet the reel stands this much further back
    let reelScheme = { scheme: 'rib', pitch: '12', see: true, room: false };

    function apply() {
      const reel = MODE !== 'model';
      const st = reel ? Object.assign({}, S, reelScheme, { inside: !!reelScheme.see, roof: false, panels: true }) : S;
      const rib = st.scheme === 'rib';
      RIB.skin.visible = rib && !st.roof; RIB.body.visible = rib; RIB.panels.visible = rib;   // panels always shown (André 9/28 9:00 pm)
      EXTRA.visible = true;
      treeLines.visible = reel || st.trees; if (treeLines.userData.canopy) treeLines.userData.canopy.visible = treeLines.visible;
      const gab = st.scheme === 'gab', fl = st.scheme === 'flat';
      Object.entries(GAB).forEach(([p, G]) => { const on = p === 'a' ? st.scheme === 'asym' : (gab && p === st.pitch); G.roof.visible = on && !st.roof; G.body.visible = on; });
      FLAT.roof.visible = fl && !st.roof; FLAT.body.visible = fl;
      // see inside: the model toggle goes nearly to glass; the reel keeps the forms and lets the interiors show through
      const see = reel
        ? [[M.wall, 0.34], [M.gwall, 0.34], [M.roofT, 0.58], [M.roofU, 0.6], [M.gabU, 0.6], [M.rearT, 0.58], [M.rearU, 0.6], [M.dark, 0.7], [M.deck, 0.55], [M.fwhite, 0.6], [M.fwood, 0.6], [M.fcedar, 0.34], [M.cedar, 0.75], [M.pwhite, 0.75]]
        : [[M.wall, 0.13], [M.gwall, 0.13], [M.roofT, 0.1], [M.roofU, 0.16], [M.gabU, 0.16], [M.rearT, 0.1], [M.rearU, 0.16], [M.dark, 0.35], [M.deck, 0.35], [M.fwhite, 0.3], [M.fwood, 0.3], [M.fcedar, 0.13], [M.cedar, 0.45], [M.pwhite, 0.45]];
      see.forEach(([m, op]) => { m.transparent = st.inside; m.opacity = st.inside ? op : 1; m.depthWrite = !st.inside; m.needsUpdate = true; });
      glassWarm.uniforms.opacity.value = st.inside ? 0.62 : 0.93;
      glassSee.uniforms.opacity.value = st.inside ? 0.2 : 0.26;
      const room = reel ? !!reelScheme.room : S.room;
      glassMeshes.forEach(g => { g.material = room ? glassIn : (STYLE === 'sumi' ? glassClear : (g.userData.warm || glassWarm)); });
      glassWarm.uniforms.depthK.value = glassSee.uniforms.depthK.value = reel ? 1 : 0;
      if (window.__syncQuick) window.__syncQuick();
      dirty = true;
    }
    function applyStyle() {
      const sumi = STYLE === 'sumi';
      comp.uniforms.sty.value = sumi ? 0 : 1;
      comp.uniforms.paper.value.set(sumi ? 0xf3efe6 : 0xf6f5f1);
      comp.uniforms.ink.value.set(sumi ? 0x151412 : 0x1b1a18);
      glassMeshes.forEach(g => { g.material = sumi ? glassClear : (g.userData.warm || glassWarm); });
      M.wall.color.set(sumi ? 0xe7e5e0 : 0xefece6);
      M.gwall.color.set(sumi ? 0xe2dfd9 : 0xb9b3a8);   // silvered cedar in the annotated look
      M.roofT.color.set(sumi ? 0xf7f7f5 : 0x5f666d);   // dark standing seam metal (André 9/29 9:58 pm)
      M.roofU.color.set(sumi ? 0xd8a877 : 0xb98a58);
      M.gabU.color.set(sumi ? 0xe0c29c : 0xb98a58);
      M.terrain.color.set(sumi ? 0xf4f3f0 : 0xd9e2cd);   // soft green ground
      treeLines.material.opacity = 0.92;
      dirty = true;
    }

    // ---------------- layout: where the model can sit between the chrome
    let vis = { l: 0, t: 0, r: 1, b: 1 }, CW = 1, CH = 1;
    function measure() {
      CW = app.clientWidth; CH = app.clientHeight;
      const wide = CW >= 900;
      let t = 60, b = CH, l = 0, r = CW, nt = null;
      const INS = document.documentElement.classList.contains('in-sheet');
      if (MODE === 'reel' && INS) {
        // inside a living set sheet: the sheet's own header and footer sit over the frame, so frame the model between them
        const q = new URLSearchParams(location.search);
        t = CH * (+q.get('t') || 0.16); b = CH * (+q.get('b') || 0.86); nt = t;
      } else if (MODE === 'reel') {
        // full bleed (André 9/28 9:00 pm): the model fills the screen; it centers a little above the words and runs under them
        const tb = $('.top').getBoundingClientRect(), rb = $('#rb').getBoundingClientRect();
        t = tb.bottom + 4; b = wide ? rb.top + 70 : rb.top + rb.height * 0.34;
        const sp = $('.spec').getBoundingClientRect();
        nt = Math.max($('#rtitle').getBoundingClientRect().bottom, sp.height ? sp.bottom : 0) + 6;   // hand notes stay clear of the title
      } else if (MODE === 'model') {
        const wui = app.classList.contains('wideui');
        const dk = (wui ? $('.rail') : $('.dock')).getBoundingClientRect(), mb = $('.mbar').getBoundingClientRect();
        const qk = wui ? dk : $('#quick').getBoundingClientRect();
        t = mb.bottom + 8;
        b = Math.min(dk.top, qk.top) - 6;
      }
      vis = { l, t, r, b, nt: nt == null ? t : nt };
    }
    function resize() {
      measure();
      renderer.setSize(CW, CH, false);
      const w = Math.round(CW * DPR), h = Math.round(CH * DPR);
      rtF.setSize(w, h); rtL.setSize(w, h);
      comp.uniforms.res.value.set(w, h);
      drawDeco();
      dirty = true;
    }
    function placeCamera() {
      const LENS = { normal: [44, 38], wide: [62, 52], ultra: [88, 78] }, EYE = { wide: [92, 64], ultra: [108, 88] };
      const ph = CW < 520 ? 0 : 1, fp = Math.max(0, Math.min(1, cam.fp || 0));
      const lens = MODE === 'reel' ? 'wide' : S.lens;
      const reelSheet = MODE === 'reel' && IN_SHEET;
      const fovO = MODE === 'reel' ? (CW < 520 ? 62 : reelSheet ? 64 : 54) : LENS[lens][ph];
      const fovE = EYE[lens === 'ultra' ? 'ultra' : 'wide'][ph];
      camera.fov = fovO + (fovE - fovO) * fp; camera.aspect = CW / CH;
      const vw = Math.max(80, vis.r - vis.l), vh = Math.max(80, vis.b - vis.t);
      // wide angle in the model: stand about where the normal lens stands, a little closer, so the frame takes in more of the site
      const wideM = MODE === 'model' && lens !== 'normal', fovFit = wideM ? LENS.normal[ph] : fovO;
      const wf = CW < 520 ? (MODE === 'model' ? 0.94 : 0.96) : (MODE === 'reel' ? 1.2 : 1.36);
      let k = Math.max(CH / vh, wf * CH / vw) * Math.tan(17 * Math.PI / 180) / Math.tan(fovFit / 2 * Math.PI / 180);
      if (CW >= 900 && MODE === 'reel') k *= 1.05;
      if (reelSheet) k *= REEL_SHEET_K;                   // inside a sheet: stand well back, the whole house and some site
      if (wideM) k *= lens === 'ultra' ? 0.56 : 0.84;
      k = Math.max(0.5, Math.min(3.2, k));
      k = k + (1 - k) * fp;                                   // eye level views stand exactly where they say
      const d = cam.dist * k, ce = Math.cos(cam.el);
      camera.position.set(cam.t.x + d * ce * Math.sin(cam.yaw), cam.t.y + d * Math.sin(cam.el), cam.t.z + d * ce * Math.cos(cam.yaw));
      camera.near = fp > 0.5 ? 0.25 : 1;
      camera.up.set(0, 1, 0); camera.lookAt(cam.t);
      const ox = (CW / 2 - (vis.l + vis.r) / 2) * (1 - fp), oy = (CH / 2 - (vis.t + vis.b) / 2) * (MODE === 'reel' ? 1 : 1 - fp);   // the reel keeps the horizon above the words
      camera.setViewOffset(CW, CH, ox, oy, CW, CH);
      camera.updateProjectionMatrix();
      scene.fog.near = d * 0.85 * (1 - fp) + 150 * fp; scene.fog.far = d * 3.4 * (1 - fp) + 900 * fp;
      const NV = DATA.north, rx = NV[0] * Math.cos(cam.yaw) - NV[1] * Math.sin(cam.yaw), fz = -(NV[0] * Math.sin(cam.yaw) + NV[1] * Math.cos(cam.yaw));
      $('#needle').setAttribute('transform', 'rotate(' + (Math.atan2(rx, fz) * 180 / Math.PI).toFixed(1) + ')');
      comp.uniforms.sun.value.w = 0;   // vermilion sun removed at André's request (9/28/26)
      const full = MODE === 'reel' || fp > 0.5;                // full bleed: no fade to paper at the edges
      comp.uniforms.focus.value.set(((vis.l + vis.r) / 2) / CW, 1 - ((vis.t + vis.b) / 2) / CH, full ? 1.25 * Math.max(vh, vw) / CH : 0.62 * Math.min(vh, vw * 1.2) / CH);
    }
    function render() {
      placeCamera();
      renderer.setClearColor(0xffffff, 0);
      camera.layers.set(0);
      renderer.setRenderTarget(rtF); renderer.clear(); renderer.render(scene, camera);
      camera.layers.enable(LINES);
      allMats.forEach(m => { m.colorWrite = false; }); quiet.forEach(m => { m.colorWrite = false; });
      renderer.setClearColor(0xffffff, 1);
      renderer.setRenderTarget(rtL); renderer.clear(); renderer.render(scene, camera);
      allMats.forEach(m => { m.colorWrite = true; }); quiet.forEach(m => { m.colorWrite = true; });
      renderer.setRenderTarget(null); renderer.render(compScene, compCam);
      updateNotes();
    }

    // ---------------- annotations: hand notes, dimension strings and vertical runs that ride with the model
    const ov = $('#ov'), notesEl = $('#notes');
    const SVGNS = 'http://www.w3.org/2000/svg';
    let ANN = [];
    const V3 = a => new THREE.Vector3(a[0], a[1], a[2]);
    function toScreen(v) { const p = v.clone().project(camera); return { x: (p.x + 1) / 2 * CW, y: (1 - p.y) / 2 * CH, ok: p.z < 1 && p.z > -1 }; }
    function ftin(v) { let f = Math.floor(v + 1e-6), i = Math.round((v - f) * 12); if (i === 12) { f += 1; i = 0; } return f + "' " + i + '"'; }
    function clearAnn() { ANN.forEach(a => { a.els.forEach(e => e.remove()); }); ANN = []; }
    function mkSvg(tag, at) { const e = document.createElementNS(SVGNS, tag); Object.entries(at).forEach(([k, v]) => e.setAttribute(k, v)); ov.appendChild(e); return e; }
    function setAnn(list) {
      clearAnn();
      const sumi = STYLE === 'sumi';
      const col = 'var(--ink)', acc = 'var(--accent)';
      const lean = app.clientWidth < 700;     // phones: only the key notes, the model gets the screen (reel too, 9/28 9:00 pm)
      list.forEach((a, i) => {
        if (a.only && a.only !== STYLE) return;
        if (lean && !(a.key || (MODE === 'model' && a.k === 'run'))) return;
        const delay = (MODE === 'reel' ? 900 : 150) + i * (MODE === 'reel' ? 420 : 60);
        if (a.k === 'note') {
          const d = document.createElement('div'); d.className = 'note'; d.textContent = a.text; notesEl.appendChild(d);
          const path = mkSvg('path', { fill: 'none', stroke: col, 'stroke-width': sumi ? 1.5 : 1.1, 'stroke-linecap': 'round', opacity: 0 });
          const dot = mkSvg('circle', { r: sumi ? 3.6 : 3.2, fill: acc, opacity: 0 });
          ANN.push({ a, els: [d, path, dot], d, path, dot, v: V3(a.p), t0: performance.now() + delay });
        } else if (a.k === 'dim') {
          const g = mkSvg('g', { stroke: col, 'stroke-width': 1, fill: 'none', opacity: 0 });
          const e1 = document.createElementNS(SVGNS, 'path'); g.appendChild(e1);
          const d = document.createElement('div'); d.className = 'dimt'; d.textContent = a.text; notesEl.appendChild(d);
          ANN.push({ a, els: [g, d], g, e1, d, va: V3(a.a), vb: V3(a.b), off: V3(a.off), t0: performance.now() + delay });
        } else if (a.k === 'run') {
          const g = mkSvg('g', { stroke: col, 'stroke-width': 1, fill: 'none', opacity: 0 });
          const e1 = document.createElementNS(SVGNS, 'path'); g.appendChild(e1);
          const e2 = document.createElementNS(SVGNS, 'path'); e2.setAttribute('stroke', acc); e2.setAttribute('stroke-width', '1.8'); g.appendChild(e2);
          const labs = a.ticks.map(tk => { const d = document.createElement('div'); d.className = 'runl' + (tk.acc ? ' acc' : ''); d.innerHTML = ''; d.appendChild(document.createTextNode(tk.label)); if (tk.sub) { const sm = document.createElement('small'); sm.textContent = tk.sub; d.appendChild(sm); } notesEl.appendChild(d); return d; });
          ANN.push({ a, els: [g, ...labs], g, e1, e2, labs, v: V3(a.p), tv: a.ticks.map(tk => V3(tk.p)), t0: performance.now() + delay });
        }
      });
      dirty = true;
      setTimeout(() => { dirty = true; }, 1800);
      [900, 1400, 2100, 2800, 3500].forEach(ms => setTimeout(() => { dirty = true; }, ms));
    }
    function inVis(x, y, m) { return x > vis.l - m && x < vis.r + m && y > vis.t - m && y < vis.b + m; }
    function hit(r, placed) { return placed.some(q => r.x < q.x + q.w + 6 && r.x + r.w + 6 > q.x && r.y < q.y + q.h + 4 && r.y + r.h + 4 > q.y); }
    function updateNotes() {
      const now = performance.now(), show = (MODE === 'reel' || S.notes) && !(MODE === 'model' && window.__notesHold);
      const placed = [];
      const sc = CW < 520 ? 0.62 : 1;
      ov.setAttribute('viewBox', '0 0 ' + CW + ' ' + CH);
      const rank = n => n.a.k === 'run' ? 0 : n.a.k === 'dim' ? 1 : 2;
      const eyeLv = (cam.fp || 0) > 0.5;
      [...ANN].sort((x, y) => rank(x) - rank(y)).forEach(n => {
        const a = n.a;
        const far = eyeLv && (a.k !== 'note' || n.v.distanceTo(camera.position) > 95);
        const on = show && now >= n.t0 && !far;
        if (far) {
          if (a.k === 'note') { n.d.classList.remove('on'); n.path.setAttribute('opacity', 0); n.dot.setAttribute('opacity', 0); }
          else if (a.k === 'dim') { n.g.setAttribute('opacity', 0); n.d.classList.remove('on'); }
          else { n.g.setAttribute('opacity', 0); n.labs.forEach(l => l.classList.remove('on')); }
          return;
        }
        if (a.k === 'note') {
          const p = toScreen(n.v);
          const ok = on && p.ok && inVis(p.x, p.y, 10);
          n.d.classList.toggle('on', ok); n.path.setAttribute('opacity', ok ? 0.85 : 0); n.dot.setAttribute('opacity', ok ? 1 : 0);
          if (!ok) return;
          const bw = n.d.offsetWidth, bh = n.d.offsetHeight;
          let left = a.dx < 0, bx = 0, ty = 0, found = false;
          for (const side of [left, !left]) {
            for (const k of [0, -1, 1, -2, 2, -3, 3]) {
              const tx = p.x + (side ? -Math.abs(a.dx) : Math.abs(a.dx)) * sc;
              let x = side ? tx - bw : tx, y = p.y + a.dy * sc - bh / 2 + k * (bh + 8);
              x = Math.max(vis.l + 8, Math.min(CW - bw - 10, x));
              y = Math.max(vis.nt + 4, Math.min(vis.b - bh - 4, y));
              if (!hit({ x, y, w: bw, h: bh }, placed)) { bx = x; ty = y; left = side; found = true; break; }
            }
            if (found) break;
          }
          if (!found) { n.d.classList.remove('on'); n.path.setAttribute('opacity', 0); n.dot.setAttribute('opacity', 0); return; }
          placed.push({ x: bx, y: ty, w: bw, h: bh });
          n.d.style.transform = 'translate(' + bx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
          n.d.style.left = '0px'; n.d.style.top = '0px';
          const sx = left ? bx + bw + 6 : bx - 6, sy = ty + bh * 0.55;
          const mx = (sx + p.x) / 2, my = (sy + p.y) / 2, dx = p.x - sx, dy = p.y - sy;
          const cx = mx - dy * 0.22 * (left ? -1 : 1), cy = my + dx * 0.22 * (left ? -1 : 1);
          n.path.setAttribute('d', 'M' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + p.x.toFixed(1) + ' ' + p.y.toFixed(1));
          n.dot.setAttribute('cx', p.x.toFixed(1)); n.dot.setAttribute('cy', p.y.toFixed(1));
        } else if (a.k === 'dim') {
          const pa = toScreen(n.va), pb = toScreen(n.vb);
          const qa = toScreen(n.va.clone().add(n.off)), qb = toScreen(n.vb.clone().add(n.off));
          const ok = on && pa.ok && pb.ok && qa.ok && qb.ok && inVis(qa.x, qa.y, 30) && inVis(qb.x, qb.y, 30) && Math.hypot(qb.x - qa.x, qb.y - qa.y) > 40;
          n.g.setAttribute('opacity', ok ? 0.8 : 0); n.d.classList.toggle('on', ok);
          if (!ok) return;
          const ux = qb.x - qa.x, uy = qb.y - qa.y, L = Math.hypot(ux, uy), ex = ux / L, ey = uy / L;
          const ov_ = 7;
          const ext = (p, q) => { const vx = q.x - p.x, vy = q.y - p.y, Lq = Math.hypot(vx, vy) || 1; return 'M' + (p.x + vx / Lq * 3).toFixed(1) + ' ' + (p.y + vy / Lq * 3).toFixed(1) + ' L' + (q.x + vx / Lq * 6).toFixed(1) + ' ' + (q.y + vy / Lq * 6).toFixed(1); };
          const tick = q => 'M' + (q.x - 4).toFixed(1) + ' ' + (q.y + 4).toFixed(1) + ' L' + (q.x + 4).toFixed(1) + ' ' + (q.y - 4).toFixed(1);
          n.e1.setAttribute('d', ext(pa, qa) + ' ' + ext(pb, qb) + ' M' + (qa.x - ex * ov_).toFixed(1) + ' ' + (qa.y - ey * ov_).toFixed(1) + ' L' + (qb.x + ex * ov_).toFixed(1) + ' ' + (qb.y + ey * ov_).toFixed(1) + ' ' + tick(qa) + ' ' + tick(qb));
          let ang = Math.atan2(uy, ux) * 180 / Math.PI; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
          const nx = -ey, ny = ex, s = ny > 0 ? -1 : 1;
          const tw = n.d.offsetWidth, th = n.d.offsetHeight;
          const cx = (qa.x + qb.x) / 2 + nx * s * 11, cy = (qa.y + qb.y) / 2 + ny * s * 11;
          n.d.style.left = '0px'; n.d.style.top = '0px';
          n.d.style.transform = 'translate(' + (cx - tw / 2).toFixed(1) + 'px,' + (cy - th / 2).toFixed(1) + 'px) rotate(' + ang.toFixed(1) + 'deg)';
          placed.push({ x: cx - tw / 2, y: cy - th / 2, w: tw, h: th });
        } else if (a.k === 'run') {
          const p = toScreen(n.v);
          const ok = on && p.ok && inVis(p.x, p.y, 20);
          n.g.setAttribute('opacity', ok ? 0.75 : 0); n.labs.forEach(l => l.classList.toggle('on', ok));
          if (!ok) return;
          const top = vis.t + (vis.b - vis.t) * a.top;
          let d = 'M' + p.x.toFixed(1) + ' ' + (p.y - 6).toFixed(1) + ' L' + p.x.toFixed(1) + ' ' + top.toFixed(1);
          let d2 = '', lastY = null;
          const qs = n.tv.map(v => toScreen(v));
          n.tv.forEach((v, i) => {
            const q = qs[i], tk = a.ticks[i];
            let y = q.y;
            const seg = 'M' + (p.x - 12).toFixed(1) + ' ' + y.toFixed(1) + ' L' + (p.x + 12).toFixed(1) + ' ' + y.toFixed(1);
            if (tk.acc) d2 += seg; else d += ' ' + seg;
            const l = n.labs[i];
            let right = a.side !== 'l';
            if (right && p.x + 18 + l.offsetWidth > CW - 8) right = false;
            if (!right && p.x - 18 - l.offsetWidth < 8) right = true;
            let ly = y - (tk.sub ? 16 : 7);
            if (lastY !== null && Math.abs(ly - lastY) < 18) ly = lastY - 18;
            lastY = ly;
            l.style.left = '0px'; l.style.top = '0px';
            l.style.transform = 'translate(' + (right ? p.x + 18 : p.x - 18 - l.offsetWidth).toFixed(1) + 'px,' + ly.toFixed(1) + 'px)';
            placed.push({ x: right ? p.x + 18 : p.x - 18 - l.offsetWidth, y: ly, w: l.offsetWidth, h: l.offsetHeight });
          });
          n.e1.setAttribute('d', d); n.e2.setAttribute('d', d2);
        }
      });
    }

    // ---------------- decoration: brush strokes behind the reel title (sumi e)
    const deco = $('#deco');
    function drawDeco() {
      deco.width = Math.round(CW * DPR); deco.height = Math.round(CH * DPR);
      const g = deco.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, CW, CH);
      if (MODE !== 'reel') return;
      const TV = app.dataset.title || 'a';
      if (STYLE !== 'sumi' && TV !== 'd') return;
      const h = $('#rtH').getBoundingClientRect();
      if (h.width < 10) return;
      const y = h.top + h.height * 0.52, w = h.height * 1.02;
      const lg = $('.brand-mark').getBoundingClientRect(), xr = Math.min(h.right + 40, lg.width ? lg.left - 10 : 1e4);
      if (STYLE !== 'sumi') { const yb = h.bottom - h.height * 0.14; brush(g, sweepPts(h.left + 4, yb, Math.min(h.right + 30, xr), yb - 5, Math.max(5, h.height * 0.11), 2, 120), { color: '#151412', seed: 21, dry: 0.6, alpha: 0.9, fill: 0.7, bristles: 34 }); return; }
      brush(g, sweepPts(h.left - 30, y + 4, xr, y - 6, w, -8, 160), { color: '#151412', seed: 21, dry: 0.5, alpha: 0.95, fill: 0.9, bristles: 70 });
      const s = $('#shotTitle').getBoundingClientRect();
      if (STYLE === 'sumi' && s.width > 10) brush(g, sweepPts(s.left - 8, s.bottom - 3, s.left + Math.min(s.width, 230) * 0.9, s.bottom - 7, 9, 3, 90), { color: '#c63a22', seed: 9, dry: 0.7, alpha: 0.9, fill: 0.5, bristles: 26 });
    }

    // ---------------- the reel
    const TIPN = ftin(I.rib.tipOver), WLEN = ftin(I.wing.len), WDEP = ftin(I.wing.depth);
    const SHOTS = [
      {
        scheme: 'rib', dur: 11, title: 'The Ribbon',
        line: 'One level beam, straight joists, and a roof that lifts like a sheet of paper toward the court.',
        data: ['Tip 6023.0 · ' + f1(I.rib.tipOver) + ' ft over grade', 'Beam 6012.0 · dead level', 'Joists flat to ' + f1(I.rib.tipPitch) + ':12', 'Glulam stops at the corner'],
        from: { yaw: 1.62, el: 0.14, dist: 128, t: [12, 18, 8] }, to: { yaw: 0.72, el: 0.22, dist: 112, t: [12, 18, 8] },
        ann: [
          { k: 'note', key: true, p: A.tip, text: 'the tip lifts\nto the court', dx: -150, dy: -70 },
          { k: 'note', p: A.beam, text: 'beam dead level\nat 6012', dx: -50, dy: -120 },
          { k: 'note', key: true, p: A.endS || A.tip, text: 'glulam stops\nat the corner', dx: 80, dy: -60 },
          { k: 'note', p: A.joist, text: 'straight joists\nsquare to the beam\nsimple and efficient', dx: 90, dy: -110, only: 'annot' },
          { k: 'run', p: A.tipGrade, top: 0.06, ticks: [{ p: A.tip, label: 'Max height 6023.0', sub: I.rib.tipOver.toFixed(1) + ' ft over grade', acc: true }, { p: A.tip30, label: '30 ft limit' }] }
        ]
      },
      {
        scheme: 'gab', pitch: '12', dur: 10, title: 'The Modern Gable',
        line: 'Steep, clean gables with no eaves. The gable ends open up in glass, set deep in a thick cedar frame.',
        data: ['12:12 on every wing', 'Public wing ridge ' + f1(I.gab['12'].ridges.PW), 'Max ' + ftin(I.gab['12'].over) + ' over grade', 'No eaves · square windows'],
        from: { yaw: -1.25, el: 0.15, dist: 138, t: [-13, 15, 28] }, to: { yaw: 1.5, el: 0.2, dist: 112, t: [HC[0] + 14, HC[1] - 1, HC[2] - 10] },
        ann: [
          { k: 'note', key: true, p: A.frame, text: 'thick cedar frame,\nwhite reveal', dx: 80, dy: -90 },
          { k: 'note', key: true, p: A.ridge, text: '12:12, no eaves,\npale zinc roof', dx: -150, dy: -90 },
          { k: 'note', p: A.eglass, text: 'glass gable end\nopen to the view', dx: 90, dy: 70 },
          { k: 'note', p: A.clad, text: 'silvered cedar\nvertical boards\nquiet and durable', dx: -110, dy: 60, only: 'annot' },
          { k: 'run', p: A.ridge, top: 0.05, side: 'l', ticks: [{ p: [29.0, 34.26, -3.31], label: 'Max height 6024.3', sub: 'public wing ridge', acc: true }] }
        ]
      },
      {
        scheme: 'asym', dur: 10, title: 'The Asymmetric Gable',
        line: 'Ridges a third in from the courts: steep 12:12 down to the courts, a long 6:12 out to the lot edges.',
        data: ['12:12 courts · 6:12 lot edges', 'Public wing ridge ' + f1(I.gab.a.ridges.PW), 'Max ' + ftin(I.gab.a.over) + ' over grade', 'Bridge 5:12, under both ridges'],
        from: { yaw: 0.25, el: 0.16, dist: 140, t: [-4, 15, 24] }, to: { yaw: 2.05, el: 0.22, dist: 116, t: [HC[0] + 10, HC[1] - 1, HC[2] - 6] },
        ann: [
          { k: 'note', key: true, p: A.asymCourt, text: '12:12 down\nto the court', dx: 80, dy: 70 },
          { k: 'note', key: true, p: A.asymLot, text: '6:12 out to\nthe lot edge', dx: -100, dy: -70 },
          { k: 'note', p: A.frame, text: 'thick cedar frame,\nwhite reveal', dx: 80, dy: -80 },
          { k: 'run', p: A.asymGrade, top: 0.05, ticks: [{ p: A.asymRidge, label: 'Ridge ' + I.gab.a.ridges.PW.toFixed(1), sub: ftin(I.gab.a.ridgeOver) + ' over grade', acc: true }] }
        ]
      },
      {
        scheme: 'rib', dur: 10, title: 'The Site',
        line: 'Lot 235 on Lahontan Drive, inside the setbacks and under the 30 ft line.',
        data: ['Very High FHSZ · Chapter 7A', 'FA grade, not survey', ftin(I.overall.w) + ' by ' + ftin(I.overall.d) + ' overall', 'Under the 30 ft line'],
        from: { yaw: -0.45, el: 1.1, dist: 215, t: [HC[0], 4, HC[2]] }, to: { yaw: 0.5, el: 0.9, dist: 196, t: [HC[0], 4, HC[2]] },
        ann: [
          { k: 'note', key: true, p: A.tree, text: 'the signature tree,\nthe house wraps around it', dx: -120, dy: -80 },
          { k: 'note', key: true, p: A.drive, text: 'driveway from\nLahontan Drive', dx: -60, dy: 90 },
          { k: 'note', p: A.setback, text: 'setback line', dx: 50, dy: -70 },
          { k: 'note', p: A.swHigh || A.tip, text: 'high point over grade,\n' + f1(I.sw.highOver) + ' ft', dx: 70, dy: -80 },
          { k: 'dim', a: A.extW, b: A.extE, off: [0, 0, 6], text: ftin(I.overall.w) + ' overall', only: 'annot' },
          { k: 'dim', a: A.extN, b: A.extS, off: [-6, 0, 0], text: ftin(I.overall.d), only: 'annot' }
        ]
      }
    ];
    SHOTS.forEach(s => { if (s.from.eye) { s.from = eyeCam(s.from); s.to = eyeCam(s.to); } });
    // inside a living set sheet the reel reads as a wide view: each shot aims nearer the middle of the house (André 9/30)
    if (IN_SHEET) SHOTS.forEach(s => [s.from, s.to].forEach(c => { if (c.fp) return; const w = c.el > 0.7 ? 0.3 : 0.7; c.t = [c.t[0] + (CEN[0] - c.t[0]) * w, c.t[1] + (CEN[1] - 4 - c.t[1]) * w, c.t[2] + (CEN[2] - c.t[2]) * w]; }));
    const MODEL_ANN = {
      rib: () => [
        { k: 'note', key: true, p: A.beam, text: 'beam dead level, 6012', dx: -60, dy: -90 },
        { k: 'note', p: A.panel, text: 'cedar panel', dx: 60, dy: 70 },
        { k: 'note', key: true, p: A.sbeam, text: 'south beam dead level,\nSE corner to NW corner', dx: -60, dy: 90, only: 'annot' },
        { k: 'note', p: A.floor, text: 'primary floor 6004', dx: 80, dy: 60 },
        { k: 'note', p: A.rail, text: 'terrace railing', dx: 70, dy: -50 },
        { k: 'note', p: DATA.xt.anchors.terrace, text: 'upper terrace, cedar deck', dx: 90, dy: 60 },
        { k: 'note', p: DATA.xt.anchors.pit, text: 'fire pit, curved bench\nfacing east', dx: 90, dy: 50 },
        { k: 'note', p: A.patio, text: 'covered patio\nunder the terrace', dx: 90, dy: 70 },
        { k: 'note', key: true, p: A.granny, text: 'granny suite: its own sheet,\nlifting gently to the street, ' + f1(I.granny.tip), dx: -90, dy: -70 },
        { k: 'note', p: A.grannyS || A.granny, text: 'granny suite windows\nto the south', dx: -80, dy: 70 },
        { k: 'note', key: true, p: A.endS || A.tip, text: 'glulam stops\nat the corner', dx: 80, dy: -40 },
        { k: 'note', p: A.endW || A.beamW, text: 'glulam cantilevers\n5 ft over the porch', dx: -90, dy: -60 },
        { k: 'note', p: A.gdoor || A.garageTip, text: 'two garage doors', dx: -70, dy: 60 },
        { k: 'note', p: [A.chim[0], I.chim.rib.top - 5991, A.chim[2]], text: 'board form chimney', dx: -80, dy: -60 },
        { k: 'note', p: A.swHigh || A.stip, text: 'south wing high corner ' + f1(I.sw.high), dx: 70, dy: -60 },
        { k: 'note', p: [34.0, 25.0, 47.9], text: 'one curved glulam east,\none on the court,\nstraight joists between', dx: 80, dy: 40 },
        { k: 'note', key: true, p: A.clere, text: 'clerestory: 2 ft of glass\nbetween two beams', dx: -90, dy: -80 },
        { k: 'note', key: true, p: A.sclere || A.sbeam, text: 'south wing clerestory,\n2 ft of glass between two beams', dx: 90, dy: 80 },
        { k: 'note', p: A.garageTip, text: 'garage lifts to ' + f1(I.rib.garage) + '\nat the west, a curved rim', dx: -80, dy: -70 },
        { k: 'dim', a: A.wingSW, b: A.wingSE, off: [0, 0, 8], text: WLEN, only: 'annot' },
        { k: 'dim', a: A.wingSE, b: A.wingNE, off: [8, 0, 0], text: WDEP, only: 'annot' },
        { k: 'run', p: A.tipGrade, top: 0.03, ticks: [{ p: A.tip, label: 'Max height 6023.0', sub: ftin(I.rib.tipOver) + ' over grade · 30 ft limit', acc: true }] }
      ],
      gab: () => {
        const g = I.gab[S.pitch], ry = g.ridges.PW - 5990;
        return [
          { k: 'note', key: true, p: A.frame, text: 'thick cedar frame,\nwhite reveal', dx: 70, dy: -70 },
          { k: 'note', p: [A.chim[0], I.chim[S.pitch].top - 5991, A.chim[2]], text: 'board form chimney', dx: -80, dy: -60 },
          { k: 'note', p: [A.chimLR[0], I.chim['lr' + S.pitch].top - 5991, A.chimLR[2]], text: 'living room chimney', dx: -90, dy: -50, key: true },
          { k: 'note', p: A.clad, text: 'vertical boards', dx: -90, dy: 60, only: 'annot' },
          { k: 'note', p: [A.bridgeRidge[0], g.ridges.BR - 5990, A.bridgeRidge[2]], text: 'bridge ' + g.ridges.BR.toFixed(1), dx: -80, dy: -60 },
          { k: 'note', p: [A.primaryRidge[0], g.ridges.PR - 5990, A.primaryRidge[2]], text: 'primary ' + g.ridges.PR.toFixed(1) + (g.overAt === 'primary' ? ',\n' + ftin(g.over) + ' over grade,\ntightest to the limit' : ''), dx: 70, dy: -60 },
          { k: 'note', p: A.eglass, text: 'glass gable end', dx: 80, dy: 60 },
          { k: 'note', p: DATA.xt.anchors.terrace, text: 'upper terrace, cedar deck', dx: 90, dy: 70 },
          { k: 'note', p: DATA.xt.anchors.pit, text: 'fire pit, curved bench\nfacing east', dx: 90, dy: 50 },
          { k: 'note', key: true, p: [-21.0, 17.0, 1.0], text: 'entry at the west end\nof the north wing', dx: -100, dy: -50 },
          { k: 'note', p: A.gdoor || [-51, 16, 15.5], text: 'two garage doors', dx: -70, dy: 60 },
          { k: 'note', p: [-21.0, 17.0, 66.0], text: 'glass gable end,\nglowing to the drive', dx: -90, dy: 60 },
          { k: 'run', p: A.frameGrade, top: 0.03, ticks: [{ p: [A.frameGrade[0], ry, A.frameGrade[2]], label: 'Max height ' + g.ridges.PW.toFixed(1), sub: ftin(g.frameOver) + ' over grade · 30 ft limit', acc: true }] },
          { k: 'dim', a: A.wingSW, b: A.wingSE, off: [0, 0, 9], text: WLEN, only: 'annot' }
        ];
      }
    };

    MODEL_ANN.asym = () => {
      const g = I.gab.a;
      return [
        { k: 'note', key: true, p: A.asymCourt, text: '12:12 down to the court', dx: 80, dy: 70 },
        { k: 'note', key: true, p: A.asymLot, text: '6:12 out to the lot edge', dx: -90, dy: -70 },
        { k: 'note', p: A.asymBridge, text: 'bridge 5:12, under\nboth ridges', dx: -80, dy: -60 },
        { k: 'note', key: true, p: A.frame, text: 'thick cedar frame,\nwhite reveal', dx: 70, dy: -70 },
        { k: 'note', p: [A.chimLR[0], I.chim.lra.top - 5991, A.chimLR[2]], text: 'living room chimney', dx: -90, dy: -50 },
        { k: 'note', p: [A.chim[0], I.chim.a.top - 5991, A.chim[2]], text: 'board form chimney', dx: -80, dy: -60 },
        { k: 'note', p: DATA.xt.anchors.terrace, text: 'upper terrace, cedar deck', dx: 90, dy: 70 },
        { k: 'note', p: DATA.xt.anchors.pit, text: 'fire pit, curved bench\nfacing east', dx: 90, dy: 50 },
        { k: 'note', p: A.gdoor || [-51, 16, 15.5], text: 'two garage doors', dx: -70, dy: 60 },
        { k: 'run', p: A.asymGrade, top: 0.03, ticks: [{ p: A.asymRidge, label: 'Ridge ' + g.ridges.PW.toFixed(1), sub: ftin(g.ridgeOver) + ' over grade · 30 ft limit', acc: true }] },
        { k: 'dim', a: A.wingSW, b: A.wingSE, off: [0, 0, 9], text: WLEN, only: 'annot' }
      ];
    };
    let shot = 0, shotT0 = 0, switching = false;
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    function setCam(f, to, e) {
      cam.yaw = f.yaw + (to.yaw - f.yaw) * e; cam.el = f.el + (to.el - f.el) * e; cam.dist = f.dist + (to.dist - f.dist) * e;
      cam.fp = (f.fp || 0) + ((to.fp || 0) - (f.fp || 0)) * e;
      cam.t.set(f.t[0] + (to.t[0] - f.t[0]) * e, f.t[1] + (to.t[1] - f.t[1]) * e, f.t[2] + (to.t[2] - f.t[2]) * e);
    }
    function startShot(i) {
      shot = i; shotT0 = performance.now();
      const s = SHOTS[i];
      reelScheme = { scheme: s.scheme, pitch: s.pitch || '10', see: s.scheme === 'rib' && !s.room, room: !!s.room };
      apply();
      const tk = $('#ticks');
      if (tk.querySelectorAll('i').length !== SHOTS.length) { const no = $('#shotNo'); tk.innerHTML = ''; SHOTS.forEach(() => { const e = document.createElement('i'); e.appendChild(document.createElement('b')); tk.appendChild(e); }); tk.appendChild(no); }
      $('#shotNo').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(SHOTS.length).padStart(2, '0');
      $('#shotTitle').textContent = s.title;
      $('#shotLine').textContent = s.line;
      const ul = $('#shotData'); ul.innerHTML = '';
      s.data.forEach((t, k) => { const li = document.createElement('li'); li.textContent = t; li.style.animationDelay = (0.5 + k * 0.35) + 's'; ul.appendChild(li); });
      $$('#ticks i').forEach((el, k) => { el.className = k < i ? 'done' : ''; if (k === i) { void el.offsetWidth; el.style.setProperty('--dur', s.dur + 's'); el.className = 'run'; } });
      setCam(s.from, s.to, 0);
      measure(); drawDeco();
      setAnn(s.ann);
    }
    function nextShot() {
      if (switching) return;
      switching = true;
      const fade = $('#fade'); fade.style.opacity = 1;
      setTimeout(() => { if (MODE === 'reel') startShot((shot + 1) % SHOTS.length); fade.style.opacity = 0; switching = false; }, 470);
    }
    function reelTick(now) {
      const s = SHOTS[shot], t = window.__reelT != null ? window.__reelT : (now - shotT0) / 1000 / s.dur;
      // always moving (André 9/28 9:00 pm): a steady drift with soft ends, so every clip reads as motion
      const u = Math.min(1, t), e = 0.35 * u + 0.65 * (0.5 - 0.5 * Math.cos(Math.PI * u));
      setCam(s.from, s.to, e);
      if (window.__reelT != null) return;
      if (t >= 1 - 0.47 / s.dur) nextShot();
    }

    // ---------------- the model
    let anim = 0;
    function goTo(name, T) {
      const v = VIEWS[name]; if (!v) return;
      const to = v.eye ? eyeCam(v) : Object.assign({ fp: 0 }, v);
      const from = { yaw: cam.yaw, el: cam.el, dist: cam.dist, fp: cam.fp || 0 }, t0v = cam.t.clone(), t1v = V3(to.t);
      let dy = to.yaw - from.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      // gentle moves (André 9/30: the view changes were too fast): 1.8 to 2.4 s by distance, ease in and out on a sine
      const tv = Math.hypot(t1v.x - t0v.x, t1v.y - t0v.y, t1v.z - t0v.z);
      const reach = Math.min(1, Math.abs(dy) / Math.PI * 0.8 + Math.abs(to.el - from.el) * 0.6 + Math.abs(Math.log(to.dist / Math.max(1, from.dist))) * 0.9 + tv / 90 + Math.abs(to.fp - from.fp) * 0.5);
      const t0 = performance.now(), D = REDUCE ? 400 : Math.max(T || 0, 1800 + 600 * reach);
      cancelAnimationFrame(anim);
      $$('[data-view]').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === name));
      S.room = !!v.room; window.__notesHold = true; apply();
      const stepA = now => {
        const t = Math.min(1, (now - t0) / D), e = 0.5 - 0.5 * Math.cos(Math.PI * t);
        cam.yaw = from.yaw + dy * e; cam.el = from.el + (to.el - from.el) * e; cam.dist = from.dist + (to.dist - from.dist) * e;
        cam.fp = from.fp + (to.fp - from.fp) * e;
        cam.t.lerpVectors(t0v, t1v, e); dirty = true;
        if (t < 1) anim = requestAnimationFrame(stepA);
      };
      anim = requestAnimationFrame(stepA);
    }
    // eye level: drag looks around from where you stand, pinch or scroll walks forward and back
    function camDir() { const ce = Math.cos(cam.el); return new THREE.Vector3(ce * Math.sin(cam.yaw), Math.sin(cam.el), ce * Math.cos(cam.yaw)); }
    function eyePos() { return cam.t.clone().add(camDir().multiplyScalar(cam.dist)); }
    function setEye(E) { cam.t.copy(E.clone().sub(camDir().multiplyScalar(cam.dist))); }
    function walk(s) { const E = eyePos(), d = camDir(); d.y = 0; if (d.lengthSq() < 1e-6) return; d.normalize(); E.addScaledVector(d, -s); setEye(E); dirty = true; }
    function sheetFor() {
      if (S.scheme === 'rib') {
        const r = I.rib;
        return {
          lede: 'One gesture on every roof: a dark level beam, straight joists square to it, and one lifted corner. Both lifted corners sit just under the 30 ft line.',
          nums: [['North tip', f1(r.tip) + ' · ' + f1(r.tipOver) + ' ft'], ['Tip pitch', f1(r.tipPitch) + ':12'], ['South corner', f1(I.sw.high) + ' · ' + f1(I.sw.highOver) + ' ft'], ['Bridge', Math.round(r.bWidth) + ' ft wide']],
          legend: [
            ['01', 'North wing beam', 'dead level at ' + f1(r.beam) + ', exposed, SW corner to NE corner; a second beam 2 ft below it (top ' + f1(r.lowerBeam) + ') with a clerestory of clear glass between the two'],
            ['02', 'Joists', '2 ft oc, square to the beam, flat to ' + f1(r.tipPitch) + ':12, resting on the curved glulams with 3 ft tails'],
            ['03', 'Glulams', 'one at each glass line, sagging about ' + f1(r.bowS) + ' ft south and ' + f1(r.bowE) + ' ft east; the long court glulam stops at the tip corner and the short east glulam dies into its side; the court glulam also cantilevers 5 ft past the porch corner'],
            ['04', 'Wood posts', r.colN + ' on the glass line with the corner post, ' + r.colOc + ' ft oc'],
            ['05', 'South wing', 'second dead level beam at ' + f1(I.sw.beamTop) + ', ' + f1(I.sw.len) + ' ft, from the SE corner to the NW corner; straight joists square to it lift to ' + f1(I.sw.tip) + ' at the NE post (' + f1(I.sw.maxPitch) + ':12) and run on to a full corner at ' + f1(I.sw.high) + '; one curved glulam on the court edge and one on the east edge, about ' + f1(I.sw.sag.east) + ' ft of sag each; lookouts carry the east eave; flat to the south'],
            ['06', 'Bridge', Math.round(r.bWidth) + ' ft wide, beam ' + f1(r.bBeam) + ', tip ' + f1(r.bridge) + ', dining'],
            ['07', 'Garage and mud', 'level beam 6011.5, tip ' + f1(r.garage) + ' at the arrival'],
            ['08', 'Two stories', 'south wing steps down 5 ft to 5992.5; primary floor at 6004.0 from the bridge west wall to the terrace; granny suite stays at 5997.5'],
            ['09', 'Chimney', 'board form concrete on the south wall, 36 sf tapering, top ' + f1(I.chim.rib.top)],
            ['10', 'Glass', 'clear, with a solid cedar or white panel every few bays; the south wing south wall opens up in the r2 window bands'],
            ['11', 'Square windows', 'every window has a level head with cedar filled in above it; only the living room and the primary suite keep glass up into the rake'],
            ['12', 'Granny suite', 'its own sheet: level beam ' + f1(I.granny.beam) + ' on the lot side, lifting gently to ' + f1(I.granny.tip) + ' at the street corner; windows to the south, cedar panels on the street wall'],
            ['13', 'Porch and garage', 'no beam across the porch: the porch roof spans wall to wall; two 9 ft garage doors face the drive'],
            ['14', 'Kitchen roof', 'bears on the lower beam at ' + f1(r.kitchenRoof) + ', 1/4 in per ft to the north and west eaves (' + f1(r.kitchenEave) + '); the porch roof continues it']
          ],
          dr: ['Only about 9% of the roof reaches 4:12, so the whole roof rides one pitch Design Variance (Lahontan VII.13).', 'The south wing corner sits about ' + f1(30 - I.sw.highOver) + ' ft under the 30 ft limit on FA grade, the north tip about ' + f1(30 - r.tipOver) + ' ft. The survey confirms both.', 'Chimney top ' + f1(I.chim.rib.top) + ', ' + f1(I.chim.rib.over) + ' ft over grade. Chimney masses may run 4 ft past the height line (VII.5) and must be 18 to 60 sf in plan (VII.20).'],
          build: ['Curved glulams, a CNC cut seat for every joist and a twisted roof deck. This is the premium option.', 'Square windows everywhere but the living room and primary suite keep most of the glass in standard rectangles; the raked glass is limited to those two rooms.', 'Flat ends shed toward the beams, so drains run in heated space and snow guards sit over the porch and entry.']
        };
      }
      if (S.scheme === 'asym') {
        const g = I.gab.a;
        return {
          lede: 'Asymmetric gables on the same plan: every ridge sits a third in from its court, steep 12:12 down to the courts and a long 6:12 out to the lot edges, with equal eaves. The bridge drops to 5:12 and tucks under both ridges. Same deep cedar frames at the gable ends, no eaves.',
          nums: [['Court side', '12:12'], ['Lot side', '6:12'], ['Public ridge', f1(g.ridges.PW)], ['Max over grade', ftin(g.over)]],
          legend: [
            ['01', 'Pitch', '12:12 to the courts, 6:12 to the lot edges, each ridge a third in from the court side; equal eaves'],
            ['02', 'Public wing', 'ridge ' + f1(g.ridges.PW) + ', eaves ' + f1(g.eaves.PW)],
            ['03', 'Bridge', '5:12, ridge ' + f1(g.ridges.BR) + ', tucked under the public wing and primary ridges on clean valleys'],
            ['04', 'Primary', 'ridge ' + f1(g.ridges.PR)],
            ['05', 'Granny suite', 'ridge ' + f1(g.ridges.GR) + ', 2 ft narrower each side, nested inside the primary gable'],
            ['06', 'Garage and gear bay', 'ridges ' + f1(g.ridges.GA) + ' and ' + f1(g.ridges.GB) + ', steep sides to the entry court'],
            ['07', 'Gable ends', 'a thick silvered cedar frame at every gable end, white reveal inside, glass set deep'],
            ['08', 'Walls and roof', 'silvered cedar in vertical boards, standing seam metal at 18 in, knife edge rakes and eaves'],
            ['09', 'Chimneys', 'board form concrete: living room on the north wall, top ' + f1(I.chim.lra.top) + '; south wing on the south wall, top ' + f1(I.chim.a.top)]
          ],
          dr: ['Lahontan asks for asymmetry and organic composition (VII.11) and a 4:12 predominant pitch (VII.13). Both slopes clear 4:12, so no pitch variance.', 'Every ridge sits lower than the 12:12 gables; the tallest point is about ' + ftin(g.over) + ' over grade.', 'Chimneys ' + f1(I.chim.lra.over) + ' and ' + f1(I.chim.a.over) + ' ft over grade, inside the 4 ft chimney allowance (VII.5).'],
          build: ['Straight rafters and repeatable framing like the modern gable. The ridge moves off center, so each wing carries a ridge beam or a bearing line under it.', 'The steep court slopes shed fast toward the courts: snow guards over the terraces, entries and walks. The long 6:12 lot slopes hold their snow.']
        };
      }
      const g = I.gab[S.pitch];
      return {
        lede: 'Every wing gets one steep, clean gable at ' + S.pitch + ':12 with no eaves. The gable ends open up in glass, each set deep in a thick silvered cedar frame with a white reveal. All straight lines, the budget friendly option.',
        nums: [['Pitch', S.pitch + ':12'], ['Public ridge', f1(g.ridges.PW)], ['Max over grade', ftin(g.over)], ['Eaves', 'none']],
        legend: [
          ['01', 'Pitch', S.pitch + ':12 on every wing'],
          ['02', 'Public wing', 'ridge ' + f1(g.ridges.PW)],
          ['03', 'Bridge', '16 ft wide, east wall pulled in to match the ribbon; its roof runs into the wing roofs on clean valleys, no gable ends at the junctions'],
          ['04', 'Primary', 'ridge ' + f1(g.ridges.PR)],
          ['05', 'Gable ends', 'a thick silvered cedar frame wraps every gable end, white reveal inside, glass set deep; living wing east end glazed full height with black mullions; south wing ends squared to the ridge'],
          ['06', 'Edges', 'knife edge rakes and eaves in dark metal, walls carried up to the roof'],
          ['07', 'Walls and roof', 'silvered cedar in vertical boards, standing seam metal at 18 in'],
          ['08', 'Chimneys', 'board form concrete: living room on the north wall, top ' + f1(I.chim['lr' + S.pitch].top) + '; south wing on the south wall, top ' + f1(I.chim[S.pitch].top)],
          ['09', 'South wing', 'two stories: primary floor at 6004.0 over the stepped down lower level, terrace railing'],
          ['10', 'Granny suite', '2 ft narrower each side than the primary, so its gable nests inside the primary gable; ridge ' + f1(g.ridges.GR)]
        ],
        dr: ['Gable roofs are encouraged at Lahontan and ' + S.pitch + ':12 clears the 4:12 minimum, so no pitch variance.', 'The frame carries the ridge ' + I.frame[S.pitch].ext.toFixed(1) + ' ft further east, still ' + f1(I.frame[S.pitch].over) + ' ft over grade.', 'Chimneys ' + f1(I.chim['lr' + S.pitch].over) + ' and ' + f1(I.chim[S.pitch].over) + ' ft over grade, inside the 4 ft chimney allowance (VII.5).', 'No eaves means no soffits to vent or harden, a plus in the Very High FHSZ. The long public wing ridge may draw an LCC request for a break.'],
        build: ['Straight rafters, repeatable framing and standard glass sizes, with solid cedar in the gables above the window heads. This is the value option.', 'With no overhang the walls take the weather: snow guards over doors and paths, careful flashing at every rake.']
      };
    }
    function renderSheet() {
      const r = sheetFor();
      $('#lede').textContent = r.lede;
      const nums = $('#nums'); nums.innerHTML = '';
      r.nums.forEach(([k, v]) => { const d = document.createElement('div'); d.className = 'num'; const a = document.createElement('span'); a.className = 'k'; a.textContent = k; const b = document.createElement('span'); b.className = 'v'; b.textContent = v; d.append(a, b); nums.appendChild(d); });
      const lg = $('#legend'); lg.innerHTML = '';
      r.legend.forEach(([n, a, b]) => { const li = document.createElement('li'); const s1 = document.createElement('span'); s1.textContent = n; const s2 = document.createElement('span'); const bb = document.createElement('b'); bb.textContent = a; s2.append(bb, document.createTextNode(' · ' + b)); li.append(s1, s2); lg.appendChild(li); });
      const w = $('#watch'); w.innerHTML = '';
      [['Design review watch', r.dr], ['Build and cost', r.build]].forEach(([h, items]) => { const h4 = document.createElement('h4'); h4.textContent = h; const ul = document.createElement('ul'); items.forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); }); w.append(h4, ul); });
      $$('#schemeSeg button[data-s]').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === S.scheme));
      $$('#pitchSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.p === S.pitch));
      $('#pitchSeg').hidden = S.scheme !== 'gab';
    }

    // ---------------- modes
    function setMode(m) {
      MODE = m; app.dataset.mode = m;
      apply(); measure(); drawDeco(); dirty = true;
    }
    function enterReel(first) {
      setMode('reel');
      startShot(first ? 0 : shot);
    }
    function enterModel() {
      setMode('model');
      renderSheet();
      setAnn(MODEL_ANN[S.scheme]());
      goTo('house', 1100);
    }

    // ---------------- input
    const pts = new Map();
    let lastTap = 0, pinch0 = null, moved = 0, hinted = false;
    stage.addEventListener('pointerdown', e => {
      stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = 0;
      if (pts.size === 2) { const [a, b] = [...pts.values()]; const d0 = Math.hypot(a.x - b.x, a.y - b.y); pinch0 = { d: d0, dist: cam.dist, last: d0 }; }
      const now = performance.now();
      if (MODE === 'model' && pts.size === 1 && now - lastTap < 300) goTo('house');
      lastTap = now;
    });
    stage.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return;
      const p = pts.get(e.pointerId), dx = e.clientX - p.x, dy = e.clientY - p.y;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved += Math.abs(dx) + Math.abs(dy);
      if (MODE !== 'model') return;
      if (window.__notesHold && moved > 6) { window.__notesHold = false; dirty = true; }
      const eyeLv = (cam.fp || 0) > 0.5;
      if (pts.size === 1) {
        if (eyeLv) { const E = eyePos(); cam.yaw += dx * 0.005; cam.el = Math.max(-0.85, Math.min(0.85, cam.el - dy * 0.004)); setEye(E); }
        else { cam.yaw -= dx * 0.008; cam.el = Math.max(0.02, Math.min(1.52, cam.el + dy * 0.006)); }
      }
      else if (pts.size === 2 && pinch0) {
        const [a, b] = [...pts.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (eyeLv) { walk((d - pinch0.last) * 0.06); pinch0.last = d; }
        else cam.dist = Math.max(28, Math.min(700, pinch0.dist * pinch0.d / Math.max(d, 1)));
      }
      cancelAnimationFrame(anim); $$('[data-view]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      dirty = true;
    });
    const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch0 = null; if (MODE === 'reel' && moved < 8 && e.type === 'pointerup') nextShot(); };
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    stage.addEventListener('wheel', e => { if (MODE !== 'model') return; e.preventDefault(); if ((cam.fp || 0) > 0.5) { walk(-e.deltaY * 0.02); return; } cam.dist = Math.max(28, Math.min(700, cam.dist * Math.exp(e.deltaY * 0.001))); dirty = true; }, { passive: false });

    $('#toModel').addEventListener('click', enterModel);

    // ---------------- dock and pop ups (André 8:50 am: full bleed model, everything else a tap away)
    const pops = $$('.pop'), dockBtns = $$('.dock [data-pop]');
    const rail = document.createElement('div'); rail.className = 'rail model-ui'; rail.setAttribute('role', 'toolbar'); rail.setAttribute('aria-label', 'Model controls');
    const quickEl = $('#quick');
    const dockEl = $('.dock'), homeOf = new Map([[dockEl, [dockEl.parentNode, dockEl.nextSibling]], [quickEl, [quickEl.parentNode, quickEl.nextSibling]], ...pops.map(p => [p, [p.parentNode, p.nextSibling]])]);
    dockEl.parentNode.insertBefore(rail, dockEl);
    const isWideUI = () => app.clientWidth >= 900 && app.clientHeight >= 520;
    const segEl = $('#schemeSeg'), pfBtns = [$('#toPlans'), $('#toFA')], pfHome = pfBtns.map(b => [b.parentNode, b.nextSibling]);
    function layoutUI() {
      const wide = isWideUI();
      if (wide === app.classList.contains('wideui')) return;
      app.classList.toggle('wideui', wide);
      if (wide) pfBtns.forEach(b => segEl.appendChild(b)); else pfBtns.forEach((b, i) => pfHome[i][0].insertBefore(b, pfHome[i][1] && pfHome[i][1].parentNode === pfHome[i][0] ? pfHome[i][1] : null));
      if (wide) { pops.forEach((p, i) => { p.hidden = false; rail.appendChild(p); if (i === 0) rail.appendChild(quickEl); }); }
      else { [quickEl, ...pops].forEach(el => { const [par, nx] = homeOf.get(el); par.insertBefore(el, nx && nx.parentNode === par ? nx : null); }); pops.forEach(p => { p.hidden = true; }); }
      dockBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
      setTimeout(() => { try { resize(); } catch (e) { } }, 0);
    }
    function closePops() { if (app.classList.contains('wideui')) return; pops.forEach(p => { p.hidden = true; }); dockBtns.forEach(b => b.setAttribute('aria-expanded', 'false')); }
    window.addEventListener('resize', layoutUI); setTimeout(layoutUI, 0);
    dockBtns.forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      const pop = $('#' + b.dataset.pop), open = pop.hidden;
      closePops(); if (open) { pop.hidden = false; b.setAttribute('aria-expanded', 'true'); }
    }));
    document.addEventListener('pointerdown', e => { if (!e.target.closest('.pop') && !e.target.closest('.dock')) closePops(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closePops(); $('#plans').hidden = true; } });
    $$('[data-view]').forEach(b => b.addEventListener('click', () => setTimeout(closePops, 250)));
    // one tap toggles, always in view (André 9/28 9:00 pm): ultra wide lens, see inside, roof off
    const quickBtns = $$('#quick [data-q]');
    const syncQuick = () => quickBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.q === 'lens' ? S.lens === 'ultra' : !!S[b.dataset.q])));
    quickBtns.forEach(b => b.addEventListener('click', () => { const q = b.dataset.q; if (q === 'lens') S.lens = S.lens === 'ultra' ? 'wide' : 'ultra'; else S[q] = !S[q]; syncQuick(); apply(); }));
    window.__syncQuick = () => { syncQuick(); const tn = $('#tNotes'), tt = $('#tTrees'); if (tn) tn.checked = S.notes; if (tt) tt.checked = S.trees; };
    syncQuick();
    let hintT = 0;
    function showHint() { const h = $('#mhint'); h.classList.remove('off'); clearTimeout(hintT); hintT = setTimeout(() => h.classList.add('off'), 5000); }
    $('#toModel').addEventListener('click', showHint);
    const openFA = () => { closePops(); renderPackage(); $('#info').hidden = false; $('#info').scrollTop = 0; $('#infoClose').focus(); };
    $('#toFA').addEventListener('click', openFA);

    // ---------------- FA package: deliverables, areas, specs, budget, regulatory, timeline (drafts, 9/28/26)
    const FA = DATA.fa, PL = DATA.plans;
    const mk = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
    const sf = v => 'about ' + (Math.round(v / 10) * 10).toLocaleString('en-US') + ' sf';
    function blocks(host, groups, kv) {
      host.innerHTML = '';
      groups.forEach(g => {
        const b = mk('div', 'blk'); b.appendChild(mk('h4', null, g.h)); const ul = mk('ul');
        g.items.forEach(it => {
          if (kv && Array.isArray(it)) { const li = mk('li', 'kv'); li.append(mk('span', null, it[0]), mk('span', null, it[1])); ul.appendChild(li); }
          else ul.appendChild(mk('li', null, Array.isArray(it) ? it.join(': ') : it));
        });
        b.appendChild(ul); host.appendChild(b);
      });
    }
    let packBuilt = false;
    function renderPackage() {
      const A = PL.areas[S.scheme === 'rib' ? 'rib' : 'gab'];
      $('#schemeH').textContent = 'This scheme · ' + (S.scheme === 'rib' ? 'Ribbon' : S.scheme === 'asym' ? 'Asymmetric gable' : 'Modern gable ' + S.pitch + ':12');
      const ar = $('#areas'); ar.innerHTML = '';
      [['Main 5997.5', A.main], ['Lower 5992.5', A.lower], ['Primary 6004.0', A.primary], ['Conditioned', A.conditioned, 'tot'], ['Garage + gear bay', A.garage], ['Terrace deck', A.deck]].forEach(([k, v, c]) => {
        const d = mk('div', c || ''); d.append(mk('span', null, k), mk('b', null, sf(v))); ar.appendChild(d);
      });
      if (packBuilt) return;
      packBuilt = true;
      const dl = $('#deliver');
      [['01', 'Design study: site plan, floor plans of each level, one exterior rendering', 'Plans and areas in this app · rendering at FA4'],
       ['02', 'Preliminary outline specifications', 'Draft below'],
       ['03', 'Project budget framework with Dustin’s team', 'Draft below · Dustin prices hard costs'],
       ['04', 'Regulatory investigation: Lahontan, Placer County, WUI, snow load', 'Draft below'],
       ['05', 'Preliminary timeline', 'Draft below']].forEach(([n, t, st]) => {
        const li = mk('li'); li.append(mk('span', null, n)); const d = mk('div', null, t); d.appendChild(mk('em', null, st)); li.appendChild(d); dl.appendChild(li);
      });
      const pb = $('#plBtns');
      [['site', 'Site plan'], ['l1', 'Level 1'], ['l2', 'Level 2'], ['roof', 'Roof + heights']].forEach(([k, t]) => {
        const b = mk('button', 'btn', t); b.type = 'button'; b.addEventListener('click', () => openPlans(k)); pb.appendChild(b);
      });
      blocks($('#specs'), FA.specs, false);
      blocks($('#budget'), FA.budget, true);
      blocks($('#reg'), FA.reg, true);
      const tl = $('#tline');
      FA.timeline.forEach(t => { const li = mk('li'); li.appendChild(mk('b', null, t.when)); const d = mk('div', null, t.what); d.appendChild(mk('small', null, t.who)); li.appendChild(d); tl.appendChild(li); });
      FA.open.forEach(o => $('#open').appendChild(mk('li', null, o)));
      FA.sources.forEach(([t, u]) => { const li = mk('li'); if (/^https?:/.test(u)) { const a = mk('a', null, t); a.href = u; a.target = '_blank'; a.rel = 'noopener'; li.appendChild(a); } else li.textContent = t + ' · ' + u; $('#srcs').appendChild(li); });
    }

    // ---------------- plans: open plans cut from the model, pencil on paper
    const SVGN = 'http://www.w3.org/2000/svg', plSvg = $('#plSvg'), plStage = $('#plStage');
    let plSheet = 'l1', vb = null, vb0 = null;
    const E = (tag, at, par) => { const e = document.createElementNS(SVGN, tag); for (const k in at) e.setAttribute(k, at[k]); (par || plSvg).appendChild(e); return e; };
    const pathEl = (d, at, par) => d ? E('path', Object.assign({ d, 'vector-effect': 'non-scaling-stroke' }, at), par) : null;
    function T(par, x, y, s, size, at) { const t = E('text', Object.assign({ x, y, 'font-size': size }, at || {}), par); t.textContent = s; return t; }
    function bbox(d) { const n = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let i = 0; i + 1 < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); } return [x0, y0, x1, y1]; }
    const HAND = "font-family:'Nothing You Could Do', 'EB Garamond', cursive", MONO = "font-family:'Tenor Sans', sans-serif;letter-spacing:.08em";
    const inkC = () => getComputedStyle(app).getPropertyValue('--ink').trim() || '#1b1a18';
    const papC = () => getComputedStyle(app).getPropertyValue('--paper').trim() || '#f6f5f1';
    const pap2 = () => getComputedStyle(app).getPropertyValue('--paper-2').trim() || '#ebe9e3';
    function defs(ink) {
      const d = E('defs', {});
      const hatch = E('pattern', { id: 'phatch', width: 1.6, height: 1.6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, d);
      E('line', { x1: 0, y1: 0, x2: 0, y2: 1.6, stroke: ink, 'stroke-width': 0.12, opacity: 0.45 }, hatch);
      const deck = E('pattern', { id: 'pdeck', width: 1, height: 1, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-18)' }, d);
      E('line', { x1: 0, y1: 0, x2: 1, y2: 0, stroke: '#c98a52', 'stroke-width': 0.1 }, deck);
      const dots = E('pattern', { id: 'pdots', width: 2, height: 2, patternUnits: 'userSpaceOnUse' }, d);
      E('circle', { cx: 1, cy: 1, r: 0.13, fill: ink, opacity: 0.4 }, dots);
      const pave = E('pattern', { id: 'ppave', width: 2, height: 2, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(19.3)' }, d);
      E('path', { d: 'M0 0 H2 M0 0 V2', stroke: ink, 'stroke-width': 0.06, opacity: 0.45, fill: 'none' }, pave);
      const deckT = E('pattern', { id: 'pdeckT', width: 1, height: 1, patternUnits: 'userSpaceOnUse' }, d);
      E('line', { x1: 0, y1: 0, x2: 1, y2: 0, stroke: '#c98a52', 'stroke-width': 0.1 }, deckT);
      const flag = E('pattern', { id: 'pflag', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(8)' }, d);
      E('path', { d: 'M0 0 L2.6 0.3 L3.1 2.4 L0.4 2.8 Z M3.1 2.4 L6 2.1 M2.6 0.3 L4.4 0 M4.4 0 L6 0.6 M4.4 0 L4.7 2.2 M0.4 2.8 L0 6 M0.4 2.8 L2.2 3.4 L2.9 6 M2.2 3.4 L5.1 4.1 L6 6 M3.1 2.4 L2.2 3.4 M5.1 4.1 L4.7 2.2', stroke: ink, 'stroke-width': 0.07, opacity: 0.5, fill: 'none' }, flag);
    }
    function northScale(bx) {
      const ink = inkC(), [x0, y0, x1, y1] = bx, u = Math.max(x1 - x0, y1 - y0) / 110;
      const nv = PL.north, ang = Math.atan2(nv[0], -nv[1]) * 180 / Math.PI;
      const g = E('g', { transform: 'translate(' + (x1 - 5 * u) + ' ' + (y1 - 6 * u) + ') rotate(' + ang.toFixed(1) + ')' });
      E('circle', { r: 4.2 * u, fill: 'none', stroke: ink, 'stroke-width': 0.8, 'vector-effect': 'non-scaling-stroke' }, g);
      E('path', { d: 'M0 ' + (-5.6 * u) + ' L' + 1.3 * u + ' ' + 1.2 * u + ' L0 0 L' + (-1.3 * u) + ' ' + 1.2 * u + ' Z', fill: getComputedStyle(app).getPropertyValue('--accent').trim() }, g);
      T(g, 0, -6.4 * u, 'N', 2.2 * u, { 'text-anchor': 'middle', fill: ink, style: MONO });
      const sx = x0 + 2 * u, sy = y1 - 3 * u, sg = E('g', {});
      [[0, 10, 1], [10, 20, 0], [20, 40, 1]].forEach(([a, b, f]) => E('rect', { x: sx + a, y: sy - 0.9, width: b - a, height: 0.9, fill: f ? ink : 'none', stroke: ink, 'stroke-width': 0.6, 'vector-effect': 'non-scaling-stroke' }, sg));
      [0, 10, 20, 40].forEach(v => T(sg, sx + v, sy - 1.8, v + (v === 40 ? ' ft' : ''), 1.7, { 'text-anchor': 'middle', fill: ink, style: MONO }));
    }
    function dims(bx, ink) {
      const [x0, y0, x1, y1] = bx, g = E('g', { stroke: ink, 'stroke-width': 0.7, fill: 'none' });
      const yy = y0 - 6, xx = x0 - 6, ftin = v => { let f = Math.floor(v), i = Math.round((v - f) * 12); if (i === 12) { f++; i = 0; } return f + '′ ' + i + '″'; };
      [['M' + x0 + ' ' + yy + ' H' + x1 + ' M' + x0 + ' ' + (yy - 1.2) + ' V' + (yy + 1.2) + ' M' + x1 + ' ' + (yy - 1.2) + ' V' + (yy + 1.2)], ['M' + xx + ' ' + y0 + ' V' + y1 + ' M' + (xx - 1.2) + ' ' + y0 + ' H' + (xx + 1.2) + ' M' + (xx - 1.2) + ' ' + y1 + ' H' + (xx + 1.2)]].forEach(([d]) => pathEl(d, {}, g));
      T(null, (x0 + x1) / 2, yy - 1.4, ftin(x1 - x0), 2.6, { 'text-anchor': 'middle', fill: ink, style: HAND });
      const t = T(null, xx - 1.4, (y0 + y1) / 2, ftin(y1 - y0), 2.6, { 'text-anchor': 'middle', fill: ink, style: HAND }); t.setAttribute('transform', 'rotate(-90 ' + (xx - 1.4) + ' ' + ((y0 + y1) / 2) + ')');
    }
    let tagMid = 0;
    function tag(p, l1, l2, ink, acc) {
      if (!p) return;
      const [x, y] = p, left = x > tagMid, dx = left ? -1.6 : 1.6, an = left ? 'end' : 'start';
      E('path', { d: 'M' + (x - 1) + ' ' + y + ' H' + (x + 1) + ' M' + x + ' ' + (y - 1) + ' V' + (y + 1), stroke: acc || ink, 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' });
      T(null, x + dx, y - 0.6, l1, 2.9, { fill: acc || ink, style: HAND, 'text-anchor': an });
      if (l2) T(null, x + dx, y + 2.4, l2, 1.6, { fill: ink, style: MONO, opacity: 0.7, 'text-anchor': an });
    }
    function drawPlan() {
      const k = S.scheme === 'rib' ? 'rib' : 'gab', rk = S.scheme === 'rib' ? 'rib' : S.scheme === 'asym' ? 'ga' : 'g' + S.pitch;
      const ink = inkC(), pap = papC(), A = PL.areas[k];
      plSvg.innerHTML = ''; defs(ink);
      { const fb = bbox(PL.foot[k]); tagMid = fb[0] + (fb[2] - fb[0]) * 0.72; }
      const name = S.scheme === 'rib' ? 'Ribbon' : S.scheme === 'asym' ? 'Asymmetric gable' : 'Modern gable ' + S.pitch + ':12';
      let bx, title, sub, meta;
      if (plSheet === 'site') {
        const Sd = PL.site; bx = bbox(Sd.lot);
        Sd.contours.forEach(c => { pathEl(c.d, { fill: 'none', stroke: ink, 'stroke-width': c.m ? 0.8 : 0.4, opacity: c.m ? 0.55 : 0.3 }); if (c.m) T(null, c.at[0], c.at[1] - 0.6, c.el, 1.8, { fill: ink, style: MONO, opacity: 0.6, 'text-anchor': 'middle' }); });
        pathEl(Sd.setback, { fill: 'none', stroke: ink, 'stroke-width': 0.7, 'stroke-dasharray': '6 4', opacity: 0.6 });
        pathEl(Sd.lot, { fill: 'none', stroke: ink, 'stroke-width': 1.4, 'stroke-dasharray': '18 4 3 4' });
        pathEl(Sd.drive, { fill: 'none', stroke: ink, 'stroke-width': 1 });
        pathEl(PL.foot[k], { fill: ink, 'fill-opacity': 0.14, stroke: ink, 'stroke-width': 1.2 });
        PL.terrace.forEach(t => pathEl(t.d, { fill: t.k === 'deck' ? 'url(#pdeckT)' : 'url(#pflag)', stroke: ink, 'stroke-width': 0.6 })); if (PL.pit) pathEl(PL.pit, { fill: 'none', stroke: ink, 'stroke-width': 0.5 });
        pathEl(PL.roof[rk].outline, { fill: 'none', stroke: ink, 'stroke-width': 0.8, 'stroke-dasharray': '4 3' });
        Sd.trees.forEach(([x, z, r], i) => {
          const rr = i === 0 ? 13 : r;
          pathEl('M' + (x + rr) + ' ' + z + ' A' + rr + ' ' + rr + ' 0 1 1 ' + (x + rr - 0.01) + ' ' + (z + 0.6), { fill: 'none', stroke: ink, 'stroke-width': i === 0 ? 1.2 : 0.7, opacity: 0.8 });
          E('circle', { cx: x, cy: z, r: i === 0 ? 1.1 : 0.6, fill: ink });
        });
        const t0 = Sd.trees[0]; T(null, t0[0] - 10, t0[1] - 14, 'the signature tree', 2.8, { fill: ink, style: HAND });
        T(null, -128, 40, 'Lahontan Drive', 3.2, { fill: ink, style: HAND, transform: 'rotate(-90 -128 40)', 'text-anchor': 'middle' });
        tag([-95, 44], 'driveway', null, ink);
        tag([bx[0] + 6, bx[3] - 10], 'Lot 235 · 8154 Lahontan Drive', 'APN 108 160 012 000 · RS PD 1.7 · setbacks dashed', ink);
        title = 'Site plan'; sub = name + ' · FA grade contours, 1 ft'; meta = 'FA grade, not survey · property line and setbacks from the lot data · driveway from 3 ANDRE.dxf';
      } else if (plSheet === 'roof') {
        const R = PL.roof[rk]; bx = bbox(PL.foot[k]); const rb = bbox(R.outline); bx = [Math.min(bx[0], rb[0]), Math.min(bx[1], rb[1]), Math.max(bx[2], rb[2]), Math.max(bx[3], rb[3])];
        pathEl(R.cons, { fill: 'none', stroke: ink, 'stroke-width': 0.5, opacity: 0.3 });
        pathEl(PL.foot[k], { fill: 'none', stroke: ink, 'stroke-width': 0.5, 'stroke-dasharray': '2 3', opacity: 0.5 });
        pathEl(R.outline, { fill: pap, stroke: ink, 'stroke-width': 1.3 });
        if (R.joist) pathEl(R.joist, { fill: 'none', stroke: '#c98a52', 'stroke-width': 0.6 });
        if (R.glulam) pathEl(R.glulam, { fill: '#c98a52', 'fill-opacity': 0.55, stroke: '#8a4f1e', 'stroke-width': 0.5 });
        if (R.beam) pathEl(R.beam, { fill: ink, stroke: ink, 'stroke-width': 0.5 });
        if (R.seam) pathEl(R.seam, { fill: 'none', stroke: ink, 'stroke-width': 0.35, opacity: 0.45 });
        if (R.ridge) pathEl(R.ridge, { fill: 'none', stroke: ink, 'stroke-width': 1.1 });
        pathEl(R.chim, { fill: '#4f4b46', stroke: ink, 'stroke-width': 0.8 });
        const acc = getComputedStyle(app).getPropertyValue('--accent').trim();
        R.spots.forEach(([x, z, t, m]) => tag([x, z], t, m ? (S.scheme === 'rib' ? 'max height · 29′ 4″ over grade' : S.scheme === 'flat' ? 'high roof' : 'max height · ridge') : null, ink, m ? acc : null));
        title = 'Roof + heights'; sub = name + (S.scheme === 'rib' ? ' · level beams, joists square to them' : ' · ridges, standing seam at 18 in');
        meta = '30 ft limit over natural grade · chimneys may rise 4 ft above it · FA grade, not survey';
      } else {
        const L = PL.levels[k][plSheet], tg = PL.levels[k].tags; bx = bbox(PL.foot[k]);
        pathEl(L.cons, { fill: 'none', stroke: ink, 'stroke-width': 0.5, opacity: 0.3 });
        if (plSheet === 'l1') {
          pathEl(L.main, { fill: pap2(), stroke: 'none' });
          pathEl(L.lower, { fill: 'url(#phatch)', stroke: 'none' });
          pathEl(L.gar, { fill: 'url(#pdots)', stroke: 'none' });
          PL.terrace.forEach(t => pathEl(t.d, { fill: t.k === 'deck' ? 'url(#pdeckT)' : 'url(#pflag)', stroke: ink, 'stroke-width': 0.7 })); if (PL.pit) pathEl(PL.pit, { fill: pap, stroke: ink, 'stroke-width': 0.6 });
        } else {
          pathEl(L.below, { fill: 'none', stroke: ink, 'stroke-width': 0.6, 'stroke-dasharray': '3 3', opacity: 0.5 });
          pathEl(L.prim, { fill: pap2(), stroke: 'none' });
          pathEl(L.deck, { fill: 'url(#pdeck)', stroke: '#c98a52', 'stroke-width': 0.8 });
        }
        pathEl(L.wall, { fill: ink, stroke: ink, 'stroke-width': 0.3 });
        pathEl(L.glass, { fill: pap, stroke: ink, 'stroke-width': 0.6 });
        if (plSheet === 'l1') {
          if (PL.terrace.length) { const tb = bbox(PL.terrace.map(t => t.d).join(' ')); tag([(tb[0] + tb[2]) / 2 + 2, (tb[1] + tb[3]) / 2], 'Court terraces', PL.terrace.map(t => t.y.toFixed(1)).join(' · '), ink); }
          tag(tg.main, 'Main 5997.5', sf(A.main), ink); tag(tg.lower, 'Lower 5992.5', '5 ft down · ' + sf(A.lower), ink); tag(tg.gar, 'Garage + gear 6000.0', sf(A.garage), ink);
          title = 'Level 1'; sub = name + ' · main 5997.5 with the lower level in the south wing';
        } else {
          tag(tg.prim, 'Primary 6004.0', sf(A.primary), ink); tag(tg.deck, 'Terrace deck', sf(A.deck), ink);
          title = 'Level 2'; sub = name + ' · primary level 6004.0 over the lower level';
        }
        meta = 'Open plan, no rooms yet · walls and glass cut 4 ft above each floor · conditioned ' + sf(A.conditioned);
      }
      if (plSheet !== 'site') dims(bbox(PL.foot[k]), ink);
      northScale(bx);
      const pad = plSheet === 'site' ? 5 : 10;
      vb0 = { x: bx[0] - pad, y: bx[1] - pad, w: bx[2] - bx[0] + pad * 2, h: bx[3] - bx[1] + pad * 2 };
      fitVB();
      $('#plH').textContent = title; $('#plSub').textContent = sub; $('#plMeta').textContent = meta;
      $$('#plSheets button').forEach(b => b.setAttribute('aria-pressed', b.dataset.sh === plSheet ? 'true' : 'false'));
    }
    function fitVB() {
      const r = plStage.getBoundingClientRect(), ar = (r.width || 1) / (r.height || 1);
      let { x, y, w, h } = vb0;
      if (w / h > ar) { const nh = w / ar; y -= (nh - h) / 2; h = nh; } else { const nw = h * ar; x -= (nw - w) / 2; w = nw; }
      vb = { x, y, w, h }; setVB();
    }
    const setVB = () => plSvg.setAttribute('viewBox', vb.x.toFixed(2) + ' ' + vb.y.toFixed(2) + ' ' + vb.w.toFixed(2) + ' ' + vb.h.toFixed(2));
    function openPlans(sh) { closePops(); plSheet = sh || plSheet; $('#plans').hidden = false; requestAnimationFrame(drawPlan); }
    $('#toPlans').addEventListener('click', () => openPlans());
    $$('#lensSeg button').forEach(b => b.addEventListener('click', () => { S.lens = b.dataset.l; $$('#lensSeg button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); apply(); }));
    $('#plClose').addEventListener('click', () => { $('#plans').hidden = true; });
    $$('#plSheets button').forEach(b => b.addEventListener('click', () => { plSheet = b.dataset.sh; drawPlan(); }));
    window.addEventListener('resize', () => { if (!$('#plans').hidden && vb0) fitVB(); });
    {
      const pp = new Map(); let pz = null, lastT = 0;
      const zoomAt = (cx, cy, f) => { const r = plStage.getBoundingClientRect(); const px = vb.x + (cx - r.left) / r.width * vb.w, py = vb.y + (cy - r.top) / r.height * vb.h; const nw = Math.max(8, Math.min(vb0.w * 3, vb.w * f)); const k = nw / vb.w; vb.x = px - (px - vb.x) * k; vb.y = py - (py - vb.y) * k; vb.w = nw; vb.h *= k; setVB(); };
      plStage.addEventListener('pointerdown', e => { plStage.setPointerCapture(e.pointerId); pp.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pp.size === 2) { const [a, b] = [...pp.values()]; pz = Math.hypot(a.x - b.x, a.y - b.y); } const now = performance.now(); if (pp.size === 1 && now - lastT < 300) fitVB(); lastT = now; });
      plStage.addEventListener('pointermove', e => {
        if (!pp.has(e.pointerId)) return; const p = pp.get(e.pointerId), dx = e.clientX - p.x, dy = e.clientY - p.y; pp.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const r = plStage.getBoundingClientRect();
        if (pp.size === 1) { vb.x -= dx * vb.w / r.width; vb.y -= dy * vb.h / r.height; setVB(); }
        else if (pp.size === 2 && pz) { const [a, b] = [...pp.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, pz / Math.max(d, 1)); pz = d; }
      });
      const upP = e => { pp.delete(e.pointerId); if (pp.size < 2) pz = null; };
      plStage.addEventListener('pointerup', upP); plStage.addEventListener('pointercancel', upP);
      plStage.addEventListener('wheel', e => { e.preventDefault(); zoomAt(e.clientX, e.clientY, Math.exp(e.deltaY * 0.0015)); }, { passive: false });
    }

    // name typeface picker (André 9/28: larger name, 16 faces to choose from); remembered per viewer
    const NAME_FONTS = [['Tenor Sans', "'Tenor Sans', 'Gill Sans', sans-serif", 0.82]];   // three fonts only (André 9/29 9:10 pm)
    const rootEl = document.documentElement, fontGrid = $('#fontGrid'), fontPop = $('#fontPop'), fontBtn = $('#fontBtn');
    function setNameFont(name) {
      const f = NAME_FONTS.find(x => x[0] === name) || NAME_FONTS[0];
      rootEl.style.setProperty('--f-name', f[1]); rootEl.style.setProperty('--name-scale', f[2]);
      $$('#fontGrid button').forEach(b => b.setAttribute('aria-pressed', b.dataset.f === f[0] ? 'true' : 'false'));
      try { localStorage.setItem('walshFA.nameFont2', f[0]); } catch (e) { }
    }
    NAME_FONTS.forEach(([n, st, k]) => {
      const b = document.createElement('button'); b.type = 'button'; b.dataset.f = n;
      const t = document.createElement('b'); t.textContent = 'André Mandel'; t.style.fontFamily = st; t.style.setProperty('--k', Math.min(k, 1.2));
      const sm = document.createElement('small'); sm.textContent = n;
      b.append(t, sm); b.addEventListener('click', () => setNameFont(n)); fontGrid.appendChild(b);
    });
    function togglePop(open) { fontPop.hidden = !open; fontBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    fontBtn.addEventListener('click', e => { e.stopPropagation(); togglePop(fontPop.hidden); });
    document.addEventListener('pointerdown', e => { if (!fontPop.hidden && !fontPop.contains(e.target) && e.target !== fontBtn) togglePop(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') togglePop(false); });
    let savedFont = null; try { savedFont = localStorage.getItem('walshFA.nameFont2'); } catch (e) { }
    setNameFont('Tenor Sans');
    $('#toReel').addEventListener('click', () => enterReel(false));
    const openInfo = () => { $('#info').hidden = false; $('#infoClose').focus(); };
    $('#toInfo').addEventListener('click', () => { renderPackage(); openInfo(); });
    $('#infoClose').addEventListener('click', () => { $('#info').hidden = true; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#info').hidden = true; if (MODE === 'reel' && e.key === 'ArrowRight') nextShot(); });
    $$('#schemeSeg button').forEach(b => b.addEventListener('click', () => { S.scheme = b.dataset.s; apply(); renderSheet(); setAnn(MODEL_ANN[S.scheme]()); }));
    $$('#pitchSeg button').forEach(b => b.addEventListener('click', () => { S.pitch = b.dataset.p; apply(); renderSheet(); setAnn(MODEL_ANN[S.scheme]()); }));
    $$('[data-view]').forEach(b => b.addEventListener('click', () => goTo(b.dataset.view)));
    [['tNotes', 'notes'], ['tTrees', 'trees']].forEach(([id, k]) => $('#' + id).addEventListener('change', e => { S[k] = e.target.checked; apply(); }));
    $$('#styleSeg button').forEach(b => b.addEventListener('click', () => {
      STYLE = b.dataset.style; app.dataset.style = STYLE;
      $$('#styleSeg button').forEach(x => x.setAttribute('aria-pressed', x === b));
      applyStyle();
      if (MODE === 'reel') { setAnn(SHOTS[shot].ann); } else if (MODE === 'model') setAnn(MODEL_ANN[S.scheme]());
      requestAnimationFrame(() => { measure(); drawDeco(); dirty = true; });
    }));

    // ---------------- loop
    let dirty = true;
    function loop(now) {
      if (!document.hidden) {
        if (MODE === 'reel') { reelTick(now); dirty = true; }
        if (dirty) { dirty = false; render(); }
      }
      requestAnimationFrame(loop);
    }
    window.addEventListener('resize', resize);
    new ResizeObserver(() => resize()).observe(app);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); drawDeco(); dirty = true; });

    applyStyle(); apply(); resize();
    requestAnimationFrame(loop);
    if (step) step(5);
    window.__fa = { look: (yaw, el, dist, t) => { cancelAnimationFrame(anim); cam.yaw = yaw; cam.el = el; cam.dist = dist; if (t) cam.t.set(t[0], t[1], t[2]); dirty = true; }, enterModel, enterReel, goTo, S, apply, nextShot, setStyle: s => $('#styleSeg [data-style="' + s + '"]').click(), startShot, cam, SHOTS, eyeCam, freeze: (i, t) => { window.__reelT = t; startShot(i); dirty = true; }, GAB, scene, camera, THREE, poke: () => { dirty = true; } };
    // ---------------- drawing export for the living set sheets (walsh/set/draw/build_drawings.py). Gated behind ?draw:
    // the client page never builds any of this. Orthographic elevations and clipped sections, rendered in tiles at
    // print resolution with the model's own color and line passes, then composited to drafting ink on clear ground.
    if (new URLSearchParams(location.search).has('draw')) window.__draw = drawKit();
    function drawKit() {
      const slab = mesh(DATA.slab, M.slab), slabE = edges(DATA.slab, INK, 0.8, 30);
      slab.visible = slabE.visible = false; scene.add(slab); scene.add(slabE);
      const bb = o => { const g = o.geometry; if (!g.boundingBox) g.computeBoundingBox(); return g.boundingBox; };
      const cars = EXTRA.children.filter(o => o.geometry && bb(o).max.x < -85);
      const glassDraw = new THREE.MeshLambertMaterial({ color: 0xc3ced2, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
      const NOCUT = new Set([M.furn, M.linen, M.fire]);
      const key = new THREE.DirectionalLight(0xfffaf2, 0.6); key.visible = false; scene.add(key); scene.add(key.target);
      const DIRS = { N: [[0, 0, 1], [-1, 0, 0]], S: [[0, 0, -1], [1, 0, 0]], E: [[-1, 0, 0], [0, 0, -1]], W: [[1, 0, 0], [0, 0, 1]] };   // [forward, screen right]
      const RT = () => new THREE.WebGLRenderTarget(4, 4, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, depthBuffer: true });
      const rA = RT(), rB = RT(), rO = RT();
      const dmat = new THREE.ShaderMaterial({
        depthTest: false, depthWrite: false,
        uniforms: { tF: { value: rA.texture }, tL: { value: rB.texture }, px: { value: new THREE.Vector2(1, 1) }, lw: { value: 1.6 }, sw: { value: 3.2 }, wash: { value: 0.12 }, ink: { value: new THREE.Color(0x1b1a18) } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
        fragmentShader: [
          'uniform sampler2D tF, tL; uniform vec2 px; uniform float lw, sw, wash; uniform vec3 ink; varying vec2 vUv;',
          'void main(){',
          '  vec4 F = texture2D(tF, vUv);',
          '  vec3 face = mix(F.rgb, vec3(0.965, 0.96, 0.945), wash);',
          '  float dk = 0.0; vec3 lt = vec3(1.0); float amin = F.a, amax = F.a;',
          '  for (int i = 0; i < 25; i++) {',
          '    float r = i == 0 ? 0.0 : (i < 9 ? 0.5 : (i < 17 ? 0.8 : 1.0));',
          '    float a = float(i) * 0.7853982 + (i < 9 ? 0.0 : (i < 17 ? 0.3927 : 0.1963));',
          '    vec2 o = vec2(cos(a), sin(a)) * r;',
          '    vec3 t = texture2D(tL, vUv + o * lw * px).rgb; float d = 1.0 - min(t.r, min(t.g, t.b));',
          '    if (d > dk) { dk = d; lt = t; }',
          '    float s = texture2D(tF, vUv + o * sw * px).a; amin = min(amin, s); amax = max(amax, s);',
          '  }',
          '  vec3 lc = dk > 0.0 ? clamp((lt - 1.0 + dk) / dk, 0.0, 1.0) : ink;',
          '  float sil = smoothstep(0.35, 0.9, amax - amin);',
          '  float L = max(dk, sil); vec3 col = dk >= sil ? lc : ink;',
          '  float a0 = clamp(F.a, 0.0, 1.0);',
          '  float a = L + a0 * (1.0 - L);',
          '  vec3 cp = col * L + face * a0 * (1.0 - L);',
          '  gl_FragColor = vec4(a > 0.0 ? cp / a : vec3(1.0), a);',
          '}'].join('\n')
      });
      const dScene = new THREE.Scene(), dCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      dScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), dmat));
      function setState(o) {
        RIB.skin.visible = RIB.body.visible = RIB.panels.visible = true;
        Object.values(GAB).forEach(G => { G.roof.visible = G.body.visible = false; });
        FLAT.roof.visible = FLAT.body.visible = false;
        EXTRA.visible = true; cars.forEach(c => { c.visible = false; });
        ground.visible = false; slab.visible = slabE.visible = true;
        allMats.forEach(m => { m.transparent = false; m.opacity = 1; m.depthWrite = true; m.colorWrite = true; m.needsUpdate = true; });
        quiet.forEach(m => { m.colorWrite = true; });
        M.wall.color.set(0xefece6); M.gwall.color.set(0xb9b3a8); M.roofT.color.set(0x5f666d); M.roofU.color.set(0xb98a58);
        glassWarm.uniforms.opacity.value = 0.9; glassWarm.uniforms.depthK.value = 0; glassSee.uniforms.depthK.value = 0;
        glassMeshes.forEach(g => { g.material = o.glass === 'warm' ? (g.userData.warm || glassWarm) : glassDraw; });
      }
      // the section cut: every visible solid's triangles against the plane, as segments in view coordinates (h, y)
      function cutSegs(o, F, R) {
        const n = o.clip.axis === 'x' ? 0 : 2, at = o.clip.at, segs = [];
        const vis = obj => { for (let p = obj; p; p = p.parent) if (!p.visible) return false; return true; };
        scene.traverse(ob => {
          if (!ob.isMesh || !vis(ob) || !ob.geometry || NOCUT.has(ob.material) || ob.material.transparent) return;
          const P = ob.geometry.attributes.position.array, out = [];
          for (let i = 0; i + 8 < P.length; i += 9) {
            const pts = [];
            for (let k = 0; k < 3; k++) {
              const a = i + k * 3, b = i + ((k + 1) % 3) * 3, da = P[a + n] - at, db = P[b + n] - at;
              if ((da < 0) !== (db < 0)) { const t = da / (da - db); pts.push([P[a] + (P[b] - P[a]) * t, P[a + 1] + (P[b + 1] - P[a + 1]) * t, P[a + 2] + (P[b + 2] - P[a + 2]) * t]); }
            }
            if (pts.length === 2) out.push(pts.map(p => [p[0] * R[0] + p[2] * R[2], p[1]]));
          }
          if (out.length) segs.push(out);
        });
        return segs;
      }
      function chains(segs) {
        const key = p => Math.round(p[0] * 200) + ',' + Math.round(p[1] * 200), ends = new Map(), used = new Uint8Array(segs.length), out = [];
        segs.forEach((s, i) => [0, 1].forEach(e => { const k = key(s[e]); (ends.get(k) || ends.set(k, []).get(k)).push([i, e]); }));
        for (let i = 0; i < segs.length; i++) {
          if (used[i]) continue; used[i] = 1;
          const c = [segs[i][0], segs[i][1]];
          for (let guard = 0; guard < 100000; guard++) {
            const nx = (ends.get(key(c[c.length - 1])) || []).find(([j]) => !used[j]);
            if (!nx) break;
            used[nx[0]] = 1; c.push(segs[nx[0]][1 - nx[1]]);
          }
          out.push(c);
        }
        return out;
      }
      // one orthographic view. o: { view: N|E|S|W, h0, h1, y0, y1 (view feet), ppf (px per ft out), ss, clip, grade: [[h, y]], earth, glass }
      function ortho(o) {
        setState(o);
        const [F, R] = DIRS[o.view], ss = o.ss || 2, ppf = o.ppf;
        const W = Math.round((o.h1 - o.h0) * ppf), H = Math.round((o.y1 - o.y0) * ppf), h1 = o.h0 + W / ppf, y0 = o.y1 - H / ppf;
        const hc = (o.h0 + h1) / 2, yc = (y0 + o.y1) / 2, ctr = new THREE.Vector3(R[0] * hc, yc, R[2] * hc);
        const cam = new THREE.OrthographicCamera(-(h1 - o.h0) / 2, (h1 - o.h0) / 2, (o.y1 - y0) / 2, -(o.y1 - y0) / 2, 1, 3000);
        cam.position.set(ctr.x - F[0] * 1200, ctr.y, ctr.z - F[2] * 1200); cam.up.set(0, 1, 0); cam.lookAt(ctr);
        const fog = scene.fog; scene.fog = null;
        key.position.set(ctr.x - F[0] * 200 - R[0] * 90, ctr.y + 120, ctr.z - F[2] * 200 - R[2] * 90); key.target.position.copy(ctr); key.target.updateMatrixWorld(); key.intensity = o.key == null ? 0.6 : o.key; key.visible = true;
        renderer.clippingPlanes = o.clip ? [new THREE.Plane(new THREE.Vector3(o.clip.axis === 'x' ? o.clip.keep : 0, 0, o.clip.axis === 'z' ? o.clip.keep : 0), -o.clip.keep * o.clip.at)] : [];
        dmat.uniforms.lw.value = o.lw || 1.6; dmat.uniforms.sw.value = o.sw || 3.2; dmat.uniforms.wash.value = o.wash == null ? 0.12 : o.wash;
        const out = document.createElement('canvas'); out.width = W; out.height = H;
        const g2 = out.getContext('2d'), img = g2.createImageData(W, H), D = img.data;
        const T = 2048, FW = W * ss, FH = H * ss;
        for (let ty = 0; ty < FH; ty += T) for (let tx = 0; tx < FW; tx += T) {
          const tw = Math.min(T, FW - tx), th = Math.min(T, FH - ty);
          cam.setViewOffset(FW, FH, tx, ty, tw, th); cam.updateProjectionMatrix();
          [rA, rB, rO].forEach(r => r.setSize(tw, th));
          dmat.uniforms.px.value.set(1 / tw, 1 / th);
          cam.layers.set(0);
          renderer.setClearColor(0xffffff, 0); renderer.setRenderTarget(rA); renderer.clear(); renderer.render(scene, cam);
          cam.layers.enable(LINES);
          allMats.forEach(m => { m.colorWrite = false; }); quiet.forEach(m => { m.colorWrite = false; }); glassDraw.colorWrite = false;
          renderer.setClearColor(0xffffff, 1); renderer.setRenderTarget(rB); renderer.clear(); renderer.render(scene, cam);
          allMats.forEach(m => { m.colorWrite = true; }); quiet.forEach(m => { m.colorWrite = true; }); glassDraw.colorWrite = true;
          renderer.clippingPlanes = [];
          renderer.setClearColor(0xffffff, 0); renderer.setRenderTarget(rO); renderer.clear(); renderer.render(dScene, dCam);
          renderer.clippingPlanes = o.clip ? [new THREE.Plane(new THREE.Vector3(o.clip.axis === 'x' ? o.clip.keep : 0, 0, o.clip.axis === 'z' ? o.clip.keep : 0), -o.clip.keep * o.clip.at)] : [];
          const buf = new Uint8Array(tw * th * 4);
          renderer.readRenderTargetPixels(rO, 0, 0, tw, th, buf);
          // down to output size: a box filter over ss x ss, premultiplied; the target's rows run bottom up
          const ow = Math.floor(tw / ss), oh = Math.floor(th / ss), ox = tx / ss, oy = ty / ss;
          for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            for (let j = 0; j < ss; j++) for (let i = 0; i < ss; i++) {
              const k = ((th - 1 - (y * ss + j)) * tw + x * ss + i) * 4, al = buf[k + 3];
              r += buf[k] * al; g += buf[k + 1] * al; b += buf[k + 2] * al; a += al;
            }
            const q = ((oy + y) * W + ox + x) * 4;
            if (a > 0) { D[q] = r / a; D[q + 1] = g / a; D[q + 2] = b / a; D[q + 3] = a / (ss * ss); }
          }
        }
        renderer.setRenderTarget(null); renderer.clippingPlanes = []; scene.fog = fog; key.visible = false;
        g2.putImageData(img, 0, 0);
        const X = h => (h - o.h0) * ppf, Y = y => (o.y1 - y) * ppf;
        const inch = o.ppi || 200;
        // earth: clear the ground below grade, hatch a band under the grade line, then the heavy grade line itself
        if (o.grade && o.grade.length > 1) {
          const G = o.grade, bot = o.earth || 3.5, band = new Path2D();
          band.moveTo(X(G[0][0]), Y(G[0][1])); G.forEach(p => band.lineTo(X(p[0]), Y(p[1])));
          band.lineTo(X(G[G.length - 1][0]), H + 10); band.lineTo(X(G[0][0]), H + 10); band.closePath();
          g2.save(); g2.globalCompositeOperation = 'destination-out'; g2.fill(band); g2.restore();
          // the hatch: a band of fixed depth under the grade line
          const hb = new Path2D();
          hb.moveTo(X(G[0][0]), Y(G[0][1])); G.forEach(p => hb.lineTo(X(p[0]), Y(p[1])));
          for (let k = G.length - 1; k >= 0; k--) hb.lineTo(X(G[k][0]), Y(G[k][1] - bot));
          hb.closePath();
          g2.save(); g2.clip(hb);
          g2.strokeStyle = 'rgba(27,26,24,.5)'; g2.lineWidth = Math.max(1, inch * 0.0055);
          const sp = inch * 0.07;
          for (let x = -H; x < W + H; x += sp) { g2.beginPath(); g2.moveTo(x, H + 10); g2.lineTo(x + H + 10, 0); g2.stroke(); }
          g2.restore();
          g2.strokeStyle = '#1b1a18'; g2.lineWidth = inch * 0.028; g2.lineJoin = 'round'; g2.lineCap = 'round';
          (o.gline || [G]).forEach(L => { g2.beginPath(); L.forEach((p, k) => k ? g2.lineTo(X(p[0]), Y(p[1])) : g2.moveTo(X(p[0]), Y(p[1]))); g2.stroke(); });
        }
        // the cut: solids filled dark, every cut edge drawn heavy
        let cut = null;
        if (o.clip) {
          const segs = cutSegs(o, F, R);
          g2.save(); g2.fillStyle = 'rgba(27,26,24,.9)'; g2.strokeStyle = '#1b1a18'; g2.lineJoin = 'round'; g2.lineCap = 'round';
          let x0 = 1e9, x1 = -1e9, yy0 = 1e9, yy1 = -1e9;
          segs.forEach(list => {
            const cs = chains(list), p = new Path2D();
            const pl = new Path2D();
            cs.forEach(c => {
              const closed = c.length > 3 && Math.hypot(c[0][0] - c[c.length - 1][0], c[0][1] - c[c.length - 1][1]) < 0.02;
              const tgt = closed ? p : pl;
              c.forEach((q, k) => { k ? tgt.lineTo(X(q[0]), Y(q[1])) : tgt.moveTo(X(q[0]), Y(q[1])); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); yy0 = Math.min(yy0, q[1]); yy1 = Math.max(yy1, q[1]); });
              if (closed) p.closePath();
            });
            g2.fill(p, 'evenodd');
            g2.lineWidth = inch * 0.022; g2.stroke(p); g2.stroke(pl);
          });
          g2.restore();
          cut = [x0, x1, yy0, yy1];
        }
        const url = out.toDataURL(o.type || 'image/webp', o.q || 0.9);
        return { url, W, H, h0: o.h0, h1, y0, y1: o.y1, ppf, cut };
      }
      return { ortho, ready: true };
    }
    return { ready: Promise.resolve(), enterReel };
  }

  boot();
})();
