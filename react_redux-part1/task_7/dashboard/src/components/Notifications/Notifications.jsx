import { memo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { markNotificationAsRead, showDrawer, hideDrawer } from '../../features/notifications/notificationsSlice';
import closeButton from "../../assets/close-icon.png";
import NotificationItem from "../NotificationItem/NotificationItem.jsx";

/**
 * Notifications component - Renders the notification system with drawer functionality
 * Uses Redux to manage notifications state and drawer visibility
 * Wrapped with React.memo for performance optimization
 */
function Notifications() {
  // Get notifications and displayDrawer state from Redux store
  const notifications = useSelector((state) => state.notifications.notifications);
  const displayDrawer = useSelector((state) => state.notifications.displayDrawer);
  
  // Get dispatch function to dispatch actions
  const dispatch = useDispatch();
  
  /**
   * Handle displaying the notifications drawer
   * Dispatches showDrawer action to Redux store
   */
  const handleDisplayDrawer = () => {
    dispatch(showDrawer());
  };
  
  /**
   * Handle hiding the notifications drawer
   * Dispatches hideDrawer action to Redux store
   */
  const handleHideDrawer = () => {
    console.log("Close button has been clicked");
    dispatch(hideDrawer());
  };
  
  /**
   * Handle marking a notification as read
   * Dispatches markNotificationAsRead action with notification id
   * @param {number} id - The notification id to mark as read
   */
  const handleMarkNotificationAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };
  
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
            onClick={handleHideDrawer}
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
                    markAsRead={handleMarkNotificationAsRead}
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

// Wrap component with React.memo for memoization
// This provides the same performance optimization as PureComponent
// Component only re-renders when props change (shallow comparison)
export default memo(Notifications);
