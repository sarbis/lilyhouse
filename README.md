# Lilyhouse - Handcrafted Jewelry Website

A beautiful, minimal static website for showcasing and selling handcrafted jewelry. Built with pure HTML, CSS, and vanilla JavaScript - no frameworks, no dependencies.

![Lilyhouse](images/hero-banner.jpg)

## Features

- ✨ **Fully Static** - Works perfectly on GitHub Pages
- 📱 **Mobile-First Responsive Design** - Looks great on all devices
- 🎨 **Elegant, Minimal Design** - Perfect for showcasing handcrafted items
- 🖼️ **Dynamic Product Gallery** - Products loaded from JSON data
- 🔍 **Category Filtering** - Easy navigation through product categories
- 📧 **Contact & Reservation Forms** - Integrated with Formspree
- ⚡ **Fast Loading** - No heavy frameworks or dependencies
- 🎯 **SEO Friendly** - Semantic HTML and meta tags

## Project Structure

```
lilyhouse/
├── index.html              # Home page
├── collection.html         # Product gallery page
├── item.html              # Product detail page
├── about.html             # About page
├── contact.html           # Contact page
├── css/
│   └── style.css          # All styles
├── js/
│   └── main.js            # JavaScript functionality
├── data/
│   └── items.json         # Product data
├── images/                # Image assets
└── README.md              # This file
```

## Getting Started

### 1. Clone or Download

Download this repository or clone it:

```bash
git clone https://github.com/yourusername/lilyhouse.git
cd lilyhouse
```

### 2. Add Your Images

