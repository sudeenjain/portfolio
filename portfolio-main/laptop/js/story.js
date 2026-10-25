/**
 * LAPTOP STORY LAYER — element-based scroll animations (needs GSAP + ScrollTrigger; skipped otherwise)
 *   1. About: your cut-out portrait stands in front of a giant outlined name, with a ring that draws itself
 *   2. Pinned story  (Learn -> Build -> Deliver): one screen, the content changes as you scroll; circle-reveal frames,
 *      a 3D cube that rotates with scroll, scramble + gradient + fill text effects
 *   3. Internships: cards stack and pile up (sticky), a line draws down the side
 *   4. Case files: pinned horizontal scroll through the flagship projects
 * Everything animates transform / opacity / clip-path only, so scrolling stays smooth with Lenis.
 */
(function () {
    'use strict';
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var wide = window.matchMedia && matchMedia('(min-width: 993px)').matches;
    if (reduce || !wide) return;

    var prefix = window.PORTFOLIO_ROOT_PREFIX || '../';
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

    /* ---------- text scramble ---------- */
    var GLYPHS = '!<>-_\\/[]{}=+*^?#01';
    function scramble(el, text, ms) {
        if (!el) return;
        if (el.__scr) cancelAnimationFrame(el.__scr);
        var t0 = performance.now(), n = text.length;
        ms = ms || 750;
        (function step(now) {
            var p = Math.min(1, (now - t0) / ms), fixed = Math.floor(p * n), out = '';
            for (var i = 0; i < n; i++) {
                var c = text.charAt(i);
                out += (i < fixed || c === ' ') ? c : GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
            }
            el.textContent = out;
            if (p < 1) el.__scr = requestAnimationFrame(step); else { el.textContent = text; el.__scr = 0; }
        })(t0);
    }

    function ready() {
        return window.gsap && window.ScrollTrigger && !window.__showcasePending &&
            $('#about .profile-wrapper') && $('#internships .internship-card') && $('#projects .pj-card');
    }

    /* ======================================================================= 1. About portrait */
    function portrait() {
        var wrap = $('#about .profile-wrapper');
        if (!wrap || wrap.querySelector('.lp-stage')) return;
        var stage = h('div', 'lp-stage');
        stage.innerHTML =
            '<svg class="lp-stage-ring" viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="188" pathLength="1"/></svg>' +
            '<span class="lp-stage-word lp-stage-w1" aria-hidden="true">SUDEEN</span>' +
            '<span class="lp-stage-word lp-stage-w2" aria-hidden="true">JAIN</span>' +
            '<img class="lp-stage-img" src="' + prefix + 'assets/portrait-cutout.webp" alt="Sudeen Jain" width="800" height="1099" decoding="async">';
        wrap.appendChild(stage);
        wrap.classList.add('has-stage');
        var ring = $('.lp-stage-ring circle', stage);
        var tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top 90%', end: 'bottom 20%', scrub: true } });
        tl.fromTo(ring, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
          .fromTo($('.lp-stage-w1', stage), { xPercent: -14 }, { xPercent: 14, ease: 'none', duration: 1 }, 0)
          .fromTo($('.lp-stage-w2', stage), { xPercent: 18 }, { xPercent: -18, ease: 'none', duration: 1 }, 0)
          .fromTo($('.lp-stage-img', stage), { yPercent: 7, scale: 0.96 }, { yPercent: -3, scale: 1.03, ease: 'none', duration: 1 }, 0);
        var who = $('.lp-stage-w1', stage);
        ScrollTrigger.create({ trigger: stage, start: 'top 80%', once: true, onEnter: function () { scramble(who, 'SUDEEN', 900); } });
    }

    /* ======================================================================= 2. Pinned story */
    function story() {
        var about = $('#about');
        if (!about || $('#story')) return;
        var D = window.PROJECT_SHOWCASE || { mine: [], client: [] };
        var certs = $$('.bento-cert-card').length || 12;
        var mine = (D.mine || []).filter(function (p) { return p.img; });
        var client = (D.client || []).filter(function (p) { return p.img; });
        function shots(list, n) {
            return list.slice(0, n).map(function (p) { return '<img src="' + esc(prefix + p.img) + '" alt="' + esc(p.title) + ' screenshot" loading="lazy" decoding="async">'; }).join('');
        }
        var chapters = [
            { k: 'Learn', title: 'Learn the fundamentals', text: certs + '+ certifications across AI, machine learning, cloud and web development, built through hands-on courses and internships.' },
            { k: 'Build', title: 'Build real projects', text: (D.mine || []).length + ' projects with live demos, from gesture-controlled presentations to AI recommendation engines and a face-scanning attendance tracker.' },
            { k: 'Deliver', title: 'Deliver for clients', text: (D.client || []).length + ' websites shipped for real organisations: a software company, a video platform, real estate, a lab-equipment business, associations and a school.' }
        ];
        var sec = h('section', 'lp-story');
        sec.id = 'story';
        sec.setAttribute('aria-label', 'How I work: learn, build, deliver');
        sec.innerHTML =
            '<div class="st-pin"><div class="st-inner">' +
            '<div class="st-copy"><div class="st-count"><b>01</b> / 0' + chapters.length + '</div>' +
            chapters.map(function (c, i) {
                return '<article class="st-ch' + (i ? '' : ' is-on') + '"><span class="st-key">' + c.k + '</span><h2 class="st-title lp-sweep" data-t="' + esc(c.title) + '">' + esc(c.title) + '</h2><p class="st-text">' + esc(c.text) + '</p></article>';
            }).join('') +
            '<div class="st-bar" aria-hidden="true"><i></i></div></div>' +
            '<div class="st-visual" aria-hidden="true">' +
            '<div class="st-v st-v1"><div class="st-cube">' +
            ['AI', 'ML', 'Cloud', 'Web', 'Data', 'Code'].map(function (f, i) { return '<span class="st-face st-f' + i + '">' + f + '</span>'; }).join('') +
            '</div></div>' +
            '<div class="st-v st-v2"><div class="st-win">' + shots(mine, 3) + '</div></div>' +
            '<div class="st-v st-v3"><div class="st-win">' + shots(client, 3) + '</div></div>' +
            '</div></div></div>';
        about.parentNode.insertBefore(sec, about.nextSibling);

        var chs = $$('.st-ch', sec), counter = $('.st-count b', sec), cur = 0;
        function setActive(i) {
            if (i === cur) return;
            cur = i;
            chs.forEach(function (c, j) { c.classList.toggle('is-on', j === i); });
            counter.textContent = '0' + (i + 1);
            scramble($('.st-title', chs[i]), chapters[i].title, 650);
        }

        var v1 = $('.st-v1', sec), v2 = $('.st-v2', sec), v3 = $('.st-v3', sec);
        var w2 = $$('img', v2), w3 = $$('img', v3), cube = $('.st-cube', sec);
        function circle(el, from, to, at, len) {
            tl.fromTo(el, { clipPath: 'circle(' + from + '% at 50% 50%)' }, { clipPath: 'circle(' + to + '% at 50% 50%)', ease: 'power2.inOut', duration: len }, at);
        }
        gsap.set([v2, v3], { clipPath: 'circle(0% at 50% 50%)' });
        gsap.set(w2.concat(w3), { clipPath: 'circle(0% at 50% 50%)' });
        gsap.set([w2[0], w3[0]], { clipPath: 'circle(150% at 50% 50%)' });
        var tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
                trigger: sec, start: 'top top', end: '+=' + Math.round(innerHeight * 3.2), scrub: true, pin: $('.st-pin', sec), anticipatePin: 1, invalidateOnRefresh: true,
                onUpdate: function (self) { setActive(Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length * 0.999))); }
            }
        });
        tl.to(cube, { rotationY: 520, rotationX: 70, duration: 3 }, 0);
        tl.to($('.st-bar i', sec), { scaleX: 1, duration: 3 }, 0);
        circle(v2, 0, 150, 0.8, 0.45);
        circle(w2[1], 0, 150, 1.3, 0.3);
        circle(w2[2], 0, 150, 1.6, 0.3);
        circle(v3, 0, 150, 1.8, 0.45);
        circle(w3[1], 0, 150, 2.3, 0.3);
        circle(w3[2], 0, 150, 2.6, 0.3);
        tl.to(v1, { opacity: 0.0, duration: 0.3 }, 1.0);
        tl.to($('.st-win', v2), { rotationY: -10, rotationX: 4, duration: 3 }, 0.8);
    }

    /* ======================================================================= 3. Internships: stacking + line drawing */
    function internships() {
        var tl = $('#internships .internships-timeline');
        var cards = $$('.internship-card', tl);
        if (!tl || cards.length < 2 || tl.classList.contains('lp-stack')) return;
        tl.classList.add('lp-stack');
        cards.forEach(function (c, i) {
            c.removeAttribute('data-aos'); c.removeAttribute('data-aos-delay'); c.classList.remove('aos-init', 'aos-animate');
            c.style.setProperty('--si', i);
        });
        var line = h('i', 'lp-drawline'); line.setAttribute('aria-hidden', 'true');
        tl.appendChild(line);
        gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 60%', end: 'bottom 70%', scrub: true } });
        cards.forEach(function (c, i) {
            if (i === cards.length - 1) return;
            gsap.to(c, {
                scale: 0.93 - (cards.length - i) * 0.005, '--dim': 0.62, ease: 'none',
                scrollTrigger: { trigger: cards[i + 1], start: 'top 75%', end: 'top 20%', scrub: true }
            });
        });
    }

    /* ======================================================================= 4. Case files: horizontal scroll */
    function caseFiles() {
        var projects = $('#projects');
        var D = window.PROJECT_SHOWCASE;
        if (!projects || !D || $('#casefiles')) return;
        var list = (D.mine || []).filter(function (p) { return p.case; });
        if (list.length < 2) return;
        var sec = h('section', 'lp-cf');
        sec.id = 'casefiles';
        sec.setAttribute('aria-label', 'Case files: flagship projects');
        sec.innerHTML = '<div class="cf-pin"><div class="cf-head"><span class="cf-eyebrow">Case files</span><h2 class="lp-sweep" data-t="Flagship projects">Flagship projects</h2>' +
            '<div class="cf-prog" aria-hidden="true"><i></i></div></div><div class="cf-track">' +
            list.map(function (p, i) {
                var c = p.case;
                return '<article class="cf-card"><div class="cf-shot"><img src="' + esc(prefix + p.img) + '" alt="' + esc(p.title) + ' screenshot" loading="lazy" decoding="async"><span class="cf-n">0' + (i + 1) + '</span></div>' +
                    '<div class="cf-body"><h3>' + esc(p.title) + '</h3><div class="cf-swap"><p class="cf-a"><b>Problem</b>' + esc(c.problem) + '</p><p class="cf-b"><b>How it works</b>' + esc(c.approach) + '</p></div>' +
                    '<div class="project-tech">' + (c.stack || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
                    '<div class="cf-links">' + (p.live ? '<a class="project-link" href="' + esc(p.live) + '" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live demo</a>' : '') +
                    (p.repo ? '<a class="project-link" href="' + esc(p.repo) + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Source</a>' : '') + '</div></div></article>';
            }).join('') + '</div></div>';
        projects.parentNode.insertBefore(sec, projects);

        var pin = $('.cf-pin', sec), track = $('.cf-track', sec), bar = $('.cf-prog i', sec), title = $('h2', sec);
        function dist() { return Math.max(0, track.scrollWidth - window.innerWidth + 120); }
        gsap.to(track, {
            x: function () { return -dist(); }, ease: 'none',
            scrollTrigger: {
                trigger: sec, start: 'top top', end: function () { return '+=' + dist(); }, pin: pin, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
                onUpdate: function (s) { bar.style.transform = 'scaleX(' + s.progress.toFixed(4) + ')'; }
            }
        });
        ScrollTrigger.create({ trigger: sec, start: 'top 70%', once: true, onEnter: function () { scramble(title, 'Flagship projects', 800); } });
    }

    /* ---------- run ---------- */
    var started = false;
    function run() {
        if (started || !ready()) return false;
        started = true;
        try { portrait(); story(); internships(); caseFiles(); } catch (e) { if (window.console) console.error('[story]', e); }
        /* images inside these sections must not pop in later and shift the pinned layout */
        $$('#about img, #story img, #certifications img, #badges img, #internships img, #casefiles img, #projects img').forEach(function (im) {
            if (im.getAttribute('loading') === 'lazy') im.setAttribute('loading', 'eager');
        });
        function relayout() {
            ScrollTrigger.refresh();
            if (window.AOS && AOS.refreshHard) AOS.refreshHard();      // AOS caches positions; the new pinned sections moved everything below them
            document.dispatchEvent(new CustomEvent('lp-relayout'));
        }
        window.dispatchEvent(new Event('resize'));
        setTimeout(relayout, 400);
        window.addEventListener('load', function () { setTimeout(relayout, 200); });
        if (window.ResizeObserver) {                                    // any later height change (fonts, images, filters) re-measures everything
            var rt = 0, lastH = document.body.offsetHeight;
            new ResizeObserver(function () {
                var hh = document.body.offsetHeight;
                if (Math.abs(hh - lastH) < 4) return;
                lastH = hh; clearTimeout(rt); rt = setTimeout(relayout, 350);
            }).observe(document.body);
        }
        return true;
    }
    var n = 0, iv = setInterval(function () { if (run() || ++n > 100) clearInterval(iv); }, 150);
})();
