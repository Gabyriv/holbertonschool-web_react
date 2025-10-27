import PropTypes from "prop-types";

// Renders a single table row for the CourseList
function CourseListRow({ isHeader = false, textFirstCell = "", textSecondCell = null }) {
  // Conditional styling: header rows get #deb5b5 with hex opacity 66, regular rows get #CDCDCD with hex opacity 45
  // Using 8-digit hex color format where last 2 digits represent alpha channel
  const rowBgColor = isHeader ? "#deb5b566" : "#CDCDCD45";
  
  // Border and padding classes for table cells
  // All cells get gray-400 border, td and th elements get 8px left padding
  const cellClasses = "border border-gray-400 pl-2"; // pl-2 = 8px padding left

  if (isHeader) {
    if (textSecondCell == null) {
      return (
        <tr style={{ backgroundColor: rowBgColor }}>
          <th colSpan={2} className={cellClasses}>{textFirstCell}</th>
        </tr>
      );
    }
    return (
      <tr style={{ backgroundColor: rowBgColor }}>
        <th className={cellClasses}>{textFirstCell}</th>
        <th className={cellClasses}>{textSecondCell}</th>
      </tr>
    );
  }

  return (
    <tr style={{ backgroundColor: rowBgColor }}>
      <td className={cellClasses}>{textFirstCell}</td>
      <td className={cellClasses}>{textSecondCell}</td>
    </tr>
  );
}

CourseListRow.propTypes = {
  isHeader: PropTypes.bool,
  textFirstCell: PropTypes.string,
  textSecondCell: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CourseListRow;
