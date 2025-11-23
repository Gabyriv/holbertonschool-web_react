import { render, screen } from '@testing-library/react';
import CourseListRow from './CourseListRow';

/**
 * Test suite for CourseListRow component
 */
describe('CourseListRow Component', () => {
  describe('Header row with one cell', () => {
    it('should render header with one cell spanning two columns', () => {
      render(
        <table>
          <thead>
            <CourseListRow isHeader={true} textFirstCell="Available courses" />
          </thead>
        </table>
      );

      // Get the th element
      const headerCell = screen.getByText('Available courses');
      
      // Verify it's a th element and has colspan of 2
      expect(headerCell.tagName).toBe('TH');
      expect(headerCell).toHaveAttribute('colSpan', '2');
    });
  });

  describe('Header row with two cells', () => {
    it('should render header with two separate cells', () => {
      render(
        <table>
          <thead>
            <CourseListRow 
              isHeader={true} 
              textFirstCell="Course name" 
              textSecondCell="Credit" 
            />
          </thead>
        </table>
      );

      // Get both th elements
      const firstCell = screen.getByText('Course name');
      const secondCell = screen.getByText('Credit');
      
      // Verify both are th elements
      expect(firstCell.tagName).toBe('TH');
      expect(secondCell.tagName).toBe('TH');
      
      // Verify they don't have colspan
      expect(firstCell).not.toHaveAttribute('colSpan');
      expect(secondCell).not.toHaveAttribute('colSpan');
    });
  });

  describe('Regular row (not header)', () => {
    it('should render regular row with two td cells', () => {
      render(
        <table>
          <tbody>
            <CourseListRow 
              isHeader={false} 
              textFirstCell="ES6" 
              textSecondCell="60" 
            />
          </tbody>
        </table>
      );

      // Get both td elements
      const firstCell = screen.getByText('ES6');
      const secondCell = screen.getByText('60');
      
      // Verify both are td elements
      expect(firstCell.tagName).toBe('TD');
      expect(secondCell.tagName).toBe('TD');
    });

    it('should render multiple course rows', () => {
      render(
        <table>
          <tbody>
            <CourseListRow isHeader={false} textFirstCell="ES6" textSecondCell="60" />
            <CourseListRow isHeader={false} textFirstCell="Webpack" textSecondCell="20" />
            <CourseListRow isHeader={false} textFirstCell="React" textSecondCell="40" />
          </tbody>
        </table>
      );

      // Verify all courses are rendered
      expect(screen.getByText('ES6')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
      expect(screen.getByText('Webpack')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('40')).toBeInTheDocument();
    });
  });

  describe('Cell types', () => {
    it('should use th elements for header rows', () => {
      const { container } = render(
        <table>
          <thead>
            <CourseListRow isHeader={true} textFirstCell="Header" />
          </thead>
        </table>
      );

      const thElements = container.querySelectorAll('th');
      expect(thElements.length).toBeGreaterThan(0);
    });

    it('should use td elements for regular rows', () => {
      const { container } = render(
        <table>
          <tbody>
            <CourseListRow isHeader={false} textFirstCell="Data" textSecondCell="Value" />
          </tbody>
        </table>
      );

      const tdElements = container.querySelectorAll('td');
      expect(tdElements.length).toBe(2);
    });
  });
});
