/**
 * MOBILE ENHANCEMENTS
 * Tailored interactions for mobile touch devices.
 *
 * The open/close toggle itself lives in ../js/scripts.js. This file only adds the
 * pieces it lacks: closing on link tap, Escape, rotation/resize, and aria state.
 */
document.addEventListener('DOMContentLoaded', () => {
    const MENU_BREAKPOINT = 992;
    let wired = false;

    function wire() {
        const hamburger = document.getElementById('hamburgerBtn');
        const menu = document.getElementById('navLinksContainer');
        if (wired || !hamburger || !menu) return false;
        wired = true;

        hamburger.setAttribute('aria-controls', 'navLinksContainer');
        hamburger.setAttribute('aria-expanded', 'false');

        function closeMenu(returnFocus) {
            menu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
            if (returnFocus) hamburger.focus();
        }

        // keep aria-expanded in step with whatever scripts.js does
        new MutationObserver(() => {
            const open = menu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.documentElement.classList.toggle('lp-menu-open', open);
        }).observe(menu, { attributes: true, attributeFilter: ['class'] });

        // auto-close when tapping any section link
        menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu(false)));

        // Escape closes the menu
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu(true);
        });

        // rotating the phone / resizing to desktop width must not leave the page scroll-locked
        window.addEventListener('resize', () => {
            if (window.innerWidth > MENU_BREAKPOINT && menu.classList.contains('active')) closeMenu(false);
        });
        return true;
    }

    // the nav is rendered asynchronously by ../js/portfolio-renderer.js
    if (!wire()) {
        const poll = setInterval(() => { if (wire()) clearInterval(poll); }, 150);
        setTimeout(() => clearInterval(poll), 8000);
    }
});


/**
 * SMOOTH SCROLLING (Lenis)
 * Wheel / trackpad / keyboard / anchor-link scrolling is eased. Real touch scrolling stays native
 * (syncTouch:false) because the phone's own momentum scrolling is already smooth and hijacking it
 * feels heavy. Set syncTouch to true below if you want Lenis to smooth touch drags as well.
 */
(function () {
    const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof Lenis === 'undefined') return;

    const HEADER_OFFSET = 80; // matches scroll-padding-top in mobile.css
    const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        // chat widget and lightbox keep their own inner scrolling
        prevent: node => !!(node.closest && node.closest('[id^="sj-chat"], .cert-lightbox, [data-lenis-prevent]'))
    });
    window.__lenis = lenis;
    requestAnimationFrame(function raf(time) { lenis.raf(time); requestAnimationFrame(raf); });

    // pause while the menu, a project modal or the certificate lightbox locks page scroll
    const root = document.documentElement;
    function syncLock() {
        const locked = root.classList.contains('lp-menu-open') ||
            root.classList.contains('pj-modal-open') ||
            !!document.querySelector('.cert-lightbox.active');
        if (locked) lenis.stop(); else lenis.start();
    }
    new MutationObserver(syncLock).observe(root, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('DOMContentLoaded', () => {
        const lb = document.querySelector('.cert-lightbox');
        if (lb) new MutationObserver(syncLock).observe(lb, { attributes: true, attributeFilter: ['class'] });
    });

    // in-page links (#about, #projects ...) glide with the same easing
    document.addEventListener('click', e => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || a.closest('.cert-lightbox')) return;
        const id = (a.getAttribute('href') || '').slice(1);
        const el = id && document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -HEADER_OFFSET, duration: 1.2 });
        if (history.pushState) { try { history.pushState(null, '', '#' + id); } catch (err) { /* file:// */ } }
    });
})();


/**
 * SCROLL PERFORMANCE
 * While the page is moving, live backdrop blur behind the glass cards is switched off (see mobile.css),
 * which is the single most expensive thing a phone GPU repaints on every scroll frame.
 */
(function () {
    const root = document.documentElement;
    let t = 0;
    window.addEventListener('scroll', function () {
        if (!root.classList.contains('lp-scrolling')) root.classList.add('lp-scrolling');
        clearTimeout(t);
        t = setTimeout(function () { root.classList.remove('lp-scrolling'); }, 160);
    }, { passive: true });
})();
