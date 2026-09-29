const DEFAULT_MAX_KEYS = 10_000;

function createFixedWindowRateLimit(options) {
  const {
    windowMs,
    max,
    message = 'Too many requests. Please try again later.',
    maxKeys = DEFAULT_MAX_KEYS,
  } = options || {};

  if (!Number.isInteger(windowMs) || windowMs <= 0) {
    throw new TypeError('windowMs must be a positive integer');
  }

  if (!Number.isInteger(max) || max <= 0) {
    throw new TypeError('max must be a positive integer');
  }

  if (!Number.isInteger(maxKeys) || maxKeys <= 0) {
    throw new TypeError('maxKeys must be a positive integer');
  }

  const buckets = new Map();
  let requestCount = 0;

  function prune(now) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) {
        buckets.delete(key);
      }
    }

    while (buckets.size >= maxKeys) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey === undefined) break;
      buckets.delete(oldestKey);
    }
  }

  return function fixedWindowRateLimit(req, res, next) {
    const now = Date.now();
    requestCount += 1;

    if (requestCount % 100 === 1 || buckets.size >= maxKeys) {
      prune(now);
    }

    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    let bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      bucket = {
        count: 0,
        resetAt: now + windowMs,
      };
      buckets.set(key, bucket);
    }

    bucket.count += 1;

    const resetSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000));
    const remaining = Math.max(0, max - bucket.count);

    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader('RateLimit-Reset', String(resetSeconds));

    if (bucket.count > max) {
      res.setHeader('Retry-After', String(resetSeconds));
      return res.status(429).json({
        ok: false,
        error: message,
      });
    }

    return next();
  };
}

module.exports = {
  createFixedWindowRateLimit,
};
