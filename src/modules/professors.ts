import { Professor } from '../types/types';

// Array to store professors
export const professors: Professor[] = [];

// Adds a new professor to the list
export function addProfessor(professor: Professor): void {
  professors.push(professor);
}
