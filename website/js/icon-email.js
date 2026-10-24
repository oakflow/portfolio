(() => {
  const ns = 'http://www.w3.org/2000/svg';
  const link = document.querySelector('.email-box .icon-link');
  const icon = link && link.querySelector('.emailicon');
  if (!link || !icon) return;

  const W = 48, H = 40;
  const pRect = 2 * (W - 3 + H - 3);
  const cx = W / 2, cy = H / 2;
  const svg = document.createElementNS(ns, 'svg');
  svg.style.cssText = `position:absolute;left:50%;top:50%;transform:translate(calc(-50% + 0.4px),calc(-50% + 0.25px));width:${W}px;height:${H}px;pointer-events:none;opacity:0;transition:opacity .25s ease;overflow:visible`;
  link.appendChild(svg);

  const groups = {};
  ['one','two','three','four'].forEach(fx => {
    const g = document.createElementNS(ns, 'g');
    g.style.opacity = '0';
    groups[fx] = g;
    svg.appendChild(g);
  });

  // ── Keyframes ──────────────────────────────────────────────────
  const kfRect = `rfxr${pRect}`;
  if (!document.getElementById(kfRect)) {
    const s = document.createElement('style');
    s.id = kfRect;
    s.textContent = `@keyframes ${kfRect}{to{stroke-dashoffset:${-pRect}}}`;
    document.head.appendChild(s);
  }

  // dashes
  {
    const r = document.createElementNS(ns, 'rect');
    r.setAttribute('x', 1.5); r.setAttribute('y', 1.5);
    r.setAttribute('width', W-3); r.setAttribute('height', H-3);
    r.setAttribute('rx', 0); r.setAttribute('fill', 'none');
    r.style.cssText = `stroke:var(--fg);stroke-width:2;stroke-linecap:round;stroke-dasharray:10 ${pRect/4-10}`;
    r.style.animation = `${kfRect} 12s linear infinite`;
    groups['three'].appendChild(r);
  }

  // asterisks
  {
    if (!document.getElementById('east-kf')) {
      const s = document.createElement('style'); s.id = 'east-kf';
      s.textContent = `
        @keyframes east-0{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-3.5px,0)}}
        @keyframes east-1{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(3.5px,-2px,0)}}
        @keyframes east-2{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(3.5px,2px,0)}}
        @keyframes east-3{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,3.5px,0)}}
        @keyframes east-4{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-3.5px,2px,0)}}
        @keyframes east-5{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-3.5px,-2px,0)}}
      `;
      document.head.appendChild(s);
    }
    [
      [cx,    -4,   2000,   0],
      [W+4, cy*.4,  1800, 170],
      [W+4, cy*1.6, 2100, 340],
      [cx,  H+4,    1900, 250],
      [-4,  cy*1.6, 2200,  80],
      [-4,  cy*.4,  1700, 420],
    ].forEach(([x, y, dur, dly], i) => {
      const t = document.createElementNS(ns, 'text');
      t.setAttribute('x', x); t.setAttribute('y', y);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('dominant-baseline', 'middle');
      t.setAttribute('font-size', '12');
      t.setAttribute('font-family', 'monospace');
      t.setAttribute('fill', 'var(--fg)');
      t.textContent = '*';
      t.style.cssText = `will-change:transform;animation:east-${i} ${dur}ms ease-in-out ${dly}ms infinite`;
      groups['two'].appendChild(t);
    });
  }

  // zigzag
  {
    function makeZigzag(x1, y1, x2, y2, n, amp) {
      const dx = x2-x1, dy = y2-y1, len = Math.hypot(dx, dy), pts = [];
      for (let i = 1; i < n; i++) {
        const t = i/n, sign = i%2===0 ? 1 : -1;
        pts.push([x1+dx*t+(-dy/len)*amp*sign, y1+dy*t+(dx/len)*amp*sign]);
      }
      return pts;
    }
    const amp = 2, hS = 7, vS = 5;
    let pts = [[1.5,1.5]];
    pts.push(...makeZigzag(1.5,1.5, W-1.5,1.5, hS, amp), [W-1.5,1.5]);
    pts.push(...makeZigzag(W-1.5,1.5, W-1.5,H-1.5, vS, amp), [W-1.5,H-1.5]);
    pts.push(...makeZigzag(W-1.5,H-1.5, 1.5,H-1.5, hS, amp), [1.5,H-1.5]);
    pts.push(...makeZigzag(1.5,H-1.5, 1.5,1.5, vS, amp));
    const d = `M ${pts.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join(' L ')} Z`;
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d); path.setAttribute('fill', 'none');
    path.style.cssText = `stroke:var(--fg);stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round`;
    groups['one'].appendChild(path);
    const pl = path.getTotalLength();
    const kfZ = `rfxz${Math.round(pl)}`;
    if (!document.getElementById(kfZ)) {
      const s = document.createElement('style');
      s.id = kfZ;
      s.textContent = `@keyframes ${kfZ}{to{stroke-dashoffset:${-pl}}}`;
      document.head.appendChild(s);
    }
    path.style.strokeDasharray = `${pl*.18} ${pl*.07}`;
    path.style.animation = `${kfZ} 14s linear infinite`;
  }

  // pacman
  {
    const orbitD = `M -2,-2 L ${W+2},-2 L ${W+2},${H+2} L -2,${H+2} Z`;
    const N = 7, dur = 5;

    for (let i = 1; i < N; i++) {
      const sq = document.createElementNS(ns, 'rect');
      sq.setAttribute('width', '2.5'); sq.setAttribute('height', '2.5');
      sq.setAttribute('x', '-1.25'); sq.setAttribute('y', '-1.25');
      sq.setAttribute('fill', 'var(--fg)');
      const am = document.createElementNS(ns, 'animateMotion');
      am.setAttribute('dur', `${dur}s`); am.setAttribute('repeatCount', 'indefinite');
      am.setAttribute('begin', `${(-i / N * dur).toFixed(2)}s`);
      am.setAttribute('rotate', 'none'); am.setAttribute('path', orbitD);
      sq.appendChild(am);
      groups['four'].appendChild(sq);
    }

    const pac = document.createElementNS(ns, 'g');
    const body = document.createElementNS(ns, 'circle');
    body.setAttribute('r', '4.5'); body.style.fill = 'var(--fg)';
    pac.appendChild(body);

    const mouth = document.createElementNS(ns, 'path');
    mouth.setAttribute('d', 'M 0,0 L 6,6 L 6,-6 Z');
    mouth.style.fill = 'var(--bg)';
    const chompAnim = document.createElementNS(ns, 'animate');
    chompAnim.setAttribute('attributeName', 'd');
    chompAnim.setAttribute('values',
      'M 0,0 L 6,6 L 6,-6 Z;' +
      'M 0,0 L 6,0.1 L 6,-0.1 Z;' +
      'M 0,0 L 6,6 L 6,-6 Z'
    );
    chompAnim.setAttribute('dur', '0.4s');
    chompAnim.setAttribute('repeatCount', 'indefinite');
    mouth.appendChild(chompAnim);
    pac.appendChild(mouth);

    const am = document.createElementNS(ns, 'animateMotion');
    am.setAttribute('dur', `${dur}s`); am.setAttribute('repeatCount', 'indefinite');
    am.setAttribute('begin', '0s');
    am.setAttribute('rotate', 'auto');
    am.setAttribute('path', orbitD);
    pac.appendChild(am);

    groups['four'].appendChild(pac);
  }

  function applyFX() {
    const fx = link.dataset.fx || 'one';
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
