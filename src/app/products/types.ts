export type Product = {
  id: number;
  type: 'PRODUCT' | 'MEETING';
  name: string;
  description: string;
  price: number; // in cents
  image_url: string;
};
