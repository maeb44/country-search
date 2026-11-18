import type { Country } from '../types';

export function createCountryCard(
  country: Country,
  modal: (country: Country) => HTMLDivElement,
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'country-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.onclick = () => document.body.append(modal(country));

  const flag = document.createElement('img');
  flag.className = 'country-card__flag';
  flag.src = country.flags;
  flag.alt = `Флаг ${country.name}`;
  flag.loading = 'lazy';

  const body = document.createElement('div');
  body.className = 'country-card__body';

  const title = document.createElement('h3');
  title.className = 'country-card__title';
  title.textContent = country.name;

  const capital = document.createElement('p');
  capital.className = 'country-card__row';
  capital.textContent = `Столица: ${country.capital || '—'}`;

  const region = document.createElement('p');
  region.className = 'country-card__row';
  region.textContent = `Регион: ${country.region}`;

  const population = document.createElement('p');
  population.className = 'country-card__row';
  population.textContent = `Население: ${country.population.toLocaleString('ru-RU')}`;

  body.append(title, capital, region, population);
  card.append(flag, body);

  return card;
}
