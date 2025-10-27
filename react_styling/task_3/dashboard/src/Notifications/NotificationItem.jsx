import { PureComponent } from "react";
import PropTypes from "prop-types";

// NotificationItem renders a notification entry with styling based on props.
class NotificationItem extends PureComponent {
  render() {
    const { type = "default", html, value, id, markAsRead } = this.props;
    // Use CSS variables for notification colors based on type
    // Tailwind arbitrary value syntax allows us to reference CSS variables
    // Add list item styling: mb-1 (margin-bottom: 4px) and text-[0.95rem] (font-size)
    const colorClass = type === "urgent" 
      ? "text-[var(--urgent-notification-item)] mb-1 text-[0.95rem]" 
      : "text-[var(--default-notification-item)] mb-1 text-[0.95rem]";

    if (html) {
      return (
        <li
          className={colorClass}
          data-notification-type={type}
          dangerouslySetInnerHTML={html}
          onClick={() => markAsRead && markAsRead(id)}
        ></li>
      );
    }

    return (
      <li
        className={colorClass}
        data-notification-type={type}
        onClick={() => markAsRead && markAsRead(id)}
      >
        {value}
      </li>
    );
  }
}

NotificationItem.propTypes = {
  type: PropTypes.string,
  html: PropTypes.shape({ __html: PropTypes.string }),
  value: PropTypes.string,
  id: PropTypes.number,
  markAsRead: PropTypes.func,
};

export default NotificationItem;
