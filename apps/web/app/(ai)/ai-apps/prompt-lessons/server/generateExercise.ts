import { APP_CONFIG } from '../config';
import { lessons } from '../lessons/lesson-data';
import { generateObject } from 'ai';
import { Exercise, exercisesSchema } from '../schema';
import { validateSchema } from '../utils';

export const generateExercisesForLesson = async (
  lessonId: string,
  count: number = 3,
  existingExerciseIds: string[] = []
): Promise<Exercise[]> => {
  // Find the lesson in our data
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) {
    throw new Error(`Lesson with ID "${lessonId}" not found`);
  }

  // Create a prompt for generating exercises
  const promptText = `Generate ${count} unique interactive exercises for a prompt engineering lesson titled "${lesson.title}".
    
    The lesson covers the following:
    - ${lesson.description}
    
    Please create ${count} interactive exercises with the following types:
    ${count > 1 ? '- At least one "true-false" exercise where the user identifies if a statement is true or false' : ''}
    ${count > 2 ? '- At least one "improve" exercise where the user improves a poorly written prompt' : ''}
    
    Each exercise should:
    1. Have a clear title and instructions
    2. Be directly relevant to the lesson topic
    3. Help reinforce prompt engineering best practices
    
    Make the exercises progressively more challenging.
    ${existingExerciseIds.length > 0 ? `Avoid creating exercises similar to these IDs: ${existingExerciseIds.join(', ')}` : ''}`;

  const maxRetries = APP_CONFIG.validationRetries || 1;

  // Try multiple times with cleaner error handling
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Exercise generation attempt ${attempt} for lesson ${lessonId}`);
    
    try {
      // Generate the exercises using the exercises schema
      const result = await generateObject({
        model: APP_CONFIG.model,
        system: APP_CONFIG.systemPrompt,
        schema: exercisesSchema,
        prompt: promptText,
        temperature: 0.7,
        maxTokens: 1500,
      });
      
      // Check if we got a result
      if (!result || !result.object || !result.object.exercises) {
        console.error(`Exercise generation returned empty result on attempt ${attempt}`);
        if (result) {
          console.error('Response details:', {
            object: JSON.stringify(result.object).substring(0, 500) + '...',
            response: result.response,
            usage: result.usage
          });
        }
        continue;
      }
      
      // Log the raw response for debugging
      console.log('Raw exercises response:', JSON.stringify(result.object).substring(0, 500) + '...');
      
      // Extract exercises array from the result
      const exercisesResponse = result.object;
      
      // Perform an explicit validation as a double-check (belt and suspenders approach)
      // This adds an extra layer of safety in case the LLM generates something unexpected
      const validation = validateSchema(exercisesSchema, exercisesResponse);
      if (!validation.isValid) {
        console.error(`Manual validation failed on attempt ${attempt}:`, validation.errors);
        console.error('Validation object:', JSON.stringify(exercisesResponse, null, 2));
        continue;
      }
      
      const exercises = exercisesResponse.exercises;
      
      // Verify we have the expected number of exercises
      if (!exercises || exercises.length === 0) {
        console.error(`Generated response contained no exercises on attempt ${attempt}`);
        continue;
      }
      
      // Success! Assign lesson-specific IDs
      console.log(`Successfully generated ${exercises.length} exercises for ${lessonId}`);
      
      // Update exercise IDs to include lesson context
      return exercises.map((exercise, index) => ({
        ...exercise,
        id: `${lessonId}-${exercise.id || `exercise-${Date.now()}-${index}`}`
      }));
    } 
    catch (error: any) {
      console.error(`Error in exercise generation attempt ${attempt}:`, error);
      
      // Log additional details if available
      if (error.cause) console.error('Error cause:', error.cause);
      if (error.response) console.error('Response info:', error.response);
      if (error.text) console.error('Response text:', error.text?.substring(0, 300));
      
      // On last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
  
  // This line shouldn't be reached due to the throw in the loop
  throw new Error('Failed to generate exercises after multiple attempts');
};