/**
 * Система управління розкладом занять в університеті.
 *
 * У цьому модулі використовуються type alias та union types для опису
 * днів тижня, часових слотів, типів курсів та структур даних, які
 * представляють професорів, аудиторії, курси та заняття. Реалізовано
 * функції для додавання даних, пошуку вільних аудиторій, отримання
 * розкладу професора, перевірки конфліктів, аналізу використання
 * аудиторій і модифікації розкладу.
 */

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type TimeSlot =
  | '8:30-10:00'
  | '10:15-11:45'
  | '12:15-13:45'
  | '14:00-15:30'
  | '15:45-17:15';

export type CourseType = 'Lecture' | 'Seminar' | 'Lab' | 'Practice';

export type Professor = {
  id: number;
  name: string;
  department: string;
};

export type Classroom = {
  number: string;
  capacity: number;
  hasProjector: boolean;
};

export type Course = {
  id: number;
  name: string;
  type: CourseType;
};

export type Lesson = {
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};

export const professors: Professor[] = [];
export const classrooms: Classroom[] = [];
export const courses: Course[] = [];
export const schedule: Lesson[] = [];

export function addProfessor(professor: Professor): void {
  professors.push(professor);
}

export type ScheduleConflict = {
  type: 'ProfessorConflict' | 'ClassroomConflict';
  lessonDetails: Lesson;
};

export function validateLesson(lesson: Lesson): ScheduleConflict | null {
  for (const existing of schedule) {
    if (
      existing.professorId === lesson.professorId &&
      existing.dayOfWeek === lesson.dayOfWeek &&
      existing.timeSlot === lesson.timeSlot
    ) {
      return { type: 'ProfessorConflict', lessonDetails: existing };
    }
    if (
      existing.classroomNumber === lesson.classroomNumber &&
      existing.dayOfWeek === lesson.dayOfWeek &&
      existing.timeSlot === lesson.timeSlot
    ) {
      return { type: 'ClassroomConflict', lessonDetails: existing };
    }
  }
  return null;
}

export function addLesson(lesson: Lesson): boolean {
  const conflict = validateLesson(lesson);
  if (conflict) {
    return false;
  }
  schedule.push(lesson);
  return true;
}

export function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
  return classrooms
    .filter(
      room =>
        !schedule.some(
          l =>
            l.classroomNumber === room.number &&
            l.dayOfWeek === dayOfWeek &&
            l.timeSlot === timeSlot
        )
    )
    .map(room => room.number);
}

export function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule.filter(l => l.professorId === professorId);
}

export function getClassroomUtilization(classroomNumber: string): number {
  const totalPossible = 5 * 5;
  const used = schedule.filter(l => l.classroomNumber === classroomNumber).length;
  return (used / totalPossible) * 100;
}

export function getMostPopularCourseType(): CourseType {
  const counts: { [key in CourseType]: number } = {
    Lecture: 0,
    Seminar: 0,
    Lab: 0,
    Practice: 0,
  };
  for (const lesson of schedule) {
    const course = courses.find(c => c.id === lesson.courseId);
    if (course) {
      counts[course.type]++;
    }
  }
  let popular: CourseType = 'Lecture';
  let max = -1;
  for (const type in counts) {
    const value = counts[type as CourseType];
    if (value > max) {
      max = value;
      popular = type as CourseType;
    }
  }
  return popular;
}

export function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  if (lessonId < 0 || lessonId >= schedule.length) {
    return false;
  }
  const originalLesson = schedule[lessonId];
  const proposed: Lesson = { ...originalLesson, classroomNumber: newClassroomNumber };
  const conflict = validateLesson(proposed);
  if (conflict) {
    return false;
  }
  schedule[lessonId] = proposed;
  return true;
}

export function cancelLesson(lessonId: number): void {
  if (lessonId >= 0 && lessonId < schedule.length) {
    schedule.splice(lessonId, 1);
  }
}

export function addClassroom(classroom: Classroom): void {
  classrooms.push(classroom);
}

export function addCourse(course: Course): void {
  courses.push(course);
}
