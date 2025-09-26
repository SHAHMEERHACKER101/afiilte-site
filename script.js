// Main JavaScript functionality for Earn Money Tools
let stats = {
    totalViews: 0,
    totalClicks: 0,
    totalEarnings: 0,
    conversionRate: 0,
    progressionStarted: false,
    linkCopied: false,
    firstCopyTime: null,
    lastProgressUpdate: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeModal();
    initializeStats();
    makeAllLinksOpenNewTab();
    
    // Check if we're on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboardEnhancements();
    }
});

// Make ALL links open in new tab including affiliate links
function makeAllLinksOpenNewTab() {
    // Get all links on the page
    const allLinks = document.querySelectorAll('a[href]');
    
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip internal navigation links (anchors and same-page links)
        if (!href.startsWith('#') && !href.startsWith('javascript:') && href !== '') {
            // Don't override if already has target="_blank" set
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        }
    });
    
    // Also handle dynamically created links
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const newLinks = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
                        newLinks.forEach(link => {
                            const href = link.getAttribute('href');
                            if (!href.startsWith('#') && !href.startsWith('javascript:') && href !== '') {
                                if (!link.hasAttribute('target')) {
                                    link.setAttribute('target', '_blank');
                                    link.setAttribute('rel', 'noopener noreferrer');
                                }
                            }
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Initialize earnings popup modal
function initializeModal() {
    const modal = document.getElementById('earningsModal');
    const closeModal = document.querySelector('.close');
    const goToDashboard = document.getElementById('goToDashboard');
    
    if (modal) {
        // Show modal after 3 seconds on homepage
        if (window.location.pathname === '/' || window.location.pathname.includes('index.html') || window.location.pathname === '/app/affiliate-site/index.html') {
            setTimeout(() => {
                // Only show once per session
                if (!sessionStorage.getItem('modalShown')) {
                    modal.style.display = 'block';
                    sessionStorage.setItem('modalShown', 'true');
                }
            }, 3000);
        }
        
        // Close modal events
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        if (goToDashboard) {
            goToDashboard.addEventListener('click', () => {
                window.open('dashboard.html', '_blank');
                modal.style.display = 'none';
            });
        }
        
        // Close on outside click
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Initialize stats system - keep at 0 for static site
function initializeStats() {
    // Keep all stats at 0 for static site deployment
    stats = {
        totalViews: 0,
        totalClicks: 0,
        totalEarnings: 0,
        conversionRate: 0,
        progressionStarted: false,
        linkCopied: false,
        firstCopyTime: null,
        lastProgressUpdate: null
    };
    
    // Don't save to localStorage for static site
    // Update displays if elements exist
    updateStatsDisplay();
}

// Update stats display on page - keep at 0 for dashboard
function updateStatsDisplay() {
    // For static site, keep dashboard stats at 0
    if (window.location.pathname.includes('dashboard.html')) {
        const totalViewsElement = document.getElementById('totalViews');
        const totalClicksElement = document.getElementById('totalClicks');
        const totalEarningsElement = document.getElementById('totalEarnings');
        const conversionRateElement = document.getElementById('conversionRate');
        
        if (totalViewsElement) totalViewsElement.textContent = '0';
        if (totalClicksElement) totalClicksElement.textContent = '0';
        if (totalEarningsElement) totalEarningsElement.textContent = '$0';
        if (conversionRateElement) conversionRateElement.textContent = '0.0%';
        
        // Update today's changes to show +0
        const statChanges = document.querySelectorAll('.stats-grid .stat-change');
        statChanges.forEach(change => {
            if (change.textContent.includes('today')) {
                change.textContent = '+0 today';
            }
        });
    }
}

// Track clicks on tools/links - keep stats at 0 for static site
function trackClick(toolName) {
    // For static site, don't increment stats
    console.log(`Tracked click on ${toolName}`);
    // Keep stats at 0
}

// Enhanced dashboard functionality
function initializeDashboardEnhancements() {
    // Initialize copy detection
    initializeCopyDetection();
    
    // Update dashboard display to show 0s
    updateStatsDisplay();
}

// Initialize copy detection 
function initializeCopyDetection() {
    const copyBtn = document.getElementById('copyLinkBtn');
    const affiliateLink = document.getElementById('affiliateLink');
    
    if (copyBtn && affiliateLink) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(affiliateLink.value);
                
                // Visual feedback only - don't start progression for static site
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
                
                // Show message
                showProgressNotification('💰 Link copied! Share it to start earning!');
                
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
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
        font-size: 0.9rem;
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
    }, 4000);
}

// AOS Animation initialization (if AOS is loaded)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
}

// Make functions globally available
window.trackClick = trackClick;