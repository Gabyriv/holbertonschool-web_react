import { fireEvent, render, screen } from "@testing-library/react";
import Notifications from "./Notifications";

describe("Notifications component", () => {
  test("renders the notifications title", () => {
    render(<Notifications />);
    const title = screen.getByText(/here is the list of notifications/i);
    expect(title).toBeInTheDocument();
  });

  test("renders the close button", () => {
    render(<Notifications />);
    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  test("renders three notification list items with expected text", () => {
    render(<Notifications />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);

    expect(items[0]).toHaveTextContent(/new course available/i);
    expect(items[1]).toHaveTextContent(/new resume available/i);
    expect(items[2]).toHaveTextContent(/urgent requirement\s*-\s*complete by eod/i);
  });

  test("logs to console when close button is clicked", () => {
    const consoleSpy = jest.spyOn(console, "log");
    render(<Notifications />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(consoleSpy).toHaveBeenCalledWith("Close button has been clicked");

    consoleSpy.mockRestore();
  });
});
