import { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search products by title...',
}: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="product-search" className="form-label fw-semibold">
        Search
      </label>
      <input
        id="product-search"
        type="search"
        className="form-control form-control-lg"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-label="Search products by title"
      />
    </div>
  );
}
