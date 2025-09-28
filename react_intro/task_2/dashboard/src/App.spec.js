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
    const footerCopy = screen.getByText(/copyright/i);
    expect(bodyCopy).toBeInTheDocument();
    const currentYear = new Date().getFullYear();
    expect(footerCopy).toHaveTextContent(
      new RegExp(`^Copyright\\s+${currentYear}\\s+-\\s+Holberton School$`, "i")
    );
  });

  test("renders the Holberton logo image", () => {
    render(<App />);
    const logo = screen.getByRole("img", { name: /holberton logo/i });
    expect(logo).toBeInTheDocument();
  });

  test("renders the two input fields one for email and the other for password", () => {
    render(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(emailInput.tagName.toLowerCase()).toBe("input");
    expect(passwordInput.tagName.toLowerCase()).toBe("input");
  });

  test("renders the two label elements with the text 'Email' and 'Password'", () => {
    render(<App />);
    const emailLabel = screen.getByText(/email/i);
    const passwordLabel = screen.getByText(/password/i);
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });

  test("renders the button element with the text 'OK'", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: /ok/i });
    expect(button).toBeInTheDocument();
  });
});
