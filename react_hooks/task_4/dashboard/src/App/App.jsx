import { Fragment, useState, useCallback, useMemo } from "react";
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
  
  // notifications holds the list of current notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "urgent",
      value: "New course available",
    },
    {
      id: 2,
      type: "default",
      value: "New resume available",
    },
    {
      id: 3,
      type: "default",
      html: { __html: getLatestNotification() },
    },
  ]);

  // courses state for future use
  const courses = [];

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
