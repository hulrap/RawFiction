import type { ProductItem } from './GarbagePlanetCollection';

// Product information for Garbage Planet 2.0 collection
const GP2_PRODUCT_INFO = {
  '2.1': {
    name: 'Armour',
    inStock: false, // Limited to 10 pieces worldwide
    sex: 'Unisex (Model size M)',
    description:
      'Limited edition armour piece made from 100% stainless steel with cotton/rubber finish. Handcrafted and finished in Austria by artist Martijn Straatman. Ring mesh created in Germany with sustainable energy practices.',
    features:
      'Ring mesh made of stainless steel (outer ring 7mm, inner 5.4mm, 0.8mm diameter), weighs 3.15kg/sqm, finished with cotton/rubber band, can be worn from both sides, perfect for standing out.',
    content: '100% stainless steel, with some rubber and cotton',
    color: 'Silver',
    origin: 'Made in Germany, Finished in Austria',
    special: 'Limited to 10 pieces worldwide, 10 trees planted per piece, fully recyclable',
  },
  '2.2': {
    name: 'Jumpsuit',
    inStock: true,
    sex: 'Unisex (Model size M)',
    description:
      'Sustainable jumpsuit handcrafted from 100% European hemp. Interpretation from industrial workwear to avant-garde streetwear with no need to match your outfit.',
    features:
      '100% European hemp denim (345g/sqm), industrial workwear inspired design, avant-garde streetwear aesthetic, perfect standalone piece.',
    content: '100% european hemp',
    color: 'Black',
    origin: 'Handmade in Austria',
  },
  '2.3': {
    name: 'TShirt',
    inStock: true,
    sex: 'Unisex (Model size M)',
    description:
      'Unique wide-fit T-shirt made from premium organic cotton. Supreme fabric quality with a design that stands out from conventional shirts.',
    features:
      '100% organic cotton interlock fabric (220g/sqm), unique wide-fit pattern, supreme fabric quality, distinctive design.',
    content: '100% organic cotton',
    color: 'Black',
    origin: 'Handmade in Austria',
  },
  '2.4': {
    name: 'Wrap Pants',
    inStock: true,
    sex: 'Unisex (Model size M)',
    description:
      'Innovative wrap pants with unique pattern design. Versatile garment blurring lines between pants and dress, fitting into nearly every occasion.',
    features:
      '100% organic cotton interlock fabric (220g/sqm), unique pattern design, versatile styling options, true essential piece.',
    content: '100% organic cotton',
    color: 'Black',
    origin: 'Handmade in Austria',
  },
  '2.5': {
    name: 'Wrap Body',
    inStock: true,
    sex: 'Unisex (Model size M)',
    description:
      'Versatile wrap body that can be worn in many different ways. Perfect for frequent style changes and creative styling experiments.',
    features:
      '100% organic cotton interlock fabric (220g/sqm), multiple wearing options, utility-focused design, perfect for style experimentation.',
    content: '100% organic cotton',
    color: 'Black',
    origin: 'Handmade in Austria',
  },
  '2.6': {
    name: 'High Pants',
    inStock: true,
    sex: 'Unisex (Model size M)',
    description:
      'High-waisted pants made from European hemp denim. A statement piece that will make you look smoking hot.',
    features:
      '100% European hemp denim (345g/sqm), high waist design, distinctive look, premium hemp construction.',
    content: '100% european hemp',
    color: 'Black',
    origin: 'Handmade in Austria',
  },
  '2.7': {
    name: 'High Short Pants',
    inStock: true,
    sex: 'Unisex (Model size M)',
    description:
      'High-waisted short pants crafted from European hemp denim. High waist, short legs - perfect fit for aliens.',
    features:
      '100% European hemp denim (345g/sqm), high waist design, short leg cut, unique alien-inspired aesthetic.',
    content: '100% european hemp',
    color: 'Black',
    origin: 'Handmade in Austria',
  },
};

