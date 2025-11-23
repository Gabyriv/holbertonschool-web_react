import React from "react";
import { render, cleanup } from "@testing-library/react";
import WithLogging from "./WithLogging";

// Mock class component for testing
class MockApp extends React.Component {
  render() {
    return <h1>Hello from Mock App Component</h1>;
  }
}

describe("WithLogging HOC", () => {
  // Cleanup after each test
  afterEach(() => {
    cleanup();
  });

  test("renders a heading element with the text Hello from Mock App Component", () => {
    // Wrap the MockApp component with the HOC
    const MockAppWithLogging = WithLogging(MockApp);

    // Render the wrapped component
    const { getByText } = render(<MockAppWithLogging />);

    // Check that the heading is rendered with the correct text
    const heading = getByText("Hello from Mock App Component");
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
  });

  test("logs mount message when component with a name is mounted", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Wrap MockApp with the HOC
    const MockAppWithLogging = WithLogging(MockApp);

    // Render the component (this triggers componentDidMount)
    const { unmount } = render(<MockAppWithLogging />);

    // Verify the mount log message
    expect(consoleSpy).toHaveBeenCalledWith("Component MockApp is mounted");

    // Cleanup
    unmount();
    consoleSpy.mockRestore();
  });

  test("logs unmount message when component with a name is unmounted", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Wrap MockApp with the HOC
    const MockAppWithLogging = WithLogging(MockApp);

    // Render and then unmount the component
    const { unmount } = render(<MockAppWithLogging />);
    unmount();

    // Verify the unmount log message
    expect(consoleSpy).toHaveBeenCalledWith(
      "Component MockApp is going to unmount"
    );

    // Cleanup
    consoleSpy.mockRestore();
  });

  test("uses 'Component' as default name when wrapped component has no name", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Create an anonymous component (no name)
    const AnonymousComponent = () => <div>Anonymous</div>;
    // Remove the name property to simulate a truly anonymous component
    Object.defineProperty(AnonymousComponent, "name", { value: "" });

    const AnonymousWithLogging = WithLogging(AnonymousComponent);

    // Render the component
    const { unmount } = render(<AnonymousWithLogging />);

    // Should use "Component" as default
    expect(consoleSpy).toHaveBeenCalledWith("Component Component is mounted");

    unmount();
    consoleSpy.mockRestore();
  });

  test("sets correct displayName for the HOC", () => {
    // Wrap MockApp with the HOC
    const MockAppWithLogging = WithLogging(MockApp);

    // Check that displayName is set correctly
    expect(MockAppWithLogging.displayName).toBe("WithLogging(MockApp)");
  });

  test("passes props correctly to the wrapped component", () => {
    // Create a component that uses props
    const ComponentWithProps = ({ testProp }) => <div>{testProp}</div>;

    const ComponentWithLogging = WithLogging(ComponentWithProps);

    // Render with a prop
    const { getByText } = render(
      <ComponentWithLogging testProp="Test Value" />
    );

    // Verify the prop was passed through
    expect(getByText("Test Value")).toBeInTheDocument();
  });
});
