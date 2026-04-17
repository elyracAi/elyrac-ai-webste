const fs = require('fs');

const files = [
  'index.html', 'about.html', 'solutions.html', 'blog.html',
  'blog-post.html', 'ourwork.html', 'contact.html', 'faq.html'
];

const newCode = `    var MINI_AVATAR = '<img class="bubble-avatar" src="/others/linked_profile_pic-Photoroom.png" alt="Maya">';
    var knowledge = [
      { keys: ['price','cost','how much','pricing','rates'], reply: "Our pricing depends on the scope of your project. Most custom AI systems range from small automations to full enterprise platforms. The best next step is a free 30-minute strategy call where we scope your project honestly. Book here: calendly.com/ceo-elyracai/30min" },
      { keys: ['attendtrack','attendance','gps','payroll','workforce'], reply: "AttendTrack is our workforce management platform \u2014 AI-powered attendance, real-time GPS geofencing, automated payroll (NSSF/PAYE), and an AI Copilot. It's live and serving clients. Want to see a demo?" },
      { keys: ['iotec','email agent','email automation','inbox'], reply: "We built an intelligent email agent for ioTec Ltd that handles 80% of emails autonomously \u2014 categorizing, drafting responses, and escalating complex cases. Your team reclaims hours daily." },
      { keys: ['code clinic','clinic','dental','healthcare','hospital'], reply: "Code Clinic is our healthcare practice management platform \u2014 patient records, appointments, billing, payroll, live patient flow, and analytics. Built for dental and general practices." },
      { keys: ['trivox','receptionist','dental receptionist','voice agent'], reply: "Trivox AI is our conversational dental receptionist \u2014 it books appointments, answers patient queries, and follows up 24/7. Clients see +40% more bookings with zero missed outreaches." },
      { keys: ['winopay','fintech','payment','financial'], reply: "WinoPay is a full-stack fintech platform we architected from scratch \u2014 backend APIs, transaction processing, security layer, RBAC, and multi-service integrations." },
      { keys: ['fraud','ml','machine learning','detection'], reply: "We've built ML fraud detection systems for financial institutions \u2014 full pipeline from data ingestion to real-time inference, with audit trails for regulatory compliance." },
      { keys: ['timeline','how long','duration','weeks'], reply: "Most projects take 4\u201312 weeks depending on scope. We always scope everything upfront so there are no surprises. Want to discuss your project timeline?" },
      { keys: ['technology','stack','tools','built with'], reply: "We build with Python, FastAPI, Node.js, React, PostgreSQL, Claude AI, OpenAI, and cloud infrastructure on AWS and Vercel. We choose the right tool for each problem." },
      { keys: ['who are you','about','team','company'], reply: "elyrac AI is a custom AI engineering company based in Uganda, building real AI systems for real businesses. Our motto: Grace in Design. We've delivered 30+ AI projects across healthcare, fintech, HR, and more." },
      { keys: ['contact','reach','email','call','talk'], reply: "You can reach us at info@elyracai.com or book a direct call: calendly.com/ceo-elyracai/30min \u2014 our founder Vine Samuel will personally respond." },
      { keys: ['hi','hello','hey','good morning','good afternoon'], reply: "Hi there! \uD83D\uDC4B I'm Maya, elyrac AI's assistant. I can answer questions about our AI solutions, past projects, pricing, or help you book a strategy call. What can I help you with?" },
      { keys: ['bye','goodbye','thanks','thank you'], reply: "You're welcome! Feel free to reach out anytime at info@elyracai.com or book a call at calendly.com/ceo-elyracai/30min. We'd love to build something great together! \uD83D\uDE80" },
    ];
    window.sendChat = function() {
      var input = document.getElementById('chat-input');
      var msg = input.value.trim();
      if (!msg) return;
      var msgs = document.getElementById('chat-messages');
      msgs.innerHTML += '<div class="chat-bubble user"><div class="bubble-text">' + msg + '</div></div>';
      input.value = '';
      msgs.scrollTop = msgs.scrollHeight;
      if (!window._chatNotified) {
        window._chatNotified = true;
        fetch('https://formspree.io/f/xpwzgqna', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            _replyto: 'vinsamuel16@gmail.com',
            email: 'info@elyracai.com',
            subject: 'New Chat Started on elyracai.com',
            message: 'A visitor started a chat. First message: ' + msg + '\\nPage: ' + window.location.href
          })
        }).catch(function(){});
      }
      var lowerMsg = msg.toLowerCase();
      var reply = null;
      for (var i = 0; i < knowledge.length; i++) {
        for (var j = 0; j < knowledge[i].keys.length; j++) {
          if (lowerMsg.includes(knowledge[i].keys[j])) {
            reply = knowledge[i].reply;
            break;
          }
        }
        if (reply) break;
      }
      var escalationKeywords = ['build','develop','project','hire','work with','proposal','budget','enterprise','urgent','need help'];
      var shouldEscalate = escalationKeywords.some(function(k){ return lowerMsg.includes(k); });
      if (!reply) {
        reply = "That's a great question! For the most accurate answer, I'd recommend booking a free 30-minute call with our founder at calendly.com/ceo-elyracai/30min \u2014 or email us at info@elyracai.com. We respond within 24 hours.";
      }
      setTimeout(function() {
        msgs.innerHTML += '<div class="chat-bubble">' + MINI_AVATAR + '<div class="bubble-text">' + reply + '</div></div>';
        msgs.scrollTop = msgs.scrollHeight;
        if (shouldEscalate) {
          setTimeout(function() {
            msgs.innerHTML += '<div class="chat-bubble">' + MINI_AVATAR + '<div class="bubble-text">It sounds like you might have a project in mind! \uD83D\uDE80 Want me to connect you directly with our team? You can email <strong>info@elyracai.com</strong> or <a href="https://calendly.com/ceo-elyracai/30min" target="_blank" style="color:#4A90E2;font-weight:600;">book a free call here</a>.</div></div>';
            msgs.scrollTop = msgs.scrollHeight;
          }, 1200);
        }
      }, 820);
    };`;

