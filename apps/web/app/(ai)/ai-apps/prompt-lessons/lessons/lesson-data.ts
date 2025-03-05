// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/lessons/lesson-data.ts

import { Lesson, LessonContent } from '../schema';
import { whatIsAILesson, whatIsAIContent } from './what-is-ai';
import { whatIsPromptLesson, whatIsPromptContent } from './what-is-prompt';
import { promptComponentsLesson } from './prompt-components';

// Collect all lessons
export const lessons: Lesson[] = [
  whatIsAILesson,
  whatIsPromptLesson,
  promptComponentsLesson
];

// Map of static lesson content
export const staticLessonContent: Record<string, LessonContent> = {
  'what-is-ai': whatIsAIContent,
  'what-is-prompt': whatIsPromptContent
};

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

// Helper function to get static lesson content (if available)
export function getStaticLessonContent(lessonId: string): LessonContent | undefined {
  return staticLessonContent[lessonId];
}