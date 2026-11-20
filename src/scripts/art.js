/* ──────────────────────────────────────────────────────────────
   Eris Lab — generative specimens for the Atlas & research covers.
   drawArt(canvas, kind, seed) paints a deterministic image.
   ────────────────────────────────────────────────────────────── */
  const PALS = [
    ['#0b4ea2', '#f1e9d2', '#d4a54a', '#0b0a09'],
    ['#151411', '#d4a54a', '#f4efe3', '#7d5d24'],
    ['#e9e4d6', '#2c3a1a', '#6b7a2a', '#c9973d'],
    ['#0e1a2f', '#3d6fd1', '#c9d6f2', '#ffd27a'],
    ['#f2efe6', '#b5502f', '#1f1d1a', '#e2ad54'],
    ['#101010', '#ececec', '#7c7c7c', '#d4a54a'],
    ['#1d2b4a', '#e8c37a', '#f6f1e4', '#8fa6d8'],
    ['#2a1d14', '#e7a45b', '#f3e2c4', '#6f3b22'],
  ];

  function rng(seed) {
    let a = (seed * 2654435761) >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeNoise(r) {
    const p = new Uint8Array(512);
    const base = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
    for (let i = 0; i < 512; i++) p[i] = base[i & 255];
    const g = (h) => p[h] / 255;
    const fade = (t) => t * t * (3 - 2 * t);
    const n = (x, y) => {
      const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
      const xf = x - Math.floor(x), yf = y - Math.floor(y);
      const u = fade(xf), v = fade(yf);
      const a = g(p[xi] + yi), b = g(p[xi + 1] + yi), c = g(p[xi] + yi + 1), d = g(p[xi + 1] + yi + 1);
      return (a + (b - a) * u) + ((c + (d - c) * u) - (a + (b - a) * u)) * v;
    };
    n.fbm = (x, y, o = 4) => { let v = 0, a = 0.5, f = 1; for (let i = 0; i < o; i++) { v += a * n(x * f, y * f); f *= 2; a *= 0.5; } return v; };
    return n;
  }
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);

  function pixels(ctx, w, h, fn) {
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const c = fn(x, y); const i = (y * w + x) * 4;
      d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  function grain(ctx, w, h, r, amt = 18) {
    const img = ctx.getImageData(0, 0, w, h); const d = img.data;
    for (let i = 0; i < d.length; i += 4) { const g = (r() - 0.5) * amt; d[i] += g; d[i + 1] += g; d[i + 2] += g; }
    ctx.putImageData(img, 0, 0);
  }

  const KINDS = {
    /* dithered lit sphere */
    orb(ctx, w, h, r, pal) {
      const [bg, fg, acc, ink] = pal.map(hex);
      const cx = w * (0.35 + r() * 0.3), cy = h * (0.35 + r() * 0.3), R = Math.min(w, h) * (0.24 + r() * 0.14);
      const lx = -0.5, ly = -0.6, lz = 0.62;
      pixels(ctx, w, h, (x, y) => {
        const t = BAYER4[(y & 3) * 4 + (x & 3)];
        const dx = (x - cx) / R, dy = (y - cy) / R, d2 = dx * dx + dy * dy;
        if (d2 < 1) {
          const dz = Math.sqrt(1 - d2);
          const l = Math.max(0, dx * lx + dy * ly + dz * lz);
          const v = l * 1.1 + 0.05;
          return v > t + 0.45 ? fg : v > t ? acc : ink;
        }
        const g = (y / h) * 0.6 + 0.1 - Math.max(0, 0.25 - (d2 - 1) * 0.1) * 0.5;
        return g > t ? bg : ink;
      });
    },
    /* halftone cloud field */
    halftone(ctx, w, h, r, pal, n) {
      ctx.fillStyle = pal[0]; ctx.fillRect(0, 0, w, h);
      const cell = Math.max(5, Math.round(w / (34 + r() * 20)));
      const ox = r() * 50, oy = r() * 50, sc = 1.5 + r() * 2;
      for (let y = 0; y < h + cell; y += cell) for (let x = 0; x < w + cell; x += cell) {
        let v = n.fbm(x / w * sc + ox, y / w * sc + oy, 4);
        v = Math.max(0, Math.min(1, (v - 0.38) * 3));
        if (v <= 0.02) continue;
        ctx.fillStyle = v > 0.75 ? pal[1] : v > 0.4 ? pal[2] : pal[3];
        ctx.beginPath(); ctx.arc(x, y, cell * 0.5 * Math.sqrt(v), 0, 7); ctx.fill();
      }
    },
    /* loss landscape iso-lines */
    contour(ctx, w, h, r, pal) {
      const [bg, a, b, c] = pal.map(hex);
      const G = Array.from({ length: 5 + Math.floor(r() * 4) }, () => [r() * w, r() * h, (0.08 + r() * 0.22) * w, r() > 0.4 ? 1 : -0.7]);
      const lines = 14 + Math.floor(r() * 10);
      pixels(ctx, w, h, (x, y) => {
        let f = 0;
        for (const [gx, gy, s, k] of G) { const dx = x - gx, dy = y - gy; f += k * Math.exp(-(dx * dx + dy * dy) / (2 * s * s)); }
        const v = f * lines; const fr = v - Math.floor(v);
        const line = fr < 0.09 || fr > 0.91;
        const m = Math.max(0, Math.min(1, f * 0.6 + 0.35));
        const base = bg.map((ch, i) => ch * (1 - m * 0.25) + c[i] * m * 0.25);
        return line ? (f > 0.6 ? b : a) : base;
      });
    },
    /* attention matrix */
    attention(ctx, w, h, r, pal) {
      ctx.fillStyle = pal[0]; ctx.fillRect(0, 0, w, h);
      const N = 14 + Math.floor(r() * 12); const pad = w * 0.08;
      const s = (Math.min(w, h) - pad * 2) / N;
      const ox = (w - s * N) / 2, oy = (h - s * N) / 2;
      const heads = Array.from({ length: 3 }, () => ({ off: Math.floor(r() * 6) - 3, p: r() }));
      for (let i = 0; i < N; i++) for (let j = 0; j <= i; j++) {
        let v = 0.05 + r() * 0.12;
        for (const hd of heads) if (i - j === Math.abs(hd.off)) v += 0.6 * hd.p + 0.2;
        if (j === 0) v += 0.35;
        if (i === j) v += 0.4;
        v = Math.min(1, v);
        ctx.globalAlpha = v;
        ctx.fillStyle = v > 0.7 ? pal[2] : pal[1];
        ctx.fillRect(ox + j * s + 1, oy + i * s + 1, s - 2, s - 2);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = pal[1]; ctx.globalAlpha = 0.25; ctx.strokeRect(ox - 4, oy - 4, s * N + 8, s * N + 8); ctx.globalAlpha = 1;
    },
    /* flow field */
    flow(ctx, w, h, r, pal, n) {
      ctx.fillStyle = pal[0]; ctx.fillRect(0, 0, w, h);
      const sc = 1.2 + r() * 2.5, ox = r() * 99;
      ctx.lineCap = 'round';
      for (let k = 0; k < 700; k++) {
        let x = r() * w, y = r() * h;
        ctx.beginPath(); ctx.moveTo(x, y);
        const col = r(); ctx.strokeStyle = col > 0.92 ? pal[2] : col > 0.5 ? pal[1] : pal[3];
        ctx.globalAlpha = 0.25 + r() * 0.6; ctx.lineWidth = 0.6 + r() * 1.1;
        for (let s = 0; s < 22; s++) {
          const a = n.fbm(x / w * sc + ox, y / w * sc, 3) * Math.PI * 4;
          x += Math.cos(a) * 3; y += Math.sin(a) * 3; ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
    /* orbits */
    orbit(ctx, w, h, r, pal) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, pal[0]); g.addColorStop(1, pal[3] || pal[0]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const cx = w * (0.45 + r() * 0.2), cy = h * (0.45 + r() * 0.15), tilt = -0.2 - r() * 0.3;
      for (let i = 0; i < 7; i++) {
        const R = Math.min(w, h) * (0.12 + i * 0.1);
        for (let k = 0; k < 260 + i * 60; k++) {
          if (r() < 0.35) continue;
          const a = r() * Math.PI * 2, jitter = (r() - 0.5) * 6;
          const ex = Math.cos(a) * (R + jitter), ey = Math.sin(a) * (R + jitter) * 0.38;
          const x = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt), y = cy + ex * Math.sin(tilt) + ey * Math.cos(tilt);
          ctx.fillStyle = pal[1]; ctx.globalAlpha = 0.35 + r() * 0.6;
          ctx.fillRect(x, y, 1.4, 1.4);
        }
      }
      ctx.globalAlpha = 1;
      const R0 = Math.min(w, h) * 0.08;
      const rg = ctx.createRadialGradient(cx - R0 * 0.4, cy - R0 * 0.4, 1, cx, cy, R0);
      rg.addColorStop(0, '#fff3c8'); rg.addColorStop(0.4, pal[2]); rg.addColorStop(1, '#5b3e12');
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, 7); ctx.fill();
    },
    /* token grid */
    tokens(ctx, w, h, r, pal) {
      ctx.fillStyle = pal[0]; ctx.fillRect(0, 0, w, h);
      const words = ['you', 'remember', 'private', 'local', 'ask', 'help', 'today', 'calendar', 'mom', 'flight', '→', 'encrypt', 'forget', 'yes', 'later', '✓', 'note', 'meet', 'why', '?', 'context', 'home'];
      const fs = Math.max(9, Math.round(w / 26));
      ctx.font = `${fs}px "Geist Mono Variable", "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      let x = fs, y = fs;
      while (y < h - fs * 1.5) {
        const word = words[Math.floor(r() * words.length)];
        const tw = ctx.measureText(word).width;
        if (x + tw > w - fs) { x = fs; y += fs * 1.7; continue; }
        const hot = r();
        if (hot > 0.86) { ctx.fillStyle = pal[2]; ctx.fillRect(x - 3, y - 3, tw + 6, fs + 6); ctx.fillStyle = pal[0]; }
        else ctx.fillStyle = hot > 0.5 ? pal[1] : pal[3];
        ctx.fillText(word, x, y);
        x += tw + fs * 0.7;
      }
    },
    /* soft gradient mesh */
    mesh(ctx, w, h, r, pal) {
      ctx.fillStyle = pal[0]; ctx.fillRect(0, 0, w, h);
      ctx.filter = `blur(${Math.round(w / 9)}px)`;
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = pal[1 + (i % 3)];
        ctx.globalAlpha = 0.75;
        ctx.beginPath(); ctx.ellipse(r() * w, r() * h, w * (0.18 + r() * 0.25), h * (0.15 + r() * 0.25), r() * 3, 0, 7); ctx.fill();
      }
      ctx.filter = 'none'; ctx.globalAlpha = 1;
    },
    /* activation bars */
    bars(ctx, w, h, r, pal, n) {
      ctx.fillStyle = pal[0]; ctx.fillRect(0, 0, w, h);
      const N = 40 + Math.floor(r() * 50), bw = w / N, ox = r() * 50;
      for (let i = 0; i < N; i++) {
        const v = Math.pow(n.fbm(i / N * 3 + ox, 0.5, 4), 2.2) * 2.2;
        const bh = Math.min(h * 0.86, v * h * 0.8);
        ctx.fillStyle = v > 0.8 ? pal[2] : pal[1];
        ctx.globalAlpha = 0.5 + Math.min(0.5, v * 0.5);
        ctx.fillRect(i * bw + bw * 0.15, h * 0.92 - bh, bw * 0.7, bh);
      }
      ctx.globalAlpha = 0.4; ctx.fillStyle = pal[3]; ctx.fillRect(0, h * 0.92, w, 1); ctx.globalAlpha = 1;
    },
    /* dithered ringed planet */
    planet(ctx, w, h, r, pal) {
      const [bg, fg, acc, ink] = pal.map(hex);
      const cx = w * (0.42 + r() * 0.16), cy = h * (0.45 + r() * 0.1), R = Math.min(w, h) * (0.2 + r() * 0.08);
      const tilt = -0.25 - r() * 0.3, ca = Math.cos(tilt), sa = Math.sin(tilt);
      const ringIn = 1.35, ringOut = 2.1 + r() * 0.4, flat = 0.26;
      pixels(ctx, w, h, (x, y) => {
        const t = BAYER4[(y & 3) * 4 + (x & 3)];
        const dx = (x - cx) / R, dy = (y - cy) / R;
        const rx = dx * ca + dy * sa, ry = (-dx * sa + dy * ca) / flat;
        const rr = Math.sqrt(rx * rx + ry * ry);
        const inRing = rr > ringIn && rr < ringOut && Math.sin(rr * 9) > -0.5;
        const d2 = dx * dx + dy * dy;
        const front = ry > 0;
        if (d2 < 1 && !(inRing && front)) {
          const dz = Math.sqrt(1 - d2);
          const l = Math.max(0, -dx * 0.6 - dy * 0.45 + dz * 0.66);
          return l > t + 0.4 ? fg : l > t - 0.05 ? acc : ink;
        }
        if (inRing) { const v = 0.35 + 0.4 * Math.abs(Math.sin(rr * 23)); return v > t ? fg : ink; }
        const s = (x * 7919 + y * 104729) % 997 < 4;
        if (s) return fg;
        const g = 0.15 + (1 - y / h) * 0.35;
        return g > t ? bg : ink;
      });
    },
  };

  export function drawArt(canvas, kind, seed) {
    const w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext('2d');
    const r = rng(seed + 1);
    const pal = PALS[Math.floor(r() * PALS.length)];
    const n = makeNoise(r);
    (KINDS[kind] || KINDS.orb)(ctx, w, h, r, pal, n);
    if (kind !== 'orb' && kind !== 'planet') grain(ctx, w, h, r, 14);
  }

