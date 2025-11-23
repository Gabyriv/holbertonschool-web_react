import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import authReducer, { login } from '../../features/auth/authSlice';

/**
 * Test suite for Header component with Redux integration
 */
describe('Header Component', () => {
  /**
   * Helper function to create a mock store
   * @param {boolean} isLoggedIn - Whether user is logged in
   * @param {string} email - User email
   * @returns {Object} Configured Redux store
   */
  const createMockStore = (isLoggedIn = false, email = '') => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: {
            email,
            password: '',
          },
          isLoggedIn,
        },
      },
    });
  };

  describe('Basic rendering', () => {
    it('should render the logo and title', () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <Header />
        </Provider>
      );

      expect(screen.getByAltText('holberton logo')).toBeInTheDocument();
      expect(screen.getByText('School dashboard')).toBeInTheDocument();
    });
  });

  describe('Logout link visibility', () => {
    it('should display logout link when user is logged in', () => {
      const store = createMockStore(true, 'test@example.com');

      render(
        <Provider store={store}>
          <Header />
        </Provider>
      );

      // Verify logout link is displayed
      expect(screen.getByText('logout')).toBeInTheDocument();
    });

    it('should not display logout link when user is not logged in', () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <Header />
        </Provider>
      );

      // Verify logout link is not displayed
      expect(screen.queryByText('logout')).not.toBeInTheDocument();
    });
  });

  describe('Welcome message', () => {
    it('should display welcome message with email when logged in', () => {
      const testEmail = 'test@example.com';
      const store = createMockStore(true, testEmail);

      render(
        <Provider store={store}>
          <Header />
        </Provider>
      );

      // Verify welcome message displays the email
      expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
      expect(screen.getByText(testEmail)).toBeInTheDocument();
    });

    it('should display welcome message after login action', () => {
      const store = createMockStore(false);

      // Dispatch login action before rendering
      act(() => {
        store.dispatch(login({ email: 'newuser@example.com', password: 'password123' }));
      });

      render(
        <Provider store={store}>
          <Header />
        </Provider>
      );

      // Verify welcome message displays the entered email
      expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
      expect(screen.getByText('newuser@example.com')).toBeInTheDocument();
    });
  });

  describe('Logout functionality', () => {
    it('should set isLoggedIn to false when logout is clicked', async () => {
      const user = userEvent.setup();
      const store = createMockStore(true, 'test@example.com');

      render(
        <Provider store={store}>
          <Header />
        </Provider>
      );

      // Click logout link
      const logoutLink = screen.getByText('logout');
      await user.click(logoutLink);

      // Verify Redux state was updated
      await waitFor(() => {
        const state = store.getState().auth;
        expect(state.isLoggedIn).toBe(false);
        expect(state.user.email).toBe('');
      });
    });

    it('should hide logout section after logout', async () => {
      const user = userEvent.setup();
      const store = createMockStore(true, 'test@example.com');

      const { rerender } = render(
        <Provider store={store}>
          <Header />
        </Provider>
      );

      // Verify logout link is visible
      expect(screen.getByText('logout')).toBeInTheDocument();

      // Click logout
      const logoutLink = screen.getByText('logout');
      await user.click(logoutLink);

      // Rerender with updated store
      rerender(
        <Provider store={store}>
          <Header />
        </Provider>
      );

      // Verify logout link is no longer visible
      await waitFor(() => {
        expect(screen.queryByText('logout')).not.toBeInTheDocument();
      });
    });
  });

  describe('State integration', () => {
    it('should respond to login action from Redux store', () => {
      const store = createMockStore(false);

      const { rerender } = render(
        <Provider store={store}>
          <Header />
        </Provider>
      );

      // Initially no logout section
      expect(screen.queryByText('logout')).not.toBeInTheDocument();

      // Dispatch login action
      act(() => {
        store.dispatch(login({ email: 'redux@test.com', password: 'test123456' }));
      });

      // Rerender
      rerender(
        <Provider store={store}>
          <Header />
        </Provider>
      );

      // Now logout section should be visible
      expect(screen.getByText('logout')).toBeInTheDocument();
      expect(screen.getByText('redux@test.com')).toBeInTheDocument();
    });
  });
});