Place your product images in the `images/` folder. We recommend:
- **Format:** JPG or PNG
- **Size:** Max width 1200px for main images, 600px for thumbnails
- **Optimization:** Use tools like [TinyPNG](https://tinypng.com/) to compress images
- **Naming:** Use descriptive names like `pearl-necklace.jpg`, `silver-ring-detail.jpg`

### 3. Update Product Data

Edit `data/items.json` to add your jewelry items. Each item should follow this structure:

```json
{
  "id": "unique-item-id",
  "name": "Item Name",
  "category": "necklaces",
  "description": "Short description for gallery",
  "longDescription": "Detailed description for item page",
  "price": "$99",
  "image": "images/item-main.jpg",
  "images": [
    "images/item-main.jpg",
    "images/item-detail.jpg"
  ],
  "featured": true
}
```

**Field explanations:**
- `id`: Unique identifier (use lowercase with hyphens)
- `name`: Display name of the item
- `category`: One of: `necklaces`, `rings`, `earrings`, `bracelets`
- `description`: Brief description (1-2 sentences)
- `longDescription`: Full description for detail page
- `price`: Price as string (e.g., "$85" or "€75")
- `image`: Path to main thumbnail image
- `images`: Array of images for detail page gallery
- `featured`: Set to `true` to show on homepage (max 3 recommended)

### 4. Configure Formspree

To enable email notifications for contact and reservation forms:

1. Go to [Formspree.io](https://formspree.io/) and create a free account
2. Create a new form and copy your form endpoint
3. Update the form action URLs in:
   - `item.html` (line 61): Replace `YOUR_FORM_ID`
   - `contact.html` (line 77): Replace `YOUR_FORM_ID`

Example:
```html
<form action="https://formspree.io/f/xpznkjwb" method="POST">
```

**Formspree Free Plan includes:**
- 50 submissions per month
- Email notifications
- Spam filtering
- Archive of submissions

### 5. Customize Content

Update the following files with your content:

- **Brand Information:** Edit text in `index.html`, `about.html`
- **Contact Email:** Replace `hello@lilyhouse.lv` throughout all HTML files
- **Social Media Links:** Update Instagram, Facebook URLs in all pages
- **Brand Colors:** Modify CSS variables in `css/style.css` (top of file)

```css
:root {
  --color-primary: #8b7355;      /* Main brand color */
  --color-secondary: #d4c4b0;    /* Secondary accent */
  --color-background: #fdfbf7;    /* Page background */
}
```

## Deploying to GitHub Pages

### Option 1: Deploy from Repository

1. **Create a new repository** on GitHub (e.g., `lilyhouse`)

2. **Initialize and push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Lilyhouse jewelry website"
   git branch -M main
   git remote add origin https://github.com/yourusername/lilyhouse.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**

4. **Access your site:**
   - Your site will be available at: `https://yourusername.github.io/lilyhouse/`
   - It may take a few minutes for the first deployment

### Option 2: Custom Domain

If you have a custom domain:

1. In repository Settings → Pages, enter your custom domain
2. Add a `CNAME` file to your repository with your domain:
   ```bash
   echo "www.yourdomai.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```
3. Configure your domain's DNS with these records:
   - `A` records pointing to GitHub's IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or `CNAME` record: `yourusername.github.io`

## Adding New Jewelry Items

1. **Prepare your images** and add them to the `images/` folder

2. **Edit `data/items.json`** and add a new item object:

```json
{
  "id": "emerald-earrings",
  "name": "Emerald Drop Earrings",
  "category": "earrings",
  "description": "Elegant emerald stones set in sterling silver",
  "longDescription": "These stunning earrings feature natural emerald stones carefully set in hand-formed sterling silver bezels. The earrings hang approximately 1.5 inches and have secure lever-back closures. Perfect for special occasions or adding a touch of elegance to any outfit.",
  "price": "$120",
  "image": "images/emerald-earrings.jpg",
  "images": [
    "images/emerald-earrings.jpg",
    "images/emerald-earrings-worn.jpg"
  ],
  "featured": false
}
```

3. **Save the file** and commit changes:
   ```bash
   git add data/items.json images/
   git commit -m "Add emerald earrings"
   git push
   ```

4. **Changes will be live** in a few minutes on GitHub Pages

## Customization Tips

### Changing Fonts

The site uses Google Fonts (Lora and Montserrat). To change:

1. Visit [Google Fonts](https://fonts.google.com/)
2. Select your fonts and copy the import URL
3. Replace the import in `css/style.css` (line 3)
4. Update the CSS variables (lines 6-7)

### Modifying Colors

All colors are defined as CSS variables at the top of `style.css`:

```css
:root {
  --color-primary: #8b7355;       /* Buttons, links, highlights */
  --color-secondary: #d4c4b0;     /* Hover states, accents */
  --color-text: #333333;          /* Main text color */
  --color-text-light: #666666;    /* Secondary text */
  --color-background: #fdfbf7;     /* Page background */
  --color-white: #ffffff;         /* White sections */
  --color-border: #e8e1d8;        /* Borders and dividers */
}
```

### Adding New Categories

1. Add items with the new category to `items.json`
2. Add a filter button in `collection.html`:
   ```html
   <button class="filter-btn" data-category="pendants">Pendants</button>
   ```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

### Image Optimization
- Compress images using [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
- Use appropriate sizes (max 1200px width for gallery images)
- Consider WebP format for modern browsers

### Loading Speed
The site is designed to be lightweight:
- No JavaScript frameworks (< 4KB JavaScript)
- Minimal CSS (< 15KB)
- No external dependencies except Google Fonts

## Troubleshooting

### Products not loading
- Check that `data/items.json` is valid JSON (use [JSONLint](https://jsonlint.com/))
- Ensure file paths are correct (case-sensitive on servers)
- Check browser console for errors (F12)

### Images not displaying
- Verify image paths in `items.json`
- Ensure images are actually in the `images/` folder
- Check image file names match exactly (case-sensitive)

### Forms not working
- Verify Formspree form ID is correct
- Check that form action URL starts with `https://formspree.io/f/`
- Test form submission and check Formspree dashboard

### Mobile menu not working
- Clear browser cache
- Check that `js/main.js` is loading correctly
- Open browser console to check for JavaScript errors

## Support

For questions or issues:
- Email: hello@lilyhouse.lv
- Create an issue on GitHub
- Check GitHub Pages [documentation](https://docs.github.com/en/pages)

## License

This project is open source and available for personal and commercial use.

## Credits

Built with ♡ for Lilyhouse  
Design & Development: 2026

---

**Ready to launch?** Push your code to GitHub and enable Pages. Your jewelry website will be live in minutes! ✨
