import { PreflightCheck, PreflightParams, PreflightResult, CheckResult, Message } from './types';
import { inputLengthCheck } from './checks/input-length';

// Register all checks
const checks: PreflightCheck[] = [
  inputLengthCheck,
];

export async function runPreflightChecks(
  userId: string,
  input: string | Message[]
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

    // Run each check in sequence
    for (const check of checks) {
      const result = await check.run({ userId, messages, lastMessage });
      
      // If a check fails, return early with the result
      if (!result.passed) {
        return {
          passed: false,
          failedCheck: check.name,
          result: result
        };
      }
    }

    // All checks passed
    return { passed: true };
  } catch (error) {
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