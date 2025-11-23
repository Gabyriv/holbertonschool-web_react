/**
 * Action types object for App state management
 * Contains all possible actions that can be dispatched to the reducer
 */
export const APP_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  TOGGLE_DRAWER: 'TOGGLE_DRAWER',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  SET_COURSES: 'SET_COURSES',
};

/**
 * Initial state for the App component
 * Defines the default structure and values for application state
 */
export const initialState = {
  displayDrawer: true,
  user: {
    email: '',
    password: '',
    isLoggedIn: false,
  },
  notifications: [],
  courses: [],
};

/**
 * Reducer function for managing App state
 * Handles state updates based on dispatched actions
 * 
 * @param {Object} state - Current state (defaults to initialState)
 * @param {Object} action - Action object with type and optional payload
 * @returns {Object} New state after applying the action
 */
export function appReducer(state = initialState, action) {
  switch (action.type) {
    case APP_ACTIONS.LOGIN:
      // Handle user login - update user object with credentials and set isLoggedIn to true
      return {
        ...state,
        user: {
          email: action.payload.email,
          password: action.payload.password,
          isLoggedIn: true,
        },
      };

    case APP_ACTIONS.LOGOUT:
      // Handle user logout - reset user object to default values
      return {
        ...state,
        user: {
          email: '',
          password: '',
          isLoggedIn: false,
        },
      };

    case APP_ACTIONS.TOGGLE_DRAWER:
      // Toggle notification drawer visibility
      return {
        ...state,
        displayDrawer: !state.displayDrawer,
      };

    case APP_ACTIONS.MARK_NOTIFICATION_READ:
      // Mark notification as read by filtering it out of the notifications array
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload.id
        ),
      };

    case APP_ACTIONS.SET_NOTIFICATIONS:
      // Update notifications list with new data
      return {
        ...state,
        notifications: action.payload.notifications,
      };

    case APP_ACTIONS.SET_COURSES:
      // Update courses list with new data
      return {
        ...state,
        courses: action.payload.courses,
      };

    default:
      // Return current state for unrecognized actions
      return state;
  }
}

