/**
 * PORTFOLIO ADMIN CONTROLLER
 * Handles navigation, session management, file uploads, and CRUD for portfolio data.
 */

let activeSection = localStorage.getItem('adminActiveSection') || 'dashboard';
let isRestoringForm = false;
let deleteTarget = { table: null, id: null };
let cacheData = {
    certificates: [],
    badges: [],
    internships: [],
    projects: [],
    achievements: [],
    skills: []
};

// -------------------------------------------------------------
// 1. INITIALIZATION & SESSION GUARD
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    setupNavigation();
    setupSearchFilters();
    setupFormListeners();
    setupLogout();
});

async function initializeAuth() {
    if (!window.supabaseClient) {
        setTimeout(initializeAuth, 100);
        return;
    }

    const { data: { session }, error } = await window.supabaseClient.auth.getSession();

    if (error || !session) {
        window.location.href = 'index.html';
        return;
    }

    // Set auth change hook
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
            window.location.href = 'index.html';
        }
    });

    // Initial loads
    switchSection(activeSection);
}

// -------------------------------------------------------------
// 2. DASHBOARD NAVIGATION & UI
// -------------------------------------------------------------
function setupNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-menu .sidebar-item');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');

    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            if (!target) return;

            // Handle mobile sidebar auto-closing
            sidebar.classList.remove('active');

            // Switch active menu item
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            switchSection(target);
        });
    });

    // Hamburger toggle for mobile responsive views
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Modal close binds
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                if (openModal.id === 'modal-lightbox') {
                    closeLightbox();
                } else {
                    const parts = openModal.id.split('-');
                    if (parts[1]) closeModal(parts[1]);
                }
            }
            closeDeleteModal();
        }
    });
}

