import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header.jsx";

describe("Header component", () => {
  // Default props (not logged in)
  const defaultUser = {
    email: "",
    password: "",
    isLoggedIn: false,
  };

  const defaultLogOut = () => {};

  // The header must keep the Holberton logo visible for brand recognition.
  test("contains the Holberton logo image", () => {
    render(<Header user={defaultUser} logOut={defaultLogOut} />);
    const logo = screen.getByRole("img", { name: /holberton logo/i });
    expect(logo).toBeInTheDocument();
  });

  // The header must display the dashboard title for consistent branding.
  test("contains the h1 heading with the correct text", () => {
    render(<Header user={defaultUser} logOut={defaultLogOut} />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: /school dashboard/i,
    });
    expect(heading).toBeInTheDocument();
  });

  // When user is not logged in, logoutSection should not be rendered
  test("logoutSection is not rendered when user is not logged in", () => {
    render(<Header user={defaultUser} logOut={defaultLogOut} />);
    const logoutSection = screen.queryByText(/welcome/i);
    expect(logoutSection).toBeNull();
  });

  // When user is logged in, logoutSection should be rendered
  test("logoutSection is rendered when user is logged in", () => {
    const loggedInUser = {
      email: "test@example.com",
      password: "password123",
      isLoggedIn: true,
    };

    render(<Header user={loggedInUser} logOut={defaultLogOut} />);

    // Check that the logoutSection is present
    const logoutSection = document.getElementById("logoutSection");
    expect(logoutSection).toBeInTheDocument();

    // Check that welcome message with email is displayed
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();

    // Check that logout link is present
    const logoutLink = screen.getByRole("link", { name: /logout/i });
    expect(logoutLink).toBeInTheDocument();
  });

  // When clicking logout link, logOut function should be called
  test("clicking logout link calls the logOut function", async () => {
    const user = userEvent.setup();
    const logOutSpy = jest.fn();
    const loggedInUser = {
      email: "test@example.com",
      password: "password123",
      isLoggedIn: true,
    };

    render(<Header user={loggedInUser} logOut={logOutSpy} />);

    // Find and click the logout link
    const logoutLink = screen.getByRole("link", { name: /logout/i });
    await user.click(logoutLink);

    // Verify logOut was called once
    expect(logOutSpy).toHaveBeenCalledTimes(1);
  });
});
