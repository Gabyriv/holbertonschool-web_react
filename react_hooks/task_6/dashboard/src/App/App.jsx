import { Fragment, useReducer, useCallback, useEffect } from "react";
import axios from "axios";
import Notifications from "../Notifications/Notifications.jsx";
import Header from "../Header/Header.jsx";
import Login from "../Login/Login.jsx";
import Footer from "../Footer/Footer.jsx";
import CourseList from "../CourseList/CourseList.jsx";
import BodySectionWithMarginBottom from "../BodySectionWithMarginBottom/BodySectionWithMarginBottom.jsx";
import BodySection from "../BodySection/BodySection.jsx";
import { getLatestNotification } from "../utils/utils.js";
import { appReducer, initialState, APP_ACTIONS } from "./appReducer.js";

// App component - Main application component managing global state and layout
// Refactored to use useReducer for centralized state management
// Replaces Context API with props-based approach for better scalability
function App() {
  // Initialize state using useReducer with appReducer and initialState
  // All state updates now go through dispatched actions
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Fetch notifications data when component initially renders
  // Dispatches SET_NOTIFICATIONS action to update state
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch notifications from JSON file
        const response = await axios.get('/notifications.json');
        const notificationsData = response.data;
        
        // Add the latest notification with HTML content
        const latestNotification = {
          id: 3,
          type: "default",
          html: { __html: getLatestNotification() },
        };
        
        // Dispatch action to set notifications state
        dispatch({
          type: APP_ACTIONS.SET_NOTIFICATIONS,
          payload: {
            notifications: [...notificationsData, latestNotification],
          },
        });
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [dispatch]); // Dispatch doesn't change, but including for completeness

  // Fetch courses data whenever user's state changes (authentication changes)
  // Dispatches SET_COURSES action to update state
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Only fetch courses if user is logged in
        if (state.user.isLoggedIn) {
          const response = await axios.get('/courses.json');
          dispatch({
            type: APP_ACTIONS.SET_COURSES,
            payload: {
              courses: response.data,
            },
          });
        } else {
          // Clear courses when user logs out
          dispatch({
            type: APP_ACTIONS.SET_COURSES,
            payload: {
              courses: [],
            },
          });
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [state.user, dispatch]); // Runs when user state changes

  // Handler to toggle the notifications drawer
  // Dispatches TOGGLE_DRAWER action
  const handleDisplayDrawer = useCallback(() => {
    dispatch({ type: APP_ACTIONS.TOGGLE_DRAWER });
  }, [dispatch]);

  // Handler to hide the notifications drawer  
  // Dispatches TOGGLE_DRAWER action (since it toggles, calling twice achieves hide if open)
  const handleHideDrawer = useCallback(() => {
    dispatch({ type: APP_ACTIONS.TOGGLE_DRAWER });
  }, [dispatch]);

  // Handler for user login - dispatches LOGIN action with credentials
  const logIn = useCallback((email, password) => {
    dispatch({
      type: APP_ACTIONS.LOGIN,
      payload: {
        email,
        password,
      },
    });
  }, [dispatch]);

  // Handler for user logout - dispatches LOGOUT action
  const logOut = useCallback(() => {
    dispatch({ type: APP_ACTIONS.LOGOUT });
  }, [dispatch]);

  // Handler to mark notification as read - dispatches MARK_NOTIFICATION_READ action
  const markNotificationAsRead = useCallback((id) => {
    console.log(`Notification ${id} has been marked as read`);
    dispatch({
      type: APP_ACTIONS.MARK_NOTIFICATION_READ,
      payload: {
        id,
      },
    });
  }, [dispatch]);

  return (
    <div className="App min-h-screen flex flex-col px-4 md:px-8">
      <Fragment>
        <div className="root-notifications">
          <Notifications
            notifications={state.notifications}
            displayDrawer={state.displayDrawer}
            handleDisplayDrawer={handleDisplayDrawer}
            handleHideDrawer={handleHideDrawer}
            markNotificationAsRead={markNotificationAsRead}
          />
        </div>
        <Header user={state.user} logOut={logOut} />
        <div className="red-line w-full h-[3px]" style={{ backgroundColor: 'var(--main-color)' }} />
        {state.user.isLoggedIn ? (
          <BodySectionWithMarginBottom title="Course list">
            <CourseList courses={state.courses} />
          </BodySectionWithMarginBottom>
        ) : (
          <BodySectionWithMarginBottom title="Log in to continue">
            <Login 
              logIn={logIn}
              email={state.user.email}
              password={state.user.password}
            />
          </BodySectionWithMarginBottom>
        )}
        <BodySection title="News from the School">
          <p>ipsum Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique, asperiores architecto blanditiis fuga doloribus sit illum aliquid ea distinctio minus accusantium, impedit quo voluptatibus ut magni dicta. Recusandae, quia dicta?</p>
        </BodySection>
        <div className="red-line w-full h-[3px]" style={{ backgroundColor: 'var(--main-color)' }} />
        <Footer user={state.user} />
      </Fragment>
    </div>
  );
}

export default App;
