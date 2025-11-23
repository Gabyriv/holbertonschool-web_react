import authReducer, { login, logout } from '../auth/authSlice';

/**
 * Test suite for authSlice
 * Verifies the authentication state management
 */
describe('authSlice', () => {
  /**
   * Test initial state
   * Ensures the slice returns correct default values
   */
  describe('initial state', () => {
    it('should return the correct initial state by default', () => {
      const initialState = {
        user: {
          email: '',
          password: '',
        },
        isLoggedIn: false,
      };

      // Test with undefined state to get initial state
      const state = authReducer(undefined, { type: 'unknown' });
      
      expect(state).toEqual(initialState);
      expect(state.user.email).toBe('');
      expect(state.user.password).toBe('');
      expect(state.isLoggedIn).toBe(false);
    });
  });

  /**
   * Test login action
   * Verifies that user credentials are stored and isLoggedIn is set to true
   */
  describe('login action', () => {
    it('should update the state correctly when the login action is dispatched', () => {
      const initialState = {
        user: {
          email: '',
          password: '',
        },
        isLoggedIn: false,
      };

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const state = authReducer(initialState, login(credentials));

      // Verify user email is updated
      expect(state.user.email).toBe(credentials.email);
      
      // Verify user password is updated
      expect(state.user.password).toBe(credentials.password);
      
      // Verify isLoggedIn is set to true
      expect(state.isLoggedIn).toBe(true);
    });

    it('should handle multiple login actions', () => {
      const initialState = {
        user: {
          email: '',
          password: '',
        },
        isLoggedIn: false,
      };

      // First login
      const firstCredentials = {
        email: 'user1@example.com',
        password: 'pass1',
      };
      
      let state = authReducer(initialState, login(firstCredentials));
      expect(state.user.email).toBe(firstCredentials.email);
      expect(state.user.password).toBe(firstCredentials.password);

      // Second login (should update with new credentials)
      const secondCredentials = {
        email: 'user2@example.com',
        password: 'pass2',
      };
      
      state = authReducer(state, login(secondCredentials));
      expect(state.user.email).toBe(secondCredentials.email);
      expect(state.user.password).toBe(secondCredentials.password);
      expect(state.isLoggedIn).toBe(true);
    });
  });

  /**
   * Test logout action
   * Verifies that user credentials are reset and isLoggedIn is set to false
   */
  describe('logout action', () => {
    it('should reset the state correctly when the logout action is dispatched', () => {
      // Start with a logged-in state
      const loggedInState = {
        user: {
          email: 'test@example.com',
          password: 'password123',
        },
        isLoggedIn: true,
      };

      const state = authReducer(loggedInState, logout());

      // Verify user email is reset to empty string
      expect(state.user.email).toBe('');
      
      // Verify user password is reset to empty string
      expect(state.user.password).toBe('');
      
      // Verify isLoggedIn is set to false
      expect(state.isLoggedIn).toBe(false);
    });

    it('should handle logout when already logged out', () => {
      const loggedOutState = {
        user: {
          email: '',
          password: '',
        },
        isLoggedIn: false,
      };

      const state = authReducer(loggedOutState, logout());

      // State should remain the same
      expect(state.user.email).toBe('');
      expect(state.user.password).toBe('');
      expect(state.isLoggedIn).toBe(false);
    });
  });

  /**
   * Test complete login/logout flow
   * Verifies the full authentication lifecycle
   */
  describe('login and logout flow', () => {
    it('should handle a complete login and logout cycle', () => {
      let state = authReducer(undefined, { type: 'unknown' });
      
      // Initial state - logged out
      expect(state.isLoggedIn).toBe(false);
      expect(state.user.email).toBe('');

      // Login
      const credentials = {
        email: 'user@test.com',
        password: 'testpass',
      };
      state = authReducer(state, login(credentials));
      expect(state.isLoggedIn).toBe(true);
      expect(state.user.email).toBe(credentials.email);
      expect(state.user.password).toBe(credentials.password);

      // Logout
      state = authReducer(state, logout());
      expect(state.isLoggedIn).toBe(false);
      expect(state.user.email).toBe('');
      expect(state.user.password).toBe('');
    });
  });
});

