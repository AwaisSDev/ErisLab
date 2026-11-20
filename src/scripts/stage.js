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
/* hero + close-up are lit from the right, so the copy on the left sits over the night side */
const vec3 SUN_R = vec3(0.80, 0.30, 0.52);

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

/* dotted orbit rings, like particle streams (drawn behind the planet).
   Returns (coverage, near-half flag). */
vec2 rings(vec2 frag, vec2 center, float pr, float scale){
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
    float spin = a + uTime*0.02*(1.0 + fi*0.35) + pr*0.6;
    /* coarse particles */
    float band = smoothstep(0.014 + 0.007*fi, 0.0, abs(d));
    vec2 cell = floor(vec2(spin*(120.0 + fi*60.0), d*700.0));
    float h = hash(cell + fi*17.0);
    acc += band*step(0.5, h)*(0.55 + 0.45*h);
    /* fine dust grains in a wider, fainter sheath */
    float sheath = smoothstep(0.03 + 0.01*fi, 0.0, abs(d));
    vec2 cell2 = floor(vec2(spin*(340.0 + fi*140.0), d*1900.0));
    float h2 = hash(cell2 + fi*31.0 + 5.0);
    acc += sheath*step(0.78, h2)*0.45*h2;
    /* a faint continuous haze, brightest at the ringlet's core */
    acc += smoothstep(0.022 + 0.008*fi, 0.0, abs(d))*0.07;
    /* thin ringlet gaps */
    acc *= 1.0 - 0.6*smoothstep(0.0018, 0.0, abs(d - 0.006 - 0.002*fi));
  }
  return vec2(clamp(acc, 0.0, 1.0)*0.75, step(p.y, 0.0));
}

/* ── the moon: an airless, cratered body ───────────────────────
   Craters are analytic (bowl + raised rim + ejecta) on a 3D cell
   lattice, so their slopes, bright young-crater rays and the
   shadows cast by sunward rims are all exact per pixel. Shading
   uses the lunar-Lambert BRDF (no limb darkening at low phase,
   razor terminator), plus faint light reflected from the planet. */
