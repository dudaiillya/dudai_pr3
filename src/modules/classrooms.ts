import { Classroom } from '../types/types';

// Array to store classrooms
export const classrooms: Classroom[] = [];

// Adds a new classroom to the list
export function addClassroom(classroom: Classroom): void {
  classrooms.push(classroom);
}
