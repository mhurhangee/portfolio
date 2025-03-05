"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Lesson } from "../schema"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@workspace/ui/components/select"
import { X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { allDifficulties, allCategories } from "../schema"

interface LessonBrowserProps {
  lessons: Lesson[]
  onSelectLesson: (lesson: Lesson) => void
  selectedLesson?: Lesson | null
}

export default function LessonBrowser({ lessons, onSelectLesson, selectedLesson }: LessonBrowserProps) {
  const [filter, setFilter] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Apply filters to lessons
  const filteredLessons = lessons.filter(lesson => {
    // Text search filter
    const matchesSearch = !filter || 
      lesson.title.toLowerCase().includes(filter.toLowerCase()) ||
      lesson.description.toLowerCase().includes(filter.toLowerCase())
    
    // Category filter
    const matchesCategory = !selectedCategory || lesson.category === selectedCategory
    
    // Difficulty filter
    const matchesDifficulty = !selectedDifficulty || lesson.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })
  
  // Clear all filters
  const clearFilters = () => {
    setFilter("")
    setSelectedCategory(null)
    setSelectedDifficulty(null)
  }
  
  // Check if any filters are active
  const hasActiveFilters = !!filter || !!selectedCategory || !!selectedDifficulty
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Find your next prompt engineering lesson</h2>
        <p className="text-muted-foreground">
          Select a lesson below and an AI will generate a lesson for you!
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Search and filter container */}
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Search input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search lessons..."
              className="w-full px-3 py-2 text-sm border rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          {/* Difficulty filter */}
          <div className="w-full md:w-48">
            <Select
              value={selectedDifficulty || "all"}
              onValueChange={(value) => setSelectedDifficulty(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {allDifficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Category filter */}
          <div className="w-full md:w-48">
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => setSelectedCategory(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Clear filters button */}
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={clearFilters}
              title="Clear all filters"
              className="h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {filter}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilter("")} 
                />
              </Badge>
            )}
            {selectedDifficulty && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Difficulty: {selectedDifficulty}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedDifficulty(null)} 
                />
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {selectedCategory}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedCategory(null)} 
                />
              </Badge>
            )}
          </div>
        )}
          
        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filteredLessons.length === 0 
            ? "No lessons found" 
            : `Showing ${filteredLessons.length} ${filteredLessons.length === 1 ? 'lesson' : 'lessons'}`}
          {hasActiveFilters && " with current filters"}
        </p>
      </div>
      
      {/* Lesson cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => (
          <Card 
            key={lesson.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedLesson?.id === lesson.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectLesson(lesson)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center justify-between">
                {lesson.title}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{lesson.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{lesson.difficulty}</Badge>
                <Badge variant="outline">{lesson.category}</Badge>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}