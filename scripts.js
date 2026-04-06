/* PDX Hub Foundry OS | SaaS Global State Controller v3.8 */
const FOUNDRY_VERSION = "3.8.2-SaaS";
let userState = {
    name: "Guest Engineer",
    tier: "Free",
    simsRun: 124,
    rank: 1240,
    academyPct: 0,
    medals: ["🥇", "⚡"]
};

// --- 1. SaaS Dashboard Core ---
function initFoundryOS() {
    loadUserState();
    updateDashboardUI();
    console.log(`[FOUNDRY OS] System Version ${FOUNDRY_VERSION} Active.`);
}

function loadUserState() {
    const saved = localStorage.getItem('pdx_user_state');
    if (saved) {
        userState = JSON.parse(saved);
    }
}

function saveUserState() {
    localStorage.setItem('pdx_user_state', JSON.stringify(userState));
}

function updateDashboardUI() {
    const nameEl = document.getElementById('user-name');
    const avatarEl = document.getElementById('user-avatar');
    const academyPctEl = document.getElementById('modal-academy-pct');
    const medalsCountEl = document.getElementById('modal-medals-count');

    if (nameEl) nameEl.textContent = userState.name;
    if (avatarEl) avatarEl.textContent = userState.name.charAt(0);
    
    // Sync Academy % from Hub Logic
    const storedPct = parseInt(localStorage.getItem('academyProgress') || "0");
    userState.academyPct = storedPct;
    if (academyPctEl) academyPctEl.textContent = `${storedPct}%`;
}

// --- 2. Identity & Modals ---
window.openProfile = function() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.style.display = 'flex';
        updateDashboardUI();
    }
};

window.closeProfile = function() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.style.display = 'none';
};

// --- 3. Premium Logic (SaaS) ---
window.unlockProFeature = function(featureName) {
    if (userState.tier === "Free") {
        showToast(`Upgrade to Pro to unlock ${featureName}!`);
        return false;
    }
    return true;
};

function showToast(msg) {
    const toast = document.getElementById('toast-v');
    if (toast) {
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 3000);
    }
}

// --- 4. Custom Cursor & Visual Effects ---
document.addEventListener('DOMContentLoaded', () => {
    initFoundryOS();
    
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    const aura = document.getElementById('aura-blob');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        if (cursor) cursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
        if (follower) follower.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
        if (aura) aura.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    });

    // --- Omni-Search Integration ---
    const omniInput = document.getElementById('omni-search');
    if (omniInput) {
        omniInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            document.querySelectorAll('.card, .tool-card, .sidebar-link, .grid > div').forEach(el => {
                const text = el.textContent.toLowerCase();
                if (el.classList.contains('sidebar-link')) return; // Don't hide sidebar
                el.style.display = text.includes(val) ? '' : 'none';
            });
        });
    }

    // --- Dashboard Specific Logic ---
    const dashCircle = document.getElementById('dash-circle');
    if (dashCircle) {
        const storedPct = parseInt(localStorage.getItem('academyProgress') || "0");
        const offset = 163.36 - (163.36 * storedPct / 100);
        dashCircle.style.strokeDashoffset = offset;
        const dashPctText = document.getElementById('dash-pct');
        if (dashPctText) dashPctText.textContent = `${storedPct}%`;
    }
});

// --- Existing Tool Exports (Compatibility Layer) ---
window.updateAcademyProgress = function(pct) {
    localStorage.setItem('academyProgress', pct);
    updateDashboardUI();
    showToast(`Foundry Academy: ${pct}% Complete`);
};
