import crypto from 'crypto';

/** Generates a secure random session token for volunteer auth */
export function generateToken(): string {
  return crypto.randomBytes(48).toString('hex');
}
