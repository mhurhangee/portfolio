// For generateExercise.ts
import { generateMultipleChoiceExercises } from './generateMultipleChoice';
import { generateTrueFalseExercises } from './generateTrueFalse';
import { generateFillInBlankExercises } from './generateFillBlank';
import { generateImproveExercises } from './generateImprove';
import { generateConstructExercises } from './generateConstruct';

// Function to generate exercises focusing on true/false and multiple-choice
export const generateExercisesForLesson = async (
  exercisePrompt: string
): Promise<{ exercises: any[] }> => { 
  if (!exercisePrompt?.trim()) {
    throw new Error('Exercise prompt is required');
  }

  try {
    const trueFalseExercises = await generateTrueFalseExercises(exercisePrompt);
    const multipleChoiceExercises = await generateMultipleChoiceExercises(exercisePrompt);
    const fillInBlankExercises = await generateFillInBlankExercises(exercisePrompt);
    const improveExercises = await generateImproveExercises(exercisePrompt);
    const constructExercises = await generateConstructExercises(exercisePrompt);
    
    // Check if we have any exercises before returning
    const allExercises = [
      ...trueFalseExercises, 
      ...multipleChoiceExercises, 
      ...fillInBlankExercises, 
      ...improveExercises,
      ...constructExercises
    ];
    
    if (allExercises.length === 0) {
      throw new Error("Failed to generate exercises");
    }
    
    // Combine and return
    return {
      exercises: allExercises
    };
  } catch (error: any) {
    throw new Error(`Failed to generate exercises: ${error.message}`);
  }
};