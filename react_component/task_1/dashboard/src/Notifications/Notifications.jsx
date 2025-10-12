import PropTypes from "prop-types";
import "./Notifications.css";
import closeButton from "../assets/close-button.png";
import NotificationItem from "./NotificationItem.jsx";

function Notifications({ notifications = [], displayDrawer = false }) {
  const hasNotifications = notifications && notifications.length > 0;

  return (
    <div className="notifications-root">
      <div className="notification-title">Your notifications</div>

      {displayDrawer && (
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

          {hasNotifications ? (
            <>
              <p>Here is the list of notifications</p>
              <ul>
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
              </ul>
            </>
          ) : (
            <p>No new notification for now</p>
          )}
        </div>
      )}
    </div>
  );
}

Notifications.propTypes = {
  displayDrawer: PropTypes.bool,
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
