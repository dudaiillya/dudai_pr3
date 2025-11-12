import { Lesson, DayOfWeek, TimeSlot, ScheduleConflict } from '../types/types';
import { professors } from './professors';
import { classrooms } from './classrooms';

// Array to store scheduled lessons
export const schedule: Lesson[] = [];

// Validates a new lesson against existing schedule
export function validateLesson(lesson: Lesson): ScheduleConflict | null {
  for (const existing of schedule) {
    // Check for same day and time slot
    if (existing.dayOfWeek === lesson.dayOfWeek && existing.timeSlot === lesson.timeSlot) {
      // Professor conflict
      if (existing.professorId === lesson.professorId) {
        return { type: 'ProfessorConflict', lessonDetails: existing };
      }
      // Classroom conflict
      if (existing.classroomNumber === lesson.classroomNumber) {
        return { type: 'ClassroomConflict', lessonDetails: existing };
      }
    }
  }
  return null;
}

// Adds a lesson to the schedule if no conflicts exist
export function addLesson(lesson: Lesson): boolean {
  const conflict = validateLesson(lesson);
  if (conflict) {
    return false;
  }
  schedule.push(lesson);
  return true;
}

// Returns all lessons for a given professor
export function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule.filter((lesson) => lesson.professorId === professorId);
}

// Finds available classrooms for a given time slot and day
export function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
  // Classrooms already booked for the given slot
  const occupied: string[] = schedule
    .filter((lesson) => lesson.dayOfWeek === dayOfWeek && lesson.timeSlot === timeSlot)
    .map((lesson) => lesson.classroomNumber);

  // Return classrooms that are not occupied
  return classrooms
    .filter((c) => !occupied.includes(c.number))
    .map((c) => c.number);
}

// Calculates the utilization percentage of a classroom (based on 25 total slots)
export function getClassroomUtilization(classroomNumber: string): number {
  const totalSlots = 25; // 5 days * 5 time slots per day
  const usedSlots = schedule.filter((lesson) => lesson.classroomNumber === classroomNumber).length;
  return (usedSlots / totalSlots) * 100;
}

// Reassigns a classroom for a lesson if the new room is free
export function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  const lesson = schedule.find((l) => l.courseId === lessonId);
  if (!lesson) return false;

  // Ensure the new classroom is free at the same time
  const conflict = schedule.some(
    (existing) =>
      existing !== lesson &&
      existing.dayOfWeek === lesson.dayOfWeek &&
      existing.timeSlot === lesson.timeSlot &&
      existing.classroomNumber === newClassroomNumber
  );

  if (conflict) return false;

  lesson.classroomNumber = newClassroomNumber;
  return true;
}

// Removes a lesson from the schedule by lesson/course ID
export function cancelLesson(lessonId: number): void {
  const index = schedule.findIndex((l) => l.courseId === lessonId);
  if (index !== -1) {
    schedule.splice(index, 1);
  }
}
