import { streamText } from 'ai'
import { runPreflightChecks } from '@/lib/ai/preflight-checks/preflight-checks'
import { handlePreflightError } from '@/lib/ai/preflight-checks/error-handler'
import { NextRequest, NextResponse } from 'next/server'
import { LLM_CONFIG } from './config'
import { Message } from '@/lib/ai/preflight-checks/types'

export const runtime = 'edge'
export const maxDuration = 60

// Config for the prompt rewriter
const SYSTEM_PROMPT = `You are an expert prompt engineer who helps users write better prompts for AI systems.
Your task is to rewrite the user's prompt to make it more effective, clear, specific, and well-structured.

When rewriting prompts:
1. Improve clarity and reduce ambiguity
2. Add necessary context and specificity
3. Structure the prompt in a logical way
4. Remove unnecessary fluff or verbosity
5. Ensure the prompt has clear instructions

Return only the rewritten prompt without explanation, commentary, or surrounding text.`

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    
    // Create a standard message format for preflight checks
    const messages: Message[] = [
      { role: 'user' as const, content: prompt }
    ]
    
    // Get user ID from cookie or use a default
    const userId = req.cookies.get('user_token')?.value || 'anonymous'
    
    // Run preflight checks
    const preflightResult = await runPreflightChecks(userId, messages)
    
    // If preflight checks fail, return the error
    if (!preflightResult.passed && preflightResult.result) {
      const errorResponse = handlePreflightError(preflightResult.result)
      return NextResponse.json(errorResponse, { status: 400 })
    }
    
    // If all checks pass, call the AI service
    const result = await streamText({
      model: LLM_CONFIG.MODEL,
      system: SYSTEM_PROMPT,
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })
    
    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error in prompt rewriter API:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request', code: 'internal_error' },
      { status: 500 }
    )
  }
}