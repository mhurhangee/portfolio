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
  
  const handleSubmitExercise = async (exerciseId: string, answer: string): Promise<ExerciseFeedback | undefined> => {
    try {
      setError(null)
      
      // Here we would call the API to submit the exercise
      // For now, we'll simulate a response
      
      // Simulate API response based on exercise type
      if (exercise.type === 'true-false') {
        const userAnswerBool = answer === 'true'
        const isCorrect = userAnswerBool === exercise.isTrue
        
        return {
          isCorrect,
          feedback: isCorrect ? "That's correct!" : "That's not correct.",
          explanation: isCorrect 
            ? "You chose the right answer. Well done!"
            : `The statement "${exercise.statement}" is actually ${exercise.isTrue ? 'true' : 'false'}.`
        }
      }
      
      if (exercise.type === 'improve') {
        // For the improve type, simulate checking if the answer is better
        // This would normally be handled by the LLM
        const isImproved = answer.length > (exercise.prompt?.length || 0) * 1.5
        
        return {
          isCorrect: isImproved,
          feedback: isImproved ? "Great improvement!" : "Your prompt could be better.",
          explanation: isImproved 
            ? "You've added more specificity and detail to the prompt, which helps the AI understand what you want."
            : "Try adding more specific details and context to make your prompt clearer.",
          suggestedImprovement: isImproved ? undefined : "Consider adding specific details about what aspects of the topic you're interested in, and what format you want the information in."
        }
      }
      
      // For other exercise types, we'd handle them here
      
      setError("This exercise type is not yet supported.")
      return undefined
      
    } catch (error) {
      console.error("Error submitting exercise:", error)
      setError("An error occurred while submitting your answer. Please try again.")
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