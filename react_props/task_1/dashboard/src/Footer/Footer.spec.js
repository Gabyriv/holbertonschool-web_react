import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { getCurrentYear, getFooterCopy } from "../utils/utils";

describe("Footer component", () => {
  // The footer should display the Holberton copyright notice.
  test("renders the footer copy with the current year (index view)", () => {
    render(<Footer />);
    const footerCopy = screen.getByText(/copyright/i);
    expect(footerCopy).toBeInTheDocument();
    const expectedText = `Copyright ${getCurrentYear()} - ${getFooterCopy(
      false
    )}`;
    expect(footerCopy).toHaveTextContent(expectedText);
  });
});
