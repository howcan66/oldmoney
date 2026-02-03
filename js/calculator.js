// Calculator JavaScript

// Global variable to store calculation results
let calculationData = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set default state for table groups based on device width
    if (window.innerWidth >= 1024) {
        // Desktop: all groups expanded by default
        ['group1', 'group2', 'group3'].forEach(groupId => {
            const content = document.getElementById(groupId + 'Content');
            const toggle = document.getElementById(groupId + 'Toggle');
            if (content && toggle) {
                content.classList.add('expanded');
                toggle.classList.add('expanded');
            }
        });
    }
    
    // Load saved inputs from localStorage
    const savedStart = localStorage.getItem('startAmount');
    const savedRate = localStorage.getItem('interestRate');
    if (savedStart) document.getElementById('startAmount').value = savedStart;
    if (savedRate) document.getElementById('interestRate').value = savedRate;
});

// Calculate interest on blur
function calculateInterest() {
    const startAmount = parseFloat(document.getElementById('startAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    let hasError = false;
    
    if (!startAmount || startAmount <= 0 || startAmount > 999999999) {
        showFieldError('startAmountError', 'Please enter a valid amount between 0 and 999,999,999');
        hasError = true;
    }
    
    if (interestRate === undefined || interestRate === null || interestRate < 0 || interestRate > 100) {
        showFieldError('interestRateError', 'Please enter a valid interest rate between 0 and 100');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('startAmount', startAmount);
    localStorage.setItem('interestRate', interestRate);
    
    // Show loading
    showLoading();
    
    // Simulate calculation delay for UX
    setTimeout(() => {
        performCalculation(startAmount, interestRate);
        hideLoading();
        showToast('success', 'Calculation Complete', 'Interest calculated for 40 years');
    }, 300);
}

// Perform the actual calculation
function performCalculation(startAmount, rate) {
    calculationData = [];
    let previousAmount = startAmount;
    
    // Year 0
    calculationData.push({
        year: 0,
        startAmount: startAmount,
        interest: 0,
        endAmount: startAmount,
        monthlyEquiv: (startAmount / 12),
        yearlyIncrease: 0
    });
    
    // Years 1-40
    for (let year = 1; year <= 40; year++) {
        const interest = previousAmount * (rate / 100);
        const endAmount = previousAmount + interest;
        const monthlyEquiv = endAmount / 12;
        const yearlyIncrease = endAmount - previousAmount;
        
        calculationData.push({
            year: year,
            startAmount: previousAmount,
            interest: interest,
            endAmount: endAmount,
            monthlyEquiv: monthlyEquiv,
            yearlyIncrease: yearlyIncrease
        });
        
        previousAmount = endAmount;
    }
    
    // Update summary
    updateSummary();
    
    // Populate tables
    populateTables();
    
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
}

// Update summary section
function updateSummary() {
    const initial = calculationData[0].startAmount;
    const final = calculationData[40].endAmount;
    const growth = final - initial;
    const growthPercent = ((final / initial - 1) * 100);
    
    document.getElementById('summaryInitial').textContent = formatNumber(initial);
    document.getElementById('summaryFinal').textContent = formatNumber(final);
    document.getElementById('summaryGrowth').textContent = formatNumber(growth);
    document.getElementById('summaryPercent').textContent = formatNumber(growthPercent) + '%';
}

// Populate table groups
function populateTables() {
    // Group 1: Years 1-10
    populateTableGroup('tableBody1', 1, 10);
    
    // Group 2: Years 11-30
    populateTableGroup('tableBody2', 11, 30);
    
    // Group 3: Years 31-40
    populateTableGroup('tableBody3', 31, 40);
}

// Populate a specific table group
function populateTableGroup(tableBodyId, startYear, endYear) {
    const tbody = document.getElementById(tableBodyId);
    tbody.innerHTML = '';
    
    for (let i = startYear; i <= endYear; i++) {
        const data = calculationData[i];
        const row = tbody.insertRow();
        
        row.insertCell(0).textContent = data.year;
        row.insertCell(1).textContent = formatNumber(data.startAmount);
        row.insertCell(2).textContent = formatNumber(data.interest);
        row.insertCell(3).textContent = formatNumber(data.endAmount);
        row.insertCell(4).textContent = formatNumber(data.monthlyEquiv);
        row.insertCell(5).textContent = formatNumber(data.yearlyIncrease);
    }
}

// Format number to 2 decimals
function formatNumber(num) {
    return num.toFixed(2);
}

// Toggle table group
function toggleGroup(groupId) {
    const content = document.getElementById(groupId + 'Content');
    const toggle = document.getElementById(groupId + 'Toggle');
    
    if (content && toggle) {
        content.classList.toggle('expanded');
        toggle.classList.toggle('expanded');
    }
}

// Export to CSV
function exportToCSV() {
    if (calculationData.length === 0) {
        showToast('warning', 'No Data', 'Please calculate interest first');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        try {
            let csv = 'Year,Start Amount,Interest,End Amount,Monthly Equiv,Yearly Increase\n';
            
            calculationData.forEach(row => {
                csv += `${row.year},${formatNumber(row.startAmount)},${formatNumber(row.interest)},${formatNumber(row.endAmount)},${formatNumber(row.monthlyEquiv)},${formatNumber(row.yearlyIncrease)}\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            a.href = url;
            a.download = `oldmoney_calculator_${timestamp}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            hideLoading();
            showToast('success', 'Export Complete', 'CSV file downloaded successfully');
        } catch (error) {
            hideLoading();
            showToast('error', 'Export Failed', 'Could not export CSV. Please try again.');
            console.error('Export error:', error);
        }
    }, 200);
}

// Copy to clipboard
function copyToClipboard() {
    if (calculationData.length === 0) {
        showToast('warning', 'No Data', 'Please calculate interest first');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        try {
            let text = 'Year\tStart Amount\tInterest\tEnd Amount\tMonthly Equiv\tYearly Increase\n';
            
            calculationData.forEach(row => {
                text += `${row.year}\t${formatNumber(row.startAmount)}\t${formatNumber(row.interest)}\t${formatNumber(row.endAmount)}\t${formatNumber(row.monthlyEquiv)}\t${formatNumber(row.yearlyIncrease)}\n`;
            });
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    hideLoading();
                    showToast('success', 'Copied', 'Table data copied to clipboard');
                }).catch(err => {
                    hideLoading();
                    fallbackCopyToClipboard(text);
                });
            } else {
                hideLoading();
                fallbackCopyToClipboard(text);
            }
        } catch (error) {
            hideLoading();
            showToast('error', 'Copy Failed', 'Could not copy to clipboard');
            console.error('Copy error:', error);
        }
    }, 200);
}

