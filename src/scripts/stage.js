/* ──────────────────────────────────────────────────────────────
   Eris Lab — cinematic stage
   One full-screen fragment shader renders every "film" procedurally:
     0  hero     dwarf planet Eris inside dotted orbit rings, deep space
     1  close    Eris up close with its moon Dysnomia, turning with scroll
     2  nebula   halftone nebula drifting through a star field
     3  chart    a cream celestial chart — a personal-context constellation
                 drawing itself around "you"
     4  rise     planetrise over Eris's horizon
   Scenes change through a pixelated Bayer-dither dissolve.
   ────────────────────────────────────────────────────────────── */

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime, uFrom, uTo, uT, uPA, uPB, uIntro, uPx;
uniform vec2  uMouse;

#define PI 3.14159265
const vec3 SUN = vec3(-0.62, 0.38, 0.69);

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a*noise(p); p = m*p; a *= 0.5; }
  return v;
}
float tri(vec3 p){ return (noise(p.xy) + noise(p.yz + 3.1) + noise(p.zx + 7.3))/3.0; }
float fbm3(vec3 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a*tri(p); p = p*2.03 + 1.7; a *= 0.5; }
  return v;
}
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float bayer2(vec2 a){ a = floor(a); return fract(dot(a, vec2(0.5, a.y*0.75))); }
float bayer4(vec2 a){ return bayer2(0.5*a)*0.25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(0.5*a)*0.25 + bayer2(a); }
float bayer16(vec2 a){ return bayer8(0.5*a)*0.25 + bayer2(a); }
float portrait(){ return step(uRes.x, uRes.y); }
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p-a, ba = b-a; float h = clamp(dot(pa,ba)/dot(ba,ba), 0.0, 1.0); return length(pa - ba*h); }

/* ── space ─────────────────────────────────────────────────── */
float starLayer(vec2 frag, float cell, float density, float seed){
  vec2 g = frag/cell;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float h = hash(id + seed);
  vec2 o = (vec2(hash(id + seed + 1.3), hash(id + seed + 2.7)) - 0.5)*0.7;
  float d = length(f - o)*cell;
  float size = (0.6 + 1.4*hash(id + seed + 4.1))*uPx;
  float tw = 0.6 + 0.4*sin(uTime*(1.0 + 2.0*h) + h*40.0);
  return step(1.0 - density, h) * smoothstep(size, 0.0, d) * tw;
}
vec3 spaceBg(vec2 frag, float warm, float pr){
  vec2 uv = frag/uRes;
  vec3 top = mix(vec3(0.015,0.04,0.12), vec3(0.05,0.025,0.10), warm);
  vec3 bot = mix(vec3(0.04,0.16,0.42), vec3(0.30,0.12,0.24), warm);
  vec3 c = mix(bot, top, smoothstep(-0.25, 1.05, uv.y));
  float n  = fbm(uv*vec2(2.2, 3.4) + vec2(uTime*0.004 + pr*0.15, 0.0));
  float n2 = fbm(uv*vec2(24.0, 3.0) - vec2(0.0, uTime*0.003));
  c *= 0.84 + 0.22*n + 0.06*n2;                                   /* painterly mottling */
  float neb = smoothstep(0.5, 0.9, fbm(uv*vec2(1.6, 2.4) + vec2(4.0 - pr*0.2, 1.0)));
  c += mix(vec3(0.20,0.30,0.65), vec3(0.75,0.35,0.40), warm)*neb*0.32;
  float s = starLayer(frag, 26.0*uPx, 0.14, 0.0) + starLayer(frag, 61.0*uPx, 0.35, 9.0)*1.3;
  c += vec3(0.95,0.93,0.88)*s;
  return c;
}

