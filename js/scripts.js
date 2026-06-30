document.addEventListener('DOMContentLoaded', () => {
    // Array of sections to load, mapping placeholder ID to file name in 'includes/'
    const includes = [
        { id: 'nav-placeholder', file: 'nav.html' },
        { id: 'home', file: 'home.html' },
        { id: 'about', file: 'about.html' },
        { id: 'skills', file: 'skills.html' },
        { id: 'certifications', file: 'certifications.html' },
        { id: 'projects', file: 'projects.html' },
        { id: 'contact', file: 'contact.html' },
        { id: 'get-in-touch', file: 'get-in-touch.html' }
    ];

    /**
     * Dynamically loads and injects HTML content into placeholders.
     */
    async function loadHTMLIncludes() {
        for (const item of includes) {
            const element = document.getElementById(item.id);
            if (element) {
                try {
                    const response = await fetch(`includes/${item.file}`);
                    if (!response.ok) throw new Error(`Failed to load ${item.file}`);
                    const html = await response.text();
                    // For the nav, we replace the placeholder, for sections, we inject the inner content
                    if (item.id === 'nav-placeholder') {
                        element.outerHTML = html; // Replace the entire nav placeholder
                    } else {
                        element.innerHTML = html; // Inject content inside the section
                    }
                } catch (error) {
                    console.error('Error loading HTML include:', error);
                    if (item.id !== 'nav-placeholder') {
                        element.innerHTML = `<div style="text-align:center; color:red; padding: 20px;">Error loading ${item.file}</div>`;
                    }
                }
            }
        }
        // Initialize functions that depend on the newly loaded DOM content
        initGeneralScripts();
    }

    /**
     * Contains all general utility scripts (AOS, menu logic, scroll logic).
     */
    function initGeneralScripts() {
        // --- AOS INIT (Must be called after content is loaded) ---
        AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 50 });

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

        // --- SCROLL TO TOP, ACTIVE LINK & SCROLL INDICATOR FADE ---
        const scrollBtn = document.getElementById("scrollTopBtn");
        const scrollIndicator = document.getElementById("scroll-indicator");
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            // Scroll Button
            scrollBtn.style.display = (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) ? "block" : "none";

            // Scroll Indicator Fade
            if (scrollIndicator) {
                if (window.scrollY > 100) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '0.8';
                    scrollIndicator.style.pointerEvents = 'auto';
                }
            }

            // Active Link
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
                window.scrollTo({top: 0, behavior: 'smooth'});
            });
        }

        // --- DYNAMIC YEAR ---
        document.getElementById('year').textContent = new Date().getFullYear();
    }

    // Start the loading process
    loadHTMLIncludes();
});