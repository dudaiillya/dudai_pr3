import { professors, addProfessor } from './modules/professors';
import { classrooms, addClassroom } from './modules/classrooms';
import { courses, addCourse, getMostPopularCourseType } from './modules/courses';
import {
  schedule,
  addLesson,
  validateLesson,
  getProfessorSchedule,
  findAvailableClassrooms,
  getClassroomUtilization,
  reassignClassroom,
  cancelLesson,
} from './modules/schedule';

// Export all modules and helper functions so they can be used elsewhere
export {
  professors,
  addProfessor,
  classrooms,
  addClassroom,
  courses,
  addCourse,
  schedule,
  addLesson,
  validateLesson,
  getProfessorSchedule,
  findAvailableClassrooms,
  getClassroomUtilization,
  reassignClassroom,
  cancelLesson,
  getMostPopularCourseType,
};
