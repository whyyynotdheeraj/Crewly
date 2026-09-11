import crypto from 'crypto';

/**
 * Generates a secure random token for volunteer sessions
 */
export function generateToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

/**
 * Simple email validator
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Mask email for display (e.g. j***e@gmail.com)
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}
