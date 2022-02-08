import { render, screen } from '@testing-library/react';
import Rental from '../../pages/Rental';

test('renders rental link', () => {
  render(<Rental />);
  const linkElement = screen.getByText(/Rental Information/i);
  expect(linkElement).toBeInTheDocument();
});
