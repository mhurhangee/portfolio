// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/lessons/what-is-ai.ts

import { Lesson, LessonContent } from '../schema';

export const whatIsAILesson: Lesson = {
  id: 'what-is-ai',
  title: 'What is Generative AI?',
  description: 'A primer on generative AI and how it works at a high level',
  difficulty: 'beginner',
  category: 'fundamentals',
  estimatedTime: '5 min',
  contentType: 'static'
};

export const whatIsAIContent: LessonContent = {
  introduction: "Generative AI refers to artificial intelligence systems that can create new content such as text, images, code, or audio based on patterns they've learned from existing data. Unlike traditional AI that focuses on classification or prediction tasks, generative AI can produce original outputs that didn't exist before.",
  examples: [
    {
      good: "Generate a detailed, scientifically accurate explanation of how photosynthesis works in plants, suitable for a high school biology student.",
      bad: "Tell me about plants.",
      explanation: "The improved prompt specifies exactly what kind of information is needed (scientific explanation of photosynthesis), the level of detail (detailed), the target audience (high school student), and the accuracy required (scientifically accurate)."
    }
  ],
  exercises: [
    {
      id: "ai-tf-1",
      type: "true-false",
      title: "Understanding Generative AI",
      instructions: "Determine whether the following statement is true or false.",
      statement: "Generative AI can only create text and cannot produce images, audio, or code.",
      isTrue: false
    },
    {
      id: "ai-tf-2",
      type: "true-false",
      title: "AI Capabilities",
      instructions: "Is this statement correct?",
      statement: "Generative AI models learn patterns from existing data to create new content.",
      isTrue: true
    }
  ],
  conclusion: "Generative AI represents a major evolution in artificial intelligence capabilities. By understanding what these systems can do and how they work at a high level, you can better craft prompts that effectively communicate your intentions to these powerful tools."
};