import { PureComponent } from "react";
import PropTypes from "prop-types";

// NotificationItem renders a notification entry with styling based on props.
class NotificationItem extends PureComponent {
  render() {
    const { type = "default", html, value, id, markAsRead } = this.props;
    const itemStyle = {
      color: type === "urgent" ? "red" : "blue",
    };

    if (html) {
      return (
        <li
          style={itemStyle}
          data-notification-type={type}
          dangerouslySetInnerHTML={html}
          onClick={() => markAsRead && markAsRead(id)}
        ></li>
      );
    }

    return (
      <li
        style={itemStyle}
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
