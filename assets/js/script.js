/* Punch reveal observer */
const punchElements = document.querySelectorAll('.punch-text, .punch-impact');
const punchObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active') }) }, { threshold: .4 });
punchElements.forEach(el => punchObserver.observe(el));

/* Slam overlay on scroll (repeatable with short cooldown) */
let lastSlamTime = 0;
const SLAM_COOLDOWN = 1200; // ms between repeated slams
window.addEventListener('scroll', () => {
    const trigger = document.body.scrollHeight * .75;
    if (window.scrollY + window.innerHeight > trigger) {
        const now = Date.now();
        if (now - lastSlamTime > SLAM_COOLDOWN) {
            lastSlamTime = now;
            const slam = document.getElementById('slamOverlay');
            if (slam) {
                slam.classList.add('active');
                setTimeout(() => slam.classList.remove('active'), 700);
            }
        }
    }
});

/* Flavour / can / arena logic consolidated */
(function () {
    const canMap = { original: '/our-brands/red-kangaroo/assets/images/Red Kangaroo original fv.png', mango: '/our-brands/red-kangaroo/assets/images/Red Kangaroo mango (FV).png', blue: '/our-brands/red-kangaroo/assets/images/Red Kangaroo blue (FV).png', lime: '/our-brands/red-kangaroo/assets/images/Red Kangaroo lime (FV).png', zero: '/our-brands/red-kangaroo/assets/images/Red Kangaroo zero (FV).png' };
    const flavorBtns = document.querySelectorAll('.flavor-btn1, .flavor-btn2, .flavor-btn3, .flavor-btn4, .flavor-btn5');
    const productCards = document.querySelectorAll('.product-card');
    const canImg = document.getElementById('canImage');
    const canStage = document.querySelector('.can-stage');
    const arena = document.getElementById('productArena');

    function setFlavor(flavor, btn) {
        // buttons
        flavorBtns.forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');

        // product cards
        productCards.forEach(card => card.classList.toggle('active', card.dataset.flavor === flavor));

        // arena background
        if (arena) { arena.classList.remove('arena-original', 'arena-crimson', 'arena-black'); arena.classList.add(`arena-${flavor}`); arena.classList.add('hit'); setTimeout(() => arena.classList.remove('hit'), 300) }

        // can rotate + swap
        if (canImg) { canImg.classList.remove('hit'); canImg.classList.add('rotate'); setTimeout(() => { canImg.src = canMap[flavor] || canMap.original; canImg.classList.remove('rotate'); canImg.classList.add('hit'); }, 220) }
    }

    flavorBtns.forEach(btn => { btn.addEventListener('click', () => setFlavor(btn.dataset.flavor, btn)) });

    // mouse tilt
    if (canStage && canImg) {
        // Add hover state so cursor-over zoom is stronger than the default mouse-tilt
        canStage.addEventListener('mouseenter', () => canStage.classList.add('hover-zoom'));
        canStage.addEventListener('mouseleave', () => {
            canStage.classList.remove('hover-zoom');
            canImg.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });

        canStage.addEventListener('mousemove', (e) => {
            const rect = canStage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            const scale = canStage.classList.contains('hover-zoom') ? 1.10 : 1.02;
            canImg.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        });
    }

    // scroll power + arena energy
    window.addEventListener('scroll', () => {
        if (canStage && canImg) {
            const rect = canStage.getBoundingClientRect(); const vh = window.innerHeight; if (rect.top < vh && rect.bottom > 0) { const progress = 1 - Math.abs(rect.top - vh / 2) / (vh / 2); const clamped = Math.max(0, Math.min(progress, 1)); const scale = 1 + clamped * .35; const translateY = clamped * -30; const glow = clamped * 25; canImg.style.transform = `scale(${scale}) translateY(${translateY}px)`; canImg.style.filter = `drop-shadow(0 0 ${glow}px rgba(255,0,0,0.6))` }
        }

        if (arena) { const rectA = arena.getBoundingClientRect(); const vh = window.innerHeight; if (rectA.top < vh && rectA.bottom > 0) { const progress = 1 - Math.abs(rectA.top - vh / 2) / (vh / 2); const power = Math.max(0, Math.min(progress, 1)); arena.style.setProperty('--energy', power * .45); arena.style.backgroundPosition = `${50 + power * 2}% ${50 - power * 2}%` } }
    }, { passive: true });

})();

