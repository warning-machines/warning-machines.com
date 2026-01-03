import pool from '.';

export async function getCartItems(userId: string) {
    const result = await pool.query(
        'SELECT * FROM cart_items WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    return result.rows;
}

export async function addToCart(
    userId: string,
    productId: string,
    productName: string,
    productPrice: number,
    productImage: string,
    quantity: number
) {
    // Upsert: insert or update quantity if already exists
    const result = await pool.query(
        `INSERT INTO cart_items (user_id, product_id, product_name, product_price, product_image, quantity)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $6, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
        [userId, productId, productName, productPrice, productImage, quantity]
    );
    return result.rows[0];
}

export async function updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number
) {
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

export async function removeFromCart(userId: string, productId: string) {
    await pool.query(
        'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [userId, productId]
    );
}

export async function clearCart(userId: string) {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
}