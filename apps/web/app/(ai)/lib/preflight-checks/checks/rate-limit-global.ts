import { PreflightCheck, CheckResult } from '../types';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { formatTimeRemaining } from '../utils';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Configure hourly rate limit
const hourlyRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(100, '1 h'),  // 100 requests per hour globally
  analytics: true,
  prefix: 'ratelimit:global:hourly',
});

// Configure daily rate limit
const dailyRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(500, '24 h'),  // 500 requests per day globally
  analytics: true,
  prefix: 'ratelimit:global:daily',
});

export const rateLimitGlobalCheck: PreflightCheck = {
  name: 'rate_limit_global',
  description: 'Checks if the global rate limit has been exceeded',
  run: async () => {
    try {
      // Check the hourly rate limit
      const hourlyResult = await hourlyRatelimit.limit('global');
      
      // If hourly limit exceeded
      if (!hourlyResult.success) {
        // Calculate time remaining until reset (approximately)
        const timeRemaining = formatTimeRemaining(3600 * 1000); // 1 hour in ms
        
        return {
          passed: false,
          code: 'rate_limit_global',
          message: 'Global hourly rate limit exceeded',
          details: {
            limit: hourlyResult.limit,
            remaining: hourlyResult.remaining,
            timeRemaining
          },
          severity: 'warning'
        };
      }
      
      // Check the daily rate limit
      const dailyResult = await dailyRatelimit.limit('global');
      
      // If daily limit exceeded
      if (!dailyResult.success) {
        // Calculate time remaining until reset (approximately)
        const timeRemaining = formatTimeRemaining(24 * 3600 * 1000); // 24 hours in ms
        
        return {
          passed: false,
          code: 'rate_limit_global_daily',
          message: 'Global daily rate limit exceeded',
          details: {
            limit: dailyResult.limit,
            remaining: dailyResult.remaining,
            timeRemaining
          },
          severity: 'warning'
        };
      }
      
      // Both limits passed
      return {
        passed: true,
        code: 'rate_limit_global_ok',
        message: 'Global rate limit check passed',
        details: {
          hourly: {
            limit: hourlyResult.limit,
            remaining: hourlyResult.remaining
          },
          daily: {
            limit: dailyResult.limit,
            remaining: dailyResult.remaining
          }
        },
        severity: 'info'
      };
    } catch (error) {
      // Handle any errors with the rate limiter
      return {
        passed: false,
        code: 'rate_limit_error',
        message: 'Error checking global rate limit',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: 'error'
      };
    }
  }
};