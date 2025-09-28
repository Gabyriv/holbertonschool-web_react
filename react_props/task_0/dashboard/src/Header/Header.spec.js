import { render, screen } from "@testing-library/react";
import Header from "./Header.jsx";

describe("Header component", () => {
  // The header must display the dashboard title for consistent branding.
  test("renders the main heading with the expected text", () => {
    render(<Header />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: /school dashboard/i,
    });
    expect(heading).toBeInTheDocument();
  });

  // The header must keep the Holberton logo visible for brand recognition.
  test("renders the Holberton logo image", () => {
    render(<Header />);
    const logo = screen.getByRole("img", { name: /holberton logo/i });
    expect(logo).toBeInTheDocument();
  });
});
