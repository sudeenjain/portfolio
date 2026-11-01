/**
 * ==========================================================================
 * SUDEEN JAIN AI COPILOT - INTELLIGENT CONVERSATIONAL ENGINE
 * High-performance client-side NLP, Web Audio SFX, Speech API, & Rich Cards
 * ==========================================================================
 */

class SudeenAICopilot {
  constructor() {
    this.messagesContainer = document.getElementById('chatMessages');
    this.inputField = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.micBtn = document.getElementById('micBtn');
    this.quickChipsContainer = document.getElementById('quickChips');
    this.audioToggleBtn = document.getElementById('audioToggleBtn');
    this.speechToggleBtn = document.getElementById('speechToggleBtn');
    this.clearChatBtn = document.getElementById('clearChatBtn');
    
    // Mobile Drawer Elements
    this.sidebar = document.getElementById('sidebar');
    this.drawerToggle = document.getElementById('drawerToggle');
    this.sidebarClose = document.getElementById('sidebarClose');
    this.sidebarOverlay = document.getElementById('sidebarOverlay');

    // State
    this.isMuted = localStorage.getItem('sj_bot_muted') === 'true';
    this.isSpeechEnabled = localStorage.getItem('sj_bot_speech') === 'true';
    this.isListening = false;
    this.isProcessing = false;
    this.audioCtx = null;
    this.recognition = null;

    this.init();
  }

  init() {
    this.setupAudio();
    this.setupSpeechRecognition();
    this.setupEventListeners();
    this.renderQuickChips();
    this.updateToggleButtons();

    // Auto-focus input on desktop
    if (window.innerWidth > 900) {
      setTimeout(() => this.inputField?.focus(), 400);
    }
  }

  /* ==========================================================================
     WEB AUDIO API - SYNTHESIZED SCI-FI SOUND EFFECTS
     ========================================================================== */
  setupAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  playBeep(freqStart = 600, freqEnd = 900, duration = 0.08, type = 'sine') {
    if (this.isMuted || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy handled silently
    }
  }

  playSendSound() {
    this.playBeep(520, 880, 0.09, 'sine');
  }

  playReceiveSound() {
    this.playBeep(750, 1100, 0.12, 'triangle');
  }

