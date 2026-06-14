const canvas = document.getElementById('ropeCanvas');
const ctx = canvas.getContext('2d');
const ropeTabWrapper = document.getElementById('ropeTabWrapper');
const ropeTab = document.getElementById('ropeTab');
const ropeTabLightSrc = 'assets/images/pull-white.svg';
const ropeTabDarkSrc = 'assets/images/pull-black.svg';
let devicePixelRatioScale = window.devicePixelRatio || 1;

// cache for loaded images to persist through inactivity
const imageCache = {};

function preloadRopeTabImages() {
    // Warm the browser cache/decode for both theme images so first pull is instant.
    const sources = [ropeTabLightSrc, ropeTabDarkSrc];
    sources.forEach((src) => {
        const img = new Image();
        img.src = src;
        imageCache[src] = img; // store in cache
        if (typeof img.decode === 'function') {
            img.decode().catch(() => {
                // Ignore decode failures; loading by src is still enough to prime cache.
            });
        }
    });
}

// continuously ensure images stay loaded and cached
function ensureImagesLoaded() {
    const sources = [ropeTabLightSrc, ropeTabDarkSrc];
    sources.forEach((src) => {
        // if not cached, reload it
        if (!imageCache[src] || !imageCache[src].src) {

            const img = new Image();
            img.src = src;
            imageCache[src] = img;
            if (typeof img.decode === 'function') {
                img.decode().catch(() => {});
            }
        }
    });
}

// check img periodically, per sec, to ensure it's loaded
setInterval(ensureImagesLoaded, 1000);

ctx.imageSmoothingEnabled = false;        // standard
ctx.mozImageSmoothingEnabled = false;     // Firefox fallback
ctx.webkitImageSmoothingEnabled = false;  // old webkit fallback
ctx.msImageSmoothingEnabled = false;      // old IE fallback

let dark = true;

