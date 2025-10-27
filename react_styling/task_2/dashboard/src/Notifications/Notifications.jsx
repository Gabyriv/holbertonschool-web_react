import { Component } from "react";
import PropTypes from "prop-types";
import closeButton from "../assets/close-button.png";
import NotificationItem from "./NotificationItem.jsx";

class Notifications extends Component {
  // Optimize performance: only update when notifications list length changes
  shouldComponentUpdate(nextProps) {
    // Compare the length of the notifications array
    const currentLength = this.props.notifications?.length || 0;
    const nextLength = nextProps.notifications?.length || 0;
    
    // Only re-render if the length changed
    return currentLength !== nextLength;
  }

  markAsRead = (id) => {
    console.log(`Notification ${id} has been marked as read`);
  };

  render() {
    const { notifications = [], displayDrawer = false } = this.props;
    const hasNotifications = notifications && notifications.length > 0;

    return (
      <div className="notifications-root">
        {/* Title "Your Notifications" positioned at right and on top */}
        <div className="notification-title text-right">Your notifications</div>

        {displayDrawer && (
          <div 
            className="notification-items flex flex-col items-start justify-start p-4 px-6 mb-6 relative bg-white box-border gap-3 border-2 border-dashed"
            style={{ borderColor: 'var(--main-color)' }}
          >
            <button
              className="notification-close-button self-end bg-transparent border-none cursor-pointer p-0"
              type="button"
              aria-label="Close"
              onClick={() => {
                console.log("Close button has been clicked");
              }}
            >
              <img
                className="notification-close-icon w-3 h-3"
                src={closeButton}
                alt="Close"
              />
            </button>

            {hasNotifications ? (
              <>
                <p className="m-0 font-medium text-[#333]">Here is the list of notifications</p>
                <ul className="m-0 pl-5 list-disc">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      {...notification}
                      markAsRead={this.markAsRead}
                    />
                  ))}
                </ul>
              </>
            ) : (
              <p className="m-0 font-medium text-[#333]">No new notification for now</p>
            )}
          </div>
        )}
      </div>
    );
  }
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
