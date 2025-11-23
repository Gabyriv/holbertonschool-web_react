import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications } from './features/notifications/notificationsSlice';
import { fetchCourses } from './features/courses/coursesSlice';
import Notifications from "./components/Notifications/Notifications.jsx";
import Header from "./components/Header/Header.jsx";
import Login from "./pages/Login/Login.jsx";
import Footer from "./components/Footer/Footer.jsx";
import CourseList from "./pages/CourseList/CourseList.jsx";
import BodySectionWithMarginBottom from "./components/BodySectionWithMarginBottom/BodySectionWithMarginBottom.jsx";
import BodySection from "./components/BodySection/BodySection.jsx";

/**
 * App component - Main application component
 * Uses Redux for global state management
 * Dispatches side effects for fetching notifications and courses
 */
function App() {
  // Get authentication state from Redux store
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
  // Get dispatch function from Redux
  const dispatch = useDispatch();

  // Fetch notifications when component mounts
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Fetch courses only when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCourses());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <div className="App min-h-screen flex flex-col px-4 md:px-8">
      <Fragment>
        <div className="root-notifications">
          <Notifications />
        </div>
        <Header />
        <div className="red-line w-full h-[3px]" style={{ backgroundColor: 'var(--main-color)' }} />
        {isLoggedIn ? (
          <BodySectionWithMarginBottom title="Course list">
            <CourseList />
          </BodySectionWithMarginBottom>
        ) : (
          <BodySectionWithMarginBottom title="Log in to continue">
            <Login />
          </BodySectionWithMarginBottom>
        )}
        <BodySection title="News from the School">
          <p>ipsum Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique, asperiores architecto blanditiis fuga doloribus sit illum aliquid ea distinctio minus accusantium, impedit quo voluptatibus ut magni dicta. Recusandae, quia dicta?</p>
        </BodySection>
        <div className="red-line w-full h-[3px]" style={{ backgroundColor: 'var(--main-color)' }} />
        <Footer />
      </Fragment>
    </div>
  );
}

export default App;
