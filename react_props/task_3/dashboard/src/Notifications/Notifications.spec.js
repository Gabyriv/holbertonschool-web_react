import { fireEvent, render, screen } from "@testing-library/react";
import Notifications from "./Notifications";
import { getLatestNotification } from "../utils/utils";

describe("Notifications component", () => {
  const notificationsList = [
    { id: 1, type: "default", value: "New course available" },
    { id: 2, type: "urgent", value: "New resume available" },
    { id: 3, type: "urgent", html: { __html: getLatestNotification() } },
  ];

  test("renders the notifications title", () => {
    render(<Notifications notifications={notificationsList} />);
    const title = screen.getByText(/here is the list of notifications/i);
    expect(title).toBeInTheDocument();
  });

  test("renders the close button", () => {
    render(<Notifications notifications={notificationsList} />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  test("renders three notification list items with expected text", () => {
    render(<Notifications notifications={notificationsList} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);

    expect(items[0]).toHaveTextContent(/new course available/i);
    expect(items[1]).toHaveTextContent(/new resume available/i);
    expect(items[2]).toHaveTextContent(/urgent requirement\s*-\s*complete by eod/i);
  });

  test("logs to console when close button is clicked", () => {
    const consoleSpy = jest.spyOn(console, "log");
    render(<Notifications notifications={notificationsList} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(consoleSpy).toHaveBeenCalledWith("Close button has been clicked");

    consoleSpy.mockRestore();
  });
});
