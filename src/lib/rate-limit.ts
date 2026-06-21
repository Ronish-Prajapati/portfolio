// Lightweight in-memory rate limiter for the contact form.
// Suitable for a single-instance / low-traffic portfolio. For multi-region
// scale, swap this for Upstash Redis — the interface stays the same.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

interface RateLimitOptions {
  /** Max requests allowed within the window. */
  limit?: number;
  /** Window length in milliseconds. */
  windowMs?: number;
}

export function rateLimit(
  identifier: string,
  { limit = 5, windowMs = 60 * 60 * 1000 }: RateLimitOptions = {},
): { success: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0 };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

// Opportunistically clear expired buckets so the map doesn't grow unbounded.
if (typeof setInterval !== "undefined") {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) buckets.delete(key);
    }
  }, 10 * 60 * 1000);
  // Don't keep the event loop alive just for cleanup.
  if (typeof interval === "object" && "unref" in interval) interval.unref();
}