/* dotted orbit rings, like particle streams */
vec3 rings(vec3 c, vec2 frag, vec2 center, float warm, float pr, float scale){
  vec2 p = (frag - center)/uRes.y/scale;
  p = rot(-0.3)*p;
  p.y /= 0.38;
  float r = length(p);
  float a = atan(p.y, p.x);
  float acc = 0.0;
  for (int i = 0; i < 6; i++){
    float fi = float(i);
    float R = 0.36 + fi*0.27 + pr*0.05*fi;
    float d = r - R;
    float band = smoothstep(0.014 + 0.007*fi, 0.0, abs(d));
    vec2 cell = floor(vec2((a + uTime*0.02*(1.0 + fi*0.35) + pr*0.6)*(120.0 + fi*60.0), d*700.0));
    float h = hash(cell + fi*17.0);
    acc += band * step(0.5, h) * (0.55 + 0.45*h);
  }
  vec3 dotC = mix(vec3(0.86,0.89,0.95), vec3(1.0,0.86,0.66), warm);
  return mix(c, dotC, clamp(acc, 0.0, 1.0)*0.7);
}

/* ── planets (analytic spheres) ────────────────────────────── */
vec3 planetSurface(vec3 n, float yaw, float warm, float kind){
  vec3 q = n;
  q.xz = rot(yaw)*q.xz;
  q.xy = rot(0.35)*q.xy;
  float t1 = fbm3(q*2.2 + kind*5.0);
  float t2 = fbm3(q*7.0 + 3.0);
  float fine = fbm3(q*26.0 + 1.0);
  float ridge = 1.0 - abs(2.0*tri(q*12.0 + 2.0) - 1.0);
  /* icy dwarf planet: bright frost with darker methane-stained basins */
  vec3 ice = mix(vec3(0.70,0.72,0.78), vec3(0.97,0.95,0.92), smoothstep(0.32, 0.7, t1 + 0.1*(fine - 0.5)));
  vec3 stain = mix(vec3(0.42,0.37,0.34), vec3(0.60,0.48,0.40), t2);
  float m = smoothstep(0.40, 0.47, t1 + 0.16*(t2 - 0.5) + 0.06*(fine - 0.5));
  vec3 col = mix(stain, ice, m);
  col *= 0.82 + 0.28*fine;                         /* fine regolith grain */
  col *= 1.0 - 0.12*smoothstep(0.75, 0.95, ridge); /* frost ridges */
  col = mix(col, col*vec3(1.05,0.92,0.88), warm*0.6);
  return col;
}
/* renders a sphere of radius R (in screen-height units) at center (pixels) */
vec4 planet(vec2 frag, vec2 center, float R, float yaw, float warm, float kind, vec3 glowCol){
  vec2 p = (frag - center)/uRes.y/R;
  float d2 = dot(p, p);
  if (d2 > 1.0){
    float g = exp(-(sqrt(d2) - 1.0)*14.0);
    return vec4(glowCol*g*0.55, 0.0);
  }
  float z = sqrt(1.0 - d2);
  vec3 n = vec3(p, z);
  vec3 col = planetSurface(n, yaw, warm, kind);
  float l = dot(n, SUN);
  float dif = smoothstep(-0.12, 0.55, l);
  vec3 lit = col*(0.035 + 1.05*dif);
  float fre = pow(1.0 - z, 3.0);
  lit += glowCol*fre*(0.25 + 0.9*smoothstep(-0.3, 0.4, l));
  lit += vec3(1.0,0.97,0.9)*pow(max(dot(reflect(vec3(0.0,0.0,-1.0), n), SUN), 0.0), 30.0)*0.12;
  float edge = smoothstep(1.0, 0.985, sqrt(d2));
  return vec4(lit, edge);
}

