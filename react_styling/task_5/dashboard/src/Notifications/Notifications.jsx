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
    
    // Add bounce animation when there are notifications AND drawer is closed
    const shouldBounce = hasNotifications && !displayDrawer;
    const titleClasses = `notification-title text-right text-sm md:text-base ${shouldBounce ? 'animate-bounce' : ''}`;

    return (
      <div className="notifications-root">
        {/* Title "Your Notifications" positioned at right and on top */}
        <div className={titleClasses}>Your notifications</div>

        {displayDrawer && (
          <div 
            className="notification-items flex flex-col items-start justify-start p-4 px-6 mb-6 relative bg-white box-border gap-3 border-2 border-dashed max-[912px]:fixed max-[912px]:top-0 max-[912px]:left-0 max-[912px]:w-screen max-[912px]:h-screen max-[912px]:z-50 max-[912px]:border-none max-[912px]:p-2"
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
                <p className="m-0 font-medium text-[#333] text-sm md:text-base">Here is the list of notifications</p>
                <ul className="m-0 pl-5 list-disc max-[912px]:list-none max-[912px]:pl-0 w-full">
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
              <p className="m-0 font-medium text-[#333] text-sm md:text-base">No new notification for now</p>
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
