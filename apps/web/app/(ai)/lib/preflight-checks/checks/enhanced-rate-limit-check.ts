import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { PreflightCheck } from '../types';

// Initialize Redis and Ratelimit
const redis = Redis.fromEnv();

// Create a separate instance for tracking warnings
const warningTracker = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 warnings per hour
  analytics: true,
  prefix: 'ratelimit:warning:',
});

// Enhanced rate limiter with IP protection
const ipRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 h'), // 50 requests per hour per IP
  analytics: true,
  prefix: 'ratelimit:ip:',
  enableProtection: true, // Enable the built-in IP deny list
});

export const enhancedRateLimitCheck: PreflightCheck = {
  name: 'enhanced_rate_limit',
  description: 'Enhanced rate limiting with IP protection and warning tracking',
  run: async ({ lastMessage, ip = 'unknown', userAgent = 'unknown' }) => {
    try {
      // Skip check if there's no content to process
      if (!lastMessage || lastMessage.trim().length === 0) {
        return {
          passed: true,
          code: 'enhanced_rate_limit_skipped',
          message: 'No content to check',
          severity: 'info'
        };
      }
      
      // First check if this IP is already in timeout from too many warnings
      const warningStatus = await warningTracker.limit(`${ip}`);
      
      // If there are no more warnings allowed, put them in timeout
      if (!warningStatus.success) {
        console.warn(`IP ${ip} has exceeded warning limit and is in timeout`);
        
        const resetDate = new Date(warningStatus.reset);
        const timeRemaining = Math.ceil((resetDate.getTime() - Date.now()) / 1000 / 60);
        
        return {
          passed: false,
          code: 'warning_timeout',
          message: 'Too many content warnings, please try again later',
          details: {
            resetInMinutes: timeRemaining,
            resetAt: resetDate.toISOString(),
          },
          severity: 'error'
        };
      }
      
      // Next, check the IP rate limit
      const ipStatus = await ipRateLimiter.limit(`${ip}`, {
        ip,
        userAgent,
      });
      
      // Wait for any pending tasks to complete
      await ipStatus.pending;
      
      if (!ipStatus.success) {
        console.warn(`IP rate limit exceeded for ${ip}`);
        
        // Check if the request was denied because it's in a deny list
        if (ipStatus.reason === 'denyList') {
          return {
            passed: false,
            code: 'ip_denied',
            message: 'Access denied',
            severity: 'error'
          };
        }
        
        const resetDate = new Date(ipStatus.reset);
        const timeRemaining = Math.ceil((resetDate.getTime() - Date.now()) / 1000 / 60);
        
        return {
          passed: false,
          code: 'ip_rate_limited',
          message: 'Rate limit exceeded',
          details: {
            resetInMinutes: timeRemaining,
            resetAt: resetDate.toISOString(),
            remaining: 0,
            limit: ipStatus.limit
          },
          severity: 'error'
        };
      }
      
      return {
        passed: true,
        code: 'enhanced_rate_limit_passed',
        message: 'Rate limit check passed',
        details: {
          remaining: ipStatus.remaining,
          limit: ipStatus.limit
        },
        severity: 'info'
      };
    } catch (error) {
      console.error('Enhanced rate limit error:', error);
      
      // In case of error, we should still allow the content through
      return {
        passed: true,
        code: 'enhanced_rate_limit_error',
        message: 'Error in rate limit check, proceeding with caution',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: 'warning'
      };
    }
  }
};

// Function to increment warning count for an IP
export async function incrementWarningCount(ip: string): Promise<void> {
  try {
    // Only increment if IP is provided
    if (!ip || ip === 'unknown') return;
    
    const warningStatus = await warningTracker.limit(ip);
    console.log(`Warning count for ${ip}: ${warningStatus.limit - warningStatus.remaining}/${warningStatus.limit}`);
    
    // Wait for any pending tasks to complete
    await warningStatus.pending;
  } catch (error) {
    console.error('Error incrementing warning count:', error);
  }
}

// Function to add an IP to the deny list (use sparingly)
export async function addToDenyList(ip: string): Promise<void> {
  try {
    // This would need to be implemented via Upstash dashboard or API
    // For a demo, you could consider implementing a local deny list
    console.warn(`IP ${ip} should be added to the deny list`);
  } catch (error) {
    console.error('Error adding to deny list:', error);
  }
}