import { render, screen } from "@testing-library/react";
import BodySectionWithMarginBottom from "./BodySectionWithMarginBottom";
import BodySection from "../BodySection/BodySection";

describe("BodySectionWithMarginBottom component", () => {
  test("contains a div with the class bodySectionWithMarginBottom", () => {
    const { container } = render(
      <BodySectionWithMarginBottom title="test title">
        <p>test children node</p>
      </BodySectionWithMarginBottom>
    );

    // Check that the div with the correct class exists
    const divWithClass = container.querySelector(".bodySectionWithMarginBottom");
    expect(divWithClass).toBeInTheDocument();
  });

  test("renders the BodySection component", () => {
    const testTitle = "test title";
    const testContent = "test children node";

    render(
      <BodySectionWithMarginBottom title={testTitle}>
        <p>{testContent}</p>
      </BodySectionWithMarginBottom>
    );

    // Verify that BodySection is rendered by checking for its content
    // The h2 heading should be rendered by BodySection
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(testTitle);

    // The children should also be rendered
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });
});
