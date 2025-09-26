// Post functionality
let currentPost = null;

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Load post by ID
function loadPost(postId) {
    // Get posts from localStorage or use defaults
    const savedPosts = localStorage.getItem('blogPosts');
    let posts = [];
    
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    } else {
        // Use default posts from blog.js
        posts = getDefaultPosts();
    }
    
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        currentPost = post;
        displayPost(post);
        updatePageMeta(post);
        loadRelatedPosts(post, posts);
        
        // Update URL without reload
        const newUrl = `post.html?id=${postId}`;
        window.history.replaceState({postId}, post.title, newUrl);
    } else {
        displayPostNotFound();
    }
}

// Display post content
function displayPost(post) {
    const postArticle = document.getElementById('postArticle');
    
    const postHtml = `
        <div class="post-header">
            <img src="${post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600'}" 
                 alt="${post.title}" 
                 class="post-featured-image"
                 onerror="this.src='https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600'">
            <div class="post-header-content">
                <div class="post-meta">
                    <span class="post-category">${getCategoryDisplayName(post.category)}</span>
                    <span class="post-read-time">${post.readTime}</span>
                    <span class="post-date">${formatDate(post.publishDate)}</span>
                    <span class="post-author">By ${post.author}</span>
                </div>
                <h1 class="post-title">${post.title}</h1>
                <p class="post-description">${post.description}</p>
            </div>
        </div>
        
        <div class="post-body">
            <div class="post-content">${formatPostContent(post.content)}</div>
        </div>
        
        <div class="post-footer">
            <div class="post-tags">
                ${post.keywords ? post.keywords.map(keyword => `<span class="post-tag">${keyword}</span>`).join('') : ''}
            </div>
            <div class="post-share">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
                   target="_blank" 
                   class="share-button facebook" 
                   title="Share on Facebook">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}" 
                   target="_blank" 
                   class="share-button twitter" 
                   title="Share on Twitter">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" 
                   target="_blank" 
                   class="share-button linkedin" 
                   title="Share on LinkedIn">
                    <i class="fab fa-linkedin-in"></i>
                </a>
                <button onclick="copyPostUrl()" class="share-button" title="Copy Link">
                    <i class="fas fa-link"></i>
                </button>
            </div>
        </div>
    `;
    
    postArticle.innerHTML = postHtml;
    
    // Update breadcrumb
    document.getElementById('breadcrumbTitle').textContent = post.title;
}

// Format post content with better HTML structure
function formatPostContent(content) {
    // Split content into paragraphs and add proper formatting
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    let formattedContent = '';
    
    paragraphs.forEach(paragraph => {
        const trimmed = paragraph.trim();
        
        if (trimmed.startsWith('# ')) {
            formattedContent += `<h1>${trimmed.substring(2)}</h1>`;
        } else if (trimmed.startsWith('## ')) {
            formattedContent += `<h2>${trimmed.substring(3)}</h2>`;
        } else if (trimmed.startsWith('### ')) {
            formattedContent += `<h3>${trimmed.substring(4)}</h3>`;
        } else if (trimmed.startsWith('- ')) {
            // Handle lists
            const listItems = paragraph.split('\n').filter(item => item.trim().startsWith('- '));
            formattedContent += '<ul>';
            listItems.forEach(item => {
                formattedContent += `<li>${item.substring(2).trim()}</li>`;
            });
            formattedContent += '</ul>';
        } else {
            formattedContent += `<p>${trimmed}</p>`;
        }
    });
    
    // If no formatted content, use the original with paragraph tags
    if (!formattedContent) {
        formattedContent = `<p>${content}</p>`;
    }
    
    return formattedContent;
}

// Update page metadata
function updatePageMeta(post) {
    // Update title
    document.getElementById('pageTitle').textContent = `${post.title} | AffiliateForge Blog`;
    document.title = `${post.title} | AffiliateForge Blog`;
    
    // Update meta tags
    document.getElementById('pageDescription').setAttribute('content', post.description);
    document.getElementById('pageKeywords').setAttribute('content', post.keywords ? post.keywords.join(', ') : '');
    
    // Update Open Graph tags
    document.getElementById('ogTitle').setAttribute('content', post.title);
    document.getElementById('ogDescription').setAttribute('content', post.description);
    document.getElementById('ogImage').setAttribute('content', post.image || '');
    document.getElementById('ogUrl').setAttribute('content', window.location.href);
    
    // Update Twitter tags
    document.getElementById('twitterTitle').setAttribute('content', post.title);
    document.getElementById('twitterDescription').setAttribute('content', post.description);
    document.getElementById('twitterImage').setAttribute('content', post.image || '');
    
    // Update structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "AffiliateForge"
        },
        "datePublished": post.publishDate,
        "dateModified": post.publishDate,
        "image": post.image || '',
        "url": window.location.href
    };
    
    document.getElementById('structuredData').textContent = JSON.stringify(structuredData);
}

