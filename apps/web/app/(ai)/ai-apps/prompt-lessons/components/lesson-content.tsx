"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Lesson, LessonContent } from "../schema"
import LessonExamples from "./lesson-examples"
import ExerciseWrapper from "./exercises/exercise-wrapper"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

interface LessonContentViewProps {
  lesson: Lesson
  content?: LessonContent
  isLoading: boolean
}

export default function LessonContentView({ 
  lesson, 
  content, 
  isLoading 
}: LessonContentViewProps) {
  if (isLoading || !content) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Lesson header skeleton */}
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-7 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        
        {/* Introduction skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </div>
        
        {/* Examples skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[92%]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[88%]" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Exercises skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center justify-center py-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating lesson content...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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