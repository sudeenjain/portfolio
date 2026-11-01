#!/usr/bin/env node
/**
 * build-knowledge.js
 * ---------------------------------------------------------------------------
 * Builds the chatbot's knowledge from your portfolio data so the bot and your
 * website never disagree.
 *
 *   Source : ../data/portfolio-data.js   (+ the EXTRAS block below)
 *   Output : knowledge-base.js            (loaded by sudeen-chatbot.js)
 *            gemini-proxy/worker.js       (Cloudflare Worker, knowledge embedded)
 *
 * Run from the project root whenever you change portfolio-data.js:
 *      node chatbot/build-knowledge.js
 * Then commit the regenerated files and re-deploy gemini-proxy/worker.js.
 * ---------------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ----- EXTRAS: facts that are not in portfolio-data.js (edit freely) --------
const EXTRAS = {
  // Your GitHub Pages site lives under /portfolio/ (repo name), not the bare domain.
  siteUrl: 'https://sudeenjain.github.io/portfolio/',
  sitePage: 'https://sudeenjain.github.io/portfolio/laptop/',
  phone: '+91 8762862509',
  location: 'Mangaluru (Mangalore), Karnataka, India',
  educationYears: '2022 – 2026',
  summary:
    'AI & Machine Learning engineer with hands-on experience in full-stack web development, machine learning, cloud technologies and database-driven applications. ' +
    'Builds and deploys practical software using Python, JavaScript, PHP, SQL, Supabase and modern web technologies.',
  instagramOverride: null, // null = use the link from portfolio-data.js
  // Skill groups from the resume (resume/resume.tex)
  skillGroups: [
    { name: 'Languages', items: ['Python', 'Java', 'JavaScript', 'SQL', 'HTML', 'CSS', 'PHP'] },
    { name: 'AI / ML', items: ['TensorFlow', 'Scikit-learn', 'OpenCV', 'Pandas'] },
    { name: 'Web & Backend', items: ['React', 'Node.js', 'Flask', 'FastAPI', 'REST APIs'] },
    { name: 'Databases & Cloud', items: ['MySQL', 'PostgreSQL', 'Supabase', 'MongoDB', 'AWS', 'Azure', 'Google Cloud'] },
    { name: 'Tools', items: ['Git', 'Docker', 'Linux'] }
  ],
  // Live links that exist in projects/project.txt but not in portfolio-data.js
  liveLinkPatch: {
    'Currency Converter': 'https://currency-converter-phi-one.vercel.app/',
    'Smart To-Do List': 'https://to-do-list-in-python.vercel.app/'
  },
  // Work listed in project.txt / resume but NOT shown on the portfolio page
  moreProjects: [
    { title: 'AI Resume Architect', desc: 'Listed on GitHub; no further description is provided.', tech: [], github: 'https://github.com/sudeenjain/AI-Resume_Architect', demo: '' },
    { title: 'AI Calculator', desc: 'Listed on GitHub; no further description is provided.', tech: [], github: 'https://github.com/sudeenjain/AI_Calculator', demo: '' },
    { title: 'Abhimo.com Website Development', desc: 'A modern, responsive website developed for Abhimo.com with a clean interface, structured content and a user-focused web experience.', tech: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design'], github: '', demo: 'https://abhimo.com' }
  ],
  // Certifications listed on the resume that are not in portfolio-data.js
  resumeCertifications: [
    { title: 'Agentic AI Certified Foundations Associate (2026)', issuer: 'Oracle', link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=EACAB45EE430A4B4A1B078E0E4474E90C71C0664D7FA65D30BE1E6E478DA0BC4' },
    { title: 'Project Management Fundamentals', issuer: 'IBM SkillsBuild', link: 'https://www.credly.com/go/cRerp16F' },
    { title: 'AI Fundamentals: Foundations for Understanding AI', issuer: 'IBM SkillsBuild', link: 'https://www.credly.com/badges/579477ca-6196-45c8-a9f5-2c9621c98f17/public_url' },
    { title: 'Lifelong Professional Skills', issuer: 'IBM SkillsBuild', link: 'https://www.credly.com/go/nuD07vsk' }
  ]
};
// ---------------------------------------------------------------------------

const root = path.resolve(__dirname, '..');
const dataSrc = fs.readFileSync(path.join(root, 'data', 'portfolio-data.js'), 'utf8');
const data = vm.runInNewContext(dataSrc + '\n;portfolioData;', {});

const social = (title) => (data.contact.socials.find(s => s.title === title) || {}).href || '';
const emailCard = data.contact.cards.find(c => /^mailto:/.test(c.linkHref));
const email = emailCard ? emailCard.linkHref.replace('mailto:', '') : 'sudinhr1@gmail.com';

const kb = {
  generatedFrom: 'data/portfolio-data.js',
  siteUrl: EXTRAS.siteUrl,
  profile: {
    name: 'Sudeen Jain H R',
    shortName: 'Sudeen',
    role: data.hero.roles[0],
    otherRoles: data.hero.roles.slice(1),
    degree: 'B.Tech in Artificial Intelligence & Machine Learning',
    university: 'Srinivas University, Mangaluru, India',
    educationYears: EXTRAS.educationYears,
    location: EXTRAS.location,
    summary: EXTRAS.summary,
    email,
    phone: EXTRAS.phone,
    github: social('GitHub'),
    linkedin: social('LinkedIn'),
    instagram: EXTRAS.instagramOverride || social('Instagram'),
    credly: data.badges.footerLinkHref,
    resumeFile: 'resume.pdf',
    website: EXTRAS.sitePage,
    resumePdf: EXTRAS.siteUrl + 'resume.pdf',
    sections: {
      about: EXTRAS.sitePage + '#about',
      skills: EXTRAS.sitePage + '#skills',
      projects: EXTRAS.sitePage + '#projects',
      internships: EXTRAS.sitePage + '#internships',
      certifications: EXTRAS.sitePage + '#certifications',
      resume: EXTRAS.sitePage + '#resume',
      contact: EXTRAS.sitePage + '#get-in-touch'
    },
    contactForm: 'The portfolio has a "Reach Out" contact form at ' + EXTRAS.sitePage + '#get-in-touch'
  },
  skills: {
    portfolio: data.skills.map(s => s.label),
    groups: EXTRAS.skillGroups
  },
  projects: data.projects.map(p => {
    const github = (p.links.find(l => !l.isDemo) || {}).href || '';
    let demo = (p.links.find(l => l.isDemo) || {}).href || '';
    if (!demo && EXTRAS.liveLinkPatch[p.title]) demo = EXTRAS.liveLinkPatch[p.title];
    return { title: p.title, desc: p.desc, tech: p.tech, github, demo, onPortfolio: true };
  }),
  moreProjects: EXTRAS.moreProjects.map(p => Object.assign({ onPortfolio: false }, p)),
  internships: data.internships.map(i => ({
    title: i.title, org: i.org, duration: i.duration, desc: i.desc, highlights: i.highlights, status: i.status
  })),
  badges: data.badges.items.map(b => ({
    title: b.title, issuer: b.issuer, desc: b.desc, date: b.date, expiry: b.expiry, skills: b.skills, link: b.linkHref
  })),
  certificates: {
    cards: data.certifications.cards.map(c => ({ title: c.title, desc: c.desc, link: c.linkHref })),
    gallery: data.certifications.gallery.map(g => ({
      category: g.name,
      items: g.items.map(it => {
        const alt = it.alt || '';
        const issuer = alt.startsWith(it.title) ? alt.slice(it.title.length).replace(/^\s*[–-]\s*/, '') : '';
        return { title: it.title, issuer };
      })
    })),
    fromResume: EXTRAS.resumeCertifications,
    linkedinAll: data.certifications.footerLinkHref
  },
  counts: {
    projects: data.projects.length,
    internships: data.internships.length,
    badges: data.badges.items.length,
    galleryCertificates: data.certifications.gallery.reduce((n, g) => n + g.items.length, 0)
  }
};

