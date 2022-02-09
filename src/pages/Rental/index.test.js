import { render, cleanup } from '@testing-library/react';
import Rental from './index';

afterEach(cleanup)

describe("renders rental page", () => {

  test("renders without crashing", () => {
    const { getByText } = render(<Rental />);
    expect(getByText("Rental Information")).toBeInTheDocument();
  });

  test("renders search input", () => {
    const { getByPlaceholderText } = render(<Rental />);
    expect(getByPlaceholderText("Keyword Search")).toBeTruthy();
  });

  test("renders book button", () => {
    const { getByText } = render(<Rental />);
    expect(getByText('Book', { selector: 'span' })).toBeTruthy();
  });

  test("renders return button", () => {
    const { getByText } = render(<Rental />);
    expect(getByText('Return', { selector: 'span' })).toBeTruthy();
  });

})
