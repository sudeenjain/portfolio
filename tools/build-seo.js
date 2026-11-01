#!/usr/bin/env node
/**
 * SEO / AEO BUILD STEP  (no dependencies)
 * ----------------------------------------------------------------
 * Reads data/portfolio-data.js (your single source of truth) and writes plain-HTML copies of
 * your content into laptop/index.html, mobile/index.html and index.html, so search engines and
 * AI crawlers that do NOT run JavaScript can still read it. At runtime js/portfolio-renderer.js
 * replaces these sections with the animated versions, so visitors see no difference.
 * It also generates: FAQ section + FAQPage JSON-LD, sitemap.xml, robots.txt, llms.txt.
 *
 * Run after editing data/portfolio-data.js:      node tools/build-seo.js
 * Safe to re-run any time (idempotent).
 * ---------------------------------------------------------------- */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://sudeenjain.github.io/portfolio/';
const R = (p) => path.join(ROOT, p);
const read = (p) => fs.readFileSync(R(p), 'utf8');
const write = (p, s) => fs.writeFileSync(R(p), s);

const data = vm.runInNewContext(read('data/portfolio-data.js') + '\n;portfolioData', {});
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const join = (arr) => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];

/* ---------- structured data: reuse the existing graph, fix the missing image ---------- */
const LD_RE = /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/;
const graph = JSON.parse(read('laptop/index.html').match(LD_RE)[1]);
const person = graph['@graph'].find((n) => n['@type'] === 'Person');
const photo = graph['@graph'].find((n) => n['@type'] === 'ImageObject');
photo.url = photo.contentUrl = SITE + 'assets/profile.jpg';   // the old assets/sudeen-jain-hr.jpg did not exist
photo.width = 800; photo.height = 800;

/* ---------- richer structured data (AEO): credentials, education, project list, freshness ---------- */
const showcase = (function () { try { const w = {}; vm.runInNewContext(read('data/projects-showcase.js'), { window: w }); return w.PROJECT_SHOWCASE || { mine: [], client: [] }; } catch (e) { return { mine: [], client: [] }; } })();
const TODAY = new Date().toISOString().slice(0, 10);
const _certs = (data.certifications && data.certifications.cards) || [];
person.alumniOf = { '@type': 'CollegeOrUniversity', name: 'Srinivas University', address: { '@type': 'PostalAddress', addressRegion: 'Karnataka', addressCountry: 'IN' } };
person.hasCredential = _certs.map((c) => ({ '@type': 'EducationalOccupationalCredential', name: c.title, description: c.desc, ...(c.linkHref && /^https/.test(c.linkHref) ? { url: c.linkHref } : {}) }));
person.knowsAbout = Array.from(new Set((person.knowsAbout || []).concat((data.skills || []).map((s) => s.label))));
const _mail = ((data.contact.cards.find((c) => /^mailto:/.test(c.linkHref)) || {}).linkHref || '').replace('mailto:', '');
if (_mail) person.email = _mail;
const pp = graph['@graph'].find((n) => n['@type'] === 'ProfilePage');
pp.dateModified = TODAY;
pp.speakable = { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.lead', '#faq summary'] };
graph['@graph'] = graph['@graph'].filter((n) => n['@id'] !== 'https://sudeenjain.github.io/portfolio/#projects');
graph['@graph'].push({
  '@type': 'ItemList', '@id': SITE + '#projects', name: 'Projects by ' + person.name, numberOfItems: (showcase.mine || []).length,
  itemListElement: (showcase.mine || []).map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: {
    '@type': 'SoftwareSourceCode', name: p.title, description: p.desc, author: { '@id': SITE + '#person' },
    ...(p.repo ? { codeRepository: p.repo } : {}), ...(p.live ? { url: p.live } : {}), ...(p.tags ? { keywords: p.tags.join(', ') } : {}) } }))
});
const ldSafe = (o) => JSON.stringify(o, null, 2).replace(/</g, '\\u003c');
const LD_BLOCK = '<script type="application/ld+json">\n' + ldSafe(graph) + '\n    </script>';

