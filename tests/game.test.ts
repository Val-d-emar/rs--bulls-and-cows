import { describe, it, expect } from 'vitest';
import { evaluateGuess } from '../src/core/game.js';

describe('evaluateGuess', () => {
  describe('Exact matches and no matches', () => {
    it('should return all bulls when guess matches secret completely', () => {
      expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
      expect(evaluateGuess('01', '01')).toEqual({ bulls: 2, cows: 0 });
    });

    it('should return 0 bulls and 0 cows when no digits match', () => {
      expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
    });
  });

  describe('Cows only', () => {
    it('should return all cows when all digits are present but in wrong positions', () => {
      expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
      expect(evaluateGuess('01', '10')).toEqual({ bulls: 0, cows: 2 });
    });

    it('should return partial cows when some digits are present in wrong positions', () => {
      expect(evaluateGuess('1234', '5612')).toEqual({ bulls: 0, cows: 2 });
    });
  });

  describe('Mixed bulls and cows', () => {
    it('should correctly calculate both bulls and cows', () => {
      expect(evaluateGuess('1234', '1325')).toEqual({ bulls: 1, cows: 2 });
    });

    it('should correctly handle leading zeros', () => {
      expect(evaluateGuess('0123', '0214')).toEqual({ bulls: 1, cows: 2 });
    });
  });

  describe('Hexadecimal case-insensitivity', () => {
    it('should treat uppercase and lowercase hex digits identically', () => {
      expect(evaluateGuess('1a2b', '1A3C')).toEqual({ bulls: 2, cows: 0 });

      expect(evaluateGuess('1a2b', 'B2A1')).toEqual({ bulls: 0, cows: 4 });
    });
  });
});
