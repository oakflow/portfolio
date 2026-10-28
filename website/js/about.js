// Theme toggle
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

html.classList.add('no-transition');
applyTheme(localStorage.getItem('theme') || 'dark');
requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('no-transition')));

let themeAnimTimer;
document.querySelector('.theme-segmented').addEventListener('click', () => {
  const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  requestAnimationFrame(() => {
    html.classList.add('theme-anim');
    clearTimeout(themeAnimTimer);
    themeAnimTimer = setTimeout(() => html.classList.remove('theme-anim'), 350);
    html.classList.add('no-transition');
    applyTheme(newTheme);
    requestAnimationFrame(() => html.classList.remove('no-transition'));
  });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.s-nav a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.s-nav a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.15 });

sections.forEach(s => observer.observe(s));

// project link arrow
const arrowFrames = [
  { transform: 'translate(0, 0)',         offset: 0 },
  { transform: 'translate(120%, -120%)',  offset: 0.45 },
  { transform: 'translate(-120%, 120%)',  offset: 0.46 },
  { transform: 'translate(0, 0)',         offset: 1 },
];
const arrowTiming = { duration: 420, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' };

document.querySelectorAll('.proj-link').forEach(link => {
  const svg = link.querySelector('.proj-arrow svg');
  let anim = null;
  let goingForward = false;

  const play = (forward) => {
    if (anim && anim.playState === 'running') {
      if (goingForward !== forward) anim.reverse();
    } else {
      anim = svg.animate(arrowFrames, { ...arrowTiming, direction: forward ? 'normal' : 'reverse' });
    }
    goingForward = forward;
  };

  link.addEventListener('mouseenter', () => play(true));
  link.addEventListener('mouseleave', () => play(false));
});

// overscroll area matches footer, but only once the enter animation is done
function setOverscrollFooter(on) {
  html.style.transition = 'none';
  html.classList.toggle('overscroll-footer', on);
  html.offsetHeight;
  html.style.transition = '';
}
document.body.addEventListener('animationend', e => {
  if (e.target === document.body) setOverscrollFooter(true);
});

document.querySelectorAll('.s-back, .s-name').forEach(el => el.addEventListener('click', e => {
  e.preventDefault();
  const href = e.currentTarget.href;
  setOverscrollFooter(false);
  window.scrollTo(0, 0);
  document.body.style.animation = 'none';
  document.body.offsetHeight;
  document.body.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.6,1)';
  document.body.style.transform = 'translateY(100vh)';
  setTimeout(() => { window.location.href = href; }, 750);
}));
