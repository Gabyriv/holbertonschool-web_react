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

  // Inputs: ensure there are exactly 2 inputs, one for email and one for password
  test("renders exactly 2 input elements: email and password", () => {
    const { container } = render(<App />);
    const inputs = container.querySelectorAll("input");
    expect(inputs.length).toBe(2);

    // Find by accessible label text (case-insensitive)
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput.tagName.toLowerCase()).toBe("input");
    expect(passwordInput.tagName.toLowerCase()).toBe("input");
  });

  // Labels: ensure there are exactly 2 label elements with the expected texts
  test("renders exactly 2 label elements with text Email and Password", () => {
    const { container } = render(<App />);
    const labels = Array.from(container.querySelectorAll("label"));
    expect(labels.length).toBe(2);

    // Check texts with case-insensitive regex
    const labelTexts = labels.map((l) => l.textContent?.trim() || "");
    expect(labelTexts.some((t) => /email/i.test(t))).toBe(true);
    expect(labelTexts.some((t) => /password/i.test(t))).toBe(true);
  });

  // Button: ensure a button with text OK exists
  test("renders a button with the text 'OK'", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: /ok/i });
    expect(button).toBeInTheDocument();
  });
});
