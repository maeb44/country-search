// any[] неизбежен: unknown[]/never[] ломают совместимость с обычными функциями
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends (...args: any[]) => void>(fn: F, delay: number = 0) {
  let prevTimeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>) => {
    if (prevTimeoutId !== null) clearTimeout(prevTimeoutId);
    prevTimeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
