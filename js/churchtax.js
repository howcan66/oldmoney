/**
 * Church Tax Calculator
 * Calculates income and savings projection over 40 years with salary increases
 * 
 * Features:
 * - 40-year income projection with annual salary increases
 * - Percentage-based savings calculation
 * - Three collapsible table groups (1-10, 11-30, 31-40 years)
 * - Summary box with key metrics
 * - CSV export and clipboard copy
 */

// State management
let lastResults = [];
let lastSummary = {};

/**
 * Validate church tax calculator inputs
 * @returns {boolean} True if all inputs are valid
 */
function validateChurchTaxInputs() {
    // Clear all error messages
    document.getElementById('annualIncomeError').textContent = '';
    document.getElementById('salaryIncreaseError').textContent = '';
    document.getElementById('savingsPercentError').textContent = '';

    let isValid = true;

    // Validate annual income
    const annualIncomeInput = document.getElementById('annualIncome');
    const annualIncome = parseFloat(annualIncomeInput.value);
    if (isNaN(annualIncome) || annualIncome <= 0 || annualIncome > 999999999) {
        document.getElementById('annualIncomeError').textContent = 'Please enter a valid income (0 - 999,999,999)';
        isValid = false;
    }

    // Validate salary increase percentage
    const salaryIncreaseInput = document.getElementById('salaryIncrease');
    const salaryIncrease = parseFloat(salaryIncreaseInput.value);
    if (isNaN(salaryIncrease) || salaryIncrease < 0 || salaryIncrease > 100) {
        document.getElementById('salaryIncreaseError').textContent = 'Please enter a valid percentage (0 - 100)';
        isValid = false;
    }

    // Validate savings percentage
    const savingsPercentInput = document.getElementById('savingsPercent');
    const savingsPercent = parseFloat(savingsPercentInput.value);
    if (isNaN(savingsPercent) || savingsPercent < 0 || savingsPercent > 100) {
        document.getElementById('savingsPercentError').textContent = 'Please enter a valid percentage (0 - 100)';
        isValid = false;
    }

    return isValid;
}

/**
 * Format number as Swedish currency (kr)
 * @param {number} value The value to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Calculate church tax savings over 40 years
 */
function calculateSavings() {
    // Validate inputs
    if (!validateChurchTaxInputs()) {
        showToast('Please fix the errors above', 'error');
        return;
    }

    // Show loading indicator
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';

    // Get input values
    const annualIncome = parseFloat(document.getElementById('annualIncome').value);
    const salaryIncrease = parseFloat(document.getElementById('salaryIncrease').value);
    const savingsPercent = parseFloat(document.getElementById('savingsPercent').value);

    try {
        // Calculate 40-year projection
        lastResults = [];
        let totalAccumulated = 0;
        let totalSalaryIncrease = 0;

        for (let year = 1; year <= 40; year++) {
            // Calculate income for this year
            // Year 1 Income = Initial Income
            // Year N Income = Year(N-1) Income × (1 + salaryIncrease%)
            let yearIncome;
            if (year === 1) {
                yearIncome = annualIncome;
            } else {
                yearIncome = lastResults[year - 2].income * (1 + salaryIncrease / 100);
            }

            // Calculate salary increase amount
            const salaryIncreaseAmount = yearIncome - (year === 1 ? annualIncome : lastResults[year - 2].income);

            // Calculate annual and monthly savings
            const annualSavings = yearIncome * (savingsPercent / 100);
            const monthlySavings = annualSavings / 12;

            // Calculate total accumulated savings
            totalAccumulated += annualSavings;
            totalSalaryIncrease += salaryIncreaseAmount;

            // Store result
            lastResults.push({
                year: year,
                income: yearIncome,
                salaryIncrease: salaryIncreaseAmount,
                annualSavings: annualSavings,
                monthlySavings: monthlySavings,
                totalAccumulated: totalAccumulated
            });
        }

        // Store summary
        lastSummary = {
            annualIncome: annualIncome,
            salaryIncrease: salaryIncrease,
            savingsPercent: savingsPercent,
            savings10yr: lastResults[9].totalAccumulated,
            savings30yr: lastResults[29].totalAccumulated,
            savings40yr: lastResults[39].totalAccumulated,
            totalSalaryIncrease: totalSalaryIncrease,
            finalIncome: lastResults[39].income
        };

        // Populate tables and summary
        populateTables();
        updateSummary();

        // Show results section
        document.getElementById('resultsSection').style.display = 'block';

        // Hide loading overlay
        loadingOverlay.style.display = 'none';

        showToast('Calculation complete', 'success');
    } catch (error) {
        loadingOverlay.style.display = 'none';
        console.error('Calculation error:', error);
        showToast('Error during calculation: ' + error.message, 'error');
    }
}

