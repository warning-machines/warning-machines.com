export type ProductData = {
  id: number;
  slug: string;
  type: 'PRODUCT' | 'MEETING';
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number; // in cents
  image_url: string;
  gallery: string[];
  features: string[];
  specs: Record<string, string>;
};

export const PRODUCTS: ProductData[] = [
  {
    id: 1,
    slug: 'grenade',
    type: 'PRODUCT',
    name: 'Grenade',
    tagline: 'Smart airsoft grenade with display, timer and motion sensor',
    description: 'Smart airsoft grenade with display, timer and motion sensor!',
    longDescription: `The Warning Machines Grenade is a fully programmable smart airsoft grenade built in-house by our engineering team. It combines a crisp digital display, a configurable countdown timer, and a motion-activation sensor into a rugged ABS shell — designed for realistic gameplay and competitive use.

The on-board microcontroller lets you set detonation delay, sensitivity, and activation mode via the built-in interface. A single charge via USB-C provides multiple sessions of use. The PCB, firmware, and housing are all designed and manufactured by Warning Machines.`,
    price: 15000,
    image_url: '/images/products/grenade.png',
    gallery: [
      '/images/products/grenade.png',
    ],
    features: [
      'Programmable countdown timer (1–60 s)',
      'Motion-activation sensor with adjustable sensitivity',
      'OLED digital display showing timer and mode',
      'USB-C rechargeable Li-ion battery',
      'Compact rugged ABS housing',
      'Custom firmware — fully open to modification',
    ],
    specs: {
      Material: 'ABS plastic + custom PCB',
      Battery: 'Li-ion 3.7 V, 500 mAh',
      Charging: 'USB-C, ~1 h full charge',
      Dimensions: '120 × 60 mm',
      Weight: '~150 g',
      'Operating voltage': '3.3 V logic',
    },
  },
  // Add more products here — copy the block above and change the id, slug, and content.
];

/** Lookup helpers */
export function getProductDataById(id: number): ProductData | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductDataBySlug(slug: string): ProductData | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getListableProducts(): ProductData[] {
  return PRODUCTS.filter((p) => p.type === 'PRODUCT');
}
