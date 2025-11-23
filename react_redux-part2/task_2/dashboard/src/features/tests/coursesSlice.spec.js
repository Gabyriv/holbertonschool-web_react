import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import coursesReducer, { 
  fetchCourses,
  selectCourse,
  unSelectCourse,
} from '../courses/coursesSlice';
import { logout } from '../auth/authSlice';

/**
 * Test suite for coursesSlice
 * Verifies the courses state management including async operations and logout handling
 */
describe('coursesSlice', () => {
  // Clean up after each test to prevent mock data leakage
  afterEach(() => {
    mockAxios.reset();
  });

  /**
   * Test initial state
   * Ensures the slice returns correct default values
   */
  describe('initial state', () => {
    it('should return the correct initial state by default', () => {
      const initialState = {
        courses: [],
      };

      // Test with undefined state to get initial state
      const state = coursesReducer(undefined, { type: 'unknown' });

      expect(state).toEqual(initialState);
      expect(state.courses).toEqual([]);
      expect(Array.isArray(state.courses)).toBe(true);
    });
  });

  /**
   * Test fetchCourses async thunk
   * Verifies that courses are fetched correctly from the API
   */
  describe('fetchCourses async thunk', () => {
    it('should fetch courses data correctly', async () => {
      // Create a test store with the courses reducer
      const store = configureStore({
        reducer: {
          courses: coursesReducer,
        },
      });

      // Mock courses data from API
      const mockCoursesData = [
        {
          id: 1,
          name: 'ES6',
          credit: 60,
        },
        {
          id: 2,
          name: 'Webpack',
          credit: 20,
        },
        {
          id: 3,
          name: 'React',
          credit: 40,
        },
      ];

      // Dispatch the async thunk
      const promise = store.dispatch(fetchCourses());

      // Mock the axios response
      mockAxios.mockResponse({
        data: mockCoursesData,
      });

      // Wait for the thunk to complete
      await promise;

      // Get the updated state
      const state = store.getState().courses;

      // Verify courses were fetched and updated with isSelected property
      expect(state.courses).toHaveLength(3);
      expect(state.courses[0]).toEqual({
        id: 1,
        name: 'ES6',
        credit: 60,
        isSelected: false,
      });
      expect(state.courses[1]).toEqual({
        id: 2,
        name: 'Webpack',
        credit: 20,
        isSelected: false,
      });
      expect(state.courses[2]).toEqual({
        id: 3,
        name: 'React',
        credit: 40,
        isSelected: false,
      });
    });

    it('should handle empty courses response', async () => {
      const store = configureStore({
        reducer: {
          courses: coursesReducer,
        },
      });

      // Dispatch the async thunk
      const promise = store.dispatch(fetchCourses());

      // Mock empty response
      mockAxios.mockResponse({
        data: [],
      });

      // Wait for the thunk to complete
      await promise;

      // Get the updated state
      const state = store.getState().courses;

      // Should have empty courses array
      expect(state.courses).toHaveLength(0);
      expect(state.courses).toEqual([]);
    });

    it('should update state when courses are fetched multiple times', async () => {
      const store = configureStore({
        reducer: {
          courses: coursesReducer,
        },
      });

      // First fetch
      let promise = store.dispatch(fetchCourses());
      mockAxios.mockResponse({
        data: [
          { id: 1, name: 'Course 1', credit: 10 },
        ],
      });
      await promise;

      let state = store.getState().courses;
      expect(state.courses).toHaveLength(1);

      // Second fetch with different data
      promise = store.dispatch(fetchCourses());
      mockAxios.mockResponse({
        data: [
          { id: 1, name: 'Course 1', credit: 10 },
          { id: 2, name: 'Course 2', credit: 20 },
        ],
      });
      await promise;

      state = store.getState().courses;
      expect(state.courses).toHaveLength(2);
    });
  });

  /**
   * Test selectCourse and unSelectCourse actions
   * Verifies that courses can be selected and unselected
   */
  describe('selectCourse and unSelectCourse actions', () => {
    it('should set isSelected to true when selectCourse action is dispatched', () => {
      const initialState = {
        courses: [
          { id: 1, name: 'ES6', credit: 60, isSelected: false },
          { id: 2, name: 'Webpack', credit: 20, isSelected: false },
        ],
      };

      const state = coursesReducer(initialState, selectCourse(1));

      expect(state.courses[0].isSelected).toBe(true);
      expect(state.courses[1].isSelected).toBe(false);
    });

    it('should set isSelected to false when unSelectCourse action is dispatched', () => {
      const initialState = {
        courses: [
          { id: 1, name: 'ES6', credit: 60, isSelected: true },
          { id: 2, name: 'Webpack', credit: 20, isSelected: false },
        ],
      };

      const state = coursesReducer(initialState, unSelectCourse(1));

      expect(state.courses[0].isSelected).toBe(false);
      expect(state.courses[1].isSelected).toBe(false);
    });

    it('should handle multiple selections', () => {
      const initialState = {
        courses: [
          { id: 1, name: 'ES6', credit: 60, isSelected: false },
          { id: 2, name: 'Webpack', credit: 20, isSelected: false },
          { id: 3, name: 'React', credit: 40, isSelected: false },
        ],
      };

      let state = coursesReducer(initialState, selectCourse(1));
      expect(state.courses[0].isSelected).toBe(true);

      state = coursesReducer(state, selectCourse(2));
      expect(state.courses[0].isSelected).toBe(true);
      expect(state.courses[1].isSelected).toBe(true);

      state = coursesReducer(state, selectCourse(3));
      expect(state.courses[0].isSelected).toBe(true);
      expect(state.courses[1].isSelected).toBe(true);
      expect(state.courses[2].isSelected).toBe(true);
    });

    it('should handle selecting and then unselecting a course', () => {
      const initialState = {
        courses: [
          { id: 1, name: 'ES6', credit: 60, isSelected: false },
        ],
      };

      let state = coursesReducer(initialState, selectCourse(1));
      expect(state.courses[0].isSelected).toBe(true);

      state = coursesReducer(state, unSelectCourse(1));
      expect(state.courses[0].isSelected).toBe(false);
    });

    it('should handle selecting non-existent course gracefully', () => {
      const initialState = {
        courses: [
          { id: 1, name: 'ES6', credit: 60, isSelected: false },
        ],
      };

      const state = coursesReducer(initialState, selectCourse(999));

      // State should remain unchanged
      expect(state.courses[0].isSelected).toBe(false);
    });

    it('should handle unselecting non-existent course gracefully', () => {
      const initialState = {
        courses: [
          { id: 1, name: 'ES6', credit: 60, isSelected: true },
        ],
      };

      const state = coursesReducer(initialState, unSelectCourse(999));

      // State should remain unchanged
      expect(state.courses[0].isSelected).toBe(true);
    });
  });

  /**
   * Test logout action from authSlice
   * Verifies that courses are reset when user logs out
   */
  describe('logout action from authSlice', () => {
    it('should reset the courses array to empty when logout action is dispatched', async () => {
      // Create a test store with the courses reducer
      const store = configureStore({
        reducer: {
          courses: coursesReducer,
        },
      });

      // First, fetch some courses to populate the state
      const mockCoursesData = [
        { id: 1, name: 'ES6', credit: 60 },
        { id: 2, name: 'Webpack', credit: 20 },
        { id: 3, name: 'React', credit: 40 },
      ];

      const fetchPromise = store.dispatch(fetchCourses());
      mockAxios.mockResponse({
        data: mockCoursesData,
      });
      await fetchPromise;

      // Verify courses were populated with isSelected property
      let state = store.getState().courses;
      expect(state.courses).toHaveLength(3);
      expect(state.courses).toEqual([
        { id: 1, name: 'ES6', credit: 60, isSelected: false },
        { id: 2, name: 'Webpack', credit: 20, isSelected: false },
        { id: 3, name: 'React', credit: 40, isSelected: false },
      ]);

      // Dispatch logout action from authSlice
      store.dispatch(logout());

      // Verify courses were reset to empty array
      state = store.getState().courses;
      expect(state.courses).toHaveLength(0);
      expect(state.courses).toEqual([]);
    });

    it('should handle logout when courses array is already empty', () => {
      const store = configureStore({
        reducer: {
          courses: coursesReducer,
        },
      });

      // Initial state - courses should be empty
      let state = store.getState().courses;
      expect(state.courses).toHaveLength(0);

      // Dispatch logout action
      store.dispatch(logout());

      // Courses should still be empty
      state = store.getState().courses;
      expect(state.courses).toHaveLength(0);
      expect(state.courses).toEqual([]);
    });

    it('should reset courses multiple times when logout is called multiple times', async () => {
      const store = configureStore({
        reducer: {
          courses: coursesReducer,
        },
      });

      const mockCoursesData = [
        { id: 1, name: 'ES6', credit: 60 },
      ];

      // Fetch courses
      let promise = store.dispatch(fetchCourses());
      mockAxios.mockResponse({ data: mockCoursesData });
      await promise;
      expect(store.getState().courses.courses).toHaveLength(1);

      // Logout
      store.dispatch(logout());
      expect(store.getState().courses.courses).toHaveLength(0);

      // Fetch courses again
      promise = store.dispatch(fetchCourses());
      mockAxios.mockResponse({ data: mockCoursesData });
      await promise;
      expect(store.getState().courses.courses).toHaveLength(1);

      // Logout again
      store.dispatch(logout());
      expect(store.getState().courses.courses).toHaveLength(0);
    });
  });

  /**
   * Test complete workflow
   * Verifies the full lifecycle of courses management with authentication
   */
  describe('complete workflow', () => {
    it('should handle fetch and logout in sequence', async () => {
      // Create store
      const store = configureStore({
        reducer: {
          courses: coursesReducer,
        },
      });

      // Initial state - empty courses
      let state = store.getState().courses;
      expect(state.courses).toHaveLength(0);

      // Fetch courses
      const fetchPromise = store.dispatch(fetchCourses());
      mockAxios.mockResponse({
        data: [
          { id: 1, name: 'ES6', credit: 60 },
          { id: 2, name: 'Webpack', credit: 20 },
        ],
      });
      await fetchPromise;

      // Verify courses were fetched
      state = store.getState().courses;
      expect(state.courses).toHaveLength(2);

      // Logout
      store.dispatch(logout());

      // Verify courses were reset
      state = store.getState().courses;
      expect(state.courses).toHaveLength(0);
    });

    it('should maintain empty state after logout until new fetch', async () => {
      const store = configureStore({
        reducer: {
          courses: coursesReducer,
        },
      });

      // Fetch courses
      let promise = store.dispatch(fetchCourses());
      mockAxios.mockResponse({
        data: [{ id: 1, name: 'ES6', credit: 60 }],
      });
      await promise;
      expect(store.getState().courses.courses).toHaveLength(1);

      // Logout
      store.dispatch(logout());
      expect(store.getState().courses.courses).toHaveLength(0);

      // Verify state remains empty
      let state = store.getState().courses;
      expect(state.courses).toHaveLength(0);

      // Fetch new courses
      promise = store.dispatch(fetchCourses());
      mockAxios.mockResponse({
        data: [
          { id: 1, name: 'ES6', credit: 60 },
          { id: 2, name: 'Webpack', credit: 20 },
          { id: 3, name: 'React', credit: 40 },
        ],
      });
      await promise;

      // Verify new courses are loaded
      state = store.getState().courses;
      expect(state.courses).toHaveLength(3);
    });
  });
});

