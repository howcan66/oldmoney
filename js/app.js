// Auto-generate timestamp on page load
document.addEventListener('DOMContentLoaded', function() {
    const timestamp = new Date().toLocaleString();
    
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

    // Set default state for links section based on device width
    const linksContent = document.getElementById('linksContent');
    const linksToggle = document.getElementById('linksToggle');
    if (linksContent && linksToggle) {
        if (window.innerWidth >= 1024) {
            // Desktop: expanded by default
            linksContent.classList.add('expanded');
            linksToggle.classList.add('expanded');
        }
        // Tablet/Mobile: collapsed by default (no action needed)
    }
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

// Language translations
const translations = {
    sv: {
        homeDescription: 'Välkommen till Old Money - din plattform för finansiell planering och investeringsverktyg. Utforska våra resurser för att bygga långsiktig ekonomisk stabilitet.',
        linkCalculator: 'Räntekalkylator - Interest Calculator',
        linkResources: 'Old Money Resurser',
        linkMarketplace: 'Marknadsplats'
    },
    sv: {
        homeDescription: 'Välkommen till Old Money - din plattform för finansiell planering och investeringsverktyg. Utforska våra resurser för att bygga långsiktig ekonomisk stabilitet.',
        linkCalculator: 'Räntekalkylator - Interest Calculator',
        linkResources: 'Old Money Resurser',
        linkMarketplace: 'Marknadsplats'
    },
};

// Switch language
function switchLanguage(lang) {
    // Save preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });
    
    // Update text content
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.dataset.langKey;
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// Initialize language on load
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'sv';
    switchLanguage(savedLang);
});
