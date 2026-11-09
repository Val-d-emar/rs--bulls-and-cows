import { describe, it, expect } from 'vitest';
import {
  compareRecords,
  addRecord,
  loadRecords,
  saveRecords,
  type KeyValueStorage,
} from '../src/storage/leaderboard.js';
import type { LeaderboardEntry } from '../src/core/types.js';

const createMockStorage = (initialData: Record<string, string> = {}): KeyValueStorage => {
  const store = { ...initialData };
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
  };
};

describe('Leaderboard logic', () => {
  const sampleEntry1: LeaderboardEntry = {
    id: '1',
    length: 4,
    base: 10,
    attempts: 5,
    durationMs: 15000,
    date: '2026-01-01T00:00:00.000Z',
  };

  const sampleEntry2: LeaderboardEntry = {
    id: '2',
    length: 4,
    base: 10,
    attempts: 3,
    durationMs: 25000,
    date: '2026-01-01T00:01:00.000Z',
  };

  const sampleEntry3: LeaderboardEntry = {
    id: '3',
    length: 4,
    base: 10,
    attempts: 5,
    durationMs: 12000,
    date: '2026-01-01T00:02:00.000Z',
  };

  describe('compareRecords', () => {
    it('should prioritize fewer attempts', () => {
      expect(compareRecords(sampleEntry2, sampleEntry1)).toBeLessThan(0);
      expect(compareRecords(sampleEntry1, sampleEntry2)).toBeGreaterThan(0);
    });

    it('should prioritize less duration when attempts are equal', () => {
      expect(compareRecords(sampleEntry3, sampleEntry1)).toBeLessThan(0);
      expect(compareRecords(sampleEntry1, sampleEntry3)).toBeGreaterThan(0);
    });
  });

  describe('addRecord', () => {
    it('should immutably insert a record in sorted order and cap to limit', () => {
      const initial: readonly LeaderboardEntry[] = [sampleEntry1];
      const updated = addRecord(initial, sampleEntry2, 2);

      expect(initial).toHaveLength(1);

      expect(updated).toHaveLength(2);
      expect(updated[0].id).toBe('2');
      expect(updated[1].id).toBe('1');

      const capped = addRecord(updated, sampleEntry3, 2);
      expect(capped).toHaveLength(2);
      expect(capped[0].id).toBe('2');
      expect(capped[1].id).toBe('3');
    });
  });

  describe('loadRecords and saveRecords', () => {
    it('should save and correctly load records from storage', () => {
      const storage = createMockStorage();
      const records = [sampleEntry1, sampleEntry2];

      saveRecords(storage, records);
      const loaded = loadRecords(storage);

      expect(loaded).toEqual(records);
    });

    it('should return empty array if storage has no data or corrupt JSON', () => {
      const storageEmpty = createMockStorage();
      expect(loadRecords(storageEmpty)).toEqual([]);

      const storageCorrupt = createMockStorage({ bulls_and_cows_records: 'invalid-json' });
      expect(loadRecords(storageCorrupt)).toEqual([]);
    });
  });
});