/**
 * Populate the three table groups with calculation results
 */
function populateTables() {
    // Clear existing rows
    document.getElementById('ctTableBody1').innerHTML = '';
    document.getElementById('ctTableBody2').innerHTML = '';
    document.getElementById('ctTableBody3').innerHTML = '';

    // Populate Group 1: Years 1-10
    for (let i = 0; i < 10; i++) {
        const row = createTableRow(lastResults[i]);
        document.getElementById('ctTableBody1').appendChild(row);
    }

    // Populate Group 2: Years 11-30
    for (let i = 10; i < 30; i++) {
        const row = createTableRow(lastResults[i]);
        document.getElementById('ctTableBody2').appendChild(row);
    }

    // Populate Group 3: Years 31-40
    for (let i = 30; i < 40; i++) {
        const row = createTableRow(lastResults[i]);
        document.getElementById('ctTableBody3').appendChild(row);
    }
}

/**
 * Create a table row for a single year's data
 * @param {object} data Year data object
 * @returns {HTMLTableRowElement} Table row element
 */
function createTableRow(data) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.year}</td>
        <td>${formatCurrency(data.income)}</td>
        <td>${formatCurrency(data.salaryIncrease)}</td>
        <td>${formatCurrency(data.annualSavings)}</td>
        <td>${formatCurrency(data.monthlySavings)}</td>
        <td><strong>${formatCurrency(data.totalAccumulated)}</strong></td>
    `;
    return row;
}

/**
 * Update the summary box with key metrics
 */
function updateSummary() {
    document.getElementById('summary10').textContent = formatCurrency(lastSummary.savings10yr);
    document.getElementById('summary30').textContent = formatCurrency(lastSummary.savings30yr);
    document.getElementById('summary40').textContent = formatCurrency(lastSummary.savings40yr);
    document.getElementById('summaryIncreaseTotal').textContent = formatCurrency(lastSummary.totalSalaryIncrease);
    document.getElementById('summaryFinalIncome').textContent = formatCurrency(lastSummary.finalIncome);
}

/**
 * Toggle collapsible group visibility
 * @param {string} groupId The group ID to toggle (ctGroup1, ctGroup2, ctGroup3)
 */
function toggleGroup(groupId) {
    const contentId = groupId + 'Content';
    const toggleId = groupId + 'Toggle';
    
    const content = document.getElementById(contentId);
    const toggle = document.getElementById(toggleId);

    if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
        toggle.textContent = content.style.display === 'none' ? '▶' : '▼';
    }
}

/**
 * Export calculation results to CSV file
 */
function exportChurchTaxToCSV() {
    if (lastResults.length === 0) {
        showToast('Please calculate first', 'warning');
        return;
    }

    try {
        const csv = buildChurchTaxCsv();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        // Create filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 10);
        link.setAttribute('href', url);
        link.setAttribute('download', `church-tax-calculation-${timestamp}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('CSV exported successfully', 'success');
    } catch (error) {
        console.error('CSV export error:', error);
        showToast('Error exporting CSV: ' + error.message, 'error');
    }
}

