/* Google Analytics 4 loader.
 * 1) In Google Analytics create a GA4 property + Web data stream for https://sudeenjain.github.io/portfolio/
 * 2) Paste the Measurement ID (looks like G-ABC123XYZ9) below.  Until then, nothing is loaded or sent.
 * Tracking is skipped on localhost and when the browser sends "Do Not Track". */
(function () {
  var GA_ID = 'G-48Y1E7RS46';
  if (!/^G-[A-Z0-9]{6,}$/.test(GA_ID) || GA_ID === 'G-XXXXXXXXXX') return;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || navigator.doNotTrack === '1') return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
  var s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
})();
