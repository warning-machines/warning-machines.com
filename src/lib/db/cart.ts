import pool from '.';

export type CartItem = {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type CartItemWithProduct = CartItem & {
  name: string;
  description: string;
  price: number;
  image_url: string;
};

export async function getCartItems(userId: string): Promise<CartItemWithProduct[]> {
  const result = await pool.query(
    `SELECT ci.*, p.name, p.description, p.price, p.image_url
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = $1
     ORDER BY ci.created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function addToCart(
  userId: string,
  productId: number,
  quantity: number
): Promise<CartItem> {
  // Upsert: insert or update quantity if already exists
  const result = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, productId, quantity]
  );
  return result.rows[0];
}

export async function updateCartItemQuantity(
  userId: string,
  productId: number,
  quantity: number
): Promise<CartItem | null> {
  if (quantity <= 0) {
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    return null;
  }

  const result = await pool.query(
    `UPDATE cart_items SET quantity = $3, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND product_id = $2
     RETURNING *`,
    [userId, productId, quantity]
  );
  return result.rows[0];
}

export async function removeFromCart(userId: string, productId: number): Promise<void> {
  await pool.query(
    'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
}

export async function clearCart(userId: string): Promise<void> {
  await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
}
