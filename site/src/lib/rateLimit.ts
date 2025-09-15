import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Redis environment variables are configured
const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Interface for mock rate limiter to match Ratelimit interface
interface MockRateLimiter {
  limit: (identifier: string) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }>;
  resetUsageForIdentifier: (identifier: string) => Promise<{ success: boolean }>;
  getRemaining: (identifier: string) => Promise<number>;
}

let rateLimiter: Ratelimit | MockRateLimiter;

if (hasRedisConfig) {
  const redis = Redis.fromEnv();
  rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '10 s'),
    analytics: true,
    prefix: 'rl:',
  });
} else {
  // Create a mock rate limiter for development
  rateLimiter = {
    limit: async () => ({ success: true, limit: 100, remaining: 99, reset: Date.now() + 10000 }),
    resetUsageForIdentifier: async () => ({ success: true }),
    getRemaining: async () => 99,
  } satisfies MockRateLimiter;
}

export { rateLimiter };
