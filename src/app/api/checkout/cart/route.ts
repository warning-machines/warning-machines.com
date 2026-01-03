import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProductById, getProductsByIds } from '@/lib/db/product';
import { getCartItems } from '@/lib/db/cart';

// TO DO: Use token instead of email
type CheckoutPayload = {
    email: string
    userId: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: CheckoutPayload = await request.json();
        const { userId, email } = body;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const cartItems = await getCartItems(userId);

        const products = await getProductsByIds(cartItems.map(item => item.product_id));

        if (products.length !== cartItems.length) {
            return NextResponse.json({ error: 'One or more products not found' }, { status: 400 });
        }

        for (const item of cartItems) {
            if (item.quantity < 1 || item.quantity > 100) {
                return NextResponse.json({ error: 'Quantity must be between 1 and 100' }, { status: 400 });
            }
        }



        const origin = request.headers.get('origin') || 'http://localhost:3000';

        console.log(cartItems);
        console.log(products);

        const lineItems = cartItems.map(item => {
            const product = products.find(product => product.id === item.product_id);
            if (!product) {
                return null;
            }
            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.name,
                        description: product.description,
                    },
                    unit_amount: product.price,
                },
                quantity: item.quantity,
            }
        });

        if(lineItems.some(item => item === null)) {
            return NextResponse.json({ error: 'One or more products not found' }, { status: 400 });
        }
        
        const nonNullLineItems = lineItems.filter(item => item !== null);

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: email,
            line_items: nonNullLineItems,
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/cancel`,
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}

