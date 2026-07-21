import { NextResponse } from "next/server";
import { boyIds, emptyChudCounts, type BoyId, type ChudCounts } from "@/lib/boys";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LEADERBOARD_KEY = "2s1c:global-chud-counts";
const TOKEN_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const RECORD_SPIN_SCRIPT = `
local function counts()
  local values = redis.call("HMGET", KEYS[1], "carter", "gabe", "joey")
  return {tonumber(values[1]) or 0, tonumber(values[2]) or 0, tonumber(values[3]) or 0}
end

if redis.call("EXISTS", KEYS[2]) == 1 then
  local values = counts()
  return {0, values[1], values[2], values[3]}
end

if not redis.call("SET", KEYS[3], "1", "NX", "PX", 350) then
  local values = counts()
  return {-1, values[1], values[2], values[3]}
end

redis.call("SET", KEYS[2], "1", "EX", 86400)
redis.call("HINCRBY", KEYS[1], ARGV[1], 1)
local values = counts()
return {1, values[1], values[2], values[3]}
`;

function normalizeCounts(value: Record<string, unknown> | null): ChudCounts {
  return {
    carter: Number(value?.carter) || 0,
    gabe: Number(value?.gabe) || 0,
    joey: Number(value?.joey) || 0,
  };
}

function countsFromResult(result: number[]): ChudCounts {
  return { carter: Number(result[1]) || 0, gabe: Number(result[2]) || 0, joey: Number(result[3]) || 0 };
}

function isBoyId(value: unknown): value is BoyId {
  return typeof value === "string" && boyIds.includes(value as BoyId);
}

function response(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  const redis = getRedis();
  if (!redis) return response({ mode: "local", counts: emptyChudCounts() });

  try {
    const counts = await redis.hgetall<Record<string, unknown>>(LEADERBOARD_KEY);
    return response({ mode: "global", counts: normalizeCounts(counts) });
  } catch {
    return response({ error: "Leaderboard temporarily unavailable." }, 503);
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 512) return response({ error: "Invalid request." }, 413);

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 512) return response({ error: "Invalid request." }, 413);
    body = JSON.parse(rawBody);
  } catch {
    return response({ error: "Invalid request." }, 400);
  }

  if (!body || typeof body !== "object") return response({ error: "Invalid request." }, 400);
  const submittedKeys = Object.keys(body);
  if (submittedKeys.length !== 3 || !submittedKeys.every((key) => ["personId", "spinId", "sessionId"].includes(key))) {
    return response({ error: "Invalid request." }, 400);
  }
  const { personId, spinId, sessionId } = body as Record<string, unknown>;
  if (
    !isBoyId(personId) ||
    typeof spinId !== "string" || !TOKEN_PATTERN.test(spinId) ||
    typeof sessionId !== "string" || !TOKEN_PATTERN.test(sessionId)
  ) {
    return response({ error: "Invalid request." }, 400);
  }

  const redis = getRedis();
  if (!redis) return response({ mode: "local", counts: emptyChudCounts() });

  try {
    const result = await redis.eval<[BoyId], number[]>(
      RECORD_SPIN_SCRIPT,
      [LEADERBOARD_KEY, `2s1c:spin:${spinId}`, `2s1c:rate:${sessionId}`],
      [personId],
    );
    const counts = countsFromResult(result);
    if (result[0] === -1) {
      return response({ mode: "global", counts, error: "The Authority needs one second between filings." }, 429);
    }
    return response({ mode: "global", counts, duplicate: result[0] === 0 });
  } catch {
    return response({ error: "Leaderboard temporarily unavailable." }, 503);
  }
}
