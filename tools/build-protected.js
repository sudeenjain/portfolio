#!/usr/bin/env node
/**
 * build-protected.js — makes a protected copy of the site in ../dist
 *
 *   cd tools && npm install && npm run build
 *
 * - JavaScript  -> obfuscated (your own files) / copied untouched (vendor libs, *.min.js)
 * - HTML        -> minified, inline scripts + styles minified/obfuscated
 * - CSS         -> minified
 * - Drops files that should not be public on the live site (docs, SQL, resume sources, workers, backups)
 *
 * Deploy ../dist (the GitHub Action in .github/workflows/deploy-protected.yml does it for you).
 * NOTE: nothing in a browser can be made truly unreadable; this makes copying slow and painful.
 */
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const CleanCSS = require('clean-css');
const { minify: minifyHtml } = require('html-minifier-terser');
const { minify: terser } = require('terser');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dist');
const YEAR = new Date().getFullYear();
const BANNER = `/*! (c) ${YEAR} Sudeen Jain H R. All rights reserved. Copying or reuse without written permission is not allowed. */\n`;

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.github', 'tools', 'supabase', 'docs', 'resume', 'projects', 'gemini-proxy']);
const SKIP_FILES = /(\.md|\.sql|\.tex|\.py|\.txt|\.bak|\.backup|\.yml|\.yaml|\.htaccess|\.gitignore|\.gitkeep|build-knowledge\.js|worker(\.template)?\.js)$|index\.backup\.html$/i;
const KEEP_JS = /(^|\/)vendor\/|\.min\.js$/i;     // third-party libraries: leave as they are
const OBF = {
  compact: true,
  simplify: true,
  stringArray: true,
  stringArrayThreshold: 0.8,
  stringArrayEncoding: ['base64'],
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,            // pages call each other through window globals
  renameProperties: false,         // would break DOM / library property names
  splitStrings: true,
  splitStringsChunkLength: 8,
  transformObjectKeys: false,
  numbersToExpressions: true,
  controlFlowFlattening: false,    // keeps the 3D scene fast
  deadCodeInjection: false,
  selfDefending: false,
  debugProtection: false,
  disableConsoleOutput: false,
  unicodeEscapeSequence: false,
  target: 'browser'
};

const isModule = (src) => /^\s*(import|export)\s[\s\S]*?['"{*]/m.test(src) && /^\s*(import\s.+from|export\s)/m.test(src);
function obfuscate(src, rel) {
  try {
    return BANNER + JavaScriptObfuscator.obfuscate(src, Object.assign({}, OBF, { sourceType: isModule(src) ? 'module' : 'script' })).getObfuscatedCode();
  } catch (e) {
    console.warn('  ! obfuscation failed for', rel, '-', e.message.split('\n')[0], '(minified instead)');
    return null;
  }
}

async function jsFile(src, rel) {
  const o = obfuscate(src, rel);
  if (o) return o;
  const t = await terser(src, { module: isModule(src), compress: true, mangle: true });
  return BANNER + t.code;
}

const stats = { js: 0, css: 0, html: 0, copied: 0, skipped: 0 };

async function walk(dir, rel = '') {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const r = rel ? rel + '/' + name : name;
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(name) && !(name === 'resume' && false)) { stats.skipped++; continue; }
      await walk(abs, r);
      continue;
    }
    if (SKIP_FILES.test(name) && !/resume\.pdf$/i.test(name)) { stats.skipped++; continue; }
    const dest = path.join(OUT, r);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const ext = path.extname(name).toLowerCase();

    if (ext === '.js' && !KEEP_JS.test(r)) {
      fs.writeFileSync(dest, await jsFile(fs.readFileSync(abs, 'utf8'), r)); stats.js++;
    } else if (ext === '.css') {
      const out = new CleanCSS({ level: 1 }).minify(fs.readFileSync(abs, 'utf8'));
      fs.writeFileSync(dest, out.errors.length ? fs.readFileSync(abs) : BANNER + out.styles); stats.css++;
    } else if (ext === '.html') {
      const html = fs.readFileSync(abs, 'utf8');
      try {
        const out = await minifyHtml(html, {
          collapseWhitespace: true, conservativeCollapse: true, removeComments: true,
          minifyCSS: true,
          minifyJS: async (text) => {
            if (!text.trim()) return text;
            const o = obfuscate(text, r + ' (inline)');
            if (o) return o.replace(BANNER, '');
            const t = await terser(text); return t.code || text;
          }
        });
        fs.writeFileSync(dest, `<!-- (c) ${YEAR} Sudeen Jain H R. All rights reserved. -->\n` + out); stats.html++;
      } catch (e) {
        console.warn('  ! html minify failed for', r, '-', e.message.split('\n')[0], '(copied as is)');
        fs.copyFileSync(abs, dest); stats.copied++;
      }
    } else {
      fs.copyFileSync(abs, dest); stats.copied++;
    }
  }
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  await walk(ROOT);
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
  console.log(`Protected build ready in dist/  ->  ${stats.js} js obfuscated, ${stats.css} css, ${stats.html} html minified, ${stats.copied} files copied, ${stats.skipped} skipped`);
})().catch((e) => { console.error(e); process.exit(1); });
