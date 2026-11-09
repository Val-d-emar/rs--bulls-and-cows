import type { LeaderboardEntry } from '../core/types.js';

export const LEADERBOARD_STORAGE_KEY = 'bulls_and_cows_records';

/**
 * Интерфейс хранилища, совместимый с localStorage
 */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * Чистый компаратор: сортирует рекорды по попыткам, затем по времени.
 */
export const compareRecords = (_a: LeaderboardEntry, _b: LeaderboardEntry): number => {
  return 0;
};

/**
 * Иммутабельно добавляет новый рекорд в список и возвращает топ-N записей.
 */
export const addRecord = (
  _records: readonly LeaderboardEntry[],
  _newEntry: LeaderboardEntry,
  _limit: number = 10,
): readonly LeaderboardEntry[] => {
  return [];
};

/**
 * Загружает рекорды из хранилища.
 */
export const loadRecords = (
  _storage: KeyValueStorage,
  _key: string = LEADERBOARD_STORAGE_KEY,
): readonly LeaderboardEntry[] => {
  return [];
};

/**
 * Сохраняет рекорды в хранилище.
 */
export const saveRecords = (
  _storage: KeyValueStorage,
  _records: readonly LeaderboardEntry[],
  _key: string = LEADERBOARD_STORAGE_KEY,
): void => {
  // заглушка
};
