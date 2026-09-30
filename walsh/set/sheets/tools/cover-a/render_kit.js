/* cover-a render kit (9/30/26). Injected into the pocket model (walsh/index.html) by render.py.
   Reuses the model's own three.js scene (window.__fa.scene), swaps its materials for a palette (MIST, MEADOW, DUSK),
   adds ground to the horizon, sky, painted firs and meadow grass, then renders two passes in tiles at print resolution:
   color (the rendering) and line (the model's own hairline edges, hidden lines removed). render.py composites them. */
(function () {
  const F = window.__fa, THREE = F.THREE, scene = F.scene;
  const DATA = JSON.parse(document.getElementById('model-data').textContent);
  const lin = c => new THREE.Color(c).convertSRGBToLinear();
  function rng(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  // ---------------------------------------------------------------- the model, set to the ribbon scheme, opaque, model mode
  F.enterModel();
  Object.assign(F.S, { scheme: 'rib', inside: false, roof: false, panels: true, trees: false, room: false, notes: false });
  F.apply();
  Object.values(F.GAB).forEach(G => { G.roof.visible = G.body.visible = false; });

  // find the ground group (it holds the terrain mesh) and keep only what a rendering wants from it
  const byLen = new Map();
  const keepLines = [];
  DATA.site.contours.forEach(c => keepLines.push([c.p.length, 'contour']));
  DATA.site.lot.forEach(p => keepLines.push([p.length, 'lot']));
  DATA.site.setback.forEach(p => keepLines.push([p.length, 'setback']));
  DATA.drive.forEach(p => keepLines.push([p.length, 'drive']));
  keepLines.push([DATA.people.length, 'people']);
  keepLines.push([DATA.construct.length, 'construct']);
  keepLines.forEach(([n, k]) => byLen.set(n, k));
  let ground = null;
  scene.children.forEach(g => { if (g.isGroup && g.children.some(c => c.isMesh && c.material && c.material.color && c.material.color.getHexString() === 'd9e2cd')) ground = g; });
  const lineKind = new Map();
  ground.children.forEach(c => {
    if (c.isMesh) {
      const hx = c.material.color ? c.material.color.getHexString() : '';
      c.visible = (hx === 'c9c6bf' || hx === 'cac7c0');           // keep the slab, drop terrain (ours replaces it), compass, canopies
      return;
    }
    if (c.isLine || c.isLineSegments) {
      const n = c.geometry.attributes.position.array.length, hx = c.material.color.getHexString();
      const k = hx === '2c5a37' ? 'tree' : (byLen.get(n) || null);
      lineKind.set(c, k);
      c.visible = !!k && k !== 'tree';
      if (k === 'drive') { c.material = c.material.clone(); c.material.opacity = 0.45; c.material.transparent = true; }
      if (k === 'contour') { c.material = c.material.clone(); c.material.color.set(0x8f8c85); c.material.opacity = 0.55; c.material.transparent = true; }
    } else c.visible = false;
  });

  // ---------------------------------------------------------------- material roles
  const ROLE = {
    efece6: 'wall', e7e5e0: 'wall', '5f666d': 'roof', b98a58: 'soffit', '2a2927': 'dark', bdbbb6: 'rdeck', '232221': 'beam',
    '7b5334': 'timber', '3b3a38': 'furn', f1eee7: 'linen', '4f4b46': 'stone', cfccc5: 'band', c9c6bf: 'slab', cac7c0: 'slab',
    e4e1dc: 'gwall', b9b3a8: 'gwall', '94643c': 'cedar', d1cdc5: 'pwhite', cac5b9: 'paver', d6d5d1: 'bform', c9965a: 'tdeck', c8c3b4: 'flag',
    e8883a: 'fire', cfcac2: 'carBody', '2e3235': 'carGlass', '1f1e1d': 'wheel', '9fb1bb': 'glass', bfd0d8: 'railGlass'
  };
  const meshes = [];
  scene.traverse(o => { if (o.isMesh && o !== undefined) meshes.push(o); });
  function roleOf(m) {
    const mt = m.material;
    if (mt.isShaderMaterial && mt.uniforms && mt.uniforms.opacity) return mt.uniforms.opacity.value < 0.5 ? 'glassSee' : 'glass';
    if (mt.vertexColors) return 'joist';
    if (!mt.color) return null;
    return ROLE[mt.color.getHexString()] || null;
  }
  meshes.forEach(m => { m.userData.role = roleOf(m); m.userData.orig = m.material; });

  // ---------------------------------------------------------------- procedural surfaces (world space, no uvs needed)
  const GLSL_NOISE = `
    varying vec3 vWP; varying vec3 vWN;
    uniform float pKind, pW, pVar, pJoint, pGrain; uniform vec3 pC2, pC3;
    float h2(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
    float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x), mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x), f.y); }
    float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*n2(p); p*=2.03; a*=0.5; } return v; }
    vec2 vor(vec2 p){ vec2 i=floor(p), f=fract(p); float d1=8.0, d2=8.0; for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g=vec2(float(x),float(y)); vec2 o=vec2(h2(i+g),h2(i+g+17.3)); float d=length(g+o-f); if(d<d1){d2=d1;d1=d;} else if(d<d2) d2=d; } return vec2(d1,d2); }
    vec3 procCol(vec3 c){
      vec3 n = normalize(vWN);
      if (pKind < 0.5) { return c * (0.96 + 0.08 * n2(vWP.xz * 0.7 + vWP.y * 0.5)); }
      if (pKind < 1.5) {                                        // vertical boards
        vec2 t = abs(n.y) > 0.7 ? vec2(1.0, 0.0) : normalize(vec2(-n.z, n.x) + 1e-5);
        float u = dot(vWP.xz, t) / pW, id = floor(u), f = fract(u);
        float along = abs(n.y) > 0.7 ? dot(vWP.xz, vec2(-t.y, t.x)) : vWP.y;
        float hv = h2(vec2(id, 3.1));
        c *= 1.0 + (hv - 0.5) * pVar;
        c = mix(c, c * pC2, smoothstep(0.55, 0.95, n2(vec2(u * 3.0 + id * 7.0, along * 0.25))) * 0.5);
        c *= 0.92 + pGrain * (n2(vec2(u * 9.0, along * 1.7 + id * 13.0)) - 0.5) + 0.08;
        c *= mix(1.0, pJoint, 1.0 - smoothstep(0.0, 0.07, f));
        c *= mix(1.0, 1.08, smoothstep(0.07, 0.14, f) * (1.0 - smoothstep(0.14, 0.22, f)));
        return c;
      }
      if (pKind < 2.5) {                                        // standing seam, 18 in, running down the slope
        vec2 g = n.xz; if (length(g) < 0.05) g = vec2(0.0, 1.0); g = normalize(g);
        float u = dot(vWP.xz, vec2(-g.y, g.x)) / pW, f = fract(u);
        c *= 0.94 + 0.1 * n2(vWP.xz * 0.08) + 0.03 * n2(vec2(u * 40.0, 0.0));
        c = mix(c, c * pC2, 1.0 - smoothstep(0.0, 0.035, f));
        c = mix(c, c * pC3, 1.0 - smoothstep(0.0, 0.035, 1.0 - f));
        return c;
      }
      if (pKind < 3.5) {                                        // board form concrete, 6 in boards
        float v = vWP.y / pW, id = floor(v), f = fract(v);
        vec2 t = normalize(vec2(-n.z, n.x) + 1e-5); float u = dot(vWP.xz, t);
        c *= 1.0 + (h2(vec2(id, floor(u / 4.0 + h2(vec2(id, 1.0))))) - 0.5) * pVar;
        c *= 0.95 + 0.1 * n2(vec2(u * 2.0, vWP.y * 6.0));
        c *= mix(1.0, pJoint, 1.0 - smoothstep(0.0, 0.08, f));
        return c;
      }
      if (pKind < 4.5) {                                        // ground: mottled, with speckle
        float m1 = fbm(vWP.xz * 0.018), m2 = fbm(vWP.xz * 0.07 + 11.0), sp = h2(floor(vWP.xz * 3.0));
        c = mix(c, pC2, smoothstep(0.35, 0.75, m1) * 0.7);
        c = mix(c, pC3, smoothstep(0.55, 0.85, m2) * 0.5);
        c *= 0.93 + 0.14 * n2(vWP.xz * 0.9) + pGrain * (sp - 0.5);
        return c;
      }
      if (pKind < 5.5) {                                        // flagstone
        vec2 v = vor(vWP.xz / pW); float e = v.y - v.x;
        c *= 0.9 + 0.2 * h2(floor(vWP.xz / pW * 1.0 + 0.5)) ;
        c *= 0.94 + 0.12 * n2(vWP.xz * 1.3);
        c *= mix(pJoint, 1.0, smoothstep(0.02, 0.08, e));
        return c;
      }
      {                                                          // decking, boards along x
        vec2 t = vec2(0.0, 1.0); float u = dot(vWP.xz, t) / pW, id = floor(u), f = fract(u);
        c *= 1.0 + (h2(vec2(id, 5.0)) - 0.5) * pVar;
        c *= 0.93 + 0.12 * n2(vec2(vWP.x * 0.6 + id * 9.0, u * 4.0));
        c *= mix(1.0, pJoint, 1.0 - smoothstep(0.0, 0.1, f));
        return c;
      }
    }`;
  function proc(o) {
    const m = new THREE.MeshStandardMaterial({ color: lin(o.c), roughness: o.rough == null ? 0.85 : o.rough, metalness: o.metal || 0,
      side: o.side, vertexColors: !!o.vc, transparent: !!o.transparent, opacity: o.opacity == null ? 1 : o.opacity, depthWrite: o.depthWrite !== false,
      emissive: o.emissive ? lin(o.emissive) : new THREE.Color(0), emissiveIntensity: o.ei || 1,
      polygonOffset: !!o.po, polygonOffsetFactor: o.po ? o.po[0] : 0, polygonOffsetUnits: o.po ? o.po[1] : 0 });
    const U = { pKind: { value: o.k || 0 }, pW: { value: o.w || 0.5 }, pVar: { value: o.var == null ? 0.18 : o.var }, pJoint: { value: o.joint == null ? 0.55 : o.joint },
      pGrain: { value: o.grain == null ? 0.12 : o.grain }, pC2: { value: o.c2 ? lin(o.c2) : new THREE.Color(1, 1, 1) }, pC3: { value: o.c3 ? lin(o.c3) : new THREE.Color(1, 1, 1) } };
    m.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + GLSL_NOISE)
        .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = procCol(diffuseColor.rgb);');
    };
    m.customProgramCacheKey = () => 'proc' + (o.k || 0) + (o.vc ? 'v' : '');
    return m;
  }
  function glassMat(G, see) {
    return new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: true,
      uniforms: Object.assign(THREE.UniformsUtils.clone(THREE.UniformsLib.fog), {
        lo: { value: new THREE.Color(G.lo) }, mid: { value: new THREE.Color(G.mid) }, hi: { value: new THREE.Color(G.hi) },
        refl: { value: new THREE.Color(G.refl) }, reflK: { value: G.reflK }, lamp: { value: G.lamp }, op: { value: see ? G.seeOp : G.op }, gain: { value: G.gain || 1 } }),
      vertexShader: '#include <common>\n#include <fog_pars_vertex>\nvarying vec3 wp; varying vec3 wn; void main(){ vec4 w = modelMatrix * vec4(position,1.0); wp = w.xyz; wn = normalize(mat3(modelMatrix) * normal); vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;\n#include <fog_vertex>\n}',
      fragmentShader: ['#include <common>', '#include <fog_pars_fragment>',
        'uniform vec3 lo, mid, hi, refl; uniform float reflK, lamp, op, gain; varying vec3 wp; varying vec3 wn;',
        'float h2(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }',
        'float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x), mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x), f.y); }',
        'void main(){',
        '  float lv = wp.y < 13.0 ? 7.5 : 14.0; if (wp.y < 6.0) lv = 2.5;',
        '  float h = clamp((wp.y - lv) / 11.0, 0.0, 1.0);',
        '  vec3 c = mix(lo, mid, smoothstep(0.0, 0.3, h)); c = mix(c, hi, smoothstep(0.45, 1.0, h));',
        '  vec2 q = vec2((wp.x + wp.z) / 5.5, wp.y / 30.0);',
        '  vec2 f = fract(q) - 0.5; float lp = exp(-f.x * f.x * 40.0) * step(0.55, h2(floor(q) + 3.0)) * smoothstep(0.55, 0.9, h);',
        '  c += vec3(1.0, 0.86, 0.6) * lp * lamp * 0.5;',
        '  c *= 0.97 + 0.05 * n2(vec2((wp.x + wp.z) * 0.4, wp.y * 0.2));',
        '  vec3 V = normalize(cameraPosition - wp); float fr = pow(1.0 - abs(dot(V, normalize(wn))), 2.4);',
        '  float band = smoothstep(0.5, 1.0, h) * (0.6 + 0.4 * n2(vec2((wp.x + wp.z) * 0.09, wp.y * 0.05)));',
        '  float rk = clamp(reflK * (0.4 * band + fr), 0.0, 0.9);',
        '  c = mix(c * gain, refl, rk);',
        '  gl_FragColor = vec4(c, clamp(op + rk * 0.5, 0.0, 1.0));',
        '#include <fog_fragment>',
        '}'].join('\n')
    });
  }

  // ---------------------------------------------------------------- palettes
  const PAL = {
    mist: {
      sky: [[-0.02, '#eeeeec'], [0.0, '#efefed'], [0.06, '#e6e8e8'], [0.2, '#d9dcde'], [0.55, '#c8cdd1'], [1.0, '#bfc5ca']], horizon: '#eeeeec', fog: [180, 1400],
      ridges: [{ h: 0.055, col: '#b9bec1', a: 0.5, s: 1 }, { h: 0.03, col: '#a8aeb2', a: 0.55, s: 2 }],
      hemi: ['#f6f6f4', '#cdcbc6', 0.95], sun: ['#fff4e6', 1.0], ambient: 0.1, sunAz: -0.55, sunEl: 0.62,
      ground: { c: '#d6d5d1', c2: '#c4c2bc', c3: '#e6e5e2', grain: 0.1 },
      grass: null, stones: true, drive: { c: '#bdbab4', c2: '#aeaaa3', c3: '#cac7c1', grain: 0.14 },
      tree: { col: [84, 94, 90], sig: [74, 92, 80], opFar: 0.32 },
      mats: {
        wall: { c: '#9c6139', k: 1, w: 0.5, var: 0.22, joint: 0.5, c2: '#74462a', grain: 0.16 },
        gwall: { c: '#a8693b', k: 1, w: 0.5, var: 0.22, joint: 0.5, c2: '#7a4a2a' },
        soffit: { c: '#c98a4e', k: 1, w: 0.33, var: 0.16, joint: 0.62, c2: '#a86a38' },
        roof: { c: '#2c2e30', k: 2, w: 1.5, c2: '#6d7277', c3: '#121314', rough: 0.55, metal: 0.25 },
        rdeck: { c: '#1d1d1c' }, dark: { c: '#1b1b1a', rough: 0.6 }, beam: { c: '#1d1d1c', rough: 0.55, metal: 0.2 },
        timber: { c: '#c07d45', k: 1, w: 0.22, var: 0.1, joint: 0.78, c2: '#9a5c2e', rough: 0.7 }, joist: { c: '#ffffff', vc: true, rough: 0.7 },
        furn: { c: '#5a4636' }, linen: { c: '#efe9df' }, stone: { c: '#8f8a82' }, band: { c: '#1d1d1c' }, slab: { c: '#c9c4ba' },
        cedar: { c: '#9a5f33', k: 1, w: 0.5, var: 0.2, joint: 0.5, c2: '#6e4125' }, pwhite: { c: '#e6ded1', rough: 0.95 },
        paver: { c: '#b9b4aa' }, bform: { c: '#cbc8c1', k: 3, w: 0.5, var: 0.08, joint: 0.82 }, tdeck: { c: '#b7824f', k: 6, w: 0.45, var: 0.18, joint: 0.55 },
        flag: { c: '#c7c1b5', k: 5, w: 2.4, joint: 0.62 }, fire: { c: '#ff9a3c', emissive: '#ff8a2a', ei: 1.4 },
        carBody: { c: '#d9d5cf', rough: 0.4, metal: 0.3 }, carGlass: { c: '#35393c', rough: 0.2 }, wheel: { c: '#1f1e1d' }
      },
      glass: { lo: '#7a5234', mid: '#c58b55', hi: '#ebc998', refl: '#a9bfd1', reflK: 0.85, lamp: 0.6, op: 0.55, seeOp: 0.4, gain: 1.0 },
      railGlass: '#b7c7d0', lamps: 1.0
    },
    meadow: {
      sky: [[-0.02, '#dfe2de'], [0.0, '#dfe2de'], [0.05, '#d0d8d6'], [0.16, '#a9babd'], [0.38, '#7a949d'], [1.0, '#56727d']], horizon: '#dfe2de', fog: [150, 1100],
      ridges: [{ h: 0.045, col: '#9fb0b4', a: 0.55, s: 3 }],
      hemi: ['#c6d1d4', '#6e3326', 0.9], sun: ['#ffe1bd', 0.85], ambient: 0.08, sunAz: 0.6, sunEl: 0.35,
      ground: { c: '#5c1a12', c2: '#7a2a1a', c3: '#86301e', grain: 0.2 },
      drive: { c: '#6d665e', c2: '#5e5750', c3: '#7a736a', grain: 0.14 },
      grass: { n: 90000, reach: 240, size: [0.9, 2.8], cols: ['#8c2a18', '#a3361c', '#6e1d10', '#b8482a', '#5a170d', '#7e2614'], tip: '#d0643a' },
      tree: { col: [30, 38, 34], sig: [40, 54, 46], opFar: 0.5 },
      mats: {
        wall: { c: '#8c8881', k: 1, w: 0.5, var: 0.16, joint: 0.55, c2: '#6e6b66', grain: 0.14 },
        gwall: { c: '#8c8881', k: 1, w: 0.5, var: 0.16, joint: 0.55, c2: '#6e6b66' },
        soffit: { c: '#b07a48', k: 1, w: 0.33, var: 0.16, joint: 0.62, c2: '#8a5a32' },
        roof: { c: '#c3c5c2', k: 2, w: 1.5, c2: '#f4f5f3', c3: '#7c7e7c', rough: 0.45, metal: 0.2 },
        rdeck: { c: '#b9bab6' }, dark: { c: '#2a2926', rough: 0.6 }, beam: { c: '#2a2926', rough: 0.55, metal: 0.2 },
        timber: { c: '#b2784a', k: 1, w: 0.22, var: 0.1, joint: 0.8, c2: '#8c5a32', rough: 0.7 }, joist: { c: '#f2e2cf', vc: true, rough: 0.7 },
        furn: { c: '#4a3222' }, linen: { c: '#efe6d6' }, stone: { c: '#77716a' }, band: { c: '#2a2926' }, slab: { c: '#a39d95' },
        cedar: { c: '#8e7c6a', k: 1, w: 0.5, var: 0.18, joint: 0.55, c2: '#6a5a4a' }, pwhite: { c: '#d9d3c8', rough: 0.95 },
        paver: { c: '#8f887e' }, bform: { c: '#b8b5ae', k: 3, w: 0.5, var: 0.08, joint: 0.8 }, tdeck: { c: '#9c7552', k: 6, w: 0.45, var: 0.18, joint: 0.55 },
        flag: { c: '#9b948a', k: 5, w: 2.4, joint: 0.6 }, fire: { c: '#ff9a3c', emissive: '#ff8a2a', ei: 1.8 },
        carBody: { c: '#cfcac2', rough: 0.4, metal: 0.3 }, carGlass: { c: '#2e3235', rough: 0.2 }, wheel: { c: '#1f1e1d' }
      },
      glass: { lo: '#8a5424', mid: '#e3a458', hi: '#f8d9a2', refl: '#b9c9cc', reflK: 0.3, lamp: 0.9, op: 0.62, seeOp: 0.5, gain: 1.05 },
      railGlass: '#b8c6c9', lamps: 1.6
    }
  };
  // dusk: the meadow after the sun goes, the glass carrying the light
  PAL.dusk = JSON.parse(JSON.stringify(PAL.meadow));
  Object.assign(PAL.dusk, {
    sky: [[-0.02, '#c9b6a0'], [0.0, '#d2bea4'], [0.03, '#c7b9a8'], [0.1, '#9fa7a8'], [0.3, '#5f7480'], [0.7, '#34495a'], [1.0, '#26384a']], horizon: '#c9b6a0', fog: [140, 950],
    ridges: [{ h: 0.05, col: '#66717a', a: 0.7, s: 3 }, { h: 0.028, col: '#4c565e', a: 0.7, s: 5 }],
    hemi: ['#6f8494', '#3a1a12', 0.55], sun: ['#ffb27a', 0.35], sunAz: -0.9, sunEl: 0.12,
    ground: { c: '#471410', c2: '#5e2016', c3: '#6e2616', grain: 0.2 }
  });
  PAL.dusk.glass = { lo: '#9a5a22', mid: '#f4aa52', hi: '#ffe2aa', refl: '#8fa3b2', reflK: 0.18, lamp: 1.2, op: 0.72, seeOp: 0.6, gain: 1.15 };
  PAL.dusk.lamps = 2.6;
  PAL.dusk.mats.wall.c = '#7a766f'; PAL.dusk.mats.roof.c = '#a9aba8';

  // ---------------------------------------------------------------- ground to the horizon, from the model's FA terrain
  const TX0 = -125, TZ0 = -44, TS = 3;
  const TG = new Map(); const T = DATA.site.terrain;
  for (let i = 0; i < T.length; i += 3) TG.set(Math.round((T[i] - TX0) / TS) + ',' + Math.round((T[i + 2] - TZ0) / TS), T[i + 1]);
  let NX = 0, NZ = 0; TG.forEach((v, k) => { const [a, b] = k.split(',').map(Number); NX = Math.max(NX, a); NZ = Math.max(NZ, b); });
  let mean = 0; TG.forEach(v => { mean += v; }); mean /= TG.size;
  function tg(i, j) { i = Math.max(0, Math.min(NX, i)); j = Math.max(0, Math.min(NZ, j)); const v = TG.get(i + ',' + j); return v == null ? mean : v; }
  function gradeAt(x, z) {
    const fx = (x - TX0) / TS, fz = (z - TZ0) / TS;
    const cx = Math.max(0, Math.min(NX - 1e-6, fx)), cz = Math.max(0, Math.min(NZ - 1e-6, fz));
    const i = Math.floor(cx), j = Math.floor(cz), u = cx - i, v = cz - j;
    let g = tg(i, j) * (1 - u) * (1 - v) + tg(i + 1, j) * u * (1 - v) + tg(i, j + 1) * (1 - u) * v + tg(i + 1, j + 1) * u * v;
    const out = Math.hypot(Math.max(0, -fx, fx - NX), Math.max(0, -fz, fz - NZ)) * TS;      // feet outside the surveyed patch
    if (out > 0) {
      const k = 1 - Math.exp(-out / 60);
      g = g * (1 - k) + (mean - 1.5) * k + k * (2.2 * Math.sin(x * 0.019 + 1.3) * Math.sin(z * 0.016 + 0.4) + 0.9 * Math.sin((x + z) * 0.041));
    }
    return g - 0.08;
  }
  window.__gradeAt = gradeAt;
  const HB = { x0: -80, x1: 42, z0: -18, z1: 80 };          // the house, plan box, feet
  const houseD = (x, z) => Math.hypot(Math.max(0, HB.x0 - x, x - HB.x1), Math.max(0, HB.z0 - z, z - HB.z1));

  let extra = new THREE.Group(); scene.add(extra);
  function buildGround(P) {
    const pos = [], idx = [];
    const G0 = -700, ST = 4, N = 351;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const x = G0 + i * ST, z = G0 + j * ST; pos.push(x, gradeAt(x, z), z); }
    for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) { const a = j * N + i; idx.push(a, a + N, a + 1, a + 1, a + N, a + N + 1); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
    const mg = proc(Object.assign({ k: 4, side: THREE.FrontSide, rough: 1 }, P.ground));
    const gm = new THREE.Mesh(geo, mg); gm.receiveShadow = true; gm.userData.role = 'ground'; extra.add(gm);
    const ring = new THREE.Mesh(new THREE.RingGeometry(650, 9000, 96, 1), mg); ring.rotation.x = -Math.PI / 2; ring.position.y = mean - 1.6; ring.userData.role = 'ground'; extra.add(ring);
  }
  // the drive, from André's CAD lines, draped on grade (same outline as the site plan's impervious calc)
  function buildDrive(P) {
    const dr = DATA.drive, pl = k => { const o = []; for (let i = 0; i < dr[k].length; i += 3) o.push([dr[k][i], dr[k][i + 2]]); return o; };
    const l1 = pl(2).concat(pl(6).slice(1), pl(7).slice(1)), l2 = pl(1).concat(pl(5).slice(1), pl(4).reverse().slice(1));
    const poly = l1.concat(l2.reverse());
    const apron = [[-63.57, 15.27], [-39.0, 15.27], [-39.0, 39.27], [-63.57, 39.27]];
    const mat = proc(Object.assign({ k: 4, side: THREE.DoubleSide, rough: 0.95, po: [-2, -2] }, P.drive));
    [poly, apron].forEach(pg => {
      const sh = new THREE.Shape(pg.map(([x, z]) => new THREE.Vector2(x, z)));
      const g = new THREE.ShapeGeometry(sh, 1), a = g.attributes.position;
      // subdivide by re-triangulating on a fine grid is overkill; drape the vertices and densify long edges instead
      const pos = [], idx = g.index.array;
      const tri = (A, B, C, d) => {
        const L = Math.max(Math.hypot(A[0] - B[0], A[1] - B[1]), Math.hypot(B[0] - C[0], B[1] - C[1]), Math.hypot(C[0] - A[0], C[1] - A[1]));
        if (L > 6 && d < 7) { const m = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; const ab = m(A, B), bc = m(B, C), ca = m(C, A); tri(A, ab, ca, d + 1); tri(ab, B, bc, d + 1); tri(ca, bc, C, d + 1); tri(ab, bc, ca, d + 1); return; }
        [A, B, C].forEach(p => pos.push(p[0], gradeAt(p[0], p[1]) + 0.18, p[1]));
      };
      for (let i = 0; i < idx.length; i += 3) tri([a.getX(idx[i]), a.getY(idx[i])], [a.getX(idx[i + 1]), a.getY(idx[i + 1])], [a.getX(idx[i + 2]), a.getY(idx[i + 2])], 0);
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, mat); m.receiveShadow = true; m.userData.role = 'drive'; extra.add(m);
    });
  }
  function buildSky(P) {
    const stops = P.sky, n = stops.length;
    const S = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { e: { value: stops.map(s => s[0]).concat(Array(8 - n).fill(9)) }, c: { value: stops.map(s => new THREE.Color(s[1])).concat(Array(8 - n).fill(new THREE.Color(0))) },
        r: { value: (P.ridges || []).map(r => new THREE.Vector4(r.h, r.a, r.s, 0)).concat(Array(3 - (P.ridges || []).length).fill(new THREE.Vector4(0, 0, 0, 0))) },
        rc: { value: (P.ridges || []).map(r => new THREE.Color(r.col)).concat(Array(3 - (P.ridges || []).length).fill(new THREE.Color(0))) } },
      vertexShader: 'varying vec3 d; void main(){ d = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position + cameraPosition, 1.0); gl_Position.z = gl_Position.w * 0.9999; }',
      fragmentShader: ['uniform float e[8]; uniform vec3 c[8]; uniform vec4 r[3]; uniform vec3 rc[3]; varying vec3 d;',
        'float h2(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }',
        'float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h2(i),h2(i+vec2(1,0)),f.x), mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x), f.y); }',
        'void main(){ vec3 v = normalize(d); float el = asin(clamp(v.y, -1.0, 1.0)) / 1.5708; float az = atan(v.z, v.x);',
        '  vec3 col = c[0]; for (int i = 1; i < 8; i++) { if (e[i] > 8.0) break; col = mix(col, c[i], smoothstep(e[i-1], e[i], el)); }',
        '  float mist = n2(vec2(az * 3.0, el * 9.0)) * n2(vec2(az * 7.0 + 3.0, el * 20.0));',
        '  col = mix(col, vec3(1.0), mist * 0.12 * (1.0 - smoothstep(0.0, 0.5, el)));',
        '  for (int k = 0; k < 3; k++) { if (r[k].x <= 0.0) continue; float s = r[k].z;',
        '    float hh = r[k].x * (0.55 + 0.25 * sin(az * 5.0 + s * 2.0) + 0.14 * sin(az * 13.0 + s) + 0.06 * sin(az * 37.0 + s * 3.0) + 0.35 * n2(vec2(az * 6.0 + s * 10.0, 0.5)));',
        '    float m = 1.0 - smoothstep(hh - 0.002, hh + 0.002, el); m *= smoothstep(-0.03, 0.0, el);',
        '    float fade = mix(r[k].y, r[k].y * 0.35, smoothstep(hh * 0.2, hh, el) * 0.0 + (1.0 - smoothstep(0.0, hh, el)) * 0.6);',
        '    col = mix(col, rc[k], m * fade); }',
        '  gl_FragColor = vec4(col, 1.0); }'].join('\n')
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(100, 48, 24), S); sky.frustumCulled = false; sky.renderOrder = -10; sky.userData.role = 'sky'; extra.add(sky);
  }
  // painted firs, after the palette studies
  function pineTex(seed, col, big) {
    const K = big ? 2 : 1, c = document.createElement('canvas'); c.width = 512 * K; c.height = 1024 * K; const g = c.getContext('2d'), w = 512 * K, h = 1024 * K;
    const R = rng(seed); g.scale(K, K);
    const cx = 256 + (R() - 0.5) * 10, top = 1024 * 0.02, bot = 1024 * 0.9, base = 512 * (0.34 + R() * 0.1);
    g.strokeStyle = `rgba(${col[0] - 8},${col[1] - 8},${col[2] - 8},1)`; g.lineWidth = 7; g.beginPath(); g.moveTo(cx, 1024); g.lineTo(cx, top); g.stroke();
    for (let i = 0; i < (big ? 7000 : 1900); i++) {
      const tt = Math.pow(R(), 0.75), y = top + (bot - top) * tt;
      const env = base * tt * (0.75 + R() * 0.4) * (0.92 + 0.08 * Math.sin(tt * 40 + seed));
      const dir = R() < 0.5 ? -1 : 1, len = env * Math.sqrt(R()), sh = R() * 18 - 9;
      g.strokeStyle = `rgba(${col[0] + sh | 0},${col[1] + sh | 0},${col[2] + sh | 0},${(big ? 0.5 : 0.35) + R() * 0.5})`; g.lineWidth = (1 + R() * 2.4) * (big ? 0.8 : 1);
      g.beginPath(); g.moveTo(cx + dir * R() * 6, y); g.quadraticCurveTo(cx + dir * len * 0.6, y - len * 0.05, cx + dir * len, y + len * (0.18 + R() * 0.22)); g.stroke();
    }
    const tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; return tx;
  }
  function grassTex(G) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), w = 256, h = 256, R = rng(9);
    for (let k = 0; k < 70; k++) {
      const x0 = w / 2 + (R() - 0.5) * w * 0.7, hh = h * (0.45 + R() * 0.52), lean = (R() - 0.5) * w * 0.45, col = G.cols[(R() * G.cols.length) | 0];
      for (let s = 0; s < 3; s++) {
        g.strokeStyle = s === 2 ? G.tip : col; g.globalAlpha = s === 2 ? 0.6 : 0.95; g.lineWidth = (3.2 - s) * (0.7 + R() * 0.5);
        g.beginPath(); g.moveTo(x0, h); g.quadraticCurveTo(x0 + lean * 0.2, h - hh * 0.6, x0 + lean, h - hh * (1 - s * 0.02)); g.stroke();
      }
    }
    const tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; return tx;
  }

  // ---------------------------------------------------------------- the job: palette, camera, trees, grass, lights
  let R_ = null, cam = null, JOB = null, pencil = null, bill = [], grass = null, lights = [], frame = null;
  function setup(job) {
    JOB = job; const P = PAL[job.pal];
    if (document.getElementById('app').dataset.mode !== 'model') F.enterModel();
    Object.assign(F.S, { scheme: 'rib', inside: false, roof: false, panels: true, trees: false, room: false });
    F.apply();
    scene.traverse(o => { if (o.isMesh && o.material && o.material.color && o.material.color.getHexString() === '9dbb8f') o.visible = false; });
    scene.remove(extra); extra = new THREE.Group(); scene.add(extra);
    scene.fog = new THREE.Fog(lin(P.horizon), P.fog[0], P.fog[1]);
    scene.background = null;
    // materials
    const made = {};
    meshes.forEach(m => {
      const r = m.userData.role, o = m.userData.orig;
      if (!r) return;
      if (r === 'glass' || r === 'glassSee') { m.material = made[r] = made[r] || glassMat(P.glass, r === 'glassSee'); m.renderOrder = 2; return; }
      if (r === 'railGlass') { m.material = made[r] = made[r] || new THREE.MeshStandardMaterial({ color: lin(P.railGlass), transparent: true, opacity: 0.25, depthWrite: false, side: THREE.DoubleSide, roughness: 0.1 }); return; }
      const spec = P.mats[r]; if (!spec) return;
      const key = r + '|' + o.side;
      m.material = made[key] = made[key] || proc(Object.assign({ side: o.side, po: r === 'roof' ? [-1, -2] : (o.polygonOffset ? [o.polygonOffsetFactor, o.polygonOffsetUnits] : null) }, spec));
      m.castShadow = !['fire', 'linen'].includes(r); m.receiveShadow = true;
    });
    // lights: the model's own hemisphere, sun and lamps stay out; ours follow the camera so every view is lit the same way
    scene.traverse(o => { if (o.isLight && !o.userData.ours) { o.userData.was = o.userData.was == null ? o.intensity : o.userData.was; o.intensity = o.isPointLight ? o.userData.was * P.lamps : 0; } });
    const hemi = new THREE.HemisphereLight(lin(P.hemi[0]), lin(P.hemi[1]), P.hemi[2]); hemi.userData.ours = true; extra.add(hemi);
    const amb = new THREE.AmbientLight(0xffffff, P.ambient); amb.userData.ours = true; extra.add(amb);
    const dx = job.look[0] - job.eye[0], dz = job.look[2] - job.eye[2], yaw = Math.atan2(dx, dz) + P.sunAz * (job.sunFlip || 1) + (job.sunTurn || 0);
    const sd = [Math.sin(yaw) * Math.cos(P.sunEl), Math.sin(P.sunEl), Math.cos(yaw) * Math.cos(P.sunEl)];
    // light comes from behind the viewer's shoulder: the sun sits opposite the view direction, turned by sunAz
    const sun = new THREE.DirectionalLight(lin(P.sun[0]), P.sun[1]); sun.userData.ours = true;
    const ctr = new THREE.Vector3(-18, 10, 30);
    sun.position.set(ctr.x - sd[0] * 400, ctr.y + sd[1] * 400, ctr.z - sd[2] * 400); sun.target.position.copy(ctr);
    sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
    const Sc = sun.shadow.camera; Sc.left = -150; Sc.right = 150; Sc.top = 150; Sc.bottom = -150; Sc.near = 50; Sc.far = 900;
    sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.06;
    extra.add(sun); extra.add(sun.target);
    [[24, 15, -2], [4, 14, -6], [-10, 14, -8], [13, 13, 30], [13, 13, 45], [18, 20, 58], [30, 20, 64], [-14, 13, 58], [-4, 13, 70], [30, 7, 52], [20, 7, 64]].forEach(p => {
      const pl = new THREE.PointLight(lin('#ffb56a'), 0.55 * P.lamps, 30, 1.7); pl.position.set(...p); pl.userData.ours = true; extra.add(pl); });
    if (job.pitLight) { const pl = new THREE.PointLight(0xff9a48, job.pitLight, 40, 1.8); pl.position.set(27, 11, 24); pl.userData.ours = true; extra.add(pl); }
    (job.glow || []).forEach(g => { const pl = new THREE.PointLight(lin('#ffb866'), g[3], g[4] || 40, 1.6); pl.position.set(g[0], g[1], g[2]); pl.userData.ours = true; extra.add(pl); });
    buildGround(P); buildSky(P); buildDrive(P);
    meshes.forEach(m => { if (['carBody', 'carGlass', 'wheel'].includes(m.userData.role)) m.visible = !!job.car; });
    scene.traverse(o => { if ((o.isLine || o.isLineSegments) && o.geometry && o.userData.role !== 'pencil' && !lineKind.has(o)) { const g = o.geometry; if (!g.boundingBox) g.computeBoundingBox(); if (g.boundingBox.max.x < -85) o.visible = !!job.car; } });
    lineKind.forEach((k, c) => { if (k === 'tree') c.visible = false; });
    // camera
    const W = job.W, H = job.H, A = W / H;
    cam = new THREE.PerspectiveCamera(30, A, 1.0, 9000);
    cam.position.set(...job.eye);
    const hw = Math.tan(job.hfov * Math.PI / 360), hh = hw / A;
    if (job.level) {
      const tgt = new THREE.Vector3(job.look[0], job.eye[1], job.look[2]); cam.up.set(0, 1, 0); cam.lookAt(tgt);
      const hd = Math.hypot(job.look[0] - job.eye[0], job.look[2] - job.eye[2]), Tn = (job.look[1] - job.eye[1]) / hd;
      const cy = Tn + hh * (2 * job.ty - 1);
      frame = { l: -hw, r: hw, t: cy + hh, b: cy - hh };
    } else {
      cam.up.set(0, 1, 0); cam.lookAt(new THREE.Vector3(...job.look));
      frame = { l: -hw, r: hw, t: hh, b: -hh };
    }
    cam.updateMatrixWorld();
    cam.layers.set(0);
    // trees: painted firs, the site's own trees plus a forest around; any tree that would stand in front of the house is pencil only
    const Pt = [21, 33, 47, 59, 71].map(s => pineTex(s, P.tree.col)), PtSig = pineTex(88, P.tree.sig || P.tree.col, true);
    const cand = DATA.site.trees.map(([x, y, z, r, h], i) => ({ x, y: gradeAt(x, z), z, h: i === 0 ? 74 : h * 1.35, w: i === 0 ? 30 : r * 2.3, sig: i === 0 }));
    const R = rng(job.seed || 7);
    for (let n = 0, g = 0; n < (job.forest || 260) && g < 30000; g++) {
      const x = -650 + R() * 1250, z = -560 + R() * 1250;
      if (houseD(x, z) < 38) continue;
      const hgt = 48 + R() * 46; cand.push({ x, y: gradeAt(x, z), z, h: hgt, w: hgt * (0.36 + R() * 0.12), sig: false }); n++;
    }
    const C2 = cam2(), proj = p => new THREE.Vector3(...p).project(C2);
    const hp = []; [[HB.x0, 8, HB.z0], [HB.x1, 8, HB.z0], [HB.x0, 8, HB.z1], [HB.x1, 8, HB.z1], [HB.x0, 33, HB.z0], [HB.x1, 33, HB.z0], [HB.x0, 33, HB.z1], [HB.x1, 33, HB.z1]].forEach(p => hp.push(proj(p)));
    const hx0 = Math.min(...hp.map(v => v.x)), hx1 = Math.max(...hp.map(v => v.x));
    const camPos = cam.position;
    const houseDist = Math.hypot(-18 - camPos.x, 30 - camPos.z);
    const pv = [];
    let ti = 0;
    cand.forEach(tr => {
      const d = Math.hypot(tr.x - camPos.x, tr.z - camPos.z);
      if (d < 14) return;
      const v = proj([tr.x, tr.y + tr.h * 0.4, tr.z]);
      const inFront = d < houseDist && v.x > hx0 - 0.05 && v.x < hx1 + 0.05 && houseD(tr.x, tr.z) < 90 && !(tr.sig && !job.sigPencil);
      if (houseD(tr.x, tr.z) < (job.pencilR || 230)) pencilTree(pv, tr);
      if (inFront && !(job.keepTrees || []).includes(Math.round(tr.x))) return;
      const m = new THREE.MeshBasicMaterial({ map: tr.sig ? PtSig : Pt[ti++ % Pt.length], transparent: true, alphaTest: 0.28, depthWrite: true, side: THREE.DoubleSide, fog: true });
      m.opacity = tr.sig ? 0.96 : Math.min(0.96, Math.max(P.tree.opFar, 1.25 - d / 520));
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(tr.w * 1.3, tr.h), m);
      pl.position.set(tr.x, tr.y + tr.h / 2 - 0.6, tr.z); pl.rotation.y = Math.atan2(camPos.x - tr.x, camPos.z - tr.z);
      pl.userData.role = 'bill'; pl.userData.sig = !!tr.sig; pl.renderOrder = 1; extra.add(pl);
    });
    { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pv, 3)); pencil = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x5c5953, transparent: true, opacity: 0.42 })); pencil.layers.set(1); pencil.userData.role = 'pencil'; extra.add(pencil); }
    // meadow grass: crossed cards scattered in the view
    if (P.grass) {
      const G = P.grass, gt = grassTex(G);
      const pos = [], uv = [];
      [[1, 0], [0, 1]].forEach(([cx, cz]) => { const q = [[-0.5, 0], [0.5, 0], [0.5, 1], [-0.5, 1]].map(([a, y]) => [a * cx, y, a * cz]); [[0, 1, 2], [0, 2, 3]].forEach(tri => tri.forEach(i => { pos.push(...q[i]); uv.push(i === 1 || i === 2 ? 1 : 0, i >= 2 ? 1 : 0); })); });
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.computeVertexNormals();
      const mat = new THREE.MeshBasicMaterial({ map: gt, alphaTest: 0.45, side: THREE.DoubleSide, fog: true });
      const im = new THREE.InstancedMesh(geo, mat, G.n), mtx = new THREE.Matrix4(), qq = new THREE.Quaternion(), col = new THREE.Color(), Rg = rng(77);
      const fwd = new THREE.Vector3(); cam.getWorldDirection(fwd); fwd.y = 0; fwd.normalize(); const rgt = new THREE.Vector3(-fwd.z, 0, fwd.x);
      let n = 0;
      for (let k = 0; k < G.n * 4 && n < G.n; k++) {
        const dd = 3 + Math.pow(Rg(), 1.35) * G.reach, ang = (Rg() - 0.5) * 2 * Math.atan(hw) * 1.15;
        const x = camPos.x + (fwd.x * Math.cos(ang) + rgt.x * Math.sin(ang)) * dd, z = camPos.z + (fwd.z * Math.cos(ang) + rgt.z * Math.sin(ang)) * dd;
        if (houseD(x, z) < 1.5) continue;
        if ((job.noGrass || []).some(b => x > b[0] && x < b[1] && z > b[2] && z < b[3])) continue;
        const clump = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(x * 0.23 + 1.3) * Math.sin(z * 0.19 + 0.4));
        const s = (G.size[0] + Rg() * (G.size[1] - G.size[0])) * clump;
        qq.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Rg() * 6.283);
        mtx.compose(new THREE.Vector3(x, gradeAt(x, z) - 0.05, z), qq, new THREE.Vector3(s * 1.1, s, s * 1.1));
        im.setMatrixAt(n, mtx); const sh = 0.62 + Rg() * 0.46; col.setRGB(sh * (0.95 + Rg() * 0.1), sh, sh); im.setColorAt(n, col); n++;
      }
      im.count = n; im.userData.role = 'grass'; extra.add(im); grass = im;
    }
    return { frame, trees: cand.length };
  }
  function cam2() { const c = cam.clone(); c.projectionMatrix.makePerspective(frame.l, frame.r, frame.t, frame.b, 1, 9000); c.projectionMatrixInverse.copy(c.projectionMatrix).invert(); return c; }
  // a pencil fir, like the model's own sketch trees
  function pencilTree(out, tr) {
    const R = rng(Math.abs((tr.x * 131 + tr.z * 71) | 0) + 11), x = tr.x, y = tr.y, z = tr.z, h = tr.h, r = tr.w / 2;
    out.push(x, y, z, x + 0.1, y + h, z);
    const tiers = 24;
    for (let i = 0; i < tiers; i++) {
      const t = 0.14 + 0.84 * (i + R() * 0.7) / tiers, yy = y + h * t, w = r * Math.pow(1 - t, 0.85) * (0.7 + R() * 0.5);
      const nb = 2 + (R() < 0.6 ? 1 : 0) + (R() < 0.3 ? 1 : 0);
      for (let k = 0; k < nb; k++) {
        const a = R() * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a), len = w * (0.55 + R() * 0.55), dr = 0.12 + R() * 0.28;
        const ex = x + ca * len, ey = yy - len * dr, ez = z + sa * len;
        out.push(x, yy, z, ex, ey, ez);
        if (R() < 0.75) { const m = 0.45 + R() * 0.35, mx = x + ca * len * m, my = yy - len * dr * m, mz = z + sa * len * m, s2 = R() < 0.5 ? 1 : -1;
          out.push(mx, my, mz, mx + ca * len * 0.16 - s2 * sa * len * 0.14, my - len * 0.16, mz + sa * len * 0.16 + s2 * ca * len * 0.14); }
      }
    }
  }

  // ---------------------------------------------------------------- rendering, in tiles
  const TILE = 2048;
  let rt = null, rd = null;
  function renderer() {
    if (rd) return rd;
    const cv = document.createElement('canvas'); cv.width = 16; cv.height = 16;
    rd = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: true, preserveDrawingBuffer: true });
    rd.setPixelRatio(1); rd.shadowMap.enabled = true; rd.shadowMap.type = THREE.PCFSoftShadowMap; rd.toneMapping = THREE.NoToneMapping;
    rt = new THREE.WebGLRenderTarget(TILE, TILE, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, depthBuffer: true });
    return rd;
  }
  const hiddenInLine = new Set(['bill', 'grass', 'sky']);
  const WHITE = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, fog: false });
  function setPass(pass) {
    const line = pass === 'line', mask = pass === 'mask';
    scene.traverse(o => {
      if (!o.isMesh) return;
      if (o.userData.cm === undefined) o.userData.cm = null;
      if (mask && !o.userData.cm) { o.userData.cm = o.material; const r = o.userData.role; if (r && !['ground', 'drive', 'sky', 'bill', 'grass'].includes(r)) o.material = WHITE; }
      else if (!mask && o.userData.cm) { o.material = o.userData.cm; o.userData.cm = null; }
    });
    extra.children.forEach(o => { const r = o.userData.role; if (['ground', 'drive', 'sky', 'grass'].includes(r)) o.visible = !mask && !(line && hiddenInLine.has(r)); if (r === 'bill') o.visible = mask ? !!o.userData.sig : !line; });
    if (mask) { cam.layers.set(0); rt.texture.encoding = THREE.LinearEncoding; scene.fog.near = 1e5; scene.fog.far = 1e6; return; }
    scene.fog.near = PAL[JOB.pal].fog[0]; scene.fog.far = PAL[JOB.pal].fog[1];
    scene.traverse(o => {
      if (o.isMesh && o.material) {
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach(m => { m.colorWrite = !line; });
      }
    });
    lineKind.forEach((k, c) => { if (k === 'contour' || k === 'lot' || k === 'setback') c.visible = line && !!JOB.siteLines; });
    cam.layers.set(0); if (line) cam.layers.enable(1);
    rt.texture.encoding = line ? THREE.LinearEncoding : THREE.sRGBEncoding;
  }
  // one tile: returns a PNG data url of tile (tx, ty) of a W x H frame (pixels, ss applied by the caller)
  function tile(pass, W, H, tx, ty) {
    const r = renderer();
    setPass(pass);
    const tw = Math.min(TILE, W - tx), th = Math.min(TILE, H - ty);
    const fl = frame.l + (frame.r - frame.l) * tx / W, fr = frame.l + (frame.r - frame.l) * (tx + tw) / W;
    const ft = frame.t - (frame.t - frame.b) * ty / H, fb = frame.t - (frame.t - frame.b) * (ty + th) / H;
    cam.projectionMatrix.makePerspective(fl, fr, ft, fb, 1, 9000); cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    rt.setSize(tw, th);
    r.setRenderTarget(rt);
    if (pass === 'line') r.setClearColor(0xffffff, 1); else if (pass === 'mask') r.setClearColor(0x000000, 1); else r.setClearColor(lin(PAL[JOB.pal].horizon), 1);
    r.clear(); r.render(scene, cam);
    const buf = new Uint8Array(tw * th * 4); r.readRenderTargetPixels(rt, 0, 0, tw, th, buf);
    r.setRenderTarget(null);
    const c = document.createElement('canvas'); c.width = tw; c.height = th; const g = c.getContext('2d'), img = g.createImageData(tw, th);
    for (let y = 0; y < th; y++) img.data.set(buf.subarray((th - 1 - y) * tw * 4, (th - y) * tw * 4), y * tw * 4);
    g.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  }
  // project named model points to frame fractions (0..1 from the top left)
  function project(pts) {
    const c = cam2(), out = {};
    Object.entries(pts).forEach(([k, p]) => { const v = new THREE.Vector3(...p).project(c); out[k] = [+(v.x * 0.5 + 0.5).toFixed(5), +(0.5 - v.y * 0.5).toFixed(5), +v.z.toFixed(5)]; });
    return out;
  }
  window.__rk = { setup, tile, project, gradeAt, A: DATA.A, xt: DATA.xt.anchors, trees: DATA.site.trees, info: DATA.info, ready: true };
})();