/* ── scenes ────────────────────────────────────────────────── */
vec3 sceneHero(vec2 frag, float pr){
  vec3 c = spaceBg(frag, 0.0, pr);
  vec2 ac = uRes*mix(vec2(0.70, 0.58 + 0.06*pr), vec2(0.58, 0.70), portrait());
  ac.y += sin(uTime*0.5)*uRes.y*0.006;
  ac += uMouse*uRes.y*0.012;
  c = rings(c, frag, ac, 0.0, pr, 1.0);
  float R = mix(0.19, 0.24, pr)*mix(1.0, 0.8, portrait());
  vec3 glow = vec3(0.45,0.62,1.0);
  vec4 pl = planet(frag, ac, R, uTime*0.04 + pr*1.2, 0.0, 0.0, glow);
  return mix(c + pl.rgb, pl.rgb, pl.a);
}
vec3 sceneClose(vec2 frag, float pr){
  vec3 c = spaceBg(frag*0.9, 0.0, pr*0.6);
  vec2 ac = uRes*mix(vec2(mix(0.70, 0.60, smoothstep(0.55, 1.0, pr)), 0.48), vec2(0.5, 0.66), portrait());
  ac += uMouse*uRes.y*0.015;
  float R = mix(0.40, 0.56, pr)*mix(1.0, 0.75, portrait());
  /* Dysnomia, the moon, on a tilted orbit */
  float a = pr*PI*2.4 + uTime*0.05 + 1.2;
  vec2 mo = ac + vec2(cos(a)*R*1.75, sin(a)*R*0.42 - cos(a)*R*0.25)*uRes.y;
  bool behind = sin(a) > 0.0;
  vec3 glow = vec3(0.45,0.62,1.0);
  vec4 mn = planet(frag, mo, R*0.13, uTime*0.1, 0.0, 2.0, glow*0.6);
  vec4 pl = planet(frag, ac, R, pr*PI*0.9 + uTime*0.02, 0.0, 0.0, glow);
  if (behind) { c = mix(c + mn.rgb*0.6, mn.rgb*0.85, mn.a); c = mix(c + pl.rgb, pl.rgb, pl.a); }
  else        { c = mix(c + pl.rgb, pl.rgb, pl.a); c = mix(c + mn.rgb*0.6, mn.rgb, mn.a); }
  return c;
}
vec3 sceneNebula(vec2 frag, float pr){
  vec2 uv = frag/uRes;
  vec3 bg = mix(vec3(0.01,0.06,0.20), vec3(0.03,0.22,0.55), uv.y*0.9);
  bg *= 0.92 + 0.1*fbm(uv*vec2(3.0, 80.0) + vec2(uTime*0.01, 0.0));     /* brush streaks */
  bg += vec3(0.9,0.92,1.0)*(starLayer(frag, 30.0*uPx, 0.12, 3.0) + starLayer(frag, 70.0*uPx, 0.3, 5.0));
  float cell = max(5.0, uRes.y/150.0);
  vec2 id = floor(frag/cell);
  vec2 cc = (id + 0.5)*cell;
  vec2 f = frag - cc;
  vec2 cu = cc/uRes.y;
  float den = fbm(cu*1.9 + vec2(uTime*0.012 + pr*1.6, -pr*0.9));
  float hue = fbm(cu*0.9 + 7.0);
  den = smoothstep(0.52, 0.84, den);
  float rr = cell*0.55*sqrt(den)*(0.75 + 0.5*hash(id));
  float dt = smoothstep(rr, rr - 1.1*uPx, length(f));
  vec3 cream = mix(vec3(0.84,0.80,0.66), vec3(0.99,0.96,0.88), hash(id + 3.1));
  vec3 rose  = vec3(0.95,0.66,0.62);
  vec3 cloudC = mix(cream, rose, smoothstep(0.55, 0.75, hue)*0.7);
  return mix(bg, cloudC, dt*step(0.015, den));
}