  /* ==========================================================================
     SPEECH RECOGNITION & SYNTHESIS (VOICE CAPABILITIES)
     ========================================================================== */
  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.micBtn?.classList.add('listening');
        this.inputField.placeholder = "Listening... Speak now";
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          this.inputField.value = transcript;
          this.handleSendMessage();
        }
      };

      this.recognition.onerror = () => {
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.stopListening();
      };
    } else {
      if (this.micBtn) {
        this.micBtn.title = "Voice recognition not supported on this browser";
        this.micBtn.style.opacity = '0.5';
      }
    }
  }

  toggleListening() {
    if (!this.recognition) {
      alert("Voice speech recognition is not supported in your browser. Please type your message.");
      return;
    }
    if (this.isListening) {
      this.recognition.stop();
      this.stopListening();
    } else {
      try {
        this.recognition.start();
      } catch (e) {
        this.stopListening();
      }
    }
  }

  stopListening() {
    this.isListening = false;
    this.micBtn?.classList.remove('listening');
    if (this.inputField) {
      this.inputField.placeholder = "Ask anything about Sudeen's projects, skills, education...";
    }
  }

  speakText(plainText) {
    if (!this.isSpeechEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      // Clean HTML tags and markdown for clear speech
      const clean = plainText.replace(/<[^>]*>?/gm, '').replace(/[*_#`]/g, '').slice(0, 200);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  }

  /* ==========================================================================
     EVENT LISTENERS & DRAWER CONTROLS
     ========================================================================== */
  setupEventListeners() {
    // Send message triggers
    this.sendBtn?.addEventListener('click', () => this.handleSendMessage());

    this.inputField?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    // Auto-resize input
    this.inputField?.addEventListener('input', () => {
      this.inputField.style.height = 'auto';
      this.inputField.style.height = Math.min(this.inputField.scrollHeight, 120) + 'px';
      this.sendBtn.disabled = !this.inputField.value.trim();
    });

    // Mic toggle
    this.micBtn?.addEventListener('click', () => this.toggleListening());

    // Audio SFX toggle
    this.audioToggleBtn?.addEventListener('click', () => {
      this.isMuted = !this.isMuted;
      localStorage.setItem('sj_bot_muted', this.isMuted);
      this.updateToggleButtons();
      if (!this.isMuted) this.playBeep(800, 1000, 0.08);
    });

    // Speech TTS toggle
    this.speechToggleBtn?.addEventListener('click', () => {
      this.isSpeechEnabled = !this.isSpeechEnabled;
      localStorage.setItem('sj_bot_speech', this.isSpeechEnabled);
      this.updateToggleButtons();
      if (this.isSpeechEnabled) {
        this.speakText("Voice response enabled.");
      } else {
        window.speechSynthesis?.cancel();
      }
    });

    // Clear Chat
    this.clearChatBtn?.addEventListener('click', () => {
      if (confirm("Reset conversation with Sudeen AI Copilot?")) {
        const welcome = document.querySelector('.welcome-hero-card');
        this.messagesContainer.innerHTML = '';
        if (welcome) this.messagesContainer.appendChild(welcome);
        this.appendBotMessage("Conversation reset! How can I assist you with Sudeen Jain's profile today?");
      }
    });

    // Mobile Drawer Controls
    const openDrawer = () => {
      this.sidebar?.classList.add('open');
      this.sidebarOverlay?.classList.add('active');
    };

    const closeDrawer = () => {
      this.sidebar?.classList.remove('open');
      this.sidebarOverlay?.classList.remove('active');
    };

    this.drawerToggle?.addEventListener('click', openDrawer);
    this.sidebarClose?.addEventListener('click', closeDrawer);
    this.sidebarOverlay?.addEventListener('click', closeDrawer);

    // Sidebar quick navigation buttons
    document.querySelectorAll('[data-quick-query]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const query = e.currentTarget.getAttribute('data-quick-query');
        closeDrawer();
        this.sendQuery(query);
      });
    });
  }

  updateToggleButtons() {
    if (this.audioToggleBtn) {
      if (this.isMuted) {
        this.audioToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        this.audioToggleBtn.title = "Unmute SFX Audio";
        this.audioToggleBtn.classList.remove('active');
      } else {
        this.audioToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        this.audioToggleBtn.title = "Mute SFX Audio";
        this.audioToggleBtn.classList.add('active');
      }
    }

    if (this.speechToggleBtn) {
      if (this.isSpeechEnabled) {
        this.speechToggleBtn.classList.add('active');
        this.speechToggleBtn.title = "Voice Speech: ON (Click to mute voice)";
      } else {
        this.speechToggleBtn.classList.remove('active');
        this.speechToggleBtn.title = "Voice Speech: OFF (Click to enable voice output)";
      }
    }
  }

  renderQuickChips() {
    if (!this.quickChipsContainer || !window.QUICK_PROMPTS) return;
    this.quickChipsContainer.innerHTML = '';
    
    window.QUICK_PROMPTS.forEach(item => {
      const chip = document.createElement('button');
      chip.className = 'chip-btn';
      chip.innerHTML = `<span>${item.icon}</span> ${item.label}`;
      chip.addEventListener('click', () => {
        this.sendQuery(item.query);
      });
      this.quickChipsContainer.appendChild(chip);
    });
  }

  /* ==========================================================================
     MESSAGING PIPELINE
     ========================================================================== */
  sendQuery(query) {
    if (this.isProcessing) return;
    this.inputField.value = query;
    this.handleSendMessage();
  }

  handleSendMessage() {
    const text = this.inputField.value.trim();
    if (!text || this.isProcessing) return;

    this.inputField.value = '';
    this.inputField.style.height = 'auto';
    this.sendBtn.disabled = true;

    // Render User Bubble
    this.appendUserMessage(text);
    this.playSendSound();

    // Show Typing Indicator & Generate Response
    this.isProcessing = true;
    const typingIndicator = this.showTypingIndicator();

    // Natural processing delay
    const delay = Math.min(800, 300 + text.length * 10);
    setTimeout(() => {
      typingIndicator.remove();
      const responseData = this.processIntent(text);
      this.appendBotMessage(responseData.html, responseData.speech);
      this.playReceiveSound();
      this.isProcessing = false;
    }, delay);
  }

  appendUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'message-row user-row';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    row.innerHTML = `
      <div class="msg-avatar"><i class="fas fa-user"></i></div>
      <div class="msg-bubble-wrapper">
        <div class="msg-bubble">${this.escapeHTML(text)}</div>
        <div class="msg-meta">${time}</div>
      </div>
    `;

    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'message-row bot-row';
    row.id = 'activeTypingIndicator';

    row.innerHTML = `
      <div class="msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="msg-bubble-wrapper">
        <div class="msg-bubble typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;

    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
    return row;
  }

  appendBotMessage(htmlContent, speechSummary = '') {
    const row = document.createElement('div');
    row.className = 'message-row bot-row';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    row.innerHTML = `
      <div class="msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="msg-bubble-wrapper">
        <div class="msg-bubble">${htmlContent}</div>
        <div class="msg-meta">
          <span>${time}</span>
          <button class="msg-copy-btn" title="Copy response text">
            <i class="fas fa-copy"></i> Copy
          </button>
        </div>
      </div>
    `;

    // Copy action
    const copyBtn = row.querySelector('.msg-copy-btn');
    copyBtn.addEventListener('click', () => {
      const bubble = row.querySelector('.msg-bubble');
      const textToCopy = bubble.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
        setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy', 2000);
      });
    });

    this.messagesContainer.appendChild(row);
    this.scrollToBottom();

    // Trigger TTS if enabled
    if (speechSummary) {
      this.speakText(speechSummary);
    }
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  /* ==========================================================================
     INTENT MATCHING & NLP ENGINE
     ========================================================================== */
  processIntent(rawQuery) {
    const q = rawQuery.toLowerCase().trim();
    const p = SUDEEN_KB.profile;

    // 1. GREETINGS & CASUAL
    if (/^(hi|hello|hey|greetings|hola|namaste|sup|yo)\b/.test(q)) {
      return {
        speech: "Hello! I am Sudeen Jain's Neural Portfolio Copilot. How can I help you today?",
        html: `
          <p><strong>Hello! 👋</strong> I am <strong>Sudeen's AI Copilot</strong>.</p>
          <p style="margin-top:0.4rem; color:var(--text-secondary);">
            I'm here to answer any questions about Sudeen's background in AI & ML, his 16+ projects, technical skill set, Credly badges, internships, or help you connect with him directly!
          </p>
          <div class="rich-tag-cloud" style="margin-top:0.75rem;">
            <span class="rich-tag" style="cursor:pointer" onclick="copilot.sendQuery('Who is Sudeen Jain?')">👤 About Sudeen</span>
            <span class="rich-tag" style="cursor:pointer" onclick="copilot.sendQuery('Show me top projects')">🚀 Top Projects</span>
            <span class="rich-tag" style="cursor:pointer" onclick="copilot.sendQuery('What are his skills?')">⚡ Skills Matrix</span>
            <span class="rich-tag" style="cursor:pointer" onclick="copilot.sendQuery('How can I contact him?')">📬 Get In Touch</span>
          </div>
        `
      };
    }

    if (/who are you|what are you|what can you do|help\b/.test(q)) {
      return {
        speech: "I am an intelligent neural copilot programmed with complete knowledge of Sudeen Jain's career, projects, and technical skills.",
        html: `
          <p>🤖 <strong>Neural Portfolio Copilot (SJ-Bot v2.4)</strong></p>
          <p style="margin-top:0.35rem; color:var(--text-secondary);">
            I have indexed all of Sudeen Jain's achievements, software repositories, cloud credentials, and career milestones. Here is what you can ask me:
          </p>
          <ul style="margin:0.5rem 0 0 1.2rem; color:var(--text-secondary); font-size:0.85rem; line-height:1.6;">
            <li><strong>About Sudeen:</strong> Education, university, background, interests.</li>
            <li><strong>Projects:</strong> View live demos, source code, and tech stacks for all 16 projects.</li>
            <li><strong>Skills:</strong> Python, Machine Learning, AWS, Azure, Full-Stack development.</li>
            <li><strong>Credentials:</strong> AWS Academy badge, Pearson AI Specialist, IBM certifications.</li>
            <li><strong>Internships:</strong> Averixis, Edunet/IBM, Snestron UI/UX, Abhimo Tech.</li>
            <li><strong>Hire / Contact:</strong> Direct email link, social networks, and resume download.</li>
          </ul>
        `
      };
    }

    // 2. PROFILE & ABOUT
    if (/who is sudeen|about sudeen|tell me about|biography|bio|background|who is he|who are they/.test(q)) {
      return {
        speech: `${p.fullName} is an AI and Machine Learning engineer pursuing his B.Tech at Srinivas University in India.`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-user-astronaut"></i> About ${p.fullName}</div>
          <p><strong>${p.fullName}</strong> is an aspiring <strong>${p.title}</strong> currently pursuing his <strong>${p.education.degree}</strong> at <strong>${p.education.institution}</strong> in ${p.location}.</p>
          <p style="margin-top:0.5rem; color:var(--text-secondary);">${p.bio[1]}</p>
          <p style="margin-top:0.5rem; color:var(--text-secondary);">${p.bio[2]}</p>
          
          <div class="stats-grid" style="margin-top:0.85rem;">
            <div class="stat-box"><div class="stat-num">${p.stats.projectsCount}+</div><div class="stat-lbl">Projects Built</div></div>
            <div class="stat-box"><div class="stat-num">${p.stats.certificationsCount}+</div><div class="stat-lbl">Certifications</div></div>
            <div class="stat-box"><div class="stat-num">${p.stats.internshipsCount}</div><div class="stat-lbl">Internships</div></div>
            <div class="stat-box"><div class="stat-num">${p.stats.technologiesCount}+</div><div class="stat-lbl">Core Tech</div></div>
          </div>

          <div class="rich-actions-row" style="margin-top:1rem;">
            <a href="${p.resumePath}" target="_blank" class="card-btn card-btn-demo"><i class="fas fa-file-pdf"></i> View Resume</a>
            <a href="mailto:${p.email}" class="card-btn card-btn-github"><i class="fas fa-envelope"></i> Contact Sudeen</a>
          </div>
        `
      };
    }

    // 3. EDUCATION
    if (/education|degree|university|college|study|studying|srinivas|academics|qualification/.test(q)) {
      return {
        speech: `Sudeen is pursuing a B.Tech in Artificial Intelligence and Machine Learning at Srinivas University.`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-graduation-cap"></i> Academic Background</div>
          <div class="rich-item-card">
            <div class="rich-item-header">
              <div class="rich-item-title">${p.education.degree}</div>
              <span class="rich-item-category">${p.education.status}</span>
            </div>
            <p style="font-size:0.85rem; color:var(--neon-cyan); margin-top:0.2rem;"><i class="fas fa-university"></i> ${p.education.institution}</p>
            <p class="rich-item-desc" style="margin-top:0.4rem;">
              <strong>Key Focus Areas:</strong> ${p.education.focus}
            </p>
          </div>
        `
      };
    }

    // 4. SPECIFIC PROJECT LOOKUPS
    const foundProject = SUDEEN_KB.projects.find(proj => {
      const titleClean = proj.title.toLowerCase();
      const idClean = proj.id.replace(/-/g, ' ');
      return q.includes(titleClean) || q.includes(idClean) || 
             (q.includes('gesture') && proj.id === 'gesture-flow') ||
             (q.includes('movie') && proj.id === 'movie-recommendation') ||
             (q.includes('folio') && proj.id === 'folio-ai') ||
             (q.includes('career') && proj.id === 'career-ready') ||
             (q.includes('amazon') && proj.id === 'amazon-bestseller') ||
             (q.includes('dots') && proj.id === 'connect-the-dots') ||
             (q.includes('attendance') && proj.id === 'attendance-tracker') ||
             (q.includes('balancer') && proj.id === 'game-difficulty-balancer');
    });

    if (foundProject) {
      return {
        speech: `Here is information on ${foundProject.title}: ${foundProject.description}`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-rocket"></i> Project Spotlight</div>
          <div class="rich-item-card">
            <div class="rich-item-header">
              <div class="rich-item-title">${foundProject.title}</div>
              <span class="rich-item-category">${foundProject.category}</span>
            </div>
            <p class="rich-item-desc">${foundProject.description}</p>
            <div class="rich-tag-cloud">
              ${foundProject.tech.map(t => `<span class="rich-tag">${t}</span>`).join('')}
            </div>
            <div class="rich-actions-row">
              ${foundProject.demo ? `<a href="${foundProject.demo}" target="_blank" class="card-btn card-btn-demo"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
              ${foundProject.github ? `<a href="${foundProject.github}" target="_blank" class="card-btn card-btn-github"><i class="fab fa-github"></i> Source Code</a>` : ''}
            </div>
          </div>
        `
      };
    }

    // 5. LIVE DEMOS QUERY
    if (/live demo|demos|interactive apps|working apps|online apps/.test(q)) {
      const demoProjects = SUDEEN_KB.projects.filter(proj => proj.demo);
      return {
        speech: `Here are ${demoProjects.length} projects with active live web demos you can test right now.`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-globe"></i> Live Working Demos (${demoProjects.length})</div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.75rem;">
            Click any demo button below to open and interact with the deployed live web applications:
          </p>
          <div class="rich-cards-grid">
            ${demoProjects.map(proj => `
              <div class="rich-item-card">
                <div class="rich-item-header">
                  <div class="rich-item-title">${proj.title}</div>
                  <span class="rich-item-category">${proj.category}</span>
                </div>
                <p class="rich-item-desc">${proj.description}</p>
                <div class="rich-actions-row">
                  <a href="${proj.demo}" target="_blank" class="card-btn card-btn-demo"><i class="fas fa-play"></i> Launch Demo</a>
                  <a href="${proj.github}" target="_blank" class="card-btn card-btn-github"><i class="fab fa-github"></i> Code</a>
                </div>
              </div>
            `).join('')}
          </div>
        `
      };
    }

    // 6. ALL / TOP PROJECTS
    if (/project|portfolio work|what did he build|repositories|apps|creations/.test(q)) {
      const featured = SUDEEN_KB.projects.filter(p => p.featured).slice(0, 6);
      return {
        speech: `Sudeen has built 16 projects spanning AI, machine learning, computer vision, and web applications. Here are some of his top featured works.`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-code-branch"></i> Top Featured Projects</div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.75rem;">
            Sudeen has developed over <strong>16 software repositories</strong>. Here are standout highlights with live deployment and source code:
          </p>
          <div class="rich-cards-grid">
            ${featured.map(proj => `
              <div class="rich-item-card">
                <div class="rich-item-header">
                  <div class="rich-item-title">${proj.title}</div>
                  <span class="rich-item-category">${proj.category}</span>
                </div>
                <p class="rich-item-desc">${proj.description}</p>
                <div class="rich-tag-cloud">
                  ${proj.tech.map(t => `<span class="rich-tag">${t}</span>`).join('')}
                </div>
                <div class="rich-actions-row">
                  ${proj.demo ? `<a href="${proj.demo}" target="_blank" class="card-btn card-btn-demo"><i class="fas fa-play"></i> Live Demo</a>` : ''}
                  <a href="${proj.github}" target="_blank" class="card-btn card-btn-github"><i class="fab fa-github"></i> GitHub</a>
                </div>
              </div>
            `).join('')}
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.75rem;">
            Want to see live demos only? Ask <em>"Show me live demos"</em> or ask about a specific project like <em>Gesture Flow</em>.
          </p>
        `
      };
    }

    // 7. SPECIFIC SKILL QUERIES
    if (/\b(python|java|javascript|js|sql|html|css|aws|azure|tensorflow|opencv|ml|machine learning|ai|deep learning|nlp)\b/.test(q)) {
      let matchedSkill = q.match(/\b(python|java|javascript|js|sql|html|css|aws|azure|tensorflow|opencv|machine learning|deep learning|nlp)\b/)[0];
      return {
        speech: `Yes, Sudeen has hands-on practical experience in ${matchedSkill}.`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-check-circle"></i> Skill Spotlight: ${matchedSkill.toUpperCase()}</div>
          <p>Yes! <strong>${matchedSkill.toUpperCase()}</strong> is an active component of Sudeen's technical toolkit.</p>
          <p style="margin-top:0.4rem; color:var(--text-secondary); font-size:0.86rem;">
            He has applied it across academic research, AICTE internships, certified credential programs, and multiple open-source repositories on GitHub.
          </p>
          <div class="rich-actions-row" style="margin-top:0.85rem;">
            <button class="card-btn card-btn-demo" onclick="copilot.sendQuery('What are his technical skills?')"><i class="fas fa-layer-group"></i> View All Skills</button>
            <button class="card-btn card-btn-github" onclick="copilot.sendQuery('Show me his projects')"><i class="fas fa-code"></i> View Projects</button>
          </div>
        `
      };
    }

    // 8. GENERAL SKILLS MATRIX
    if (/skill|tech stack|technologies|tools|languages|competencies|what does he know/.test(q)) {
      const s = SUDEEN_KB.skills;
      return {
        speech: `Sudeen's primary skills include Python, Machine Learning, Deep Learning, AWS Cloud, Azure, Java, JavaScript, and Full-Stack development.`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-bolt"></i> Technical Competency Matrix</div>
          
          <div style="margin-bottom:0.75rem;">
            <h4 style="font-size:0.82rem; color:var(--neon-cyan); margin-bottom:0.35rem;"><i class="fas fa-code"></i> Programming Languages</h4>
            <div class="rich-tag-cloud">
              ${s.programming.map(item => `<span class="rich-tag"><i class="${item.icon}"></i> ${item.name} (${item.level})</span>`).join('')}
            </div>
          </div>

          <div style="margin-bottom:0.75rem;">
            <h4 style="font-size:0.82rem; color:var(--neon-purple); margin-bottom:0.35rem;"><i class="fas fa-brain"></i> AI, Machine Learning & Data</h4>
            <div class="rich-tag-cloud">
              ${s.ai_ml.map(item => `<span class="rich-tag"><i class="${item.icon}"></i> ${item.name}</span>`).join('')}
            </div>
          </div>

          <div style="margin-bottom:0.75rem;">
            <h4 style="font-size:0.82rem; color:var(--neon-green); margin-bottom:0.35rem;"><i class="fas fa-cloud"></i> Cloud, Databases & DevOps</h4>
            <div class="rich-tag-cloud">
              ${s.cloud_devops.map(item => `<span class="rich-tag"><i class="${item.icon}"></i> ${item.name}</span>`).join('')}
            </div>
          </div>

          <div>
            <h4 style="font-size:0.82rem; color:var(--neon-amber); margin-bottom:0.35rem;"><i class="fas fa-laptop-code"></i> Web & Design</h4>
            <div class="rich-tag-cloud">
              ${s.web_development.map(item => `<span class="rich-tag"><i class="${item.icon}"></i> ${item.name}</span>`).join('')}
            </div>
          </div>
        `
      };
    }

    // 9. CERTIFICATIONS & BADGES
    if (/certificate|certifications|badges|credly|credentials|verified|license|aws academy|pearson|ibm/.test(q)) {
      const certs = SUDEEN_KB.certifications;
      return {
        speech: `Sudeen holds over 12 verified certifications and digital badges from AWS Academy, Pearson Certiport, IBM SkillsBuild, and Microsoft.`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-award"></i> Verified Certifications & Badges</div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.75rem;">
            Sudeen has earned 12+ industry certifications validating cloud architecture, AI development, and software engineering:
          </p>
          <div class="rich-cards-grid">
            ${certs.slice(0, 6).map(c => `
              <div class="rich-item-card">
                <div class="rich-item-header">
                  <div class="rich-item-title">${c.title}</div>
                  <span class="rich-item-category">${c.category}</span>
                </div>
                <div style="font-size:0.78rem; color:var(--neon-cyan);"><i class="fas fa-building"></i> ${c.issuer}</div>
                <p class="rich-item-desc">${c.desc}</p>
                <div class="rich-actions-row">
                  <a href="${c.link}" target="_blank" class="card-btn card-btn-demo"><i class="fas fa-certificate"></i> View Credential</a>
                </div>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:1rem; text-align:center;">
            <a href="${p.credly}" target="_blank" class="btn-action-primary" style="display:inline-flex;">
              <i class="fas fa-external-link-alt"></i> View Complete Credly Transcript
            </a>
          </div>
        `
      };
    }

    // 10. INTERNSHIPS & EXPERIENCE
    if (/internship|experience|work|job|averixis|edunet|snestron|abhimo|where did he work/.test(q)) {
      const interns = SUDEEN_KB.internships;
      return {
        speech: `Sudeen has completed 5 internships across AI, machine learning, cloud systems, front-end development, and UI/UX design.`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-briefcase"></i> Professional Internships (${interns.length})</div>
          <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:0.5rem;">
            ${interns.map(i => `
              <div class="rich-item-card">
                <div class="rich-item-header">
                  <div>
                    <div class="rich-item-title">${i.role}</div>
                    <div style="font-size:0.8rem; color:var(--neon-cyan); margin-top:2px;">
                      <i class="fas fa-building"></i> ${i.company} &nbsp;·&nbsp; <i class="fas fa-calendar-alt"></i> ${i.period}
                    </div>
                  </div>
                </div>
                <p class="rich-item-desc">${i.desc}</p>
                <div class="rich-tag-cloud">
                  ${i.tags.map(t => `<span class="rich-tag">${t}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `
      };
    }

    // 11. RESUME / CV
    if (/resume|cv|curriculum vitae|download resume/.test(q)) {
      return {
        speech: `You can download or view Sudeen Jain's complete resume in PDF format.`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-file-alt"></i> Sudeen Jain's Resume</div>
          <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">
            Sudeen's resume documents his engineering degree at Srinivas University, hands-on AI/ML project architecture, 5 industry internships, and 12+ cloud and AI certifications.
          </p>
          <div class="rich-actions-row" style="margin-top:1rem;">
            <a href="${p.resumePath}" target="_blank" class="card-btn card-btn-demo" style="padding:0.6rem 1.2rem; font-size:0.88rem;">
              <i class="fas fa-download"></i> Download Resume (PDF)
            </a>
            <a href="mailto:${p.email}" class="card-btn card-btn-github" style="padding:0.6rem 1.2rem; font-size:0.88rem;">
              <i class="fas fa-envelope"></i> Email Inquiries
            </a>
          </div>
        `
      };
    }

    // 12. CONTACT / HIRE
    if (/contact|hire|email|phone|connect|linkedin|github|reach out|message|get in touch|collaborate|interview/.test(q)) {
      return {
        speech: `You can contact Sudeen directly via email at ${p.email} or connect on LinkedIn and GitHub.`,
        html: `
          <div class="rich-section-heading"><i class="fas fa-paper-plane"></i> Get in Touch with Sudeen</div>
          <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">
            Sudeen is actively open to <strong>AI/ML engineering internships, full-time roles, and innovative collaborations</strong>. Feel free to reach out through any of these channels:
          </p>

          <div style="display:flex; flex-direction:column; gap:0.5rem; margin:1rem 0;">
            <a href="mailto:${p.email}" class="quick-nav-btn" style="text-decoration:none;">
              <span><i class="fas fa-envelope" style="color:var(--neon-cyan)"></i> <strong>Email:</strong> ${p.email}</span>
              <i class="fas fa-external-link-alt"></i>
            </a>
            <a href="${p.linkedin}" target="_blank" class="quick-nav-btn" style="text-decoration:none;">
              <span><i class="fab fa-linkedin" style="color:var(--neon-cyan)"></i> <strong>LinkedIn:</strong> linkedin.com/in/sudeenjain</span>
              <i class="fas fa-external-link-alt"></i>
            </a>
            <a href="${p.github}" target="_blank" class="quick-nav-btn" style="text-decoration:none;">
              <span><i class="fab fa-github" style="color:var(--neon-cyan)"></i> <strong>GitHub:</strong> github.com/sudeenjain</span>
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>

          <div class="rich-actions-row">
            <a href="mailto:${p.email}?subject=Collaboration%20with%20Sudeen%20Jain" class="card-btn card-btn-demo">
              <i class="fas fa-envelope"></i> Compose Email
            </a>
            <a href="${p.resumePath}" target="_blank" class="card-btn card-btn-github">
              <i class="fas fa-file-pdf"></i> Download Resume
            </a>
          </div>
        `
      };
    }

    // 13. FAQ SEARCH & FALLBACK
    for (const faq of SUDEEN_KB.faqs) {
      const qWords = q.split(/\s+/).filter(w => w.length > 3);
      const match = qWords.some(w => faq.q.toLowerCase().includes(w));
      if (match) {
        return {
          speech: faq.a,
          html: `
            <div class="rich-section-heading"><i class="fas fa-info-circle"></i> ${faq.q}</div>
            <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.6;">${faq.a}</p>
          `
        };
      }
    }

    // 14. SMART FALLBACK
    return {
      speech: `I'm not completely certain about that specific detail, but I can help you with Sudeen's projects, skills, certifications, internships, or contact info.`,
      html: `
        <p>I'm not fully sure about that query, but here is what I know best about <strong>Sudeen Jain</strong>:</p>
        <div class="rich-cards-grid" style="margin-top:0.75rem;">
          <div class="rich-item-card" style="cursor:pointer;" onclick="copilot.sendQuery('Show me top projects')">
            <div class="rich-item-title"><i class="fas fa-rocket" style="color:var(--neon-cyan)"></i> Projects & Demos</div>
            <p class="rich-item-desc">Explore 16+ repositories including Gesture Flow, FolioAI, & ML engines.</p>
          </div>
          <div class="rich-item-card" style="cursor:pointer;" onclick="copilot.sendQuery('What are his technical skills?')">
            <div class="rich-item-title"><i class="fas fa-bolt" style="color:var(--neon-purple)"></i> Skills & Tech Stack</div>
            <p class="rich-item-desc">Python, Machine Learning, TensorFlow, AWS, Azure, & Full-Stack.</p>
          </div>
          <div class="rich-item-card" style="cursor:pointer;" onclick="copilot.sendQuery('Where did he intern?')">
            <div class="rich-item-title"><i class="fas fa-briefcase" style="color:var(--neon-green)"></i> Work Internships</div>
            <p class="rich-item-desc">Averixis AI/ML, Edunet & IBM, Snestron UI/UX, & Abhimo Tech.</p>
          </div>
          <div class="rich-item-card" style="cursor:pointer;" onclick="copilot.sendQuery('How can I contact Sudeen?')">
            <div class="rich-item-title"><i class="fas fa-envelope" style="color:var(--neon-amber)"></i> Contact & Hire</div>
            <p class="rich-item-desc">Direct email, LinkedIn, GitHub, and downloadable resume.</p>
          </div>
        </div>
      `
    };
  }
}

// Global instance initialization on DOM ready
let copilot;
document.addEventListener('DOMContentLoaded', () => {
  copilot = new SudeenAICopilot();
});
