import pool from '.';

export type Product = {
  id: number;
  type: 'PRODUCT' | 'MEETING';
  name: string;
  description: string;
  price: number; // in cents
  image_url: string;
};

export async function getProducts(): Promise<Product[]> {
  const result = await pool.query(
    "SELECT * FROM products WHERE type = 'PRODUCT' ORDER BY id"
  );
  return result.rows;
}

export async function getAllProducts(): Promise<Product[]> {
  const result = await pool.query('SELECT * FROM products ORDER BY id');
  return result.rows;
}

export async function getProductById(id: number): Promise<Product | null> {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const result = await pool.query('SELECT * FROM products WHERE id = ANY($1)', [ids]);
  return result.rows;
}

export async function getProductByType(type: 'PRODUCT' | 'MEETING'): Promise<Product | null> {
  const result = await pool.query('SELECT * FROM products WHERE type = $1 LIMIT 1', [type]);
  return result.rows[0] || null;
}
