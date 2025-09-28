import { Fragment, useMemo } from "react";
import "./App.css";
import Notifications from "../Notifications/Notifications.jsx";
import Header from "../Header/Header.jsx";
import Login from "../Login/Login.jsx";
import Footer from "../Footer/Footer.jsx";
import { getLatestNotification } from "../utils/utils.js";

function App() {
  const notificationsList = useMemo(() => {
    const baseId = Date.now();
    return [
      {
        id: baseId,
        type: "urgent",
        value: "New course available",
      },
      {
        id: baseId + 1,
        type: "default",
        value: "New resume available",
      },
      {
        id: baseId + 2,
        type: "default",
        html: { __html: getLatestNotification() },
      },
    ];
  }, []);

  return (
    <div className="App">
      <Fragment>
        <div className="root-notifications">
          <Notifications notifications={notificationsList} />
        </div>
        <Header />
        <div className="red-line" />
        <Login />
        <div className="red-line" />
        <Footer />
      </Fragment>
    </div>
  );
}

export default App;
