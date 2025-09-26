// Enhanced Dashboard functionality for static site with payment system
let dashboardStats = {
    totalViews: 0,
    totalClicks: 0,
    totalEarnings: 0,
    conversionRate: 0,
    firstVisit: null,
    lastUpdate: null,
    linkCopied: false,
    firstCopyTime: null,
    progressionStarted: false,
    dailyProgressions: [],
    lastProgressCheck: null
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

// Initialize dashboard stats - keep at 0 for static site
function initializeDashboardStats() {
    // For static site, always show 0s
    dashboardStats = {
        totalViews: 0,
        totalClicks: 0,
        totalEarnings: 0,
        conversionRate: 0,
        firstVisit: Date.now(),
        lastUpdate: Date.now(),
        linkCopied: false,
        firstCopyTime: null,
        progressionStarted: false,
        dailyProgressions: [],
        lastProgressCheck: null
    };
    
    // Try to load payment settings from localStorage
    const savedPayment = localStorage.getItem('paymentSettings');
    if (savedPayment) {
        paymentSettings = JSON.parse(savedPayment);
    }
    
    updateDashboardDisplay();
}

// Save payment settings
function savePaymentSettings() {
    localStorage.setItem('paymentSettings', JSON.stringify(paymentSettings));
}

// Update dashboard display - show 0s
function updateDashboardDisplay() {
    const totalViewsEl = document.getElementById('totalViews');
    const totalClicksEl = document.getElementById('totalClicks');
    const totalEarningsEl = document.getElementById('totalEarnings');
    const conversionRateEl = document.getElementById('conversionRate');
    
    if (totalViewsEl) totalViewsEl.textContent = '0';
    if (totalClicksEl) totalClicksEl.textContent = '0';
    if (totalEarningsEl) totalEarningsEl.textContent = '$0';
    if (conversionRateEl) conversionRateEl.textContent = '0.0%';
    
    // Update today's changes to show +0
    const statChanges = document.querySelectorAll('.stats-grid .stat-change');
    if (statChanges.length >= 3) {
        statChanges[0].textContent = '+0 today';
        statChanges[1].textContent = '+0 today';
        statChanges[2].textContent = '+$0 today';
        if (statChanges[3]) {
            statChanges[3].textContent = '+0% today';
        }
    }
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
                
                showProgressNotification('🎉 Link copied! Share it to start earning money!');
                
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

// Show progress notification
function showProgressNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'progress-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">🚀</div>
            <div class="notification-text">${message}</div>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-weight: 600;
        font-size: 0.9rem;
        max-width: 350px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize payment modal
function initializePaymentModal() {
    // Create payment modal HTML
    const paymentModalHtml = `
    <div id="paymentModal" class="modal" style="display: none;">
        <div class="modal-content payment-modal" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="position: relative;">
                <h2>💳 Payment Settings</h2>
                <span class="close" id="closePaymentModal" style="position: absolute; top: 15px; right: 20px; font-size: 28px; cursor: pointer; color: #aaa;">&times;</span>
            </div>
            <div class="modal-body" style="padding: 2rem;">
                <div class="withdrawal-info" style="margin-bottom: 2rem;">
                    <div class="balance-card" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; padding: 2rem; text-align: center;">
                        <div class="balance-amount" style="font-size: 2.5rem; font-weight: 700; color: var(--primary-color); margin-bottom: 0.5rem;">$0</div>
                        <div class="balance-label" style="color: rgba(255,255,255,0.8); font-size: 1.1rem; margin-bottom: 0.5rem;">Available Balance</div>
                        <div class="minimum-note" style="color: rgba(255,255,255,0.6); font-size: 0.9rem;">You can withdraw when you have $50</div>
                    </div>
                </div>
                
                <form id="paymentForm" class="payment-form">
                    <div class="form-section" style="margin-bottom: 2rem;">
                        <h3 style="color: var(--text-light); margin-bottom: 1rem;">Select Payment Method</h3>
                        <div class="payment-methods" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                            <label class="payment-method-option" style="cursor: pointer;">
                                <input type="radio" name="withdrawalMethod" value="bank" style="display: none;" ${paymentSettings.withdrawalMethod === 'bank' ? 'checked' : ''}>
                                <div class="payment-method-card" style="background: var(--glass-bg); border: 2px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1.5rem; text-align: center; transition: all 0.3s ease; cursor: pointer;">
                                    <i class="fas fa-university" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                                    <span style="display: block; color: var(--text-light); font-weight: 500;">Bank Transfer</span>
                                </div>
                            </label>
                            
                            <label class="payment-method-option" style="cursor: pointer;">
                                <input type="radio" name="withdrawalMethod" value="payoneer" style="display: none;" ${paymentSettings.withdrawalMethod === 'payoneer' ? 'checked' : ''}>
                                <div class="payment-method-card" style="background: var(--glass-bg); border: 2px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1.5rem; text-align: center; transition: all 0.3s ease; cursor: pointer;">
                                    <i class="fas fa-credit-card" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                                    <span style="display: block; color: var(--text-light); font-weight: 500;">Payoneer</span>
                                </div>
                            </label>
                            
                            <label class="payment-method-option" style="cursor: pointer;">
                                <input type="radio" name="withdrawalMethod" value="paypal" style="display: none;" ${paymentSettings.withdrawalMethod === 'paypal' ? 'checked' : ''}>
                                <div class="payment-method-card" style="background: var(--glass-bg); border: 2px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1.5rem; text-align: center; transition: all 0.3s ease; cursor: pointer;">
                                    <i class="fab fa-paypal" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                                    <span style="display: block; color: var(--text-light); font-weight: 500;">PayPal</span>
                                </div>
                            </label>
                            
                            <label class="payment-method-option" style="cursor: pointer;">
                                <input type="radio" name="withdrawalMethod" value="stripe" style="display: none;" ${paymentSettings.withdrawalMethod === 'stripe' ? 'checked' : ''}>
                                <div class="payment-method-card" style="background: var(--glass-bg); border: 2px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1.5rem; text-align: center; transition: all 0.3s ease; cursor: pointer;">
                                    <i class="fab fa-stripe" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                                    <span style="display: block; color: var(--text-light); font-weight: 500;">Stripe</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Bank Transfer Details -->
                    <div class="payment-details" id="bankDetails" style="display: ${paymentSettings.withdrawalMethod === 'bank' ? 'block' : 'none'}; margin-bottom: 2rem;">
                        <h3 style="color: var(--text-light); margin-bottom: 1rem;">Bank Account Details</h3>
                        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <input type="text" placeholder="Account Holder Name" value="${paymentSettings.bankDetails.accountHolderName}" id="accountHolderName" class="form-input" style="background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.2); color: var(--text-light); padding: 0.75rem; border-radius: 8px; outline: none;">
                            <input type="text" placeholder="Bank Name" value="${paymentSettings.bankDetails.bankName}" id="bankName" class="form-input" style="background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.2); color: var(--text-light); padding: 0.75rem; border-radius: 8px; outline: none;">
                        </div>
                        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <input type="text" placeholder="Account Number" value="${paymentSettings.bankDetails.accountNumber}" id="accountNumber" class="form-input" style="background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.2); color: var(--text-light); padding: 0.75rem; border-radius: 8px; outline: none;">
                            <input type="text" placeholder="Routing Number" value="${paymentSettings.bankDetails.routingNumber}" id="routingNumber" class="form-input" style="background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.2); color: var(--text-light); padding: 0.75rem; border-radius: 8px; outline: none;">
                        </div>
                    </div>
                    
                    <!-- Payoneer Details -->
                    <div class="payment-details" id="payoneerDetails" style="display: ${paymentSettings.withdrawalMethod === 'payoneer' ? 'block' : 'none'}; margin-bottom: 2rem;">
                        <h3 style="color: var(--text-light); margin-bottom: 1rem;">Payoneer Account</h3>
                        <input type="email" placeholder="Payoneer Email Address" value="${paymentSettings.payoneerEmail}" id="payoneerEmail" class="form-input" style="width: 100%; background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.2); color: var(--text-light); padding: 0.75rem; border-radius: 8px; outline: none; margin-bottom: 0.5rem;">
                        <div class="form-help" style="color: rgba(255,255,255,0.6); font-size: 0.875rem;">Enter the email address associated with your Payoneer account</div>
                    </div>
                    
                    <!-- PayPal Details -->
                    <div class="payment-details" id="paypalDetails" style="display: ${paymentSettings.withdrawalMethod === 'paypal' ? 'block' : 'none'}; margin-bottom: 2rem;">
                        <h3 style="color: var(--text-light); margin-bottom: 1rem;">PayPal Account</h3>
                        <input type="email" placeholder="PayPal Email Address" value="${paymentSettings.paypalEmail}" id="paypalEmail" class="form-input" style="width: 100%; background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.2); color: var(--text-light); padding: 0.75rem; border-radius: 8px; outline: none; margin-bottom: 0.5rem;">
                        <div class="form-help" style="color: rgba(255,255,255,0.6); font-size: 0.875rem;">Enter your PayPal email address for payments</div>
                    </div>
                    
                    <!-- Stripe Details -->
                    <div class="payment-details" id="stripeDetails" style="display: ${paymentSettings.withdrawalMethod === 'stripe' ? 'block' : 'none'}; margin-bottom: 2rem;">
                        <h3 style="color: var(--text-light); margin-bottom: 1rem;">Stripe Connect</h3>
                        <div class="stripe-connect-card" style="background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem;">
                            <i class="fab fa-stripe" style="font-size: 2rem; color: var(--primary-color);"></i>
                            <div class="stripe-connect-content" style="flex: 1;">
                                <div class="stripe-status" style="margin-bottom: 0.5rem;">
                                    ${paymentSettings.stripeConnected ? 
                                        '<span class="connected" style="color: #10b981;">✅ Connected</span>' : 
                                        '<span class="not-connected" style="color: #ef4444;">❌ Not Connected</span>'
                                    }
                                </div>
                                <button type="button" class="stripe-connect-btn" id="stripeConnectBtn" style="background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; cursor: pointer;">
                                    ${paymentSettings.stripeConnected ? 'Reconnect' : 'Connect'} Stripe Account
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions" style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" class="btn btn-secondary" id="cancelPayment" style="background: rgba(255,255,255,0.1); color: var(--text-light); border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">Cancel</button>
                        <button type="submit" class="btn btn-primary" style="background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-save"></i>
                            Save Payment Settings
                        </button>
                    </div>
                </form>
                
                <div class="withdrawal-section" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="color: var(--text-light); margin-bottom: 1rem;">Request Withdrawal</h3>
                    <div class="withdrawal-form">
                        <div class="withdrawal-amount" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                            <input type="number" placeholder="Amount ($)" min="50" max="0" id="withdrawalAmount" class="form-input" style="flex: 1; background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.2); color: var(--text-light); padding: 0.75rem; border-radius: 8px; outline: none;" disabled>
                            <button type="button" class="btn btn-primary" id="requestWithdrawal" disabled style="background: rgba(102, 126, 234, 0.3); color: rgba(255,255,255,0.5); border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: not-allowed;">
                                Request Withdrawal
                            </button>
                        </div>
                        <div class="withdrawal-note" style="color: rgba(255,255,255,0.7); font-size: 0.9rem; text-align: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                            You can withdraw when you have $50 in your account
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', paymentModalHtml);
    
    // Add CSS for payment method selection
    const style = document.createElement('style');
    style.textContent = `
        .payment-method-option input[type="radio"]:checked + .payment-method-card {
            border-color: var(--primary-color) !important;
            background: rgba(102, 126, 234, 0.1) !important;
        }
        .payment-method-card:hover {
            border-color: var(--accent-color) !important;
            background: rgba(255, 255, 255, 0.08) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize payment modal events
    initializePaymentModalEvents();
}

// Initialize payment modal events
function initializePaymentModalEvents() {
    // Show/hide payment modal
    const paymentBtn = document.getElementById('paymentSettingsBtn');
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const cancelPayment = document.getElementById('cancelPayment');
    
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
    
    if (cancelPayment) {
        cancelPayment.addEventListener('click', () => {
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
            showNotification('✅ Payment settings saved successfully!', 'success');
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
            showNotification('✅ Stripe account connected successfully!', 'success');
            
            // Update button text
            stripeConnectBtn.textContent = 'Reconnect Stripe Account';
            document.querySelector('.stripe-status').innerHTML = '<span class="connected" style="color: #10b981;">✅ Connected</span>';
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
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize charts with 0 data
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

// Generate chart data - all 0s for static site
function generateChartData() {
    const labels = [];
    const views = [];
    const clicks = [];
    const earnings = [];
    
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        views.push(0);
        clicks.push(0);
        earnings.push(0);
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
});

// Make function available globally
window.updateDashboardStats = updateDashboardStats;