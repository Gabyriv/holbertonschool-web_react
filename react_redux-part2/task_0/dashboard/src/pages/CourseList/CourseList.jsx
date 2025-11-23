import { useSelector } from 'react-redux';
import CourseListRow from "./CourseListRow/CourseListRow.jsx";
import WithLogging from "../../components/HOC/WithLogging.jsx";

/**
 * CourseList component - Renders the list of courses in a table layout
 * Uses Redux to manage courses state
 * Displays courses in a responsive table with course name and credit
 */
function CourseList() {
  // Get courses state from Redux store
  const courses = useSelector((state) => state.courses.courses);
  
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

// Wrap CourseList with WithLogging HOC for lifecycle logging
const CourseListWithLogging = WithLogging(CourseList);

export default CourseListWithLogging;
