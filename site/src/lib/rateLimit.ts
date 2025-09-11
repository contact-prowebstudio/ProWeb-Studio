import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Redis environment variables are configured
const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

let rateLimiter: Ratelimit;

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
  } as any;
}

export { rateLimiter };
