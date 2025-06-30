import React from 'react';
import { ProductItem } from './GarbagePlanetCollection';

// Generate Racism collection products
export const generateRacismProducts = (): ProductItem[] => {
  const products: ProductItem[] = [];
  const productCodes = ['R1', 'R2', 'R4', 'R7', 'R9', 'R10', 'R11', 'R12'];

  productCodes.forEach(code => {
    for (let variant = 1; variant <= 4; variant++) {
      products.push({
        id: `racism-${code.toLowerCase()}-${variant}`,
        src: `/projects/raw-fiction-content/collections/racism/${code}-${variant}.jpg`,
        alt: `Racism Collection ${code} Variant ${variant}`,
        title: `${code}`,
        collection: 'Racism',
        category: 'Fashion',
        productCode: code,
        hasDescription: true,
        description: 'Powerful statement piece addressing social issues through fashion',
        fileSize: '6.2MB',
        resolution: '4K',
      });
    }
  });

  return products;
};

export const RACISM_DATA = {
  name: 'Racism',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sunt in culpa qui officia deserunt mollit anim.',
  products: ['R1', 'R2', 'R4', 'R7', 'R9', 'R10', 'R11', 'R12'],
};
