// For generateExercise.ts
import { generateMultipleChoiceExercises } from './generateMultipleChoice';
import { generateTrueFalseExercises } from './generateTrueFalse';

// Function to generate exercises focusing on true/false and multiple-choice
export const generateExercisesForLesson = async (
  exercisePrompt: string
): Promise<{ exercises: any[] }> => { // Make sure we explicitly return the correct type
  if (!exercisePrompt?.trim()) {
    throw new Error('Exercise prompt is required');
  }

  try {
    // Generate true/false exercises
    const trueFalseExercises = await generateTrueFalseExercises(exercisePrompt);
    
    // Generate multiple-choice exercises
    const multipleChoiceExercises = await generateMultipleChoiceExercises(exercisePrompt);
    
    // Debug logging
    console.log(`Generated ${trueFalseExercises.length} true/false exercises`);
    console.log(`Generated ${multipleChoiceExercises.length} multiple-choice exercises`);
    
    // Check if we have any exercises before returning
    const allExercises = [...trueFalseExercises, ...multipleChoiceExercises];
    
    if (allExercises.length === 0) {
      console.error("No exercises were generated after trying both types");
      throw new Error("Failed to generate exercises");
    }
    
    // Combine and return
    return {
      exercises: allExercises
    };
  } catch (error: any) {
    console.error("Error generating exercises:", error);
    throw new Error(`Failed to generate exercises: ${error.message}`);
  }
};



