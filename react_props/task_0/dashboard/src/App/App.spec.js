import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  // Integration: the App shell should mount the notifications panel.
  test("renders the notifications component", () => {
    render(<App />);
    const notificationsCopy = screen.getByText(/here is the list of notifications/i);
    expect(notificationsCopy).toBeInTheDocument();
  });

  // Integration: the App shell should mount the header component.
  test("renders the header component", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { name: /school dashboard/i });
    expect(heading).toBeInTheDocument();
  });

  // Integration: the App shell should mount the login component.
  test("renders the login component", () => {
    render(<App />);
    const loginPrompt = screen.getByText(/login to access the full dashboard/i);
    expect(loginPrompt).toBeInTheDocument();
  });

  // Integration: the App shell should mount the footer component.
  test("renders the footer component", () => {
    render(<App />);
    const footerCopy = screen.getByText(/copyright/i);
    expect(footerCopy).toBeInTheDocument();
  });
});
