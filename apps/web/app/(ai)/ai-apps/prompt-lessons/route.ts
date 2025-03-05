// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/route.ts

import { NextRequest } from 'next/server';
import { generateObject } from 'ai';
import { APP_CONFIG } from './config';
import { exerciseFeedbackSchema } from './schema';
//import { runPreflightChecks } from '@/app/(ai)/lib/preflight-checks/preflight-checks';
//import { handlePreflightError } from '@/app/(ai)/lib/preflight-checks/error-handler';
//import { getUserInfo } from '../../lib/user-identification';
import { generateLessonWithRetries } from './server/generateLession';
import { generateExercisesForLesson } from './server/generateExercise';


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
    console.log('Input validation passed');

    // Get user information from request including ID, IP, and user agent
    //const { userId, ip, userAgent } = await getUserInfo(req);
    
    // Handle different request types
    const { action, lessonId, exerciseId, userAnswer, count = 3, existingExerciseIds = [] } = requestData;
    
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
    console.log('Action validation passed', action);
    
    /*
    // Run preflight checks with content from request
    const preflightContent = action === 'submitExercise' ? userAnswer : '';
    const preflightResult = await runPreflightChecks(userId, preflightContent, ip, userAgent);
    
    // If preflight checks fail, return the error
    if (!preflightResult.passed && preflightResult.result) {
      const errorResponse = handlePreflightError(preflightResult.result);
      return Response.json(errorResponse, { status: 400 });
    }

    console.log("Preflight checks passed, processing request...");
    */

    // Process based on action type
    if (action === 'getLesson') {
      if (!lessonId) {
        console.log('Lesson ID is required');
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
      console.log('Lesson ID validation passed', lessonId);
      
      // Generate lesson content with retries and validation
      try {
        const lessonData = await generateLessonWithRetries(lessonId);
        return Response.json(lessonData);
      } catch (error: any) {
        console.error('Error generating lesson:', error);
        return Response.json(
          { 
            error: { 
              code: 'generation_failed', 
              message: error.message || 'Failed to generate lesson content', 
              severity: 'error',
              details: error.stack || error.toString()
            } 
          },
          { status: 500 }
        );
      }
    }
    else if  (action === 'generateExercises') {
      
      // Input validation
      if (!lessonId) {
        return Response.json(
          { error: { code: 'invalid_request', message: 'Lesson ID is required', severity: 'error' } },
          { status: 400 }
        );
      }
      
      try {
        const exercises = await generateExercisesForLesson(lessonId, count, existingExerciseIds);
        return Response.json({ exercises });
      } catch (error: any) {
        console.error('Error generating exercises:', error);
        return Response.json(
          { 
            error: { 
              code: 'exercise_generation_failed', 
              message: error.message || 'Failed to generate exercises', 
              severity: 'error',
              details: error.stack || error.toString()
            } 
          },
          { status: 500 }
        );
      }
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