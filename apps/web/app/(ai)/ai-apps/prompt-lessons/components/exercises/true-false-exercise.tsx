// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/components/exercises/true-false-exercise.tsx
"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { CheckCircle, XCircle } from "lucide-react"
import { Exercise, ExerciseFeedback } from "../../schema"

interface TrueFalseExerciseProps {
  exercise: Exercise
  lessonId: string
  onSubmit: (exerciseId: string, answer: string) => Promise<ExerciseFeedback | undefined>
}

export default function TrueFalseExercise({ exercise, lessonId, onSubmit }: TrueFalseExerciseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<ExerciseFeedback | null>(null)
  
  const handleSubmit = async () => {
    if (selectedAnswer === null) return
    
    setIsSubmitting(true)
    try {
      // Convert boolean to string for API
      const answer = selectedAnswer ? "true" : "false"
      const result = await onSubmit(exercise.id, answer)
      
      if (result) {
        setFeedback(result)
      }
    } catch (error) {
      console.error("Error submitting exercise:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const resetExercise = () => {
    setSelectedAnswer(null)
    setFeedback(null)
  }
  
  if (!exercise.statement) {
    return <div>Error: This exercise is missing required content.</div>
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md">
        <p className="text-sm font-medium">{exercise.statement}</p>
      </div>
      
      {feedback ? (
        <div className={`p-4 rounded-md ${feedback.isCorrect ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'}`}>
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              {feedback.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="space-y-2">
              <p className="font-medium">{feedback.isCorrect ? 'Correct!' : 'Not quite right'}</p>
              <p className="text-sm">{feedback.explanation}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetExercise} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Button
              variant={selectedAnswer === true ? "default" : "outline"}
              className={`p-6 h-auto flex justify-center ${selectedAnswer === true ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedAnswer(true)}
              disabled={isSubmitting}
            >
              True
            </Button>
            <Button
              variant={selectedAnswer === false ? "default" : "outline"}
              className={`p-6 h-auto flex justify-center ${selectedAnswer === false ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedAnswer(false)}
              disabled={isSubmitting}
            >
              False
            </Button>
          </div>
          
          <Button 
            className="w-full mt-4" 
            disabled={selectedAnswer === null || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Checking...' : 'Submit Answer'}
          </Button>
        </>
      )}
    </div>
  )
}