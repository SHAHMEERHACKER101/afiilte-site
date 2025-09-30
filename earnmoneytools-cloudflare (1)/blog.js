// Blog functionality for AffiliateForge
let blogPosts = [];
let filteredPosts = [];
let currentCategory = 'all';

// Initialize blog functionality
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    initializeBlogCreation();
    initializeFilters();
    initializeSearch();
    renderBlogPosts();
});

// Load blog posts from localStorage
function loadBlogPosts() {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        // Create default posts for SEO
        blogPosts = [
            {
                id: 1,
                title: "10 Best Affiliate Marketing Tools for 2025",
                content: "Discover the top affiliate marketing tools that can help you maximize your earnings and streamline your marketing efforts. From analytics platforms to automation tools, we cover everything you need to succeed in affiliate marketing.",
                author: "AffiliateForge Team",
                category: "affiliate-marketing",
                tags: ["tools", "marketing", "affiliate", "2025"],
                publishDate: new Date().toISOString(),
                readTime: 8,
                featured: true,
                metaDescription: "Complete guide to the best affiliate marketing tools for 2025. Boost your earnings with these proven platforms and strategies.",
                keywords: "affiliate marketing tools, best affiliate tools 2025, marketing automation, affiliate platforms"
            },
            {
                id: 2,
                title: "How to Start Forex Trading with Exness: Complete Beginner's Guide",
                content: "Learn how to start forex trading with Exness, one of the most trusted forex brokers. This comprehensive guide covers account setup, trading strategies, risk management, and tips for beginners to succeed in forex trading.",
                author: "Trading Expert",
                category: "forex",
                tags: ["forex", "exness", "trading", "beginner"],
                publishDate: new Date(Date.now() - 86400000).toISOString(),
                readTime: 12,
                featured: true,
                metaDescription: "Complete beginner's guide to forex trading with Exness. Learn strategies, risk management, and how to start trading profitably.",
                keywords: "forex trading, exness broker, forex for beginners, trading strategies, currency trading"
            },
            {
                id: 3,
                title: "Systeme.io vs ClickFunnels: Which is Better for Your Business?",
                content: "Detailed comparison between Systeme.io and ClickFunnels. We analyze features, pricing, ease of use, and performance to help you choose the right funnel builder for your business needs.",
                author: "Business Tools Review",
                category: "tools-comparison",
                tags: ["systeme.io", "clickfunnels", "comparison", "funnel-builder"],
                publishDate: new Date(Date.now() - 172800000).toISOString(),
                readTime: 10,
                featured: false,
                metaDescription: "Systeme.io vs ClickFunnels comparison. Features, pricing, and performance analysis to help you choose the best funnel builder.",
                keywords: "systeme.io vs clickfunnels, funnel builder comparison, marketing tools, sales funnels"
            },
            {
                id: 4,
                title: "Create Stunning Videos with InVideo: Tips and Tricks",
                content: "Master InVideo with our comprehensive tips and tricks guide. Learn how to create professional videos, use templates effectively, and leverage AI features to produce engaging content that converts.",
                author: "Video Marketing Pro",
                category: "video-marketing",
                tags: ["invideo", "video-creation", "content-marketing", "ai-tools"],
                publishDate: new Date(Date.now() - 259200000).toISOString(),
                readTime: 6,
                featured: false,
                metaDescription: "Master InVideo with our comprehensive guide. Create professional videos with AI-powered tools and proven strategies.",
                keywords: "invideo tutorial, video creation, ai video tools, video marketing, content creation"
            }
        ];
        saveBlogPosts();
    }
    filteredPosts = [...blogPosts];
}

// Save blog posts to localStorage
function saveBlogPosts() {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
}

// Initialize blog creation functionality
function initializeBlogCreation() {
    const createBtn = document.getElementById('createPostBtn');
    const modal = document.getElementById('createPostModal');
    const closeModal = document.querySelector('#createPostModal .close');
    const form = document.getElementById('createPostForm');
    
    if (createBtn && modal) {
        createBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (form) {
        form.addEventListener('submit', handlePostCreation);
    }
    
    // Close modal on outside click
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Handle blog post creation
function handlePostCreation(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');
    const tags = formData.get('tags').split(',').map(tag => tag.trim());
    const metaDescription = formData.get('metaDescription');
    const keywords = formData.get('keywords');
    
    // Create new post
    const newPost = {
        id: Date.now(),
        title,
        content,
        author: "AffiliateForge User",
        category,
        tags,
        publishDate: new Date().toISOString(),
        readTime: Math.ceil(content.split(' ').length / 200), // Estimate reading time
        featured: false,
        metaDescription,
        keywords
    };
    
    // Add to posts array
    blogPosts.unshift(newPost); // Add to beginning
    saveBlogPosts();
    
    // Update filtered posts and re-render
    applyCurrentFilters();
    renderBlogPosts();
    
    // Close modal and reset form
    document.getElementById('createPostModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    event.target.reset();
    
    // Show success message
    showNotification('Blog post created successfully!', 'success');
}

// Initialize filters
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Apply filter
            currentCategory = btn.dataset.category;
            applyCurrentFilters();
            renderBlogPosts();
        });
    });
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            applyCurrentFilters(e.target.value);
            renderBlogPosts();
        });
    }
}