// ----- Plain-text version used as the Gemini prompt knowledge ---------------
function toText(k) {
  const L = [];
  const p = k.profile;
  L.push('# PROFILE');
  L.push(`Name: ${p.name}`);
  L.push(`Role: ${p.role} (also: ${p.otherRoles.join(', ')})`);
  L.push(`Education: ${p.degree}, ${p.university} (${p.educationYears})`);
  L.push(`Location: ${p.location}`);
  L.push(`Summary: ${p.summary}`);
  L.push(`Portfolio website: ${p.website}`);
  L.push('Portfolio sections (direct links):');
  Object.keys(p.sections).forEach(n => L.push(`- ${n}: ${p.sections[n]}`));
  L.push('');
  L.push('# CONTACT');
  L.push(`Email: ${p.email}`);
  L.push(`Phone / WhatsApp: ${p.phone}`);
  L.push(`GitHub: ${p.github}`);
  L.push(`LinkedIn: ${p.linkedin}`);
  L.push(`Instagram: ${p.instagram}`);
  L.push(`Credly badges: ${p.credly}`);
  L.push(`Resume section on the website: ${p.sections.resume}`);
  L.push(`Resume PDF download: ${p.resumePdf}`);
  L.push(`Contact form: ${p.contactForm}`);
  L.push('');
  L.push('# SKILLS');
  L.push(`Shown on portfolio: ${k.skills.portfolio.join(', ')}`);
  k.skills.groups.forEach(g => L.push(`${g.name} (from resume): ${g.items.join(', ')}`));
  L.push('');
  L.push(`# PROJECTS (the portfolio showcases ${k.counts.projects} projects)`);
  k.projects.forEach((x, i) => {
    L.push(`${i + 1}. ${x.title} — ${x.desc} Tech: ${x.tech.join(', ')}. ` +
      `GitHub: ${x.github || 'n/a'}. Live demo: ${x.demo || 'none listed (source code only)'}.`);
  });
  L.push('Other work listed outside the portfolio page:');
  k.moreProjects.forEach(x => {
    L.push(`- ${x.title} — ${x.desc} Tech: ${x.tech.length ? x.tech.join(', ') : 'not listed'}. GitHub: ${x.github || 'n/a'}. Live: ${x.demo || 'none listed'}.`);
  });
  L.push('');
  L.push(`# INTERNSHIPS (${k.counts.internships})`);
  k.internships.forEach((x, i) => {
    L.push(`${i + 1}. ${x.title} at ${x.org} (${x.duration}, ${x.status}). ${x.desc} Focus: ${x.highlights.join(', ')}.`);
  });
  L.push('');
  L.push(`# CREDLY / VERIFIED BADGES (${k.counts.badges})`);
  k.badges.forEach(b => {
    L.push(`- ${b.title} — ${b.issuer}, earned ${b.date}, ${b.expiry}. ${b.desc} Skills: ${b.skills.join(', ')}. Verify: ${b.link}`);
  });
  L.push('');
  L.push('# CERTIFICATE GALLERY (the portfolio highlights 12+ certifications and badges overall)');
  k.certificates.gallery.forEach(g => {
    L.push(`${g.category}:`);
    g.items.forEach(it => L.push(`- ${it.title}${it.issuer ? ' — ' + it.issuer : ''}`));
  });
  L.push('Featured certificate cards:');
  k.certificates.cards.forEach(c => L.push(`- ${c.title}: ${c.desc} (${c.link})`));
  L.push('Additional certifications on the resume:');
  k.certificates.fromResume.forEach(c => L.push(`- ${c.title} — ${c.issuer}. Verify: ${c.link}`));
  L.push(`All certificates on LinkedIn: ${k.certificates.linkedinAll}`);
  return L.join('\n');
}

