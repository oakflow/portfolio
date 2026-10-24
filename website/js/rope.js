const canvas = document.getElementById('ropeCanvas');
const ctx = canvas.getContext('2d');
let devicePixelRatioScale = window.devicePixelRatio || 1;

// cache once, avoids a UA-string parse + feature detect on every animation frame
const IS_TOUCH = 'ontouchstart' in window ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function isTouchDevice() { return IS_TOUCH; }

// BOB (pull img)

let bobLight = null; // white bob shown in dark mode
let bobDark  = null; // black bob shown in light mode
let bobSize  = computeBobSize(); // CSS pixels

function computeBobSize() {
    const base = IS_TOUCH ? 81 : 95;
    if (!IS_TOUCH) {
        const maxAllowed = window.innerWidth * 0.1315;
        if (base > maxAllowed) return maxAllowed;
    }
    return base;
}

// three-stage rasterization, fixes the jagged / asymmetric pixel-art look
function rasterizeSVG(src) {
    const physSize = Math.round(bobSize * devicePixelRatioScale);
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            // Stage 1 — render at native SVG size for pixel-perfect path alignment
            const full = document.createElement('canvas');
            full.width = full.height = 510;
            const full2d = full.getContext('2d');
            full2d.imageSmoothingEnabled = false;
            full2d.drawImage(img, 0, 0, 510, 510);

            // Stage 2 — exact 3:1 downscale to the art's true resolution (170px)
            const mid = document.createElement('canvas');
            mid.width = mid.height = 170;
            const mid2d = mid.getContext('2d');
            mid2d.imageSmoothingEnabled = true;
            mid2d.imageSmoothingQuality = 'high';
            mid2d.drawImage(full, 0, 0, 170, 170);

            // Stage 3 — final scale to the physical on-screen pixel size
            const oc = document.createElement('canvas');
            oc.width = oc.height = physSize;
            const oc2d = oc.getContext('2d');
            // Always nearest-neighbour: bilinear at non-integer ratios (e.g. 170→128 at DPR 1.5)
            // bleeds pixel-art edges together. Nearest-neighbour stays crisp at any DPR.
            oc2d.imageSmoothingEnabled = false;
            oc2d.drawImage(mid, 0, 0, physSize, physSize);

            resolve(oc);
        };
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

function loadBobs() {
    return Promise.all([
        rasterizeSVG('assets/images/pull-white.svg'),
        rasterizeSVG('assets/images/pull-black.svg'),
    ]).then(([light, dark_bob]) => {
        bobLight = light;
        bobDark  = dark_bob;
    });
}

loadBobs();

// THEME STATE
let dark = localStorage.getItem('theme') !== 'light';
if (!dark) document.documentElement.setAttribute('data-theme', 'light');

// CANVAS SETUP 
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

function syncCanvasSize() {
    devicePixelRatioScale = window.devicePixelRatio || 1;
    const width  = window.innerWidth;
    const height = window.innerHeight;
    canvas.style.width  = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width  = Math.round(width  * devicePixelRatioScale);
    canvas.height = Math.round(height * devicePixelRatioScale);
    ctx.setTransform(devicePixelRatioScale, 0, 0, devicePixelRatioScale, 0, 0);
    // imageSmoothingEnabled resets whenever canvas dimensions are reassigned
    ctx.imageSmoothingEnabled = false;
}

syncCanvasSize();

// ROPE POINT POSITIONING
function getRopeX() {
    return IS_TOUCH
        ? window.innerWidth - window.innerWidth / 7     // mobile
        : window.innerWidth - window.innerWidth / 9.5;  // desktop
}

