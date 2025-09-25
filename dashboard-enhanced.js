// Enhanced Dashboard functionality with time-based progression and payment system
let dashboardStats = {
    totalViews: 0,
    totalClicks: 0,
    totalEarnings: 0,
    conversionRate: 0,
    firstVisit: null,
    lastUpdate: null
};

let paymentSettings = {
    withdrawalMethod: '',
    bankDetails: {
        accountNumber: '',
        routingNumber: '',
        accountHolderName: '',
        bankName: ''
    },
    payoneerEmail: '',
    paypalEmail: '',
    stripeConnected: false,
    minimumWithdrawal: 50
};

// Charts
let performanceChart = null;
let earningsChart = null;

// Initialize dashboard stats with time-based progression
function initializeDashboardStats() {
    const savedStats = localStorage.getItem('affiliateStats');
    const savedPayment = localStorage.getItem('paymentSettings');
    
    if (savedStats) {
        dashboardStats = JSON.parse(savedStats);
    }
    
    if (savedPayment) {
        paymentSettings = JSON.parse(savedPayment);
    }
    
    // Set first visit if not set
    if (!dashboardStats.firstVisit) {
        dashboardStats.firstVisit = Date.now();
        dashboardStats.lastUpdate = Date.now();
        saveDashboardStats();
    }
    
    // Update stats based on time progression
    updateStatsBasedOnTime();
    updateDashboardDisplay();
}

// Update stats based on time progression (daily increases)
function updateStatsBasedOnTime() {
    const now = Date.now();
    const firstVisit = dashboardStats.firstVisit;
    const daysSinceFirst = Math.floor((now - firstVisit) / (24 * 60 * 60 * 1000));
    
    // Progressive stats: +1 view per day, +$1 earning per day (capped at $45)
    if (daysSinceFirst > 0) {
        dashboardStats.totalViews = Math.min(daysSinceFirst, 45); // Cap at 45 days
        dashboardStats.totalEarnings = Math.min(daysSinceFirst, 45); // Cap at $45
        
        // Clicks should be slightly less than views for realism
        dashboardStats.totalClicks = Math.max(0, Math.floor(dashboardStats.totalViews * 0.7));
        
        // Calculate conversion rate
        dashboardStats.conversionRate = dashboardStats.totalViews > 0 ? 
            ((dashboardStats.totalClicks / dashboardStats.totalViews) * 100) : 0;
    }
    
    saveDashboardStats();
}

// Save dashboard stats
function saveDashboardStats() {
    localStorage.setItem('affiliateStats', JSON.stringify(dashboardStats));
}

// Save payment settings
function savePaymentSettings() {
    localStorage.setItem('paymentSettings', JSON.stringify(paymentSettings));
}

// Update dashboard display
function updateDashboardDisplay() {
    document.getElementById('totalViews').textContent = dashboardStats.totalViews.toLocaleString();
    document.getElementById('totalClicks').textContent = dashboardStats.totalClicks.toLocaleString();
    document.getElementById('totalEarnings').textContent = `$${dashboardStats.totalEarnings.toLocaleString()}`;
    document.getElementById('conversionRate').textContent = `${dashboardStats.conversionRate.toFixed(1)}%`;
    
    // Update today's changes
    const todayViews = Math.min(1, dashboardStats.totalViews);
    const todayClicks = Math.min(1, dashboardStats.totalClicks);  
    const todayEarnings = Math.min(1, dashboardStats.totalEarnings);
    
    document.querySelector('.stats-grid .stat-change').textContent = `+${todayViews} today`;
    document.querySelectorAll('.stats-grid .stat-change')[1].textContent = `+${todayClicks} today`;
    document.querySelectorAll('.stats-grid .stat-change')[2].textContent = `+$${todayEarnings} today`;
}

// Copy affiliate link functionality
function initializeCopyButton() {
    const copyBtn = document.getElementById('copyLinkBtn');
    const affiliateLink = document.getElementById('affiliateLink');
    
    if (copyBtn && affiliateLink) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(affiliateLink.value);
                
                // Visual feedback
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
                
            } catch (err) {
                // Fallback for older browsers
                affiliateLink.select();
                document.execCommand('copy');
                
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }
        });
    }
}

