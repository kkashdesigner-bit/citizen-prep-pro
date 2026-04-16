/**
 * Generates a short, memorable referral code from a user ID.
 * First 8 chars of UUID (hyphens stripped, uppercased).
 */
export function generateReferralCode(userId: string): string {
  return userId.replace(/-/g, '').substring(0, 8).toUpperCase();
}

/**
 * Builds the full referral URL for sharing.
 */
export function buildReferralUrl(referralCode: string): string {
  return `https://gocivique.fr?ref=${referralCode}`;
}
