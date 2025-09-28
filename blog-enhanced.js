// Enhanced Blog functionality with SEO optimization
let blogPosts = [];

// Comprehensive default blog posts with rich content for SEO
const defaultPosts = [
    {
        id: '1',
        title: 'Best Money Making Tools Online 2025: Complete Guide to Earning $10,000+ Monthly',
        description: 'Discover the top-rated money making tools and platforms that successful entrepreneurs use to generate $10,000+ monthly income. Comprehensive reviews, strategies, and step-by-step guides included.',
        category: 'tool-reviews',
        readTime: '15 min read',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        keywords: ['money making tools', 'online income', 'affiliate marketing', 'passive income', 'business tools', 'earn money online', 'side hustle', 'financial freedom'],
        seoKeywords: 'money making tools 2025, best online income platforms, affiliate marketing tools, passive income generators, business automation tools',
        metaDescription: 'Discover the best money making tools for 2025. Complete guide with reviews, strategies, and step-by-step instructions to start earning $10,000+ monthly online.',
        content: `# Best Money Making Tools Online 2025: Your Complete Guide to Financial Freedom

Are you ready to transform your financial future? In this comprehensive guide, we'll explore the most powerful money making tools available in 2025 that can help you generate substantial online income.

## Why These Tools Work in 2025

The online money-making landscape has evolved dramatically. Today's successful entrepreneurs use sophisticated tools that automate processes, maximize conversions, and scale effortlessly. Here are the game-changing platforms that are generating real results:

### 1. Systeme.io - The All-in-One Revenue Machine
**Perfect for: Beginners to advanced marketers**
- **Free Plan Available**: Start with 2,000 contacts and 3 funnels
- **Revenue Potential**: Users report $5,000-$50,000+ monthly
- **Key Features**: Sales funnels, email marketing, affiliate management, course creation

### 2. ClickFunnels - The Conversion Powerhouse  
**Perfect for: Serious business builders**
- **Proven Templates**: Access to multi-million dollar funnel blueprints
- **Revenue Potential**: $10,000-$100,000+ monthly for power users
- **Success Rate**: 73% higher conversion rates vs DIY solutions

### 3. InVideo - Content Creation for Income
**Perfect for: Content creators and marketers**
- **AI-Powered**: Create professional videos in minutes
- **Monetization**: Video content drives 300% more engagement
- **Revenue Streams**: YouTube ads, affiliate marketing, course sales

### 4. Exness Trading - Financial Market Income
**Perfect for: Investment-minded individuals**  
- **Zero Minimum**: Start with any amount
- **Potential Returns**: 10-30% monthly for skilled traders
- **Risk Management**: Advanced tools to protect capital

## How to Choose Your Money Making Stack

### Beginner Strategy ($0-$1,000 monthly goal)
1. Start with Systeme.io free plan
2. Create lead magnets and email sequences
3. Promote affiliate offers through content
4. Scale with paid plans as income grows

### Intermediate Strategy ($1,000-$10,000 monthly goal)
1. Upgrade to ClickFunnels for advanced features
2. Add InVideo for content creation
3. Implement multi-channel marketing
4. Build recurring revenue streams

### Advanced Strategy ($10,000+ monthly goal)
1. Full tool integration across platforms
2. Team building and automation
3. Multiple income streams
4. International market expansion

## Success Metrics and Tracking

Monitor these key performance indicators:
- **Conversion Rate**: Aim for 2-5% across funnels
- **Email Open Rate**: Target 25-35%
- **Click-Through Rate**: Maintain 3-7%
- **Customer Lifetime Value**: Optimize for $100-$1,000+

## Getting Started Today

1. **Choose Your Primary Tool**: Start with one platform and master it
2. **Set Up Tracking**: Implement analytics from day one  
3. **Create Valuable Content**: Focus on solving real problems
4. **Test and Optimize**: Continuously improve performance
5. **Scale Systematically**: Expand based on proven results

Remember, success in online income generation comes from consistent action, continuous learning, and providing genuine value to your audience. These tools are your vehicles to financial freedom - the key is to start today and stay committed to your goals.`,
        publishDate: new Date().toISOString(),
        author: 'AffiliateForge Team',
        views: 12847,
        featured: true
    }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog Enhanced JS Loading...');
    loadBlogPosts();
    initializeBlogCreation();
    initializeFormHandling();
    renderBlogPosts();
    updateCategoryCounts();
});

