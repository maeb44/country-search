import { createSearchInput } from './components/searchInput';
import { createLoadingSpinner } from './components/loadingSpinner';
import { createCountryCard } from './components/countryCard';
import { createEmptyState } from './components/emptyState';
import { createErrorState } from './components/retryButton';
import { createDetailModal } from './components/detailModal';
import { createHistoryMenu, renderHistoryMenu } from './components/historyMenu';
import { HttpError } from './utils/HttpError';
import { debounce } from './utils/debounce';
import type { Country } from './types';
import { getCached, setCached } from './utils/cache';
import { searchCountriesDedup } from './utils/deduplication';
import { cacheStorage } from './utils/cache';

export function renderApp(): void {
  const root = document.getElementById('app');
  if (!root) {
    throw new Error('Элемент #app не найден в index.html');
  }

  const searchInput = createSearchInput();
  const input = searchInput.querySelector('input');
  if (input === null) return;

  const loading = createLoadingSpinner();
  loading.hidden = true;

  const results = document.createElement('div');
  results.className = 'results';
  results.hidden = true;

  const empty = createEmptyState();
  empty.hidden = true;

  const error = createErrorState('Не удалось загрузить данные');
  error.hidden = true;
  root.append(searchInput, results, loading, empty, error);

  let prevController: AbortController | null = null;
  let lastQuery = '';

  const historyMenu = createHistoryMenu();
  searchInput.appendChild(historyMenu);

  const showLoading = () => {
    loading.hidden = false;
    results.hidden = true;
    empty.hidden = true;
    error.hidden = true;
  };

  const showResults = () => {
    loading.hidden = true;
    results.hidden = false;
    empty.hidden = true;
    error.hidden = true;
  };

  const showEmpty = () => {
    loading.hidden = true;
    results.hidden = true;
    empty.hidden = false;
    error.hidden = true;
  };

  const showError = (message: string) => {
    loading.hidden = true;
    results.hidden = true;
    empty.hidden = true;
    error.hidden = false;
    historyMenu.hidden = true;
    const text = error.querySelector('.error-state__text');
    if (text) text.textContent = message;
  };

  const runSearch = async (query: string, signal: AbortSignal) => {
    try {
      const data: Country[] | null = getCached(query);
      const countries: Country[] = data ?? (await searchCountriesDedup(query, signal));
      if (!data) {
        setCached(query, countries);
      }
      if (signal.aborted) return;
      results.replaceChildren(...countries.map((c) => createCountryCard(c, createDetailModal)));
      if (countries.length === 0) {
        showEmpty();
      } else {
        showResults();
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        if (signal === prevController?.signal) {
          loading.hidden = true;
        }
        return;
      }
      if (err instanceof Error && err.name === 'TimeoutError') {
        showError('Превышено время ожидания. Попробуйте ещё раз.');
        return;
      }
      if (err instanceof HttpError) {
        showError(`Ошибка сервера: ${err.status}. Попробуйте ещё раз.`);
        return;
      }
      showError('Не удалось загрузить данные. Попробуйте ещё раз.');
    }
  };

  const renderHistory = () =>
    renderHistoryMenu(input, historyMenu, cacheStorage, (record) => {
      input.value = record.query;
      results.replaceChildren(
        ...record.countries.map((c) => createCountryCard(c, createDetailModal)),
      );
      if (record.countries.length === 0) showEmpty();
      else showResults();
      lastQuery = record.query;
    });

  input.addEventListener('focus', () => {
    renderHistory();
  });
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target as Node)) {
      historyMenu.hidden = true;
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' || e.key == 'Escape') {
      historyMenu.hidden = true;
      input.blur();
    }
  });

  const debounced = debounce((query: string, signal: AbortSignal): void => {
    runSearch(query, signal);
  }, 500);

  input.addEventListener('input', () => {
    showLoading();
    renderHistory();
    const query = input.value.trim();
    lastQuery = query;
    prevController?.abort();
    prevController = new AbortController();
    const signal = prevController.signal;
    if (query === '') {
      results.replaceChildren();
      loading.hidden = true;
      empty.hidden = true;
      error.hidden = true;
      return;
    }
    debounced(query, signal);
  });

  const retryBtn = error.querySelector('.retry-button');
  retryBtn?.addEventListener('click', (): void => {
    if (!lastQuery) return;
    showLoading();
    prevController?.abort();
    prevController = new AbortController();
    runSearch(lastQuery, prevController.signal);
  });
}
