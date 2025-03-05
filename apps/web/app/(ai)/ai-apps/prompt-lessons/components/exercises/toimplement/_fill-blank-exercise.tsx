// File to create at:
// /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/components/exercises/fill-blank-exercise.tsx

"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Exercise, ExerciseFeedback } from "../../schema"
import { CheckCircle, XCircle } from "lucide-react"

interface FillBlankExerciseProps {
  exercise: Exercise
  lessonId: string
  onSubmit: (exerciseId: string, answer: string) => Promise<ExerciseFeedback | undefined>
}

export default function FillBlankExercise({ exercise, lessonId, onSubmit }: FillBlankExerciseProps) {
  const [answers, setAnswers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<ExerciseFeedback | null>(null)
  
  // Extract blanks from the text (marked with ____ or similar)
  const textWithBlanks = exercise.statement || "This prompt needs _____ to be more effective."
  const blankCount = (textWithBlanks.match(/_{3,}/g) || []).length
  
  // Initialize answers array if not already done
  if (answers.length === 0 && blankCount > 0) {
    setAnswers(new Array(blankCount).fill(''))
  }
  
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }
  
  const handleSubmit = async () => {
    // Make sure all blanks are filled
    if (answers.some(a => !a.trim())) return
    
    setIsSubmitting(true)
    try {
      // Join the answers with a delimiter for API submission
      const combinedAnswer = answers.join('|--|')
      const result = await onSubmit(exercise.id, combinedAnswer)
      
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
    setAnswers(new Array(blankCount).fill(''))
    setFeedback(null)
  }
  
  // Render the exercise with input fields for blanks
  const renderExerciseWithInputs = () => {
    if (blankCount === 0) return <p>{textWithBlanks}</p>
    
    const parts = textWithBlanks.split(/_{3,}/g)
    return (
      <div className="space-y-2">
        {parts.map((part, index) => (
          <div key={index} className="inline">
            {part}
            {index < parts.length - 1 && (
              <Input
                className="inline-block w-32 mx-1 text-center"
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                disabled={isSubmitting || feedback !== null}
                placeholder="..."
              />
            )}
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md">
        {renderExerciseWithInputs()}
      </div>
      
      {feedback ? (
        <div className={`p-4 rounded-md ${feedback.isCorrect ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 'bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800'}`}>
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              {feedback.isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div className="space-y-2">
              <p className="font-medium">{feedback.isCorrect ? 'Correct!' : 'Not quite right'}</p>
              <p className="text-sm">{feedback.explanation}</p>
              
              {feedback.correctAnswer && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Correct answer:</p>
                  <p className="text-sm bg-background p-2 rounded-md mt-1">{feedback.correctAnswer}</p>
                </div>
              )}
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
        <Button 
          className="w-full mt-4" 
          disabled={answers.some(a => !a.trim()) || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Checking...' : 'Submit Answer'}
        </Button>
      )}
    </div>
  )
}