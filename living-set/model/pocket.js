/* ================================================================
   ANDRÉ MANDEL · POCKET MODEL v1.0 (10/1/26)
   A lean live model for any living set cover, in the Walsh pocket model's drafting style: pale gray paper massing,
   black hairline edges, warm orange timber as the one accent, clear glass, a wide angle lens, gentle camera moves,
   and drag up looks up. Reads a massing JSON (volumes, roofs, glass, decks, trees, lot, shots) or a GLB.

   The cover sheet (kind: 'model') embeds this page with ?sheet and reads its reel from these ids, the contract the
   engine's reelBridge expects: #app[data-mode="reel"|"model"], #shotTitle, #shotLine, #shotData li, #shotNo,
   #ticks i (classes done / now run, --dur), buttons #toModel and #toReel (and #toInfo if the project has one).
   ?still renders the first shot once, for tools/make_still.py. See FRAMEWORK.md, 9.
   ================================================================ */
(function () {
  'use strict';
  const P = window.POCKET || {};
  const Q = new URLSearchParams(location.search);
  const SHEET = Q.has('sheet'), STILL = Q.has('still');
  const $ = s => document.querySelector(s);
  const app = $('#app');
  if (SHEET) document.body.classList.add('in-sheet');
  if (STILL) document.body.classList.add('still');
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* the palette, from walsh/mobile/app.js */
  const C = Object.assign({
    paper: 0xf6f5f1, wall: 0xf1eee7, roof: 0xc9c6bf, roof2: 0xdcd9d2, ground: 0xffffff, slab: 0xd3d0ca,
    timber: 0xc9965a, glass: 0x9fb1bb, ink: 0x1b1a18, canopy: 0x9dbb8f, stone: 0xcfccc5, accent: 0xc07a2c
  }, P.colors || {});

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: STILL });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.setClearColor(0xffffff, 1);
  $('#stage').appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 260, 1100);
  const camera = new THREE.PerspectiveCamera(54, 1, 0.5, 6000);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d6cf, 0.8));
  const sun = new THREE.DirectionalLight(0xfff4e6, 0.66); sun.position.set(60, 110, 80); scene.add(sun);

  const lam = (color, o) => new THREE.MeshLambertMaterial(Object.assign({ color, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }, o || {}));
  const M = {
    wall: lam(C.wall), roof: lam(C.roof), roof2: lam(C.roof2), slab: lam(C.slab), timber: lam(C.timber), stone: lam(C.stone),
    ground: lam(C.ground), chimney: lam(0xdddcd8),
    glass: new THREE.MeshLambertMaterial({ color: C.glass, transparent: true, opacity: 0.36, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }),
    canopy: new THREE.MeshLambertMaterial({ color: C.canopy, transparent: true, opacity: 0.14, depthWrite: false, side: THREE.DoubleSide })
  };
  const line = (op = 1) => new THREE.LineBasicMaterial({ color: C.ink, transparent: op < 1, opacity: op });
  const LINE = line(0.9), FAINT = line(0.28);

  /* ------------------------------------------------------------ geometry helpers
     plan coordinates: x east, y down the sheet (south), feet; elevations in feet. three: X = x, Y = el - datum, Z = y */
  let DATUM = 0;
  const V = (x, y, el) => new THREE.Vector3(x, el - DATUM, y);
  function meshFromTris(tris, mat, edges = true, thr = 20) {
    const g = new THREE.BufferGeometry();
    const a = []; tris.forEach(t => t.forEach(v => a.push(v.x, v.y, v.z)));
    g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); g.computeVertexNormals();
    const grp = new THREE.Group(); grp.add(new THREE.Mesh(g, mat));
    if (edges) grp.add(new THREE.LineSegments(new THREE.EdgesGeometry(g, thr), LINE));
    return grp;
  }
  // triangulate a plan polygon (any simple polygon), lift each vertex with h(x, y)
  function capTris(poly, h) {
    const contour = poly.map(p => new THREE.Vector2(p[0], p[1]));
    const idx = THREE.ShapeUtils.triangulateShape(contour, []);
    return idx.map(t => t.map(i => V(poly[i][0], poly[i][1], h(poly[i][0], poly[i][1]))));
  }
  // walls from a base to a top that may vary along each edge (sampled at the ends, so gables need ridge points in the poly)
  function wallTris(poly, base, h) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const a0 = V(a[0], a[1], base), b0 = V(b[0], b[1], base), a1 = V(a[0], a[1], h(a[0], a[1])), b1 = V(b[0], b[1], h(b[0], b[1]));
      out.push([a0, b0, b1], [a0, b1, a1]);
    }
    return out;
  }
  // keep the part of a polygon where f(p) >= 0
  function halfClip(poly, f) {
    const out = [];
    for (let k = 0; k < poly.length; k++) {
      const a = poly[k], b = poly[(k + 1) % poly.length], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }
  const bbox = poly => { const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };

  /* a roof as a height function over the plan, and the plan pieces each one is planar on */
  function roofOf(v) {
    const R = v.roof || { type: 'flat' }, eave = v.eave, B = bbox(v.poly), ov = R.overhang || 0;
    const roofPoly = ov ? [[B[0] - ov, B[1] - ov], [B[2] + ov, B[1] - ov], [B[2] + ov, B[3] + ov], [B[0] - ov, B[3] + ov]] : v.poly;
    if (R.type === 'gable') {
      const ax = R.axis || 'x', mid = ax === 'x' ? (B[1] + B[3]) / 2 : (B[0] + B[2]) / 2, half = ax === 'x' ? (B[3] - B[1]) / 2 : (B[2] - B[0]) / 2;
      const d = (x, y) => Math.abs((ax === 'x' ? y : x) - mid);
      const h = (x, y) => R.ridge - (R.ridge - eave) * d(x, y) / half;
      const s = p => (ax === 'x' ? p[1] : p[0]) - mid;
      return { h, pieces: [halfClip(roofPoly, p => s(p)), halfClip(roofPoly, p => -s(p))], ridge: ax === 'x' ? [[roofPoly[0][0], mid], [roofPoly[1][0], mid]] : [[mid, roofPoly[0][1]], [mid, roofPoly[2][1]]],
        wallPoly: insertRidge(v.poly, ax, mid), roofPoly };
    }
    if (R.type === 'shed') {
      const dir = R.dir || 'y', lo = dir === 'y' ? B[1] : B[0], hi = dir === 'y' ? B[3] : B[2], up = R.up === 'min' ? -1 : 1;
      const h = (x, y) => { const t = ((dir === 'y' ? y : x) - lo) / (hi - lo || 1); return R.low + (R.high - R.low) * (up > 0 ? t : 1 - t); };
      return { h, pieces: [roofPoly], wallPoly: v.poly, roofPoly };
    }
    const top = R.top != null ? R.top : eave;
    return { h: () => top, pieces: [roofPoly], wallPoly: v.poly, roofPoly };
  }
  function insertRidge(poly, ax, mid) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length]; out.push(a);
      const ca = ax === 'x' ? a[1] : a[0], cb = ax === 'x' ? b[1] : b[0];
      if ((ca - mid) * (cb - mid) < 0) { const t = (mid - ca) / (cb - ca); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }

  /* ------------------------------------------------------------ build from the massing JSON */
  const WORLD = new THREE.Group(); scene.add(WORLD);
  let FOCUS = new THREE.Vector3(), RADIUS = 60;
  function build(D) {
    DATUM = D.datum || 0;
    const all = [];
    (D.volumes || []).forEach(v => {
      const R = roofOf(v);
      const g = new THREE.Group(); g.name = v.name || 'volume';
      g.add(meshFromTris(wallTris(R.wallPoly, v.base, (x, y) => R.h(x, y) - 0.2).concat(capTris(v.poly, () => v.base)), M[v.mat || 'wall']));   // walls stop just under the roof, so the roof reads as one sheet
      // the roof: each planar piece, lifted, with a thin fascia
      const rm = M[v.roofMat || (v.roof && v.roof.type === 'flat' ? 'roof2' : 'roof')];
      R.pieces.forEach(pc => { if (pc.length > 2) g.add(meshFromTris(capTris(pc, (x, y) => R.h(x, y) + 0.01), rm, true, 30)); });
      if (R.ridge) { const r = R.ridge; g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(r[0][0], r[0][1], R.h(r[0][0], r[0][1]) + .02), V(r[1][0], r[1][1], R.h(r[1][0], r[1][1]) + .02)]), LINE)); }
      // glass: panes on wall runs [[x, y], [x, y], sill, head] in elevation feet, mullions every 4 ft max
      (v.glass || []).forEach(gl => {
        const [a, b] = gl, sill = gl[2] != null ? gl[2] : v.base + 0.5, head = gl[3] != null ? gl[3] : Math.min(R.h(a[0], a[1]), R.h(b[0], b[1])) - 0.6;
        const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4)), tris = [], mull = [];
        for (let k = 0; k < n; k++) {
          const p0 = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n], p1 = [a[0] + (b[0] - a[0]) * (k + 1) / n, a[1] + (b[1] - a[1]) * (k + 1) / n];
          const o = 0.05, nx = -(b[1] - a[1]), ny = b[0] - a[0], L = Math.hypot(nx, ny) || 1, ox = nx / L * o, oy = ny / L * o;
          const q = [V(p0[0] + ox, p0[1] + oy, sill), V(p1[0] + ox, p1[1] + oy, sill), V(p1[0] + ox, p1[1] + oy, head), V(p0[0] + ox, p0[1] + oy, head)];
          tris.push([q[0], q[1], q[2]], [q[0], q[2], q[3]]);
          mull.push(q[0], q[3], q[3], q[2], q[2], q[1], q[1], q[0]);
        }
        const gm = new THREE.BufferGeometry(); const arr = []; tris.forEach(t => t.forEach(p => arr.push(p.x, p.y, p.z)));
        gm.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); gm.computeVertexNormals();
        g.add(new THREE.Mesh(gm, M.glass));
        g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(mull), LINE));
      });
      WORLD.add(g); all.push(...v.poly.map(p => V(p[0], p[1], v.base)), ...v.poly.map(p => V(p[0], p[1], R.h(p[0], p[1]))));
    });
    // chimneys: [x0, y0, x1, y1, base, top], board form concrete gray
    (D.chimneys || []).forEach(c => { const poly = [[c[0], c[1]], [c[2], c[1]], [c[2], c[3]], [c[0], c[3]]];
      WORLD.add(meshFromTris(wallTris(poly, c[4], () => c[5]).concat(capTris(poly, () => c[5])), M.chimney)); });
    // decks and terraces: timber (the one accent) or stone, a slab with a thin edge
    (D.decks || []).forEach(d => { const poly = d.poly, z = d.el, t = d.t || 0.6, mat = M[d.mat || 'timber'];
      WORLD.add(meshFromTris(wallTris(poly, z - t, () => z).concat(capTris(poly, () => z)), mat, true)); });
    // ground: a white plane, the lot line in ink, a soft shadow of the house
    const site = D.site || {};
    const gb = site.lot ? bbox(site.lot) : [-150, -150, 150, 150];
    const pad = 220, gp = [[gb[0] - pad, gb[1] - pad], [gb[2] + pad, gb[1] - pad], [gb[2] + pad, gb[3] + pad], [gb[0] - pad, gb[3] + pad]];
    const gEl = site.grade != null ? site.grade : DATUM;
    WORLD.add(meshFromTris(capTris(gp, () => gEl - 0.02), M.ground, false));
    if (site.lot) {
      const pts = site.lot.concat([site.lot[0]]).map(p => V(p[0], p[1], gEl + 0.03));
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: C.ink, dashSize: 6, gapSize: 2, transparent: true, opacity: 0.55 }));
      l.computeLineDistances(); WORLD.add(l);
    }
    (site.contours || []).forEach(c => WORLD.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.pts.map(p => V(p[0], p[1], c.el))), FAINT)));
    // trees: [x, y, canopy radius, height], a pale cone with a trunk line; mark: true for the signature tree
    (site.trees || []).forEach(t => {
      const [x, y, r, h] = t, el = gEl, cone = new THREE.ConeGeometry(r, h * 0.78, 7, 1, true);
      const m = new THREE.Mesh(cone, M.canopy); m.position.copy(V(x, y, el + h * 0.22 + h * 0.39)); WORLD.add(m);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(cone, 1), line(0.14)); e.position.copy(m.position); WORLD.add(e);
      WORLD.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(x, y, el), V(x, y, el + h * 0.6)]), line(0.5)));
      if (t[4]) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 8), new THREE.MeshBasicMaterial({ color: C.accent })); d.position.copy(V(x, y, el + 0.6)); WORLD.add(d); }
    });
    if (all.length) { const b = new THREE.Box3().setFromPoints(all); b.getCenter(FOCUS); RADIUS = b.getSize(new THREE.Vector3()).length() / 2; }
  }

  /* ------------------------------------------------------------ the camera: orbit about a focus, wide angle, gentle */
  const cam = { th: -0.75, ph: 1.05, r: 2.4, f: new THREE.Vector3(), fov: 54 };
  let goal = null;
  function place() {
    const R = RADIUS * cam.r;
    camera.position.set(cam.f.x + R * Math.sin(cam.ph) * Math.sin(cam.th), cam.f.y + R * Math.cos(cam.ph), cam.f.z + R * Math.sin(cam.ph) * Math.cos(cam.th));
    camera.lookAt(cam.f); camera.fov = cam.fov; camera.updateProjectionMatrix();
  }
  // a shot: { th, ph, r (orbit, degrees and radii), look: [x, y, el] plan feet, fov }
  function shotPose(s) {
    const c = s.cam || {};
    return { th: (c.th != null ? c.th : -43) * Math.PI / 180, ph: (c.ph != null ? c.ph : 60) * Math.PI / 180, r: c.r || 2.4,
      f: c.look ? V(c.look[0], c.look[1], c.look[2] != null ? c.look[2] : DATUM) : FOCUS.clone(), fov: c.fov || 54 };
  }
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  function moveTo(pose, ms) {
    if (REDUCE || STILL || !ms) { Object.assign(cam, pose, { f: pose.f.clone() }); goal = null; return; }
    goal = { from: { th: cam.th, ph: cam.ph, r: cam.r, f: cam.f.clone(), fov: cam.fov }, to: pose, t0: performance.now(), ms };
  }
  function stepGoal(now) {
    if (!goal) return;
    const t = Math.min(1, (now - goal.t0) / goal.ms), e = ease(t), A = goal.from, B = goal.to;
    let dth = B.th - A.th; while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI;
    cam.th = A.th + dth * e; cam.ph = A.ph + (B.ph - A.ph) * e; cam.r = A.r + (B.r - A.r) * e; cam.fov = A.fov + (B.fov - A.fov) * e;
    cam.f.lerpVectors(A.f, B.f, e);
    if (t >= 1) goal = null;
  }

  /* drag to orbit: sideways turns, drag up looks up (André 9/27/26), pinch or wheel to come closer. Damped, never fast */
  const vel = { th: 0, ph: 0 };
  let drag = null;
  const stage = $('#stage');
  stage.addEventListener('pointerdown', e => { if (app.dataset.mode !== 'model') return; drag = { x: e.clientX, y: e.clientY }; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x: e.clientX, y: e.clientY };
    vel.th = -dx * 0.0042; vel.ph = dy * 0.0034;       // dragging up (dy < 0) lowers the eye and tilts the view up
    goal = null;
  });
  addEventListener('pointerup', () => { drag = null; });
  stage.addEventListener('wheel', e => { if (app.dataset.mode !== 'model') return; e.preventDefault(); cam.r = Math.max(0.8, Math.min(6, cam.r * Math.exp(e.deltaY * 0.0012))); }, { passive: false });

  /* ------------------------------------------------------------ the reel */
  let SHOTS = [], si = 0, holdT = 0, reelTimer = 0;
  const fmt = n => String(n).padStart(2, '0');
  function showShot(k, first) {
    si = (k + SHOTS.length) % SHOTS.length;
    const s = SHOTS[si];
    $('#shotTitle').textContent = s.title || '';
    $('#shotLine').textContent = s.line || '';
    $('#shotData').innerHTML = (s.data || []).map(d => `<li>${String(d).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</li>`).join('');
    $('#shotNo').textContent = `${fmt(si + 1)} / ${fmt(SHOTS.length)}`;
    const ticks = $('#ticks');
    ticks.querySelectorAll('i').forEach(i => i.remove());
    SHOTS.forEach((sh, j) => { const i = document.createElement('i'); i.className = j < si ? 'done' : j === si ? 'now run' : ''; i.style.setProperty('--dur', (sh.dur || 9) + 's'); i.innerHTML = '<b></b>'; ticks.insertBefore(i, $('#shotNo')); });
    moveTo(shotPose(s), first ? 0 : 2600);
    clearTimeout(reelTimer);
    if (!STILL && SHOTS.length > 1) reelTimer = setTimeout(() => app.dataset.mode === 'reel' && showShot(si + 1), (s.dur || 9) * 1000);
  }
  function setMode(m) {
    app.dataset.mode = m;
    if (m === 'reel') showShot(si); else { clearTimeout(reelTimer); }
  }
  $('#toModel').addEventListener('click', () => setMode('model'));
  $('#toReel').addEventListener('click', () => setMode('reel'));

  /* ------------------------------------------------------------ run */
  function size() {
    const w = stage.clientWidth || innerWidth, h = stage.clientHeight || innerHeight;
    renderer.setSize(w, h, false); renderer.domElement.style.width = w + 'px'; renderer.domElement.style.height = h + 'px';
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  addEventListener('resize', size);
  function frame(now) {
    stepGoal(now);
    if (!drag) { vel.th *= 0.9; vel.ph *= 0.9; }
    cam.th += vel.th; cam.ph = Math.max(0.18, Math.min(1.52, cam.ph + vel.ph));
    place(); renderer.render(scene, camera);
    if (!STILL) requestAnimationFrame(frame);
  }
  async function load() {
    const D = P.data && typeof P.data === 'object' ? P.data : await fetch(P.data || 'massing.json').then(r => r.json());
    document.title = (D.title || 'Pocket model') + ' · live model';
    $('#mtitle').textContent = D.title || '';
    if (D.glb && window.THREE.GLTFLoader) {
      DATUM = D.datum || 0;
      await new Promise(res => new THREE.GLTFLoader().load(D.glb, g => {
        g.scene.traverse(o => { if (o.isMesh) { o.material = M.wall; const e = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 20), LINE); e.matrix.copy(o.matrix); o.add(e); } });
        WORLD.add(g.scene); const b = new THREE.Box3().setFromObject(g.scene); b.getCenter(FOCUS); RADIUS = b.getSize(new THREE.Vector3()).length() / 2; res();
      }, undefined, () => res()));
    } else build(D);
    SHOTS = (D.shots && D.shots.length ? D.shots : [{ title: D.title || 'The house', line: '', data: [] }]);
    size();
    cam.f.copy(FOCUS);
    setMode('reel');
    showShot(0, true);
    if (STILL) { place(); renderer.render(scene, camera); document.body.dataset.ready = '1'; return; }
    requestAnimationFrame(frame);
    document.body.dataset.ready = '1';
  }
  load().catch(e => { console.error('pocket model', e); $('#shotLine').textContent = 'The model needs a connection to load. Refresh to try again.'; });
})();
