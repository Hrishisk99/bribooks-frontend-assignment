import Link from 'next/link';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div className="card product-card shadow-sm">
        <div className="product-card-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.title} loading="lazy" />
        </div>
        <div className="card-body d-flex flex-column">
          <h2 className="product-title card-title h6">{product.title}</h2>
          <span className="badge bg-secondary-subtle text-secondary-emphasis category-badge align-self-start mb-2">
            {product.category}
          </span>
          {product.rating && (
            <p className="mb-2 small text-muted">
              ⭐ {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
            </p>
          )}
          <p className="fw-bold fs-5 mb-3">${product.price.toFixed(2)}</p>
          <Link
            href={`/product/${product.id}`}
            className="btn btn-outline-primary mt-auto"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