vec3 hash33(vec3 p){
  p = fract(p*vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx)*p.zyx);
}
void craterLayer(vec3 n, vec3 sunT, float tanE, float scale, float dens, float seed, float soft,
                 inout vec3 grad, inout float alb, inout float shade){
  vec3 p = n*scale;
  vec3 ip = floor(p);
  for (int k = 0; k < 27; k++){
    vec3 o = vec3(mod(float(k), 3.0), mod(floor(float(k)/3.0), 3.0), floor(float(k)/9.0)) - 1.0;
    vec3 cid = ip + o;
    vec3 h = hash33(cid + seed);
    if (h.x > dens) continue;
    vec3 c = cid + 0.2 + 0.6*hash33(cid + seed + 7.1);
    float r = 0.16 + 0.34*h.y*h.y;                 /* many small, few large */
    vec3 dv = p - c;
    float d = length(dv);
    float x = d/r;
    if (x > 2.6) continue;
    vec3 dir = dv/max(d, 1e-4);
    float fresh = h.z;                             /* 0 = old & eroded, 1 = young & crisp */
    float D = mix(0.07, 0.24, fresh)*soft;         /* depth / radius */
    float rimA = mix(0.015, 0.06, fresh)*soft;
    float floorH = -0.86*D;
    float bowl = D*(x*x - 1.0);
    float bowlD = bowl > floorH ? 2.0*D*x : 0.0;   /* flat floor in big craters */
    float g = exp(-(x - 1.0)*(x - 1.0)/0.045);
    float rimD = rimA*g*(-2.0*(x - 1.0)/0.045);
    float ejD = x > 1.0 ? -0.35*rimA*exp(-(x - 1.0)*1.8) : 0.0;
    float slope = step(x, 1.0)*bowlD + rimD + ejD;
    grad += slope*dir;
    /* albedo: darker eroded floors, bright ejecta + rays around young craters */
    alb -= 0.10*(1.0 - fresh)*smoothstep(1.0, 0.6, x)*soft;
    if (fresh > 0.8){
      vec3 cn = normalize(c);
      vec3 e1 = normalize(cross(cn, vec3(0.0, 1.0, 0.31)));
      vec3 e2 = cross(cn, e1);
      float ang = atan(dot(dv, e2), dot(dv, e1));
      float rays = smoothstep(0.45, 0.95, noise(vec2(ang*4.5 + h.y*40.0, h.z*13.0)));
      float halo = exp(-max(x - 1.0, 0.0)*1.6)*step(0.85, x);
      alb += (fresh - 0.8)*5.0*(0.22*halo + 0.35*rays*exp(-max(x - 1.0, 0.0)*0.9)*step(1.0, x))*soft;
    }
    /* shadow cast by the sunward rim onto the bowl */
    if (x < 1.0 && tanE > 0.0){
      vec3 u = dv/r; u -= n*dot(u, n);
      float b = dot(u, sunT);
      float cc = dot(u, u) - 1.0;
      float t = -b + sqrt(max(b*b - cc, 0.0));
      float depthHere = max(bowl, floorH)*-1.0 + rimA;
      shade *= 1.0 - 0.92*smoothstep(-0.01, 0.025, depthHere - t*tanE);
    }
  }
}
vec4 moon(vec2 frag, vec2 center, float R, float yaw, vec3 sun, vec3 toPlanet, vec3 planetLight){
  vec2 p = (frag - center)/uRes.y/R;
  float d2 = dot(p, p);
  if (d2 > 1.0) return vec4(0.0);
  float z = sqrt(1.0 - d2);
  vec3 n = vec3(p, z);
  /* body-fixed frame: spin + a slight axial tilt */
  vec3 q = n; q.xz = rot(yaw)*q.xz; q.yz = rot(0.4)*q.yz;
  vec3 s = sun; s.xz = rot(yaw)*s.xz; s.yz = rot(0.4)*s.yz;
  float mu0g = dot(q, s);
  vec3 sunT = s - q*mu0g; sunT /= max(length(sunT), 1e-4);
  float tanE = mu0g/max(sqrt(1.0 - mu0g*mu0g), 1e-3);
  /* maria: smooth, dark basalt plains; highlands: bright and saturated with craters */
  float mar = smoothstep(0.50, 0.62, fbm3(q*1.35 + 11.0) + 0.08*(fbm3(q*5.0) - 0.5));
  float soft = mix(1.0, 0.45, mar);
  vec3 grad = vec3(0.0); float alb = 0.0, shade = 1.0;
  craterLayer(q, sunT, tanE, 2.1,  0.42, 1.0,  soft, grad, alb, shade);
  craterLayer(q, sunT, tanE, 4.3,  0.55, 17.0, soft, grad, alb, shade);
  craterLayer(q, sunT, tanE, 8.7,  0.62, 31.0, soft, grad, alb, shade);
  craterLayer(q, sunT, tanE, 17.0, 0.70, 47.0, soft, grad, alb, shade);
  /* fine regolith relief */
  float e = 0.012;
  float r0 = fbm3(q*38.0);
  vec3 rg = vec3(fbm3((q + vec3(e, 0.0, 0.0))*38.0) - r0, fbm3((q + vec3(0.0, e, 0.0))*38.0) - r0, fbm3((q + vec3(0.0, 0.0, e))*38.0) - r0)/e;
  grad += rg*0.012;
  vec3 N = normalize(q - (grad - q*dot(grad, q))*0.9);
  vec3 V = vec3(0.0, 0.0, 1.0); V.xz = rot(yaw)*V.xz; V.yz = rot(0.4)*V.yz;
  float mu0 = max(dot(N, s), 0.0);
  float mu = max(dot(N, V), 0.02);
  float Lw = 0.62;                                        /* lunar-Lambert weight */
  float brdf = 2.0*Lw*mu0/(mu0 + mu) + (1.0 - Lw)*mu0;
  brdf *= smoothstep(-0.07, 0.03, mu0g);                  /* peaks catch light just past the terminator */
  float grain = 0.9 + 0.2*fbm3(q*60.0);
  vec3 high = vec3(0.60, 0.585, 0.56);
  vec3 mare = vec3(0.30, 0.30, 0.315);
  vec3 albedo = mix(high, mare, mar)*grain*(1.0 + alb);
  vec3 lit = albedo*brdf*shade*1.25;
  /* planetshine on the night side */
  lit += albedo*planetLight*max(dot(n, toPlanet), 0.0)*0.06;
  float edge = smoothstep(1.0, 0.97, sqrt(d2));
  return vec4(lit, edge);
}

