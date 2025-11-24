import { render, screen } from '@testing-library/react';
import BodySectionWithMarginBottom from './BodySectionWithMarginBottom';

/**
 * Test suite for BodySectionWithMarginBottom component
 */
describe('BodySectionWithMarginBottom Component', () => {
  describe('Basic rendering', () => {
    it('should render title and children', () => {
      render(
        <BodySectionWithMarginBottom title="Test Title">
          <p>Test children content</p>
        </BodySectionWithMarginBottom>
      );

      // Verify title is rendered
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      
      // Verify children content is rendered
      expect(screen.getByText('Test children content')).toBeInTheDocument();
    });

    it('should render with multiple children elements', () => {
      render(
        <BodySectionWithMarginBottom title="Section Title">
          <p>First paragraph</p>
          <p>Second paragraph</p>
          <div>A div element</div>
        </BodySectionWithMarginBottom>
      );

      // Verify title is rendered
      expect(screen.getByText('Section Title')).toBeInTheDocument();
      
      // Verify all children are rendered
      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
      expect(screen.getByText('A div element')).toBeInTheDocument();
    });
  });

  describe('BodySection integration', () => {
    it('should render BodySection with correct props', () => {
      const { container } = render(
        <BodySectionWithMarginBottom title="Course list">
          <p>Course content</p>
        </BodySectionWithMarginBottom>
      );

      // Verify BodySection is rendered with h2 title
      const h2Element = container.querySelector('h2');
      expect(h2Element).toBeInTheDocument();
      expect(h2Element).toHaveTextContent('Course list');
      
      // Verify children are rendered
      expect(screen.getByText('Course content')).toBeInTheDocument();
    });
  });

  describe('Margin styling', () => {
    it('should have bodySectionWithMargin class on wrapper div', () => {
      const { container } = render(
        <BodySectionWithMarginBottom title="Title">
          <p>Content</p>
        </BodySectionWithMarginBottom>
      );

      // Verify the wrapper div has the correct class
      const wrapperDiv = container.querySelector('.bodySectionWithMargin');
      expect(wrapperDiv).toBeInTheDocument();
    });
  });

  describe('Common use cases', () => {
    it('should render with "Course list" title', () => {
      render(
        <BodySectionWithMarginBottom title="Course list">
          <div>Course list content</div>
        </BodySectionWithMarginBottom>
      );

      expect(screen.getByText('Course list')).toBeInTheDocument();
      expect(screen.getByText('Course list content')).toBeInTheDocument();
    });

    it('should render with "Log in to continue" title', () => {
      render(
        <BodySectionWithMarginBottom title="Log in to continue">
          <div>Login form</div>
        </BodySectionWithMarginBottom>
      );

      expect(screen.getByText('Log in to continue')).toBeInTheDocument();
      expect(screen.getByText('Login form')).toBeInTheDocument();
    });
  });

  describe('Complex children', () => {
    it('should render complex nested children structures', () => {
      render(
        <BodySectionWithMarginBottom title="Complex Section">
          <div>
            <h3>Subtitle</h3>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
            <p>Additional text</p>
          </div>
        </BodySectionWithMarginBottom>
      );

      expect(screen.getByText('Complex Section')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Additional text')).toBeInTheDocument();
    });

    it('should handle React component children', () => {
      const CustomComponent = () => <div>Custom component content</div>;
      
      render(
        <BodySectionWithMarginBottom title="With Component">
          <CustomComponent />
        </BodySectionWithMarginBottom>
      );

      expect(screen.getByText('With Component')).toBeInTheDocument();
      expect(screen.getByText('Custom component content')).toBeInTheDocument();
    });
  });

  describe('Structure verification', () => {
    it('should wrap BodySection in a div with margin class', () => {
      const { container } = render(
        <BodySectionWithMarginBottom title="Test">
          <p>Test</p>
        </BodySectionWithMarginBottom>
      );

      // The outer div should have the margin class
      const outerDiv = container.firstChild;
      expect(outerDiv).toHaveClass('bodySectionWithMargin');
      
      // Inside should be BodySection content
      const h2Element = container.querySelector('h2');
      expect(h2Element).toBeInTheDocument();
    });
  });
});
