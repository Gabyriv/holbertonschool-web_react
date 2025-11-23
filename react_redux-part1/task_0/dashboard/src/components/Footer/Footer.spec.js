import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { getCurrentYear, getFooterCopy } from "../../utils/utils";

describe("Footer component", () => {
  // Default props (not logged in)
  const defaultUser = {
    email: "",
    password: "",
    isLoggedIn: false,
  };

  // The footer should display the Holberton copyright notice.
  test("renders the footer copy with the current year (index view)", () => {
    render(<Footer user={defaultUser} />);
    const footerCopy = screen.getByText(/copyright/i);
    expect(footerCopy).toBeInTheDocument();
    const expectedText = `Copyright ${getCurrentYear()} - ${getFooterCopy(
      false
    )}`;
    expect(footerCopy).toHaveTextContent(expectedText);
  });

  // Verify "Contact us" link is not displayed when user is logged out
  test("does not display Contact us link when user is logged out", () => {
    render(<Footer user={defaultUser} />);
    const contactLink = screen.queryByText(/contact us/i);
    expect(contactLink).toBeNull();
  });

  // Verify "Contact us" link is displayed when user is logged in
  test("displays Contact us link when user is logged in", () => {
    const loggedInUser = {
      email: "test@example.com",
      password: "password123",
      isLoggedIn: true,
    };

    render(<Footer user={loggedInUser} />);

    const contactLink = screen.getByText(/contact us/i);
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.tagName).toBe("A");
  });
});
