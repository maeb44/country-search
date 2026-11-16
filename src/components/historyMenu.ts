import type { CachedRecord } from '../types';

export function createHistoryMenu(): HTMLDivElement {
  const menu = document.createElement('div');
  menu.className = 'history-menu';
  menu.hidden = true;
  return menu;
}

export function renderHistoryMenu(
  input: HTMLInputElement,
  menu: HTMLDivElement,
  records: CachedRecord[],
  onSelect: (record: CachedRecord) => void,
): void {
  menu.replaceChildren();

  if (records.length === 0) {
    menu.hidden = true;
    return;
  }

  const query = input.value.trim().toLocaleLowerCase();

  for (const record of records) {
    if (record.query.startsWith(query)) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'history-menu__item';
      item.textContent = record.query;
      item.onclick = () => {
        menu.hidden = true;
        onSelect(record);
      };
      menu.appendChild(item);
    }
  }

  menu.hidden = false;
}
