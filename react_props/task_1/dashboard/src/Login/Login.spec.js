import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/react";
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
    const { container } = render(<Login />);
    const formElement = container.querySelector(".App-body") ?? container;
    const labels = formElement.querySelectorAll("label");
    const inputs = formElement.querySelectorAll("input");
    expect(labels.length).toBe(2);
    expect(inputs.length).toBe(2);
    const submitButton = within(formElement).getByRole("button", { name: /ok/i });
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
});
