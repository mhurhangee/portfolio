import { constructExerciseGroup } from '../schema';
import { generateObject } from 'ai';
import { APP_CONFIG } from '../config';

// Generate fill-in-blank exercises
export async function generateConstructExercises(exercisePrompt: string) {
    const promptText = `
    Generate 1 construct exercise about the following topic:
    
    ${exercisePrompt}
    
    The exercise should:
    1. Include a clear task for what kind of prompt the user needs to create
    2. Provide a scenario or context in which this prompt would be used
    3. Include evaluation criteria (3-5 points) that will be used to assess the constructed prompt
    4. Optionally include a sample well-constructed prompt for reference
    
    Make the exercise relevant to the topic and focused on important prompt engineering concepts.
  `;

    try {
        const result = await generateObject({
            model: APP_CONFIG.model,
            system: APP_CONFIG.systemPrompt,
            schema: constructExerciseGroup,
            prompt: promptText,
            temperature: APP_CONFIG.temperature,
            maxTokens: APP_CONFIG.maxTokens,
        });

        // Make sure we handle the result properly
        if (!result || !result.object) {
            console.error("Empty construct generation result");
            return [];
        }

        return result.object.exercises;
    } catch (error) {
        console.error("Error generating construct exercises:", error);
        return [];
    }
}