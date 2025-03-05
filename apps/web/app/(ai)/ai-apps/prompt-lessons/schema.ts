// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/schema.ts

import { z } from 'zod';

// Define the lesson data structure
export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  category: z.enum(['fundamentals', 'clarity', 'specificity', 'structure', 'context']),
  estimatedTime: z.string(), // e.g., "10 min"
  contentType: z.enum(['static', 'ai-generated']), // Indicates whether the lesson content is static or AI-generated
});

export type Lesson = z.infer<typeof lessonSchema>;

// Define the exercise types
export const exerciseSchema = z.object({
  id: z.string(),
  type: z.enum(['true-false', 'improve', 'construct', 'multiple-choice', 'fill-blank']),
  title: z.string(),
  instructions: z.string(),
  prompt: z.string().optional(),
  statement: z.string().optional(), // For true-false exercises
  isTrue: z.boolean().optional(), // The correct answer for true-false exercises
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
  hints: z.array(z.string()).optional(),
});

export type Exercise = z.infer<typeof exerciseSchema>;

// Define the lesson content structure
export const lessonContentSchema = z.object({
  introduction: z.string(),
  examples: z.array(z.object({
    good: z.string(),
    bad: z.string(),
    explanation: z.string(),
  })),
  exercises: z.array(exerciseSchema),
  conclusion: z.string(),
});

export type LessonContent = z.infer<typeof lessonContentSchema>;

// Schema for the lessonResponse from the API
export const lessonResponseSchema = z.object({
  lesson: lessonSchema,
  content: lessonContentSchema,
});

export type LessonResponse = z.infer<typeof lessonResponseSchema>;

// Schema for exercise feedback from the API
export const exerciseFeedbackSchema = z.object({
  isCorrect: z.boolean(),
  feedback: z.string(),
  suggestedImprovement: z.string().optional(),
  explanation: z.string(),
});

export type ExerciseFeedback = z.infer<typeof exerciseFeedbackSchema>;