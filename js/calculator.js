/* Calculator JavaScript Functions */
/* Used by: interestoninterest.html */
/* See design_style_guide.txt Section 16 for specifications */

/**
 * Calculate compound interest and populate tables
 */
function calculateInterest() {
    // Get input values
    const startAmount = parseFloat(document.getElementById('startAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    let monthlySavings = parseFloat(document.getElementById('monthlySavings').value);
    if (isNaN(monthlySavings)) {
        monthlySavings = 0;
    }
    
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    if (!validateInputs(startAmount, interestRate, monthlySavings)) {
        return;
    }
    
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    
    // Simulate calculation delay
    setTimeout(() => {
        try {
            // Calculate 40 years of compound interest with monthly savings
            const results = [];
            let currentAmount = startAmount;
            const monthlyRate = (interestRate / 100) / 12;
            
            for (let year = 1; year <= 40; year++) {
                const startBalance = currentAmount;
                let totalInterest = 0;
                let balance = startBalance;

                for (let month = 1; month <= 12; month++) {
                    balance += monthlySavings;
                    const interest = balance * monthlyRate;
                    totalInterest += interest;
                    balance += interest;
                }

                const endBalance = balance;
                const monthlyEquiv = endBalance / 12;
                const yearlyIncrease = endBalance - startBalance;
                
                results.push({
                    year: year,
                    startAmount: startBalance,
                    interest: totalInterest,
                    endAmount: endBalance,
                    monthlyEquiv: monthlyEquiv,
                    yearlyIncrease: yearlyIncrease
                });
                
                currentAmount = endBalance;
            }
            
            // Populate tables
            populateTables(results);
            
            // Update summary
            updateSummary(startAmount, results[39].endAmount, results[39].endAmount - startAmount, interestRate);
            
            // Show results section
            const resultsSection = document.getElementById('resultsSection');
            if (resultsSection) {
                resultsSection.style.display = 'block';
            }
            
            // Show success message
            showToast('Calculation complete!', 'success');
            
        } catch (error) {
            console.error('Calculation error:', error);
            showToast('Error during calculation', 'error');
        } finally {
            // Hide loading overlay
            if (loadingOverlay) {
                loadingOverlay.classList.remove('active');
            }
        }
    }, 500);
}

/**
 * Validate input values
 */
function validateInputs(startAmount, interestRate, monthlySavings) {
    let isValid = true;
    
    const startAmountInput = document.getElementById('startAmount');
    const interestRateInput = document.getElementById('interestRate');
    const monthlySavingsInput = document.getElementById('monthlySavings');
    const startAmountError = document.getElementById('startAmountError');
    const interestRateError = document.getElementById('interestRateError');
    const monthlySavingsError = document.getElementById('monthlySavingsError');
    
    // Validate start amount
    if (isNaN(startAmount) || startAmount < 0 || startAmount > 999999999) {
        if (startAmountError) {
            startAmountError.textContent = 'Please enter a valid amount (0-999,999,999)';
        }
        if (startAmountInput) {
            startAmountInput.style.borderColor = '#e74c3c';
        }
        isValid = false;
    }
    
    // Validate interest rate
    if (isNaN(interestRate) || interestRate < 0 || interestRate > 100) {
        if (interestRateError) {
            interestRateError.textContent = 'Please enter a valid interest rate (0-100%)';
        }
        if (interestRateInput) {
            interestRateInput.style.borderColor = '#e74c3c';
        }
        isValid = false;
    }

    // Validate monthly savings
    if (isNaN(monthlySavings) || monthlySavings < 0 || monthlySavings > 999999999) {
        if (monthlySavingsError) {
            monthlySavingsError.textContent = 'Please enter a valid monthly savings amount (0-999,999,999)';
        }
        if (monthlySavingsInput) {
            monthlySavingsInput.style.borderColor = '#e74c3c';
        }
        isValid = false;
    }
    
    return isValid;
}

/**
 * Clear error messages and reset input styles
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputs = document.querySelectorAll('.input-group input');
    
    errorElements.forEach(el => {
        el.textContent = '';
    });
    
    inputs.forEach(input => {
        input.style.borderColor = '#ccc';
    });
}

/**
 * Populate table groups with calculated data
 */
function populateTables(results) {
    const groups = [
        { id: 'tableBody1', start: 0, end: 10 },
        { id: 'tableBody2', start: 10, end: 30 },
        { id: 'tableBody3', start: 30, end: 40 }
    ];
    
    groups.forEach(group => {
        const tbody = document.getElementById(group.id);
        if (tbody) {
            tbody.innerHTML = '';
            
            for (let i = group.start; i < group.end; i++) {
                if (results[i]) {
                    const row = createTableRow(results[i]);
                    tbody.appendChild(row);
                }
            }
        }
    });
}

/**
 * Create a table row for a year's data
 */
function createTableRow(data) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.year}</td>
        <td>${formatCurrency(data.startAmount)}</td>
        <td>${formatCurrency(data.interest)}</td>
        <td>${formatCurrency(data.endAmount)}</td>
        <td>${formatCurrency(data.monthlyEquiv)}</td>
        <td>${formatCurrency(data.yearlyIncrease)}</td>
    `;
    return row;
}

/**
 * Update summary box with results
 */
function updateSummary(initial, final, growth, interestRate) {
    const summaryInitial = document.getElementById('summaryInitial');
    const summaryFinal = document.getElementById('summaryFinal');
    const summaryGrowth = document.getElementById('summaryGrowth');
    const summaryPercent = document.getElementById('summaryPercent');
    
    if (summaryInitial) {
        summaryInitial.textContent = formatCurrency(initial);
    }
    
    if (summaryFinal) {
        summaryFinal.textContent = formatCurrency(final);
    }
    
    if (summaryGrowth) {
        summaryGrowth.textContent = formatCurrency(growth);
    }
    
    if (summaryPercent) {
        const growthPercent = ((growth / initial) * 100).toFixed(2);
        summaryPercent.textContent = growthPercent + '%';
    }
}

/**
 * Format number as currency (SEK)
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Clear all inputs and reset page
 */
function clearInputs() {
    document.getElementById('startAmount').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('monthlySavings').value = '';
    
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
    
    clearErrors();
    showToast('Form cleared', 'success');
}

/**
 * Toggle table group expanded/collapsed state
 */
function toggleGroup(groupId) {
    const groupContent = document.getElementById(groupId + 'Content');
    const groupToggle = document.getElementById(groupId + 'Toggle');
    
    if (groupContent) {
        groupContent.classList.toggle('expanded');
        
        // Update toggle icon
        if (groupToggle) {
            const isExpanded = groupContent.classList.contains('expanded');
            groupToggle.textContent = isExpanded ? '▲' : '▼';
        }
    }
}

/**
 * Export table data to CSV file
 */
function exportToCSV() {
    try {
        let csvContent = 'Year,Start Amount,Interest,End Amount,Monthly Equiv.,Yearly Increase\n';
        
        // Collect all table data
        const tables = [
            document.getElementById('tableBody1'),
            document.getElementById('tableBody2'),
            document.getElementById('tableBody3')
        ];
        
        tables.forEach(tbody => {
            if (tbody) {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    const values = Array.from(cells).map(cell => cell.textContent.trim());
                    csvContent += values.join(',') + '\n';
                });
            }
        });
        
        // Create and download file
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
        element.setAttribute('download', 'interest_calculator_' + new Date().toISOString().split('T')[0] + '.csv');
        element.style.display = 'none';
        
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        showToast('CSV exported successfully!', 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showToast('Error exporting CSV', 'error');
    }
}

/**
 * Copy table data to clipboard
 */
function copyToClipboard() {
    try {
        let clipboardText = 'Year\tStart Amount\tInterest\tEnd Amount\tMonthly Equiv.\tYearly Increase\n';
        
        // Collect all table data
        const tables = [
            document.getElementById('tableBody1'),
            document.getElementById('tableBody2'),
            document.getElementById('tableBody3')
        ];
        
        tables.forEach(tbody => {
            if (tbody) {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    const values = Array.from(cells).map(cell => cell.textContent.trim());
                    clipboardText += values.join('\t') + '\n';
                });
            }
        });
        
        // Copy to clipboard
        navigator.clipboard.writeText(clipboardText).then(() => {
            showToast('Copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Clipboard error:', err);
            showToast('Error copying to clipboard', 'error');
        });
        
    } catch (error) {
        console.error('Copy error:', error);
        showToast('Error copying to clipboard', 'error');
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    
    if (!toastContainer) {
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Initialize calculator on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Ensure all table groups are collapsed by default
    const groups = ['group1', 'group2', 'group3'];
    groups.forEach(groupId => {
        const groupContent = document.getElementById(groupId + 'Content');
        if (groupContent) {
            groupContent.classList.remove('expanded');
        }
    });
    
    // Add blur event listeners for auto-calculation
    const startAmountInput = document.getElementById('startAmount');
    const interestRateInput = document.getElementById('interestRate');
    
    if (startAmountInput) {
        startAmountInput.addEventListener('blur', calculateInterest);
    }
    
    if (interestRateInput) {
        interestRateInput.addEventListener('blur', calculateInterest);
    }
});
