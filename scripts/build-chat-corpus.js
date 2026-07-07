// Extracts real site content into chat-corpus.json, which Maya's retrieval
// engine searches as a fallback when no curated knowledge entry matches.
// Run this whenever page content changes: node scripts/build-chat-corpus.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'chat-corpus.json');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function stripHtml(str) {
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x[0-9a-fA-F]+;/g, '')
    .replace(/&#\d+;/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const docs = [];
let idCounter = 0;
function addDoc(page, title, text) {
  text = stripHtml(text);
  title = stripHtml(title);
  if (!text || text.length < 20) return;
  docs.push({ id: 'd' + (idCounter++), page: page, title: title, text: text });
}

// --- 1. FAQ items (faq.html, solutions.html) ---
function extractFaqs(file, page) {
  const html = read(file);
  const re = /<div class="faq-item">\s*<button class="faq-q"[^>]*>([\s\S]*?)<span class="chevron">[\s\S]*?<\/button>\s*<div class="faq-a">\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) {
    addDoc(page, m[1], m[2]);
  }
}
extractFaqs('faq.html', '/faq');
extractFaqs('solutions.html', '/solutions');

// --- 2. Project case studies (ourwork.html) ---
{
  const html = read('ourwork.html');
  const projectRe = /<h2 class="project-title">([\s\S]*?)<\/h2>([\s\S]*?)(?=<hr class="project-divider">|<h2 class="section-title")/g;
  let m;
  while ((m = projectRe.exec(html))) {
    const title = m[1];
    const body = m[2];
    const blockRe = /<div class="detail-label"[^>]*>([\s\S]*?)<\/div>\s*<p class="detail-text">([\s\S]*?)<\/p>/g;
    let b, parts = [];
    while ((b = blockRe.exec(body))) {
      parts.push(stripHtml(b[1]) + ': ' + stripHtml(b[2]));
    }
    if (parts.length) addDoc('/ourwork', title, parts.join(' '));
  }
}

// --- 3. Solution/service cards (solutions.html) ---
{
  const html = read('solutions.html');
  const re = /<div class="solution-title">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<p class="solution-desc">([\s\S]*?)<\/p>\s*<ul class="solution-bullets">([\s\S]*?)<\/ul>/g;
  let m;
  while ((m = re.exec(html))) {
    const bullets = [...m[3].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => stripHtml(x[1])).join('. ');
    addDoc('/solutions', m[1], stripHtml(m[2]) + ' ' + bullets);
  }
}

// --- 4. Generic <h3>...</h3><p>...</p> blocks (about.html, elyrac-company-profile.html) ---
function extractHeadingParas(file, page) {
  const html = read(file);
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) {
    addDoc(page, m[1], m[2]);
  }
  const h2re = /<h2 class="section-title"[^>]*>([\s\S]*?)<\/h2>\s*<p class="section-sub"[^>]*>([\s\S]*?)<\/p>/g;
  while ((m = h2re.exec(html))) {
    addDoc(page, m[1], m[2]);
  }
}
extractHeadingParas('about.html', '/about');
extractHeadingParas('elyrac-company-profile.html', '/elyrac-company-profile');

// --- 5. Team members (about.html) — combined into one document ---
{
  const html = read('about.html');
  const re = /<div class="team-name">([\s\S]*?)<\/div>\s*<div class="team-role">([\s\S]*?)<\/div>\s*<div class="team-tagline">([\s\S]*?)<\/div>/g;
  let m, lines = [];
  while ((m = re.exec(html))) {
    lines.push(stripHtml(m[1]) + ' — ' + stripHtml(m[2]) + ': ' + stripHtml(m[3]));
  }
  if (lines.length) addDoc('/about', 'Meet the Team', lines.join('. '));
}

// --- 6. Blog post excerpts (blog.html) ---
{
  const html = read('blog.html');
  const re = /<h3 class="blog-title">([\s\S]*?)<\/h3>\s*<p class="blog-excerpt">([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(html))) {
    addDoc('/blog', m[1], m[2]);
  }
}

fs.writeFileSync(OUT, JSON.stringify(docs, null, 2), 'utf8');
console.log('Wrote', docs.length, 'documents to chat-corpus.json');