function initRopePoints(major) {
    
    const ropeX = getRopeX();

    let offset1, offset2, offset3, offset4;

    if (major) {
    // add some randomn offsets for a more natural look
    offset1 = Math.floor((Math.random() * 5) + 55);
    if (Math.random() < 0.5) {offset1 = -offset1;};
    offset2 = Math.floor((Math.random() * 5) + 55);
    if (Math.random() < 0.5) {offset2 = -offset2;};
    offset3 = Math.floor((Math.random() * 5) + 55);
    if (Math.random() < 0.5) {offset3 = -offset3;};
    offset4 = Math.floor((Math.random() * 5) + 55);
    if (Math.random() < 0.5) {offset4 = -offset4;};
    } 

    else {

    offset1 = Math.floor((Math.random() * 2) + 2);
    if (Math.random() < 0.5) {offset1 = -offset1;};
    offset2 = Math.floor((Math.random() * 2) + 2);
    if (Math.random() < 0.5) {offset2 = -offset2;};
    offset3 = Math.floor((Math.random() * 2) + 2);
    if (Math.random() < 0.5) {offset3 = -offset3;};
    offset4 = Math.floor((Math.random() * 1.5) + 1);
    if (Math.random() < 0.5) {offset4 = -offset4;};

    }


    return {
        point1: { x: ropeX, y: -2, oldX: ropeX, oldY: -2 },
        point2: { x: ropeX, y: 5, oldX: ropeX, oldY: 5 },
        point3: { x: ropeX, y: 10, oldX: ropeX, oldY: 10 },
        point4: { x: ropeX, y: 15, oldX: ropeX, oldY: 15 },
        point5: { x: ropeX + offset1, y: 20, oldX: ropeX + offset1, oldY: 20 },
        point6: { x: ropeX, y: 25, oldX: ropeX, oldY: 25 },
        point7: { x: ropeX, y: 30, oldX: ropeX, oldY: 30 },
        point8: { x: ropeX, y: 35, oldX: ropeX, oldY: 35 },
        point9: { x: ropeX, y: 40, oldX: ropeX, oldY: 40 },
        point10: { x: ropeX + offset2, y: 45, oldX: ropeX + offset2, oldY: 45 },
        point11: { x: ropeX, y: 50, oldX: ropeX, oldY: 50 },
        point12: { x: ropeX, y: 55, oldX: ropeX, oldY: 55 },
        point13: { x: ropeX, y: 60, oldX: ropeX, oldY: 60 },
        point14: { x: ropeX + offset3, y: 65, oldX: ropeX + offset3, oldY: 65 },
        point15: { x: ropeX, y: 70, oldX: ropeX, oldY: 70 },
        point16: { x: ropeX, y: 75, oldX: ropeX, oldY: 75 },
        point17: { x: ropeX, y: 80, oldX: ropeX, oldY: 80 },
        point18: { x: ropeX, y: 85, oldX: ropeX, oldY: 85 },
        point19: { x: ropeX + offset4, y: 90, oldX: ropeX + offset4, oldY: 90 },
        point20: { x: ropeX, y: 95, oldX: ropeX, oldY: 95 }
    };
}

const _pts = initRopePoints(true);
let point1  = _pts.point1;
let point2  = _pts.point2;
let point3  = _pts.point3;
let point4  = _pts.point4;
let point5  = _pts.point5;
let point6  = _pts.point6;
let point7  = _pts.point7;
let point8  = _pts.point8;
let point9  = _pts.point9;
let point10 = _pts.point10;
let point11 = _pts.point11;
let point12 = _pts.point12;
let point13 = _pts.point13;
let point14 = _pts.point14;
let point15 = _pts.point15;
let point16 = _pts.point16;
let point17 = _pts.point17;
let point18 = _pts.point18;
let point19 = _pts.point19;
let point20 = _pts.point20;

// RESIZE
function resizeCanvas() {
    const prevDPR = devicePixelRatioScale;
    syncCanvasSize();
    L = window.innerWidth < 400 ? 2.5 : 5;

    // re-rasterize if bob CSS size changed OR if DPR changed (zoom)
    const newSize = computeBobSize();
    if (Math.abs(newSize - bobSize) > 0.5 || devicePixelRatioScale !== prevDPR) {
        bobSize = newSize;
        loadBobs(); // async, old canvases stay active until new ones resolve
    }

    const np = initRopePoints(false);
    point1.x  = np.point1.x;  point1.oldX  = point1.x;
    point2.x  = np.point2.x;  point2.oldX  = point2.x;
    point3.x  = np.point3.x;  point3.oldX  = point3.x;
    point4.x  = np.point4.x;  point4.oldX  = point4.x;
    point5.x  = np.point5.x;  point5.oldX  = point5.x;
    point6.x  = np.point6.x;  point6.oldX  = point6.x;
    point7.x  = np.point7.x;  point7.oldX  = point7.x;
    point8.x  = np.point8.x;  point8.oldX  = point8.x;
    point9.x  = np.point9.x;  point9.oldX  = point9.x;
    point10.x = np.point10.x; point10.oldX = point10.x;
    point11.x = np.point11.x; point11.oldX = point11.x;
    point12.x = np.point12.x; point12.oldX = point12.x;
    point13.x = np.point13.x; point13.oldX = point13.x;
    point14.x = np.point14.x; point14.oldX = point14.x;
    point15.x = np.point15.x; point15.oldX = point15.x;
    point16.x = np.point16.x; point16.oldX = point16.x;
    point17.x = np.point17.x; point17.oldX = point17.x;
    point18.x = np.point18.x; point18.oldX = point18.x;
    point19.x = np.point19.x; point19.oldX = point19.x;
    point20.x = np.point20.x; point20.oldX = point20.x;
}

