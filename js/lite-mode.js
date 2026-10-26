/**
 * LITE MODE (diagnostic switch)
 * Open the site with ?lite=1 (e.g. .../laptop/?lite=1) to turn OFF the heavy decorative effects:
 * backdrop blur, CSS animations, filters, shadows, transitions and every canvas (3D scene, particles, neon cursor).
 * If scrolling feels smooth in lite mode, the lag comes from those effects on that device.
 */
(function () {
    if (!/[?&]lite=1/.test(location.search)) return;
    window.__LITE__ = true;
    document.documentElement.classList.add('lite');
    var st = document.createElement('style');
    st.textContent =
        'html.lite *{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;animation:none!important;' +
        'filter:none!important;box-shadow:none!important;text-shadow:none!important;transition:none!important}' +
        'html.lite canvas{display:none!important}';
    document.head.appendChild(st);
})();
