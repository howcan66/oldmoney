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
