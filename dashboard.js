// Dashboard specific functionality
let dashboardStats = {
    totalViews: 0,
    totalClicks: 0,
    totalEarnings: 0,
    conversionRate: 0
};

// Charts
let performanceChart = null;
let earningsChart = null;

// Load dashboard stats
function loadDashboardStats() {
    const savedStats = localStorage.getItem('affiliateStats');
    if (savedStats) {
        const stats = JSON.parse(savedStats);
        dashboardStats = {
            totalViews: stats.totalViews || 0,
            totalClicks: stats.totalClicks || 0,
            totalEarnings: (stats.totalClicks || 0) * 12.50, // $12.50 per click
            conversionRate: stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100) : 0
        };
    }
    updateDashboardDisplay();
}

// Helper function to format numbers with K/M suffix
function formatDashboardNumber(num, includeDollar = false) {
    if (num >= 1000000) {
        const formatted = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        return includeDollar ? '$' + formatted : formatted;
    } else if (num >= 1000) {
        const formatted = (num / 1000).toFixed(0) + 'K';
        return includeDollar ? '$' + formatted : formatted;
    }
    return includeDollar ? '$' + num.toString() : num.toString();
}

// Update dashboard display
function updateDashboardDisplay() {
    document.getElementById('totalViews').textContent = formatDashboardNumber(dashboardStats.totalViews);
    document.getElementById('totalClicks').textContent = formatDashboardNumber(dashboardStats.totalClicks);
    document.getElementById('totalEarnings').textContent = formatDashboardNumber(dashboardStats.totalEarnings, true);
    document.getElementById('conversionRate').textContent = `${dashboardStats.conversionRate.toFixed(1)}%`;
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

// Initialize charts
function initializeCharts() {
    // Generate mock data for the last 30 days
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

// Generate mock chart data
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
        
        // Generate realistic data based on current stats
        const baseViews = dashboardStats.totalViews > 0 ? Math.floor(dashboardStats.totalViews / 30) : 0;
        const baseClicks = dashboardStats.totalClicks > 0 ? Math.floor(dashboardStats.totalClicks / 30) : 0;
        
        views.push(Math.max(0, baseViews + Math.floor(Math.random() * 5) - 2));
        clicks.push(Math.max(0, baseClicks + Math.floor(Math.random() * 2) - 1));
        earnings.push(clicks[clicks.length - 1] * 12.50);
    }
    
    return { labels, views, clicks, earnings };
}

// Update dashboard stats (called from main script)
function updateDashboardStats() {
    loadDashboardStats();
    
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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    initializeCopyButton();
    
    // Initialize charts after a short delay to ensure canvas elements are ready
    setTimeout(() => {
        initializeCharts();
    }, 100);
    
    // Add click tracking to affiliate link
    const promoteBtn = document.querySelector('.promote-link-btn');
    if (promoteBtn) {
        promoteBtn.addEventListener('click', () => {
            // Track the click but don't open in new tab (as per requirements)
            if (typeof trackClick === 'function') {
                trackClick('main-affiliate');
            }
        });
    }
    
    // Add target="_blank" to all external links in quick actions (as per requirements)
    const actionCards = document.querySelectorAll('.action-card[href^="https"]');
    actionCards.forEach(card => {
        card.setAttribute('target', '_blank');
    });
});

// Make function available globally
window.updateDashboardStats = updateDashboardStats;