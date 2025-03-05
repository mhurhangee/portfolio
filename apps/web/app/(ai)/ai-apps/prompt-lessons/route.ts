// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/route.ts

import { NextRequest } from 'next/server';

//import { runPreflightChecks } from '@/app/(ai)/lib/preflight-checks/preflight-checks';
//import { handlePreflightError } from '@/app/(ai)/lib/preflight-checks/error-handler';
//import { getUserInfo } from '../../lib/user-identification';
import { generateLessonWithRetries } from './server/generateLesson';
import { generateExercisesForLesson } from './server/generateExercise';
import { generateEvaluation, generateConstructionEvaluation } from './server/generateEvaluation';

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
    const { 
      action, 
      lessonId, 
      exercisePrompt, 
      criteria, 
      improvement, 
      original, 
      sampleImprovement,
      task,
      scenario,
      construction,
      sampleSolution
    } = requestData;
    
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
    else if (action === 'generateExercises') {
      // Input validation
      if (!exercisePrompt) {
        return Response.json(
          { error: { code: 'invalid_request', message: 'Exercise prompt is required', severity: 'error' } },
          { status: 400 }
        );
      }
      
      try {
        const exercisesData = await generateExercisesForLesson(exercisePrompt);
        console.log("Generated exercises:", JSON.stringify(exercisesData));
        
        // Make sure we have exercises before returning
        if (!exercisesData || !exercisesData.exercises || exercisesData.exercises.length === 0) {
          throw new Error("No exercises were generated");
        }
        
        return Response.json(exercisesData);
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
    else if (action === 'evaluateImprovement') {
      // Input validation for improvement evaluation
      if (!original || !improvement || !criteria) {
        return Response.json(
          { 
            error: { 
              code: 'invalid_request', 
              message: 'Original prompt, improvement, and criteria are required', 
              severity: 'error' 
            } 
          },
          { status: 400 }
        );
      }
      
      try {
        const evaluationData = await generateEvaluation(original, improvement, sampleImprovement, criteria);
        return Response.json(evaluationData);
      } catch (error: any) {
        console.error('Error evaluating improvement:', error);
        return Response.json(
          { 
            error: { 
              code: 'evaluation_failed', 
              message: error.message || 'Failed to evaluate improvement', 
              severity: 'error',
              details: error.stack || error.toString()
            } 
          },
          { status: 500 }
        );
      }
    }
    else if (action === 'evaluateConstruction') {
      // Input validation for construction evaluation
      if (!task || !scenario || !construction || !criteria) {
        return Response.json(
          { 
            error: { 
              code: 'invalid_request', 
              message: 'Task, scenario, constructed prompt, and criteria are required', 
              severity: 'error' 
            } 
          },
          { status: 400 }
        );
      }
      
      try {
        // Ensure criteria is an array
        const criteriaArray = Array.isArray(criteria) ? criteria : [criteria];
        
        const evaluationData = await generateConstructionEvaluation(
          task, 
          scenario, 
          construction, 
          criteriaArray, 
          sampleSolution
        );
        return Response.json(evaluationData);
      } catch (error: any) {
        console.error('Error evaluating construction:', error);
        return Response.json(
          { 
            error: { 
              code: 'evaluation_failed', 
              message: error.message || 'Failed to evaluate constructed prompt', 
              severity: 'error',
              details: error.stack || error.toString()
            } 
          },
          { status: 500 }
        );
      }
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