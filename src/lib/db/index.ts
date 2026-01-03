import { Pool } from 'pg';

// Database connection pool - configure via environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize the cart table if it doesn't exist
// Uses user_id (Google's 'sub' claim) - unique and immutable unlike email
export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        image_url TEXT
      );
    `);

    await client.query(`
      INSERT INTO products (type, name, description, price, image_url)
      VALUES ('PRODUCT', 'Grenade', 'Smart airsoft grenade with display, timer and motion sensor!', 15000, '/images/products/grenade.png'),
      ('MEETING', 'Meeting', '1 hour meeting with technical leaders to discuss your project', 3000, '/images/products/meeting.png')
    `);
  } finally {
    client.release();
  }
}



export default pool;

