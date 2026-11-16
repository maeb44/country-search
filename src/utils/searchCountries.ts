import type { Country, countryResponse } from '../types';
import { HttpError } from './HttpError';
import { mapCountryResponse } from './mapCountryResponse';

export async function searchCountries(query: string, signal: AbortSignal): Promise<Country[]> {
  try {
    const timeoutSignal = AbortSignal.timeout(5000);
    const combinedSignal = AbortSignal.any([timeoutSignal, signal]);

    const response = await fetch(`https://countries.dev/name/${query}`, {
      signal: combinedSignal,
    });
    if (response.status === 404) {
      console.log('Country not found');
      return [];
    }

    if (!response.ok) {
      throw new HttpError(`Ошибка Http: ${response.status}`, response.status);
    }
    const raw: countryResponse[] = await response.json();

    return mapCountryResponse(raw);
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }
    if (error.name === 'TimeoutError') {
      throw error;
    }
    if (error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof HttpError) {
      throw error;
    }
    throw error;
  }
}
