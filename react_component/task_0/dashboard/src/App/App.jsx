import { Component, Fragment } from "react";
import "./App.css";
import Notifications from "../Notifications/Notifications.jsx";
import Header from "../Header/Header.jsx";
import Login from "../Login/Login.jsx";
import Footer from "../Footer/Footer.jsx";
import CourseList from "../CourseList/CourseList.jsx";
import { getLatestNotification } from "../utils/utils.js";

class App extends Component {
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

    const coursesList = [
      { id: 1, name: "ES6", credit: 60 },
      { id: 2, name: "Webpack", credit: 20 },
      { id: 3, name: "React", credit: 40 },
    ];

    return (
      <div className="App">
        <Fragment>
          <div className="root-notifications">
            <Notifications notifications={notificationsList} displayDrawer={true} />
          </div>
          <Header />
          <div className="red-line" />
          {isLoggedIn ? <CourseList courses={coursesList} /> : <Login />}
          <div className="red-line" />
          <Footer />
        </Fragment>
      </div>
    );
  }
}

export default App;
