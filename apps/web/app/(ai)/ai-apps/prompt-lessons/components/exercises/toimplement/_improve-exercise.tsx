// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/components/exercises/improve-exercise.tsx
"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Exercise, ExerciseFeedback } from "../../schema"
import { CheckCircle, XCircle } from "lucide-react"

interface ImproveExerciseProps {
  exercise: Exercise
  lessonId: string
  onSubmit: (exerciseId: string, answer: string) => Promise<ExerciseFeedback | undefined>
}

export default function ImproveExercise({ exercise, lessonId, onSubmit }: ImproveExerciseProps) {
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<ExerciseFeedback | null>(null)
  
  const handleSubmit = async () => {
    if (!answer.trim()) return
    
    setIsSubmitting(true)
    try {
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
    setAnswer("")
    setFeedback(null)
  }
  
  if (!exercise.prompt) {
    return <div>Error: This exercise is missing required content.</div>
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-muted p-3 rounded-md">
        <p className="text-sm">{exercise.prompt}</p>
      </div>
      
      {feedback ? (
        <div className={`p-4 rounded-md ${feedback.isCorrect ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 'bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800'}`}>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                {feedback.isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div>
                <p className="font-medium">{feedback.isCorrect ? 'Great job!' : 'Good attempt, but it could be better'}</p>
              </div>
            </div>
            
            <div className="text-sm space-y-2">
              <p>{feedback.explanation}</p>
              {feedback.suggestedImprovement && (
                <div>
                  <p className="font-medium mt-2">Suggested improvement:</p>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-md mt-1">
                    <p>{feedback.suggestedImprovement}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetExercise} 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Textarea 
            className="w-full min-h-[100px] p-3 border rounded-md bg-background" 
            placeholder="Write your improved prompt here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitting}
          />
          
          <Button 
            className="w-full" 
            disabled={!answer.trim() || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </>
      )}
    </div>
  )
}