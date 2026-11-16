import type { Country, countryResponse } from '../types';
import { HttpError } from '../utils/HttpError';
import { searchCountries } from '../utils/searchCountries';

const CreateMockResponse = (options: {
  ok: boolean;
  status: number;
  json?: () => Promise<unknown>;
}): Response => {
  return {
    ok: options.ok,
    status: options.status,
    json: options.json ?? (() => Promise.resolve([])),
  } as Response;
};
const fetchWithAbort = (_: string, init: RequestInit) => {
  return new Promise<Response>((_, reject) => {
    const signal = init.signal;
    if (!signal) {
      reject(new Error('signal is required for fetchWithAbort'));
      return;
    }
    const rejectWithReason = () => {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    };
    if (signal.aborted) {
      rejectWithReason();
      return;
    }
    signal.addEventListener('abort', rejectWithReason, { once: true });
  });
};
const expectedCountries: Country[] = [
  {
    cioc: 'RUS',
    name: 'Russian Federation',
    flags: 'https://flagcdn.com/w320/ru.png',
    region: 'Europe',
    capital: 'Moscow',
    languages: ['Russian'],
    population: 144104080,
    area: 17124442,
    borders: [
      'AZE',
      'BLR',
      'CHN',
      'EST',
      'FIN',
      'GEO',
      'KAZ',
      'PRK',
      'LVA',
      'LTU',
      'MNG',
      'NOR',
      'POL',
      'UKR',
    ],
    currencies: ['Russian ruble (₽)'],
  },
  {
    cioc: 'BLR',
    name: 'Belarus',
    flags: 'https://flagcdn.com/w320/by.png',
    region: 'Europe',
    capital: 'Minsk',
    languages: ['Belarusian', 'Russian'],
    population: 9398861,
    area: 207600,
    borders: ['LVA', 'LTU', 'POL', 'RUS', 'UKR'],
    currencies: ['Belarusian ruble (Br)'],
  },
  {
    cioc: '',
    name: 'Antarctica',
    flags: 'https://flagcdn.com/w320/aq.png',
    region: 'Antarctic',
    capital: '',
    languages: [],
    population: 1000,
    area: 14000000,
    borders: [],
    currencies: [],
  },
];

const mockCountries: countryResponse[] = [
  {
    name: 'Russian Federation',
    flags: { png: 'https://flagcdn.com/w320/ru.png' },
    region: 'Europe',
    capital: 'Moscow',
    languages: [{ name: 'Russian' }],
    population: 144104080,
    cioc: 'RUS',
    area: 17124442,
    borders: [
      'AZE',
      'BLR',
      'CHN',
      'EST',
      'FIN',
      'GEO',
      'KAZ',
      'PRK',
      'LVA',
      'LTU',
      'MNG',
      'NOR',
      'POL',
      'UKR',
    ],
    currencies: [{ code: 'RUB', name: 'Russian ruble', symbol: '₽' }],
  },
  {
    name: 'Belarus',
    flags: { png: 'https://flagcdn.com/w320/by.png' },
    region: 'Europe',
    capital: 'Minsk',
    languages: [{ name: 'Belarusian' }, { name: 'Russian' }],
    population: 9398861,
    cioc: 'BLR',
    area: 207600,
    borders: ['LVA', 'LTU', 'POL', 'RUS', 'UKR'],
    currencies: [{ code: 'BYN', name: 'Belarusian ruble', symbol: 'Br' }],
  },
  {
    name: 'Antarctica',
    flags: { png: 'https://flagcdn.com/w320/aq.png' },
    region: 'Antarctic',
    capital: '',
    languages: [],
    population: 1000,
    cioc: '',
    area: 14000000,
    borders: [],
    currencies: [],
  },
];

describe(`searchCountries`, () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('404 возвращает пустой массив', async () => {
    const controller = new AbortController();
    const mockFetch = CreateMockResponse({
      ok: false,
      status: 404,
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetch));
    const result = await searchCountries('', controller.signal);
    expect(result).toEqual([]);
  });
  test('500 вызывает HttpError', async () => {
    const controller = new AbortController();
    const mockFetch = CreateMockResponse({
      ok: false,
      status: 500,
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetch));
    await expect(searchCountries('ru', controller.signal)).rejects.toThrow(HttpError);
  });
  test('200 вернёт expectedCountries', async () => {
    const controller = new AbortController();
    const mockFetch = CreateMockResponse({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCountries),
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetch));
    const result = await searchCountries('ru', controller.signal);
    expect(result).toEqual(expectedCountries);
  });
  test('при отмене сигнала отменяет запрос и бросает ошибку', async () => {
    const controller = new AbortController();
    vi.stubGlobal('fetch', vi.fn(fetchWithAbort));
    const promise = searchCountries('ru', controller.signal);
    controller.abort();
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });
  test('запросе более 5000 мс бросает ошибку отмены сигнала', async () => {
    vi.useFakeTimers();
    vi.spyOn(AbortSignal, 'timeout').mockImplementation((ms) => {
      const c = new AbortController();
      setTimeout(() => c.abort(new DOMException('Timeout', 'TimeoutError')), ms);
      return c.signal;
    });
    vi.stubGlobal('fetch', vi.fn(fetchWithAbort));
    const controller = new AbortController();
    const promise = searchCountries('ru', controller.signal);
    vi.advanceTimersByTime(5001);
    await expect(promise).rejects.toMatchObject({ name: 'TimeoutError' });
  });
});
