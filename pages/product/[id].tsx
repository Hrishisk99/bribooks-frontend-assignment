import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { Product } from '../../types/product';

interface ProductDetailsProps {
  product: Product | null;
}

const ProductDetailsPage: NextPage<ProductDetailsProps> = ({ product }) => {
  if (!product) {
    return (
      <>
        <Navbar />
        <main className="container py-5 text-center">
          <h1 className="h4">Product not found</h1>
          <p className="text-muted">
            The product you&apos;re looking for doesn&apos;t exist or is unavailable.
          </p>
          <Link href="/" className="btn btn-primary mt-3">
            Back to listing
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{product.title} | BriBooks Store</title>
        <meta name="description" content={product.description} />
      </Head>

      <Navbar />

      <main className="container pb-5">
        <Link href="/" className="btn btn-link ps-0 mb-3">
          &larr; Back to all products
        </Link>

        <div className="row g-4">
          <div className="col-12 col-md-5">
            <div className="product-card-img-wrap border rounded" style={{ height: 320 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.title} />
            </div>
          </div>

          <div className="col-12 col-md-7">
            <span className="badge bg-secondary-subtle text-secondary-emphasis category-badge mb-2">
              {product.category}
            </span>
            <h1 className="h3">{product.title}</h1>

            {product.rating && (
              <p className="text-muted mb-2">
                ⭐ {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
              </p>
            )}

            <p className="fs-3 fw-bold text-primary">${product.price.toFixed(2)}</p>

            <h2 className="h6 mt-4">Description</h2>
            <p>{product.description}</p>

            <button type="button" className="btn btn-primary btn-lg mt-3">
              Add to cart
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ProductDetailsProps> = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);

    if (!res.ok) {
      return { props: { product: null } };
    }

    const product: Product = await res.json();

    if (!product || !product.id) {
      return { props: { product: null } };
    }

    return { props: { product } };
  } catch (error) {
    console.error(`Failed to fetch product ${id} via SSR:`, error);
    return { props: { product: null } };
  }
};

export default ProductDetailsPage;
