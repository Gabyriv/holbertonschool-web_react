import { Fragment, useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import Notifications from "../Notifications/Notifications.jsx";
import Header from "../Header/Header.jsx";
import Login from "../Login/Login.jsx";
import Footer from "../Footer/Footer.jsx";
import CourseList from "../CourseList/CourseList.jsx";
import BodySectionWithMarginBottom from "../BodySectionWithMarginBottom/BodySectionWithMarginBottom.jsx";
import BodySection from "../BodySection/BodySection.jsx";
import { getLatestNotification } from "../utils/utils.js";
import AppContext from "../Context/context.js";

// App component - Main application component managing global state and layout
// Converted to functional component using React hooks for state management
// Now uses dynamic data fetching with axios and useEffect
function App() {
  // Initialize state using React hooks
  // displayDrawer controls whether the notifications drawer is visible
  const [displayDrawer, setDisplayDrawer] = useState(true);
  
  // user holds the current user's authentication state and credentials
  const [user, setUser] = useState({
    email: "",
    password: "",
    isLoggedIn: false,
  });
  
  // notifications holds the list of current notifications (fetched dynamically)
  const [notifications, setNotifications] = useState([]);

  // courses holds the list of available courses (fetched dynamically)
  const [courses, setCourses] = useState([]);

  // Fetch notifications data when component initially renders
  // Uses useEffect with empty dependency array to run only once on mount
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
        
        // Set notifications state with fetched data plus latest notification
        setNotifications([...notificationsData, latestNotification]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []); // Empty dependency array - runs only on mount

  // Fetch courses data whenever user's state changes (authentication changes)
  // This responds to user login/logout events
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Only fetch courses if user is logged in
        if (user.isLoggedIn) {
          const response = await axios.get('/courses.json');
          setCourses(response.data);
        } else {
          // Clear courses when user logs out
          setCourses([]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [user]); // Dependency on user state - runs when user state changes

  // Handler to show the notifications drawer
  // Memoized with useCallback to maintain reference stability
  const handleDisplayDrawer = useCallback(() => {
    setDisplayDrawer(true);
  }, []);

  // Handler to hide the notifications drawer
  // Memoized with useCallback to maintain reference stability
  const handleHideDrawer = useCallback(() => {
    setDisplayDrawer(false);
  }, []);

  // Handler for user login - updates user state with credentials
  // Memoized with useCallback to maintain reference stability
  const logIn = useCallback((email, password) => {
    setUser({
      email: email,
      password: password,
      isLoggedIn: true,
    });
  }, []);

  // Handler for user logout - resets user state to default values
  // Memoized with useCallback to maintain reference stability
  const logOut = useCallback(() => {
    setUser({
      email: "",
      password: "",
      isLoggedIn: false,
    });
  }, []);

  // Handler to mark notification as read - removes it from the list and logs
  // Memoized with useCallback to maintain reference stability
  // Follows React's immutability principles by creating a new filtered array
  const markNotificationAsRead = useCallback((id) => {
    console.log(`Notification ${id} has been marked as read`);
    // Filter out the notification with the given id (immutable update)
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  }, []);

  // Create context value object using useMemo to prevent unnecessary re-renders
  // Only recreates when user or logOut changes
  const contextValue = useMemo(() => ({
    user: user,
    logOut: logOut,
  }), [user, logOut]);

  return (
    <AppContext.Provider value={contextValue}>
      <div className="App min-h-screen flex flex-col px-4 md:px-8">
        <Fragment>
          <div className="root-notifications">
            <Notifications
              notifications={notifications}
              displayDrawer={displayDrawer}
              handleDisplayDrawer={handleDisplayDrawer}
              handleHideDrawer={handleHideDrawer}
              markNotificationAsRead={markNotificationAsRead}
            />
          </div>
          <Header />
          <div className="red-line w-full h-[3px]" style={{ backgroundColor: 'var(--main-color)' }} />
          {user.isLoggedIn ? (
            <BodySectionWithMarginBottom title="Course list">
              <CourseList courses={courses} />
            </BodySectionWithMarginBottom>
          ) : (
            <BodySectionWithMarginBottom title="Log in to continue">
              <Login 
                logIn={logIn}
                email={user.email}
                password={user.password}
              />
            </BodySectionWithMarginBottom>
          )}
          <BodySection title="News from the School">
            <p>ipsum Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique, asperiores architecto blanditiis fuga doloribus sit illum aliquid ea distinctio minus accusantium, impedit quo voluptatibus ut magni dicta. Recusandae, quia dicta?</p>
          </BodySection>
          <div className="red-line w-full h-[3px]" style={{ backgroundColor: 'var(--main-color)' }} />
          <Footer />
        </Fragment>
      </div>
    </AppContext.Provider>
  );
}

export default App;
