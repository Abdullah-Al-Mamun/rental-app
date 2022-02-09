import { render, cleanup } from '@testing-library/react';
import Return from './index';

afterEach(cleanup)

describe("renders return component", () => {

  test("renders without crashing", () => {
    const { getByText } = render(<Return show={true} products={[]} />);
    expect(getByText("Return a product")).toBeInTheDocument();
  });

  test("renders product input", () => {
    const { getByText } = render(<Return show={true} products={[]} />);
    expect(getByText("Product")).toBeTruthy();
  });

  test("renders used mileage input", () => {
    const { getByText } = render(<Return show={true} products={[]} />);
    expect(getByText("Used Mileage")).toBeTruthy();
  });

  test("renders need to repair input", () => {
    const { getByText } = render(<Return show={true} products={[]} />);
    expect(getByText("Need to Repair")).toBeTruthy();
  });

  test("renders from input", () => {
    const { getByText } = render(<Return show={true} products={[]} />);
    expect(getByText("From")).toBeTruthy();
  });

  test("renders to input", () => {
    const { getByText } = render(<Return show={true} products={[]} />);
    expect(getByText("To")).toBeTruthy();
  });

})
