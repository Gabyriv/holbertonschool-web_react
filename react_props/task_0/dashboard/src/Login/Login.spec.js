import { render, screen } from "@testing-library/react";
import Login from "./Login.jsx";

describe("Login component", () => {
  // The login prompt should guide the user to authenticate.
  test("renders the login prompt", () => {
    render(<Login />);
    const loginPrompt = screen.getByText(/login to access the full dashboard/i);
    expect(loginPrompt).toBeInTheDocument();
  });

  // Labels for email and password should be accessible and visible.
  test("renders the email and password labels", () => {
    render(<Login />);
    const emailLabel = screen.getByLabelText(/email/i);
    const passwordLabel = screen.getByLabelText(/password/i);
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });

  // The form should include two input elements for credentials.
  test("renders exactly two input elements", () => {
    const { container } = render(<Login />);
    const inputs = container.querySelectorAll("input");
    expect(inputs.length).toBe(2);
  });

  // The form should provide a submit button labeled OK.
  test("renders the submit button", () => {
    render(<Login />);
    const submitButton = screen.getByRole("button", { name: /ok/i });
    expect(submitButton).toBeInTheDocument();
  });
});
