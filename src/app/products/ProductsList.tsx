'use client';

import { ProductCard } from "./ProductCard"
import { Product } from "./types"

const products: Product[] = [
    {
        id: 'grenade',
        name: 'Grenade',
        description: 'Smart airsoft grenade with display, timer and motion sensor!',
        image: '/images/products/grenade.png',
        price: 150,
        isSaved: false
    },
    {
        id: 'grenade',
        name: 'Grenade',
        description: '',
        image: '/images/products/image.png',
        price: 100,
        isSaved: false
    },
    {
        id: 'grenade',
        name: 'Grenade',
        description: '',
        image: '/images/products/image.png',
        price: 100,
        isSaved: false
    },
    {
        id: 'grenade',
        name: 'Grenade',
        description: '',
        image: '/images/products/image.png',
        price: 100,
        isSaved: false
    },
    {
        id: 'grenade',
        name: 'Grenade',
        description: '',
        image: '/images/products/image.png',
        price: 100,
        isSaved: false
    },
    {
        id: 'grenade',
        name: 'Grenade',
        description: '',
        image: '/images/products/grenade.jpg',
        price: 100,
        isSaved: false
    },
    {
        id: 'grenade',
        name: 'Grenade',
        description: '',
        image: '/images/products/image.png',
        price: 100,
        isSaved: false
    },
    {
        id: 'grenade',
        name: 'Grenade',
        description: '',
        image: '/images/products/image.png',
        price: 100,
        isSaved: false
    }
]


export function ProductsList() {
    return <div className="products-list">
        {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
}