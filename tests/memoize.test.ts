import { describe, it, expect, vi } from 'vitest';
import { memoize } from '../src/core/memoize.js';

describe('memoize', () => {
  it('should return the correct result of the wrapped function', () => {
    const sum = (a: number, b: number): number => a + b;
    const memoizedSum = memoize(sum);

    expect(memoizedSum(2, 3)).toBe(5);
    expect(memoizedSum(10, 20)).toBe(30);
  });

  it('should cache results and call the underlying function only once for identical arguments', () => {
    const mockFn = vi.fn((x: number) => x * 2);
    const memoized = memoize(mockFn);

    expect(memoized(4)).toBe(8);
    expect(memoized(4)).toBe(8);
    expect(memoized(4)).toBe(8);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should compute again for different arguments', () => {
    const mockFn = vi.fn((x: number) => x * 2);
    const memoized = memoize(mockFn);

    expect(memoized(4)).toBe(8);
    expect(memoized(5)).toBe(10);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should support a custom keyResolver if provided', () => {
    const mockFn = vi.fn((obj: { id: number; name: string }) => obj.id * 10);
    const customResolver = (obj: { id: number; name: string }): string => String(obj.id);
    const memoized = memoize(mockFn, customResolver);

    expect(memoized({ id: 1, name: 'first' })).toBe(10);
    expect(memoized({ id: 1, name: 'second' })).toBe(10);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
