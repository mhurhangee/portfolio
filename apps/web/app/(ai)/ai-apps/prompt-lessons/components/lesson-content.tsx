// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/components/lesson-content.tsx
"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Lesson, LessonContent } from "../schema"
import LessonExamples from "./lesson-examples"
import ExerciseWrapper from "./exercises/exercise-wrapper"

interface LessonContentViewProps {
  lesson: Lesson
  content: LessonContent
  isLoading: boolean
}

export default function LessonContentView({ 
  lesson, 
  content, 
  isLoading 
}: LessonContentViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-5/6 mx-auto"></div>
        </div>
        <p className="text-muted-foreground">Loading lesson content...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{lesson.title}</h2>
          <div className="flex gap-2">
            <Badge variant="outline">{lesson.difficulty}</Badge>
            <Badge variant="outline">{lesson.category}</Badge>
          </div>
        </div>
        <p className="text-muted-foreground">{lesson.description}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Introduction</h3>
        <p>{content.introduction}</p>
      </div>

      <LessonExamples examples={content.examples} />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Exercises</h3>
        <div className="space-y-6">
          {content.exercises.map((exercise) => (
            <ExerciseWrapper 
              key={exercise.id} 
              exercise={exercise} 
              lessonId={lesson.id} 
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Conclusion</h3>
        <p>{content.conclusion}</p>
      </div>
    </div>
  )
}