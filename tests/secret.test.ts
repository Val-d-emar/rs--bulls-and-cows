import { describe, it, expect } from 'vitest';
import { generateSecret, type RandomGenerator } from '../src/core/secret.js';
import { isValidGuess } from '../src/core/validator.js';

describe('generateSecret', () => {
  describe('Deterministic generation with custom random source', () => {
    it('should generate predictable secret given a deterministic sequence of random values', () => {
      const mockAlwaysFirst: RandomGenerator = () => 0;
      const secret = generateSecret(4, 10, mockAlwaysFirst);
      expect(secret).toBe('0123');
    });

    it('should generate predictable secret when choosing the last available element', () => {
      const mockAlwaysLast: RandomGenerator = () => 0.999;
      const secret = generateSecret(2, 2, mockAlwaysLast);
      expect(secret).toBe('10');
    });

    it('should produce secret with leading zero properly as a string', () => {
      const mockZeroFirst: RandomGenerator = () => 0;
      const secret = generateSecret(2, 2, mockZeroFirst);
      expect(secret).toBe('01');
      expect(secret.startsWith('0')).toBe(true);
    });
  });

  describe('Properties and validation of generated secret', () => {
    it('should produce valid secret conforming to isValidGuess with default Math.random', () => {
      const length = 4;
      const base = 16;
      const secret = generateSecret(length, base);

      expect(secret).toHaveLength(length);
      expect(isValidGuess(secret, length, base)).toBe(true);
    });

    it('should produce unique characters for maximum allowed length', () => {
      const length = 2;
      const base = 2;
      const secret = generateSecret(length, base);

      expect(secret).toHaveLength(2);
      expect(new Set(secret).size).toBe(2);
    });
  });

  describe('Error handling for invalid configurations', () => {
    it('should throw RangeError if length exceeds base alphabet size', () => {
      expect(() => generateSecret(3, 2)).toThrow(RangeError);
      expect(() => generateSecret(7, 6 as unknown as 2)).toThrow(RangeError);
    });

    it('should throw RangeError if length is less than or equal to 0', () => {
      expect(() => generateSecret(0, 10)).toThrow(RangeError);
      expect(() => generateSecret(-1, 10)).toThrow(RangeError);
    });
  });
});
