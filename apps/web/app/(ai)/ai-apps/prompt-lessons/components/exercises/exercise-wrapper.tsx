// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/components/exercises/exercise-wrapper.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Exercise, ExerciseFeedback } from "../../schema"
import TrueFalseExercise from "./true-false-exercise"
import ImproveExercise from "./improve-exercise"

interface ExerciseWrapperProps {
  exercise: Exercise
  lessonId: string
}

export default function ExerciseWrapper({ exercise, lessonId }: ExerciseWrapperProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmitExercise = async (exerciseId: string, answer: string): Promise<ExerciseFeedback | undefined> => {
    try {
      // Input validation - preflight checks
      if (!exerciseId || !answer) {
        setError("Please provide a valid answer");
        return undefined;
      }

      setError(null)
      setIsSubmitting(true)
      
      // Check if this is a static exercise (for TrueFalse) that we can evaluate client-side
      if (exercise.type === 'true-false' && exercise.isTrue !== undefined) {
        const userAnswerBool = answer === 'true'
        const isCorrect = userAnswerBool === exercise.isTrue
        
        setIsSubmitting(false)
        return {
          isCorrect,
          feedback: isCorrect ? "That's correct!" : "That's not correct.",
          explanation: isCorrect 
            ? "You chose the right answer. Well done!"
            : `The statement "${exercise.statement}" is actually ${exercise.isTrue ? 'true' : 'false'}.`
        }
      }
      
      // For AI-generated exercises or improve exercises, use the API
      try {
        const response = await fetch('/api/ai/prompt-lessons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'submitExercise',
            lessonId: lessonId,
            exerciseId: exerciseId,
            userAnswer: answer
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to submit exercise');
        }
        
        const feedbackData = await response.json();
        console.log("API feedback:", feedbackData);
        
        // Validate the response format
        if (!feedbackData || typeof feedbackData.isCorrect !== 'boolean' || 
            typeof feedbackData.feedback !== 'string' || 
            typeof feedbackData.explanation !== 'string') {
          throw new Error('Invalid feedback format received from API');
        }
        
        setIsSubmitting(false)
        return feedbackData;
      } catch (apiError: any) {
        console.error("API error:", apiError);
        setError(apiError.message || 'Failed to get feedback on your answer');
        setIsSubmitting(false)
        return undefined;
      }
      
    } catch (error: any) {
      console.error("Error submitting exercise:", error)
      setError(error.message || "An error occurred while submitting your answer. Please try again.")
      setIsSubmitting(false)
      return undefined
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{exercise.title}</CardTitle>
        <CardDescription>{exercise.instructions}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {exercise.type === 'true-false' && (
          <TrueFalseExercise 
            exercise={exercise} 
            lessonId={lessonId} 
            onSubmit={handleSubmitExercise}
            isSubmitting={isSubmitting}
          />
        )}
        
        {exercise.type === 'improve' && (
          <ImproveExercise 
            exercise={exercise} 
            lessonId={lessonId} 
            onSubmit={handleSubmitExercise}
          />
        )}
        
        {/* Add additional exercise types here */}
        
        {exercise.type !== 'true-false' && exercise.type !== 'improve' && (
          <div className="text-center text-muted-foreground py-4">
            This exercise type is not yet implemented.
          </div>
        )}
      </CardContent>
    </Card>
  )
}