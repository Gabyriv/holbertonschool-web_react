import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      
      // Verify it's a th element and has colspan of 3
      expect(headerCell.tagName).toBe('TH');
      expect(headerCell).toHaveAttribute('colSpan', '3');
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
    it('should render regular row with three td cells including checkbox', () => {
      const { container } = render(
        <table>
          <tbody>
            <CourseListRow 
              isHeader={false} 
              textFirstCell="ES6" 
              textSecondCell="60"
              id={1}
              isChecked={false}
              onChangeRow={() => {}}
            />
          </tbody>
        </table>
      );

      // Get text td elements
      const firstCell = screen.getByText('ES6');
      const secondCell = screen.getByText('60');
      
      // Verify both are td elements
      expect(firstCell.tagName).toBe('TD');
      expect(secondCell.tagName).toBe('TD');

      // Verify checkbox is present
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('should render multiple course rows', () => {
      render(
        <table>
          <tbody>
            <CourseListRow 
              isHeader={false} 
              textFirstCell="ES6" 
              textSecondCell="60"
              id={1}
              isChecked={false}
              onChangeRow={() => {}}
            />
            <CourseListRow 
              isHeader={false} 
              textFirstCell="Webpack" 
              textSecondCell="20"
              id={2}
              isChecked={false}
              onChangeRow={() => {}}
            />
            <CourseListRow 
              isHeader={false} 
              textFirstCell="React" 
              textSecondCell="40"
              id={3}
              isChecked={false}
              onChangeRow={() => {}}
            />
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
            <CourseListRow 
              isHeader={false} 
              textFirstCell="Data" 
              textSecondCell="Value"
              id={1}
              isChecked={false}
              onChangeRow={() => {}}
            />
          </tbody>
        </table>
      );

      const tdElements = container.querySelectorAll('td');
      expect(tdElements.length).toBe(3); // Updated to 3 to include checkbox column
    });
  });

  describe('Checkbox functionality', () => {
    it('should render a checkbox for course rows', () => {
      const { container } = render(
        <table>
          <tbody>
            <CourseListRow 
              isHeader={false} 
              textFirstCell="ES6" 
              textSecondCell="60"
              id={1}
              isChecked={false}
              onChangeRow={() => {}}
            />
          </tbody>
        </table>
      );

      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('should reflect the checked state passed as prop', () => {
      const { container: container1 } = render(
        <table>
          <tbody>
            <CourseListRow 
              isHeader={false} 
              textFirstCell="ES6" 
              textSecondCell="60"
              id={1}
              isChecked={true}
              onChangeRow={() => {}}
            />
          </tbody>
        </table>
      );

      const checkbox1 = container1.querySelector('input[type="checkbox"]');
      expect(checkbox1.checked).toBe(true);

      const { container: container2 } = render(
        <table>
          <tbody>
            <CourseListRow 
              isHeader={false} 
              textFirstCell="Webpack" 
              textSecondCell="20"
              id={2}
              isChecked={false}
              onChangeRow={() => {}}
            />
          </tbody>
        </table>
      );

      const checkbox2 = container2.querySelector('input[type="checkbox"]');
      expect(checkbox2.checked).toBe(false);
    });

    it('should call onChangeRow with correct arguments when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const mockOnChangeRow = jest.fn();

      const { container } = render(
        <table>
          <tbody>
            <CourseListRow 
              isHeader={false} 
              textFirstCell="ES6" 
              textSecondCell="60"
              id={1}
              isChecked={false}
              onChangeRow={mockOnChangeRow}
            />
          </tbody>
        </table>
      );

      const checkbox = container.querySelector('input[type="checkbox"]');
      await user.click(checkbox);

      expect(mockOnChangeRow).toHaveBeenCalledWith(1, true);
    });

    it('should call onChangeRow with false when unchecking', async () => {
      const user = userEvent.setup();
      const mockOnChangeRow = jest.fn();

      const { container } = render(
        <table>
          <tbody>
            <CourseListRow 
              isHeader={false} 
              textFirstCell="ES6" 
              textSecondCell="60"
              id={1}
              isChecked={true}
              onChangeRow={mockOnChangeRow}
            />
          </tbody>
        </table>
      );

      const checkbox = container.querySelector('input[type="checkbox"]');
      await user.click(checkbox);

      expect(mockOnChangeRow).toHaveBeenCalledWith(1, false);
    });

    it('should not render checkbox for header rows', () => {
      const { container } = render(
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

      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).not.toBeInTheDocument();
    });
  });
});
