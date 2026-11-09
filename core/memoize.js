/**
 * Функция высшего порядка для мемоизации результатов чистых функций.
 *
 * @template Args - типы аргументов функции
 * @template Result - тип возвращаемого значения
 * @param fn - чистая функция, результат которой нужно кэшировать
 * @param keyResolver - опциональная функция для вычисления ключа кэша
 * @returns мемоизированная версия переданной функции
 */
export const memoize = (fn, keyResolver) => {
    const cache = new Map();
    return (...args) => {
        const key = keyResolver ? keyResolver(...args) : JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};
//# sourceMappingURL=memoize.js.map