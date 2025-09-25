// Blog functionality
let blogPosts = [];

// Default blog posts
const defaultPosts = [
    {
        id: '1',
        title: 'Systeme.io vs ClickFunnels: Which Funnel Builder is Best in 2025?',
        description: 'A comprehensive comparison of the two leading funnel builders to help you choose the right platform for your business.',
        category: 'comparisons',
        readTime: '12 min read',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        keywords: ['systeme.io', 'clickfunnels', 'funnel builder', 'comparison', '2025'],
        content: 'Detailed comparison content goes here...',
        publishDate: new Date().toISOString(),
        author: 'AffiliateForge Team'
    },
    {
        id: '2',
        title: 'Top 10 Free Funnel Builders for Beginners',
        description: 'Start building sales funnels without breaking the bank with these free and budget-friendly options.',
        category: 'tool-reviews',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        keywords: ['free funnel builders', 'beginners', 'sales funnels', 'budget', 'startup'],
        content: 'Comprehensive guide to free funnel builders...',
        publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'AffiliateForge Team'
    },
    {
        id: '3',
        title: 'Best Forex Apps for Beginners in 2025',
        description: 'Navigate the forex market with these user-friendly apps designed for new traders.',
        category: 'tool-reviews',
        readTime: '10 min read',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        keywords: ['forex apps', 'beginners', 'trading', 'mobile', '2025'],
        content: 'Complete guide to forex trading apps...',
        publishDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'AffiliateForge Team'
    },
    {
        id: '4',
        title: 'How to Boost Your Affiliate Marketing ROI by 300%',
        description: 'Proven strategies and tactics to dramatically increase your affiliate marketing returns and maximize your earnings.',
        category: 'growth-tips',
        readTime: '15 min read',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        keywords: ['affiliate marketing', 'ROI', 'growth strategies', 'optimization', 'conversions'],
        content: 'Advanced affiliate marketing strategies...',
        publishDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        author: 'AffiliateForge Team'
    }
];

// Load blog posts from localStorage
function loadBlogPosts() {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        blogPosts = [...defaultPosts];
        saveBlogPosts();
    }
    renderBlogPosts();
    updateCategoryCounts();
}

// Save blog posts to localStorage
function saveBlogPosts() {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
}

// Render blog posts
function renderBlogPosts(postsToRender = blogPosts) {
    const container = document.getElementById('blogPostsGrid');
    
    if (postsToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3 class="empty-state-title">No posts found</h3>
                <p class="empty-state-description">
                    ${blogPosts.length === 0 ? 'Create your first blog post to get started!' : 'Try selecting a different category or create a new post.'}
                </p>
                <button class="create-post-btn" onclick="showCreatePostModal()">
                    <i class="fas fa-plus"></i>
                    Create Your First Post
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = postsToRender.map(post => `
        <article class="blog-post-card" data-aos="fade-up">
            <img src="${post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'}" 
                 alt="${post.title}" 
                 class="blog-post-image"
                 onerror="this.src='https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'">
            <div class="blog-post-content">
                <div class="blog-post-meta">
                    <span class="blog-post-category">${getCategoryDisplayName(post.category)}</span>
                    <span class="blog-post-read-time">${post.readTime}</span>
                </div>
                <h3 class="blog-post-title">${post.title}</h3>
                <p class="blog-post-description">${post.description}</p>
                <div class="blog-post-actions">
                    <a href="#" onclick="viewPost('${post.id}')" class="read-more-btn">Read More</a>
                    <div class="post-actions">
                        <button onclick="editPost('${post.id}')" class="post-action-btn" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deletePost('${post.id}')" class="post-action-btn delete-btn" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `).join('');
}

// Get category display name
function getCategoryDisplayName(category) {
    const categoryNames = {
        'tool-reviews': 'Tool Reviews',
        'comparisons': 'Comparisons',
        'growth-tips': 'Growth Tips',
        'monetization': 'Monetization'
    };
    return categoryNames[category] || category;
}

// Update category counts
function updateCategoryCounts() {
    const counts = blogPosts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
    }, {});

    document.getElementById('toolReviewsCount').textContent = `${counts['tool-reviews'] || 0} posts`;
    document.getElementById('comparisonsCount').textContent = `${counts['comparisons'] || 0} posts`;
    document.getElementById('growthTipsCount').textContent = `${counts['growth-tips'] || 0} posts`;
    document.getElementById('monetizationCount').textContent = `${counts['monetization'] || 0} posts`;
}

