const fs = require('fs');

const files = ['index.html','about.html','solutions.html','blog.html','blog-post.html','ourwork.html','contact.html','faq.html'];

const newAttachRow = `      <div class="chat-attach-row">
        <button class="chat-attach-btn" onclick="startVoiceRecord()" id="voice-btn">🎤 Voice</button>
        <button class="chat-attach-btn" onclick="document.getElementById('chat-file-input').click()">📎 Attach</button>
        <input type="file" id="chat-file-input" style="display:none" accept="image/*,.pdf,.doc,.docx,.txt" onchange="handleFileAttach(event)">
        <span id="voice-status" style="font-size:11px;color:var(--gray-500);padding-left:4px;"></span>
      </div>`;

const newChatJS = `
/* ── Audio + File attachment ── */
var mediaRecorder = null;
var audioChunks = [];
var isRecording = false;

function startVoiceRecord() {
  var btn = document.getElementById('voice-btn');
  var status = document.getElementById('voice-status');
  if (!navigator.mediaDevices) {
    appendBotMsg('Sorry, your browser does not support voice recording.');
    return;
  }
  if (isRecording) {
    if (mediaRecorder) mediaRecorder.stop();
    isRecording = false;
    if (btn) { btn.textContent = '🎤 Voice'; btn.style.color = ''; }
    if (status) status.textContent = '';
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = function(e) { audioChunks.push(e.data); };
    mediaRecorder.onstop = function() {
      stream.getTracks().forEach(function(t) { t.stop(); });
      var msgs = document.getElementById('chat-messages');
      msgs.innerHTML += '<div class="chat-bubble user"><div class="bubble-text">🎤 Voice message sent</div></div>';
      msgs.scrollTop = msgs.scrollHeight;
      var MA = '<img class="bubble-avatar" src="/others/linked_profile_pic-Photoroom.png" alt="Maya">';
      setTimeout(function() {
        msgs.innerHTML += '<div class="chat-bubble">' + MA + '<div class="bubble-text">Thanks for your voice message! 🎤 Our team will follow up at <strong>info@elyracai.com</strong> — or book a call: <a href="https://calendly.com/ceo-elyracai/30min" target="_blank" style="color:#4A90E2;">calendly.com/ceo-elyracai/30min</a></div></div>';
        msgs.scrollTop = msgs.scrollHeight;
      }, 800);
    };
    mediaRecorder.start();
    isRecording = true;
    if (btn) { btn.textContent = '⏹ Stop'; btn.style.color = '#ff4444'; }
    if (status) status.textContent = '● Recording...';
  }).catch(function() {
    appendBotMsg('Microphone access denied. Please allow microphone access and try again.');
  });
}

function handleFileAttach(event) {
  var file = event.target.files[0];
  if (!file) return;
  var msgs = document.getElementById('chat-messages');
  var icon = file.type.includes('image') ? '🖼️' : file.type.includes('pdf') ? '📄' : '📎';
  msgs.innerHTML += '<div class="chat-bubble user"><div class="bubble-text">' + icon + ' ' + file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)</div></div>';
  msgs.scrollTop = msgs.scrollHeight;
  event.target.value = '';
  var MA = '<img class="bubble-avatar" src="/others/linked_profile_pic-Photoroom.png" alt="Maya">';
  setTimeout(function() {
    msgs.innerHTML += '<div class="chat-bubble">' + MA + '<div class="bubble-text">Thanks for the file! 📎 Please email it directly to <strong>info@elyracai.com</strong> with a brief note so our team can review it properly.</div></div>';
    msgs.scrollTop = msgs.scrollHeight;
  }, 800);
}

function appendBotMsg(text) {
  var msgs = document.getElementById('chat-messages');
  var MA = '<img class="bubble-avatar" src="/others/linked_profile_pic-Photoroom.png" alt="Maya">';
  msgs.innerHTML += '<div class="chat-bubble">' + MA + '<div class="bubble-text">' + text + '</div></div>';
  msgs.scrollTop = msgs.scrollHeight;
}
`;

files.forEach(function(file) {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // Add attach row before chat-input-row (only if not already added)
  if (html.includes('class="chat-input-row"') && !html.includes('chat-attach-row')) {
    html = html.replace('<div class="chat-input-row">', newAttachRow + '\n      <div class="chat-input-row">');
  }

  // Add audio/file JS before closing </script> of chatbot script block
  if (html.includes('dragging = false;') && !html.includes('startVoiceRecord')) {
    html = html.replace("document.addEventListener('mouseup', () => { dragging = false; });", "document.addEventListener('mouseup', () => { dragging = false; });\n" + newChatJS);
    // Also handle var-style (non-arrow)
  } else if (html.includes("document.addEventListener('mouseup', function() { dragging = false; });") && !html.includes('startVoiceRecord')) {
    html = html.replace("document.addEventListener('mouseup', function() { dragging = false; });", "document.addEventListener('mouseup', function() { dragging = false; });\n" + newChatJS);
  }

  fs.writeFileSync(file, html);
  console.log('Updated chatbot:', file);
});
