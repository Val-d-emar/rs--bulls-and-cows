/**
 * Сравнивает попытку игрока с секретом и вычисляет количество быков и коров.
 *
 * @param _secret - загаданное число
 * @param _guess - попытка игрока
 * @returns объект с количеством быков и коров { bulls, cows }
 */
export const evaluateGuess = (secret, guess) => {
    const normalizedSecret = secret.toLowerCase();
    const normalizedGuess = guess.toLowerCase();
    const guessChars = [...normalizedGuess];
    const bulls = guessChars.filter((char, index) => char === normalizedSecret[index]).length;
    const cows = guessChars.filter((char, index) => char !== normalizedSecret[index] && normalizedSecret.includes(char)).length;
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
export const createInitialState = (settings, secret, startTimeMs = Date.now()) => {
    return {
        settings,
        secret,
        status: 'playing',
        history: [],
        startTimeMs,
        endTimeMs: null,
    };
};
/**
 * Чистый переход состояния игры при новой попытке (reducer).
 *
 * @param _state - текущее состояние
 * @param _guess - введённая попытка
 * @param _currentTimeMs - текущее время в миллисекундах (для детерминированного тестирования)
 * @returns новое иммутабельное состояние GameState
 */
export const makeMove = (state, guess, currentTimeMs = Date.now()) => {
    if (state.status !== 'playing') {
        return state;
    }
    const normalizedGuess = guess.toLowerCase();
    const isDuplicate = state.history.some((entry) => entry.guess === normalizedGuess);
    if (isDuplicate) {
        return state;
    }
    const score = evaluateGuess(state.secret, normalizedGuess);
    const isWon = score.bulls === state.settings.length;
    const newEntry = {
        guess: normalizedGuess,
        score,
    };
    return {
        ...state,
        status: isWon ? 'won' : state.status,
        endTimeMs: isWon ? currentTimeMs : state.endTimeMs,
        history: [...state.history, newEntry],
    };
};
//# sourceMappingURL=game.js.map