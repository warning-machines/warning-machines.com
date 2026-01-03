import pool from '.';


type Product = {
    id: string;
    type: 'PRODUCT' | 'MEETING';
    name: string;
    description: string;
    price: number;
    image_url: string;
}

export async function getProducts(): Promise<Product[]> {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
}

export async function getProductById(id: string): Promise<Product | null> {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
    const result = await pool.query('SELECT * FROM products WHERE id = ANY($1)', [ids]);
    return result.rows;
}

export async function getProductByType(type: 'PRODUCT' | 'MEETING'): Promise<Product | null> {
    const result = await pool.query('SELECT * FROM products WHERE type = $1', [type]);
    return result.rows[0];
}