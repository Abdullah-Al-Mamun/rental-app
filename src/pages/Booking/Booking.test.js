import { render, screen } from '@testing-library/react';
import Booking from './Booking';

test('renders page title', () => {
  render(<Booking />);
  const titleEle = screen.getByText(/Booking Information/i);
  expect(titleEle).toBeInTheDocument();
});
