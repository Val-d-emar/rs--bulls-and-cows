import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from '../src/core/math.js';

describe('countPossibleSecrets', () => {
  describe('Permutation calculations for valid game settings', () => {
    it('should calculate permutations for binary system (base 2)', () => {
      // P(2, 2) = 2 * 1 = 2 ('01' и '10')
      expect(countPossibleSecrets(2, 2)).toBe(2);
    });

    it('should calculate permutations for octal system (base 8)', () => {
      // P(8, 2) = 8 * 7 = 56
      expect(countPossibleSecrets(2, 8)).toBe(56);
      // P(8, 3) = 8 * 7 * 6 = 336
      expect(countPossibleSecrets(3, 8)).toBe(336);
      // P(8, 6) = 8 * 7 * 6 * 5 * 4 * 3 = 20160
      expect(countPossibleSecrets(6, 8)).toBe(20160);
    });

    it('should calculate permutations for decimal system (base 10)', () => {
      // P(10, 4) = 10 * 9 * 8 * 7 = 5040
      expect(countPossibleSecrets(4, 10)).toBe(5040);
      // P(10, 6) = 10 * 9 * 8 * 7 * 6 * 5 = 151200
      expect(countPossibleSecrets(6, 10)).toBe(151200);
    });

    it('should calculate permutations for hexadecimal system (base 16)', () => {
      // P(16, 4) = 16 * 15 * 14 * 13 = 43680
      expect(countPossibleSecrets(4, 16)).toBe(43680);
      // P(16, 6) = 16 * 15 * 14 * 13 * 12 * 11 = 5765760
      expect(countPossibleSecrets(6, 16)).toBe(5765760);
    });
  });

  describe('Edge cases', () => {
    it('should return 1 when length is 0 (base case)', () => {
      expect(countPossibleSecrets(0, 10)).toBe(1);
    });

    it('should return 0 when requested length exceeds the base alphabet', () => {
      expect(countPossibleSecrets(3, 2)).toBe(0);
    });

    it('should return 0 for negative length', () => {
      expect(countPossibleSecrets(-1, 10)).toBe(0);
    });
  });
});