function isTouchDevice() {
    return 'ontouchstart' in window ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function syncRopeTabSource() {
    if (ropeTab) {
        const src = dark ? ropeTabLightSrc : ropeTabDarkSrc;
        // ensure image is in cache and loaded
        if (!imageCache[src]) {
            const img = new Image();
            img.src = src;
            imageCache[src] = img;
        }
        ropeTab.src = src;
    }
}

let point = {
    x: 200,
    y: 50,
    oldX: 200,
    oldY: 50
};


// let point1 = { x: 1350, y: -2, oldX: 1350, oldY: -2 };
// let point2 = { x: 1350, y: 5, oldX: 1350, oldY: 5 };
// let point3 = { x: 1350, y: 10, oldX: 1350, oldY: 10 };
// let point4 = { x: 1350, y: 15, oldX: 1350, oldY: 15 };
// let point5 = { x: 1355, y: 20, oldX: 1355, oldY: 20 };
// let point6 = { x: 1350, y: 25, oldX: 1350, oldY: 25 };
// let point7 = { x: 1350, y: 30, oldX: 1350, oldY: 30 };
// let point8 = { x: 1350, y: 35, oldX: 1350, oldY: 35 };
// let point9 = { x: 1350, y: 40, oldX: 1350, oldY: 40 };
// let point10 = { x: 1345, y: 45, oldX: 1345, oldY: 45 };
// let point11 = { x: 1350, y: 50, oldX: 1350, oldY: 50 };
// let point12 = { x: 1350, y: 55, oldX: 1350, oldY: 55 };
// let point13 = { x: 1350, y: 60, oldX: 1350, oldY: 60 };
// let point14 = { x: 1360, y: 65, oldX: 1360, oldY: 65 };
// let point15 = { x: 1350, y: 70, oldX: 1350, oldY: 70 };
// let point16 = { x: 1350, y: 75, oldX: 1350, oldY: 75 };
// let point17 = { x: 1350, y: 80, oldX: 1350, oldY: 80 };
// let point18 = { x: 1350, y: 85, oldX: 1350, oldY: 85 };
// let point19 = { x: 1355, y: 90, oldX: 1355, oldY: 90 };
// let point20 = { x: 1350, y: 95, oldX: 1350, oldY: 95 };
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// Function to get responsive rope X position
function getRopeX() {
    // Check for actual mobile devices only (no width check)
    const isMobile = isTouchDevice();
    
    // from the right edge
    if (isMobile) {
        return window.innerWidth - window.innerWidth/7; // mobile
    }
    return window.innerWidth - window.innerWidth/9.5; // desktop
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
preloadRopeTabImages();
syncRopeTabSource();

function syncCanvasSize() {
    devicePixelRatioScale = window.devicePixelRatio || 1;

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * devicePixelRatioScale);
    canvas.height = Math.round(height * devicePixelRatioScale);
    ctx.setTransform(devicePixelRatioScale, 0, 0, devicePixelRatioScale, 0, 0);
}

syncCanvasSize();

// Initialize rope points with responsive positioning
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


const points = initRopePoints(true); // major offsets on initial load
let point1 = points.point1;
let point2 = points.point2;
let point3 = points.point3;
let point4 = points.point4;
let point5 = points.point5;
let point6 = points.point6;
let point7 = points.point7;
let point8 = points.point8;
let point9 = points.point9;
let point10 = points.point10;
let point11 = points.point11;
let point12 = points.point12;
let point13 = points.point13;
let point14 = points.point14;
let point15 = points.point15;
let point16 = points.point16;
let point17 = points.point17;
let point18 = points.point18;
let point19 = points.point19;
let point20 = points.point20;


// Function to resize canvas and reposition rope
function resizeCanvas() {
    syncCanvasSize();
    
    // Update rope length based on screen size
    L = window.innerWidth < 400 ? 2.5 : 5;
    
    // Reposition rope points when window resizes
    const newPoints = initRopePoints(false); // minor offsets on resize
    
    // Update all point positions while preserving physics state
    point1.x = newPoints.point1.x; point1.oldX = point1.x;
    point2.x = newPoints.point2.x; point2.oldX = point2.x;
    point3.x = newPoints.point3.x; point3.oldX = point3.x;
    point4.x = newPoints.point4.x; point4.oldX = point4.x;
    point5.x = newPoints.point5.x; point5.oldX = point5.x;
    point6.x = newPoints.point6.x; point6.oldX = point6.x;
    point7.x = newPoints.point7.x; point7.oldX = point7.x;
    point8.x = newPoints.point8.x; point8.oldX = point8.x;
    point9.x = newPoints.point9.x; point9.oldX = point9.x;
    point10.x = newPoints.point10.x; point10.oldX = point10.x;
    point11.x = newPoints.point11.x; point11.oldX = point11.x;
    point12.x = newPoints.point12.x; point12.oldX = point12.x;
    point13.x = newPoints.point13.x; point13.oldX = point13.x;
    point14.x = newPoints.point14.x; point14.oldX = point14.x;
    point15.x = newPoints.point15.x; point15.oldX = point15.x;
    point16.x = newPoints.point16.x; point16.oldX = point16.x;
    point17.x = newPoints.point17.x; point17.oldX = point17.x;
    point18.x = newPoints.point18.x; point18.oldX = point18.x;
    point19.x = newPoints.point19.x; point19.oldX = point19.x;
    point20.x = newPoints.point20.x; point20.oldX = point20.x;
}



// Add window resize event listener
window.addEventListener('resize', resizeCanvas);

// Track scroll position for mobile canvas rendering
let scrollOffsetY = 0;
window.addEventListener('scroll', () => {
    scrollOffsetY = window.scrollY;
}, { passive: true });

// Prevent Safari pull-to-refresh on canvas specifically
canvas.addEventListener('touchstart', (e) => {
    // Always prevent default on canvas to stop pull-to-refresh
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    // Always prevent default on canvas to stop scrolling/bouncing
    e.preventDefault();
}, { passive: false });

// Loading screen fade out
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('fade-out');
        // Remove from DOM after fade completes
        setTimeout(() => {
            loadingScreen.remove();
        }, 1600);
    }, 300); // Shorter initial delay for faster response
});


