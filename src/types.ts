export type countryResponse = {
  cioc: string;
  name: string;
  flags: {
    png: string;
    // svg: string;
  };
  region: string;
  capital: string;
  languages: languagesResponse[];
  population: number;
  area: number;
  borders: string[];
  currencies: currenciesResponse[];
};

export type Country = {
  cioc: string;
  name: string;
  flags: string;
  region: string;
  capital: string;
  languages: string[];
  population: number;
  area: number;
  borders: string[];
  currencies: string[];
};

export type CachedRecord = {
  query: string;
  countries: Country[];
};

type languagesResponse = {
  name: string;
};

type currenciesResponse = {
  code: string;
  name: string;
  symbol: string;
};
