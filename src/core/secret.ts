import type { Radix } from './types.js';

/**
 * Тип функции-генератора псевдослучайных чисел от 0 (включительно) до 1 (не включая 1).
 */
export type RandomGenerator = () => number;

/**
 * Генерирует строку-секрет из length уникальных символов для заданной системы счисления base.
 *
 * @param _length - требуемая длина секрета
 * @param _base - основание системы счисления (2, 8, 10, 16)
 * @param _random - источник случайных чисел (по умолчанию Math.random)
 * @returns секретная строка
 */
export const generateSecret = (
  _length: number,
  _base: Radix,
  _random: RandomGenerator = Math.random,
): string => {
  // Временная заглушка для TDD (падающий тест)
  return '';
};
