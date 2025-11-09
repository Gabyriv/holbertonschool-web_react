import { Component, Fragment } from "react";
import Notifications from "../Notifications/Notifications.jsx";
import Header from "../Header/Header.jsx";
import Login from "../Login/Login.jsx";
import Footer from "../Footer/Footer.jsx";
import CourseList from "../CourseList/CourseList.jsx";
import BodySectionWithMarginBottom from "../BodySectionWithMarginBottom/BodySectionWithMarginBottom.jsx";
import BodySection from "../BodySection/BodySection.jsx";
import { getLatestNotification } from "../utils/utils.js";
import AppContext from "../Context/context.js";

class App extends Component {
  // Constructor: initialize component state
  constructor(props) {
    super(props);
    // Initialize state with displayDrawer, user object, notifications, and courses
    this.state = {
      displayDrawer: false,
      user: {
        email: "",
        password: "",
        isLoggedIn: false,
      },
      notifications: [
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
      ],
      courses: [],
      // courses: [
      //   { id: 1, name: "ES6", credit: 60 },
      //   { id: 2, name: "Webpack", credit: 20 },
      //   { id: 3, name: "React", credit: 40 },
      // ],
    };
  }

  // Handler to show the notifications drawer
  handleDisplayDrawer = () => {
    this.setState({ displayDrawer: true });
  };

  // Handler to hide the notifications drawer
  handleHideDrawer = () => {
    this.setState({ displayDrawer: false });
  };

  // Handler for user login - updates user state with credentials
  logIn = (email, password) => {
    this.setState({
      user: {
        email: email,
        password: password,
        isLoggedIn: true,
      },
    });
  };

  // Handler for user logout - resets user state to default values
  logOut = () => {
    this.setState({
      user: {
        email: "",
        password: "",
        isLoggedIn: false,
      },
    });
  };

  // Handler to mark notification as read - removes it from the list and logs
  markNotificationAsRead = (id) => {
    console.log(`Notification ${id} has been marked as read`);
    // Filter out the notification with the given id
    this.setState((prevState) => ({
      notifications: prevState.notifications.filter(
        (notification) => notification.id !== id
      ),
    }));
  };

  // Lifecycle method: called after component is mounted to the DOM
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  // Lifecycle method: called before component is removed from the DOM
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  }

  // Event handler for keyboard shortcuts (Ctrl+H to logout)
  handleKeydown = (event) => {
    if (event.ctrlKey && event.key === "h") {
      alert("Logging you out");
      this.logOut();
    }
  };

  render() {
    // Use state for user login status, notifications, and courses
    const { user, notifications, courses } = this.state;

    // Create context value object (avoid creating inline to prevent unnecessary re-renders)
    const contextValue = {
      user: user,
      logOut: this.logOut,
    };

    return (
      <AppContext.Provider value={contextValue}>
        <div className="App min-h-screen flex flex-col px-4 md:px-8">
          <Fragment>
            <div className="root-notifications">
              <Notifications
                notifications={notifications}
                displayDrawer={this.state.displayDrawer}
                handleDisplayDrawer={this.handleDisplayDrawer}
                handleHideDrawer={this.handleHideDrawer}
                markNotificationAsRead={this.markNotificationAsRead}
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
                  logIn={this.logIn}
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
}

export default App;
