import rateLimit from "express-rate-limit";

// General cap on all API traffic — blunts request floods and scraping.
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // per IP per window
  standardHeaders: true, // send RateLimit-* headers
  legacyHeaders: false,
  message: { error: "Too many requests — please slow down." },
});

// Strict limiter for auth routes (signin / signup / resetPassword).
// skipSuccessfulRequests: only FAILED attempts count, so a legit user logging
// in never eats into the budget — this only bites brute-force / stuffing.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // failed attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Too many attempts — try again in a little while." },
});
