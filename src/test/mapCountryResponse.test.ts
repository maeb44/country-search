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
  },
  {
    name: 'Belarus',
    flags: { png: 'https://flagcdn.com/w320/by.png' },
    region: 'Europe',
    capital: 'Minsk',
    languages: [{ name: 'Belarusian' }, { name: 'Russian' }],
    population: 9398861,
    cioc: 'BLR',
  },
  {
    name: 'Antarctica',
    flags: { png: 'https://flagcdn.com/w320/aq.png' },
    region: 'Antarctic',
    capital: '',
    languages: [],
    population: 1000,
    cioc: '',
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
      },
      {
        cioc: 'BLR',
        name: 'Belarus',
        flags: 'https://flagcdn.com/w320/by.png',
        region: 'Europe',
        capital: 'Minsk',
        languages: ['Belarusian', 'Russian'],
        population: 9398861,
      },
      {
        cioc: '',
        name: 'Antarctica',
        flags: 'https://flagcdn.com/w320/aq.png',
        region: 'Antarctic',
        capital: '',
        languages: [],
        population: 1000,
      },
    ];
    const result = mapCountryResponse(mockCountries);
    expect(result).toEqual(expectedCountries);
  });
});
