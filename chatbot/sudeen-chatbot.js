/**
 * ==========================================================================
 * SUDEEN JAIN AI CHATBOT (ABHIMO-STYLE WIDGET)
 * Modeled on the high-performance Abhimo.com interactive floating architecture
 * With Dark/Light themes, Sound FX, Voice Typing, Suggestion Chips,
 * Mobile 100dvh adaptation, and comprehensive knowledge of Sudeen Jain.
 * ==========================================================================
 */

(function () {
    // Prevent duplicate injection
    if (document.getElementById('sj-chatbot-widget-container')) return;

    // --- Scoped CSS Styles (Matching & Elevating Abhimo.com Architecture) ---
    const css = `
.SJ-widget-container {
    --sj-primary-gradient: linear-gradient(135deg, #00f3ff 0%, #bd00ff 100%);
    --sj-accent-blue: #00f3ff;
    --sj-accent-purple: #bd00ff;
    --sj-accent-green: #00ff88;
    --sj-bg-dark: #090c15;
    --sj-secondary-bg: #121826;
    --sj-header-bg: #121826;
    --sj-text-primary: #f0f4fc;
    --sj-text-secondary: #94a3b8;
    --sj-border-soft: rgba(0, 243, 255, 0.18);
    --sj-shadow-soft: 0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 243, 255, 0.15);
    --sj-bot-msg-bg: #141c2e;
    --sj-user-msg-bg: linear-gradient(135deg, #0099ff, #7c3aed);
    --sj-input-bg: #0e1320;
    --sj-input-border: rgba(0, 243, 255, 0.25);
    --sj-overlay-bg: rgba(9, 12, 21, 0.96);
    --sj-online-border: #121826;
    --sj-hover-bg: #1e283d;
    --sj-footer-bg: #0b0f1a;
    --sj-suggestion-bg: #141c2e;
    --sj-suggestion-text: #e2e8f0;
    --sj-valid-color: #00ff88;
    --sj-invalid-color: #ff4757;
    --sj-warn-color: #ffa502;
}

.SJ-widget-container.light-theme {
    --sj-bg-dark: #f8fafc;
    --sj-secondary-bg: #ffffff;
    --sj-header-bg: #ffffff;
    --sj-text-primary: #0f172a;
    --sj-text-secondary: #475569;
    --sj-border-soft: rgba(15, 23, 42, 0.12);
    --sj-shadow-soft: 0 10px 25px rgba(0, 0, 0, 0.12);
    --sj-bot-msg-bg: #edf2f7;
    --sj-user-msg-bg: linear-gradient(135deg, #0284c7, #6366f1);
    --sj-input-bg: #ffffff;
    --sj-input-border: #cbd5e1;
    --sj-overlay-bg: rgba(248, 250, 252, 0.98);
    --sj-online-border: #ffffff;
    --sj-hover-bg: #f1f5f9;
    --sj-footer-bg: #f1f5f9;
    --sj-suggestion-bg: #e2e8f0;
    --sj-suggestion-text: #0f172a;
}

.SJ-widget-container,
.SJ-widget-container * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
    -webkit-tap-highlight-color: transparent;
    cursor: auto !important;
}

.SJ-widget-container button,
.SJ-widget-container a,
.SJ-widget-container .sj-chat-button,
.SJ-widget-container .sj-suggestion-chip,
.SJ-widget-container .sj-action-btn,
.SJ-widget-container .sj-header-btn,
.SJ-widget-container .sj-social-btn {
    cursor: pointer !important;
}

.SJ-widget-container input {
    cursor: text !important;
}

/* Floating Chat Launcher Button */
.SJ-widget-container .sj-chat-button {
    position: fixed;
    bottom: 25px;
    right: 25px;
    width: 62px;
    height: 62px;
    background: var(--sj-primary-gradient);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #05060b;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 8px 30px rgba(0, 243, 255, 0.45);
    z-index: 1000000;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 2px solid rgba(255, 255, 255, 0.4);
    overflow: visible;
}

.SJ-widget-container .sj-chat-button:hover {
    transform: scale(1.1) rotate(6deg);
    box-shadow: 0 12px 40px rgba(0, 243, 255, 0.7);
}

.SJ-widget-container .sj-pulse-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: 50%;
    z-index: -1;
    animation: sj-pulse 2.8s infinite;
}

@keyframes sj-pulse {
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.4); opacity: 0.3; }
    100% { transform: scale(1.85); opacity: 0; }
}

/* Chat Window */
.SJ-widget-container .sj-chat-window {
    position: fixed;
    bottom: 98px;
    right: 25px;
    width: 385px;
    height: 610px;
    background: var(--sj-bg-dark);
    border: 1px solid var(--sj-border-soft);
    border-radius: 20px;
    box-shadow: var(--sj-shadow-soft);
    display: flex;
    flex-direction: column;
    z-index: 1000001;
    overflow: hidden;
    transform-origin: bottom right;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}

.SJ-widget-container .sj-chat-window.hidden {
    opacity: 0;
    transform: scale(0.88) translateY(25px);
    pointer-events: none;
}

.SJ-widget-container .sj-chat-window.terminating {
    animation: sj-terminate 0.35s forwards;
    pointer-events: none;
}

@keyframes sj-terminate {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.6) translateY(80px); filter: blur(4px); }
}

/* Header */
.SJ-widget-container .sj-chat-header {
    padding: 14px 18px;
    background: var(--sj-header-bg);
    border-bottom: 1px solid var(--sj-border-soft);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.SJ-widget-container .sj-bot-info {
    display: flex;
    align-items: center;
    gap: 11px;
}

.SJ-widget-container .sj-bot-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 2px solid var(--sj-accent-blue);
    position: relative;
    background: linear-gradient(135deg, #00f3ff, #bd00ff);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-weight: 900;
    font-size: 15px;
    box-shadow: 0 0 12px rgba(0, 243, 255, 0.4);
}

.SJ-widget-container .sj-bot-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.SJ-widget-container .sj-online-indicator {
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 11px;
    height: 11px;
    background: var(--sj-accent-green);
    border: 2px solid var(--sj-online-border);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--sj-accent-green);
}

.SJ-widget-container .sj-bot-details h3 {
    font-size: 15px;
    font-weight: 700;
    color: var(--sj-text-primary);
    display: flex;
    align-items: center;
    gap: 5px;
}

.SJ-widget-container .sj-bot-details p {
    font-size: 11px;
    color: var(--sj-accent-blue);
    font-weight: 500;
}

.SJ-widget-container .sj-header-actions {
    display: flex;
    gap: 7px;
}

.SJ-widget-container .sj-header-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid var(--sj-border-soft);
    background: var(--sj-secondary-bg);
    color: var(--sj-text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    transition: all 0.2s;
}

.SJ-widget-container .sj-header-btn:hover {
    background: var(--sj-hover-bg);
    border-color: var(--sj-accent-blue);
    color: var(--sj-accent-blue);
}

.SJ-widget-container .sj-header-btn.active {
    color: var(--sj-accent-blue);
    border-color: var(--sj-accent-blue);
    background: rgba(0, 243, 255, 0.12);
}

/* Message Stream */
.SJ-widget-container .sj-chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: var(--sj-bg-dark);
    scrollbar-width: thin;
    scrollbar-color: var(--sj-border-soft) transparent;
}

.SJ-widget-container .sj-message {
    max-width: 86%;
    padding: 12px 15px;
    border-radius: 16px;
    font-size: 13.5px;
    line-height: 1.55;
    animation: sj-fadeIn 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
    word-wrap: break-word;
}

@keyframes sj-fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

.SJ-widget-container .sj-bot-message {
    align-self: flex-start;
    background: var(--sj-bot-msg-bg);
    color: var(--sj-text-primary);
    border-bottom-left-radius: 4px;
    border: 1px solid var(--sj-border-soft);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.SJ-widget-container .sj-user-message {
    align-self: flex-end;
    background: var(--sj-user-msg-bg);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 15px rgba(0, 243, 255, 0.25);
}

.SJ-widget-container .sj-timestamp {
    font-size: 10px;
    color: var(--sj-text-secondary);
    margin-top: 5px;
    display: block;
    text-align: right;
    opacity: 0.8;
}

/* Typing indicator */
.SJ-widget-container .sj-typing {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 0;
}

.SJ-widget-container .sj-typing span {
    width: 6px;
    height: 6px;
    background: var(--sj-accent-blue);
    border-radius: 50%;
    animation: sj-bounce 1.3s infinite ease-in-out both;
}

.SJ-widget-container .sj-typing span:nth-child(1) { animation-delay: -0.32s; }
.SJ-widget-container .sj-typing span:nth-child(2) { animation-delay: -0.16s; }

@keyframes sj-bounce {
    0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
}

/* Suggestion Container */
.SJ-widget-container .sj-suggestion-container {
    padding: 6px 14px 10px;
    display: flex;
    gap: 7px;
    background: var(--sj-bg-dark);
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.SJ-widget-container .sj-suggestion-container::-webkit-scrollbar {
    display: none;
}

.SJ-widget-container .sj-suggestion-chip {
    background: var(--sj-suggestion-bg);
    border: 1px solid var(--sj-border-soft);
    padding: 6px 12px;
    border-radius: 16px;
    color: var(--sj-suggestion-text);
    font-size: 11.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    flex-shrink: 0;
}

.SJ-widget-container .sj-suggestion-chip:hover {
    border-color: var(--sj-accent-blue);
    color: var(--sj-accent-blue);
    transform: translateY(-1px);
}

/* Input Area */
.SJ-widget-container .sj-chat-input-area {
    padding: 10px 14px 12px;
    background: var(--sj-secondary-bg);
    border-top: 1px solid var(--sj-border-soft);
}

.SJ-widget-container .sj-input-wrapper {
    display: flex;
    background: var(--sj-input-bg);
    border-radius: 25px;
    padding: 4px 12px;
    align-items: center;
    border: 1px solid var(--sj-input-border);
    transition: border-color 0.2s;
}

.SJ-widget-container .sj-input-wrapper:focus-within {
    border-color: var(--sj-accent-blue);
}

.SJ-widget-container .sj-input-wrapper input {
    flex: 1;
    background: none;
    border: none;
    color: var(--sj-text-primary);
    font-size: 13.5px;
    padding: 8px 4px;
}

.SJ-widget-container .sj-input-wrapper input:focus {
    outline: none;
}

.SJ-widget-container .sj-send-btn,
.SJ-widget-container .sj-mic-btn {
    background: none;
    border: none;
    color: var(--sj-accent-blue);
    cursor: pointer;
    padding: 7px;
    font-size: 16px;
    transition: all 0.2s;
}

.SJ-widget-container .sj-send-btn:hover,
.SJ-widget-container .sj-mic-btn:hover {
    transform: scale(1.12);
}

.SJ-widget-container .sj-mic-btn.active {
    color: #ff4757;
    animation: sj-mic-pulse 1s infinite alternate;
}

@keyframes sj-mic-pulse {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0.6; transform: scale(1.2); }
}

/* Action Buttons & Quick Replies */
.SJ-widget-container .sj-action-btn {
    width: 100%;
    padding: 10px 14px;
    background: var(--sj-primary-gradient);
    border: none;
    color: #05060b;
    cursor: pointer;
    font-size: 13px;
    border-radius: 10px;
    font-weight: 700;
    margin-top: 8px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    text-decoration: none;
}

.SJ-widget-container .sj-action-btn:hover {
    filter: brightness(1.15);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 243, 255, 0.4);
}

.SJ-widget-container .sj-quickreply-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 8px;
}

.SJ-widget-container .sj-quickreply-wrap .sj-action-btn {
    width: auto;
    margin-top: 0;
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 8px;
}

.SJ-widget-container .sj-social-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-top: 10px;
}

.SJ-widget-container .sj-social-btn {
    height: 38px;
    border-radius: 8px;
    border: 1px solid var(--sj-border-soft);
    background: var(--sj-secondary-bg);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.2s;
    text-decoration: none;
}

.SJ-widget-container .sj-social-btn:hover {
    border-color: var(--sj-accent-blue);
    transform: translateY(-2px);
    color: var(--sj-accent-blue);
}

/* Footer Tag */
.SJ-widget-container .sj-footer-badge {
    background: var(--sj-footer-bg);
    padding: 7px;
    text-align: center;
    font-size: 9.5px;
    color: var(--sj-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 700;
    border-top: 1px solid var(--sj-border-soft);
}

/* Mobile Responsiveness (Identical to Abhimo fullscreen behavior) */
@media (max-width: 600px) {
    .SJ-widget-container .sj-chat-window {
        bottom: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        height: 100dvh !important;
        max-height: 100dvh !important;
        border-radius: 0 !important;
    }
    .SJ-widget-container .sj-chat-window.hidden {
        transform: translateY(105%) !important;
    }
    .SJ-widget-container .sj-chat-button {
        width: 54px;
        height: 54px;
        bottom: 20px;
        right: 18px;
        font-size: 22px;
    }
    .SJ-widget-container .sj-chat-header {
        padding: 10px 14px;
    }
    .SJ-widget-container .sj-chat-messages {
        padding: 12px;
    }
    .SJ-widget-container .sj-chat-input-area {
        padding: 8px 12px 14px;
        padding-bottom: max(14px, env(safe-area-inset-bottom));
    }
}
    
.SJ-widget-container .sj-message a { color: var(--sj-accent-blue); text-decoration: underline; word-break: break-word; }
.SJ-widget-container .sj-user-message a { color: #fff; }
`;

    const styleEl = document.createElement("style");
    styleEl.innerText = css;
    (document.head || document.documentElement).appendChild(styleEl);


    // --- Template Injection (Abhimo Structure) ---
    const widget = document.createElement('div');
    widget.id = 'sj-chatbot-widget-container';
    widget.className = 'SJ-widget-container';
    widget.innerHTML = `
        <div id="sj-chat-button" class="sj-chat-button" title="Chat with Sudeen's AI" style="z-index:9999999 !important;">
            <div class="sj-pulse-ring"></div>
            <i class="fas fa-comments"></i>
        </div>

        <div id="sj-chat-window" class="sj-chat-window hidden" style="z-index:10000000 !important;">
            <!-- Header -->
            <div class="sj-chat-header">
                <div class="sj-bot-info">
                    <div class="sj-bot-avatar">
                        SJ
                        <span class="sj-online-indicator"></span>
                    </div>
                    <div class="sj-bot-details">
                        <h3>SJ Bot <span style="font-size:11px; color:#00ff88;">● Online</span></h3>
                        <p>Sudeen Jain's AI Assistant</p>
                    </div>
                </div>
                <div class="sj-header-actions">
                    <button id="sj-theme-toggle" class="sj-header-btn" title="Toggle Theme"><i class="fas fa-moon"></i></button>
                    <button id="sj-sound-toggle" class="sj-header-btn" title="Toggle Sound"><i class="fas fa-volume-up"></i></button>
                    <button id="sj-minimize-chat" class="sj-header-btn" title="Minimize Window"><i class="fas fa-times"></i></button>
                </div>
            </div>

            <!-- Messages Stream -->
            <div id="sj-chat-messages" class="sj-chat-messages"></div>

            <!-- Quick Suggestions Bar -->
            <div id="sj-suggestion-container" class="sj-suggestion-container"></div>

            <!-- Input Row -->
            <div class="sj-chat-input-area">
                <div class="sj-input-wrapper">
                    <input type="text" id="sj-user-input" placeholder="Type a message or tap below..." autocomplete="off">
                    <button id="sj-mic-btn" class="sj-mic-btn" title="Voice Typing"><i class="fas fa-microphone"></i></button>
                    <button id="sj-send-btn" class="sj-send-btn" title="Send"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>

            <!-- Footer Badge -->
            <div class="sj-footer-badge">Powered by Sudeen Jain · AI &amp; ML Engineer</div>
        </div>

        <!-- Synthesized Audio Elements -->
        <audio id="sj-received-sound" src="https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3" preload="auto"></audio>
        <audio id="sj-sent-sound" src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3" preload="auto"></audio>
    `;

    // Safe injection into DOM
    function attachWidget() {
        if (document.getElementById('sj-chatbot-widget-container')) return;
        if (document.body) {
            document.body.appendChild(widget);
            console.log('[SJ-Bot] Abhimo-style chatbot initialized successfully on page.');
        } else {
            setTimeout(attachWidget, 50);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachWidget);
    } else {
        attachWidget();
    }

    // --- Load FontAwesome if not present ---
    const loadAssets = () => {
        if (!document.getElementById('sj-fa-icons')) {
            const l = document.createElement('link');
            l.id = 'sj-fa-icons';
            l.rel = 'stylesheet';
            l.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
            (document.head || document.documentElement).appendChild(l);
        }
    };
    loadAssets();

    // =========================================================================
    //  CONFIG
    // =========================================================================
    const CONFIG = Object.assign({
        // After you deploy gemini-proxy/worker.js, paste its URL here, e.g.
        // 'https://sj-bot.YOURNAME.workers.dev'. Leave empty to run offline
        // (the bot then answers from the built-in knowledge only).
        geminiProxyUrl: 'https://sj-bot.abhimo-tech.workers.dev',
        requestTimeoutMs: 20000,
        maxHistory: 6,
        // Voice
        voiceOnByDefault: true,   // false = starts muted until the visitor taps the speaker
        voiceName: '',            // force a voice by name, e.g. 'Microsoft Prabhat Online (Natural) - English (India)'
        voiceRate: 0.95,          // 0.9 = slower, 1.05 = faster
        maxSpokenChars: 320       // long answers are shortened when spoken; full text stays on screen
    }, window.SJ_CHATBOT_CONFIG || {});

    // Resolve file locations from this script's own URL so the widget works
    // on /index.html, /laptop/, /mobile/ and /chatbot/ pages alike.
    const SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';
    const BASE_URL = SCRIPT_SRC ? new URL('./', SCRIPT_SRC).href : '';
    const SITE_ROOT = BASE_URL ? new URL('../', BASE_URL).href : '';

    // =========================================================================
    //  KNOWLEDGE BASE — generated from data/portfolio-data.js (knowledge-base.js)
    // =========================================================================
    let KB = window.SJ_KB || null;
    const kbReady = new Promise((resolve) => {
        if (KB) return resolve(KB);
        const s = document.createElement('script');
        s.src = BASE_URL + 'knowledge-base.js';
        s.onload = () => { KB = window.SJ_KB || null; resolve(KB); };
        s.onerror = () => resolve(null);
        (document.head || document.documentElement).appendChild(s);
    });

    // =========================================================================
    //  DOM ELEMENTS & STATE
    // =========================================================================
    const _storedSound = (() => { try { return localStorage.getItem('sj_sound_en'); } catch (e) { return null; } })();
    let isSoundEn = _storedSound === null ? CONFIG.voiceOnByDefault : _storedSound !== 'false';
    let isLight = localStorage.getItem('sj_theme') === 'light';
    let recognition = null;
    let isListening = false;

    const chatW = widget.querySelector('#sj-chat-window');
    const chatB = widget.querySelector('#sj-chat-button');
    const msgBox = widget.querySelector('#sj-chat-messages');
    const inputField = widget.querySelector('#sj-user-input');
    const sugBox = widget.querySelector('#sj-suggestion-container');
    const themeTog = widget.querySelector('#sj-theme-toggle');
    const soundTog = widget.querySelector('#sj-sound-toggle');
    const minBtn = widget.querySelector('#sj-minimize-chat');
    const micBtn = widget.querySelector('#sj-mic-btn');
    const sendBtn = widget.querySelector('#sj-send-btn');

    // Apply saved theme
    if (isLight) {
        widget.classList.add('light-theme');
        themeTog.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Window Toggle (Open / Close with Abhimo-style animation)
    const toggleWindow = (show) => {
        if (show) {
            chatW.classList.remove('hidden', 'terminating');
            inputField.focus();
            if (msgBox.children.length === 0) {
                renderWelcome();
            }
        } else {
            stopSpeaking();
            chatW.classList.add('terminating');
            setTimeout(() => {
                chatW.classList.add('hidden');
                chatW.classList.remove('terminating');
            }, 350);
        }
    };

    chatB.onclick = () => toggleWindow(chatW.classList.contains('hidden'));
    minBtn.onclick = () => toggleWindow(false);

    // Theme Toggle
    themeTog.onclick = () => {
        isLight = !isLight;
        widget.classList.toggle('light-theme', isLight);
        themeTog.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('sj_theme', isLight ? 'light' : 'dark');
    };

    // Sound / Voice Toggle (mute stops speech immediately)
    const applySoundState = () => {
        soundTog.innerHTML = isSoundEn ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        soundTog.classList.toggle('active', isSoundEn);
        soundTog.title = isSoundEn ? 'Mute voice & sounds' : 'Unmute voice & sounds';
        soundTog.setAttribute('aria-label', soundTog.title);
        soundTog.setAttribute('aria-pressed', String(!isSoundEn));
    };
    applySoundState();
    soundTog.onclick = (e) => {
        if (e) e.stopPropagation();
        isSoundEn = !isSoundEn;
        applySoundState();
        try { localStorage.setItem('sj_sound_en', String(isSoundEn)); } catch (err) { }
        if (isSoundEn) speakText('Voice is on.');
        else stopSpeaking();
    };

    // Web Audio Chime Synthesis (Fail-safe for sound)
    const playAudioSFX = (type) => {
        if (!isSoundEn) return;
        try {
            const el = document.getElementById(type === 'sent' ? 'sj-sent-sound' : 'sj-received-sound');
            if (el) {
                el.volume = 0.25;
                el.play().catch(() => {
                    // Fallback to Web Audio Oscillator
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.frequency.value = type === 'sent' ? 680 : 920;
                    gain.gain.value = 0.05;
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.08);
                });
            }
        } catch (e) { }
    };

    // =========================================================================
    //  VOICE — clean, professional speech (no URLs / emails / symbols read out)
    // =========================================================================
    const SPEECH_FIXES = [
        [/\bSJ\b/g, 'S J'], [/\bUI\/UX\b/gi, 'U I and U X'], [/\bAI\/ML\b/g, 'A I and M L'],
        [/\bFolioAI\b/g, 'Folio A I'], [/\bB\.?\s?Tech\b/gi, 'B Tech'], [/\bAICTE\b/g, 'A I C T E'],
        [/\bAI\b/g, 'A I'], [/\bML\b/g, 'M L'], [/\bNLP\b/g, 'N L P'], [/\bDAA\b/g, 'D A A'],
        [/\bSQL\b/g, 'S Q L'], [/\bAPIs?\b/g, 'A P I'], [/\bAWS\b/g, 'A W S'], [/\bIBM\b/g, 'I B M'],
        [/\bPHP\b/g, 'P H P'], [/\bHTML\b/g, 'H T M L'], [/\bCSS\b/g, 'C S S'], [/\bCNN\b/g, 'C N N'], [/\bRNN\b/g, 'R N N']
    ];
    const PHONE_RE = /\+\d{1,3}[\s-]?\d{5}[\s-]?\d{5}|\b\d{5}[\s-]?\d{5}\b/;
    const LINK_RE = new RegExp('https?:\\/\\/|\\bwww\\.|[\\w.+-]+@[\\w-]+\\.[\\w.-]+|' + PHONE_RE.source, 'i');

    const toSpeechSentences = (raw) => {
        let removedLinks = false;
        // 1) strip markup, keep link labels, then split into sentences
        let text = String(raw || '').replace(/<[^>]*>/g, ' ')
            .replace(/\[([^\]]+)\]\((?:https?:\/\/|mailto:|tel:)[^)]*\)/g, '$1')
            .replace(/\*\*|__|`|#+\s*/g, '')
            .replace(/^\s*[-*•]\s+/gm, '');
        // split into sentences (no regex lookbehind, so older Safari/iOS can still parse this file)
        const parts = [];
        text.split(/\n+/).forEach((line) => { (line.match(/.+?(?:[.!?]+(?=\s|$)|$)/g) || []).forEach((x) => parts.push(x.trim())); });
        // 2) a sentence that contains a URL / email / phone number is not read aloud (it is on screen)
        const cleaned = [];
        parts.forEach((p) => {
            if (LINK_RE.test(p)) { removedLinks = true; return; }
            let t = p
                .replace(/[\u{1F000}-\u{1FAFF}\u{2190}-\u{2BFF}\u{FE0F}\u{200D}]/gu, ' ');
            SPEECH_FIXES.forEach(([re, rep]) => { t = t.replace(re, rep); });
            t = t.replace(/\s*[–—]\s*/g, ', ').replace(/&/g, ' and ').replace(/\s*\/\s*/g, ' ')
                .replace(/\(\s*\)/g, ' ').replace(/\s+/g, ' ').trim();
            t = t.replace(/\s+([,.;:!?])/g, '$1').replace(/([,.;:!?])(\s*[,.;:])+/g, '$1').replace(/^[\s,.;:]+/, '').replace(/[,;:]+$/, '');
            if (t.replace(/[^A-Za-z0-9]/g, '').length < 2) return;
            if (!/[.!?]$/.test(t)) t += '.';
            cleaned.push(t);
        });
        // 3) keep it short and professional
        const out = [];
        let used = 0, truncated = false;
        for (const sentence of cleaned) {
            if (out.length && used + sentence.length > CONFIG.maxSpokenChars) { truncated = true; break; }
            out.push(sentence);
            used += sentence.length;
        }
        if (out.length && (truncated || removedLinks)) out.push('The full details are shown on screen.');
        return out;
    };

    // Prefer natural, male, English (India → UK → US) voices; user override supported.
    const MALE_NAMES = ['prabhat', 'ravi', 'rishi', 'guy', 'ryan', 'davis', 'christopher', 'eric', 'roger', 'brian', 'andrew', 'steffan',
        'thomas', 'alfie', 'daniel', 'alex', 'aaron', 'arthur', 'oliver', 'fred', 'david', 'mark', 'james', 'george', 'richard', 'male'];
    const FEMALE_NAMES = ['zira', 'hazel', 'susan', 'heera', 'neerja', 'samantha', 'karen', 'moira', 'tessa', 'veena', 'fiona', 'victoria',
        'kate', 'serena', 'female', 'aria', 'jenny', 'sonia', 'libby', 'emma', 'michelle', 'ana', 'allison', 'ava', 'joanna', 'catherine', 'google हिन्दी'];
    let cachedVoice = null;
    const refreshVoice = () => { cachedVoice = null; };
    if (window.speechSynthesis && window.speechSynthesis.addEventListener) {
        window.speechSynthesis.addEventListener('voiceschanged', refreshVoice);
    }
    const storeGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
    const storeSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };

    const pickVoice = () => {
        if (cachedVoice) return cachedVoice;
        if (!window.speechSynthesis) return null;
        const voices = window.speechSynthesis.getVoices() || [];
        if (!voices.length) return null;
        const wanted = (storeGet('sj_voice') || CONFIG.voiceName || '').toLowerCase();
        if (wanted) {
            const v = voices.find(x => x.name.toLowerCase() === wanted) || voices.find(x => x.name.toLowerCase().includes(wanted));
            if (v) return (cachedVoice = { voice: v, male: true });
        }
        const scoreOf = (v) => {
            const n = (v.name || '').toLowerCase();
            const l = (v.lang || '').toLowerCase().replace('_', '-');
            if (!l.startsWith('en')) return -100;
            let s = l === 'en-in' ? 12 : l === 'en-gb' ? 8 : l === 'en-us' ? 6 : 2;
            if (FEMALE_NAMES.some(f => n.includes(f))) s -= 60;
            if (MALE_NAMES.some(m => n.includes(m))) s += 40;
            if (/natural|online|neural/.test(n)) s += 15;
            return s;
        };
        const best = voices.map(v => ({ v, s: scoreOf(v) })).sort((a, b) => b.s - a.s)[0];
        if (!best || best.s < -50) return (cachedVoice = null);
        return (cachedVoice = { voice: best.v, male: best.s >= 30 });
    };

    let speakToken = 0;
    const stopSpeaking = () => {
        speakToken++;
        try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { }
    };

    // Voice Speech Output (Text-To-Speech)
    const speakText = (raw) => {
        if (!isSoundEn || !window.speechSynthesis) return;
        const sentences = toSpeechSentences(raw);
        if (!sentences.length) return;
        stopSpeaking();
        const mine = speakToken;
        const picked = pickVoice();
        let i = 0;
        const next = () => {
            if (mine !== speakToken || !isSoundEn || i >= sentences.length) return;
            try {
                const u = new SpeechSynthesisUtterance(sentences[i++]);
                if (picked) { u.voice = picked.voice; u.lang = picked.voice.lang; } else { u.lang = 'en-IN'; }
                u.rate = CONFIG.voiceRate;
                u.pitch = picked && picked.male ? 0.95 : 0.8;   // lower pitch if no male voice exists
                u.onend = next;
                u.onerror = () => { if (mine === speakToken) next(); };
                window.speechSynthesis.speak(u);
            } catch (e) { }
        };
        setTimeout(next, 80);
    };

    // Speech-To-Text Recognition
    const setupSpeech = () => {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
            recognition = new SpeechRec();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.onstart = () => {
                isListening = true;
                micBtn.classList.add('active');
                inputField.placeholder = "Listening... Speak now";
            };
            recognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                if (transcript) {
                    inputField.value = transcript;
                    handleSend();
                }
            };
            recognition.onend = () => {
                isListening = false;
                micBtn.classList.remove('active');
                inputField.placeholder = "Type a message or tap below...";
            };
            recognition.onerror = () => {
                isListening = false;
                micBtn.classList.remove('active');
            };
        } else {
            micBtn.style.opacity = '0.5';
            micBtn.title = 'Speech typing not supported in this browser';
        }
    };
    setupSpeech();

    micBtn.onclick = () => {
        if (!recognition) return;
        if (isListening) recognition.stop();
        else {
            try { recognition.start(); } catch (e) { }
        }
    };

    // Render Message Helper (escapes HTML first, then applies light markdown)
    const escapeHTML = (s) => String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const formatText = (text) => {
        const links = [];
        const stash = (html) => { links.push(html); return '\u0000' + (links.length - 1) + '\u0000'; };
        let t = escapeHTML(text);
        t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|tel:[^\s)]+)\)/g,
            (m, label, url) => stash(`<a href="${url}" target="_blank" rel="noopener">${label}</a>`));
        t = t.replace(/(https?:\/\/[^\s<]*[^\s<.,;:!?)\]])/g,
            (url) => stash(`<a href="${url}" target="_blank" rel="noopener">${url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a>`));
        t = t.replace(/\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g,
            (m, mail) => stash(`<a href="mailto:${mail}">${mail}</a>`));
        t = t.replace(/(\+91[ -]?\d{5}[ -]?\d{5})/g,
            (m) => stash(`<a href="tel:${m.replace(/[^+\d]/g, '')}">${m}</a>`));
        t = t.replace(/^\s*[-*] +/gm, '• ')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(\S(?:[^*\n]*?\S)?)\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        return t.replace(/\u0000(\d+)\u0000/g, (m, i) => links[+i]);
    };

    const addMessage = (text, sender, shimmer = false) => {
        const d = document.createElement('div');
        d.className = `sj-message sj-${sender}-message`;
        if (shimmer) {
            d.innerHTML = `<div class="sj-typing"><span></span><span></span><span></span></div>`;
        } else {
            d.innerHTML = `<span>${formatText(text)}</span>`;
            if (sender === 'bot') {
                const t = document.createElement('span');
                t.className = 'sj-timestamp';
                t.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                d.appendChild(t);
            }
        }
        msgBox.appendChild(d);
        msgBox.scrollTop = msgBox.scrollHeight;
        if (!shimmer) playAudioSFX(sender === 'bot' ? 'received' : 'sent');
        return d;
    };

    const createActBtn = (html, onClick, href = null) => {
        const el = document.createElement(href ? 'a' : 'button');
        el.className = 'sj-action-btn';
        el.innerHTML = html;
        if (href) {
            el.href = href;
            el.target = '_blank';
            el.rel = 'noopener';
        }
        if (onClick) el.onclick = onClick;
        return el;
    };

    // Render Suggestion Chips
    const renderSuggestions = () => {
        const list = [
            '👤 About Sudeen',
            '🚀 Projects & Demos',
            '⚡ Skills Matrix',
            '💼 Internships',
            '🏆 Certifications',
            '📄 Download Resume',
            '📬 Contact / Hire'
        ];
        sugBox.innerHTML = '';
        list.forEach(item => {
            const chip = document.createElement('div');
            chip.className = 'sj-suggestion-chip';
            chip.innerText = item;
            chip.onclick = () => {
                inputField.value = item.replace(/^[^\w]+/, '');
                handleSend();
            };
            sugBox.appendChild(chip);
        });
    };

    // Welcome Initial Message
    const renderWelcome = () => {
        addMessage(`Hi! I'm **SJ Bot**, Sudeen Jain's personal AI Assistant. 👋\n\nAsk me anything about Sudeen's **16 projects**, **technical skills**, **12+ certifications & badges**, **5 internships**, or how to contact him.\n\nHow can I help you today?`, 'bot');
        renderSuggestions();
        speakText("Hello, I'm S J Bot, Sudeen Jain's assistant. How can I help you today?");
    };

    // =========================================================================
    //  LOCAL ANSWER ENGINE — answers from knowledge-base.js only (no guessing).
    //  Used for quick-reply chips, greetings, and as the offline fallback when
    //  the Gemini proxy is not configured or fails.
    // =========================================================================
    const stem = (w) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) ? w.slice(0, -1) : w;
    const norm = (s) => String(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
    const seqTokens = (s) => norm(s).split(' ').filter(Boolean).map(stem);
    const STOP = new Set(('a an the is are was were be been am do does did can could would should will may might of to in on at for with about ' +
        'from by and or but if then so as it its his him he she her they them their this that these those what which who whom how why when where ' +
        'tell me us you your my i we please give show any some all also just there here has have had not no yes want need know like get let lets ' +
        'sudeen jain bot sj').split(' ').map(stem));
    const GENERIC = new Set(('project internship intern certification certificate badge skill resume web development system engine ai ml machine ' +
        'learning deep cloud data science analytics fundamentals getting started introduction intelligence artificial python java javascript ' +
        'recommender recommendation computing').split(' ').map(stem));
    const tokens = (s) => seqTokens(s).filter(t => t.length > 1 && !STOP.has(t));
    const containsSeq = (hay, needle) => {
        if (!needle.length) return false;
        for (let i = 0; i + needle.length <= hay.length; i++) {
            let ok = true;
            for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) { ok = false; break; }
            if (ok) return true;
        }
        return false;
    };
    const SYNONYMS = [
        [/\bnode\.?js\b/g, 'node js'], [/\bml\b/g, 'machine learning'], [/\bdl\b/g, 'deep learning'],
        [/\bjs\b/g, 'javascript'], [/\bcpp\b/g, 'c++'], [/\bpy\b/g, 'python'], [/\bsklearn\b/g, 'scikit learn'],
        [/\bpostgres\b/g, 'postgresql'], [/\breactjs\b/g, 'react'], [/\bmongo\b/g, 'mongodb']
    ];
    const TECH_SKIP = new Set(['web', 'app', 'tool', 'responsive', 'automation', 'status']);

    let INDEX = null;
    const getIndex = () => {
        if (INDEX || !KB) return INDEX;
        const items = [];
        const add = (type, ref, name, tech, text) => {
            const nameTok = new Set(tokens(name));
            items.push({
                type, ref, nameTok,
                normTitle: norm(ref.title),
                titleSpecific: new Set(tokens(ref.title).filter(t => !GENERIC.has(t))),
                specific: new Set([...nameTok].filter(t => !GENERIC.has(t))),
                techTok: new Set(tokens((tech || []).join(' '))),
                hay: seqTokens([ref.title].concat(tech || [], [text || '']).join(' | '))
            });
        };
        KB.projects.forEach(p => add('project', p, p.title, p.tech, p.desc));
        KB.moreProjects.forEach(p => add('project', p, p.title, p.tech, p.desc));
        KB.internships.forEach(i => add('internship', i, i.title + ' ' + i.org, i.highlights, i.org + ' | ' + i.desc));
        KB.badges.forEach(b => add('badge', b, b.title + ' ' + b.issuer, b.skills, b.issuer + ' | ' + b.desc));
        KB.certificates.gallery.forEach(g => g.items.forEach(c =>
            add('certificate', Object.assign({ category: g.category }, c), c.title + ' ' + c.issuer, [], c.issuer)));
        KB.certificates.fromResume.forEach(c =>
            add('certificate', { title: c.title, issuer: c.issuer, link: c.link, category: 'Resume' }, c.title + ' ' + c.issuer, [], c.issuer));

        // document frequency of distinctive name tokens
        const df = {};
        items.forEach(it => it.specific.forEach(t => { df[t] = (df[t] || 0) + 1; }));

        // known technology / skill phrases
        const termMap = new Map();
        const addTerm = (raw) => {
            String(raw).split(/[&/,]| and /i).forEach(part => {
                const display = part.replace(/\(.*?\)/g, '').trim();
                const seq = seqTokens(display);
                if (!seq.length || (seq.length === 1 && (seq[0].length < 2 || TECH_SKIP.has(seq[0])))) return;
                const key = seq.join(' ');
                if (!termMap.has(key)) termMap.set(key, { display, seq });
            });
        };
        KB.skills.portfolio.forEach(addTerm);
        KB.skills.groups.forEach(g => g.items.forEach(addTerm));
        items.forEach(it => { if (it.type !== 'certificate') (it.ref.tech || it.ref.highlights || it.ref.skills || []).forEach(addTerm); });
        const terms = [...termMap.values()].sort((a, b) => b.seq.length - a.seq.length);

        INDEX = { items, df, terms };
        return INDEX;
    };

    const prep = (raw) => {
        let q = String(raw).toLowerCase();
        SYNONYMS.forEach(([re, rep]) => { q = q.replace(re, rep); });
        const qn = q.replace(/[?!]/g, ' ').replace(/\s+/g, ' ').trim();
        const normQ = norm(qn);
        return { raw: String(raw), qn, normQ, seq: seqTokens(qn), qTok: new Set(tokens(qn)) };
    };

    const findTech = (Q) => {
        const idx = getIndex();
        const used = new Array(Q.seq.length).fill(false);
        const hits = [];
        idx.terms.forEach(term => {
            for (let i = 0; i + term.seq.length <= Q.seq.length; i++) {
                let ok = true;
                for (let j = 0; j < term.seq.length; j++) if (Q.seq[i + j] !== term.seq[j] || used[i + j]) { ok = false; break; }
                if (ok) { for (let j = 0; j < term.seq.length; j++) used[i + j] = true; hits.push(term); break; }
            }
        });
        return hits;
    };

    const itemHasTerm = (it, term) => containsSeq(it.hay, term.seq);

    const matchEntities = (Q, typeFilter) => {
        const idx = getIndex();
        const scored = [];
        idx.items.forEach(it => {
            if (typeFilter && !typeFilter.includes(it.type)) return;
            const strong = it.titleSpecific.size > 0 && it.normTitle.length > 3 && (' ' + Q.normQ + ' ').includes(' ' + it.normTitle + ' ');
            let hits = 0, distinctive = false;
            it.specific.forEach(t => { if (Q.qTok.has(t)) { hits++; if ((idx.df[t] || 0) <= 2) distinctive = true; } });
            const ratio = it.specific.size ? hits / it.specific.size : 0;
            if (strong) scored.push({ it, score: 10 + hits, strong: true });
            else if (hits > 0 && (ratio >= 0.5 || distinctive)) scored.push({ it, score: hits * 3 + ratio, strong: false });
        });
        scored.sort((a, b) => b.score - a.score);
        return scored;
    };

    const short = (s, n = 90) => s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s;
    const list = (arr) => arr.join(', ');
    const askBtn = (label, ask) => ({ label, ask });
    const linkBtn = (label, href) => ({ label, href });
    const MAIN_ASKS = () => [askBtn('🚀 Projects', 'Projects'), askBtn('⚡ Skills', 'Skills'), askBtn('💼 Internships', 'Internships'), askBtn('📬 Contact', 'Contact')];

    // ---- Answer builders --------------------------------------------------
    const A = {
        greeting: () => ({
            kind: 'greeting', preferLocal: true, voice: "Hello, I'm S J Bot, Sudeen Jain's assistant. How can I help you today?",
            text: `Hello! Great to connect with you. Ask me anything about Sudeen's projects, skills, internships, certifications or contact details, or tap a topic below:`, buttons: MAIN_ASKS()
        }),
        thanks: () => ({ kind: 'thanks', preferLocal: true, text: `You're welcome! Anything else you'd like to know about Sudeen?`, buttons: MAIN_ASKS() }),
        about: () => {
            const p = KB.profile;
            return {
                kind: 'about', voice: `${p.name} is an ${p.role}, with a ${p.degree} from ${p.university}. The details are shown on screen.`,
                text: `**${p.name}**\n👨‍💻 ${p.role}\n🎓 ${p.degree} — ${p.university} (${p.educationYears})\n📍 ${p.location}\n\n${p.summary}`,
                buttons: [linkBtn('📄 Resume', SITE_ROOT + KB.profile.resumeFile), askBtn('🚀 Projects', 'Projects'), askBtn('📬 Contact', 'Contact')]
            };
        },
        projects: (filterTerms) => {
            const all = KB.projects;
            let pool = all, intro;
            if (filterTerms && filterTerms.length) {
                const idx = getIndex();
                pool = idx.items.filter(it => it.type === 'project' && filterTerms.some(t => itemHasTerm(it, t))).map(it => it.ref);
                const label = filterTerms.map(t => t.display).join(' / ');
                if (!pool.length) return { kind: 'projects', text: `I don't see a project with **${label}** listed on Sudeen's portfolio. He has ${all.length} projects in total.`, buttons: [askBtn('🚀 All projects', 'Projects')] };
                intro = `**Projects using ${label}** (${pool.length}):`;
            } else {
                intro = `**Sudeen has ${all.length} projects on his portfolio.**`;
            }
            const demos = pool.filter(p => p.demo), code = pool.filter(p => !p.demo);
            let text = intro + '\n';
            if (demos.length) text += `\n🚀 **With live demo (${demos.length}):** ${list(demos.map(p => p.title))}`;
            if (code.length) text += `\n📦 **Source code only (${code.length}):** ${list(code.map(p => p.title))}`;
            text += `\n\nAsk about any project by name for details, tech stack and links.`;
            const buttons = demos.slice(0, 4).map(p => linkBtn('▶ ' + p.title, p.demo));
            buttons.push(linkBtn('<i class="fab fa-github"></i> All on GitHub', KB.profile.github));
            return { kind: 'projects', voice: `Sudeen has ${pool.length} project${pool.length === 1 ? '' : 's'} here, ${demos.length} of them with a live demo. You can ask about any project by name.`, text, buttons };
        },
        project: (p) => {
            let text = `🚀 **${p.title}**\n${p.desc}`;
            if (p.tech && p.tech.length) text += `\n\n🛠️ **Tech:** ${list(p.tech)}`;
            if (!p.onPortfolio) text += `\n\n📌 Not shown on the portfolio page; listed in Sudeen's GitHub/resume.`;
            if (!p.demo && p.github) text += `\n\nOnly the source code is available (no live demo listed).`;
            const buttons = [];
            if (p.demo) buttons.push(linkBtn('▶ Live Demo', p.demo));
            if (p.github) buttons.push(linkBtn('<i class="fab fa-github"></i> GitHub', p.github));
            buttons.push(askBtn('More projects', 'Projects'));
            return { kind: 'project', voice: `${p.title}. ${(p.desc.match(/^.*?[.!?](\s|$)/) || [p.desc])[0].trim()}${p.demo ? ' A live demo is available.' : ''}`, text, buttons };
        },
        internships: (filterTerms) => {
            let pool = KB.internships;
            let intro = `**Sudeen's internships (${pool.length}):**`;
            if (filterTerms && filterTerms.length) {
                const idx = getIndex();
                pool = idx.items.filter(it => it.type === 'internship' && filterTerms.some(t => itemHasTerm(it, t))).map(it => it.ref);
                intro = `**Internships involving ${filterTerms.map(t => t.display).join(' / ')} (${pool.length}):**`;
                if (!pool.length) return { kind: 'internships', text: `None of Sudeen's internships list that. He has ${KB.internships.length} in total.`, buttons: [askBtn('💼 All internships', 'Internships')] };
            }
            const text = intro + '\n\n' + pool.map(i => `💼 **${i.title}**\n🏢 ${i.org} · ${i.duration}`).join('\n\n') + `\n\nAsk about any of them for details.`;
            return { kind: 'internships', voice: `Sudeen has completed ${pool.length} internship${pool.length === 1 ? '' : 's'}. The details are shown on screen.`, text, buttons: [] };
        },
        internship: (i) => ({
            kind: 'internship', voice: `${i.title} at ${i.org}, ${i.duration}.`,
            text: `💼 **${i.title}**\n🏢 ${i.org} · ${i.duration} · ${i.status}\n\n${i.desc}\n\n🛠️ **Focus:** ${list(i.highlights)}`, buttons: [askBtn('All internships', 'Internships')]
        }),
        certifications: (filterTerms) => {
            const idx = getIndex();
            if (filterTerms && filterTerms.length) {
                const pool = idx.items.filter(it => (it.type === 'badge' || it.type === 'certificate') && filterTerms.some(t => itemHasTerm(it, t)));
                const label = filterTerms.map(t => t.display).join(' / ');
                if (!pool.length) return { kind: 'certs', text: `I don't see a certificate or badge about **${label}**.`, buttons: [askBtn('🏆 All certifications', 'Certifications')] };
                return {
                    kind: 'certs', voice: 'Here are the matching certifications.',
                    text: `**Certifications & badges for ${label} (${pool.length}):**\n\n` + pool.map(it => `🏆 **${it.ref.title}** — ${it.ref.issuer}`).join('\n'), buttons: []
                };
            }
            const g = KB.certificates.gallery;
            let text = `**Certifications & badges**\n\n🏆 **Verified Credly badges (${KB.badges.length}):** ${list(KB.badges.map(b => b.title))}`;
            text += `\n\n📜 **Certificate gallery (${KB.counts.galleryCertificates}):** ` + g.map(x => `${x.category} (${x.items.length})`).join(', ');
            text += `\n\n➕ **Also on his resume:** ${list(KB.certificates.fromResume.map(c => c.title))}`;
            text += `\n\nAsk about any certificate or badge by name.`;
            return {
                kind: 'certs', voice: `Sudeen holds ${KB.badges.length} verified badges and ${KB.counts.galleryCertificates} gallery certificates, across A I, cloud and web development.`, text,
                buttons: [linkBtn('<i class="fas fa-certificate"></i> Credly Badges', KB.profile.credly), linkBtn('<i class="fab fa-linkedin"></i> All on LinkedIn', KB.certificates.linkedinAll)]
            };
        },
        badge: (b) => ({
            kind: 'badge', voice: `${b.title}, issued by ${b.issuer}.`,
            text: `🏆 **${b.title}**\n🏢 ${b.issuer} · Earned ${b.date} · ${b.expiry}\n\n${b.desc}\n\n🛠️ **Skills:** ${list(b.skills)}`, buttons: [linkBtn('✔ Verify badge', b.link)]
        }),
        certificate: (c) => ({
            kind: 'certificate', voice: `${c.title}${c.issuer ? ', from ' + c.issuer : ''}.`,
            text: `📜 **${c.title}**${c.issuer ? '\n🏢 ' + c.issuer : ''}${c.category && c.category !== 'Resume' ? '\n📂 ' + c.category + ' (portfolio certificate gallery)' : ''}`,
            buttons: c.link ? [linkBtn('✔ Verify', c.link)] : [askBtn('All certifications', 'Certifications')]
        }),
        skills: () => {
            let text = `**Sudeen's technical skills**\n\n⭐ **On the portfolio:** ${list(KB.skills.portfolio)}`;
            KB.skills.groups.forEach(g => { text += `\n\n**${g.name}:** ${list(g.items)}`; });
            return { kind: 'skills', voice: "Sudeen's skills span Python, machine learning, cloud, and full stack web development. The full list is shown on screen.", text, buttons: [askBtn('🚀 Projects', 'Projects')] };
        },
        tech: (hits) => {
            const idx = getIndex();
            const label = hits.map(h => h.display).join(', ');
            const inSkills = [];
            KB.skills.portfolio.concat(...KB.skills.groups.map(g => g.items)).forEach(s => {
                if (hits.some(h => containsSeq(seqTokens(s), h.seq)) && !inSkills.includes(s)) inSkills.push(s);
            });
            const of = (type) => idx.items.filter(it => it.type === type && hits.some(h => itemHasTerm(it, h)));
            const projects = of('project'), interns = of('internship');
            const certs = idx.items.filter(it => (it.type === 'badge' || it.type === 'certificate') && hits.some(h => itemHasTerm(it, h)));
            let text = `**${label}** — here's what Sudeen's portfolio shows:`;
            if (inSkills.length) text += `\n\n⚡ **Skills:** ${list(inSkills)}`;
            if (projects.length) text += `\n\n🚀 **Projects (${projects.length}):** ${list(projects.map(it => it.ref.title))}`;
            if (interns.length) text += `\n\n💼 **Internships:** ${list(interns.map(it => it.ref.title + ' (' + it.ref.org + ')'))}`;
            if (certs.length) text += `\n\n🏆 **Certifications & badges:** ${list(certs.slice(0, 6).map(it => it.ref.title))}${certs.length > 6 ? '…' : ''}`;
            const buttons = projects.slice(0, 4).map(it => askBtn('▶ ' + it.ref.title, it.ref.title));
            return { kind: 'tech', voice: `Here is where ${label} appears in Sudeen's portfolio.`, text, buttons };
        },
        resume: () => ({
            kind: 'resume', voice: "Sudeen's resume is ready to download below.",
            text: `**Sudeen Jain's Resume**\n\nTap below to open or download the PDF with his projects, education, internships and certifications.`,
            buttons: [linkBtn('<i class="fas fa-file-pdf"></i> Download Resume (PDF)', SITE_ROOT + KB.profile.resumeFile), linkBtn('<i class="fas fa-envelope"></i> Email', 'mailto:' + KB.profile.email)]
        }),
        contact: () => {
            const p = KB.profile;
            return {
                kind: 'contact', voice: 'You can reach Sudeen by email, phone, or social media. The contact details are shown on screen.', social: true,
                text: `**Contact Sudeen**\n\n📧 Email: ${p.email}\n📱 Phone / WhatsApp: ${p.phone}\n📍 ${p.location}\n\nOr reach him on social channels:`, buttons: []
            };
        },
        matches: (arr) => ({
            kind: 'matches', voice: 'I found a few matches. Please choose one.',
            text: `I found a few matches — which one do you mean?`,
            buttons: arr.slice(0, 6).map(it => askBtn(it.ref.title + (it.type === 'certificate' && it.ref.issuer ? ' – ' + it.ref.issuer : ''), it.ref.title + (it.ref.issuer ? ' ' + it.ref.issuer : '')))
        }),
        help: () => ({
            kind: 'help', voice: "I couldn't find that in Sudeen's portfolio. You can ask about his projects, skills, internships, or certifications.",
            text: `I couldn't find that in Sudeen's portfolio. You can ask about his projects, skills, internships, certifications, education or contact details — or email him at ${KB.profile.email}.`,
            buttons: [askBtn('👤 About Sudeen', 'About Sudeen')].concat(MAIN_ASKS(), [askBtn('📄 Resume', 'Resume')])
        })
    };

    const searchRelated = (Q) => {
        const idx = getIndex();
        const out = [];
        idx.items.forEach(it => {
            let score = 0;
            Q.qTok.forEach(t => {
                if (it.nameTok.has(t)) score += 3;
                else if (it.techTok.has(t)) score += 1.5;
                else if (it.hay.includes(t)) score += 0.5;
            });
            if (score >= 1.5) out.push({ it, score });
        });
        out.sort((a, b) => b.score - a.score);
        return out.slice(0, 6).map(o => o.it);
    };
    A.related = (arr) => ({
        kind: 'related', voice: 'Here are a few related items. Please choose one.',
        text: `Here is what I found related to your question — tap one for details:`,
        buttons: arr.map(it => askBtn(it.ref.title + (it.type === 'certificate' && it.ref.issuer ? ' – ' + it.ref.issuer : ''), it.ref.title + (it.ref.issuer ? ' ' + it.ref.issuer : '')))
    });

    const fromEntity = (it) => {
        if (it.type === 'project') return A.project(it.ref);
        if (it.type === 'internship') return A.internship(it.ref);
        if (it.type === 'badge') return A.badge(it.ref);
        return A.certificate(it.ref);
    };

    const answerLocal = (raw) => {
        if (!KB) return null;
        const Q = prep(raw);
        const qn = Q.qn;
        if (/^(hi+|hello+|hey+|hii+|namaste|yo|good (morning|afternoon|evening))( there| bot| sj bot)?[!. ]*$/.test(qn)) return A.greeting();
        if (/^(thanks|thank you|thx|ok|okay|great|nice|cool|awesome|bye|goodbye)\b/.test(qn)) return A.thanks();

        // 1) Full title mentioned → exact detail
        const strong = matchEntities(Q).filter(m => m.strong);
        if (strong.length === 1) return fromEntity(strong[0].it);
        if (strong.length > 1) return A.matches(strong.map(m => m.it));

        // 2) What kind of thing is the visitor asking about?
        const skillCheck = /\b(know|knows|familiar|skilled|proficien\w*|expert\w*|good at|experience (with|in)|works? with|worked with|uses?|using)\b/.test(qn);
        let hint = null;
        if (/\b(resume|cv|curriculum)\b/.test(qn)) hint = 'resume';
        else if (/\b(contact|hire|hiring|email|e-?mail|phone|mobile|whatsapp|call|reach|linkedin|instagram|social|connect|available|availability|freelance|collaborat\w*)\b/.test(qn)) hint = 'contact';
        else if (!skillCheck && /\b(interns?|internships?|worked|company|companies|employ\w*|work experience)\b/.test(qn)) hint = 'internship';
        else if (/\b(certs?|certificat\w*|badges?|credentials?|credly|courses?)\b/.test(qn)) hint = 'cert';
        else if (/\b(projects?|built|build|apps?|applications?|demos?|live|github|repo|repos|source code|portfolio)\b/.test(qn)) hint = 'project';
        else if (/\b(skills?|stack|technolog\w*|languages?|tools?|expertise|strengths?)\b/.test(qn)) hint = 'skill';

        if (hint === 'resume') return A.resume();
        if (hint === 'contact') return A.contact();

        // 3) Technology / skill terms (python, opencv, aws, ...)
        const hits = findTech(Q);
        if (hits.length) {
            if (hint === 'project') return A.projects(hits);
            if (hint === 'internship') return A.internships(hits);
            if (hint === 'cert') return A.certifications(hits);
            return A.tech(hits);
        }

        // 4) Distinctive words from one item's name (e.g. "movie", "gesture", "attendance")
        const types = hint === 'project' ? ['project'] : hint === 'internship' ? ['internship'] : hint === 'cert' ? ['badge', 'certificate'] : null;
        const ents = matchEntities(Q, types);
        if (ents.length) {
            const top = ents[0].score;
            const tied = ents.filter(m => m.score >= top - 0.5);
            if (tied.length === 1) return fromEntity(tied[0].it);
            return A.matches(tied.map(m => m.it));
        }

        // 5) General topics
        if (hint === 'project') return A.projects();
        if (hint === 'internship') return A.internships();
        if (hint === 'cert') return A.certifications();
        if (hint === 'skill') return A.skills();
        if (/\b(about|who|bio|background|introduc\w*|education|college|universit\w*|degree|study|studying|qualification|location|live|based|city|age|name)\b/.test(qn)) return A.about();
        const related = searchRelated(Q);
        if (related.length) return A.related(related);
        return A.help();
    };

    const CHIP_KEYS = new Set(['about sudeen', 'projects demos', 'skills matrix', 'internships', 'certifications', 'download resume', 'contact hire',
        'projects', 'skills', 'contact', 'resume', 'more projects', 'all internships', 'all certifications', 'all projects']
        .map(s => s));
    const chipKey = (s) => String(s).toLowerCase().replace(/[^a-z]+/g, ' ').trim();

    // ---- Rendering ---------------------------------------------------------
    const renderResult = (res) => {
        if (res.voice) speakText(res.voice);
        addMessage(res.text, 'bot');
        if (res.buttons && res.buttons.length) {
            const wrap = document.createElement('div');
            wrap.className = 'sj-quickreply-wrap';
            res.buttons.forEach(b => {
                wrap.appendChild(b.href
                    ? createActBtn(b.label, null, b.href)
                    : createActBtn(b.label, () => { inputField.value = b.ask; handleSend(); }));
            });
            msgBox.appendChild(wrap);
        }
        if (res.social) {
            const p = KB.profile;
            const sGrid = document.createElement('div');
            sGrid.className = 'sj-social-grid';
            [
                { icon: 'fab fa-github', url: p.github, title: 'GitHub' },
                { icon: 'fab fa-linkedin', url: p.linkedin, title: 'LinkedIn' },
                { icon: 'fab fa-instagram', url: p.instagram, title: 'Instagram' },
                { icon: 'fas fa-envelope', url: 'mailto:' + p.email, title: 'Email' },
                { icon: 'fas fa-phone', url: 'tel:' + p.phone.replace(/[^+\d]/g, ''), title: 'Call' }
            ].forEach(item => {
                const a = document.createElement('a');
                a.className = 'sj-social-btn';
                a.href = item.url;
                a.title = item.title;
                a.target = '_blank';
                a.rel = 'noopener';
                a.innerHTML = `<i class="${item.icon}"></i>`;
                sGrid.appendChild(a);
            });
            msgBox.appendChild(sGrid);
        }
        msgBox.scrollTop = msgBox.scrollHeight;
    };

    // ---- Gemini (through your proxy; the API key never touches this file) --
    const chatHistory = [];
    const askGemini = async (question) => {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), CONFIG.requestTimeoutMs);
        try {
            const res = await fetch(CONFIG.geminiProxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, history: chatHistory.slice(-CONFIG.maxHistory) }),
                signal: ctrl.signal
            });
            if (!res.ok) throw new Error('Proxy HTTP ' + res.status);
            const data = await res.json();
            if (!data || !data.answer) throw new Error('Empty answer');
            return String(data.answer);
        } finally {
            clearTimeout(timer);
        }
    };

    // Handle User Send
    let busy = false;
    const handleSend = async () => {
        const val = inputField.value.trim().slice(0, 500);
        if (!val || busy) return;
        inputField.value = '';
        addMessage(val, 'user');
        busy = true;
        const shimmer = addMessage('', 'bot', true);
        try {
            await kbReady;
            const local = answerLocal(val);
            const useGemini = !!CONFIG.geminiProxyUrl && !(local && (local.preferLocal || CHIP_KEYS.has(chipKey(val))));

            if (useGemini) {
                try {
                    const answer = await askGemini(val);
                    shimmer.remove();
                    addMessage(answer, 'bot');
                    speakText(answer);
                    chatHistory.push({ role: 'user', text: val.slice(0, 500) }, { role: 'model', text: answer.slice(0, 800) });
                    return;
                } catch (err) {
                    console.warn('[SJ-Bot] Gemini unavailable, using built-in answers:', err);
                }
            }
            await new Promise(r => setTimeout(r, 350));
            shimmer.remove();
            if (local) {
                renderResult(local);
            } else {
                addMessage(`I'm having trouble loading Sudeen's information right now. Please email him at sudinhr1@gmail.com.`, 'bot');
            }
        } finally {
            if (shimmer.parentNode) shimmer.remove();
            busy = false;
        }
    };

    sendBtn.onclick = handleSend;
    inputField.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    // Public API on window for external triggers
    window.SudeenChatbot = {
        open: () => toggleWindow(true),
        close: () => toggleWindow(false),
        toggle: () => toggleWindow(chatW.classList.contains('hidden')),
        send: (text) => {
            inputField.value = text;
            toggleWindow(true);
            handleSend();
        },
        mute: () => { if (isSoundEn) soundTog.onclick(); },
        unmute: () => { if (!isSoundEn) soundTog.onclick(); },
        // List installed voices, or pick one: SudeenChatbot.setVoice('Microsoft Ryan Online (Natural) - English (United Kingdom)')
        voices: () => (window.speechSynthesis ? window.speechSynthesis.getVoices() : []).map(v => v.name + ' (' + v.lang + ')'),
        setVoice: (name) => { storeSet('sj_voice', name || ''); cachedVoice = null; speakText('This is my new voice.'); }
    };

})();
