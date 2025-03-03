import { PreflightCheck, CheckResult } from '../types';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { formatTimeRemaining } from '../utils';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(20, '1 h'),  // 20 requests per hour per user
  analytics: true,
  prefix: 'ratelimit:user',
});

export const rateLimitUserCheck: PreflightCheck = {
  name: 'rate_limit_user',
  description: 'Checks if the user rate limit has been exceeded',
  run: async ({ userId }) => {
    try {
      // Check the user-specific rate limit
      const result = await ratelimit.limit(userId);
      
      if (!result.success) {
        // Calculate time remaining for user-friendly message
        // For fixed window, we need to approximate the reset time (1 hour)
        const timeRemaining = formatTimeRemaining(3600 * 1000); // 1 hour in ms
        
        return {
          passed: false,
          code: 'rate_limit_user',
          message: 'User rate limit exceeded',
          details: {
            limit: result.limit,
            remaining: result.remaining,
            timeRemaining
          },
          severity: 'warning'
        };
      }
      
      return {
        passed: true,
        code: 'rate_limit_user_ok',
        message: 'User rate limit check passed',
        details: {
          limit: result.limit,
          remaining: result.remaining
        },
        severity: 'info'
      };
    } catch (error) {
      // Handle any errors with the rate limiter
      return {
        passed: false,
        code: 'rate_limit_user_error',
        message: 'Error checking user rate limit',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: 'error'
      };
    }
  }
};