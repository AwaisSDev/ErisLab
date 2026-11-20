/* ──────────────────────────────────────────────────────────────
   Eris Lab — scroll choreography
   ────────────────────────────────────────────────────────────── */
import Lenis from 'lenis';
import { createStage } from './stage.js';
import { drawArt } from './art.js';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;

  /* ── split text into words for staggered reveals ─────────── */
  $$('[data-split]').forEach(el => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
      });
    };
    walk(el);
  });

  /* ── reveal on view ──────────────────────────────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal], .solid [data-split], .join [data-split]').forEach(el => io.observe(el));

  /* ── smooth scroll ───────────────────────────────────────── */
  let lenis = null;
  if (!reduced) {
    lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  }
  const scrollTo = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.8 });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };
  $$('[data-scrollto]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); closeMenu(); scrollTo(a.getAttribute('data-scrollto'));
  }));

  /* ── menu ────────────────────────────────────────────────── */
  const menu = $('[data-menu]');
  const openBtn = $('[data-menu-open]');
  function openMenu() { body.classList.add('menu-open'); menu.setAttribute('aria-hidden', 'false'); openBtn.setAttribute('aria-expanded', 'true'); lenis && lenis.stop(); }
  function closeMenu() { if (!body.classList.contains('menu-open')) return; body.classList.remove('menu-open'); menu.setAttribute('aria-hidden', 'true'); openBtn.setAttribute('aria-expanded', 'false'); lenis && lenis.start(); }
  openBtn.addEventListener('click', openMenu);
  $('[data-menu-close]').addEventListener('click', closeMenu);
  addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { const s = $('[data-atlas-search]'); if (s) { e.preventDefault(); scrollTo('#atlas'); setTimeout(() => s.focus({ preventScroll: true }), 900); } }
  });

  /* ── stage ───────────────────────────────────────────────── */
  let stage = null;
  try { stage = createStage($('#stage')); } catch (err) { console.warn('[eris] WebGL unavailable:', err.message); body.classList.add('no-webgl'); }

  /* ── layout cache ────────────────────────────────────────── */
  let vh = innerHeight;
  let sections = [], scenes = [];
  function measure() {
    vh = innerHeight;
    sections = $$('main > section, .foot').map(el => {
      const top = el.getBoundingClientRect().top + scrollY;
      return { el, top, h: el.offsetHeight, bottom: top + el.offsetHeight, scene: el.dataset.scene != null ? +el.dataset.scene : null, chapter: el.dataset.chapter, chrome: el.dataset.chrome, frame: el.dataset.frame };
    });
    scenes = sections.filter(s => s.scene !== null);
  }
  measure();
  addEventListener('resize', measure);
  new ResizeObserver(() => measure()).observe(document.body);
  document.fonts && document.fonts.ready.then(measure);

  const progressOf = (s, y) => s.h > vh ? clamp((y - s.top) / (s.h - vh)) : clamp((y - s.top + vh) / (s.h + vh));

  /* ── elements driven by scroll ───────────────────────────── */
  const heroEls = $$('[data-hero]');
  const thesis = $('#thesis');
  const statements = $$('.statement', thesis);
  const thesisCount = $('[data-thesis-count]');
  const workItems = $$('.work-item');
  const workNum = $('[data-work-num]');
  const indexItems = $$('.index li');
  const selection = $('#context');
  let lastChapter = '', lastStatement = -1, lastWork = -1;

  function update(y) {
    const center = y + vh * 0.5;

    // which section owns the header / center
    const atHeader = sections.find(s => y + 40 >= s.top && y + 40 < s.bottom) || sections[0];
    const atCenter = sections.find(s => center >= s.top && center < s.bottom) || atHeader;
    if (atHeader) {
      if (body.dataset.chrome !== atHeader.chrome) body.dataset.chrome = atHeader.chrome || 'light';
      if (body.dataset.frame !== atHeader.frame) body.dataset.frame = atHeader.frame || 'off';
    }
    if (atCenter && atCenter.chapter !== lastChapter) {
      lastChapter = atCenter.chapter;
      indexItems.forEach(li => li.classList.toggle('is-active', li.dataset.index === lastChapter));
    }

    // stage scenes + dissolve transitions
    if (stage) {
      const W = vh * 0.85;
      let from = null, to = null, t = 0;
      for (let i = 0; i < scenes.length - 1; i++) {
        const a = scenes[i], b = scenes[i + 1];
        if (Math.abs(a.bottom - b.top) > 2) continue;
        const d = center - a.bottom;
        if (Math.abs(d) < W / 2) { from = a; to = b; t = (d + W / 2) / W; break; }
      }
      if (!from) {
        const cur = scenes.find(s => center >= s.top && center < s.bottom)
          || scenes.find(s => s.bottom > y && s.top < y + vh);
        if (cur) { from = to = cur; t = 0; }
      }
      const visible = scenes.some(s => s.bottom > y && s.top < y + vh);
      body.classList.toggle('stage-off', !visible);
      stage.visible = visible;
      if (from) {
        const st = stage.state;
        st.from = from.scene; st.to = to.scene; st.t = smooth(0, 1, t);
        st.pa = progressOf(from, y); st.pb = progressOf(to, y);
      }
    }

    // hero copy drifts away
    const hero = sections[0];
    if (hero) {
      const p = clamp((y - hero.top) / (vh * 0.9));
      heroEls.forEach((el, i) => {
        el.style.opacity = String(1 - smooth(0.05 + i * 0.05, 0.75, p));
        el.style.transform = `translate3d(0, ${-p * (60 + i * 30)}px, 0)`;
        el.style.filter = p > 0.05 ? `blur(${p * 8}px)` : '';
      });
    }

    // thesis statements
    const th = sections.find(s => s.el === thesis);
    if (th) {
      const p = progressOf(th, y);
      const idx = Math.min(statements.length - 1, Math.floor(p * statements.length * 0.999));
      if (idx !== lastStatement) {
        lastStatement = idx;
        statements.forEach((s, i) => { s.classList.toggle('is-active', i === idx); s.classList.toggle('is-past', i < idx); });
        thesisCount.textContent = String(idx + 1).padStart(2, '0');
      }
    }

    // work items fade through the column (pear-like)
    let best = -1, bestD = Infinity;
    workItems.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const c = r.top + r.height / 2;
      const d = Math.abs(c - vh * 0.5) / vh;
      el.style.opacity = String(1 - smooth(0.18, 0.46, d));
      el.style.setProperty('--b', `${smooth(0.2, 0.5, d) * 6}px`);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best !== lastWork && best >= 0) { lastWork = best; workNum.textContent = String(best + 1).padStart(2, '0'); }

    // selection text
    const sel = sections.find(s => s.el === selection);
    if (sel) {
      const p = progressOf(sel, y);
      selection.style.setProperty('--p', p.toFixed(3));
      selection.classList.toggle('in', p > 0.08 && p < 0.97);
    }
  }

  /* ── mouse parallax for the stage ────────────────────────── */
  addEventListener('pointermove', e => {
    if (!stage) return;
    stage.state.mx = (e.clientX / innerWidth - 0.5);
    stage.state.my = -(e.clientY / innerHeight - 0.5);
  }, { passive: true });

  /* ── loader & intro ──────────────────────────────────────── */
  const loaderCount = $('[data-loader-count]');
  const t0 = performance.now();
  let introStart = null;
  const LOAD_MS = reduced ? 0 : 1100;

  function tickLoader(now) {
    const p = clamp((now - t0) / LOAD_MS);
    loaderCount.textContent = String(Math.round(p * 100)).padStart(3, '0');
    if (p >= 1 && introStart === null) {
      introStart = now;
      body.classList.add('loaded');
      setTimeout(() => $$('.hero [data-split]').forEach(el => el.classList.add('in')), reduced ? 0 : 450);
    }
  }

  /* ── frame loop ──────────────────────────────────────────── */
  function frame(now) {
    if (lenis) lenis.raf(now);
    tickLoader(now);
    update(lenis ? lenis.scroll : scrollY);
    if (stage) {
      stage.state.intro = introStart === null ? 0 : (reduced ? 1 : clamp((now - introStart) / 1600));
      if (stage.visible !== false) stage.render(now, reduced);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ── generative covers (lazy) ────────────────────────────── */
    function paint(canvas) {
    if (canvas.dataset.painted) return;
    const r = canvas.getBoundingClientRect();
    const scale = canvas.dataset.art === 'orb' || canvas.dataset.art === 'planet' ? 0.5 : Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(60, Math.round(r.width * scale));
    canvas.height = Math.max(60, Math.round(r.height * scale));
    drawArt(canvas, canvas.dataset.art, +canvas.dataset.seed);
    canvas.dataset.painted = '1';
    canvas.classList.add('is-painted');
  }
  const aio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { paint(e.target); aio.unobserve(e.target); } }), { rootMargin: '400px 0px' });

  /* ── research: filters + cursor peek ─────────────────────── */
  $$('canvas[data-art]').forEach(c => aio.observe(c));
  const filters = $$('[data-research-filters] button');
  filters.forEach(b => b.addEventListener('click', () => {
    filters.forEach(x => x.classList.toggle('is-active', x === b));
    const f = b.dataset.filter;
    $$('.row, .feat').forEach(el => el.classList.toggle('is-hidden', f !== 'all' && el.dataset.type !== f));
  }));
  const peek = $('[data-peek]');
  const peekCanvas = $('canvas', peek);
  let peekX = 0, peekY = 0, px = 0, py = 0, peekOn = false;
  $$('.row').forEach(row => {
    row.addEventListener('pointerenter', () => {
      drawArt(peekCanvas, row.dataset.art, +row.dataset.seed);
      peek.classList.add('on'); peekOn = true;
    });
    row.addEventListener('pointerleave', () => { peek.classList.remove('on'); peekOn = false; });
  });
  addEventListener('pointermove', e => { peekX = e.clientX; peekY = e.clientY; }, { passive: true });
  (function peekLoop() {
    px += (peekX - px) * 0.14; py += (peekY - py) * 0.14;
    if (peekOn) peek.style.transform = `translate3d(${px + 28}px, ${py - 110}px, 0)`;
    requestAnimationFrame(peekLoop);
  })();

  /* ── atlas (cosmos-style) ────────────────────────────────── */
  $$('.card').forEach(card => {
    aio.observe($('canvas', card));
    $('.card__save', card).addEventListener('click', ev => {
      ev.stopPropagation();
      const b = ev.currentTarget; b.classList.toggle('is-saved'); b.textContent = b.classList.contains('is-saved') ? 'Saved' : 'Save';
    });
  });
  const cio2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); cio2.unobserve(e.target); } }), { rootMargin: '0px 0px -5% 0px' });
  $$('.card').forEach(c => cio2.observe(c));

  const chips = $$('[data-atlas-chips] button');
  const search = $('[data-atlas-search]');
  const empty = $('[data-atlas-empty]');
  let chip = 'all';
  function filterAtlas() {
    const q = (search.value || '').trim().toLowerCase();
    let shown = 0;
    $$('.card').forEach(c => {
      const ok = (chip === 'all' || c.dataset.cat === chip) && (!q || c.dataset.q.includes(q));
      c.classList.toggle('is-hidden', !ok); if (ok) shown++;
    });
    empty.hidden = shown > 0;
    measure();
  }
  chips.forEach(b => b.addEventListener('click', () => { chip = b.dataset.chip; chips.forEach(x => x.classList.toggle('is-active', x === b)); filterAtlas(); }));
  search.addEventListener('input', filterAtlas);

