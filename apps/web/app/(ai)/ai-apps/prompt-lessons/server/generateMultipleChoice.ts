import { multipleChoiceExerciseGroup } from '../schema';
import { generateObject } from 'ai';
import { APP_CONFIG } from '../config';

// Generate multiple-choice exercises
export async function generateMultipleChoiceExercises(exercisePrompt: string) {
    const promptText = `
      Generate 1 or 2 multiple-choice exercises about ${exercisePrompt}.
      
      Each exercise should:
      1. Include 4 plausible options
      2. Specify which option is correct (using correctOptionIndex, starting from 0)
  
      Your response MUST BE in JSON format according to the schema.
    `;
    
    try {
      const result = await generateObject({
        model: APP_CONFIG.model,
        system: APP_CONFIG.systemPrompt,
        schema: multipleChoiceExerciseGroup,
        prompt: promptText,
        temperature: APP_CONFIG.temperature,
        maxTokens: APP_CONFIG.maxTokens,
      });
      
      // Add debug logging
      console.log("Multiple-choice result:", JSON.stringify(result));
      
      // Make sure we handle the result properly
      if (!result || !result.object) {
        console.error("Empty multiple-choice generation result");
        return [];
      }
      
      return result.object.exercises;
    } catch (error) {
      console.error("Error generating multiple-choice exercises:", error);
      return [];
    }
  }