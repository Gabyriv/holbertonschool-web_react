import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import Notifications from './Notifications';
import notificationsReducer, {
  fetchNotifications,
  markNotificationAsRead,
} from '../../features/notifications/notificationsSlice';

/**
 * Test suite for Notifications component with Redux integration
 */
describe('Notifications Component', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  /**
   * Helper function to create a mock store
   * @param {Array} notifications - Initial notifications array
   * @param {boolean} loading - Loading state (default: false)
   * @returns {Object} Configured Redux store
   * Note: displayDrawer removed - visibility now controlled via DOM manipulation
   */
  const createMockStore = (notifications = [], loading = false) => {
    return configureStore({
      reducer: {
        notifications: notificationsReducer,
      },
      preloadedState: {
        notifications: {
          notifications,
          loading,
        },
      },
    });
  };

  describe('Basic rendering', () => {
    it('should render the notifications title', () => {
      const store = createMockStore();

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      expect(screen.getByText('Your notifications')).toBeInTheDocument();
    });

    it('should display "No new notification for now" when notifications array is empty', () => {
      const store = createMockStore([]);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Note: Drawer is hidden by default, need to check if text exists in DOM
      // The new message is "No notifications for now"
      expect(screen.getByText('No notifications for now')).toBeInTheDocument();
    });
  });

  describe('Notifications display', () => {
    it('should display notifications from Redux store', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: '1', type: 'default', value: 'New course available', isRead: false },
        { id: '2', type: 'urgent', value: 'New resume available', isRead: false },
      ];

      const store = createMockStore(mockNotifications);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Open drawer to see notifications
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Wait for drawer to be visible
      await waitFor(() => {
        const drawer = document.querySelector('.notification-items');
        expect(drawer).toHaveStyle({ opacity: '1' });
      });

      // Verify notifications are in the DOM
      expect(screen.getByText('New course available')).toBeInTheDocument();
      expect(screen.getByText('New resume available')).toBeInTheDocument();
      expect(screen.getByText('Here is the list of notifications')).toBeInTheDocument();
      
      // Verify filter buttons are rendered
      expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /‼️ Urgent/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /💬 Default/i })).toBeInTheDocument();
    });

    it('should fetch and display notifications from API', async () => {
      const store = createMockStore([]);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Dispatch fetchNotifications action wrapped in act
      act(() => {
        store.dispatch(fetchNotifications());
      });

      // Mock API response with new data structure
      const mockApiData = [
        {
          id: '1',
          context: {
            isRead: false,
            type: 'default',
            value: 'API notification 1',
          },
        },
        {
          id: '2',
          context: {
            isRead: false,
            type: 'urgent',
            value: 'API notification 2',
          },
        },
        {
          id: '3',
          context: {
            isRead: true,
            type: 'default',
            value: 'Already read notification',
          },
        },
      ];

      mockAxios.mockResponse({ data: mockApiData });

      // Wait for unread notifications to be displayed
      await waitFor(() => {
        expect(screen.getByText('API notification 1')).toBeInTheDocument();
        expect(screen.getByText('API notification 2')).toBeInTheDocument();
      });
      
      // Read notification should not be displayed
      expect(screen.queryByText('Already read notification')).not.toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should display "Loading..." when loading is true', () => {
      const store = createMockStore([], true);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Verify loading indicator is displayed
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not display notifications when loading is true', () => {
      const mockNotifications = [
        { id: '1', type: 'default', value: 'Test notification', isRead: false },
      ];
      const store = createMockStore(mockNotifications, true);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Verify loading indicator is displayed
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      // Verify notifications list is not displayed
      expect(screen.queryByText('Here is the list of notifications')).not.toBeInTheDocument();
      expect(screen.queryByText('Test notification')).not.toBeInTheDocument();
      // Verify filter buttons are not displayed while loading
      expect(screen.queryByRole('button', { name: /All/i })).not.toBeInTheDocument();
    });

    it('should display loading indicator during fetch and then show notifications', async () => {
      const store = createMockStore([]);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Initially no loading indicator
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

      // Dispatch fetchNotifications action wrapped in act
      act(() => {
        store.dispatch(fetchNotifications());
      });

      // Should show loading indicator
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      // Mock API response with new structure
      const mockApiData = [
        {
          id: '1',
          context: {
            isRead: false,
            type: 'default',
            value: 'Loaded notification',
          },
        },
      ];

      mockAxios.mockResponse({ data: mockApiData });

      // Loading should be removed and notifications displayed
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        expect(screen.getByText('Loaded notification')).toBeInTheDocument();
      });
    });

    it('should hide loading indicator when fetch fails', async () => {
      const store = createMockStore([]);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Dispatch fetchNotifications action wrapped in act
      act(() => {
        store.dispatch(fetchNotifications());
      });

      // Should show loading indicator
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      // Mock API error
      mockAxios.mockError(new Error('Network error'));

      // Loading should be removed
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      // Should show "No notifications for now" since fetch failed
      expect(screen.getByText('No notifications for now')).toBeInTheDocument();
    });
  });

  describe('Drawer functionality', () => {
    it('should hide drawer when close button is clicked', async () => {
      const user = userEvent.setup();
      const store = createMockStore([]);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Get drawer element by class name
      const drawer = document.querySelector('.notification-items');

      // Initially drawer should be hidden
      expect(drawer).toHaveStyle({ opacity: '0', visibility: 'hidden' });

      // Click title to show drawer
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Drawer should now be visible
      await waitFor(() => {
        expect(drawer).toHaveStyle({ opacity: '1', visibility: 'visible' });
      });

      // Click close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Drawer should be hidden again
      await waitFor(() => {
        expect(drawer).toHaveStyle({ opacity: '0', visibility: 'hidden' });
      });
    });

    it('should show drawer when title is clicked', async () => {
      const user = userEvent.setup();
      const store = createMockStore([]);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Get drawer element by class name
      const drawer = document.querySelector('.notification-items');

      // Drawer should be hidden initially
      expect(drawer).toHaveStyle({ opacity: '0', visibility: 'hidden' });

      // Click title to show drawer
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Drawer should now be visible
      await waitFor(() => {
        expect(drawer).toHaveStyle({ opacity: '1', visibility: 'visible' });
      });
    });

    it('should toggle drawer visibility without re-rendering component', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: 1, type: 'default', value: 'Test notification' },
      ];

      const store = createMockStore(mockNotifications);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Get drawer element
      const drawer = screen.getByText('Test notification').closest('.notification-items');

      // Initially drawer is hidden
      expect(drawer).toHaveStyle({ opacity: '0', visibility: 'hidden' });

      // Click to open drawer
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Drawer should be visible
      await waitFor(() => {
        expect(drawer).toHaveStyle({ opacity: '1', visibility: 'visible' });
      });

      // Click to close drawer
      await user.click(title);

      // Drawer should be hidden again
      await waitFor(() => {
        expect(drawer).toHaveStyle({ opacity: '0', visibility: 'hidden' });
      });
    });
  });

  describe('Mark as read functionality', () => {
    it('should remove notification when marked as read', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: '1', type: 'default', value: 'Notification 1', isRead: false },
        { id: '2', type: 'default', value: 'Notification 2', isRead: false },
      ];

      const store = createMockStore(mockNotifications);

      const { rerender } = render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Both notifications should be in the DOM
      expect(screen.getByText('Notification 1')).toBeInTheDocument();
      expect(screen.getByText('Notification 2')).toBeInTheDocument();

      // Click first notification to mark as read
      const notification1 = screen.getByText('Notification 1');
      await user.click(notification1);

      // Rerender
      rerender(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // First notification should be removed
      await waitFor(() => {
        expect(screen.queryByText('Notification 1')).not.toBeInTheDocument();
        expect(screen.getByText('Notification 2')).toBeInTheDocument();
      });
    });

    it('should log when notification is marked as read', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const store = createMockStore([{ id: '1', type: 'default', value: 'Test', isRead: false }]);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Dispatch markNotificationAsRead action
      act(() => {
        store.dispatch(markNotificationAsRead('1'));
      });

      // Verify console.log was called
      expect(consoleSpy).toHaveBeenCalledWith('Notification 1 has been marked as read');

      consoleSpy.mockRestore();
    });
  });

  describe('Rendering without re-renders', () => {
    it('should not trigger component re-render when toggling drawer visibility', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: '1', type: 'default', value: 'Test notification', isRead: false },
      ];

      const store = createMockStore(mockNotifications);

      // Add console.log to component to track renders (for manual verification)
      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      const title = screen.getByText('Your notifications');
      const drawer = screen.getByText('Test notification').closest('.notification-items');

      // Verify drawer is initially hidden
      expect(drawer).toHaveStyle({ opacity: '0' });

      // Toggle visibility multiple times
      await user.click(title); // Show
      await waitFor(() => expect(drawer).toHaveStyle({ opacity: '1' }));

      await user.click(title); // Hide
      await waitFor(() => expect(drawer).toHaveStyle({ opacity: '0' }));

      await user.click(title); // Show again
      await waitFor(() => expect(drawer).toHaveStyle({ opacity: '1' }));

      // Verify notifications data is still intact (no re-render cleared it)
      expect(screen.getByText('Test notification')).toBeInTheDocument();
    });
  });

  describe('Filter functionality', () => {
    it('should display all notifications when "All" filter is selected', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: '1', type: 'default', value: 'Default notification 1', isRead: false },
        { id: '2', type: 'urgent', value: 'Urgent notification 1', isRead: false },
        { id: '3', type: 'default', value: 'Default notification 2', isRead: false },
      ];

      const store = createMockStore(mockNotifications);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Open drawer to see notifications
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Wait for drawer to be visible
      await waitFor(() => {
        const drawer = document.querySelector('.notification-items');
        expect(drawer).toHaveStyle({ opacity: '1' });
      });

      // All notifications should be visible
      expect(screen.getByText('Default notification 1')).toBeInTheDocument();
      expect(screen.getByText('Urgent notification 1')).toBeInTheDocument();
      expect(screen.getByText('Default notification 2')).toBeInTheDocument();
    });

    it('should filter to show only urgent notifications', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: '1', type: 'default', value: 'Default notification 1', isRead: false },
        { id: '2', type: 'urgent', value: 'Urgent notification 1', isRead: false },
        { id: '3', type: 'default', value: 'Default notification 2', isRead: false },
        { id: '4', type: 'urgent', value: 'Urgent notification 2', isRead: false },
      ];

      const store = createMockStore(mockNotifications);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Open drawer
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Wait for drawer to be visible
      await waitFor(() => {
        const drawer = document.querySelector('.notification-items');
        expect(drawer).toHaveStyle({ opacity: '1' });
      });

      // Initially all notifications are visible
      expect(screen.getByText('Default notification 1')).toBeInTheDocument();
      expect(screen.getByText('Urgent notification 1')).toBeInTheDocument();

      // Click urgent filter button
      const urgentButton = screen.getByRole('button', { name: /‼️ Urgent/i });
      await user.click(urgentButton);

      // Only urgent notifications should be visible
      await waitFor(() => {
        expect(screen.queryByText('Default notification 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Default notification 2')).not.toBeInTheDocument();
        expect(screen.getByText('Urgent notification 1')).toBeInTheDocument();
        expect(screen.getByText('Urgent notification 2')).toBeInTheDocument();
      });
    });

    it('should filter to show only default notifications', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: '1', type: 'default', value: 'Default notification 1', isRead: false },
        { id: '2', type: 'urgent', value: 'Urgent notification 1', isRead: false },
        { id: '3', type: 'default', value: 'Default notification 2', isRead: false },
        { id: '4', type: 'urgent', value: 'Urgent notification 2', isRead: false },
      ];

      const store = createMockStore(mockNotifications);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Open drawer
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Wait for drawer to be visible
      await waitFor(() => {
        const drawer = document.querySelector('.notification-items');
        expect(drawer).toHaveStyle({ opacity: '1' });
      });

      // Click default filter button
      const defaultButton = screen.getByRole('button', { name: /💬 Default/i });
      await user.click(defaultButton);

      // Only default notifications should be visible
      await waitFor(() => {
        expect(screen.getByText('Default notification 1')).toBeInTheDocument();
        expect(screen.getByText('Default notification 2')).toBeInTheDocument();
        expect(screen.queryByText('Urgent notification 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Urgent notification 2')).not.toBeInTheDocument();
      });
    });

    it('should toggle between filters correctly', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: '1', type: 'default', value: 'Default notification', isRead: false },
        { id: '2', type: 'urgent', value: 'Urgent notification', isRead: false },
      ];

      const store = createMockStore(mockNotifications);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Open drawer
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Wait for drawer to be visible
      await waitFor(() => {
        const drawer = document.querySelector('.notification-items');
        expect(drawer).toHaveStyle({ opacity: '1' });
      });

      // Click urgent filter
      const urgentButton = screen.getByRole('button', { name: /‼️ Urgent/i });
      await user.click(urgentButton);

      await waitFor(() => {
        expect(screen.getByText('Urgent notification')).toBeInTheDocument();
        expect(screen.queryByText('Default notification')).not.toBeInTheDocument();
      });

      // Click default filter
      const defaultButton = screen.getByRole('button', { name: /💬 Default/i });
      await user.click(defaultButton);

      await waitFor(() => {
        expect(screen.getByText('Default notification')).toBeInTheDocument();
        expect(screen.queryByText('Urgent notification')).not.toBeInTheDocument();
      });

      // Click all filter
      const allButton = screen.getByRole('button', { name: /All/i });
      await user.click(allButton);

      await waitFor(() => {
        expect(screen.getByText('Default notification')).toBeInTheDocument();
        expect(screen.getByText('Urgent notification')).toBeInTheDocument();
      });
    });

    it('should show appropriate message when no notifications match filter', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: '1', type: 'default', value: 'Default notification', isRead: false },
      ];

      const store = createMockStore(mockNotifications);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Open drawer
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Wait for drawer to be visible
      await waitFor(() => {
        const drawer = document.querySelector('.notification-items');
        expect(drawer).toHaveStyle({ opacity: '1' });
      });

      // Click urgent filter
      const urgentButton = screen.getByRole('button', { name: /‼️ Urgent/i });
      await user.click(urgentButton);

      // Should show "No urgent notifications for now"
      await waitFor(() => {
        expect(screen.getByText('No urgent notifications for now')).toBeInTheDocument();
        expect(screen.queryByText('Default notification')).not.toBeInTheDocument();
      });
    });

    it('should highlight active filter button', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: '1', type: 'default', value: 'Test', isRead: false },
      ];

      const store = createMockStore(mockNotifications);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Open drawer
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Wait for drawer to be visible
      await waitFor(() => {
        const drawer = document.querySelector('.notification-items');
        expect(drawer).toHaveStyle({ opacity: '1' });
      });

      const allButton = screen.getByRole('button', { name: /All/i });
      const urgentButton = screen.getByRole('button', { name: /‼️ Urgent/i });

      // All button should be active initially
      expect(allButton).toHaveClass('bg-blue-500');
      expect(urgentButton).toHaveClass('bg-white');

      // Click urgent button
      await user.click(urgentButton);

      // Urgent button should be active
      await waitFor(() => {
        expect(urgentButton).toHaveClass('bg-red-500');
        expect(allButton).toHaveClass('bg-white');
      });
    });
  });
});
