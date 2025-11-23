import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout } from '../auth/authSlice';

/**
 * API Configuration
 * Centralized API base URL and endpoints for courses
 */
const API_BASE_URL = 'http://localhost:5173';

const ENDPOINTS = {
  courses: `${API_BASE_URL}/courses.json`,
};

/**
 * Initial state for courses
 * Contains courses array
 */
const initialState = {
  courses: [],
};

/**
 * Async thunk to fetch courses from the API
 * Fetches courses data and returns the courses array
 * @returns {Array} Courses array from API
 */
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    // Fetch courses from the API endpoint
    const response = await axios.get(ENDPOINTS.courses);
    
    // Return the courses data
    return response.data;
  }
);

/**
 * Courses slice for managing courses state
 * Handles fetching courses, resetting on logout, and managing course selection
 */
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    /**
     * Select a course by setting isSelected to true
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload containing course id
     */
    selectCourse: (state, action) => {
      const courseId = action.payload;
      const course = state.courses.find((c) => c.id === courseId);
      if (course) {
        course.isSelected = true;
      }
    },
    
    /**
     * Unselect a course by setting isSelected to false
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload containing course id
     */
    unSelectCourse: (state, action) => {
      const courseId = action.payload;
      const course = state.courses.find((c) => c.id === courseId);
      if (course) {
        course.isSelected = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /**
       * Handle fulfilled state of fetchCourses thunk
       * Updates courses array with fetched data and adds isSelected property
       */
      .addCase(fetchCourses.fulfilled, (state, action) => {
        // Add isSelected: false to each course
        state.courses = action.payload.map((course) => ({
          ...course,
          isSelected: false,
        }));
      })
      /**
       * Listen for logout action from authSlice
       * Reset courses to initial state when user logs out
       */
      .addCase(logout, (state) => {
        state.courses = [];
      });
  },
});

// Export actions for use in components
export const { selectCourse, unSelectCourse } = coursesSlice.actions;

// Export reducer as default for store configuration
export default coursesSlice.reducer;

