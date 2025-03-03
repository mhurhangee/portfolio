import { PreflightCheck } from '../types';
import { francAll } from 'franc';
import englishWords from 'an-array-of-english-words';

const commonEnglishWords = new Set(englishWords);

// Common English phrases and patterns that should always pass
const COMMON_ENGLISH_PATTERNS = [
  /^(write|create|generate|explain|help|tell|show)/i,
  /\b(code|function|api|app|application|website|blog|article)\b/i,
  /\b(i need|i want|i would like|can you|please)\b/i,
  /\b(this is|that is|it is|what is|how to)\b/i
];

export const languageCheck: PreflightCheck = {
  name: 'language_check',
  description: 'Checks if the input is in English language',
  run: async ({ lastMessage }) => {
    try {
      if (!lastMessage || lastMessage.trim().length === 0) {
        return {
          passed: true,
          code: 'language_check_skipped',
          message: 'No content to check',
          severity: 'info'
        };
      }
      
      // Check for common English patterns first (quick win)
      for (const pattern of COMMON_ENGLISH_PATTERNS) {
        if (pattern.test(lastMessage)) {
          return {
            passed: true,
            code: 'language_check_pattern_match',
            message: 'Common English pattern detected',
            severity: 'info'
          };
        }
      }
      
      const words = lastMessage.toLowerCase().split(/\s+/).filter(w => w.length > 1);
      
      // Be more lenient with short inputs (1-5 words)
      if (words.length <= 5) {
        return { 
          passed: true, 
          code: 'language_check_short_input',
          message: 'Input too short for reliable language detection',
          severity: 'info'
        };
      }

      // For longer texts, use francAll
      const langOptions = francAll(lastMessage);
      const topLangs = langOptions.slice(0, 2);
      
      // Consider 'eng' (English), 'sco' (Scots), or 'und' (undetermined) as valid
      const validLangs = ['eng', 'sco', 'und'];
      
      // Check if any of the top 2 detected languages are in our valid list
      if (topLangs.some(lang => validLangs.includes(lang[0]))) {
        return {
          passed: true,
          code: 'language_check_valid_lang',
          message: 'Valid language detected',
          severity: 'info' 
        };
      }
      
      // If not clearly English, check for a significant presence of English words
      const englishWordCount = words.filter(word => commonEnglishWords.has(word)).length;
      
      if (englishWordCount / words.length >= 0.3) { // 30% threshold
        return {
          passed: true,
          code: 'language_check_english_words',
          message: 'Sufficient English words detected',
          severity: 'info'
        };
      }

      // If still not detected as English, fail the check
      return {
        passed: false,
        code: 'non_english_language',
        message: 'Only English language is supported',
        details: {
          detectedLanguage: topLangs[0]?.[0] || 'unknown',
          confidence: topLangs[0]?.[1] || 0
        },
        severity: 'error'
      };
    } catch (error) {
      console.error('Language check error:', error);
      
      // In case of error, allow the content through
      return {
        passed: true,
        code: 'language_check_error',
        message: 'Error in language detection, proceeding with caution',
        severity: 'warning'
      };
    }
  }
};