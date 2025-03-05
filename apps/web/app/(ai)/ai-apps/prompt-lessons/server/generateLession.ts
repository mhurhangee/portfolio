
import { APP_CONFIG } from '../config';
import { lessons } from '../lessons/lesson-data';
import { validateSchema } from '../utils';
import { lessonContentSchema } from '../schema';
import { generateObject } from 'ai';

export const generateLessonWithRetries = async (lessonId: string, customPrompt?: string): Promise<any> => {
    // Find the lesson in our data
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) {
      throw new Error(`Lesson with ID "${lessonId}" not found`);
    }
    
    // Use the lesson's generation prompt if available, otherwise use a default prompt
    const promptText = customPrompt || lesson.generationPrompt || 
      `Generate interactive lesson content about prompt engineering for the lesson titled "${lesson.title}".
      
      Include the following sections:
      1. An introduction that explains the concept (at least a paragraph)
      2. At least 2 examples of good and bad prompts with explanations
      4. A conclusion summarizing key points
      
      The content should match the difficulty level: ${lesson.difficulty}
      The lesson category is: ${lesson.category}`;
    
    const maxRetries = APP_CONFIG.validationRetries || 1;

    let attempt = 0;
    let lastError = null;
    

    // Try multiple times
    while (attempt < maxRetries) {
      attempt++;
      console.log(`Generation attempt ${attempt} for lesson ${lessonId}`);
      
      try {
        // Generate only the content part
        const result = await generateObject({
          model: APP_CONFIG.model,
          system: APP_CONFIG.systemPrompt,
          schema: lessonContentSchema,
          prompt: promptText,
          temperature: APP_CONFIG.temperature,
          maxTokens: APP_CONFIG.maxTokens,
        });
        
        // Check if we got a result
        if (!result || !result.object) {
          console.error(`Generation returned empty result on attempt ${attempt}`);
          if (result) {
            console.error('Response details:', {
              text: result.object?.introduction?.substring(0, 500) + '...',
              response: result.response,
              usage: result.usage
            });
          }
          lastError = new Error('Empty generation result');
          continue;
        }
        
        // Make a quick copy so we can log it if validation fails
        const contentForValidation = JSON.parse(JSON.stringify(result.object));
        
        // Validate the generated content
        const validation = validateSchema(lessonContentSchema, contentForValidation);
        if (!validation.isValid) {
          console.error(`Validation failed on attempt ${attempt}:`, validation.errors);
          console.error('Validation object:', JSON.stringify(contentForValidation, null, 2));
          lastError = new Error(`Validation failed: ${validation.errors.join(', ')}`);
          continue;
        }
        
        // If we got here, content is valid
        console.log(`Successfully generated valid content for ${lessonId} on attempt ${attempt}`);
        
        // Return both the lesson metadata (from our data) and the generated content
        return {
          lesson: lesson,
          content: result.object
        };
      } catch (error: any) {
        console.error(`Error in generation attempt ${attempt}:`, error);
        if (error.stack) console.error(error.stack);
        
        // Try to extract more information about the error
        const errorInfo: Record<string, any> = {};
        if (error.cause) errorInfo.cause = error.cause;
        if (error.response) errorInfo.response = error.response;
        if (error.text) errorInfo.text = error.text?.substring(0, 500) + '...';
        
        if (Object.keys(errorInfo).length > 0) {
          console.error('Additional error details:', errorInfo);
        }
        
        lastError = error;
      }
    }
    
    // If we got here, all attempts failed
    console.error(`All ${maxRetries} generation attempts failed for ${lessonId}`);
    throw lastError || new Error('Failed to generate lesson content after multiple attempts');
  };