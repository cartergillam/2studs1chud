import { Redis } from "@upstash/redis";

let warnedAboutMissingRedis = false;

const hasVercelKvPair = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
);

const redisUrl = hasVercelKvPair
  ? process.env.KV_REST_API_URL
  : process.env.UPSTASH_REDIS_REST_URL;

const redisToken = hasVercelKvPair
  ? process.env.KV_REST_API_TOKEN
  : process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken
  ? new Redis({
      url: redisUrl,
      token: redisToken,
      enableTelemetry: false,
      signal: () => AbortSignal.timeout(2_000),
    })
  : null;

export function getRedis() {
  if (!redis) {
    if (process.env.NODE_ENV === "development" && !warnedAboutMissingRedis) {
      console.warn("Upstash Redis is not configured; using local Chud standings.");
      warnedAboutMissingRedis = true;
    }
    return null;
  }

  return redis;
}
