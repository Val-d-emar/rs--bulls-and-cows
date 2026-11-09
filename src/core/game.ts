import type { GuessScore } from './types.js';

/**
 * Сравнивает попытку игрока с секретом и вычисляет количество быков и коров.
 *
 * @param _secret - загаданное число
 * @param _guess - попытка игрока
 * @returns объект с количеством быков и коров { bulls, cows }
 */
export const evaluateGuess = (secret: string, guess: string): GuessScore => {
  const normalizedSecret = secret.toLowerCase();
  const normalizedGuess = guess.toLowerCase();

  const guessChars = [...normalizedGuess];

  const bulls = guessChars.filter((char, index) => char === normalizedSecret[index]).length;

  const cows = guessChars.filter(
    (char, index) => char !== normalizedSecret[index] && normalizedSecret.includes(char),
  ).length;

  return { bulls, cows };
};
