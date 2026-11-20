// Behaviour for the /research page.
import { drawArt } from './art.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* generative covers, painted when they approach the viewport (or become visible) */
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
} else {
  $$('[data-rise]').forEach(el => el.classList.add('in'));
}

/* nav + menu drawer */
const nav = $('[data-nav]');
const menuBtn = $('[data-menu-btn]');
const drawer = $('[data-drawer]');
const setMenu = (open) => {
  drawer.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.documentElement.style.overflow = open ? 'hidden' : '';
};
addEventListener('resize', () => { if (innerWidth > 1080) setMenu(false); });
menuBtn.addEventListener('click', () => setMenu(drawer.hidden));
$$('a', drawer).forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* tabbed research areas */
const tabs = $$('[data-tab]');
function selectTab(i) {
  tabs.forEach(t => t.setAttribute('aria-selected', String(+t.dataset.tab === i)));
  $$('[data-panel]').forEach(p => p.hidden = +p.dataset.panel !== i);
  watchArt($('.areas'));
}
tabs.forEach(t => t.addEventListener('click', () => selectTab(+t.dataset.tab)));
$('[data-tabbar]').addEventListener('keydown', e => {
  const cur = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
  if (!d) return;
  const n = (cur + d + tabs.length) % tabs.length;
  selectTab(n); tabs[n].focus();
});

/* scroll-linked: mosaic parallax, statement words, nav state */
const tiles = $$('[data-mosaic] canvas');
const mosaic = $('[data-mosaic]');
const statement = $('[data-statement]');
const words = $$('.sw', statement);
let ticking = false;
function onScroll() {
  ticking = false;
  const vh = innerHeight;
  nav.classList.toggle('is-scrolled', scrollY > 8);
  if (reduced) return;
  const mr = mosaic.getBoundingClientRect();
  if (mr.bottom > 0 && mr.top < vh) {
    const p = (mr.top + mr.height / 2 - vh / 2) / vh; // -1..1 around centre
    tiles.forEach(c => c.style.setProperty('--py', (p * 60 * +c.dataset.par).toFixed(1)));
  }
  const sr = statement.getBoundingClientRect();
  const prog = Math.min(1, Math.max(0, (vh * 0.85 - sr.top) / (sr.height * 0.55)));
  const lit = Math.round(prog * words.length);
  words.forEach((w, i) => w.classList.toggle('on', i < lit));
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

/* filters + list/grid view for open questions */
const list = $('[data-qlist]');
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

/* smooth in-page anchors, offset by the sticky nav */
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = $(a.getAttribute('href'));
  if (!t) return;
  e.preventDefault();
  scrollTo({ top: t.getBoundingClientRect().top + scrollY - 76, behavior: reduced ? 'auto' : 'smooth' });
}));
