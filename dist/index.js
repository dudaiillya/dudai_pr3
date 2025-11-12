"use strict";
/**
 * Система управління розкладом заньать в університеті.
 *
 * У цьому модулі використовуються type alias та union types для опису
 * днів тижня, часових слотів, типів курсів та структур даних, які
 * представляють професорів, аудиторії, курси та заняття. Реалізовано
 * функції для додавання даних, пошуку вільних аудиторій, отримання
 * розкладу професора, перевірки конфліктів, аналізу використання
 * аудиторій і модифікації розкладу.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedule = exports.courses = exports.classrooms = exports.professors = void 0;
exports.addProfessor = addProfessor;
exports.validateLesson = validateLesson;
exports.addLesson = addLesson;
exports.findAvailableClassrooms = findAvailableClassrooms;
exports.getProfessorSchedule = getProfessorSchedule;
exports.getClassroomUtilization = getClassroomUtilization;
exports.getMostPopularCourseType = getMostPopularCourseType;
exports.reassignClassroom = reassignClassroom;
exports.cancelLesson = cancelLesson;
exports.addClassroom = addClassroom;
exports.addCourse = addCourse;
// Масиви даних
exports.professors = [];
exports.classrooms = [];
exports.courses = [];
exports.schedule = [];
/**
 * Додає нового професора у список.
 * @param professor об'єкт професора, який потрібно додати
 */
function addProfessor(professor) {
    exports.professors.push(professor);
}
function validateLesson(lesson) {
    for (const existing of exports.schedule) {
        // Конфлікт за професором
        if (existing.professorId === lesson.professorId &&
            existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot) {
            return { type: "ProfessorConflict", lessonDetails: existing };
        }
        // Конфлікт за аудиторією
        if (existing.classroomNumber === lesson.classroomNumber &&
            existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot) {
            return { type: "ClassroomConflict", lessonDetails: existing };
        }
    }
    return null;
}
/**
 * Додає заняття до розкладу, якщо немає конфліктів.
 * @param lesson заняття, яке додається
 * @returns true, якщо додавання успішне, false — у разі конфлікту
 */
function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict) {
        return false;
    }
    exports.schedule.push(lesson);
    return true;
}
/**
 * Повертає номери вільних аудиторій на конкретний час та день.
 * @param timeSlot часовий слот
 * @param dayOfWeek день тижня
 * @returns масив номерів вільних аудиторій
 */
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    return exports.classrooms
        .filter((room) => !exports.schedule.some((l) => l.classroomNumber === room.number &&
        l.dayOfWeek === dayOfWeek &&
        l.timeSlot === timeSlot))
        .map((room) => room.number);
}
/**
 * Повертає розклад конкретного професора.
 * @param professorId ідентифікатор професора
 */
function getProfessorSchedule(professorId) {
    return exports.schedule.filter((l) => l.professorId === professorId);
}
/**
 * Обчислює відсоток використання аудиторії.
 * Відсоток визначається як кількість заньать у розкладі в цій аудиторії
 * відносно максимально можливої кількості (5 днів * 5 слотів = 25).
 * @param classroomNumber номер аудиторії
 * @returns відсоток використання від 0 до 100
 */
function getClassroomUtilization(classroomNumber) {
    const totalPossible = 5 * 5; // 5 днів * 5 слотів
    const used = exports.schedule.filter((l) => l.classroomNumber === classroomNumber).length;
    return (used / totalPossible) * 100;
}
/**
 * Визначає найпопулярніший тип заньать (CourseType) на основі розкладу.
 * Якщо декілька типів мають однакову кількість, повертається перший серед них.
 */
function getMostPopularCourseType() {
    const counts = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0,
    };
    for (const lesson of exports.schedule) {
        const course = exports.courses.find((c) => c.id === lesson.courseId);
        if (course) {
            counts[course.type]++;
        }
    }
    let popular = "Lecture";
    let max = -1;
    for (const type of Object.keys(counts)) {
        if (counts[type] > max) {
            max = counts[type];
            popular = type;
        }
    }
    return popular;
}
/**
 * Переназначає заняття в іншу аудиторію, якщо це не викликає конфліктів.
 * Функція вважає, що lessonId відповідає індексу заняття у масиві schedule.
 * @param lessonId індекс заняття у schedule
 * @param newClassroomNumber номер нової аудиторії
 * @returns true, якщо переназначення вдалося, false — у разі конфлікту або відсутності заняття
 */
function reassignClassroom(lessonId, newClassroomNumber) {
    if (lessonId < 0 || lessonId >= exports.schedule.length) {
        return false;
    }
    const originalLesson = exports.schedule[lessonId];
    // Створюємо копію, щоб перевірити конфлікти
    const proposed = Object.assign(Object.assign({}, originalLesson), { classroomNumber: newClassroomNumber });
    // Перевірка конфліктів
    const conflict = validateLesson(proposed);
    if (conflict) {
        return false;
    }
    // Оновлюємо аудиторію
    exports.schedule[lessonId] = proposed;
    return true;
}
/**
 * Відміняє заняття, видаляючи його з розкладу.
 * @param lessonId індекс заняття у schedule
 */
function cancelLesson(lessonId) {
    if (lessonId >= 0 && lessonId < exports.schedule.length) {
        exports.schedule.splice(lessonId, 1);
    }
}
// Додаткові функції для зручності ( не входять до завдання ):
// Додавня аудиторії та курсу
/**
 * Додає нову аудиторію до списку аудиторій.
 */
function addClassroom(classroom) {
    exports.classrooms.push(classroom);
}
/**
 * Додає новий курс до списку курсів.
 */
function addCourse(course) {
    exports.courses.push(course);
}
