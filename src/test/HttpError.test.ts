import { HttpError } from '../utils/HttpError';

describe('HttpError', () => {
  test('HttpError является частью ошибка', () => {
    const error = new HttpError('HttpError', 450);
    expect(error).toBeInstanceOf(Error);
  });
  test('HttpError хранит статус ошибки', () => {
    const error = new HttpError('HttpError', 450);
    expect(error.status).toBe(450);
  });
  test('HttpError выводит правильное сообщение', () => {
    const error = new HttpError('Суперошибка', 450);
    expect(error.message).toBe('Суперошибка');
  });
  test('HttpError имеет имя HttpError', () => {
    const error = new HttpError('Суперошибка', 450);
    expect(error.name).toBe('HttpError');
  });
});
