/**
 * PROJECT SHOWCASE RENDERER (shared by laptop/ and mobile/)
 * Reads window.PROJECT_SHOWCASE (data/projects-showcase.js) and replaces the project grid inside
 * #projects with: filter tabs (All · My Projects · Client Work) + cards that reuse the existing
 * .project-card markup, so every edition's own card styling and effects keep working.
 * If the data file is missing or anything fails, the original grid is left exactly as it was.
 */
(function () {
    'use strict';
    var D = window.PROJECT_SHOWCASE;
    if (!D || (!D.mine && !D.client)) return;

    window.__showcasePending = true;           // laptop.js waits for this before wiring card effects
    var prefix = window.PORTFOLIO_ROOT_PREFIX || '';

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function host(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return url; } }
    function initials(t) {
        var w = String(t).replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/);
        return ((w[0] || '')[0] || '') + ((w[1] || '')[0] || '');
    }

    function card(p, kind, i, idx) {
        var icon = (p.brand ? 'fab ' : 'fas ') + esc(p.icon || 'fa-code');
        var thumb;
        if (p.img) {
            thumb = '<div class="pj-thumb"><img src="' + esc(prefix + p.img) + '" alt="' + esc(p.title) + ' screenshot" loading="lazy" decoding="async"></div>';
        } else {
            thumb = '<div class="pj-thumb pj-thumb--tile" data-kind="' + kind + '" aria-hidden="true"><span class="pj-tile-mark">' +
                esc(initials(p.title).toUpperCase()) + '</span><span class="pj-tile-host">' + esc(p.live ? host(p.live) : 'source on GitHub') + '</span></div>';
        }
        var links = '';
        if (p.case) {
            links += '<button type="button" class="project-link pj-case-btn" data-case="' + idx + '"><i class="fas fa-book-open"></i> Case study <i class="fas fa-arrow-right"></i></button>';
        }
        if (p.live) {
            links += '<a class="project-link" href="' + esc(p.live) + '" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> ' +
                (kind === 'client' ? 'Visit Website' : 'Live Demo') + ' <i class="fas fa-arrow-right"></i></a>';
        }
        if (p.repo) {
            links += '<a class="project-link" href="' + esc(p.repo) + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Source Code <i class="fas fa-arrow-right"></i></a>';
        }
        var badge = kind === 'client' ? '<span class="pj-badge pj-badge--client">Client</span>'
            : (p.live ? '<span class="pj-badge pj-badge--live"><i></i>Live</span>' : '');
        return '<div class="project-card pj-card" data-kind="' + kind + '" data-aos="fade-up" data-aos-delay="' + ((i % 3) * 80) + '">' +
            thumb + badge +
            '<div class="project-card-header"><div class="project-icon"><i class="' + icon + '"></i></div><h3>' + esc(p.title) + '</h3></div>' +
            '<p>' + esc(p.desc) + '</p>' +
            (p.result ? '<p class="pj-result"><i class="fas fa-bolt"></i> ' + esc(p.result) + '</p>' : '') +
            '<div class="project-tech">' + (p.tags || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
            '<div class="project-card-footer">' + links + '</div></div>';
    }

    /* ---- case-study panel ---- */
    var modal, lastFocus;
    function openCase(p, trigger) {
        var c = p.case; if (!c) return;
        lastFocus = trigger;
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'pj-modal'; modal.hidden = true;
            modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'pjModalTitle');
            document.body.appendChild(modal);
            modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.pj-modal-x')) closeCase(); });
            document.addEventListener('keydown', function (e) {
                if (modal.hidden) return;
                if (e.key === 'Escape') closeCase();
                if (e.key === 'Tab') {
                    var f = modal.querySelectorAll('a,button'); if (!f.length) return;
                    var a = f[0], z = f[f.length - 1];
                    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
                    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
                }
            });
        }
        function row(label, val) { return val ? '<section><h4>' + label + '</h4><p>' + esc(val) + '</p></section>' : ''; }
        modal.innerHTML = '<div class="pj-modal-box"><button type="button" class="pj-modal-x" aria-label="Close case study"><i class="fas fa-times"></i></button>' +
            (p.img ? '<img class="pj-modal-img" src="' + esc(prefix + p.img) + '" alt="' + esc(p.title) + ' screenshot">' : '') +
            '<div class="pj-modal-body"><span class="pj-modal-eyebrow">Case study</span><h3 id="pjModalTitle">' + esc(p.title) + '</h3>' +
            row('The problem', c.problem) + row('My role', c.role) + row('How it works', c.approach) + row('Outcome', c.outcome || p.result) +
            ((c.stack || []).length ? '<div class="project-tech">' + c.stack.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
            '<div class="pj-modal-links">' + (p.live ? '<a class="project-link" href="' + esc(p.live) + '" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live Demo</a>' : '') +
            (p.repo ? '<a class="project-link" href="' + esc(p.repo) + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Source Code</a>' : '') + '</div></div></div>';
        modal.hidden = false;
        document.documentElement.classList.add('pj-modal-open');
        modal.querySelector('.pj-modal-x').focus();
    }
    function closeCase() {
        if (!modal || modal.hidden) return;
        modal.hidden = true;
        document.documentElement.classList.remove('pj-modal-open');
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    /* ---- testimonials (only when data/projects-showcase.js has entries) ---- */
    function testimonials(section) {
        var T = window.PROJECT_TESTIMONIALS;
        if (!T || !T.length || section.querySelector('.pj-quotes')) return;
        var w = document.createElement('div');
        w.className = 'pj-quotes';
        w.innerHTML = '<h3 class="pj-quotes-h">What clients say</h3><div class="pj-quotes-grid">' + T.map(function (t) {
            return '<figure class="pj-quote"><blockquote>' + esc(t.quote) + '</blockquote><figcaption><strong>' + esc(t.name) + '</strong>' + (t.role ? ' · ' + esc(t.role) : '') + '</figcaption></figure>';
        }).join('') + '</div>';
        var host = section.querySelector('.container') || section;
        host.appendChild(w);
    }

    /* ---- infinite client-work loop (two rows, opposite directions, pauses on hover) ---- */
    function loop(section, grid) {
        var list = (D.client || []).filter(function (c) { return c.img; });
        if (!list.length || section.querySelector('.pj-loop')) return;
        function item(c) {
            return '<a class="pj-loop-item" href="' + esc(c.live) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(c.title) + ' (opens the live site)">' +
                '<img src="' + esc(prefix + c.img) + '" alt="" loading="lazy" decoding="async"><span class="pj-loop-cap"><b>' + esc(c.title) + '</b><i>' + esc(host(c.live)) + '</i></span></a>';
        }
        function row(dir, shift) {
            var rot = list.slice(shift).concat(list.slice(0, shift));
            var once = rot.map(item).join('');
            return '<div class="pj-loop-row" data-dir="' + dir + '"><div class="pj-loop-track">' + once + once +
                '</div></div>';
        }
        var w = document.createElement('div');
        w.className = 'pj-loop';
        w.setAttribute('aria-label', 'Websites built for clients');
        w.innerHTML = '<p class="pj-loop-title"><span></span>Delivered for clients<span></span></p>' + row('l', 0);
        // the second copy is decorative: hide it from keyboard and screen readers
        Array.prototype.forEach.call(w.querySelectorAll('.pj-loop-track'), function (t) {
            var kids = t.children, half = kids.length / 2;
            for (var i = half; i < kids.length; i++) { kids[i].setAttribute('aria-hidden', 'true'); kids[i].tabIndex = -1; }
        });
        var home = document.getElementById('home');
        if (home && home.parentNode) {                     // first screen: right under the hero
            w.classList.add('pj-loop--band');
            home.parentNode.insertBefore(w, home.nextSibling);
        } else {
            grid.parentNode.insertBefore(w, grid.parentNode.querySelector('.pj-filter') || grid);
        }
    }

    function build() {
        var section = document.getElementById('projects');
        var grid = section && section.querySelector('.grid');
        if (!grid || !grid.querySelector('.project-card') || grid.classList.contains('pj-grid')) return false;

        var mine = D.mine || [], client = D.client || [];
        var all = mine.map(function (p) { return ['mine', p]; }).concat(client.map(function (p) { return ['client', p]; }));
        var html = all.map(function (x, i) { return card(x[1], x[0], i, i); }).join('');
        grid.classList.add('pj-grid');
        grid.innerHTML = html;

        testimonials(section);
        var sub = section.querySelector('.section-subtitle');
        if (sub && !sub.classList.contains('lp-split')) {
            sub.textContent = 'My own builds with live demos, plus websites delivered for clients';
        }

        loop(section, grid);
        var bar = document.createElement('div');
        bar.className = 'bento-filter-bar pj-filter';
        bar.setAttribute('role', 'group');
        bar.setAttribute('aria-label', 'Filter projects');
        var tabs = [
            ['all', 'fa-th-large', 'All', mine.length + client.length],
            ['mine', 'fa-code', 'My Projects', mine.length],
            ['client', 'fa-handshake', 'Client Work', client.length]
        ];
        bar.innerHTML = tabs.map(function (t, i) {
            return '<button type="button" class="bento-filter-tab' + (i === 0 ? ' active' : '') + '" data-pj="' + t[0] + '" aria-pressed="' + (i === 0) + '"><i class="fas ' + t[1] + '"></i> ' + t[2] + ' (' + t[3] + ')</button>';
        }).join('');
        grid.parentNode.insertBefore(bar, grid);

        var search = document.createElement('div');
        search.className = 'pj-search';
        search.innerHTML = '<i class="fas fa-search" aria-hidden="true"></i><input type="search" id="pjSearch" placeholder="Search projects or tags (AI, web app, school)..." aria-label="Search projects" autocomplete="off"><kbd aria-hidden="true">/</kbd>';
        grid.parentNode.insertBefore(search, grid);
        var empty = document.createElement('p');
        empty.className = 'pj-empty'; empty.hidden = true; empty.setAttribute('role', 'status');
        empty.textContent = 'No projects match that search. Try a tag such as AI or Web App.';
        grid.parentNode.insertBefore(empty, grid.nextSibling);
        var haystack = Array.prototype.map.call(grid.children, function (c) { return c.textContent.toLowerCase(); });
        var cur = 'all', q = '';

        function apply(kind) {
            cur = kind;
            var first = true, shown = 0;
            Array.prototype.forEach.call(grid.children, function (c, ci) {
                var show = (kind === 'all' || c.getAttribute('data-kind') === kind) &&
                    (!q || q.split(/\s+/).every(function (w) { return haystack[ci].indexOf(w) > -1; }));
                if (show) shown++;
                c.classList.toggle('pj-hide', !show);
                c.classList.remove('pj-lead');
                if (show && first) { c.classList.add('pj-lead'); first = false; }
                if (show) { c.classList.remove('pj-in'); void c.offsetWidth; c.classList.add('pj-in'); }
            });
            Array.prototype.forEach.call(bar.children, function (b) {
                var on = b.getAttribute('data-pj') === kind;
                b.classList.toggle('active', on);
                b.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            empty.hidden = shown > 0;
            window.dispatchEvent(new Event('resize'));          // laptop grid-balance recalculates
            if (window.AOS && AOS.refreshHard) AOS.refreshHard();
        }
        bar.addEventListener('click', function (e) {
            var b = e.target.closest('[data-pj]');
            if (b) apply(b.getAttribute('data-pj'));
        });
        var st;
        search.querySelector('input').addEventListener('input', function (e) {
            q = e.target.value.trim().toLowerCase();
            clearTimeout(st); st = setTimeout(function () { apply(cur); }, 120);
        });
        grid.addEventListener('click', function (e) {
            var b = e.target.closest('.pj-case-btn');
            if (b) openCase(all[+b.getAttribute('data-case')][1], b);
        });
        apply('all');
        if (window.AOS && AOS.refreshHard) AOS.refreshHard();
        return true;
    }

    function finish() {
        window.__showcasePending = false;
        document.dispatchEvent(new CustomEvent('showcase-ready'));
    }

    function attempt() {
        try { return build(); } catch (err) { if (window.console) console.error('[showcase]', err); return true; }
    }

    if (attempt()) { finish(); return; }
    var mo = new MutationObserver(function () {
        if (attempt()) { mo.disconnect(); clearTimeout(bail); finish(); }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    var bail = setTimeout(function () { mo.disconnect(); finish(); }, 8000);   // never block laptop.js forever
})();
