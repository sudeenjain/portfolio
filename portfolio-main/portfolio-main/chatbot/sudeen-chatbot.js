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
    `;

    const styleEl = document.createElement("style");
    styleEl.innerText = css;
    (document.head || document.documentElement).appendChild(styleEl);

    // --- Dynamic Asset Resolution (root vs /chatbot/) ---
    const isInsideChatbotFolder = window.location.pathname.includes('/chatbot');
    const resumePath = isInsideChatbotFolder ? '../resume.pdf' : 'resume.pdf';

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
    //  KNOWLEDGE BASE & INTENT DATASET (Everything About Sudeen Jain)
    // =========================================================================
    const KNOWLEDGE = {
        profile: {
            name: "Sudeen Jain H R",
            role: "AI & Machine Learning Engineer",
            degree: "B.Tech in Artificial Intelligence & Machine Learning",
            university: "Srinivas University, Mangaluru, India",
            email: "sudinhr1@gmail.com",
            phone: "+91 917829738999",
            resume: "resume.pdf",
            stats: { projects: 16, certs: 12, internships: 5 }
        },
        projects: [
            { name: "Gesture Flow", cat: "Computer Vision & AI", desc: "Real-time hand-gesture controller using OpenCV and CV pipelines.", demo: "https://guestureflow.vercel.app/", repo: "https://github.com/sudeenjain/guesture_flow" },
            { name: "Movie Recommendation", cat: "Machine Learning", desc: "Content-similarity & collaborative engine for personalized movie recommendations.", demo: "https://movie-recommendation-plum-phi.vercel.app/", repo: "https://github.com/sudeenjain/Movie_Recommendation" },
            { name: "FolioAI", cat: "AI & Automation", desc: "Smart assistant automating portfolio content generation for engineers.", demo: "https://portfolio-ai-eta-dusky.vercel.app/", repo: "https://github.com/sudeenjain/folioAI" },
            { name: "CareerReady", cat: "Web Platform", desc: "Job readiness tracking and career bench-marking platform.", demo: "https://dist-steel-beta-55.vercel.app/#/landing", repo: "https://github.com/sudeenjain/CarrerReady" },
            { name: "Product Recommendation", cat: "E-Commerce ML", desc: "Collaborative filtering recommendation engine for retail items.", demo: "https://ai-recommendation-system-gamma.vercel.app/", repo: "https://github.com/sudeenjain/Product_Recommendation" },
            { name: "Connect The Dots", cat: "DAA & Graph Theory", desc: "Algorithmic graph connectivity and pathfinding visualization.", demo: "https://daa-miniproject.vercel.app/", repo: "https://github.com/sudeenjain/Connect_the_Dots" },
            { name: "Amazon Bestseller Recommender", cat: "Big Data & ML", desc: "Predictive model analyzing Amazon bestseller dataset trends.", demo: "https://ibm-mini-project.vercel.app/", repo: "https://github.com/sudeenjain/Amazon-Bestseller-Recommender" }
        ],
        skills: {
            languages: ["Python (Advanced)", "Java", "JavaScript", "SQL & RDBMS", "HTML5 & CSS3", "PHP"],
            ai_ml: ["Machine Learning", "Deep Learning", "TensorFlow & Keras", "OpenCV & Computer Vision", "NLP", "IBM SPSS Modeler"],
            cloud: ["AWS Cloud Foundations", "Microsoft Azure", "REST APIs", "Git & GitHub", "Supabase"]
        },
        internships: [
            { role: "AI & Machine Learning Intern", org: "Averixis Solutions", duration: "Aug 2025 – Dec 2025", desc: "Predictive models, machine learning pipelines, and AICTE industry problem solving." },
            { role: "Front-End Web Development Intern", org: "Edunet Foundation & IBM SkillsBuild", duration: "6 Weeks", desc: "Responsive user interfaces, interactive JavaScript, and UI/UX design." },
            { role: "Emerging Technologies (AI & Cloud)", org: "Edunet Foundation & IBM", duration: "4 Weeks", desc: "Cloud deployment and cognitive AI integration with IBM Watson." },
            { role: "UI/UX Design Intern", org: "Snestron Systems Pvt. Ltd.", duration: "Jul 2025 – Aug 2025", desc: "User research, Figma wireframing, and interactive design systems." },
            { role: "Web Development Intern", org: "Abhimo Technologies", duration: "2026", desc: "Full-stack web application development, PHP backends, and JavaScript interactions." }
        ],
        certifications: [
            { title: "AWS Academy Graduate – Cloud Foundations", issuer: "Amazon Web Services (AWS)", link: "https://www.credly.com/badges/850a46b9-cd01-46eb-a853-35550567b86c" },
            { title: "IT Specialist – Artificial Intelligence", issuer: "Certiport (Pearson VUE)", link: "https://www.credly.com/badges/851d7a73-3caf-4851-baeb-52645964d1be" },
            { title: "Deep Learning using TensorFlow", issuer: "IBM", link: "https://www.credly.com/badges/a289455e-4038-4810-a13d-f07613725b8b" },
            { title: "Getting Started with AI", issuer: "IBM SkillsBuild", link: "https://www.credly.com/badges/de0e7fd4-8593-48c7-95f6-104af1769c4e" },
            { title: "Journey to Cloud: Solution Envisioning", issuer: "IBM SkillsBuild", link: "https://www.credly.com/badges/85e4145d-ecb3-4b8f-bb30-e4e47b4a26cc" },
            { title: "Microsoft Azure Fundamentals", issuer: "Microsoft / Skillsoft", link: "https://skillsoft.digitalbadges.skillsoft.com/481daa56-525f-46d3-b249-ff884ef8ee85" }
        ],
        social: {
            github: "https://github.com/sudeenjain",
            linkedin: "https://www.linkedin.com/in/sudeenjain",
            instagram: "https://instagram.com/sudeen_jain",
            credly: "https://www.credly.com/users/sudeenjain"
        }
    };

    const DATASET = [
        { keywords: ["hi", "hello", "hey", "namaste", "morning", "evening", "afternoon", "welcome"], exact: ["hi", "hello", "hey", "hi sj bot"], response: { type: 'greeting', voice: "Hello! I am SJ Bot, Sudeen Jain's personal AI assistant. How can I help you today?" } },
        { keywords: ["about", "who is sudeen", "who are you", "biography", "bio", "education", "college", "university", "degree", "srinivas"], response: { type: 'about', voice: "Here is information about Sudeen Jain." } },
        { keywords: ["project", "projects", "work", "built", "apps", "code", "github", "portfolio"], response: { type: 'projects', voice: "Here are Sudeen's top featured projects." } },
        { keywords: ["live demo", "demo", "demos", "online apps"], response: { type: 'demos', voice: "Here are Sudeen's deployed live web applications." } },
        { keywords: ["skill", "skills", "tech stack", "languages", "python", "java", "technologies", "aws", "azure", "ml"], response: { type: 'skills', voice: "Here is Sudeen's technical competency stack." } },
        { keywords: ["intern", "internship", "internships", "experience", "averixis", "edunet", "snestron", "abhimo"], response: { type: 'internships', voice: "Here are Sudeen's 5 professional internships." } },
        { keywords: ["certificate", "certifications", "badges", "badge", "credly", "aws academy", "pearson"], response: { type: 'certifications', voice: "Here are Sudeen's verified certifications and Credly badges." } },
        { keywords: ["resume", "cv", "curriculum vitae", "download resume"], response: { type: 'resume', voice: "Here is Sudeen's downloadable resume." } },
        { keywords: ["contact", "hire", "email", "phone", "reach", "social", "connect", "interview", "whatsapp"], response: { type: 'contact', voice: "Here is how you can contact or hire Sudeen." } }
    ];

    // =========================================================================
    //  DOM ELEMENTS & STATE
    // =========================================================================
    let isSoundEn = localStorage.getItem('sj_sound_en') !== 'false';
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

    // Sound Toggle
    soundTog.onclick = () => {
        isSoundEn = !isSoundEn;
        soundTog.innerHTML = isSoundEn ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        soundTog.classList.toggle('active', isSoundEn);
        localStorage.setItem('sj_sound_en', isSoundEn);
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

    // Voice Speech Output (Text-To-Speech)
    const speakText = (text) => {
        if (!isSoundEn || !window.speechSynthesis) return;
        try {
            window.speechSynthesis.cancel();
            const clean = text.replace(/<[^>]*>?/gm, '').replace(/[*_#`•🔹]/g, '').trim();
            if (!clean) return;
            const u = new SpeechSynthesisUtterance(clean);
            u.rate = 1.05;
            u.lang = 'en-US';
            window.speechSynthesis.speak(u);
        } catch (e) { }
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

    // Render Message Helper
    const addMessage = (text, sender, shimmer = false) => {
        const d = document.createElement('div');
        d.className = `sj-message sj-${sender}-message`;
        if (shimmer) {
            d.innerHTML = `<div class="sj-typing"><span></span><span></span><span></span></div>`;
        } else {
            let formatted = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            d.innerHTML = `<span>${formatted}</span>`;
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
        addMessage(`Hi! I'm **SJ Bot**, Sudeen Jain's personal AI Assistant. 👋\n\nI can answer anything about Sudeen's **AI/ML projects**, **technical skills**, **12+ certifications**, **5 internships**, or help you get in touch with him directly!\n\nHow can I help you today?`, 'bot');
        renderSuggestions();
        if (isSoundEn) speakText("Hi! I'm SJ Bot, Sudeen Jain's personal AI Assistant. How can I help you today?");
    };

    // Matching Engine
    const getBotResponse = (query) => {
        const q = query.toLowerCase().replace(/[?.,!]/g, '').trim();
        for (const entry of DATASET) {
            if (entry.exact && entry.exact.includes(q)) return entry.response;
        }
        let best = null;
        let maxScore = 0;
        for (const entry of DATASET) {
            let score = 0;
            entry.keywords.forEach(k => {
                if (q.includes(k)) score += k.length;
            });
            if (score > maxScore) {
                maxScore = score;
                best = entry;
            }
        }
        return best ? best.response : { type: 'help', voice: "Here are topics you can explore about Sudeen Jain." };
    };

    // Handle Intent Responses
    const handleSpecialResponse = (res, rawQuery) => {
        if (res.voice) speakText(res.voice);
        const p = KNOWLEDGE.profile;

        if (res.type === 'greeting') {
            addMessage(`Hello! Great to connect with you. Tap any topic below or ask me about Sudeen's projects, skills, or resume:`, 'bot');
            const wrap = document.createElement('div');
            wrap.className = 'sj-quickreply-wrap';
            [
                { label: '🚀 Projects', q: 'Projects' },
                { label: '⚡ Skills', q: 'Skills' },
                { label: '💼 Internships', q: 'Internships' },
                { label: '📬 Contact', q: 'Contact' }
            ].forEach(t => {
                wrap.appendChild(createActBtn(t.label, () => { inputField.value = t.q; handleSend(); }));
            });
            msgBox.appendChild(wrap);
        } else if (res.type === 'about') {
            addMessage(`*About ${p.name}:*\n\n👨‍💻 **Role:** ${p.role}\n🎓 **Degree:** ${p.degree}\n🏛️ **Institution:** ${p.university}\n\nSudeen is passionate about building production-grade AI applications, machine learning systems, and cloud-native solutions.`, 'bot');
            const wrap = document.createElement('div');
            wrap.className = 'sj-quickreply-wrap';
            wrap.appendChild(createActBtn('<i class="fas fa-file-pdf"></i> Resume', null, p.resume));
            wrap.appendChild(createActBtn('<i class="fas fa-envelope"></i> Email', null, `mailto:${p.email}`));
            msgBox.appendChild(wrap);
        } else if (res.type === 'projects' || res.type === 'demos') {
            let text = `*Top Featured Projects by Sudeen:*\n\n`;
            KNOWLEDGE.projects.slice(0, 4).forEach(proj => {
                text += `🚀 **${proj.name}** (${proj.cat})\n${proj.desc}\n\n`;
            });
            addMessage(text, 'bot');
            const wrap = document.createElement('div');
            wrap.className = 'sj-quickreply-wrap';
            KNOWLEDGE.projects.slice(0, 3).forEach(proj => {
                if (proj.demo) {
                    wrap.appendChild(createActBtn(`▶ ${proj.name}`, null, proj.demo));
                }
            });
            wrap.appendChild(createActBtn('<i class="fab fa-github"></i> All on GitHub', null, KNOWLEDGE.social.github));
            msgBox.appendChild(wrap);
        } else if (res.type === 'skills') {
            const s = KNOWLEDGE.skills;
            let text = `*Technical Skills Matrix:*\n\n`;
            text += `💻 **Languages:** ${s.languages.join(', ')}\n\n`;
            text += `🤖 **AI & ML:** ${s.ai_ml.join(', ')}\n\n`;
            text += `☁️ **Cloud & Tools:** ${s.cloud.join(', ')}`;
            addMessage(text, 'bot');
            msgBox.appendChild(createActBtn('🚀 View Projects using these skills', () => {
                inputField.value = "Projects";
                handleSend();
            }));
        } else if (res.type === 'internships') {
            let text = `*Professional Internships (${KNOWLEDGE.internships.length}):*\n\n`;
            KNOWLEDGE.internships.forEach(i => {
                text += `💼 **${i.role}**\n🏢 ${i.org} · ${i.duration}\n${i.desc}\n\n`;
            });
            addMessage(text, 'bot');
        } else if (res.type === 'certifications') {
            let text = `*Verified Certifications & Badges:*\n\n`;
            KNOWLEDGE.certifications.slice(0, 4).forEach(c => {
                text += `🏆 **${c.title}**\n🏢 ${c.issuer}\n\n`;
            });
            addMessage(text, 'bot');
            msgBox.appendChild(createActBtn('<i class="fas fa-certificate"></i> View Credly Badges', null, KNOWLEDGE.social.credly));
        } else if (res.type === 'resume') {
            addMessage(`*Sudeen Jain's Resume:*\n\nClick the button below to download or view Sudeen's verified resume (PDF) detailing his projects, university degree, internships, and cloud credentials.`, 'bot');
            const wrap = document.createElement('div');
            wrap.className = 'sj-quickreply-wrap';
            wrap.appendChild(createActBtn('<i class="fas fa-file-pdf"></i> Download Resume (PDF)', null, p.resume));
            wrap.appendChild(createActBtn('<i class="fas fa-envelope"></i> Email Inquiries', null, `mailto:${p.email}`));
            msgBox.appendChild(wrap);
        } else if (res.type === 'contact') {
            addMessage(`*Contact Details:*\n\n📧 Email: ${p.email}\n📱 WhatsApp / Phone: ${p.phone}\n📍 Location: Mangaluru, Karnataka, India\n\nConnect with Sudeen directly across social channels:`, 'bot');
            const sGrid = document.createElement('div');
            sGrid.className = 'sj-social-grid';
            [
                { icon: 'fab fa-github', url: KNOWLEDGE.social.github },
                { icon: 'fab fa-linkedin', url: KNOWLEDGE.social.linkedin },
                { icon: 'fab fa-instagram', url: KNOWLEDGE.social.instagram },
                { icon: 'fas fa-envelope', url: `mailto:${p.email}` }
            ].forEach(item => {
                const a = document.createElement('a');
                a.className = 'sj-social-btn';
                a.href = item.url;
                a.target = '_blank';
                a.rel = 'noopener';
                a.innerHTML = `<i class="${item.icon}"></i>`;
                sGrid.appendChild(a);
            });
            msgBox.appendChild(sGrid);
        } else {
            // Help / Fallback
            addMessage(`I couldn't find an exact match, but here are key topics you can explore about Sudeen Jain:`, 'bot');
            const wrap = document.createElement('div');
            wrap.className = 'sj-quickreply-wrap';
            [
                { label: '👤 About Sudeen', q: 'About Sudeen' },
                { label: '🚀 Projects & Demos', q: 'Projects' },
                { label: '⚡ Technical Skills', q: 'Skills' },
                { label: '💼 Internships', q: 'Internships' },
                { label: '📄 Resume', q: 'Resume' },
                { label: '📬 Contact Details', q: 'Contact' }
            ].forEach(t => {
                wrap.appendChild(createActBtn(t.label, () => { inputField.value = t.q; handleSend(); }));
            });
            msgBox.appendChild(wrap);
        }
        msgBox.scrollTop = msgBox.scrollHeight;
    };

    // Handle User Send
    const handleSend = () => {
        const val = inputField.value.trim();
        if (!val) return;
        inputField.value = '';

        addMessage(val, 'user');
        const shimmer = addMessage('', 'bot', true);

        setTimeout(() => {
            shimmer.remove();
            const res = getBotResponse(val);
            handleSpecialResponse(res, val);
        }, 450);
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
        }
    };

})();
