import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getLatestNotification } from '../../utils/utils.js';

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
 * Contains notifications array only
 * Note: displayDrawer removed to prevent unnecessary re-renders
 * Visibility is now controlled via DOM manipulation in the component
 */
const initialState = {
  notifications: [],
};

/**
 * Async thunk to fetch notifications from the API
 * Fetches notifications and adds the latest notification with HTML content
 * @returns {Array} Updated notifications array with latest notification
 */
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    // Fetch notifications from the API endpoint
    const response = await axios.get(ENDPOINTS.notifications);
    const notificationsData = response.data;
    
    // Create the latest notification with HTML content
    const latestNotification = {
      id: 3,
      type: 'default',
      html: { __html: getLatestNotification() },
    };
    
    // Return the updated notifications array
    return [...notificationsData, latestNotification];
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
       * Handle fulfilled state of fetchNotifications thunk
       * Updates notifications array with fetched data
       */
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      });
  },
});

// Export actions for use in components
// Note: showDrawer and hideDrawer removed - visibility now controlled via DOM manipulation
export const { markNotificationAsRead } = notificationsSlice.actions;

// Export reducer as default for store configuration
export default notificationsSlice.reducer;

