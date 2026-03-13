import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductDataById, getListableProducts } from '@/data/products';
import { AddToCartButton } from './AddToCartButton';
import './product-detail.css';

export async function generateStaticParams() {
  return getListableProducts().map((p) => ({ id: String(p.id) }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getProductDataById(Number(id));
  if (!data) notFound();

  // Shape compatible with CartModal / useCart
  const product = {
    id: data.id,
    type: data.type,
    name: data.name,
    description: data.description,
    price: data.price,
    image_url: data.image_url,
  };

  const displayPrice = (data.price / 100).toFixed(2);
  const hasSpecs = Object.keys(data.specs).length > 0;
  const hasGallery = data.gallery.length > 1;

  return (
    <div className="product-detail">
      <Link href="/products" className="product-detail__back">
        ← Back to products
      </Link>

      {/* Hero */}
      <div className="product-detail__hero">
        <div className="product-detail__image-wrap">
          <img
            src={data.image_url}
            alt={data.name}
            className="product-detail__image"
          />
        </div>

        <div className="product-detail__info">
          <span className="product-detail__badge">Warning Machines</span>
          <h1 className="product-detail__name">{data.name}</h1>
          <p className="product-detail__tagline">{data.tagline}</p>

          <div className="product-detail__price-row">
            <span className="product-detail__price">€{displayPrice}</span>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="product-detail__body">
        <div>
          {/* Long description */}
          <div className="product-detail__description">
            <h2>About</h2>
            <p>{data.longDescription}</p>
          </div>

          {/* Features */}
          {data.features.length > 0 && (
            <div className="product-detail__features">
              <h2>Features</h2>
              <ul className="product-detail__feature-list">
                {data.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Specs sidebar */}
        {hasSpecs && (
          <div className="product-detail__sidebar">
            <div className="product-detail__specs">
              <h2>Specifications</h2>
              <table className="product-detail__spec-table">
                <tbody>
                  {Object.entries(data.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Gallery */}
      {hasGallery && (
        <div className="product-detail__gallery">
          <h2>Gallery</h2>
          <div className="product-detail__gallery-grid">
            {data.gallery.map((src, i) => (
              <img key={i} src={src} alt={`${data.name} ${i + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
