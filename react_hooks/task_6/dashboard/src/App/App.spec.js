import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import mockAxios from "jest-mock-axios";

describe("App component", () => {
  // Clean up any pending axios mocks after each test
  afterEach(() => {
    mockAxios.reset();
  });

  // Helper function to mock notifications data
  const mockNotificationsResponse = () => {
    const notificationsData = [
      { id: 1, type: "urgent", value: "New course available" },
      { id: 2, type: "default", value: "New resume available" },
    ];
    mockAxios.mockResponse({ data: notificationsData });
  };

  // Helper function to mock courses data
  const mockCoursesResponse = () => {
    const coursesData = [
      { id: 1, name: "ES6", credit: 60 },
      { id: 2, name: "Webpack", credit: 20 },
      { id: 3, name: "React", credit: 40 },
    ];
    mockAxios.mockResponse({ data: coursesData });
  };

  // Integration: the App shell should mount the notifications panel.
  test("renders the notifications component", async () => {
    render(<App />);
    
    // Mock the notifications API call
    mockNotificationsResponse();
    // The notifications title should always be visible
    const notificationsTitle = screen.getByText(/your notifications/i);
    expect(notificationsTitle).toBeInTheDocument();
    
    // Wait for notifications to load
    await waitFor(() => {
      expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
    });
  });

  // Integration: the App shell should mount the header component.
  test("renders the header component", async () => {
    render(<App />);
    
    // Mock the notifications API call
    mockNotificationsResponse();
    const heading = screen.getByRole("heading", { name: /school dashboard/i });
    expect(heading).toBeInTheDocument();
  });

  // Integration: the App shell should mount the login component.
  test("renders the login component", async () => {
    render(<App />);
    
    // Mock the notifications API call
    mockNotificationsResponse();
    const loginPrompt = screen.getByText(/login to access the full dashboard/i);
    expect(loginPrompt).toBeInTheDocument();
  });

  // Integration: the App shell should mount the footer component.
  test("renders the footer component", async () => {
    render(<App />);
    
    // Mock the notifications API call
    mockNotificationsResponse();
    const footerCopy = screen.getByText(/copyright/i);
    expect(footerCopy).toBeInTheDocument();
  });

  // Conditional rendering: when not logged in, show Login and not CourseList
  test("renders Login when user is not logged in (default state)", async () => {
    render(<App />);
    
    // Mock the notifications API call
    mockNotificationsResponse();
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
    // Table for courses should not be present
    const tables = screen.queryAllByRole("table");
    expect(tables.length === 0 || !tables.some((t) => t.getAttribute("id") === "CourseList")).toBe(true);
  });

  // Conditional rendering: verify UI updates when user logs in
  test("renders CourseList and hides Login when user state changes to logged in", async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Mock the notifications API call
    mockNotificationsResponse();
    
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
    
    // Mock the courses API call that happens after login
    mockCoursesResponse();
    
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
    
    // Mock the notifications API call
    mockNotificationsResponse();
    
    // First, log in
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });
    
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);
    
    // Mock the courses API call that happens after login
    mockCoursesResponse();
    
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

  // Keyboard shortcut functionality (Ctrl+H) has been removed in functional component refactor

  // Test handleDisplayDrawer functionality
  test("handleDisplayDrawer sets displayDrawer to true when notifications title is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Mock the notifications API call
    mockNotificationsResponse();

    // Initially, drawer should be open (displayDrawer starts as true)
    await waitFor(() => {
      expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
    });

    // Close the drawer first by clicking the close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    // Drawer should now be closed
    expect(screen.queryByText(/here is the list of notifications/i)).toBeNull();

    // Click on the notifications title to open the drawer
    const notificationsTitle = screen.getByText(/your notifications/i);
    await user.click(notificationsTitle);

    // Drawer should now be open again
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
  });

  // Test handleHideDrawer functionality
  test("handleHideDrawer sets displayDrawer to false when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Mock the notifications API call
    mockNotificationsResponse();

    // Initially, drawer should be open (displayDrawer starts as true)
    await waitFor(() => {
      expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
    });

    // Click the close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    // Drawer should now be closed
    expect(screen.queryByText(/here is the list of notifications/i)).toBeNull();
  });

  // Test logIn function updates user state correctly
  test("logIn updates user state with email, password, and isLoggedIn set to true", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Mock the notifications API call
    mockNotificationsResponse();

    // Initially, user should not be logged in - Login form should be visible
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();

    // Enter credentials and submit
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });

    const testEmail = "test@example.com";
    const testPassword = "password123";

    await user.type(emailInput, testEmail);
    await user.type(passwordInput, testPassword);
    await user.click(submitButton);

    // Mock the courses API call that happens after login
    mockCoursesResponse();

    // Verify user is logged in - CourseList should be visible, Login should not
    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    expect(screen.queryByText(/login to access the full dashboard/i)).toBeNull();

    // Verify welcome message in Header shows the email
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(testEmail)).toBeInTheDocument();
  });

  // Test logOut function resets user state correctly
  test("logOut resets user state with isLoggedIn false, email and password cleared", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Mock the notifications API call
    mockNotificationsResponse();

    // First, log in
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Mock the courses API call that happens after login
    mockCoursesResponse();

    // Verify user is logged in
    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    // Click logout link
    const logoutLink = screen.getByRole("link", { name: /logout/i });
    await user.click(logoutLink);

    // Verify user is logged out - Login form should be visible, CourseList should not
    expect(await screen.findByText(/login to access the full dashboard/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();

    // Verify logout section is no longer displayed in Header
    expect(document.getElementById("logoutSection")).toBeNull();
    expect(screen.queryByText(/welcome/i)).toBeNull();
  });

  // Test that News from the School section is displayed by default
  test("displays News from the School section with correct content", async () => {
    render(<App />);

    // Mock the notifications API call
    mockNotificationsResponse();

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

    // Mock the notifications API call
    mockNotificationsResponse();

    // Wait for drawer to open (starts open by default) and get all notification items
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

  // Test that notifications data is fetched when App component loads
  test("fetches notifications data when component loads", async () => {
    render(<App />);

    // Verify that axios.get was called for notifications
    expect(mockAxios.get).toHaveBeenCalledWith('/notifications.json');

    // Mock the response
    mockNotificationsResponse();

    // Wait for notifications to appear
    await waitFor(() => {
      const items = screen.queryAllByRole("listitem");
      expect(items.length).toBe(3); // 2 from API + 1 latest notification
    });
  });

  // Test that courses data is fetched when user state changes
  test("fetches courses data when user logs in", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Mock the notifications API call
    mockNotificationsResponse();

    // Log in
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /ok/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Verify that axios.get was called for courses after login
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/courses.json');
    });

    // Mock the courses response
    mockCoursesResponse();

    // Wait for courses to appear
    await waitFor(() => {
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });
  });
});
