document.querySelectorAll('.about-marquee a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.href;

    document.body.style.overflow = 'hidden';

    const footer = document.querySelector('.footer');
    const header = document.querySelector('.header');
    const main   = document.querySelector('.main-content');
    const rope   = document.getElementById('ropeCanvas');

    // Footer drops DOWN off the bottom
    if (footer) {
      footer.style.transition = 'transform 0.5s cubic-bezier(0.4,0,1,1)';
      footer.style.transform  = 'translateY(100vh)';
    }

    // Header slides up
    if (header) {
      header.style.transition = 'transform 0.5s cubic-bezier(0.4,0,1,1)';
      header.style.transform  = 'translateY(-100vh)';
    }

    // Content + rope slide up
    [main, rope].filter(Boolean).forEach(el => {
      el.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.6,1)';
      el.style.transform  = 'translateY(-100vh)';
    });

    setTimeout(() => { window.location.href = href; }, 750);
  });
});
