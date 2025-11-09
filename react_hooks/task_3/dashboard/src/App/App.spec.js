import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App component", () => {
  // Integration: the App shell should mount the notifications panel.
  test("renders the notifications component", () => {
    render(<App />);
    // The notifications title should always be visible
    const notificationsTitle = screen.getByText(/your notifications/i);
    expect(notificationsTitle).toBeInTheDocument();
    
    // The drawer content should not be visible by default (displayDrawer starts as false)
    expect(screen.queryByText(/here is the list of notifications/i)).toBeNull();
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
  test("renders Login when user is not logged in (default state)", () => {
    render(<App />);
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
    // Table for courses should not be present
    const tables = screen.queryAllByRole("table");
    expect(tables.length === 0 || !tables.some((t) => t.getAttribute("id") === "CourseList")).toBe(true);
  });

  // Conditional rendering: verify UI updates when user logs in
  test("renders CourseList and hides Login when user state changes to logged in", async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Initially, Login should be visible and CourseList should not
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();
    
    // Simulate user logging in by entering valid credentials
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });
    
    // Type valid credentials
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    
    // Submit the form to trigger state change
    await user.click(submitButton);
    
    // After state changes, CourseList should be visible and Login should not
    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(table.getAttribute("id")).toBe("CourseList");
    expect(screen.queryByText(/login to access the full dashboard/i)).toBeNull();
  });

  // Test logout from Header component: verify UI updates when logout link is clicked
  test("renders Login and hides CourseList when logout link is clicked from Header", async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // First, log in
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });
    
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);
    
    // Verify user is logged in
    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    
    // Verify logout section is displayed in Header
    const logoutSection = document.getElementById("logoutSection");
    expect(logoutSection).toBeInTheDocument();
    
    // Click the logout link
    const logoutLink = screen.getByRole("link", { name: /logout/i });
    await user.click(logoutLink);
    
    // Verify user is logged out - Login should appear and CourseList should disappear
    expect(await screen.findByText(/login to access the full dashboard/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();
    expect(document.getElementById("logoutSection")).toBeNull();
  });

  // Test keyboard shortcut: Ctrl+H logs out user and updates UI
  test("logs out user and updates UI when control and h keys are pressed", async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Mock alert to prevent actual alert
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    
    // First, log in
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });
    
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);
    
    // Verify user is logged in
    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    
    // Simulate Ctrl+H keydown event
    const event = new KeyboardEvent("keydown", {
      ctrlKey: true,
      key: "h",
      bubbles: true,
    });
    document.dispatchEvent(event);

    // Verify alert was called
    expect(alertMock).toHaveBeenCalledWith("Logging you out");
    
    // Verify user is logged out - Login should appear and CourseList should disappear
    expect(await screen.findByText(/login to access the full dashboard/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();
    
    // Clean up
    alertMock.mockRestore();
  });

  // Test keyboard shortcut: Ctrl+H displays alert message
  test("displays alert with 'Logging you out' when control and h keys are pressed", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<App />);

    // Simulate Ctrl+H keydown event
    const event = new KeyboardEvent("keydown", {
      ctrlKey: true,
      key: "h",
      bubbles: true,
    });
    document.dispatchEvent(event);

    // Verify alert was called with correct message
    expect(alertMock).toHaveBeenCalledWith("Logging you out");

    // Clean up the mock
    alertMock.mockRestore();
  });

  // Test that News from the School section is displayed by default
  test("displays News from the School section with correct content", () => {
    render(<App />);

    // Check for the title "News from the School"
    const newsTitle = screen.getByText(/news from the school/i);
    expect(newsTitle).toBeInTheDocument();

    // Check for the paragraph with the news content (check for a portion of the text)
    const newsContent = screen.getByText(/ipsum lorem ipsum dolor sit amet consectetur/i);
    expect(newsContent).toBeInTheDocument();
  });

  // Test clicking notification removes it from the list and logs to console
  test("clicking on a notification item removes it and logs the correct message", async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, "log");
    render(<App />);

    // First, open the notifications drawer
    const notificationsTitle = screen.getByText(/your notifications/i);
    await user.click(notificationsTitle);

    // Wait for drawer to open and get all notification items
    const items = await screen.findAllByRole("listitem");
    const initialCount = items.length;
    expect(initialCount).toBe(3); // Should have 3 notifications initially

    // Click the first notification item
    await user.click(items[0]);

    // Verify console log was called with correct message
    expect(consoleSpy).toHaveBeenCalledWith("Notification 1 has been marked as read");

    // Verify notification was removed from the list
    const updatedItems = screen.queryAllByRole("listitem");
    expect(updatedItems.length).toBe(initialCount - 1);
    expect(updatedItems.length).toBe(2);

    // Clean up
    consoleSpy.mockRestore();
  });
});
