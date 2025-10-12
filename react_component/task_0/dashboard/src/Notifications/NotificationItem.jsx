import PropTypes from "prop-types";

// NotificationItem renders a notification entry with styling based on props.
function NotificationItem({ type = "default", html, value }) {
  const itemStyle = {
    color: type === "urgent" ? "red" : "blue",
  };

  if (html) {
    return (
      <li
        style={itemStyle}
        data-notification-type={type}
        dangerouslySetInnerHTML={html}
      ></li>
    );
  }

  return (
    <li style={itemStyle} data-notification-type={type}>
      {value}
    </li>
  );
}

NotificationItem.propTypes = {
  type: PropTypes.string,
  html: PropTypes.shape({ __html: PropTypes.string }),
  value: PropTypes.string,
};

export default NotificationItem;