function switchSection(target) {
    activeSection = target;
    localStorage.setItem('adminActiveSection', target);

    // Set headers
    const titleHeader = document.getElementById('pageTitle');
    titleHeader.textContent = `${target.toUpperCase()} CONTROL MODULE`;

    // Toggle active sections showing
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(sec => {
        sec.classList.remove('active');
    });

    const activeSec = document.getElementById(`section-${target}`);
    if (activeSec) {
        activeSec.classList.add('active');
    }

    // Toggle active sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-menu .sidebar-item');
    sidebarItems.forEach(item => {
        if (item.getAttribute('data-target') === target) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (target === 'dashboard') {
        refreshDashboard();
    } else {
        loadSectionData(target);
    }
}

async function refreshDashboard() {
    try {
        await loadDashboardCounts();
    } catch (e) {
        showToast("Error updating dashboard counters", "danger");
    }
}

async function loadDashboardCounts() {
    const counts = {
        certs: 0,
        badges: 0,
        internships: 0,
        projects: 0,
        achievements: 0,
        skills: 0
    };

    if (!window.supabaseClient) return;

    // Use single RPC or parallel counts queries
    const tables = [
        { table: 'certificates', key: 'certs' },
        { table: 'badges', key: 'badges' },
        { table: 'internships', key: 'internships' },
        { table: 'projects', key: 'projects' },
        { table: 'achievements', key: 'achievements' },
        { table: 'skills', key: 'skills' }
    ];

    await Promise.all(tables.map(async item => {
        const { count, error } = await window.supabaseClient
            .from(item.table)
            .select('*', { count: 'exact', head: true });

        if (!error && count !== null) {
            counts[item.key] = count;
        }
    }));

    // Inject metrics
    document.getElementById('count-certs').textContent = counts.certs;
    document.getElementById('count-badges').textContent = counts.badges;
    document.getElementById('count-internships').textContent = counts.internships;
    document.getElementById('count-projects').textContent = counts.projects;
    document.getElementById('count-achievements').textContent = counts.achievements;
    document.getElementById('count-skills').textContent = counts.skills;
}

// -------------------------------------------------------------
// MEDIA URL RESOLUTION & LIGHTBOX SYSTEM
// -------------------------------------------------------------
function resolveMediaUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    if (url.startsWith('assets/')) {
        return '../' + url;
    }
    if (url.startsWith('/assets/')) {
        return '..' + url;
    }
    return url;
}

function openImageLightbox(url, caption = 'Image Preview') {
    const modal = document.getElementById('modal-lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    if (!modal || !img) return;

    img.src = url;
    if (cap) cap.textContent = caption;
    modal.classList.add('active');
}

function closeLightbox() {
    const modal = document.getElementById('modal-lightbox');
    const img = document.getElementById('lightbox-img');
    if (!modal) return;

    modal.classList.remove('active');
    setTimeout(() => {
        if (img) img.src = '';
    }, 200);
}

// -------------------------------------------------------------

// 3. TOAST MESSAGES
// -------------------------------------------------------------
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-check-circle';
    if (type === 'danger') iconClass = 'fa-exclamation-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';
    if (type === 'info') iconClass = 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;

    container.appendChild(toast);

    // Auto remove toast
    setTimeout(() => {
        toast.style.animation = 'none';
        toast.offsetHeight; // reflow
        toast.style.animation = 'toastSlideIn 0.3s reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// -------------------------------------------------------------
// 4. STORAGE / FILE UPLOADS
// -------------------------------------------------------------
async function handleFileSelect(inputElement, previewBoxId, pathHiddenId) {
    const file = inputElement.files[0];
    if (!file) return;

    const previewBox = document.getElementById(previewBoxId);
    const progressWrapper = document.getElementById(inputElement.id.replace('-file', '-progress'));
    const submitBtn = document.querySelector(`#form-${activeSection} button[type="submit"]`);

    if (progressWrapper) progressWrapper.style.display = 'block';
    if (submitBtn) submitBtn.disabled = true;

    try {
        // Upload to folder inside 'portfolio-assets' based on current active section (e.g. 'certificates')
        const folder = activeSection;
        const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const finalPath = `${folder}/${cleanName}`;

        const { data, error } = await window.supabaseClient.storage
            .from('portfolio-assets')
            .upload(finalPath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) throw error;

        // Retrieve public URL
        const { data: publicUrlData } = window.supabaseClient.storage
            .from('portfolio-assets')
            .getPublicUrl(finalPath);

        const fullPublicUrl = publicUrlData.publicUrl;

        // Set value to hidden path input
        const pathHidden = document.getElementById(pathHiddenId);
        if (pathHidden) {
            pathHidden.value = fullPublicUrl;
            pathHidden.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Update preview state
        if (previewBox) {
            const thumb = previewBox.querySelector('.preview-thumb');
            const details = previewBox.querySelector('.preview-details');

            if (thumb && file.type.startsWith('image/')) {
                thumb.src = resolveMediaUrl(fullPublicUrl);
                thumb.style.display = 'block';
                thumb.setAttribute('onclick', `openImageLightbox('${resolveMediaUrl(fullPublicUrl)}', 'Uploaded Preview')`);
                thumb.style.cursor = 'zoom-in';
            } else if (thumb) {
                thumb.style.display = 'none';
            }

            if (details) {
                details.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            }

            previewBox.style.display = 'flex';
        }

        showToast("File uploaded successfully", "success");

    } catch (err) {
        showToast(`Upload failed: ${err.message}`, "danger");
        clearFileSelection(inputElement.id, previewBoxId, pathHiddenId);
    } finally {
        if (progressWrapper) progressWrapper.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }
}

function clearFileSelection(fileInputId, previewBoxId, pathHiddenId) {
    const fileInput = document.getElementById(fileInputId);
    const previewBox = document.getElementById(previewBoxId);
    const pathHidden = document.getElementById(pathHiddenId);

    if (fileInput) fileInput.value = '';
    if (pathHidden) {
        pathHidden.value = '';
        pathHidden.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (previewBox) {
        previewBox.style.display = 'none';
        const thumb = previewBox.querySelector('.preview-thumb');
        if (thumb) thumb.src = '';
    }
}

/**
 * Populate preview when loading existing records in edit mode
 */
function setExistingFilePreview(previewBoxId, pathHiddenId, fileUrl) {
    const previewBox = document.getElementById(previewBoxId);
    const pathHidden = document.getElementById(pathHiddenId);
    if (!previewBox || !pathHidden) return;

    pathHidden.value = fileUrl || '';
    if (!fileUrl) {
        previewBox.style.display = 'none';
        return;
    }

    const thumb = previewBox.querySelector('.preview-thumb');
    const details = previewBox.querySelector('.preview-details');

    if (thumb) {
        const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
        if (isPdf) {
            thumb.style.display = 'none';
        } else {
            const resolved = resolveMediaUrl(fileUrl);
            thumb.src = resolved;
            thumb.style.display = 'block';
            thumb.setAttribute('onclick', `openImageLightbox('${resolved}', 'Record Image Preview')`);
            thumb.style.cursor = 'zoom-in';
        }
    }

    if (details) {
        const parts = fileUrl.split('/');
        details.textContent = parts[parts.length - 1] || 'Attached resource';
    }

    previewBox.style.display = 'flex';
}

// -------------------------------------------------------------
// 5. QUERY / LOAD FROM DB
// -------------------------------------------------------------
async function loadSectionData(table) {
    const tableBody = document.getElementById(`${table}-table-body`);
    if (!tableBody) return;

    tableBody.innerHTML = `
        <tr>
            <td colspan="10" style="text-align:center; padding:30px; color:var(--primary);">
                <i class="fas fa-circle-notch fa-spin"></i> Synchronizing cloud buffers...
            </td>
        </tr>
    `;

    try {
        let query = window.supabaseClient.from(table).select('*');

        // Sorting precedence: display_order ASC, then created_at DESC
        if (table === 'skills') {
            query = query.order('display_order', { ascending: true }).order('name', { ascending: true });
        } else {
            query = query.order('display_order', { ascending: true }).order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;

        cacheData[table] = data || [];
        renderTableRows(table, cacheData[table]);

    } catch (err) {
        showToast(`Failed to fetch records: ${err.message}`, "danger");
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-state" style="color:var(--danger)">
                    <i class="fas fa-exclamation-triangle"></i> Data sync failure
                </td>
            </tr>
        `;
    }
}

// -------------------------------------------------------------
// 6. DYNAMIC UI RENDERERS
// -------------------------------------------------------------
function renderTableRows(table, data) {
    const tableBody = document.getElementById(`${table}-table-body`);
    if (!tableBody) return;

    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No records found. Control systems empty.</p>
                </td>
            </tr>
        `;
        return;
    }

    let rowsHTML = '';

    if (table === 'certificates') {
        data.forEach(item => {
            const hasImg = item.image_url ? `<img src="${resolveMediaUrl(item.image_url)}" class="row-thumb" alt="cert" onclick="openImageLightbox('${resolveMediaUrl(item.image_url)}', '${escapeHTML(item.title)}')">` : `<i class="fas fa-certificate row-icon"></i>`;
            const pubBadge = item.published ? `<span class="badge badge-published">Published</span>` : `<span class="badge badge-unpublished">Draft</span>`;
            const featBadge = item.featured ? `<span class="badge badge-featured">Featured</span>` : ``;
            rowsHTML += `
                <tr>
                    <td>${hasImg}</td>
                    <td><strong style="color:white;">${escapeHTML(item.title)}</strong></td>
                    <td>${escapeHTML(item.issuing_organization)}</td>
                    <td><span style="color:var(--primary); font-size:0.8rem;">${escapeHTML(item.category || '')}</span></td>
                    <td>${pubBadge}</td>
                    <td>${featBadge}</td>
                    <td class="actions-cell">
                        <button class="btn-icon edit" onclick="editRecord('certificates', '${item.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" onclick="triggerDelete('certificates', '${item.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    else if (table === 'badges') {
        data.forEach(item => {
            const hasImg = item.image_url ? `<img src="${resolveMediaUrl(item.image_url)}" class="row-thumb" alt="badge" onclick="openImageLightbox('${resolveMediaUrl(item.image_url)}', '${escapeHTML(item.title)}')">` : `<i class="fas fa-award row-icon"></i>`;
            const pubBadge = item.published ? `<span class="badge badge-published">Published</span>` : `<span class="badge badge-unpublished">Draft</span>`;
            const pSkills = (item.skills || []).map(s => `<span class="skill-pill">${escapeHTML(s)}</span>`).join('');
            rowsHTML += `
                <tr>
                    <td>${hasImg}</td>
                    <td><strong style="color:white;">${escapeHTML(item.title)}</strong></td>
                    <td>${escapeHTML(item.issuer)}</td>
                    <td><div class="skills-pill-group">${pSkills}</div></td>
                    <td>${pubBadge}</td>
                    <td class="actions-cell">
                        <button class="btn-icon edit" onclick="editRecord('badges', '${item.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" onclick="triggerDelete('badges', '${item.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    else if (table === 'internships') {
        data.forEach(item => {
            const hasLogo = item.company_logo ? `<img src="${resolveMediaUrl(item.company_logo)}" class="row-thumb" alt="logo" onclick="openImageLightbox('${resolveMediaUrl(item.company_logo)}', '${escapeHTML(item.company_name)}')">` : `<i class="fas fa-briefcase row-icon"></i>`;
            const pubBadge = item.published ? `<span class="badge badge-published">Published</span>` : `<span class="badge badge-unpublished">Draft</span>`;
            const pTechs = (item.technologies || []).map(t => `<span class="skill-pill">${escapeHTML(t)}</span>`).join('');
            rowsHTML += `
                <tr>
                    <td>${hasLogo}</td>
                    <td><strong style="color:white;">${escapeHTML(item.role)}</strong></td>
                    <td>${escapeHTML(item.company_name)}</td>
                    <td>${escapeHTML(item.start_date)} - ${escapeHTML(item.end_date || 'Present')}</td>
                    <td><div class="skills-pill-group">${pTechs}</div></td>
                    <td>${pubBadge}</td>
                    <td class="actions-cell">
                        <button class="btn-icon edit" onclick="editRecord('internships', '${item.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" onclick="triggerDelete('internships', '${item.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    else if (table === 'projects') {
        data.forEach(item => {
            const pubBadge = item.published ? `<span class="badge badge-published">Published</span>` : `<span class="badge badge-unpublished">Draft</span>`;
            const featBadge = item.featured ? `<span class="badge badge-featured">Featured</span>` : ``;
            const pTechs = (item.technologies || []).map(t => `<span class="skill-pill">${escapeHTML(t)}</span>`).join('');
            rowsHTML += `
                <tr>
                    <td><strong style="color:white;">${escapeHTML(item.title)}</strong></td>
                    <td style="color:var(--text-muted); font-size:0.8rem; max-width: 200px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${escapeHTML(item.short_description || '')}</td>
                    <td><div class="skills-pill-group">${pTechs}</div></td>
                    <td>${item.display_order}</td>
                    <td>${pubBadge}</td>
                    <td>${featBadge}</td>
                    <td class="actions-cell">
                        <button class="btn-icon edit" onclick="editRecord('projects', '${item.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" onclick="triggerDelete('projects', '${item.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    else if (table === 'achievements') {
        data.forEach(item => {
            const hasImg = item.image_url ? `<img src="${resolveMediaUrl(item.image_url)}" class="row-thumb" alt="ach" onclick="openImageLightbox('${resolveMediaUrl(item.image_url)}', '${escapeHTML(item.title)}')">` : `<i class="fas fa-trophy row-icon"></i>`;
            const pubBadge = item.published ? `<span class="badge badge-published">Published</span>` : `<span class="badge badge-unpublished">Draft</span>`;
            rowsHTML += `
                <tr>
                    <td>${hasImg}</td>
                    <td><strong style="color:white;">${escapeHTML(item.title)}</strong></td>
                    <td>${escapeHTML(item.organization || '')}</td>
                    <td>${escapeHTML(item.date || '')}</td>
                    <td>${pubBadge}</td>
                    <td class="actions-cell">
                        <button class="btn-icon edit" onclick="editRecord('achievements', '${item.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" onclick="triggerDelete('achievements', '${item.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    else if (table === 'skills') {
        data.forEach(item => {
            const hasIcon = item.icon ? `<i class="${item.icon} row-icon"></i>` : `<i class="fas fa-code row-icon"></i>`;
            const pubBadge = item.published ? `<span class="badge badge-published">Published</span>` : `<span class="badge badge-unpublished">Draft</span>`;
            rowsHTML += `
                <tr>
                    <td>${hasIcon}</td>
                    <td><strong style="color:white;">${escapeHTML(item.name)}</strong></td>
                    <td>${escapeHTML(item.category || '')}</td>
                    <td><div style="background:#222; border-radius:10px; height:6px; width:70px; overflow:hidden;"><div style="background:var(--primary); height:100%; width:${item.proficiency}%"></div></div> ${item.proficiency}%</td>
                    <td>${item.display_order}</td>
                    <td>${pubBadge}</td>
                    <td class="actions-cell">
                        <button class="btn-icon edit" onclick="editRecord('skills', '${item.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" onclick="triggerDelete('skills', '${item.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    tableBody.innerHTML = rowsHTML;
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// -------------------------------------------------------------
// 7. SEARCH & FILTERS
// -------------------------------------------------------------
function setupSearchFilters() {
    const list = [
        { id: 'certs-search', table: 'certificates', fields: ['title', 'issuing_organization', 'category'] },
        { id: 'badges-search', table: 'badges', fields: ['title', 'issuer'] },
        { id: 'internships-search', table: 'internships', fields: ['role', 'company_name', 'description'] },
        { id: 'projects-search', table: 'projects', fields: ['title', 'short_description', 'full_description'] },
        { id: 'achievements-search', table: 'achievements', fields: ['title', 'organization', 'description'] },
        { id: 'skills-search', table: 'skills', fields: ['name', 'category'] }
    ];

    list.forEach(item => {
        const input = document.getElementById(item.id);
        if (!input) return;

        input.addEventListener('input', () => {
            const query = input.value.toLowerCase().trim();
            const source = cacheData[item.table] || [];

            if (!query) {
                renderTableRows(item.table, source);
                return;
            }

            const filtered = source.filter(row => {
                return item.fields.some(f => {
                    const val = row[f];
                    if (Array.isArray(val)) {
                        return val.some(valItem => String(valItem).toLowerCase().includes(query));
                    }
                    return val && String(val).toLowerCase().includes(query);
                });
            });

            renderTableRows(item.table, filtered);
        });
    });
}

// -------------------------------------------------------------
// 8. ADD & EDIT TRIGGER INSTRUCTIONS
// -------------------------------------------------------------
function openAddModal(table) {
    const modal = document.getElementById(`modal-${table}`);
    if (!modal) return;

    isRestoringForm = true;
    try {
        // Reset target form
        const form = document.getElementById(`form-${table}`);
        if (form) form.reset();

        // Clear previews & hidden paths
        if (table === 'certificates') {
            clearFileSelection('cert-img-file', 'cert-img-preview', 'cert-img-path');
            clearFileSelection('cert-pdf-file', 'cert-pdf-preview', 'cert-pdf-path');
            document.getElementById('cert-id').value = '';
        } else if (table === 'badges') {
            clearFileSelection('badge-img-file', 'badge-img-preview', 'badge-img-path');
            document.getElementById('badge-id').value = '';
        } else if (table === 'internships') {
            clearFileSelection('intern-logo-file', 'intern-logo-preview', 'intern-logo-path');
            clearFileSelection('intern-cert-file', 'intern-cert-preview', 'intern-cert-path');
            clearFileSelection('intern-pdf-file', 'intern-pdf-preview', 'intern-pdf-path');
            document.getElementById('internship-id').value = '';
        } else if (table === 'projects') {
            clearFileSelection('project-img-file', 'project-img-preview', 'project-img-path');
            document.getElementById('project-id').value = '';
        } else if (table === 'achievements') {
            clearFileSelection('ach-img-file', 'ach-img-preview', 'ach-img-path');
            document.getElementById('achievement-id').value = '';
        } else if (table === 'skills') {
            document.getElementById('skill-id').value = '';
        }

        // Restore draft if any exists (for new record creation, id is empty)
        restoreFormDraft(table, '');
    } finally {
        isRestoringForm = false;
    }

    document.getElementById(`modal-title-${table}`).textContent = `Add New ${table.slice(0, -1)}`;
    modal.classList.add('active');
}

function closeModal(table) {
    const modal = document.getElementById(`modal-${table}`);
    if (modal) modal.classList.remove('active');
}

function editRecord(table, id) {
    const item = cacheData[table].find(x => x.id === id);
    if (!item) return;

    const modal = document.getElementById(`modal-${table}`);
    if (!modal) return;

    isRestoringForm = true;
    try {
        document.getElementById(`modal-title-${table}`).textContent = `Edit ${table.slice(0, -1)}`;

        if (table === 'certificates') {
            document.getElementById('cert-id').value = item.id;
            document.getElementById('cert-title').value = item.title || '';
            document.getElementById('cert-org').value = item.issuing_organization || '';
            document.getElementById('cert-issue-date').value = item.issue_date || '';
            document.getElementById('cert-expiry-date').value = item.expiry_date || '';
            document.getElementById('cert-cred-id').value = item.credential_id || '';
            document.getElementById('cert-cred-url').value = item.credential_url || '';
            document.getElementById('cert-cat').value = item.category || 'AI & Machine Learning';
            document.getElementById('cert-icon-class').value = item.icon || '';
            document.getElementById('cert-skills').value = (item.skills || []).join(', ');
            document.getElementById('cert-desc').value = item.description || '';
            document.getElementById('cert-published').checked = !!item.published;
            document.getElementById('cert-featured').checked = !!item.featured;

            setExistingFilePreview('cert-img-preview', 'cert-img-path', item.image_url);
            setExistingFilePreview('cert-pdf-preview', 'cert-pdf-path', item.pdf_url);
        }

        else if (table === 'badges') {
            document.getElementById('badge-id').value = item.id;
            document.getElementById('badge-title').value = item.title || '';
            document.getElementById('badge-issuer').value = item.issuer || '';
            document.getElementById('badge-issue-date').value = item.issue_date || '';
            document.getElementById('badge-issuer-icon').value = item.issuer_icon || '';
            document.getElementById('badge-expiry').value = item.expiry || '';
            document.getElementById('badge-expiry-icon').value = item.expiry_icon || 'fas fa-infinity';
            document.getElementById('badge-cred-id').value = item.credential_id || '';
            document.getElementById('badge-cred-url').value = item.credential_url || '';
            document.getElementById('badge-skills').value = (item.skills || []).join(', ');
            document.getElementById('badge-desc').value = item.description || '';
            document.getElementById('badge-published').checked = !!item.published;

            setExistingFilePreview('badge-img-preview', 'badge-img-path', item.image_url);
        }

        else if (table === 'internships') {
            document.getElementById('internship-id').value = item.id;
            document.getElementById('intern-role').value = item.role || '';
            document.getElementById('intern-company').value = item.company_name || '';
            document.getElementById('intern-start-date').value = item.start_date || '';
            document.getElementById('intern-end-date').value = item.end_date || '';
            document.getElementById('intern-duration').value = item.duration || '';
            document.getElementById('intern-status').value = item.status || 'Completed';
            document.getElementById('intern-tech').value = (item.technologies || []).join(', ');
            document.getElementById('intern-desc').value = item.description || '';
            document.getElementById('intern-verify-url').value = item.verification_url || '';
            document.getElementById('intern-published').checked = !!item.published;

            setExistingFilePreview('intern-logo-preview', 'intern-logo-path', item.company_logo);
            setExistingFilePreview('intern-cert-preview', 'intern-cert-path', item.certificate_image);
            setExistingFilePreview('intern-pdf-preview', 'intern-pdf-path', item.certificate_pdf);
        }

        else if (table === 'projects') {
            document.getElementById('project-id').value = item.id;
            document.getElementById('project-title').value = item.title || '';
            document.getElementById('project-icon').value = item.icon || '';
            document.getElementById('project-github').value = item.github_url || '';
            document.getElementById('project-demo').value = item.live_demo_url || '';
            document.getElementById('project-start-date').value = item.start_date || '';
            document.getElementById('project-end-date').value = item.completion_date || '';
            document.getElementById('project-tech').value = (item.technologies || []).join(', ');
            document.getElementById('project-order').value = item.display_order || 0;
            document.getElementById('project-short-desc').value = item.short_description || '';
            document.getElementById('project-full-desc').value = item.full_description || '';
            document.getElementById('project-published').checked = !!item.published;
            document.getElementById('project-featured').checked = !!item.featured;

            setExistingFilePreview('project-img-preview', 'project-img-path', item.project_image);
        }

        else if (table === 'achievements') {
            document.getElementById('achievement-id').value = item.id;
            document.getElementById('ach-title').value = item.title || '';
            document.getElementById('ach-org').value = item.organization || '';
            document.getElementById('ach-date').value = item.date || '';
            document.getElementById('ach-verify-url').value = item.verification_url || '';
            document.getElementById('ach-desc').value = item.description || '';
            document.getElementById('ach-published').checked = !!item.published;

            setExistingFilePreview('ach-img-preview', 'ach-img-path', item.image_url);
        }

        else if (table === 'skills') {
            document.getElementById('skill-id').value = item.id;
            document.getElementById('skill-name').value = item.name || '';
            document.getElementById('skill-cat').value = item.category || '';
            document.getElementById('skill-icon').value = item.icon || '';
            document.getElementById('skill-prof').value = item.proficiency || 90;
            document.getElementById('skill-order').value = item.display_order || 0;
            document.getElementById('skill-published').checked = !!item.published;
        }

        // Check for draft edit record state
        restoreFormDraft(table, id);
    } finally {
        isRestoringForm = false;
    }

    modal.classList.add('active');
}

// -------------------------------------------------------------
// 9. FORM SUBMIT BINDINGS (INSERT / UPSERT)
// -------------------------------------------------------------
function setupFormListeners() {
    const list = ['certificates', 'badges', 'internships', 'projects', 'achievements', 'skills'];

    list.forEach(table => {
        const form = document.getElementById(`form-${table}`);
        if (!form) return;

        // Auto-save form draft on user inputs & metadata state alterations
        form.addEventListener('input', () => saveFormDraft(table, form));
        form.addEventListener('change', () => saveFormDraft(table, form));

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Writing...`;

            try {
                let payload = {};
                let id = null;

                if (table === 'certificates') {
                    id = document.getElementById('cert-id').value;
                    payload = {
                        title: document.getElementById('cert-title').value.trim(),
                        issuing_organization: document.getElementById('cert-org').value.trim(),
                        issue_date: document.getElementById('cert-issue-date').value.trim() || null,
                        expiry_date: document.getElementById('cert-expiry-date').value.trim() || null,
                        credential_id: document.getElementById('cert-cred-id').value.trim() || null,
                        credential_url: document.getElementById('cert-cred-url').value.trim() || null,
                        category: document.getElementById('cert-cat').value,
                        icon: document.getElementById('cert-icon-class').value.trim() || null,
                        description: document.getElementById('cert-desc').value.trim() || null,
                        image_url: document.getElementById('cert-img-path').value || null,
                        pdf_url: document.getElementById('cert-pdf-path').value || null,
                        published: document.getElementById('cert-published').checked,
                        featured: document.getElementById('cert-featured').checked,
                        skills: document.getElementById('cert-skills').value.split(',').map(s => s.trim()).filter(Boolean)
                    };
                }

                else if (table === 'badges') {
                    id = document.getElementById('badge-id').value;
                    payload = {
                        title: document.getElementById('badge-title').value.trim(),
                        issuer: document.getElementById('badge-issuer').value.trim(),
                        issue_date: document.getElementById('badge-issue-date').value.trim() || null,
                        issuer_icon: document.getElementById('badge-issuer-icon').value.trim() || null,
                        expiry: document.getElementById('badge-expiry').value.trim() || null,
                        expiry_icon: document.getElementById('badge-expiry-icon').value.trim() || 'fas fa-infinity',
                        credential_id: document.getElementById('badge-cred-id').value.trim() || null,
                        credential_url: document.getElementById('badge-cred-url').value.trim() || null,
                        description: document.getElementById('badge-desc').value.trim() || null,
                        image_url: document.getElementById('badge-img-path').value || null,
                        published: document.getElementById('badge-published').checked,
                        skills: document.getElementById('badge-skills').value.split(',').map(s => s.trim()).filter(Boolean)
                    };
                }

                else if (table === 'internships') {
                    id = document.getElementById('internship-id').value;
                    payload = {
                        role: document.getElementById('intern-role').value.trim(),
                        company_name: document.getElementById('intern-company').value.trim(),
                        start_date: document.getElementById('intern-start-date').value.trim() || null,
                        end_date: document.getElementById('intern-end-date').value.trim() || null,
                        duration: document.getElementById('intern-duration').value.trim() || null,
                        status: document.getElementById('intern-status').value.trim() || 'Completed',
                        description: document.getElementById('intern-desc').value.trim() || null,
                        verification_url: document.getElementById('intern-verify-url').value.trim() || null,
                        company_logo: document.getElementById('intern-logo-path').value || null,
                        certificate_image: document.getElementById('intern-cert-path').value || null,
                        certificate_pdf: document.getElementById('intern-pdf-path').value || null,
                        published: document.getElementById('intern-published').checked,
                        technologies: document.getElementById('intern-tech').value.split(',').map(s => s.trim()).filter(Boolean),
                        skills: document.getElementById('intern-tech').value.split(',').map(s => s.trim()).filter(Boolean)
                    };
                }

                else if (table === 'projects') {
                    id = document.getElementById('project-id').value;
                    payload = {
                        title: document.getElementById('project-title').value.trim(),
                        icon: document.getElementById('project-icon').value.trim() || null,
                        github_url: document.getElementById('project-github').value.trim() || null,
                        live_demo_url: document.getElementById('project-demo').value.trim() || null,
                        start_date: document.getElementById('project-start-date').value.trim() || null,
                        completion_date: document.getElementById('project-end-date').value.trim() || null,
                        display_order: parseInt(document.getElementById('project-order').value) || 0,
                        short_description: document.getElementById('project-short-desc').value.trim() || null,
                        full_description: document.getElementById('project-full-desc').value.trim() || null,
                        project_image: document.getElementById('project-img-path').value || null,
                        published: document.getElementById('project-published').checked,
                        featured: document.getElementById('project-featured').checked,
                        technologies: document.getElementById('project-tech').value.split(',').map(s => s.trim()).filter(Boolean),
                        skills: document.getElementById('project-tech').value.split(',').map(s => s.trim()).filter(Boolean)
                    };
                }

                else if (table === 'achievements') {
                    id = document.getElementById('achievement-id').value;
                    payload = {
                        title: document.getElementById('ach-title').value.trim(),
                        organization: document.getElementById('ach-org').value.trim() || null,
                        date: document.getElementById('ach-date').value.trim() || null,
                        verification_url: document.getElementById('ach-verify-url').value.trim() || null,
                        description: document.getElementById('ach-desc').value.trim() || null,
                        image_url: document.getElementById('ach-img-path').value || null,
                        published: document.getElementById('ach-published').checked
                    };
                }

                else if (table === 'skills') {
                    id = document.getElementById('skill-id').value;
                    payload = {
                        name: document.getElementById('skill-name').value.trim(),
                        category: document.getElementById('skill-cat').value.trim() || null,
                        icon: document.getElementById('skill-icon').value.trim() || null,
                        proficiency: parseInt(document.getElementById('skill-prof').value) || 90,
                        display_order: parseInt(document.getElementById('skill-order').value) || 0,
                        published: document.getElementById('skill-published').checked
                    };
                }

                let resultError = null;

                if (id) {
                    // Update
                    const { error } = await window.supabaseClient
                        .from(table)
                        .update(payload)
                        .eq('id', id);
                    resultError = error;
                } else {
                    // Insert
                    const { error } = await window.supabaseClient
                        .from(table)
                        .insert([payload]);
                    resultError = error;
                }

                if (resultError) throw resultError;

                showToast(`Record ${id ? 'updated' : 'inserted'} successfully`, "success");
                closeModal(table);
                clearFormDraft(table);
                loadSectionData(table);
                refreshDashboard();

            } catch (err) {
                showToast(`Write failed: ${err.message}`, "danger");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Save Changes`;
            }
        });
    });
}

// -------------------------------------------------------------
// 10. REMOVAL BIN (DELETE ACTIONS)
// -------------------------------------------------------------
function triggerDelete(table, id) {
    deleteTarget.table = table;
    deleteTarget.id = id;

    const modal = document.getElementById('modal-delete');
    if (modal) {
        modal.classList.add('active');

        // Setup confirm click handler once
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.onclick = async () => {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Purging...`;

            try {
                const { error } = await window.supabaseClient
                    .from(deleteTarget.table)
                    .delete()
                    .eq('id', deleteTarget.id);

                if (error) throw error;

                showToast("Record deleted successfully", "warning");
                closeDeleteModal();
                loadSectionData(deleteTarget.table);
                refreshDashboard();
            } catch (err) {
                showToast(`Delete failed: ${err.message}`, "danger");
            } finally {
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = `<i class="fas fa-trash"></i> Delete Record`;
            }
        };
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('modal-delete');
    if (modal) modal.classList.remove('active');
    deleteTarget = { table: null, id: null };
}

// -------------------------------------------------------------
// 11. AUTHENTICATED SIGNOUT
// -------------------------------------------------------------
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!window.supabaseClient) return;

            try {
                // Clear active section and any form drafts from localStorage
                localStorage.removeItem('adminActiveSection');
                const list = ['certificates', 'badges', 'internships', 'projects', 'achievements', 'skills'];
                list.forEach(table => localStorage.removeItem(`draft_${table}`));

                const { error } = await window.supabaseClient.auth.signOut();
                if (error) throw error;
                window.location.href = 'index.html';
            } catch (err) {
                showToast(`Logout error: ${err.message}`, "danger");
            }
        });
    }
}

// -------------------------------------------------------------
// 12. AUTOSAVE / DRAFT SYSTEM
// -------------------------------------------------------------

function saveFormDraft(table, form) {
    if (!form || isRestoringForm) return;

    // Get the editing ID
    let editingId = '';
    const idFields = [`${table.slice(0, -1)}-id`, `${table}-id`, 'internship-id', 'achievement-id'];
    for (const fieldId of idFields) {
        const input = form.querySelector(`#${fieldId}`);
        if (input) {
            editingId = input.value || '';
            break;
        }
    }

    const values = {};
    const elements = form.querySelectorAll('input, textarea, select');
    elements.forEach(el => {
        // Skip file type inputs but NOT hidden path inputs
        if (el.type === 'file' || !el.id) return;

        if (el.type === 'checkbox') {
            values[el.id] = el.checked;
        } else {
            values[el.id] = el.value;
        }
    });

    const draft = {
        editingId: editingId,
        timestamp: Date.now(),
        values: values
    };

    localStorage.setItem(`draft_${table}`, JSON.stringify(draft));
}

function restoreFormDraft(table, currentEditingId = '') {
    const draftStr = localStorage.getItem(`draft_${table}`);
    if (!draftStr) return false;

    try {
        const draft = JSON.parse(draftStr);
        // Only restore if the editing ID matches
        if (draft.editingId !== currentEditingId) return false;

        const form = document.getElementById(`form-${table}`);
        if (!form) return false;

        // Restore values
        for (const [id, val] of Object.entries(draft.values)) {
            const input = document.getElementById(id);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = !!val;
                } else {
                    input.value = val;
                }

                // If it is a hidden file path input, trigger preview updates if they exist!
                if (val && (id.endsWith('-path') || id.endsWith('-logo-path') || id.endsWith('-cert-path'))) {
                    const previewId = id.replace('-path', '-preview');
                    setExistingFilePreview(previewId, id, val);
                }
            }
        }

        showToast(`Restored unsaved changes. <a href="#" onclick="discardCurrentDraft('${table}', '${currentEditingId}'); return false;" style="color:#ff0055; text-decoration:underline; font-weight:bold; margin-left:10px;">Discard</a>`, "info");
        return true;
    } catch (e) {
        console.error("Failed to restore draft:", e);
        return false;
    }
}

function clearFormDraft(table) {
    localStorage.removeItem(`draft_${table}`);
}

window.discardCurrentDraft = function (table, id = '') {
    clearFormDraft(table);
    if (id) {
        editRecord(table, id);
    } else {
        openAddModal(table);
    }
    showToast("Changes discarded", "info");
};
