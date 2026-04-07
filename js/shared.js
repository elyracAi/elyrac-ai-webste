/* ============================================================
   elyrac AI — shared.js
   Three.js hero · 3D card tilt · Counter animations · Magnetic
   buttons · Scroll reveal · Draggable chatbot · Theme toggle
   ============================================================ */
'use strict';

/* ===================== CUSTOM CURSOR ===================== */
const cursor   = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
if (cursor && cursorRing) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  });
  (function animRing() {
    rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
    cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a,button,[tabindex],.service-card,.diff-card,.blog-card,.value-card,.tech-chip,.portfolio-card,.solution-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',  () => document.body.classList.remove('cursor-hover'));
  });
}

/* ===================== SCROLL REVEAL ===================== */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ===================== NAVBAR SCROLL ===================== */
const nav = document.getElementById('nav');
if (nav) {
  const tick = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

/* ===================== ACTIVE NAV LINK ===================== */
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

/* ===================== MOBILE MENU ===================== */
const hamburger  = document.querySelector('.nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.querySelector('.mobile-close');
const openMenu  = () => { if (mobileMenu) { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; } };
const closeMenu = () => { if (mobileMenu) { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; } };
if (hamburger)   hamburger.addEventListener('click', openMenu);
if (mobileClose) mobileClose.addEventListener('click', closeMenu);
if (mobileMenu)  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

/* ===================== THEME TOGGLE ===================== */
const themeBtn = document.getElementById('theme-btn');
function applyTheme(m) {
  document.body.classList.toggle('light-mode', m === 'light');
  if (themeBtn) themeBtn.textContent = m === 'light' ? '☀️' : '🌙';
  document.querySelectorAll('.logo-swap').forEach(img => {
    img.src = m === 'light' ? 'Brand assets/Elyrac Ai-05.png' : 'Brand assets/Elyrac Ai-06 (1).png';
  });
}
const savedTheme = localStorage.getItem('elyrac-theme') || 'dark';
applyTheme(savedTheme);
if (themeBtn) themeBtn.addEventListener('click', () => {
  const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
  localStorage.setItem('elyrac-theme', next); applyTheme(next);
});

/* ===================== THREE.JS HERO (with CDN fallback) ===================== */
function initHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Try Three.js — if not loaded, fall back to 2D
  if (typeof THREE !== 'undefined') {
    initThreeHero(canvas);
  } else {
    initCanvasHero(canvas);
  }
}

function initThreeHero(canvas) {
  const W = () => canvas.offsetWidth, H = () => canvas.offsetHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 200);
  camera.position.z = 5;

  // --- Particle field ---
  const COUNT = 1200;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i*3]   = (Math.random() - .5) * 20;
    pos[i*3+1] = (Math.random() - .5) * 14;
    pos[i*3+2] = (Math.random() - .5) * 10;
  }
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const ptMat = new THREE.PointsMaterial({ color: 0x5B9BF5, size: 0.04, transparent: true, opacity: 0.7 });
  scene.add(new THREE.Points(ptGeo, ptMat));

  // --- Wireframe geometric shapes ---
  const shapes = [];
  const mkShape = (geo, x, y, z) => {
    const mat = new THREE.MeshBasicMaterial({ color: 0x6EBBFF, wireframe: true, transparent: true, opacity: 0.25 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    scene.add(mesh); shapes.push(mesh); return mesh;
  };
  mkShape(new THREE.OctahedronGeometry(1.2, 0),  2.5,  0.5, -2);
  mkShape(new THREE.OctahedronGeometry(0.7, 0), -3.0, -1.0, -1);
  mkShape(new THREE.IcosahedronGeometry(0.9, 0),  0.0,  1.2, -3);
  mkShape(new THREE.TetrahedronGeometry(0.6, 0),  3.5, -1.5, -1);
  mkShape(new THREE.OctahedronGeometry(0.5, 0), -1.5,  2.0, -2);

  // --- Connection lines (dynamic) ---
  const lineMat = new THREE.LineBasicMaterial({ color: 0x5B9BF5, transparent: true, opacity: 0.15 });
  const lineGeo = new THREE.BufferGeometry();
  const lineVerts = new Float32Array(600);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(lineVerts, 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  // Mouse parallax
  let tx = 0, ty = 0, camX = 0, camY = 0;
  document.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth  - 0.5) * 1.6;
    ty = (e.clientY / window.innerHeight - 0.5) * -1.0;
  });

  // Resize
  window.addEventListener('resize', () => {
    renderer.setSize(W(), H());
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
  }, { passive: true });

  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    t += 0.005;

    // Rotate shapes
    shapes.forEach((s, i) => {
      s.rotation.x += 0.003 + i * 0.0005;
      s.rotation.y += 0.005 + i * 0.0003;
      s.rotation.z += 0.002;
    });

    // Subtle particle drift
    const p = ptGeo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      p[i*3+1] += Math.sin(t + i) * 0.0002;
    }
    ptGeo.attributes.position.needsUpdate = true;

    // Camera mouse follow (smooth)
    camX += (tx - camX) * 0.04;
    camY += (ty - camY) * 0.04;
    camera.position.x = camX;
    camera.position.y = camY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  })();
}