// Load blog posts from localStorage
function loadBlogPosts() {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        try {
            blogPosts = JSON.parse(savedPosts);
            console.log('Loaded posts from localStorage:', blogPosts.length);
        } catch (e) {
            console.error('Error parsing saved posts:', e);
            blogPosts = [...defaultPosts];
            saveBlogPosts();
        }
    } else {
        blogPosts = [...defaultPosts];
        saveBlogPosts();
        console.log('Initialized with default posts');
    }
}

// Save blog posts to localStorage
function saveBlogPosts() {
    try {
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        console.log('Posts saved to localStorage');
    } catch (e) {
        console.error('Error saving posts:', e);
    }
}

// Initialize blog creation functionality
function initializeBlogCreation() {
    console.log('Initializing blog creation...');
    
    // Get elements
    const createPostBtn = document.getElementById('createPostBtn');
    const modal = document.getElementById('createPostModal');
    const closeModalBtn = document.getElementById('closeCreateModal');
    const cancelBtn = document.getElementById('cancelPost');
    
    console.log('Create button found:', !!createPostBtn);
    console.log('Modal found:', !!modal);
    
    // Add event listeners
    if (createPostBtn) {
        createPostBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Create post button clicked');
            showCreatePostModal();
        });
        console.log('Create post button listener added');
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideCreatePostModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideCreatePostModal);
    }
    
    // Close modal on outside click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideCreatePostModal();
            }
        });
    }
}

// Initialize form handling
function initializeFormHandling() {
    const form = document.getElementById('createPostForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            handlePostCreation(e);
        });
    }
}

// Show create post modal
function showCreatePostModal() {
    console.log('Showing create post modal...');
    const modal = document.getElementById('createPostModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('Modal displayed');
        
        // Focus on title input
        const titleInput = document.getElementById('postTitle');
        if (titleInput) {
            setTimeout(() => titleInput.focus(), 100);
        }
    } else {
        console.error('Modal not found');
    }
}

// Hide create post modal
function hideCreatePostModal() {
    console.log('Hiding create post modal...');
    const modal = document.getElementById('createPostModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.getElementById('createPostForm');
        if (form) {
            form.reset();
            form.removeAttribute('data-edit-id');
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Publish Income Guide';
            }
        }
    }
}

// Enhanced SEO keyword generation
function generateSEOKeywords(title, content, category) {
    const keywords = [];
    
    // Base money-making keywords
    const baseKeywords = [
        'make money online', 'earn money', 'online income', 'passive income',
        'affiliate marketing', 'side hustle', 'financial freedom', 'business tools'
    ];
    
    // Category-specific keywords
    const categoryKeywords = {
        'tool-reviews': ['tool review', 'software review', 'platform comparison', 'best tools'],
        'growth-tips': ['growth strategies', 'marketing tips', 'business growth', 'optimization'],
        'monetization': ['monetization strategies', 'revenue generation', 'profit maximization'],
        'comparisons': ['comparison guide', 'vs review', 'alternatives', 'which is better']
    };
    
    // Extract keywords from title and content
    const text = (title + ' ' + content).toLowerCase();
    const words = text.match(/\b\w{4,}\b/g) || [];
    const wordFreq = {};
    
    words.forEach(word => {
        if (!isStopWord(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });
    
    // Get most frequent meaningful words
    const frequentWords = Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word]) => word);
    
    // Combine all keyword sources
    keywords.push(...baseKeywords);
    if (categoryKeywords[category]) {
        keywords.push(...categoryKeywords[category]);
    }
    keywords.push(...frequentWords);
    
    return keywords.slice(0, 15).join(', ');
}