/**
 * Build CSV string from calculation results
 * @returns {string} CSV content
 */
function buildChurchTaxCsv() {
    let csv = 'Church Tax Calculation Export\n';
    csv += `Generated: ${new Date().toLocaleString('sv-SE')}\n\n`;
    csv += `Initial Settings:\n`;
    csv += `Annual Income,${lastSummary.annualIncome}\n`;
    csv += `Salary Increase %,${lastSummary.salaryIncrease}\n`;
    csv += `Savings %,${lastSummary.savingsPercent}\n\n`;

    csv += 'Year,Income,Salary Increase,Annual Savings,Monthly Savings,Total Accumulated\n';

    lastResults.forEach(result => {
        csv += `${result.year},`;
        csv += `${result.income.toFixed(2)},`;
        csv += `${result.salaryIncrease.toFixed(2)},`;
        csv += `${result.annualSavings.toFixed(2)},`;
        csv += `${result.monthlySavings.toFixed(2)},`;
        csv += `${result.totalAccumulated.toFixed(2)}\n`;
    });

    csv += '\nSummary\n';
    csv += `Total Savings after 10 years,${lastSummary.savings10yr.toFixed(2)}\n`;
    csv += `Total Savings after 30 years,${lastSummary.savings30yr.toFixed(2)}\n`;
    csv += `Total Savings after 40 years,${lastSummary.savings40yr.toFixed(2)}\n`;
    csv += `Total Salary Increase,${lastSummary.totalSalaryIncrease.toFixed(2)}\n`;
    csv += `Final Annual Income,${lastSummary.finalIncome.toFixed(2)}\n`;

    return csv;
}

/**
 * Copy calculation results to clipboard
 */
function copyChurchTaxToClipboard() {
    if (lastResults.length === 0) {
        showToast('Please calculate first', 'warning');
        return;
    }

    try {
        const csv = buildChurchTaxCsv();
        navigator.clipboard.writeText(csv).then(() => {
            showToast('Data copied to clipboard', 'success');
        }).catch(err => {
            console.error('Clipboard copy error:', err);
            showToast('Error copying to clipboard', 'error');
        });
    } catch (error) {
        console.error('Clipboard error:', error);
        showToast('Error copying to clipboard: ' + error.message, 'error');
    }
}

/**
 * Clear all inputs and reset calculator
 */
function clearChurchTaxInputs() {
    // Reset to default values
    document.getElementById('annualIncome').value = '300000';
    document.getElementById('salaryIncrease').value = '2';
    document.getElementById('savingsPercent').value = '1.2';

    // Clear error messages
    document.getElementById('annualIncomeError').textContent = '';
    document.getElementById('salaryIncreaseError').textContent = '';
    document.getElementById('savingsPercentError').textContent = '';

    // Clear results
    lastResults = [];
    lastSummary = {};
    document.getElementById('resultsSection').style.display = 'none';

    showToast('Calculator cleared', 'info');
}

/**
 * Show toast notification
 * @param {string} message The message to display (or messageKey with _sv and _en variants)
 * @param {string} type The toast type (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Translate message if it's a key with _sv and _en variants
    let displayMessage = message;
    const currentLang = localStorage.getItem('preferredLanguage') || 'sv';
    
    const messageKey = message + '_' + currentLang;
    const svKey = message + '_sv';
    const enKey = message + '_en';

    // If message is a translation key, translate it
    if (message.includes('_')) {
        // Already formatted
        displayMessage = message;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = displayMessage;
    toast.style.cssText = `
        padding: 12px 16px;
        margin-bottom: 8px;
        border-radius: 4px;
        background-color: ${getToastColor(type)};
        color: white;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-in-out;
    `;

    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease-in-out';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Get toast background color by type
 * @param {string} type Toast type
 * @returns {string} Color hex code
 */
