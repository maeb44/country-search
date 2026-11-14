import type { countryResponse } from '../types';

function isCountryResponse(x: unknown): x is countryResponse[] {
  if (!Array.isArray(x)) return false;
  if (x.length === 0) return false;
  for (const el of x) {
    if (el === null || typeof el !== 'object') return false;
    const obj = el as Record<string, unknown>;
    if (typeof obj.name !== 'string') return false;
    if (typeof obj.population !== 'number') return false;
    if (typeof obj.cioc !== 'string') return false;
    if (!Array.isArray(obj.languages)) return false;
    for (const lang of obj.languages) {
      if (lang === null || typeof lang !== 'object') return false;
      if (Array.isArray(lang)) return false;
      const langObj = lang as Record<string, unknown>;
      if (typeof langObj.name !== 'string') return false;
    }

    if (typeof obj.region !== 'string') return false;
    if (typeof obj.capital !== 'string') return false;

    if (obj.flags === null || typeof obj.flags !== 'object') return false;
    if (Array.isArray(obj.flags)) return false;
    const flags = obj.flags as Record<string, unknown>;
    if (typeof flags.png !== 'string') return false;
  }
  return true;
}

export function mapCountryResponse(raw: unknown) {
  if (!isCountryResponse(raw)) return;

  const countryesData = raw.map((e) => {
    const languages = e.languages.map((e) => e.name);
    return {
      cioc: e.cioc,
      capital: e.capital,
      name: e.name,
      flags: e.flags.png,
      region: e.region,
      languages,
      population: e.population,
    };
  });

  return countryesData;
}
