// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/components/exercises.tsx
"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Loader2, RefreshCw } from "lucide-react"
import { Exercise, Lesson, LessonContent } from "../schema"
import ExerciseWrapper from "./exercises/exercise-wrapper"

interface ExercisesProps {
  lesson: Lesson
  content: LessonContent
}

export default function Exercises({ lesson, content }: ExercisesProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateExercises = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/ai/prompt-lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateExercises',
          lessonId: lesson.id,
          count: 3 // Request 3 exercises initially
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to generate exercises')
      }

      const data = await response.json()
      
      if (!data || !Array.isArray(data.exercises) || data.exercises.length === 0) {
        throw new Error('No exercises were generated')
      }
      
      setExercises(data.exercises)
    } catch (error: any) {
      console.error("Error generating exercises:", error)
      setError(error.message || "Failed to generate exercises")
    } finally {
      setIsLoading(false)
    }
  }

  const generateMoreExercises = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/ai/prompt-lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateExercises',
          lessonId: lesson.id,
          count: 2, // Request 2 additional exercises
          existingExerciseIds: exercises.map(ex => ex.id) // To avoid duplicates
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to generate more exercises')
      }

      const data = await response.json()
      
      if (!data || !Array.isArray(data.exercises) || data.exercises.length === 0) {
        throw new Error('No additional exercises were generated')
      }
      
      setExercises([...exercises, ...data.exercises])
    } catch (error: any) {
      console.error("Error generating more exercises:", error)
      setError(error.message || "Failed to generate more exercises")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 mt-8">
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Practice Exercises</h3>
        
        {exercises.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Ready to practice what you've learned? Generate interactive exercises to test your prompt engineering skills.
            </p>
            <Button 
              onClick={generateExercises} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Exercises...
                </>
              ) : (
                "Generate Exercises"
              )}
            </Button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-6">
              {exercises.map((exercise) => (
                <ExerciseWrapper 
                  key={exercise.id} 
                  exercise={exercise} 
                  lessonId={lesson.id} 
                />
              ))}
            </div>
            
            <div className="text-center pt-4">
              <Button 
                variant="outline" 
                onClick={generateMoreExercises} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating More...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate More Exercises
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}