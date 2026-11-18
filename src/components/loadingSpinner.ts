export function createLoadingSpinner(): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'loading-spinner';
  wrapper.setAttribute('role', 'status');
  wrapper.setAttribute('aria-label', 'Загрузка');

  const circle = document.createElement('div');
  circle.className = 'loading-spinner__circle';

  wrapper.appendChild(circle);
  return wrapper;
}