/* CTA -> KO overlay */
(function () {
    const cta = document.querySelector('.cta');
    const ko = document.getElementById('koOverlay');
    if (!cta || !ko) return;
    const koHit = ko.querySelector('.ko-hit');
    const koLine = ko.querySelector('.ko-line');
    cta.addEventListener('click', () => {
        ko.classList.add('active'); document.body.classList.add('ko-shake');
        setTimeout(() => { koLine.style.animation = 'koLine .3s forwards' }, 120);
        setTimeout(() => { koHit.style.animation = 'koHit .5s cubic-bezier(.1,.9,.2,1) forwards' }, 180);
        setTimeout(() => { ko.classList.remove('active'); document.body.classList.remove('ko-shake'); koHit.style.animation = ''; koLine.style.animation = '' }, 900);
    });
})();


const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");

function showHamburger() {
    if (hamburger) {
        hamburger.style.display = '';
        hamburger.setAttribute('aria-hidden', 'false');
    }
}

function hideHamburger() {
    if (hamburger) {
        hamburger.style.display = 'none';
        hamburger.setAttribute('aria-hidden', 'true');
    }
}

function openSidebar() {
    sidebar.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    hideHamburger();
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    showHamburger();
}

// Open sidebar
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    openSidebar();
});

// Close sidebar
closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSidebar();
});

// Close if user clicks outside the sidebar or presses Escape
window.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && e.target !== hamburger) {
        closeSidebar();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSidebar();
    }
});

const canImage = document.getElementById('canImage');
const flavorBtns = document.querySelectorAll('[data-flavor]');

const flavorImages = {
    original: { fv: 'Red Kangaroo original fv.png', bv: 'Red Kangaroo original bv.png' },
    mango: { fv: 'Red Kangaroo mango (FV).png', bv: 'Red Kangaroo mango (BV).png' },
    blue: { fv: 'Red Kangaroo blue (FV).png', bv: 'Red Kangaroo blue (BV).png' },
    lime: { fv: 'Red Kangaroo lime (FV).png', bv: 'Red Kangaroo lime (BV).png' },
    zero: { fv: 'Red Kangaroo zero (FV).png', bv: 'Red Kangaroo zero (BV).png' }
};

let currentFlavor = 'original';
let isBackView = false;
const imagePath = '/our-brands/red-kangaroo/assets/images/';

// Add smooth transition to image
canImage.style.transition = 'opacity 1s cubic-bezier(0.2, 0.0, 0.1, 1)';

function updateImage() {
    const frontImg = flavorImages[currentFlavor].fv;
    canImage.src = imagePath + frontImg;
    console.log('Flavor changed to:', currentFlavor, 'Loading:', frontImg);
}

flavorBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const flavor = this.getAttribute('data-flavor');
        console.log('Button clicked:', flavor);

        if (flavor && flavor in flavorImages) {
            currentFlavor = flavor;
            isBackView = false;
            updateImage();

            // Update active button styling
            flavorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Show only the matching product card, hide others
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.style.display = (card.dataset.flavor === flavor) ? 'block' : 'none';
            });
        }
    });
});

canImage.addEventListener('mouseenter', function () {
    canImage.style.opacity = '0';
    setTimeout(() => {
        const backImg = flavorImages[currentFlavor].bv;
        canImage.src = imagePath + backImg;
        isBackView = true;
        canImage.style.opacity = '1';
        console.log('Back view:', backImg);
    }, 400);
});

canImage.addEventListener('mouseleave', function () {
    canImage.style.opacity = '0';
    setTimeout(() => {
        const frontImg = flavorImages[currentFlavor].fv;
        canImage.src = imagePath + frontImg;
        isBackView = false;
        canImage.style.opacity = '1';
    }, 400);
});
