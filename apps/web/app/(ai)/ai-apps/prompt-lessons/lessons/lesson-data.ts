// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/lessons/lesson-data.ts

import { Lesson } from '../schema';;
import { promptComponentsLesson } from './prompt-components';

// Collect all lessons
export const lessons: Lesson[] = [
  promptComponentsLesson
];

// Helper function to get all lessons
export function getAllLessons(): Lesson[] {
  return lessons;
}

// Helper function to get lesson by ID
export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id);
}

// Helper function to get lessons by category
export function getLessonsByCategory(category: string): Lesson[] {
  return lessons.filter(lesson => lesson.category === category);
}

// Helper function to get lessons by difficulty
export function getLessonsByDifficulty(difficulty: string): Lesson[] {
  return lessons.filter(lesson => lesson.difficulty === difficulty);
}