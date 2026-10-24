/**
 * MOBILE ENHANCEMENTS
 * Tailored interactions for mobile touch devices.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Auto-close mobile navigation menu when tapping any section link
    const checkNavLinks = setInterval(() => {
        const navLinks = document.querySelectorAll('.nav-links a');
        const hamburger = document.getElementById('hamburgerBtn');
        const navContainer = document.getElementById('navLinksContainer');

        if (navLinks.length > 0 && hamburger && navContainer) {
            clearInterval(checkNavLinks);
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navContainer.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }, 200);

    setTimeout(() => clearInterval(checkNavLinks), 4000);
});