// Filter posts by category
function filterByCategory(category) {
    // Remove active class from all category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to clicked category
    const clickedCard = document.querySelector(`[data-category="${category}"]`);
    if (clickedCard) {
        clickedCard.classList.add('active');
    }
    
    if (category === 'all') {
        renderBlogPosts();
    } else {
        const filteredPosts = blogPosts.filter(post => post.category === category);
        renderBlogPosts(filteredPosts);
    }
}

// Show create post modal
function showCreatePostModal() {
    const modal = document.getElementById('createPostModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Hide create post modal
function hideCreatePostModal() {
    const modal = document.getElementById('createPostModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('createPostForm').reset();
}

// Create new post
function createPost(formData) {
    const newPost = {
        id: Date.now().toString(),
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        readTime: formData.get('readTime') || '5 min read',
        image: formData.get('image') || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        keywords: formData.get('keywords') ? formData.get('keywords').split(',').map(k => k.trim()) : [],
        content: formData.get('content'),
        publishDate: new Date().toISOString(),
        author: 'AffiliateForge Team'
    };

    blogPosts.unshift(newPost); // Add to beginning of array
    saveBlogPosts();
    renderBlogPosts();
    updateCategoryCounts();
    hideCreatePostModal();
    
    // Show success message
    showNotification('Post created successfully!', 'success');
}

// Edit post
function editPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Populate form with existing data
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postDescription').value = post.description;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postReadTime').value = post.readTime;
    document.getElementById('postImage').value = post.image;
    document.getElementById('postKeywords').value = post.keywords.join(', ');
    document.getElementById('postContent').value = post.content;
    
    // Change form mode to edit
    const form = document.getElementById('createPostForm');
    form.dataset.editId = postId;
    form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Post';
    
    showCreatePostModal();
}

// Delete post
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        blogPosts = blogPosts.filter(p => p.id !== postId);
        saveBlogPosts();
        renderBlogPosts();
        updateCategoryCounts();
        showNotification('Post deleted successfully!', 'success');
    }
}

// View post (placeholder - could expand to full post view)
function viewPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
        // For now, just show an alert with post info
        alert(`Title: ${post.title}\n\nDescription: ${post.description}\n\nContent: ${post.content.substring(0, 200)}...`);
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
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize blog functionality
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    
    // Create post button
    const createPostBtn = document.getElementById('createPostBtn');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', showCreatePostModal);
    }
    
    // Close modal buttons
    const closeModalBtn = document.getElementById('closeCreateModal');
    const cancelBtn = document.getElementById('cancelPost');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideCreatePostModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideCreatePostModal);
    }
    
    // Form submission
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(createPostForm);
            const editId = createPostForm.dataset.editId;
            
            if (editId) {
                // Update existing post
                const postIndex = blogPosts.findIndex(p => p.id === editId);
                if (postIndex !== -1) {
                    blogPosts[postIndex] = {
                        ...blogPosts[postIndex],
                        title: formData.get('title'),
                        description: formData.get('description'),
                        category: formData.get('category'),
                        readTime: formData.get('readTime') || '5 min read',
                        image: formData.get('image') || blogPosts[postIndex].image,
                        keywords: formData.get('keywords') ? formData.get('keywords').split(',').map(k => k.trim()) : [],
                        content: formData.get('content')
                    };
                    
                    saveBlogPosts();
                    renderBlogPosts();
                    updateCategoryCounts();
                    hideCreatePostModal();
                    
                    // Reset form mode
                    delete createPostForm.dataset.editId;
                    createPostForm.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> Publish Post';
                    
                    showNotification('Post updated successfully!', 'success');
                }
            } else {
                createPost(formData);
            }
        });
    }
    
    // Category filtering
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Newsletter subscription
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', () => {
            const email = document.getElementById('newsletterEmail').value;
            if (email && email.includes('@')) {
                showNotification('Successfully subscribed to newsletter!', 'success');
                document.getElementById('newsletterEmail').value = '';
            } else {
                showNotification('Please enter a valid email address!', 'error');
            }
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('createPostModal');
    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideCreatePostModal();
            }
        });
    }
});

// Make functions available globally
window.showCreatePostModal = showCreatePostModal;
window.hideCreatePostModal = hideCreatePostModal;
window.filterByCategory = filterByCategory;
window.editPost = editPost;
window.deletePost = deletePost;
window.viewPost = viewPost;