import PropTypes from "prop-types";
import "./CourseList.css";
import CourseListRow from "./CourseListRow.jsx";

// Renders the list of courses in a table layout
function CourseList({ courses = [] }) {
  return (
    <table id="CourseList" className="CourseList">
      <thead>
        <CourseListRow isHeader={true} textFirstCell="Available courses" />
        <CourseListRow
          isHeader={true}
          textFirstCell="Course name"
          textSecondCell="Credit"
        />
      </thead>
      <tbody>
        {courses.length === 0 ? (
          <tr>
            <td colSpan={2}>No course available yet</td>
          </tr>
        ) : (
          courses.map((c) => (
            <CourseListRow
              key={c.id}
              isHeader={false}
              textFirstCell={c.name}
              textSecondCell={c.credit}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

CourseList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      credit: PropTypes.number.isRequired,
    })
  ),
};

export default CourseList;