/* the celestial chart: a personal-context graph around "you" */
vec2 nodeAt(vec2 id){ return (id + 0.5 + (vec2(hash(id + 11.0), hash(id + 23.0)) - 0.5)*0.7); }
vec3 sceneChart(vec2 frag, float pr){
  vec3 paper = vec3(0.93, 0.91, 0.86);
  vec3 ink = vec3(0.10, 0.09, 0.08);
  vec3 gold = vec3(0.72, 0.52, 0.18);
  vec2 uv = frag/uRes;
  vec3 c = paper*(0.95 + 0.07*fbm(uv*vec2(3.0, 4.0)) + 0.03*noise(frag*0.7/uPx));
  vec2 ctr = uRes*mix(vec2(0.66, 0.5), vec2(0.5, 0.62), portrait()) + uMouse*uRes.y*0.01;
  vec2 p = (frag - ctr)/uRes.y;
  p = rot(pr*0.5 + uTime*0.01)*p;
  float r = length(p);
  float a = atan(p.y, p.x);
  float px = uPx/uRes.y;              /* one css pixel in chart units */
  float CHART = 0.44;
  float inside = step(r, CHART);
  /* concentric declination circles + radial hour lines */
  float ringD = abs(fract(r/0.088 + 0.5) - 0.5)*0.088;
  float rings = smoothstep(px*1.2, 0.0, ringD)*inside;
  float rad = abs(fract(a/(PI/12.0) + 0.5) - 0.5)*(PI/12.0)*r;
  float radial = smoothstep(px*1.0, 0.0, rad)*inside*step(0.088, r);
  float outer = smoothstep(px*2.2, 0.0, abs(r - CHART)) + smoothstep(px*1.2, 0.0, abs(r - CHART - 0.012));
  /* tick marks on the outer ring */
  float ticks = smoothstep(px*1.2, 0.0, abs(fract(a/(PI/72.0) + 0.5) - 0.5)*(PI/72.0)*r) * step(CHART, r) * step(r, CHART + 0.012);
  c = mix(c, ink, (rings*0.13 + radial*0.09 + outer*0.6 + ticks*0.5));
  /* the graph */
  float S = 0.075;
  vec2 g = p/S;
  vec2 gid = floor(g);
  float lineA = 0.0, dotA = 0.0, goldDot = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 id = gid + vec2(float(i), float(j));
    vec2 P = nodeAt(id);
    float dP = length(g - P)*S;
    float hP = hash(id + 41.0);
    float distC = length(P*S);
    float on = step(distC, CHART - 0.02);
    /* reveal outward from the centre as you scroll */
    float reveal = smoothstep(distC*1.6 - 0.05, distC*1.6 + 0.05, pr*1.2);
    float sz = (0.0025 + 0.004*hP)*(0.6 + 0.4*on);
    dotA = max(dotA, smoothstep(sz + px, sz, dP)*(0.14 + 0.86*on));
    goldDot = max(goldDot, smoothstep(sz*1.5 + px, sz*1.5, dP)*on*reveal*step(0.55, hP));
    vec2 nb[2]; nb[0] = id + vec2(1.0, 0.0); nb[1] = id + vec2(0.0, 1.0);
    for (int k = 0; k < 2; k++){
      vec2 Q = nodeAt(nb[k]);
      float hl = hash(id*1.7 + nb[k]*3.1);
      float dq = length(Q*S);
      float ok = on*step(dq, CHART - 0.02)*step(0.42, hl);
      float rv = smoothstep(max(distC, dq)*1.6 - 0.04, max(distC, dq)*1.6 + 0.04, pr*1.2);
      float dl = sdSeg(g, P, Q)*S;
      lineA = max(lineA, smoothstep(px*1.6, 0.0, dl)*ok*rv);
    }
  }
  c = mix(c, gold, lineA*0.85);
  c = mix(c, ink, dotA*0.85);
  c = mix(c, gold, goldDot);
  /* you are here */
  float pulse = fract(uTime*0.35);
  float you = smoothstep(0.011 + px, 0.011, r);
  float halo = smoothstep(px*1.5, 0.0, abs(r - 0.02 - pulse*0.06))*(1.0 - pulse);
  c = mix(c, gold*0.9, you);
  c = mix(c, gold, halo*0.8);
  return c;
}

vec3 sceneRise(vec2 frag, float pr){
  vec3 c = spaceBg(frag, 0.55, pr);
  vec2 ac = uRes*vec2(0.5, 0.0) + vec2(0.0, -uRes.y*mix(1.18, 1.02, pr));
  ac += uMouse*uRes.y*0.01;
  vec3 glow = vec3(1.0, 0.70, 0.55);
  vec4 pl = planet(frag, ac, 1.35, uTime*0.01 + pr*0.3, 0.6, 1.0, glow);
  c += pl.rgb*(1.0 - pl.a)*1.6;
  c = mix(c, pl.rgb, pl.a);
  /* a distant sun cresting the limb */
  vec2 sp = (frag - (ac + vec2(-0.35, 1.35*0.95)*uRes.y))/uRes.y;
  c += vec3(1.0,0.85,0.65)*0.012/(dot(sp, sp)*40.0 + 0.012)*0.35;
  return c;
}

