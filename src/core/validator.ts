import type { Radix } from './types.js';

/**
 * Каррированная фабрика-валидатор допустимых цифр в указанной системе счисления.
 * @param _base - основание системы счисления
 * @returns функция-предикат для проверки символа
 */
export const createDigitValidator = (_base: Radix): ((char: string) => boolean) => {
  return (_char: string): boolean => {
    // Временная заглушка для TDD (падающий тест)
    return false;
  };
};
