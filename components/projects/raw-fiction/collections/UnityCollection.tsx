import type { ProductItem } from './GarbagePlanetCollection';

// Product information types
interface BaseProductInfo {
  name: string;
  price: string;
  sizes: string;
  sex: string;
  color: string;
  donations: string;
  description: string;
}

interface LimitedProductInfo extends BaseProductInfo {
  limited: string;
}

interface MadeToOrderProductInfo extends BaseProductInfo {
  madeToOrder: true;
}

type ProductInfo = BaseProductInfo | LimitedProductInfo | MadeToOrderProductInfo;

// Product information for Unity collection extracted from ProductDescriptions.txt
const UNITY_PRODUCT_INFO: Record<string, ProductInfo> = {
  R1: {
    name: 'R1',
    price: '65€',
    sizes: 'S, M, L, XL, XXL',
    sex: 'Unisex',
    color: 'White',
    donations: '25% of the price are donated to ENAR',
    description:
      'Organic cotton anti-unity statement piece supporting the European Network Against Unity.',
  },
  R2: {
    name: 'R2',
    price: '65€',
    sizes: 'S, M, L, XL, XXL',
    sex: 'Unisex',
    color: 'White',
    donations: '10% of the price are donated to ENAR',
    description: 'Organic cotton awareness shirt challenging unity with ethical production.',
  },
  R4: {
    name: 'R4',
    price: '65€',
    sizes: 'S, M, L, XL, XXL',
    sex: 'Unisex',
    color: 'Black',
    donations: '10% of the price are donated to ENAR',
    description: 'Bold black statement piece promoting equality and social justice.',
  },
  R7: {
    name: 'R7',
    price: '85€',
    sizes: 'Onesize (XXL-EU)',
    sex: 'Unisex',
    color: 'Black',
    donations: '10% of the price are donated to ENAR',
    description: 'Oversized hoodie with powerful anti-unity message and ethical production.',
  },
  R9: {
    name: 'R9',
    price: '84€',
    sizes: 'M, L',
    sex: 'Unisex/Women',
    color: 'Black',
    donations: '10% of the price are donated to ENAR',
    description: 'Thoughtfully designed piece raising awareness about racial equality.',
  },
  R10: {
    name: 'R10',
    price: '150€',
    sizes: 'M, L, XL (oversized fit)',
    sex: 'Unisex',
    color: 'White',
    donations: '10% of the price are donated to ENAR',
    description:
      'Handmade in Vienna, limited to 10 pieces worldwide. Premium anti-unity statement.',
    limited: 'Limited to 10 pieces worldwide',
  },
  R11: {
    name: 'R11',
    price: '290€',
    sizes: 'M and XL (Oversized)',
    sex: 'Unisex',
    color: 'Anthracite',
    donations: '10% of the price are donated to ENAR',
    description: 'Handcrafted premium piece in Vienna with powerful social message.',
    madeToOrder: true,
  },
  R12: {
    name: 'R12',
    price: '210€',
    sizes: 'M, L, XL',
    sex: 'Unisex',
    color: 'Anthracite',
    donations: '10% of the price are donated to ENAR',
    description: 'High-end made-to-order piece handcrafted in Vienna.',
    madeToOrder: true,
  },
};

// Generate Unity collection products
export const generateUnityProducts = (): ProductItem[] => {
  const products: ProductItem[] = [];

  // Product codes available in unity collection (in descending order for consistency)
  const productCodes = ['R12', 'R11', 'R10', 'R9', 'R7', 'R4', 'R2', 'R1'];

  productCodes.forEach(code => {
    const productInfo = UNITY_PRODUCT_INFO[code];
    if (!productInfo) return;

    // Generate image variants for each product (R1-1.jpg as main image following same pattern as shirts)
    const mainImage = `/projects/raw-fiction-content/collections/unity/${code}-1.jpg`;
    const imageVariants = [
      `/projects/raw-fiction-content/collections/unity/${code}-1.jpg`,
      `/projects/raw-fiction-content/collections/unity/${code}-2.jpg`,
      `/projects/raw-fiction-content/collections/unity/${code}-3.jpg`,
      `/projects/raw-fiction-content/collections/unity/${code}-4.jpg`,
    ];

    products.push({
      id: `unity-${code.toLowerCase()}`,
      src: mainImage,
      alt: `Unity Collection ${code}`,
      title: productInfo.name,
      collection: 'Unity',
      category: 'Fashion',
      productCode: code,
      hasDescription: true,
      description: productInfo.description,
      fileSize: '6.2MB',
      resolution: '4K',
      sold: false,
      price: productInfo.price,
      imageVariants,
      specifications: {
        sex: productInfo.sex,
        color: productInfo.color,
        origin:
          'madeToOrder' in productInfo
            ? 'Handmade in Vienna'
            : 'Germany, Bangladesh (FairWear & GOTS certified)',
        content: '100% organic cotton (GOTS certified)',
        emissions: 'We plant 1 tree for every piece sold',
        shipping: 'madeToOrder' in productInfo ? 'Made-to-order' : 'In stock',
        features: `Sizes: ${productInfo.sizes}${'limited' in productInfo ? `. ${(productInfo as LimitedProductInfo).limited}` : ''}`,
        donations: productInfo.donations,
      },
    });
  });

  return products;
};

export const UNITY_DATA = {
  name: 'Unity',
  description: 'Social Commentary • Awareness • Change Through Fashion',
  productCount: 8, // R1, R2, R4, R7, R9, R10, R11, R12
  productCodes: ['R1', 'R2', 'R4', 'R7', 'R9', 'R10', 'R11', 'R12'],
  partnerOrganization: 'ENAR (European Network Against Unity)',
};
