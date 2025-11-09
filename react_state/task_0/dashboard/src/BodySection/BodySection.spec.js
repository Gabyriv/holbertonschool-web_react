import { render, screen } from "@testing-library/react";
import BodySection from "./BodySection";

describe("BodySection component", () => {
  test("renders a heading with the title prop value", () => {
    const testTitle = "test title";
    render(<BodySection title={testTitle} />);

    // Check that the h2 heading is rendered with the correct title
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(testTitle);
  });

  test("renders any number of children passed to it", () => {
    const testTitle = "test title";
    render(
      <BodySection title={testTitle}>
        <p>First child paragraph</p>
        <p>Second child paragraph</p>
        <span>A span element</span>
      </BodySection>
    );

    // Verify all children are rendered
    expect(screen.getByText("First child paragraph")).toBeInTheDocument();
    expect(screen.getByText("Second child paragraph")).toBeInTheDocument();
    expect(screen.getByText("A span element")).toBeInTheDocument();
  });
});
