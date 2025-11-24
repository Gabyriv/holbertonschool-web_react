import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * API Configuration
 * Centralized API base URL and endpoints for notifications
 */
const API_BASE_URL = 'http://localhost:5173';

const ENDPOINTS = {
  notifications: `${API_BASE_URL}/notifications.json`,
};

/**
 * Initial state for notifications
 * Contains notifications array and loading state
 * Note: displayDrawer removed to prevent unnecessary re-renders
 * Visibility is now controlled via DOM manipulation in the component
 * Loading state tracks the fetch operation status
 */
const initialState = {
  notifications: [],
  loading: false,
};

/**
 * Async thunk to fetch notifications from the API
 * Filters unread notifications and extracts required fields
 * @returns {Array} Filtered unread notifications with id, type, isRead, and value
 */
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    // Fetch notifications from the API endpoint
    const response = await axios.get(ENDPOINTS.notifications);
    const notificationsData = response.data;
    
    // Filter unread notifications and map to required fields
    const unreadNotifications = notificationsData
      .filter((notification) => notification.context.isRead === false)
      .map((notification) => ({
        id: notification.id,
        type: notification.context.type,
        isRead: notification.context.isRead,
        value: notification.context.value,
      }));
    
    // Return the filtered notifications array
    return unreadNotifications;
  }
);

/**
 * Notifications slice for managing notifications state
 * Handles fetching and marking notifications as read
 * Note: Drawer visibility removed from Redux to prevent unnecessary re-renders
 */
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /**
     * Mark notification as read reducer
     * Removes notification from the array by id
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload containing notification id
     */
    markNotificationAsRead: (state, action) => {
      const id = action.payload;
      // Log the notification being marked as read
      console.log(`Notification ${id} has been marked as read`);
      // Filter out the notification with the matching id
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      /**
       * Handle pending state of fetchNotifications thunk
       * Sets loading to true when the fetch request starts
       */
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      /**
       * Handle fulfilled state of fetchNotifications thunk
       * Updates notifications array with fetched data and sets loading to false
       */
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      /**
       * Handle rejected state of fetchNotifications thunk
       * Sets loading to false when the fetch request fails
       */
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      });
  },
});

// Export actions for use in components
// Note: showDrawer and hideDrawer removed - visibility now controlled via DOM manipulation
export const { markNotificationAsRead } = notificationsSlice.actions;

// Export reducer as default for store configuration
export default notificationsSlice.reducer;

