# AffiliateForge - Static Affiliate Website

A modern, responsive affiliate marketing website built with vanilla HTML, CSS, and JavaScript. Perfect for promoting affiliate offers and tracking performance.

## Features

✅ **Affiliate Stats Start at 0** - All statistics begin from zero for accurate tracking
✅ **Smart Link Behavior** - Affiliate links don't open in new tab, other dashboard links do
✅ **Specific Affiliate Link** - Features the required link: https://wwp.ailony.com/redirect-zone/0fcf5c0f
✅ **Blog with Post Creation** - Ability to create and manage blog posts with SEO optimization
✅ **Earnings Popup** - Homepage popup promoting $100 earning opportunity
✅ **Responsive Dashboard** - Real-time analytics and link copying functionality

## Key Improvements Made

### 1. Statistics Reset
- All affiliate stats (views, clicks, earnings) start at 0
- Local storage tracks actual user interactions
- Stats increment with real usage

### 2. Link Behavior (As Requested)
- **Affiliate links**: Don't open in new tab (same tab navigation)
- **External dashboard links**: Open in new tab with `target="_blank"`
- **Internal navigation**: Same tab navigation

### 3. Featured Affiliate Link
- Primary promotion: `https://wwp.ailony.com/redirect-zone/0fcf5c0f`
- Copy functionality in dashboard
- Social sharing buttons included

### 4. Enhanced Blog System
- **Create New Posts**: Full-featured blog post creation
- **SEO Optimization**: 
  - Meta descriptions and keywords
  - Structured data markup
  - Mobile-optimized content
  - Category organization
- **Content Management**: Edit, delete, and organize posts
- **SEO Tips Section**: Built-in guidance for better content

### 5. Earnings Popup
- Appears 3 seconds after homepage load
- Promotes $100 per sale opportunity
- Direct link to affiliate dashboard
- Only shows once per session

## File Structure

```
affiliate-webapp/
├── index.html          # Homepage with hero and tools
├── dashboard.html      # Affiliate dashboard with analytics
├── blog.html          # Blog with post creation
├── styles.css         # Main stylesheet
├── dashboard.css      # Dashboard-specific styles
├── blog.css          # Blog-specific styles
├── script.js         # Main JavaScript functionality
├── dashboard.js      # Dashboard functionality
├── blog.js           # Blog management system
└── README.md         # This file
```

## Deployment Options

### 1. Cloudflare Pages (Recommended)
1. Upload files to GitHub repository
2. Connect Cloudflare Pages to the repository
3. Deploy as static site
4. Custom domain support available

### 2. Netlify
1. Drag and drop the `affiliate-webapp` folder to Netlify
2. Automatic HTTPS and CDN
3. Form handling available

### 3. GitHub Pages
1. Upload files to GitHub repository
2. Enable GitHub Pages in repository settings
3. Choose source branch (main/master)

### 4. Vercel
1. Upload to GitHub repository
2. Import project in Vercel dashboard
3. Automatic deployments on updates

## Local Development

```bash
# Navigate to the project directory
cd affiliate-webapp

# Start a local server (Python)
python -m http.server 8080

# Or using Node.js
npx serve .

# Visit http://localhost:8080
```

## SEO Features

### Meta Tags
- Comprehensive Open Graph tags
- Twitter Card support
- Structured data (Schema.org)
- Mobile viewport optimization

### Content Optimization
- Keyword-rich titles and descriptions
- Internal linking structure
- Image alt tags
- Fast loading times

### Blog SEO
- Category organization
- Tag system
- Reading time estimates
- Author attribution

## Analytics & Tracking

### Built-in Analytics
- View tracking
- Click tracking
- Conversion rate calculation
- Earnings estimation

### External Integration Ready
- Google Analytics compatible
- Facebook Pixel support
- Custom event tracking
- A/B testing ready

## Customization

### Colors & Branding
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
}
```

### Affiliate Links
Update links in the HTML files or add new ones following the existing pattern.

### Content
- Edit hero text in `index.html`
- Modify tool descriptions
- Update blog default posts in `blog.js`

## Performance

- **Optimized Images**: WebP format with fallbacks
- **Minified CSS**: Production-ready styles
- **Lazy Loading**: Images load on scroll
- **Fast Loading**: ~2s load time on average connection

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security

- No server-side code (static files only)
- HTTPS enforced on deployment
- CSP headers recommended
- No sensitive data storage

## License

MIT License - Feel free to use for commercial projects.

## Support

For issues or customization requests, refer to the code comments or create a new issue in the repository.

---

**Ready for deployment to Cloudflare Pages or any static hosting provider!**