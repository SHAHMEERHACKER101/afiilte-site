// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const modal = document.getElementById('earningsModal');
const closeBtn = document.querySelector('.close');
const goToDashboardBtn = document.getElementById('goToDashboard');

// Stats storage
let stats = {
    totalViews: 0,
    totalClicks: 0,
    totalUsers: 0,
    toolsCompared: 0,
    successStories: 0,
    totalRevenue: "$0"
};

// Load stats from localStorage
function loadStats() {
    const savedStats = localStorage.getItem('affiliateStats');
    if (savedStats) {
        stats = JSON.parse(savedStats);
    }
    updateStatsDisplay();
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('affiliateStats', JSON.stringify(stats));
}

// Update stats display
function updateStatsDisplay() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = stats.totalUsers.toLocaleString();
        statNumbers[1].textContent = stats.toolsCompared.toString();
        statNumbers[2].textContent = stats.successStories.toLocaleString();
        statNumbers[3].textContent = stats.totalRevenue;
    }
}

// Track clicks
function trackClick(toolName) {
    stats.totalClicks += 1;
    saveStats();
    
    // Update dashboard if it exists
    if (typeof updateDashboardStats === 'function') {
        updateDashboardStats();
    }
    
    console.log(`Clicked on ${toolName}. Total clicks: ${stats.totalClicks}`);
}

// Mobile Navigation Toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Modal Functions
function showModal() {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Modal Event Listeners
if (closeBtn) {
    closeBtn.addEventListener('click', hideModal);
}

if (goToDashboardBtn) {
    goToDashboardBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
}

// Close modal when clicking outside
if (modal) {
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });
}

// Show earnings modal on page load (after delay)
document.addEventListener('DOMContentLoaded', () => {
    // Load stats first
    loadStats();
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Show modal after 3 seconds if not shown in this session
    const modalShown = sessionStorage.getItem('modalShown');
    if (!modalShown) {
        setTimeout(() => {
            showModal();
            sessionStorage.setItem('modalShown', 'true');
        }, 3000);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(26, 26, 26, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(26, 26, 26, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
        });
    }
});

// Counter animation for stats
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
}

// Intersection Observer for counter animation
const observeCounters = () => {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => observer.observe(counter));
};

// Initialize counter animation
document.addEventListener('DOMContentLoaded', observeCounters);

// Export functions for use in other files
window.trackClick = trackClick;
window.showModal = showModal;
window.hideModal = hideModal;