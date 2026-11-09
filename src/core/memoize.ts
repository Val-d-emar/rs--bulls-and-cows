/**
 * Функция высшего порядка для мемоизации результатов чистых функций.
 *
 * @template Args - типы аргументов функции
 * @template Result - тип возвращаемого значения
 * @param fn - чистая функция, результат которой нужно кэшировать
 * @param keyResolver - опциональная функция для вычисления ключа кэша
 * @returns мемоизированная версия переданной функции
 */
export const memoize = <Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  keyResolver?: (...args: Args) => string,
): ((...args: Args) => Result) => {
  const cache = new Map<string, Result>();

  return (...args: Args): Result => {
    const key = keyResolver ? keyResolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key) as Result;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
