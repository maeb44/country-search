// @vitest-environment jsdom
import { renderApp } from '../app';

function mockResponse(data: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  } as Response;
}

describe('renderApp — гонка', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  test('устаревший ответ не перезаписывает результат последнего запроса', async () => {
    let resolveA!: (r: Response) => void;
    let resolveB!: (r: Response) => void;
    let callCount = 0;

    const fetchMock = vi.fn((_: string, init: RequestInit) => {
      const signal = init.signal!;
      return new Promise<Response>((resolve, reject) => {
        const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
        if (signal.aborted) {
          onAbort();
          return;
        }
        signal.addEventListener('abort', onAbort, { once: true });

        callCount += 1;
        if (callCount === 1) {
          resolveA = resolve;
        } else {
          resolveB = resolve;
        }
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    renderApp();
    const input = document.querySelector<HTMLInputElement>('.search-input__field')!;

    input.value = 'М';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(500);
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    input.value = 'Мо';
    input.dispatchEvent(new Event('input'));
    vi.advanceTimersByTime(500);
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    resolveB(
      mockResponse([
        {
          cioc: 'BLR',
          name: 'Belarus',
          flags: { png: 'b.png' },
          region: 'Europe',
          capital: 'Minsk',
          languages: [{ name: 'Belarusian' }],
          population: 9398861,
          area: 207600,
          borders: [],
          currencies: [{ code: 'BYN', name: 'Belarusian ruble', symbol: 'Br' }],
        },
      ]),
    );

    await vi.waitFor(() => {
      const results = document.querySelector('.results')!;
      expect(results.textContent).toContain('Belarus');
    });

    resolveA(
      mockResponse([
        {
          cioc: 'RUS',
          name: 'Russian Federation',
          flags: { png: 'r.png' },
          region: 'Europe',
          capital: 'Moscow',
          languages: [{ name: 'Russian' }],
          population: 144104080,
          area: 17124442,
          borders: [],
          currencies: [{ code: 'RUB', name: 'Russian ruble', symbol: '₽' }],
        },
      ]),
    );

    await vi.waitFor(() => {
      const results = document.querySelector('.results')!;
      expect(results.textContent).toContain('Belarus');
      expect(results.textContent).not.toContain('Russian Federation');
    });
  });
});
