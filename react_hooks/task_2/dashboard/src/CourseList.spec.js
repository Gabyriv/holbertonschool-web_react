import { render, screen, within } from "@testing-library/react";
import CourseList from "./CourseList/CourseList.jsx";

describe("CourseList", () => {
  const courses = [
    { id: 1, name: "ES6", credit: 60 },
    { id: 2, name: "Webpack", credit: 20 },
    { id: 3, name: "React", credit: 40 },
  ];

  test("renders 3 rows in tbody when given 3 courses", () => {
    render(<CourseList courses={courses} />);
    const table = screen.getByRole("table");
    const rowgroups = within(table).getAllByRole("rowgroup");
    const tbody = rowgroups[1];
    const rows = within(tbody).getAllByRole("row");
    expect(rows).toHaveLength(3);
  });

  test("renders 1 row in tbody when given an empty array", () => {
    render(<CourseList courses={[]} />);
    const table = screen.getByRole("table");
    const rowgroups = within(table).getAllByRole("rowgroup");
    const tbody = rowgroups[1];
    const rows = within(tbody).getAllByRole("row");
    expect(rows).toHaveLength(1);
    expect(screen.getByText(/no course available yet/i)).toBeInTheDocument();
  });
});
