import { fillInBlankExerciseGroup } from '../schema';
import { generateObject } from 'ai';
import { APP_CONFIG } from '../config';

// Generate fill-in-blank exercises
export async function generateFillInBlankExercises(exercisePrompt: string) {
    const promptText = `
      Generate 1 or 2 fill-in-blank exercises about ${exercisePrompt}.
      
      Each exercise should:
      1. Have a sentence with a [BLANK] placeholder where a key word or phrase should go
      2. Include the correct answer to fill in the blank
      3. Provide a clear explanation of why this is the correct answer
      4. Optionally include additional context to help understand the sentence
      
      Make the exercises relevant to the topic and focused on testing important concepts.
  
      Your response MUST BE in JSON format according to the schema.
    `;
    
    try {
      const result = await generateObject({
        model: APP_CONFIG.model,
        system: APP_CONFIG.systemPrompt,
        schema: fillInBlankExerciseGroup,
        prompt: promptText,
        temperature: APP_CONFIG.temperature,
        maxTokens: APP_CONFIG.maxTokens,
      });
      
      // Make sure we handle the result properly
      if (!result || !result.object) {
        console.error("Empty fill-in-blank generation result");
        return [];
      }
      
      return result.object.exercises;
    } catch (error) {
      console.error("Error generating fill-in-blank exercises:", error);
      return [];
    }
  }