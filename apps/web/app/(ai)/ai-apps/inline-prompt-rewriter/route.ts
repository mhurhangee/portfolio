import { generateText } from 'ai'
import { runPreflightChecks } from '@/app/(ai)/lib/preflight-checks/preflight-checks'
import { handlePreflightError } from '@/app/(ai)/lib/preflight-checks/error-handler'
import { NextRequest, NextResponse } from 'next/server'
import { APP_CONFIG } from './config'
import { getUserInfo } from '../../lib/user-identification';

export const runtime = 'edge'
export const maxDuration = 60


export async function POST(req: NextRequest) {
  try {
    const { prompt, action } = await req.json()
    
    // Get user information from request including ID, IP, and user agent
    const { userId, ip, userAgent } = await getUserInfo(req);
    
    // Run preflight checks with full user context
    const preflightResult = await runPreflightChecks(userId, prompt, ip, userAgent)
    
    // If preflight checks fail, return the error
    if (!preflightResult.passed && preflightResult.result) {
      const errorResponse = handlePreflightError(preflightResult.result)
      return NextResponse.json(errorResponse, { status: 400 })
    }
    let systemPrompt = ''

    if (action === 'improve') {
        systemPrompt += APP_CONFIG.systemPrompt
    } else if (action === 'generate') {
        systemPrompt += 'You are a helpful assistant.'
    }
    
    // If all checks pass, call the AI service
    const result = await generateText({
      model: APP_CONFIG.model,
      system: systemPrompt,
      prompt,
      temperature: APP_CONFIG.temperature,
      maxTokens: APP_CONFIG.maxTokens,
    })
    
    return Response.json({ text: result.text })
  } catch (error) {
    console.error('Error in prompt rewriter API:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request', code: 'internal_error' },
      { status: 500 }
    )
  }
}