// Fallback 2D constellation canvas
function initCanvasHero(canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];
  const N = 90, DIST = 130;
  const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
  const mk = () => ({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-.5)*.45, vy: (Math.random()-.5)*.45, r: Math.random()*1.4+.5 });
  resize(); dots = Array.from({length:N}, mk);
  window.addEventListener('resize', resize, {passive:true});
  (function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0,0,W,H);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x<0||d.x>W) d.vx*=-1; if (d.y<0||d.y>H) d.vy*=-1;
    });
    for (let i=0;i<dots.length;i++) for (let j=i+1;j<dots.length;j++) {
      const dx=dots[i].x-dots[j].x, dy=dots[i].y-dots[j].y, dist=Math.sqrt(dx*dx+dy*dy);
      if (dist<DIST) { ctx.strokeStyle=`rgba(91,155,245,${(1-dist/DIST)*.25})`; ctx.lineWidth=.6; ctx.beginPath(); ctx.moveTo(dots[i].x,dots[i].y); ctx.lineTo(dots[j].x,dots[j].y); ctx.stroke(); }
    }
    dots.forEach(d => { ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fillStyle='rgba(110,187,255,0.6)'; ctx.fill(); });
  })();
}

// Load Three.js then init hero
(function() {
  if (document.getElementById('hero-canvas')) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
    s.onload  = initHero;
    s.onerror = initHero; // fallback to 2D
    document.head.appendChild(s);
  }
})();

/* ===================== 3D CARD TILT ===================== */
function init3DTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    let bounds;
    const inner = card.querySelector('.tilt-inner') || card;

    card.addEventListener('mouseenter', () => { bounds = card.getBoundingClientRect(); });
    card.addEventListener('mousemove', e => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const cx = bounds.width  / 2;
      const cy = bounds.height / 2;
      const rX = ((y - cy) / cy) * -10;
      const rY = ((x - cx) / cx) *  10;
      inner.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(6px)`;
      inner.style.transition = 'transform 0.05s linear';
      // Spotlight glow that follows cursor
      inner.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(110,187,255,0.10) 0%, rgba(255,255,255,0.04) 55%)`;
      // Dynamic shadow
      card.style.boxShadow = `${rY/2}px ${-rX/2}px 36px rgba(91,155,245,0.22), 0 0 0 1px rgba(110,187,255,0.12)`;
    });
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      inner.style.transition = 'transform 0.6s cubic-bezier(.23,1,.32,1)';
      inner.style.background = '';
      card.style.boxShadow = '';
    });
  });
}
document.addEventListener('DOMContentLoaded', init3DTilt);