function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.imageSmoothingEnabled = false;        // standard
    ctx.mozImageSmoothingEnabled = false;     // Firefox fallback
    ctx.webkitImageSmoothingEnabled = false;  // old webkit fallback
    ctx.msImageSmoothingEnabled = false;      // old IE fallback

    // On mobile with absolute canvas, draw normally; on desktop (fixed canvas), adjust for scroll
    const isMobileCanvas = isTouchDevice();
    const scrollAdjust = isMobileCanvas ? 0 : scrollOffsetY;

    // -------------------------- ROPE LINE --------------------------

    ctx.lineWidth = Math.min(3, window.innerWidth * 0.004); // thickness
    ctx.lineCap   = "square";     // roundedends
    ctx.strokeStyle = dark ? "#ffffff" : "#000000"; // color
    ctx.beginPath();             
    ctx.moveTo(point1.x, point1.y - scrollAdjust); // jump to beginning
    ctx.lineTo(point2.x, point2.y - scrollAdjust);
    ctx.lineTo(point3.x, point3.y - scrollAdjust);
    ctx.lineTo(point4.x, point4.y - scrollAdjust);
    ctx.lineTo(point5.x, point5.y - scrollAdjust);
    ctx.lineTo(point6.x, point6.y - scrollAdjust);
    ctx.lineTo(point7.x, point7.y - scrollAdjust); 
    ctx.lineTo(point8.x, point8.y - scrollAdjust);
    ctx.lineTo(point9.x, point9.y - scrollAdjust);
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
    ctx.stroke();                    // actually paint

    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(point1.x, point1.y, 10, 0, Math.PI * 2);
    // ctx.fill();


    // ctx.fillStyle = "red"
    // ctx.beginPath();
    // ctx.arc(point2.x, point2.y, 7, 0, Math.PI * 2);
    // ctx.fill();

    // ctx.fillStyle = "red";     
    // ctx.beginPath();
    // ctx.arc(point3.x, point3.y, 7, 0, Math.PI * 2);
    // ctx.fill();

    // ctx.fillStyle = "red";     
    // ctx.beginPath();
    // ctx.arc(point4.x, point4.y, 7, 0, Math.PI * 2);
    // ctx.fill();

    // ctx.fillStyle = "red";     
    // ctx.beginPath();
    // ctx.arc(point5.x, point5.y, 7, 0, Math.PI * 2);
    // ctx.fill();

    // ctx.fillStyle = "red";     
    // ctx.beginPath();
    // ctx.arc(point6.x, point6.y, 7, 0, Math.PI * 2);
    // ctx.fill();
    


    // Calculate smoother angle using multiple points for better interpolation
    const dx1 = point20.x - point18.x; // Use point18 instead of point19 for smoother curve
    const dy1 = point20.y - point18.y;
    const dx2 = point19.x - point17.x; // Additional smoothing vector
    const dy2 = point19.y - point17.y;

    // avg vectors for smoother direction
    const avgDx = (dx1 + dx2) / 2;
    const avgDy = (dy1 + dy2) / 2;
    const angle = Math.atan2(avgDy, avgDx); // convert to angle

    if (ropeTabWrapper && ropeTab) {
        const isMobileTab = isTouchDevice();
        const scale = isMobileTab ? 0.145 : 0.165;
        let width = 510 * scale;
        let height = 510 * scale;

        // Prevent scaling beyond ~300% browser zoom and prevent right-edge clipping on desktop.
        // By capping to 13.15% of the viewport width, the physical size plateaus at 
        // 300% zoom on 1080p, and it perfectly avoids clipping the edge regardless of zoom.
        if (!isMobileTab) {
            const maxAllowed = window.innerWidth * 0.1315;
            if (width > maxAllowed) {
                width = maxAllowed;
                height = maxAllowed;
            }
        }

        ropeTab.style.width = `${width}px`;
        ropeTab.style.height = `${height}px`;
        
        // Set wrapper size for flex centering
        ropeTabWrapper.style.width = `${width}px`;
        ropeTabWrapper.style.height = `${height}px`;

        // On mobile with absolute positioning, no scroll adjustment needed
        // On desktop with fixed canvas, adjust for scroll
        const scrollAdjust = isMobileTab ? 0 : scrollOffsetY;
        
        // Center the wrapper (and thus the image) on the rope endpoint
        ropeTabWrapper.style.left = `${point20.x - width / 2}px`;
        ropeTabWrapper.style.top = `${point20.y - height / 2 - scrollAdjust}px`;
        ropeTabWrapper.style.transform = `rotate(${angle + Math.PI / 2 + Math.PI}rad)`;
    }

}
draw()



let L = 5; // default rope length
const FRICTION = 0.975; // optimal ive found is 0.975


let dragging = false;
let initialGone = false; // to prevent mobile jitter on initial touch
let fixed = false;

G =  .2;    // gravity


// VERLET INTEGRATION
function updatePoint(p) {
    let vx = p.x - p.oldX;
    let vy = p.y - p.oldY;

    p.oldX = p.x;
    p.oldY = p.y;

    p.x = p.x + vx * FRICTION;
    p.y = p.y + vy * FRICTION + G;
        
}

// TRY KEEP ROPE'S LENGTH CONSTANT
function applyConstraint(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let dist = Math.hypot(dx, dy) || 1; // avoid div by 0

    let diff = L - dist;

    let ux = dx / dist;
    let uy = dy / dist;

    let offset = (diff / 2); // equally div

    // pull former point
    a.x = a.x - ux * offset;
    a.y = a.y - uy * offset;

    // push latter point
    b.x = b.x + ux * offset;
    b.y = b.y + uy * offset;
}

