export interface ProductItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  collection?: string;
  category: string;
  fileSize?: string;
  resolution?: string;
  hasDescription?: boolean;
  productCode: string;
  sold?: boolean;
  price?: string;
  imageVariants?: string[];
  credits?: {
    photographer: string;
    models: string[];
  };
  specifications?: {
    sex: string;
    color: string;
    origin: string;
    content: string;
    emissions: string;
    shipping: string;
    features?: string;
    donations?: string;
    badge?: string;
  };
}

// Product information for Garbage Planet collection
const GP_PRODUCT_INFO = {
  16: {
    name: 'Crop-top',
    sold: true,
    sex: 'Unisex/Feminine (Model size M)',
    description:
      'Our crop-top is handcrafted in Vienna, Austria with love. The fabric consists of pure GOTS certified linen. Our crop-top is Unisex, but with a feminine touch. Besides the cotton yarn they are 100% made out of woven black linen fabric, featuring a steel button on the backside of the neck.',
    features:
      'Unisex design with feminine touch, 100% woven black linen fabric, steel button on neck backside, very airy and cooling due to linen fabric - perfect for warm summer days.',
  },
  17: {
    name: 'Hotpants',
    sold: true,
    sex: 'Unisex/Feminine',
    description: 'Handcrafted sustainable hotpants made from 100% organic GOTS certified linen.',
    features:
      'Comfortable fit, sustainable materials, handmade in Vienna with high social standards.',
  },
  18: {
    name: 'Turtleneck',
    sold: true,
    sex: 'Feminine (Model size M)',
    description:
      'Our turtleneck is handcrafted in Vienna, Austria with love. The fabric consists of pure GOTS certified linen. Our turtleneck is feminine. Besides the cotton yarn it is 100% made out of woven black linen fabric, featuring steel buttons on the collar.',
    features:
      'Feminine design, 100% woven black linen fabric, steel buttons on collar, can be worn with buttons in front or back.',
  },
  19: {
    name: 'Kimono',
    sold: true,
    sex: 'Unisex',
    description: 'Elegant kimono design handcrafted from sustainable materials.',
    features: 'Flowing kimono silhouette, versatile styling options, made from organic linen.',
  },
  20: {
    name: 'LongT',
    sold: true,
    sex: 'Unisex',
    description: 'Long-sleeved sustainable t-shirt made from organic materials.',
    features: 'Comfortable long-sleeve design, breathable linen fabric, minimalist aesthetic.',
  },
  21: {
    name: 'Pants',
    sold: true,
    sex: 'Unisex',
    description: 'Sustainable pants crafted from organic linen with attention to detail.',
    features: 'Comfortable fit, durable construction, timeless design.',
  },
  22: {
    name: 'Tank Kimono',
    sold: true,
    sex: 'Unisex',
    description: 'Unique tank kimono hybrid design combining comfort and style.',
    features: 'Innovative design, lightweight feel, perfect for layering.',
  },
  23: {
    name: 'Apron',
    sold: true,
    sex: 'Unisex',
    description: 'Functional apron made from sustainable materials with Raw Fiction aesthetic.',
    features: 'Practical design, durable construction, sustainable materials.',
  },
};

// Generate product images for Garbage Planet collection
export const generateGarbagePlanetProducts = (): ProductItem[] => {
  const products: ProductItem[] = [];

  // GP16-GP23 (products with detailed descriptions) - Added first for descending order
  for (let i = 23; i >= 16; i--) {
    const productInfo = GP_PRODUCT_INFO[i as keyof typeof GP_PRODUCT_INFO];

    // Special image ordering for specific products
    let mainImage: string;
    let imageVariants: string[];

    if (i === 21) {
      // GP21 (Pants): 2nd image (GP21-2.jpg) as main
      mainImage = `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-2.jpg`;
      imageVariants = [
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-2.jpg`,
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-4.jpg`,
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-3.jpg`,
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-1.jpg`,
      ];
    } else if (i === 20 || i === 16) {
      // GP20 (LongT) and GP16 (Crop-top): 4th image (GP-1.jpg) as main
      mainImage = `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-1.jpg`;
      imageVariants = [
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-1.jpg`,
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-4.jpg`,
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-3.jpg`,
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-2.jpg`,
      ];
    } else {
      // Default ordering for other products
      mainImage = `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-4.jpg`;
      imageVariants = [
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-4.jpg`,
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-3.jpg`,
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-2.jpg`,
        `/projects/raw-fiction-content/collections/garbage-planet-1/GP${i}-1.jpg`,
      ];
    }

    products.push({
      id: `gp${i}`,
      src: mainImage,
      alt: `${productInfo.name}`,
      title: `GP${i} - ${productInfo.name}`,
      collection: 'Garbage Planet',
      category: 'Fashion',
      productCode: `GP${i}`,
      hasDescription: true,
      description: productInfo.description,
      fileSize: '2.3MB',
      resolution: '4K',
      sold: productInfo.sold,
      imageVariants,
      specifications: {
        sex: productInfo.sex,
        color: 'Black',
        origin: 'Handmade in Austria',
        content: '100% organic linen',
        emissions: 'CO2 offset included',
        shipping: 'Made-to-order, 2 weeks delivery',
        features: productInfo.features,
        donations: '10% donated to Pure Earth',
        badge: 'Agent-Badge included (handmade tin)',
      },
    });
  }

  // GP1-GP15 (shirts without descriptions, using GB image files) - Added second for descending order
  for (let i = 15; i >= 1; i--) {
    // For shirts: -1.jpg files are the main/first images
    const mainImage = `/projects/raw-fiction-content/collections/garbage-planet-1/GB${i}-1.jpg`;
    const imageVariants = [
      `/projects/raw-fiction-content/collections/garbage-planet-1/GB${i}-1.jpg`, // -1 as main/first
      `/projects/raw-fiction-content/collections/garbage-planet-1/GB${i}-2.jpg`, // -2 as second
      `/projects/raw-fiction-content/collections/garbage-planet-1/GB${i}-3.jpg`, // -3 as third
    ];

    products.push({
      id: `gp${i}`,
      src: mainImage,
      alt: `Garbage Planet Shirt GP${i}`,
      title: `GP${i} - Shirt`,
      collection: 'Garbage Planet',
      category: 'T-Shirts',
      productCode: `GP${i}`,
      hasDescription: false,
      description: '',
      fileSize: '2.1MB',
      resolution: '4K',
      sold: false,
      imageVariants,
      specifications: {
        sex: 'Unisex',
        color: 'Black',
        origin: 'Handmade in Austria',
        content: '100% organic materials',
        emissions: 'CO2 offset included',
        shipping: 'Made-to-order, 2 weeks delivery',
      },
    });
  }

  return products;
};

export const GARBAGE_PLANET_DATA = {
  name: 'Garbage Planet',
  description:
    'Sustainable fashion collection featuring handcrafted pieces made from 100% organic linen. Each garment is produced in Vienna, Austria with high environmental and social standards. The collection includes shirts (GB1-GB15) and detailed fashion pieces (GP16-GP23) with complete sustainability features.',
  productCount: 23, // GP1-GP23 (23 products total)
  hasProductDescriptions: (productNum: number) => productNum >= 16, // GB1-15 don't have descriptions
  getProductCode: (productNum: number) =>
    productNum <= 15 ? `GB${productNum}` : `GP${productNum}`,
};
