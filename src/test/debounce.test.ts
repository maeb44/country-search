import { debounce } from '../utils/debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('debounce возвращает функцию', () => {
    const callback = (a: number, b: number) => a + b;
    const debounced = debounce(callback, 500);
    expect(typeof debounced).toBe('function');
  });

  test('debounce берёт только последние данные', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced(10, 20);
    debounced(20, 20);
    debounced(1, 1);
    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith(1, 1);
  });
  test('debounce сбрасывает таймер при повторном вызове', () => {
    const fn = vi.fn();

    const debounced = debounce(fn, 500);
    debounced();
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
    debounced();
    vi.advanceTimersByTime(499);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledOnce();
  });
  test('debounce после цикла срабатывает нормально', () => {
    const fn = vi.fn();

    const debounced = debounce(fn, 500);
    debounced();
    vi.advanceTimersByTime(500);
    debounced();
    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(2);
  });
  test('debounce откладывает вызов', () => {
    const fn = vi.fn();

    const debounced = debounce(fn, 500);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(600);
    expect(fn).toHaveBeenCalled();
  });
  test('debounce с delay = 0 откладывает вызов на следующий тик', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 0);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
