// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/schema.ts

import { z } from 'zod';

// Define the lesson data structure
export const lessonSchema = z.object({
  id: z.string().describe('Unique identifier for the lesson'),
  title: z.string().describe('Display title of the lesson'),
  description: z.string().describe('Brief description of what the lesson covers'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'])
    .describe('Difficulty level of the lesson'),
  category: z.enum(['fundamentals', 'clarity', 'specificity', 'structure', 'context'])
    .describe('Category that the lesson belongs to'),
  estimatedTime: z.string()
    .describe('Estimated time to complete the lesson (e.g., "10 min")'),
  contentType: z.enum(['static', 'ai-generated'])
    .describe('Whether the lesson content is static or AI-generated'),
  generationPrompt: z.string().optional()
    .describe('Custom prompt to use when generating this lesson with AI'),
});

export type Lesson = z.infer<typeof lessonSchema>;

export const exerciseSchema = z.object({
  id: z.string().describe('Unique identifier for the exercise').optional().default(() => `exercise-${Date.now()}-${Math.floor(Math.random() * 1000)}`),
  type: z.enum(['true-false', 'improve', 'construct', 'multiple-choice', 'fill-blank'])
    .describe('Type of exercise'),
  title: z.string().describe('Title of the exercise'),
  instructions: z.string().describe('Instructions for completing the exercise'),
  prompt: z.string().optional()
    .describe('Prompt text for "improve" exercises'),
  statement: z.string().optional()
    .describe('Statement for "true-false" exercises'),
  isTrue: z.boolean().optional().default(true)
    .describe('The correct answer for true-false exercises'),
  options: z.array(z.string()).optional()
    .describe('Options for "multiple-choice" exercises'),
  correctAnswer: z.union([z.string(), z.array(z.string())]).optional()
    .describe('Correct answer(s) for the exercise'),
  hints: z.array(z.string()).optional().default([])
    .describe('Optional hints for the user'),
});

export type Exercise = z.infer<typeof exerciseSchema>;

// Define the exercise types with improved default handling
export const exercisesSchema = z.object({
  exercises: z.array(exerciseSchema).default([]),
});

export type Exercises = z.infer<typeof exercisesSchema>;

// Define the lesson content structure
export const lessonContentSchema = z.object({
  introduction: z.string()
    .describe('Introduction text for the lesson'),
  examples: z.array(z.object({
    good: z.string().describe('Example of a good prompt based on the lesson topic'),
    bad: z.string().describe('Example of a bad prompt based on the lesson topic'),
    explanation: z.string().describe('Explanation of why the good prompt is better based on the lesson topic'),
  })).describe('Examples of good vs bad prompts'),
  conclusion: z.string()
    .describe('Concluding text for the lesson'),
});

export type LessonContent = z.infer<typeof lessonContentSchema>;

// Schema for the lesson response from the API
export const lessonResponseSchema = z.object({
  lesson: lessonSchema.describe('The lesson metadata'),
  content: lessonContentSchema.describe('The lesson content'),
});

export type LessonResponse = z.infer<typeof lessonResponseSchema>;

// Schema for exercise feedback response
export const exerciseFeedbackSchema = z.object({
  isCorrect: z.boolean()
    .describe('Whether the user\'s answer is correct'),
  feedback: z.string()
    .describe('Short feedback message on the user\'s answer'),
  explanation: z.string()
    .describe('Detailed explanation of the feedback'),
  suggestedImprovement: z.string().optional()
    .describe('Suggested improvement for "improve" exercises'),
});

export type ExerciseFeedback = z.infer<typeof exerciseFeedbackSchema>;

// Interface for API error response
export interface ApiError {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  details?: string;
}