// Gallery image distribution utilities

export interface GalleryImage {
  src: string;
  alt: string;
  aspect: 'portrait' | 'landscape' | 'square';
}

/**
 * Distributes images into columns with balanced heights
 * Uses a greedy algorithm to place each image in the column with the least total height
 */
export const distributeImagesIntoColumns = (images: GalleryImage[], numberOfColumns: number): GalleryImage[][] => {
  const columns: GalleryImage[][] = Array.from({ length: numberOfColumns }, () => []);
  const columnHeights = Array(numberOfColumns).fill(0);

  images.forEach((image) => {
    // Estimate height based on aspect ratio
    let estimatedHeight = 300; // default height for square

    switch (image.aspect) {
      case 'portrait':
        estimatedHeight = 400;
        break;
      case 'landscape':
        estimatedHeight = 250;
        break;
      case 'square':
        estimatedHeight = 300;
        break;
      default:
        estimatedHeight = 300;
    }

    // Find the column with the least total height
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

    // Add image to that column
    columns[shortestColumnIndex].push(image);
    columnHeights[shortestColumnIndex] += estimatedHeight + 24; // Add image height + gap
  });

  return columns;
};

/**
 * Creates responsive column distributions for different screen sizes
 */
export const createResponsiveGalleryDistribution = (images: GalleryImage[]) => {
  return {
    mobile: distributeImagesIntoColumns(images, 2),
    tablet: distributeImagesIntoColumns(images, 3),
    desktop: distributeImagesIntoColumns(images, 4),
    xl: distributeImagesIntoColumns(images, 5)
  };
};