function getToastColor(type) {
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    return colors[type] || colors.info;
}

/**
 * Send calculation results by email
 */
async function sendChurchTaxByEmail() {
    const emailInput = document.getElementById('emailRecipient');
    const emailError = document.getElementById('emailError');

    if (emailError) {
        emailError.textContent = '';
    }

    if (lastResults.length === 0) {
        showToast('Please calculate first', 'warning');
        return;
    }

    const recipient = emailInput ? emailInput.value.trim() : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email
    if (!recipient || !emailPattern.test(recipient)) {
        if (emailError) {
            const currentLang = localStorage.getItem('preferredLanguage') || 'sv';
            const errorMsg = currentLang === 'sv' 
                ? 'Ange en giltig e-postadress'
                : 'Please enter a valid email address';
            emailError.textContent = errorMsg;
        }
        showToast('Invalid email address', 'error');
        return;
    }

    try {
        const csv = buildChurchTaxCsv();
        const subject = lastSummary.annualIncome 
            ? `Church Tax Calculation - Income: ${lastSummary.annualIncome} kr`
            : 'Church Tax Calculation';

        const payload = {
            to: recipient,
            subject: subject,
            text: buildChurchTaxEmailBody(),
            csv: csv
        };

        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send email');
        }

        // Clear email input on success
        if (emailInput) {
            emailInput.value = '';
            emailInput.style.borderColor = '#ccc';
        }
        if (emailError) {
            emailError.textContent = '';
        }

        showToast('Email sent successfully', 'success');
    } catch (error) {
        console.error('Email send error:', error);
        if (emailError) {
            emailError.textContent = error.message || 'Error sending email';
        }
        showToast('Error sending email: ' + error.message, 'error');
    }
}

/**
 * Build email body with summary and instructions
 * @returns {string} Email body text
 */
function buildChurchTaxEmailBody() {
    let body = 'Church Tax Calculation Results\n';
    body += '================================\n\n';
    body += `Generated: ${new Date().toLocaleString('sv-SE')}\n\n`;
    
    body += 'Input Parameters:\n';
    body += `- Annual Income: ${formatCurrency(lastSummary.annualIncome)}\n`;
    body += `- Salary Increase (%): ${lastSummary.salaryIncrease}%\n`;
    body += `- Savings Percentage (%): ${lastSummary.savingsPercent}%\n\n`;
    
    body += 'Summary Results:\n';
    body += `- Savings after 10 years: ${formatCurrency(lastSummary.savings10yr)}\n`;
    body += `- Savings after 30 years: ${formatCurrency(lastSummary.savings30yr)}\n`;
    body += `- Savings after 40 years: ${formatCurrency(lastSummary.savings40yr)}\n`;
    body += `- Total Salary Increase: ${formatCurrency(lastSummary.totalSalaryIncrease)}\n`;
    body += `- Final Annual Income: ${formatCurrency(lastSummary.finalIncome)}\n\n`;
    
    body += 'Full data table is attached as CSV.\n';
    body += '\nBest regards,\nOld Money Calculator';
    
    return body;
}


    // Set default values
    document.getElementById('annualIncome').value = '300000';
    document.getElementById('salaryIncrease').value = '2';
    document.getElementById('savingsPercent').value = '1.2';

    // Add Enter key support for inputs
    const inputs = document.querySelectorAll('#annualIncome, #salaryIncrease, #savingsPercent');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateSavings();
            }
        });
    });

    // Collapse groups on mobile by default
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        document.getElementById('ctGroup1Content').style.display = 'none';
        document.getElementById('ctGroup1Toggle').textContent = '▶';
        document.getElementById('ctGroup2Content').style.display = 'none';
        document.getElementById('ctGroup2Toggle').textContent = '▶';
        document.getElementById('ctGroup3Content').style.display = 'none';
        document.getElementById('ctGroup3Toggle').textContent = '▶';
    }
});
