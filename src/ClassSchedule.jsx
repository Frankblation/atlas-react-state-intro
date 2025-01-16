import React from 'react';
import { useCourseContext } from './CourseContext';

export default function ClassSchedule() {
  const { enrolledCourses, dropCourse } = useCourseContext();

  return (
    <div className="class-schedule">
      <h2>Class Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Course Number</th>
            <th>Course Name</th>
            <th>Semester Credits</th>
            <th>Drop</th>
          </tr>
        </thead>
        <tbody>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course, index) => (
              <tr key={index}>
                <td>{course.courseNumber}</td>
                <td>{course.courseName}</td>
                <td>{course.semesterCredits}</td>
                <td>
                  <button onClick={() => dropCourse(course.courseNumber)}>Drop</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No enrolled courses</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
