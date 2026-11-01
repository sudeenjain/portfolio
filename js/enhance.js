/**
 * SHARED ENHANCEMENTS (laptop/ and mobile/)
 *  - Contact form: sends through Formspree in the background and shows a clear success / error message
 *    (visitors stay on the page, and a failed send is never silent).
 *  - Laptop only: "Download CV" pill in the header and keyboard shortcuts (press ? to see them).
 * Nothing here changes data/portfolio-data.js.
 */
(function () {
    'use strict';
    var prefix = window.PORTFOLIO_ROOT_PREFIX || '';
    var isLaptop = /\/laptop(\/|$)/.test(location.pathname) || !!document.querySelector('.lp-hud, script[src$="laptop.js"]');

    /* ---------- contact form ---------- */
    document.addEventListener('submit', function (e) {
        var form = e.target;
        if (!form.classList || !form.classList.contains('cyber-form') || !window.fetch) return;
        var action = (form.getAttribute('action') || '').trim();
        if (!/^https:\/\/formspree\.io\//.test(action)) return;      // unknown endpoint: let the browser handle it
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var status = form.querySelector('.cf-status');
        if (!status) {
            status = document.createElement('p');
            status.className = 'cf-status';
            status.setAttribute('role', 'status');
            status.setAttribute('aria-live', 'polite');
            form.appendChild(status);
        }
        var label = btn && btn.innerHTML;
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...'; }
        status.className = 'cf-status'; status.textContent = '';
        fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                form.reset();
                status.className = 'cf-status cf-ok';
                status.textContent = 'Message sent. Thank you, I will get back to you soon.';
            })
            .catch(function () {
                status.className = 'cf-status cf-err';
                status.textContent = 'Could not send the message. Please check your connection and try again.';
            })
            .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = label; } });
    }, true);

    if (!isLaptop) return;

    /* ---------- laptop: Download CV pill ---------- */
    function addCV() {
        var box = document.getElementById('navLinksContainer');
        if (!box) return false;
        if (!box.querySelector('.lp-cv')) {
            var a = document.createElement('a');
            a.className = 'lp-cv';
            a.href = prefix + 'resume.pdf';
            a.setAttribute('download', '');
            a.innerHTML = '<i class="fas fa-download" aria-hidden="true"></i> CV';
            a.setAttribute('aria-label', 'Download resume (PDF)');
            box.appendChild(a);
        }
        return true;
    }
    var tries = 0, t = setInterval(function () { if (addCV() || ++tries > 40) clearInterval(t); }, 150);

    /* ---------- laptop: keyboard shortcuts ---------- */
    var SECTIONS = { h: ['home'], a: ['about'], s: ['skills'], k: ['certifications'], p: ['projects'], r: ['resume'], c: ['get-in-touch', 'contact'] };
    var help, pendingG = 0;

    function typing(el) { return el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable); }
    function go(keys) {
        for (var i = 0; i < keys.length; i++) {
            if (document.getElementById(keys[i])) {
                var a = document.createElement('a');          // reuses the page's own anchor handling (curtain / smooth scroll)
                a.href = '#' + keys[i];
                document.body.appendChild(a); a.click(); a.remove();
                return;
            }
        }
    }
    function toggleHelp(show) {
        if (!help) {
            help = document.createElement('div');
            help.className = 'lp-keys'; help.hidden = true;
            help.setAttribute('role', 'dialog'); help.setAttribute('aria-label', 'Keyboard shortcuts');
            help.innerHTML = '<div class="lp-keys-box"><h3>Keyboard shortcuts</h3><ul>' +
                '<li><kbd>/</kbd> search projects</li><li><kbd>g</kbd> <kbd>h</kbd> home</li><li><kbd>g</kbd> <kbd>a</kbd> about</li>' +
                '<li><kbd>g</kbd> <kbd>s</kbd> skills</li><li><kbd>g</kbd> <kbd>k</kbd> certifications</li><li><kbd>g</kbd> <kbd>p</kbd> projects</li>' +
                '<li><kbd>g</kbd> <kbd>r</kbd> resume</li><li><kbd>g</kbd> <kbd>c</kbd> contact</li><li><kbd>3</kbd> 3D background on / off</li><li><kbd>?</kbd> this help &nbsp; <kbd>Esc</kbd> close</li></ul></div>';
            help.addEventListener('click', function () { toggleHelp(false); });
            document.body.appendChild(help);
        }
        help.hidden = show === undefined ? !help.hidden : !show;
    }

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.key === 'Escape') { if (help && !help.hidden) toggleHelp(false); return; }
        if (typing(e.target)) return;
        var k = e.key;
        if (k === '/') {
            var inp = document.getElementById('pjSearch');
            if (inp) { e.preventDefault(); go(['projects']); setTimeout(function () { inp.focus({ preventScroll: true }); }, 700); }
        } else if (k === '?') { toggleHelp(); }
        else if (k === '3') { document.dispatchEvent(new CustomEvent('lp-3d-toggle')); }
        else if (k === 'g') { pendingG = Date.now(); }
        else if (pendingG && Date.now() - pendingG < 1200 && SECTIONS[k.toLowerCase()]) {
            pendingG = 0; go(SECTIONS[k.toLowerCase()]);
        }
    });
})();
