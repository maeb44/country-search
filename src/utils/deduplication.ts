import type { Country } from '../types';
import { searchCountries } from './searchCountries';

const inFlight = new Map<string, Promise<Country[]>>();

export async function searchCountriesDedup(query: string, signal: AbortSignal): Promise<Country[]> {
  const key = query.trim().toLocaleLowerCase();
  if (inFlight.has(key)) {
    return inFlight.get(key)!;
  }
  const promise = searchCountries(query, signal).finally(() => {
    inFlight.delete(key);
  });
  inFlight.set(key, promise);
  return promise;
}
