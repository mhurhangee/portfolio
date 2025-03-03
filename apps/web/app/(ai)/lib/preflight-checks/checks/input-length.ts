import { PreflightCheck, CheckResult } from '../types';

export const inputLengthCheck: PreflightCheck = {
  name: 'input_length',
  description: 'Checks if the input meets the length requirements',
  run: async ({ lastMessage }) => {
    const minLength = 4;
    const maxLength = 1000;
    
    if (!lastMessage || lastMessage.trim().length < minLength) {
      return {
        passed: false,
        code: 'input_too_short',
        message: 'Input is too short',
        details: { minLength, actualLength: lastMessage?.length || 0 },
        severity: 'info'
      };
    }
    
    if (lastMessage.length > maxLength) {
      return {
        passed: false,
        code: 'input_too_long',
        message: 'Input exceeds maximum length',
        details: { maxLength, actualLength: lastMessage.length },
        severity: 'info'
      };
    }
    
    return {
      passed: true,
      code: 'input_length_valid',
      message: 'Input length is valid',
      severity: 'info'
    };
  }
};