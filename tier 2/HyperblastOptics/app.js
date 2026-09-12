// Custom Smooth Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(cursorDot) cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    if(cursorRing) cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
}
renderCursor();

// Scroll Parallax
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Marquee tracking
    const track = document.querySelector('.hero-bg-ticker, .marquee-track');
    if(track) {
        track.style.transform = `translateX(${-scrollY * 0.15}px)`;
    }

    document.querySelectorAll('.scroll-parallax-img').forEach(imgWrap => {
        const speed = parseFloat(imgWrap.getAttribute('data-speed')) || 0.1;
        const parentRect = imgWrap.closest('.bento-cell').getBoundingClientRect();
        
        if (parentRect.top < window.innerHeight && parentRect.bottom > 0) {
            const offset = (window.innerHeight - parentRect.top) * speed;
            imgWrap.style.transform = `translateY(${-offset * 0.4}px)`;
        }
    });
});

// 3D Tilt Effect
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const dx = (x - xc) / xc;
        const dy = (y - yc) / yc;

        card.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)`;
    });
});

// Modal Controls
function openMenuModal() {
    const m = document.getElementById('menuModal');
    if(m) m.style.display = 'flex';
}
function closeMenuModal() {
    const m = document.getElementById('menuModal');
    if(m) m.style.display = 'none';
}
function openBagModal() {
    const m = document.getElementById('bagModal');
    if(m) m.style.display = 'flex';
}
function closeBagModal() {
    const m = document.getElementById('bagModal');
    if(m) m.style.display = 'none';
}

// Interactive Colorway Switcher
function switchColor(color) {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    event.target.classList.add('active');
    
    const preview = document.getElementById('previewImg');
    if(!preview) return;

    if(color === 'obsidian') {
        preview.src = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop';
    } else if(color === 'crimson') {
        preview.src = 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=1000&auto=format&fit=crop';
    } else if(color === 'titanium') {
        preview.src = 'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1000&auto=format&fit=crop';
    } else if(color === 'amber') {
        preview.src = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop';
    }
}

// Add to Bag Counter
let bagCount = 2;
function addToBag() {
    bagCount++;
    document.getElementById('bag-count').innerText = bagCount;
    const mbCount = document.getElementById('modal-bag-count');
    if(mbCount) mbCount.innerText = bagCount;
    alert('Item successfully secured to archival bag.');
}

// Sound Pulse simulation
function triggerSoundPulse() {
    document.body.style.filter = 'invert(1)';
    setTimeout(() => {
        document.body.style.filter = 'none';
    }, 200);
}

// Catalog Filter
function filterCatalog(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('.catalog-card').forEach(card => {
        if(category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Lab Wave update
function updateWave(val) {
    const freq = document.getElementById('freqVal');
    if(freq) freq.innerText = val;
    const sim = document.getElementById('simScreen');
    if(sim) {
        sim.style.borderColor = `hsl(${val / 2}, 80%, 50%)`;
    }
}
