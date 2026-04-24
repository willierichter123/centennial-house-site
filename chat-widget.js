(function () {
  'use strict';

  const QUICK_REPLIES = [
    'Help me pick a room',
    'What\'s there to do?',
    'Restaurant recommendations',
    'Tell me about the inn',
  ];

  const GREETING = "Hi! I'm here to help you plan your stay at Centennial House. What brings you to St. Augustine?";

  // ─── Styles ───────────────────────────────────────────────────────────────

  const css = `
    .ch-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #5c2b4a;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 18px rgba(92,43,74,0.38);
      z-index: 9998;
      transition: transform 180ms ease, background 180ms ease;
      padding: 0;
    }
    .ch-btn:hover { background: #7a3a63; transform: scale(1.06); }
    .ch-btn:focus-visible,
    .ch-send:focus-visible,
    .ch-quick-btn:focus-visible,
    .ch-header-close:focus-visible,
    .ch-textarea:focus-visible {
      outline: 2px solid #5c2b4a;
      outline-offset: 2px;
    }
    .ch-btn svg { display: block; }
    .ch-btn .ch-btn-close { display: none; }
    .ch-btn.is-open .ch-btn-chat { display: none; }
    .ch-btn.is-open .ch-btn-close { display: block; }

    .ch-panel {
      position: fixed;
      bottom: 84px;
      right: 20px;
      width: 375px;
      height: 570px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 20px 60px rgba(23,22,20,0.2);
      z-index: 9997;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(16px) scale(0.97);
      pointer-events: none;
      transition: opacity 200ms ease, transform 200ms ease;
    }
    .ch-panel.is-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    .ch-header {
      background: #1d1b19;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .ch-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #5c2b4a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Fraunces', Georgia, serif;
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      flex-shrink: 0;
    }
    .ch-header-text { flex: 1; min-width: 0; }
    .ch-header-name {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 0.95rem;
      font-weight: 500;
      color: #fff;
      margin: 0;
      line-height: 1.2;
    }
    .ch-header-sub {
      font-family: 'Manrope', sans-serif;
      font-size: 0.7rem;
      color: rgba(255,255,255,0.55);
      margin: 2px 0 0;
    }
    .ch-online-dot {
      width: 7px;
      height: 7px;
      background: #4caf82;
      border-radius: 50%;
      margin-right: 2px;
      display: inline-block;
      vertical-align: middle;
    }

    .ch-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px 14px 8px;
      background: #f7f5f1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    .ch-messages::-webkit-scrollbar { width: 4px; }
    .ch-messages::-webkit-scrollbar-track { background: transparent; }
    .ch-messages::-webkit-scrollbar-thumb { background: rgba(23,22,20,0.15); border-radius: 4px; }
    .ch-messages:focus-visible {
      outline: 2px solid #5c2b4a;
      outline-offset: -2px;
    }

    .ch-msg {
      display: flex;
      flex-direction: column;
      max-width: 86%;
      gap: 4px;
    }
    .ch-msg.bot { align-self: flex-start; }
    .ch-msg.user { align-self: flex-end; }

    .ch-bubble {
      padding: 9px 13px;
      font-family: 'Manrope', sans-serif;
      font-size: 0.83rem;
      line-height: 1.55;
      word-break: break-word;
    }
    .ch-msg.bot .ch-bubble {
      background: #fff;
      color: #171614;
      border: 1px solid rgba(23,22,20,0.1);
      border-radius: 4px 14px 14px 14px;
    }
    .ch-msg.user .ch-bubble {
      background: #5c2b4a;
      color: #fff;
      border-radius: 14px 4px 14px 14px;
    }
    .ch-bubble strong { font-weight: 700; }
    .ch-bubble a { color: inherit; text-decoration: underline; }

    .ch-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 2px;
    }
    .ch-quick-btn {
      padding: 5px 11px;
      border: 1.5px solid rgba(92,43,74,0.35);
      border-radius: 2rem;
      background: transparent;
      font-family: 'Manrope', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      color: #5c2b4a;
      cursor: pointer;
      transition: all 140ms ease;
    }
    .ch-quick-btn:hover { background: #5c2b4a; color: #fff; border-color: #5c2b4a; }

    .ch-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 13px;
      background: #fff;
      border: 1px solid rgba(23,22,20,0.1);
      border-radius: 4px 14px 14px 14px;
      width: fit-content;
    }
    .ch-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(23,22,20,0.35);
      animation: ch-bounce 1.1s ease-in-out infinite;
    }
    .ch-typing span:nth-child(2) { animation-delay: 0.18s; }
    .ch-typing span:nth-child(3) { animation-delay: 0.36s; }
    @keyframes ch-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    .ch-input-area {
      border-top: 1px solid rgba(23,22,20,0.1);
      padding: 10px 12px;
      display: flex;
      align-items: flex-end;
      gap: 8px;
      background: #fff;
      flex-shrink: 0;
    }
    .ch-textarea {
      flex: 1;
      border: 1.5px solid rgba(23,22,20,0.15);
      border-radius: 10px;
      padding: 8px 11px;
      font-family: 'Manrope', sans-serif;
      font-size: 0.83rem;
      line-height: 1.4;
      resize: none;
      outline: none;
      min-height: 38px;
      max-height: 90px;
      overflow-y: auto;
      color: #171614;
      background: #fff;
      transition: border-color 160ms ease;
    }
    .ch-textarea::placeholder { color: rgba(23,22,20,0.4); }
    .ch-textarea:focus,
    .ch-textarea:focus-visible { border-color: #5c2b4a; }
    .ch-send {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #5c2b4a;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 160ms ease, transform 160ms ease;
      padding: 0;
    }
    .ch-send:hover { background: #7a3a63; }
    .ch-send:active { transform: scale(0.94); }
    .ch-send:disabled { background: rgba(23,22,20,0.2); cursor: default; transform: none; }

    .ch-header-close {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      color: rgba(255,255,255,0.7);
      flex-shrink: 0;
      line-height: 1;
      transition: color 150ms ease;
    }
    .ch-header-close:hover { color: #fff; }

    @media (max-width: 480px) {
      .ch-panel {
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        height: 82dvh;
        height: 82vh;
        border-radius: 18px 18px 0 0;
        transform: translateY(20px);
      }
      .ch-panel.is-open { transform: translateY(0); }
      .ch-btn { bottom: 16px; right: 16px; }
      .ch-btn.is-open { display: none; }
      .ch-header-close { display: flex; align-items: center; justify-content: center; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── DOM ──────────────────────────────────────────────────────────────────

  const btn = document.createElement('button');
  btn.className = 'ch-btn';
  btn.setAttribute('aria-label', 'Open chat');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'ch-panel');
  btn.innerHTML = `
    <svg class="ch-btn-chat" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <svg class="ch-btn-close" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `;

  const panel = document.createElement('div');
  panel.className = 'ch-panel';
  panel.id = 'ch-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Chat with Centennial House');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <div class="ch-header">
      <div class="ch-avatar">CH</div>
      <div class="ch-header-text">
        <p class="ch-header-name">Centennial House</p>
        <p class="ch-header-sub"><span class="ch-online-dot"></span>Concierge</p>
      </div>
      <button class="ch-header-close" aria-label="Close chat">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="ch-messages" id="ch-messages" role="log" aria-live="polite" aria-relevant="additions text" aria-atomic="false"></div>
    <div class="ch-input-area">
      <textarea class="ch-textarea" placeholder="Ask about rooms, restaurants…" rows="1" aria-label="Your message"></textarea>
      <button class="ch-send" aria-label="Send message" disabled>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector('#ch-messages');
  const textarea = panel.querySelector('.ch-textarea');
  const sendBtn = panel.querySelector('.ch-send');

  // ─── State ────────────────────────────────────────────────────────────────

  let history = [];
  let isOpen = false;
  let isTyping = false;
  let greeted = false;
  let lastFocusedElement = null;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function renderMd(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/https?:\/\/\S+/g, url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`)
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  function addMessage(role, text, showQuickReplies) {
    const wrap = document.createElement('div');
    wrap.className = `ch-msg ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'ch-bubble';
    bubble.innerHTML = `<p>${renderMd(text)}</p>`;
    wrap.appendChild(bubble);

    if (showQuickReplies) {
      const qr = document.createElement('div');
      qr.className = 'ch-quick-replies';
      QUICK_REPLIES.forEach(label => {
        const b = document.createElement('button');
        b.className = 'ch-quick-btn';
        b.textContent = label;
        b.addEventListener('click', () => {
          qr.remove();
          send(label);
        });
        qr.appendChild(b);
      });
      wrap.appendChild(qr);
    }

    messagesEl.appendChild(wrap);
    scrollBottom();
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'ch-msg bot';
    el.id = 'ch-typing';
    el.innerHTML = '<div class="ch-typing"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(el);
    scrollBottom();
    return el;
  }

  function scrollBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function getFocusableElements() {
    return Array.from(
      panel.querySelectorAll(
        'button:not([disabled]), [href], textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hidden);
  }

  function closeChat() {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-label', 'Open chat');
    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    } else {
      btn.focus();
    }
  }

  // ─── Send ─────────────────────────────────────────────────────────────────

  async function send(text) {
    if (isTyping || !text.trim()) return;

    addMessage('user', text);
    history.push({ role: 'user', content: text });

    isTyping = true;
    sendBtn.disabled = true;
    const typingEl = showTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json();
      typingEl.remove();
      const reply = data.content || "I'm sorry, I didn't catch that. Could you try again?";
      history.push({ role: 'assistant', content: reply });
      addMessage('bot', reply);
    } catch {
      typingEl.remove();
      addMessage('bot', "I'm having trouble connecting right now. Please try again in a moment.");
    } finally {
      isTyping = false;
      sendBtn.disabled = textarea.value.trim().length === 0;
    }
  }

  // ─── Open / Close ─────────────────────────────────────────────────────────

  function toggleChat() {
    isOpen = !isOpen;
    panel.classList.toggle('is-open', isOpen);
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-label', isOpen ? 'Close chat' : 'Open chat');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    if (isOpen) {
      lastFocusedElement = document.activeElement;
      if (!greeted) {
        greeted = true;
        setTimeout(() => {
          addMessage('bot', GREETING, true);
        }, 320);
      }
      setTimeout(() => textarea.focus(), 250);
    } else if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  // ─── Input handling ───────────────────────────────────────────────────────

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 90) + 'px';
    sendBtn.disabled = textarea.value.trim().length === 0 || isTyping;
  });

  textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = textarea.value.trim();
      if (text && !isTyping) {
        textarea.value = '';
        textarea.style.height = 'auto';
        sendBtn.disabled = true;
        send(text);
      }
    }
  });

  sendBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (text && !isTyping) {
      textarea.value = '';
      textarea.style.height = 'auto';
      sendBtn.disabled = true;
      send(text);
    }
  });

  btn.addEventListener('click', toggleChat);
  panel.querySelector('.ch-header-close').addEventListener('click', toggleChat);

  // Close on outside click (desktop)
  document.addEventListener('pointerdown', e => {
    if (isOpen && !panel.contains(e.target) && !btn.contains(e.target)) {
      closeChat();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeChat();
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (!focusableElements.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