// Apply current filters
function applyCurrentFilters(searchTerm = '') {
    filteredPosts = blogPosts.filter(post => {
        const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
        const matchesSearch = searchTerm === '' || 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesCategory && matchesSearch;
    });
}

// Render blog posts
function renderBlogPosts() {
    const postsContainer = document.getElementById('blogPosts');
    
    if (!postsContainer) return;
    
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-search"></i>
                <h3>No posts found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    postsContainer.innerHTML = filteredPosts.map(post => `
        <article class="blog-post-card" data-aos="fade-up">
            <div class="post-header">
                <div class="post-meta">
                    <span class="post-category ${post.category}">${getCategoryLabel(post.category)}</span>
                    <span class="post-date">${formatDate(post.publishDate)}</span>
                    <span class="read-time"><i class="fas fa-clock"></i> ${post.readTime} min read</span>
                </div>
                ${post.featured ? '<span class="featured-badge">Featured</span>' : ''}
            </div>
            
            <div class="post-content">
                <h2 class="post-title">${post.title}</h2>
                <p class="post-excerpt">${getExcerpt(post.content)}</p>
                
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="post-footer">
                <div class="post-author">
                    <i class="fas fa-user"></i>
                    <span>By ${post.author}</span>
                </div>
                <div class="post-actions">
                    <button class="btn btn-outline" onclick="readPost(${post.id})">
                        Read More <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// Get category label
function getCategoryLabel(category) {
    const labels = {
        'affiliate-marketing': 'Affiliate Marketing',
        'forex': 'Forex Trading',
        'tools-comparison': 'Tools & Reviews',
        'video-marketing': 'Video Marketing',
        'seo': 'SEO & Growth',
        'business': 'Business Tips'
    };
    return labels[category] || category;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Get excerpt from content
function getExcerpt(content, length = 150) {
    if (content.length <= length) return content;
    return content.substring(0, length).trim() + '...';
}

// Read full post (opens in modal or new page)
function readPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Create and show post modal
    const modal = createPostModal(post);
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Create post reading modal
function createPostModal(post) {
    const modal = document.createElement('div');
    modal.className = 'modal post-modal';
    modal.innerHTML = `
        <div class="modal-content post-modal-content">
            <div class="post-modal-header">
                <button class="close-post-modal">&times;</button>
                <div class="post-modal-meta">
                    <span class="post-category ${post.category}">${getCategoryLabel(post.category)}</span>
                    <span class="post-date">${formatDate(post.publishDate)}</span>
                    <span class="read-time"><i class="fas fa-clock"></i> ${post.readTime} min read</span>
                </div>
            </div>
            
            <div class="post-modal-body">
                <h1 class="post-modal-title">${post.title}</h1>
                
                <div class="post-modal-author">
                    <i class="fas fa-user"></i>
                    <span>By ${post.author}</span>
                </div>
                
                <div class="post-modal-content-text">
                    ${formatPostContent(post.content)}
                </div>
                
                <div class="post-modal-tags">
                    ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                
                <div class="post-modal-share">
                    <h3>Share this post</h3>
                    <div class="share-buttons">
                        <button class="share-btn facebook" onclick="sharePost('facebook', '${post.title}')">
                            <i class="fab fa-facebook"></i> Facebook
                        </button>
                        <button class="share-btn twitter" onclick="sharePost('twitter', '${post.title}')">
                            <i class="fab fa-twitter"></i> Twitter
                        </button>
                        <button class="share-btn linkedin" onclick="sharePost('linkedin', '${post.title}')">
                            <i class="fab fa-linkedin"></i> LinkedIn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add close functionality
    const closeBtn = modal.querySelector('.close-post-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
    
    return modal;
}

// Format post content for display
function formatPostContent(content) {
    // Convert line breaks to paragraphs
    return content.split('\n\n').map(paragraph => 
        `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
    ).join('');
}

// Share post functionality
function sharePost(platform, title) {
    const url = window.location.href;
    const text = `Check out this article: ${title}`;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Make functions globally available
window.readPost = readPost;
window.sharePost = sharePost;