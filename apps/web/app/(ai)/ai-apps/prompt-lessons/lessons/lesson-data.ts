// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/lessons/lesson-data.ts

import { Lesson, LessonContent } from '../schema';
import { whatIsAILesson, whatIsAIContent } from './what-is-ai';
import { whatIsPromptLesson, whatIsPromptContent } from './what-is-prompt';

// Collect all lessons
export const lessons: Lesson[] = [
  whatIsAILesson,
  whatIsPromptLesson,
  {
    id: 'prompt-components',
    title: 'Key Components of Effective Prompts',
    description: 'Learn the essential elements that make up well-crafted prompts',
    difficulty: 'beginner',
    category: 'fundamentals',
    estimatedTime: '10 min',
    contentType: 'ai-generated'
  },
  {
    id: 'clarity-basics',
    title: 'Clarity Fundamentals',
    description: 'Learn how to write clear, unambiguous prompts that produce consistent results',
    difficulty: 'beginner',
    category: 'clarity',
    estimatedTime: '10 min',
    contentType: 'ai-generated'
  },
  {
    id: 'specificity-details',
    title: 'Adding Effective Details',
    description: 'Master the art of adding the right level of detail to your prompts',
    difficulty: 'beginner',
    category: 'specificity',
    estimatedTime: '15 min',
    contentType: 'ai-generated'
  },
  {
    id: 'context-setting',
    title: 'Effective Context Setting',
    description: 'Learn to provide the right context for AI to understand your task',
    difficulty: 'intermediate',
    category: 'context',
    estimatedTime: '15 min',
    contentType: 'ai-generated'
  },
  {
    id: 'structuring-complex',
    title: 'Structuring Complex Prompts',
    description: 'Techniques for breaking down complex requests into manageable parts',
    difficulty: 'intermediate',
    category: 'structure',
    estimatedTime: '20 min',
    contentType: 'ai-generated'
  },
  {
    id: 'refinement-techniques',
    title: 'Prompt Refinement Techniques',
    description: 'Learn iterative improvement strategies to optimize your prompts',
    difficulty: 'advanced',
    category: 'clarity',
    estimatedTime: '25 min',
    contentType: 'ai-generated'
  }
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