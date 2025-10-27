import { Component, Fragment } from "react";
import "./App.css";
import Notifications from "../Notifications/Notifications.jsx";
import Header from "../Header/Header.jsx";
import Login from "../Login/Login.jsx";
import Footer from "../Footer/Footer.jsx";
import CourseList from "../CourseList/CourseList.jsx";
import BodySectionWithMarginBottom from "../BodySectionWithMarginBottom/BodySectionWithMarginBottom.jsx";
import BodySection from "../BodySection/BodySection.jsx";
import { getLatestNotification } from "../utils/utils.js";

class App extends Component {
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
    const { logOut = () => {} } = this.props;
    if (event.ctrlKey && event.key === "h") {
      alert("Logging you out");
      logOut();
    }
  };

  render() {
    const { isLoggedIn = false } = this.props;
    const notificationsList = [
      {
        id: Date.now(),
        type: "urgent",
        value: "New course available",
      },
      {
        id: Date.now() + 1,
        type: "default",
        value: "New resume available",
      },
      {
        id: Date.now() + 2,
        type: "default",
        html: { __html: getLatestNotification() },
      },
    ];

    // const coursesList = [];
    const coursesList = [
      { id: 1, name: "ES6", credit: 60 },
      { id: 2, name: "Webpack", credit: 20 },
      { id: 3, name: "React", credit: 40 },
    ];

    return (
      <div className="App">
        <Fragment>
          <div className="root-notifications">
            <Notifications
              notifications={notificationsList}
              displayDrawer={true}
            />
          </div>
          <Header />
          <div className="red-line" />
          {isLoggedIn ? (
            <BodySectionWithMarginBottom title="Course list">
              <CourseList courses={coursesList} />
            </BodySectionWithMarginBottom>
          ) : (
            <BodySectionWithMarginBottom title="Log in to continue">
              <Login />
            </BodySectionWithMarginBottom>
          )}
          <BodySection title="News from the School">
            <p>Holberton School News goes here</p>
          </BodySection>
          <div className="red-line" />
          <Footer />
        </Fragment>
      </div>
    );
  }
}

export default App;
