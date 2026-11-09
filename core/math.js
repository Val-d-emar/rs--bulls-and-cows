import { memoize } from './memoize.js';
/**
 * Вспомогательная рекурсивная функция для подсчёта перестановок без повторений:
 * P(base, length) = base! / (base - length)!
 *
 * @param length - длина секрета
 * @param base - основание системы счисления
 * @returns число перестановок
 */
const calculatePossibleSecrets = (length, base) => {
    if (length < 0 || length > base) {
        return 0;
    }
    if (length === 0) {
        return 1;
    }
    return base * countPossibleSecrets(length - 1, (base - 1));
};
/**
 * Подсчитывает количество уникальных секретных комбинаций заданной длины
 * в заданной системе счисления.
 *
 * @param _length - длина секрета
 * @param _base - основание системы счисления (2, 8, 10, 16)
 * @returns количество возможных комбинаций
 */
export const countPossibleSecrets = memoize((length, base) => calculatePossibleSecrets(length, base), (length, base) => `${length}:${base}`);
//# sourceMappingURL=math.js.map