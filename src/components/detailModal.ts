import type { Country } from '../types';

function buildDescription(country: Country): string {
  const parts: string[] = [];

  parts.push(`${country.name} — страна в регионе ${country.region}.`);

  if (country.capital) {
    parts.push(`Столица — ${country.capital}.`);
  }

  parts.push(`Население — ${country.population.toLocaleString('ru-RU')} человек.`);

  parts.push(`Площадь — ${country.area.toLocaleString('ru-RU')} км².`);

  if (country.borders.length > 0) {
    parts.push(`Граничит с: ${country.borders.join(', ')}.`);
  } else {
    parts.push('Не имеет сухопутных границ.');
  }

  return parts.join(' ');
}

export function createDetailModal(country: Country): HTMLDivElement {
  document.body.classList.add('modal-open');
  const overlay = document.createElement('div');
  overlay.className = 'detail-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'detail-modal-title');

  const close = () => {
    overlay.remove();
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEscape);
  };
  const onEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  overlay.onclick = (e) => {
    if (e.target === overlay) close();
  };
  document.addEventListener('keydown', onEscape);

  const modal = document.createElement('div');
  modal.className = 'detail-modal';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'detail-modal__close';
  closeBtn.setAttribute('aria-label', 'Закрыть');
  closeBtn.textContent = '×';

  closeBtn.onclick = () => close();

  const header = document.createElement('div');
  header.className = 'detail-modal__header';

  const flag = document.createElement('img');
  flag.className = 'detail-modal__flag';
  flag.src = country.flags;
  flag.alt = `Флаг ${country.name}`;

  const title = document.createElement('h2');
  title.className = 'detail-modal__title';
  title.id = 'detail-modal-title';
  title.textContent = country.name;

  header.append(flag, title);

  const description = document.createElement('p');
  description.className = 'detail-modal__description';
  description.textContent = buildDescription(country);

  const details = document.createElement('dl');
  details.className = 'detail-modal__details';

  const rows: Array<[string, string]> = [
    ['Площадь', `${country.area.toLocaleString('ru-RU')} км²`],
    [
      'Границы',
      country.borders.length > 0 ? country.borders.join(', ') : 'Не имеет сухопутных границ',
    ],
    ['Языки', country.languages.length > 0 ? country.languages.join(', ') : '—'],
    ['Валюта', country.currencies.length > 0 ? country.currencies.join(', ') : '—'],
    ['Население', country.population.toLocaleString('ru-RU')],
    ['Регион', country.region],
    ['Столица', country.capital || '—'],
  ];

  for (const [label, value] of rows) {
    const row = document.createElement('div');
    row.className = 'detail-modal__row';

    const dt = document.createElement('dt');
    dt.className = 'detail-modal__label';
    dt.textContent = label;

    const dd = document.createElement('dd');
    dd.className = 'detail-modal__value';
    dd.textContent = value;

    row.append(dt, dd);
    details.appendChild(row);
  }

  modal.append(closeBtn, header, description, details);
  overlay.appendChild(modal);

  return overlay;
}
