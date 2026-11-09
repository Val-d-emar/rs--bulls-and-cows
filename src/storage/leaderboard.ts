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
 * Чистый компаратор: сортирует рекорды по попыткам (по возрастанию),
 * затем по затраченному времени (по возрастанию).
 *
 * @param a - первая запись
 * @param b - вторая запись
 * @returns отрицательное число, если a лучше b; положительное, если b лучше a
 */
export const compareRecords = (a: LeaderboardEntry, b: LeaderboardEntry): number => {
  if (a.attempts !== b.attempts) {
    return a.attempts - b.attempts;
  }

  if (a.durationMs !== b.durationMs) {
    return a.durationMs - b.durationMs;
  }

  return new Date(b.date).getTime() - new Date(a.date).getTime();
};

/**
 * Иммутабельно добавляет новый рекорд в список, сортирует и возвращает топ-N записей.
 *
 * @param records - текущий массив рекордов
 * @param newEntry - новый результат раунда
 * @param limit - максимальный размер таблицы рекордов (по умолчанию 10)
 * @returns новый отсортированный массив топ-результатов
 */
export const addRecord = (
  records: readonly LeaderboardEntry[],
  newEntry: LeaderboardEntry,
  limit: number = 10,
): readonly LeaderboardEntry[] => {
  const combined = [...records, newEntry];
  const sorted = combined.sort(compareRecords);
  return sorted.slice(0, limit);
};

/**
 * Безопасно загружает рекорды из хранилища.
 * При отсутствии данных или ошибке парсинга возвращает пустой массив.
 *
 * @param storage - объект хранилища (localStorage или mock)
 * @param key - ключ в хранилище
 * @returns массив сохранённых рекордов
 */
export const loadRecords = (
  storage: KeyValueStorage,
  key: string = LEADERBOARD_STORAGE_KEY,
): readonly LeaderboardEntry[] => {
  try {
    const rawData = storage.getItem(key);
    if (!rawData) {
      return [];
    }

    const parsed: unknown = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      return parsed as LeaderboardEntry[];
    }
    return [];
  } catch {
    return [];
  }
};

/**
 * Сериализует и сохраняет рекорды в переданное хранилище.
 *
 * @param storage - объект хранилища (localStorage или mock)
 * @param records - массив рекордов для сохранения
 * @param key - ключ в хранилище
 */
export const saveRecords = (
  storage: KeyValueStorage,
  records: readonly LeaderboardEntry[],
  key: string = LEADERBOARD_STORAGE_KEY,
): void => {
  try {
    storage.setItem(key, JSON.stringify(records));
  } catch (error) {
    console.warn('Failed to save leaderboard records to storage:', error);
  }
};
