"use client"

import { useState } from "react"
import { Send, RotateCcw, CheckCircle2, StopCircle, ClipboardCheck } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { motion } from "framer-motion"
import { PreflightError } from "@/app/(ai)/components/preflight-error"
import { getErrorDisplay } from "@/app/(ai)/lib/preflight-checks/error-handler"
import { container, item } from "@/lib/animation"
import { APP_CONFIG } from "./config"
import { type SummaryResponse} from "./schema"
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import ReactMarkdown from "react-markdown"

export default function KeywordExtractorTool() {
    const [activeTab, setActiveTab] = useState("text")
    const [userPrompt, setUserPrompt] = useState("")
    const [error, setError] = useState<any>(null)
    const [summaryResponse, setSummaryResponse] = useState<SummaryResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isAborted, setIsAborted] = useState(false)
    const [summaryType, setSummaryType] = useState("general")

    // Create a ref to store abort controller
    const abortControllerRef = React.useRef<AbortController | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userPrompt.trim()) return

        try {
            // When submitting, clear previous errors and set loading state
            setError(null)
            setIsLoading(true)
            setIsAborted(false)
            
            setActiveTab("summary")
            
            // Create a new AbortController for this request
            abortControllerRef.current = new AbortController()
            const signal = abortControllerRef.current.signal
            
            
            const response = await fetch(APP_CONFIG.apiRoute, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    summaryType,
                    userPrompt
                }),
                signal
            })
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || 'Failed to generate summary')
            }
            
            const data = await response.json()
            console.log(data)
            setSummaryResponse(data)
            
        } catch (err: any) {
            
            // Don't set error for aborted requests
            if (err.name === 'AbortError') {
                setIsAborted(true)
                return
            }
            
            setError({
                code: 'api_error',
                message: err.message || 'An error occurred during processing',
                severity: 'error',
                details: {}
            })
        } finally {
            setIsLoading(false)
            abortControllerRef.current = null
        }
    }

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            setIsAborted(true)
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setUserPrompt("")
        setActiveTab("text")
        setError(null)
        setSummaryResponse(null)
        setIsLoading(false)
        setIsAborted(false)
        
        // Abort any in-progress request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }
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
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <ClipboardCheck className="mr-2 h-5 w-5 text-primary" />
                            Summarise Text
                        </CardTitle>
                        <CardDescription>
                            Generate summaries of longer texts
                        </CardDescription>
                    </CardHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="px-6">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="text">Text to summarise</TabsTrigger>
                                <TabsTrigger value="summary" disabled={activeTab === "text" && !isLoading}>Summary</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="text" className="m-0 space-y-0">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            {errorConfig && <PreflightError config={errorConfig} />}

                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Summary Type</h3>
                                                <Select onValueChange={(value) => setSummaryType(value)}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select summary type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="general">General</SelectItem>
                                                        <SelectItem value="outline">Outline</SelectItem>
                                                        <SelectItem value="executive-summary">Executive Summary</SelectItem>
                                                        <SelectItem value="single-sentence">Single Sentence</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium">Your Text</h3>
                                                    <Textarea
                                                        withCounter
                                                        placeholder="Enter the text you want to summarise..."
                                                        className="min-h-[150px] resize-none pr-16"
                                                        value={userPrompt}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value.slice(0, 1000);
                                                            setUserPrompt(newValue);
                                                        }}
                                                        disabled={isLoading}
                                                        maxLength={1000}
                                                    />
                                                <p className="text-xs text-muted-foreground">
                                                    Enter the text from which you want to summarise.
                                                </p>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={!userPrompt.trim() || isLoading}
                                                className="w-full sm:w-auto"
                                            >
                                                {isLoading ? (
                                                    <>Generating summary...</>
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Generate Summary
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </CardContent>
                        </TabsContent>

                        <TabsContent value="summary" className="m-0 space-y-0">
                            {isLoading ? (
                                <div className="p-6">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="animate-pulse space-y-2">
                                            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                                            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                                            <div className="h-4 bg-muted rounded w-5/6 mx-auto"></div>
                                        </div>
                                        <p className="text-muted-foreground">Generating summary...</p>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={handleStop}
                                        >
                                            <StopCircle className="mr-2 h-4 w-4" />
                                            Stop Generation
                                        </Button>
                                    </div>
                                </div>
                            ) : isAborted ? (
                                <div className="p-6 text-center text-muted-foreground">
                                    <p>Summary generation was stopped. Submit a new text to continue.</p>
                                </div>
                            ) : !summaryResponse ? (
                                <div className="p-6 text-center text-muted-foreground">
                                    Submit a text to see generated summary here.
                                </div>
                            ) : (
                                <div className="p-6 space-y-4">
                                    <h3 className="text-lg font-medium flex items-center">
                                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                                        Generated Summary
                                    </h3>
                                    <div className="space-y-4">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Your summary</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="prose dark:prose-invert">
                                                        <ReactMarkdown>{summaryResponse.summary}</ReactMarkdown>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                    <CardFooter className="flex justify-between p-6 pt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            New Summary
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </motion.div>
    )
}