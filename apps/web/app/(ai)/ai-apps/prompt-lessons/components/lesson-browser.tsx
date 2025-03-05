// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/components/lesson-browser.tsx
"use client"

import { ChevronRight } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@workspace/ui/components/card"
import { Lesson } from "../schema"

interface LessonBrowserProps {
  lessons: Lesson[]
  activeFilter: string
  onFilterChange: (filterType: string, value: string) => void
  onSelectLesson: (lesson: Lesson) => void
}

export default function LessonBrowser({ 
  lessons, 
  activeFilter, 
  onFilterChange, 
  onSelectLesson 
}: LessonBrowserProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Filter Lessons</h3>
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={activeFilter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFilterChange("all", "")}
          >
            All
          </Badge>
          
          <Badge 
            variant={activeFilter === "difficulty-beginner" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFilterChange("difficulty", "beginner")}
          >
            Beginner
          </Badge>
          
          <Badge 
            variant={activeFilter === "difficulty-intermediate" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFilterChange("difficulty", "intermediate")}
          >
            Intermediate
          </Badge>
          
          <Badge 
            variant={activeFilter === "difficulty-advanced" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFilterChange("difficulty", "advanced")}
          >
            Advanced
          </Badge>
          
          <Badge 
            variant={activeFilter === "category-fundamentals" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFilterChange("category", "fundamentals")}
          >
            Fundamentals
          </Badge>
          
          <Badge 
            variant={activeFilter === "category-clarity" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFilterChange("category", "clarity")}
          >
            Clarity
          </Badge>
          
          <Badge 
            variant={activeFilter === "category-specificity" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFilterChange("category", "specificity")}
          >
            Specificity
          </Badge>
          
          <Badge 
            variant={activeFilter === "category-structure" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFilterChange("category", "structure")}
          >
            Structure
          </Badge>
          
          <Badge 
            variant={activeFilter === "category-context" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFilterChange("category", "context")}
          >
            Context
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Available Lessons</h3>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {lessons.map((lesson) => (
            <Card 
              key={lesson.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors" 
              onClick={() => onSelectLesson(lesson)}
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{lesson.title}</CardTitle>
                    <CardDescription className="mt-1">{lesson.description}</CardDescription>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex gap-2">
                  <Badge variant="outline">{lesson.difficulty}</Badge>
                  <Badge variant="outline">{lesson.category}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{lesson.estimatedTime}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}