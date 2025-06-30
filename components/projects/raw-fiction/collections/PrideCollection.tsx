import React from 'react';
import { ProductItem } from './GarbagePlanetCollection';

// Generate Pride collection products
export const generatePrideProducts = (): ProductItem[] => {
  const products: ProductItem[] = [];

  Object.entries({
    crop: 4,
    tee: 4,
    harness1: 4,
    harness2: 4,
    harness3: 2,
    belt: 1,
    painting: 3,
  }).forEach(([type, count]) => {
    for (let i = 1; i <= count; i++) {
      products.push({
        id: `pride-${type}-${i}`,
        src: `/projects/raw-fiction-content/collections/pride/${type}-${i}.jpg`,
        alt: `Pride Collection ${type} ${i}`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`,
        collection: 'Pride',
        category: 'Fashion',
        productCode: `PRIDE-${type.toUpperCase()}-${i}`,
        hasDescription: false,
        fileSize: '2.4MB',
        resolution: '4K',
      });
    }
  });

  return products;
};

export const PRIDE_DATA = {
  name: 'Pride',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate.',
  productTypes: ['crop', 'tee', 'harness1', 'harness2', 'harness3', 'belt', 'painting'],
  getProductImages: (type: string) => {
    const counts = {
      crop: 4,
      tee: 4,
      harness1: 4,
      harness2: 4,
      harness3: 2,
      belt: 1,
      painting: 3,
    };
    return counts[type as keyof typeof counts] || 0;
  },
};
