// File: /home/mjh/front/apps/web/app/(ai)/ai-apps/prompt-lessons/app.tsx
"use client"

import { useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { motion } from "framer-motion"
import { PreflightError } from "@/app/(ai)/components/preflight-error"
import { getErrorDisplay } from "@/app/(ai)/lib/preflight-checks/error-handler"
import { container, item } from "@/lib/animation"
import { APP_CONFIG } from "./config"
import { lessons, getAllLessons } from "./lessons/lesson-data"
import { Lesson, LessonContent } from "./schema"
import LessonBrowser from "./components/lesson-browser"
import LessonContentView from "./components/lesson-content"

export default function PromptLessonsTool() {
    const [activeTab, setActiveTab] = useState("browse")
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
    const [lessonContent, setLessonContent] = useState<LessonContent | undefined>(undefined)
    const [error, setError] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentLessons, setCurrentLessons] = useState<Lesson[]>([])

    // Initialize lessons
    useEffect(() => {
        setCurrentLessons(getAllLessons())
    }, [])

    // Function to handle lesson selection and fetch lesson content
    const handleSelectLesson = async (lesson: Lesson) => {
        try {
            setSelectedLesson(lesson)
            setLessonContent(undefined)
            setError(null)
            setIsLoading(true)
            setActiveTab("lesson")

            console.log("Fetching lesson content for:", lesson.id)

            // Preflight check: Ensure lesson ID is valid
            if (!lesson?.id) {
                throw new Error("Invalid lesson ID");
            }

            try {
                const response = await fetch('/api/ai/prompt-lessons', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'getLesson',
                        lessonId: lesson.id
                    }),
                });

                if (!response.ok) {
                    console.log(response)
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || `Failed to fetch lesson content (${response.status})`);
                }

                const data = await response.json();
                console.log("API response:", data);

                // Check if the API returned an error
                if (data.error) {
                    throw new Error(data.error.message || 'An unknown error occurred');
                }

                // Ensure content exists in the response
                if (!data.content) {
                    throw new Error('API response missing lesson content');
                }

                setLessonContent(data.content);
                setIsLoading(false);

            } catch (apiError: any) {
                console.error("API error:", apiError);
                setError({
                    code: 'api_error',
                    message: apiError.message || 'Failed to generate lesson content',
                    severity: 'error'
                });
                setIsLoading(false);
            }

        } catch (err: any) {
            console.error("Failed to load lesson:", err)
            setError({
                code: 'api_error',
                message: err.message || 'An error occurred while loading the lesson',
                severity: 'error'
            })
            setIsLoading(false)
        }
    }

    // Function to handle going back to the browse view
    const handleBack = () => {
        setActiveTab("browse")
        setSelectedLesson(null)
        setLessonContent(undefined)
    }

    const errorConfig = error ? getErrorDisplay({
        passed: false,
        code: error.code,
        message: error.message,
        severity: error.severity,
        details: error.details
    }) : null

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={item} className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{APP_CONFIG.name}</h1>
                <p className="text-muted-foreground">
                    {APP_CONFIG.description}
                </p>
            </motion.div>

            <motion.div variants={item}>
                <Card className="overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                        <div className="px-6">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="browse" onClick={handleBack}>Browse Lessons</TabsTrigger>
                                <TabsTrigger value="lesson" disabled={!selectedLesson}>Active Lesson</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="browse" className="m-0">
                            <CardContent className="p-6">
                                {errorConfig && <PreflightError config={errorConfig} />}

                                <LessonBrowser
                                    lessons={lessons}
                                    selectedLesson={selectedLesson}
                                    onSelectLesson={handleSelectLesson}
                                />
                            </CardContent>
                        </TabsContent>

                        <TabsContent value="lesson" className="m-0">
                            <CardContent className="p-6">
                                {errorConfig && <PreflightError config={errorConfig} />}

                                {selectedLesson && (
                                    <LessonContentView
                                        lesson={selectedLesson}
                                        content={lessonContent}
                                        isLoading={isLoading}
                                    />
                                )}
                            </CardContent>

                            <div className="flex items-center justify-center mt-4 mb-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleBack}
                                    disabled={activeTab === 'browse'}
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Back to Lessons
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </Card>
            </motion.div>
        </motion.div>
    )
}