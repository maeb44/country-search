export function createRetryButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'retry-button';
  button.textContent = 'Повторить';
  return button;
}

export function createErrorState(message: string): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'error-state';
  wrapper.setAttribute('role', 'alert');

  const text = document.createElement('p');
  text.className = 'error-state__text';
  text.textContent = message;

  const retry = createRetryButton();
  wrapper.append(text, retry);
  return wrapper;
}
