import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header component", () => {
  // The header must keep the Holberton logo visible for brand recognition.
  test("contains the Holberton logo image", () => {
    render(<Header />);
    const logo = screen.getByRole("img", { name: /holberton logo/i });
    expect(logo).toBeInTheDocument();
  });

  // The header must display the dashboard title for consistent branding.
  test("contains the h1 heading with the correct text", () => {
    render(<Header />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: /school dashboard/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
