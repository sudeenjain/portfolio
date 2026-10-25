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
