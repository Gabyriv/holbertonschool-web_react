import { memo, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { markNotificationAsRead } from '../../features/notifications/notificationsSlice';
import closeButton from "../../assets/close-icon.png";
import NotificationItem from "../NotificationItem/NotificationItem.jsx";

/**
 * Notifications component - Renders the notification system with drawer functionality
 * Uses Redux to manage notifications data and loading state
 * Visibility control moved to local DOM manipulation to prevent unnecessary re-renders
 * Displays loading indicator during data fetching for better user experience
 * Wrapped with React.memo for performance optimization
 */
function Notifications() {
  // Get notifications and loading state from Redux store
  const notifications = useSelector((state) => state.notifications.notifications);
  const loading = useSelector((state) => state.notifications.loading);
  
  // Get dispatch function to dispatch actions
  const dispatch = useDispatch();
  
  // Create reference to drawer DOM element for visibility control
  const DrawerRef = useRef(null);
  
  /**
   * Handle toggling the notifications drawer visibility
   * Uses DOM manipulation instead of Redux state to prevent re-renders
   * Toggles opacity and visibility styles directly on the element
   */
  const handleToggleDrawer = () => {
    if (DrawerRef.current) {
      const currentOpacity = DrawerRef.current.style.opacity;
      
      // Toggle visibility
      if (currentOpacity === '0' || currentOpacity === '') {
        // Show drawer
        DrawerRef.current.style.opacity = '1';
        DrawerRef.current.style.visibility = 'visible';
      } else {
        // Hide drawer
        console.log("Close button has been clicked");
        DrawerRef.current.style.opacity = '0';
        DrawerRef.current.style.visibility = 'hidden';
      }
    }
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
  
  // Note: Bounce animation removed since we can't reliably track drawer state without re-renders
  // Alternative: Could use a local state variable if animation is needed
  const titleClasses = `notification-title text-right text-sm md:text-base cursor-pointer`;

  return (
    <div className="notifications-root">
      {/* Title "Your Notifications" positioned at right and on top - click to toggle drawer */}
      <div 
        className={titleClasses}
        onClick={handleToggleDrawer}
      >
        Your notifications
      </div>

      {/* Drawer is always in DOM, visibility controlled via inline styles */}
      <div 
        ref={DrawerRef}
        className="notification-items flex flex-col items-start justify-start p-4 px-6 mb-6 relative bg-white box-border gap-3 border-2 border-dashed max-[912px]:fixed max-[912px]:top-0 max-[912px]:left-0 max-[912px]:w-screen max-[912px]:h-screen max-[912px]:z-50 max-[912px]:border-none max-[912px]:p-2"
        style={{ 
          borderColor: 'var(--main-color)',
          opacity: 0,
          visibility: 'hidden',
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <button
          className="notification-close-button self-end bg-transparent border-none cursor-pointer p-0"
          type="button"
          aria-label="Close"
          onClick={handleToggleDrawer}
        >
          <img
            className="notification-close-icon w-3 h-3"
            src={closeButton}
            alt="Close"
          />
        </button>

        {/* Show loading indicator while fetching notifications */}
        {loading ? (
          <p className="m-0 font-medium text-[#333] text-sm md:text-base">Loading...</p>
        ) : hasNotifications ? (
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
    </div>
  );
}

// Wrap component with React.memo for memoization
// This provides the same performance optimization as PureComponent
// Component only re-renders when props change (shallow comparison)
export default memo(Notifications);
