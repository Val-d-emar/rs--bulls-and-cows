import type { Radix } from './types.js';

const DIGIT_ALPHABET = '0123456789abcdef';

/**
 * Каррированная фабрика-валидатор допустимых цифр в указанной системе счисления.
 * @param _base - основание системы счисления
 * @returns функция-предикат для проверки символа
 */
export const createDigitValidator = (base: Radix): ((char: string) => boolean) => {
  const allowedDigits = DIGIT_ALPHABET.slice(0, base);

  return (char: string): boolean => {
    if (char.length !== 1) {
      return false;
    }

    const normalizedChar = char.toLowerCase();
    return allowedDigits.includes(normalizedChar);
  };
};

/**
 * Проверяет валидность попытки игрока:
 * 1. Совпадение длины с заданной.
 * 2. Допустимость всех символов для выбранной системы счисления.
 * 3. Отсутствие повторяющихся цифр (с учётом регистра для hex).
 *
 * @param _guess - строка с предполагаемым числом
 * @param _length - ожидаемая длина
 * @param _base - система счисления
 * @returns boolean
 */
export const isValidGuess = (guess: string, length: number, base: Radix): boolean => {
  const normalizedGuess = guess.toLowerCase();

  if (normalizedGuess.length !== length) {
    return false;
  }

  const isDigitValid = createDigitValidator(base);
  const chars = [...normalizedGuess];

  const allCharsValid = chars.every(isDigitValid);
  if (!allCharsValid) {
    return false;
  }

  const uniqueCharsCount = new Set(chars).size;
  return uniqueCharsCount === length;
};
