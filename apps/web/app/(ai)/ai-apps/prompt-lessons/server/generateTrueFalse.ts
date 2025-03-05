import { generateObject } from 'ai';
import { APP_CONFIG } from '../config';
import { trueFalseExerciseGroup } from '../schema';

// Generate true/false exercises
export async function generateTrueFalseExercises(exercisePrompt: string) {
    const promptText = `
      Generate 1 or 2 true/false exercises about the following topic. 

      ${exercisePrompt}
      
      Each exercise should:
      1. Have a clear statement that can be evaluated as true or false
      2. Include whether the statement is actually true or false
      3. Be relevant to the topic
      
      Make approximately half of the exercises true and half false.
  
      Your response MUST BE in JSON format according to the schema.
    `;
    
    try {
      const result = await generateObject({
        model: APP_CONFIG.model,
        system: APP_CONFIG.systemPrompt,
        schema: trueFalseExerciseGroup,
        prompt: promptText,
        temperature: APP_CONFIG.temperature,
        maxTokens: APP_CONFIG.maxTokens,
      });
      
      // Add debug logging
      console.log("True/False result:", JSON.stringify(result));
      
      // Make sure we handle the result properly
      if (!result || !result.object) {
        console.error("Empty true/false generation result");
        return [];
      }
      
      return result.object.exercises;
    } catch (error) {
      console.error("Error generating true/false exercises:", error);
      return [];
    }
  }