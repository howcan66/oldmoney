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
});

// Refresh button handler
function refreshPage() {
    location.reload();
}

// Close button handler
function closePage() {
    window.close();
}
