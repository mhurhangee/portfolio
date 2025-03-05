// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/route.ts

import { NextRequest } from 'next/server';
import { generateObject } from 'ai';
import { APP_CONFIG } from './config';
import { lessonResponseSchema, exerciseFeedbackSchema } from './schema';
import { runPreflightChecks } from '@/app/(ai)/lib/preflight-checks/preflight-checks';
import { handlePreflightError } from '@/app/(ai)/lib/preflight-checks/error-handler';
import { getUserInfo } from '../../lib/user-identification';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Extract the request data
    const requestData = await req.json();
    console.log("Received request:", requestData);
    
    // Input validation
    if (!requestData || typeof requestData !== 'object') {
      console.error('Error: Invalid request format', typeof requestData);
      return Response.json(
        { 
          error: { 
            code: 'invalid_request', 
            message: 'Missing or invalid request parameters', 
            severity: 'error' 
          } 
        },
        { status: 400 }
      );
    }

    // Get user information from request including ID, IP, and user agent
    const { userId, ip, userAgent } = await getUserInfo(req);
    
    // Handle different request types
    const { action, lessonId, exerciseId, userAnswer } = requestData;
    
    if (!action) {
      return Response.json(
        { 
          error: { 
            code: 'invalid_request', 
            message: 'Action parameter is required', 
            severity: 'error' 
          } 
        },
        { status: 400 }
      );
    }
    
    // Run preflight checks with content from request
    const preflightContent = action === 'submitExercise' ? userAnswer : '';
    const preflightResult = await runPreflightChecks(userId, preflightContent, ip, userAgent);
    
    // If preflight checks fail, return the error
    if (!preflightResult.passed && preflightResult.result) {
      const errorResponse = handlePreflightError(preflightResult.result);
      return Response.json(errorResponse, { status: 400 });
    }

    console.log("Preflight checks passed, processing request...");

    // Process based on action type
    if (action === 'getLesson') {
      if (!lessonId) {
        return Response.json(
          { 
            error: { 
              code: 'invalid_request', 
              message: 'Lesson ID is required', 
              severity: 'error' 
            } 
          },
          { status: 400 }
        );
      }
      
      // Generate lesson content
      const result = await generateObject({
        model: APP_CONFIG.model,
        system: APP_CONFIG.systemPrompt,
        schema: lessonResponseSchema,
        prompt: `Generate an interactive lesson about prompt engineering for the lesson with ID: "${lessonId}". Include an introduction, examples, exercises, and a conclusion.`,
        temperature: APP_CONFIG.temperature,
        maxTokens: APP_CONFIG.maxTokens,
      });
      
      return Response.json(result.object);
    } 
    else if (action === 'submitExercise') {
      if (!lessonId || !exerciseId || !userAnswer) {
        return Response.json(
          { 
            error: { 
              code: 'invalid_request', 
              message: 'Lesson ID, exercise ID, and user answer are required', 
              severity: 'error' 
            } 
          },
          { status: 400 }
        );
      }
      
      // Generate feedback for exercise submission
      const result = await generateObject({
        model: APP_CONFIG.model,
        system: APP_CONFIG.systemPrompt,
        schema: exerciseFeedbackSchema,
        prompt: `Evaluate this prompt engineering exercise submission. Lesson ID: "${lessonId}", Exercise ID: "${exerciseId}". User's answer: "${userAnswer}". Provide detailed feedback.`,
        temperature: APP_CONFIG.temperature,
        maxTokens: APP_CONFIG.maxTokens,
      });
      
      return Response.json(result.object);
    }
    else {
      return Response.json(
        { 
          error: { 
            code: 'invalid_request', 
            message: `Unknown action: ${action}`, 
            severity: 'error' 
          } 
        },
        { status: 400 }
      );
    }
    
  } catch (error: any) {
    console.error('Error in prompt lessons API:', error);
    
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