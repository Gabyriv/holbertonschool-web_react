import { Fragment } from "react";
import "./App.css";
import Notifications from "../Notifications/Notifications.jsx";
import Header from "../Header/Header.jsx";
import Login from "../Login/Login.jsx";
import Footer from "../Footer/Footer.jsx";

function App() {
  return (
    <div className="App">
      <Fragment>
        <div className="root-notifications">
          <Notifications />
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
