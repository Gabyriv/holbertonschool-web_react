import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Login from './Login';
import authReducer from '../../features/auth/authSlice';

/**
 * Test suite for Login component with Redux integration
 */
describe('Login Component', () => {
  /**
   * Helper function to create a mock store
   * @returns {Object} Configured Redux store
   */
  const createMockStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  };

  describe('Component rendering', () => {
    it('should render the login form with all elements', () => {
      const store = createMockStore();

      render(
        <Provider store={store}>
          <Login />
        </Provider>
      );

      // Verify form elements are present
      expect(screen.getByText('Login to access the full dashboard')).toBeInTheDocument();
      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Password:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /OK/i })).toBeInTheDocument();
    });

    it('should have submit button disabled initially', () => {
      const store = createMockStore();

      render(
        <Provider store={store}>
          <Login />
        </Provider>
      );

      const submitButton = screen.getByRole('button', { name: /OK/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form validation', () => {
    it('should enable submit button with valid credentials', async () => {
      const user = userEvent.setup();
      const store = createMockStore();

      render(
        <Provider store={store}>
          <Login />
        </Provider>
      );

      const emailInput = screen.getByLabelText('Email:');
      const passwordInput = screen.getByLabelText('Password:');
      const submitButton = screen.getByRole('button', { name: /OK/i });

      // Initially disabled
      expect(submitButton).toBeDisabled();

      // Enter valid email and password
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Submit button should now be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should keep submit button disabled with invalid email', async () => {
      const user = userEvent.setup();
      const store = createMockStore();

      render(
        <Provider store={store}>
          <Login />
        </Provider>
      );

      const emailInput = screen.getByLabelText('Email:');
      const passwordInput = screen.getByLabelText('Password:');
      const submitButton = screen.getByRole('button', { name: /OK/i });

      // Enter invalid email
      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');

      // Submit button should remain disabled
      expect(submitButton).toBeDisabled();
    });

    it('should keep submit button disabled with short password', async () => {
      const user = userEvent.setup();
      const store = createMockStore();

      render(
        <Provider store={store}>
          <Login />
        </Provider>
      );

      const emailInput = screen.getByLabelText('Email:');
      const passwordInput = screen.getByLabelText('Password:');
      const submitButton = screen.getByRole('button', { name: /OK/i });

      // Enter valid email but short password
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'short');

      // Submit button should remain disabled
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form submission', () => {
    it('should set isLoggedIn to true on valid submission', async () => {
      const user = userEvent.setup();
      const store = createMockStore();

      render(
        <Provider store={store}>
          <Login />
        </Provider>
      );

      const emailInput = screen.getByLabelText('Email:');
      const passwordInput = screen.getByLabelText('Password:');
      const submitButton = screen.getByRole('button', { name: /OK/i });

      // Enter valid credentials
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Wait for button to be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Submit form
      await user.click(submitButton);

      // Verify Redux state was updated
      await waitFor(() => {
        const state = store.getState().auth;
        expect(state.isLoggedIn).toBe(true);
        expect(state.user.email).toBe('test@example.com');
        expect(state.user.password).toBe('password123');
      });
    });

    it('should keep isLoggedIn false with invalid credentials', async () => {
      const user = userEvent.setup();
      const store = createMockStore();

      render(
        <Provider store={store}>
          <Login />
        </Provider>
      );

      const emailInput = screen.getByLabelText('Email:');
      const passwordInput = screen.getByLabelText('Password:');

      // Enter invalid credentials (short password)
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'short');

      // Verify state remains false (button is disabled, can't submit)
      const state = store.getState().auth;
      expect(state.isLoggedIn).toBe(false);
    });
  });
});
