export function createEmptyState(): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'empty-state';
  wrapper.setAttribute('role', 'status');

  const icon = document.createElement('div');
  icon.className = 'empty-state__icon';
  icon.textContent = '🔍';

  const title = document.createElement('h2');
  title.className = 'empty-state__title';
  title.textContent = 'Ничего не найдено';

  const text = document.createElement('p');
  text.className = 'empty-state__text';
  text.textContent = 'Попробуйте изменить запрос — возможно, страна называется иначе.';

  wrapper.append(icon, title, text);
  return wrapper;
}
