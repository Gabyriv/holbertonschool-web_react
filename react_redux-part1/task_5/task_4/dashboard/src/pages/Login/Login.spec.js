import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Login from "./Login";

describe("Login component", () => {
  // The login prompt should guide the user to authenticate.
  test("renders the login prompt", () => {
    render(<Login />);
    const loginPrompt = screen.getByText(/login to access the full dashboard/i);
    expect(loginPrompt).toBeInTheDocument();
  });

  // The form should include two labels, two inputs, and one button.
  test("renders 2 labels, 2 inputs, and 1 button", () => {
    render(<Login />);
    const labels = screen.getAllByText(/(email|password):/i);
    const inputs = screen.getAllByLabelText(/email|password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });
    expect(labels).toHaveLength(2);
    expect(inputs).toHaveLength(2);
    expect(submitButton).toBeInTheDocument();
  });

  // Clicking the label should focus the associated input for accessibility.
  test("focuses the email input when its label is clicked", async () => {
    const user = userEvent.setup();
    render(<Login />);
    const emailLabel = screen.getByText(/email:/i);
    const emailInput = screen.getByLabelText(/email/i);
    await user.click(emailLabel);
    expect(emailInput).toHaveFocus();
  });

  // The submit button should be disabled by default
  test("submit button is disabled by default", () => {
    render(<Login />);
    const submitButton = screen.getByRole("button", { name: /ok/i });
    expect(submitButton).toBeDisabled();
  });

  // The submit button should be enabled only when validation criteria are met
  test("submit button is enabled after entering valid email and password", async () => {
    const user = userEvent.setup();
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });

    // Initially, button should be disabled
    expect(submitButton).toBeDisabled();

    // Type a valid email
    await user.type(emailInput, "test@example.com");
    // Button should still be disabled (password not valid yet)
    expect(submitButton).toBeDisabled();

    // Type a valid password (at least 8 characters)
    await user.type(passwordInput, "password123");
    // Now button should be enabled
    expect(submitButton).toBeEnabled();
  });

  // The submit button should remain disabled with invalid email
  test("submit button remains disabled with invalid email", async () => {
    const user = userEvent.setup();
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });

    // Type an invalid email (missing @ symbol)
    await user.type(emailInput, "invalidemail");
    // Type a valid password
    await user.type(passwordInput, "password123");
    // Button should still be disabled
    expect(submitButton).toBeDisabled();
  });

  // The submit button should remain disabled with short password
  test("submit button remains disabled with password less than 8 characters", async () => {
    const user = userEvent.setup();
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });

    // Type a valid email
    await user.type(emailInput, "test@example.com");
    // Type a short password (less than 8 characters)
    await user.type(passwordInput, "pass");
    // Button should still be disabled
    expect(submitButton).toBeDisabled();
  });

  // Form submission should not reload the page
  test("form submission does not reload the page", async () => {
    const user = userEvent.setup();
    const logInMock = jest.fn();
    render(<Login logIn={logInMock} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });

    // Enter valid credentials
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    // Submit the form
    await user.click(submitButton);

    // Verify the form is still rendered (page didn't reload)
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
  });

  // Verify logIn method is called with correct parameters on form submission
  test("calls logIn with email and password when form is submitted", async () => {
    const user = userEvent.setup();
    const logInMock = jest.fn();
    render(<Login logIn={logInMock} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });

    // Enter valid credentials
    const testEmail = "test@example.com";
    const testPassword = "password123";
    await user.type(emailInput, testEmail);
    await user.type(passwordInput, testPassword);

    // Submit the form
    await user.click(submitButton);

    // Verify logIn was called once with correct email and password
    expect(logInMock).toHaveBeenCalledTimes(1);
    expect(logInMock).toHaveBeenCalledWith(testEmail, testPassword);
  });
});
