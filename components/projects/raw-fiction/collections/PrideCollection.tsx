import type { ProductItem } from './GarbagePlanetCollection';

// Generate Pride collection products
export const generatePrideProducts = (): ProductItem[] => {
  const products: ProductItem[] = [];

  // Pride product types with their image counts
  const prideProducts = [
    { type: 'crop', name: 'Crop', count: 4 },
    { type: 'tee', name: 'Tee', count: 4 },
    { type: 'harness1', name: 'Harness 1', count: 4 },
    { type: 'harness2', name: 'Harness 2', count: 4 },
    { type: 'harness3', name: 'Harness 3', count: 2 },
    { type: 'belt', name: 'Belt', count: 1 },
    { type: 'painting1', name: 'Painting 1', count: 1 },
    { type: 'painting2', name: 'Painting 2', count: 1 },
    { type: 'painting3', name: 'Painting 3', count: 1 },
  ];

  prideProducts.forEach(({ type, name, count }) => {
    // Generate image variants for each product
    const imageVariants: string[] = [];
    const mainImage = type.startsWith('painting')
      ? `/projects/raw-fiction-content/collections/pride/${type}.jpg`
      : `/projects/raw-fiction-content/collections/pride/${type}-1.jpg`;

    if (type.startsWith('painting')) {
      // Paintings are single images
      imageVariants.push(`/projects/raw-fiction-content/collections/pride/${type}.jpg`);
    } else {
      // Other products have multiple variants
      for (let i = 1; i <= count; i++) {
        imageVariants.push(`/projects/raw-fiction-content/collections/pride/${type}-${i}.jpg`);
      }
    }

    products.push({
      id: `pride-${type}`,
      src: mainImage,
      alt: `Pride Collection ${name}`,
      title: name,
      collection: 'Pride',
      category: 'Fashion',
      productCode: `PRIDE-${type.toUpperCase()}`,
      hasDescription: false,
      description: '',
      fileSize: '2.4MB',
      resolution: '4K',
      sold: false,
      imageVariants,
      specifications: {
        sex: 'Unisex',
        color: 'Various',
        origin: 'Handmade in Austria',
        content: '100% organic materials',
        emissions: 'CO2 offset included',
        shipping: 'Made-to-order, 2 weeks delivery',
      },
    });
  });

  return products;
};

export const PRIDE_DATA = {
  name: 'Pride',
  description: 'Identity • Expression • Celebration of Diversity',
  productCount: 9, // crop, tee, harness1, harness2, harness3, belt, painting1, painting2, painting3
  productTypes: [
    'crop',
    'tee',
    'harness1',
    'harness2',
    'harness3',
    'belt',
    'painting1',
    'painting2',
    'painting3',
  ],
};
