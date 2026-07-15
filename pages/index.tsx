import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { Product } from '../types/product';

interface HomeProps {
  initialProducts: Product[];
  fetchError: boolean;
}

const ITEMS_PER_PAGE = 8;
const FILTER_DELAY_MS = 300;

const HomePage: NextPage<HomeProps> = ({ initialProducts, fetchError }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsFiltering(true);

    const timeoutId = setTimeout(() => {
      const term = searchTerm.trim().toLowerCase();

      const next = term
        ? initialProducts.filter((p) =>
            p.title.toLowerCase().includes(term)
          )
        : initialProducts;

      setFilteredProducts(next);
      setCurrentPage(1);
      setIsFiltering(false);
    }, FILTER_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, initialProducts]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <>
      <Head>
        <title>BriBooks Store | Product Listing</title>
        <meta
          name="description"
          content="Browse products fetched server-side from the Fake Store API."
        />
      </Head>

      <Navbar />

      <main className="container pb-5">
        <h1 className="h3 mb-4">Our products</h1>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {fetchError && (
          <div className="alert alert-danger" role="alert">
            We couldn&apos;t load products right now. Please try refreshing
            the page.
          </div>
        )}

        {!fetchError && (
          <div className="results-area">
            {isFiltering && (
              <div className="overlay-spinner">
                <LoadingSpinner label="Filtering products..." />
              </div>
            )}

            {!isFiltering && filteredProducts.length === 0 && (
              <p className="text-muted">
                No products match &quot;{searchTerm}&quot;.
              </p>
            )}

            <div className="row">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </main>
    </>
  );
};

const FETCH_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
};

async function fetchWithRetry(
  url: string,
  retries = 1
): Promise<Product[]> {
  try {
    console.log('======================================');
    console.log('🚀 Starting SSR Request');
    console.log('URL:', url);

    const res = await fetch(url, {
      method: 'GET',
      headers: FETCH_HEADERS,
      cache: 'no-store',
    });

    console.log('Status:', res.status);
    console.log('Status Text:', res.statusText);

    const headers = Object.fromEntries(res.headers.entries());
    console.log('Headers:', headers);

    const body = await res.text();

    console.log('Body:');
    console.log(body);

    if (!res.ok) {
      throw new Error(`Fake Store API responded with ${res.status}`);
    }

    const products: Product[] = JSON.parse(body);

    console.log(`✅ Products fetched: ${products.length}`);
    console.log('======================================');

    return products;
  } catch (error) {
    console.error('======================================');
    console.error('SSR Fetch Failed');
    console.error(error);
    console.error('======================================');

    if (retries > 0) {
      console.log(`Retrying... (${retries} left)`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchWithRetry(url, retries - 1);
    }

    throw error;
  }
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const initialProducts = await fetchWithRetry(
      'https://fakestoreapi.com/products'
    );

    return {
      props: {
        initialProducts,
        fetchError: false,
      },
    };
  } catch (error) {
    console.error('❌ getServerSideProps Error:', error);

    return {
      props: {
        initialProducts: [],
        fetchError: true,
      },
    };
  }
};

export default HomePage;