/**
 * Опции для безопасного создания DOM-элементов
 */
export interface ElementOptions {
  className?: string;
  textContent?: string;
  attrs?: Record<string, string | number | boolean>;
  children?: readonly (HTMLElement | Text)[];
}

/**
 * Безопасно создаёт элемент DOM без использования innerHTML.
 *
 * @param tag - HTML-тег
 * @param options - параметры элемента
 * @returns созданный HTMLElement
 */
export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.textContent !== undefined) {
    element.textContent = options.textContent;
  }

  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      if (typeof value === 'boolean') {
        if (value) {
          element.setAttribute(key, '');
        }
      } else {
        element.setAttribute(key, String(value));
      }
    }
  }

  if (options.children) {
    for (const child of options.children) {
      element.appendChild(child);
    }
  }

  return element;
};

/**
 * Безопасно очищает все дочерние узлы элемента.
 *
 * @param element - родительский элемент
 */
export const clearElement = (element: HTMLElement): void => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

/**
 * Форматирует продолжительность в миллисекундах в читаемую строку MM:SS или SS.s.
 *
 * @param ms - миллисекунды
 * @returns отформатированная строка
 */
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  }
  return `${seconds}.${tenths}s`;
};
