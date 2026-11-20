// Behaviour shared by the lab pages (home, open questions, projects, focus areas).
import { drawArt } from './art.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* generative images, painted when they approach the viewport (or become visible) */
function paint(c) {
  const r = c.getBoundingClientRect();
  if (!r.width || !r.height) return false;
  const heavy = c.dataset.art === 'orb' || c.dataset.art === 'planet';
  const s = heavy ? 0.6 : Math.min(devicePixelRatio || 1, 2);
  c.width = Math.max(60, Math.round(r.width * s));
  c.height = Math.max(60, Math.round(r.height * s));
  drawArt(c, c.dataset.art, +c.dataset.seed);
  c.classList.add('is-painted');
  return true;
}
const artIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting && paint(e.target)) artIO.unobserve(e.target);
}), { rootMargin: '300px 0px' });
const watchArt = (root = document) => $$('canvas[data-art]:not(.is-painted)', root).forEach(c => { artIO.unobserve(c); artIO.observe(c); });
watchArt();

/* staggered rise-in */
if (!reduced) {
  document.documentElement.classList.add('motion');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = $$(':scope > [data-rise]', e.target.parentElement);
    e.target.style.setProperty('--d', `${Math.max(0, sibs.indexOf(e.target)) * 80}ms`);
    e.target.classList.add('in');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('[data-rise]').forEach(el => io.observe(el));
}

/* mobile menu */
const menuBtn = $('[data-menu-btn]');
const drawer = $('[data-drawer]');
if (menuBtn && drawer) {
  const setMenu = (open) => {
    drawer.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(drawer.hidden));
  $$('a', drawer).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth > 1080) setMenu(false); });
}

/* hero mosaic parallax */
const mosaic = $('[data-mosaic]');
if (mosaic && !reduced) {
  const tiles = $$('canvas', mosaic);
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const vh = innerHeight;
    const r = mosaic.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const p = (r.top + r.height / 2 - vh / 2) / vh;
    tiles.forEach(c => c.style.setProperty('--py', (p * 60 * +c.dataset.par).toFixed(1)));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
}

/* closing photo: slow drift while it scrolls through the viewport */
const photo = $('[data-photo]');
if (photo && !reduced) {
  const img = $('[data-photo-img]', photo);
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const r = photo.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    img.style.setProperty('--py', (p * 70).toFixed(1));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
}

/* open questions: filters + list/grid view */
const list = $('[data-qlist]');
if (list && $('[data-filters]')) {
  const items = $$('.q', list);
  const swap = (fn) => (reduced || !document.startViewTransition) ? fn() : document.startViewTransition(fn);
  $$('[data-filters] button').forEach(b => b.addEventListener('click', () => swap(() => {
    $$('[data-filters] button').forEach(x => x.classList.toggle('is-active', x === b));
    items.forEach(it => it.hidden = b.dataset.filter !== 'all' && it.dataset.type !== b.dataset.filter);
    watchArt(list);
  })));
  $$('[data-views] button').forEach(b => b.addEventListener('click', () => swap(() => {
    $$('[data-views] button').forEach(x => x.classList.toggle('is-active', x === b));
    list.dataset.view = b.dataset.view;
    watchArt(list);
  })));
}

/* back to top */
$$('[data-to-top]').forEach(b => b.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })));

/* smooth in-page anchors (including "/#id" links when already on that page), offset by the sticky nav */
const scrollToId = (id, smooth = true) => {
  const t = document.getElementById(id);
  if (!t) return false;
  scrollTo({ top: t.getBoundingClientRect().top + scrollY - 76, behavior: smooth && !reduced ? 'smooth' : 'auto' });
  return true;
};
$$('a[href*="#"]').forEach(a => a.addEventListener('click', e => {
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname || !url.hash) return;
  if (scrollToId(decodeURIComponent(url.hash.slice(1)))) { e.preventDefault(); history.replaceState(null, '', url.hash); }
}));
if (location.hash) addEventListener('load', () => scrollToId(decodeURIComponent(location.hash.slice(1)), false));
