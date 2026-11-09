import type { GameSettings, GameState, LeaderboardEntry, Radix } from '../core/types.js';
import { countPossibleSecrets } from '../core/math.js';
import { generateSecret } from '../core/secret.js';
import { createDigitValidator, isValidGuess } from '../core/validator.js';
import { createInitialState, makeMove } from '../core/game.js';
import { loadRecords, saveRecords, addRecord } from '../storage/leaderboard.js';
import { createElement, clearElement, formatDuration } from './dom.js';

const RADIX_LABELS: Record<Radix, string> = {
  2: 'Binary (0-1)',
  8: 'Octal (0-7)',
  10: 'Decimal (0-9)',
  16: 'Hexadecimal (0-9, a-f)',
};

export const mountApp = (root: HTMLElement): void => {
  let currentSettings: GameSettings = { length: 4, base: 10 };
  let gameState: GameState | null = null;
  let timerId: ReturnType<typeof setInterval> | null = null;
  let elapsedSeconds = 0;

  let records: readonly LeaderboardEntry[] = loadRecords(window.localStorage);

  const container = createElement('div', { className: 'app-container' });

  const header = createElement('header', {
    className: 'app-header',
    children: [
      createElement('h1', { className: 'app-title', textContent: 'Bulls and Cows' }),
      createElement('p', {
        className: 'app-subtitle',
        textContent: 'Guess the secret combination of unique digits',
      }),
    ],
  });

  const settingsCard = createElement('div', { className: 'card' });
  const settingsTitle = createElement('h2', {
    className: 'card-title',
    textContent: 'Game Settings',
  });

  const baseSelect = createElement('select', { className: 'select-control' });
  ([2, 8, 10, 16] as Radix[]).forEach((radix) => {
    const option = createElement('option', {
      textContent: RADIX_LABELS[radix],
      attrs: { value: radix, ...(radix === 10 ? { selected: true } : {}) },
    });
    baseSelect.appendChild(option);
  });

  const lengthSelect = createElement('select', { className: 'select-control' });
  const updateLengthOptions = (): void => {
    clearElement(lengthSelect);
    const maxAllowed = currentSettings.base;
    for (let len = 2; len <= 6; len += 1) {
      const isAllowed = len <= maxAllowed;
      const option = createElement('option', {
        textContent: `${len} digits`,
        attrs: {
          value: len,
          ...(isAllowed ? {} : { disabled: true }),
          ...(len === currentSettings.length ? { selected: true } : {}),
        },
      });
      lengthSelect.appendChild(option);
    }
  };

  const permutationsInfo = createElement('p', { className: 'permutations-info' });
  const updatePermutationsText = (): void => {
    const count = countPossibleSecrets(currentSettings.length, currentSettings.base);
    clearElement(permutationsInfo);
    permutationsInfo.appendChild(document.createTextNode('Possible secret combinations: '));
    permutationsInfo.appendChild(
      createElement('span', {
        className: 'permutations-count',
        textContent: count.toLocaleString(),
      }),
    );
  };

  const startBtn = createElement('button', {
    className: 'btn',
    textContent: 'Start Game',
  });

  const settingsGrid = createElement('div', {
    className: 'settings-grid',
    children: [
      createElement('div', {
        className: 'field-group',
        children: [
          createElement('label', { className: 'field-label', textContent: 'Numeral System:' }),
          baseSelect,
        ],
      }),
      createElement('div', {
        className: 'field-group',
        children: [
          createElement('label', { className: 'field-label', textContent: 'Secret Length:' }),
          lengthSelect,
        ],
      }),
    ],
  });

  settingsCard.append(settingsTitle, settingsGrid, permutationsInfo, startBtn);

  const gameCard = createElement('div', {
    className: 'card',
    attrs: { style: 'display: none;' },
  });

  const timerText = createElement('span', { textContent: 'Time: 00:00' });
  const attemptsText = createElement('span', { textContent: 'Attempts: 0' });
  const statusBar = createElement('div', {
    className: 'status-bar',
    children: [timerText, attemptsText],
  });

  const guessInput = createElement('input', {
    className: 'input-control guess-input',
    attrs: {
      type: 'text',
      autocomplete: 'off',
      autocorrect: 'off',
      autocapitalize: 'characters',
      spellcheck: false,
    },
  });

  const submitGuessBtn = createElement('button', {
    className: 'btn',
    textContent: 'Guess',
    attrs: { disabled: true },
  });

  const guessForm = createElement('form', {
    className: 'guess-form',
    children: [guessInput, submitGuessBtn],
  });

  const inputHint = createElement('p', { className: 'guess-hint' });
  const historyList = createElement('div', { className: 'history-list' });
  const winBanner = createElement('div', {
    className: 'win-banner',
    attrs: { style: 'display: none;' },
  });
  const newGameBtn = createElement('button', {
    className: 'btn btn-secondary',
    textContent: 'New Game / Reset',
    attrs: { style: 'margin-top: 12px; display: none;' },
  });

  gameCard.append(
    statusBar,
    guessForm,
    inputHint,
    winBanner,
    newGameBtn,
    createElement('h3', {
      className: 'card-title',
      textContent: 'Guess History',
      attrs: { style: 'margin-top: 16px;' },
    }),
    historyList,
  );

  const leaderboardCard = createElement('div', { className: 'card' });
  leaderboardCard.appendChild(
    createElement('h2', { className: 'card-title', textContent: 'Hall of Fame (Top 10)' }),
  );
  const leaderboardContainer = createElement('div');
  leaderboardCard.appendChild(leaderboardContainer);

  const renderLeaderboard = (): void => {
    clearElement(leaderboardContainer);
    if (records.length === 0) {
      leaderboardContainer.appendChild(
        createElement('p', {
          className: 'permutations-info',
          textContent: 'No records yet. Be the first champion!',
        }),
      );
      return;
    }

    const table = createElement('table', { className: 'leaderboard-table' });
    const thead = createElement('thead', {
      children: [
        createElement('tr', {
          children: [
            createElement('th', { textContent: '#' }),
            createElement('th', { textContent: 'Mode' }),
            createElement('th', { textContent: 'Attempts' }),
            createElement('th', { textContent: 'Time' }),
            createElement('th', { textContent: 'Date' }),
          ],
        }),
      ],
    });

    const tbody = createElement('tbody');
    records.forEach((rec, index) => {
      const row = createElement('tr', {
        children: [
          createElement('td', { textContent: String(index + 1) }),
          createElement('td', {
            children: [
              createElement('span', {
                className: 'badge-mode',
                textContent: `${rec.base === 16 ? 'HEX' : rec.base === 10 ? 'DEC' : rec.base === 8 ? 'OCT' : 'BIN'}-${rec.length}`,
              }),
            ],
          }),
          createElement('td', { textContent: String(rec.attempts) }),
          createElement('td', { textContent: formatDuration(rec.durationMs) }),
          createElement('td', {
            textContent: new Date(rec.date).toLocaleDateString(),
          }),
        ],
      });
      tbody.appendChild(row);
    });

    table.append(thead, tbody);
    leaderboardContainer.appendChild(table);
  };

  const renderHistory = (): void => {
    clearElement(historyList);
    if (!gameState || gameState.history.length === 0) {
      return;
    }

    [...gameState.history].reverse().forEach((entry) => {
      const item = createElement('div', {
        className: 'history-item',
        children: [
          createElement('span', {
            className: 'history-guess',
            textContent: entry.guess.toUpperCase(),
          }),
          createElement('div', {
            className: 'history-scores',
            children: [
              createElement('span', {
                className: 'score-badge score-bulls',
                textContent: `🐂 ${entry.score.bulls} Bulls`,
              }),
              createElement('span', {
                className: 'score-badge score-cows',
                textContent: `🐄 ${entry.score.cows} Cows`,
              }),
            ],
          }),
        ],
      });
      historyList.appendChild(item);
    });
  };

  const stopTimer = (): void => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const startTimer = (): void => {
    stopTimer();
    elapsedSeconds = 0;
    timerText.textContent = 'Time: 00:00';
    timerId = setInterval(() => {
      elapsedSeconds += 1;
      const mins = Math.floor(elapsedSeconds / 60)
        .toString()
        .padStart(2, '0');
      const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
      timerText.textContent = `Time: ${mins}:${secs}`;
    }, 1000);
  };

  baseSelect.addEventListener('change', () => {
    const newBase = Number(baseSelect.value) as Radix;
    currentSettings = {
      base: newBase,
      length: currentSettings.length > newBase ? newBase : currentSettings.length,
    };
    updateLengthOptions();
    updatePermutationsText();
  });

  lengthSelect.addEventListener('change', () => {
    currentSettings = {
      ...currentSettings,
      length: Number(lengthSelect.value),
    };
    updatePermutationsText();
  });

  let isCurrentCharValid = createDigitValidator(currentSettings.base);

  guessInput.addEventListener('beforeinput', (event: InputEvent) => {
    if (!event.data) return;
    const chars = [...event.data];
    const hasInvalidChar = chars.some((c) => !isCurrentCharValid(c));
    if (hasInvalidChar) {
      event.preventDefault();
    }
  });

  guessInput.addEventListener('input', () => {
    const filtered = [...guessInput.value]
      .filter((c) => isCurrentCharValid(c))
      .slice(0, currentSettings.length)
      .join('');

    if (guessInput.value !== filtered) {
      guessInput.value = filtered;
    }

    const isValid = isValidGuess(guessInput.value, currentSettings.length, currentSettings.base);
    submitGuessBtn.disabled = !isValid;
  });

  const handleWin = (): void => {
    stopTimer();
    if (!gameState || !gameState.endTimeMs) return;

    guessInput.disabled = true;
    submitGuessBtn.disabled = true;

    const durationMs = gameState.endTimeMs - gameState.startTimeMs;
    const attempts = gameState.history.length;

    clearElement(winBanner);
    winBanner.append(
      createElement('h3', { className: 'win-title', textContent: '🎉 Congratulations! You Won!' }),
      createElement('p', {
        className: 'win-desc',
        textContent: `Secret guessed in ${attempts} attempts and ${formatDuration(durationMs)}!`,
      }),
    );
    winBanner.style.display = 'block';
    newGameBtn.style.display = 'inline-flex';

    const newRecord: LeaderboardEntry = {
      id: String(Date.now()),
      length: currentSettings.length,
      base: currentSettings.base,
      attempts,
      durationMs,
      date: new Date().toISOString(),
    };

    records = addRecord(records, newRecord);
    saveRecords(window.localStorage, records);
    renderLeaderboard();
  };

  guessForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    if (!gameState || gameState.status !== 'playing') return;

    const guess = guessInput.value.trim();
    if (!isValidGuess(guess, currentSettings.length, currentSettings.base)) return;

    const nextState = makeMove(gameState, guess);
    if (nextState === gameState) {
      inputHint.textContent = `Already guessed "${guess.toUpperCase()}", try another!`;
      guessInput.select();
      return;
    }

    gameState = nextState;
    guessInput.value = '';
    submitGuessBtn.disabled = true;
    inputHint.textContent = `Enter ${currentSettings.length} unique digits.`;
    attemptsText.textContent = `Attempts: ${gameState.history.length}`;
    renderHistory();

    if (gameState.status === 'won') {
      handleWin();
    } else {
      guessInput.focus();
    }
  });

  startBtn.addEventListener('click', () => {
    const secret = generateSecret(currentSettings.length, currentSettings.base);
    gameState = createInitialState(currentSettings, secret);

    baseSelect.disabled = true;
    lengthSelect.disabled = true;
    startBtn.disabled = true;

    isCurrentCharValid = createDigitValidator(currentSettings.base);

    gameCard.style.display = 'block';
    guessInput.disabled = false;
    guessInput.maxLength = currentSettings.length;
    guessInput.value = '';
    guessInput.placeholder = '·'.repeat(currentSettings.length);
    inputHint.textContent = `Enter ${currentSettings.length} unique digits.`;
    winBanner.style.display = 'none';
    newGameBtn.style.display = 'inline-flex';
    clearElement(historyList);
    attemptsText.textContent = 'Attempts: 0';

    startTimer();
    guessInput.focus();
  });

  newGameBtn.addEventListener('click', () => {
    stopTimer();
    gameState = null;

    baseSelect.disabled = false;
    baseSelect.removeAttribute('disabled');

    lengthSelect.disabled = false;
    lengthSelect.removeAttribute('disabled');

    startBtn.disabled = false;
    startBtn.removeAttribute('disabled');

    gameCard.style.display = 'none';
    newGameBtn.style.display = 'none';
    winBanner.style.display = 'none';

    guessInput.value = '';
    clearElement(historyList);

    startBtn.focus();
  });

  updateLengthOptions();
  updatePermutationsText();
  renderLeaderboard();

  container.append(header, settingsCard, gameCard, leaderboardCard);
  root.appendChild(container);
};
