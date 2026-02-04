// Auto-generate timestamp on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language from localStorage
    initializeLanguage();

    // Set metadata timestamp
    const timestampElement = document.getElementById('timestamp');
    if (timestampElement) {
        timestampElement.textContent = timestamp;
    }
    
    // Set footer timestamp
    const footerTimestampElement = document.getElementById('footer-timestamp');
    if (footerTimestampElement) {
        footerTimestampElement.textContent = timestamp;
    }
    
    // Set dynamic filename
    const filenameElement = document.getElementById('filename');
    if (filenameElement) {
        const filename = window.location.pathname.split('/').pop() || 'index.html';
        filenameElement.textContent = filename;
    }

    // Set default state for links section - COLLAPSED on all devices
    const linksContent = document.getElementById('linksContent');
    const linksToggle = document.getElementById('linksToggle');
    // All devices: collapsed by default (no action needed)
    // User can click to expand
});

// Refresh button handler
function refreshPage() {
    location.reload();
}

// Close button handler
function closePage() {
    window.close();
}

// Toggle links section
function toggleLinks() {
    const linksContent = document.getElementById('linksContent');
    const linksToggle = document.getElementById('linksToggle');
    
    if (linksContent && linksToggle) {
        linksContent.classList.toggle('expanded');
        linksToggle.classList.toggle('expanded');
    }
}

// Generate timestamp helper
function generateTimestamp() {
    return new Date().toLocaleString();
}

/**
 * Switch page language between SV (Swedish) and EN (English)
 * Translates all elements with data-lang-sv and data-lang-en attributes
 * Stores preference in localStorage
 * @param {string} lang Language code ('sv' or 'en')
 */
function switchLanguage(lang) {
    // Validate language
    if (lang !== 'sv' && lang !== 'en') {
        console.warn('Invalid language code:', lang);
        return;
    }

    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', lang);

    // Update all elements with data-lang attributes
    const elements = document.querySelectorAll('[data-lang-sv][data-lang-en]');
    elements.forEach(el => {
        if (lang === 'sv') {
            el.textContent = el.getAttribute('data-lang-sv');
        } else {
            el.textContent = el.getAttribute('data-lang-en');
        }
    });

    // Update language button states
    const svBtns = document.querySelectorAll('[data-lang="sv"]');
    const enBtns = document.querySelectorAll('[data-lang="en"]');

    svBtns.forEach(btn => {
        btn.classList.toggle('active', lang === 'sv');
        btn.setAttribute('aria-pressed', lang === 'sv');
    });

    enBtns.forEach(btn => {
        btn.classList.toggle('active', lang === 'en');
        btn.setAttribute('aria-pressed', lang === 'en');
    });

    // Update page lang attribute for CSS and accessibility
    document.documentElement.lang = lang;
}

/**
 * Initialize language on page load
 * Checks localStorage for saved preference, defaults to 'sv'
 */
function initializeLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'sv';
    switchLanguage(savedLang);
}
