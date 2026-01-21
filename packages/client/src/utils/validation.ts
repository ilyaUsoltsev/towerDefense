/**
 * Утилиты для валидации форм
 */

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

/**
 * Проверяет валидность email адреса
 * @param email Email для проверки
 * @returns true, если email валиден
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Проверяет валидность номера телефона
 * @param phone Номер телефона для проверки
 * @returns true, если номер валиден
 */
export const isValidPhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};

/**
 * Проверяет минимальную длину строки
 * @param value Значение для проверки
 * @param minLength Минимальная длина
 * @returns true, если длина достаточная
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Проверяет, что значение не пустое
 * @param value Значение для проверки
 * @returns true, если значение не пустое
 */
export const isNotEmpty = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value != null;
};

/**
 * Константы для сообщений об ошибках
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Поле обязательно для заполнения',
  INVALID_EMAIL: 'Некорректный email',
  INVALID_PHONE: 'Некорректный номер телефона',
  MIN_LENGTH: (length: number) => `Минимальная длина ${length} символов`,
  PASSWORD_MIN_LENGTH: 'Пароль должен быть не менее 8 символов',
  PASSWORDS_NOT_MATCH: 'Пароли не совпадают',
} as const;
