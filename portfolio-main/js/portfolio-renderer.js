/**
 * PORTFOLIO RENDERER
 * ----------------------------------------------------------------
 * Reads `portfolioData` (data/portfolio-data.js) and builds every
 * section's markup at runtime. Load order in index.html matters:
 *   1. data/portfolio-data.js   (defines `portfolioData`)
 *   2. js/portfolio-renderer.js (defines `PortfolioRenderer`, this file)
 *   3. js/scripts.js            (calls PortfolioRenderer.renderAll(),
 *                                 then wires up all page behavior)
 * ----------------------------------------------------------------
 */

const PortfolioRenderer = (() => {

    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderNav(d) {
        // Add a Resume link automatically without requiring changes to portfolio-data.js.
        const navLinks = Array.isArray(d.links) ? [...d.links] : [];
        if (!navLinks.some(link => link.href === '#resume')) {
            const contactIndex = navLinks.findIndex(link =>
                link.href === '#contact' || link.href === '#get-in-touch'
            );
            const resumeLink = { href: '#resume', label: 'Resume', cta: false };

            if (contactIndex >= 0) {
                navLinks.splice(contactIndex, 0, resumeLink);
            } else {
                navLinks.push(resumeLink);
            }
        }

        const links = navLinks.map(l =>
            `<a href="${l.href}"${l.cta ? ' class="nav-cta"' : ''}>${l.label}</a>`
        ).join('');

        return `
<nav id="navbar">
    <div class="logo" onclick="window.location.href='#home'">
        <span class="logo-icon">${d.logoIcon}</span>
        <span class="logo-text">${d.logoText}</span>
    </div>
    <button class="hamburger" id="hamburgerBtn" aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
    </button>
    <div class="nav-links" id="navLinksContainer">${links}</div>
</nav>`;
    }

    function renderHero(d) {
        return `
<div class="hero-wrapper">
    <div class="hero-content">
        <div class="hero-status-pill" data-aos="fade-down">
            <span class="status-pulse-dot"></span>
            <span class="status-text">${d.greeting || 'Available for Opportunities'}</span>
        </div>
        <h1 class="hero-main-title" data-aos="zoom-in" data-aos-duration="900">
            <span class="hero-first-name">${d.name}</span>
        </h1>
        <p class="hero-degree-line" data-aos="fade-up" data-aos-delay="150">
            ${d.subtitle}
        </p>
        <div class="hero-role-badge" data-aos="fade-up" data-aos-delay="300">
            <span class="role-terminal-icon">&gt;_</span>
            <span class="typed-role-text" id="typedText"></span>
            <span class="terminal-cursor"></span>
        </div>
        
        <div class="hero-stats-row" data-aos="fade-up" data-aos-delay="450">
            <div class="hero-stat-box">
                <span class="stat-big-num">16+</span>
                <span class="stat-mini-label">Projects</span>
            </div>
            <div class="hero-stat-sep"></div>
            <div class="hero-stat-box">
                <span class="stat-big-num">12+</span>
                <span class="stat-mini-label">Credentials</span>
            </div>
            <div class="hero-stat-sep"></div>
            <div class="hero-stat-box">
                <span class="stat-big-num">5</span>
                <span class="stat-mini-label">Internships</span>
            </div>
        </div>

        <div class="hero-action-buttons" data-aos="fade-up" data-aos-delay="600">
            <a href="#projects" class="btn-hero-primary">
                <i class="fas fa-rocket"></i> Explore Work
            </a>
            <a href="#contact" class="btn-hero-secondary">
                <i class="fas fa-paper-plane"></i> Let's Connect
            </a>
        </div>
    </div>
</div>
<div id="scroll-indicator" class="scroll-indicator">
    <div class="mouse"><div class="wheel"></div></div>
    <div class="arrows"><span></span><span></span><span></span></div>
</div>`;
    }

    function renderAbout(d) {
        const paragraphs = d.paragraphs.map(p => `<p>${p}</p>`).join('\n');
        const tags = d.tags.map(t => `<span><i class="fas ${t.icon}"></i> ${t.label}</span>`).join('');
        const stats = d.stats.map((s, i) => `
<div class="stat-card" data-aos="zoom-in" data-aos-delay="${i * 100}">
    <div class="stat-icon"><i class="fas ${s.icon}"></i></div>
    <div class="stat-number" data-target="${s.target}">0</div>
    <div class="stat-label">${s.label}</div>
</div>`).join('');

        return `
<div class="container">
    <h2 data-aos="fade-up">About Me</h2>
    <div class="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
    <p class="section-subtitle" data-aos="fade-up" data-aos-delay="150">Passionate about building intelligent systems that shape the future</p>
    <div class="grid" style="align-items: center;">
        <div style="text-align: center;" data-aos="fade-right">
            <div class="profile-wrapper">
                <img src="${d.profileImg}" alt="${d.profileAlt}" class="profile-img"
                     onerror="this.src='https://ui-avatars.com/api/?name=Sudeen+Jain&background=000&color=00f3ff&size=400&bold=true&font-size=0.33'">
            </div>
        </div>
        <div class="about-card" data-aos="fade-left">
            <h3><i class="fas ${d.headingIcon}"></i> ${d.heading}</h3>
            ${paragraphs}
            <div class="about-tags">${tags}</div>
        </div>
    </div>
    <div class="stats-grid">${stats}</div>
</div>`;
    }

    function renderSkills(d) {
        const badges = d.map((s, i) => `<div class="skill-badge" data-aos="zoom-in" data-aos-delay="${i * 50}"><i class="${s.icon}"></i> ${s.label}</div>`).join('');
        return `
<div class="container">
    <h2 data-aos="fade-up">Technical Arsenal</h2>
    <div class="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
    <p class="section-subtitle" data-aos="fade-up" data-aos-delay="150">Tools &amp; technologies I use to bring ideas to life</p>
    <div class="skills-container">${badges}</div>
</div>`;
    }

    function renderCertifications(d) {
        // Build interactive category filter tabs
        const filterTabs = [
            `<button class="bento-filter-tab active" data-filter="all"><i class="fas fa-th-large"></i> All Credentials</button>`
        ];
        
        let allBentoItems = [];
        let totalCount = 0;

        d.gallery.forEach((cat, catIdx) => {
            const catSlug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            filterTabs.push(
                `<button class="bento-filter-tab" data-filter="${catSlug}"><i class="fas ${cat.icon}"></i> ${cat.name} (${cat.items.length})</button>`
            );

            cat.items.forEach((it, itIdx) => {
                totalCount++;
                const isFeatured = itIdx === 0 && catIdx === 0;
                allBentoItems.push(`
<div class="bento-cert-card ${isFeatured ? 'bento-featured-item' : ''}" 
     data-category="${catSlug}" 
     data-aos="fade-up" 
     data-aos-delay="${(itIdx % 4) * 80}"
     onclick="openCertLightbox(this)" 
     data-org="${escapeHTML(it.org || cat.name)}" 
     data-date="${escapeHTML(it.date || '')}" 
     data-id="${escapeHTML(it.id || '')}" 
     data-url="${escapeHTML(it.url || '')}" 
     data-desc="${escapeHTML(it.desc || '')}">
    <div class="bento-card-glow"></div>
    <div class="bento-cert-thumb">
        <img src="${it.img}" alt="${escapeHTML(it.alt)}" loading="lazy">
        <div class="bento-cert-overlay">
            <span class="bento-inspect-btn"><i class="fas fa-search-plus"></i> Inspect</span>
        </div>
    </div>
    <div class="bento-cert-content">
        <div class="bento-cat-tag"><i class="fas ${cat.icon}"></i> ${cat.name}</div>
        <h4 class="bento-cert-title">${escapeHTML(it.title)}</h4>
        <div class="bento-cert-footer">
            <span class="bento-org-tag"><i class="fas fa-building"></i> ${escapeHTML(it.org || 'Verified')}</span>
            <span class="bento-view-link"><i class="fas fa-external-link-alt"></i></span>
        </div>
    </div>
</div>`);
            });
        });

        return `
<div class="container">
    <div class="bento-section-header" data-aos="fade-up">
        <div class="bento-badge-pill"><i class="fas fa-award"></i> Verified Expertise</div>
        <h2>Certificate &amp; Credential Gallery</h2>
        <div class="section-divider"></div>
        <p class="section-subtitle">Comprehensive industry-recognized certifications across AI, Deep Learning, Cloud Systems, and Full-Stack Engineering.</p>
    </div>

    <!-- Category Filter Bar -->
    <div class="bento-filter-bar" data-aos="fade-up" data-aos-delay="100">
        ${filterTabs.join('')}
    </div>

    <!-- High-Tech Bento Grid Container -->
    <div class="bento-cert-grid" id="certBentoGrid">
        ${allBentoItems.join('')}
    </div>

    <div data-aos="fade-up" style="margin-top: 3.5rem; text-align: center;">
        <a class="btn btn-bento" href="${d.footerLinkHref}" target="_blank">
            <i class="fab fa-linkedin"></i> ${d.footerLinkLabel} <i class="fas fa-arrow-right"></i>
        </a>
    </div>
</div>`;
    }

    function renderBadges(d) {
        const items = d.items.map((b, i) => `
<div class="bento-badge-card" data-aos="fade-up" data-aos-delay="${(i % 3) * 100}">
    <div class="bento-badge-ambient-glow"></div>
    <div class="bento-badge-top">
        <div class="badge-image-wrapper">
            <img src="${b.img}" alt="${b.alt}" loading="lazy">
        </div>
        <div class="bento-credly-badge"><i class="fas fa-check-circle"></i> Verified Credly</div>
    </div>
    <div class="bento-badge-body">
        <span class="bento-badge-issuer"><i class="${b.issuerIcon}"></i> ${b.issuer}</span>
        <h3>${b.title}</h3>
        <p class="bento-badge-desc">${b.desc}</p>
        <div class="bento-badge-meta">
            <span><i class="fas fa-calendar-alt"></i> ${b.date}</span>
            <span><i class="${b.expiryIcon}"></i> ${b.expiry}</span>
        </div>
        <div class="bento-badge-skills">
            ${b.skills.map(s => `<span>${s}</span>`).join('')}
        </div>
        <a class="bento-verify-btn" href="${b.linkHref}" target="_blank" rel="noopener noreferrer">
            <span>Verify on Credly</span> <i class="fas fa-external-link-alt"></i>
        </a>
    </div>
</div>`).join('');

        return `
<div class="container">
    <div class="bento-section-header" data-aos="fade-up">
        <div class="bento-badge-pill" style="border-color:rgba(189,0,255,0.4); color:#bd00ff; background:rgba(189,0,255,0.1);">
            <i class="fas fa-shield-alt"></i> Digital Badges
        </div>
        <h2>Credly Digital Credentials</h2>
        <div class="section-divider"></div>
        <p class="section-subtitle">Directly verifiable cryptographic digital badges issued by AWS, Pearson Certiport, and IBM SkillsBuild.</p>
    </div>

    <div class="bento-badges-matrix">${items}</div>

    <div data-aos="fade-up" style="margin-top: 3.5rem; text-align: center;">
        <a class="btn btn-bento" href="${d.footerLinkHref}" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt"></i> ${d.footerLinkLabel} <i class="fas fa-arrow-right"></i>
        </a>
    </div>
</div>`;
    }

    function renderInternships(d) {
        const dirs = ['fade-right', 'fade-left'];
        const cards = d.map((it, i) => `
<div class="internship-card" data-aos="${dirs[i % 2]}" data-aos-delay="${i * 100}">
    <div class="internship-image-wrapper" onclick="openCertLightbox(this)">
        <div class="view-overlay"><i class="fas fa-search-plus"></i><span>View Certificate</span></div>
        <img src="${it.img}" alt="${it.alt}" loading="lazy">
    </div>
    <div class="internship-info">
        <h3>${it.title}</h3>
        <div>
            <span class="internship-org"><i class="fas fa-building"></i> ${it.org}</span>
            <span class="internship-duration"><i class="fas fa-calendar-alt"></i> ${it.duration}</span>
        </div>
        <p class="internship-desc">${it.desc}</p>
        <div class="internship-highlights">${it.highlights.map(h => `<span>${h}</span>`).join('')}</div>
        <span class="internship-status"><i class="fas fa-check-circle"></i> ${it.status}</span>
    </div>
</div>`).join('');

        return `
<div class="container">
    <h2 data-aos="fade-up">Internship Experience</h2>
    <div class="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
    <p class="section-subtitle" data-aos="fade-up" data-aos-delay="150">Hands-on industry training &amp; professional growth</p>
    <div class="internships-timeline">${cards}</div>
</div>`;
    }

    function renderProjects(d) {
        const cards = d.map((p, i) => {
            const links = p.links.map(l =>
                `<a class="project-link" href="${l.href}" target="_blank"><i class="fa${l.isDemo ? 's fa-external-link-alt' : 'b fa-github'}"></i> ${l.label} <i class="fas fa-arrow-right"></i></a>`
            ).join('');
            return `
<div class="project-card" data-aos="fade-up" data-aos-delay="${(i % 3) * 100}">
    <div class="project-card-header">
        <div class="project-icon"><i class="fas ${p.icon}"></i></div>
        <h3>${p.title}</h3>
    </div>
    <p>${p.desc}</p>
    <div class="project-tech">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
    <div class="project-card-footer">${links}</div>
</div>`;
        }).join('');

        return `
<div class="container">
    <h2 data-aos="fade-up">Featured Projects</h2>
    <div class="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
    <p class="section-subtitle" data-aos="fade-up" data-aos-delay="150">Real-world applications I've designed, built, and shipped</p>
    <div class="grid">${cards}</div>
    <div style="text-align: center; margin-top: 3rem;" data-aos="fade-up">
        <a class="btn" href="https://github.com/sudeenjain?tab=repositories" target="_blank"><i class="fab fa-github"></i> View All Repositories</a>
    </div>
</div>`;
    }

    function renderResume() {
        // Points to the auto-generated resume compiled by GitHub Actions.
        // The workflow saves the compiled PDF to resume/resume.pdf.
        const resumePath = 'resume/resume.pdf';

        return `
<div class="container">
    <h2 data-aos="fade-up">Resume</h2>
    <div class="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
    <p class="section-subtitle" data-aos="fade-up" data-aos-delay="150">
        View my latest professional resume or download a copy for offline reference.
    </p>

    <div class="resume-card" data-aos="fade-up" data-aos-delay="200">
        <div class="resume-preview">
            <iframe
                src="${resumePath}#view=FitH"
                title="Sudeen Jain H R Resume"
                loading="lazy">
            </iframe>
        </div>

        <div class="resume-actions">
            <a href="${resumePath}" target="_blank" rel="noopener noreferrer" class="btn">
                <i class="fas fa-eye"></i> View Resume
            </a>
            <a href="${resumePath}" download="Sudeen_Jain_H_R_Resume.pdf" class="btn btn-filled">
                <i class="fas fa-file-download"></i> Download Resume
            </a>
        </div>
    </div>
</div>`;
    }

    function renderDocuments(docs) {
        if (!docs || docs.length === 0) return '';

        const cards = docs.map((doc, idx) => {
            const isPdf = doc.isPdf || (doc.url && doc.url.toLowerCase().endsWith('.pdf'));
            const isImg = doc.isImg || /\.(png|jpe?g|webp|gif|svg)$/i.test(doc.url || '');
            const iconClass = isPdf ? 'fa-file-pdf' : (isImg ? 'fa-file-image' : 'fa-file-alt');
            const badgeText = isPdf ? 'PDF Document' : (isImg ? 'Image' : 'Credential');
            const displayUrl = doc.url || '#';

            return `
        <div class="doc-card" data-name="${escapeHTML(doc.name).toLowerCase()}" data-aos="fade-up" data-aos-delay="${(idx % 4) * 100}">
            <div class="doc-card-header">
                <div class="doc-icon-wrap ${isPdf ? 'pdf-icon' : ''}">
                    <i class="fas ${iconClass}"></i>
                </div>
                <span class="doc-badge">${badgeText}</span>
            </div>
            <div class="doc-card-body">
                <h3 class="doc-title">${escapeHTML(doc.name)}</h3>
            </div>
            <div class="doc-card-actions">
                <a href="${displayUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm" title="View Document">
                    <i class="fas fa-eye"></i> View
                </a>
                <a href="${displayUrl}" download="${escapeHTML(doc.name)}" class="btn btn-filled btn-sm" title="Download Document">
                    <i class="fas fa-file-download"></i> Download
                </a>
            </div>
        </div>`;
        }).join('');

        return `
<div class="container">
    <h2 data-aos="fade-up">Documents &amp; Credentials</h2>
    <div class="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
    <p class="section-subtitle" data-aos="fade-up" data-aos-delay="150">
        Browse and search verified academic documents, certificates, and records.
    </p>

    <div class="doc-search-wrapper" data-aos="fade-up" data-aos-delay="200">
        <div class="doc-search-box">
            <i class="fas fa-search doc-search-icon"></i>
            <input type="text" id="public-doc-search" placeholder="Search documents (e.g. 10th, Marksheet, Certificate, Resume)..." autocomplete="off">
            <button id="public-doc-search-clear" class="doc-search-clear" title="Clear search" style="display:none;">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="doc-count-badge" id="public-doc-count">${docs.length} Documents</div>
    </div>

    <div class="docs-grid" id="public-docs-grid">
        ${cards}
    </div>
    <div id="docs-empty-state" class="docs-empty-state" style="display: none;">
        <i class="fas fa-folder-open"></i>
        <p>No matching documents found.</p>
    </div>
</div>`;
    }

    function renderContact(d) {
        const socials = d.socials.map(s => `<a href="${s.href}" target="_blank" title="${s.title}"><i class="${s.icon}"></i></a>`).join('');
        const cards = d.cards.map(c => `
<div class="contact-card" data-aos="fade-up">
    <i class="${c.icon}"></i>
    <h3>${c.label}</h3>
    <a href="${c.linkHref}" target="_blank">${c.linkText}</a>
</div>`).join('');

        return `
<div class="container">
    <h2 data-aos="fade-up">Connect With Me</h2>
    <div class="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
    <p class="section-subtitle" data-aos="fade-up" data-aos-delay="150">Open to collaborations, opportunities, and interesting conversations</p>
    <div class="socials" data-aos="zoom-in">${socials}</div>
    <div class="contact-grid">${cards}</div>
    <div style="text-align: center; margin-top: 3rem;" data-aos="fade-up">
        <a href="resume/resume.pdf" class="btn btn-filled" download="Sudeen_Jain_H_R_Resume.pdf" style="padding: 15px 40px; font-size: 1.05rem;">
            <i class="fas fa-file-download"></i> ${d.resumeLabel}
        </a>
    </div>
</div>`;
    }

    function renderGetInTouch(d) {
        return `
<div class="container" style="display: flex; flex-direction: column; align-items: center;">
    <h2 data-aos="fade-up">Get in Touch</h2>
    <div class="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
    <p style="text-align: center; max-width: 600px; margin: 0 auto 3rem auto; color: var(--text-muted);" data-aos="fade-up">${d.text}</p>
    <div class="cyber-form-wrapper" data-aos="zoom-in-up">
        <form action="${d.formAction}" method="POST" class="cyber-form">
            <div class="input-group">
                <input type="text" name="name" required>
                <span class="bar"></span>
                <label>Your Name</label>
            </div>
            <div class="input-group">
                <input type="email" name="email" required>
                <span class="bar"></span>
                <label>Your Email</label>
            </div>
            <div class="input-group">
                <textarea name="message" required style="height: 120px; resize: none;"></textarea>
                <span class="bar"></span>
                <label>Your Message</label>
            </div>
            <button type="submit" class="cyber-btn"><i class="fas fa-bolt"></i> Transmit Message</button>
        </form>
    </div>
</div>`;
    }

    /**
     * Renders every section into its container and swaps in the nav.
     * Returns once all synchronous DOM writes are done (no network
     * requests involved — the data is already loaded as a JS object).
     */
    function renderAll(data) {
        const set = (id, html) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = html;
        };

        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) navPlaceholder.outerHTML = renderNav(data.nav);

        set('home', renderHero(data.hero));
        set('about', renderAbout(data.about));
        set('skills', renderSkills(data.skills));
        set('certifications', renderCertifications(data.certifications));
        set('badges', renderBadges(data.badges));
        set('internships', renderInternships(data.internships));
        set('projects', renderProjects(data.projects));
        set('resume', renderResume());
        set('contact', renderContact(data.contact));
        set('get-in-touch', renderGetInTouch(data.getInTouch));
    }

    return { renderAll };
})();
