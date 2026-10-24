(() => {
  const track = document.querySelector('.about-track');
  const marquee = document.querySelector('.about-marquee');
  if (!track || !marquee) return;

  const anim = track.animate(
    [{ transform: 'translateX(-50%)' }, { transform: 'translateX(0)' }],
    { duration: 35000, iterations: Infinity, easing: 'linear' }
  );

  marquee.addEventListener('mouseenter', () => { anim.playbackRate = 14 / 30; });
  marquee.addEventListener('mouseleave', () => { anim.playbackRate = 1; });
})();
