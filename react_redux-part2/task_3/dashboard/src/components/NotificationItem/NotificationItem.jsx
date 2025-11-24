import { memo } from "react";
import PropTypes from "prop-types";

/**
 * NotificationItem renders a notification entry with styling based on type
 * Simplified to remove html prop for improved safety
 * Uses inline conditional styling for color based on type (urgent = red, default = blue)
 * Wrapped with React.memo for performance optimization
 * 
 * @param {string} type - Notification type ('urgent' or 'default')
 * @param {string} value - Notification text content
 * @param {string} id - Notification unique identifier
 * @param {function} markAsRead - Callback function to mark notification as read
 */
function NotificationItem({ type = "default", value, id, markAsRead }) {
  // Determine text color based on notification type
  // Urgent notifications are red, default notifications are blue
  const textColor = type === "urgent" ? "text-red-600" : "text-blue-600";
  
  // Combined class names for styling
  const className = `${textColor} mb-1 text-sm md:text-[0.95rem] max-[912px]:border-b max-[912px]:border-gray-300 max-[912px]:py-2 max-[912px]:px-3 max-[912px]:w-full cursor-pointer hover:bg-gray-50`;

  return (
    <li
      className={className}
      data-notification-type={type}
      onClick={() => markAsRead && markAsRead(id)}
    >
      {value}
    </li>
  );
}

NotificationItem.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  markAsRead: PropTypes.func,
};

// Wrap component with React.memo for memoization
// This provides the same performance optimization as PureComponent
// Component only re-renders when props change (shallow comparison)
export default memo(NotificationItem);