/* ── planet Eris: an icy dwarf world, in high detail ───────────
   Domain-warped provinces: bright nitrogen-ice plains broken into
   convection cells, tholin-stained cratered uplands, frost-capped
   ridges, wind streaks and fine regolith. Relief is bump-mapped from
   an analytic height field plus the crater field above (with rim
   shadows), lit with a lambert / lommel-seeliger mix, an ice glint
   and a layered haze limb. */
float fbm3s(vec3 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++){ v += a*tri(p); p = p*2.07 + 1.3; a *= 0.5; }
  return v/0.875;
}
float ridged(vec3 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ float t = 1.0 - abs(2.0*tri(p) - 1.0); v += a*t*t; p = p*2.11 + 4.1; a *= 0.5; }
  return v;
}
/* distance to the nearest cell border (0 on borders) */
float cellEdge(vec3 p){
  vec3 ip = floor(p), fp = fract(p);
  float d1 = 9.0, d2 = 9.0;
  for (int k = 0; k < 27; k++){
    vec3 o = vec3(mod(float(k), 3.0), mod(floor(float(k)/3.0), 3.0), floor(float(k)/9.0)) - 1.0;
    vec3 c = o + 0.15 + 0.7*hash33(ip + o) - fp;
    float d = dot(c, c);
    if (d < d1){ d2 = d1; d1 = d; } else if (d < d2){ d2 = d; }
  }
  return sqrt(d2) - sqrt(d1);
}
float erisHeight(vec3 p){ return 0.55*fbm3(p*3.2) + 0.45*ridged(p*6.5); }

