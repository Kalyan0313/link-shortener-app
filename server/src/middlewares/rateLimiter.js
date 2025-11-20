const RequestHandler = require("../utils/RequestHandler");

// Simple in-memory rate limiter
class RateLimiter {
  constructor(windowMs = 60000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = new Map();

    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  limit() {
    return (req, res, next) => {
      const identifier = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      const windowStart = now - this.windowMs;

      // Get user's request history
      let userRequests = this.requests.get(identifier) || [];

      // Filter requests within current window
      userRequests = userRequests.filter(
        (timestamp) => timestamp > windowStart
      );

      // Check if limit exceeded
      if (userRequests.length >= this.maxRequests) {
        console.warn("Rate limit exceeded", { ip: identifier });
        return RequestHandler.sendError(
          res,
          "Too many requests. Please try again later.",
          429
        );
      }

      userRequests.push(now);
      this.requests.set(identifier, userRequests);

      res.setHeader("X-RateLimit-Limit", this.maxRequests);
      res.setHeader(
        "X-RateLimit-Remaining",
        this.maxRequests - userRequests.length
      );
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(now + this.windowMs).toISOString()
      );

      next();
    };
  }

  cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [identifier, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter((t) => t > windowStart);

      if (validTimestamps.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validTimestamps);
      }
    }
  }
}

// rate limiter instances
const apiLimiter = new RateLimiter(60000, 100); // 100 requests per minute
const redirectLimiter = new RateLimiter(60000, 200); // 200 redirects per minute

module.exports = {
  apiLimiter,
  redirectLimiter,
};