/* ===================== MAGNETIC BUTTONS ===================== */
function initMagnetic() {
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width/2);
      const dy = e.clientY - (rect.top  + rect.height/2);
      btn.style.transform = `translate(${dx*.25}px, ${dy*.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
document.addEventListener('DOMContentLoaded', initMagnetic);

/* ===================== COUNTER ANIMATION ===================== */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const dur = 1800;
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = prefix + (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.classList.contains('counted')) {
      e.target.classList.add('counted');
      animateCounter(e.target);
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

/* ===================== ACCORDION ===================== */
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ===================== PAGE FADE TRANSITIONS ===================== */
document.querySelectorAll('a[href]').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (!href || href[0]==='#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.target==='_blank') return;
  a.addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.add('fade-out');
    setTimeout(() => window.location.href = a.href, 300);
  });
});
window.addEventListener('pageshow', () => document.body.classList.remove('fade-out'));

/* ===================== HERO TEXT STAGGER ===================== */
function staggerHeroText() {
  document.querySelectorAll('.hero-h1 .word-wrap').forEach((wrap, i) => {
    wrap.style.animationDelay = `${0.08 * i + 0.3}s`;
  });
}
document.addEventListener('DOMContentLoaded', staggerHeroText);

/* ===================== PARALLAX SCROLL ===================== */
function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    els.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      el.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });
}
document.addEventListener('DOMContentLoaded', initParallax);

/* ===================== DRAGGABLE CHATBOT ===================== */
const chatBtn    = document.getElementById('chat-btn');
const chatPanel  = document.getElementById('chat-panel');
const chatClose  = document.getElementById('chat-close');
const chatMsgs   = document.getElementById('chat-messages');
const chatInput  = document.getElementById('chat-input');
const chatSend   = document.getElementById('chat-send');
if (!chatBtn) throw new Error('no chatbot'); // stops rest of script if chatbot missing on page

let chatOpen = false, dragging = false, hasMoved = false, dragOx = 0, dragOy = 0;
const MARGIN = 24;

function snapCorner() {
  const r = chatBtn.getBoundingClientRect();
  const cx = r.left + r.width/2, cy = r.top + r.height/2;
  const toRight  = cx > innerWidth/2, toBottom = cy > innerHeight/2;
  chatBtn.style.transition = 'left .35s cubic-bezier(.34,1.56,.64,1),top .35s cubic-bezier(.34,1.56,.64,1)';
  chatBtn.style.right  = 'auto'; chatBtn.style.bottom = 'auto';
  chatBtn.style.left   = toRight  ? (innerWidth  - chatBtn.offsetWidth  - MARGIN)+'px' : MARGIN+'px';
  chatBtn.style.top    = toBottom ? (innerHeight - chatBtn.offsetHeight - MARGIN)+'px' : MARGIN+'px';
  setTimeout(() => chatBtn.style.transition='', 380);
}

const startDrag = (cx, cy) => { dragging=true; hasMoved=false; const r=chatBtn.getBoundingClientRect(); dragOx=cx-r.left; dragOy=cy-r.top; chatBtn.style.transition='none'; };
const moveDrag  = (cx, cy) => { if(!dragging)return; hasMoved=true; chatBtn.style.right='auto';chatBtn.style.bottom='auto'; chatBtn.style.left=Math.max(0,Math.min(innerWidth-chatBtn.offsetWidth,cx-dragOx))+'px'; chatBtn.style.top=Math.max(0,Math.min(innerHeight-chatBtn.offsetHeight,cy-dragOy))+'px'; };
const endDrag   = () => { if(!dragging)return; dragging=false; snapCorner(); if(!hasMoved) toggleChat(); };

chatBtn.addEventListener('mousedown',  e => startDrag(e.clientX, e.clientY));
chatBtn.addEventListener('touchstart', e => { const t=e.touches[0]; startDrag(t.clientX, t.clientY); }, {passive:true});
document.addEventListener('mousemove',  e => moveDrag(e.clientX, e.clientY));
document.addEventListener('touchmove',  e => { const t=e.touches[0]; moveDrag(t.clientX, t.clientY); }, {passive:true});
document.addEventListener('mouseup',   endDrag);
document.addEventListener('touchend',  endDrag);

function toggleChat() {
  chatOpen = !chatOpen;
  chatPanel.classList.toggle('open', chatOpen);
  if (chatOpen) {
    // Position panel above button
    const r = chatBtn.getBoundingClientRect();
    chatPanel.style.right  = 'auto'; chatPanel.style.bottom = 'auto';
    const panelH = 480, panelW = 360;
    let L = r.left + r.width - panelW;
    let T = r.top  - panelH - 12;
    if (L < 8) L = 8;
    if (T < 8) T = r.bottom + 12;
    chatPanel.style.left = L + 'px';
    chatPanel.style.top  = T + 'px';
    setTimeout(() => chatInput && chatInput.focus(), 320);
  }
}

if (chatClose) chatClose.addEventListener('click', () => { chatOpen=false; chatPanel.classList.remove('open'); });

function addMsg(html, role) {
  const b = document.createElement('div');
  b.className = 'chat-bubble ' + role;
  b.innerHTML = html;
  chatMsgs.appendChild(b);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}
function showTyping() {
  const d = document.createElement('div');
  d.className='typing-dots'; d.id='typing';
  d.innerHTML='<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  chatMsgs.appendChild(d); chatMsgs.scrollTop=chatMsgs.scrollHeight;
}
function hideTyping() { const t=document.getElementById('typing'); if(t) t.remove(); }

function getReply(msg) {
  const m = msg.toLowerCase();
  if (/hello|hi |hey |morning|good day/.test(m))             return "Hi there! 👋 I'm the elyrac AI assistant. What can I help you with today?";
  if (/service|what.*(do|build|make|offer)/.test(m))         return "elyrac AI builds 6 types of custom AI systems:<br><br>⚙️ <b>Workflow Automation</b><br>🧠 <b>Custom LLM Apps</b><br>🔗 <b>Data Pipelines</b><br>👁️ <b>Computer Vision</b><br>💬 <b>Conversational Agents</b><br>🚀 <b>AI-Powered SaaS</b><br><br>Every system is built from scratch for your business specifically. Which interests you?";
  if (/price|cost|how much|budget|pricing/.test(m))          return "We don't publish fixed prices — every project is scoped to the specific requirements. <br><br>The first step is a <b>free 30-minute strategy call</b> where we scope the project. No commitment.";
  if (/book|call|meeting|schedule|calendly/.test(m))         return '📅 <a href="https://calendly.com/ceo-elyracai/30min" target="_blank" rel="noopener">Book your free strategy call here →</a><br><br>30 minutes. No obligation. Just real answers about what\'s possible for your business.';
  if (/off.the.shelf|generic|chatgpt|existing|tool/.test(m)) return "Off-the-shelf tools are built for everyone — optimized for no one. We build AI engineered <em>specifically for your business</em>: your data, your workflows, your goals. Like a tailored suit vs. one off the rack.";
  if (/no.*tech|non-tech|no team|small team/.test(m))        return "Absolutely — many of our clients have no technical staff. We own the entire build from architecture to deployment. You describe the problem, we solve it.";
  if (/industry|sector|who|type of business/.test(m))        return "We're industry-agnostic. We've built AI for legal, healthcare, retail, logistics, fintech, education, hospitality, and more.<br><br>If your business generates data and has repeatable processes — there's an AI opportunity.";
  if (/security|privacy|data|gdpr|safe/.test(m))             return "Security is a first-class concern in everything we build: encryption at rest + in transit, role-based access, audit logging, and data minimization. We never use your data to train third-party models.";
  if (/integrat|existing system|crm|erp/.test(m))            return "Integration is core to every project. We connect AI to your existing stack — CRMs, ERPs, databases, custom APIs. You don't need to replace what works.";
  if (/start|begin|first step|how do we|process/.test(m))    return '1. Book a free 30-min call<br>2. We scope the project<br>3. We build it (4–10 weeks)<br>4. You ship and scale<br><br>📅 <a href="https://calendly.com/ceo-elyracai/30min" target="_blank">Start here →</a>';
  if (/about|who are you|elyrac|company/.test(m))            return "elyrac AI builds fully customized AI software systems. Founded by Vine — every project is engineered from scratch around your specific business, not recycled from a template.";
  if (/contact|email|whatsapp|reach/.test(m))                return '📧 <a href="mailto:info@elyracai.com">info@elyracai.com</a><br>📅 <a href="https://calendly.com/ceo-elyracai/30min" target="_blank">Book a call</a><br><br>We reply within 24 hours.';
  return "I can help with:<br><br>• <b>Our services</b> — what we build<br>• <b>How we're different</b> from off-the-shelf AI<br>• <b>Working with us</b> (no tech team needed)<br>• <b>Data security</b><br>• <b>Getting started</b><br><br>Or just <a href='https://calendly.com/ceo-elyracai/30min' target='_blank'>book a free call</a> — fastest way to get real answers.";
}

async function sendMessage() {
  if (!chatInput) return;
  const val = chatInput.value.trim(); if (!val) return;
  chatInput.value = '';
  addMsg(val, 'user'); showTyping();
  await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
  hideTyping(); addMsg(getReply(val), 'bot');
}

if (chatSend)  chatSend.addEventListener('click', sendMessage);
if (chatInput) chatInput.addEventListener('keydown', e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

// Welcome message
setTimeout(() => {
  if (chatMsgs && !chatMsgs.children.length) {
    addMsg("Hi! 👋 I'm here to answer any questions about elyrac AI's custom AI development services. How can I help?", 'bot');
  }
}, 700);
