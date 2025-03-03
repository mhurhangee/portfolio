import { PreflightCheck, CheckResult } from '../types';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI();

// Categories that we may check for in the moderation response
const MODERATION_CATEGORIES = [
  'sexual', 'sexual/minors', 'harassment', 'harassment/threatening',
  'hate', 'hate/threatening', 'illicit', 'illicit/violent',
  'self-harm', 'self-harm/intent', 'self-harm/instructions',
  'violence', 'violence/graphic'
];

export const contentModerationCheck: PreflightCheck = {
  name: 'content_moderation',
  description: 'Checks content for policy violations using OpenAI moderation',
  run: async ({ lastMessage }: { lastMessage: string }): Promise<CheckResult> => {
    try {
      // Extract content for moderation
      const textToModerate = lastMessage;
      
      // Check if there's any content to moderate
      if (!textToModerate || textToModerate.trim().length === 0) {
        console.log('Content moderation: No content to moderate');
        return {
          passed: true,
          code: 'moderation_skipped',
          message: 'No content to moderate',
          severity: 'info'
        };
      }
      
      console.log(`Content moderation: Checking message with ${textToModerate.length} characters`);
      
      // Call OpenAI moderation API
      const moderation = await openai.moderations.create({
        model: "text-moderation-latest", // Using text moderation as default
        input: textToModerate
      });
      
      // Check if we have results
      if (!moderation.results || moderation.results.length === 0) {
        console.warn('Content moderation: No results returned from API');
        return {
          passed: false,
          code: 'moderation_no_results',
          message: 'Unable to verify content safety',
          severity: 'error'
        };
      }
      
      // At this point, we know moderation.results[0] exists
      const result = moderation.results[0];
      
      // Type assertion to help TypeScript understand this can't be undefined
      if (!result) {
        console.warn('Content moderation: Result is unexpectedly undefined');
        return {
          passed: false,
          code: 'moderation_no_results',
          message: 'Unable to verify content safety',
          severity: 'error'
        };
      }
      
      // Log the moderation results for debugging
      console.log('Content moderation results:', {
        flagged: result.flagged,
        categories: result.categories,
        scores: result.category_scores
      });
      
      // If content is flagged for any reason
      if (result.flagged) {
        // Get categories that were flagged
        const flaggedCategories = Object.entries(result.categories)
          .filter(([_, value]) => value)
          .map(([category, _]) => category);
        
        console.warn(`Content moderation: Content flagged in categories: ${flaggedCategories.join(', ')}`);
        
        return {
          passed: false,
          code: 'moderation_flagged',
          message: 'Content violates usage policies',
          details: {
            categories: flaggedCategories,
            // Including scores can be helpful for debugging
            scores: result.category_scores
          },
          severity: 'error'
        };
      }
      
      console.log('Content moderation: Content passed moderation check');
      
      // Content passed moderation
      return {
        passed: true,
        code: 'moderation_passed',
        message: 'Content passed moderation check',
        severity: 'info'
      };
    } catch (error) {
      console.error('Moderation check error:', error);
      
      // Fail safely - if moderation fails, we assume content might be problematic
      return {
        passed: false,
        code: 'moderation_error',
        message: 'Unable to verify content safety',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: 'error'
      };
    }
  }
};