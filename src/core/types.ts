/**
 * Поддерживаемые системы счисления (основания):
 * 2 - двоичная (bin)
 * 8 - восьмеричная (oct)
 * 10 - десятичная (dec)
 * 16 - шестнадцатеричная (hex)
 */
export type Radix = 2 | 8 | 10 | 16;

/**
 * Результат сравнения попытки с секретным числом.
 */
export interface GuessScore {
  readonly bulls: number;
  readonly cows: number;
}

/**
 * Статус текущей игровой сессии:
 * - 'idle': настройки выбраны, раунд ещё не запущен
 * - 'playing': раунд активен, принимаются попытки
 * - 'won': секрет угадан, раунд завершён победой
 */
export type GameStatus = 'idle' | 'playing' | 'won';

/**
 * Настройки игры: длина секрета и система счисления
 */
export interface GameSettings {
  readonly length: number;
  readonly base: Radix;
}

/**
 * Запись одной попытки в истории раунда
 */
export interface HistoryEntry {
  readonly guess: string;
  readonly score: GuessScore;
}

/**
 * Неизменяемое состояние игры
 */
export interface GameState {
  readonly settings: GameSettings;
  readonly secret: string;
  readonly status: GameStatus;
  readonly history: readonly HistoryEntry[];
  readonly startTimeMs: number;
  readonly endTimeMs: number | null;
}

/**
 * Запись в таблице рекордов
 */
export interface LeaderboardEntry {
  readonly id: string;
  readonly length: number;
  readonly base: Radix;
  readonly attempts: number;
  readonly durationMs: number;
  readonly date: string;
}
