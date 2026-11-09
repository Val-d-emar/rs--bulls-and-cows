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
