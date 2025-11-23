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
 * Handles fetching courses and resetting on logout
 */
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /**
       * Handle fulfilled state of fetchCourses thunk
       * Updates courses array with fetched data
       */
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
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

// Export reducer as default for store configuration
export default coursesSlice.reducer;

