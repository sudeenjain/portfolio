/**
 * LAPTOP / DESKTOP ENHANCEMENTS
 * ----------------------------------------------------------------
 * Runs after ../js/scripts.js. The shared renderer builds every section
 * asynchronously, so this file waits for the rendered markup and then:
 *   1. adds a scroll-progress bar and a sliding active-section pill to the nav
 *   2. builds the interactive hero console (reads values from the rendered DOM)
 *   3. inserts a skills ticker band under the hero
 *   4. adds 3D tilt + cursor-following glow to project / credential / badge cards
 *   5. balances the last row of the project and badge grids
 *   6. motion layer (GSAP 3.13 + ScrollTrigger from js/vendor, with plain-JS fallbacks):
 *        - velocity-aware infinite marquees (skills ticker + big statement band)
 *        - scroll-based text reveal (word masks, scrubbed paragraph)
 *        - sticky header that appears on scroll and tucks away when reading down
 *        - credential logo wall with hover choreography
 *        - parallax: hero depth, background orbs/grid, giant section words, image windows
 *        - text masks: cursor spotlight in the hero name, image-filled closing headline
 * Nothing here touches data/portfolio-data.js or the shared renderer.
 * ---------------------------------------------------------------- */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (hasGSAP) window.gsap.registerPlugin(window.ScrollTrigger);

    function $(sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
    function h(tag, cls, text) {
        var el = document.createElement(tag);
        if (cls) el.className = cls;
        if (text != null) el.textContent = text;
        return el;
    }
    function scrollToId(id) {
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }

    /* ---------- wait for the shared renderer ---------- */
    var started = false;
    function isRendered() { return !!($('#home .hero-wrapper') && $('#projects .project-card')); }
    function start() {
        if (started || !isRendered()) return;
        started = true;
        initScrollProgress();
        initNav();
        initHeroConsole();
        initMarquee();
        initCards();
        initGridBalance();
        initA11y();
        initHeader();
        initTextReveal();
        initLogoWall();
        initParallax();
        initTextMask();
        refreshTriggers();
    }
    if (isRendered()) {
        start();
    } else {
        var mo = new MutationObserver(function () {
            if (isRendered()) { mo.disconnect(); start(); }
        });
        mo.observe(document.body, { childList: true, subtree: true });
        setTimeout(function () { mo.disconnect(); }, 15000);
    }

    /* ---------- 1a. scroll progress ---------- */
    function initScrollProgress() {
        var bar = h('div', 'scroll-progress');
        bar.setAttribute('aria-hidden', 'true');
        document.body.appendChild(bar);
        var ticking = false;
        function update() {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
            bar.style.setProperty('--lp-progress', p.toFixed(4));
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();
    }

    /* ---------- 1b. nav: sliding active pill ---------- */
    function initNav() {
        var links = $('#navLinksContainer');
        if (!links) return;

        var anchors = $$('a[href^="#"]', links);
        var sections = anchors.map(function (a) {
            return { a: a, el: document.getElementById(a.getAttribute('href').slice(1)) };
        }).filter(function (s) { return s.el; });
        if (!sections.length) return;

        var pill = h('span', 'nav-indicator');
        pill.setAttribute('aria-hidden', 'true');
        links.insertBefore(pill, links.firstChild);

        var current = null;

        function place() {
            if (!current || current.classList.contains('nav-cta') || getComputedStyle(pill).display === 'none') {
                pill.classList.remove('is-visible');
                return;
            }
            pill.style.width = current.offsetWidth + 'px';
            pill.style.transform = 'translateX(' + current.offsetLeft + 'px)';
            pill.classList.add('is-visible');
        }

        function setActive(a) {
            if (a === current) return;
            sections.forEach(function (s) {
                s.a.classList.toggle('is-active', s.a === a);
                if (s.a === a) s.a.setAttribute('aria-current', 'true');
                else s.a.removeAttribute('aria-current');
            });
            current = a;
            place();
        }

        var ticking = false;
        function onScroll() {
            var line = window.innerHeight * 0.4;
            var active = sections[0];
            sections.forEach(function (s) {
                if (s.el.getBoundingClientRect().top <= line) active = s;
            });
            setActive(active.a);
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
        }, { passive: true });
        window.addEventListener('resize', place);
        anchors.forEach(function (a) { a.addEventListener('click', function () { setActive(a); }); });

        onScroll();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
        window.addEventListener('load', place);
    }

    /* ---------- 2. hero console ---------- */
    function initHeroConsole() {
        var wrap = $('#home .hero-wrapper');
        if (!wrap || $('.hero-console', wrap)) return;

        var text = function (sel) { var el = $(sel); return el ? el.textContent.trim() : ''; };
        var name = text('.hero-first-name') || 'Sudeen Jain';
        var edu = text('.hero-degree-line');
        var avatarEl = $('#about .profile-img');
        var avatarSrc = avatarEl ? avatarEl.getAttribute('src') : '';
        var skills = $$('.skill-badge').map(function (e) { return e.textContent.trim(); }).filter(Boolean);
        var counts = {
            projects: $$('.project-card').length,
            certificates: $$('.bento-cert-card').length,
            badges: $$('.bento-badge-card').length,
            internships: $$('.internship-card').length
        };

        var root = h('aside', 'hero-console');
        root.setAttribute('aria-label', 'Interactive portfolio terminal');

        /* title bar */
        var bar = h('div', 'hc-bar');
        var dots = h('div', 'hc-dots');
        dots.setAttribute('aria-hidden', 'true');
        dots.append(h('i'), h('i'), h('i'));
        bar.append(dots, h('span', 'hc-title', 'visitor@portfolio: ~'), h('span', 'hc-live', 'ready'));

        /* body */
        var body = h('div', 'hc-body');
        var cmdLine = h('div', 'hc-line');
        var typed = h('span', 'hc-typed');
        cmdLine.append(h('span', 'hc-prompt', '$ '), typed);

        var info = h('div', 'hc-info');
        if (avatarSrc) {
            var img = h('img', 'hc-avatar');
            img.src = avatarSrc;
            img.alt = name;
            img.addEventListener('error', function () { img.remove(); info.classList.add('no-avatar'); });
            info.appendChild(img);
        } else {
            info.classList.add('no-avatar');
        }
        var kv = h('dl', 'hc-kv');
        function row(k, v) { if (v) { kv.append(h('dt', null, k), h('dd', null, v)); } }
        row('name', name);
        row('study', edu);
        row('stack', skills.slice(0, 4).join(', '));
        row('built', counts.projects + ' projects · ' + counts.internships + ' internships');
        row('proof', counts.certificates + ' certificates · ' + counts.badges + ' badges');
        info.appendChild(kv);

        var log = h('div', 'hc-log');
        log.setAttribute('role', 'log');
        log.setAttribute('aria-live', 'polite');
        body.append(cmdLine, info, log);

        /* input row */
        var form = h('form', 'hc-form');
        var label = h('label', 'hc-prompt', '$');
        var input = h('input', 'hc-input');
        input.id = 'hcInput';
        input.type = 'text';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.placeholder = 'type help';
        input.setAttribute('aria-label', 'Terminal command');
        label.setAttribute('for', 'hcInput');
        form.append(label, input);

        /* quick chips */
        var chips = h('div', 'hc-chips');
        ['about', 'skills', 'projects', 'certs', 'contact'].forEach(function (c) {
            var b = h('button', 'hc-chip', c);
            b.type = 'button';
            b.addEventListener('click', function () { run(c); });
            chips.appendChild(b);
        });

        root.append(bar, body, form, chips);
        wrap.appendChild(root);

        /* output helpers */
        function print(parts) {
            if (typeof parts === 'string') parts = [parts];
            var line = h('div', 'hc-line');
            parts.forEach(function (p) {
                if (typeof p === 'string') line.append(document.createTextNode(p));
                else line.append(h('span', p[1], p[0]));
            });
            log.appendChild(line);
            while (log.children.length > 60) log.removeChild(log.firstChild);
            log.scrollTop = log.scrollHeight;
        }
        function sentence(s) { return (s || '').split(/(?<=[.!?])\s/)[0]; }
        function titles(sel, n) {
            return $$(sel).slice(0, n).map(function (e) { return e.textContent.trim(); }).join(' · ');
        }

        var commands = {
            help: function () {
                print([['commands', 'hc-muted']]);
                print('about  skills  projects  certs  badges  internships');
                print('resume  contact  github  whoami  clear');
            },
            whoami: function () { print([[name, 'hc-ok']]); if (edu) print([[edu, 'hc-muted']]); },
            about: function () {
                var p = $('.about-card p');
                print(sentence(p ? p.textContent.trim() : edu));
                scrollToId('about');
            },
            skills: function () {
                print(skills.slice(0, 8).join(', ') + (skills.length > 8 ? ' +' + (skills.length - 8) + ' more' : ''));
                scrollToId('skills');
            },
            projects: function () {
                print([[counts.projects + ' projects', 'hc-ok']]);
                print([[titles('.project-card h3', 3) + ' …', 'hc-muted']]);
                scrollToId('projects');
            },
            certs: function () {
                print([[counts.certificates + ' certificates', 'hc-ok'], ' across AI/ML, cloud and web']);
                scrollToId('certifications');
            },
            badges: function () {
                print([[counts.badges + ' Credly badges', 'hc-ok']]);
                scrollToId('badges');
            },
            internships: function () {
                print([[counts.internships + ' internships', 'hc-ok']]);
                scrollToId('internships');
            },
            resume: function () { print('opening resume section'); scrollToId('resume'); },
            contact: function () { print('opening contact section'); scrollToId('contact'); },
            github: function () {
                var a = $('a[href*="github.com/sudeenjain"]');
                if (!a) { print([['github link not found', 'hc-warn']]); return; }
                print([[a.href, 'hc-muted']]);
                window.open(a.href, '_blank', 'noopener');
            },
            clear: function () { while (log.firstChild) log.removeChild(log.firstChild); }
        };
        commands.certificates = commands.certs;
        commands.cv = commands.resume;

        var history = [];
        var hIndex = 0;

        function run(raw) {
            var cmd = (raw || '').trim().toLowerCase();
            if (!cmd) return;
            if (cmd !== 'clear') print([['$ ', 'hc-prompt'], cmd]);
            history.push(cmd);
            hIndex = history.length;
            if (commands[cmd]) commands[cmd]();
            else print([['command not found: ' + cmd + '. Try help.', 'hc-warn']]);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            run(input.value);
            input.value = '';
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowUp' && history.length) {
                e.preventDefault();
                hIndex = Math.max(0, hIndex - 1);
                input.value = history[hIndex] || '';
            } else if (e.key === 'ArrowDown' && history.length) {
                e.preventDefault();
                hIndex = Math.min(history.length, hIndex + 1);
                input.value = history[hIndex] || '';
            } else if (e.key === 'Escape') {
                input.blur();
            }
        });

        /* boot sequence: type "neofetch", then reveal the profile block */
        var boot = 'neofetch';
        function finishBoot() {
            typed.textContent = boot;
            root.classList.add('is-booted');
            print([['Type help for commands, or tap a shortcut below.', 'hc-muted']]);
        }
        if (reduceMotion) {
            finishBoot();
        } else {
            var i = 0;
            setTimeout(function tick() {
                i++;
                typed.textContent = boot.slice(0, i);
                if (i < boot.length) setTimeout(tick, 75);
                else setTimeout(finishBoot, 250);
            }, 1700);
        }

        /* gentle parallax tilt while the pointer is over the hero */
        if (finePointer && !reduceMotion) {
            var home = $('#home');
            var raf = 0;
            home.addEventListener('mousemove', function (e) {
                if (raf) return;
                raf = requestAnimationFrame(function () {
                    raf = 0;
                    var r = home.getBoundingClientRect();
                    var px = (e.clientX - r.left) / r.width - 0.5;
                    var py = (e.clientY - r.top) / r.height - 0.5;
                    root.style.transform = 'perspective(1100px) rotateY(' + (px * 6).toFixed(2) + 'deg) rotateX(' + (-py * 5).toFixed(2) + 'deg)';
                });
            });
            home.addEventListener('mouseleave', function () { root.style.transform = ''; });
        }
    }

    /* =====================================================================
       MOTION LAYER
       ===================================================================== */

    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

    function refreshTriggers() {
        if (!hasGSAP) return;
        var go = function () { ScrollTrigger.refresh(); };
        window.addEventListener('load', go);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
        setTimeout(go, 1800); // after the preloader + AOS settle
    }

    /* Progress tracker: ScrollTrigger when present, plain scroll listener otherwise.
       fn receives 0..1 while the trigger travels from "start" to "end". */
    var plainTrackers = [];
    var plainBound = false;
    function track(el, fn, opts) {
        opts = opts || {};
        if (hasGSAP) {
            ScrollTrigger.create({
                trigger: el,
                start: opts.start || 'top bottom',
                end: opts.end || 'bottom top',
                onUpdate: function (self) { fn(self.progress); },
                onRefresh: function (self) { fn(self.progress); }
            });
            return;
        }
        plainTrackers.push({ el: el, fn: fn, hero: !!opts.hero });
        if (!plainBound) {
            plainBound = true;
            var tick = false;
            var run = function () {
                tick = false;
                var vh = window.innerHeight;
                plainTrackers.forEach(function (t) {
                    var r = t.el.getBoundingClientRect();
                    var p = t.hero ? -r.top / Math.max(1, r.height) : (vh - r.top) / (vh + r.height);
                    t.fn(clamp(p, 0, 1));
                });
            };
            window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true });
            window.addEventListener('resize', run);
            run();
        }
    }

    /* Wrap every word of an element's text nodes (keeps inline markup intact). */
    function splitWords(root, wordCls, innerCls) {
        var words = [];
        (function walk(node) {
            Array.prototype.slice.call(node.childNodes).forEach(function (n) {
                if (n.nodeType === 3) {
                    var parts = n.nodeValue.split(/(\s+)/);
                    var frag = document.createDocumentFragment();
                    parts.forEach(function (part) {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                        var outer = h('span', wordCls);
                        outer.setAttribute('aria-hidden', 'true');
                        outer.style.setProperty('--i', words.length);
                        if (innerCls) {
                            var inner = h('span', innerCls, part);
                            outer.appendChild(inner);
                        } else {
                            outer.textContent = part;
                        }
                        words.push(outer);
                        frag.appendChild(outer);
                    });
                    node.replaceChild(frag, n);
                } else if (n.nodeType === 1 && !/^(SCRIPT|STYLE|BR|IMG|SVG)$/i.test(n.tagName)) {
                    walk(n);
                }
            });
        })(root);
        return words;
    }

    /* ---------- 3. infinite marquees (skills ticker + statement band) ---------- */
    var marquees = [];
    var marqueeLoop = false;
    var scrollSpeed = { boost: 0, dir: 1, last: window.scrollY, t: 0 };

    function buildMarquee(band, track, labels, itemCls, opts) {
        function addSet() {
            labels.forEach(function (t) { track.appendChild(h('span', itemCls, t)); });
        }
        addSet();
        var guard = 0;
        while (track.scrollWidth < window.innerWidth * 1.05 && guard++ < 12) addSet();
        Array.prototype.slice.call(track.children).forEach(function (c) { track.appendChild(c.cloneNode(true)); });

        var m = { band: band, track: track, x: 0, half: 0, speed: opts.speed, dir: opts.dir,
                  flip: !!opts.flip, dirMul: 1, hover: 1, hovering: false, visible: true };
        function measure() { m.half = track.scrollWidth / 2; }
        measure();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
        window.addEventListener('resize', measure);
        band.addEventListener('mouseenter', function () { m.hovering = true; });
        band.addEventListener('mouseleave', function () { m.hovering = false; });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (es) { m.visible = es[0].isIntersecting; }).observe(band);
        }
        marquees.push(m);
        if (reduceMotion) { track.style.transform = 'none'; return m; }
        if (!marqueeLoop) { marqueeLoop = true; requestAnimationFrame(marqueeTick); }
        return m;
    }

    function marqueeTick(now) {
        var dt = Math.min(0.05, (now - (scrollSpeed.t || now)) / 1000);
        scrollSpeed.t = now;
        var y = window.scrollY;
        var dy = y - scrollSpeed.last;
        scrollSpeed.last = y;
        if (dt > 0) {
            var v = Math.abs(dy) / dt;
            scrollSpeed.boost += (clamp(v / 900, 0, 5) - scrollSpeed.boost) * 0.12;
        }
        if (dy !== 0) scrollSpeed.dir = dy > 0 ? 1 : -1;

        marquees.forEach(function (m) {
            if (!m.visible || !m.half) return;
            m.hover += ((m.hovering ? 0.08 : 1) - m.hover) * 0.1;
            var target = m.flip ? scrollSpeed.dir : 1;
            m.dirMul += (target - m.dirMul) * 0.08;
            m.x -= m.dir * m.dirMul * m.speed * (1 + scrollSpeed.boost) * m.hover * dt;
            if (m.x <= -m.half) m.x += m.half;
            else if (m.x > 0) m.x -= m.half;
            m.track.style.transform = 'translate3d(' + m.x.toFixed(2) + 'px,0,0)';
        });
        requestAnimationFrame(marqueeTick);
    }

    function initMarquee() {
        var home = $('#home');
        if (!home || $('.lp-marquee')) return;

        /* a) skills ticker under the hero */
        var items = $$('.skill-badge').map(function (e) { return e.textContent.trim(); }).filter(Boolean);
        if (items.length) {
            var band = h('div', 'lp-marquee');
            band.setAttribute('aria-hidden', 'true');
            var trackEl = h('div', 'lp-marquee-track');
            band.appendChild(trackEl);
            home.parentNode.insertBefore(band, home.nextSibling);
            buildMarquee(band, trackEl, items, 'lp-marquee-item', { speed: 55, dir: 1 });
        }

        /* b) big outlined statement band, direction follows the scroll direction */
        var projects = $('#projects');
        if (projects) {
            var nameEl = $('.hero-first-name');
            var who = nameEl ? nameEl.textContent.trim() : 'Sudeen Jain';
            var phrases = [who, 'AI & ML Engineer', 'Deep Learning', 'Cloud Native', "Let's build together"];
            var band2 = h('div', 'lp-statement');
            band2.setAttribute('aria-hidden', 'true');
            var track2 = h('div', 'lp-statement-track');
            band2.appendChild(track2);
            projects.parentNode.insertBefore(band2, projects.nextSibling);
            buildMarquee(band2, track2, phrases, 'lp-statement-item', { speed: 90, dir: 1, flip: true });
        }
    }

    /* ---------- 4. sticky header: appears on scroll, tucks away while reading down ---------- */
    function initHeader() {
        var nav = $('#navbar');
        if (!nav) return;
        var lastY = window.scrollY;
        var ticking = false;
        var pointerTop = false;

        function locked() {
            var links = $('#navLinksContainer');
            return pointerTop || nav.matches(':hover') || nav.contains(document.activeElement) ||
                   (links && links.classList.contains('active'));
        }
        function update() {
            ticking = false;
            var y = window.scrollY;
            var dy = y - lastY;
            var stuck = y > 120;
            if (stuck !== nav.classList.contains('lp-stuck')) nav.classList.toggle('lp-stuck', stuck);

            var hidden = nav.classList.contains('lp-nav-hidden');
            if (stuck && y > window.innerHeight * 0.8 && dy > 6 && !locked()) {
                if (!hidden) nav.classList.add('lp-nav-hidden');
            } else if (hidden && (dy < -4 || !stuck || locked())) {
                nav.classList.remove('lp-nav-hidden');
            }
            if (Math.abs(dy) > 2) lastY = y;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener('mousemove', function (e) {
            var near = e.clientY < 64;
            if (near !== pointerTop) { pointerTop = near; if (near) update(); }
        }, { passive: true });
        nav.addEventListener('focusin', function () { nav.classList.remove('lp-nav-hidden'); });
        update();
    }

    /* ---------- 5. scroll-based text reveal ---------- */
    function initTextReveal() {
        if (reduceMotion) return;

        function once(els, cls) {
            if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
                });
            }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
            els.forEach(function (e) { io.observe(e); });
        }

        /* a) headings + subtitles: words rise through a mask, staggered */
        var heads = $$('section h2, .bento-section-header h2').filter(function (el) {
            return !el.closest('#get-in-touch') && !el.closest('#home');
        });
        var subs = $$('section .section-subtitle');
        var masked = [];
        heads.concat(subs).forEach(function (el) {
            if (el.classList.contains('lp-split')) return;
            var label = el.textContent.replace(/\s+/g, ' ').trim();
            el.removeAttribute('data-aos');           // this effect replaces the AOS fade
            el.removeAttribute('data-aos-delay');
            el.setAttribute('aria-label', label);
            splitWords(el, 'lp-w', 'lp-wi');
            el.classList.add('lp-split', el.tagName === 'H2' ? 'lp-split-head' : 'lp-split-sub');
            masked.push(el);
        });
        once(masked);

        /* b) about paragraphs: words light up as you scroll through them */
        $$('.about-card p').forEach(function (p) {
            var label = p.textContent.replace(/\s+/g, ' ').trim();
            p.setAttribute('aria-label', label);
            p.setAttribute('role', 'text');
            var words = splitWords(p, 'lp-sw');
            p.classList.add('lp-scrub');
            if (hasGSAP) {
                p.classList.add('lp-gs');
                gsap.fromTo(words, { opacity: 0.16 }, {
                    opacity: 1, ease: 'none', stagger: 0.12,
                    scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 52%', scrub: 0.5 }
                });
            } else {
                once([p]);
            }
        });
    }

    /* ---------- 6. credential logo wall (hover choreography) ---------- */
    function initLogoWall() {
        var anchor = $('#certifications');
        if (!anchor || $('.lp-logos-sec')) return;
        var seen = {};
        var logos = [];
        $$('.bento-badge-card').forEach(function (card) {
            var img = $('.badge-image-wrapper img', card);
            var issuer = $('.bento-badge-issuer', card);
            if (!img) return;
            var src = img.getAttribute('src');
            if (!src || seen[src]) return;
            seen[src] = true;
            logos.push({ src: src, alt: img.getAttribute('alt') || '', issuer: issuer ? issuer.textContent.trim() : '' });
        });
        if (logos.length < 3) return;

        var sec = h('section', 'lp-logos-sec');
        sec.setAttribute('aria-label', 'Credential issuers');
        var wrap = h('div', 'container');
        var head = h('div', 'lp-logos-head');
        head.append(h('span', 'lp-logos-kicker', 'Verified with'), h('span', 'lp-logos-rule'));
        var grid = h('div', 'lp-logos');
        logos.slice(0, 8).forEach(function (l, i) {
            var a = h('a', 'lp-logo');
            a.href = '#badges';
            a.style.setProperty('--i', i);
            a.setAttribute('aria-label', (l.issuer ? l.issuer + ' — ' : '') + l.alt);
            var frame = h('span', 'lp-logo-frame');
            var im = h('img');
            im.src = l.src; im.alt = ''; im.loading = 'lazy';
            frame.appendChild(im);
            a.append(frame, h('span', 'lp-logo-name', l.issuer || l.alt));
            grid.appendChild(a);
        });
        wrap.append(head, grid);
        sec.appendChild(wrap);
        anchor.parentNode.insertBefore(sec, anchor);

        if (reduceMotion || !('IntersectionObserver' in window)) { sec.classList.add('is-in'); return; }
        var io = new IntersectionObserver(function (es) {
            if (es[0].isIntersecting) { sec.classList.add('is-in'); io.disconnect(); }
        }, { threshold: 0.3 });
        io.observe(sec);

        /* the hovered tile's neighbours lean away from it (pure CSS can't do the lean) */
        if (finePointer) {
            var tiles = $$('.lp-logo', grid);
            tiles.forEach(function (t, i) {
                t.addEventListener('mousemove', function (e) {
                    var r = t.getBoundingClientRect();
                    t.style.setProperty('--lx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
                    t.style.setProperty('--ly', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
                });
                t.addEventListener('mouseenter', function () {
                    tiles.forEach(function (o, j) { o.style.setProperty('--lean', i === j ? 0 : (j < i ? -1 : 1)); });
                });
                t.addEventListener('mouseleave', function () {
                    t.style.setProperty('--lx', 0); t.style.setProperty('--ly', 0);
                });
            });
        }
    }

    /* ---------- 7. parallax + background animation ---------- */
    function initParallax() {
        if (reduceMotion) return;
        var narrow = window.innerWidth < 900;

        /* a) ambient orbs + grid drift behind everything */
        var bg = $('#canvas-container');
        if (bg && !$('.lp-orbs', bg)) {
            var orbs = h('div', 'lp-orbs');
            orbs.setAttribute('aria-hidden', 'true');
            var list = [h('i', 'lp-orb lp-orb-a'), h('i', 'lp-orb lp-orb-b'), h('i', 'lp-orb lp-orb-c')];
            list.forEach(function (o) { orbs.appendChild(o); });
            bg.appendChild(orbs);
            var depth = [-420, -820, -260];
            var root = document.documentElement;
            var update = function (p) {
                list.forEach(function (o, i) { o.style.setProperty('--lp-oy', (p * depth[i]).toFixed(1) + 'px'); });
                root.style.setProperty('--lp-gridy', (-p * 360).toFixed(1) + 'px');
            };
            if (hasGSAP) {
                ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) { update(s.progress); } });
            } else {
                window.addEventListener('scroll', function () {
                    var max = document.documentElement.scrollHeight - window.innerHeight;
                    update(max > 0 ? clamp(window.scrollY / max, 0, 1) : 0);
                }, { passive: true });
            }
        }

        /* b) hero depth: copy drifts slowly, console drifts faster */
        var home = $('#home');
        if (home && !narrow) {
            var content = $('.hero-content', home);
            var consoleEl = $('.hero-console', home);
            var cue = $('#scroll-indicator');
            [[content, -60], [consoleEl, -130]].forEach(function (pair) {
                var el = pair[0], dist = pair[1];
                if (!el) return;
                el.classList.add('lp-px');
                track(home, function (p) { el.style.setProperty('--lp-py', (p * dist).toFixed(1) + 'px'); },
                    { start: 'top top', end: 'bottom top', hero: true });
            });
            if (cue) { /* leave the scroll cue to scripts.js */ }
        }

        /* c) giant outlined section words sliding sideways behind the content */
        var words = { about: 'ABOUT', skills: 'STACK', certifications: 'PROOF', internships: 'EXPERIENCE', projects: 'BUILDS', contact: 'CONNECT' };
        Object.keys(words).forEach(function (id, n) {
            var sec = document.getElementById(id);
            if (!sec || $('.lp-bgword', sec)) return;
            var wrap = h('div', 'lp-bgword');
            wrap.setAttribute('aria-hidden', 'true');
            var w = h('span', 'lp-bgword-text', words[id]);
            wrap.appendChild(w);
            sec.insertBefore(wrap, sec.firstChild);
            var dir = n % 2 ? -1 : 1;
            track(sec, function (p) { w.style.setProperty('--lp-bx', ((0.5 - p) * 24 * dir).toFixed(2) + 'vw'); });
        });

        /* d) images move inside their frames (scaled up so edges never show) */
        $$('.bento-cert-thumb img, .internship-image-wrapper img').forEach(function (img) {
            var frame = img.parentNode;
            img.classList.add('lp-pimg');
            track(frame, function (p) { img.style.setProperty('--lp-pi', ((p - 0.5) * 9).toFixed(2)); });
        });

        /* e) closing headline: the image fill slides with the scroll */
        var closer = $('#get-in-touch h2');
        if (closer) {
            track(closer, function (p) {
                closer.style.setProperty('--lp-bgx', (p * -320).toFixed(1) + 'px');
                closer.style.setProperty('--lp-bgy', (p * -120).toFixed(1) + 'px');
            });
        }
    }

    /* ---------- 8. text masks: cursor spotlight + image-filled closer ---------- */
    function initTextMask() {
        /* hero name: a lit "window" follows the pointer through the letters */
        var name = $('.hero-first-name');
        var home = $('#home');
        if (name && home && finePointer && !reduceMotion) {
            name.classList.add('lp-lit');
            var raf = 0, pe = null;
            home.addEventListener('mousemove', function (e) {
                pe = e;
                if (raf) return;
                raf = requestAnimationFrame(function () {
                    raf = 0;
                    var r = name.getBoundingClientRect();
                    name.style.setProperty('--hx', (pe.clientX - r.left).toFixed(0) + 'px');
                    name.style.setProperty('--hy', (pe.clientY - r.top).toFixed(0) + 'px');
                    name.style.setProperty('--ha', '1');
                });
            });
            home.addEventListener('mouseleave', function () { name.style.setProperty('--ha', '0'); });
        }

        /* closing headline: wipe-in reveal over the image fill */
        var closer = $('#get-in-touch h2');
        if (closer && !reduceMotion && 'IntersectionObserver' in window) {
            closer.classList.add('lp-wipe');
            var io = new IntersectionObserver(function (es) {
                if (es[0].isIntersecting) { closer.classList.add('is-in'); io.disconnect(); }
            }, { threshold: 0.4 });
            io.observe(closer.parentNode);   // observe the wrapper: IO ignores a clipped-away target
        }
    }

    /* ---------- 4. card tilt + cursor glow ---------- */
    function initCards() {
        if (!finePointer) return;
        var EASE_OUT = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.8s ease';
        var EASE_FOLLOW = 'transform 0.12s ease-out, box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.8s ease';

        $$('.project-card, .bento-cert-card, .bento-badge-card').forEach(function (card) {
            var raf = 0;
            var ev = null;

            card.addEventListener('mouseenter', function () {
                card.style.transition = EASE_FOLLOW; // inline also clears AOS' transition-delay
            });

            card.addEventListener('mousemove', function (e) {
                ev = e;
                if (raf) return;
                raf = requestAnimationFrame(function () {
                    raf = 0;
                    if (!ev) return;
                    var r = card.getBoundingClientRect();
                    var x = ev.clientX - r.left;
                    var y = ev.clientY - r.top;
                    card.style.setProperty('--mx', x.toFixed(1) + 'px');
                    card.style.setProperty('--my', y.toFixed(1) + 'px');
                    if (reduceMotion) return;
                    var max = r.width > 520 ? 2.5 : 5;
                    var rx = ((y / r.height) - 0.5) * -2 * max;
                    var ry = ((x / r.width) - 0.5) * 2 * max;
                    card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-6px)';
                });
            });

            card.addEventListener('mouseleave', function () {
                ev = null;
                card.style.transition = EASE_OUT;
                card.style.transform = '';
            });
        });
    }

    /* ---------- 5. balance last row of project + badge grids ---------- */
    function initGridBalance() {
        var grids = [$('#projects .grid'), $('.bento-badges-matrix')].filter(Boolean);
        if (!grids.length) return;

        function balance(grid) {
            var cards = Array.prototype.slice.call(grid.children).filter(function (c) {
                return getComputedStyle(c).display !== 'none';
            });
            if (!cards.length) return;
            var last = cards[cards.length - 1];
            last.style.gridColumn = '';

            var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
            if (cols < 2) return;

            var total = 0;
            var lastSpan = 1;
            cards.forEach(function (c) {
                var end = getComputedStyle(c).gridColumnEnd;
                var span = /^span\s+(\d+)/.test(end) ? parseInt(end.replace(/\D+/g, ''), 10) : 1;
                total += span;
                lastSpan = span;
            });
            var remainder = (cols - (total % cols)) % cols;
            if (remainder > 0) last.style.gridColumn = 'span ' + Math.min(cols, lastSpan + remainder);
        }

        function all() { grids.forEach(balance); }
        all();

        var t = 0;
        window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(all, 150); });
        window.addEventListener('load', all);
    }

    /* ---------- accessibility: keyboard access for certificate cards ---------- */
    function initA11y() {
        $$('.bento-cert-card').forEach(function (card) {
            var title = $('.bento-cert-title', card);
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            if (title) card.setAttribute('aria-label', 'View certificate: ' + title.textContent.trim());
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }
})();