files.forEach(file => {
  if (!fs.existsSync(file)) { console.log('MISSING:', file); return; }
  let content = fs.readFileSync(file, 'utf8');

  // Find start of block (replies array or // Chat replies comment)
  let startIdx = -1;
  const markers = [
    '    // Chat replies\n',
    '    var replies = [\n',
    '    const replies = [\n',
    "    var replies = ['"
  ];
  for (const m of markers) {
    const idx = content.indexOf(m);
    if (idx !== -1 && (startIdx === -1 || idx < startIdx)) startIdx = idx;
  }

  // Find anchor after sendChat: first occurrence of 'dragging = false' or '// Drag logic' after sendChat
  const sendChatIdx = content.indexOf('window.sendChat = function()');
  if (sendChatIdx === -1 || startIdx === -1) {
    console.log('Pattern not found in:', file, '(sendChat:', sendChatIdx, 'start:', startIdx, ')');
    return;
  }

  // Find end of sendChat block: look for '    };\n' just before drag logic
  const dragIdx = content.indexOf('dragging = false', sendChatIdx);
  const dragLogicIdx = content.indexOf('// Drag logic', sendChatIdx);
  const afterAnchor = Math.min(
    dragIdx !== -1 ? dragIdx : Infinity,
    dragLogicIdx !== -1 ? dragLogicIdx : Infinity
  );

  if (afterAnchor === Infinity) {
    console.log('No drag anchor found in:', file);
    return;
  }

  // endIdx = position of '    };\n' just before the drag anchor (include the }; itself)
  const endIdx = content.lastIndexOf('    };', afterAnchor) + '    };'.length;

  const updated = content.slice(0, startIdx) + newCode + content.slice(endIdx);
  fs.writeFileSync(file, updated);
  console.log('Updated:', file);
});
