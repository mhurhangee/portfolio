import { streamText } from 'ai'
import { runPreflightChecks } from '@/app/(ai)/lib/preflight-checks/preflight-checks'
import { handlePreflightError } from '@/app/(ai)/lib/preflight-checks/error-handler'
import { NextRequest, NextResponse } from 'next/server'
import { APP_CONFIG } from './config'

export const runtime = 'edge'
export const maxDuration = 60

// Config for the prompt rewriter


export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    
    // Get user ID from cookie or use a default
    const userId = req.cookies.get('user_token')?.value || 'anonymous'
    
    // Run preflight checks
    const preflightResult = await runPreflightChecks(userId, prompt)
    
    // If preflight checks fail, return the error
    if (!preflightResult.passed && preflightResult.result) {
      const errorResponse = handlePreflightError(preflightResult.result)
      return NextResponse.json(errorResponse, { status: 400 })
    }
    
    // If all checks pass, call the AI service
    const result = await streamText({
      model: APP_CONFIG.model,
      system: APP_CONFIG.systemPrompt,
      prompt,
      temperature: APP_CONFIG.temperature,
      maxTokens: APP_CONFIG.maxTokens,
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