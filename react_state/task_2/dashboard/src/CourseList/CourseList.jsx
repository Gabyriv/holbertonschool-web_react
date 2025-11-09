import PropTypes from "prop-types";
import CourseListRow from "./CourseListRow.jsx";
import WithLogging from "../HOC/WithLogging.jsx";

// Renders the list of courses in a table layout
function CourseList({ courses = [] }) {
  return (
    // Responsive container: 80-90% width on desktop, full width on mobile, centered with appropriate spacing
    <div className="w-full md:w-[85%] mx-auto my-8 overflow-x-auto">
      <table id="CourseList" className="CourseList w-full min-w-full text-sm md:text-base">
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
            <CourseListRow
              isHeader={true}
              textFirstCell="No course available yet"
            />
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
    </div>
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

const CourseListWithLogging = WithLogging(CourseList);

export default CourseListWithLogging;