/* renders a sphere of radius R (in screen-height units) at center (pixels) */
vec4 planet(vec2 frag, vec2 center, float R, float yaw, float warm, float kind, vec3 glowCol, vec3 sun){
  vec2 p = (frag - center)/uRes.y/R;
  float d2 = dot(p, p);
  float rr = sqrt(d2);
  float pxR = uPx/(uRes.y*R);                    /* one css pixel, in planet radii */
  if (d2 > 1.0){
    /* haze limb: a crisp bright skin over a soft glow, stronger on the day side */
    vec2 dir = p/rr;
    float day = smoothstep(-0.7, 0.8, dot(dir, normalize(sun.xy)));
    float hgt = rr - 1.0;
    float skin = exp(-hgt/(0.004 + 2.0*pxR));
    float g = exp(-hgt*14.0);
    return vec4(glowCol*(g*(0.30 + 0.35*day) + skin*(0.15 + 0.55*day)), 0.0);
  }
  float z = sqrt(1.0 - d2);
  vec3 n = vec3(p, z);
  /* body-fixed frame */
  vec3 q = n;  q.xz = rot(yaw)*q.xz;  q.xy = rot(0.35)*q.xy;
  vec3 s = sun; s.xz = rot(yaw)*s.xz; s.xy = rot(0.35)*s.xy;
  vec3 V = vec3(0.0, 0.0, 1.0); V.xz = rot(yaw)*V.xz; V.xy = rot(0.35)*V.xy;
  float mu0g = dot(q, s);
  vec3 sunT = s - q*mu0g; sunT /= max(length(sunT), 1e-4);
  float tanE = mu0g/max(sqrt(1.0 - mu0g*mu0g), 1e-3);
  float sd = kind*5.0;

  /* provinces, domain-warped so coastlines read as geology, not noise */
  vec3 w = vec3(fbm3s(q*1.7 + 1.0 + sd), fbm3s(q*1.7 + 7.3 + sd), fbm3s(q*1.7 + 13.1 + sd)) - 0.5;
  vec3 pw = q + w*0.55;
  float tholin = smoothstep(0.43, 0.60, fbm3(pw*1.25 + sd) + 0.12*(fbm3s(pw*7.0) - 0.5));
  float plain = smoothstep(0.55, 0.63, fbm3s(pw*0.95 + 21.0 + sd) + 0.05*(fbm3s(pw*11.0) - 0.5))*(1.0 - 0.85*tholin);
  float upl = 1.0 - plain;

  /* upland relief: analytic height, differentiated along the surface */
  vec3 t1 = normalize(cross(q, vec3(0.31, 0.93, 0.17)));
  vec3 t2 = cross(q, t1);
  float e = 0.004;
  float h0 = erisHeight(pw);
  float h1 = erisHeight(pw + t1*e);
  float h2 = erisHeight(pw + t2*e);
  vec3 grad = ((h1 - h0)*t1 + (h2 - h0)*t2)/e*0.03*upl;

  /* craters: saturated uplands, none on the young ice plains */
  float alb = 0.0, shade = 1.0;
  float soft = upl*mix(0.75, 1.0, tholin);
  craterLayer(q, sunT, tanE, 3.0,  0.40, 3.0 + sd,  soft,      grad, alb, shade);
  craterLayer(q, sunT, tanE, 6.5,  0.50, 19.0 + sd, soft,      grad, alb, shade);
  craterLayer(q, sunT, tanE, 14.0, 0.58, 37.0 + sd, soft*0.8,  grad, alb, shade);

  /* convection cells on the plains: shallow troughs along their borders */
  float ce = cellEdge(q*7.0 + w*0.8 + sd);
  float troughC = 1.0 - smoothstep(0.0, 0.10, ce);
  float trough = troughC*plain;
  float ce2 = cellEdge(q*19.0 + w*1.3 + sd + 4.0);
  float pits = 1.0 - smoothstep(0.0, 0.07, ce2);

  /* colour */
  float fine = fbm3(q*46.0 + sd);
  float tv = fbm3s(pw*9.0 + 3.0);
  vec3 frost  = vec3(0.95, 0.945, 0.93);
  vec3 frostB = vec3(0.84, 0.89, 0.97);
  vec3 beige  = vec3(0.80, 0.71, 0.60);
  vec3 thol1  = vec3(0.52, 0.35, 0.24);
  vec3 thol2  = vec3(0.29, 0.18, 0.12);
  vec3 uplC = mix(beige, mix(thol1, thol2, smoothstep(0.30, 0.75, tv)), tholin);
  float cap = smoothstep(0.58, 0.74, h0 + 0.12*(fine - 0.5));          /* frost on ridge crests */
  uplC = mix(uplC, frost*0.96, cap*0.8*(1.0 - 0.45*tholin));
  vec3 plainC = mix(frost, frostB, smoothstep(0.40, 0.72, fbm3s(q*4.0 + 5.0 + sd))*0.55);
  plainC *= (1.0 - 0.24*troughC)*(1.0 - 0.08*pits);
  /* coastline: dark tholin debris along the plain edges */
  float coast = smoothstep(0.0, 0.5, plain)*smoothstep(1.0, 0.5, plain);
  vec3 col = mix(uplC, plainC, plain);
  col *= 1.0 - 0.18*coast;
  /* wind streaks dragged across the plains */
  vec3 sq = q; sq.xy = rot(0.6)*sq.xy;
  col *= 1.0 - 0.09*plain*smoothstep(0.58, 0.8, fbm3s(vec3(sq.x*3.0, sq.y*22.0, sq.z*3.0) + sd));
  col *= (0.86 + 0.24*fine)*(1.0 + alb);
  col = mix(col, col*vec3(1.05, 0.92, 0.88), warm*0.6);

  /* lighting */
  vec3 N = normalize(q - (grad - q*dot(grad, q)));
  float mu0 = dot(N, s);
  float term = smoothstep(-0.08, 0.04, mu0g);
  float mu0p = max(mu0, 0.0);
  float mu = max(dot(N, V), 0.05);
  float lam = clamp((mu0 + 0.05)/1.05, 0.0, 1.0);
  float brdf = mix(lam, 2.0*mu0p/(mu0p + mu), 0.3)*term;
  /* trough floors sit slightly in shadow at low sun */
  brdf *= 1.0 - 0.35*trough*smoothstep(0.5, 0.05, mu0g);
  vec3 lit = col*(0.03 + 1.08*brdf*shade);
  vec3 H = normalize(s + V);
  lit += vec3(1.0, 0.97, 0.92)*pow(max(dot(N, H), 0.0), 70.0)*0.22*plain*term;
  /* haze: blue rim brightening and a thin twilight band at the terminator */
  float fre = pow(1.0 - z, 3.0);
  float l = dot(n, sun);
  lit += glowCol*fre*(0.16 + 0.9*smoothstep(-0.3, 0.4, l));
  lit += glowCol*0.05*smoothstep(0.14, 0.0, abs(l + 0.03));
  float edge = smoothstep(1.0, 1.0 - 1.5*pxR, rr);
  return vec4(lit, edge);
}

