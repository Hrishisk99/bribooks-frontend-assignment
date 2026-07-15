import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../components/Pagination';

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a button for each page', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={jest.fn()} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('disables "Previous" on the first page and "Next" on the last page', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled();
  });

  it('calls onPageChange with the correct page when a page button is clicked', async () => {
    const handlePageChange = jest.fn();
    const user = userEvent.setup();

    render(<Pagination currentPage={1} totalPages={3} onPageChange={handlePageChange} />);

    await user.click(screen.getByText('2'));
    expect(handlePageChange).toHaveBeenCalledWith(2);

    await user.click(screen.getByRole('button', { name: /next page/i }));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });
});
