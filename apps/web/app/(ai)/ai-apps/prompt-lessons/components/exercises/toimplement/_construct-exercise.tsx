// File to create at:
// /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/components/exercises/construct-exercise.tsx

"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Exercise, ExerciseFeedback } from "../../schema"
import { CheckCircle, XCircle, Lightbulb } from "lucide-react"

interface ConstructExerciseProps {
  exercise: Exercise
  lessonId: string
  onSubmit: (exerciseId: string, answer: string) => Promise<ExerciseFeedback | undefined>
}

export default function ConstructExercise({ exercise, lessonId, onSubmit }: ConstructExerciseProps) {
  const [prompt, setPrompt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<ExerciseFeedback | null>(null)
  const [showHint, setShowHint] = useState(false)
  
  const handleSubmit = async () => {
    if (!prompt.trim()) return
    
    setIsSubmitting(true)
    try {
      const result = await onSubmit(exercise.id, prompt)
      
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
    setPrompt("")
    setFeedback(null)
    setShowHint(false)
  }
  
  const toggleHint = () => {
    setShowHint(!showHint)
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-muted p-3 rounded-md">
        <p className="text-sm">{exercise.instructions}</p>
        
        {exercise.statement && (
          <div className="mt-3 p-2 bg-background rounded border">
            <p className="text-sm font-medium">Scenario:</p>
            <p className="text-sm mt-1">{exercise.statement}</p>
          </div>
        )}
      </div>
      
      {exercise.hints && exercise.hints.length > 0 && (
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleHint}
            className="flex items-center"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            {showHint ? "Hide Hint" : "Show Hint"}
          </Button>
          
          {showHint && (
            <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded-md text-sm">
              {exercise.hints.map((hint, index) => (
                <p key={index} className="mt-1 first:mt-0">{hint}</p>
              ))}
            </div>
          )}
        </div>
      )}
      
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
                <p className="font-medium">
                  {feedback.isCorrect 
                    ? 'Excellent work!' 
                    : 'Good attempt, but your prompt could be improved'
                  }
                </p>
              </div>
            </div>
            
            <div className="bg-background p-3 rounded-md border">
              <p className="text-sm font-medium">Your prompt:</p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{prompt}</p>
            </div>
            
            <div className="text-sm space-y-2">
              <p>{feedback.explanation}</p>
              
              {feedback.correctAnswer && !feedback.isCorrect && (
                <div className="mt-3">
                  <p className="font-medium">Example of a strong prompt:</p>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-md mt-1">
                    <p className="whitespace-pre-wrap">{feedback.correctAnswer}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
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
            className="w-full min-h-[150px] p-3 border rounded-md bg-background" 
            placeholder="Construct your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isSubmitting}
          />
          
          <Button 
            className="w-full" 
            disabled={!prompt.trim() || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Prompt'}
          </Button>
        </>
      )}
    </div>
  )
}