/* ── scenes ────────────────────────────────────────────────── */
vec3 sceneHero(vec2 frag, float pr){
  vec3 c = spaceBg(frag, 0.0, pr);
  vec2 ac = uRes*mix(vec2(0.70, 0.58 + 0.06*pr), vec2(0.58, 0.70), portrait());
  ac.y += sin(uTime*0.5)*uRes.y*0.006;
  ac += uMouse*uRes.y*0.012;
  vec2 rg = rings(frag, ac, pr, 1.0);
  vec3 dotC = vec3(0.86,0.89,0.95);
  c = mix(c, dotC, rg.x);
  float R = mix(0.19, 0.24, pr)*mix(1.0, 0.8, portrait());
  vec3 glow = vec3(0.45,0.62,1.0);
  vec4 pl = planet(frag, ac, R, uTime*0.04 + pr*1.2, 0.0, 0.0, glow, SUN_R);
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
  vec3 toPlanet = normalize(vec3(ac - mo, 0.0));
  vec4 mn = moon(frag, mo, R*0.16, uTime*0.03 + pr*0.8, SUN_R, toPlanet, vec3(0.75,0.80,0.95));
  vec4 pl = planet(frag, ac, R, pr*PI*0.9 + uTime*0.02, 0.0, 0.0, glow, SUN_R);
  if (behind) { c = mix(c, mn.rgb*0.92, mn.a); c = mix(c + pl.rgb, pl.rgb, pl.a); }
  else        { c = mix(c + pl.rgb, pl.rgb, pl.a); c = mix(c, mn.rgb, mn.a); }
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
  /* the research-area copy sits in a column (right rail on desktop, most of the width on
     phones): thin the cloud there so white text never lands on solid cream */
  float mob = step(uRes.x/uPx, 760.0);
  float ux = cc.x/uRes.x;
  float colL = mix(0.585, 0.02, mob), colR = mix(0.93, 1.02, mob);
  float inCol = smoothstep(colL - 0.07, colL + 0.01, ux)*(1.0 - smoothstep(colR - 0.01, colR + 0.07, ux));
  den *= 1.0 - 0.62*inCol;
  float rr = cell*0.55*sqrt(den)*(0.75 + 0.5*hash(id));
  float dt = smoothstep(rr, rr - 1.1*uPx, length(f));
  vec3 cream = mix(vec3(0.84,0.80,0.66), vec3(0.99,0.96,0.88), hash(id + 3.1));
  vec3 rose  = vec3(0.95,0.66,0.62);
  vec3 cloudC = mix(cream, rose, smoothstep(0.55, 0.75, hue)*0.7);
  cloudC *= 1.0 - 0.38*inCol;
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
  vec4 pl = planet(frag, ac, 1.35, uTime*0.01 + pr*0.3, 0.6, 1.0, glow, SUN);
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
  float block = 1.0 + floor((bump*bump*bump*3.0 + intro*intro*44.0)*uPx);
  vec2 bc = floor(frag/block);
  vec2 q = (bc + 0.5)*block;
  float th = bayer16(bc)*0.72 + hash(bc)*0.28;
  vec3 col = (tt > th) ? scene(uTo, q, uPB) : scene(uFrom, q, uPA);
  float k = max(bump*0.55, intro);
  if (k > 0.01){
    float lv = mix(48.0, 6.0, k);
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