window.addEventListener('resize', resizeCanvas);

// SCROLL TRACKING
let scrollOffsetY = 0;
window.addEventListener('scroll', () => { scrollOffsetY = window.scrollY; }, { passive: true });

// PREVENT SAFARI PULL-TO-REFRESH ON CANVAS
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); }, { passive: false });
canvas.addEventListener('touchmove',  (e) => { e.preventDefault(); }, { passive: false });

// LOADING SCREEN FADE
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('fade-out');
        setTimeout(() => { loadingScreen.remove(); }, 1600);
    }, 300);
});


function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // On mobile (absolute canvas) no scroll adjustment is needed
    // On desktop (fixed canvas) shift drawing upward by scroll offset
    const scrollAdjust = IS_TOUCH ? 0 : scrollOffsetY;

    // ── rope line ──
    ctx.lineWidth   = Math.min(3, window.innerWidth * 0.004);
    ctx.lineCap     = 'square';
    ctx.strokeStyle = dark ? '#ffffff' : '#000000';
    ctx.beginPath();
    ctx.moveTo(point1.x,  point1.y  - scrollAdjust);
    ctx.lineTo(point2.x,  point2.y  - scrollAdjust);
    ctx.lineTo(point3.x,  point3.y  - scrollAdjust);
    ctx.lineTo(point4.x,  point4.y  - scrollAdjust);
    ctx.lineTo(point5.x,  point5.y  - scrollAdjust);
    ctx.lineTo(point6.x,  point6.y  - scrollAdjust);
    ctx.lineTo(point7.x,  point7.y  - scrollAdjust);
    ctx.lineTo(point8.x,  point8.y  - scrollAdjust);
    ctx.lineTo(point9.x,  point9.y  - scrollAdjust);
    ctx.lineTo(point10.x, point10.y - scrollAdjust);
    ctx.lineTo(point11.x, point11.y - scrollAdjust);
    ctx.lineTo(point12.x, point12.y - scrollAdjust);
    ctx.lineTo(point13.x, point13.y - scrollAdjust);
    ctx.lineTo(point14.x, point14.y - scrollAdjust);
    ctx.lineTo(point15.x, point15.y - scrollAdjust);
    ctx.lineTo(point16.x, point16.y - scrollAdjust);
    ctx.lineTo(point17.x, point17.y - scrollAdjust);
    ctx.lineTo(point18.x, point18.y - scrollAdjust);
    ctx.lineTo(point19.x, point19.y - scrollAdjust);
    ctx.lineTo(point20.x, point20.y - scrollAdjust);
    ctx.stroke();

    // ── bob ──
    // avg two direction vectors for a smoother rotation angle
    const dx1 = point20.x - point18.x;
    const dy1 = point20.y - point18.y;
    const dx2 = point19.x - point17.x;
    const dy2 = point19.y - point17.y;
    const bobAngle = Math.atan2((dy1 + dy2) / 2, (dx1 + dx2) / 2) + Math.PI / 2 + Math.PI;

    const bob = dark ? bobLight : bobDark;
    if (bob) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.translate(point20.x + (dark ? 1.7 : 0), point20.y - scrollAdjust);
        ctx.rotate(bobAngle);
        // Draw at bobSize CSS pixels; DPR transform maps that to physSize physical
        // pixels which is exactly the size the canvas was rasterized at → 1:1, no scaling
        ctx.drawImage(bob, -bobSize / 2, -bobSize / 2, bobSize, bobSize);
        ctx.restore();
    }
}

draw();

// ------------ PHYSICS ------------
let L = 5; // default rope length
const FRICTION = 0.98; // optimal I've found is 0.98, the higher this is the bouncier
const G = 0.2; // gravity

// VERLET INTEGRATION
function updatePoint(p) {
    const vx = p.x - p.oldX;
    const vy = p.y - p.oldY;

    p.oldX = p.x;
    p.oldY = p.y;

    p.x += vx * FRICTION;
    p.y += vy * FRICTION + G;
}

