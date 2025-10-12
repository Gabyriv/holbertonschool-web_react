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
    const buttons = screen.getAllByRole("button");
    expect(labels).toHaveLength(2);
    expect(inputs).toHaveLength(2);
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent(/ok/i);
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
