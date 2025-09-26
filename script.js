// Main JavaScript functionality for AffiliateForge
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
    initializeProgressAnimation();
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
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
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
                                link.setAttribute('target', '_blank');
                                link.setAttribute('rel', 'noopener noreferrer');
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

// Initialize stats system
function initializeStats() {
    loadStats();
    
    // Increment page views
    stats.totalViews++;
    saveStats();
    
    // Update displays if elements exist
    updateStatsDisplay();
}

// Load stats from localStorage
function loadStats() {
    const savedStats = localStorage.getItem('affiliateStats');
    if (savedStats) {
        const parsed = JSON.parse(savedStats);
        stats = { ...stats, ...parsed };
    }
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('affiliateStats', JSON.stringify(stats));
}

// Update stats display on page
function updateStatsDisplay() {
    // Update hero stats if they exist
    const heroStats = document.querySelectorAll('.hero-stats .stat-number');
    if (heroStats.length >= 4) {
        heroStats[0].textContent = stats.totalViews.toLocaleString();
        heroStats[1].textContent = '25'; // Tools compared (static)
        heroStats[2].textContent = Math.floor(stats.totalViews * 0.1).toLocaleString(); // Success stories
        heroStats[3].textContent = `$${stats.totalEarnings.toLocaleString()}`; // Revenue
    }
}

// Initialize progress animation for hero stats
function initializeProgressAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const current = parseInt(stat.textContent) || 0;
            const increment = Math.ceil(target / 50);
            
            if (current < target) {
                stat.textContent = Math.min(current + increment, target);
                setTimeout(animateStats, 50);
            }
        });
    };
    
    // Start animation when stats section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.disconnect();
            }
        });
    });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Track clicks on tools/links
function trackClick(toolName) {
    stats.totalClicks++;
    stats.conversionRate = stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100) : 0;
    
    // Add earnings based on click ($12.50 base + progressive bonus)
    const baseEarning = 12.50;
    const progressiveBonus = stats.progressionStarted ? Math.min(stats.totalClicks * 0.5, 32.5) : 0;
    stats.totalEarnings = (stats.totalClicks * baseEarning) + progressiveBonus;
    
    saveStats();
    updateStatsDisplay();
    
    console.log(`Tracked click on ${toolName}`);
}

// Enhanced dashboard functionality
function initializeDashboardEnhancements() {
    // Initialize copy detection
    initializeCopyDetection();
    
    // Start intelligent progression if link was copied
    if (stats.linkCopied && stats.firstCopyTime) {
        startIntelligentProgression();
    }
    
    // Update dashboard every 30 seconds to show real-time progression
    setInterval(() => {
        if (stats.progressionStarted) {
            updateProgressiveStats();
        }
    }, 30000);
}

// Initialize copy detection with intelligence
function initializeCopyDetection() {
    const copyBtn = document.getElementById('copyLinkBtn');
    const affiliateLink = document.getElementById('affiliateLink');
    
    if (copyBtn && affiliateLink) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(affiliateLink.value);
                
                // Mark as copied and start progression
                if (!stats.linkCopied) {
                    stats.linkCopied = true;
                    stats.firstCopyTime = Date.now();
                    stats.progressionStarted = true;
                    stats.lastProgressUpdate = Date.now();
                    saveStats();
                    
                    // Start the intelligent progression
                    startIntelligentProgression();
                }
                
                // Visual feedback
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    copyBtn.classList.remove('copied');
                }, 2000);
                
                // Show encouraging message
                showProgressNotification('🚀 Link copied! Your earning progression has started!');
                
            } catch (err) {
                // Fallback for older browsers
                affiliateLink.select();
                document.execCommand('copy');
                
                if (!stats.linkCopied) {
                    stats.linkCopied = true;
                    stats.firstCopyTime = Date.now();
                    stats.progressionStarted = true;
                    stats.lastProgressUpdate = Date.now();
                    saveStats();
                    startIntelligentProgression();
                }
                
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

// Start intelligent progression system
function startIntelligentProgression() {
    if (!stats.progressionStarted || !stats.firstCopyTime) return;
    
    // Calculate realistic progression
    updateProgressiveStats();
    
    // Set up regular updates
    const progressInterval = setInterval(() => {
        updateProgressiveStats();
        
        // Stop progression at $45 or after 45 days
        const daysSinceCopy = Math.floor((Date.now() - stats.firstCopyTime) / (24 * 60 * 60 * 1000));
        if (daysSinceCopy >= 45 || stats.totalEarnings >= 45) {
            clearInterval(progressInterval);
        }
    }, 60000); // Update every minute for real-time feel
}

// Update progressive stats intelligently
function updateProgressiveStats() {
    if (!stats.firstCopyTime) return;
    
    const now = Date.now();
    const timeSinceCopy = now - stats.firstCopyTime;
    const daysSinceCopy = Math.floor(timeSinceCopy / (24 * 60 * 60 * 1000));
    const hoursSinceCopy = Math.floor(timeSinceCopy / (60 * 60 * 1000));
    
    // Progressive earnings: Start slow, accelerate, then stabilize
    let newEarnings = 0;
    
    if (daysSinceCopy === 0) {
        // First day: gradual increase from $0 to $1
        const hoursProgress = Math.min(hoursSinceCopy / 24, 1);
        newEarnings = Math.floor(hoursProgress * 100) / 100; // Smooth progression to $1
    } else if (daysSinceCopy <= 45) {
        // Days 1-45: $1 per day progression
        newEarnings = Math.min(daysSinceCopy, 45);
        
        // Add intraday progression for current day
        if (daysSinceCopy < 45) {
            const currentDayHours = hoursSinceCopy - (daysSinceCopy * 24);
            const intradayProgress = (currentDayHours / 24) * 0.8; // Up to 80% of next dollar
            newEarnings += Math.min(intradayProgress, 0.8);
        }
    } else {
        newEarnings = 45; // Cap at $45
    }
    
    // Update views and clicks to match earnings progression
    const baseViews = Math.max(stats.totalViews, daysSinceCopy * 3 + Math.floor(Math.random() * 5));
    const baseClicks = Math.max(stats.totalClicks, Math.floor(newEarnings * 1.2) + Math.floor(Math.random() * 2));
    
    // Only update if values increased
    if (newEarnings > stats.totalEarnings) {
        stats.totalEarnings = Math.floor(newEarnings * 100) / 100;
        stats.totalViews = Math.max(stats.totalViews, baseViews);
        stats.totalClicks = Math.max(stats.totalClicks, baseClicks);
        stats.conversionRate = stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100) : 0;
        stats.lastProgressUpdate = now;
        
        saveStats();
        updateStatsDisplay();
        
        // Update dashboard if on dashboard page
        if (typeof updateDashboardStats === 'function') {
            updateDashboardStats();
        }
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
window.updateProgressiveStats = updateProgressiveStats;