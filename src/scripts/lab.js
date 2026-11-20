// Behaviour for the /research page: lazy covers, reveals, filters, views, area pager.
import { drawArt } from './art.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* generative covers, painted when they approach the viewport */
function paint(c) {
  const r = c.getBoundingClientRect();
  if (!r.width) return false;
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
$$('canvas[data-art]').forEach(c => artIO.observe(c));

/* staggered rise-in on scroll */
if (!reduced) {
  document.documentElement.classList.add('motion');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = $$('[data-rise]', e.target.parentElement);
    e.target.style.setProperty('--d', `${Math.max(0, sibs.indexOf(e.target)) * 70}ms`);
    e.target.classList.add('in');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('[data-rise]').forEach(el => io.observe(el));
}

/* nav border once scrolled */
const nav = $('[data-nav]');
const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* area carousel */
const track = $('[data-areas]');
const count = $('[data-areas-count]');
const cards = $$('.area', track);
const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
$('[data-areas-prev]').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
$('[data-areas-next]').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
track.addEventListener('scroll', () => {
  const i = Math.min(cards.length, Math.round(track.scrollLeft / step()) + 1);
  count.textContent = `${String(i).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
}, { passive: true });

/* filters + list/grid view */
const list = $('[data-qlist]');
const items = $$('.q', list);
function swap(fn) {
  if (reduced || !document.startViewTransition) return fn();
  document.startViewTransition(fn);
}
$$('[data-filters] button').forEach(b => b.addEventListener('click', () => swap(() => {
  $$('[data-filters] button').forEach(x => x.classList.toggle('is-active', x === b));
  items.forEach(it => it.hidden = b.dataset.filter !== 'all' && it.dataset.type !== b.dataset.filter);
})));
$$('[data-views] button').forEach(b => b.addEventListener('click', () => swap(() => {
  $$('[data-views] button').forEach(x => x.classList.toggle('is-active', x === b));
  list.dataset.view = b.dataset.view;
  // covers that were hidden in list view need a paint once shown
  $$('canvas[data-art]:not(.is-painted)', list).forEach(c => { artIO.unobserve(c); artIO.observe(c); });
})));

/* smooth in-page anchors, offset by the sticky nav */
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = $(a.getAttribute('href'));
  if (!t) return;
  e.preventDefault();
  scrollTo({ top: t.getBoundingClientRect().top + scrollY - 72, behavior: reduced ? 'auto' : 'smooth' });
}));
