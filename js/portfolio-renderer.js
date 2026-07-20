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
    <div class="hamburger"><i class="fas fa-bars"></i></div>
    <div class="nav-links">${links}</div>
</nav>`;
    }

    function renderHero(d) {
        const ctas = d.ctas.map(c =>
            `<a href="${c.href}" class="btn${c.icon === 'fa-rocket' ? ' btn-filled' : ''}"><i class="fas ${c.icon}"></i> ${c.label}</a>`
        ).join('\n');

        return `
<div class="container" style="text-align: center;">
    <div class="hero-greeting" data-aos="fade-down">${d.greeting}</div>
    <h1 class="hero-title" data-aos="zoom-in" data-aos-duration="1000">
        <span class="name-text">${d.name}</span>
    </h1>
    <p class="hero-subtitle" data-aos="fade-up" data-aos-delay="200">${d.subtitle}</p>
    <div class="hero-typewriter" data-aos="fade-up" data-aos-delay="400">
        <span class="typed-text" id="typedText"></span>
    </div>
    <div class="hero-cta" data-aos="fade-up" data-aos-delay="600">
        ${ctas}
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
        const gallery = d.gallery.map(cat => {
            const items = cat.items.map(it => `
<div class="cert-gallery-card" onclick="openCertLightbox(this)" 
     data-org="${escapeHTML(it.org)}" 
     data-date="${escapeHTML(it.date)}" 
     data-id="${escapeHTML(it.id)}" 
     data-url="${escapeHTML(it.url)}" 
     data-desc="${escapeHTML(it.desc)}">
    <div class="cert-gallery-thumb">
        <img src="${it.img}" alt="${it.alt}" loading="lazy">
        <div class="view-overlay"><i class="fas fa-search-plus"></i><span>View Details</span></div>
    </div>
    <div class="cert-gallery-info"><h4>${it.title}</h4></div>
</div>`).join('');
            return `
<div class="cert-category" data-aos="fade-up">
    <h4 class="cert-category-title"><i class="fas ${cat.icon}"></i> ${cat.name}</h4>
    <div class="cert-gallery-grid">${items}</div>
</div>`;
        }).join('');

        return `
<div class="container">
    <h2 data-aos="fade-up">Certificate Gallery</h2>
    <div class="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
    <p class="section-subtitle" data-aos="fade-up" data-aos-delay="150" style="margin-bottom: 2rem;">Industry-recognized credentials validating my expertise. Click any certificate to view it full size.</p>
    ${gallery}
    <div data-aos="fade-up" style="margin-top: 3rem; text-align: center;">
        <a class="btn" href="${d.footerLinkHref}" target="_blank"><i class="fab fa-linkedin"></i> ${d.footerLinkLabel}</a>
    </div>
</div>`;
    }

    function renderBadges(d) {
        const items = d.items.map((b, i) => `
<div class="badge-card" data-aos="zoom-in" data-aos-delay="${(i % 3) * 100}">
    <div class="badge-glow"></div>
    <div class="badge-image-wrapper"><img src="${b.img}" alt="${b.alt}" loading="lazy"></div>
    <div class="badge-info">
        <h3>${b.title}</h3>
        <span class="badge-issuer"><i class="${b.issuerIcon}"></i> ${b.issuer}</span>
        <p class="badge-desc">${b.desc}</p>
        <div class="badge-meta">
            <span class="badge-date"><i class="fas fa-calendar-alt"></i> ${b.date}</span>
            <span class="badge-expiry"><i class="${b.expiryIcon}"></i> ${b.expiry}</span>
        </div>
        <div class="badge-skills">${b.skills.map(s => `<span>${s}</span>`).join('')}</div>
        <a class="badge-link" href="${b.linkHref}" target="_blank">Verify on Credly <i class="fas fa-external-link-alt"></i></a>
    </div>
</div>`).join('');

        return `
<div class="container">
    <h2 data-aos="fade-up">Credly Badges</h2>
    <div class="section-divider" data-aos="fade-up" data-aos-delay="100"></div>
    <p class="section-subtitle" data-aos="fade-up" data-aos-delay="150">Verified digital credentials from industry leaders</p>
    <div class="badges-grid">${items}</div>
    <div data-aos="fade-up" style="margin-top: 3rem; text-align: center;">
        <a class="btn" href="${d.footerLinkHref}" target="_blank"><i class="fas fa-award"></i> ${d.footerLinkLabel}</a>
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
