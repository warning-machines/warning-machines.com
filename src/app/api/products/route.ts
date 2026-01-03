import { NextResponse } from 'next/server';
import { getProducts, getAllProducts } from '@/lib/db/product';
import { initDatabase } from '@/lib/db';

// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (error) {
      // Table might already exist, that's fine
      console.log('Database init:', error instanceof Error ? error.message : 'unknown');
      dbInitialized = true;
    }
  }
}

// GET /api/products
export async function GET(request: Request) {
  try {
    await ensureDbInitialized();
    
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';
    
    const products = includeAll ? await getAllProducts() : await getProducts();
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

