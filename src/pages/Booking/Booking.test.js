import { render, screen } from '@testing-library/react';
import Booking from './Booking';

test('should render Booking component', () => {
  render(<Booking />);
  const titleElement = screen.getByText(/Booking Information/i);
  expect(titleElement).toBeInTheDocument();
});