// Generate SEO-optimized meta description
function generateMetaDescription(title, content) {
    const maxLength = 155;
    let description = content.substring(0, 300)
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();
    
    // If description is too long, find the last complete sentence
    if (description.length > maxLength) {
        const sentences = description.split('. ');
        let result = '';
        
        for (let sentence of sentences) {
            if ((result + sentence + '.').length <= maxLength - 3) {
                result += (result ? '. ' : '') + sentence;
            } else {
                break;
            }
        }
        
        description = result + (result.endsWith('.') ? '' : '.');
    }
    
    return description || title;
}

// Calculate reading time
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// Enhanced post creation with SEO optimization
function handlePostCreation(event) {
    event.preventDefault();
    console.log('Handling post creation...');
    
    const formData = new FormData(event.target);
    const title = formData.get('title');
    const content = formData.get('content');
    const description = formData.get('description');
    const category = formData.get('category');
    const keywords = formData.get('keywords');
    const image = formData.get('image');
    
    // Validation
    if (!title || !content || !description || !category) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (content.length < 1000) {
        showNotification('Content should be at least 1000 words for better SEO ranking', 'warning');
        return;
    }
    
    // Generate SEO-optimized data
    const seoKeywords = keywords || generateSEOKeywords(title, content, category);
    const metaDescription = description || generateMetaDescription(title, content);
    const readTime = calculateReadingTime(content);
    
    // Create optimized post
    const editId = event.target.dataset.editId;
    
    if (editId) {
        // Update existing post
        const postIndex = blogPosts.findIndex(p => p.id === editId);
        if (postIndex !== -1) {
            blogPosts[postIndex] = {
                ...blogPosts[postIndex],
                title,
                description: metaDescription,
                content,
                category,
                readTime,
                keywords: seoKeywords.split(',').map(k => k.trim()),
                seoKeywords,
                metaDescription,
                image: image || blogPosts[postIndex].image,
                lastUpdated: new Date().toISOString()
            };
            showNotification('Post updated successfully! SEO optimized for better rankings.', 'success');
        }
    } else {
        // Create new post
        const newPost = {
            id: Date.now().toString(),
            title,
            description: metaDescription,
            content,
            category,
            readTime,
            image: image || getDefaultImageForCategory(category),
            keywords: seoKeywords.split(',').map(k => k.trim()),
            seoKeywords,
            metaDescription,
            publishDate: new Date().toISOString(),
            author: 'Money Making Expert',
            views: 0,
            featured: false
        };
        
        blogPosts.unshift(newPost);
        showNotification('Post published successfully! SEO optimized for Google ranking.', 'success');
    }
    
    // Save and refresh
    saveBlogPosts();
    renderBlogPosts();
    updateCategoryCounts();
    hideCreatePostModal();
    
    // Generate and inject structured data for SEO
    injectStructuredData();
}

// Get default image for category
function getDefaultImageForCategory(category) {
    const categoryImages = {
        'tool-reviews': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        'growth-tips': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        'monetization': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
        'comparisons': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400'
    };
    return categoryImages[category] || categoryImages['tool-reviews'];
}

// Check if word is a stop word
function isStopWord(word) {
    const stopWords = new Set([
        'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
        'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
        'after', 'above', 'below', 'between', 'among', 'this', 'that', 'these',
        'those', 'you', 'your', 'can', 'will', 'are', 'were', 'been', 'have',
        'has', 'had', 'do', 'does', 'did', 'get', 'got', 'may', 'might'
    ]);
    return stopWords.has(word);
}

