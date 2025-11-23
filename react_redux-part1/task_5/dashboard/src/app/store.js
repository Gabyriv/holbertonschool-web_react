import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

/**
 * Configure and create the Redux store
 * Uses the root reducer which combines all feature reducers
 */
const store = configureStore({
  reducer: rootReducer,
  // Redux Toolkit includes good defaults for middleware
  // including redux-thunk and development checks
});

export default store;