const text = toText(kb);

// ----- Write knowledge-base.js ---------------------------------------------
const header =
  '/* AUTO-GENERATED by chatbot/build-knowledge.js from data/portfolio-data.js — do not edit by hand.\n' +
  '   Edit data/portfolio-data.js (or the EXTRAS block in build-knowledge.js) and re-run the script. */\n';
fs.writeFileSync(path.join(__dirname, 'knowledge-base.js'),
  header + 'window.SJ_KB = ' + JSON.stringify(kb, null, 2) + ';\n');

// ----- Write gemini-proxy/worker.js ----------------------------------------
const tpl = fs.readFileSync(path.join(__dirname, 'gemini-proxy', 'worker.template.js'), 'utf8');
if (!tpl.includes('__KNOWLEDGE_JSON__')) throw new Error('worker.template.js is missing __KNOWLEDGE_JSON__');
fs.writeFileSync(path.join(__dirname, 'gemini-proxy', 'worker.js'),
  tpl.replace('__KNOWLEDGE_JSON__', () => JSON.stringify(text)));

console.log('Knowledge built: %d projects, %d internships, %d badges, %d gallery certificates',
  kb.counts.projects, kb.counts.internships, kb.counts.badges, kb.counts.galleryCertificates);
console.log('Wrote chatbot/knowledge-base.js and chatbot/gemini-proxy/worker.js (%d chars of knowledge)', text.length);
