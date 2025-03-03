"use client"

import { useState, useCallback } from "react"
import { useCompletion } from "ai/react"
import { Sparkles, Send, RotateCcw, Clipboard, CheckCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"
import { motion } from "framer-motion"
import { PreflightError } from "@/app/(ai)/components/preflight-error"
import { getErrorDisplay } from "@/app/(ai)/lib/preflight-checks/error-handler"
import { container, item } from "@/lib/animation"

export default function PromptRewriter() {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<any>(null)
  
  const { 
    completion, 
    input, 
    isLoading, 
    handleInputChange, 
    handleSubmit, 
    setCompletion, 
    setInput,
    stop
  } = useCompletion({
    api: '/api/ai/prompt-rewriter',
    onError: (error) => {
      console.error('Completion error:', error)
      // Handle API errors
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
  })

  const handleCopy = useCallback(() => {
    if (completion) {
      navigator.clipboard.writeText(completion)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [completion])

  const handleReset = useCallback(() => {
    setInput('')
    setCompletion('')
    setError(null)
  }, [setInput, setCompletion])

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
        <h1 className="text-3xl font-bold tracking-tight">Prompt Rewriter</h1>
        <p className="text-muted-foreground">
          Improve your prompts to get better results from AI systems.
        </p>
      </motion.div>
      
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Enhance Your Prompt
            </CardTitle>
            <CardDescription>
              Enter your prompt and we'll rewrite it to be more effective with AI systems.
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
              
              <form onSubmit={handleSubmit} className="grid gap-4">
                <Textarea
                  placeholder="Enter your prompt here..."
                  className="min-h-32 resize-none"
                  value={input}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Rewrite Prompt
                      </>
                    )}
                  </Button>
                </div>
              </form>
              
              {completion && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Improved Prompt:</h3>
                  <div className="bg-muted p-4 rounded-md relative">
                    <div className="whitespace-pre-wrap">{completion}</div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={handleCopy} 
                        className="h-8 w-8"
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clipboard className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <p className="text-xs text-muted-foreground">
              Rewrites improve clarity, specificity, and structure.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  )
}