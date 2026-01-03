import { Pool } from 'pg';

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

    // Seed products (use ON CONFLICT to avoid duplicates on re-run)
    await client.query(`
      INSERT INTO products (type, name, description, price, image_url)
      VALUES 
        ('PRODUCT', 'Grenade', 'Smart airsoft grenade with display, timer and motion sensor!', 15000, '/images/products/grenade.png'),
        ('MEETING', 'Consultation Meeting', '30-minute consultation with our engineering team', 5000, '/images/products/meeting.png')
      ON CONFLICT (name) DO NOTHING;
    `);
  } finally {
    client.release();
  }
}

export default pool;

