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
