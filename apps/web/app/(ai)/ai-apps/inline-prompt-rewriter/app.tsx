"use client"

import { useState, useCallback, useRef } from "react"
import { Send, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"
import { motion } from "framer-motion"
import { PreflightError } from "@/app/(ai)/components/preflight-error"
import { getErrorDisplay } from "@/app/(ai)/lib/preflight-checks/error-handler"
import { container, item } from "@/lib/animation"
import { APP_CONFIG } from "./config"
import React from "react"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"

export default function InlinePromptRewriterTool() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  const handleSubmit = async (action: 'improve' | 'generate') => {
    if (!prompt.trim()) return
    
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Create a new abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(APP_CONFIG.apiRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          prompt
        }),
        signal: abortController.signal
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }
      
      const data = await response.json()
      
      if (action === 'improve') {
        setPrompt(data.text)
        toast.success("Prompt improved successfully!")
      } else {
        setResponse(data.text)
      }
    } catch (error: any) {
      console.error('Error:', error)
      
      // Only set error if it's not an abort error
      if (error.name !== 'AbortError') {
        try {
          // Parse error message from the API
          const errorData = JSON.parse(error.message)
          setError({
            code: errorData.code,
            message: errorData.message,
            severity: errorData.severity || 'error',
            details: errorData.details
          })
        } catch (e) {
          // Fallback for unparseable errors
          setError({
            code: 'unknown_error',
            message: error.message,
            severity: 'error',
            details: {}
          })
        }
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    }
  }

  const handleReset = useCallback(() => {
    setPrompt('')
    setResponse('')
    setError(null)
    
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }, [])

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {APP_CONFIG.icon && React.cloneElement(APP_CONFIG.icon as React.ReactElement, { className: "mr-2 h-5 w-5 text-primary" })}
              Enhance Your Prompt
            </CardTitle>
            <CardDescription>
              Enter your prompt, improve it inline, or generate a response.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {errorConfig && (
                <PreflightError 
                  config={errorConfig} 
                  onClose={() => setError(null)} 
                />
              )}
              
              <div className="grid gap-4">
                <div className="relative">
                  <Textarea
                    withCounter
                    maxLength={1000}
                    placeholder="Enter your prompt here..."
                    className="min-h-32 resize-none pr-10"
                    value={prompt}
                    onChange={handlePromptChange}
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => handleSubmit('improve')}
                    disabled={isLoading || !prompt.trim()}
                    title="Improve Prompt"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button 
                    onClick={() => handleSubmit('generate')} 
                    disabled={isLoading || !prompt.trim()}
                  >
                    {isLoading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Generate Response
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {response && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Response:</h3>
                  <div className="p-4 rounded-md">
                    <div className="prose dark:prose-invert"><ReactMarkdown>{response}</ReactMarkdown></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Click the sparkles icon to improve your prompt inline, or generate a response.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  )
}