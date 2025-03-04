import { PreflightCheck } from '../types';

export const inputSanitizationCheck: PreflightCheck = {
  name: 'input_sanitization',
  description: 'Checks and sanitizes input for potentially dangerous patterns',
  run: async ({ lastMessage }) => {
    try {
      if (!lastMessage || lastMessage.trim().length === 0) {
        return {
          passed: true,
          code: 'sanitization_skipped',
          message: 'No content to sanitize',
          severity: 'info'
        };
      }
      
      // Check for potentially malicious patterns
      const containsScript = /<script|javascript:|onerror=|onclick=|onload=/i.test(lastMessage);
      const containsSQLi = /(\s|;)(select|insert|update|delete|drop|alter|create)\s/i.test(lastMessage);
      
      if (containsScript) {
        console.warn('Input sanitization: Potential XSS detected');
        return {
          passed: false,
          code: 'potential_xss',
          message: 'Input contains potentially unsafe script elements',
          severity: 'error'
        };
      }
      
      if (containsSQLi) {
        console.warn('Input sanitization: Potential SQL injection pattern detected');
        return {
          passed: false,
          code: 'potential_sqli',
          message: 'Input contains potentially unsafe SQL patterns',
          severity: 'error'
        };
      }
      
      return {
        passed: true,
        code: 'sanitization_passed',
        message: 'Input appears safe',
        severity: 'info'
      };
    } catch (error) {
      console.error('Input sanitization error:', error);
      
      // In case of error, block the content as a precaution
      return {
        passed: false,
        code: 'sanitization_error',
        message: 'Error in input sanitization',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: 'error'
      };
    }
  }
};