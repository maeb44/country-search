import type { Country, countryResponse } from '../types';
import { HttpError } from './HttpError';
import { mapCountryResponse } from './mapCountryResponse';

export async function searchCountries(query: string, signal: AbortSignal) {}
