import { NextRequest } from 'next/server';
import { generateObject } from 'ai';
import { APP_CONFIG } from './config';
import { recipeSuggestionsSchema, recipeSchema } from './schema';
import { runPreflightChecks } from '@/app/(ai)/lib/preflight-checks/preflight-checks';
import { handlePreflightError } from '@/app/(ai)/lib/preflight-checks/error-handler';
import { getUserInfo } from '../../lib/user-identification';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Extract request data
    const { ingredients, mode, action, recipeId } = await req.json();
    
    // Input validation
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return Response.json(
        { 
          error: { 
            code: 'invalid_request', 
            message: 'Missing or invalid ingredients parameter', 
            severity: 'error' 
          } 
        },
        { status: 400 }
      );
    }

    if (!mode || !['strict', 'flexible', 'staples'].includes(mode)) {
      return Response.json(
        { 
          error: { 
            code: 'invalid_request', 
            message: 'Invalid mode parameter', 
            severity: 'error' 
          } 
        },
        { status: 400 }
      );
    }

    if (!action || !['suggest', 'detail'].includes(action)) {
      return Response.json(
        { 
          error: { 
            code: 'invalid_request', 
            message: 'Invalid action parameter', 
            severity: 'error' 
          } 
        },
        { status: 400 }
      );
    }

    if (action === 'detail' && !recipeId) {
      console.log('Missing recipe ID');
      return Response.json(
        { 
          error: { 
            code: 'invalid_request', 
            message: 'Recipe ID is required for detailed view', 
            severity: 'error' 
          } 
        },
        { status: 400 }
      );
    }

    // Get user information from request including ID, IP, and user agent
    const { userId, ip, userAgent } = await getUserInfo(req);
    
    // Run preflight checks with full user context
    const ingredientsText = ingredients.join(', ');
    const preflightResult = await runPreflightChecks(userId, `Please make a recipe out of the following ingredients: ${ingredientsText}`, ip, userAgent);
    
    // If preflight checks fail, return the error
    if (!preflightResult.passed && preflightResult.result) {
      const errorResponse = handlePreflightError(preflightResult.result);
      return Response.json(errorResponse, { status: 400 });
    }

    // Construct the prompt based on the mode and action
    let prompt = '';
    
    if (action === 'suggest') {
      prompt = `Generate ${ingredients.length > 5 ? '5' : '3'} creative recipe suggestions using these ingredients: ${ingredientsText}.
      
Mode: ${mode === 'strict' ? 'Strict Mode - ONLY use the ingredients listed' : 
       mode === 'flexible' ? 'Flexible Mode - Primarily use the ingredients listed, but you may suggest 1-2 additional items' :
       'Pantry Staples Assumed - You may include basic ingredients like salt, pepper, oil, and common spices'}`;
    } else {
      prompt = `Generate a detailed recipe for recipe ID: ${recipeId} using these ingredients: ${ingredientsText}.
      
Mode: ${mode === 'strict' ? 'Strict Mode - ONLY use the ingredients listed' : 
       mode === 'flexible' ? 'Flexible Mode - Primarily use the ingredients listed, but you may suggest 1-2 additional items' :
       'Pantry Staples Assumed - You may include basic ingredients like salt, pepper, oil, and common spices'}

Include detailed instructions, ingredient amounts, preparation time, and cooking tips.`;;
    }
    
    if (action === 'suggest') {
      try {
        // Simple ingredient validation check with a very clear schema
        const ingredientCheck = await generateObject({
          model: APP_CONFIG.model,
          system: `You are a food safety expert. Your ONLY task is to determine if ingredients are safe and ethical for human consumption. 
          Return TRUE if ALL ingredients are safe and ethical for human consumption.
          Return FALSE if ANY ingredients are unsafe, unethical, non-food items, or potentially harmful.
          DO NOT explain your reasoning. ONLY return a boolean value.`,
          schema: z.object({
            safeAndEthical: z.boolean().describe("Whether all ingredients are safe and ethical for human consumption")
          }),
          prompt: `Are these ingredients all safe and ethical for human consumption? ${ingredientsText}`,
          temperature: 0.1, // Lower temperature for more deterministic response
          maxTokens: 100, // Small token limit since we only need a boolean
        });
    
        console.log('Ingredient check result:', ingredientCheck.object);
    
        if (!ingredientCheck.object.safeAndEthical) {
          return Response.json(
            { 
              error: { 
                code: 'invalid_ingredients', 
                message: 'One or more ingredients may not be suitable for recipes. Please check your ingredients and try again.', 
                severity: 'error' 
              } 
            },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Error checking ingredients:', error);
        // Continue with recipe generation even if ingredient check fails
        console.log('Continuing with recipe generation despite ingredient check error');
      }
    
      // Proceed with recipe generation
      const result = await generateObject({
        model: APP_CONFIG.model,
        system: APP_CONFIG.systemPrompt,
        schema: recipeSuggestionsSchema,
        prompt: prompt,
        temperature: APP_CONFIG.temperature,
        maxTokens: APP_CONFIG.maxTokens,
      });
      return Response.json(result.object);
    } else if (action === 'detail') {
      prompt += `\n\nYou must always return a valid JSON object.
      When generating a detailed recipe, ALWAYS include these exact fields:
- title (string): The name of the recipe
- description (string): Brief description of the recipe
- ingredients (array): List of ingredients with name, amount, and fromUserInput fields
- instructions (array): Step-by-step cooking instructions as an array of strings
- tips (array): Optional cooking tips as an array of strings
- prepTime (string): Preparation time
- cookTime (string): Cooking time
- servings (number): Number of servings as a number
- difficulty (string): Must be one of "Easy", "Medium", or "Hard"
      `;

      const result = await generateObject({
        model: APP_CONFIG.model,
        system: APP_CONFIG.systemPrompt,
        schema: recipeSchema,  // Explicitly use this schema
        prompt: prompt,
        temperature: APP_CONFIG.temperature,
        maxTokens: APP_CONFIG.maxTokens,
      });
      return Response.json(result.object);
    }
    
  } catch (error: any) {
    console.error('Error in pantry challenge API:', error);
    
    return Response.json(
      { 
        error: { 
          code: 'api_error', 
          message: error.message || 'An error occurred while processing your request', 
          severity: 'error' 
        } 
      },
      { status: 500 }
    );
  }
}