import React, { useEffect, useState, useMemo } from 'react';

export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const coursesPerPage = 5;

  useEffect(() => {
    fetch('/api/courses.json')
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error fetching courses:', error));
  }, []);

  
  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.courseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const sortedCourses = useMemo(() => {
    const sorted = [...filteredCourses];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'ascending'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        }
      });
    }
    return sorted;
  }, [filteredCourses, sortConfig]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEnroll = (course) => {
    console.log(`Enrolled in ${course.courseName}`);
  };

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th
              onClick={() => handleSort('trimester')}
              aria-sort={sortConfig.key === 'trimester' ? sortConfig.direction : 'none'}
            >
              Trimester
            </th>
            <th
              onClick={() => handleSort('courseNumber')}
              aria-sort={sortConfig.key === 'courseNumber' ? sortConfig.direction : 'none'}
            >
              Course Number
            </th>
            <th
              onClick={() => handleSort('courseName')}
              aria-sort={sortConfig.key === 'courseName' ? sortConfig.direction : 'none'}
            >
              Course Name
            </th>
            <th
              onClick={() => handleSort('semesterCredits')}
              aria-sort={sortConfig.key === 'semesterCredits' ? sortConfig.direction : 'none'}
            >
              Semester Credits
            </th>
            <th
              onClick={() => handleSort('totalClockHours')}
              aria-sort={sortConfig.key === 'totalClockHours' ? sortConfig.direction : 'none'}
            >
              Total Clock Hours
            </th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.length > 0 ? (
            currentCourses.map((course, index) => (
              <tr key={index}>
                <td>{course.trimester}</td>
                <td>{course.courseNumber}</td>
                <td>{course.courseName}</td>
                <td>{course.semesterCredits}</td>
                <td>{course.totalClockHours}</td>
                <td>
                  <button onClick={() => handleEnroll(course)}>Enroll</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No courses found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
