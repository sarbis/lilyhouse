# Images Folder

This folder is organized into subfolders:

## Folder Structure

- **`site/`** - Technical site images (logo, favicon, icons) - Do not modify
- **`products/`** - Your jewelry product images - Add your photos here

## Image Guidelines for Product Photos

### File Format
- Use JPG for photographs
- Use PNG for images with transparency
- Consider WebP for better compression (modern browsers)

### Image Sizes
- **Gallery thumbnails:** 800x800px (square crops work best)
- **Detail page main images:** 1200x1200px or larger
- **Hero/banner images:** 1920x800px (optional)
- **About page images:** 800x600px

### Optimization
Before uploading, compress your images using:
- [TinyPNG](https://tinypng.com/) - free online compression
- [Squoosh](https://squoosh.app/) - advanced compression tool
- [ImageOptim](https://imageoptim.com/) - Mac app for batch optimization

### Naming Convention
Use descriptive, lowercase names with hyphens:
- ✅ `pearl-necklace.jpg`
- ✅ `silver-ring-detail.jpg`
- ✅ `gold-hoops-worn.jpg`
- ❌ `IMG_1234.jpg`
- ❌ `Photo 1.jpg`

### Example Structure
```
images/
├── pearl-necklace.jpg
├── pearl-necklace-detail.jpg
├── silver-ring.jpg
├── silver-ring-detail.jpg
├── gold-hoops.jpg
├── gold-hoops-worn.jpg
└── ... more images
```

## Adding Images

1. Add your image files to this folder
2. Update `data/items.json` with the correct image paths
3. Commit and push to GitHub

Example in items.json:
```json
"image": "images/pearl-necklace.jpg",
"images": [
  "images/pearl-necklace.jpg",
  "images/pearl-necklace-detail.jpg"
]
```

## Tips

- Use consistent lighting and backgrounds for a professional look
- Show items from multiple angles when possible
- Include detail shots that highlight craftsmanship
- Consider lifestyle shots showing jewelry being worn
- Keep file sizes under 500KB per image for good performance
