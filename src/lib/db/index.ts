import { Pool } from 'pg';
import { PRODUCTS } from '@/data/products';

// Database connection pool - configure via environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize tables if they don't exist
export async function initDatabase() {
  const client = await pool.connect();
  try {
    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        price INTEGER NOT NULL,
        image_url TEXT
      );
    `);

    // Cart items table - references products by ID
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      );
    `);

    // Seed products from static data file (ON CONFLICT to avoid duplicates)
    for (const p of PRODUCTS) {
      await client.query(
        `INSERT INTO products (id, type, name, description, price, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (name) DO NOTHING`,
        [p.id, p.type, p.name, p.description, p.price, p.image_url]
      );
    }
    // Keep the sequence in sync after explicit-id inserts
    await client.query(`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))`);
  } finally {
    client.release();
  }
}

export default pool;

