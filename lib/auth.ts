import { hash, verify } from 'crypto';
import { createHash, randomBytes } from 'crypto';

// Hash password using crypto
export async function hashPassword(password: string): Promise<string> {
  return createHash('sha256').update(password).digest('hex');
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = createHash('sha256').update(password).digest('hex');
  return hashedPassword === hash;
}

// Generate verification token
export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

// Generate session token
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}
