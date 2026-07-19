/**
 * PORTFOLIO DATA SERVICE
 * ----------------------------------------------------------------
 * Handles data fetching from Supabase with robust error handling
 * and fallback to the local static `portfolioData` object.
 * ----------------------------------------------------------------
 */

const PortfolioDataService = (() => {

    const categoryIcons = {
        'AI & Machine Learning': 'fa-brain',
        'Cloud Computing': 'fa-cloud',
        'Web Development & Software': 'fa-code'
    };

    /**
     * Fetches dynamic data from Supabase and maps it to the shape 
     * expected by PortfolioRenderer.
     */
    async function fetchDynamicData() {
        if (!window.supabaseClient) {
            throw new Error("Supabase client is not initialized.");
        }

        const client = window.supabaseClient;

        // Execute all queries in parallel for efficiency
        const [
            skillsRes,
            certsRes,
            badgesRes,
            internshipsRes,
            projectsRes
        ] = await Promise.all([
            client.from('skills').select('*').eq('published', true).order('display_order', { ascending: true }),
            client.from('certificates').select('*').eq('published', true).order('display_order', { ascending: true }),
            client.from('badges').select('*').eq('published', true).order('display_order', { ascending: true }),
            client.from('internships').select('*').eq('published', true).order('display_order', { ascending: true }),
            client.from('projects').select('*').eq('published', true).order('display_order', { ascending: true })
        ]);

        // Validate responses
        if (skillsRes.error) throw skillsRes.error;
        if (certsRes.error) throw certsRes.error;
        if (badgesRes.error) throw badgesRes.error;
        if (internshipsRes.error) throw internshipsRes.error;
        if (projectsRes.error) throw projectsRes.error;

        // Map Skills
        const mappedSkills = skillsRes.data.map(s => ({
            icon: s.icon || 'fas fa-code',
            label: s.name
        }));

        // Map Certificates (Cards + Gallery Categories)
        const certs = certsRes.data;
        const certCards = certs.filter(c => c.featured).map(c => ({
            icon: c.icon || 'fas fa-certificate',
            title: c.title,
            desc: c.description || '',
            linkLabel: c.credential_url ? 'View Certificate' : '',
            linkHref: c.credential_url || '#'
        }));

        // Group certs by Category for Gallery
        const categories = [...new Set(certs.filter(c => c.category && c.image_url).map(c => c.category))];
        const certGallery = categories.map(catName => {
            const items = certs.filter(c => c.category === catName && c.image_url).map(c => ({
                img: c.image_url,
                alt: c.title,
                title: c.title,
                org: c.issuing_organization || '',
                date: c.issue_date || '',
                id: c.credential_id || '',
                url: c.credential_url || '',
                desc: c.description || ''
            }));
            return {
                name: catName,
                icon: categoryIcons[catName] || 'fa-certificate',
                items: items
            };
        });

        // Map Badges
        const mappedBadges = badgesRes.data.map(b => ({
            img: b.image_url,
            alt: b.title,
            title: b.title,
            issuerIcon: b.issuer_icon || 'fas fa-award',
            issuer: b.issuer,
            desc: b.description || '',
            date: b.issue_date || '',
            expiry: b.expiry || 'No Expiration',
            expiryIcon: b.expiry_icon || 'fas fa-infinity',
            skills: b.skills || [],
            linkHref: b.credential_url || '#'
        }));

        // Map Internships
        const mappedInternships = internshipsRes.data.map(it => ({
            img: it.company_logo || '',
            alt: it.role + ' - ' + it.company_name,
            title: it.role,
            org: it.company_name,
            duration: it.duration || (it.start_date + ' – ' + it.end_date),
            desc: it.description || '',
            highlights: it.technologies || it.skills || [],
            status: it.status || 'Completed'
        }));

        // Map Projects
        const mappedProjects = projectsRes.data.map(p => {
            const links = [];
            if (p.github_url) {
                links.push({
                    href: p.github_url,
                    label: 'Source Code',
                    isDemo: false
                });
            }
            if (p.live_demo_url) {
                links.push({
                    href: p.live_demo_url,
                    label: 'Live Demo',
                    isDemo: true
                });
            }
            return {
                icon: p.icon || 'fa-project-diagram',
                title: p.title,
                desc: p.short_description || p.full_description || '',
                tech: p.technologies || [],
                links: links
            };
        });

        return {
            skills: mappedSkills,
            certifications: {
                cards: certCards,
                gallery: certGallery,
                footerLinkHref: "https://www.linkedin.com/in/sudeenjain",
                footerLinkLabel: "View All on LinkedIn"
            },
            badges: {
                items: mappedBadges,
                footerLinkHref: "https://www.credly.com/users/sudeenjain",
                footerLinkLabel: "View All Badges on Credly"
            },
            internships: mappedInternships,
            projects: mappedProjects
        };
    }

    /**
     * Loads portfolio data. Combines static shell configuration fields 
     * (nav, hero, about, contact, getInTouch, meta) from the local `portfolioData` 
     * with dynamic content fields fetched from Supabase.
     */
    async function loadPortfolioData() {
        // Start from static local copy as base
        const data = JSON.parse(JSON.stringify(portfolioData));

        try {
            console.log("Fetching live data from Supabase...");
            const liveData = await fetchDynamicData();

            // Override key dynamically content fields
            data.skills = liveData.skills;
            data.certifications.cards = liveData.certifications.cards;
            data.certifications.gallery = liveData.certifications.gallery;
            data.badges.items = liveData.badges.items;
            data.internships = liveData.internships;
            data.projects = liveData.projects;

            console.log("Successfully loaded live data from Supabase DB.");
            return data;
        } catch (error) {
            console.error("Supabase load failed. Falling back to local static portfolio data.", error);
            // Return base static configuration
            return portfolioData;
        }
    }

    return {
        loadPortfolioData
    };
})();
