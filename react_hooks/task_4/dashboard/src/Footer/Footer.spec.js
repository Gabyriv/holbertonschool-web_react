import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { getCurrentYear, getFooterCopy } from "../utils/utils";
import AppContext from "../Context/context.js";

describe("Footer component", () => {
  // Default context value (not logged in)
  const defaultContextValue = {
    user: {
      email: "",
      password: "",
      isLoggedIn: false,
    },
    logOut: () => {},
  };

  // The footer should display the Holberton copyright notice.
  test("renders the footer copy with the current year (index view)", () => {
    render(
      <AppContext.Provider value={defaultContextValue}>
        <Footer />
      </AppContext.Provider>
    );
    const footerCopy = screen.getByText(/copyright/i);
    expect(footerCopy).toBeInTheDocument();
    const expectedText = `Copyright ${getCurrentYear()} - ${getFooterCopy(
      false
    )}`;
    expect(footerCopy).toHaveTextContent(expectedText);
  });

  // Verify "Contact us" link is not displayed when user is logged out
  test("does not display Contact us link when user is logged out", () => {
    render(
      <AppContext.Provider value={defaultContextValue}>
        <Footer />
      </AppContext.Provider>
    );
    const contactLink = screen.queryByText(/contact us/i);
    expect(contactLink).toBeNull();
  });

  // Verify "Contact us" link is displayed when user is logged in
  test("displays Contact us link when user is logged in", () => {
    const loggedInContextValue = {
      user: {
        email: "test@example.com",
        password: "password123",
        isLoggedIn: true,
      },
      logOut: () => {},
    };

    render(
      <AppContext.Provider value={loggedInContextValue}>
        <Footer />
      </AppContext.Provider>
    );

    const contactLink = screen.getByText(/contact us/i);
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.tagName).toBe("A");
  });
});
