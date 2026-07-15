import crypto from 'crypto';

/**
 * Rate limiting helper
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count < limit) {
    record.count++;
    return true;
  }

  return false;
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash token for storage
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Validate request headers
 */
export function validateRequestHeaders(headers: Record<string, any>): boolean {
  const requiredHeaders = ['content-type'];
  return requiredHeaders.some((header) => header in headers);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"']/g, '') // Remove HTML special characters
    .trim()
    .substring(0, 500); // Limit length
}

/**
 * Get client IP from request
 */
export function getClientIP(request: any): string {
  return (
    request.headers['x-forwarded-for']?.split(',')[0] ||
    request.headers['x-real-ip'] ||
    request.connection?.remoteAddress ||
    'unknown'
  );
}
