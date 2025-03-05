// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/lessons/what-is-prompt.ts

import { Lesson, LessonContent } from '../schema';

export const whatIsPromptLesson: Lesson = {
  id: 'what-is-prompt',
  title: 'What is a Prompt?',
  description: 'Understanding the basics of prompts and their importance',
  difficulty: 'beginner',
  category: 'fundamentals',
  estimatedTime: '5 min',
  contentType: 'static'
};

export const whatIsPromptContent: LessonContent = {
  introduction: "A prompt is the input you provide to a generative AI system to get the output you want. It's essentially your way of communicating with the AI, telling it what you want it to do, what information you're looking for, or what kind of content you want it to generate. The quality and structure of your prompt directly influence the quality and relevance of the AI's response.",
  examples: [
    {
      good: "Write a 300-word blog post introduction about sustainable urban gardening that highlights three key benefits for city dwellers. Include statistics and maintain an informative tone.",
      bad: "Write about gardening.",
      explanation: "The improved prompt specifies the length (300 words), the specific topic (sustainable urban gardening), the structure (highlight three benefits), the audience (city dwellers), the content type (blog post introduction), additional elements to include (statistics), and the tone (informative)."
    }
  ],
  exercises: [
    {
      id: "prompt-tf-1",
      type: "true-false",
      title: "Prompt Basics",
      instructions: "Is the following statement true or false?",
      statement: "The quality of an AI's response is generally independent of the quality of the prompt provided.",
      isTrue: false
    },
    {
      id: "prompt-imp-1",
      type: "improve",
      title: "Improving a Prompt",
      instructions: "Improve this vague prompt to be more specific and directive:",
      prompt: "Give me ideas for a presentation."
    }
  ],
  conclusion: "Understanding what a prompt is and how it influences AI responses is the foundation of effective prompt engineering. As you progress through these lessons, you'll learn increasingly sophisticated techniques for crafting prompts that yield precisely the results you're looking for."
};