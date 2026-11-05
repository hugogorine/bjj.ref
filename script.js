// The lineage thread: fills with the scroll and lights each master as it passes the middle of the screen.
(() => {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const nodes = [...rail.querySelectorAll('.node')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const lightAll = () => {
    rail.style.setProperty('--p', 1);
    nodes.forEach((n) => n.classList.add('is-lit'));
  };

  if (reduce.matches) { lightAll(); return; }

  let ticking = false;
  const update = () => {
    ticking = false;
    const mid = window.innerHeight * 0.5;
    const r = rail.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    rail.style.setProperty('--p', p.toFixed(4));
    for (const n of nodes) {
      const dot = n.getBoundingClientRect().top + 40;
      n.classList.toggle('is-lit', dot <= mid);
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  reduce.addEventListener('change', (e) => { if (e.matches) { window.removeEventListener('scroll', onScroll); lightAll(); } });
})();

// Close the phone menu after a jump.
document.querySelectorAll('.nav__menu nav a').forEach((a) => a.addEventListener('click', () => a.closest('details').removeAttribute('open')));

// Long texts (style histories, full guidelines) live in <template> and are placed when a reader opens them.
document.querySelectorAll('details').forEach((d) => {
  const slot = d.querySelector('[data-lazy]');
  if (!slot) return;
  d.addEventListener('toggle', () => {
    const t = slot.querySelector('template');
    if (d.open && t) { slot.append(t.content.cloneNode(true)); t.remove(); }
  });
});
