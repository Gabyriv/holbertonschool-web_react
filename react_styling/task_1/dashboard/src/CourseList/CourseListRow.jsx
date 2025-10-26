import PropTypes from "prop-types";

// Renders a single table row for the CourseList
function CourseListRow({ isHeader = false, textFirstCell = "", textSecondCell = null }) {
  // Conditional styling: header rows get 66% mix of header color, regular rows get 45% mix of row color
  const rowStyle = isHeader
    ? "bg-[color:color-mix(in_srgb,var(--color-table-header)_66%,transparent)]"
    : "bg-[color:color-mix(in_srgb,var(--color-table-rows)_45%,transparent)]";
  
  // Border and padding classes for table cells
  const cellClasses = "border border-gray-400";
  const tdClasses = `${cellClasses} pl-2`; // pl-2 = 8px padding left

  if (isHeader) {
    if (textSecondCell == null) {
      return (
        <tr className={rowStyle}>
          <th colSpan={2} className={cellClasses}>{textFirstCell}</th>
        </tr>
      );
    }
    return (
      <tr className={rowStyle}>
        <th className={cellClasses}>{textFirstCell}</th>
        <th className={cellClasses}>{textSecondCell}</th>
      </tr>
    );
  }

  return (
    <tr className={rowStyle}>
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
