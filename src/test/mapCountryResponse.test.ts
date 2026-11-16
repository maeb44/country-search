import { mapCountryResponse } from '../utils/mapCountryResponse';
import type { Country, countryResponse } from '../types';

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
const uncorrectMock = [
  {
    name: 'Antarctica',
    flags: { png: 'https://flagcdn.com/w320/aq.png' },
    region: 1,
    languages: '',
    population: 1000,
    cioc: '',
  },
];

describe('mapCountryResponse', () => {
  test('mapCountryResponse возвращает массив', () => {
    const result = mapCountryResponse(mockCountries);
    expect(Array.isArray(result)).toBe(true);
  });
  const unvalidInput = [null, 2, false, uncorrectMock, [], [null]];
  test.each(unvalidInput)(
    'mapCountryResponse возвращает undefined при неправильных входных данных',
    (unvalid) => {
      const result = mapCountryResponse(unvalid);
      expect(result).toEqual([]);
    },
  );
  test('mapCountryResponse возвращает преобразованные данные', () => {
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
    const result = mapCountryResponse(mockCountries);
    expect(result).toEqual(expectedCountries);
  });
});
