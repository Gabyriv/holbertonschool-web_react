import { createSelector } from '@reduxjs/toolkit';

/**
 * Base selector to get the notifications array from Redux state
 * @param {Object} state - Redux state
 * @returns {Array} Notifications array
 */
const selectNotifications = (state) => state.notifications.notifications;

/**
 * Selector to get the filter value
 * @param {Object} state - Redux state  
 * @param {string} filter - Filter type ('all', 'urgent', 'default')
 * @returns {string} Filter value
 */
const selectFilter = (state, filter) => filter;

/**
 * Memoized selector to filter notifications based on type
 * Uses createSelector for memoization - only recomputes when inputs change
 * 
 * @param {Object} state - Redux state
 * @param {string} filter - Filter type ('all', 'urgent', or 'default')
 * @returns {Array} Filtered notifications array
 */
export const getFilteredNotifications = createSelector(
  [selectNotifications, selectFilter],
  (notifications, filter) => {
    // If filter is 'all', return all notifications
    if (filter === 'all') {
      return notifications;
    }
    
    // For 'urgent' or 'default' filters, return notifications matching the type
    return notifications.filter(
      (notification) => notification.type === filter
    );
  }
);