// KEEPS ROPE'S LENGTH CONSISTENT
function applyConstraint(a, b) {
    const dx   = b.x - a.x;
    const dy   = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;

    const diff = L - dist;

    const ux   = dx / dist;
    const uy   = dy / dist;

    const offset  = diff / 2;

    // pull former point
    a.x = a.x - ux * offset;
    a.y = a.y - uy * offset;

    // push latter point
    b.x = b.x + ux * offset;
    b.y = b.y + uy * offset;
}


function fixedConstraint(a, b) {
    const dx   = b.x - a.x;
    const dy   = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    const diff = L - dist;
    const ux   = dx / dist;
    const uy   = dy / dist;
    b.x += ux * diff;
    b.y += uy * diff;
}

// INPUT HANDLING
let dragging    = false;
let initialGone = false; // to prevent mobile jitter on initial touch

document.addEventListener('mousedown', (e) => {
    const dx = e.clientX - point20.x;
    const dy = e.clientY - point20.y;
    if (Math.hypot(dx, dy) <= 25) {
        dragging = true;
        initialGone = true;
        e.preventDefault();
    }
});

document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - point20.x;
    const dy = touch.clientY - point20.y;
    if (Math.hypot(dx, dy) <= 35) {
        dragging = true;
        e.preventDefault();
        e.stopPropagation();
    }
});

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        if (dragging) {
            initialGone = true;
            e.preventDefault();
            e.stopPropagation();
        }
    }
}, { passive: false });

function check() {
    if (dragging && initialGone) {
        point20.x = mouseX;
        point20.y = mouseY;
    }
}

// shared theme toggle logic used by both mouse and touch release
function applyThemeToggle() {
    dark = !dark;
    const newTheme = dark ? 'dark' : 'light';

    requestAnimationFrame(() => {
        document.documentElement.classList.add('no-transition');
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        requestAnimationFrame(() => {
            document.documentElement.classList.remove('no-transition');
        });
    });
}

document.addEventListener('mouseup', () => {
    if (dragging) applyThemeToggle();
    dragging = false;
    initialGone = false;
});

document.addEventListener('touchend', () => {
    if (dragging) applyThemeToggle();
    dragging = false;
    initialGone = false;
});

// ANIMATION LOOP
const FIXED_DT = 1000 / 60;
let lastTime = 0;

function physicsStep() {
    check();
    updatePoint(point2);
    updatePoint(point3);
    updatePoint(point4);
    updatePoint(point5);
    updatePoint(point6);
    updatePoint(point7);
    updatePoint(point8);
    updatePoint(point9);
    updatePoint(point10);
    updatePoint(point11);
    updatePoint(point12);
    updatePoint(point13);
    updatePoint(point14);
    updatePoint(point15);
    updatePoint(point16);
    updatePoint(point17);
    updatePoint(point18);
    updatePoint(point19);
    updatePoint(point20);
    fixedConstraint(point1,  point2);
    applyConstraint(point2,  point3);
    applyConstraint(point3,  point4);
    applyConstraint(point4,  point5);
    applyConstraint(point5,  point6);
    applyConstraint(point6,  point7);
    applyConstraint(point7,  point8);
    applyConstraint(point8,  point9);
    applyConstraint(point9,  point10);
    applyConstraint(point10, point11);
    applyConstraint(point11, point12);
    applyConstraint(point12, point13);
    applyConstraint(point13, point14);
    applyConstraint(point14, point15);
    applyConstraint(point15, point16);
    applyConstraint(point16, point17);
    applyConstraint(point17, point18);
    applyConstraint(point18, point19);
    applyConstraint(point19, point20);
}

function loop(timestamp) {
    // cap to avoid spiral of death
    const elapsed = lastTime ? Math.min(timestamp - lastTime, 100) : FIXED_DT;
    lastTime = timestamp;

    // run extra steps for any dropped frames so the wiggle stays smooth
    const steps = Math.max(1, Math.round(elapsed / FIXED_DT));
    for (let s = 0; s < steps; s++) physicsStep();

    draw();
    requestAnimationFrame(loop);
}

window.addEventListener('load', () => {
    // run physics silently through the initial offset phase so rope is moving on load
    for (let i = 0; i < 8; i++) physicsStep();
    requestAnimationFrame(loop);
});