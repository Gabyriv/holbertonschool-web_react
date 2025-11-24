import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationItem from './NotificationItem';

/**
 * Test suite for NotificationItem component
 */
describe('NotificationItem Component', () => {
  describe('Rendering with default type', () => {
    it('should display notification text in default style (blue)', () => {
      render(
        <ul>
          <NotificationItem 
            id="1"
            type="default" 
            value="New course available" 
          />
        </ul>
      );

      const listItem = screen.getByText('New course available');
      
      // Verify it's rendered
      expect(listItem).toBeInTheDocument();
      
      // Verify it has default styling (data-notification-type="default")
      expect(listItem).toHaveAttribute('data-notification-type', 'default');
      
      // Verify it has blue text color
      expect(listItem).toHaveClass('text-blue-600');
    });

    it('should render default type notification with correct class', () => {
      const { container } = render(
        <ul>
          <NotificationItem 
            id="1"
            type="default" 
            value="Test notification" 
          />
        </ul>
      );

      const listItem = container.querySelector('[data-notification-type="default"]');
      expect(listItem).toBeInTheDocument();
      expect(listItem).toHaveClass('text-blue-600');
    });
  });

  describe('Rendering with urgent type', () => {
    it('should display notification text in urgent style (red)', () => {
      render(
        <ul>
          <NotificationItem 
            id="2"
            type="urgent" 
            value="Urgent notification" 
          />
        </ul>
      );

      const listItem = screen.getByText('Urgent notification');
      
      // Verify it's rendered
      expect(listItem).toBeInTheDocument();
      
      // Verify it has urgent styling (data-notification-type="urgent")
      expect(listItem).toHaveAttribute('data-notification-type', 'urgent');
      
      // Verify it has red text color
      expect(listItem).toHaveClass('text-red-600');
    });

    it('should render urgent type notification with correct class', () => {
      const { container } = render(
        <ul>
          <NotificationItem 
            id="2"
            type="urgent" 
            value="Urgent test" 
          />
        </ul>
      );

      const listItem = container.querySelector('[data-notification-type="urgent"]');
      expect(listItem).toBeInTheDocument();
      expect(listItem).toHaveClass('text-red-600');
    });
  });

  describe('Click interaction', () => {
    it('should call markAsRead when clicked', async () => {
      const user = userEvent.setup();
      const mockMarkAsRead = jest.fn();

      render(
        <ul>
          <NotificationItem 
            id="1"
            type="default" 
            value="Click me" 
            markAsRead={mockMarkAsRead}
          />
        </ul>
      );

      const listItem = screen.getByText('Click me');
      await user.click(listItem);

      // Verify markAsRead was called with correct id
      expect(mockMarkAsRead).toHaveBeenCalledWith("1");
      expect(mockMarkAsRead).toHaveBeenCalledTimes(1);
    });

    it('should call markAsRead with correct id for different notifications', async () => {
      const user = userEvent.setup();
      const mockMarkAsRead = jest.fn();

      render(
        <ul>
          <NotificationItem 
            id="5"
            type="urgent" 
            value="Notification 5" 
            markAsRead={mockMarkAsRead}
          />
        </ul>
      );

      const listItem = screen.getByText('Notification 5');
      await user.click(listItem);

      // Verify markAsRead was called with id "5"
      expect(mockMarkAsRead).toHaveBeenCalledWith("5");
    });
  });

  describe('Multiple notifications', () => {
    it('should render multiple notification items with different types', () => {
      const mockMarkAsRead = jest.fn();

      render(
        <ul>
          <NotificationItem 
            id="1"
            type="default" 
            value="Notification 1" 
            markAsRead={mockMarkAsRead}
          />
          <NotificationItem 
            id="2"
            type="urgent" 
            value="Notification 2" 
            markAsRead={mockMarkAsRead}
          />
          <NotificationItem 
            id="3"
            type="default" 
            value="Notification 3" 
            markAsRead={mockMarkAsRead}
          />
        </ul>
      );

      // Verify all notifications are rendered
      expect(screen.getByText('Notification 1')).toBeInTheDocument();
      expect(screen.getByText('Notification 2')).toBeInTheDocument();
      expect(screen.getByText('Notification 3')).toBeInTheDocument();
      
      // Verify correct color classes
      expect(screen.getByText('Notification 1')).toHaveClass('text-blue-600');
      expect(screen.getByText('Notification 2')).toHaveClass('text-red-600');
      expect(screen.getByText('Notification 3')).toHaveClass('text-blue-600');
    });
  });
});