/* ---------- FAQ (visible text and JSON-LD are built from the same strings) ---------- */
const projects = data.projects || [], interns = data.internships || [], certs = (data.certifications && data.certifications.cards) || [];
const email = ((data.contact.cards.find((c) => /^mailto:/.test(c.linkHref)) || {}).linkHref || '').replace('mailto:', '');
const FAQ = [
  ['Who is ' + person.name + '?', person.description],
  ['What skills does ' + person.givenName + ' have?', person.givenName + "'s skills include " + join(data.skills.map((s) => s.label)) + '.'],
  ['What projects has ' + person.givenName + ' built?', 'He has built ' + projects.length + ' projects, including ' + join(projects.slice(0, 5).map((p) => p.title)) + '. Source code is available on GitHub at https://github.com/sudeenjain.'],
  ['What internships has ' + person.givenName + ' completed?', join(interns.map((i) => i.title + ' at ' + i.org + (i.duration ? ' (' + i.duration + ')' : ''))) + '.'],
  ['What certifications does ' + person.givenName + ' hold?', 'His certifications include ' + join(certs.map((c) => c.title)) + '. Badges can be verified on Credly at https://www.credly.com/users/sudeenjain.'],
  ['How can I contact ' + person.givenName + '?', 'By email at ' + email + ', on LinkedIn at https://www.linkedin.com/in/sudeenjain, or on GitHub at https://github.com/sudeenjain.'],
  ['Is "sudeenjain" the same person as ' + person.name + '?', 'Yes. "sudeenjain" is the username ' + person.name + ' uses on GitHub, LinkedIn, Instagram and Credly. Searches for Sudeen Jain, sudeenjain or Sudeen Jain H R all refer to him.'],
  ['Where is ' + person.givenName + ' based?', 'He studies at Srinivas University in Karnataka, India.'],
  ['Has ' + person.givenName + ' built websites for clients?', (showcase.client || []).length ? 'Yes. He has built ' + (showcase.client || []).length + ' client websites, including ' + join((showcase.client || []).slice(0, 4).map((c) => c.title)) + '. They are listed in the Projects section of the portfolio.' : 'Yes, client websites are listed in the Projects section of the portfolio.'],
  ['Where can I see ' + person.givenName + "'s source code?", 'His public repositories are at https://github.com/sudeenjain, and each project links to its own repository.'],
  ['Where can I download ' + person.givenName + "'s resume?", 'The latest resume is available as a PDF at ' + SITE + 'resume/resume.pdf.']
];
const FAQ_LD = { '@context': 'https://schema.org', '@type': 'FAQPage', '@id': SITE + '#faq', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
const FAQ_LD_BLOCK = '<script type="application/ld+json" id="seo-faq-ld">\n' + ldSafe(FAQ_LD) + '\n    </script>';
const FAQ_HTML = '<section id="faq" class="seo-faq" aria-labelledby="faq-h">\n<!--seo:start-->\n<div class="seo-wrap"><h2 id="faq-h">Frequently asked questions</h2>\n' +
  FAQ.map(([q, a]) => '<details><summary>' + esc(q) + '</summary><p>' + esc(a) + '</p></details>').join('\n') + '\n</div>\n<!--seo:end-->\n</section>';

/* ---------- static section builders ---------- */
const ul = (items) => '<ul>' + items.map((i) => '<li>' + i + '</li>').join('') + '</ul>';
const A = (href, label) => '<a href="' + esc(href) + '" rel="noopener">' + esc(label) + '</a>';
const S = {
  about: () => '<h2>About</h2>' + data.about.paragraphs.map((p) => '<p>' + esc(p) + '</p>').join('') + ul(data.about.tags.map((t) => esc(t.label))),
  skills: () => '<h2>Skills</h2>' + ul(data.skills.map((s) => esc(s.label))),
  certifications: () => '<h2>Certifications</h2>' + ul(certs.map((c) => '<strong>' + esc(c.title) + '</strong>: ' + esc(c.desc) + (c.linkHref ? ' ' + A(c.linkHref, c.linkLabel || 'View badge') : ''))),
  internships: () => '<h2>Internships</h2>' + ul(interns.map((i) => '<strong>' + esc(i.title) + '</strong>, ' + esc(i.org) + (i.duration ? ' (' + esc(i.duration) + ')' : '') + '. ' + esc(i.desc))),
  projects: () => '<h2>Projects</h2>' + ul(projects.map((p) => '<strong>' + esc(p.title) + '</strong>: ' + esc(p.desc) + (p.tech && p.tech.length ? ' Technologies: ' + esc(p.tech.join(', ')) + '.' : '') + ' ' + (p.links || []).map((l) => A(l.href, l.label)).join(' '))),
  contact: () => '<h2>Contact</h2>' + ul(data.contact.cards.map((c) => esc(c.label) + ': ' + A(c.linkHref, c.linkText)).concat([A(SITE + 'resume/resume.pdf', 'Resume (PDF)')]))
};

function fillSection(html, id, inner) {
  const re = new RegExp('<section id="' + id + '">[\\s\\S]*?</section>');
  if (!re.test(html)) throw new Error('section #' + id + ' not found');
  return html.replace(re, '<section id="' + id + '">\n<!--seo:start-->\n<div class="container seo-static">' + inner + '</div>\n<!--seo:end-->\n</section>');
}
function upsertFaq(html) {
  const re = /<section id="faq"[\s\S]*?<\/section>/;
  if (re.test(html)) return html.replace(re, () => FAQ_HTML);
  return html.replace(/(<section id="get-in-touch">[\s\S]*?<\/section>)/, (m) => m + '\n    ' + FAQ_HTML);
}
function upsertLd(html) {
  html = html.replace(LD_RE, () => LD_BLOCK);
  const re = /<script type="application\/ld\+json" id="seo-faq-ld">[\s\S]*?<\/script>/;
  return re.test(html) ? html.replace(re, () => FAQ_LD_BLOCK) : html.replace(LD_BLOCK, () => LD_BLOCK + '\n    ' + FAQ_LD_BLOCK);
}
function ensureCss(html, href) {
  return html.includes('seo-static.css') ? html : html.replace(/(<link rel="stylesheet" href="[^"]*css\/style\.css">)/, '$1\n    <link rel="stylesheet" href="' + href + '">');
}

/* ---------- laptop + mobile ---------- */
for (const f of ['laptop/index.html', 'mobile/index.html']) {
  let h = read(f);
  for (const id of Object.keys(S)) h = fillSection(h, id, S[id]());
  h = upsertFaq(h); h = upsertLd(h); h = ensureCss(h, '../css/seo-static.css');
  write(f, h); console.log('updated', f);
}

/* ---------- root page ---------- */
{
  let h = read('index.html');
  const body = '<!--seo:root:start-->\n<h1>' + esc(person.name) + '</h1>\n<p class="lead">' + esc(person.description) + '</p>\n' +
    '<p class="updated">Last updated: <time datetime="' + TODAY + '">' + TODAY + '</time></p>\n' + '<p class="cta"><a class="btn" href="laptop/">Open the interactive portfolio</a> <a class="btn alt" href="mobile/">Mobile version</a> <a class="btn alt" href="resume/resume.pdf">Resume (PDF)</a></p>\n' +
    Object.keys(S).map((id) => '<section id="' + id + '" class="seo-static">' + S[id]() + '</section>').join('\n') + '\n' + FAQ_HTML.replace(/<!--seo:(start|end)-->\n?/g, '') + '\n<!--seo:root:end-->';
  h = h.replace(/<!--seo:root:start-->[\s\S]*?<!--seo:root:end-->/, () => body);
  h = upsertLd(h);
  write('index.html', h); console.log('updated index.html');
}

/* ---------- sitemap.xml / robots.txt / llms.txt / llms-full.txt ---------- */
const today = TODAY;
const url = (loc, pri, freq, extra) => '  <url>\n    <loc>' + loc + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>' + freq + '</changefreq>\n    <priority>' + pri + '</priority>\n' + (extra || '') + '  </url>\n';
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
  url(SITE, '1.0', 'monthly', '    <xhtml:link rel="alternate" media="only screen and (max-width: 767px)" href="' + SITE + 'mobile/"/>\n    <image:image><image:loc>' + SITE + 'assets/profile.jpg</image:loc><image:title>' + esc(person.name) + '</image:title></image:image>\n') +
  url(SITE + 'resume/resume.pdf', '0.6', 'monthly') + url(SITE + 'llms.txt', '0.4', 'monthly') + url(SITE + 'llms-full.txt', '0.4', 'monthly') + '</urlset>\n');

/* robots.txt: ONE group so every crawler gets the same private-folder rules (a bot with its own group ignores the "*" group). */
const bots = ['*', 'Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'DuckDuckBot', 'DuckAssistBot', 'Amazonbot', 'Meta-ExternalAgent', 'cohere-ai', 'MistralAI-User'];
const ROBOTS = '# robots.txt for https://sudeenjain.github.io/  (portfolio lives at /portfolio/)\n' +
  '# Crawlers only read this file from the DOMAIN ROOT, so deploy it in the repo named "sudeenjain.github.io".\n' +
  '# One group: search engines AND AI answer engines are welcome on the portfolio; internal folders are off limits.\n' +
  '# NOTE: robots.txt is a polite request, not security. Never put private files in any public repo.\n\n' +
  bots.map((b) => 'User-agent: ' + b).join('\n') + '\n' +
  'Allow: /portfolio/\nDisallow: /portfolio/admin/\nDisallow: /portfolio/supabase/\nDisallow: /portfolio/tools/\nDisallow: /portfolio/includes/\nDisallow: /portfolio/chatbot/gemini-proxy/\nDisallow: /portfolio/index.backup.html\n\n' +
  '# Optional: uncomment to opt out of pure AI-training crawlers (they do not power search answers).\n# User-agent: CCBot\n# User-agent: Bytespider\n# Disallow: /\n\n' +
  'Sitemap: ' + SITE + 'sitemap.xml\n';
write('robots.txt', ROBOTS);
try { fs.mkdirSync(R('seo-deploy/user-site-root'), { recursive: true }); } catch (e) {}
write('seo-deploy/user-site-root/robots.txt', ROBOTS);
write('seo-deploy/user-site-root/README.txt', 'Copy robots.txt from this folder into the ROOT of your "sudeenjain.github.io" repository (not the portfolio repo).\nIt must then open at https://sudeenjain.github.io/robots.txt\n');

const links = (data.contact.cards.filter((c) => /^https/.test(c.linkHref)).map((c) => '- [' + c.label + '](' + c.linkHref + ')'));
write('llms.txt', '# ' + person.name + '\n\n> ' + person.description + '\n\n## Main pages\n- [Portfolio (interactive)](' + SITE + 'laptop/)\n- [Portfolio (text version)](' + SITE + ')\n- [Full profile for AI (llms-full.txt)](' + SITE + 'llms-full.txt)\n- [Resume (PDF)](' + SITE + 'resume/resume.pdf)\n' + links.join('\n') + '\n\n## Projects\n' +
  projects.map((p) => '- ' + p.title + ': ' + p.desc + ((p.links || [])[0] ? ' (' + p.links[0].href + ')' : '')).join('\n') + '\n\n## Internships\n' +
  interns.map((i) => '- ' + i.title + ', ' + i.org + (i.duration ? ' (' + i.duration + ')' : '')).join('\n') + '\n\n## Skills\n' + data.skills.map((s) => s.label).join(', ') + '\n\n## Contact\n- Email: ' + email + '\n');

write('llms-full.txt', '# ' + person.name + ' - full profile\n\n> ' + person.description + '\n\nAlso searched as: Sudeen Jain, sudeenjain, Sudeen H R. Last updated: ' + today + '.\n\n' +
  '## About\n' + data.about.paragraphs.join('\n\n') + '\n\n## Skills\n' + data.skills.map((s) => '- ' + s.label).join('\n') + '\n\n' +
  '## Internships\n' + interns.map((i) => '### ' + i.title + ' - ' + i.org + (i.duration ? ' (' + i.duration + ')' : '') + '\n' + (i.desc || '')).join('\n\n') + '\n\n' +
  '## Certifications\n' + certs.map((c) => '- ' + c.title + ': ' + c.desc + (c.linkHref ? ' ' + c.linkHref : '')).join('\n') + '\n\n' +
  '## Projects\n' + (showcase.mine || []).map((p) => '### ' + p.title + '\n' + p.desc + (p.tags ? '\nTags: ' + p.tags.join(', ') : '') + (p.live ? '\nLive: ' + p.live : '') + (p.repo ? '\nSource: ' + p.repo : '')).join('\n\n') + '\n\n' +
  '## Client websites\n' + (showcase.client || []).map((c) => '- ' + c.title + ': ' + c.desc + (c.live ? ' ' + c.live : '')).join('\n') + '\n\n' +
  '## Frequently asked questions\n' + FAQ.map(([q, a]) => '**' + q + '**\n' + a).join('\n\n') + '\n\n' +
  '## Links\n- Portfolio: ' + SITE + '\n- Resume: ' + SITE + 'resume/resume.pdf\n' + links.join('\n') + '\n- Email: ' + email + '\n');
console.log('wrote sitemap.xml robots.txt llms.txt llms-full.txt seo-deploy/');
