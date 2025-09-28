import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  test("renders the main heading with the expected text", () => {
    render(<App />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: /school dashboard/i,
    });
    expect(heading).toBeInTheDocument();
  });

  test("matches the text content in the dashboard body and footer", () => {
    render(<App />);
    const bodyCopy = screen.getByText(/login to access the full dashboard/i);
    const footerCopy = screen.getByText(/copyright 2025 - holberton school/i);
    expect(bodyCopy).toBeInTheDocument();
    expect(footerCopy).toBeInTheDocument();
  });

  test("renders the Holberton logo image", () => {
    render(<App />);
    const logo = screen.getByRole("img", { name: /holberton logo/i });
    expect(logo).toBeInTheDocument();
  });
});
