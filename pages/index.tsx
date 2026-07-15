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
// Simulated debounce/filter delay so the loading spinner has something to show.
const FILTER_DELAY_MS = 300;

const HomePage: NextPage<HomeProps> = ({ initialProducts, fetchError }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side filtering by title, with a small artificial delay so the
  // spinner requirement is demonstrable (real filtering itself is instant).
  useEffect(() => {
    setIsFiltering(true);

    const timeoutId = setTimeout(() => {
      const term = searchTerm.trim().toLowerCase();
      const next = term
        ? initialProducts.filter((p) => p.title.toLowerCase().includes(term))
        : initialProducts;

      setFilteredProducts(next);
      setCurrentPage(1);
      setIsFiltering(false);
    }, FILTER_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, initialProducts]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

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

        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {fetchError && (
          <div className="alert alert-danger" role="alert">
            We couldn&apos;t load products right now. Please try refreshing the page.
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
              <p className="text-muted">No products match &quot;{searchTerm}&quot;.</p>
            )}

            <div className="row">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
  'User-Agent':
    'Mozilla/5.0 (compatible; BriBooksStore/1.0; +https://bribooks-frontend-assignment.vercel.app)',
  Accept: 'application/json',
};

// fakestoreapi.com is a free, occasionally flaky API, so retry once on
// failure before giving up and showing the error state.
async function fetchWithRetry(url: string, retries = 1): Promise<Response> {
  try {
    const res = await fetch(url, { headers: FETCH_HEADERS });
    if (!res.ok) throw new Error(`Fake Store API responded with ${res.status}`);
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return fetchWithRetry(url, retries - 1);
    }
    throw err;
  }
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const res = await fetchWithRetry('https://fakestoreapi.com/products');
    const initialProducts: Product[] = await res.json();

    return {
      props: {
        initialProducts,
        fetchError: false,
      },
    };
  } catch (error) {
    console.error('Failed to fetch products via SSR:', error);
    return {
      props: {
        initialProducts: [],
        fetchError: true,
      },
    };
  }
};

export default HomePage;
