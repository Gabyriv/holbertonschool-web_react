import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import notificationsReducer, {
  fetchNotifications,
  markNotificationAsRead,
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
   * Note: displayDrawer removed - visibility now controlled via DOM manipulation
   */
  describe('initial state', () => {
    it('should return the correct initial state by default', () => {
      const initialState = {
        notifications: [],
        loading: false,
      };

      // Test with undefined state to get initial state
      const state = notificationsReducer(undefined, { type: 'unknown' });

      expect(state).toEqual(initialState);
      expect(state.notifications).toEqual([]);
      expect(state.loading).toBe(false);
    });
  });

  /**
   * Test fetchNotifications async thunk
   * Verifies that notifications are fetched and filtered correctly from the API
   * Only unread notifications are extracted with required fields
   */
  describe('fetchNotifications async thunk', () => {
    it('should fetch and filter unread notifications correctly', async () => {
      // Create a test store with the notifications reducer
      const store = configureStore({
        reducer: {
          notifications: notificationsReducer,
        },
      });

      // Mock notifications data from API with new structure
      const mockApiData = [
        {
          id: '1',
          context: {
            isRead: false,
            type: 'urgent',
            value: 'New course available',
          },
        },
        {
          id: '2',
          context: {
            isRead: false,
            type: 'default',
            value: 'New resume available',
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

      // Dispatch the async thunk
      const promise = store.dispatch(fetchNotifications());

      // Mock the axios response
      mockAxios.mockResponse({
        data: mockApiData,
      });

      // Wait for the thunk to complete
      await promise;

      // Get the updated state
      const state = store.getState().notifications;

      // Verify only unread notifications were added (2 out of 3)
      expect(state.notifications).toHaveLength(2);
      
      // Verify notifications have required fields
      expect(state.notifications[0]).toEqual({
        id: '1',
        type: 'urgent',
        value: 'New course available',
        isRead: false,
      });
      expect(state.notifications[1]).toEqual({
        id: '2',
        type: 'default',
        value: 'New resume available',
        isRead: false,
      });
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

      // Should have no notifications since all are filtered
      expect(state.notifications).toHaveLength(0);
    });

    it('should filter out all read notifications', async () => {
      const store = configureStore({
        reducer: {
          notifications: notificationsReducer,
        },
      });

      // Mock API data with only read notifications
      const mockApiData = [
        {
          id: '1',
          context: {
            isRead: true,
            type: 'urgent',
            value: 'Read notification 1',
          },
        },
        {
          id: '2',
          context: {
            isRead: true,
            type: 'default',
            value: 'Read notification 2',
          },
        },
      ];

      // Dispatch the async thunk
      const promise = store.dispatch(fetchNotifications());

      // Mock the axios response
      mockAxios.mockResponse({
        data: mockApiData,
      });

      // Wait for the thunk to complete
      await promise;

      // Get the updated state
      const state = store.getState().notifications;

      // All notifications should be filtered out since they're read
      expect(state.notifications).toHaveLength(0);
    });
  });

  /**
   * Test loading state during fetchNotifications
   * Verifies that loading state is properly managed during async operations
   */
  describe('loading state', () => {
    it('should set loading to true when fetchNotifications is pending', () => {
      const initialState = {
        notifications: [],
        loading: false,
      };

      // Simulate pending state
      const state = notificationsReducer(
        initialState,
        { type: fetchNotifications.pending.type }
      );

      expect(state.loading).toBe(true);
      expect(state.notifications).toEqual([]);
    });

    it('should set loading to false when fetchNotifications is fulfilled', () => {
      const initialState = {
        notifications: [],
        loading: true,
      };

      const mockNotifications = [
        { id: '1', type: 'default', value: 'Test', isRead: false },
      ];

      // Simulate fulfilled state
      const state = notificationsReducer(
        initialState,
        {
          type: fetchNotifications.fulfilled.type,
          payload: mockNotifications,
        }
      );

      expect(state.loading).toBe(false);
      expect(state.notifications).toEqual(mockNotifications);
    });

    it('should set loading to false when fetchNotifications is rejected', () => {
      const initialState = {
        notifications: [],
        loading: true,
      };

      // Simulate rejected state
      const state = notificationsReducer(
        initialState,
        { type: fetchNotifications.rejected.type }
      );

      expect(state.loading).toBe(false);
      expect(state.notifications).toEqual([]);
    });

    it('should handle full loading lifecycle during fetch', async () => {
      const store = configureStore({
        reducer: {
          notifications: notificationsReducer,
        },
      });

      // Initial state - loading should be false
      let state = store.getState().notifications;
      expect(state.loading).toBe(false);

      // Dispatch the async thunk
      const promise = store.dispatch(fetchNotifications());

      // Loading should be true immediately after dispatch
      state = store.getState().notifications;
      expect(state.loading).toBe(true);

      // Mock successful response with new structure
      mockAxios.mockResponse({
        data: [
          {
            id: '1',
            context: {
              isRead: false,
              type: 'default',
              value: 'Test',
            },
          },
        ],
      });

      // Wait for the thunk to complete
      await promise;

      // Loading should be false after completion
      state = store.getState().notifications;
      expect(state.loading).toBe(false);
      expect(state.notifications).toHaveLength(1); // Only unread notifications
    });

    it('should set loading to false when fetch fails', async () => {
      const store = configureStore({
        reducer: {
          notifications: notificationsReducer,
        },
      });

      // Initial state - loading should be false
      let state = store.getState().notifications;
      expect(state.loading).toBe(false);

      // Dispatch the async thunk
      const promise = store.dispatch(fetchNotifications());

      // Loading should be true
      state = store.getState().notifications;
      expect(state.loading).toBe(true);

      // Mock error response
      mockAxios.mockError(new Error('Network error'));

      // Wait for the thunk to complete (with error)
      await promise.catch(() => {});

      // Loading should be false after error
      state = store.getState().notifications;
      expect(state.loading).toBe(false);
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
          { id: '1', type: 'urgent', value: 'Test 1', isRead: false },
          { id: '2', type: 'default', value: 'Test 2', isRead: false },
          { id: '3', type: 'default', value: 'Test 3', isRead: false },
        ],
      };

      // Mock console.log to verify it's called
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Dispatch action to mark notification 2 as read
      const state = notificationsReducer(
        initialState,
        markNotificationAsRead('2')
      );

      // Verify notification was removed
      expect(state.notifications).toHaveLength(2);
      expect(state.notifications.find((n) => n.id === '2')).toBeUndefined();
      expect(state.notifications[0].id).toBe('1');
      expect(state.notifications[1].id).toBe('3');

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
          { id: '1', type: 'urgent', value: 'Test 1', isRead: false },
          { id: '2', type: 'default', value: 'Test 2', isRead: false },
          { id: '3', type: 'default', value: 'Test 3', isRead: false },
        ],
      };

      // Mock console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Mark first notification as read
      let state = notificationsReducer(initialState, markNotificationAsRead('1'));
      expect(state.notifications).toHaveLength(2);

      // Mark second notification as read
      state = notificationsReducer(state, markNotificationAsRead('3'));
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].id).toBe('2');

      // Restore console.log
      consoleLogSpy.mockRestore();
    });

    it('should handle marking non-existent notification as read', () => {
      const initialState = {
        notifications: [
          { id: '1', type: 'urgent', value: 'Test 1', isRead: false },
        ],
      };

      // Mock console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Try to mark non-existent notification
      const state = notificationsReducer(
        initialState,
        markNotificationAsRead('999')
      );

      // Notifications array should remain unchanged
      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].id).toBe('1');

      // Console.log should still be called
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Notification 999 has been marked as read'
      );

      // Restore console.log
      consoleLogSpy.mockRestore();
    });
  });

  /**
   * Test complete workflow
   * Verifies the full lifecycle of notifications management
   * Note: Drawer visibility tests removed as it's now handled via DOM manipulation
   */
  describe('complete workflow', () => {
    it('should handle fetch and mark as read in sequence', async () => {
      // Create store
      const store = configureStore({
        reducer: {
          notifications: notificationsReducer,
        },
      });

      // Initial state
      let state = store.getState().notifications;
      expect(state.notifications).toHaveLength(0);

      // Fetch notifications with new structure
      const fetchPromise = store.dispatch(fetchNotifications());
      mockAxios.mockResponse({
        data: [
          {
            id: '1',
            context: {
              isRead: false,
              type: 'urgent',
              value: 'Test 1',
            },
          },
          {
            id: '2',
            context: {
              isRead: false,
              type: 'default',
              value: 'Test 2',
            },
          },
          {
            id: '3',
            context: {
              isRead: true,
              type: 'default',
              value: 'Already read',
            },
          },
        ],
      });
      await fetchPromise;

      state = store.getState().notifications;
      // Only 2 unread notifications should be in state
      expect(state.notifications).toHaveLength(2);

      // Mock console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Mark one as read
      store.dispatch(markNotificationAsRead('1'));
      state = store.getState().notifications;
      expect(state.notifications).toHaveLength(1);

      // Mark another as read
      store.dispatch(markNotificationAsRead('2'));
      state = store.getState().notifications;
      expect(state.notifications).toHaveLength(0);

      // Restore console.log
      consoleLogSpy.mockRestore();
    });
  });
});

