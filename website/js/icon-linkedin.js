(() => {
  const ns = 'http://www.w3.org/2000/svg';
  const link = document.querySelector('.linkedin-box .icon-link');
  if (!link) return;

  const W = 38, H = 38;
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

  // inward arrows
  {
    if (!document.getElementById('earr-kf')) {
      const s = document.createElement('style');
      s.id = 'earr-kf';
      s.textContent = `
        @keyframes earr-d{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,3.5px,0)}}
        @keyframes earr-l{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-3.5px,0,0)}}
        @keyframes earr-u{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-3.5px,0)}}
        @keyframes earr-r{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(3.5px,0,0)}}
      `;
      document.head.appendChild(s);
    }
    const cx = W / 2, cy = H / 2;
    [
      [`${cx-5},-11 ${cx+5},-11 ${cx},-3`,            'earr-d', '0ms'],
      [`${W+11},${cy-5} ${W+11},${cy+5} ${W+3},${cy}`, 'earr-l', '150ms'],
      [`${cx-5},${H+11} ${cx+5},${H+11} ${cx},${H+3}`, 'earr-u', '300ms'],
      [`-11,${cy-5} -11,${cy+5} -3,${cy}`,             'earr-r', '450ms'],
    ].forEach(([pts, anim, delay]) => {
      const poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', pts);
      poly.setAttribute('fill', 'var(--fg)');
      poly.style.cssText = `will-change:transform;animation:${anim} 1.4s ease-in-out ${delay} infinite`;
      groups['one'].appendChild(poly);
    });
  }

  // corner arcs
  {
    if (!document.getElementById('li-arc-kf')) {
      const s = document.createElement('style'); s.id = 'li-arc-kf';
      s.textContent = `
        @keyframes li-arc-tl{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-1.5px,-1.5px,0)}}
        @keyframes li-arc-tr{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(1.5px,-1.5px,0)}}
        @keyframes li-arc-br{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(1.5px,1.5px,0)}}
        @keyframes li-arc-bl{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-1.5px,1.5px,0)}}
      `;
      document.head.appendChild(s);
    }
    [
      ['M -2.5,1.5 A 4,4 0 0 1 1.5,-2.5',  'li-arc-tl',   0],
      ['M 36.5,-2.5 A 4,4 0 0 1 40.5,1.5',  'li-arc-tr', 400],
      ['M 40.5,36.5 A 4,4 0 0 1 36.5,40.5', 'li-arc-br', 800],
      ['M 1.5,40.5 A 4,4 0 0 1 -2.5,36.5',  'li-arc-bl', 200],
    ].forEach(([d, anim, delay]) => {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d); path.setAttribute('fill', 'none');
      path.style.cssText = `stroke:var(--fg);stroke-width:2;stroke-linecap:round;will-change:transform;animation:${anim} 1.6s ease-in-out ${delay}ms infinite`;
      groups['two'].appendChild(path);
    });
  }

  // square
  {
    const makeKF = (id, val) => {
      if (!document.getElementById(id)) {
        const s = document.createElement('style');
        s.id = id; s.textContent = `@keyframes ${id}{to{stroke-dashoffset:${val}}}`;
        document.head.appendChild(s);
      }
      return id;
    };
    const p1 = 2 * (W - 1 + H - 1);
    const r1 = document.createElementNS(ns, 'rect');
    r1.setAttribute('x', 0.5); r1.setAttribute('y', 0.5);
    r1.setAttribute('width', W-1); r1.setAttribute('height', H-1);
    r1.setAttribute('fill', 'none');
    r1.style.cssText = `stroke:var(--fg);stroke-width:1.5;stroke-linecap:round;stroke-dasharray:${p1*.25} ${p1*.2} ${p1*.1} ${p1*.45}`;
    r1.style.animation = `${makeKF(`lisp${p1}`, -p1)} 9s linear infinite`;
    groups['four'].appendChild(r1);

    const p2 = 2 * (W - 8 + H - 8);
    const r2 = document.createElementNS(ns, 'rect');
    r2.setAttribute('x', 4); r2.setAttribute('y', 4);
    r2.setAttribute('width', W-8); r2.setAttribute('height', H-8);
    r2.setAttribute('fill', 'none');
    r2.style.cssText = `stroke:var(--fg);stroke-width:1;stroke-linecap:round;stroke-dasharray:${p2*.15} ${p2*.18}`;
    r2.style.animation = `${makeKF(`lispr${p2}`, p2)} 6s linear infinite`;
    groups['four'].appendChild(r2);
  }

  
  // squiggle
  {
    function wavySide(x1,y1,x2,y2,n,amp) {
      const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy);
      const nx=dy/len, ny=-dx/len;
      let d='';
      for(let i=1;i<=n*2;i++){
        const t=i/(n*2), tm=(i-.5)/(n*2), sign=i%2===1?1:-1;
        d+=` Q ${+(x1+dx*tm+nx*amp*sign).toFixed(2)},${+(y1+dy*tm+ny*amp*sign).toFixed(2)} ${+(x1+dx*t).toFixed(2)},${+(y1+dy*t).toFixed(2)}`;
      }
      return d;
    }
    const amp=2.5, n=2;
    const d=`M 0,0${wavySide(0,0,W,0,n,amp)}${wavySide(W,0,W,H,n,amp)}${wavySide(W,H,0,H,n,amp)}${wavySide(0,H,0,0,n,amp)}Z`;
    const p=document.createElementNS(ns,'path');
    p.setAttribute('d',d); p.setAttribute('fill','none');
    p.style.cssText=`stroke:var(--fg);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round`;
    groups['three'].appendChild(p);
    const len=Math.round(p.getTotalLength());
    const vis=60;
    p.style.strokeDasharray=`${vis} ${len-vis}`;
    const kfId=`lisquig_${len}`;
    if (!document.getElementById(kfId)) {
      const s=document.createElement('style'); s.id=kfId;
      s.textContent=`@keyframes ${kfId}{to{stroke-dashoffset:${-len}}}`;
      document.head.appendChild(s);
    }
    p.style.animation=`${kfId} 5s linear infinite`;
  }

  function applyFX() {
    const fx = link.dataset.fx || 'three';
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
