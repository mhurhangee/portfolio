import { PreflightCheck, PreflightResult, Message } from './types';
import { inputLengthCheck } from './checks/input-length';
import { rateLimitGlobalCheck } from './checks/rate-limit-global';
import { rateLimitUserCheck } from './checks/rate-limit-user';
import { contentModerationCheck } from './checks/content-moderation';
import { blacklistedKeywordsCheck } from './checks/blacklist-keywords';
import { aiContentAnalysisCheck } from './checks/ai-detection-check';
import { languageCheck } from './checks/language-check';
import { inputSanitizationCheck } from './checks/input-sanitization-check';
//import { enhancedRateLimitCheck } from './checks/enhanced-rate-limit-check';

// Organize checks into tiers for better performance
const tier1Checks: PreflightCheck[] = [
  inputLengthCheck, // Very fast, basic validation
  inputSanitizationCheck, // Protect against script injection
  blacklistedKeywordsCheck, // Check for blacklisted terms
  languageCheck, // Only allow English content
  //enhancedRateLimitCheck, // IP-based protection
];

const tier2Checks: PreflightCheck[] = [
  rateLimitGlobalCheck, // Check global rate limit
  rateLimitUserCheck, // Check user-specific rate limit
];

const tier3Checks: PreflightCheck[] = [
  contentModerationCheck, // OpenAI moderation API
];

const tier4Checks: PreflightCheck[] = [
  aiContentAnalysisCheck, // More expensive AI analysis
];

// Run checks from a specific tier
async function runTierChecks(
  userId: string, 
  messages: Message[],
  lastMessage: string,
  checks: PreflightCheck[],
  ip?: string,
  userAgent?: string
): Promise<PreflightResult | null> {
  for (const check of checks) {
    const result = await check.run({ userId, messages, lastMessage, ip, userAgent });
    
    if (!result.passed) {
      // For certain codes related to content issues, increment the warning counter
      if (
        ['blacklisted_keywords', 'moderation_flagged', 'ethical_concerns', 'extremely_negative']
          .includes(result.code) && ip && ip !== 'unknown'
      ) {
        try {
          // Import here to avoid circular dependencies
          const { incrementWarningCount } = await import('./checks/enhanced-rate-limit-check');
          await incrementWarningCount(ip);
        } catch (error) {
          console.error('Failed to increment warning count:', error);
        }
      }
      
      return {
        passed: false,
        failedCheck: check.name,
        result
      };
    }
  }
  
  return null; // All checks passed
}


export async function runPreflightChecks(
  userId: string,
  input: string | Message[],
  ip?: string,
  userAgent?: string
): Promise<PreflightResult> {
  try {
    // Extract the last message or use the input directly if it's a string
    let messages: Message[] = [];
    let lastMessage = '';

    if (typeof input === 'string') {
      // If input is a string, create a single user message
      lastMessage = input;
      messages = [{
        role: 'user' as const,
        content: input
      }];
    } else {
      // If input is an array of messages, extract the last user message
      messages = input;
      const userMessages = messages.filter(m => m.role === 'user');
      // Check if there are any user messages before accessing the last one
      const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
      if (lastUserMessage) {
        lastMessage = lastUserMessage.content;
      }
    }

    // Safety check - if no lastMessage was extracted, provide a default value
    if (!lastMessage) {
      return {
        passed: false,
        failedCheck: 'empty_input',
        result: {
          passed: false,
          code: 'empty_input',
          message: 'No valid user message provided',
          severity: 'error'
        }
      };
    }

    // Update these calls to pass ip and userAgent
    const tier1Result = await runTierChecks(userId, messages, lastMessage, tier1Checks, ip, userAgent);
    if (tier1Result) return tier1Result;

    const tier2Result = await runTierChecks(userId, messages, lastMessage, tier2Checks, ip, userAgent);
    if (tier2Result) return tier2Result;

    const tier3Result = await runTierChecks(userId, messages, lastMessage, tier3Checks, ip, userAgent);
    if (tier3Result) return tier3Result;

    const tier4Result = await runTierChecks(userId, messages, lastMessage, tier4Checks, ip, userAgent);
    if (tier4Result) return tier4Result;

    // All checks passed
    return { passed: true };
  } catch (error) {
    console.error('Unexpected error in preflight checks:', error);

    // Handle any errors that occurred during checks
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during preflight checks';

    return {
      passed: false,
      failedCheck: 'system_error',
      result: {
        passed: false,
        code: 'system_error',
        message: errorMessage,
        severity: 'error'
      }
    };
  }
}