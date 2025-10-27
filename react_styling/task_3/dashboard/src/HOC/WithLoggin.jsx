import { Component } from "react";

// Higher-Order Component that adds logging functionality to any component
function WithLogging(WrappedComponent) {
  // Get the name of the wrapped component, default to "Component" if no name
  const componentName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  // Return a new class component that wraps the original
  class WithLoggingComponent extends Component {
    // Log when the component mounts
    componentDidMount() {
      console.log(`Component ${componentName} is mounted`);
    }

    // Log when the component is about to unmount
    componentWillUnmount() {
      console.log(`Component ${componentName} is going to unmount`);
    }

    // Render the wrapped component with all its props
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  // Set the displayName for debugging in React DevTools
  WithLoggingComponent.displayName = `WithLogging(${componentName})`;

  return WithLoggingComponent;
}

export default WithLogging;
