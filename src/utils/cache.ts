import type { Country, CachedRecord } from '../types';

const cache = new Map<string, Country[]>();
const raw = localStorage.getItem('countries');
export const cacheStorage: CachedRecord[] = raw ? JSON.parse(raw) : [];

export const getCached = (query: string) => {
  const key = query.trim().toLocaleLowerCase();
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  const countryFromStorage = cacheStorage.find((e) => e.query === key)?.countries;
  if (countryFromStorage) {
    return countryFromStorage;
  }

  return null;
};

export const setCached = (query: string, countries: Country[]) => {
  setToStorage(query, countries);
  const key = query.trim().toLocaleLowerCase();
  cache.set(key, countries);
};

const setToStorage = (query: string, countries: Country[]) => {
  const key = query.trim().toLocaleLowerCase();
  if (cacheStorage.length >= 5) {
    cacheStorage.shift();
  }
  cacheStorage.push({ query: key, countries });
  localStorage.setItem('countries', JSON.stringify(cacheStorage));
};