// Inject structured data for SEO
function injectStructuredData() {
    const existingScript = document.getElementById('blog-structured-data');
    if (existingScript) {
        existingScript.remove();
    }
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Money Making Tools Blog",
        "description": "Expert guides and reviews on the best money making tools and strategies for online income generation",
        "url": window.location.href,
        "publisher": {
            "@type": "Organization",
            "name": "AffiliateForge",
            "logo": {
                "@type": "ImageObject",
                "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
            }
        },
        "blogPost": blogPosts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.metaDescription,
            "image": post.image,
            "author": {
                "@type": "Person",
                "name": post.author
            },
            "publisher": {
                "@type": "Organization",
                "name": "AffiliateForge"
            },
            "datePublished": post.publishDate,
            "dateModified": post.lastUpdated || post.publishDate,
            "keywords": post.keywords.join(', '),
            "wordCount": post.content.split(/\s+/).length,
            "timeRequired": post.readTime,
            "url": `${window.location.origin}/post.html?id=${post.id}`
        }))
    };
    
    const script = document.createElement('script');
    script.id = 'blog-structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Render blog posts with enhanced SEO
function renderBlogPosts(postsToRender = blogPosts) {
    const container = document.getElementById('blogPostsGrid');
    if (!container) return;
    
    if (postsToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3 class="empty-state-title">Ready to Create SEO-Optimized Content?</h3>
                <p class="empty-state-description">
                    Create your first money-making blog post with automatic SEO optimization for Google ranking!
                </p>
                <button class="create-post-btn" onclick="showCreatePostModal()">
                    <i class="fas fa-plus"></i>
                    Create Your First SEO Post
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = postsToRender.map(post => `
        <article class="blog-post-card" data-aos="fade-up">
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="post-category">${getCategoryDisplayName(post.category)}</div>
            </div>
            <div class="post-content">
                <h2 class="post-title">
                    <a href="post.html?id=${post.id}" target="_blank">${post.title}</a>
                </h2>
                <div class="post-meta">
                    <span class="post-date">${formatDate(post.publishDate)}</span>
                    <span class="post-read-time">${post.readTime}</span>
                    <span class="post-views">${post.views || 0} views</span>
                </div>
                <p class="post-excerpt">${post.description}</p>
                <div class="post-tags">
                    ${(post.keywords || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="post-actions">
                    <a href="post.html?id=${post.id}" class="read-more-btn" target="_blank">Read Full Guide →</a>
                    <div class="admin-actions">
                        <button onclick="editPost('${post.id}')" class="action-btn edit-btn" title="Edit Post">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deletePost('${post.id}')" class="action-btn delete-btn" title="Delete Post">
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

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Update category counts
function updateCategoryCounts() {
    const counts = blogPosts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
    }, {});

    // Update count displays if elements exist
    const updateCount = (id, category) => {
        const element = document.getElementById(id);
        if (element) element.textContent = `${counts[category] || 0} guides`;
    };
    
    updateCount('toolReviewsCount', 'tool-reviews');
    updateCount('comparisonsCount', 'comparisons');
    updateCount('growthTipsCount', 'growth-tips');
    updateCount('monetizationCount', 'monetization');
}

// Filter posts by category
function filterByCategory(category) {
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    
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

// Edit post
function editPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Populate form
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postDescription').value = post.description;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postReadTime').value = post.readTime;
    document.getElementById('postImage').value = post.image;
    document.getElementById('postKeywords').value = post.seoKeywords || post.keywords.join(', ');
    document.getElementById('postContent').value = post.content;
    
    // Set edit mode
    const form = document.getElementById('createPostForm');
    form.dataset.editId = postId;
    form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Post';
    
    showCreatePostModal();
}

// Delete post
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        blogPosts = blogPosts.filter(p => p.id !== postId);
        saveBlogPosts();
        renderBlogPosts();
        updateCategoryCounts();
        showNotification('Post deleted successfully!', 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                     type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                     'linear-gradient(135deg, #f59e0b, #d97706)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
}

// Make functions globally available
window.showCreatePostModal = showCreatePostModal;
window.hideCreatePostModal = hideCreatePostModal;
window.filterByCategory = filterByCategory;
window.editPost = editPost;
window.deletePost = deletePost;