function fixedConstraint(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let dist = Math.hypot(dx, dy) || 1; // avoid div by 0

    let diff = L - dist;

    let ux = dx / dist;
    let uy = dy / dist;

    // push latter point
    b.x = b.x + ux * diff;
    b.y = b.y + uy * diff;
}

document.addEventListener('mousedown', (e) => {
    const dx = e.clientX - point20.x;
    const dy = e.clientY - point20.y;
    const d  = Math.hypot(dx, dy) || 1;
    
    if (d <= 25)  {
        dragging = true;
        initialGone = true;
        e.preventDefault(); // stop any usual mouse behaviours while fragging
    }
});

// Touch events for mobile
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - point20.x;
    const dy = touch.clientY - point20.y;
    const d  = Math.hypot(dx, dy) || 1;
    
    if (d <= 35)  { // Slightly larger hit area for mobile
        dragging = true;
        e.preventDefault();
        // Also prevent the default for the whole page to stop pull-to-refresh
        e.stopPropagation();
    }
});

let mouseX = 0
let mouseY = 0

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Touch move for mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;

    if (dragging) {
        initialGone = true;
        e.preventDefault(); // Prevent scrolling when dragging
        e.stopPropagation(); // Stop event bubbling to prevent browser gestures
    }
}
}, { passive: false }); // Important: make sure we can call preventDefault
    
function check() {
    if (dragging && initialGone) {
        point20.y = mouseY;
        point20.x = mouseX;
    };
};

function explode(p) {

    p.x = -p.x;
    p.y = -p.y;

};


document.addEventListener('mouseup', () => {
        if (dragging) {
            dark = !dark;
            
            // preload the next theme's image
            const nextSrc = dark ? ropeTabLightSrc : ropeTabDarkSrc;
            if (!imageCache[nextSrc]) {
                const img = new Image();
                img.src = nextSrc;
                imageCache[nextSrc] = img;
            }
            
            // Add no-transition class to disable transitions during theme change
            document.documentElement.classList.add('no-transition');
            
            // toggle CSS theme by adding/removing light class on html
            if (dark) {
                document.documentElement.classList.remove('light');
            } else {
                document.documentElement.classList.add('light');
            }

            syncRopeTabSource();
            
            // Force a reflow to ensure the theme change happens instantly
            document.documentElement.offsetHeight;
            
            // Remove no-transition class after a brief delay to re-enable hover transitions
            setTimeout(() => {
                document.documentElement.classList.remove('no-transition');
            }, 50);
        };

        dragging = false;
        initialGone = false;
    }
);

// Touch end for mobile
document.addEventListener('touchend', () => {
        if (dragging) {
            dark = !dark;
            
            // preload next theme's image
            const nextSrc = dark ? ropeTabLightSrc : ropeTabDarkSrc;
            if (!imageCache[nextSrc]) {
                const img = new Image();
                img.src = nextSrc;
                imageCache[nextSrc] = img;
            }
            
            // Add no-transition class to disable transitions during theme change
            document.documentElement.classList.add('no-transition');
            
            // toggle CSS theme by adding/removing light class on html
            if (dark) {
                document.documentElement.classList.remove('light');
            } else {
                document.documentElement.classList.add('light');
            }

            syncRopeTabSource();
            
            // Force a reflow to ensure the theme change happens instantly
            document.documentElement.offsetHeight;
            
            // Remove no-transition class after a brief delay to re-enable hover transitions
            setTimeout(() => {
                document.documentElement.classList.remove('no-transition');
            }, 50);
        };
        dragging = false;
        initialGone = false;
    }
);

// function drop() {
    
//         vy += G;
//         bob.y += vy;
//         vy *= FRICTION;
//         draw(); 
//         requestAnimationFrame(drop);
    
// }


// function apply(last) {
//     for (i = 2; i < last; i++) {

//         applyConstraint(point[i], point[i+1]);

//     }

// }

// function update(first, last) {
//     for (i = 2; i <= last; i++) {

//         updatePoint(point[i]);

//     }

// }


function loop(){




check()
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
fixedConstraint(point1, point2);
applyConstraint(point2, point3);
applyConstraint(point3, point4);
applyConstraint(point4, point5);
applyConstraint(point5, point6);
applyConstraint(point6, point7);
applyConstraint(point7, point8);
applyConstraint(point8, point9);
applyConstraint(point9, point10);
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



draw();
requestAnimationFrame(loop);
};

loop()