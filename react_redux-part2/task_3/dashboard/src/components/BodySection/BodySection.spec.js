import { render, screen } from '@testing-library/react';
import BodySection from './BodySection';

/**
 * Test suite for BodySection component
 */
describe('BodySection Component', () => {
  describe('Basic rendering', () => {
    it('should render title and children', () => {
      render(
        <BodySection title="Test Title">
          <p>Test children content</p>
        </BodySection>
      );

      // Verify title is rendered
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      
      // Verify children content is rendered
      expect(screen.getByText('Test children content')).toBeInTheDocument();
    });

    it('should render with multiple children elements', () => {
      render(
        <BodySection title="Section Title">
          <p>First paragraph</p>
          <p>Second paragraph</p>
          <div>A div element</div>
        </BodySection>
      );

      // Verify title is rendered
      expect(screen.getByText('Section Title')).toBeInTheDocument();
      
      // Verify all children are rendered
      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
      expect(screen.getByText('A div element')).toBeInTheDocument();
    });
  });

  describe('Title rendering', () => {
    it('should render title in h2 element', () => {
      const { container } = render(
        <BodySection title="My Title">
          <p>Content</p>
        </BodySection>
      );

      const h2Element = container.querySelector('h2');
      expect(h2Element).toBeInTheDocument();
      expect(h2Element).toHaveTextContent('My Title');
    });

    it('should handle different title texts', () => {
      render(
        <BodySection title="Course list">
          <p>Courses content</p>
        </BodySection>
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Course list');
    });
  });

  describe('Children rendering', () => {
    it('should render children inside a div', () => {
      const { container } = render(
        <BodySection title="Title">
          <p id="test-child">Child content</p>
        </BodySection>
      );

      const childElement = container.querySelector('#test-child');
      expect(childElement).toBeInTheDocument();
      expect(childElement.parentElement.tagName).toBe('DIV');
    });

    it('should render complex children structures', () => {
      render(
        <BodySection title="Complex Section">
          <div>
            <h3>Subtitle</h3>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </BodySection>
      );

      expect(screen.getByText('Complex Section')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('Integration scenarios', () => {
    it('should render with "News from the School" title', () => {
      render(
        <BodySection title="News from the School">
          <p>Lorem ipsum dolor sit amet</p>
        </BodySection>
      );

      expect(screen.getByText('News from the School')).toBeInTheDocument();
      expect(screen.getByText('Lorem ipsum dolor sit amet')).toBeInTheDocument();
    });

    it('should render empty children', () => {
      render(
        <BodySection title="Empty Section">
          <></>
        </BodySection>
      );

      // Title should still be rendered
      expect(screen.getByText('Empty Section')).toBeInTheDocument();
    });
  });
});
