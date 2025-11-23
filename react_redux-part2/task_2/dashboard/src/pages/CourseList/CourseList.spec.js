import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import CourseList from './CourseList';
import authReducer, { logout } from '../../features/auth/authSlice';
import coursesReducer, { 
  fetchCourses,
  selectCourse,
  unSelectCourse,
} from '../../features/courses/coursesSlice';

/**
 * Test suite for CourseList component with Redux integration
 */
describe('CourseList Component', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  /**
   * Helper function to create a mock store
   * @param {Array} courses - Initial courses array (with isSelected property)
   * @returns {Object} Configured Redux store
   */
  const createMockStore = (courses = []) => {
    return configureStore({
      reducer: {
        auth: authReducer,
        courses: coursesReducer,
      },
      preloadedState: {
        auth: {
          user: { email: '', password: '' },
          isLoggedIn: false,
        },
        courses: {
          courses,
        },
      },
    });
  };

  describe('Basic rendering', () => {
    it('should render the course list table', () => {
      const store = createMockStore();

      render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      expect(screen.getByText('Available courses')).toBeInTheDocument();
      expect(screen.getByText('Course name')).toBeInTheDocument();
      expect(screen.getByText('Credit')).toBeInTheDocument();
    });

    it('should display "No course available yet" when courses array is empty', () => {
      const store = createMockStore([]);

      render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      expect(screen.getByText('No course available yet')).toBeInTheDocument();
    });
  });

  describe('Courses display', () => {
    it('should display courses from Redux store', () => {
      const mockCourses = [
        { id: 1, name: 'ES6', credit: 60 },
        { id: 2, name: 'Webpack', credit: 20 },
        { id: 3, name: 'React', credit: 40 },
      ];

      const store = createMockStore(mockCourses);

      render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      // Verify all courses are displayed
      expect(screen.getByText('ES6')).toBeInTheDocument();
      expect(screen.getByText('Webpack')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('40')).toBeInTheDocument();
    });

    it('should fetch and display courses from API', async () => {
      const store = createMockStore([]);

      render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      // Dispatch fetchCourses action
      store.dispatch(fetchCourses());

      // Mock API response
      const mockCourses = [
        { id: 1, name: 'ES6', credit: 60 },
        { id: 2, name: 'Webpack', credit: 20 },
      ];

      mockAxios.mockResponse({ data: mockCourses });

      // Wait for courses to be displayed
      await waitFor(() => {
        expect(screen.getByText('ES6')).toBeInTheDocument();
        expect(screen.getByText('Webpack')).toBeInTheDocument();
      });
    });
  });

  describe('Logout interaction', () => {
    it('should reset courses array when logout action is dispatched', async () => {
      const mockCourses = [
        { id: 1, name: 'ES6', credit: 60 },
        { id: 2, name: 'Webpack', credit: 20 },
      ];

      const store = createMockStore(mockCourses);

      const { rerender } = render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      // Verify courses are displayed
      expect(screen.getByText('ES6')).toBeInTheDocument();
      expect(screen.getByText('Webpack')).toBeInTheDocument();

      // Dispatch logout action
      act(() => {
        store.dispatch(logout());
      });

      // Rerender component
      rerender(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      // Verify courses are reset
      await waitFor(() => {
        expect(screen.queryByText('ES6')).not.toBeInTheDocument();
        expect(screen.queryByText('Webpack')).not.toBeInTheDocument();
        expect(screen.getByText('No course available yet')).toBeInTheDocument();
      });
    });
  });

  describe('Redux state integration', () => {
    it('should update when Redux store changes', async () => {
      const store = createMockStore([]);

      const { rerender } = render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      // Initially no courses
      expect(screen.getByText('No course available yet')).toBeInTheDocument();

      // Dispatch fetchCourses
      store.dispatch(fetchCourses());

      mockAxios.mockResponse({
        data: [{ id: 1, name: 'New Course', credit: 30 }],
      });

      // Rerender
      rerender(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      // Verify new course is displayed
      await waitFor(() => {
        expect(screen.getByText('New Course')).toBeInTheDocument();
      });
    });
  });

  describe('Course selection functionality', () => {
    it('should render checkboxes for each course', () => {
      const mockCourses = [
        { id: 1, name: 'ES6', credit: 60, isSelected: false },
        { id: 2, name: 'Webpack', credit: 20, isSelected: false },
      ];

      const store = createMockStore(mockCourses);

      const { container } = render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes).toHaveLength(2);
    });

    it('should dispatch selectCourse action when checkbox is checked', async () => {
      const user = userEvent.setup();
      const mockCourses = [
        { id: 1, name: 'ES6', credit: 60, isSelected: false },
      ];

      const store = createMockStore(mockCourses);

      const { container } = render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      const checkbox = container.querySelector('input[type="checkbox"]');
      await user.click(checkbox);

      // Verify the course is selected in state
      const state = store.getState().courses;
      expect(state.courses[0].isSelected).toBe(true);
    });

    it('should dispatch unSelectCourse action when checkbox is unchecked', async () => {
      const user = userEvent.setup();
      const mockCourses = [
        { id: 1, name: 'ES6', credit: 60, isSelected: true },
      ];

      const store = createMockStore(mockCourses);

      const { container } = render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox.checked).toBe(true);

      await user.click(checkbox);

      // Verify the course is unselected in state
      const state = store.getState().courses;
      expect(state.courses[0].isSelected).toBe(false);
    });

    it('should handle multiple course selections', async () => {
      const user = userEvent.setup();
      const mockCourses = [
        { id: 1, name: 'ES6', credit: 60, isSelected: false },
        { id: 2, name: 'Webpack', credit: 20, isSelected: false },
        { id: 3, name: 'React', credit: 40, isSelected: false },
      ];

      const store = createMockStore(mockCourses);

      const { container } = render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');

      // Select first course
      await user.click(checkboxes[0]);
      let state = store.getState().courses;
      expect(state.courses[0].isSelected).toBe(true);

      // Select second course
      await user.click(checkboxes[1]);
      state = store.getState().courses;
      expect(state.courses[0].isSelected).toBe(true);
      expect(state.courses[1].isSelected).toBe(true);

      // Select third course
      await user.click(checkboxes[2]);
      state = store.getState().courses;
      expect(state.courses[0].isSelected).toBe(true);
      expect(state.courses[1].isSelected).toBe(true);
      expect(state.courses[2].isSelected).toBe(true);
    });

    it('should reflect checked state from Redux store', () => {
      const mockCourses = [
        { id: 1, name: 'ES6', credit: 60, isSelected: true },
        { id: 2, name: 'Webpack', credit: 20, isSelected: false },
      ];

      const store = createMockStore(mockCourses);

      const { container } = render(
        <Provider store={store}>
          <CourseList />
        </Provider>
      );

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes[0].checked).toBe(true);
      expect(checkboxes[1].checked).toBe(false);
    });
  });
});
