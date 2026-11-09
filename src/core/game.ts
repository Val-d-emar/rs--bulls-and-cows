import type { GameSettings, GameState, GuessScore } from './types.js';

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

/**
 * Создаёт начальное состояние игрового раунда.
 *
 * @param _settings - выбранные настройки игры
 * @param _secret - сгенерированный секрет
 * @param _startTimeMs - время старта раунда в миллисекундах
 * @returns начальное состояние GameState
 */
export const createInitialState = (
  _settings: GameSettings,
  _secret: string,
  _startTimeMs: number = Date.now(),
): GameState => {
  // Временная заглушка для TDD
  return undefined as unknown as GameState;
};

/**
 * Чистый переход состояния игры при новой попытке (reducer).
 *
 * @param _state - текущее состояние
 * @param _guess - введённая попытка
 * @param _currentTimeMs - текущее время в миллисекундах (для детерминированного тестирования)
 * @returns новое иммутабельное состояние GameState
 */
export const makeMove = (
  _state: GameState,
  _guess: string,
  _currentTimeMs: number = Date.now(),
): GameState => {
  // Временная заглушка для TDD
  return undefined as unknown as GameState;
};
