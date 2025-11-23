import { memo } from "react";
import PropTypes from "prop-types";
import closeButton from "../../assets/close-icon.png";
import NotificationItem from "../NotificationItem/NotificationItem.jsx";

// Notifications renders the notification system with drawer functionality.
// Converted to functional component and wrapped with React.memo for performance optimization.
// React.memo provides shallow prop comparison similar to PureComponent.
function Notifications({ 
  notifications = [], 
  displayDrawer = false, 
  handleDisplayDrawer, 
  handleHideDrawer,
  markNotificationAsRead 
}) {
  const hasNotifications = notifications && notifications.length > 0;
  
  // Add bounce animation when there are notifications AND drawer is closed
  const shouldBounce = hasNotifications && !displayDrawer;
  const titleClasses = `notification-title text-right text-sm md:text-base cursor-pointer ${shouldBounce ? 'animate-bounce' : ''}`;

  return (
    <div className="notifications-root">
      {/* Title "Your Notifications" positioned at right and on top - click to show drawer */}
      <div 
        className={titleClasses}
        onClick={handleDisplayDrawer}
      >
        Your notifications
      </div>

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
              // Call handleHideDrawer if it exists (for backward compatibility with existing tests)
              if (handleHideDrawer) {
                handleHideDrawer();
              }
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
                    markAsRead={markNotificationAsRead}
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
  handleDisplayDrawer: PropTypes.func,
  handleHideDrawer: PropTypes.func,
  markNotificationAsRead: PropTypes.func,
};

// Wrap component with React.memo for memoization
// This provides the same performance optimization as PureComponent
// Component only re-renders when props change (shallow comparison)
export default memo(Notifications);
