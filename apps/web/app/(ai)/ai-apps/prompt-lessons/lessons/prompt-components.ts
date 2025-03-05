import { Lesson } from '../schema';

export const promptComponentsLesson: Lesson = {
  id: 'prompt-components',
  title: 'Key Components of Effective Prompts',
  description: 'Learn the essential elements that make up well-crafted prompts',
  difficulty: 'beginner',
  category: 'fundamentals',
  estimatedTime: '10 min',
  contentType: 'ai-generated',
  generationPrompt: `
    Create a structured lesson about the key components that make up effective AI prompts.
    
    The lesson should cover:
    1. The importance of clear instructions in prompts
    2. How to use specific details to improve outcomes
    3. The role of context in helping the AI understand your needs
    4. How to structure multi-part requests effectively
    5. The impact of precision in language choice
    
    Make the content approachable for beginners but include valuable insights for all skill levels.
  `
};