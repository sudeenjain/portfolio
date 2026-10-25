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
// NEON LINE TAIL CURSOR ANIMATION
// High-tech laser ribbon trail with multi-colored neon glow
// =============================================
function initNeonLineCursor() {
    const canvas = document.getElementById('neonCursorCanvas');
    if (!canvas) return;

    // Disable on touch screens or small devices
    if (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const trail = [];
    const maxTrailLength = 28; // Tapering ribbon resolution
    let mouse = { x: -100, y: -100 };
    let isHovering = false;
    let hasMoved = false;

    window.addEventListener('mousemove', (e) => {
        hasMoved = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = -100;
        mouse.y = -100;
    });

    window.setNeonCursorHover = function (hover) {
        isHovering = hover;
    };

    function render() {
        ctx.clearRect(0, 0, width, height);

        if (hasMoved && mouse.x > -50 && mouse.y > -50) {
            trail.unshift({ x: mouse.x, y: mouse.y });
            if (trail.length > maxTrailLength) {
                trail.pop();
            }
        } else if (trail.length > 0) {
            trail.pop();
        }

        if (trail.length > 1) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // 1. Outer Neon Luminescence Ribbon Pass
            for (let i = 0; i < trail.length - 1; i++) {
                const p1 = trail[i];
                const p2 = trail[i + 1];
                const progress = i / trail.length; // 0 = head, 1 = tail
                const alpha = Math.max(0, (1 - progress) * (isHovering ? 0.95 : 0.8));
                const lineWidth = Math.max(1, (1 - progress) * (isHovering ? 9.5 : 6.5));

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);

                // Cyberpunk neon transition: Cyan (#00f3ff) -> Violet (#bd00ff) -> Magenta (#ff007f)
                const r = Math.round(0 * (1 - progress) + 189 * progress);
                const g = Math.round(243 * (1 - progress) + 0 * progress);
                const b = Math.round(255 * (1 - progress) + 255 * progress);

                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.lineWidth = lineWidth;
                ctx.shadowBlur = isHovering ? 22 : 14;
                ctx.shadowColor = isHovering ? '#bd00ff' : '#00f3ff';
                ctx.stroke();
            }

            // 2. High-Energy White-Hot Core Light Beam
            for (let i = 0; i < trail.length - 1; i++) {
                const p1 = trail[i];
                const p2 = trail[i + 1];
                const progress = i / trail.length;
                const alpha = Math.max(0, (1 - progress) * 0.95);
                const lineWidth = Math.max(0.8, (1 - progress) * (isHovering ? 3.2 : 2.2));

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);

                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = lineWidth;
                ctx.shadowBlur = 6;
                ctx.shadowColor = '#ffffff';
                ctx.stroke();
            }

            // 3. Leading Cursor Neon Tip
            const head = trail[0];
            const tipRadius = isHovering ? 4.5 : 3.5;

            // Electric tip core
            ctx.beginPath();
            ctx.arc(head.x, head.y, tipRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = isHovering ? 24 : 16;
            ctx.shadowColor = isHovering ? '#bd00ff' : '#00f3ff';
            ctx.fill();

            // Neon pulse aura ring around pointer
            ctx.beginPath();
            ctx.arc(head.x, head.y, tipRadius + 3.5, 0, Math.PI * 2);
            ctx.strokeStyle = isHovering ? 'rgba(189, 0, 255, 0.7)' : 'rgba(0, 243, 255, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = isHovering ? '#bd00ff' : '#00f3ff';
            ctx.stroke();

            ctx.restore();
        }

        requestAnimationFrame(render);
    }

    render();
}

// Initialize neon trail immediately
initNeonLineCursor();

// =============================================
// CERTIFICATE LIGHTBOX (called via onclick from rendered markup —
// must stay on window so it's reachable once sections are rendered)
// =============================================
window.openCertLightbox = function (wrapper) {
    const img = wrapper.querySelector('img');
    const lightbox = document.getElementById('certLightbox');
    const lightboxImg = document.getElementById('certLightboxImg');

    // Primary fields
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    document.getElementById('certLightboxTitle').textContent = img.alt;

    // Metadata from data attributes
    const org = wrapper.dataset.org || '';
    const date = wrapper.dataset.date || '';
    const credId = wrapper.dataset.id || '';
    const url = wrapper.dataset.url || '';
    const desc = wrapper.dataset.desc || '';

    // Category (parent category heading)
    const catEl = wrapper.closest('.cert-category');
    const catName = catEl ? catEl.querySelector('.cert-category-title')?.textContent.trim() : '';

    const setMeta = (id, text) => {
        const el = document.getElementById(id);
        if (!el) return;
        const span = el.querySelector('span');
        if (span) span.textContent = text;
        el.style.display = text ? '' : 'none';
    };

    setMeta('certLightboxCategory', catName);
    setMeta('certLightboxOrg', org);
    setMeta('certLightboxDate', date);
    setMeta('certLightboxId', credId);

    const descEl = document.getElementById('certLightboxDesc');
    if (descEl) {
        descEl.textContent = desc;
        descEl.style.display = desc ? '' : 'none';
    }

    const linkEl = document.getElementById('certLightboxLink');
    if (linkEl) {
        linkEl.href = url || '#';
        linkEl.style.display = url ? '' : 'none';
    }

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

    // --- NEON CURSOR HOVER TARGETS ---
    if (typeof window.setNeonCursorHover === 'function') {
        const interactiveElements = document.querySelectorAll(
            'a, button, .skill-badge, .card, .project-card, .badge-card, .bento-cert-card, .bento-badge-card, .bento-filter-tab, .contact-card, .stat-card, .nav-cta, .internship-image-wrapper'
        );
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => window.setNeonCursorHover(true));
            el.addEventListener('mouseleave', () => window.setNeonCursorHover(false));
        });
    }

    // --- BENTO CERTIFICATE CATEGORY FILTER ---
    const filterTabs = document.querySelectorAll('.bento-filter-tab');
    const certCards = document.querySelectorAll('.bento-cert-card');

    if (filterTabs.length && certCards.length) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;

                certCards.forEach(card => {
                    const cardCat = card.dataset.category;
                    if (filter === 'all' || cardCat === filter) {
                        card.style.display = '';
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 40);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- MOBILE MENU ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        });

        // Close when clicking outside menu
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
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
