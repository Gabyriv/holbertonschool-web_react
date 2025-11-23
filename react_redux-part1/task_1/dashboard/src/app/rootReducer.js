import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

/**
 * Root reducer combining all feature reducers
 * This is the main reducer for the application store
 */
const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationsReducer,
  // Add other feature reducers here as needed
});

export default rootReducer;

