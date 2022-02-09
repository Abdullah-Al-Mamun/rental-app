import { render, cleanup } from '@testing-library/react';
import Booking from './index';

afterEach(cleanup)

describe("renders booking component", () => {

  test("renders without crashing", () => {
    const { getByText } = render(<Booking show={true} products={[]} />);
    expect(getByText("Book a product")).toBeInTheDocument();
  });

  test("renders product input", () => {
    const { getByText } = render(<Booking show={true} products={[]} />);
    expect(getByText("Product")).toBeTruthy();
  });

  test("renders mileage input", () => {
    const { getByText } = render(<Booking show={true} products={[]} />);
    expect(getByText("Mileage")).toBeTruthy();
  });

  test("renders need to repair input", () => {
    const { getByText } = render(<Booking show={true} products={[]} />);
    expect(getByText("Need to Repair")).toBeTruthy();
  });

  test("renders from input", () => {
    const { getByText } = render(<Booking show={true} products={[]} />);
    expect(getByText("From")).toBeTruthy();
  });

  test("renders to input", () => {
    const { getByText } = render(<Booking show={true} products={[]} />);
    expect(getByText("To")).toBeTruthy();
  });

})
