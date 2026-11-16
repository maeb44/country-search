export function createSearchInput(): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'search-input';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search-input__field';
  input.placeholder = 'Введите название страны...';
  input.setAttribute('aria-label', 'Поиск страны');

  wrapper.appendChild(input);
  return wrapper;
}
