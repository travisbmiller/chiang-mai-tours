# Gallery Auto-Balancing System

This documentation explains how the gallery auto-balancing system works and how to add new images.

## How It Works

The gallery uses a height-based balancing algorithm that automatically distributes images across columns to create visually balanced layouts. Instead of simple round-robin distribution, it:

1. **Estimates image heights** based on aspect ratios
2. **Calculates total column heights** (including gaps)
3. **Places each new image** in the column with the least total height
4. **Responsive breakpoints** use different column counts:
   - Mobile: 2 columns
   - Tablet (sm): 3 columns
   - Desktop (md/lg): 4 columns
   - Extra Large (xl): 5 columns

## Adding New Images

When uploading new gallery images, follow this format:

```typescript
const galleryImages = [
  {
    src: "https://your-image-url.jpg",
    alt: "Descriptive alt text for accessibility",
    aspect: "portrait" // or "landscape" or "square"
  },
  // ... more images
];
```

### Aspect Ratio Guidelines

- **`portrait`**: Tall images (height > width) - estimated 400px height
- **`landscape`**: Wide images (width > height) - estimated 250px height
- **`square`**: Equal dimensions - estimated 300px height

### Tips for Best Results

1. **Mix aspect ratios** - Don't upload all portrait or all landscape images
2. **Accurate aspect classification** - This directly affects column balancing
3. **High-quality images** - Use at least 800px width for best display
4. **Consistent quality** - Similar image quality creates better visual flow
5. **Descriptive alt text** - Important for accessibility and SEO

## Technical Details

The balancing algorithm runs:
- **On initial page load**
- **On window resize** (responsive breakpoints)
- **Automatically** - no manual intervention needed

The system is located in:
- **Main logic**: `/src/app/page.tsx` - `distributeImagesAcrossColumns()`
- **Utility functions**: `/src/utils/galleryUtils.ts`
- **Gallery array**: `/src/app/page.tsx` - `galleryImages`

## Example Usage

```typescript
// Good mix of aspect ratios for balanced columns
const galleryImages = [
  { src: "image1.jpg", alt: "Traveler at temple", aspect: "portrait" },
  { src: "image2.jpg", alt: "Mountain landscape", aspect: "landscape" },
  { src: "image3.jpg", alt: "Group photo", aspect: "square" },
  { src: "image4.jpg", alt: "Temple detail", aspect: "portrait" },
  // ... continue pattern
];
```

This approach ensures your gallery will always look professionally balanced, regardless of the specific images you upload!
