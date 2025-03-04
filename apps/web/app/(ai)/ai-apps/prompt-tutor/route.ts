// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-tutor/route.ts

import { NextRequest } from 'next/server';
import { generateObject } from 'ai';
import { APP_CONFIG } from './config';
import { tutorResponseSchema } from './schema';
import { runPreflightChecks } from '@/app/(ai)/lib/preflight-checks/preflight-checks';
import { handlePreflightError } from '@/app/(ai)/lib/preflight-checks/error-handler';
import { getUserInfo } from '../../lib/user-identification';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Extract the prompt string directly from the request body
    const prompt = await req.json();
    console.log("Received prompt:", prompt);
    
    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      console.error('Error: Invalid prompt format', typeof prompt);
      return Response.json(
        { 
          error: { 
            code: 'invalid_request', 
            message: 'Missing or invalid prompt parameter', 
            severity: 'error' 
          } 
        },
        { status: 400 }
      );
    }

    if (prompt.trim() === '') {
      console.error('Error: Empty prompt string');
      return Response.json(
        { 
          error: { 
            code: 'invalid_request', 
            message: 'Prompt cannot be empty', 
            severity: 'error' 
          } 
        },
        { status: 400 }
      );
    }

    // Get user information from request including ID, IP, and user agent
    const { userId, ip, userAgent } = await getUserInfo(req);
    
    // Run preflight checks with full user context
    const preflightResult = await runPreflightChecks(userId, prompt, ip, userAgent);
    
    // If preflight checks fail, return the error
    if (!preflightResult.passed && preflightResult.result) {
      const errorResponse = handlePreflightError(preflightResult.result);
      return Response.json(errorResponse, { status: 400 });
    }

    console.log("Preflight checks passed, generating response...");

    // If all checks pass, generate the object (non-streaming)
    const result = await generateObject({
      model: APP_CONFIG.model,
      system: APP_CONFIG.systemPrompt,
      schema: tutorResponseSchema,
      prompt: `Analyze this prompt and provide structured feedback to help the user improve their prompt writing skills: "${prompt}"`,
      temperature: APP_CONFIG.temperature,
      maxTokens: APP_CONFIG.maxTokens,
    });

    console.log("Response generated successfully");
    
    // Return the result as JSON
    return Response.json(result.object);
    
  } catch (error: any) {
    console.error('Error in prompt tutor API:', error);
    
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