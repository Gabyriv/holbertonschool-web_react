import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import notificationsReducer, {
  fetchNotifications,
  markNotificationAsRead,
  showDrawer,
  hideDrawer,
} from '../notifications/notificationsSlice';

/**
 * Test suite for notificationsSlice
 * Verifies the notifications state management including async operations
 */
describe('notificationsSlice', () => {
  // Clean up after each test to prevent mock data leakage
  afterEach(() => {
    mockAxios.reset();
  });

  /**
   * Test initial state
   * Ensures the slice returns correct default values
   */
  describe('initial state', () => {
    it('should return the correct initial state by default', () => {
      const initialState = {
        notifications: [],
        displayDrawer: true,
      };

      // Test with undefined state to get initial state
      const state = notificationsReducer(undefined, { type: 'unknown' });

      expect(state).toEqual(initialState);
      expect(state.notifications).toEqual([]);
      expect(state.displayDrawer).toBe(true);
    });
  });

  /**
   * Test fetchNotifications async thunk
   * Verifies that notifications are fetched correctly from the API
   */
  describe('fetchNotifications async thunk', () => {
    it('should fetch notifications data correctly', async () => {
      // Create a test store with the notifications reducer
      const store = configureStore({
        reducer: {
          notifications: notificationsReducer,
        },
      });

      // Mock notifications data from API
      const mockNotificationsData = [
        {
          id: 1,
          type: 'urgent',
          value: 'New course available',
        },
        {
          id: 2,
          type: 'default',
          value: 'New resume available',
        },
      ];

      // Dispatch the async thunk
      const promise = store.dispatch(fetchNotifications());

      // Mock the axios response
      mockAxios.mockResponse({
        data: mockNotificationsData,
      });

      // Wait for the thunk to complete
      await promise;

      // Get the updated state
      const state = store.getState().notifications;

      // Verify notifications were fetched and updated
      expect(state.notifications).toHaveLength(3); // 2 from API + 1 latest
      expect(state.notifications[0]).toEqual(mockNotificationsData[0]);
      expect(state.notifications[1]).toEqual(mockNotificationsData[1]);
      
      // Verify the latest notification was added with HTML content
      expect(state.notifications[2]).toHaveProperty('id', 3);
      expect(state.notifications[2]).toHaveProperty('type', 'default');
      expect(state.notifications[2]).toHaveProperty('html');
      expect(state.notifications[2].html).toHaveProperty('__html');
    });

    it('should handle empty notifications response', async () => {
      const store = configureStore({
        reducer: {
          notifications: notificationsReducer,
        },
      });

      // Dispatch the async thunk
      const promise = store.dispatch(fetchNotifications());

      // Mock empty response
      mockAxios.mockResponse({
        data: [],
      });

      // Wait for the thunk to complete
      await promise;

      // Get the updated state
      const state = store.getState().notifications;

      // Should still have the latest notification added
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0]).toHaveProperty('id', 3);
    });
  });

  /**
   * Test markNotificationAsRead action
   * Verifies that notifications are removed correctly by id
   */
  describe('markNotificationAsRead action', () => {
    it('should remove a notification correctly when dispatched', () => {
      // Start with notifications in state
      const initialState = {
        notifications: [
          { id: 1, type: 'urgent', value: 'Test 1' },
          { id: 2, type: 'default', value: 'Test 2' },
          { id: 3, type: 'default', value: 'Test 3' },
        ],
        displayDrawer: true,
      };

      // Mock console.log to verify it's called
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Dispatch action to mark notification 2 as read
      const state = notificationsReducer(
        initialState,
        markNotificationAsRead(2)
      );

      // Verify notification was removed
      expect(state.notifications).toHaveLength(2);
      expect(state.notifications.find((n) => n.id === 2)).toBeUndefined();
      expect(state.notifications[0].id).toBe(1);
      expect(state.notifications[1].id).toBe(3);

      // Verify console.log was called
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Notification 2 has been marked as read'
      );

      // Restore console.log
      consoleLogSpy.mockRestore();
    });

    it('should handle marking multiple notifications as read', () => {
      const initialState = {
        notifications: [
          { id: 1, type: 'urgent', value: 'Test 1' },
          { id: 2, type: 'default', value: 'Test 2' },
          { id: 3, type: 'default', value: 'Test 3' },
        ],
        displayDrawer: true,
      };

      // Mock console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Mark first notification as read
      let state = notificationsReducer(initialState, markNotificationAsRead(1));
      expect(state.notifications).toHaveLength(2);

      // Mark second notification as read
      state = notificationsReducer(state, markNotificationAsRead(3));
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].id).toBe(2);

      // Restore console.log
      consoleLogSpy.mockRestore();
    });

    it('should handle marking non-existent notification as read', () => {
      const initialState = {
        notifications: [
          { id: 1, type: 'urgent', value: 'Test 1' },
        ],
        displayDrawer: true,
      };

      // Mock console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Try to mark non-existent notification
      const state = notificationsReducer(
        initialState,
        markNotificationAsRead(999)
      );

      // Notifications array should remain unchanged
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].id).toBe(1);

      // Console.log should still be called
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Notification 999 has been marked as read'
      );

      // Restore console.log
      consoleLogSpy.mockRestore();
    });
  });

  /**
   * Test showDrawer and hideDrawer actions
   * Verifies that displayDrawer state toggles correctly
   */
  describe('showDrawer and hideDrawer actions', () => {
    it('should set displayDrawer to true when showDrawer action is dispatched', () => {
      const initialState = {
        notifications: [],
        displayDrawer: false,
      };

      const state = notificationsReducer(initialState, showDrawer());

      expect(state.displayDrawer).toBe(true);
    });

    it('should set displayDrawer to false when hideDrawer action is dispatched', () => {
      const initialState = {
        notifications: [],
        displayDrawer: true,
      };

      const state = notificationsReducer(initialState, hideDrawer());

      expect(state.displayDrawer).toBe(false);
    });

    it('should handle multiple show/hide toggles', () => {
      let state = {
        notifications: [],
        displayDrawer: false,
      };

      // Show drawer
      state = notificationsReducer(state, showDrawer());
      expect(state.displayDrawer).toBe(true);

      // Hide drawer
      state = notificationsReducer(state, hideDrawer());
      expect(state.displayDrawer).toBe(false);

      // Show again
      state = notificationsReducer(state, showDrawer());
      expect(state.displayDrawer).toBe(true);
    });

    it('should not affect notifications when toggling drawer', () => {
      const initialState = {
        notifications: [
          { id: 1, type: 'urgent', value: 'Test 1' },
        ],
        displayDrawer: true,
      };

      // Hide drawer
      let state = notificationsReducer(initialState, hideDrawer());
      expect(state.displayDrawer).toBe(false);
      expect(state.notifications).toHaveLength(1);

      // Show drawer
      state = notificationsReducer(state, showDrawer());
      expect(state.displayDrawer).toBe(true);
      expect(state.notifications).toHaveLength(1);
    });
  });

  /**
   * Test complete workflow
   * Verifies the full lifecycle of notifications management
   */
  describe('complete workflow', () => {
    it('should handle fetch, mark as read, and drawer toggle in sequence', async () => {
      // Create store
      const store = configureStore({
        reducer: {
          notifications: notificationsReducer,
        },
      });

      // Initial state
      let state = store.getState().notifications;
      expect(state.notifications).toHaveLength(0);
      expect(state.displayDrawer).toBe(true);

      // Fetch notifications
      const fetchPromise = store.dispatch(fetchNotifications());
      mockAxios.mockResponse({
        data: [
          { id: 1, type: 'urgent', value: 'Test 1' },
          { id: 2, type: 'default', value: 'Test 2' },
        ],
      });
      await fetchPromise;

      state = store.getState().notifications;
      expect(state.notifications).toHaveLength(3);

      // Mock console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Mark one as read
      store.dispatch(markNotificationAsRead(1));
      state = store.getState().notifications;
      expect(state.notifications).toHaveLength(2);

      // Hide drawer
      store.dispatch(hideDrawer());
      state = store.getState().notifications;
      expect(state.displayDrawer).toBe(false);

      // Show drawer again
      store.dispatch(showDrawer());
      state = store.getState().notifications;
      expect(state.displayDrawer).toBe(true);

      // Restore console.log
      consoleLogSpy.mockRestore();
    });
  });
});

