import type { ProductItem } from './GarbagePlanetCollection';

// Generate Pure Chlorine collection products
export const generatePureChlorineProducts = (): ProductItem[] => {
  const products: ProductItem[] = [];

  // Pure Chlorine collaboration products
  const pureChlorineProducts = [
    { type: 'PURECROP', name: 'Pure Crop', count: 6 },
    { type: 'HER', name: 'Her', count: 6 },
  ];

  pureChlorineProducts.forEach(({ type, name, count }) => {
    // Generate image variants for each product
    const imageVariants: string[] = [];
    const mainImage = `/projects/raw-fiction-content/collections/pure-chlorine/${type}_1.jpg`;

    // Generate all variants
    for (let i = 1; i <= count; i++) {
      imageVariants.push(
        `/projects/raw-fiction-content/collections/pure-chlorine/${type}_${i}.jpg`
      );
    }

    products.push({
      id: `pure-chlorine-${type.toLowerCase()}`,
      src: mainImage,
      alt: `Pure Chlorine Collection ${name}`,
      title: name,
      collection: 'Pure Chlorine',
      category: 'Fashion',
      productCode: `PC-${type}`,
      hasDescription: false,
      description: '',
      fileSize: '5.8MB',
      resolution: '4K',
      sold: false,
      imageVariants,
      specifications: {
        sex: 'Unisex',
        color: 'Black & White',
        origin: 'Handmade in Austria',
        content: '100% organic materials',
        emissions: 'CO2 offset included',
        shipping: 'Made-to-order, 2 weeks delivery',
        features: 'Limited edition collaboration with Pure Chlorine music artist',
      },
    });
  });

  return products;
};

export const PURE_CHLORINE_DATA = {
  name: 'Pure Chlorine',
  description: 'Limited Edition • Music Collaboration • Alternative Fashion',
  productCount: 2, // PURECROP, HER
  productTypes: ['PURECROP', 'HER'],
  collaborationWith: 'Pure Chlorine (Alt-Pop Band)',
};
