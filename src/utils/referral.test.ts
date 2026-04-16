import { describe, test, expect } from 'vitest';
import { generateReferralCode, buildReferralUrl } from './referral';

describe('generateReferralCode', () => {
  test('produces 8-character uppercase code', () => {
    const code = generateReferralCode('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    expect(code).toHaveLength(8);
    expect(code).toBe(code.toUpperCase());
  });

  test('strips hyphens from UUID', () => {
    const code = generateReferralCode('aaaa-bbbb-cccc-dddd');
    expect(code).not.toContain('-');
  });

  test('is deterministic — same input always gives same code', () => {
    const id = '12345678-abcd-efgh-ijkl-mnopqrstuvwx';
    expect(generateReferralCode(id)).toBe(generateReferralCode(id));
  });
});

describe('buildReferralUrl', () => {
  test('produces valid URL with ref param', () => {
    const url = buildReferralUrl('ABCD1234');
    expect(url).toBe('https://gocivique.fr?ref=ABCD1234');
  });
});
