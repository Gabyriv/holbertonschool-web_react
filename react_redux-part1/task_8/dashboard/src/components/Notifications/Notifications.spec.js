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
   * @param {boolean} displayDrawer - Whether drawer is displayed
   * @returns {Object} Configured Redux store
   */
  const createMockStore = (notifications = [], displayDrawer = true) => {
    return configureStore({
      reducer: {
        notifications: notificationsReducer,
      },
      preloadedState: {
        notifications: {
          notifications,
          displayDrawer,
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
      const store = createMockStore([], true);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      expect(screen.getByText('No new notification for now')).toBeInTheDocument();
    });
  });

  describe('Notifications display', () => {
    it('should display notifications from Redux store', () => {
      const mockNotifications = [
        { id: 1, type: 'default', value: 'New course available' },
        { id: 2, type: 'urgent', value: 'New resume available' },
      ];

      const store = createMockStore(mockNotifications, true);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Verify notifications are displayed
      expect(screen.getByText('New course available')).toBeInTheDocument();
      expect(screen.getByText('New resume available')).toBeInTheDocument();
      expect(screen.getByText('Here is the list of notifications')).toBeInTheDocument();
    });

    it('should fetch and display notifications from API', async () => {
      const store = createMockStore([], true);

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
    it('should hide drawer when hideDrawer action is dispatched', async () => {
      const user = userEvent.setup();
      const store = createMockStore([], true);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Drawer should be visible initially
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();

      // Click close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Verify displayDrawer state is set to false
      await waitFor(() => {
        const state = store.getState().notifications;
        expect(state.displayDrawer).toBe(false);
      });
    });

    it('should show drawer when showDrawer action is dispatched', async () => {
      const user = userEvent.setup();
      const store = createMockStore([], false);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Drawer should be hidden initially
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();

      // Click title to show drawer
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Verify displayDrawer state is set to true
      await waitFor(() => {
        const state = store.getState().notifications;
        expect(state.displayDrawer).toBe(true);
      });
    });

    it('should toggle drawer visibility', async () => {
      const user = userEvent.setup();
      const mockNotifications = [
        { id: 1, type: 'default', value: 'Test notification' },
      ];

      const store = createMockStore(mockNotifications, false);

      const { rerender } = render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Initially drawer is closed
      expect(screen.queryByText('Test notification')).not.toBeInTheDocument();

      // Click to open drawer
      const title = screen.getByText('Your notifications');
      await user.click(title);

      // Rerender
      rerender(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Drawer should be open
      await waitFor(() => {
        expect(screen.getByText('Test notification')).toBeInTheDocument();
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

      const store = createMockStore(mockNotifications, true);

      const { rerender } = render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Both notifications should be visible
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
      const store = createMockStore([{ id: 1, type: 'default', value: 'Test' }], true);

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

  describe('Animation', () => {
    it('should add bounce animation when notifications exist and drawer is closed', () => {
      const mockNotifications = [
        { id: 1, type: 'default', value: 'Test notification' },
      ];

      const store = createMockStore(mockNotifications, false);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Title should have bounce animation class
      const title = screen.getByText('Your notifications');
      expect(title).toHaveClass('animate-bounce');
    });

    it('should not have bounce animation when drawer is open', () => {
      const mockNotifications = [
        { id: 1, type: 'default', value: 'Test notification' },
      ];

      const store = createMockStore(mockNotifications, true);

      render(
        <Provider store={store}>
          <Notifications />
        </Provider>
      );

      // Title should not have bounce animation class
      const title = screen.getByText('Your notifications');
      expect(title).not.toHaveClass('animate-bounce');
    });
  });
});
