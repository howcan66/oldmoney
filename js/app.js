// Auto-generate timestamp on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set timestamp
    const timestampElement = document.getElementById('timestamp');
    if (timestampElement) {
        timestampElement.textContent = new Date().toLocaleString();
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
