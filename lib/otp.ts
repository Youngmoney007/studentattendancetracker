/**
 * Generate OTP (One-Time Password)
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Verify OTP
 */
export function verifyOTP(providedOTP: string, storedOTP: string): boolean {
  return providedOTP === storedOTP;
}

/**
 * Check if OTP is expired
 */
export function isOTPExpired(expiryTime: Date): boolean {
  return new Date() > expiryTime;
}

/**
 * Get OTP expiry time (default 10 minutes)
 */
export function getOTPExpiryTime(minutes: number = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
