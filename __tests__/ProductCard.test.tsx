import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types/product';

const mockProduct: Product = {
  id: 1,
  title: 'Test Backpack',
  price: 49.99,
  description: 'A sturdy test backpack.',
  category: 'accessories',
  image: 'https://fakestoreapi.com/img/test.jpg',
  rating: { rate: 4.2, count: 120 },
};

describe('ProductCard', () => {
  it('renders the product title, price, category and rating', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Backpack')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    expect(screen.getByText('accessories')).toBeInTheDocument();
    expect(screen.getByText(/4.2/)).toBeInTheDocument();
    expect(screen.getByText(/120 reviews/)).toBeInTheDocument();
  });

  it('links to the correct product details page', () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link', { name: /view details/i });
    expect(link).toHaveAttribute('href', '/product/1');
  });

  it('renders the product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText('Test Backpack');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProduct.image);
  });
});
