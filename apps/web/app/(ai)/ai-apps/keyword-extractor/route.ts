import { NextRequest } from 'next/server';
import { generateObject } from 'ai';
import { APP_CONFIG } from './config';
import { keywordsExtractionSchema } from './schema';
import { runPreflightChecks } from '@/app/(ai)/lib/preflight-checks/preflight-checks';
import { handlePreflightError } from '@/app/(ai)/lib/preflight-checks/error-handler';
import { getUserInfo } from '../../lib/user-identification';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Extract the prompt string directly from the request body
    const { keywordType, userPrompt } = await req.json();
    console.log("Received prompt:", userPrompt.slice(0, 50) + '...');
    
    // Input validation
    if (!userPrompt || typeof userPrompt !== 'string') {
      console.error('Error: Invalid prompt format', typeof userPrompt);
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

    if (userPrompt.trim() === '') {
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

    console.log("Starting preflight checks...");

    // Get user information from request including ID, IP, and user agent
    const { userId, ip, userAgent } = await getUserInfo(req);
    
    // Run preflight checks with full user context
    const preflightResult = await runPreflightChecks(userId, userPrompt, ip, userAgent);
    
    // If preflight checks fail, return the error
    if (!preflightResult.passed && preflightResult.result) {
      console.log("Preflight checks failed:", preflightResult.result);
      const errorResponse = handlePreflightError(preflightResult.result);
      return Response.json(errorResponse, { status: 400 });
    }

    console.log("Preflight checks passed, generating response...");

    // If all checks pass, generate the object (non-streaming)
    const result = await generateObject({
      model: APP_CONFIG.model,
      system: APP_CONFIG.systemPrompt,
      schema: keywordsExtractionSchema,
      prompt: `Focus on extracting ${keywordType} keywords from the following text: "${userPrompt}"`,
      temperature: APP_CONFIG.temperature,
      maxTokens: APP_CONFIG.maxTokens,
    });

    console.log("Response generated successfully");
    
    // Return the result as JSON
    return Response.json(result.object);
    
  } catch (error: any) {
    console.error('Error in keyword extractor API:', error);
    
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