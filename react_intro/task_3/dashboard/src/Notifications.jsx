import "./Notifications.css";
import closeButton from "./assets/close-icon.png";
import { getLatestNotification } from "./utils";
function Notifications() {
  return (
    <div className="notification-items">
      <button
        style={{
          alignSelf: "flex-end",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
        type="button"
        aria-label="Close"
        onClick={() => {
          console.log("Close button has been clicked");
        }}
      >
        <img
          src={closeButton}
          alt="Close"
          style={{ width: "12px", height: "12px" }}
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
