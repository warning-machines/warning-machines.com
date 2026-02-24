import { NextResponse } from 'next/server';
import { getProducts, getAllProducts } from '@/lib/db/product';
import { initDatabase } from '@/lib/db';
import { PRODUCTS, getListableProducts } from '@/data/products';

let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (error) {
      console.log('Database init:', error instanceof Error ? error.message : 'unknown');
      dbInitialized = true;
    }
  }
}

// Map static ProductData to the DB Product shape
function staticToDbShape(p: (typeof PRODUCTS)[number]) {
  return {
    id: p.id,
    type: p.type,
    name: p.name,
    description: p.description,
    price: p.price,
    image_url: p.image_url,
  };
}

// GET /api/products
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get('all') === 'true';

  try {
    await ensureDbInitialized();
    const products = includeAll ? await getAllProducts() : await getProducts();
    if (products.length > 0) {
      return NextResponse.json({ products });
    }
    // DB returned empty — fall through to static data
  } catch (error) {
    console.warn('DB unavailable, serving static products:', error instanceof Error ? error.message : error);
  }

  // Fallback: serve from static data file
  const staticProducts = includeAll
    ? PRODUCTS.map(staticToDbShape)
    : getListableProducts().map(staticToDbShape);

  return NextResponse.json({ products: staticProducts });
}
