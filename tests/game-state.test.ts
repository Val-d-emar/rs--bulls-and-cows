import { describe, it, expect } from 'vitest';
import { createInitialState, makeMove } from '../src/core/game.js';
import type { GameSettings } from '../src/core/types.js';

describe('Game State Transitions', () => {
  const defaultSettings: GameSettings = { length: 4, base: 10 };
  const testSecret = '1234';
  const startTime = 1000;

  describe('createInitialState', () => {
    it('should initialize game state with status "playing" and empty history', () => {
      const state = createInitialState(defaultSettings, testSecret, startTime);

      expect(state).toEqual({
        settings: defaultSettings,
        secret: testSecret,
        status: 'playing',
        history: [],
        startTimeMs: startTime,
        endTimeMs: null,
      });
    });
  });

  describe('makeMove immutability and state updates', () => {
    it('should return a new state object and not mutate previous state or history', () => {
      const initialState = createInitialState(defaultSettings, testSecret, startTime);
      const nextState = makeMove(initialState, '5678', startTime + 500);

      expect(nextState).not.toBe(initialState);
      expect(nextState.history).not.toBe(initialState.history);
      expect(initialState.history).toHaveLength(0);
      expect(nextState.history).toHaveLength(1);
    });

    it('should append new move with evaluated score to history', () => {
      const state1 = createInitialState(defaultSettings, testSecret, startTime);
      const state2 = makeMove(state1, '1243', startTime + 1000);

      expect(state2.history).toHaveLength(1);
      expect(state2.history[0]).toEqual({
        guess: '1243',
        score: { bulls: 2, cows: 2 },
      });
      expect(state2.status).toBe('playing');
      expect(state2.endTimeMs).toBeNull();
    });

    it('should prevent duplicate guess entries in history', () => {
      const state1 = createInitialState(defaultSettings, testSecret, startTime);
      const state2 = makeMove(state1, '1243', startTime + 1000);
      const state3 = makeMove(state2, '1243', startTime + 2000);

      expect(state3.history).toHaveLength(1);
      expect(state3).toBe(state2);
    });

    it('should complete game with status "won" and record endTimeMs when bulls === length', () => {
      const state1 = createInitialState(defaultSettings, testSecret, startTime);
      const winTime = startTime + 5000;
      const wonState = makeMove(state1, testSecret, winTime);

      expect(wonState.status).toBe('won');
      expect(wonState.endTimeMs).toBe(winTime);
      expect(wonState.history).toHaveLength(1);
      expect(wonState.history[0].score).toEqual({ bulls: 4, cows: 0 });
    });

    it('should ignore moves if game is already won', () => {
      const state1 = createInitialState(defaultSettings, testSecret, startTime);
      const wonState = makeMove(state1, testSecret, startTime + 5000);
      const afterWonState = makeMove(wonState, '0000', startTime + 6000);

      expect(afterWonState).toBe(wonState);
      expect(afterWonState.history).toHaveLength(1);
    });
  });
});
