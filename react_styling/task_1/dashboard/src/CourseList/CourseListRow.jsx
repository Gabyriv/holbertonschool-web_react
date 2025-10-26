import PropTypes from "prop-types";

// Renders a single table row for the CourseList
function CourseListRow({ isHeader = false, textFirstCell = "", textSecondCell = null }) {
  // Conditional styling: header rows get --color-table-header with 66% opacity, regular rows get --color-table-rows with 45% opacity
  const rowBgColor = isHeader ? "var(--color-table-header)" : "var(--color-table-rows)";
  const rowOpacity = isHeader ? 0.66 : 0.45;
  
  // Border and padding classes for table cells
  const cellClasses = "border border-gray-400";
  const tdClasses = `${cellClasses} pl-2`; // pl-2 = 8px padding left

  if (isHeader) {
    if (textSecondCell == null) {
      return (
        <tr style={{ backgroundColor: rowBgColor, opacity: rowOpacity }}>
          <th colSpan={2} className={cellClasses}>{textFirstCell}</th>
        </tr>
      );
    }
    return (
      <tr style={{ backgroundColor: rowBgColor, opacity: rowOpacity }}>
        <th className={cellClasses}>{textFirstCell}</th>
        <th className={cellClasses}>{textSecondCell}</th>
      </tr>
    );
  }

  return (
    <tr style={{ backgroundColor: rowBgColor, opacity: rowOpacity }}>
      <td className={tdClasses}>{textFirstCell}</td>
      <td className={tdClasses}>{textSecondCell}</td>
    </tr>
  );
}

CourseListRow.propTypes = {
  isHeader: PropTypes.bool,
  textFirstCell: PropTypes.string,
  textSecondCell: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CourseListRow;
