import { Course, CourseType } from '../types/types';
import { schedule } from './schedule';

// Array to store courses
export const courses: Course[] = [];

// Adds a new course to the list
export function addCourse(course: Course): void {
  courses.push(course);
}

// Determines the most popular course type based on the current schedule
export function getMostPopularCourseType(): CourseType {
  // Initialize counters for each course type
  const counts: Record<CourseType, number> = {
    Lecture: 0,
    Seminar: 0,
    Lab: 0,
    Practice: 0,
  };

  // Count occurrences of each course type in the schedule
  for (const lesson of schedule) {
    const course = courses.find((c) => c.id === lesson.courseId);
    if (course) {
      counts[course.type]++;
    }
  }

  // Determine the type with the highest count
  let maxType: CourseType = 'Lecture';
  let maxCount = 0;

  (Object.keys(counts) as CourseType[]).forEach((type) => {
    if (counts[type] > maxCount) {
      maxCount = counts[type];
      maxType = type;
    }
  });

  return maxType;
}
