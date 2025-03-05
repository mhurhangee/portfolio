import { improveExerciseGroup } from '../schema';
import { generateObject } from 'ai';
import { APP_CONFIG } from '../config';

// Generate fill-in-blank exercises
export async function generateImproveExercises(exercisePrompt: string) {
    const promptText = `
    Generate 1 improve exercise about the following topic:
    
    ${exercisePrompt}
    
    The exercise should:
    1. Include a prompt that needs improvement (this should be a mediocre or flawed prompt)
    2. Provide context explaining what aspects need improvement
    3. Include evaluation criteria (3-5 points) that will be used to assess the improvement
    4. Include a sample improved version for reference
    
    Make the exercise relevant to the topic and focused on important prompt engineering concepts.
  `;
    
    try {
      const result = await generateObject({
        model: APP_CONFIG.model,
        system: APP_CONFIG.systemPrompt,
        schema: improveExerciseGroup,
        prompt: promptText,
        temperature: APP_CONFIG.temperature,
        maxTokens: APP_CONFIG.maxTokens,
      });
      
      // Make sure we handle the result properly
      if (!result || !result.object) {
        console.error("Empty improve generation result");
        return [];
      }
      
      return result.object.exercises;
    } catch (error) {
      console.error("Error generating improve exercises:", error);
      return [];
    }
  }