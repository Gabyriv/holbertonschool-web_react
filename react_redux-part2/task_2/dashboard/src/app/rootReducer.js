import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import coursesReducer from '../features/courses/coursesSlice';

/**
 * Root reducer combining all feature reducers
 * This is the main reducer for the application store
 */
const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationsReducer,
  courses: coursesReducer,
});

export default rootReducer;

