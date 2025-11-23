import { render, screen, within } from "@testing-library/react";
import CourseListRow from "./CourseListRow.jsx";

describe("CourseListRow", () => {
  test("header with single cell spans two columns when second cell is null", () => {
    render(<table><thead><CourseListRow isHeader={true} textFirstCell="Available courses" /></thead></table>);
    const th = screen.getByRole("columnheader", { name: /available courses/i });
    expect(th).toBeInTheDocument();
    expect(th).toHaveAttribute("colspan", "2");
  });

  test("header with two cells when second cell provided", () => {
    render(
      <table>
        <thead>
          <CourseListRow isHeader={true} textFirstCell="Course name" textSecondCell="Credit" />
        </thead>
      </table>
    );
    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent(/course name/i);
    expect(headers[1]).toHaveTextContent(/credit/i);
  });

  test("body row renders two td cells", () => {
    render(
      <table>
        <tbody>
          <CourseListRow textFirstCell="ES6" textSecondCell={60} />
        </tbody>
      </table>
    );
    const row = screen.getByRole("row");
    const cells = within(row).getAllByRole("cell");
    expect(cells).toHaveLength(2);
    expect(cells[0]).toHaveTextContent("ES6");
    expect(cells[1]).toHaveTextContent("60");
  });
});