// Generate product images for Garbage Planet 2.0 collection
export const generateGarbagePlanet2Products = (): ProductItem[] => {
  const products: ProductItem[] = [];

  // GP2.7 to GP2.1 (products in descending order)
  const productKeys = ['2.7', '2.6', '2.5', '2.4', '2.3', '2.2', '2.1'];

  productKeys.forEach(key => {
    const productInfo = GP2_PRODUCT_INFO[key as keyof typeof GP2_PRODUCT_INFO];
    const productCode = `GP${key}`;

    // Count available image variants for this product
    const imageVariants: string[] = [];
    const fileMapping: { [key: string]: string[] } = {
      '2.1': ['GP21-1.jpg', 'GP21-2.jpg', 'GP21-3.jpg', 'GP21-4.jpg', 'GP21-5.jpg', 'GP21-6.jpg'],
      '2.2': ['GP22-1.jpg', 'GP22-2.jpg', 'GP22-3.jpg', 'GP22-4.jpg'],
      '2.3': ['GP23-1.jpg', 'GP23-2.jpg', 'GP23-3.jpg', 'GP23-4.jpg'],
      '2.4': [
        'GP24-1.jpg',
        'GP24-2.jpg',
        'GP24-3.jpg',
        'GP24-4.jpg',
        'GP24-5.jpg',
        'GP24-6.jpg',
        'GP24-7.jpg',
        'GP24-8.jpg',
      ],
      '2.5': ['GP25-1.jpg', 'GP25-2.jpg', 'GP25-3.jpg', 'GP25-4.jpg', 'GP25-5.jpg', 'GP25-6.jpg'],
      '2.6': ['GP26-1.jpg', 'GP26-2.jpg', 'GP26-3.jpg', 'GP26-4.jpg'],
      '2.7': ['GP27-1.jpg', 'GP27-2.jpg', 'GP27-3.jpg'],
    };

    const files = fileMapping[key] || [];
    files.forEach(filename => {
      imageVariants.push(`/projects/raw-fiction-content/collections/garbage-planet-2/${filename}`);
    });

    // Use first image as main image
    const mainImage =
      imageVariants[0] ||
      `/projects/raw-fiction-content/collections/garbage-planet-2/GP${key.replace('.', '')}-1.jpg`;

    products.push({
      id: `gp2-${key.replace('.', '-')}`,
      src: mainImage,
      alt: `${productInfo.name}`,
      title: `${productCode} - ${productInfo.name}`,
      collection: 'Garbage Planet 2.0',
      category: 'Fashion',
      productCode,
      hasDescription: true,
      description: productInfo.description,
      fileSize: '4.2MB',
      resolution: '4K',
      sold: !productInfo.inStock,
      imageVariants,
      credits: {
        photographer: 'Ivana Dzoic',
        models: ['Nabé Begle', 'Celina Abaez', 'Liam Solbjerg'],
      },
      specifications: {
        sex: productInfo.sex,
        color: productInfo.color,
        origin: productInfo.origin,
        content: productInfo.content,
        emissions: 'CO2 offset included',
        shipping: 'Made-to-order, 2 weeks delivery',
        features: productInfo.features,
        donations: '10% donated to Pure Earth',
        badge:
          productInfo.name === 'Armour'
            ? 'Agent-Badge included (handmade tin)'
            : 'Agent-Badge included (handmade tin)',
      },
    });
  });

  return products;
};

export const GARBAGE_PLANET_2_DATA = {
  name: 'Garbage Planet 2.0',
  description:
    'The evolution of sustainable fashion. Featuring advanced materials like European hemp and stainless steel armor, this collection pushes the boundaries of eco-conscious design. From limited edition metal mesh armor to innovative wrap garments, each piece represents the next chapter in environmental awareness through fashion.',
  productCount: 7, // GP2.1-GP2.7
  hasProductDescriptions: () => true, // All GP2 products have descriptions
  getProductCode: (productNum: string) => `GP${productNum}`,
};
