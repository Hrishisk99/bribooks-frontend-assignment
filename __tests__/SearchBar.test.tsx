import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  it('renders with the given value', () => {
    render(<SearchBar value="phone" onChange={jest.fn()} />);
    expect(screen.getByLabelText(/search products by title/i)).toHaveValue('phone');
  });

  it('calls onChange with the new value as the user types', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<SearchBar value="" onChange={handleChange} />);
    const input = screen.getByLabelText(/search products by title/i);

    await user.type(input, 'shirt');

    // Since the input stays controlled with a fixed empty value in this test,
    // each keystroke fires its own onChange event with that single character.
    expect(handleChange).toHaveBeenCalledTimes(5);
    expect(handleChange).toHaveBeenNthCalledWith(1, 's');
    expect(handleChange).toHaveBeenLastCalledWith('t');
  });

  it('uses the custom placeholder when provided', () => {
    render(<SearchBar value="" onChange={jest.fn()} placeholder="Find something..." />);
    expect(screen.getByPlaceholderText('Find something...')).toBeInTheDocument();
  });
});
