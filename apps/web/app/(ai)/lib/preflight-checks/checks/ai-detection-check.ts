import { PreflightCheck, CheckResult } from '../types';
import { analyzeContent } from './ai-detection';

export const aiContentAnalysisCheck: PreflightCheck = {
  name: 'ai_content_analysis',
  description: 'Uses AI to analyze content for various issues including jailbreak attempts, ethical concerns, and more',
  run: async ({ lastMessage }) => {
    try {
      // Check if there's any content to analyze
      if (!lastMessage || lastMessage.trim().length === 0) {
        return {
          passed: true,
          code: 'content_analysis_skipped',
          message: 'No content to analyze',
          severity: 'info'
        };
      }
         
      // Use AI to analyze the message across multiple dimensions
      const analysis = await analyzeContent(lastMessage);
           
      // If the AI determines the content is not safe to process
      if (!analysis.overall.safeToProcess) {
        console.warn(`Content flagged as unsafe: ${analysis.overall.primaryReason}`);
        
        // Determine the most appropriate failure code based on the analysis
        let code = 'content_unsafe';
        let severity: 'warning' | 'error' = 'error';
        
        if (analysis.jailbreak.isAttempt && analysis.jailbreak.confidence > 0.6) {
          code = 'jailbreak_attempt';
        } else if (analysis.ethical.hasConcerns && analysis.ethical.level !== 'low') {
          code = 'ethical_concerns';
        } else if (analysis.copyright.potentialIssue && analysis.copyright.contentType === 'likely_copyrighted') {
          code = 'copyright_concerns';
          severity = 'warning'; // We might want to warn but not block for copyright
        } else if (analysis.sentiment.label === 'negative' && analysis.sentiment.score < -0.7) {
          code = 'extremely_negative';
          severity = 'warning'; // Negative content is a warning, not a block
        }
        
        return {
          passed: false,
          code,
          message: 'Content analysis detected potential issues',
          details: {
            reason: analysis.overall.primaryReason,
            // Include key details but not everything to prevent revealing too much
            jailbreakConfidence: analysis.jailbreak.isAttempt ? analysis.jailbreak.confidence : 0,
            ethicalLevel: analysis.ethical.hasConcerns ? analysis.ethical.level : 'none',
            sentimentScore: analysis.sentiment.score
          },
          severity
        };
      }
      
      // If it passed overall but has some potential concerns worth logging
      if (analysis.jailbreak.confidence > 0.3 || 
          analysis.ethical.level === 'low' || 
          analysis.sentiment.score < -0.5) {
        console.warn('Content passed but has potential concerns worth monitoring');
      }
      
      // All checks passed
      return {
        passed: true,
        code: 'content_analysis_passed',
        message: 'Content analysis found no significant issues',
        details: {
          sentimentLabel: analysis.sentiment.label,
          relevanceScore: analysis.relevance.score
        },
        severity: 'info'
      };
    } catch (error) {
      console.error('AI content analysis error:', error);
      
      // In case of error, we should still allow the content through
      // but log a warning since the analysis failed
      return {
        passed: true,
        code: 'content_analysis_error',
        message: 'Error in content analysis, proceeding with caution',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: 'warning'
      };
    }
  }
};