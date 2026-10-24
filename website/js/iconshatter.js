const gbox = document.querySelector('.github-box');
const lbox = document.querySelector('.linkedin-box');
const ebox = document.querySelector('.email-box');



gbox.addEventListener('mouseenter', () => {

    x1 = - Math.floor((Math.random() * 100) + 50);
    y1 = - Math.floor((Math.random() * 40) + 20);
    x2 = - Math.floor((Math.random() * 100) + 50);
    y2 = Math.floor((Math.random() * 40) + 20);
    x3 = - Math.floor((Math.random() * 100) + 50);
    y3 = - Math.floor((Math.random() * 40) + 20);
    x4 = - Math.floor((Math.random() * 100) + 50);
    y4 = Math.floor((Math.random() * 40) + 20);
    x5 = - Math.floor((Math.random() * 100) + 50);
    y5 = - Math.floor((Math.random() * 40) + 20);
    x6 = - Math.floor((Math.random() * 100) + 50);
    y6 = Math.floor((Math.random() * 40) + 20);
    x7 = -  Math.floor((Math.random() * 100) + 50);
    y7 = - Math.floor((Math.random() * 40) + 20);
    x8 = - Math.floor((Math.random() * 100) + 50);
    y8 = Math.floor((Math.random() * 40) + 20);

    gbox.style.setProperty('--x1', `${x1}px`);
    gbox.style.setProperty('--y1', `${y1}px`);
    gbox.style.setProperty('--x2', `${x2}px`);
    gbox.style.setProperty('--y2', `${y2}px`);
    gbox.style.setProperty('--x3', `${x3}px`);
    gbox.style.setProperty('--y3', `${y3}px`);
    gbox.style.setProperty('--x4', `${x4}px`);
    gbox.style.setProperty('--y4', `${y4}px`);
    gbox.style.setProperty('--x5', `${x5}px`);
    gbox.style.setProperty('--y5', `${y5}px`);
    gbox.style.setProperty('--x6', `${x6}px`);
    gbox.style.setProperty('--y6', `${y6}px`);
    gbox.style.setProperty('--x7', `${x7}px`);
    gbox.style.setProperty('--y7', `${y7}px`);
    gbox.style.setProperty('--x8', `${x8}px`);
    gbox.style.setProperty('--y8', `${y8}px`);
});

lbox.addEventListener('mouseenter', () => {
    
    x1 = Math.floor((Math.random() * 100) + 50);
    y1 = - Math.floor((Math.random() * 40) + 20);
    x2 = Math.floor((Math.random() * 100) + 50);
    y2 = Math.floor((Math.random() * 40) + 20);
    x3 = Math.floor((Math.random() * 100) + 50);
    y3 = - Math.floor((Math.random() * 40) + 20);
    x4 = Math.floor((Math.random() * 100) + 50);
    y4 = Math.floor((Math.random() * 40) + 20);
    x5 = Math.floor((Math.random() * 100) + 50);
    y5 = - Math.floor((Math.random() * 40) + 20);
    x6 = Math.floor((Math.random() * 100) + 50);
    y6 = Math.floor((Math.random() * 40) + 20);
    x7 = Math.floor((Math.random() * 100) + 50);
    y7 = - Math.floor((Math.random() * 40) + 20);
    x8 = Math.floor((Math.random() * 100) + 50);
    y8 = Math.floor((Math.random() * 40) + 20);

    lbox.style.setProperty('--x1', `${x1}px`);
    lbox.style.setProperty('--y1', `${y1}px`);
    lbox.style.setProperty('--x2', `${x2}px`);
    lbox.style.setProperty('--y2', `${y2}px`);
    lbox.style.setProperty('--x3', `${x3}px`);
    lbox.style.setProperty('--y3', `${y3}px`);
    lbox.style.setProperty('--x4', `${x4}px`);
    lbox.style.setProperty('--y4', `${y4}px`);
    lbox.style.setProperty('--x5', `${x5}px`);
    lbox.style.setProperty('--y5', `${y5}px`);
    lbox.style.setProperty('--x6', `${x6}px`);
    lbox.style.setProperty('--y6', `${y6}px`);
    lbox.style.setProperty('--x7', `${x7}px`);
    lbox.style.setProperty('--y7', `${y7}px`);
    lbox.style.setProperty('--x8', `${x8}px`);
    lbox.style.setProperty('--y8', `${y8}px`);

});


ebox.addEventListener('mouseenter', () => {
    
    x1 = Math.floor((Math.random() * 20) + 18);
    y1 = Math.floor((Math.random() * 20) + 18);
    x2 = - Math.floor((Math.random() * 20) + 18);
    y2 = - Math.floor((Math.random() * 20) + 18);
    x3 = -Math.floor((Math.random() * 20) + 18);
    y3 = Math.floor((Math.random() * 20) + 18);

    x4 = Math.floor((Math.random() * 20) + 18);
    y4 = - Math.floor((Math.random() * 20) + 18);


    ebox.style.setProperty('--x1', `${x1}px`);
    ebox.style.setProperty('--y1', `${y1}px`);
    ebox.style.setProperty('--x2', `${x2}px`);
    ebox.style.setProperty('--y2', `${y2}px`);
    ebox.style.setProperty('--x3', `${x3}px`);
    ebox.style.setProperty('--y3', `${y3}px`);
    ebox.style.setProperty('--x4', `${x4}px`);
    ebox.style.setProperty('--y4', `${y4}px`);
});