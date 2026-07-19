// =============================================
// PRELOADER (independent of rendered content)
// =============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 1500);
});

// =============================================
// CUSTOM CURSOR — position tracking (independent of rendered content)
// =============================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (window.innerWidth > 768 && cursorDot && cursorRing) {
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX - 4 + 'px';
        cursorDot.style.top = e.clientY - 4 + 'px';
        cursorRing.style.left = e.clientX - 20 + 'px';
        cursorRing.style.top = e.clientY - 20 + 'px';
    });
}

// =============================================
// CERTIFICATE LIGHTBOX (called via onclick from rendered markup —
// must stay on window so it's reachable once sections are rendered)
// =============================================
window.openCertLightbox = function (wrapper) {
    const img = wrapper.querySelector('img');
    const lightbox = document.getElementById('certLightbox');
    const lightboxImg = document.getElementById('certLightboxImg');
    const lightboxTitle = document.getElementById('certLightboxTitle');

    lightboxImg.src = img.src;
    lightboxTitle.textContent = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeCertLightbox = function () {
    const lightbox = document.getElementById('certLightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeCertLightbox();
});

document.addEventListener('DOMContentLoaded', async () => {
    // Build every section dynamically from Supabase (or fallback portfolio-data.js) via js/portfolio-renderer.js.
    if (typeof PortfolioRenderer === 'undefined' || typeof PortfolioDataService === 'undefined') {
        console.error('PortfolioRenderer or PortfolioDataService not found — check script load order in index.html');
        return;
    }

    // Load data from Supabase or fallback static config
    const data = await PortfolioDataService.loadPortfolioData();

    PortfolioRenderer.renderAll(data);

    // Everything below touches markup that renderAll() just created,
    // so it can only run after that call returns.
    initGeneralScripts(data);
});

/**
 * All scripts that depend on the rendered sections (nav, hero, about,
 * projects, etc.) live here so they run after PortfolioRenderer.renderAll().
 */
function initGeneralScripts(data) {
    // --- AOS INIT (must run after content is in the DOM) ---
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 50 });

    // --- CURSOR HOVER TARGETS (elements come from rendered markup) ---
    if (window.innerWidth > 768 && cursorRing) {
        const interactiveElements = document.querySelectorAll(
            'a, button, .skill-badge, .card, .project-card, .badge-card, .contact-card, .stat-card, .nav-cta, .internship-image-wrapper'
        );
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    // --- MOBILE MENU ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (hamburger) {
                hamburger.querySelector('i').classList.add('fa-bars');
                hamburger.querySelector('i').classList.remove('fa-times');
            }
            document.body.style.overflow = 'auto';
        });
    });

    // --- TYPEWRITER EFFECT (#typedText lives in the rendered hero; roles come from data) ---
    const typedTextEl = document.getElementById('typedText');
    if (typedTextEl && data.hero.roles && data.hero.roles.length) {
        const roles = data.hero.roles;
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 30 : 80;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before next word
            }

            setTimeout(typeWriter, typeSpeed);
        }
        setTimeout(typeWriter, 1500);
    }

    // --- ANIMATED COUNTERS (.stat-number lives in the rendered about section) ---
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.ceil(current) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + '+';
                        }
                    };
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }
    animateCounters();

    // --- NAVBAR SCROLL EFFECT (#navbar comes from the rendered nav) ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- SCROLL TO TOP, ACTIVE LINK & SCROLL INDICATOR FADE ---
    const scrollBtn = document.getElementById('scrollTopBtn');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Scroll button
        if (scrollBtn) {
            scrollBtn.style.display = (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) ? 'block' : 'none';
        }

        // Scroll indicator fade
        if (scrollIndicator) {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '0.8';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }

        // Active link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - section.clientHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(a => {
            a.classList.remove('active-link');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active-link');
            }
        });
    });

    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- DYNAMIC YEAR (#year lives in the static footer) ---
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- TILT EFFECT ON PROJECT CARDS (.project-card comes from rendered projects) ---
    if (window.innerWidth > 768) {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // --- REVEAL ON SCROLL ---
    const revealElements = document.querySelectorAll('.reveal-text');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
}