// Load related posts
function loadRelatedPosts(currentPost, allPosts) {
    const relatedPosts = allPosts
        .filter(post => post.id !== currentPost.id && post.category === currentPost.category)
        .slice(0, 3);
    
    if (relatedPosts.length > 0) {
        const relatedPostsGrid = document.getElementById('relatedPostsGrid');
        
        relatedPostsGrid.innerHTML = relatedPosts.map(post => `
            <div class="related-post-card" onclick="loadPost('${post.id}')">
                <img src="${post.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200'}" 
                     alt="${post.title}" 
                     class="related-post-image"
                     onerror="this.src='https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200'">
                <div class="related-post-content">
                    <h4 class="related-post-title">${post.title}</h4>
                    <p class="related-post-excerpt">${post.description}</p>
                </div>
            </div>
        `).join('');
        
        document.getElementById('relatedPosts').style.display = 'block';
    }
}

// Display post not found
function displayPostNotFound() {
    const postArticle = document.getElementById('postArticle');
    
    postArticle.innerHTML = `
        <div class="post-not-found">
            <div class="not-found-content">
                <h1>Post Not Found</h1>
                <p>Sorry, the blog post you're looking for doesn't exist or has been removed.</p>
                <a href="blog.html" class="back-to-blog-btn">
                    <i class="fas fa-arrow-left"></i>
                    Back to Blog
                </a>
            </div>
        </div>
    `;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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

// Get default posts (fallback if localStorage is empty)
function getDefaultPosts() {
    return [
        {
            id: '1',
            title: 'Systeme.io vs ClickFunnels: Which Funnel Builder is Best in 2025?',
            description: 'A comprehensive comparison of the two leading funnel builders to help you choose the right platform for your business.',
            category: 'comparisons',
            readTime: '12 min read',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
            keywords: ['systeme.io', 'clickfunnels', 'funnel builder', 'comparison', '2025'],
            content: `# Comprehensive Comparison: Systeme.io vs ClickFunnels 2025

When it comes to building high-converting sales funnels, two platforms dominate the conversation: Systeme.io and ClickFunnels. Both offer powerful funnel building capabilities, but they cater to different needs and budgets.

## What is Systeme.io?

Systeme.io is an all-in-one business platform that combines funnel building, email marketing, affiliate management, and course creation into a single, affordable solution. Founded with the mission to democratize online business tools, Systeme.io has quickly become a favorite among entrepreneurs and small businesses.

### Key Features of Systeme.io:
- Drag-and-drop funnel builder
- Email marketing automation
- Affiliate program management
- Online course creation
- Blog functionality
- Membership site creation
- A/B testing capabilities

## What is ClickFunnels?

ClickFunnels is the pioneer in the funnel building space, created by Russell Brunson in 2014. It's specifically designed for creating high-converting sales funnels and has been used by thousands of successful entrepreneurs to generate millions in revenue.

### Key Features of ClickFunnels:
- Advanced funnel builder with proven templates
- Comprehensive split testing
- Shopping cart and order forms
- Membership site functionality
- Affiliate management system
- Advanced automation features
- Extensive third-party integrations

## Pricing Comparison

### Systeme.io Pricing:
- **Free Plan**: Up to 2,000 contacts, 3 funnels, unlimited emails
- **Startup Plan**: $27/month - 5,000 contacts, 10 funnels, 1 course
- **Webinar Plan**: $47/month - 10,000 contacts, 50 funnels, 5 courses
- **Enterprise Plan**: $97/month - Unlimited everything

### ClickFunnels Pricing:
- **Basic Plan**: $127/month - 20 funnels, 100 pages, 20,000 visitors
- **Pro Plan**: $157/month - 100 funnels, 1,000 pages, 100,000 visitors
- **Funnel Hacker Plan**: $208/month - Unlimited funnels and pages

## Performance and Ease of Use

**Systeme.io** wins in simplicity and user-friendliness. The interface is clean, intuitive, and perfect for beginners. Page loading speeds are excellent, and the learning curve is minimal.

**ClickFunnels** offers more advanced features but comes with added complexity. While it provides more customization options, it can be overwhelming for new users.

## Template Quality and Variety

**ClickFunnels** has a significant advantage here with its extensive library of proven, high-converting templates. These templates are based on successful funnels that have generated millions in revenue.

**Systeme.io** offers fewer templates but they're modern, mobile-responsive, and cover the most common funnel types effectively.

## Integration Capabilities

**ClickFunnels** excels in third-party integrations, connecting with virtually every major marketing tool, CRM, and payment processor.

**Systeme.io** offers essential integrations and continues to expand its integration library, though it's more limited compared to ClickFunnels.

## Which Should You Choose?

### Choose Systeme.io if:
- You're just starting out or have a limited budget
- You want an all-in-one solution
- You need email marketing and course creation features
- You prefer simplicity over advanced features
- You want to test with a free plan first

### Choose ClickFunnels if:
- You have a larger budget and want premium features
- You need advanced split testing capabilities
- Template variety and proven designs are crucial
- You require extensive third-party integrations
- You're scaling a high-volume business

## Final Verdict

Both platforms are excellent choices, but they serve different market segments. Systeme.io is perfect for entrepreneurs and small businesses looking for an affordable, all-in-one solution. ClickFunnels is ideal for established businesses that need advanced features and don't mind paying premium prices.

For most beginners, we recommend starting with Systeme.io's free plan to learn the fundamentals, then upgrading as your business grows. Advanced marketers with larger budgets will appreciate ClickFunnels' sophisticated features and proven template library.

Remember, the best funnel builder is the one you'll actually use consistently to grow your business.`,
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
            content: `# Top 10 Free Funnel Builders for Beginners in 2025

Starting an online business doesn't have to cost a fortune. These free funnel builders will help you create professional sales funnels without any upfront investment.

## 1. Systeme.io (Free Plan)

Systeme.io offers the most generous free plan in the industry:
- Up to 2,000 contacts
- 3 sales funnels
- Unlimited email sends
- Basic automation
- Blog functionality

Perfect for: Complete beginners who want to test funnel building without any risk.

## 2. MailerLite (Free Plan)

While primarily an email marketing platform, MailerLite's free plan includes:
- Landing page builder
- Pop-up forms
- Basic automation
- Up to 1,000 subscribers
- 12,000 emails per month

Perfect for: Businesses focusing on email marketing with simple landing pages.

## 3. HubSpot (Free CRM)

HubSpot's free CRM includes marketing tools:
- Landing page builder
- Forms and pop-ups
- Email marketing (up to 2,000 sends)
- Contact management
- Basic reporting

Perfect for: Businesses wanting comprehensive CRM with marketing tools.

## Why Free Plans Are Great for Beginners

### Learn the Fundamentals
Free plans allow you to understand funnel building concepts without financial pressure.

### Test Your Ideas
Validate your business concept before investing in premium tools.

### Build Your Skills
Develop your marketing skills and understanding of customer behavior.

### Grow Organically
Scale your tools as your business and revenue grow.

## Tips for Maximizing Free Plans

1. **Focus on One Funnel**: Perfect one high-converting funnel before building more
2. **Optimize for Mobile**: Ensure your funnels work perfectly on mobile devices  
3. **Track Everything**: Use built-in analytics to understand visitor behavior
4. **A/B Test**: Even with limited tests, optimize your key pages
5. **Plan for Growth**: Choose platforms you can upgrade as you scale

## When to Upgrade

Consider upgrading when you:
- Reach subscriber limits consistently
- Need advanced automation features
- Want more template options
- Require better customer support
- Need advanced analytics and reporting

Starting with free tools is smart business. Build your foundation, prove your concept, then invest in premium features as your business grows.`,
            publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            author: 'AffiliateForge Team'
        }
    ];
}

// Copy post URL to clipboard
function copyPostUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Post URL copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Post URL copied to clipboard!', 'success');
    });
}

// Show notification (reuse from blog.js)
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

// Initialize post page
document.addEventListener('DOMContentLoaded', () => {
    // Get post ID from URL parameter
    const postId = getUrlParameter('id');
    
    if (postId) {
        loadPost(postId);
    } else {
        displayPostNotFound();
    }
    
    // Initialize newsletter subscription
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
    
    // Initialize comment submission
    const submitCommentBtn = document.getElementById('submitComment');
    if (submitCommentBtn) {
        submitCommentBtn.addEventListener('click', () => {
            const comment = document.getElementById('commentText').value;
            const name = document.getElementById('commentName').value;
            const email = document.getElementById('commentEmail').value;
            
            if (comment.trim() && name.trim() && email.trim()) {
                showNotification('Thank you for your comment! It will be reviewed and published soon.', 'success');
                
                // Clear form
                document.getElementById('commentText').value = '';
                document.getElementById('commentName').value = '';
                document.getElementById('commentEmail').value = '';
            } else {
                showNotification('Please fill in all fields to submit your comment.', 'error');
            }
        });
    }
});

// Make loadPost available globally
window.loadPost = loadPost;