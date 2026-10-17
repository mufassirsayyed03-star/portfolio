const $ = s => document.querySelector(s);
const nav = $('#nav'), burger = $('#burger'), menu = $('#navLinks'), pull = $('#pull');
const navLinks = [...menu.querySelectorAll('a:not(.nav-cta)')];
const sections = ['about', 'services', 'work', 'contact'].map(id => document.getElementById(id));
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastY = scrollY, timer;

$('#year').textContent = new Date().getFullYear();

// ---- mobile menu ----
function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('solid', open);
}
burger.onclick = () => setMenu(!menu.classList.contains('open'));
menu.onclick = e => { if (e.target.closest('a')) setMenu(false); };
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
addEventListener('resize', () => { if (innerWidth > 800) setMenu(false); });

// ---- scroll: navbar, active link, chain ----
function onScroll() {
    const heroGrid = document.querySelector('.hero-grid');
    if (innerWidth <= 800 && !calm) {
        const p = Math.min(y / innerHeight, 1);
        heroGrid.style.transform = `translateY(${p * 60}px) scale(${1 - p * 0.08})`;
        heroGrid.style.opacity = 1 - p * 0.7;
    } else {
        heroGrid.style.transform = '';
        heroGrid.style.opacity = '';
    }
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 20);

    let cur = 'home';
    sections.forEach(s => { if (s.getBoundingClientRect().top <= innerHeight * 0.4) cur = s.id; });
    if (innerHeight + y >= document.documentElement.scrollHeight - 4) cur = 'contact';
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));

    pull.style.opacity = Math.min(y / (innerHeight * 0.25), 1);
    if (!calm) {
        const tilt = Math.max(-2.5, Math.min(2.5, (y - lastY) * 0.25));
        pull.style.transform = `rotate(${tilt}deg)`;
        clearTimeout(timer);
        timer = setTimeout(() => pull.style.transform = 'rotate(0deg)', 120);
    }
    lastY = y;
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();