vec3 scene(float id, vec2 frag, float pr){
  if (id < 0.5) return sceneHero(frag, pr);
  if (id < 1.5) return sceneClose(frag, pr);
  if (id < 2.5) return sceneNebula(frag, pr);
  if (id < 3.5) return sceneChart(frag, pr);
  return sceneRise(frag, pr);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  float tt = clamp(uT, 0.0, 1.0);
  float bump = sin(PI*tt);
  float intro = 1.0 - clamp(uIntro, 0.0, 1.0);
  float block = 1.0 + floor((bump*bump*14.0 + intro*intro*44.0)*uPx);
  vec2 bc = floor(frag/block);
  vec2 q = (bc + 0.5)*block;
  float th = bayer16(bc)*0.72 + hash(bc)*0.28;
  vec3 col = (tt > th) ? scene(uTo, q, uPB) : scene(uFrom, q, uPA);
  float k = max(bump, intro);
  if (k > 0.01){
    float lv = mix(40.0, 5.0, k);
    col = floor(col*lv + th)/lv;                  /* dithered posterise */
  }
  col *= step(th, uIntro*1.2);                     /* dithered reveal */
  vec2 uv = frag/uRes;
  col *= 1.0 - 0.3*pow(length(uv - 0.5)*1.25, 2.6);
  col += (hash(frag + fract(uTime*7.0)*100.0) - 0.5)*0.04;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

export function createStage(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
  if (!gl) throw new Error('no webgl');
  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  ['uRes', 'uTime', 'uFrom', 'uTo', 'uT', 'uPA', 'uPB', 'uIntro', 'uPx', 'uMouse'].forEach(n => (U[n] = gl.getUniformLocation(prog, n)));

  const mobile = matchMedia('(max-width: 760px)').matches;
  const maxQ = mobile ? 0.65 : 0.95;
  let quality = mobile ? 0.6 : 0.85;   // fraction of device pixels rendered
  let px = 1;
  const state = { from: 0, to: 0, t: 0, pa: 0, pb: 0, intro: 0, mx: 0, my: 0 };
  const smooth = { mx: 0, my: 0 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    px = dpr * quality;
    const w = Math.max(1, Math.round(window.innerWidth * px));
    const h = Math.max(1, Math.round(window.innerHeight * px));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  // adaptive quality — keep frames under ~20ms
  let acc = 0, frames = 0, last = performance.now();
  function adapt(now) {
    const dt = now - last; last = now;
    if (dt > 200) return; // tab was hidden
    acc += dt; frames++;
    if (frames >= 40) {
      const avg = acc / frames; acc = 0; frames = 0;
      if (avg > 21 && quality > 0.34) { quality = Math.max(0.34, quality * 0.82); resize(); }
      else if (avg < 13 && quality < maxQ) { quality = Math.min(maxQ, quality * 1.08); resize(); }
    }
  }

  return {
    state,
    visible: true,
    render(time, frozen) {
      adapt(performance.now());
      smooth.mx += (state.mx - smooth.mx) * 0.05;
      smooth.my += (state.my - smooth.my) * 0.05;
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uTime, frozen ? 12.0 : time / 1000);
      gl.uniform1f(U.uFrom, state.from);
      gl.uniform1f(U.uTo, state.to);
      gl.uniform1f(U.uT, state.t);
      gl.uniform1f(U.uPA, state.pa);
      gl.uniform1f(U.uPB, state.pb);
      gl.uniform1f(U.uIntro, state.intro);
      gl.uniform1f(U.uPx, px);
      gl.uniform2f(U.uMouse, smooth.mx, smooth.my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}