// Fallback copy method
function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('success', 'Copied', 'Table data copied to clipboard');
    } catch (err) {
        showToast('error', 'Copy Failed', 'Please copy manually');
    }
    
    document.body.removeChild(textarea);
}

// Clear all inputs
function clearInputs() {
    document.getElementById('startAmount').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('resultsSection').style.display = 'none';
    clearErrors();
    calculationData = [];
    
    // Clear localStorage
    localStorage.removeItem('startAmount');
    localStorage.removeItem('interestRate');
    
    showToast('info', 'Cleared', 'All inputs cleared');
}

// Show field error
function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    const inputId = errorId.replace('Error', '');
    const inputElement = document.getElementById(inputId);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

// Clear all errors
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input.error').forEach(el => el.classList.remove('error'));
}

// Show loading overlay
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

// Hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Show toast notification
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    const durations = {
        success: 3000,
        error: 5000,
        warning: 4000,
        info: 3000
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    // Limit to 3 toasts
    const toasts = container.querySelectorAll('.toast');
    if (toasts.length > 3) {
        toasts[0].remove();
    }
    
    // Auto-dismiss
    setTimeout(() => {
        toast.classList.add('fadeOut');
        setTimeout(() => toast.remove(), 300);
    }, durations[type]);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+E - Export to CSV
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportToCSV();
    }
    
    // Escape - Clear inputs
    if (e.key === 'Escape') {
        const groups = ['group1', 'group2', 'group3'];
        groups.forEach(groupId => {
            const content = document.getElementById(groupId + 'Content');
            const toggle = document.getElementById(groupId + 'Toggle');
            if (content && toggle && content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                toggle.classList.remove('expanded');
            }
        });
    }
});
