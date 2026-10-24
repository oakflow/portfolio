(() => {
  const FX = ['one', 'two', 'three', 'four'];
  const links = Array.from(document.querySelectorAll('.icon-link'));
  const githubLink = document.querySelector('.github-box .icon-link');
  let offset = 0;

  function switchAll() {
    links.forEach((link, i) => {
      link.dataset.fx = FX[(i + offset) % FX.length];
    });
  }

  switchAll();

  setInterval(() => {
    if (githubLink) githubLink.classList.add('fx-fade');
    links.forEach(link => {
      if (link.closest('.email-box') || link.closest('.linkedin-box')) return;
      const svg = link.querySelector('svg');
      if (svg && svg.style.opacity === '1') svg.style.opacity = '0';
    });

    setTimeout(() => {
      offset = (offset + 1) % FX.length;
      switchAll();
      if (githubLink) githubLink.classList.remove('fx-fade');
      links.forEach(link => {
        if (link.closest('.email-box') || link.closest('.linkedin-box')) return;
        const svg = link.querySelector('svg');
        if (svg && link.matches(':hover')) svg.style.opacity = '1';
      });
    }, 250);
  }, 2500);
})();
