import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import App from '../App';
import authReducer from '../features/auth/authSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import coursesReducer from '../features/courses/coursesSlice';

/**
 * Test suite for App component with Redux integration
 */
describe('App Component', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  /**
   * Helper function to create a mock store
   * @param {boolean} isLoggedIn - Whether user is logged in
   * @returns {Object} Configured Redux store
   */
  const createMockStore = (isLoggedIn = false) => {
    const preloadedState = {
      auth: {
        user: {
          email: isLoggedIn ? 'test@example.com' : '',
          password: isLoggedIn ? 'password123' : '',
        },
        isLoggedIn,
      },
      notifications: {
        notifications: [],
        displayDrawer: true,
      },
      courses: {
        courses: [],
      },
    };

    return configureStore({
      reducer: {
        auth: authReducer,
        notifications: notificationsReducer,
        courses: coursesReducer,
      },
      preloadedState,
    });
  };

  describe('Authentication-based rendering', () => {
    it('should render Login component when user is not logged in', () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      // Verify Login component is rendered
      expect(screen.getByText('Login to access the full dashboard')).toBeInTheDocument();
      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    });

    it('should render CourseList component when user is logged in', () => {
      const store = createMockStore(true);

      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      // Verify CourseList component is rendered
      expect(screen.getByText('Available courses')).toBeInTheDocument();
      expect(screen.getByText('Course name')).toBeInTheDocument();
    });
  });

  describe('Side effects', () => {
    it('should fetch notifications on mount', async () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      // Wait for the fetchNotifications call
      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalledWith(
          'http://localhost:5173/notifications.json'
        );
      });

      // Mock the response
      const mockNotifications = [
        { id: 1, type: 'default', value: 'New course available' },
        { id: 2, type: 'urgent', value: 'New resume available' },
      ];

      mockAxios.mockResponse({ data: mockNotifications });

      // Verify notifications are displayed
      await waitFor(() => {
        const state = store.getState().notifications;
        expect(state.notifications.length).toBeGreaterThan(0);
      });
    });

    it('should fetch courses when user is logged in', async () => {
      const store = createMockStore(true);

      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      // Wait for the fetchCourses call
      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalledWith(
          'http://localhost:5173/courses.json'
        );
      });
    });

    it('should not fetch courses when user is not logged in', () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      // Verify courses endpoint is not called (only notifications endpoint)
      const coursesCalls = mockAxios.get.mock.calls.filter(
        (call) => call[0] === 'http://localhost:5173/courses.json'
      );
      expect(coursesCalls.length).toBe(0);
    });
  });

  describe('Component structure', () => {
    it('should render all main components', () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      // Verify main components are rendered
      expect(screen.getByText('School dashboard')).toBeInTheDocument();
      expect(screen.getByText('Your notifications')).toBeInTheDocument();
      expect(screen.getByText(/Copyright/)).toBeInTheDocument();
      expect(screen.getByText('News from the School')).toBeInTheDocument();
    });

    it('should render BodySection with news', () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      expect(screen.getByText('News from the School')).toBeInTheDocument();
      expect(screen.getByText(/ipsum Lorem ipsum/)).toBeInTheDocument();
    });
  });
});
