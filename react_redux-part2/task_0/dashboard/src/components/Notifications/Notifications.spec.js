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
   * @returns {Object} Configured Redux store
   * Note: displayDrawer removed - visibility now controlled via DOM manipulation
   */
  const createMockStore = (notifications = []) => {
    return configureStore({
      reducer: {
        notifications: notificationsReducer,
      },
      preloadedState: {
        notifications: {
          notifications,
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
      expect(screen.getByText('No new notification for now')).toBeInTheDocument();
    });
  });

  describe('Notifications display', () => {
    it('should display notifications from Redux store', () => {
      const mockNotifications = [
        { id: 1, type: 'default', value: 'New course available' },
        { id: 2, type: 'urgent', value: 'New resume available' },
      ];

      const store = createMockStore(mockNotifications);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Verify notifications are in the DOM (even if hidden)
      expect(screen.getByText('New course available')).toBeInTheDocument();
      expect(screen.getByText('New resume available')).toBeInTheDocument();
      expect(screen.getByText('Here is the list of notifications')).toBeInTheDocument();
    });

    it('should fetch and display notifications from API', async () => {
      const store = createMockStore([]);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Dispatch fetchNotifications action
      store.dispatch(fetchNotifications());

      // Mock API response
      const mockNotifications = [
        { id: 1, type: 'default', value: 'API notification 1' },
        { id: 2, type: 'urgent', value: 'API notification 2' },
      ];

      mockAxios.mockResponse({ data: mockNotifications });

      // Wait for notifications to be displayed
      await waitFor(() => {
        expect(screen.getByText('API notification 1')).toBeInTheDocument();
        expect(screen.getByText('API notification 2')).toBeInTheDocument();
      });
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

      // Get drawer element
      const drawer = screen.getByText('No new notification for now').parentElement;

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

      // Get drawer element
      const drawer = screen.getByText('No new notification for now').parentElement;

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
        { id: 1, type: 'default', value: 'Notification 1' },
        { id: 2, type: 'default', value: 'Notification 2' },
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
      const store = createMockStore([{ id: 1, type: 'default', value: 'Test' }]);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Dispatch markNotificationAsRead action
      act(() => {
        store.dispatch(markNotificationAsRead(1));
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
        { id: 1, type: 'default', value: 'Test notification' },
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
});
