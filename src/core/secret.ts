import type { Radix } from './types.js';

const DIGIT_ALPHABET = '0123456789abcdef';

/**
 * Тип функции-генератора псевдослучайных чисел от 0 (включительно) до 1 (не включая 1).
 */
export type RandomGenerator = () => number;

/**
 * Вспомогательная чистая рекурсивная функция для пошагового выбора уникальных цифр.
 *
 * @param remainingLength - сколько цифр осталось выбрать
 * @param availableDigits - массив ещё не использованных символов
 * @param random - источник случайных чисел
 * @param acc - накопленный результат
 * @returns итоговая секретная строка
 */
const pickDigits = (
  remainingLength: number,
  availableDigits: readonly string[],
  random: RandomGenerator,
  acc: readonly string[] = [],
): string => {
  if (remainingLength === 0) {
    return acc.join('');
  }

  const rawIndex = Math.floor(random() * availableDigits.length);
  const selectedIndex = Math.max(0, Math.min(rawIndex, availableDigits.length - 1));
  const selectedChar = availableDigits[selectedIndex];

  const nextAvailable = availableDigits.filter((_, idx) => idx !== selectedIndex);

  return pickDigits(remainingLength - 1, nextAvailable, random, [...acc, selectedChar]);
};

/**
 * Генерирует строку-секрет из length уникальных символов для заданной системы счисления base.
 *
 * @param length - требуемая длина секрета
 * @param base - основание системы счисления (2, 8, 10, 16)
 * @param random - источник случайных чисел (по умолчанию Math.random)
 * @returns секретная строка
 * @throws {RangeError} если length > base или length <= 0
 */
export const generateSecret = (
  length: number,
  base: Radix,
  random: RandomGenerator = Math.random,
): string => {
  if (length <= 0) {
    throw new RangeError(`Length must be greater than 0, received: ${length}`);
  }

  if (length > base) {
    throw new RangeError(
      `Length (${length}) cannot exceed base alphabet size (${base}) for unique digits`,
    );
  }

  const initialAlphabet = DIGIT_ALPHABET.slice(0, base).split('');

  return pickDigits(length, initialAlphabet, random);
};
