import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for authentication
 * Contains user credentials and login status
 */
const initialState = {
  user: {
    email: '',
    password: '',
  },
  isLoggedIn: false,
};

/**
 * Auth slice for managing authentication state
 * Handles login and logout actions
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Login reducer
     * Updates user credentials and sets logged in status
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload containing email and password
     */
    login: (state, action) => {
      state.user.email = action.payload.email;
      state.user.password = action.payload.password;
      state.isLoggedIn = true;
    },
    
    /**
     * Logout reducer
     * Resets user credentials and logged in status
     * @param {Object} state - Current state
     */
    logout: (state) => {
      state.user.email = '';
      state.user.password = '';
      state.isLoggedIn = false;
    },
  },
});

// Export actions for use in components
export const { login, logout } = authSlice.actions;

// Export reducer as default for store configuration
export default authSlice.reducer;

