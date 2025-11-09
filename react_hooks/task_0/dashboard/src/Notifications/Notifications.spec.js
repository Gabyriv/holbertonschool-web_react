import { fireEvent, render, screen } from "@testing-library/react";
import Notifications from "./Notifications";
import { getLatestNotification } from "../utils/utils";

describe("Notifications component", () => {
  const notificationsList = [
    { id: 1, type: "default", value: "New course available" },
    { id: 2, type: "urgent", value: "New resume available" },
    { id: 3, type: "urgent", html: { __html: getLatestNotification() } },
  ];

  // Title should always be present regardless of displayDrawer
  test("always renders the Your notifications title", () => {
    render(<Notifications />);
    expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
  });

  // displayDrawer = false: no drawer content
  test("does not render drawer content when displayDrawer is false", () => {
    render(<Notifications notifications={notificationsList} displayDrawer={false} />);
    expect(screen.getByText(/your notifications/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /close/i })).toBeNull();
    expect(screen.queryByText(/here is the list of notifications/i)).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
  });

  // displayDrawer = true: drawer content visible
  test("renders drawer content when displayDrawer is true", () => {
    render(<Notifications notifications={notificationsList} displayDrawer={true} />);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  // displayDrawer = true and notifications empty: empty-state message
  test("renders empty state when displayDrawer is true and notifications is empty", () => {
    render(<Notifications notifications={[]} displayDrawer={true} />);
    expect(screen.getByText(/no new notification for now/i)).toBeInTheDocument();
    expect(screen.queryByText(/here is the list of notifications/i)).toBeNull();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  test("renders the notifications title", () => {
    render(<Notifications notifications={notificationsList} displayDrawer={true} />);
    const title = screen.getByText(/here is the list of notifications/i);
    expect(title).toBeInTheDocument();
  });

  test("renders the close button", () => {
    render(<Notifications notifications={notificationsList} displayDrawer={true} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  test("renders three notification list items with expected text", () => {
    render(<Notifications notifications={notificationsList} displayDrawer={true} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);

    expect(items[0]).toHaveTextContent(/new course available/i);
    expect(items[1]).toHaveTextContent(/new resume available/i);
    expect(items[2]).toHaveTextContent(/urgent requirement\s*-\s*complete by eod/i);
  });

  test("logs to console when close button is clicked", () => {
    const consoleSpy = jest.spyOn(console, "log");
    render(<Notifications notifications={notificationsList} displayDrawer={true} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(consoleSpy).toHaveBeenCalledWith("Close button has been clicked");

    consoleSpy.mockRestore();
  });

  test("logs correct message when a notification item is clicked", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const markNotificationAsReadMock = jest.fn((id) => {
      console.log(`Notification ${id} has been marked as read`);
    });
    
    render(
      <Notifications 
        notifications={notificationsList} 
        displayDrawer={true}
        markNotificationAsRead={markNotificationAsReadMock}
      />
    );

    // Get all notification items
    const items = screen.getAllByRole("listitem");

    // Click the first notification (id: 1)
    fireEvent.click(items[0]);
    expect(consoleSpy).toHaveBeenCalledWith("Notification 1 has been marked as read");
    expect(markNotificationAsReadMock).toHaveBeenCalledWith(1);

    // Click the second notification (id: 2)
    fireEvent.click(items[1]);
    expect(consoleSpy).toHaveBeenCalledWith("Notification 2 has been marked as read");
    expect(markNotificationAsReadMock).toHaveBeenCalledWith(2);

    // Click the third notification (id: 3)
    fireEvent.click(items[2]);
    expect(consoleSpy).toHaveBeenCalledWith("Notification 3 has been marked as read");
    expect(markNotificationAsReadMock).toHaveBeenCalledWith(3);

    consoleSpy.mockRestore();
  });

  test("doesn't re-render when props don't change (PureComponent behavior)", () => {
    // Spy on the render method to track re-renders
    const renderSpy = jest.spyOn(Notifications.prototype, "render");

    const notificationsArray = [
      { id: 1, type: "default", value: "First notification" },
      { id: 2, type: "urgent", value: "Second notification" },
    ];

    // Initial render
    const { rerender } = render(
      <Notifications notifications={notificationsArray} displayDrawer={true} />
    );

    // Clear the spy after initial render
    renderSpy.mockClear();

    // Re-render with SAME props (same array reference)
    rerender(
      <Notifications notifications={notificationsArray} displayDrawer={true} />
    );

    // PureComponent should NOT re-render if props haven't changed (shallow comparison)
    expect(renderSpy).not.toHaveBeenCalled();

    renderSpy.mockRestore();
  });

  test("re-renders when notifications list length changes", () => {
    // Spy on the render method to track re-renders
    const renderSpy = jest.spyOn(Notifications.prototype, "render");

    const initialNotifications = [
      { id: 1, type: "default", value: "First notification" },
      { id: 2, type: "urgent", value: "Second notification" },
    ];

    // Initial render
    const { rerender } = render(
      <Notifications notifications={initialNotifications} displayDrawer={true} />
    );

    // Clear the spy after initial render
    renderSpy.mockClear();

    // Update with DIFFERENT length (3 items instead of 2)
    const updatedNotifications = [
      { id: 1, type: "default", value: "First notification" },
      { id: 2, type: "urgent", value: "Second notification" },
      { id: 3, type: "default", value: "Third notification" },
    ];

    rerender(
      <Notifications notifications={updatedNotifications} displayDrawer={true} />
    );

    // render SHOULD have been called because length changed (2 -> 3)
    expect(renderSpy).toHaveBeenCalled();

    renderSpy.mockRestore();
  });

  test("calls handleDisplayDrawer when clicking on the menu item", () => {
    // Create a spy function for handleDisplayDrawer
    const handleDisplayDrawerSpy = jest.fn();

    render(
      <Notifications 
        notifications={notificationsList} 
        displayDrawer={false}
        handleDisplayDrawer={handleDisplayDrawerSpy}
      />
    );

    // Find and click the "Your notifications" menu item
    const menuItem = screen.getByText(/your notifications/i);
    fireEvent.click(menuItem);

    // Verify the spy was called once
    expect(handleDisplayDrawerSpy).toHaveBeenCalledTimes(1);
  });

  test("calls handleHideDrawer when clicking on the close button", () => {
    // Create a spy function for handleHideDrawer
    const handleHideDrawerSpy = jest.fn();

    render(
      <Notifications 
        notifications={notificationsList} 
        displayDrawer={true}
        handleHideDrawer={handleHideDrawerSpy}
      />
    );

    // Find and click the close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Verify the spy was called once
    expect(handleHideDrawerSpy).toHaveBeenCalledTimes(1);
  });
});
