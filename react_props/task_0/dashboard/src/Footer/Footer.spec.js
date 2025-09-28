import { render, screen } from "@testing-library/react";
import Footer from "./Footer.jsx";
import { getCurrentYear, getFooterCopy } from "../utils/utils.js";

describe("Footer component", () => {
  // The footer should display the Holberton copyright notice.
  test("renders the footer copy with the current year", () => {
    render(<Footer />);
    const footerCopy = screen.getByText(/copyright/i);
    expect(footerCopy).toBeInTheDocument();
    const expectedText = `Copyright ${getCurrentYear()} - ${getFooterCopy(false)}`;
    expect(footerCopy).toHaveTextContent(expectedText);
  });
});
