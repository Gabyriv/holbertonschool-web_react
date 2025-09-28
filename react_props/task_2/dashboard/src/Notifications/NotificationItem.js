import PropTypes from "prop-types";

// NotificationItem renders a single notification entry with styling based on type.
function NotificationItem({ type = "default", html, value }) {
  const itemStyle = {
    color: type === "urgent" ? "#ff5151" : "#1d56d8",
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
