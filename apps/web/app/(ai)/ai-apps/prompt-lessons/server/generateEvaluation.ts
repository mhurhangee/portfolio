import { generateObject } from 'ai';
import { APP_CONFIG } from '../config';
import { evaluationResultSchema } from '../schema';

// Generate evaluation for improvement exercises
export async function generateEvaluation(original: string, improvement: string, sampleImprovement: string, criteria: string) {

    try {
        // Build the prompt for evaluation
        const criteriaText = Array.isArray(criteria)
            ? criteria.map(c => `- ${c}`).join('\n')
            : `- ${criteria}`;

        const promptText = `
          I need you to evaluate a prompt improvement exercise.
          
          Original Prompt:
          "${original}"
          
          User's Improved Prompt:
          "${improvement}"
          
          ${sampleImprovement ? `Sample Improved Prompt (for reference):
          "${sampleImprovement}"` : ''}
          
          Evaluation Criteria:
          ${criteriaText}
          
          Please evaluate the user's improvement based on the criteria above.
          Determine:
          1. Whether the improvement is good enough (true/false)
          2. Provide specific feedback about the improvement, including strengths and weaknesses
          3. Suggest a better improvement if the user's version isn't good enough
        `;

        // Generate evaluation using generateObject
        const result = await generateObject({
            model: APP_CONFIG.model,
            system: APP_CONFIG.systemPrompt,
            schema: evaluationResultSchema,
            prompt: promptText,
            temperature: APP_CONFIG.temperature,
            maxTokens: APP_CONFIG.maxTokens,
        });

        // Make sure we handle the result properly
        if (!result || !result.object) {
            console.error("Empty evaluation generation result");
            return [];
        }

        return result.object;
    } catch (error) {
        console.error("Error generating evaluation:", error);
        return [];
    }
}

// Generate evaluation for construction exercises
export async function generateConstructionEvaluation(task: string, scenario: string, construction: string, criteria: string[], sampleSolution?: string) {

    try {
        // Build the prompt for evaluation
        const criteriaText = criteria.map(c => `- ${c}`).join('\n');

        const promptText = `
          I need you to evaluate a prompt construction exercise.
          
          Task:
          "${task}"
          
          Scenario:
          "${scenario}"
          
          User's Constructed Prompt:
          "${construction}"
          
          ${sampleSolution ? `Sample Solution (for reference):
          "${sampleSolution}"` : ''}
          
          Evaluation Criteria:
          ${criteriaText}
          
          Please evaluate the user's constructed prompt based on the task, scenario, and criteria above.
          Determine:
          1. Whether the constructed prompt is good enough (true/false) - set this as isGoodImprovement
          2. Provide specific feedback about the construction, including strengths and weaknesses - set this as feedback
          3. Suggest a better prompt if the user's version isn't good enough - set this as suggestedImprovement
        `;

        // Generate evaluation using generateObject
        const result = await generateObject({
            model: APP_CONFIG.model,
            system: APP_CONFIG.systemPrompt,
            schema: evaluationResultSchema, // Reuse the same schema but interpret isGoodImprovement as isGoodConstruction
            prompt: promptText,
            temperature: APP_CONFIG.temperature,
            maxTokens: APP_CONFIG.maxTokens,
        });

        // Make sure we handle the result properly
        if (!result || !result.object) {
            console.error("Empty evaluation generation result");
            return [];
        }

        return result.object;
    } catch (error) {
        console.error("Error generating construction evaluation:", error);
        return [];
    }
}