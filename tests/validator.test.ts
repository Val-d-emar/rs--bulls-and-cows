import { describe, it, expect } from 'vitest';
import { createDigitValidator } from '../src/core/validator.js';

describe('createDigitValidator', () => {
  describe('Binary system (base 2)', () => {
    const isBinDigit = createDigitValidator(2);

    it('should accept valid binary digits "0" and "1"', () => {
      expect(isBinDigit('0')).toBe(true);
      expect(isBinDigit('1')).toBe(true);
    });

    it('should reject invalid digits and letters', () => {
      expect(isBinDigit('2')).toBe(false);
      expect(isBinDigit('9')).toBe(false);
      expect(isBinDigit('a')).toBe(false);
    });
  });

  describe('Octal system (base 8)', () => {
    const isOctDigit = createDigitValidator(8);

    it('should accept digits from "0" to "7"', () => {
      for (let i = 0; i <= 7; i += 1) {
        expect(isOctDigit(String(i))).toBe(true);
      }
    });

    it('should reject digits "8", "9" and letters', () => {
      expect(isOctDigit('8')).toBe(false);
      expect(isOctDigit('9')).toBe(false);
      expect(isOctDigit('a')).toBe(false);
    });
  });

  describe('Decimal system (base 10)', () => {
    const isDecDigit = createDigitValidator(10);

    it('should accept digits from "0" to "9"', () => {
      for (let i = 0; i <= 9; i += 1) {
        expect(isDecDigit(String(i))).toBe(true);
      }
    });

    it('should reject letters and symbols', () => {
      expect(isDecDigit('a')).toBe(false);
      expect(isDecDigit('-')).toBe(false);
    });
  });

  describe('Hexadecimal system (base 16)', () => {
    const isHexDigit = createDigitValidator(16);

    it('should accept digits "0" to "9"', () => {
      for (let i = 0; i <= 9; i += 1) {
        expect(isHexDigit(String(i))).toBe(true);
      }
    });

    it('should accept lowercase hex letters "a" through "f"', () => {
      ['a', 'b', 'c', 'd', 'e', 'f'].forEach((char) => {
        expect(isHexDigit(char)).toBe(true);
      });
    });

    it('should accept uppercase hex letters "A" through "F" (case-insensitive)', () => {
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach((char) => {
        expect(isHexDigit(char)).toBe(true);
      });
    });

    it('should reject letters beyond "f"', () => {
      expect(isHexDigit('g')).toBe(false);
      expect(isHexDigit('G')).toBe(false);
      expect(isHexDigit('z')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    const isDecDigit = createDigitValidator(10);

    it('should reject empty strings, multiple characters and whitespaces', () => {
      expect(isDecDigit('')).toBe(false);
      expect(isDecDigit('12')).toBe(false);
      expect(isDecDigit(' ')).toBe(false);
      expect(isDecDigit('\n')).toBe(false);
    });
  });
});
