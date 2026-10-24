(() => {
  const ns = 'http://www.w3.org/2000/svg';
  const link = document.querySelector('.github-box .icon-link');
  if (!link) return;

  const W = 48, H = 48;
  const cx = W / 2, cy = H / 2;
  const svg = document.createElementNS(ns, 'svg');
  svg.style.cssText = `position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${W}px;height:${H}px;pointer-events:none;opacity:0;transition:opacity .25s ease;overflow:visible`;
  link.appendChild(svg);

  const groups = {};
  ['one','two','three','four'].forEach(fx => {
    const g = document.createElementNS(ns, 'g');
    g.style.opacity = '0';
    groups[fx] = g;
    svg.appendChild(g);
  });

  function spin(el, dur) {
    const at = document.createElementNS(ns, 'animateTransform');
    at.setAttribute('attributeName', 'transform');
    at.setAttribute('type', 'rotate');
    at.setAttribute('from', `0 ${cx} ${cy}`);
    at.setAttribute('to',   `360 ${cx} ${cy}`);
    at.setAttribute('dur', `${dur}s`);
    at.setAttribute('repeatCount', 'indefinite');
    el.appendChild(at);
  }

  // spinning bars
  {
    const g = document.createElementNS(ns, 'g');
    const r1 = 18.5, r2 = 27, count = 18;
    for (let i = 0; i < count; i++) {
      const a = (i * 360 / count) * Math.PI / 180;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', (cx + r1 * Math.cos(a)).toFixed(2));
      line.setAttribute('y1', (cy + r1 * Math.sin(a)).toFixed(2));
      line.setAttribute('x2', (cx + r2 * Math.cos(a)).toFixed(2));
      line.setAttribute('y2', (cy + r2 * Math.sin(a)).toFixed(2));
      line.setAttribute('stroke', 'var(--fg)');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-linecap', 'round');
      g.appendChild(line);
    }
    spin(g, 12);
    groups['one'].appendChild(g);
  }

  // dots
  {
    const g = document.createElementNS(ns, 'g');
    const r = 22, count = 12;
    for (let i = 0; i < count; i++) {
      const a = (i * 360 / count) * Math.PI / 180;
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('cx', (cx + r * Math.cos(a)).toFixed(2));
      dot.setAttribute('cy', (cy + r * Math.sin(a)).toFixed(2));
      dot.setAttribute('r', '2');
      dot.setAttribute('fill', 'var(--fg)');
      g.appendChild(dot);
    }
    spin(g, 12);
    groups['two'].appendChild(g);
  }

  // triangles
  {
    const g = document.createElementNS(ns, 'g');
    const n = 12, rOut = 26, rIn = 19;
    for (let i = 0; i < n; i++) {
      const tip = (i * 2 * Math.PI / n) - Math.PI / 2;
      const lBase = tip - Math.PI / n;
      const rBase = tip + Math.PI / n;
      const pts = [
        `${(cx + rOut * Math.cos(tip)).toFixed(2)},${(cy + rOut * Math.sin(tip)).toFixed(2)}`,
        `${(cx + rIn * Math.cos(lBase)).toFixed(2)},${(cy + rIn * Math.sin(lBase)).toFixed(2)}`,
        `${(cx + rIn * Math.cos(rBase)).toFixed(2)},${(cy + rIn * Math.sin(rBase)).toFixed(2)}`,
      ].join(' ');
      const tri = document.createElementNS(ns, 'polygon');
      tri.setAttribute('points', pts);
      tri.setAttribute('fill', 'var(--fg)');
      tri.setAttribute('stroke', 'var(--fg)');
      tri.setAttribute('stroke-width', '0.3');
      tri.setAttribute('stroke-linejoin', 'miter');
      g.appendChild(tri);
    }
    spin(g, 12);
    groups['three'].appendChild(g);
  }

  // arcs
  {
    const g = document.createElementNS(ns, 'g');
    const r = 22;
    function arc(s, e) {
      const sa = (s - 90) * Math.PI / 180, ea = (e - 90) * Math.PI / 180;
      const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
      const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
      const large = e - s > 180 ? 1 : 0;
      return `M ${x1.toFixed(2)},${y1.toFixed(2)} A ${r},${r} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
    }
    // matching CSS
    [[0, 72], [108, 190.8], [226.8, 309.6]].forEach(([s, e]) => {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', arc(s, e));
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'var(--fg)');
      path.setAttribute('stroke-width', '2.5');
      path.setAttribute('stroke-linecap', 'round');
      g.appendChild(path);
    });
    spin(g, 10);
    groups['four'].appendChild(g);
  }

  function applyFX() {
    const fx = link.dataset.fx || 'two';
    Object.entries(groups).forEach(([key, g]) => {
      g.style.opacity = key === fx ? '1' : '0';
    });
  }

  applyFX();

  let switching = false;
  new MutationObserver(() => {
    switching = true;
    svg.style.opacity = '0';
    setTimeout(() => {
      applyFX();
      switching = false;
      if (link.matches(':hover')) svg.style.opacity = '1';
    }, 250);
  }).observe(link, { attributes: true, attributeFilter: ['data-fx'] });

  link.addEventListener('mouseenter', () => { if (!switching) svg.style.opacity = '1'; });
  link.addEventListener('mouseleave',  () => { svg.style.opacity = '0'; });
})();
