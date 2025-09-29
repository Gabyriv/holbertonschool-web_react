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

  // Conditional rendering: when not logged in, show Login and not CourseList
  test("renders Login when isLoggedIn is false", () => {
    render(<App isLoggedIn={false} />);
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
    // Table for courses should not be present
    const tables = screen.queryAllByRole("table");
    expect(tables.length === 0 || !tables.some((t) => t.getAttribute("id") === "CourseList")).toBe(true);
  });

  // Conditional rendering: when logged in, show CourseList and not Login
  test("renders CourseList when isLoggedIn is true", () => {
    render(<App isLoggedIn={true} />);
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(table.getAttribute("id")).toBe("CourseList");
    expect(screen.queryByText(/login to access the full dashboard/i)).toBeNull();
  });
});
