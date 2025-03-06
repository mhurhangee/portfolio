
import { APP_CONFIG } from '../config';
import { lessons } from '../lessons/lesson-data';
import { validateSchema } from '../utils';
import { lessonContentSchema } from '../schema';
import { generateObject } from 'ai';

export const generateLessonWithRetries = async (lessonId: string): Promise<any> => {
    // Find the lesson in our data
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) {
      throw new Error(`Lesson with ID "${lessonId}" not found`);
    }
    const promptText = APP_CONFIG.systemPrompt +
      `
      # Task
      To help teach users about AI topics, by generating lesson content about the topic: "${lesson.topic}", for a lesson titled: "${lesson.title}", with the teaching goal being: "${lesson.description}". The lesson content should match the lesson difficulty: "${lesson.difficulty}".
      
      This lesson will be part of a series of lessons, so the lesson content should really focus on and be very detailed about ${lesson.topic}.

      The length of your lesson content and examples you give should be suitable for the lesson difficulty: "${lesson.difficulty}".  I.e. for advanced content provide longer explanations and give longer and more complex examples.
      ` ;
    
    const maxRetries = APP_CONFIG.validationRetries || 1;

    let attempt = 0;
    let lastError = null;
    
    while (attempt < maxRetries) {
      attempt++;
      
      try {
        const result = await generateObject({
          model: APP_CONFIG.model,
          system: APP_CONFIG.systemPrompt,
          schema: lessonContentSchema,
          prompt: promptText,
          temperature: APP_CONFIG.temperature,
          maxTokens: APP_CONFIG.maxTokens,
        });

        if (!result || !result.object) {
          lastError = new Error('Empty generation result');
          continue;
        }
        
        const validation = validateSchema(lessonContentSchema, result.object);
        if (!validation.isValid) {
          lastError = new Error(`Validation failed: ${validation.errors.join(', ')}`);
          continue;
        }
        
        return {
          lesson: lesson,
          content: result.object
        };
      } catch (error: unknown) {
        lastError = error;
      }
    }

    throw lastError || new Error('Failed to generate lesson content after multiple attempts');
  };