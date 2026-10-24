(() => {
  const name = document.querySelector('.name');
  const hero = document.querySelector('.hero-content');

  if (!name || !hero) return;

  const syncHeroWidth = () => {
    hero.style.setProperty('--hero-width', `${Math.ceil(name.getBoundingClientRect().width)}px`);
  };

  const scheduleSync = () => requestAnimationFrame(syncHeroWidth);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleSync);
  }

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(scheduleSync);
    observer.observe(name);
  } else {
    window.addEventListener('resize', scheduleSync);
  }

  scheduleSync();
})();
