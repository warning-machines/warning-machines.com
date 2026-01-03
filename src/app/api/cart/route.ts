import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';
import {getCartItems, addToCart, updateCartItemQuantity, removeFromCart, clearCart} from '@/lib/db/cart';


// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// GET /api/cart?userId=google-sub-id
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const items = await getCartItems(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const body = await request.json();
    const { userId, productId, productName, productPrice, productImage, quantity } = body;

    if (!userId || !productId || !productName || productPrice === undefined || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const item = await addToCart(userId, productId, productName, productPrice, productImage || '', quantity);
    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// PATCH /api/cart - Update item quantity
export async function PATCH(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const body = await request.json();
    const { userId, productId, quantity } = body;

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const item = await updateCartItemQuantity(userId, productId, quantity);
    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE /api/cart - Remove item or clear cart
export async function DELETE(request: NextRequest) {
  try {
    await ensureDbInitialized();
    
    const userId = request.nextUrl.searchParams.get('userId');
    const productId = request.nextUrl.searchParams.get('productId');
    const clearAll = request.nextUrl.searchParams.get('clearAll');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (clearAll === 'true') {
      await clearCart(userId);
    } else if (productId) {
      await removeFromCart(userId, productId);
    } else {
      return NextResponse.json({ error: 'productId or clearAll is required' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}

