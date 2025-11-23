import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Footer from './Footer';
import authReducer from '../../features/auth/authSlice';
import { getCurrentYear } from '../../utils/utils';

/**
 * Test suite for Footer component with Redux integration
 */
describe('Footer Component', () => {
  /**
   * Helper function to create a mock store
   * @param {boolean} isLoggedIn - Whether user is logged in
   * @returns {Object} Configured Redux store
   */
  const createMockStore = (isLoggedIn = false) => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: {
            email: isLoggedIn ? 'test@example.com' : '',
            password: '',
          },
          isLoggedIn,
        },
      },
    });
  };

  describe('Basic rendering', () => {
    it('should display copyright text with current year', () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <Footer />
        </Provider>
      );

      const currentYear = getCurrentYear();
      expect(screen.getByText(`Copyright ${currentYear} - Holberton School main dashboard`)).toBeInTheDocument();
    });
  });

  describe('Contact us link visibility', () => {
    it('should display Contact us link when user is logged in', () => {
      const store = createMockStore(true);

      render(
        <Provider store={store}>
          <Footer />
        </Provider>
      );

      // Verify Contact us link is displayed
      const contactLink = screen.getByText('Contact us');
      expect(contactLink).toBeInTheDocument();
      expect(contactLink.tagName).toBe('A');
    });

    it('should not display Contact us link when user is not logged in', () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <Footer />
        </Provider>
      );

      // Verify Contact us link is not displayed
      expect(screen.queryByText('Contact us')).not.toBeInTheDocument();
    });
  });

  describe('State changes', () => {
    it('should show Contact us link after login', () => {
      const store = createMockStore(false);

      const { rerender } = render(
        <Provider store={store}>
          <Footer />
        </Provider>
      );

      // Initially no Contact us link
      expect(screen.queryByText('Contact us')).not.toBeInTheDocument();

      // Update store state to logged in
      const loggedInStore = createMockStore(true);

      rerender(
        <Provider store={loggedInStore}>
          <Footer />
        </Provider>
      );

      // Now Contact us link should be visible
      expect(screen.getByText('Contact us')).toBeInTheDocument();
    });
  });
});
