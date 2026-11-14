export type countryResponse = {
  cioc: string;
  name: string;
  flags: {
    png: string;
    // svg: string; возможно использование вместо png
  };
  region: string;
  capital: string;
  languages: languagesResponse[];
  population: number;
};

export type Country = {
  cioc: string;
  name: string;
  flags: string;
  region: string;
  capital: string;
  languages: string[];
  population: number;
};

type languagesResponse = {
  name: string;
};
