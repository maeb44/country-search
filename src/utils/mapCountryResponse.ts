import type { Country, countryResponse } from '../types';

function isCountryResponse(x: unknown): x is countryResponse[] {
  if (!Array.isArray(x)) return false;
  if (x.length === 0) return false;

  for (const el of x) {
    if (typeof el !== 'object' || el === null) return false;
    if (typeof el.name !== 'string') return false;
  }
  return true;
}

export function mapCountryResponse(raw: unknown): Country[] {
  if (!isCountryResponse(raw)) {
    console.log(1);
    return [];
  }
  return raw.map((e) => {
    const languages = e.languages.map((lang) => lang.name);
    const currencies = e.currencies.map((c) => `${c.name} (${c.symbol})`);

    return {
      cioc: e.cioc,
      capital: e.capital,
      name: e.name,
      flags: e.flags.png,
      region: e.region,
      languages,
      population: e.population,
      area: e.area,
      borders: e.borders,
      currencies,
    };
  });
}
