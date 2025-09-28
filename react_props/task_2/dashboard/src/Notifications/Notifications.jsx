import PropTypes from "prop-types";
import "./Notifications.css";
import closeButton from "../assets/close-button.png";
import NotificationItem from "./NotificationItem.js";

function Notifications({ notifications = [] }) {
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
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} {...notification} />
        ))}
      </ul>
    </div>
  );
}

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string,
      value: PropTypes.string,
      html: PropTypes.shape({ __html: PropTypes.string }),
    })
  ),
};

export default Notifications;
