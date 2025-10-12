import { fireEvent, render, screen } from "@testing-library/react";
import NotificationItem from "./NotificationItem";

describe("NotificationItem component", () => {
  test("renders default notification with blue text and correct data attribute", () => {
    render(<NotificationItem type="default" value="Test default" />);
    const listItem = screen.getByText(/test default/i);
    expect(listItem).toBeInTheDocument();
    expect(listItem).toHaveAttribute("data-notification-type", "default");
    expect(listItem).toHaveStyle({ color: "rgb(0, 0, 255)" });
  });

  test("renders urgent notification with red text and correct data attribute", () => {
    render(<NotificationItem type="urgent" value="Test urgent" />);
    const listItem = screen.getByText(/test urgent/i);
    expect(listItem).toBeInTheDocument();
    expect(listItem).toHaveAttribute("data-notification-type", "urgent");
    expect(listItem).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  test("calls markAsRead with correct id when notification item is clicked", () => {
    const markAsReadMock = jest.fn();
    const testId = 42;

    render(
      <NotificationItem
        type="default"
        value="Test notification"
        id={testId}
        markAsRead={markAsReadMock}
      />
    );

    const listItem = screen.getByText(/test notification/i);
    fireEvent.click(listItem);

    // Verify markAsRead was called once with the correct id
    expect(markAsReadMock).toHaveBeenCalledTimes(1);
    expect(markAsReadMock).toHaveBeenCalledWith(testId);
  });
});
