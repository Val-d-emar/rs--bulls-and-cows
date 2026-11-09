import type { GuessScore } from './types.js';

/**
 * Сравнивает попытку игрока с секретом и вычисляет количество быков и коров.
 *
 * @param _secret - загаданное число
 * @param _guess - попытка игрока
 * @returns объект с количеством быков и коров { bulls, cows }
 */
export const evaluateGuess = (_secret: string, _guess: string): GuessScore => {
  // Временная заглушка для TDD (падающий тест)
  return { bulls: 0, cows: 0 };
};
