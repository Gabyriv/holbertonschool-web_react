import "./Notifications.css";
import closeButton from "../assets/close-button.png";
import { getLatestNotification } from "../utils/utils.js";

function Notifications() {
  return (
    <div className="notification-items">
      <button
        className="notification-close-button"
        type="button"
        aria-label="Close"
        onClick={() => {
          console.log("Close button has been clicked");
        }}
      >
        <img
          className="notification-close-icon"
          src={closeButton}
          alt="Close"
        />
      </button>
      <p>Here is the list of notifications</p>
      <ul>
        <li data-priority="default">New course available</li>
        <li data-priority="urgent">New resume available</li>
        <li dangerouslySetInnerHTML={{ __html: getLatestNotification() }}></li>
      </ul>
    </div>
  );
}

export default Notifications;
