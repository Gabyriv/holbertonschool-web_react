import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

/**
 * Root reducer combining all feature reducers
 * This is the main reducer for the application store
 */
const rootReducer = combineReducers({
  auth: authReducer,
  // Add other feature reducers here as needed
});

export default rootReducer;

