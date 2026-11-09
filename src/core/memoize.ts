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
  _fn: (...args: Args) => Result,
  _keyResolver?: (...args: Args) => string,
): ((...args: Args) => Result) => {
  return (..._args: Args): Result => {
    return undefined as unknown as Result;
  };
};