// Initialize payment modal
function initializePaymentModal() {
    // Create payment modal HTML
    const paymentModalHtml = `
    <div id="paymentModal" class="modal" style="display: none;">
        <div class="modal-content payment-modal">
            <div class="modal-header">
                <h2>💳 Payment Settings</h2>
                <span class="close" id="closePaymentModal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="withdrawal-info">
                    <div class="balance-card">
                        <div class="balance-amount">$${dashboardStats.totalEarnings}</div>
                        <div class="balance-label">Available Balance</div>
                        <div class="minimum-note">Minimum withdrawal: $${paymentSettings.minimumWithdrawal}</div>
                    </div>
                </div>
                
                <form id="paymentForm" class="payment-form">
                    <div class="form-section">
                        <h3>Select Payment Method</h3>
                        <div class="payment-methods">
                            <label class="payment-method-option">
                                <input type="radio" name="withdrawalMethod" value="bank" ${paymentSettings.withdrawalMethod === 'bank' ? 'checked' : ''}>
                                <div class="payment-method-card">
                                    <i class="fas fa-university"></i>
                                    <span>Bank Transfer</span>
                                </div>
                            </label>
                            
                            <label class="payment-method-option">
                                <input type="radio" name="withdrawalMethod" value="payoneer" ${paymentSettings.withdrawalMethod === 'payoneer' ? 'checked' : ''}>
                                <div class="payment-method-card">
                                    <i class="fas fa-credit-card"></i>
                                    <span>Payoneer</span>
                                </div>
                            </label>
                            
                            <label class="payment-method-option">
                                <input type="radio" name="withdrawalMethod" value="paypal" ${paymentSettings.withdrawalMethod === 'paypal' ? 'checked' : ''}>
                                <div class="payment-method-card">
                                    <i class="fab fa-paypal"></i>
                                    <span>PayPal</span>
                                </div>
                            </label>
                            
                            <label class="payment-method-option">
                                <input type="radio" name="withdrawalMethod" value="stripe" ${paymentSettings.withdrawalMethod === 'stripe' ? 'checked' : ''}>
                                <div class="payment-method-card">
                                    <i class="fab fa-stripe"></i>
                                    <span>Stripe</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Bank Transfer Details -->
                    <div class="payment-details" id="bankDetails" style="display: ${paymentSettings.withdrawalMethod === 'bank' ? 'block' : 'none'};">
                        <h3>Bank Account Details</h3>
                        <div class="form-row">
                            <input type="text" placeholder="Account Holder Name" value="${paymentSettings.bankDetails.accountHolderName}" id="accountHolderName" class="form-input">
                            <input type="text" placeholder="Bank Name" value="${paymentSettings.bankDetails.bankName}" id="bankName" class="form-input">
                        </div>
                        <div class="form-row">
                            <input type="text" placeholder="Account Number" value="${paymentSettings.bankDetails.accountNumber}" id="accountNumber" class="form-input">
                            <input type="text" placeholder="Routing Number" value="${paymentSettings.bankDetails.routingNumber}" id="routingNumber" class="form-input">
                        </div>
                    </div>
                    
                    <!-- Payoneer Details -->
                    <div class="payment-details" id="payoneerDetails" style="display: ${paymentSettings.withdrawalMethod === 'payoneer' ? 'block' : 'none'};">
                        <h3>Payoneer Account</h3>
                        <input type="email" placeholder="Payoneer Email Address" value="${paymentSettings.payoneerEmail}" id="payoneerEmail" class="form-input">
                        <div class="form-help">Enter the email address associated with your Payoneer account</div>
                    </div>
                    
                    <!-- PayPal Details -->
                    <div class="payment-details" id="paypalDetails" style="display: ${paymentSettings.withdrawalMethod === 'paypal' ? 'block' : 'none'};">
                        <h3>PayPal Account</h3>
                        <input type="email" placeholder="PayPal Email Address" value="${paymentSettings.paypalEmail}" id="paypalEmail" class="form-input">
                        <div class="form-help">Enter your PayPal email address for payments</div>
                    </div>
                    
                    <!-- Stripe Details -->
                    <div class="payment-details" id="stripeDetails" style="display: ${paymentSettings.withdrawalMethod === 'stripe' ? 'block' : 'none'};">
                        <h3>Stripe Connect</h3>
                        <div class="stripe-connect-card">
                            <i class="fab fa-stripe"></i>
                            <div class="stripe-connect-content">
                                <div class="stripe-status">
                                    ${paymentSettings.stripeConnected ? 
                                        '<span class="connected">✅ Connected</span>' : 
                                        '<span class="not-connected">❌ Not Connected</span>'
                                    }
                                </div>
                                <button type="button" class="stripe-connect-btn" id="stripeConnectBtn">
                                    ${paymentSettings.stripeConnected ? 'Reconnect' : 'Connect'} Stripe Account
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="cancelPayment">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            Save Payment Settings
                        </button>
                    </div>
                </form>
                
                <div class="withdrawal-section">
                    <h3>Request Withdrawal</h3>
                    <div class="withdrawal-form">
                        <div class="withdrawal-amount">
                            <input type="number" placeholder="Amount ($)" min="${paymentSettings.minimumWithdrawal}" max="${dashboardStats.totalEarnings}" id="withdrawalAmount" class="form-input">
                            <button type="button" class="btn btn-primary" id="requestWithdrawal" ${dashboardStats.totalEarnings < paymentSettings.minimumWithdrawal ? 'disabled' : ''}>
                                Request Withdrawal
                            </button>
                        </div>
                        ${dashboardStats.totalEarnings < paymentSettings.minimumWithdrawal ? 
                            `<div class="withdrawal-note">You need $${paymentSettings.minimumWithdrawal - dashboardStats.totalEarnings} more to request a withdrawal</div>` : 
                            '<div class="withdrawal-note">Withdrawals are processed within 3-5 business days</div>'
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', paymentModalHtml);
    
    // Initialize payment modal events
    initializePaymentModalEvents();
}

// Initialize payment modal events
function initializePaymentModalEvents() {
    // Show/hide payment modal
    const paymentBtn = document.getElementById('paymentSettingsBtn');
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.getElementById('closePaymentModal');
    
    if (paymentBtn) {
        paymentBtn.addEventListener('click', () => {
            paymentModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closePaymentModal) {
        closePaymentModal.addEventListener('click', () => {
            paymentModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="withdrawalMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            // Hide all payment details
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Show selected payment details
            const selectedMethod = e.target.value;
            const detailsElement = document.getElementById(selectedMethod + 'Details');
            if (detailsElement) {
                detailsElement.style.display = 'block';
            }
        });
    });
    
    // Payment form submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            savePaymentDetailsFromForm();
            showNotification('Payment settings saved successfully!', 'success');
            document.getElementById('paymentModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Stripe connect button
    const stripeConnectBtn = document.getElementById('stripeConnectBtn');
    if (stripeConnectBtn) {
        stripeConnectBtn.addEventListener('click', () => {
            // Simulate Stripe connection
            paymentSettings.stripeConnected = true;
            savePaymentSettings();
            showNotification('Stripe account connected successfully!', 'success');
            
            // Update button text
            stripeConnectBtn.textContent = 'Reconnect Stripe Account';
            document.querySelector('.stripe-status').innerHTML = '<span class="connected">✅ Connected</span>';
        });
    }
    
    // Withdrawal request
    const requestWithdrawal = document.getElementById('requestWithdrawal');
    if (requestWithdrawal) {
        requestWithdrawal.addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('withdrawalAmount').value);
            
            if (!amount || amount < paymentSettings.minimumWithdrawal) {
                showNotification(`Minimum withdrawal amount is $${paymentSettings.minimumWithdrawal}`, 'error');
                return;
            }
            
            if (amount > dashboardStats.totalEarnings) {
                showNotification('Insufficient balance for withdrawal', 'error');
                return;
            }
            
            if (!paymentSettings.withdrawalMethod) {
                showNotification('Please select and save a payment method first', 'error');
                return;
            }
            
            // Simulate withdrawal request
            showNotification(`Withdrawal request of $${amount} submitted successfully! Processing time: 3-5 business days.`, 'success');
            document.getElementById('withdrawalAmount').value = '';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Save payment details from form
function savePaymentDetailsFromForm() {
    const selectedMethod = document.querySelector('input[name="withdrawalMethod"]:checked')?.value;
    
    if (selectedMethod) {
        paymentSettings.withdrawalMethod = selectedMethod;
        
        if (selectedMethod === 'bank') {
            paymentSettings.bankDetails = {
                accountHolderName: document.getElementById('accountHolderName').value,
                bankName: document.getElementById('bankName').value,
                accountNumber: document.getElementById('accountNumber').value,
                routingNumber: document.getElementById('routingNumber').value
            };
        } else if (selectedMethod === 'payoneer') {
            paymentSettings.payoneerEmail = document.getElementById('payoneerEmail').value;
        } else if (selectedMethod === 'paypal') {
            paymentSettings.paypalEmail = document.getElementById('paypalEmail').value;
        }
        
        savePaymentSettings();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize charts (same as before but with updated data)
function initializeCharts() {
    const chartData = generateChartData();
    
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        performanceChart = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Views',
                        data: chartData.views,
                        borderColor: 'rgba(102, 126, 234, 1)',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Clicks',
                        data: chartData.clicks,
                        borderColor: 'rgba(240, 147, 251, 1)',
                        backgroundColor: 'rgba(240, 147, 251, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    // Earnings Chart
    const earningsCtx = document.getElementById('earningsChart');
    if (earningsCtx) {
        earningsChart = new Chart(earningsCtx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Earnings ($)',
                    data: chartData.earnings,
                    backgroundColor: 'rgba(240, 147, 251, 0.3)',
                    borderColor: 'rgba(240, 147, 251, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)',
                            callback: function(value) {
                                return '$' + value;
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
}

// Generate chart data based on actual stats progression
function generateChartData() {
    const labels = [];
    const views = [];
    const clicks = [];
    const earnings = [];
    
    const now = new Date();
    const daysSinceFirst = Math.floor((Date.now() - (dashboardStats.firstVisit || Date.now())) / (24 * 60 * 60 * 1000));
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Calculate progressive data
        const dayIndex = Math.max(0, daysSinceFirst - i);
        const dayViews = Math.min(dayIndex, 1); // Max 1 per day
        const dayClicks = Math.floor(dayViews * 0.7); // 70% click rate
        const dayEarnings = dayViews; // $1 per view
        
        views.push(dayViews);
        clicks.push(dayClicks);
        earnings.push(dayEarnings);
    }
    
    return { labels, views, clicks, earnings };
}

// Update dashboard stats (called from main script)
function updateDashboardStats() {
    initializeDashboardStats();
    
    // Update charts if they exist
    if (performanceChart && earningsChart) {
        const newData = generateChartData();
        
        performanceChart.data.datasets[0].data = newData.views;
        performanceChart.data.datasets[1].data = newData.clicks;
        performanceChart.update();
        
        earningsChart.data.datasets[0].data = newData.earnings;
        earningsChart.update();
    }
}

// Initialize enhanced dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboardStats();
    initializeCopyButton();
    initializePaymentModal();
    
    // Initialize charts after a short delay
    setTimeout(() => {
        initializeCharts();
    }, 100);
    
    // Add click tracking to affiliate link (same tab opening as requested)
    const promoteBtn = document.querySelector('.promote-link-btn');
    if (promoteBtn) {
        promoteBtn.addEventListener('click', () => {
            if (typeof trackClick === 'function') {
                trackClick('main-affiliate');
            }
            // Note: Link opens in same tab as requested
        });
    }
    
    // Add target="_blank" to external links in quick actions (new tab for external)
    const actionCards = document.querySelectorAll('.action-card[href^="https"]');
    actionCards.forEach(card => {
        card.setAttribute('target', '_blank');
    });
    
    // Update stats every minute to show progression
    setInterval(() => {
        updateStatsBasedOnTime();
        updateDashboardDisplay();
    }, 60000); // Check every minute
});

// Make function available globally
window.updateDashboardStats = updateDashboardStats;